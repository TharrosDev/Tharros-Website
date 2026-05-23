"use client";

import AnimatedSection from "./AnimatedSection";
import SectionEyebrow from "./SectionEyebrow";

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
        <SectionEyebrow numeral="§ 04" label="Process" />

        <AnimatedSection className="mb-12 md:mb-16">
          <h2 className="type-display-2 max-w-[18ch]">
            From first call to <span className="text-[color:var(--accent)]">live and supported.</span>
          </h2>
        </AnimatedSection>

        <ol className="flex flex-col border-t border-[color:var(--rule)]">
          {steps.map((step, i) => (
            <AnimatedSection key={step.num} delay={i * 0.1}>
              <li className="grid grid-cols-12 gap-x-6 py-10 md:py-14 border-b border-[color:var(--rule)] items-start group">
                <div className="col-span-12 md:col-span-1">
                  <div className="w-9 h-9 md:w-12 md:h-12 flex items-center justify-center border border-[color:var(--rule-strong)] group-hover:border-[color:var(--accent)] transition-colors">
                    <span className="num text-xs md:text-sm text-[color:var(--ink)] group-hover:text-[color:var(--accent)] transition-colors">{step.num}</span>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-4 mt-4 md:mt-1.5">
                  <h3 className="type-display-3">{step.label}</h3>
                  <span className="type-meta block mt-3">{step.duration}</span>
                </div>
                <div className="col-span-12 md:col-span-7 mt-4 md:mt-1.5">
                  <p className="type-body text-[color:var(--ink-muted)] max-w-[56ch]">{step.body}</p>
                </div>
              </li>
            </AnimatedSection>
          ))}
        </ol>
      </div>
    </section>
  );
}
