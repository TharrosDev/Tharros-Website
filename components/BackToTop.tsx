"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggle = () => setIsVisible(window.scrollY > 600);
    window.addEventListener("scroll", toggle, { passive: true });
    return () => window.removeEventListener("scroll", toggle);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-5 right-5 md:bottom-8 md:right-8 z-[100] w-11 h-11 bg-[color:var(--ink)] text-[color:var(--ink-on-dark)] border border-[color:var(--ink)] flex items-center justify-center hover:bg-[color:var(--accent)] hover:border-[color:var(--accent)] transition-colors"
          style={{ marginBottom: "env(safe-area-inset-bottom)" }}
          aria-label="Return to top"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 12V2M3 6l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
