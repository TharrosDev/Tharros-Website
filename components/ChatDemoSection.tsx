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
    text: "Hi! I'm the Tharros demo agent. I'm currently set up to help a local landscaping company. How can I help you today?",
    time: "10:00 AM",
  },
];

const PRE_CANNED_RESPONSES = [
  "That's a great question! For landscaping, we usually service the greater Ottawa area, including Kanata and Orleans.",
  "We typically have availability for new projects starting in 2-3 weeks. Would you like me to collect your contact info for a quote?",
  "Our pricing depends on the size of the lot, but for a standard backyard, basic weekly maintenance starts at around $60.",
  "I can certainly help with that! If you leave your email, I'll have one of our team members reach out to you directly.",
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

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: inputValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responseText = 
        PRE_CANNED_RESPONSES[Math.floor(Math.random() * PRE_CANNED_RESPONSES.length)];
      
      const agentMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "agent",
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, agentMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <section id="demo" className="py-24 md:py-28 px-6 md:px-12 relative overflow-hidden bg-bg">
      <div className="max-w-6xl mx-auto relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left: Text Content */}
        <AnimatedSection>
          <p className="section-label mb-4">Live Demo</p>
          <h2 className="text-3xl md:text-5xl font-bold text-text mb-6 leading-tight">
            See how your <span className="accent-text">AI agent</span> talks to customers
          </h2>
          <p className="text-subdued text-base md:text-lg mb-8 leading-relaxed max-w-xl">
            This isn't just a chatbot. It's a trained assistant that knows your business, your pricing, and your service area. 
            <br /><br />
            Try asking this demo agent about landscaping services, or just say hi.
          </p>
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-sm text-text font-medium">
              <div className="w-8 h-8 rounded-full bg-accent-3/10 flex items-center justify-center text-accent-3">
                ✓
              </div>
              Instant responses 24/7
            </div>
            <div className="flex items-center gap-3 text-sm text-text font-medium">
              <div className="w-8 h-8 rounded-full bg-accent-3/10 flex items-center justify-center text-accent-3">
                ✓
              </div>
              Qualifies leads automatically
            </div>
            <div className="flex items-center gap-3 text-sm text-text font-medium">
              <div className="w-8 h-8 rounded-full bg-accent-3/10 flex items-center justify-center text-accent-3">
                ✓
              </div>
              Directly books consultations
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
