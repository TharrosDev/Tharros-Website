"use client";

import AnimatedSection from "./AnimatedSection";

export default function ChatDemoSection() {
  return (
    <section id="demo" className="py-24 md:py-28 px-6 md:px-12 relative overflow-hidden bg-bg">
      <div className="max-w-6xl mx-auto relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left: Text Content */}
        <AnimatedSection>
          <p className="section-label mb-4">Interactive Demo</p>
          <h2 className="text-3xl md:text-5xl font-bold text-text mb-6 leading-tight">
            Experience the <span className="accent-text">Tharros Agent</span>
          </h2>
          <p className="text-subdued text-base md:text-lg mb-8 leading-relaxed max-w-xl">
            This interface is exactly what your customers see. It&apos;s fast, intuitive, and built to reflect your brand&apos;s personality while handling complex queries.
            <br /><br />
            Ask a question on the right to see how seamlessly it handles interaction.
          </p>
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-sm text-text font-medium">
              <div className="w-8 h-8 rounded-full bg-accent-3/10 flex items-center justify-center text-accent-3">
                ✓
              </div>
              Consistent inquiry handling
            </div>
            <div className="flex items-center gap-3 text-sm text-text font-medium">
              <div className="w-8 h-8 rounded-full bg-accent-3/10 flex items-center justify-center text-accent-3">
                ✓
              </div>
              Responses within the week
            </div>
            <div className="flex items-center gap-3 text-sm text-text font-medium">
              <div className="w-8 h-8 rounded-full bg-accent-3/10 flex items-center justify-center text-accent-3">
                ✓
              </div>
              Automated follow-up logic
            </div>
          </div>
        </AnimatedSection>

        {/* Right: Embedded Relevance AI Agent */}
        <AnimatedSection delay={0.2} variant="scale-in">
          <div className="clean-card overflow-hidden h-[550px] md:h-[600px] shadow-xl border-border/50 relative bg-white">
            <iframe 
              src="https://app.relevanceai.com/agents/bcbe5a/53ba4219-0247-4c7e-a441-cd107d5783e0/f0398db0-96a2-4f11-8db8-b4c5b6fe769a/embed-chat?hide_tool_steps=false&hide_file_uploads=true&hide_conversation_list=true&bubble_style=agent&primary_color=%23544bfb&bubble_icon=pd%2Fchat&input_placeholder_text=Type+your+message...&hide_logo=false&hide_description=false" 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              allow="microphone"
              title="Tharros AI Agent"
              className="absolute inset-0"
            />
          </div>
        </AnimatedSection>

      </div>
    </section>
  );
}
