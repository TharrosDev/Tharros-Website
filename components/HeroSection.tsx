"use client";

import Link from "next/link";
import { useState } from "react";
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import {
  drawStroke,
  fadeNode,
  fadeLabel,
  useDrawInView,
  staggerParent,
  SignalDot,
} from "./diagrams/schematic";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function HeroSection() {
  const reduce = useReducedMotion();
  const slide = (y: number) => (reduce ? { y: 0 } : { y });

  // Pointer parallax for the desktop diagram (disabled under reduced motion).
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(useTransform(mx, [-0.5, 0.5], [10, -10]), { stiffness: 120, damping: 22 });
  const py = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 120, damping: 22 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

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

        {/* Right: live wiring diagram (desktop) */}
        <div
          className="hidden lg:flex col-span-4 items-center justify-center pl-8 border-l border-[color:var(--rule)]"
          onMouseMove={onMove}
          onMouseLeave={onLeave}
        >
          <motion.div className="w-full" style={reduce ? undefined : { x: px, y: py }}>
            <WiringDiagram />
          </motion.div>
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

/* ── Mobile: compact horizontal schematic, draws once, no pulse ── */
function WiringDiagramCompact() {
  const { ref, reduce, animate } = useDrawInView();
  const nodes = [
    { label: "Visitor", sub: "Asks" },
    { label: "Site", sub: "We build" },
    { label: "Agent", sub: "We embed", accent: true },
    { label: "You", sub: "Routed in" },
  ];
  return (
    <div>
      <div className="num text-[11px] text-[color:var(--ink-faint)] mb-4">FIG. 01 · END-TO-END BUILD</div>
      <motion.svg
        ref={ref}
        viewBox="0 0 360 70"
        className="diagram w-full h-auto"
        fill="none"
        aria-hidden="true"
        variants={staggerParent(reduce)}
        initial={reduce ? "visible" : "hidden"}
        animate={animate}
      >
        {nodes.map((n, i) => {
          const x = 4 + i * 92;
          return (
            <g key={i} className={n.accent ? "accent" : ""}>
              <motion.rect
                variants={drawStroke}
                x={x}
                y={6}
                width={80}
                height={42}
                stroke="currentColor"
                strokeWidth={n.accent ? 1.5 : 1}
                fill={n.accent ? "currentColor" : "none"}
                fillOpacity={n.accent ? 0.08 : 0}
              />
              <motion.text variants={fadeLabel} x={x + 8} y={24} fontFamily="var(--font-mono)" fontSize="8" letterSpacing="1.2" fill="currentColor" opacity="0.55">
                {String(i + 1).padStart(2, "0")}
              </motion.text>
              <motion.text variants={fadeLabel} x={x + 8} y={38} fontFamily="var(--font-sans)" fontSize="11" fontWeight={n.accent ? 600 : 500} fill="currentColor">
                {n.label}
              </motion.text>
              {i < nodes.length - 1 && (
                <motion.line variants={drawStroke} x1={x + 80} y1={27} x2={x + 92} y2={27} stroke="currentColor" strokeWidth="1" opacity="0.5" strokeDasharray="2 3" />
              )}
            </g>
          );
        })}
      </motion.svg>
      <div className="meta-row mt-3">
        {nodes.map((n) => (
          <span key={n.label} className="num text-[11px]">{n.label.toUpperCase()} · {n.sub}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Desktop: vertical wiring schematic, draws on load then routes a signal ── */
function WiringDiagram() {
  const { ref, visible, reduce, animate } = useDrawInView("-5%");
  const [hover, setHover] = useState<number | null>(null);

  const nodes = [
    { i: 0, y: 20, h: 48, code: "01 · VISITOR", label: "Lands on the site", sub: "Asks a question" },
    { i: 1, y: 118, h: 48, code: "02 · SITE", label: "Modern website (we build)", sub: "The front door" },
    { i: 2, y: 216, h: 68, code: "03 · AGENT", label: "AI agent (we embed)", sub: "Inquiry · Lead · After-hours", accent: true },
  ];
  // Signal guide: spine down through the nodes, then branch to the inbox.
  const signalPath = "M150 44 L150 118 L150 216 L150 300 L80 320 L80 334";

  return (
    <div>
      <motion.svg
        ref={ref}
        viewBox="0 0 300 460"
        className="diagram w-full h-auto"
        fill="none"
        aria-hidden="true"
        variants={staggerParent(reduce)}
        initial={reduce ? "visible" : "hidden"}
        animate={animate}
      >
        {/* connectors between stacked nodes */}
        <motion.line variants={drawStroke} x1="150" y1="68" x2="150" y2="118" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" opacity="0.5" />
        <motion.line variants={drawStroke} x1="150" y1="166" x2="150" y2="216" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" opacity="0.5" />

        {nodes.map((n) => (
          <g
            key={n.i}
            className={n.accent ? "accent node-hit" : "node-hit"}
            onMouseEnter={() => setHover(n.i)}
            onMouseLeave={() => setHover(null)}
          >
            <motion.rect
              variants={drawStroke}
              className="node-box"
              x="40"
              y={n.y}
              width="220"
              height={n.h}
              stroke="currentColor"
              strokeWidth={n.accent ? 1.5 : 1}
              fill="currentColor"
              fillOpacity={n.accent ? 0.06 : hover === n.i ? 0.04 : 0}
              style={{ transition: "fill-opacity 0.25s" }}
            />
            <motion.text variants={fadeLabel} x="56" y={n.y + 22} fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1.2" fill="currentColor" opacity={n.accent ? 1 : 0.5}>
              {n.code}
            </motion.text>
            <motion.text variants={fadeLabel} x="56" y={n.y + 38} fontFamily="var(--font-sans)" fontSize="13" fontWeight={n.accent ? 600 : 500} fill="currentColor">
              {n.label}
            </motion.text>
            {n.accent && (
              <motion.text variants={fadeLabel} x="56" y={n.y + 54} fontFamily="var(--font-sans)" fontSize="11" fill="currentColor" opacity="0.75">
                {n.sub}
              </motion.text>
            )}
          </g>
        ))}

        {/* split branch to inbox + tools */}
        <motion.path variants={drawStroke} d="M 150 284 L 150 310 L 80 310 L 80 334" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5" />
        <motion.path variants={drawStroke} d="M 150 310 L 220 310 L 220 334" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5" />

        <g onMouseEnter={() => setHover(3)} onMouseLeave={() => setHover(null)} className="node-hit">
          <motion.rect variants={drawStroke} x="20" y="334" width="120" height="48" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity={hover === 3 ? 0.04 : 0} style={{ transition: "fill-opacity 0.25s" }} />
          <motion.text variants={fadeLabel} x="34" y="356" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1.2" fill="currentColor" opacity="0.5">04A · INBOX</motion.text>
          <motion.text variants={fadeLabel} x="34" y="372" fontFamily="var(--font-sans)" fontSize="12" fontWeight="500" fill="currentColor">You, on the job</motion.text>
        </g>
        <g>
          <motion.rect variants={drawStroke} x="160" y="334" width="120" height="48" stroke="currentColor" strokeWidth="1" />
          <motion.text variants={fadeLabel} x="174" y="356" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1.2" fill="currentColor" opacity="0.5">04B · CRM</motion.text>
          <motion.text variants={fadeLabel} x="174" y="372" fontFamily="var(--font-sans)" fontSize="12" fontWeight="500" fill="currentColor">Your tools</motion.text>
        </g>

        {/* the live signal */}
        <g className="accent">
          <SignalDot d={signalPath} duration={3.4} active={visible} r={3} />
        </g>

        <motion.text variants={fadeNode} x="40" y="420" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1.4" fill="currentColor" opacity="0.4">FIG. 01 · END-TO-END BUILD</motion.text>
        <motion.text variants={fadeNode} x="40" y="436" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1.4" fill="currentColor" opacity="0.4">ONE TEAM · SITE + AGENT + SUPPORT</motion.text>
      </motion.svg>

      <SignalStatus active={visible && !reduce} />
    </div>
  );
}

function SignalStatus({ active }: { active: boolean }) {
  return (
    <div className="mt-4 flex items-center gap-2 num text-[11px] text-[color:var(--ink-faint)]">
      <span
        className="inline-block w-1.5 h-1.5 rounded-full"
        style={{ background: active ? "var(--accent)" : "var(--rule-strong)" }}
      />
      SIGNAL · {active ? "ROUTING" : "STATIC"}
    </div>
  );
}
