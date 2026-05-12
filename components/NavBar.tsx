"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import Magnetic from "./Magnetic";

const navLinks = [
  { label: "Solutions", href: "/#solutions" },
  { label: "Try Agent", href: "/#demo" },
  { label: "Pricing", href: "/#pricing" },
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isIntakePage = pathname === "/intake";
  const isHomePage = pathname === "/";

  const handleScrollToTop = (e: React.MouseEvent) => {
    if (isHomePage || isIntakePage) {
      // If we are on home or intake, we just want to scroll to top if the link is meant for that
      // But for the logo, it always goes to /, so if we are on /, just scroll.
      // If we are on /intake and click logo, it should actually go to / (default behavior).
      // If we are on / and click logo, scroll to top.
      if (isHomePage) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handleIntakeScroll = (e: React.MouseEvent) => {
    if (isIntakePage) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    let ticking = false;
    const handler = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 20;
          setScrolled(isScrolled);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    // Initial check
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-2 md:top-4 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-4 md:px-7 py-2 md:py-3 rounded-full transition-all duration-500 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl border border-border shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
            : "bg-white/60 backdrop-blur-md border border-transparent"
        }`}
        style={{ width: "min(94vw, 1300px)" }}
      >
        <Magnetic strength={0.15}>
          <a
            href="/"
            onClick={handleScrollToTop}
            className="relative z-10 block"
            aria-label="Tharros Home"
          >
            <Image
              src="/tharros-logo.svg"
              priority
              style={{ width: "auto", height: "auto" }}
              className="scale-[0.8] origin-left md:scale-110"
              alt="Tharros AI Automation Logo"
            />
          </a>
        </Magnetic>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <motion.a
              key={link.href}
              href={link.href}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 text-sm font-medium text-subdued hover:text-text rounded-full hover:bg-surface transition-colors duration-200"
            >
              {link.label}
            </motion.a>
          ))}
        </nav>

        <Magnetic strength={0.2}>
          <a
            href="/intake"
            onClick={handleIntakeScroll}
            aria-label="Start your AI consultation"
            className="hidden md:inline-block primary-button px-5 py-2 text-sm"
          >
            Get in touch
          </a>
        </Magnetic>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden relative z-[60] w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-full bg-white border border-slate-100 shadow-sm transition-all active:scale-90"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          <span
            className={`block w-5 h-[1.5px] bg-slate-900 rounded-full transition-all duration-300 origin-center ${
              mobileOpen ? "rotate-45 translate-y-[5px]" : ""
            }`}
          />
          <span
            className={`block w-5 h-[1.5px] bg-slate-900 rounded-full transition-all duration-300 ${
              mobileOpen ? "opacity-0 scale-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-[1.5px] bg-slate-900 rounded-full transition-all duration-300 origin-center ${
              mobileOpen ? "-rotate-45 -translate-y-[5px]" : ""
            }`}
          />
        </button>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(40px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-[55] bg-white/80 flex flex-col items-center justify-center"
          >
            <div className="flex flex-col items-center justify-center gap-10 w-full px-6">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: "circOut" }}
                  className="text-4xl font-bold tracking-tighter text-slate-900 hover:text-accent-3 transition-colors text-center w-full py-2"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: navLinks.length * 0.08, duration: 0.5 }}
                className="w-full max-w-xs mt-4"
              >
                <a
                  href="/intake"
                  aria-label="Start your AI intake journey"
                  onClick={(e) => {
                    handleIntakeScroll(e);
                    setMobileOpen(false);
                  }}
                  className="primary-button flex items-center justify-center px-8 py-4 text-lg shadow-2xl shadow-slate-900/10"
                >
                  Get in touch
                </a>
                <div className="mt-6 text-center">
                  <a 
                    href="mailto:Magnus.Abdelnour@gmail.com?subject=Inquiry" 
                    className="text-slate-400 text-sm font-bold uppercase tracking-widest hover:text-text transition-colors"
                  >
                    Or Email Us
                  </a>
                </div>
              </motion.div>
            </div>
            
            {/* Industrial Accent Bottom */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              className="absolute bottom-12 text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400"
            >
              Unit_01 // Menu_System
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
