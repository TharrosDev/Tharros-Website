"use client";

import { motion, useReducedMotion } from "motion/react";

type Variant = "fade-up" | "fade-left" | "fade-right" | "scale-in" | "fade";

const variants: Record<Variant, { hidden: Record<string, number>; visible: Record<string, number> }> = {
  "fade-up": {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  "fade-left": {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
  "fade-right": {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
  "scale-in": {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1 },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
};

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: Variant;
}

export default function AnimatedSection({
  children,
  className = "",
}: AnimatedSectionProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
