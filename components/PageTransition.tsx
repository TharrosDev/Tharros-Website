"use client";

import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{
          duration: 0.4,
          ease: [0.22, 1, 0.36, 1], // Custom Cubic Bezier for premium feel
        }}
        style={{ willChange: "transform, opacity" }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
