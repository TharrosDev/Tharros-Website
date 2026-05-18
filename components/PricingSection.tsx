"use client";

import AnimatedSection from "./AnimatedSection";
import Magnetic from "./Magnetic";

const pricingFactors = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    title: "Build Scope",
    description: "From a clean website refresh to a full site with multiple agents wired directly into your operation."
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    title: "Integration Depth",
    description: "How deep the agent wires in — site embed, CRM sync, intake automation, messaging channels."
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8Z" />
        <path d="M10 12h.01" />
        <path d="M14 12h.01" />
        <path d="M6 12h.01" />
      </svg>
    ),
    title: "After-Launch Model",
    description: "Pay-per-call for fixes and new agents, or a flat-rate On-Call retainer that rolls everything in."
  }
];

export default function PricingSection() {
  return (
    <section className="py-14 sm:py-16 md:py-24 xl:py-32 px-5 sm:px-6 md:px-12 xl:px-20 relative overflow-hidden bg-white industrial-grid">
      <div id="pricing" className="absolute top-16 md:top-24 xl:top-32 pointer-events-none" />

      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="max-w-6xl xl:max-w-7xl 3xl:max-w-[110rem] 4xl:max-w-[130rem] mx-auto relative">

        <div className="text-center max-w-3xl xl:max-w-5xl 3xl:max-w-[90rem] mx-auto mb-12 sm:mb-16 md:mb-32 3xl:mb-48">
          <AnimatedSection>

            <h2 className="text-[2rem] leading-[1.1] sm:text-4xl md:text-7xl xl:text-8xl 3xl:text-9xl 4xl:text-[11rem] font-bold text-slate-900 mb-6 sm:mb-8 md:mb-12 3xl:mb-20 md:leading-[1.2] tracking-tighter">
              Pricing as tailored <br className="hidden md:block" />
              <span className="text-accent-3">as the work.</span>
            </h2>
            <p className="text-slate-600 text-base leading-relaxed sm:text-lg md:text-2xl xl:text-3xl 3xl:text-4xl 4xl:text-5xl font-medium opacity-80">
              Pricing as custom as the build. Mapped strictly to the scope, the integration depth, and whether you want us on call after launch.
            </p>
          </AnimatedSection>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 md:gap-6 xl:gap-8 3xl:gap-16 mb-12 sm:mb-16 md:mb-20 3xl:mb-32">
          {pricingFactors.map((factor, i) => (
            <AnimatedSection key={factor.title} delay={i * 0.1} variant="scale-in">
              <div className="bg-white border border-slate-200 p-5 sm:p-7 md:p-10 xl:p-12 3xl:p-24 flex flex-col h-full group relative overflow-hidden shadow-xl rounded-2xl sm:rounded-3xl md:rounded-[3rem] 3xl:rounded-[5rem] hover:border-accent-3/50 transition-all duration-500">
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent-3/[0.03] rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-14 h-14 sm:w-16 sm:h-16 3xl:w-32 3xl:h-32 rounded-2xl sm:rounded-[1.25rem] 3xl:rounded-[2.5rem] bg-slate-950 border border-slate-900/10 flex items-center justify-center mb-6 sm:mb-8 3xl:mb-16 group-hover:bg-accent-3 group-hover:text-white group-hover:border-accent-3 transition-all duration-700 shadow-xl">
                  <span className="text-white group-hover:scale-110 transition-transform 3xl:scale-150">{factor.icon}</span>
                </div>
                <h3 className="text-xl sm:text-2xl xl:text-3xl 3xl:text-5xl font-bold text-slate-900 mb-4 sm:mb-6 3xl:mb-10 tracking-tighter group-hover:text-accent-3 transition-colors">{factor.title}</h3>
                <p className="text-slate-600 text-base sm:text-lg xl:text-xl 3xl:text-3xl leading-relaxed font-medium group-hover:text-slate-900 transition-colors">{factor.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.3}>
          <div className="max-w-5xl md:max-w-6xl xl:max-w-[80rem] 3xl:max-w-[110rem] 4xl:max-w-[130rem] mx-auto">
            <div className="bg-white border border-slate-200 px-5 py-8 sm:px-6 sm:py-10 md:px-16 md:py-12 3xl:px-32 3xl:py-24 rounded-2xl sm:rounded-[2rem] md:rounded-[3rem] 3xl:rounded-[5rem] text-center relative overflow-hidden group shadow-2xl hover:-translate-y-1 hover:scale-[1.01] hover:border-accent-3/50 transition-all duration-500">
              {/* Subtle inner glow */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:32px_32px] 3xl:[background-size:64px_64px]" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-4 mb-5 sm:mb-6 3xl:mb-12 px-4 py-1.5 sm:px-5 3xl:px-10 3xl:py-3 rounded-full bg-slate-950/5 border border-slate-900/5">
                  <span className="text-[9px] 3xl:text-base font-black text-slate-900/40 uppercase tracking-[0.4em] sm:tracking-[0.5em]">How We Price</span>
                </div>

                <h3 className="text-xl sm:text-2xl md:text-3xl xl:text-4xl 3xl:text-6xl 4xl:text-7xl font-bold text-slate-900 mb-4 sm:mb-6 3xl:mb-10 tracking-tighter leading-tight">
                  Why no fixed price list?
                </h3>
                <p className="text-slate-600 text-base sm:text-base md:text-lg xl:text-xl 3xl:text-3xl 4xl:text-4xl leading-relaxed mb-7 sm:mb-8 3xl:mb-16 max-w-4xl 3xl:max-w-[90rem] mx-auto font-medium opacity-80">
                  A clean website refresh for a solo lawyer is a different job than a site plus three agents and a monthly retainer for a plumbing team.
                  After a free discovery call we send a firm, no-obligation proposal scoped to your business.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 3xl:gap-12">
                  <Magnetic strength={0.2} className="inline-block w-full sm:w-auto">
                    <a
                      href="/brief"
                      aria-label="Request a custom website and AI agent build quote"
                      className="primary-button md:px-12 md:py-6 xl:px-14 xl:py-7 3xl:px-24 3xl:py-12 text-sm md:text-lg xl:text-xl 3xl:text-3xl 4xl:text-4xl w-full sm:w-auto relative overflow-hidden group shadow-2xl"
                    >
                      <span className="relative z-10">Book a Discovery Call</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                    </a>
                  </Magnetic>
                </div>
                <p className="mt-8 sm:mt-10 3xl:mt-20 text-slate-400 text-[9px] sm:text-[10px] 3xl:text-lg font-bold uppercase tracking-[0.2em] flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
                  <span>Free discovery call</span>
                  <span className="hidden sm:inline text-slate-300">&bull;</span>
                  <a href="mailto:tharrosdev@gmail.com" className="hover:text-accent-3 underline transition-colors">Direct Inquiry</a>
                  <span className="hidden sm:inline text-slate-300">&bull;</span>
                  <span>Keep it Local, Keep it Canadian</span>
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>

      </div>
    </section>
  );
}
