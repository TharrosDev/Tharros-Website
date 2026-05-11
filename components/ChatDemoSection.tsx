"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import AnimatedSection from "./AnimatedSection";

type Message = {
  id: string;
  sender: "user" | "agent";
  text: string;
  time: string;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    sender: "agent",
    text: "Hi! I'm your Tharros-powered AI agent. How can I help your business today?",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
];

export default function ChatDemoSection() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: inputValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = inputValue; // Store to send to API
    setInputValue("");
    setIsTyping(true);

    try {
      /* 
         --- REAL AGENT INTEGRATION START ---
         Replace the code below with your actual API call.
         Example:
         const response = await fetch('YOUR_API_ENDPOINT', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ message: currentInput })
         });
         const data = await response.json();
         const responseText = data.reply;
      */

      // Mock delay to simulate network latency
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const responseText = "Connection successful. Replace this logic in ChatDemoSection.tsx to stream or return responses from your custom agent.";

      /* --- REAL AGENT INTEGRATION END --- */

      const agentMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "agent",
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, agentMsg]);
    } catch (error) {
      console.error("Error fetching agent response:", error);
      // Fallback message
      const errorMsg: Message = {
        id: "error",
        sender: "agent",
        text: "Sorry, I'm having trouble connecting to my brain right now. Please try again later.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

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
              Fully custom logic integration
            </div>
            <div className="flex items-center gap-3 text-sm text-text font-medium">
              <div className="w-8 h-8 rounded-full bg-accent-3/10 flex items-center justify-center text-accent-3">
                ✓
              </div>
              Real-time response streaming
            </div>
            <div className="flex items-center gap-3 text-sm text-text font-medium">
              <div className="w-8 h-8 rounded-full bg-accent-3/10 flex items-center justify-center text-accent-3">
                ✓
              </div>
              Responsive across all devices
            </div>
          </div>
        </AnimatedSection>

        {/* Right: Chat UI */}
        <AnimatedSection delay={0.2} variant="scale-in">
          <div className="clean-card overflow-hidden flex flex-col h-[500px] md:h-[550px] shadow-xl border-border/50">
            {/* Header */}
            <div className="bg-white border-b border-border p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold text-sm">
                    T
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                </div>
                <div>
                  <p className="text-text font-bold text-sm">Tharros Agent</p>
                  <p className="text-muted text-xs">Customer Service</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-border" />
                <div className="w-2 h-2 rounded-full bg-border" />
              </div>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-slate-50/50"
            >
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                  >
                    <div 
                      className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                        msg.sender === "user" 
                        ? "bg-accent text-white rounded-tr-none" 
                        : "bg-white text-text border border-border shadow-sm rounded-tl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-muted mt-1 px-1">{msg.time}</span>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-1.5 p-3 bg-white border border-border rounded-2xl rounded-tl-none w-14"
                  >
                    <motion.div 
                      animate={{ opacity: [0.3, 1, 0.3] }} 
                      transition={{ repeat: Infinity, duration: 1 }} 
                      className="w-1.5 h-1.5 rounded-full bg-muted" 
                    />
                    <motion.div 
                      animate={{ opacity: [0.3, 1, 0.3] }} 
                      transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} 
                      className="w-1.5 h-1.5 rounded-full bg-muted" 
                    />
                    <motion.div 
                      animate={{ opacity: [0.3, 1, 0.3] }} 
                      transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} 
                      className="w-1.5 h-1.5 rounded-full bg-muted" 
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input Area */}
            <form 
              onSubmit={handleSend}
              className="p-4 bg-white border-t border-border flex gap-3"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 bg-surface border border-border rounded-full px-5 py-2.5 text-sm focus:outline-none focus:border-accent-3 transition-colors text-text"
              />
              <button 
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white hover:bg-accent-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </button>
            </form>
          </div>
        </AnimatedSection>

      </div>
    </section>
  );
}
