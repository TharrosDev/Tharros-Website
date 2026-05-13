"use client";

import { motion } from "motion/react";
import Image from "next/image";
import AnimatedSection from "./AnimatedSection";

const clients = [
  {
    name: "The Meridian Society",
    location: "Ottawa, ON",
    type: "Knowledge Q&A Agent",
    description: "The Meridian Society is an independent, student-led hub connecting Ottawa's top talent from Carleton, uOttawa, and Algonquin with industry leaders and scholars. We deployed a custom Knowledge Q&A Agent to serve as an on-demand forum for student inquiries, speaker insights, and membership information—bridging the gap between academic theory and professional reality 24/7.",
    link: "https://meridiansociety.ca",
    metrics: { label: "Member Engagement", value: "92%", sub: "Automated" },
    impact: "85% reduction in support load",
    image: "/meridian-logo.png"
  }
];

export default function ClientsSection() {
  return (
    <section className="py-12 md:py-24 px-6 md:px-12 xl:px-20 relative overflow-hidden bg-white">
      <div className="industrial-grid absolute inset-0 opacity-[0.02] pointer-events-none" />
      
      {/* Background Depth Glows */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent-3/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-200/20 blur-[120px] rounded-full translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      <div className="max-w-5xl mx-auto relative">
        <AnimatedSection>
          <div className="mb-16 md:mb-20 text-center">
            <p className="section-label mb-4 tracking-[0.3em] text-[10px] justify-center">Current Deployment</p>
            <h2 className="text-3xl md:text-5xl font-bold text-text mb-6 tracking-tight leading-[1.1]">
              Ottawa's <span className="text-slate-400">Digital Workforce.</span>
            </h2>
            <p className="text-subdued max-w-xl mx-auto text-base md:text-lg leading-relaxed">
              Real results for Ottawa businesses. We don't just deploy code; we deploy dedicated agents that understand the local market.
            </p>
          </div>
        </AnimatedSection>

        <div className="relative">
          <AnimatedSection variant="scale-in">
            <motion.div 
              whileHover={{ y: -4 }}
              className="clean-card overflow-hidden flex flex-col md:flex-row group relative border-slate-100/80 shadow-sm"
            >
              <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative">
                <div className="flex items-center gap-3 mb-8">
                  <span className="px-3 py-1 rounded-full bg-accent-3/10 text-accent-3 text-[10px] font-bold uppercase tracking-[0.2em]">
                    {clients[0].type}
                  </span>
                  <span className="text-slate-300 text-xs font-bold uppercase tracking-widest">{clients[0].location}</span>
                </div>
                <a 
                  href={clients[0].link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block group/link"
                >
                  <h3 className="text-2xl md:text-4xl font-bold text-text mb-6 group-hover/link:text-accent-3 transition-colors duration-500 tracking-tight flex items-center gap-3">
                    {clients[0].name}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover/link:opacity-100 transition-all -translate-x-2 group-hover/link:translate-x-0">
                      <path d="M7 17l10-10M7 7h10v10" />
                    </svg>
                  </h3>
                </a>
                <p className="text-subdued text-base md:text-lg leading-relaxed mb-10 max-w-xl">
                  {clients[0].description}
                </p>
                <div className="mt-auto grid grid-cols-2 gap-10 border-t border-slate-50 pt-8">
                  <div className="flex flex-col">
                    <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.2em] mb-1">{clients[0].metrics.label}</p>
                    <p className="text-3xl font-bold text-text tracking-tighter">{clients[0].metrics.value}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-60">{clients[0].metrics.sub}</p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.2em] mb-1">Performance Impact</p>
                    <p className="text-3xl font-bold text-accent-3 tracking-tighter">{clients[0].impact.split(' ')[0]}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-60">{clients[0].impact.split(' ').slice(1).join(' ')}</p>
                  </div>
                </div>
              </div>
              <div className="md:w-[45%] relative min-h-[300px] bg-black flex items-center justify-center p-12">
                <div className="absolute inset-0 scanline opacity-[0.05]" />
                {clients[0].image && (
                  <div className="relative w-full h-full">
                    <Image 
                      src={clients[0].image} 
                      alt={clients[0].name}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 45vw"
                      className="object-contain transition-all duration-700 scale-100 group-hover:scale-110"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatedSection>
        </div>

        {/* CTA Bottom */}
        <AnimatedSection delay={0.3}>
          <div className="mt-16 md:mt-24 text-center bg-slate-900 rounded-[2rem] p-10 md:p-16 relative overflow-hidden shadow-xl">
            <div className="industrial-grid absolute inset-0 opacity-[0.08] invert pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-accent-3/10 to-transparent pointer-events-none" />
            
            <div className="relative z-10">
              <div className="inline-block p-1 bg-white/5 rounded-full border border-white/10 mb-8">
                <div className="px-5 py-2 rounded-full bg-white/10 backdrop-blur-md flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[10px] font-bold text-white tracking-widest uppercase">3 Slots Open in Ottawa - Q3 2026</span>
                </div>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 tracking-tight">Ready to recover your time?</h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                <motion.a 
                  href="/intake" 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="primary-button bg-white text-slate-900 hover:bg-slate-50 px-8 py-4 text-base font-bold rounded-xl transition-all"
                >
                  Secure Your Agent
                </motion.a>
                <a href="/#pricing" className="px-8 py-4 font-bold text-slate-400 hover:text-white transition-all text-sm uppercase tracking-widest">
                  View Plans
                </a>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
