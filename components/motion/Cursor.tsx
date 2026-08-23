"use client";

import { useEffect, useRef } from "react";
import { loadMotion } from "@/lib/motion/registry";
import { hasFinePointer, prefersReducedMotion } from "@/lib/motion/media";
import { DUR, EASE } from "@/lib/motion/config";

/**
 * THE POINTER — a dot that tracks exactly, and a ring that lags behind it.
 *
 * The lag is the whole gesture. A ring that keeps up with the dot is a
 * redrawn cursor; a ring that arrives a beat late reads as weight, and weight
 * is what makes a pointer feel like an instrument rather than a graphic.
 *
 * THE NATIVE CURSOR IS ONLY HIDDEN ONCE THIS ONE IS PROVEN ALIVE. `cursor:
 * none` in static CSS is a site with no pointer at all whenever the bundle
 * fails — which is the single worst failure mode available to this feature.
 * So the attribute that hides it is written here, after GSAP has loaded and
 * after the first real pointer movement, and it is removed again on unmount.
 *
 * MODES ARE DELEGATED. One listener on the document reads the nearest
 * `[data-cursor-mode]` ancestor of whatever the pointer is over. Call sites
 * add a plain attribute and stay server components; nothing subscribes, and
 * there is no state to cascade.
 *
 * Never mounted on a coarse pointer or under reduced motion. A cursor that
 * follows a finger is a cursor nobody asked for.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!hasFinePointer() || prefersReducedMotion()) return;

    let cancelled = false;
    let teardown: (() => void) | undefined;

    loadMotion().then(({ gsap }) => {
      const dotNode = dot.current;
      const ringNode = ring.current;
      const labelNode = label.current;
      if (cancelled || !dotNode || !ringNode || !labelNode) return;

      const root = document.documentElement;

      // Two speeds. The dot is effectively instant; the ring trails it.
      const dotX = gsap.quickTo(dotNode, "x", { duration: 0.08, ease: "none" });
      const dotY = gsap.quickTo(dotNode, "y", { duration: 0.08, ease: "none" });
      const ringX = gsap.quickTo(ringNode, "x", { duration: DUR.slow, ease: EASE.out });
      const ringY = gsap.quickTo(ringNode, "y", { duration: DUR.slow, ease: EASE.out });

      let armed = false;

      const onMove = (event: PointerEvent) => {
        // A real pointer has moved and GSAP is here: it is now safe to take
        // the native cursor away.
        if (!armed) {
          armed = true;
          root.dataset.cursor = "1";
          gsap.to([dotNode, ringNode], { autoAlpha: 1, duration: DUR.fast });
        }
        dotX(event.clientX);
        dotY(event.clientY);
        ringX(event.clientX);
        ringY(event.clientY);
      };

      const onOver = (event: PointerEvent) => {
        const target = event.target as Element | null;
        const holder = target?.closest?.("[data-cursor-mode]") as HTMLElement | null;
        const mode = holder?.dataset.cursorMode ?? "";
        const text = holder?.dataset.cursorLabel ?? "";

        // `pointerover` fires on every element boundary the pointer crosses, so
        // moving across a paragraph of links fired this dozens of times a
        // second — each one writing the same attributes and starting another
        // 320ms scale tween on top of the last. Only a real change is a change.
        // Both halves are compared: two `frame` holders can carry different
        // labels ("View" on a card, nothing on a campaign frame), so keying on
        // the mode alone would strand the previous word inside the ring.
        if (ringNode.dataset.mode === mode && labelNode.textContent === text) {
          return;
        }

        ringNode.dataset.mode = mode;
        labelNode.textContent = text;

        gsap.to(ringNode, {
          scale: mode === "frame" || mode === "zoom" ? 2.4 : mode === "link" ? 0.55 : 1,
          duration: DUR.base,
          ease: EASE.out,
        });
      };

      // The pointer leaving the window should take the cursor with it, or a
      // stale dot sits frozen at the edge of the page.
      const onLeave = () => gsap.to([dotNode, ringNode], { autoAlpha: 0, duration: DUR.fast });
      const onEnter = () => gsap.to([dotNode, ringNode], { autoAlpha: 1, duration: DUR.fast });

      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerover", onOver, { passive: true });
      document.addEventListener("pointerleave", onLeave);
      document.addEventListener("pointerenter", onEnter);

      teardown = () => {
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerover", onOver);
        document.removeEventListener("pointerleave", onLeave);
        document.removeEventListener("pointerenter", onEnter);
        delete root.dataset.cursor;
      };
    });

    return () => {
      cancelled = true;
      teardown?.();
      delete document.documentElement.dataset.cursor;
    };
  }, []);

  return (
    <div aria-hidden="true" className="cursor-root">
      <div ref={ring} className="cursor-ring">
        <span ref={label} className="cursor-label type-meta" />
      </div>
      <div ref={dot} className="cursor-dot" />
    </div>
  );
}
