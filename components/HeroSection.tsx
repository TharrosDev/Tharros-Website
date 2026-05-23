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
        {/* Left: eyebrow + headline + CTAs */}
        <div className="col-span-12 lg:col-span-8 flex flex-col justify-between">
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
              Website modernization, AI agent integration, and an optional retainer for Ottawa
              trades and small businesses. We build the site, embed the agent, and stay reachable
              when things change.
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

            {/* Mobile-only compact wiring diagram */}
            <div className="lg:hidden mt-12 pt-8 border-t border-[color:var(--rule)]">
              <WiringDiagramCompact />
            </div>
          </div>

          {/* Bottom metadata strip */}
          <dl className="meta-row mt-16 md:mt-24 pt-6 border-t border-[color:var(--rule)]">
            <div><dt>Slogan</dt> <dd>Keep it Local, Keep it Canadian</dd></div>
            <div><dt>Service area</dt> <dd>Ottawa · Kanata · Nepean · Orleans · Gatineau</dd></div>
            <div><dt>Contact</dt> <dd>tharrosdev@gmail.com</dd></div>
          </dl>
        </div>

        {/* Right: wiring diagram (desktop) */}
        <div className="hidden lg:flex col-span-4 items-start justify-center pl-8 pt-14 xl:pt-20 border-l border-[color:var(--rule)]">
          <div className="w-full max-w-[320px]">
            <WiringDiagram />
          </div>
        </div>
      </div>
    </section>
  );
}

function WiringDiagramCompact() {
  const nodes = [
    { label: "Visitor", sub: "Asks" },
    { label: "Site",    sub: "We build" },
    { label: "Agent",   sub: "We embed", accent: true },
    { label: "You",     sub: "Routed in" },
  ];
  return (
    <div>
      <div className="num text-[11px] text-[color:var(--ink-faint)] mb-4">FIG. 01 · END-TO-END BUILD</div>
      <svg viewBox="0 0 360 70" className="diagram w-full h-auto" fill="none" aria-hidden="true">
        {nodes.map((n, i) => {
          const x = 4 + i * 92;
          return (
            <g key={i} className={n.accent ? "accent" : ""}>
              <rect
                x={x}
                y={6}
                width={80}
                height={42}
                stroke="currentColor"
                strokeWidth={n.accent ? 1.5 : 1}
                fill={n.accent ? "currentColor" : "none"}
                fillOpacity={n.accent ? 0.08 : 0}
              />
              <text x={x + 8} y={24} fontFamily="var(--font-mono)" fontSize="8" letterSpacing="1.2" fill="currentColor" opacity="0.55">
                {String(i + 1).padStart(2, "0")}
              </text>
              <text x={x + 8} y={38} fontFamily="var(--font-sans)" fontSize="11" fontWeight={n.accent ? 600 : 500} fill="currentColor">
                {n.label}
              </text>
              {i < nodes.length - 1 && (
                <line x1={x + 80} y1={27} x2={x + 92} y2={27} stroke="currentColor" strokeWidth="1" opacity="0.5" strokeDasharray="2 3" />
              )}
            </g>
          );
        })}
      </svg>
      <div className="meta-row mt-3">
        {nodes.map((n) => (
          <span key={n.label} className="num text-[11px]">{n.label.toUpperCase()} · {n.sub}</span>
        ))}
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}

function WiringDiagram() {
  return (
    <svg viewBox="0 0 300 460" className="diagram w-full h-auto" fill="none" aria-hidden="true">
      <defs>
        <marker id="dot" viewBox="0 0 6 6" refX="3" refY="3" markerWidth="6" markerHeight="6">
          <circle cx="3" cy="3" r="2" fill="currentColor" />
        </marker>
      </defs>

      {/* Visitor node */}
      <g>
        <rect x="40" y="20" width="220" height="48" stroke="currentColor" strokeWidth="1" />
        <text x="56" y="42" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1.2" fill="currentColor" opacity="0.5">01 · VISITOR</text>
        <text x="56" y="58" fontFamily="var(--font-sans)" fontSize="13" fontWeight="500" fill="currentColor">Lands on the site</text>
      </g>

      {/* Connector */}
      <line x1="150" y1="68" x2="150" y2="118" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" opacity="0.5" />

      {/* Site node */}
      <g>
        <rect x="40" y="118" width="220" height="48" stroke="currentColor" strokeWidth="1" />
        <text x="56" y="140" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1.2" fill="currentColor" opacity="0.5">02 · SITE</text>
        <text x="56" y="156" fontFamily="var(--font-sans)" fontSize="13" fontWeight="500" fill="currentColor">Modern website (we build)</text>
      </g>

      <line x1="150" y1="166" x2="150" y2="216" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" opacity="0.5" />

      {/* Agent node — accented */}
      <g className="accent">
        <rect x="40" y="216" width="220" height="68" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.06" />
        <text x="56" y="240" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1.2" fill="currentColor">03 · AGENT</text>
        <text x="56" y="258" fontFamily="var(--font-sans)" fontSize="13" fontWeight="600" fill="currentColor">AI agent (we embed)</text>
        <text x="56" y="274" fontFamily="var(--font-sans)" fontSize="11" fill="currentColor" opacity="0.75">Inquiry · Lead · After-hours</text>
      </g>

      <line x1="150" y1="284" x2="150" y2="334" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" opacity="0.5" />

      {/* Inbox / CRM split */}
      <g>
        <rect x="20" y="334" width="120" height="48" stroke="currentColor" strokeWidth="1" />
        <text x="34" y="356" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1.2" fill="currentColor" opacity="0.5">04A · INBOX</text>
        <text x="34" y="372" fontFamily="var(--font-sans)" fontSize="12" fontWeight="500" fill="currentColor">You, on the job</text>
      </g>
      <g>
        <rect x="160" y="334" width="120" height="48" stroke="currentColor" strokeWidth="1" />
        <text x="174" y="356" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1.2" fill="currentColor" opacity="0.5">04B · CRM</text>
        <text x="174" y="372" fontFamily="var(--font-sans)" fontSize="12" fontWeight="500" fill="currentColor">Your tools</text>
      </g>

      {/* Branching connectors */}
      <path d="M 150 284 L 150 310 L 80 310 L 80 334" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5" />
      <path d="M 150 310 L 220 310 L 220 334" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5" />

      {/* Footer label */}
      <text x="40" y="420" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1.4" fill="currentColor" opacity="0.4">FIG. 01 · END-TO-END BUILD</text>
      <text x="40" y="436" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1.4" fill="currentColor" opacity="0.4">ONE TEAM · SITE + AGENT + SUPPORT</text>
    </svg>
  );
}
