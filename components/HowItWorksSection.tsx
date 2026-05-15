"use client";

import AnimatedSection from "./AnimatedSection";

const steps = [
  {
    number: "01",
    headline: "Discovery",
    body: "We map your business, your biggest time drains, and where a modern site and an integrated agent have the most impact. Together we scope the build that fits.",
  },
  {
    number: "02",
    headline: "Build & Integrate",
    body: "We modernize your website and, on Integrate and On-Call packages, embed an AI agent directly into it. You see progress as we go and sign off at each checkpoint.",
  },
  {
    number: "03",
    headline: "Launch & Support",
    body: "We publish, monitor, and stay reachable. Refresh and Integrate clients call us per job. On-Call clients have us on a monthly retainer for fixes, improvements, and unlimited new agents.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-14 sm:py-16 md:py-24 xl:py-32 px-5 sm:px-6 md:px-12 xl:px-20 relative overflow-hidden bg-white industrial-grid">
      <div id="process" className="absolute top-16 md:top-24 xl:top-32 pointer-events-none" />
      {/* Background Sophistication */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="max-w-7xl xl:max-w-[90rem] 3xl:max-w-[120rem] 4xl:max-w-[140rem] mx-auto relative">
        <AnimatedSection>
          <div className="flex flex-col items-center mb-12 sm:mb-16 md:mb-32 3xl:mb-48">

            <h2 className="text-[2rem] leading-[1.1] sm:text-4xl md:text-7xl xl:text-8xl 3xl:text-9xl 4xl:text-[11rem] font-bold text-center text-slate-900 mb-6 sm:mb-8 md:mb-12 3xl:mb-20 max-w-4xl xl:max-w-6xl 3xl:max-w-[100rem] mx-auto md:leading-[1.2] tracking-tighter">
              From first call to <br className="hidden md:block" />
              <span className="text-accent-3">live and supported.</span>
            </h2>
            <p className="text-slate-600 text-center max-w-2xl xl:max-w-4xl 3xl:max-w-[80rem] mx-auto mb-6 sm:mb-10 md:mb-12 3xl:mb-20 text-base leading-relaxed sm:text-lg md:text-2xl xl:text-3xl 3xl:text-4xl 4xl:text-5xl font-medium opacity-80">
              Three stages. Zero jargon. After launch, choose pay-per-call or the On-Call retainer.
            </p>
          </div>
        </AnimatedSection>

        <div className="relative">
          {/* Connecting line - desktop horizontal */}
          <div className="hidden md:block absolute top-[50px] 3xl:top-[80px] left-[15%] right-[15%] h-[1px]">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-slate-200 to-transparent rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-8 lg:gap-10 3xl:gap-20">
            {steps.map((step, i) => (
              <AnimatedSection key={step.number} delay={i * 0.1}>
                <div className="flex flex-col items-center text-center relative group">
                  {/* Step circle */}
                  <div className="relative mb-6 sm:mb-8 3xl:mb-16">
                    <div className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] xl:w-[120px] xl:h-[120px] 3xl:w-[200px] 3xl:h-[200px] rounded-full bg-white border border-slate-200 flex items-center justify-center relative z-10 shadow-xl group-hover:border-accent-3 group-hover:shadow-[0_0_30px_rgba(14,165,233,0.2)] transition-all duration-700">
                      <span className="text-slate-900 font-black text-3xl sm:text-3xl md:text-4xl xl:text-5xl 3xl:text-8xl tracking-tighter">
                        {step.number}
                      </span>
                    </div>
                    {/* Pulsing ring */}
                    <div className="absolute inset-0 rounded-full bg-accent-3/5 animate-ping group-hover:bg-accent-3/10 transition-colors" />
                  </div>

                  {/* Content card */}
                  <div className="bg-white border border-slate-200 p-5 sm:p-7 md:p-10 xl:p-12 3xl:p-24 w-full flex-1 rounded-2xl sm:rounded-3xl md:rounded-[3rem] 3xl:rounded-[5rem] shadow-xl transition-all duration-700 group-hover:border-accent-3/50">
                    <h3 className="text-xl sm:text-2xl md:text-3xl xl:text-4xl 3xl:text-6xl font-bold text-slate-900 mb-3 sm:mb-4 3xl:mb-10 tracking-tighter leading-tight group-hover:text-accent-3 transition-colors">
                      {step.headline}
                    </h3>
                    <p className="text-slate-600 text-base sm:text-lg md:text-xl xl:text-2xl 3xl:text-4xl leading-relaxed font-medium group-hover:text-slate-900 transition-colors">{step.body}</p>

                    <div className="mt-5 pt-5 sm:mt-6 sm:pt-6 3xl:mt-12 3xl:pt-12 border-t border-slate-200 flex justify-center">
                      <div className="flex gap-1.5 3xl:gap-3">
                        {[0, 1, 2].map((dot) => (
                          <div key={dot} className={`w-1.5 h-1.5 3xl:w-3 3xl:h-3 rounded-full ${dot === i ? 'bg-accent-3' : 'bg-slate-300'}`} />
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
