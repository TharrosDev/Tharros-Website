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
  /**
   * The floor for pinning. A pinned section is measured against the viewport,
   * and a phone's viewport changes height as the browser chrome collapses
   * mid-scroll — so a pin there is a section that jitters against a moving
   * ruler. Below this width a pinned scene keeps its choreography and loses
   * only the hold.
   *
   * 64rem is `lg`, which is also where the site's two-column compositions
   * start; a pin below that would be holding a single stacked column, which is
   * a stall rather than a held beat.
   */
  wide: "(min-width: 64rem)",
  /**
   * The complement of `wide`, written out rather than composed as
   * `and not (...)` — that form is Media Queries Level 4 and `matchMedia`
   * silently never matches where it is unsupported, which would drop the
   * unpinned branch of every scene on the devices that need it most.
   */
  narrow: "(max-width: 63.999rem)",
} as const;

/** Read once, imperatively — for the bail-before-attaching path. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(QUERY.reduced).matches;
}

export function hasFinePointer(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(QUERY.fine).matches;
}
