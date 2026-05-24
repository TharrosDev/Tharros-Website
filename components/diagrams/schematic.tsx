"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useAnimationFrame,
  type Variants,
} from "motion/react";

type InViewMargin = NonNullable<Parameters<typeof useInView>[1]>["margin"];

export const SCHEMATIC_EASE = [0.16, 1, 0.3, 1] as const;

/* Plotter-draw variants: SVG strokes trace in, fills/labels fade up.
   motion animates pathLength on rect/line/path/circle/polyline. */
export const drawStroke: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration: 0.7, ease: SCHEMATIC_EASE }, opacity: { duration: 0.2 } },
  },
};

export const fadeNode: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: SCHEMATIC_EASE } },
};

export const fadeLabel: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: SCHEMATIC_EASE } },
};

/* Parent that staggers its motion children into the plotter sequence.
   Returns ref + the resolved animate target so reduced-motion snaps to the
   finished drawing instantly. */
export function useDrawInView(margin: InViewMargin = "-12%") {
  const ref = useRef<SVGSVGElement>(null);
  // `inView` latches on (draw-on plays once); `visible` tracks live visibility
  // so the running signal pulse can pause when the diagram scrolls off-screen.
  const inView = useInView(ref, { once: true, margin });
  const visible = useInView(ref, { margin });
  const reduce = useReducedMotion();
  const play = inView || !!reduce;
  return { ref, inView, visible, reduce: !!reduce, animate: play ? "visible" : "hidden" };
}

export function staggerParent(reduce: boolean): Variants {
  return {
    hidden: {},
    visible: {
      transition: reduce
        ? { duration: 0 }
        : { staggerChildren: 0.12, delayChildren: 0.08 },
    },
  };
}

/* A cobalt pulse riding a guide path. Uses getPointAtLength each frame so it
   works in every browser and is trivially gated for reduced motion / off-screen.
   The guide path itself is invisible. */
export function SignalDot({
  d,
  duration = 3.2,
  active = true,
  r = 3,
  trail = true,
}: {
  d: string;
  duration?: number;
  active?: boolean;
  r?: number;
  trail?: boolean;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const trailRef = useRef<SVGCircleElement>(null);
  const lenRef = useRef(0);
  const reduce = useReducedMotion();
  const running = active && !reduce;

  useAnimationFrame((t) => {
    if (!running) return;
    const path = pathRef.current;
    const dot = dotRef.current;
    if (!path || !dot) return;
    if (!lenRef.current) lenRef.current = path.getTotalLength();
    const len = lenRef.current;
    if (!len) return;
    const prog = (t / 1000 / duration) % 1;
    const pt = path.getPointAtLength(prog * len);
    dot.setAttribute("cx", String(pt.x));
    dot.setAttribute("cy", String(pt.y));
    if (trailRef.current) {
      const back = path.getPointAtLength(Math.max(0, prog - 0.04) * len);
      trailRef.current.setAttribute("cx", String(back.x));
      trailRef.current.setAttribute("cy", String(back.y));
    }
  });

  return (
    <>
      <path ref={pathRef} d={d} fill="none" stroke="none" />
      {running && (
        <>
          {trail && <circle ref={trailRef} r={r * 1.9} fill="currentColor" opacity={0.18} />}
          <circle ref={dotRef} r={r} fill="currentColor" />
        </>
      )}
    </>
  );
}

export { motion as schematicMotion };
