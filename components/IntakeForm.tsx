"use client";

import { useForm, ValidationError } from "@formspree/react";
import { motion, AnimatePresence } from "motion/react";
import NavBar from "./NavBar";
import FooterSection from "./FooterSection";
import AnimatedSection from "./AnimatedSection";

export default function IntakeForm() {
  const [state, handleSubmit] = useForm("xvzlykgz");

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans selection:bg-accent-3/30 selection:text-white">
      <main className="flex-1 pt-24 md:pt-32 pb-12 md:pb-20 px-4 md:px-8 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Sophistication: Industrial Geometric Depth */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden industrial-grid">
          <div className="scanline" />
          <div className="absolute top-0 right-0 w-[60%] h-full bg-slate-900/40 -skew-x-12 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[60%] h-full bg-slate-900/40 skew-x-12 -translate-x-1/4" />
          <div 
            className="absolute inset-0 opacity-[0.2]"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
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
            {!state.succeeded ? (
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
                  <p className="section-label mb-6 tracking-[0.3em] text-[10px] uppercase font-bold text-slate-300">Get Started</p>
                  <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tighter mb-8 leading-[1.1]">
                    Project <br />
                    <span className="text-accent-3">Intake.</span>
                  </h1>
                  <p className="text-slate-100 text-lg leading-relaxed mb-10">
                    Share your project goals and requirements. Once submitted, a Tharros representative will review your details and reach out to discuss the next steps.
                  </p>
                  
                  <div className="space-y-6">
                    {[
                      { title: "Quick Review", desc: "Our team reviews all submissions within 1-3 business days." },
                      { title: "Custom Design", desc: "Every agent is built from scratch based on your specific needs." }
                    ].map((item) => (
                      <div key={item.title} className="flex gap-4 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-3 mt-1.5 shrink-0" />
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-1">{item.title}</h4>
                          <p className="text-sm text-slate-300">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Side: The Form */}
                <div className="lg:col-span-7">
                  <div className="bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/5 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.5)] p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute inset-0 scanline opacity-[0.05] pointer-events-none" />
                    
                    <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300 ml-1">Full Name</label>
                          <input required name="name" type="text" placeholder="John Smith" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-accent-3/30 focus:bg-white/10 transition-all shadow-sm" />
                          <ValidationError prefix="Name" field="name" errors={state.errors} className="text-red-500 text-[10px] font-bold mt-1" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300 ml-1">Email</label>
                          <input required name="email" type="email" placeholder="John.smith@gmail.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-accent-3/30 focus:bg-white/10 transition-all shadow-sm" />
                          <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-500 text-[10px] font-bold mt-1" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300 ml-1">Business / Company</label>
                        <input required name="company" type="text" placeholder="Organization Name" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-accent-3/30 focus:bg-white/10 transition-all shadow-sm" />
                        <ValidationError prefix="Company" field="company" errors={state.errors} className="text-red-500 text-[10px] font-bold mt-1" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300 ml-1">Website <span className="text-slate-400 font-normal ml-1">(Optional)</span></label>
                        <input name="website" type="url" placeholder="https://yourwebsite.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-accent-3/30 focus:bg-white/10 transition-all shadow-sm" />
                        <ValidationError prefix="Website" field="website" errors={state.errors} className="text-red-500 text-[10px] font-bold mt-1" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300 ml-1">Needs</label>
                        <textarea required name="needs" rows={4} placeholder="Tell us about your goals. What specific tasks or inquiries should your AI agent handle?" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-accent-3/30 focus:bg-white/10 transition-all shadow-sm resize-none" />
                        <ValidationError prefix="Needs" field="needs" errors={state.errors} className="text-red-500 text-[10px] font-bold mt-1" />
                      </div>

                      <div className="pt-4">
                        <button 
                          disabled={state.submitting}
                          type="submit" 
                          className="w-full bg-white text-slate-950 font-bold py-5 rounded-xl uppercase tracking-[0.3em] text-xs hover:bg-slate-100 transition-all shadow-2xl shadow-white/5 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                          {state.submitting ? (
                            <span className="w-4 h-4 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
                          ) : "Submit Project Details"}
                        </button>
                      </div>

                      <p className="text-center text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                        Secure submission
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
                className="max-w-3xl mx-auto text-center py-20 px-8 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden"
              >
                <div className="absolute inset-0 scanline opacity-[0.05] pointer-events-none" />
                <div className="relative z-10">
                  <div className="w-24 h-24 rounded-3xl bg-green-500/10 text-green-500 flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_-10px_rgba(34,197,94,0.3)] border border-green-500/20">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tighter">Transmission Successful.</h2>
                  <p className="text-slate-100 text-lg md:text-xl leading-relaxed mb-12 max-w-xl mx-auto">
                    Your briefing has been received. Our analysts will review your requirements and coordinate a consultation within one business day.
                  </p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="px-10 py-4 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white/10 transition-all shadow-sm active:scale-95"
                  >
                    New Submission
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <FooterSection />
    </div>
  );
}
