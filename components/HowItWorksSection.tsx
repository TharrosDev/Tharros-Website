"use client";

import AnimatedSection from "./AnimatedSection";

const steps = [
  {
    num: "01",
    label: "Discovery",
    duration: "Free, ~30 min",
    body: "We map the business, the biggest time drains, and where a modern site plus an integrated agent have the most impact. Together we scope the build that fits.",
  },
  {
    num: "02",
    label: "Build & integrate",
    duration: "Days to weeks",
    body: "We modernize the website and, on Integrate and On-Call packages, embed an AI agent directly into it. You see progress and sign off at each checkpoint.",
  },
  {
    num: "03",
    label: "Launch & support",
    duration: "Per call · or monthly",
    body: "We publish, monitor, and stay reachable. Refresh and Integrate clients call per job. On-Call clients have us on a monthly retainer for fixes, improvements, and unlimited new agents.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="process" className="rhythm-default bg-[color:var(--surface)]">
      <div className="page-frame">
        <AnimatedSection>
          <div className="flex items-center gap-4 mb-12 md:mb-16">
            <span className="num text-xs text-[color:var(--ink-faint)]">§ 04</span>
            <span className="h-px w-8 bg-[color:var(--rule-strong)]" />
            <span className="type-meta-strong">Process</span>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-12 gap-x-6 gap-y-4 mb-16 md:mb-20">
          <AnimatedSection className="col-span-12 lg:col-span-8">
            <h2 className="type-display-2 max-w-[18ch]">
              From first call to <span className="text-[color:var(--accent)]">live and supported.</span>
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.1} className="col-span-12 lg:col-span-4 lg:pt-2">
            <p className="type-body text-[color:var(--ink-muted)] max-w-[42ch]">
              Three stages. Zero jargon. After launch, choose pay-per-call or the On-Call retainer.
            </p>
          </AnimatedSection>
        </div>

        <div className="relative">
          {/* Vertical pipeline rail */}
          <div className="absolute left-[14px] md:left-[28px] top-2 bottom-2 w-px bg-[color:var(--rule-strong)]" aria-hidden="true" />

          <ol className="flex flex-col">
            {steps.map((step, i) => (
              <AnimatedSection key={step.num} delay={i * 0.1}>
                <li className="grid grid-cols-12 gap-x-6 py-10 md:py-14 border-b border-[color:var(--rule)] last:border-b-0 items-start group">
                  <div className="col-span-12 md:col-span-1 relative">
                    <div className="w-7 h-7 md:w-14 md:h-14 -ml-[6px] md:-ml-[14px] flex items-center justify-center bg-[color:var(--surface)] border border-[color:var(--rule-strong)] group-hover:border-[color:var(--accent)] transition-colors">
                      <span className="num text-xs md:text-sm text-[color:var(--ink)] group-hover:text-[color:var(--accent)] transition-colors">{step.num}</span>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-5 mt-4 md:mt-2">
                    <h3 className="type-display-3">{step.label}</h3>
                    <span className="type-meta block mt-3">{step.duration}</span>
                  </div>
                  <div className="col-span-12 md:col-span-6 mt-4 md:mt-2">
                    <p className="type-body text-[color:var(--ink-muted)] max-w-[56ch]">{step.body}</p>
                  </div>
                </li>
              </AnimatedSection>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
