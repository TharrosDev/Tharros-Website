"use client";

import { motion } from "motion/react";
import Image from "next/image";
import AnimatedSection from "./AnimatedSection";

const clients = [
  {
    name: "The Meridian Society",
    location: "Ottawa, ON",
    type: "Knowledge Q&A Agent",
    description: "The Meridian Society connects Ottawa's top student talent with industry leaders and scholars. We deployed a custom Knowledge Q&A Agent to serve as an on-demand forum for inquiries and speaker insights, bridging the gap between academia and the professional world 24/7.",
    link: "https://meridiansociety.ca",
    date: "May 12, 2026",
    metrics: { label: "Inquiry Accuracy", value: "98%", sub: "Verified Data" },
    impact: "Instant Member Response",
    image: "/meridian-logo.png"
  }
];

export default function ClientsSection() {
  return (
    <section className="py-12 md:py-24 px-6 md:px-12 xl:px-20 relative overflow-hidden bg-white">
      <div className="industrial-grid absolute inset-0 opacity-[0.02] pointer-events-none" />
      
      {/* Background Depth Glows - Optimized with GPU layers */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent-3/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none will-change-transform" style={{ transform: 'translateZ(0)' }} />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-200/20 blur-[120px] rounded-full translate-y-1/3 -translate-x-1/4 pointer-events-none will-change-transform" style={{ transform: 'translateZ(0)' }} />

      <div className="max-w-5xl mx-auto relative">
        <AnimatedSection>
          <div className="mb-16 md:mb-20 text-center">
            <p className="section-label mb-4 tracking-[0.3em] text-[10px] justify-center">Strategic Deployments</p>
            <h2 className="text-3xl md:text-5xl font-bold text-text mb-6 tracking-tight leading-[1.1]">
              Operational <span className="text-slate-400">Proof.</span>
            </h2>
            <p className="text-subdued max-w-xl mx-auto text-base md:text-lg leading-relaxed">
              Field-tested agents delivering measurable results.
            </p>
          </div>
        </AnimatedSection>

        <div className="relative">
          <AnimatedSection variant="scale-in">
            <motion.div 
              whileHover={{ y: -4 }}
              className="clean-card overflow-hidden flex flex-col md:flex-row group relative border-slate-100/80 shadow-sm will-change-transform"
              style={{ transform: 'translateZ(0)' }}
            >
              <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative z-10">
                <div className="flex items-center flex-wrap gap-x-6 gap-y-3 mb-8">
                  <span className="px-3 py-1 rounded-full bg-accent-3/10 text-accent-3 text-[10px] font-bold uppercase tracking-[0.2em]">
                    {clients[0].type}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-300 text-xs font-bold uppercase tracking-widest">{clients[0].location}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.15em]">Deployed {clients[0].date}</span>
                  </div>
                </div>
                <a 
                  href={clients[0].link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block group/link"
                >
                  <h3 className="text-2xl md:text-4xl font-bold text-text mb-6 group-hover/link:text-accent-3 transition-colors duration-500 tracking-tight flex items-center gap-3">
                    {clients[0].name}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover/link:opacity-100 transition-all -translate-x-2 group-hover/link:translate-x-0 will-change-transform">
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
              <div className="md:w-[45%] relative min-h-[300px] bg-black flex items-center justify-center p-12 overflow-hidden">
                <div className="absolute inset-0 scanline opacity-[0.05] pointer-events-none z-20" />
                {clients[0].image && (
                  <div className="relative w-full h-full z-10 will-change-transform">
                    <Image 
                      src={clients[0].image} 
                      alt={clients[0].name}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 45vw"
                      className="object-contain transition-all duration-700 scale-100 group-hover:scale-105"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatedSection>
        </div>


      </div>
    </section>
  );
}
