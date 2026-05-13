"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button after 500px scroll
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ y: -4, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[100] w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white text-slate-950 shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-100 flex items-center justify-center group transition-all duration-300"
          aria-label="Return to top of page"
        >
          {/* Industrial Arrow Icon */}
          <svg 
            width="22" 
            height="22" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="group-hover:text-accent-3 transition-colors"
          >
            <path d="m18 15-6-6-6 6"/>
          </svg>
          
          {/* Subtle Glow Effect */}
          <div className="absolute inset-0 rounded-2xl bg-accent-3/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
