"use client";

import AnimatedSection from "./AnimatedSection";
import SectionEyebrow from "./SectionEyebrow";
import SplitReveal from "./SplitReveal";

const builds = [
  {
    num: "01",
    name: "Modern & fast",
    body: "A clean, current rebuild that loads quickly. No bloat, no dated templates.",
  },
  {
    num: "02",
    name: "Mobile in mind",
    body: "Tuned to look sharp and work smoothly on phones and tablets, not just desktop.",
  },
  {
    num: "03",
    name: "Found on Google",
    body: "Built to show up in search from day one, not buried on page ten.",
  },
  {
    num: "04",
    name: "Fully managed",
    body: "We host, secure, and keep it updated on reliable infrastructure. Nothing for you to run.",
  },
] as const;

export default function WebsiteBuildsSection() {
  return (
    <section id="websites" className="bg-[color:var(--surface)] pt-28 md:pt-32 pb-[var(--rhythm-tight)]">
      <div className="page-frame">
        <SectionEyebrow numeral="§ 00" label="What we build" />

        <div className="grid grid-cols-12 gap-x-6 gap-y-8 pb-12 md:pb-16">
          <SplitReveal as="h2" className="type-display-2 max-w-[16ch] col-span-12 lg:col-span-7" start="top 85%">
            Your website,<br />
            <span className="accent-text">rebuilt right.</span>
          </SplitReveal>
          <AnimatedSection delay={0.1} className="col-span-12 lg:col-span-5 lg:self-end lg:pb-2">
            <p className="type-lead">
              Custom websites for Ottawa businesses, and the foundation every agent we build plugs
              into.
            </p>
          </AnimatedSection>
        </div>

        <ol className="grid grid-cols-1 sm:grid-cols-2 border-t-2 border-[color:var(--ink)]">
          {builds.map((b, i) => {
            const col0 = i % 2 === 0;
            const border = [
              "",
              "border-t sm:border-t-0 sm:border-l",
              "border-t",
              "border-t sm:border-l",
            ][i];
            return (
              <AnimatedSection
                key={b.num}
                delay={i * 0.1}
                className={`flex flex-col py-9 ${col0 ? "sm:pr-8" : "sm:pl-8"} border-[color:var(--rule)] ${border}`}
              >
                <span className="big-num big-num--red text-[4.5rem] md:text-[5.5rem] leading-[0.8] block">
                  {b.num}
                </span>
                <h3 className="type-display-3 mt-6">{b.name}</h3>
                <p className="type-body text-[color:var(--ink-muted)] mt-3 max-w-[34ch]">{b.body}</p>
              </AnimatedSection>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
