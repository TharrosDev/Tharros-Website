"use client";

import { motion } from "motion/react";
import AnimatedSection from "./AnimatedSection";

const pains = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-3">
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
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-3">
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
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-3">
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
    <section id="problem" className="py-16 md:py-32 px-6 md:px-12 relative overflow-hidden bg-white">
      {/* Subtle Background Accents */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="max-w-7xl mx-auto relative">
        <AnimatedSection>
          <div className="flex flex-col items-center mb-16 md:mb-24">
            <span className="section-label mb-6">Process Inefficiencies</span>
            <h2 className="text-4xl md:text-6xl font-bold text-center text-text mb-8 max-w-4xl leading-[1.1] tracking-tight">
              Ottawa businesses should focus on{" "}
              <span className="text-accent-3">growth, not manual busywork</span>
            </h2>
            <p className="text-subdued text-center max-w-2xl text-lg md:text-xl leading-relaxed">
              You&apos;re an expert at what you do. You shouldn&apos;t have to
              spend your nights managing an inbox, a phone, and a busy
              schedule.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 auto-rows-fr">
          {/* Main Pain Point - Spans 7 columns */}
          <div className="md:col-span-7 lg:col-span-8 flex">
            <AnimatedSection className="w-full h-full flex">
              <motion.div 
                whileHover={{ y: -4 }}
                className="clean-card p-8 md:p-12 w-full flex flex-col justify-between group relative overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border-slate-200/60"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <span className="scale-[4] block origin-top-right">{pains[0].icon}</span>
                </div>
                
                <div>
                  <div className="flex items-center gap-3 mb-10">
                    <div className={`text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-wider ${pains[0].color}`}>
                      {pains[0].status}
                    </div>
                    <div className="h-px w-8 bg-slate-200" />
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">{pains[0].stat}</span>
                  </div>

                  <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-8 group-hover:bg-accent-3 group-hover:text-white transition-all duration-500">
                    <span className="scale-150">{pains[0].icon}</span>
                  </div>
                  
                  <h3 className="text-3xl md:text-4xl font-bold text-text mb-6 leading-tight max-w-md">
                    {pains[0].headline}
                  </h3>
                </div>

                <p className="text-subdued text-lg md:text-xl max-w-2xl leading-relaxed">
                  {pains[0].body}
                </p>
              </motion.div>
            </AnimatedSection>
          </div>

          {/* Side Pain Points - Stacked in 5 columns */}
          <div className="md:col-span-5 lg:col-span-4 grid grid-cols-1 gap-6 h-full">
            {pains.slice(1).map((pain) => (
              <AnimatedSection key={pain.headline} className="h-full">
                <motion.div 
                  whileHover={{ y: -4 }}
                  className="clean-card p-8 h-full flex flex-col justify-between group relative overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border-slate-200/60"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${pain.color}`}>
                        {pain.status}
                      </div>
                      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{pain.stat}</span>
                    </div>

                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-accent-3/10 group-hover:text-accent-3 transition-colors duration-500">
                      <span>{pain.icon}</span>
                    </div>

                    <h3 className="text-xl font-bold text-text mb-3 leading-tight">{pain.headline}</h3>
                    <p className="text-subdued text-sm leading-relaxed">{pain.body}</p>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

