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
  const [recommendedQuestions, setRecommendedQuestions] = useState<string[]>([]);
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
          setAgentInstance(agent);

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
    <section id="demo" className="py-16 md:py-24 px-6 md:px-12 relative overflow-hidden bg-white">
      {/* Background Sophistication */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50/50 -skew-x-12 translate-x-1/4 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left: Authoritative Capabilities */}
        <div className="lg:col-span-5">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-text animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text">Live Deployment</span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-bold text-text mb-10 leading-[1] tracking-tighter">
              An agent that <br />
              <span className="text-slate-400">commands results.</span>
            </h2>
            
            <p className="text-subdued text-lg md:text-2xl mb-12 md:mb-16 leading-relaxed max-w-lg">
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
            <div className="relative w-full max-w-[600px] mx-auto lg:ml-auto">
              
              {/* Try it Header */}
              <div className="text-center mb-8">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Interactive Demo</p>
                <h3 className="text-2xl md:text-3xl font-bold text-text">Try out our Tharros Support Agent for yourself</h3>
              </div>

              {/* Chat Container */}
              <div className="relative flex flex-col h-[550px] md:h-[650px] w-full bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100/50">
                
                {/* Chat Header - Glassmorphism */}
                <div className="px-6 md:px-10 py-5 flex items-center justify-between border-b border-slate-100/50 bg-white/70 backdrop-blur-xl sticky top-0 z-10">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-200">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white flex items-center justify-center border-2 border-white">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-text font-bold text-base tracking-tight">Tharros Agent</h3>
                      <p className="text-slate-400 text-xs font-medium">Ready to assist</p>
                    </div>
                  </div>
                  <button className="w-8 h-8 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-300 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" />
                    </svg>
                  </button>
                </div>

                {/* Messages Area - Subtle Pattern */}
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col gap-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed bg-slate-50/20 scroll-smooth"
                >
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
                          className={`max-w-[85%] md:max-w-[75%] text-sm md:text-base leading-relaxed px-6 py-4 rounded-[1.5rem] md:rounded-[2rem] shadow-sm border ${
                            msg.sender === "user" 
                            ? "bg-slate-900 text-white border-slate-800 rounded-tr-none shadow-slate-200" 
                            : "bg-white text-text border-slate-100/80 rounded-tl-none shadow-slate-100"
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[10px] text-slate-300 font-bold mt-2 px-1 uppercase tracking-widest">{msg.time}</span>
                      </motion.div>
                    ))}
                    
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-start"
                      >
                        <div className="bg-white border border-slate-100/80 px-6 py-4 rounded-[1.5rem] rounded-tl-none shadow-sm flex items-center gap-3">
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

                {/* Footer / Input Area - Integrated */}
                <div className="p-6 md:p-8 bg-white border-t border-slate-100/50">
                  
                  {/* Suggestions - Pill Style */}
                  <AnimatePresence>
                    {recommendedQuestions.length > 0 && !isTyping && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-wrap gap-2 mb-6"
                      >
                        {recommendedQuestions.map((q) => (
                          <button
                            key={q}
                            onClick={() => handleSend(q)}
                            className="px-4 py-2 bg-slate-50/50 border border-slate-200/60 rounded-full text-[11px] font-bold text-slate-500 hover:bg-accent-3 hover:text-white hover:border-accent-3 transition-all whitespace-nowrap"
                          >
                            {q}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form 
                    onSubmit={(e) => handleSend(inputValue, e)}
                    className="flex items-center gap-4 bg-slate-50/50 p-2 rounded-[1.5rem] border border-slate-100"
                  >
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Message your agent..."
                      disabled={!agentInstance || isTyping}
                      className="flex-1 bg-transparent px-5 py-2 text-sm text-text placeholder:text-slate-400 focus:outline-none disabled:opacity-50"
                    />
                    <button 
                      type="submit"
                      disabled={!inputValue.trim() || !agentInstance || isTyping}
                      className="h-12 w-12 flex items-center justify-center rounded-[1.2rem] bg-slate-900 text-white shadow-lg hover:bg-slate-800 transition-all disabled:opacity-10 active:scale-95 shrink-0"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

