"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import AnimatedSection from "./AnimatedSection";
import SectionEyebrow from "./SectionEyebrow";

type TierKey = "refresh" | "oncall" | "integrate";

type Row = {
  label: string;
  refresh: string | boolean;
  oncall: string | boolean;
  integrate: string | boolean;
};

const ROWS: Row[] = [
  { label: "Modern website build", refresh: true,        oncall: true,                integrate: true },
  { label: "AI agent, embedded",   refresh: false,       oncall: false,               integrate: true },
  { label: "After-launch fixes",   refresh: "Per call",  oncall: "Unlimited",         integrate: "Unlimited" },
  { label: "Unlimited new agents", refresh: false,       oncall: false,               integrate: true },
  { label: "Billing",              refresh: "Project",   oncall: "Project + monthly", integrate: "Project + monthly" },
];

type Price = {
  from: string;
  launchFrom?: string;
  monthly?: string;
};

const TIERS: {
  key: TierKey;
  name: string;
  sub: string;
  note: string;
  price: Price;
}[] = [
  {
    key: "refresh",
    name: "The Refresh",
    sub: "Site only",
    note: "When your site is the front door, and the agent comes later.",
    price: { from: "1,000", launchFrom: "250" },
  },
  {
    key: "oncall",
    name: "The On-Call",
    sub: "Site + retainer",
    note: "When you want a modern site plus a standing line for fixes and edits.",
    price: { from: "1,500", launchFrom: "500", monthly: "150" },
  },
  {
    key: "integrate",
    name: "The Integrate",
    sub: "Site + agent + retainer",
    note: "When you want the site, the agent, and one number for everything.",
    price: { from: "3,000", monthly: "300" },
  },
];

const EASE = [0.16, 1, 0.3, 1] as const;

function PriceBlock({ price }: { price: Price }) {
  const accent = !!price.launchFrom;
  return (
    <div className="mt-3 flex flex-col gap-1">
      <div className="flex items-baseline gap-x-2.5 gap-y-1 flex-wrap">
        <span className="flex items-baseline gap-1.5">
          <span className="num text-[12px] uppercase tracking-[0.1em] text-[color:var(--ink-faint)]">from</span>
          <span className={`num text-[1.375rem] leading-none font-semibold ${accent ? "text-[color:var(--accent)]" : "text-[color:var(--ink)]"}`}>
            ${accent ? price.launchFrom : price.from}
          </span>
        </span>
        {accent && (
          <span className="num text-[13px] line-through text-[color:var(--ink-faint)]">
            ${price.from}
          </span>
        )}
        {accent && (
          <span className="num text-[11px] tracking-[0.16em] text-[color:var(--accent)] self-center">LAUNCH</span>
        )}
      </div>
      {price.monthly && (
        <span className="num text-[13px] text-[color:var(--ink-muted)]">+&nbsp;${price.monthly}/mo&nbsp;retainer</span>
      )}
    </div>
  );
}

function Cell({ value, col, row, play, reduce }: { value: string | boolean; col: number; row: number; play: boolean; reduce: boolean }) {
  const delay = reduce ? 0 : 0.12 + col * 0.14 + row * 0.05;
  if (value === true)
    return (
      <>
        <motion.span
          aria-hidden="true"
          className="num text-[color:var(--accent)] inline-block"
          initial={reduce ? false : { opacity: 0, scale: 0.4 }}
          animate={play ? { opacity: 1, scale: 1 } : undefined}
          transition={{ delay, duration: 0.35, ease: EASE }}
        >
          ●
        </motion.span>
        <span className="sr-only">Included</span>
      </>
    );
  if (value === false)
    return (
      <>
        <span aria-hidden="true" className="num text-[color:var(--ink-faint)]">—</span>
        <span className="sr-only">Not included</span>
      </>
    );
  return (
    <motion.span
      className="num text-[14px] text-[color:var(--ink)] inline-block"
      initial={reduce ? false : { y: 6 }}
      animate={play ? { y: 0 } : undefined}
      transition={{ delay, duration: 0.4, ease: EASE }}
    >
      {value}
    </motion.span>
  );
}

export default function ModelTiersSection({ isFirstOnPage = true }: { isFirstOnPage?: boolean }) {
  const tableRef = useRef<HTMLDivElement>(null);
  const reduce = !!useReducedMotion();
  const play = useInView(tableRef, { once: true, margin: "-10%" }) || reduce;

  const topPad = isFirstOnPage ? "pt-28 md:pt-32" : "pt-[var(--rhythm-default)]";

  return (
    <section id="builds" className={`${topPad} pb-[var(--rhythm-default)] bg-[color:var(--surface)]`}>
      <div className="page-frame">
        <SectionEyebrow numeral="§ 01" label="Builds" />

        <AnimatedSection className="mb-12 md:mb-16">
          <h2 className="type-display-2 max-w-[18ch]">
            Three builds.<br />
            <span className="accent-text">Pick yours.</span>
          </h2>
        </AnimatedSection>

        {/* Desktop comparison table */}
        <AnimatedSection delay={0.15}>
          <div ref={tableRef} className="hidden md:block overflow-hidden border-t-2 border-[color:var(--ink)]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[color:var(--rule)]">
                  <th className="py-6 pr-8 align-bottom w-[26%]">
                    <span className="type-meta">Comparison</span>
                  </th>
                  {TIERS.map((t, i) => (
                    <th
                      key={t.key}
                      scope="col"
                      className={`py-6 px-5 align-bottom ${i === 2 ? "bg-[color:var(--accent-soft)] border-t-2 border-[color:var(--accent)]" : ""}`}
                    >
                      <div className="flex flex-col gap-1">
                        {i === 2 && (
                          <motion.span
                            className="num text-[11px] text-[color:var(--accent)] tracking-[0.14em] mb-1"
                            initial={reduce ? false : { opacity: 0, y: 4 }}
                            animate={play ? { opacity: 1, y: 0 } : undefined}
                            transition={{ delay: reduce ? 0 : 0.5, duration: 0.4, ease: EASE }}
                          >
                            ◆ RECOMMENDED
                          </motion.span>
                        )}
                        <span className="num text-[11px] text-[color:var(--ink-faint)]">
                          {String(i + 1).padStart(2, "0")} / {t.sub.toUpperCase()}
                        </span>
                        <span className="type-display-3 leading-none">{t.name}</span>
                        <PriceBlock price={t.price} />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row, r) => (
                  <tr key={row.label} className="tier-row border-b border-[color:var(--rule)]">
                    <th scope="row" className="py-5 pr-8 type-body font-normal text-left text-[color:var(--ink)]">{row.label}</th>
                    {TIERS.map((t, c) => (
                      <td key={t.key} className={`py-5 px-5 ${c === 2 ? "is-accent bg-[color:var(--accent-soft)]" : ""}`}>
                        <Cell value={row[t.key]} col={c} row={r} play={play} reduce={reduce} />
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="tier-row">
                  <th scope="row" className="py-7 pr-8 type-meta text-left align-top">Best for</th>
                  {TIERS.map((t, i) => (
                    <td key={t.key} className={`py-7 px-5 align-top ${i === 2 ? "is-accent bg-[color:var(--accent-soft)]" : ""}`}>
                      <p className="text-[15px] text-[color:var(--ink-muted)] max-w-[26ch] leading-snug">{t.note}</p>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </AnimatedSection>

        {/* Mobile stacked */}
        <div className="md:hidden flex flex-col">
          {TIERS.map((t, i) => (
            <AnimatedSection key={t.key} delay={i * 0.08}>
              <div className={`py-8 border-t border-[color:var(--rule)] ${i === 2 ? "-mx-[clamp(1.25rem,4vw,4.5rem)] px-[clamp(1.25rem,4vw,4.5rem)] bg-[color:var(--accent-soft)]" : ""}`}>
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="num text-[11px] text-[color:var(--ink-faint)]">{String(i + 1).padStart(2, "0")}</span>
                  <span className="type-meta">{t.sub}</span>
                  {i === 2 && <span className="num text-[11px] text-[color:var(--accent)] tracking-[0.14em] ml-auto">◆ RECOMMENDED</span>}
                </div>
                <h3 className="type-display-3 mb-1">{t.name}</h3>
                <PriceBlock price={t.price} />
                <p className="text-[15px] text-[color:var(--ink-muted)] mt-4 mb-5">{t.note}</p>
                <ul className="flex flex-col gap-2">
                  {ROWS.map((row) => {
                    const v = row[t.key];
                    return (
                      <li key={row.label} className="flex items-baseline gap-3 text-[15px]">
                        <span aria-hidden="true" className={`num text-xs w-5 ${v === false ? "text-[color:var(--ink-faint)]" : "text-[color:var(--accent)]"}`}>{v === true ? "●" : v === false ? "—" : ""}</span>
                        <span className="text-[color:var(--ink)] flex-1">{row.label}</span>
                        {v === true && <span className="sr-only">Included</span>}
                        {v === false && <span className="sr-only">Not included</span>}
                        {typeof v === "string" && <span className="num text-[14px] text-[color:var(--ink-muted)]">{v}</span>}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.2}>
          <div className="mt-16 md:mt-20 grid grid-cols-12 gap-x-6 border-t border-[color:var(--rule)] pt-10">
            <div className="col-span-12 md:col-span-4">
              <span className="type-meta">After launch</span>
            </div>
            <div className="col-span-12 md:col-span-8 mt-3 md:mt-0">
              <p className="type-lead text-[color:var(--ink)]">
                Refresh clients call us per job, the way you&apos;d call a plumber. The On-Call retainer
                puts unlimited site fixes and edits on a flat monthly fee. The Integrate retainer rolls in
                everything On-Call covers plus the AI agent and unlimited new agent builds, so you stop
                counting calls.
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
