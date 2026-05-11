"use client";

import { motion } from "motion/react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 overflow-hidden">
      {/* Ambient grid background */}
      <div className="absolute inset-0 ambient-grid opacity-60" aria-hidden="true" />

      {/* Gradient orb top-center */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 50% 20%, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.06) 40%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Secondary orb */}
      <div
        className="absolute top-1/3 right-0 w-[400px] h-[400px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(6,182,212,0.06) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative max-w-4xl mx-auto"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 bg-accent/[0.06] mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-sm font-medium text-accent-bright tracking-wide">
            Ottawa&apos;s AI agent studio
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight text-text mb-7"
        >
          Your business doesn&apos;t need a{" "}
          <span className="gradient-text">corporate AI strategy.</span>
          <br />
          It needs something that{" "}
          <span className="relative inline-block">
            works
            <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-accent via-accent-2 to-accent-3 rounded-full" />
          </span>
          .
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="text-lg md:text-xl text-subdued max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Tharros builds lightweight AI agents for Ottawa small businesses —
          handling customer questions, capturing leads, and keeping the phone
          from running your day. No code required.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <a
            href="mailto:magnus.abdelnour@gmail.com?subject=I%27d%20like%20to%20talk%20about%20an%20AI%20agent"
            className="glow-button inline-block px-9 py-4 text-base md:text-lg"
          >
            Talk to us about your business
          </a>
          <p className="mt-5 text-subdued text-sm">
            Free 30-minute consult. No obligation.
          </p>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-subdued/60 tracking-widest uppercase">Scroll</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="text-subdued/40"
            style={{ animation: "bounce-subtle 2s ease-in-out infinite" }}
          >
            <path
              d="M4 8L10 14L16 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </motion.div>
    </section>
  );
}
