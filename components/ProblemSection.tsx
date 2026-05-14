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
    color: "bg-slate-100 text-slate-600 border-slate-200",
  },
];

export default function ProblemSection() {
  return (
    <section className="py-16 md:py-24 xl:py-32 px-6 md:px-12 xl:px-20 relative overflow-hidden bg-white industrial-grid">
      <div id="problem" className="absolute top-16 md:top-24 xl:top-32 pointer-events-none" />
      
      {/* Industrial Sophistication */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="max-w-7xl xl:max-w-[90rem] mx-auto relative z-10">
        <AnimatedSection>
          <div className="flex flex-col items-center mb-12 md:mb-16">

            <h2 className="text-3xl sm:text-4xl md:text-7xl xl:text-8xl font-bold text-center text-slate-900 mb-8 md:mb-10 max-w-4xl xl:max-w-6xl mx-auto leading-[1.2] tracking-tighter">
              Ottawa businesses are <br className="hidden md:block" />
              <span className="text-slate-400">bleeding time.</span>
            </h2>
            <p className="text-slate-600 text-center max-w-2xl xl:max-w-4xl text-lg md:text-2xl xl:text-3xl leading-relaxed font-medium opacity-80 px-2">
              You don&apos;t need another vendor. You need <span className="text-accent-3">training and live setup</span> on the agent that finally fixes this.
            </p>
          </div>
        </AnimatedSection>
 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {pains.map((pain, i) => (
            <AnimatedSection key={pain.headline} delay={i * 0.1} variant="scale-in">
              <motion.div 
                className="bg-white border border-slate-200 p-6 sm:p-8 md:p-10 xl:p-12 h-full flex flex-col group overflow-hidden cursor-default shadow-xl relative rounded-2xl sm:rounded-3xl md:rounded-[3rem] hover:border-accent-3/50 transition-all duration-500"
              >
                {/* Industrial Corner Accents */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent-3/[0.03] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center gap-6 mb-10">
                    <div 
                      aria-hidden="true"
                      className="w-16 h-16 rounded-[1.25rem] bg-slate-950 text-white flex items-center justify-center group-hover:bg-accent-3 group-hover:shadow-2xl transition-all duration-500 shrink-0"
                    >
                      <span className="scale-125">{pain.icon}</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{pain.stat}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight tracking-tighter mb-6 group-hover:text-accent-3 transition-colors">{pain.headline}</h3>
                  <p className="text-slate-600 leading-relaxed text-lg md:text-xl group-hover:text-slate-800 transition-colors mb-8 flex-1">{pain.body}</p>
                  

                </div>
                
                {/* Progress bar accent */}
                <div className="absolute bottom-0 left-0 h-1 bg-accent-3 w-0 group-hover:w-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(14,165,233,0.5)]" />
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

  );
}


