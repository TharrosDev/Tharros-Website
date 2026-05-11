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
  },
];

export default function ProblemSection() {
  return (
    <section id="problem" className="py-24 md:py-40 px-6 md:px-12 relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="max-w-6xl mx-auto relative">
        <AnimatedSection>
          <p className="section-label mb-4 text-center">The problem</p>
          <h2 className="text-3xl md:text-5xl font-bold text-center text-text mb-5 max-w-3xl mx-auto leading-tight">
            Ottawa businesses should focus on{" "}
            <span className="accent-text">growth, not manual busywork</span>
          </h2>
          <p className="text-subdued text-center max-w-xl mx-auto mb-14 md:mb-16 text-base md:text-lg leading-relaxed">
            You&apos;re an expert at what you do. You shouldn&apos;t have to
            spend your nights managing an inbox, a phone, and a busy
            schedule.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {pains.map((pain, i) => (
            <AnimatedSection key={pain.headline} delay={i * 0.1}>
              <motion.div 
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="clean-card p-7 md:p-8 h-full flex flex-col gap-4 group relative overflow-hidden cursor-default"
              >
                {/* Accent left stripe */}
                <div className="absolute left-0 top-6 bottom-6 w-[3px] rounded-full bg-accent-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="pl-2 group-hover:pl-4 transition-all duration-300">
                  <motion.div 
                    whileHover={{ rotate: -5, scale: 1.1 }}
                    className="icon-container mb-4"
                  >
                    <span aria-hidden="true">{pain.icon}</span>
                  </motion.div>
                  <span className="section-label text-xs">{pain.stat}</span>
                  <h3 className="text-lg md:text-xl font-bold text-text mt-2 mb-2">{pain.headline}</h3>
                  <p className="text-subdued leading-relaxed text-sm">{pain.body}</p>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
