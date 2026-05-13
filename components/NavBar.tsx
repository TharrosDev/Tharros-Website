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
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isIntakePage = pathname === "/intake";
  const isHomePage = pathname === "/";

  useEffect(() => {
    setMounted(true);
  }, []);

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
        }, 150); // Increased for safety
      }
    };

    if (isHomePage && mounted) {
      handleHashScroll();
    }
  }, [isHomePage, pathname, mounted]);

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

  // Prevent flicker by not rendering specific parts or using suppressHydrationWarning
  return (
    <>
      <header
        suppressHydrationWarning
        className="fixed top-2 md:top-4 z-50 flex items-center gap-4 px-3 md:px-5 py-2 md:py-2.5 rounded-full bg-white/90 backdrop-blur-xl border border-slate-200/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] left-1/2 -translate-x-1/2 justify-between"
        style={{ 
          width: "min(94%, 1300px)",
          opacity: mounted ? 1 : 0
        }}
      >
        <Magnetic strength={0.1}>
          <Link
            href="/"
            onClick={(e) => handleLinkClick(e, "/")}
            className="relative z-10 block transition-all duration-700 scale-90 md:scale-100"
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

        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => (
            <motion.a
              key={link.href}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-all duration-300 uppercase tracking-widest text-[10px]"
            >
              {link.label}
            </motion.a>
          ))}
        </nav>

        <div className="flex items-center gap-3 h-full">
          <Magnetic strength={0.2}>
            <Link
              href="/intake"
              prefetch={false}
              aria-label="Start your AI consultation"
              className="hidden md:inline-block px-5 py-2 primary-button text-sm transition-all duration-300"
            >
              Get Started
            </Link>
          </Magnetic>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex relative z-[60] w-10 h-10 flex-col items-center justify-center gap-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 shadow-sm transition-all duration-300 active:scale-90"
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
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, backdropFilter: "blur(40px)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as any }}
            className="fixed inset-0 z-[55] bg-white/95 backdrop-blur-3xl flex flex-col items-center justify-center"
          >
            <div className="flex flex-col items-center justify-center gap-10 w-full px-6">
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
