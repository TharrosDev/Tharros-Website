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
    <section id="process" className="section-padding px-6 md:px-12 xl:px-20 relative overflow-hidden bg-white industrial-grid">
      {/* Background Sophistication */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="max-w-7xl xl:max-w-[90rem] mx-auto relative">
        <AnimatedSection>
          <div className="flex flex-col items-center mb-24 md:mb-32">

            <h2 className="text-5xl md:text-7xl xl:text-8xl font-bold text-center text-slate-900 mb-12 max-w-4xl xl:max-w-6xl mx-auto leading-[1.1] tracking-tighter">
              From conversation to <br className="hidden md:block" />
              <span className="text-accent-3">live in under 2 weeks.</span>
            </h2>
            <p className="text-slate-600 text-center max-w-2xl xl:max-w-4xl mx-auto mb-10 md:mb-12 text-lg md:text-2xl xl:text-3xl leading-relaxed font-medium opacity-80">
              Three stages. Zero jargon. No complex enterprise rollout.
            </p>
          </div>
        </AnimatedSection>

        <div className="relative">
          {/* Connecting line - desktop horizontal */}
          <div className="hidden md:block absolute top-[50px] left-[15%] right-[15%] h-[1px]">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-slate-200 to-transparent rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 xl:gap-20">
            {steps.map((step, i) => (
              <AnimatedSection key={step.number} delay={i * 0.1}>
                <div className="flex flex-col items-center text-center relative group">
                  {/* Step circle */}
                  <div className="relative mb-10">
                    <div className="w-[100px] h-[100px] xl:w-[120px] xl:h-[120px] rounded-full bg-white border border-slate-200 flex items-center justify-center relative z-10 shadow-xl group-hover:border-accent-3 group-hover:shadow-[0_0_30px_rgba(14,165,233,0.2)] transition-all duration-700">
                      <span className="text-slate-900 font-black text-3xl md:text-4xl xl:text-5xl tracking-tighter">
                        {step.number}
                      </span>
                    </div>
                    {/* Pulsing ring */}
                    <div className="absolute inset-0 rounded-full bg-accent-3/5 animate-ping group-hover:bg-accent-3/10 transition-colors" />
                  </div>

                  {/* Content card */}
                  <div className="bg-white border border-slate-200 p-10 md:p-12 xl:p-14 w-full flex-1 rounded-[3rem] shadow-xl transition-all duration-700 group-hover:border-accent-3/50">
                    <h3 className="text-2xl md:text-3xl xl:text-4xl font-bold text-slate-900 mb-6 tracking-tighter leading-tight group-hover:text-accent-3 transition-colors">
                      {step.headline}
                    </h3>
                    <p className="text-slate-600 text-lg md:text-xl xl:text-2xl leading-relaxed font-medium group-hover:text-slate-900 transition-colors">{step.body}</p>
                    
                    <div className="mt-8 pt-8 border-t border-slate-200 flex justify-center">
                      <div className="flex gap-1.5">
                        {[0, 1, 2].map((dot) => (
                          <div key={dot} className={`w-1 h-1 rounded-full ${dot === i ? 'bg-accent-3' : 'bg-slate-300'}`} />
                        ))}
                      </div>
                    </div>
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
