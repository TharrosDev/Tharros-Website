"use client";

import AnimatedSection from "./AnimatedSection";

const TIERS = [
  {
    label: "Starter Training",
    title: "The Setup Sprint",
    duration: "1 - 3 Days",
    desc: "A focused 1-3 day training for owner-operators. We pick one agent or AI tool, run live setup sessions until it's live, and leave you with a working system and the skills to tune it.",
    includes: ["Agent Setup", "Live Training", "Setup Playbook"],
    color: "text-slate-400"
  },
  {
    label: "Team Training",
    title: "The Operator Program",
    duration: "1 Week",
    desc: "A one-week training program for scaling local brands. We train you and your team on agents and AI tools, modernize your website, and embed the agent directly into it. You walk away with an internal playbook you can keep using.",
    includes: ["Team Training", "Website Modernization", "Agent Embed", "Internal Playbook"],
    color: "text-slate-600"
  },
  {
    label: "Training, Build & Retainer",
    title: "The Fractional AI Lead",
    duration: "1 - 2 Weeks + Retainer",
    desc: "A 1-2 week intensive of agent and AI tool training, a full website modernization with the agent integrated across your site, and then an ongoing retainer. New agent setups, roadmap reviews, and live troubleshooting as your operation grows.",
    includes: ["Intensive Training", "Website Modernization", "Agent Integration", "Ongoing Retainer"],
    color: "text-accent-3"
  }
] as const;

export default function ModelTiersSection() {
  return (
    <section className="section-padding px-6 md:px-12 xl:px-20 relative overflow-hidden bg-white industrial-grid">
      <div id="tiers" className="absolute top-16 md:top-24 xl:top-32 pointer-events-none" />
      
      {/* Industrial Sophistication */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      
      <div className="max-w-7xl xl:max-w-[90rem] 3xl:max-w-[120rem] 4xl:max-w-[140rem] mx-auto relative z-10">
        <div className="text-center mb-24 md:mb-32 3xl:mb-48">
          <AnimatedSection>

            <h2 className="text-3xl sm:text-4xl md:text-7xl xl:text-8xl 3xl:text-9xl 4xl:text-[11rem] font-bold text-slate-900 mb-8 md:mb-12 3xl:mb-20 leading-[1.2] md:leading-[1.1] tracking-tighter">
              Training shaped for <br className="hidden md:block" />
              <span className="text-slate-400">every stage of growth.</span>
            </h2>
            <p className="text-slate-600 text-center max-w-2xl xl:max-w-4xl 3xl:max-w-[80rem] mx-auto text-lg md:text-2xl xl:text-3xl 3xl:text-4xl 4xl:text-5xl leading-relaxed font-medium opacity-80">
              Pick the training depth that matches where your business actually is. Operator and Fractional packages add website modernization and direct agent integration.
            </p>
          </AnimatedSection>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 3xl:gap-24">
          {TIERS.map((tier, i) => (
            <AnimatedSection key={tier.title} delay={i * 0.1} variant="fade-up">
              <div className="flex flex-col h-full group relative 3xl:p-12">
                <span className={`text-[11px] 3xl:text-lg font-black uppercase tracking-[0.4em] ${tier.color} mb-5 3xl:mb-10 block`}>
                  {tier.label}
                </span>
                <h4 className="text-3xl xl:text-4xl 3xl:text-6xl font-bold text-slate-900 tracking-tighter mb-3 3xl:mb-6 leading-none group-hover:text-accent-3 transition-colors duration-500">
                  {tier.title}
                </h4>
                <span className="text-[10px] 3xl:text-base font-black uppercase tracking-[0.3em] text-slate-500 mb-6 3xl:mb-10 block">
                  {tier.duration}
                </span>
                <p className="text-lg xl:text-xl 3xl:text-3xl text-slate-600 leading-relaxed font-medium group-hover:text-slate-900 transition-colors">
                  {tier.desc}
                </p>

                <div className="mt-auto pt-8 3xl:pt-16 flex flex-wrap gap-2.5 3xl:gap-6">
                  {tier.includes.map((item) => (
                    <span
                      key={item}
                      className="px-4 py-1.5 3xl:px-8 3xl:py-3 bg-slate-100 border border-slate-200 rounded-xl 3xl:rounded-3xl text-[10px] 3xl:text-base font-black text-slate-600 uppercase tracking-[0.2em] group-hover:bg-accent-3/10 group-hover:border-accent-3/30 group-hover:text-slate-900 transition-colors"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                {/* Visual Accent */}
                <div className="mt-6 pt-6 3xl:mt-12 3xl:pt-12 border-t border-slate-200 w-16 group-hover:w-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                <div className="absolute -bottom-2 left-0 w-0 h-[2px] 3xl:h-[4px] bg-accent-3 group-hover:w-full transition-all duration-700 shadow-[0_0_10px_rgba(14,165,233,0.3)]" />
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
