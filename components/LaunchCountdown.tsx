"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import AnimatedSection from "./AnimatedSection";

type Remaining = { days: number; hours: number; mins: number; secs: number };

function diff(target: number): Remaining | null {
  const ms = target - Date.now();
  if (ms <= 0) return null;
  const s = Math.floor(ms / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    mins: Math.floor((s % 3600) / 60),
    secs: s % 60,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

const tileEase = [0.22, 1, 0.36, 1] as [number, number, number, number];

function Unit({ value, label }: { value: string; label: string }) {
  const reduce = useReducedMotion();
  return (
    <div className="flex flex-col items-center gap-2">
      <span
        className="relative num font-semibold text-[clamp(1.75rem,5vw,2.75rem)] leading-none px-3.5 py-2.5 min-w-[3.25rem] text-center bg-[color:var(--ink)] text-[color:oklch(99%_0.002_25)] overflow-hidden"
        suppressHydrationWarning
      >
        {/* invisible spacer reserves the tile size while digits slide */}
        <span aria-hidden="true" className="invisible">{value}</span>
        {reduce ? (
          <span className="absolute inset-0 flex items-center justify-center">{value}</span>
        ) : (
          <AnimatePresence initial={false}>
            <motion.span
              key={value}
              className="absolute inset-0 flex items-center justify-center"
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              exit={{ y: "-110%" }}
              transition={{ duration: 0.4, ease: tileEase }}
            >
              {value}
            </motion.span>
          </AnimatePresence>
        )}
      </span>
      <span className="num text-[11px] tracking-[0.16em] uppercase text-[color:var(--ink-faint)]">{label}</span>
    </div>
  );
}

function Sep() {
  return <span className="num text-[clamp(1.5rem,4vw,2.25rem)] leading-none text-[color:var(--red)] font-semibold self-center mb-6">:</span>;
}

export default function LaunchCountdown({ endIso }: { endIso: string }) {
  const target = new Date(endIso).getTime();
  const [remaining, setRemaining] = useState<Remaining | null>(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const tick = () => {
      const r = diff(target);
      if (r) {
        setRemaining(r);
      } else {
        setExpired(true);
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  if (expired) return null;

  const d = remaining;

  return (
    <section className="pt-28 md:pt-32 pb-[var(--rhythm-tight)] bg-[color:var(--surface-alt)] border-b border-[color:var(--rule)]">
      <div className="page-frame">
        <div className="grid grid-cols-12 gap-x-6 gap-y-8 items-center">
          {/* Offer copy */}
          <AnimatedSection className="col-span-12 lg:col-span-7">
            <div className="flex items-center gap-3 mb-4">
              <span className="num text-[11px] tracking-[0.16em] text-[color:var(--accent)]">◆ LAUNCH OFFER</span>
              <span className="h-px flex-1 max-w-[6rem] bg-[color:var(--rule-strong)]" />
              <span className="num text-[11px] tracking-[0.12em] text-[color:var(--ink-faint)]">FIRST 3 MONTHS</span>
            </div>
            <h2 className="type-display-3 max-w-[24ch]">
              Launch pricing on our first builds.
            </h2>
            <p className="type-body text-[color:var(--ink-muted)] mt-3 max-w-[48ch]">
              For a limited window we&apos;re cutting our build fees. The Refresh now starts at{" "}
              <span className="num text-[color:var(--accent)] font-semibold whitespace-nowrap">$250</span>
              , down from{" "}
              <span className="num line-through text-[color:var(--ink-faint)] whitespace-nowrap">$1,000</span>
              , and The On-Call at{" "}
              <span className="num text-[color:var(--accent)] font-semibold whitespace-nowrap">$500</span>
              , down from{" "}
              <span className="num line-through text-[color:var(--ink-faint)] whitespace-nowrap">$1,500</span>{" "}
              (retainer stays $150/mo).
            </p>
          </AnimatedSection>

          {/* Countdown */}
          <AnimatedSection delay={0.12} className="col-span-12 lg:col-span-5 lg:justify-self-end">
            <span className="type-meta block mb-3 lg:text-right">Offer ends Aug 31, 2026</span>
            <div className="flex items-start gap-2 sm:gap-3" role="timer" aria-label="Time remaining on launch pricing">
              <Unit value={d ? String(d.days) : "--"} label="Days" />
              <Sep />
              <Unit value={d ? pad(d.hours) : "--"} label="Hrs" />
              <Sep />
              <Unit value={d ? pad(d.mins) : "--"} label="Min" />
              <Sep />
              <Unit value={d ? pad(d.secs) : "--"} label="Sec" />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
