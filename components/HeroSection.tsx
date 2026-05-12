"use client";

import { motion } from "motion/react";
import Magnetic from "./Magnetic";

export default function HeroSection() {
  return (
    <section id="hero" className="relative min-h-[100svh] flex items-center justify-center px-6 pt-24 pb-12 overflow-hidden bg-white">
      {/* Background: Industrial Geometric Depth */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50 -skew-x-12 translate-x-1/4 opacity-70" />
        <div 
          className="absolute inset-0 opacity-[0.2]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #cbd5e1 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-accent-3/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
        
        {/* Left: Authoritative Content */}
        <div className="lg:col-span-7 relative z-10 text-left">


          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-900/[0.03] border border-slate-900/5 backdrop-blur-sm text-[10px] font-extrabold uppercase tracking-[0.25em] text-slate-900/60 mb-8 hover:bg-slate-900/[0.05] transition-colors cursor-default"
          >
            <span className="flex items-center justify-center w-5 h-3.5 rounded-[2px] overflow-hidden shadow-sm ring-1 ring-black/5">
              <svg viewBox="0 0 16 8" xmlns="http://www.w3.org/2000/svg">
                <rect width="16" height="8" fill="#FF0000"/>
                <rect x="4" width="8" height="8" fill="#FFFFFF"/>
                <path d="M8 1.5L8.5 3L10 3L8.8 4L9.3 5.5L8 4.5L6.7 5.5L7.2 4L6 3L7.5 3L8 1.5Z" fill="#FF0000"/>
              </svg>
            </span>
            Keep it Canadian
          </motion.div>

          <h1 className="text-[2.2rem] leading-[1.1] sm:text-5xl md:text-7xl font-bold tracking-tight text-text mb-8">
            Your business doesn&apos;t need a <br />
            <span className="text-slate-400">corporate AI strategy.</span>
            <br className="hidden sm:block" />
            It needs something that{" "}
            <span className="relative inline-block text-accent-3">
              works
              <span className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-[3px] sm:h-[4px] bg-accent-3/20 rounded-full w-full" />
            </span>
            .
          </h1>

          <p className="text-lg md:text-xl text-subdued max-w-xl mb-12 leading-relaxed">
            Tharros builds lightweight AI agents for Ottawa small businesses,
            automating customer inquiries, office admin, and repetitive
            back-office tasks. We handle the busywork so you can focus on the job.
            No code required.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Magnetic strength={0.2}>
              <a
                href="mailto:Magnus.Abdelnour@gmail.com?subject=I%27d%20like%20to%20talk%20about%20an%20AI%20agent"
                className="primary-button px-10 py-5 text-lg shadow-xl shadow-accent-3/10 hover:shadow-accent-3/20 transition-all"
              >
                Set up a Consultation
              </a>
            </Magnetic>
            <div className="flex flex-col sm:pl-2">
              <span className="text-sm font-bold text-text">Free initial Consultation.</span>
              <span className="text-xs text-subdued">No obligation. Ottawa-based.</span>
            </div>
          </div>

          {/* Mobile-Only Technology Proof Visual */}
          <div className="mt-16 lg:hidden w-full max-w-sm">
            <div className="bg-slate-900 rounded-2xl p-1 border border-white/10 shadow-xl overflow-hidden opacity-90 scale-[0.95] origin-left">
              <div className="bg-slate-800/50 p-3 border-b border-white/5 flex items-center justify-between">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400/30" />
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400/30" />
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400/30" />
                </div>
                <span className="text-[7px] font-mono text-white/30 tracking-[0.2em] uppercase">Mobile_Module_Live</span>
              </div>
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  {[60, 30, 80].map((w, i) => (
                    <div key={i} className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${w}%` }}
                        transition={{ delay: 0.2 + (i * 0.1), duration: 1 }}
                        className="h-full bg-accent-3"
                      />
                    </div>
                  ))}
                </div>
                <div className="font-mono text-[8px] text-white/20">
                  <p>{`> DEPLOY_UNIT_01_SUCCESS`}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: The 'Technology Proof' Visual */}
        <div className="lg:col-span-5 relative hidden lg:block">
          <div className="relative z-10 perspective-1000">
            {/* Mock System Card */}
            <div className="bg-slate-900 rounded-2xl p-1 border border-white/10 shadow-2xl overflow-hidden">
              <div className="bg-slate-800/50 p-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-400/50" />
                  <div className="w-2 h-2 rounded-full bg-amber-400/50" />
                  <div className="w-2 h-2 rounded-full bg-green-400/50" />
                </div>
                <span className="text-[9px] font-mono text-white/30 tracking-widest uppercase">Agent_Interface_Live</span>
              </div>
              <div className="p-6 space-y-6">
                {/* Visual Bars */}
                <div className="space-y-3">
                  {[70, 40, 90].map((w, i) => (
                    <div key={i} className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${w}%` }}
                        transition={{ delay: 0.5 + (i * 0.2), duration: 1.5, ease: "circOut" }}
                        className="h-full bg-gradient-to-r from-accent-3 to-blue-400"
                      />
                    </div>
                  ))}
                </div>
                {/* Code snippets */}
                <div className="font-mono text-[10px] text-white/20 space-y-2">
                  <p className="">{`> INIT_NEURAL_MAPPING`}</p>
                  <p className="text-accent-3/40">{`> STATUS: 100% OPERATIONAL`}</p>
                  <p className="">{`> DEPLOYING_TO_PRODUCTION...`}</p>
                </div>
              </div>
            </div>

            {/* Floating Accents */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 w-32 h-32 bg-accent-bright/10 blur-3xl rounded-full" 
            />
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent-3/10 blur-3xl rounded-full" 
            />
          </div>
        </div>

      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-3">
        <span className="text-[10px] font-bold text-muted tracking-[0.3em] uppercase">Scroll_Down</span>
        <div className="w-px h-12 bg-gradient-to-b from-slate-200 to-transparent" />
      </div>
    </section>
  );
}
