"use client";

import { useForm, ValidationError } from "@formspree/react";
import { motion, AnimatePresence } from "motion/react";
import NavBar from "./NavBar";
import FooterSection from "./FooterSection";
import AnimatedSection from "./AnimatedSection";

export default function IntakeForm() {
  const [state, handleSubmit] = useForm("xvzlykgz");

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-accent-3/30 selection:text-slate-900">
      <main className="flex-1 pt-28 md:pt-32 pb-12 md:pb-20 px-4 md:px-8 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Sophistication: Industrial Geometric Depth */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden industrial-grid">
          <div className="scanline" />
          <div className="absolute top-0 right-0 w-[60%] h-full bg-slate-50 -skew-x-12 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[60%] h-full bg-slate-50 skew-x-12 -translate-x-1/4" />
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, #0f172a 1px, transparent 0)",
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
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start"
              >
                {/* Left Side: Briefing Header */}
                <div className="lg:col-span-5 pt-4">
                  <p className="section-label mb-6 tracking-[0.3em] text-[9px] md:text-[10px] uppercase font-bold text-slate-500">Keep it Local, Keep it Canadian</p>
                  <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-slate-900 tracking-tighter mb-8 leading-[1.2] sm:leading-[1.1]">
                    Training & Setup <br />
                    <span className="text-accent-3">Briefing.</span>
                  </h1>
                  <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-10">
                    Share where your business is and what&apos;s eating your week. We&apos;ll review your details and reach out to scope a training and setup engagement that leaves you with an agent you actually own.
                  </p>

                  <div className="space-y-6">
                    {[
                      { title: "Quick Review", desc: "We respond to every briefing within 1-3 business days." },
                      { title: "Custom Curriculum", desc: "Every training is shaped around your business, your team, and the agent worth setting up first." }
                    ].map((item) => (
                      <div key={item.title} className="flex gap-4 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-3 mt-1.5 shrink-0" />
                        <div>
                          <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-900 mb-1">{item.title}</h4>
                          <p className="text-xs md:text-sm text-slate-500">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Side: The Form */}
                <div className="lg:col-span-7">
                  <div className="bg-white rounded-3xl md:rounded-[2.5rem] border border-slate-200 shadow-2xl p-6 md:p-12 relative overflow-hidden">
                    <div className="absolute inset-0 scanline opacity-[0.02] pointer-events-none" />
                    
                    <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8 relative z-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 ml-1">Full Name</label>
                          <input required name="name" type="text" placeholder="John Smith" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 md:py-4 text-base md:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-accent-3/50 focus:bg-white transition-all shadow-sm" />
                          <ValidationError prefix="Name" field="name" errors={state.errors} className="text-red-500 text-[10px] font-bold mt-1" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 ml-1">Email</label>
                          <input required name="email" type="email" placeholder="John.smith@gmail.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 md:py-4 text-base md:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-accent-3/50 focus:bg-white transition-all shadow-sm" />
                          <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-500 text-[10px] font-bold mt-1" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 ml-1">Business / Company</label>
                        <input required name="company" type="text" placeholder="Organization Name" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 md:py-4 text-base md:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-accent-3/50 focus:bg-white transition-all shadow-sm" />
                        <ValidationError prefix="Company" field="company" errors={state.errors} className="text-red-500 text-[10px] font-bold mt-1" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 ml-1">Website <span className="text-slate-400 font-normal ml-1">(Optional)</span></label>
                        <input name="website" type="url" placeholder="https://yourwebsite.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 md:py-4 text-base md:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-accent-3/50 focus:bg-white transition-all shadow-sm" />
                        <ValidationError prefix="Website" field="website" errors={state.errors} className="text-red-500 text-[10px] font-bold mt-1" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 ml-1">Needs</label>
                        <textarea required name="needs" rows={4} placeholder="Tell us about your business and where AI could help. What tasks or inquiries are eating your week? Are you coaching just yourself, or your whole team?" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 md:py-4 text-base md:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-accent-3/50 focus:bg-white transition-all shadow-sm resize-none" />
                        <ValidationError prefix="Needs" field="needs" errors={state.errors} className="text-red-500 text-[10px] font-bold mt-1" />
                      </div>

                      <div className="pt-4">
                        <button 
                          disabled={state.submitting}
                          type="submit" 
                          className="w-full bg-slate-900 text-white font-bold py-4 md:py-5 rounded-xl uppercase tracking-[0.3em] text-[10px] md:text-xs hover:bg-slate-950 transition-all shadow-2xl active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                          {state.submitting ? (
                            <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          ) : "Request Training Briefing"}
                        </button>
                      </div>

                      <p className="text-center text-[8px] md:text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                        Secure submission
                      </p>
                    </form>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto text-center py-12 md:py-20 px-6 md:px-10 bg-white rounded-3xl md:rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] relative"
              >
                <div className="relative z-10">
                  <div className="w-20 h-20 rounded-full bg-green-50 text-green-500 flex items-center justify-center mx-auto mb-8 border border-green-100">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Briefing Received.</h2>
                  <p className="text-slate-500 text-base md:text-lg leading-relaxed mb-10 max-w-md mx-auto">
                    Thanks for reaching out. We&apos;ve got your details and will follow up within one business day to schedule your training and setup call.
                  </p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="px-8 py-4 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                  >
                    New Request
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
