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
    <section className="section-padding px-6 md:px-12 xl:px-20 relative overflow-hidden bg-white">
      <div id="solutions" className="absolute top-12 md:top-20 pointer-events-none" />
      {/* Decorative Flow */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-slate-50 to-transparent opacity-50" />
      <div className="max-w-7xl xl:max-w-[90rem] mx-auto relative">
        <AnimatedSection>
          <div className="text-center mb-10 md:mb-16">
            <p className="section-label mb-4">What we build</p>
            <h2 className="text-3xl md:text-5xl xl:text-6xl font-bold text-text mb-6 max-w-4xl xl:max-w-5xl mx-auto leading-[1.1] tracking-tight">
              Autonomous <span className="text-slate-400">AI Agents.</span> Real outcomes.{" "}
              <span className="accent-text">No corporate fluff.</span>
            </h2>
            <p className="text-subdued max-w-2xl xl:max-w-3xl mx-auto text-base md:text-lg xl:text-xl leading-relaxed">
              Every AI Agent is custom-engineered to solve the high-impact operational gaps in your Ottawa business.
            </p>
          </div>
        </AnimatedSection>
 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 xl:gap-10">
          {agents.map((agent, i) => (
            <AnimatedSection key={agent.name}>
              <motion.div 
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
                className="clean-card p-6 md:p-8 xl:p-10 h-full flex flex-col group cursor-default shadow-sm hover:shadow-lg hover:border-accent-3/20 transition-all duration-500"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-accent-3 group-hover:bg-accent-3/10 group-hover:text-accent-3 transition-colors duration-500 shrink-0">
                    <span className="scale-90">{agent.icon}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="section-label text-[10px] font-bold tracking-[0.1em]">{agent.tagline}</p>
                    <h3 className="text-lg md:text-xl font-bold text-text leading-tight">
                      {agent.name}
                    </h3>
                  </div>
                </div>
                
                <p className="text-subdued text-sm md:text-base leading-relaxed mb-6">
                  {agent.description}
                </p>
 
                <div className="mt-auto">
                  <div className="h-px bg-slate-100 w-full mb-4" />
                  <div className="flex flex-wrap gap-1.5">
                    {agent.examples.map((ex) => (
                      <span 
                        key={ex} 
                        className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[10px] font-bold text-slate-500 uppercase tracking-wider"
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
