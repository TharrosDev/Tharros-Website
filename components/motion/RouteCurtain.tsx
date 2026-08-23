"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { loadMotion, type MotionApi } from "@/lib/motion/registry";
import { prefersReducedMotion } from "@/lib/motion/media";
import { DUR, EASE } from "@/lib/motion/config";

/**
 * THE CUT — an ink plane that lifts off each new route.
 *
 * WHY IT UNCOVERS RATHER THAN COVERS. The App Router tells a client component
 * about a navigation only once the new route has rendered; there is no hook
 * that fires while the old one is still on screen and lets it be held. So a
 * cover-then-navigate transition means intercepting every `Link` click, which
 * costs streaming, browser back/forward, and scroll restoration — three things
 * that work correctly today.
 *
 * Uncovering needs none of that. The plane is placed over the new route on the
 * frame it arrives and then lifts, so the navigation reads as a cut to a scene
 * that is already struck rather than as a page being fetched. It is the one
 * transition shape that is honest about what the router actually knows.
 *
 * NOT ON FIRST PAINT. A curtain over the first render is a loading screen for
 * content that has already arrived, and it would sit directly on the LCP. The
 * ref latch skips the initial mount; the opening sequence is a separate thing.
 *
 * The plane is `aria-hidden` and `pointer-events-none` throughout — it is
 * never in the tab order, and it cannot swallow a click on the page beneath it
 * even mid-lift. Under reduced motion it is never mounted at all: a full-bleed
 * panel sweeping the screen is exactly the gesture that setting exists to
 * refuse.
 */
export default function RouteCurtain() {
  const pathname = usePathname();
  const panel = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  // The lift in flight, if any. A navigation that lands mid-lift used to leave
  // two timelines writing `scaleY` on the same plane, and the older one's
  // closing `.set(opacity: 0)` fired part-way through the newer one's travel —
  // so a quick second click blanked the curtain rather than replaying it.
  const lift = useRef<ReturnType<MotionApi["gsap"]["timeline"]> | null>(null);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const node = panel.current;
    if (!node || prefersReducedMotion()) return;

    let cancelled = false;

    loadMotion().then(({ gsap }) => {
      if (cancelled || !panel.current) return;

      lift.current = gsap
        .timeline()
        // Struck over the new route, anchored to the top edge.
        .set(node, { scaleY: 1, transformOrigin: "top", opacity: 1 })
        // Then lifted from the bottom, so the page is revealed downward —
        // the same direction the frame wipe uncovers a photograph.
        .to(node, {
          scaleY: 0,
          transformOrigin: "bottom",
          duration: DUR.reveal,
          ease: EASE.inOut,
        })
        .set(node, { opacity: 0 });
    });

    return () => {
      cancelled = true;
      // A navigation landing mid-lift, or the layout going away, takes the
      // timeline with it rather than leaving it writing to the plane.
      lift.current?.kill();
      lift.current = null;
    };
  }, [pathname]);

  return (
    <div
      ref={panel}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[var(--z-curtain)] origin-top bg-[var(--black)] opacity-0"
      style={{ transform: "scaleY(0)" }}
    />
  );
}
