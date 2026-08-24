"use client";

/**
 * The three environments every gesture has to answer for.
 *
 * Reduced motion is not "the same site with the timings set to zero" — it is a
 * branch that sets final states directly and never attaches a scrub. Writing a
 * transform and then zeroing it still moves the element for a frame; not
 * writing one is the only version that is actually still.
 *
 * A coarse pointer keeps the motion and loses only what a finger cannot drive:
 * hover cinematography and the cursor. Switching motion off there would leave
 * the site with none at all on the device most people meet it on.
 */
export const QUERY = {
  fine: "(pointer: fine)",
  coarse: "(pointer: coarse)",
  motion: "(prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
} as const;

/*
 * `wide` and `narrow` used to live here — the width floor a pinned scene was
 * allowed above, and its explicitly written complement. Nothing pins any more,
 * so both are gone rather than kept for a caller that no longer exists.
 */

/** Read once, imperatively — for the bail-before-attaching path. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(QUERY.reduced).matches;
}

export function hasFinePointer(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(QUERY.fine).matches;
}
