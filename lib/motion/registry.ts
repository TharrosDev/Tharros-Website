"use client";

import type { gsap as GsapType } from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";
import type { Flip as FlipType } from "gsap/Flip";
import type { SplitText as SplitTextType } from "gsap/SplitText";
import { DUR, EASE } from "./config";

export type MotionApi = {
  gsap: typeof GsapType;
  ScrollTrigger: typeof ScrollTriggerType;
  Flip: typeof FlipType;
  SplitText: typeof SplitTextType;
};

let booting: Promise<MotionApi> | null = null;
let ready: MotionApi | null = null;

/**
 * Loads GSAP once, after hydration, and shares the promise.
 *
 * WHY THIS IS DYNAMIC. GSAP with ScrollTrigger, Flip and SplitText is ~62 kB
 * gzipped. The motion runtime mounts in the root layout, so a static import
 * puts all of it in the shared chunk — served on `/legal/privacy` and
 * `/checkout` and every other route that animates nothing. Loading it on
 * demand keeps it out of the initial payload entirely; it arrives a frame or
 * two after hydration and every scene on the page shares the one instance.
 *
 * This is also why the site does not use `@gsap/react`. `useGSAP` is a good
 * hook, but it imports gsap statically, which defeats the whole arrangement —
 * and the part of it worth having is twenty lines (see `use-scene.ts`).
 *
 * THE COST, STATED. Scenes set up after paint rather than during it. Anything
 * that must be hidden before GSAP arrives therefore declares its hidden state
 * in CSS under `[data-js]`, exactly as `.reveal` does, and GSAP animates it
 * *out* of that state. Never the reverse: a `gsap.from()` that hides content
 * is a section that flashes visible and then disappears.
 */
export function loadMotion(): Promise<MotionApi> {
  if (booting) return booting;

  booting = (async () => {
    const [core, scrollTrigger, flip, splitText] = await Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
      import("gsap/Flip"),
      import("gsap/SplitText"),
    ]);

    const { gsap } = core;
    const { ScrollTrigger } = scrollTrigger;
    const { Flip } = flip;
    const { SplitText } = splitText;

    gsap.registerPlugin(ScrollTrigger, Flip, SplitText);

    // The site's resting state, so a tween that specifies neither is still in
    // the house language rather than GSAP's default 0.5s power1.out. Read from
    // the ladder rather than restated here — a default that disagrees with the
    // tokens is a second motion language nobody declared.
    gsap.defaults({ ease: EASE.out, duration: DUR.slow });

    ScrollTrigger.config({
      // A pinned section measured against `svh` re-measures when mobile
      // browser chrome collapses, which is a resize storm mid-scroll.
      ignoreMobileResize: true,
      // Coalesces callbacks to one per frame per trigger.
      limitCallbacks: true,
    });

    ready = { gsap, ScrollTrigger, Flip, SplitText };
    return ready;
  })();

  return booting;
}

/** For code that has already awaited `loadMotion()`. Null before then. */
export function motionApi(): MotionApi | null {
  return ready;
}
