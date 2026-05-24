"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "motion/react";
import AnimatedSection from "./AnimatedSection";
import SectionEyebrow from "./SectionEyebrow";

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

// Content steps rightward per item (stakes escalating) while the numbered
// markers stay pinned to the left rail.
const step = ["md:pl-0", "md:pl-[6%]", "md:pl-[12%]"];

export default function ProblemSection() {
  const railRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 70%", "end 60%"],
  });
  const drain = useSpring(scrollYProgress, { stiffness: 110, damping: 30, restDelta: 0.001 });

  return (
    <section id="problem" className="rhythm-default bg-[color:var(--surface)]">
      <div className="page-frame">
        <SectionEyebrow numeral="§ 01" label="The problem" />

        <div className="grid grid-cols-12 gap-x-6 gap-y-4 mb-16 md:mb-24">
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

        {/* Cascade with a draining cobalt rail down the left */}
        <div className="relative" ref={railRef}>
          <div className="absolute left-[7px] top-1 bottom-1 w-px bg-[color:var(--rule)]" aria-hidden="true" />
          <motion.div
            className="absolute left-[7px] top-1 bottom-1 w-px bg-[color:var(--accent)] origin-top"
            style={{ scaleY: reduce ? 1 : drain, opacity: 0.7 }}
            aria-hidden="true"
          />

          <ol className="flex flex-col">
            {pains.map((pain, i) => (
              <AnimatedSection key={pain.num} delay={i * 0.08}>
                <li className="relative grid grid-cols-12 gap-x-6 py-9 md:py-12 items-baseline group pl-6 md:pl-10">
                  <span
                    className="absolute top-[2.9rem] left-[1.5px] hidden md:block w-3 h-3 border border-[color:var(--rule-strong)] bg-[color:var(--surface)] group-hover:border-[color:var(--accent)] transition-colors"
                    aria-hidden="true"
                  />
                  <div className="col-span-12 md:col-span-2">
                    <span className="num text-sm text-[color:var(--ink-muted)] group-hover:text-[color:var(--accent)] transition-colors">{pain.num}</span>
                    <span className="type-meta block mt-2">{pain.when}</span>
                  </div>
                  <div className={`col-span-12 md:col-span-10 grid grid-cols-1 md:grid-cols-10 gap-x-6 ${step[i]}`}>
                    <h3 className="md:col-span-6 type-display-3 mt-3 md:mt-0">
                      {pain.headline}
                    </h3>
                    <p className="md:col-span-4 type-body text-[color:var(--ink-muted)] mt-3 md:mt-0">
                      {pain.body}
                    </p>
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
