"use client";

import Link from "next/link";
import { motion } from "motion/react";
import Magnetic from "./Magnetic";

export default function HeroSection() {
  return (
    <section id="hero" className="relative min-h-[100svh] flex items-center justify-center px-6 pt-32 pb-24 md:pb-32 overflow-hidden bg-white">
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

      <div className="max-w-7xl xl:max-w-[90rem] mx-auto relative z-10 flex flex-col items-center text-center">

        {/* Authoritative Content */}
        <div className="max-w-4xl xl:max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-900/[0.03] border border-slate-900/5 backdrop-blur-sm text-[10px] font-extrabold uppercase tracking-[0.25em] text-slate-900/60 mb-6 md:mb-8 hover:bg-slate-900/[0.05] transition-colors cursor-default"
          >
            <img src="/canada-flag.svg" alt="Canadian Flag" className="w-5 h-3 rounded-[2px] shadow-sm" />
            Keep it Canadian
          </motion.div>

          <h1 className="text-[2.6rem] leading-[1.05] sm:text-6xl md:text-8xl xl:text-9xl font-bold tracking-tight text-text mb-8">
            Your business doesn&apos;t need <br className="hidden md:block" />
            <span className="text-slate-400">corporate AI theory.</span>
            <br className="hidden sm:block" />
            It needs <span className="text-accent-3">AI Agents</span> that{" "}
            <span className="relative inline-block text-accent-3">
              work
              <span className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-[3px] sm:h-[4px] bg-accent-3/20 rounded-full w-full" />
            </span>
            .
          </h1>

          <p className="text-base md:text-2xl xl:text-3xl text-subdued max-w-2xl xl:max-w-3xl mx-auto mb-10 md:mb-14 leading-relaxed font-medium">
            Tharros builds <span className="text-text">Autonomous AI Agents</span> for Ottawa small businesses,
            automating customer inquiries, office admin, and repetitive
            back-office tasks. No code required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8">
            <a
              href="/intake"
              aria-label="Start your AI intake journey"
              className="primary-button px-10 py-5 md:px-12 md:py-6 xl:px-16 xl:py-7 text-base md:text-xl xl:text-2xl w-full sm:w-auto"
            >
              Start your journey
            </a>
            <a
              href="#demo"
              aria-label="View our live AI agent demo"
              className="text-text font-bold text-sm md:text-base uppercase tracking-widest hover:text-accent-3 transition-colors px-4 py-3"
            >
              Live Demo
            </a>
          </div>

          <div className="mt-12 flex items-center justify-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Intake Agent Online &mdash; <a href="mailto:Magnus.Abdelnour@gmail.com" className="text-accent-3 hover:underline">Or Email Directly</a>
            </p>
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
