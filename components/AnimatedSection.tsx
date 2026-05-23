"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

type Variant = "fade-up" | "fade-left" | "fade-right" | "scale-in" | "fade";

const variants: Record<Variant, Variants> = {
  "fade-up":    { hidden: { y: 12 },  visible: { y: 0 } },
  "fade-left":  { hidden: { x: -12 }, visible: { x: 0 } },
  "fade-right": { hidden: { x: 12 },  visible: { x: 0 } },
  "scale-in":   { hidden: { scale: 0.98 }, visible: { scale: 1 } },
  "fade":       { hidden: {}, visible: {} },
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
  delay = 0,
  variant = "fade-up",
}: AnimatedSectionProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
      variants={reduce ? variants.fade : variants[variant]}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      }}
      style={reduce ? undefined : { willChange: "transform" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
