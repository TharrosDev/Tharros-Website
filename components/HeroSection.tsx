"use client";

import { motion } from "motion/react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center text-center px-6 pt-24 pb-20 overflow-hidden bg-white">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.4]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden="true"
      />

      {/* Soft blue glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 50% 30%, rgba(59,130,246,0.06) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative max-w-4xl mx-auto"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-white mb-8 shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-accent-3 animate-pulse" />
          <span className="text-sm font-medium text-accent-3 tracking-wide">
            Ottawa&apos;s AI agent studio
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="text-[2rem] leading-[1.1] sm:text-4xl md:text-6xl lg:text-7xl font-bold md:leading-[1.08] tracking-tight text-text mb-7"
        >
          Your business doesn&apos;t need a{" "}
          <span className="accent-text">corporate AI strategy.</span>
          <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>
          It needs something that{" "}
          <span className="relative inline-block">
            works
            <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-accent-3 rounded-full" />
          </span>
          .
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-base sm:text-lg md:text-xl text-subdued max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Tharros builds lightweight AI agents for Ottawa small businesses,
          automating customer inquiries, office admin, and repetitive
          back-office tasks. We handle the busywork so you can focus on the job.
          No code required.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
        >
          <a
            href="mailto:Magnus.Abdelnour@gmail.com?subject=I%27d%20like%20to%20talk%20about%20an%20AI%20agent"
            className="primary-button px-8 sm:px-9 py-4 text-base md:text-lg"
          >
            Talk to us about your business
          </a>
          <p className="mt-5 text-subdued text-sm">
            Free initial Consultation. No obligation.
          </p>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2"
      >
        <span className="text-xs text-muted tracking-widest uppercase">Scroll</span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 20 20"
          fill="none"
          className="text-muted"
          style={{ animation: "bounce-subtle 2s ease-in-out infinite" }}
          aria-hidden="true"
        >
          <path
            d="M4 8L10 14L16 8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </section>
  );
}
