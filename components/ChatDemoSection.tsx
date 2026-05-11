"use client";

import AnimatedSection from "./AnimatedSection";

export default function ChatDemoSection() {
  return (
    <section id="demo" className="py-24 md:py-32 px-6 md:px-12 relative overflow-hidden bg-bg">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-3/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left: Text Content */}
        <AnimatedSection>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-3/10 text-accent-3 text-xs font-bold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-accent-3 animate-pulse" />
            Live Simulation
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text mb-8 leading-[1.1] tracking-tight">
            The future of <span className="accent-text">customer service</span> is here.
          </h2>
          <p className="text-subdued text-lg md:text-xl mb-10 leading-relaxed max-w-xl">
            Our agents don&apos;t just chat—they solve problems. Experience the speed and accuracy of a Tharros-built assistant in real-time.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            <div className="flex flex-col gap-2 p-5 rounded-2xl bg-white border border-border shadow-sm">
              <div className="text-2xl mb-1">⚡</div>
              <h4 className="font-bold text-text">Ultra-Fast</h4>
              <p className="text-subdued text-sm">Near-instant responses to complex business queries.</p>
            </div>
            <div className="flex flex-col gap-2 p-5 rounded-2xl bg-white border border-border shadow-sm">
              <div className="text-2xl mb-1">🎯</div>
              <h4 className="font-bold text-text">Accurate</h4>
              <p className="text-subdued text-sm">Trained specifically on your documentation and SOPs.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-subdued text-sm italic">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-3">
              <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
            </svg>
            Try asking about pricing, service areas, or booking a call.
          </div>
        </AnimatedSection>

        {/* Right: Phone Frame with Iframe */}
        <AnimatedSection delay={0.2} variant="scale-in">
          <div className="relative mx-auto w-full max-w-[360px]">
            {/* The "Phone" Frame */}
            <div className="relative z-10 mx-auto border-[8px] border-slate-900 rounded-[3rem] h-[680px] w-full bg-slate-900 shadow-2xl overflow-hidden ring-1 ring-slate-900/5">
              {/* Speaker/Camera Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-20 flex items-center justify-center gap-2">
                <div className="w-8 h-1 bg-slate-800 rounded-full" />
                <div className="w-2 h-2 bg-slate-800 rounded-full" />
              </div>
              
              {/* Content (The Iframe) */}
              <div className="h-full w-full bg-white rounded-[2.2rem] overflow-hidden pt-2">
                <iframe 
                  src="https://app.relevanceai.com/agents/bcbe5a/53ba4219-0247-4c7e-a441-cd107d5783e0/f0398db0-96a2-4f11-8db8-b4c5b6fe769a/embed-chat?hide_tool_steps=false&hide_file_uploads=true&hide_conversation_list=true&bubble_style=agent&primary_color=%230f172a&bubble_icon=pd%2Fchat&input_placeholder_text=Type+your+message...&hide_logo=false&hide_description=false" 
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  allow="microphone"
                  title="Tharros AI Agent"
                />
              </div>
            </div>

            {/* Reflection/Gloss Effect */}
            <div className="absolute inset-0 z-20 pointer-events-none rounded-[3rem] border border-white/10" />
            
            {/* Background Glow */}
            <div className="absolute -inset-10 bg-accent-3/20 rounded-full blur-3xl -z-10 opacity-50" />
          </div>
        </AnimatedSection>

      </div>
    </section>
  );
}
