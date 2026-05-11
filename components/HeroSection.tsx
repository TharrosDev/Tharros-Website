"use client";

import { motion } from "motion/react";
import Magnetic from "./Magnetic";

export default function HeroSection() {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center px-6 pt-32 pb-24 overflow-hidden bg-white">
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
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-lg border border-slate-200 bg-white mb-10 shadow-sm cursor-default"
          >
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-3 animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              System_Active // Ottawa_Unit_01
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, type: "spring", stiffness: 100 }}
            className="text-[2.5rem] leading-[1.05] sm:text-5xl md:text-7xl font-bold tracking-tight text-text mb-8"
          >
            Your business doesn&apos;t need a <br />
            <span className="text-slate-400">corporate AI strategy.</span>
            <br />
            It needs something that{" "}
            <span className="relative inline-block text-accent-3">
              works
              <motion.span 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 1.2, duration: 0.8, ease: "circOut" }}
                className="absolute -bottom-2 left-0 right-0 h-[4px] bg-accent-3/20 rounded-full" 
              />
            </span>
            .
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg md:text-xl text-subdued max-w-xl mb-12 leading-relaxed"
          >
            Tharros builds lightweight AI agents for Ottawa small businesses,
            automating customer inquiries, office admin, and repetitive
            back-office tasks. We handle the busywork so you can focus on the job.
            No code required.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
          >
            <Magnetic strength={0.2}>
              <a
                href="mailto:Magnus.Abdelnour@gmail.com?subject=I%27d%20like%20to%20talk%20about%20an%20AI%20agent"
                className="primary-button px-10 py-5 text-lg shadow-xl shadow-accent-3/10 hover:shadow-accent-3/20 transition-all"
              >
                Set up a Consultation
              </a>
            </Magnetic>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-text">Free initial Consultation.</span>
              <span className="text-xs text-subdued">No obligation. Ottawa-based.</span>
            </div>
          </motion.div>
        </div>

        {/* Right: The 'Technology Proof' Visual */}
        <div className="lg:col-span-5 relative hidden lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotateY: 10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative z-10 perspective-1000"
          >
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
                        transition={{ delay: 1 + (i * 0.2), duration: 1.5, ease: "circOut" }}
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
          </motion.div>
        </div>

      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-3"
      >
        <span className="text-[10px] font-bold text-muted tracking-[0.3em] uppercase">Scroll_Down</span>
        <div className="w-px h-12 bg-gradient-to-b from-slate-200 to-transparent" />
      </motion.div>
    </section>
  );
}
