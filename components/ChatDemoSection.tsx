import Script from "next/script";
import AnimatedSection from "./AnimatedSection";

export default function ChatDemoSection() {
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

        {/* Relevance AI Script-based Embed */}
        <AnimatedSection delay={0.2} variant="scale-in">
          <div className="max-w-5xl mx-auto relative">
            <div className="clean-card overflow-hidden shadow-2xl border-border/40 bg-white min-h-[400px] flex flex-col items-center justify-center p-12 text-center">
              <div className="max-w-md">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">💬</span>
                </div>
                <h3 className="text-xl font-bold text-text mb-4">Click the bubble in the corner</h3>
                <p className="text-subdued mb-8">
                  We&apos;ve integrated our real-time agent into the site. Look for the chat icon in the bottom right corner of your screen to start a conversation.
                </p>
                <div className="inline-flex items-center gap-2 text-accent-3 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-accent-3 animate-pulse" />
                  Agent is online and ready
                </div>
              </div>
            </div>

            {/* Script loading */}
            <Script 
              defer 
              data-relevanceai-share-id="bcbe5a/53ba4219-0247-4c7e-a441-cd107d5783e0/f0398db0-96a2-4f11-8db8-b4c5b6fe769a" 
              src="https://app.relevanceai.com/embed/chat-bubble.js" 
              data-share-styles="hide_tool_steps=false&hide_file_uploads=true&hide_conversation_list=true&bubble_style=agent&primary_color=%23544bfb&bubble_icon=pd%2Fchat&input_placeholder_text=Type+your+message...&hide_logo=false&hide_description=true"
            />

            {/* Subtle floating badge below */}
            <div className="mt-12 flex flex-wrap justify-center gap-8 md:gap-16">
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
