"use client";

import Link from "next/link";
import AnimatedSection from "./AnimatedSection";
import Magnetic from "./Magnetic";

const pricingFactors = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    title: "Solution Complexity",
    description: "From simple website concierges to deep integrations with CRMs and business workflows."
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    title: "Knowledge Depth",
    description: "The volume of training data—from basic FAQs to complex technical manuals."
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
    title: "Channel Support",
    description: "Deploying to Web, SMS, WhatsApp, or all at once with unified intelligence."
  }
];

export default function PricingSection() {
  return (
    <section className="py-16 md:py-24 xl:py-32 px-6 md:px-12 xl:px-20 relative overflow-hidden bg-white industrial-grid">
      <div id="pricing" className="absolute top-16 md:top-24 xl:top-32 pointer-events-none" />
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="max-w-6xl xl:max-w-7xl mx-auto relative">
        
        <div className="text-center max-w-3xl xl:max-w-5xl mx-auto mb-16 md:mb-32">
          <AnimatedSection>

            <h2 className="text-4xl sm:text-5xl md:text-7xl xl:text-8xl font-bold text-slate-900 mb-8 md:mb-12 leading-[1.1] tracking-tighter">
              Tailored Pricing for <br className="hidden md:block" />
              <span className="text-accent-3">Tailored Results.</span>
            </h2>
            <p className="text-slate-600 text-lg md:text-2xl xl:text-3xl leading-relaxed font-medium opacity-80 px-2">
              We don&apos;t believe in generic subscriptions. 
              Our pricing is as custom as the agents we build—mapped strictly to the value they create for your business.
            </p>
          </AnimatedSection>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 xl:gap-20 mb-16 md:mb-32">
          {pricingFactors.map((factor, i) => (
            <AnimatedSection key={factor.title} delay={i * 0.1} variant="scale-in">
              <div className="bg-white border border-slate-200 p-8 md:p-12 xl:p-14 flex flex-col h-full group relative overflow-hidden shadow-xl rounded-3xl md:rounded-[3rem] hover:border-accent-3/50 transition-all duration-500">
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent-3/[0.03] rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-16 h-16 rounded-[1.25rem] bg-slate-950 border border-slate-900/10 flex items-center justify-center mb-8 group-hover:bg-accent-3 group-hover:text-white group-hover:border-accent-3 transition-all duration-700 shadow-xl">
                  <span className="text-white group-hover:scale-110 transition-transform">{factor.icon}</span>
                </div>
                <h3 className="text-2xl xl:text-3xl font-bold text-slate-900 mb-6 tracking-tighter group-hover:text-accent-3 transition-colors">{factor.title}</h3>
                <p className="text-slate-600 text-lg xl:text-xl leading-relaxed font-medium group-hover:text-slate-900 transition-colors">{factor.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.3}>
          <div className="max-w-4xl xl:max-w-6xl mx-auto">
            <div className="bg-white border border-slate-200 p-8 md:p-16 xl:p-24 rounded-3xl md:rounded-[3rem] text-center relative overflow-hidden group shadow-2xl">
              {/* Subtle inner glow */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:32px_32px]" />
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-4 mb-10 px-6 py-2 rounded-full bg-slate-950/5 border border-slate-900/5">
                  <span className="text-[10px] font-black text-slate-900/30 uppercase tracking-[0.5em]">Investment_Justification</span>
                </div>
                
                <h3 className="text-3xl md:text-4xl xl:text-5xl font-bold text-slate-900 mb-8 tracking-tighter leading-tight">
                  Why no fixed price list?
                </h3>
                <p className="text-slate-600 text-lg md:text-2xl xl:text-3xl leading-relaxed mb-12 max-w-4xl mx-auto font-medium opacity-80">
                  Because an AI agent for a boutique law firm has different requirements than one for a high-volume plumbing contractor. 
                  We provide a firm, no-obligation quote following our initial briefing.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                  <Magnetic strength={0.2}>
                    <a
                      href="/intake"
                      aria-label="Request a custom AI automation quote"
                      className="primary-button px-12 py-6 md:px-16 md:py-8 xl:px-20 xl:py-10 text-sm md:text-xl xl:text-2xl w-full sm:w-auto relative overflow-hidden group shadow-2xl"
                    >
                      <span className="relative z-10">Request Briefing</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                    </a>
                  </Magnetic>
                </div>
                <p className="mt-12 text-slate-400 text-sm font-bold uppercase tracking-[0.2em]">
                  Free consultation &bull; <a href="mailto:tharrosdev@gmail.com" className="hover:text-accent-3 underline transition-colors">Direct Inquiry</a> &bull; Ottawa Node
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>

      </div>
    </section>
  );
}
