"use client";

import AnimatedSection from "./AnimatedSection";

type Row = {
  label: string;
  refresh: string | boolean;
  integrate: string | boolean;
  oncall: string | boolean;
};

const ROWS: Row[] = [
  { label: "Modern website build",   refresh: true,                 integrate: true,                 oncall: true },
  { label: "AI agent, embedded",     refresh: false,                integrate: true,                 oncall: true },
  { label: "Per-call support",       refresh: "Included",           integrate: "Included",           oncall: "Rolled in" },
  { label: "Unlimited fixes",        refresh: false,                integrate: false,                oncall: true },
  { label: "Unlimited new agents",   refresh: false,                integrate: false,                oncall: true },
  { label: "Billing",                refresh: "Project",            integrate: "Project",            oncall: "Project + monthly" },
];

const TIERS = [
  { key: "refresh",   name: "The Refresh",   sub: "Site only",            note: "When your site is the front door, and the agent comes later." },
  { key: "integrate", name: "The Integrate", sub: "Site + agent",         note: "When you want both, scoped once, billed per call after." },
  { key: "oncall",    name: "The On-Call",   sub: "Site + agent + retainer", note: "When you want one number to call for everything." },
] as const;

function Cell({ value }: { value: string | boolean }) {
  if (value === true)  return <span className="num text-[color:var(--accent)]">●</span>;
  if (value === false) return <span className="num text-[color:var(--ink-faint)]">—</span>;
  return <span className="num text-xs text-[color:var(--ink)]">{value}</span>;
}

export default function ModelTiersSection() {
  return (
    <section id="builds" className="rhythm-default bg-[color:var(--surface)]">
      <div className="page-frame">
        <AnimatedSection>
          <div className="flex items-center gap-4 mb-12 md:mb-16">
            <span className="num text-xs text-[color:var(--ink-faint)]">§ 02</span>
            <span className="h-px w-8 bg-[color:var(--rule-strong)]" />
            <span className="type-meta-strong">Builds</span>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-12 gap-x-6 gap-y-4 mb-16 md:mb-20">
          <AnimatedSection className="col-span-12 lg:col-span-8">
            <h2 className="type-display-2 max-w-[18ch]">
              Three builds.<br />
              <span className="text-[color:var(--ink-muted)]">Pick yours.</span>
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.1} className="col-span-12 lg:col-span-4 lg:pt-2">
            <p className="type-body text-[color:var(--ink-muted)] max-w-[42ch]">
              Pick the build that matches where the business is. After launch, fixes and new agents
              are billed per call, or rolled into the On-Call retainer.
            </p>
          </AnimatedSection>
        </div>

        {/* Desktop comparison table */}
        <AnimatedSection delay={0.15}>
          <div className="hidden md:block overflow-hidden border-t border-[color:var(--rule-strong)]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[color:var(--rule)]">
                  <th className="py-6 pr-6 align-bottom w-[28%]">
                    <span className="type-meta">Comparison</span>
                  </th>
                  {TIERS.map((t, i) => (
                    <th
                      key={t.key}
                      className={`py-6 px-4 align-bottom ${i === 2 ? "bg-[color:var(--accent-soft)]" : ""}`}
                    >
                      <div className="flex flex-col gap-1">
                        <span className="num text-[11px] text-[color:var(--ink-faint)]">
                          {String(i + 1).padStart(2, "0")} / {t.sub.toUpperCase()}
                        </span>
                        <span className="type-display-3 leading-none">{t.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row.label} className="border-b border-[color:var(--rule)]">
                    <td className="py-5 pr-6 type-body text-[color:var(--ink)]">{row.label}</td>
                    <td className="py-5 px-4"><Cell value={row.refresh} /></td>
                    <td className="py-5 px-4"><Cell value={row.integrate} /></td>
                    <td className="py-5 px-4 bg-[color:var(--accent-soft)]"><Cell value={row.oncall} /></td>
                  </tr>
                ))}
                <tr>
                  <td className="py-6 pr-6 type-meta align-top">Best for</td>
                  {TIERS.map((t, i) => (
                    <td key={t.key} className={`py-6 px-4 align-top ${i === 2 ? "bg-[color:var(--accent-soft)]" : ""}`}>
                      <p className="text-sm text-[color:var(--ink-muted)] max-w-[26ch] leading-snug">{t.note}</p>
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
                </div>
                <h3 className="type-display-3 mb-4">{t.name}</h3>
                <p className="text-sm text-[color:var(--ink-muted)] mb-5">{t.note}</p>
                <ul className="flex flex-col gap-2">
                  {ROWS.map((row) => {
                    const v = row[t.key as "refresh" | "integrate" | "oncall"];
                    return (
                      <li key={row.label} className="flex items-baseline gap-3 text-sm">
                        <span className="num text-xs w-5 text-[color:var(--accent)]">{v === true ? "●" : v === false ? "—" : ""}</span>
                        <span className="text-[color:var(--ink)] flex-1">{row.label}</span>
                        {typeof v === "string" && <span className="num text-xs text-[color:var(--ink-muted)]">{v}</span>}
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
                Refresh and Integrate clients get fixes and new agents one job at a time, the way
                you&apos;d call a plumber. The On-Call retainer rolls fixes, improvements, and
                unlimited new agents into a flat monthly fee, so you stop counting calls.
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
