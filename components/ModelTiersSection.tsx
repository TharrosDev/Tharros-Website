"use client";

import { motion } from "motion/react";
import AnimatedSection from "./AnimatedSection";

const TIERS = [
  {
    label: "Commercial Tier",
    title: "The Light Model",
    desc: "Our most popular digital intake agent for Ottawa small businesses. Recovers your time by capturing leads and answering common inquiries 24/7 without the high overhead.",
    color: "text-slate-400"
  },
  {
    label: "Growth Tier",
    title: "The Medium Model",
    desc: "A high-performance tier for scaling local brands. Handles complex customer logic and syncs directly with your CRM, acting as a specialized office admin for your team.",
    color: "text-accent-3"
  },
  {
    label: "Enterprise Tier",
    title: "The Elite Model",
    desc: "The ultimate automated workforce for high-volume enterprises. A bespoke AI system built to master your specific business logic and run entire workflows with zero-touch precision.",
    color: "text-slate-900"
  }
] as const;

export default function ModelTiersSection() {
  return (
    <section className="section-padding bg-[#fafafa] relative overflow-hidden border-t border-slate-100">
      <div className="absolute inset-0 industrial-grid opacity-[0.4] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-12 xl:px-20 relative z-10">
        <div className="text-center mb-10 md:mb-20">
          <AnimatedSection>
            <p className="section-label mb-6">Strategic Scaling</p>
            <h2 className="text-4xl md:text-6xl font-bold text-text tracking-tighter mb-8 leading-[1.1]">
              Engineered for <br />
              <span className="text-slate-400">every stage of growth.</span>
            </h2>
          </AnimatedSection>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 xl:gap-20">
          {TIERS.map((tier, i) => (
            <AnimatedSection key={tier.title} delay={i * 0.1} variant="fade-up">
              <div className="flex flex-col text-center md:text-left h-full group">
                <span className={`text-[10px] font-bold uppercase tracking-[0.3em] ${tier.color} mb-4 block`}>
                  {tier.label}
                </span>
                <h4 className="text-2xl xl:text-3xl font-bold text-text tracking-tighter mb-6 group-hover:text-accent-3 transition-colors duration-300">
                  {tier.title}
                </h4>
                <p className="text-base text-subdued leading-relaxed">
                  {tier.desc}
                </p>
                
                {/* Visual Accent */}
                <div className="mt-8 pt-8 border-t border-slate-100 w-16 group-hover:w-full transition-all duration-500" />
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
