"use client";

import { motion } from "motion/react";
import AnimatedSection from "./AnimatedSection";

const TIERS = [
  {
    label: "Starter Training",
    title: "The Setup Sprint",
    desc: "A focused two-week training for owner-operators. We pick one agent, run live setup sessions until it's live, and leave you with a working system and the skills to tune it.",
    color: "text-slate-400"
  },
  {
    label: "Team Training",
    title: "The Operator Program",
    desc: "A multi-week training program for scaling local brands. We train you and your team to set up a CRM-connected agent, document your internal playbook, and run weekly working sessions until it sticks.",
    color: "text-slate-600"
  },
  {
    label: "Ongoing Advisory",
    title: "The Fractional AI Lead",
    desc: "A monthly retainer for owners who want a Tharros trainer on speed dial. New agent setups, roadmap reviews, and live troubleshooting as your operation grows.",
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

            <h2 className="text-5xl md:text-7xl xl:text-8xl 3xl:text-9xl 4xl:text-[11rem] font-bold text-slate-900 mb-12 3xl:mb-20 leading-[1.1] tracking-tighter">
              Training shaped for <br />
              <span className="text-slate-400">every stage of growth.</span>
            </h2>
            <p className="text-slate-600 text-center max-w-2xl xl:max-w-4xl 3xl:max-w-[80rem] mx-auto text-lg md:text-2xl xl:text-3xl 3xl:text-4xl 4xl:text-5xl leading-relaxed font-medium opacity-80">
              Pick the training depth that matches where your business actually is.
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
                <h4 className="text-3xl xl:text-4xl 3xl:text-6xl font-bold text-slate-900 tracking-tighter mb-6 3xl:mb-10 leading-none group-hover:text-accent-3 transition-colors duration-500">
                  {tier.title}
                </h4>
                <p className="text-lg xl:text-xl 3xl:text-3xl text-slate-600 leading-relaxed font-medium group-hover:text-slate-900 transition-colors">
                  {tier.desc}
                </p>
                
                {/* Visual Accent */}
                <div className="mt-8 pt-8 3xl:mt-16 3xl:pt-16 border-t border-slate-200 w-16 group-hover:w-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                <div className="absolute -bottom-2 left-0 w-0 h-[2px] 3xl:h-[4px] bg-accent-3 group-hover:w-full transition-all duration-700 shadow-[0_0_10px_rgba(14,165,233,0.3)]" />
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
