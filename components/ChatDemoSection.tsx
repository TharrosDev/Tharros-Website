"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Client, Key, Agent, type Task } from "@relevanceai/sdk";
import AnimatedSection from "./AnimatedSection";

// Relevance AI Configuration (using environment variables)
const REGION = process.env.NEXT_PUBLIC_RELEVANCE_REGION || "";
const PROJECT = process.env.NEXT_PUBLIC_RELEVANCE_PROJECT || "";
const AGENT_ID = process.env.NEXT_PUBLIC_RELEVANCE_AGENT_ID || "";

type LocalMessage = {
  id: string;
  sender: "user" | "agent";
  text: string;
  time: string;
};

export default function ChatDemoSection() {
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [agentInstance, setAgentInstance] = useState<Agent | null>(null);
  const [currentTask, setCurrentTask] = useState<Task<any, any> | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize Relevance AI Client and Agent
  useEffect(() => {
    async function initRelevance() {
      if (!REGION || !PROJECT || !AGENT_ID) return;
      try {
        const storageKey = `r-${AGENT_ID}`;
        const stored = JSON.parse(localStorage.getItem(storageKey) ?? "null");
        
        let keyInstance;
        if (stored?.embedKey && stored?.conversationPrefix) {
          keyInstance = new Key({
            key: stored.embedKey,
            region: REGION as any,
            project: PROJECT,
            agentId: AGENT_ID,
            taskPrefix: stored.conversationPrefix,
          });
        } else {
          keyInstance = await Key.generateEmbedKey({
            region: REGION as any,
            project: PROJECT,
            agentId: AGENT_ID,
          });
          const { key: embedKey, taskPrefix } = keyInstance.toJSON();
          localStorage.setItem(storageKey, JSON.stringify({ embedKey, conversationPrefix: taskPrefix }));
        }

        const client = new Client(keyInstance);
        const agent = await Agent.get(AGENT_ID, client);
        setAgentInstance(agent);

        // Initial greeting
        setMessages([
          {
            id: "1",
            sender: "agent",
            text: "Hi! I'm your Tharros-powered AI agent. Ask me anything about our services.",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }
        ]);
      } catch (err) {
        console.error("Failed to initialize Relevance AI:", err);
      }
    }

    initRelevance();
  }, []);

  // Listen for messages from the task
  useEffect(() => {
    if (!currentTask) return;

    const handleMessage = ({ detail }: any) => {
      const { message } = detail;
      if (message.type === "agent-message") {
        setMessages((prev) => {
          if (prev.some(m => m.id === message.id)) return prev;
          return [...prev, {
            id: message.id,
            sender: "agent",
            text: message.text || "...",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }];
        });
        setIsTyping(false);
      }
    };

    currentTask.addEventListener("message", handleMessage);
    return () => {
      currentTask.unsubscribe();
    };
  }, [currentTask]);

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
    if (!inputValue.trim() || !agentInstance || isTyping) return;

    const text = inputValue;
    setInputValue("");
    
    const userMsgId = Date.now().toString();
    setMessages((prev) => [...prev, {
      id: userMsgId,
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);

    setIsTyping(true);

    try {
      const newTask = await agentInstance.sendMessage(text, (currentTask as any));
      if (newTask !== currentTask) {
        setCurrentTask(newTask);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setIsTyping(false);
      setMessages((prev) => [...prev, {
        id: "error",
        sender: "agent",
        text: "I encountered an error. Please try again.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    }
  };

  return (
    <section id="demo" className="py-24 md:py-32 px-6 md:px-12 relative overflow-hidden bg-bg">
      <div className="max-w-6xl mx-auto relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left: Text Content */}
        <AnimatedSection>
          <p className="section-label mb-4">Interactive Agent</p>
          <h2 className="text-3xl md:text-5xl font-bold text-text mb-6 leading-tight">
            Built for <span className="accent-text">Performance</span>
          </h2>
          <p className="text-subdued text-base md:text-lg mb-10 leading-relaxed max-w-xl">
            Experience the precision of our custom-built AI. It understands context, handles objections, and schedules calls, all within your brand&apos;s voice.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-border shadow-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-3">
                <path d="M12 22s8-4.5 8-11.8A8 8 0 0 0 4 10.2c0 7.3 8 11.8 8 11.8z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <p className="text-sm font-medium text-text">Context-aware reasoning & logic</p>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-border shadow-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-3">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <p className="text-sm font-medium text-text">Multilingual support built-in</p>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-border shadow-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-3">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
              <p className="text-sm font-medium text-text">99.9% accurate training data</p>
            </div>
          </div>
        </AnimatedSection>

        {/* Right: Compact Chat UI */}
        <AnimatedSection delay={0.2} variant="scale-in">
          <div className="relative group w-full max-w-[440px] mx-auto lg:ml-auto">
            {/* Background Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-accent-3/20 to-accent-bright/20 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
            
            <div className="relative flex flex-col h-[500px] sm:h-[550px] w-full bg-white/80 backdrop-blur-2xl rounded-[2rem] border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden">
              
              {/* Header */}
              <div className="bg-accent/5 backdrop-blur-md border-b border-white/40 p-5 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center text-white shadow-lg">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
                        <path d="M12 12L2.1 12" />
                        <path d="M12 12l9.9 0" />
                        <path d="M12 2a10 10 0 0 1 10 10" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full shadow-sm" />
                  </div>
                  <div>
                    <p className="text-text font-bold text-sm leading-none mb-1.5">Tharros Assistant</p>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <p className="text-accent-3 text-[10px] uppercase tracking-wider font-bold">Active Intelligence</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-border/60" />
                  <div className="w-2 h-2 rounded-full bg-border/60" />
                </div>
              </div>

              {/* Messages Area */}
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-5 sm:p-6 flex flex-col gap-6 bg-gradient-to-b from-transparent to-white/30"
              >
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                    >
                      <div 
                        className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm transition-all duration-300 ${
                          msg.sender === "user" 
                          ? "bg-gradient-to-br from-accent to-accent-2 text-white rounded-tr-none hover:shadow-md" 
                          : "bg-white/90 backdrop-blur-sm text-text border border-white/60 shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-tl-none hover:bg-white"
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-muted/80 mt-1.5 px-1 font-medium">{msg.time}</span>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-1.5 p-4 bg-white/60 backdrop-blur-sm border border-white/60 rounded-2xl rounded-tl-none w-14 shadow-sm"
                    >
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-accent-3" />
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-accent-3" />
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-accent-3" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Input Area */}
              <div className="p-5 bg-white/40 backdrop-blur-md border-t border-white/60">
                <form 
                  onSubmit={handleSend}
                  className="flex gap-3 bg-white/80 p-1.5 rounded-2xl border border-white shadow-inner"
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask about our AI solutions..."
                    disabled={!agentInstance || isTyping}
                    className="flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none text-text disabled:opacity-50 placeholder:text-muted/60"
                  />
                  <button 
                    type="submit"
                    disabled={!inputValue.trim() || !agentInstance || isTyping}
                    className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center hover:bg-accent-2 transition-all duration-300 disabled:opacity-30 shadow-md active:scale-95 group"
                  >
                    <svg 
                      width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    >
                      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </AnimatedSection>

      </div>
    </section>
  );
}
