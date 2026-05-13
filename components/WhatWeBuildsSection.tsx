"use client";

import { motion } from "motion/react";
import AnimatedSection from "./AnimatedSection";

const agents = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M4 18 Q14 6 24 18" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <circle cx="14" cy="18" r="2.5" fill="#1e293b" />
        <circle cx="4" cy="18" r="2" fill="currentColor" />
        <circle cx="24" cy="18" r="2" fill="currentColor" />
      </svg>
    ),
    name: "Customer Inquiry Agent",
    tagline: "Never let a question go unanswered",
    description:
      "Answers your most common questions as soon as possible, services, pricing, availability, location, via your website chat or a messaging channel. Escalates to you when it needs to.",
    examples: ["Plumbers", "HVAC", "Cleaning services", "Landscapers"],
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="4" y="6" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
        <path d="M9 13h10M9 17h6" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="22" cy="6" r="3.5" fill="currentColor" />
      </svg>
    ),
    name: "Lead Capture Agent",
    tagline: "Turn website visitors into qualified leads",
    description:
      "Greets visitors, asks a few smart qualifying questions, and coordinates a follow-up via email or collects contact info automatically, while you're on the job or asleep.",
    examples: ["Lawyers", "Accountants", "Consultants", "Contractors"],
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <circle cx="14" cy="11" r="5" stroke="currentColor" strokeWidth="2" />
        <path d="M5 25c0-5 4-8 9-8s9 3 9 8" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    name: "After-Hours Intake Agent",
    tagline: "Capture every lead, even when you're off the clock",
    description:
      "Handles inbound messages after business hours, collects job details and urgency level, and sends you a clean summary first thing in the morning.",
    examples: ["Emergency trades", "Property managers", "Auto repair", "Clinics"],
  },
];

export default function WhatWeBuildsSection() {
  return (
    <section className="section-padding px-6 md:px-12 xl:px-20 relative overflow-hidden bg-slate-950 industrial-grid">
      <div id="solutions" className="absolute top-16 md:top-24 xl:top-32 pointer-events-none" />
      
      {/* Industrial Grid Accents */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="max-w-7xl xl:max-w-[90rem] mx-auto relative z-10">
        <AnimatedSection>
          <div className="text-center mb-24 md:mb-32">

            <h2 className="text-5xl md:text-7xl xl:text-8xl font-bold text-white mb-12 max-w-4xl xl:max-w-6xl mx-auto leading-[1.1] tracking-tighter">
              Autonomous <span className="text-slate-500">AI Agents.</span> <br />
              <span className="text-accent-3">Industrial performance.</span>
            </h2>
            <p className="text-slate-300 max-w-2xl xl:max-w-4xl mx-auto text-lg md:text-2xl xl:text-3xl leading-relaxed font-medium opacity-80">
              We engineer digital workforce solutions tailored to the operational DNA of your business.
            </p>
          </div>
        </AnimatedSection>
 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 xl:gap-20">
          {agents.map((agent, i) => (
            <AnimatedSection key={agent.name} delay={i * 0.1} variant="scale-in">
              <motion.div 
                className="clean-card p-10 md:p-12 xl:p-14 h-full flex flex-col group cursor-default shadow-2xl relative overflow-hidden"
              >
                {/* Visual Depth Accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent-3/[0.05] rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex flex-col gap-8 mb-10 relative z-10">
                  <div className="w-16 h-16 rounded-[1.25rem] bg-white/[0.03] border border-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-slate-950 group-hover:border-white transition-all duration-500 shrink-0 shadow-2xl">
                    <span className="scale-125">{agent.icon}</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <p className="text-[11px] font-black text-accent-3 uppercase tracking-[0.3em]">{agent.tagline}</p>
                    <h3 className="text-3xl xl:text-4xl font-bold text-white tracking-tighter leading-[1.1]">
                      {agent.name}
                    </h3>
                  </div>
                </div>
                
                <p className="text-slate-400 text-lg md:text-xl leading-relaxed mb-12 relative z-10 flex-1 group-hover:text-slate-200 transition-colors">
                  {agent.description}
                </p>
 
                <div className="mt-auto relative z-10 pt-8 border-t border-white/[0.03]">
                  <div className="flex flex-wrap gap-2.5">
                    {agent.examples.map((ex) => (
                      <span 
                        key={ex} 
                        className="px-4 py-1.5 bg-white/[0.02] border border-white/5 rounded-xl text-[10px] font-black text-white/30 uppercase tracking-[0.2em] group-hover:border-white/20 group-hover:text-white/60 transition-all"
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
