"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import NavBar from "./NavBar";
import FooterSection from "./FooterSection";
import AnimatedSection from "./AnimatedSection";

export default function IntakeForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans selection:bg-accent-3/10 selection:text-accent-3">
      <NavBar />
      
      <main className="flex-1 pt-24 md:pt-32 pb-12 md:pb-20 px-4 md:px-8 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Sophistication: Industrial Geometric Depth */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden industrial-grid">
          <div className="scanline" />
          <div className="absolute top-0 right-0 w-[60%] h-full bg-slate-900/[0.015] -skew-x-12 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[60%] h-full bg-slate-900/[0.015] skew-x-12 -translate-x-1/4" />
          <div 
            className="absolute inset-0 opacity-[0.2]"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, #cbd5e1 1px, transparent 0)",
              backgroundSize: "64px 64px",
            }}
          />
          {/* Animated Glows */}
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.1, 0.05] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-accent-3/10 blur-[100px] rounded-full" 
          />
          <motion.div 
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.05, 0.08, 0.05] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-blue-400/5 blur-[120px] rounded-full" 
          />
        </div>

        <div className="w-full max-w-6xl relative z-10">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div 
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start"
              >
                {/* Left Side: Briefing Header */}
                <div className="lg:col-span-5 pt-4">
                  <p className="section-label mb-6 tracking-[0.3em] text-[10px] uppercase font-bold text-slate-400">Project Initiation</p>
                  <h1 className="text-4xl md:text-6xl font-bold text-text tracking-tighter mb-8 leading-[1.1]">
                    Strategic <br />
                    <span className="text-accent-3">Briefing.</span>
                  </h1>
                  <p className="text-subdued text-lg leading-relaxed mb-10">
                    Formalize your project requirements. Our executive team will review your briefing to design a high-performance agent profile tailored to your specific lead capture objectives.
                  </p>
                  
                  <div className="space-y-6">
                    {[
                      { title: "Direct Intake", desc: "Your data bypasses triage and goes straight to engineering." },
                      { title: "Secure Transmission", desc: "Encrypted briefing protocols for institutional security." }
                    ].map((item) => (
                      <div key={item.title} className="flex gap-4 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-3 mt-1.5 shrink-0" />
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-widest text-text mb-1">{item.title}</h4>
                          <p className="text-sm text-subdued">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Side: The Form */}
                <div className="lg:col-span-7">
                  <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.06)] p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute inset-0 scanline opacity-[0.02] pointer-events-none" />
                    
                    <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Full Name</label>
                          <input required type="text" placeholder="John Doe" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-accent-3/30 focus:bg-white transition-all shadow-sm" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Work Email</label>
                          <input required type="email" placeholder="john@company.com" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-accent-3/30 focus:bg-white transition-all shadow-sm" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Business / Company</label>
                        <input required type="text" placeholder="Organization Name" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-accent-3/30 focus:bg-white transition-all shadow-sm" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Needs</label>
                        <textarea required rows={4} placeholder="Tell us about your goals. What specific tasks or inquiries should your AI agent handle?" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-accent-3/30 focus:bg-white transition-all shadow-sm resize-none" />
                      </div>

                      <div className="pt-4">
                        <button 
                          disabled={isLoading}
                          type="submit" 
                          className="w-full bg-slate-900 text-white font-bold py-5 rounded-xl uppercase tracking-[0.3em] text-xs hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                          {isLoading ? (
                            <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          ) : "Submit Strategic Briefing"}
                        </button>
                      </div>

                      <p className="text-center text-[9px] text-slate-300 font-bold uppercase tracking-[0.2em]">
                        System encrypted & secured // Q3 2026 Intake active
                      </p>
                    </form>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl mx-auto text-center py-20"
              >
                <div className="w-20 h-20 rounded-3xl bg-green-50 text-green-500 flex items-center justify-center mx-auto mb-8 shadow-sm">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h2 className="text-4xl font-bold text-text mb-6 tracking-tighter">Briefing Received.</h2>
                <p className="text-subdued text-lg leading-relaxed mb-10">
                  Your strategic briefing has been encrypted and successfully transmitted. An executive specialist will contact you within 12 business hours to finalize deployment specs.
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="px-8 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
                >
                  New Briefing
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <FooterSection />
    </div>
  );
}
