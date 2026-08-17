"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useHydrated } from "@/lib/hooks";

/**
 * THE TRAVELLING NUMERAL — one of the site's signatures.
 *
 * A frame's index drifts against the picture it labels as the frame crosses the
 * viewport. Typographic and monochrome, set in the mono ladder the design
 * system already owns, moving about 40px across a full screen of scrolling —
 * slow and flat, per DESIGN.md §6. Nothing bounces.
 *
 * This is the one gesture that genuinely needs a library: scroll-linked
 * position, where CSS scroll-timeline still has a Safari gap and the
 * hand-rolled version is a scroll listener driving setState — a render cascade,
 * and exactly what the React Compiler rules reject.
 *
 * The element is always a `motion.span`, and the transform is only attached
 * once the client has hydrated. Branching on the element type instead would
 * mean the server rendering a plain span and the client rendering a motion one,
 * which is a hydration mismatch; branching on the style means the served HTML
 * carries no transform and nothing moves until there is a browser to decide.
 */
export default function ParallaxNumeral({
  children,
  className = "",
  /** Total travel in pixels across the frame's pass through the viewport. */
  range = 40,
}: {
  children: React.ReactNode;
  className?: string;
  range?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const hydrated = useHydrated();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [range / 2, -range / 2]);

  // Touch has no hover and a much shorter scroll runway, so a drifting numeral
  // there is motion for its own sake.
  const coarse =
    hydrated && window.matchMedia("(pointer: coarse)").matches;

  const moving = hydrated && !reduced && !coarse;

  return (
    <motion.span
      ref={ref}
      style={moving ? { y } : undefined}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.span>
  );
}
