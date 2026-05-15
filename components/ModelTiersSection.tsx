"use client";

import AnimatedSection from "./AnimatedSection";

const TIERS = [
  {
    label: "Starter Build",
    title: "The Refresh",
    duration: "Project-based",
    desc: "A modern website built for Ottawa small businesses. We update your design, your copy, and your structure so your front door looks like the operation behind it.",
    includes: ["Website Modernization", "Project-based", "Per-Call Support"],
    color: "text-slate-400"
  },
  {
    label: "Build + Integrate",
    title: "The Integrate",
    duration: "Project-based",
    desc: "Everything in the Refresh, plus an AI agent embedded directly into your site. We build, integrate, and hand you a live system. Fixes and additional agents after launch are billed per call.",
    includes: ["Website Modernization", "Agent Integration", "Project-based", "Per-Call Support"],
    color: "text-slate-600"
  },
  {
    label: "Build + Retainer",
    title: "The On-Call",
    duration: "Project + Monthly Retainer",
    desc: "Everything in the Integrate, plus a monthly retainer. We're on call to fix, improve, and build new agents, and to keep your site evolving. Unlimited new agents while the retainer runs.",
    includes: ["Website Modernization", "Agent Integration", "Unlimited New Agents", "Monthly Retainer"],
    color: "text-accent-3"
  }
] as const;

export default function ModelTiersSection() {
  return (
    <section className="section-padding px-5 sm:px-6 md:px-12 xl:px-20 relative overflow-hidden bg-white industrial-grid">
      <div id="tiers" className="absolute top-16 md:top-24 xl:top-32 pointer-events-none" />

      {/* Industrial Sophistication */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="max-w-7xl xl:max-w-[90rem] 3xl:max-w-[120rem] 4xl:max-w-[140rem] mx-auto relative z-10">
        <div className="text-center mb-12 sm:mb-16 md:mb-32 3xl:mb-48">
          <AnimatedSection>

            <h2 className="text-[2rem] leading-[1.1] sm:text-4xl md:text-7xl xl:text-8xl 3xl:text-9xl 4xl:text-[11rem] font-bold text-slate-900 mb-6 sm:mb-8 md:mb-12 3xl:mb-20 md:leading-[1.1] tracking-tighter">
              Three builds. <br className="hidden md:block" />
              <span className="text-slate-400">Pick yours.</span>
            </h2>
            <p className="text-slate-600 text-center max-w-2xl xl:max-w-4xl 3xl:max-w-[80rem] mx-auto text-base leading-relaxed sm:text-lg md:text-2xl xl:text-3xl 3xl:text-4xl 4xl:text-5xl font-medium opacity-80">
              Pick the build that matches where your business is. After launch, fixes and new agents are billed per call &mdash; or roll it all into the On-Call retainer.
            </p>
          </AnimatedSection>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12 md:gap-8 lg:gap-12 3xl:gap-24">
          {TIERS.map((tier, i) => (
            <AnimatedSection key={tier.title} delay={i * 0.1} variant="fade-up">
              <div className="flex flex-col h-full group relative 3xl:p-12">
                <span className={`text-[11px] 3xl:text-lg font-black uppercase tracking-[0.4em] ${tier.color} mb-4 sm:mb-5 3xl:mb-10 block`}>
                  {tier.label}
                </span>
                <h4 className="text-3xl sm:text-3xl xl:text-4xl 3xl:text-6xl font-bold text-slate-900 tracking-tighter mb-3 3xl:mb-6 leading-none group-hover:text-accent-3 transition-colors duration-500">
                  {tier.title}
                </h4>
                <span className="text-[10px] 3xl:text-base font-black uppercase tracking-[0.3em] text-slate-500 mb-5 sm:mb-6 3xl:mb-10 block">
                  {tier.duration}
                </span>
                <p className="text-base sm:text-lg xl:text-xl 3xl:text-3xl text-slate-600 leading-relaxed font-medium group-hover:text-slate-900 transition-colors">
                  {tier.desc}
                </p>

                <div className="mt-6 sm:mt-auto pt-6 sm:pt-8 3xl:pt-16 flex flex-wrap gap-2 sm:gap-2.5 3xl:gap-6">
                  {tier.includes.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1.5 sm:px-4 3xl:px-8 3xl:py-3 bg-slate-100 border border-slate-200 rounded-lg sm:rounded-xl 3xl:rounded-3xl text-[9px] sm:text-[10px] 3xl:text-base font-black text-slate-600 uppercase tracking-[0.2em] group-hover:bg-accent-3/10 group-hover:border-accent-3/30 group-hover:text-slate-900 transition-colors"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                {/* Visual Accent */}
                <div className="mt-5 pt-5 sm:mt-6 sm:pt-6 3xl:mt-12 3xl:pt-12 border-t border-slate-200 w-16 group-hover:w-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                <div className="absolute -bottom-2 left-0 w-0 h-[2px] 3xl:h-[4px] bg-accent-3 group-hover:w-full transition-all duration-700 shadow-[0_0_10px_rgba(14,165,233,0.3)]" />
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.2}>
          <div className="mt-12 sm:mt-16 md:mt-24 3xl:mt-32 max-w-4xl xl:max-w-5xl 3xl:max-w-[90rem] mx-auto">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl md:rounded-[2rem] 3xl:rounded-[3rem] p-5 sm:p-7 md:p-10 3xl:p-20 relative overflow-hidden">
              <span className="text-[9px] md:text-[10px] 3xl:text-lg font-black uppercase tracking-[0.4em] text-accent-3 mb-3 sm:mb-4 3xl:mb-8 block">
                After Launch
              </span>
              <h3 className="text-xl sm:text-2xl md:text-3xl xl:text-4xl 3xl:text-5xl font-bold text-slate-900 tracking-tighter mb-3 sm:mb-4 3xl:mb-8 leading-tight">
                Pay-per-call, or roll it into a retainer.
              </h3>
              <p className="text-slate-600 text-base md:text-lg xl:text-xl 3xl:text-3xl leading-relaxed font-medium">
                Refresh and Integrate clients get fixes and new agents the way you&apos;d call a plumber &mdash; one job, one invoice. The On-Call retainer rolls fixes, improvements, and unlimited new agents into a flat monthly fee, so you stop counting calls.
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
