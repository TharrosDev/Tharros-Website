"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { gsap, useGSAP } from "@/lib/gsap";
import SectionEyebrow from "./SectionEyebrow";
import SplitReveal from "./SplitReveal";

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
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const nums = gsap.utils.toArray<HTMLElement>(".problem-num", root.current);
        nums.forEach((n) =>
          gsap.fromTo(
            n,
            { yPercent: 10 },
            {
              yPercent: -10,
              ease: "none",
              scrollTrigger: { trigger: n, start: "top bottom", end: "bottom top", scrub: true },
            },
          ),
        );
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="problem"
      className="rhythm-default bg-[color:var(--surface-alt)] border-t border-[color:var(--rule)]"
    >
      <div className="page-frame">
        <SectionEyebrow numeral="§ 01" label="The problem" className="mb-7" />

        <div className="grid gap-4 mb-12 md:mb-16">
          <SplitReveal as="h2" className="type-display-2 max-w-[14ch]" start="top 85%">
            Ottawa businesses are bleeding <span className="accent-text">time.</span>
          </SplitReveal>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, delay: 0.15, ease }}
            className="type-lead max-w-[50ch]"
          >
            You don&apos;t need another vendor. You need a modern site, an embedded agent, and a
            number you can call when things change.
          </motion.p>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-3 gap-x-8 lg:gap-x-12 gap-y-12 border-t-2 border-[color:var(--ink)] pt-10 md:pt-14">
          {pains.map((pain, i) => (
            <motion.li
              key={pain.num}
              initial={reduce ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.65, delay: i * 0.08, ease }}
              className="group relative flex flex-col"
            >
              <span className="problem-num big-num big-num--outline-red text-[4.5rem] md:text-[6.5rem] leading-[0.8] transition-[color,-webkit-text-stroke-color] duration-300 group-hover:[color:var(--red)] group-hover:[-webkit-text-stroke-color:var(--red)]">
                {pain.num}
              </span>

              <div className="mt-4">
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
