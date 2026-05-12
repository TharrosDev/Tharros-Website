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
    <section id="pricing" className="section-padding px-6 md:px-12 xl:px-20 relative overflow-hidden bg-white">
      {/* Decorative Flow */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-slate-50 to-transparent opacity-50" />
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-[-10%] left-[10%] w-[40%] h-[40%] bg-accent-3/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[10%] w-[30%] h-[30%] bg-accent-3/5 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-6xl xl:max-w-7xl mx-auto relative">
        
        <div className="text-center max-w-3xl xl:max-w-4xl mx-auto mb-16 md:mb-20 xl:mb-28">
          <AnimatedSection>
            <p className="section-label mb-4">Investment</p>
            <h2 className="text-3xl md:text-6xl xl:text-7xl font-bold text-text mb-6 leading-tight">
              Tailored Pricing for <span className="accent-text">Tailored Results</span>
            </h2>
            <p className="text-subdued text-base md:text-xl xl:text-2xl leading-relaxed">
              We don&apos;t believe in generic subscriptions. 
              Our pricing is as custom as the agents we build—mapped strictly to the value they create for your business.
            </p>
          </AnimatedSection>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 xl:gap-12 mb-16 xl:mb-20">
          {pricingFactors.map((factor, i) => (
            <AnimatedSection key={factor.title} delay={i * 0.1} variant="scale-in">
              <div className="clean-card p-8 xl:p-12 flex flex-col h-full group hover:border-accent-3/30 transition-all duration-500">
                <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-accent-3/10 group-hover:text-accent-3 transition-all duration-500">
                  {factor.icon}
                </div>
                <h3 className="text-xl xl:text-2xl font-bold text-text mb-3">{factor.title}</h3>
                <p className="text-subdued text-sm xl:text-base leading-relaxed">{factor.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.3}>
          <div className="max-w-4xl xl:max-w-5xl mx-auto">
            <div className="bg-surface/40 backdrop-blur-sm border border-border/60 p-6 md:p-12 xl:p-16 rounded-[1.5rem] md:rounded-[2rem] text-center relative overflow-hidden group">
              {/* Subtle inner glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent-3/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative z-10">
                <h3 className="text-xl md:text-2xl xl:text-3xl font-bold text-text mb-4">
                  Why no fixed price list?
                </h3>
                <p className="text-subdued text-base md:text-lg xl:text-xl leading-relaxed mb-10 max-w-2xl xl:max-w-3xl mx-auto">
                  Because an AI agent for a boutique law firm has different requirements than one for a high-volume plumbing contractor. 
                  We provide a firm, no-obligation quote immediately following our initial consultation.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Magnetic strength={0.2}>
                    <a
                      href="/intake"
                      aria-label="Request a custom AI automation quote"
                      className="primary-button px-10 py-5 text-lg w-full sm:w-auto"
                    >
                      Get your custom quote
                    </a>
                  </Magnetic>
                </div>
                <p className="mt-6 text-muted text-sm font-medium">
                  Free consultation &bull; <a href="mailto:Magnus.Abdelnour@gmail.com" className="hover:text-accent-3 underline">Email us directly</a> &bull; Ottawa-based
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>

      </div>
    </section>
  );
}
