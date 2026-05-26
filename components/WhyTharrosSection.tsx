"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import AnimatedSection from "./AnimatedSection";
import SectionEyebrow from "./SectionEyebrow";
import SplitReveal from "./SplitReveal";

const pillars = [
  {
    num: "01",
    label: "Ottawa-local",
    body: "We know Kanata trades companies and Centretown law offices. The site and the agent are tuned to local context, local pricing questions, and the real shape of small business in this city.",
  },
  {
    num: "02",
    label: "One team, end-to-end",
    body: "One team handles your website, your AI agent, and the integrations between them. We work across a diversified stack of tools, coordinated under a single point of contact. No handoffs, no finger-pointing between vendors.",
  },
  {
    num: "03",
    label: "A number you can call",
    body: "Put us on a monthly retainer and we're on a flat fee for fixes and edits, with The Integrate adding the agent and unlimited new builds. Or stick with The Refresh and pay per call. Either way, you reach a person.",
  },
];

export default function WhyTharrosSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const nums = gsap.utils.toArray<HTMLElement>(".why-num", root.current);
        nums.forEach((n) =>
          gsap.fromTo(
            n,
            { yPercent: 14 },
            {
              yPercent: -14,
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
    <section ref={root} id="why" className="rhythm-breath bg-[color:var(--surface)] border-t border-[color:var(--rule)]">
      <div className="page-frame">
        <SectionEyebrow numeral="§ 03" label="Why Tharros" />

        <div className="grid grid-cols-12 gap-x-6 gap-y-4 mb-12 md:mb-16">
          <SplitReveal as="h2" className="type-display-2 max-w-[18ch] col-span-12 lg:col-span-8" start="top 85%">
            Built for small <br className="hidden md:block" />
            <span className="accent-text">business owners.</span>
          </SplitReveal>
          <AnimatedSection delay={0.1} className="col-span-12 lg:col-span-4 lg:self-end lg:pb-2">
            <p className="type-body text-[color:var(--ink-muted)] max-w-[42ch]">
              Keep it Local, Keep it Canadian.
            </p>
          </AnimatedSection>
        </div>

        {/* Asymmetric composition: a dominant lead pillar beside a stacked pair.
            Deliberately not three equal columns, to break the site's thirds rhythm. */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border-t-2 border-[color:var(--ink)]">
          <AnimatedSection className="lg:col-span-7 relative py-10 md:py-14 lg:pr-14 border-b lg:border-b-0 border-[color:var(--rule)]">
            <span
              className="why-num big-num big-num--red block leading-[0.78] select-none"
              style={{ fontSize: "clamp(5rem, 11vw, 11rem)" }}
              aria-hidden="true"
            >
              {pillars[0].num}
            </span>
            <h3 className="type-display-2 mt-6 mb-5 max-w-[12ch]">{pillars[0].label}</h3>
            <p className="type-lead text-[color:var(--ink-muted)] max-w-[44ch]">{pillars[0].body}</p>
          </AnimatedSection>

          <div className="lg:col-span-5 flex flex-col lg:border-l border-[color:var(--rule)]">
            {pillars.slice(1).map((p, i) => (
              <AnimatedSection
                key={p.num}
                delay={0.1 + i * 0.1}
                className={`relative py-10 md:py-12 lg:pl-12 flex-1 ${
                  i === 0 ? "border-b border-[color:var(--rule)]" : ""
                }`}
              >
                <span
                  className="why-num big-num big-num--red block leading-[0.8] select-none"
                  style={{ fontSize: "clamp(3.5rem, 5vw, 5rem)" }}
                  aria-hidden="true"
                >
                  {p.num}
                </span>
                <h3 className="type-display-3 mt-4 mb-3">{p.label}</h3>
                <p className="type-body text-[color:var(--ink-muted)] max-w-[42ch]">{p.body}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
