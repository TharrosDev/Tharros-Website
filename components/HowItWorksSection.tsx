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
    <section id="process" className="py-12 md:py-16 px-6 md:px-12 relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="max-w-7xl mx-auto relative">
        <AnimatedSection>
          <p className="section-label mb-6 text-center">How it works</p>
          <h2 className="text-4xl md:text-6xl font-bold text-center text-text mb-8 max-w-4xl mx-auto leading-[1.1] tracking-tight">
            From conversation to{" "}
            <span className="accent-text">live in under 2 weeks</span>
          </h2>
          <p className="text-subdued text-center max-w-2xl mx-auto mb-16 md:mb-24 text-lg md:text-xl leading-relaxed">
            Three steps. No jargon. No complex enterprise rollout.
          </p>
        </AnimatedSection>

        <div className="relative">
          {/* Connecting line - desktop horizontal */}
          <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-[2px]">
            <div className="w-full h-full bg-slate-100 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            {steps.map((step, i) => (
              <AnimatedSection key={step.number}>
                <div className="flex flex-col items-center text-center relative group">
                  {/* Step circle */}
                  <div className="relative mb-10">
                    <div className="w-[120px] h-[120px] rounded-full bg-white border border-slate-100 flex items-center justify-center relative z-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] group-hover:border-accent-3 group-hover:shadow-xl group-hover:shadow-accent-3/5 transition-all duration-500">
                      <span className="text-accent-3 font-bold text-3xl md:text-4xl">
                        {step.number}
                      </span>
                    </div>
                  </div>

                  {/* Content card */}
                  <div className="clean-card p-10 md:p-12 w-full flex-1 hover:shadow-xl transition-all duration-500">
                    <h3 className="text-2xl md:text-3xl font-bold text-text mb-5 leading-tight">
                      {step.headline}
                    </h3>
                    <p className="text-subdued text-base md:text-lg leading-relaxed">{step.body}</p>
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
