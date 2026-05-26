"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useReducedMotion } from "motion/react";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const ring = useSpring(scrollYProgress, { stiffness: 180, damping: 28, mass: 0.4 });

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setIsVisible(window.scrollY > 600);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="group fixed bottom-5 right-5 md:bottom-8 md:right-8 z-[100] w-11 h-11 bg-[color:var(--ink)] text-[color:var(--ink-on-dark)] flex items-center justify-center hover:bg-[color:var(--accent)] transition-colors"
          style={{ marginBottom: "env(safe-area-inset-bottom)" }}
          aria-label="Return to top"
        >
          {/* Scroll-progress ring */}
          <svg
            className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
            viewBox="0 0 44 44"
            fill="none"
            aria-hidden="true"
          >
            <motion.circle
              cx="22"
              cy="22"
              r="21"
              stroke="var(--red)"
              strokeWidth="2"
              style={reduce ? { pathLength: 1 } : { pathLength: ring }}
            />
          </svg>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="relative">
            <path d="M7 12V2M3 6l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
