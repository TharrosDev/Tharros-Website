"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { loadMotion, motionApi } from "@/lib/motion/registry";

declare global {
  interface Window {
    /** The dead-man timer armed by the head script. See globals.css. */
    __tharrosMotion?: number;
  }
}

/**
 * Boots the motion system and keeps its measurements honest. Renders nothing.
 *
 * ScrollTrigger caches the position of every trigger it owns, and three things
 * invalidate that cache invisibly — until a scene is suddenly forty pixels
 * out:
 *
 * 1. **Fonts.** `next/font` ships `display: swap`, so headline metrics change
 *    after first paint. A trigger measured against the fallback face is
 *    measured against the wrong height.
 * 2. **Route changes.** New document, new heights, same ScrollTrigger
 *    instances if the refresh is missed.
 * 3. **Scroll locks.** Every overlay locks the body scroll. `scrollbar-gutter:
 *    stable` stops that resizing the viewport; the refresh is the belt to that
 *    brace.
 *
 * It also disarms the dead-man switch: the head script arms a timer that
 * forces every entrance visible if this component never mounts. Clearing it
 * here is the proof that the bundle arrived.
 */
export default function MotionRuntime() {
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;

    // THE FAILSAFE IS ABOUT REACT, NOT ABOUT GSAP — and it was waiting on the
    // wrong one.
    //
    // What the dead-man switch protects is `.reveal`, which is deliberately
    // not a GSAP component: it is an IntersectionObserver and a class name, so
    // the only thing it needs in order to work is this bundle having run at
    // all. Clearing the timer from inside `loadMotion().then()` tied it
    // instead to 111 kB of animation library arriving — on routes that hold no
    // scene and never ask for it.
    //
    // On a 180 kbps connection that bundle does not land inside 3.5s, so the
    // timer fired on a page where nothing was wrong: `data-motion="off"` went
    // on the root and every entrance on the site was forced to its resting
    // state. Verified on /faq at Fast 3G — data-js="1", React mounted, all 14
    // reveals present, and the switch tripped anyway. The site was working;
    // the stopwatch was measuring the wrong bundle.
    //
    // This effect running IS the proof the switch is asking for.
    if (window.__tharrosMotion) {
      clearTimeout(window.__tharrosMotion);
      window.__tharrosMotion = undefined;
    }

    // Warming the bundle, not booting it. Scenes call `loadMotion` themselves
    // the moment they mount, so this exists only to have GSAP in hand before
    // `RouteCurtain` needs it on the first navigation away from a route that
    // animates nothing. That is not urgent work, so it yields to hydration
    // rather than competing with it — with a timeout, because a page that
    // never goes idle still has to be able to leave.
    const warm = () => {
      loadMotion()
        .then(() => {
          if (cancelled) return;
          // Fonts swap after first paint and change the heights every trigger
          // was measured against. A no-op unless a scene actually built
          // something, which is correct on the routes that did not.
          document.fonts?.ready.then(() => {
            if (!cancelled) motionApi()?.ScrollTrigger.refresh();
          });
        })
        .catch(() => {
          // The chunk failed rather than merely being slow. `.scene-oversize`
          // is a CSS pre-state a scene is supposed to animate away from, so
          // without this it stays over-scaled for good — the one part of the
          // old timer's job that was genuinely about GSAP.
          document.documentElement.dataset.motion = "off";
        });
    };

    const idle = typeof window.requestIdleCallback === "function";
    const handle = idle
      ? window.requestIdleCallback(warm, { timeout: 1000 })
      : window.setTimeout(warm, 200);

    return () => {
      cancelled = true;
      if (idle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, []);

  useEffect(() => {
    // One frame past the navigation, so the new tree has been laid out before
    // anything is measured against it. A no-op until GSAP has arrived, which
    // is correct — before that there is nothing measured to refresh.
    const frame = requestAnimationFrame(() => {
      motionApi()?.ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
