"use client";

import { motion } from "motion/react";
import AnimatedSection from "./AnimatedSection";

const agents = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M4 18 Q14 6 24 18" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <circle cx="14" cy="18" r="2.5" fill="#64748b" />
        <circle cx="4" cy="18" r="2" fill="currentColor" />
        <circle cx="24" cy="18" r="2" fill="currentColor" />
      </svg>
    ),
    name: "Customer Inquiry Agent",
    tagline: "Never let a question go unanswered",
    description:
      "Live setup sessions where we train you to configure an agent that answers services, pricing, availability, and location questions on your website or messaging channel, and knows when to escalate to you.",
    examples: ["Plumbers", "HVAC", "Cleaning services", "Landscapers"],
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="4" y="6" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
        <path d="M9 13h10M9 17h6" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="22" cy="6" r="3.5" fill="currentColor" />
      </svg>
    ),
    name: "Lead Capture Agent",
    tagline: "Turn website visitors into qualified leads",
    description:
      "We train you through the full setup of an agent that greets visitors, asks smart qualifying questions, and routes contact info to your inbox while you're on the job or asleep.",
    examples: ["Lawyers", "Accountants", "Consultants", "Contractors"],
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <circle cx="14" cy="11" r="5" stroke="currentColor" strokeWidth="2" />
        <path d="M5 25c0-5 4-8 9-8s9 3 9 8" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    name: "After-Hours Intake Agent",
    tagline: "Capture every lead, even when you're off the clock",
    description:
      "Step-by-step training to set up an agent that handles inbound messages after business hours, collects job details and urgency, and sends you a clean summary at dawn.",
    examples: ["Emergency trades", "Property managers", "Auto repair", "Clinics"],
  },
];

export default function WhatWeBuildsSection() {
  return (
    <section className="py-16 md:py-24 xl:py-32 px-6 md:px-12 xl:px-20 relative overflow-hidden bg-slate-950 industrial-grid">
      <div id="solutions" className="absolute top-16 md:top-24 xl:top-32 pointer-events-none" />
      
      {/* Industrial Grid Accents */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="max-w-7xl xl:max-w-[90rem] 3xl:max-w-[120rem] 4xl:max-w-[140rem] mx-auto relative z-10">
        <AnimatedSection>
          <div className="text-center mb-12 md:mb-16 3xl:mb-32">

            <h2 className="text-3xl sm:text-4xl md:text-7xl xl:text-8xl 3xl:text-9xl 4xl:text-[11rem] font-bold text-white mb-8 md:mb-12 3xl:mb-20 max-w-4xl xl:max-w-6xl 3xl:max-w-[100rem] mx-auto leading-[1.2] tracking-tighter">
              Agents we&apos;ll <span className="text-slate-500">train you</span> <br className="hidden sm:block" />
              <span className="text-accent-3">to set up yourself.</span>
            </h2>
            <p className="text-slate-300 max-w-2xl xl:max-w-4xl 3xl:max-w-[80rem] mx-auto text-lg md:text-2xl xl:text-3xl 3xl:text-4xl 4xl:text-5xl leading-relaxed font-medium opacity-80 px-2">
              Live training. Hands-on setup sessions for agents and AI tools. Optional website modernization with the agent embedded directly into your site. You leave with the system and the skills to run it.
            </p>
          </div>
        </AnimatedSection>
 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10 3xl:gap-20">
          {agents.map((agent, i) => (
            <AnimatedSection key={agent.name} delay={i * 0.1} variant="scale-in">
              <motion.div 
                className="clean-card h-full flex flex-col group cursor-default shadow-2xl relative overflow-hidden 3xl:p-16 4xl:p-20"
              >
                <div className="flex flex-col gap-8 3xl:gap-16 mb-10 3xl:mb-20 relative z-10">
                  <div className="w-16 h-16 3xl:w-32 3xl:h-32 rounded-[1.25rem] 3xl:rounded-[2.5rem] bg-white border border-white flex items-center justify-center text-slate-950 transition-all duration-500 shrink-0 shadow-2xl">
                    <span className="scale-125 3xl:scale-[2.5]">{agent.icon}</span>
                  </div>
                  <div className="flex flex-col gap-3 3xl:gap-8">
                    <p className="text-[11px] 3xl:text-xl font-black text-accent-3 uppercase tracking-[0.3em]">{agent.tagline}</p>
                    <h3 className="text-2xl sm:text-3xl xl:text-4xl 3xl:text-6xl font-bold text-white tracking-tighter leading-[1.1]">
                      {agent.name}
                    </h3>
                  </div>
                </div>
                
                <p className="text-slate-200 text-lg md:text-xl 3xl:text-3xl leading-relaxed mb-6 3xl:mb-12 relative z-10 flex-1">
                  {agent.description}
                </p>
 
                <div className="relative z-10 pt-5 3xl:pt-10 border-t border-white/10">
                  <div className="flex flex-wrap gap-2.5 3xl:gap-6">
                    {agent.examples.map((ex) => (
                      <span 
                        key={ex} 
                        className="px-4 py-1.5 3xl:px-8 3xl:py-3 bg-white/[0.05] border border-white/20 rounded-xl 3xl:rounded-3xl text-[10px] 3xl:text-base font-black text-white/60 uppercase tracking-[0.2em]"
                      >
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

  );
}
