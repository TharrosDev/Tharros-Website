"use client";

import { motion, useReducedMotion } from "motion/react";
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

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function ProblemSection() {
  const reduce = useReducedMotion();

  return (
    <section
      id="problem"
      className="rhythm-default bg-[color:var(--surface-alt)] border-t border-[color:var(--rule)]"
    >
      <div className="page-frame">
        <SectionEyebrow numeral="§ 01" label="The problem" className="mb-7" />

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease }}
          className="grid gap-3 mb-12 md:mb-16"
        >
          <h2 className="type-display-2 max-w-[14ch]">
            Ottawa businesses are bleeding <span className="accent-text">time.</span>
          </h2>
          <p className="type-lead max-w-[50ch]">
            You don&apos;t need another vendor. You need a modern site, an embedded agent, and a
            number you can call when things change.
          </p>
        </motion.div>

        <ol className="border-t-2 border-[color:var(--ink)]">
          {pains.map((pain, i) => (
            <motion.li
              key={pain.num}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.08, ease }}
              className="group relative grid grid-cols-1 md:grid-cols-[minmax(0,7.5rem)_1fr] gap-x-8 gap-y-3 py-8 md:py-11 border-b border-[color:var(--rule-strong)]"
            >
              <span className="big-num big-num--outline-red text-[4.5rem] md:text-[6.5rem] leading-[0.8] transition-[color,-webkit-text-stroke-color] duration-300 group-hover:[color:var(--red)] group-hover:[-webkit-text-stroke-color:var(--red)]">
                {pain.num}
              </span>

              <div className="md:pt-2">
                <span className="type-meta block text-[color:var(--ink-faint)] mb-3">
                  {pain.when}
                </span>
                <h3 className="type-display-3 max-w-[20ch]">{pain.headline}</h3>

                <div className="relative h-[3px] mt-5 mb-5 max-w-[22rem] bg-[color:var(--rule)] overflow-hidden">
                  <motion.span
                    initial={reduce ? false : { scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.7, delay: 0.15 + i * 0.08, ease }}
                    style={{ originX: 0 }}
                    className="absolute inset-0 red-block"
                  />
                </div>

                <p className="type-body text-[color:var(--ink-muted)] max-w-[46ch]">{pain.body}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
