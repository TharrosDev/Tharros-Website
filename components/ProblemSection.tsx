"use client";

import AnimatedSection from "./AnimatedSection";

const pains = [
  {
    num: "01",
    when: "After hours",
    headline: "Missed calls become missed revenue.",
    body: "A lead that calls at 8pm and gets voicemail calls your competitor at 8:01pm.",
  },
  {
    num: "02",
    when: "Every day",
    headline: "The same questions, on repeat.",
    body: "Hours. Service area. Pricing. Your time is worth more than answering those one at a time.",
  },
  {
    num: "03",
    when: "Hours per week",
    headline: "Admin that never ends.",
    body: "Inquiry triage, intake forms, follow-up emails: the paperwork quietly eats your week.",
  },
];

export default function ProblemSection() {
  return (
    <section id="problem" className="rhythm-default bg-[color:var(--surface)]">
      <div className="page-frame">
        <AnimatedSection>
          <div className="flex items-center gap-4 mb-12 md:mb-16">
            <span className="num text-xs text-[color:var(--ink-faint)]">§ 01</span>
            <span className="h-px w-8 bg-[color:var(--rule-strong)]" />
            <span className="type-meta-strong">The problem</span>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-12 gap-x-6 gap-y-4 mb-12 md:mb-16">
          <AnimatedSection className="col-span-12 lg:col-span-8">
            <h2 className="type-display-2 max-w-[14ch]">
              Ottawa businesses are bleeding <span className="text-[color:var(--accent)]">time.</span>
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.1} className="col-span-12 lg:col-span-4 lg:self-end lg:pb-2">
            <p className="type-body text-[color:var(--ink-muted)] max-w-[42ch]">
              You don&apos;t need another vendor. You need a modern site, an embedded agent, and a
              number you can call when things change.
            </p>
          </AnimatedSection>
        </div>

        <div className="border-t border-[color:var(--rule)]">
          {pains.map((pain, i) => (
            <AnimatedSection key={pain.num} delay={i * 0.06}>
              <div className="grid grid-cols-12 gap-x-6 py-10 md:py-14 border-b border-[color:var(--rule)] items-start group">
                <div className="col-span-12 md:col-span-1 mb-3 md:mb-0">
                  <span className="num text-sm text-[color:var(--ink-muted)] group-hover:text-[color:var(--accent)] transition-colors">{pain.num}</span>
                </div>
                <div className="col-span-12 md:col-span-2">
                  <span className="type-meta">{pain.when}</span>
                </div>
                <h3 className="col-span-12 md:col-span-4 type-display-3 mt-3 md:mt-0">
                  {pain.headline}
                </h3>
                <p className="col-span-12 md:col-span-5 type-body text-[color:var(--ink-muted)] mt-3 md:mt-0 max-w-[44ch]">
                  {pain.body}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
