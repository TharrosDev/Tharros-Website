"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const navLinks = [
  { label: "Problem", href: "#problem" },
  { label: "Solutions", href: "#solutions" },
  { label: "Process", href: "#process" },
  { label: "Why Us", href: "#why" },
  { label: "Contact", href: "#contact" },
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Lock body scroll when mobile menu is open
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
        className={`fixed top-3 md:top-4 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-5 md:px-6 py-3 rounded-full transition-all duration-500 ${
          scrolled
            ? "bg-bg/80 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
            : "bg-bg/40 backdrop-blur-md border border-white/[0.04]"
        }`}
        style={{ width: "min(92vw, 1100px)" }}
      >
        {/* Logo */}
        <Link href="/" aria-label="Tharros home" className="shrink-0">
          <Image
            src="/tharros-logo.svg"
            alt="Tharros"
            width={110}
            height={28}
            priority
            style={{ width: "auto", height: "auto" }}
          />
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm text-subdued hover:text-text rounded-full hover:bg-white/[0.05] transition-all duration-300"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <a
          href="mailto:magnus.abdelnour@gmail.com?subject=I%27d%20like%20to%20talk%20about%20an%20AI%20agent"
          className="hidden md:inline-block px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-accent hover:bg-accent-bright transition-all duration-300 shadow-[0_0_16px_rgba(99,102,241,0.2)]"
        >
          Get in touch
        </a>

        {/* Mobile hamburger — z-index above overlay */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden relative z-[60] w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-full hover:bg-white/[0.05] transition-colors"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          <span
            className={`block w-5 h-[2px] bg-text rounded-full transition-all duration-300 origin-center ${
              mobileOpen ? "rotate-45 translate-y-[5px]" : ""
            }`}
          />
          <span
            className={`block w-5 h-[2px] bg-text rounded-full transition-all duration-300 ${
              mobileOpen ? "opacity-0 scale-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-[2px] bg-text rounded-full transition-all duration-300 origin-center ${
              mobileOpen ? "-rotate-45 -translate-y-[5px]" : ""
            }`}
          />
        </button>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[55] bg-bg/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-8"
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                className="text-2xl font-semibold text-text hover:text-accent-bright transition-colors"
              >
                {link.label}
              </motion.a>
            ))}
            <motion.a
              href="mailto:magnus.abdelnour@gmail.com?subject=I%27d%20like%20to%20talk%20about%20an%20AI%20agent"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              onClick={() => setMobileOpen(false)}
              className="mt-4 glow-button px-8 py-4 text-lg"
            >
              Get in touch
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
