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
    <section className="section-padding px-6 md:px-12 xl:px-20 relative overflow-hidden bg-[#fafafa]">
      <div id="solutions" className="absolute top-16 md:top-24 xl:top-32 pointer-events-none" />
      
      {/* Industrial Grid Accents */}
      <div className="absolute inset-0 industrial-grid opacity-[0.2] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent opacity-100" />
      
      <div className="max-w-7xl xl:max-w-[90rem] mx-auto relative z-10">
        <AnimatedSection>
          <div className="text-center mb-16 md:mb-24">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/5 border border-slate-900/10 mb-6">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Service_Catalog_v1.0</span>
            </div>
            <h2 className="text-4xl md:text-6xl xl:text-7xl font-bold text-slate-900 mb-8 max-w-4xl xl:max-w-5xl mx-auto leading-[1] tracking-tighter">
              Autonomous <span className="text-slate-400">AI Agents.</span> <br />
              <span className="accent-text">Industrial performance.</span>
            </h2>
            <p className="text-slate-500 max-w-2xl xl:max-w-3xl mx-auto text-lg md:text-xl xl:text-2xl leading-relaxed font-medium">
              We don&apos;t just build bots. We engineer digital workforce solutions tailored to the operational DNA of your business.
            </p>
          </div>
        </AnimatedSection>
 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 xl:gap-12">
          {agents.map((agent, i) => (
            <AnimatedSection key={agent.name} delay={i * 0.1} variant="scale-in">
              <motion.div 
                whileHover={{ 
                  y: -8,
                  borderColor: "rgba(59, 130, 246, 0.2)",
                  boxShadow: "0 40px 80px -20px rgba(0,0,0,0.06)",
                  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
                }}
                className="bg-white border border-slate-200 p-8 md:p-10 xl:p-12 h-full flex flex-col group cursor-default shadow-sm transition-all duration-500 rounded-[2.5rem] relative overflow-hidden"
              >
                {/* Visual Depth Accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent-3/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex flex-col gap-6 mb-8 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 group-hover:bg-accent-3 group-hover:text-white group-hover:border-accent-3 transition-all duration-500 shrink-0 shadow-sm">
                    <span className="scale-125">{agent.icon}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-[10px] font-black text-accent-3 uppercase tracking-[0.2em]">{agent.tagline}</p>
                    <h3 className="text-2xl xl:text-3xl font-bold text-slate-900 tracking-tighter leading-none">
                      {agent.name}
                    </h3>
                  </div>
                </div>
                
                <p className="text-slate-500 text-base md:text-lg leading-relaxed mb-10 relative z-10">
                  {agent.description}
                </p>
 
                <div className="mt-auto relative z-10">
                  <div className="flex flex-wrap gap-2">
                    {agent.examples.map((ex) => (
                      <span 
                        key={ex} 
                        className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-bold text-slate-400 uppercase tracking-widest group-hover:bg-white group-hover:border-slate-200 transition-colors"
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
