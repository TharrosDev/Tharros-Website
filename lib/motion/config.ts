/**
 * THE MOTION LANGUAGE, in one place.
 *
 * Durations here are SECONDS, because GSAP takes seconds; the CSS tokens in
 * `globals.css` are the same intervals in milliseconds. The two ladders are
 * deliberately the same numbers — a hover that lasts 180ms in CSS and 200ms in
 * a tween reads as two different sites.
 *
 * The eases likewise mirror the stylesheet. `cubic-bezier(0.16, 1, 0.3, 1)` is
 * the standard approximation of easeOutExpo and `cubic-bezier(0.25, 1, 0.5, 1)`
 * of easeOutQuart, so GSAP's own `expo.out` / `quart.out` match what the CSS
 * already does without pulling in CustomEase to parse a bezier string.
 */

/** Seconds. Mirrors --dur-* in globals.css. */
export const DUR = {
  /** Buttons, icons, colour changes. */
  fast: 0.18,
  /** Local transitions, overlay presence. */
  base: 0.32,
  /** Image zoom, hover travel. */
  slow: 0.62,
  /** Scroll entrances. */
  reveal: 0.9,
  /** A frame uncovering itself — slower than any other gesture. */
  frame: 1.2,
  /** Scene changes and route transitions. The top of the ladder. */
  cinematic: 1.6,
} as const;

export const EASE = {
  /** The workhorse. Matches --ease-out-quart. */
  out: "quart.out",
  /** Long, decisive arrivals. Matches --ease-out-expo. */
  expo: "expo.out",
  /** The rule draw. Matches --ease-ledger. */
  ledger: "power3.out",
  /** Two-way moves — a curtain that leaves the way it came. */
  inOut: "power3.inOut",
  /** Scrubbed timelines. Linear, because the scroll is the easing. */
  scrub: "none",
} as const;

/**
 * Stagger, seconds.
 *
 * One interval and a ceiling, rather than a ladder — unlike `DUR` and `EASE`,
 * which mirror CSS custom properties the stylesheet actually uses, a stagger
 * has no counterpart in CSS and a rung nothing reads is a rung nobody chose.
 * Add one when a second interval is genuinely needed.
 */
export const STAGGER = {
  base: 0.07,
  /**
   * Past about five steps a stagger stops reading as sequence and starts
   * reading as lag. Callers clamp their index to this.
   */
  cap: 5,
} as const;

/**
 * How far a scrubbed tween lags the scrollbar, in seconds. `true` snaps
 * directly to scroll position; a number smooths it. 0.6 is enough to feel
 * like a camera and not enough to feel disconnected from the wheel.
 */
export const SCRUB = 0.6;

/**
 * Parallax travel per layer, as a fraction of the element's own height.
 * Depth is a ladder, not a per-section guess: a background that moves 2% and a
 * foreground that moves 14% describe a space, whereas six hand-picked values
 * describe nothing.
 */
export const DEPTH = {
  background: 0.02,
  environment: 0.05,
  subject: 0.08,
  foreground: 0.12,
  metadata: 0.16,
} as const;

export type Depth = keyof typeof DEPTH;
