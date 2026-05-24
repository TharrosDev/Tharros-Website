"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function HeroSection() {
  const reduce = useReducedMotion();
  const slide = (y: number) => (reduce ? { y: 0 } : { y });

  return (
    <section
      id="hero"
      className="relative min-h-[92svh] md:min-h-[100svh] flex items-stretch pt-24 md:pt-28 pb-12 md:pb-20 bg-[color:var(--surface)] overflow-hidden"
    >
      <div className="page-frame w-full grid grid-cols-12 gap-x-6">
        {/* Eyebrow + headline + CTAs */}
        <div className="col-span-12 flex flex-col justify-between">
          <motion.div
            initial={slide(12)}
            animate={{ y: 0 }}
            transition={{ duration: 0.7, ease: easeOutExpo }}
            className="flex items-center gap-4"
          >
            <span className="num text-xs text-[color:var(--ink-faint)]">§ 00</span>
            <span className="h-px w-8 bg-[color:var(--rule-strong)]" />
            <span className="type-meta-strong">Ottawa · Est. 2025</span>
          </motion.div>

          <div className="mt-12 md:mt-16">
            <motion.h1
              initial={slide(16)}
              animate={{ y: 0 }}
              transition={{ duration: 0.85, delay: 0.1, ease: easeOutExpo }}
              className="type-display-1 max-w-[18ch]"
            >
              Modern websites.<br />
              Integrated AI agents.<br />
              <span className="text-[color:var(--accent)]">One team, on call.</span>
            </motion.h1>

            <motion.p
              initial={slide(12)}
              animate={{ y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: easeOutExpo }}
              className="type-lead mt-8 md:mt-10 max-w-[52ch]"
            >
              For Ottawa trades and small businesses. We build the site, embed the agent, and stay reachable when things change.
            </motion.p>

            <motion.div
              initial={slide(8)}
              animate={{ y: 0 }}
              transition={{ duration: 0.7, delay: 0.45, ease: easeOutExpo }}
              className="mt-10 md:mt-14 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 max-w-md sm:max-w-none"
            >
              <Link href="/brief" className="btn-primary">
                Book a discovery call
                <Arrow />
              </Link>
              <a href="#demo" className="btn-ghost">
                Try the agent
              </a>
            </motion.div>
          </div>

          {/* Bottom metadata strip */}
          <dl className="meta-row mt-16 md:mt-24 pt-6 border-t border-[color:var(--rule)]">
            <div><dt>Slogan</dt> <dd>Keep it Local, Keep it Canadian</dd></div>
            <div><dt>Service area</dt> <dd>Ottawa · Kanata · Nepean · Orleans · Gatineau</dd></div>
            <div><dt>Contact</dt> <dd>tharrosdev@gmail.com</dd></div>
          </dl>
        </div>
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}
