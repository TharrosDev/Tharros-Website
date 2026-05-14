"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import Magnetic from "./Magnetic";

const navLinks = [
  { label: "Demo", href: "/#demo" },
  { label: "Solutions", href: "/#solutions" },
  { label: "Process", href: "/#process" },
  { label: "Why", href: "/#why" },
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

  const isMinimized = false;

  // Prevent flicker by not rendering specific parts or using suppressHydrationWarning
  return (
    <>
      <header
        suppressHydrationWarning
        className="fixed top-2 md:top-4 z-50 flex items-center gap-4 px-4 md:px-5 3xl:px-12 py-1.5 md:py-2 3xl:py-6 rounded-2xl md:rounded-full bg-white/95 backdrop-blur-xl border border-slate-300/40 shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] left-1/2 -translate-x-1/2 justify-between"
        style={{ 
          width: "min(92%, var(--nav-width, 1300px))",
          opacity: mounted ? 1 : 0,
          // Fluidly increase width for large monitors
          ...({ "--nav-width": "clamp(1300px, 60vw, 2200px)" } as any)
        }}
      >
        <Magnetic strength={0.1}>
          <Link
            href="/"
            onClick={(e) => handleLinkClick(e, "/")}
            className="relative z-10 block transition-all duration-700 scale-[0.85] md:scale-100 3xl:scale-150 origin-left"
            aria-label="Tharros Home"
          >
            <Image
              src="/tharros-logo.svg"
              width={140}
              height={35}
              priority
              style={{ width: "auto", height: "auto" }}
              alt="Tharros AI Automation Logo"
            />
          </Link>
        </Magnetic>

        <nav className="hidden md:flex items-center gap-1 lg:gap-2 3xl:gap-8">
          {navLinks.map((link) => (
            <motion.a
              key={link.href}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-all duration-300 uppercase tracking-widest text-[10px] 3xl:text-lg"
            >
              {link.label}
            </motion.a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 md:gap-3 3xl:gap-8 h-full">
          <Magnetic strength={0.2}>
            <Link
              href="/intake"
              prefetch={false}
              aria-label="Book your AI training and setup call"
              className="inline-block px-4 py-2 md:px-5 md:py-2 3xl:px-12 3xl:py-6 primary-button text-[11px] md:text-sm 3xl:text-xl transition-all duration-300"
            >
              Book a Training Call
            </Link>
          </Magnetic>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex relative z-[60] w-8 h-8 flex-col items-center justify-center gap-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all duration-300 active:scale-90"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <span
              className={`block w-4 h-[1.5px] bg-slate-900 transition-all duration-300 origin-center ${
                mobileOpen ? "rotate-45 translate-y-[3.5px]" : ""
              }`}
            />
            <span
              className={`block w-4 h-[1.5px] bg-slate-900 transition-all duration-300 ${
                mobileOpen ? "opacity-0 scale-0" : ""
              }`}
            />
            <span
              className={`block w-4 h-[1.5px] bg-slate-900 transition-all duration-300 origin-center ${
                mobileOpen ? "-rotate-45 -translate-y-[3.5px]" : ""
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
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as any }}
            className="fixed inset-0 z-[55] bg-slate-950/98 flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Industrial Background Elements */}
            <div className="scanline opacity-[0.15]" />
            <div className="absolute inset-0 industrial-grid opacity-[0.05] pointer-events-none" />
            
            {/* Corner Markers */}
            <div className="absolute top-24 left-8 w-4 h-4 border-t border-l border-white/20" />
            <div className="absolute top-24 right-8 w-4 h-4 border-t border-r border-white/20" />
            <div className="absolute bottom-12 left-8 w-4 h-4 border-b border-l border-white/20" />
            <div className="absolute bottom-12 right-8 w-4 h-4 border-b border-r border-white/20" />

            <div className="flex flex-col items-center justify-center gap-8 w-full px-8 relative z-10">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    handleLinkClick(e, link.href);
                    setMobileOpen(false);
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 + 0.1, ease: [0.22, 1, 0.36, 1] as any }}
                  className="group flex flex-col items-center gap-1"
                >
                  <span className="text-3xl font-bold tracking-tighter text-white group-hover:text-accent-3 transition-colors uppercase">
                    {link.label}
                  </span>
                </motion.a>
              ))}
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="w-full max-w-xs mt-8 pt-8 border-t border-white/5 flex flex-col items-center"
              >
                <Link
                  href="/intake"
                  prefetch={false}
                  onClick={() => setMobileOpen(false)}
                  className="primary-button flex items-center justify-center px-10 py-5 text-base shadow-2xl shadow-accent-3/20 w-full"
                >
                  Book a Training Call
                </Link>
                
                <a 
                  href="mailto:tharrosdev@gmail.com" 
                  className="mt-8 text-white/40 text-[10px] font-black uppercase tracking-[0.4em] hover:text-accent-3 transition-colors flex items-center gap-3"
                >
                  Contact our Team
                </a>
              </motion.div>
            </div>
            
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
