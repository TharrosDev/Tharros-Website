"use client";

import { useEffect, useState } from "react";
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

function Unit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 min-w-[3.25rem]">
      <span className="num text-[clamp(1.75rem,5vw,2.75rem)] leading-none text-[color:var(--ink)]" suppressHydrationWarning>
        {value}
      </span>
      <span className="num text-[11px] tracking-[0.16em] uppercase text-[color:var(--ink-faint)]">{label}</span>
    </div>
  );
}

function Sep() {
  return <span className="num text-[clamp(1.5rem,4vw,2.25rem)] leading-none text-[color:var(--rule-strong)] self-start mt-0.5">:</span>;
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
            <p className="type-body text-[color:var(--ink-muted)] mt-3 max-w-[46ch]">
              For a limited window we&apos;re cutting our build fees. The Refresh drops to{" "}
              <span className="num text-[color:var(--ink)] whitespace-nowrap">
                <span className="line-through text-[color:var(--ink-faint)]">$1,000</span>{" "}
                <span className="text-[color:var(--accent)] font-semibold">from&nbsp;$250</span>
              </span>
              , and The On-Call to{" "}
              <span className="num text-[color:var(--ink)] whitespace-nowrap">
                <span className="line-through text-[color:var(--ink-faint)]">$1,500</span>{" "}
                <span className="text-[color:var(--accent)] font-semibold">from&nbsp;$500</span>
              </span>{" "}
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
