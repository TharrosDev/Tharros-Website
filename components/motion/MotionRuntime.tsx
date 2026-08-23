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

    loadMotion().then(({ ScrollTrigger }) => {
      if (cancelled) return;

      // The bundle is alive. Stand the failsafe down.
      if (window.__tharrosMotion) {
        clearTimeout(window.__tharrosMotion);
        window.__tharrosMotion = undefined;
      }

      document.fonts?.ready.then(() => {
        if (!cancelled) ScrollTrigger.refresh();
      });
    });

    return () => {
      cancelled = true;
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
