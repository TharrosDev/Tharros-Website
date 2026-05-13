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
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }
    }
  };

  return (
    <section id="hero" className="relative min-h-[90svh] md:min-h-[100svh] flex items-center justify-center px-6 pt-28 md:pt-32 pb-10 md:pb-20 overflow-hidden bg-slate-950 industrial-grid">
      {/* Background Sophistication */}
      <div className="scanline" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-900/40 -skew-x-12 translate-x-1/4 pointer-events-none" />
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-accent-3/5 blur-[120px] rounded-full opacity-50 md:opacity-100" />
        
        {/* Industrial Markers */}
        <div className="absolute top-8 left-8 md:top-12 md:left-12 w-4 h-4 md:w-6 md:h-6 border-t-2 border-l-2 border-white/10" />
        <div className="absolute top-8 right-8 md:top-12 md:right-12 w-4 h-4 md:w-6 md:h-6 border-t-2 border-r-2 border-white/10" />
        <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 w-4 h-4 md:w-6 md:h-6 border-b-2 border-l-2 border-white/10" />
        <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 w-4 h-4 md:w-6 md:h-6 border-b-2 border-r-2 border-white/10" />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl xl:max-w-[90rem] mx-auto relative z-10 flex flex-col items-center text-center"
      >
        {/* Authoritative Content */}
        <div className="max-w-4xl xl:max-w-7xl mx-auto pt-10 md:pt-0">
          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-6xl md:text-8xl xl:text-9xl font-bold tracking-tighter text-white mb-6 md:mb-12 leading-[1.1] md:leading-[1]"
          >
            Your small business doesn&apos;t need <br className="hidden md:block" />
            <span className="text-slate-500">corporate AI theory.</span>
            <br className="hidden sm:block" />
            It needs <span className="text-accent-3">AI Agents</span> that{" "}
            <span className="relative inline-block text-accent-3">
              work
              <motion.span 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 1.2, duration: 1, ease: [0.22, 1, 0.36, 1] as any }}
                className="absolute -bottom-1 md:-bottom-4 left-0 right-0 h-[3px] md:h-[8px] bg-accent-3/20 rounded-full" 
              />
            </span>
            .
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-base md:text-2xl xl:text-3xl text-slate-200 max-w-2xl xl:max-w-5xl mx-auto mb-8 md:mb-16 leading-relaxed font-medium opacity-80 px-2 sm:px-0"
          >
            High-performance AI Agents for trades and small businesses. <br className="hidden lg:block" />
            We build the digital workforce that recovers your time.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-12 w-full px-4 sm:px-0"
          >
            <Magnetic strength={0.1}>
              <a
                href="/intake"
                className="primary-button text-sm md:text-xl xl:text-2xl w-full sm:w-auto relative overflow-hidden group shadow-[0_20px_50px_-10px_rgba(14,165,233,0.3)] py-4 md:py-6"
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              </a>
            </Magnetic>
            
            <a
              href="#demo"
              className="group flex items-center justify-center gap-4 text-white font-black text-[10px] md:text-sm uppercase tracking-[0.4em] hover:text-accent-3 transition-all px-6 py-4 w-full sm:w-auto"
            >
              <span className="hidden sm:block w-10 h-px bg-white/20 group-hover:w-16 group-hover:bg-accent-3 transition-all" />
              Live System Demo
            </a>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="mt-16 md:mt-20 flex items-center justify-center gap-4 text-white/70 font-black uppercase tracking-[0.4em] text-[10px] md:text-sm select-none"
          >
            <span>Keep it Local, Keep it Canadian</span>
            <img src="/canada-flag.svg" alt="Canada" className="w-6 md:w-8 h-auto rounded-sm shadow-sm" />
          </motion.div>
        </div>
      </motion.div>




    </section>
  );
}
