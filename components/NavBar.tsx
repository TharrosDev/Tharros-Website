"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

const MotionLink = motion.create(Link);

const navLinks = [
  { label: "Home",     href: "/",         num: "01" },
  { label: "Product",  href: "/product",  num: "02" },
  { label: "Pricing",  href: "/pricing",  num: "03" },
  { label: "Clients",  href: "/clients",  num: "04" },
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const reduce = useReducedMotion();

  const navOffset = () =>
    typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches ? 112 : 96;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    if (href === "/" && isHomePage) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (!isHomePage) return;
    const hash = window.location.hash;
    if (!hash) return;
    const t = setTimeout(() => {
      const el = document.getElementById(hash.replace("#", ""));
      if (el) {
        const top = el.getBoundingClientRect().top + window.pageYOffset - navOffset();
        window.scrollTo({ top, behavior: "smooth" });
      }
    }, 150);
    return () => clearTimeout(t);
  }, [isHomePage, pathname]);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!mobileOpen) return;

    const node = menuRef.current;
    if (!node) return;
    const trigger = triggerRef.current;

    const focusables = () =>
      Array.from(
        node.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null);

    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setMobileOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[60] transition-[border-color,background-color] duration-300 ease-out ${
          scrolled
            ? "bg-[color:var(--surface)]/95 border-b border-[color:var(--rule)]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="page-frame flex items-center justify-between h-16 md:h-20">
          <Link
            href="/"
            onClick={(e) => handleLinkClick(e, "/")}
            className="flex items-center gap-3 group"
            aria-label="Tharros home"
          >
            <Image
              src="/tharros-logo.svg"
              width={180}
              height={42}
              priority
              style={{ width: "auto", height: 34 }}
              alt="Tharros logo"
              title="Tharros — Ottawa websites and AI agents"
              className="opacity-90 group-hover:opacity-100 transition-opacity"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  aria-current={active ? "page" : undefined}
                  className={`group relative flex items-center gap-2.5 px-4 py-2 transition-colors ${
                    active ? "text-[color:var(--ink)]" : "text-[color:var(--ink-muted)] hover:text-[color:var(--ink)]"
                  }`}
                >
                  <span className={`num text-[13px] transition-colors ${
                    active ? "text-[color:var(--accent)]" : "text-[color:var(--ink-faint)] group-hover:text-[color:var(--accent)]"
                  }`}>{link.num}</span>
                  <span className="text-[17px] font-medium">{link.label}</span>
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute left-4 right-4 -bottom-0.5 h-[2px] bg-[color:var(--accent)]"
                      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/brief"
              prefetch={false}
              aria-label="Book your free discovery call"
              className="btn-primary !min-h-0 !w-auto py-2.5 px-4 md:px-5 text-sm"
            >
              <span className="hidden sm:inline">Book a call</span>
              <span className="sm:hidden">Book</span>
            </Link>

            <button
              ref={triggerRef}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden tap-target flex flex-col items-center justify-center gap-1.5 -mr-2"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              <span className={`block w-5 h-px bg-[color:var(--ink)] transition-transform duration-300 ${mobileOpen ? "rotate-45 translate-y-[3px]" : ""}`} />
              <span className={`block w-5 h-px bg-[color:var(--ink)] transition-transform duration-300 ${mobileOpen ? "-rotate-45 -translate-y-[3px]" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="fixed inset-0 z-[55] bg-[color:var(--surface)] overflow-y-auto md:hidden"
          >
            <div className="page-frame pt-24 pb-12 min-h-[100dvh] flex flex-col">
              <span className="eyebrow mb-10">Menu</span>

              <nav className="flex flex-col">
                {navLinks.map((link, i) => {
                  const active = isActive(link.href);
                  return (
                    <MotionLink
                      key={link.href}
                      href={link.href}
                      onClick={(e) => { handleLinkClick(e, link.href); setMobileOpen(false); }}
                      aria-current={active ? "page" : undefined}
                      initial={reduce ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: reduce ? 0 : i * 0.04, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                      className="group flex items-baseline gap-5 py-5 border-b border-[color:var(--rule)]"
                    >
                      <span className={`num text-xs transition-colors ${active ? "text-[color:var(--accent)]" : "text-[color:var(--ink-faint)] group-hover:text-[color:var(--accent)]"}`}>{link.num}</span>
                      <span className={`type-display-3 transition-colors ${active ? "text-[color:var(--accent)]" : "group-hover:text-[color:var(--accent)]"}`}>{link.label}</span>
                    </MotionLink>
                  );
                })}
              </nav>

              <div className="mt-auto pt-10 flex flex-col gap-4 safe-bottom">
                <Link
                  href="/brief"
                  prefetch={false}
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary w-full"
                >
                  Book a discovery call
                </Link>
                <a
                  href="mailto:tharrosdev@gmail.com"
                  className="type-meta text-center py-2 hover:text-[color:var(--accent)] transition-colors"
                >
                  tharrosdev@gmail.com
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
