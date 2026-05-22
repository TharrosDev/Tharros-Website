"use client";

import AnimatedSection from "./AnimatedSection";

const factors = [
  { num: "A", title: "Build scope",        body: "From a clean website refresh to a full site with multiple agents wired into your operation." },
  { num: "B", title: "Integration depth",  body: "How deep the agent wires in. Site embed, CRM sync, intake automation, messaging channels." },
  { num: "C", title: "After-launch model", body: "Pay-per-call for fixes and new agents, or a flat-rate On-Call retainer that rolls everything in." },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="rhythm-default bg-[color:var(--surface)]">
      <div className="page-frame">
        <AnimatedSection>
          <div className="flex items-center gap-4 mb-12 md:mb-16">
            <span className="num text-[11px] text-[color:var(--ink-faint)]">§ 06</span>
            <span className="h-px w-8 bg-[color:var(--rule-strong)]" />
            <span className="type-meta-strong">Pricing</span>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-12 gap-x-6 gap-y-4 mb-16 md:mb-20">
          <AnimatedSection className="col-span-12 lg:col-span-8">
            <h2 className="type-display-2 max-w-[18ch]">
              Pricing as tailored <span className="text-[color:var(--ink-muted)]">as the work.</span>
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.1} className="col-span-12 lg:col-span-4 lg:pt-2">
            <p className="type-body text-[color:var(--ink-muted)] max-w-[42ch]">
              Mapped strictly to the scope, the integration depth, and whether you want us on call
              after launch.
            </p>
          </AnimatedSection>
        </div>

        <AnimatedSection delay={0.15}>
          <div className="border-t border-[color:var(--rule-strong)] grid grid-cols-1 md:grid-cols-3">
            {factors.map((f) => (
              <div key={f.num} className="py-8 md:py-10 md:px-8 md:first:pl-0 md:last:pr-0 border-b border-[color:var(--rule)] md:border-b-0 md:border-l first:border-l-0 border-[color:var(--rule)]">
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="num text-xs text-[color:var(--accent)]">{f.num}</span>
                  <span className="type-meta">Factor</span>
                </div>
                <h3 className="type-display-3 mb-3">{f.title}</h3>
                <p className="type-body text-[color:var(--ink-muted)] max-w-[36ch]">{f.body}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.25}>
          <div className="mt-16 md:mt-20 grid grid-cols-12 gap-x-6 border-t border-[color:var(--rule)] pt-10">
            <div className="col-span-12 md:col-span-4">
              <span className="type-meta">How we price</span>
              <h3 className="type-display-3 mt-3">Why no fixed list?</h3>
            </div>
            <div className="col-span-12 md:col-span-8 mt-6 md:mt-0">
              <p className="type-lead">
                A clean website refresh for a solo lawyer is a different job than a site plus three
                agents and a monthly retainer for a plumbing team. After a free discovery call we
                send a firm, no-obligation proposal scoped to your business.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <a href="/brief" className="btn-primary">Book a discovery call</a>
                <a href="mailto:tharrosdev@gmail.com" className="btn-ghost">tharrosdev@gmail.com</a>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
