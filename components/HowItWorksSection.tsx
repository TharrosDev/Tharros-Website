"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useSpring, useReducedMotion } from "motion/react";
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
    body: "We modernize the website and, on The Integrate, embed an AI agent directly into it. You see progress and sign off at each checkpoint.",
  },
  {
    num: "03",
    label: "Launch & support",
    duration: "Per call · or monthly",
    body: "We publish, monitor, and stay reachable. Refresh clients call per job. On-Call and Integrate clients have us on a monthly retainer: On-Call for site fixes and edits, Integrate also for the agent and unlimited new agents.",
  },
];

export default function HowItWorksSection() {
  const railRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 65%", "end 55%"],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <section id="process" className="rhythm-default bg-[color:var(--surface)]">
      <div className="page-frame">
        <SectionEyebrow numeral="§ 02" label="Process" />

        <AnimatedSection className="mb-12 md:mb-16">
          <h2 className="type-display-2 max-w-[18ch]">
            From first call to <span className="accent-text">live and supported.</span>
          </h2>
        </AnimatedSection>

        <div className="relative" ref={railRef}>
          {/* Base pipeline rail */}
          <div className="absolute left-[15px] md:left-[27px] top-2 bottom-2 w-[2px] bg-[color:var(--rule-strong)]" aria-hidden="true" />
          {/* Red fill that tracks scroll through the section */}
          <motion.div
            className="absolute left-[15px] md:left-[27px] top-2 bottom-2 w-[2px] bg-[color:var(--red)] origin-top"
            style={{ scaleY: reduce ? 1 : fill }}
            aria-hidden="true"
          />

          <ol className="flex flex-col border-t-2 border-[color:var(--ink)]">
            {steps.map((step, i) => (
              <Step key={step.num} step={step} delay={i * 0.1} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Step({
  step,
  delay,
}: {
  step: { num: string; label: string; duration: string; body: string };
  delay: number;
}) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const lit = useInView(nodeRef, { once: true, margin: "-45% 0px -45% 0px" });

  return (
    <AnimatedSection delay={delay}>
      <li className="grid grid-cols-12 gap-x-6 py-10 md:py-14 border-b border-[color:var(--rule-strong)] items-start group">
        <div className="col-span-12 md:col-span-1">
          <div
            ref={nodeRef}
            className="w-9 h-9 md:w-14 md:h-14 -ml-[7px] md:-ml-[27px] flex items-center justify-center transition-colors duration-500"
            style={{
              backgroundColor: lit ? "var(--red)" : "var(--surface)",
              borderWidth: 2,
              borderStyle: "solid",
              borderColor: lit ? "var(--red)" : "var(--ink)",
            }}
          >
            <span
              className="num text-sm md:text-base font-semibold transition-colors duration-500"
              style={{ color: lit ? "oklch(99% 0.002 25)" : "var(--ink)" }}
            >
              {step.num}
            </span>
          </div>
        </div>
        <div className="col-span-12 md:col-span-4 mt-4 md:mt-1">
          <h3 className="type-display-3">{step.label}</h3>
          <span className="type-meta block mt-3">{step.duration}</span>
        </div>
        <div className="col-span-12 md:col-span-7 mt-4 md:mt-1.5">
          <p className="type-body text-[color:var(--ink-muted)] max-w-[56ch]">{step.body}</p>
        </div>
      </li>
    </AnimatedSection>
  );
}
