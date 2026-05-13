"use client";

import { motion } from "motion/react";
import AnimatedSection from "./AnimatedSection";

const pains = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    stat: "After hours",
    headline: "Missed calls = missed revenue",
    body: "A lead that calls at 8pm and gets voicemail calls your competitor at 8:01pm. Your business loses money while you sleep.",
    status: "CRITICAL_LOSS",
    color: "bg-red-50 text-red-600 border-red-100",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 2l4 4-4 4" />
        <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
        <path d="M7 22l-4-4 4-4" />
        <path d="M21 13v1a4 4 0 0 1-4 4H3" />
      </svg>
    ),
    stat: "Every day",
    headline: "The same questions, over and over",
    body: "\"What are your hours?\" \"Do you service my area?\" \"How much does it cost?\" Your time is worth more than answering these on repeat.",
    status: "RECURRING_DRAIN",
    color: "bg-amber-50 text-amber-600 border-amber-100",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      </svg>
    ),
    stat: "Hours per week",
    headline: "Admin that never ends",
    body: "Inquiry management, intake forms, follow-up emails, the paperwork that comes with running a small business quietly eats your week.",
    status: "EFFICIENCY_GAP",
    color: "bg-slate-100 text-slate-600 border-slate-200",
  },
];

export default function ProblemSection() {
  return (
    <section className="pt-4 md:pt-16 pb-6 md:pb-24 px-6 md:px-12 xl:px-20 relative overflow-hidden bg-slate-950 industrial-grid">
      <div id="problem" className="absolute top-16 md:top-24 xl:top-32 pointer-events-none" />
      
      {/* Industrial Sophistication */}
      <div className="scanline" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl xl:max-w-[90rem] mx-auto relative z-10">
        <AnimatedSection>
          <div className="flex flex-col items-center mb-16 md:mb-24">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
              <span className="w-1 h-1 rounded-full bg-accent-3 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Inefficiency_Audit</span>
            </div>
            <h2 className="text-4xl md:text-6xl xl:text-7xl font-bold text-center text-white mb-8 max-w-4xl xl:max-w-5xl leading-[1] tracking-tighter">
              Ottawa businesses are <br className="hidden md:block" />
              <span className="text-slate-500">bleeding time.</span>
            </h2>
            <p className="text-slate-300 text-center max-w-2xl xl:max-w-3xl text-lg md:text-xl xl:text-2xl leading-relaxed font-medium">
              Software is just a tool. Our <span className="text-accent-3">Autonomous Agents</span> are a workforce that never sleeps, never forgets, and never misses a lead.
            </p>
          </div>
        </AnimatedSection>
 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 xl:gap-12">
          {pains.map((pain, i) => (
            <AnimatedSection key={pain.headline} delay={i * 0.1} variant="scale-in">
              <motion.div 
                whileHover={{ 
                  y: -8,
                  borderColor: "rgba(59, 130, 246, 0.4)",
                  backgroundColor: "rgba(15, 23, 42, 0.6)",
                  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
                }}
                className="relative bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 md:p-10 xl:p-12 rounded-[2.5rem] h-full flex flex-col group overflow-hidden cursor-default transition-all duration-500 shadow-2xl"
              >
                {/* Industrial Corner Accents */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-accent-3/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-4 right-4 text-[8px] font-black text-white/10 group-hover:text-accent-3/40 transition-colors tracking-widest uppercase">
                  LOSS_ID: 0{i + 1}
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div 
                      aria-hidden="true"
                      className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-accent-3 group-hover:text-white group-hover:border-accent-3 transition-all duration-500 shrink-0 shadow-lg"
                    >
                      <span className="scale-110">{pain.icon}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-accent-3 uppercase tracking-widest">{pain.status}</span>
                      </div>
                      <span className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.2em]">{pain.stat}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-bold text-white leading-tight tracking-tight mb-4 group-hover:text-accent-3 transition-colors">{pain.headline}</h3>
                  <p className="text-slate-400 leading-relaxed text-base md:text-lg group-hover:text-slate-300 transition-colors">{pain.body}</p>
                </div>
                
                {/* Progress bar accent */}
                <div className="absolute bottom-0 left-0 h-1 bg-accent-3 w-0 group-hover:w-full transition-all duration-700 ease-out" />
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}


