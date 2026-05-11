"use client";

import AnimatedSection from "./AnimatedSection";

const steps = [
  {
    number: "01",
    headline: "Consult",
    body: "We spend time understanding your business, your biggest time drains, and which repetitive conversations are costing you the most. No sales pitch, just listening.",
  },
  {
    number: "02",
    headline: "Build",
    body: "We build and configure your agent in 1-2 weeks. You review it, request changes, and we refine until it sounds exactly like your business. No code on your end.",
  },
  {
    number: "03",
    headline: "Launch",
    body: "We deploy it to your website or messaging channel. We monitor the first two weeks, tune responses, and hand you a system that runs itself.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="process" className="py-24 md:py-28 px-6 md:px-12 relative overflow-hidden bg-bg">
      <div className="max-w-6xl mx-auto relative">
        <AnimatedSection>
          <p className="section-label mb-4 text-center">How it works</p>
          <h2 className="text-3xl md:text-5xl font-bold text-center text-text mb-5 max-w-3xl mx-auto leading-tight">
            From conversation to{" "}
            <span className="accent-text">live in under 2 weeks</span>
          </h2>
          <p className="text-subdued text-center max-w-xl mx-auto mb-16 md:mb-20 text-base md:text-lg leading-relaxed">
            Three steps. No jargon. No complex enterprise rollout.
          </p>
        </AnimatedSection>

        <div className="relative">
          {/* Connecting line - desktop horizontal */}
          <div className="hidden md:block absolute top-[44px] left-[16.67%] right-[16.67%] h-[2px]">
            <div className="w-full h-full bg-border rounded-full" />
          </div>
          {/* Connecting line - mobile vertical */}
          <div className="md:hidden absolute left-1/2 -translate-x-1/2 top-[88px] bottom-[88px] w-[2px]">
            <div className="w-full h-full bg-border rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {steps.map((step, i) => (
              <AnimatedSection key={step.number} delay={i * 0.12} variant="scale-in">
                <div className="flex flex-col items-center text-center relative">
                  {/* Step circle */}
                  <div className="relative mb-6 md:mb-8">
                    <div className="w-[88px] h-[88px] rounded-full bg-white border-2 border-border flex items-center justify-center relative z-10 shadow-sm">
                      <span className="text-accent-3 font-bold text-2xl md:text-3xl">
                        {step.number}
                      </span>
                    </div>
                  </div>

                  {/* Content card */}
                  <div className="clean-card p-6 w-full" style={{ transform: "none" }}>
                    <h3 className="text-xl md:text-2xl font-bold text-text mb-3">
                      {step.headline}
                    </h3>
                    <p className="text-subdued text-sm leading-relaxed">{step.body}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
