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
    title: "Training Scope",
    description: "From a single setup sprint on a website concierge to multi-month training on agents wired into your CRM."
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    title: "Team Depth",
    description: "How many people we train and how deep the curriculum goes, from a solo owner to a small ops team."
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
    title: "Ongoing Advisory",
    description: "One-off training, a fixed-length setup engagement, or a monthly retainer for ongoing tuning and Q&A."
  }
];

export default function PricingSection() {
  return (
    <section className="py-16 md:py-24 xl:py-32 px-6 md:px-12 xl:px-20 relative overflow-hidden bg-white industrial-grid">
      <div id="pricing" className="absolute top-16 md:top-24 xl:top-32 pointer-events-none" />
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="max-w-6xl xl:max-w-7xl 3xl:max-w-[110rem] 4xl:max-w-[130rem] mx-auto relative">
        
        <div className="text-center max-w-3xl xl:max-w-5xl 3xl:max-w-[90rem] mx-auto mb-16 md:mb-32 3xl:mb-48">
          <AnimatedSection>

            <h2 className="text-3xl sm:text-4xl md:text-7xl xl:text-8xl 3xl:text-9xl 4xl:text-[11rem] font-bold text-slate-900 mb-8 md:mb-12 3xl:mb-20 leading-[1.2] tracking-tighter">
              Tailored Training for <br className="hidden md:block" />
              <span className="text-accent-3">Tailored Businesses.</span>
            </h2>
            <p className="text-slate-600 text-lg md:text-2xl xl:text-3xl 3xl:text-4xl 4xl:text-5xl leading-relaxed font-medium opacity-80 px-2">
              Our pricing is as custom as the training we run. Mapped strictly to the setup time we spend with you and the skill we leave behind.
            </p>
          </AnimatedSection>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-6 xl:gap-8 3xl:gap-16 mb-16 md:mb-20 3xl:mb-32">
          {pricingFactors.map((factor, i) => (
            <AnimatedSection key={factor.title} delay={i * 0.1} variant="scale-in">
              <div className="bg-white border border-slate-200 p-6 sm:p-8 md:p-10 xl:p-12 3xl:p-24 flex flex-col h-full group relative overflow-hidden shadow-xl rounded-2xl sm:rounded-3xl md:rounded-[3rem] 3xl:rounded-[5rem] hover:border-accent-3/50 transition-all duration-500">
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent-3/[0.03] rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-16 h-16 3xl:w-32 3xl:h-32 rounded-[1.25rem] 3xl:rounded-[2.5rem] bg-slate-950 border border-slate-900/10 flex items-center justify-center mb-8 3xl:mb-16 group-hover:bg-accent-3 group-hover:text-white group-hover:border-accent-3 transition-all duration-700 shadow-xl">
                  <span className="text-white group-hover:scale-110 transition-transform 3xl:scale-150">{factor.icon}</span>
                </div>
                <h3 className="text-2xl xl:text-3xl 3xl:text-5xl font-bold text-slate-900 mb-6 3xl:mb-10 tracking-tighter group-hover:text-accent-3 transition-colors">{factor.title}</h3>
                <p className="text-slate-600 text-lg xl:text-xl 3xl:text-3xl leading-relaxed font-medium group-hover:text-slate-900 transition-colors">{factor.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.3}>
          <div className="max-w-5xl md:max-w-6xl xl:max-w-[80rem] 3xl:max-w-[110rem] 4xl:max-w-[130rem] mx-auto">
            <div className="bg-white border border-slate-200 px-6 py-10 md:px-16 md:py-12 3xl:px-32 3xl:py-24 rounded-2xl sm:rounded-[2rem] md:rounded-[3rem] 3xl:rounded-[5rem] text-center relative overflow-hidden group shadow-2xl hover:-translate-y-1 hover:scale-[1.01] hover:border-accent-3/50 transition-all duration-500">
              {/* Subtle inner glow */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:32px_32px] 3xl:[background-size:64px_64px]" />
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-4 mb-6 3xl:mb-12 px-5 py-1.5 3xl:px-10 3xl:py-3 rounded-full bg-slate-950/5 border border-slate-900/5">
                  <span className="text-[9px] 3xl:text-base font-black text-slate-900/40 uppercase tracking-[0.5em]">How We Price</span>
                </div>
                
                <h3 className="text-2xl md:text-3xl xl:text-4xl 3xl:text-6xl 4xl:text-7xl font-bold text-slate-900 mb-6 3xl:mb-10 tracking-tighter leading-tight">
                  Why no fixed price list?
                </h3>
                <p className="text-slate-600 text-sm md:text-lg xl:text-xl 3xl:text-3xl 4xl:text-4xl leading-relaxed mb-8 3xl:mb-16 max-w-4xl 3xl:max-w-[90rem] mx-auto font-medium opacity-80">
                  Training a solo lawyer through their first setup is a different job than training a plumbing team on three agents.
                  After a free briefing we send a firm, no-obligation proposal scoped to your business.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 3xl:gap-12">
                  <Magnetic strength={0.2}>
                    <a
                      href="/intake"
                      aria-label="Request a custom AI training and setup quote"
                      className="primary-button px-10 py-5 md:px-12 md:py-6 xl:px-14 xl:py-7 3xl:px-24 3xl:py-12 text-xs md:text-lg xl:text-xl 3xl:text-3xl 4xl:text-4xl w-full sm:w-auto relative overflow-hidden group shadow-2xl"
                    >
                      <span className="relative z-10">Request Briefing</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                    </a>
                  </Magnetic>
                </div>
                <p className="mt-10 3xl:mt-20 text-slate-400 text-[10px] 3xl:text-lg font-bold uppercase tracking-[0.2em]">
                  Free briefing &bull; <a href="mailto:tharrosdev@gmail.com" className="hover:text-accent-3 underline transition-colors">Direct Inquiry</a> &bull; Keep it Local, Keep it Canadian
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>

      </div>
    </section>
  );
}
