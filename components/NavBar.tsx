"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import Magnetic from "./Magnetic";

const navLinks = [
  { label: "Solutions", href: "/#solutions" },
  { label: "Demo", href: "/#demo" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Clients", href: "/clients" },
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const pathname = usePathname();
  const isIntakePage = pathname === "/intake";
  const isHomePage = pathname === "/";

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    // Handle logo/scroll to top
    if (href === "/" && isHomePage) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Handle hash links on the home page
    if (href.startsWith("/#") && isHomePage) {
      e.preventDefault();
      const id = href.replace("/#", "");
      const element = document.getElementById(id);
      if (element) {
        const offset = 100; // Account for sticky nav
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
        
        // Update URL hash without jumping
        window.history.pushState(null, "", href);
      }
    }
  };

  // Robust Cross-Page Anchor Handling
  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (hash && isHomePage) {
        const id = hash.replace("#", "");
        // Short delay to ensure PageTransition and dynamic sections are laid out
        setTimeout(() => {
          const element = document.getElementById(id);
          if (element) {
            const offset = 100;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
              top: elementPosition - offset,
              behavior: "smooth"
            });
          }
        }, 100);
      }
    };

    if (isHomePage) {
      handleHashScroll();
    }
  }, [isHomePage, pathname]);

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
        className={`fixed top-2 md:top-4 z-50 flex items-center gap-4 px-3 md:px-5 py-2 md:py-2.5 rounded-full bg-white/90 backdrop-blur-xl border border-border shadow-[0_4px_24px_rgba(0,0,0,0.08)] transition-all duration-500 ease-[0.22, 1, 0.36, 1] ${
          isMinimized 
            ? "right-[3%] md:right-[5%] left-auto translate-x-0" 
            : "left-1/2 -translate-x-1/2 justify-between"
        }`}
        style={{ width: isMinimized ? "auto" : "min(94%, 1300px)" }}
      >
        <Magnetic strength={0.15}>
          <Link
            href="/"
            onClick={(e) => handleLinkClick(e, "/")}
            className={`relative z-10 block transition-all duration-500 ${isMinimized ? "scale-[0.6] -mr-4 opacity-70 hover:opacity-100" : "scale-90 md:scale-100"}`}
            aria-label="Tharros Home"
          >
            <Image
              src="/tharros-logo.svg"
              width={160}
              height={40}
              priority
              style={{ width: "auto", height: "auto" }}
              alt="Tharros AI Automation Logo"
            />
          </Link>
        </Magnetic>

        <nav className={`${isMinimized ? 'hidden' : 'hidden md:flex'} items-center gap-1 lg:gap-2`}>
          {navLinks.map((link) => (
            <motion.a
              key={link.href}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 text-sm font-semibold text-subdued hover:text-text rounded-full hover:bg-surface transition-colors duration-200"
            >
              {link.label}
            </motion.a>
          ))}
        </nav>

        <div className="flex items-center gap-3 h-full">
          {/* Industrial Minimize Toggle */}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hidden md:flex w-9 h-9 items-center justify-center rounded-xl bg-slate-950 text-slate-400 hover:text-white border border-white/10 transition-all active:scale-95 shadow-[0_4px_12px_rgba(0,0,0,0.1)] relative group"
            aria-label={isMinimized ? "Expand Console" : "Minimize Console"}
            title={isMinimized ? "Expand Console" : "Minimize Console"}
          >
            {isMinimized ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent-3">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M15 3v18" />
                <path d="M8 9l3 3-3 3" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
              </svg>
            )}
            {/* Tooltip-like Pulse */}
            {isMinimized && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent-3 rounded-full animate-pulse shadow-[0_0_8px_rgba(14,165,233,0.8)]" />
            )}
          </button>

          <Magnetic strength={0.2}>
            <Link
              href="/intake"
              prefetch={false}
              aria-label="Start your AI consultation"
              className={`${isMinimized ? 'w-0 opacity-0 overflow-hidden px-0 pointer-events-none' : 'hidden md:inline-block px-5 py-2'} primary-button text-sm transition-all duration-300`}
            >
              Get Started
            </Link>
          </Magnetic>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`${isMinimized ? 'flex scale-110' : 'md:hidden flex'} relative z-[60] w-10 h-10 flex-col items-center justify-center gap-1.5 rounded-full bg-slate-950 border border-white/10 shadow-lg transition-all duration-300 active:scale-90`}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <span
              className={`block w-5 h-[1.5px] bg-white rounded-full transition-all duration-300 origin-center ${
                mobileOpen ? "rotate-45 translate-y-[5px]" : ""
              }`}
            />
            <span
              className={`block w-5 h-[1.5px] bg-white rounded-full transition-all duration-300 ${
                mobileOpen ? "opacity-0 scale-0" : ""
              }`}
            />
            <span
              className={`block w-5 h-[1.5px] bg-white rounded-full transition-all duration-300 origin-center ${
                mobileOpen ? "-rotate-45 -translate-y-[5px]" : ""
              }`}
            />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={isMinimized ? { opacity: 0, y: 20, scale: 0.95 } : { opacity: 0 }}
            animate={isMinimized ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1, backdropFilter: "blur(40px)" }}
            exit={isMinimized ? { opacity: 0, y: 10, scale: 0.95 } : { opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={isMinimized 
              ? "fixed top-20 right-[3%] md:right-[5%] z-[55] w-72 bg-white/95 backdrop-blur-2xl border border-slate-200 rounded-[2rem] shadow-2xl p-8 overflow-hidden shadow-slate-900/10" 
              : "fixed inset-0 z-[55] bg-white/80 backdrop-blur-3xl flex flex-col items-center justify-center"}
          >
            <div className={isMinimized ? "flex flex-col gap-6" : "flex flex-col items-center justify-center gap-10 w-full px-6"}>
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    handleLinkClick(e, link.href);
                    setMobileOpen(false);
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={isMinimized 
                    ? "text-xl font-bold tracking-tight text-slate-900 hover:text-accent-3 transition-colors" 
                    : "text-4xl font-bold tracking-tighter text-slate-900 hover:text-accent-3 transition-colors text-center w-full py-2"}
                >
                  {link.label}
                </motion.a>
              ))}
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.05 }}
                className={isMinimized ? "mt-2 pt-6 border-t border-slate-100" : "w-full max-w-xs mt-4"}
              >
                <Link
                  href="/intake"
                  prefetch={false}
                  onClick={() => setMobileOpen(false)}
                  className={isMinimized 
                    ? "primary-button flex items-center justify-center px-6 py-3 text-sm" 
                    : "primary-button flex items-center justify-center px-6 py-4 text-base shadow-2xl shadow-slate-900/10"}
                >
                  Get Started
                </Link>
                <div className={isMinimized ? "mt-4 text-left" : "mt-6 text-center"}>
                  <a 
                    href="mailto:tharrosdev@gmail.com?subject=Inquiry" 
                    className="text-slate-400 text-[10px] font-bold uppercase tracking-widest hover:text-text transition-colors"
                  >
                    Or Email Us
                  </a>
                </div>
              </motion.div>
            </div>
            
            {/* Industrial Accent - Only show on full screen or adjust for dropdown */}
            {!isMinimized && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                className="absolute bottom-12 text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400"
              >
                Unit_01 // Menu_System
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
