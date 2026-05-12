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

interface AgentResource {
  config?: { recommended_questions?: string[]; suggested_queries?: string[] };
  metadata?: { recommended_questions?: string[] };
  sendMessage: (text: string, task: Task<any, any> | null) => Promise<Task<any, any>>;
}

export default function ChatDemoSection() {
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [recommendedQuestions, setRecommendedQuestions] = useState<string[]>([]);
  const [agentInstance, setAgentInstance] = useState<AgentResource | null>(null);
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
        try {
          if (typeof window !== "undefined" && stored?.embedKey && stored?.conversationPrefix) {
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
            if (typeof window !== "undefined") {
              localStorage.setItem(storageKey, JSON.stringify({ embedKey, conversationPrefix: taskPrefix }));
            }
          }

          const client = new Client(keyInstance);
          const agent = await Agent.get(AGENT_ID, client);
          setAgentInstance(agent as unknown as AgentResource);

          // Fetch initial recommended questions from agent config
          const config = (agent as any).config || {};
          const metadata = (agent as any).metadata || {};
          const initialQuestions = 
            config.recommended_questions || 
            metadata.recommended_questions || 
            config.suggested_queries || 
            [];
          
          if (initialQuestions.length > 0) {
            setRecommendedQuestions(initialQuestions);
          }

          // Initial greeting
          setMessages([
            {
              id: "1",
              sender: "agent",
              text: "Hi! I'm your Tharros-powered AI agent. Ask me anything about our services.",
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          ]);
        } catch (innerErr) {
          console.error("Inner Relevance init error:", innerErr);
          // Fallback or retry logic could go here
        }
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
      
      // Handle agent messages
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
        
        // Extract recommended questions if available in the message
        if (message.details?.recommended_questions) {
          setRecommendedQuestions(message.details.recommended_questions);
        } else if (message.recommended_questions) {
          setRecommendedQuestions(message.recommended_questions);
        }
        
        setIsTyping(false);
      }
    };

    currentTask.addEventListener("message", handleMessage);
    return () => {
      currentTask.removeEventListener("message", handleMessage);
      currentTask.unsubscribe();
    };
  }, [currentTask]);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior,
      });
    }
  };

  useEffect(() => {
    scrollToBottom(messages.length <= 1 ? "auto" : "smooth");
  }, [messages, isTyping]);

  const handleSend = async (text: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() || !agentInstance || isTyping) return;

    setInputValue("");
    setRecommendedQuestions([]); // Hide while thinking
    
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
    <section id="demo" className="section-padding px-4 md:px-12 xl:px-20 relative overflow-hidden bg-white industrial-grid">
      {/* Background Sophistication */}
      <div className="scanline" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50/50 -skew-x-12 translate-x-1/4 pointer-events-none" />
      
      <div className="max-w-7xl xl:max-w-[90rem] mx-auto relative grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 xl:gap-24 items-center">
        
        {/* Left: Authoritative Capabilities */}
        <div className="lg:col-span-5">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-text animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text">Live Deployment</span>
            </div>
            
            <h2 className="text-5xl md:text-7xl xl:text-8xl font-bold text-text mb-10 leading-[1] tracking-tighter">
              An agent that <br />
              <span className="text-slate-400">commands results.</span>
            </h2>
            
            <p className="text-subdued text-lg md:text-2xl xl:text-3xl mb-12 md:mb-16 leading-relaxed max-w-lg xl:max-w-xl">
              Don&apos;t just chat. Automate. Our agents are engineered for high-stakes business environments where precision is the only metric that matters.
            </p>
            
            <div className="grid grid-cols-1 gap-10">
              {[
                { title: "Neural Logic", desc: "Handles complex multi-step reasoning without failure." },
                { title: "Brand Integrity", desc: "Perfectly mirrors your professional tone and values." },
                { title: "Deep Integration", desc: "Syncs directly with your existing CRM and calendar." }
              ].map((item, i) => (
                <motion.div 
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col gap-2 border-l-2 border-slate-100 pl-8 hover:border-text transition-colors duration-500 cursor-default group"
                >
                  <h4 className="text-base font-bold uppercase tracking-widest text-text group-hover:text-accent-3 transition-colors">{item.title}</h4>
                  <p className="text-base text-subdued leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>

        {/* Right: The Friendly Agent Interface */}
        <div className="lg:col-span-7">
          <AnimatedSection delay={0.2} variant="scale-in">
            <div className="relative w-full max-w-[600px] xl:max-w-[760px] mx-auto lg:ml-auto">
              
              {/* Try it Header */}
              <div className="text-center mb-6 md:mb-10 px-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">Industrial Logic Demo</p>
                <h3 className="text-2xl md:text-3xl xl:text-4xl font-bold text-text tracking-tight">Interact with our <span className="text-accent-3">Light Model</span></h3>
              </div>

              {/* Chat Container */}
              <div className="relative flex flex-col h-[600px] md:h-[650px] xl:h-[780px] w-full bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] overflow-hidden border border-slate-100/50" style={{ willChange: "transform" }}>
                
                {/* Chat Header - Glassmorphism Bento Style */}
                <div className="px-5 md:px-10 py-4 md:py-5 border-b border-slate-100/50 bg-white/70 backdrop-blur-xl sticky top-0 z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="relative">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-200/50">
                          <svg width="20" height="20" className="md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          </svg>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center border-2 border-white">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <h3 className="text-text font-bold text-[13px] md:text-base tracking-tight leading-none mb-1">Tharros Agent &mdash; Light Model</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-green-600 text-[8px] md:text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-green-600 animate-ping" />
                            Operational
                          </span>
                          <span className="w-px h-2.5 bg-slate-200 hidden md:block" />
                          <span className="text-slate-400 text-[8px] md:text-[10px] font-bold uppercase tracking-widest hidden md:block">Latency: 24ms</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="hidden sm:flex flex-col items-end px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">Model_V</span>
                        <span className="text-[9px] font-bold text-text uppercase">1.2.4b</span>
                      </div>
                      <button className="w-9 h-9 md:w-10 md:h-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-300 transition-colors active:scale-90">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-5 md:p-10 flex flex-col gap-5 md:gap-6 bg-slate-50/10 scroll-smooth relative"
                >
                  {/* Subtle Grainy Overlay */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]" />
                  <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 15, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                      >
                        <div 
                          className={`max-w-[90%] md:max-w-[75%] text-[13px] md:text-base leading-relaxed px-5 py-3.5 md:px-6 md:py-4 rounded-[1.2rem] md:rounded-[2rem] shadow-sm border ${
                            msg.sender === "user" 
                            ? "bg-slate-900 text-white border-slate-800 rounded-tr-none shadow-slate-200/5" 
                            : "bg-white text-text border-slate-100/80 rounded-tl-none shadow-slate-100/50"
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[9px] text-slate-300 font-bold mt-2 px-1 uppercase tracking-widest">{msg.time}</span>
                      </motion.div>
                    ))}
                    
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-start"
                      >
                        <div className="bg-white border border-slate-100/80 px-5 py-3.5 rounded-[1.2rem] rounded-tl-none shadow-sm flex items-center gap-3">
                          <div className="flex gap-1.5">
                            {[0, 1, 2].map((i) => (
                              <motion.div 
                                key={i}
                                animate={{ 
                                  y: [0, -6, 0],
                                  opacity: [0.4, 1, 0.4]
                                }} 
                                transition={{ 
                                  repeat: Infinity, 
                                  duration: 0.8, 
                                  delay: i * 0.15 
                                }} 
                                className="w-1.5 h-1.5 bg-accent-3 rounded-full" 
                              />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer / Input Area */}
                <div className="p-4 md:p-8 bg-white border-t border-slate-100/50">
                  
                  {/* Suggestions - Swipeable on mobile */}
                  <AnimatePresence>
                    {recommendedQuestions.length > 0 && !isTyping && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex overflow-x-auto no-scrollbar gap-2 mb-4 md:mb-6 -mx-1 px-1 pb-1"
                      >
                        {recommendedQuestions.map((q) => (
                          <button
                            key={q}
                            onClick={() => handleSend(q)}
                            className="px-4 py-2 bg-slate-50 border border-slate-200/60 rounded-full text-[10px] md:text-[11px] font-bold text-slate-500 hover:bg-accent-3 hover:text-white hover:border-accent-3 transition-all whitespace-nowrap active:scale-95"
                          >
                            {q}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form 
                    onSubmit={(e) => handleSend(inputValue, e)}
                    className="flex items-center gap-2 md:gap-4 bg-slate-50 p-1.5 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 focus-within:border-accent-3/30 transition-all"
                  >
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Message..."
                      disabled={!agentInstance || isTyping}
                      className="flex-1 bg-transparent px-4 py-2.5 text-sm text-text placeholder:text-slate-400 focus:outline-none disabled:opacity-50"
                    />
                    <button 
                      type="submit"
                      aria-label="Send message"
                      disabled={!inputValue.trim() || !agentInstance || isTyping}
                      className="h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-[1rem] md:rounded-[1.2rem] bg-slate-900 text-white shadow-lg hover:bg-slate-800 transition-all disabled:opacity-10 active:scale-90 shrink-0"
                    >
                      <svg width="18" height="18" className="md:w-5 md:h-5" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
                      </svg>
                    </button>
                  </form>
                </div>
              </div>

            </div>
          </AnimatedSection>
        </div>

      </div>
    </section>
  );
}

