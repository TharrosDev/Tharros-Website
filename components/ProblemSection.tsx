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
    <section id="problem" className="section-padding px-6 md:px-12 xl:px-20 relative overflow-hidden bg-white">
      {/* Subtle Background Accents */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="max-w-7xl xl:max-w-[90rem] mx-auto relative">
        <AnimatedSection>
          <div className="flex flex-col items-center mb-16 md:mb-24">
            <span className="section-label mb-6">Process Inefficiencies</span>
            <h2 className="text-4xl md:text-6xl xl:text-7xl font-bold text-center text-text mb-8 max-w-4xl xl:max-w-5xl leading-[1.1] tracking-tight">
              Ottawa businesses need <br className="hidden md:block" />
              <span className="text-accent-3">Autonomous AI Agents,</span> not more wasted time.
            </h2>
            <p className="text-subdued text-center max-w-2xl xl:max-w-3xl text-lg md:text-xl xl:text-2xl leading-relaxed">
              Don&apos;t just add software. Deploy a workforce of specialized AI Agents to manage your inbox, your leads, and your schedule 24/7.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 xl:gap-14">
          {pains.map((pain, i) => (
            <AnimatedSection key={pain.headline}>
              <motion.div 
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="clean-card p-10 md:p-12 xl:p-16 h-full flex flex-col gap-6 group relative overflow-hidden cursor-default shadow-sm hover:shadow-xl hover:border-accent-3/20 transition-all duration-500"
              >
                {/* Accent left stripe */}
                <div className="absolute left-0 top-10 bottom-10 w-[4px] rounded-full bg-accent-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="pl-2 group-hover:pl-4 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-8">
                    <div className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${pain.color}`}>
                      {pain.status}
                    </div>
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{pain.stat}</span>
                  </div>

                  <div 
                    aria-hidden="true"
                    className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 text-accent-3 group-hover:bg-accent-3/10 group-hover:text-accent-3 transition-colors duration-500"
                  >
                    <span className="scale-125">{pain.icon}</span>
                  </div>
                  
                  <h3 className="text-xl md:text-2xl xl:text-3xl font-bold text-text mt-4 mb-3 leading-tight">{pain.headline}</h3>
                  <p className="text-subdued leading-relaxed text-base xl:text-lg">{pain.body}</p>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}


