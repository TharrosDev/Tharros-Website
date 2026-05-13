"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import Magnetic from "./Magnetic";

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <section id="hero" className="relative min-h-[85svh] md:min-h-[100svh] flex items-center justify-center px-6 pt-16 md:pt-28 pb-4 md:pb-8 overflow-hidden bg-slate-950 industrial-grid">
      {/* Background Sophistication */}
      <div className="scanline" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-900/40 -skew-x-12 translate-x-1/4 pointer-events-none" />
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-accent-3/5 blur-[120px] rounded-full" />
        
        {/* Industrial Markers */}
        <div className="absolute top-10 left-10 w-4 h-4 border-t-2 border-l-2 border-white/10" />
        <div className="absolute top-10 right-10 w-4 h-4 border-t-2 border-r-2 border-white/10" />
        <div className="absolute bottom-10 left-10 w-4 h-4 border-b-2 border-l-2 border-white/10" />
        <div className="absolute bottom-10 right-10 w-4 h-4 border-b-2 border-r-2 border-white/10" />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl xl:max-w-[90rem] mx-auto relative z-10 flex flex-col items-center text-center"
      >
        {/* Authoritative Content */}
        <div className="max-w-4xl xl:max-w-6xl mx-auto">
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md text-[10px] font-extrabold uppercase tracking-[0.3em] text-white/70 mb-6 md:mb-10 hover:bg-white/[0.06] hover:border-white/20 transition-all cursor-default group"
          >
            <div className="relative">
              <Image 
                src="/canada-flag.svg" 
                alt="Canadian Flag" 
                width={20} 
                height={12} 
                priority
                className="rounded-[2px] shadow-sm grayscale group-hover:grayscale-0 transition-all duration-500" 
              />
              <div className="absolute inset-0 bg-accent-3/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span>Ottawa_System_Active // 2026</span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-[2.5rem] leading-[0.95] sm:text-5xl md:text-7xl xl:text-8xl font-bold tracking-tighter text-white mb-6"
          >
            Your business doesn&apos;t need <br className="hidden md:block" />
            <span className="text-slate-500">corporate AI theory.</span>
            <br className="hidden sm:block" />
            It needs <span className="text-accent-3">AI Agents</span> that{" "}
            <span className="relative inline-block text-accent-3">
              work
              <motion.span 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 1.2, duration: 1, ease: "easeInOut" }}
                className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-[4px] sm:h-[6px] bg-accent-3/30 rounded-full" 
              />
            </span>
            .
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-base md:text-xl xl:text-2xl text-slate-200 max-w-xl xl:max-w-3xl mx-auto mb-10 md:mb-12 leading-relaxed font-medium opacity-90"
          >
            High-performance AI Agents for local trades and professional services. 
            We automate your back-office so you can reclaim your time.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8"
          >
            <Magnetic strength={0.1}>
              <a
                href="/intake"
                className="primary-button px-10 py-5 md:px-14 md:py-6 xl:px-16 xl:py-8 text-sm md:text-lg xl:text-xl w-full sm:w-auto relative overflow-hidden group shadow-[0_0_40px_rgba(59,130,246,0.15)] hover:shadow-[0_0_60px_rgba(59,130,246,0.25)] transition-shadow"
              >
                <span className="relative z-10">Initiate Briefing</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              </a>
            </Magnetic>
            
            <a
              href="#demo"
              className="group flex items-center gap-3 text-white font-bold text-xs md:text-sm uppercase tracking-[0.3em] hover:text-accent-3 transition-colors px-4 py-2"
            >
              <span className="w-8 h-px bg-white/20 group-hover:w-12 group-hover:bg-accent-3 transition-all" />
              Live System Demo
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* System Status Indicators */}
      <div className="absolute bottom-10 left-10 hidden xl:flex flex-col gap-1 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Network_Stable</span>
        </div>
        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest ml-3.5">LATENCY: 14ms</span>
      </div>

      <div className="absolute bottom-10 right-10 hidden xl:flex flex-col items-end gap-1 pointer-events-none">
        <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Model_Type: CRM_INTAKE_V3</span>
        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest tracking-[0.5em]">THARROS_CAN_01</span>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-3"
      >
        <span className="text-[9px] font-bold text-slate-500 tracking-[0.4em] uppercase">Deployment_Overview</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
      </motion.div>
    </section>
  );
}
