"use client";

import { useState, useEffect } from "react";
import AnimatedSection from "./AnimatedSection";

export default function ChatDemoSection() {
  // State to store the iframe URL with a unique timestamp to prevent persistence on reload
  const [iframeUrl, setIframeUrl] = useState("");

  useEffect(() => {
    const baseUrl = "https://app.relevanceai.com/agents/bcbe5a/53ba4219-0247-4c7e-a441-cd107d5783e0/f0398db0-96a2-4f11-8db8-b4c5b6fe769a/embed-chat?hide_tool_steps=false&hide_file_uploads=true&hide_conversation_list=true&bubble_style=agent&primary_color=%230f172a&bubble_icon=pd%2Fchat&input_placeholder_text=Type+your+message...&hide_logo=false&hide_description=false";
    // Append a unique session ID based on current time
    setIframeUrl(`${baseUrl}&session_id=session_${Date.now()}`);
  }, []);

  return (
    <section id="demo" className="py-24 md:py-32 px-6 md:px-12 relative overflow-hidden bg-white">
      {/* Background soft gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-3/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] -z-10" />
      
      <div className="max-w-6xl mx-auto relative">
        <AnimatedSection className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-3/10 text-accent-3 text-xs font-bold uppercase tracking-wider mb-6">
            Live Demo
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text mb-6 tracking-tight">
            Meet your new <span className="accent-text">AI team member</span>
          </h2>
          <p className="text-subdued text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Experience the speed and precision of a Tharros-built agent. 
            Designed to handle your business complexity with human-like ease.
          </p>
        </AnimatedSection>

        {/* Wide "Comfortable" Chat UI */}
        <AnimatedSection delay={0.2} variant="scale-in">
          <div className="max-w-5xl mx-auto relative">
            {/* Desktop-style Window Container */}
            <div className="clean-card overflow-hidden shadow-2xl border-border/40 bg-white min-h-[600px] md:min-h-[700px] flex flex-col">
              
              {/* Sleek Window Header */}
              <div className="px-6 py-4 border-b border-border bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400/20 border border-red-400/40" />
                    <div className="w-3 h-3 rounded-full bg-amber-400/20 border border-amber-400/40" />
                    <div className="w-3 h-3 rounded-full bg-green-400/20 border border-green-400/40" />
                  </div>
                  <div className="h-4 w-[1px] bg-border mx-2" />
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-sm font-semibold text-text">Tharros Agent Live</span>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-6 text-xs font-medium text-subdued uppercase tracking-widest">
                  <span>Lead Intelligence</span>
                  <span>24/7 Support</span>
                </div>
              </div>

              {/* The Iframe (Taking the full width/height of the card) */}
              <div className="flex-1 w-full bg-white relative">
                {iframeUrl && (
                  <iframe 
                    src={iframeUrl} 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    allow="microphone"
                    title="Tharros AI Agent"
                    className="absolute inset-0"
                  />
                )}
              </div>
            </div>

            {/* Subtle floating badge below */}
            <div className="mt-8 flex flex-wrap justify-center gap-8 md:gap-16">
              <div className="flex items-center gap-3">
                <span className="text-2xl opacity-80">🛡️</span>
                <div>
                  <p className="text-sm font-bold text-text">SOC2 Compliant</p>
                  <p className="text-[10px] text-subdued uppercase tracking-tight">Security first</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl opacity-80">🌐</span>
                <div>
                  <p className="text-sm font-bold text-text">Multilingual</p>
                  <p className="text-[10px] text-subdued uppercase tracking-tight">Handles 50+ languages</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl opacity-80">📈</span>
                <div>
                  <p className="text-sm font-bold text-text">Auto-Sync</p>
                  <p className="text-[10px] text-subdued uppercase tracking-tight">Syncs to your CRM</p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

      </div>
    </section>
  );
}
