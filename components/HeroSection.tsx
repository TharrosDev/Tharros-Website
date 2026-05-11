"use client";

import { motion } from "motion/react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-16">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 40%, rgba(0,194,255,0.08) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative max-w-4xl mx-auto"
      >
        <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-6">
          Ottawa&apos;s AI agent studio
        </p>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-text mb-6">
          Your business doesn&apos;t need a{" "}
          <span className="text-accent">corporate AI strategy.</span>
          <br />
          It needs something that{" "}
          <span className="relative inline-block">
            works
            <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent rounded-full" />
          </span>
          .
        </h1>

        <p className="text-lg md:text-xl text-subdued max-w-2xl mx-auto mb-10 leading-relaxed">
          Tharros builds lightweight AI agents for Ottawa small businesses —
          handling customer questions, capturing leads, and keeping the phone
          from running your day. No code required.
        </p>

        <a
          href="mailto:magnus.abdelnour@gmail.com?subject=I%27d%20like%20to%20talk%20about%20an%20AI%20agent"
          className="inline-block px-8 py-4 rounded-full bg-accent text-bg font-bold text-base md:text-lg hover:brightness-110 active:scale-95 transition-all duration-200 shadow-[0_0_32px_rgba(0,194,255,0.3)]"
        >
          Talk to us about your business
        </a>

        <p className="mt-4 text-subdued text-sm">
          Free 30-minute consult. No obligation.
        </p>
      </motion.div>
    </section>
  );
}
