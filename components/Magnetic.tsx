"use client";

import { useRef } from "react";
import { motion, useSpring, useReducedMotion } from "motion/react";

interface Props {
  children: React.ReactNode;
  className?: string;
  /** Max pull in px along each axis. */
  maxX?: number;
  maxY?: number;
}

/**
 * Cursor-pull wrapper for CTAs. Desktop fine-pointer only; falls back to a
 * static wrapper on touch and for reduced-motion users. Pass `w-full sm:w-auto`
 * so the wrapped button can still go full-width on mobile.
 */
export default function Magnetic({
  children,
  className = "",
  maxX = 16,
  maxY = 10,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useSpring(0, { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(0, { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const r = ref.current!.getBoundingClientRect();
    x.set(((e.clientX - r.left) / r.width - 0.5) * 2 * maxX);
    y.set(((e.clientY - r.top) / r.height - 0.5) * 2 * maxY);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x, y }}
      className={`inline-flex ${className}`}
    >
      {children}
    </motion.div>
  );
}
