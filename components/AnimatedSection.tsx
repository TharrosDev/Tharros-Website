"use client";

import { motion, useReducedMotion } from "motion/react";

type Variant = "fade-up" | "fade-left" | "fade-right" | "scale-in" | "fade";

const variants: Record<Variant, { hidden: any; visible: any }> = {
  "fade-up": {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  },
  "fade-left": {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  },
  "fade-right": {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
  },
  "scale-in": {
    hidden: { opacity: 0, scale: 0.95 },
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
  delay = 0,
  variant = "fade-up",
}: AnimatedSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={shouldReduceMotion ? variants.fade : variants[variant]}
      transition={{
        duration: 0.6,
        delay: delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
