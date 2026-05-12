"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Client, Key, Agent, Workforce, type Task } from "@relevanceai/sdk";
import NavBar from "./NavBar";
import FooterSection from "./FooterSection";
import { useIsMobile } from "@/hooks/useIsMobile";
import MobileChatConsole from "./MobileChatConsole";

// Relevance AI Configuration
const REGION = process.env.NEXT_PUBLIC_RELEVANCE_REGION || "";
const PROJECT = process.env.NEXT_PUBLIC_RELEVANCE_PROJECT || "";
const AGENT_ID = process.env.NEXT_PUBLIC_RELEVANCE_INTAKE_AGENT_ID || process.env.NEXT_PUBLIC_RELEVANCE_AGENT_ID || "";

type LocalMessage = {
  id: string;
  sender: "user" | "agent";
  text: string;
  time: string;
};

interface AgentConfig {
  recommended_questions?: string[];
}

interface AgentMetadata {
  recommended_questions?: string[];
}

interface AgentResource {
  config?: AgentConfig;
  metadata?: AgentMetadata;
  sendMessage: (text: string, task: Task<any, any> | null) => Promise<Task<any, any>>;
}

export default function IntakeAgent() {
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [recommendedQuestions, setRecommendedQuestions] = useState<string[]>([]);
  const [agentInstance, setAgentInstance] = useState<AgentResource | null>(null);
  const [currentTask, setCurrentTask] = useState<Task<any, any> | null>(null);
  const [initError, setInitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    async function initRelevance() {
      if (!REGION || !PROJECT || !AGENT_ID) {
        setInitError("Environment configuration missing.");
        setIsLoading(false);
        return;
      }

      try {
        const storageKey = `r-intake-${AGENT_ID}`;
        const stored = JSON.parse(localStorage.getItem(storageKey) ?? "null");
        
        let keyInstance: Key;
        if (typeof window !== "undefined" && stored?.embedKey && stored?.conversationPrefix) {
          keyInstance = new Key({
            key: stored.embedKey,
            region: REGION as any,
            project: PROJECT,
            ...(stored.isWorkforce ? { workforceId: AGENT_ID } : { agentId: AGENT_ID }),
            taskPrefix: stored.conversationPrefix,
          });
        } else {
          try {
            keyInstance = await Key.generateEmbedKey({
              region: REGION as any,
              project: PROJECT,
              agentId: AGENT_ID,
            });
          } catch (e) {
            console.warn("Agent embed key fetch failed, attempting workforce fallback...");
            keyInstance = await Key.generateEmbedKey({
              region: REGION as any,
              project: PROJECT,
              workforceId: AGENT_ID,
            });
            (keyInstance as any)._isWorkforce = true;
          }
          
          const { key: embedKey, taskPrefix } = keyInstance.toJSON();
          if (typeof window !== "undefined") {
            localStorage.setItem(storageKey, JSON.stringify({ 
              embedKey, 
              conversationPrefix: taskPrefix,
              isWorkforce: (keyInstance as any)._isWorkforce 
            }));
          }
        }

        const client = new Client(keyInstance);
        let resource: any;
        if ((keyInstance as any)._isWorkforce || stored?.isWorkforce) {
          resource = await Workforce.get(AGENT_ID, client);
        } else {
          resource = await Agent.get(AGENT_ID, client);
        }
        setAgentInstance(resource as AgentResource);

        const config = resource.config || {};
        const metadata = resource.metadata || {};
        const initialQuestions = config.recommended_questions || metadata.recommended_questions || [];
        
        if (initialQuestions.length > 0) {
          setRecommendedQuestions(initialQuestions);
        }

        setMessages([
          {
            id: "1",
            sender: "agent",
            text: "Hello! I'm the Tharros Intake Specialist. I'm here to learn about your business and how we can help automate your workflow. What can I help you with today?",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }
        ]);
        setIsLoading(false);
      } catch (err: any) {
        console.error("Failed to initialize Intake Agent:", err);
        setInitError(err.message || "Failed to initialize agent portal.");
        setIsLoading(false);
      }
    }
    initRelevance();
  }, []);

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
        if (message.details?.recommended_questions) setRecommendedQuestions(message.details.recommended_questions);
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
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior });
    }
  };

  useEffect(() => {
    scrollToBottom(messages.length <= 1 ? "auto" : "smooth");
  }, [messages, isTyping]);

  const handleSend = async (text: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() || !agentInstance || isTyping) return;

    setInputValue("");
    setRecommendedQuestions([]);
    
    setMessages((prev) => [...prev, {
      id: Date.now().toString(),
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);

    setIsTyping(true);
    try {
      const newTask = await agentInstance.sendMessage(text, currentTask);
      if (newTask !== currentTask) setCurrentTask(newTask);
    } catch (error) {
      console.error("Error sending message:", error);
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans selection:bg-accent-3/10 selection:text-accent-3">
      <NavBar />
      
      <main className="flex-1 pt-32 pb-24 px-4 md:px-8 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Sophistication: Industrial Geometric Depth */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden industrial-grid">
          <div className="scanline" />
          <div className="absolute top-0 right-0 w-[60%] h-full bg-slate-900/[0.015] -skew-x-12 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[60%] h-full bg-slate-900/[0.015] skew-x-12 -translate-x-1/4" />
          <div 
            className="absolute inset-0 opacity-[0.2]"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, #cbd5e1 1px, transparent 0)",
              backgroundSize: "64px 64px",
            }}
          />
          {/* Animated Glows with hardware acceleration */}
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.05, 0.1, 0.05]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            style={{ willChange: "transform, opacity" }}
            className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-accent-3/10 blur-[100px] rounded-full" 
          />
          <motion.div 
            animate={{ 
              scale: [1.1, 1, 1.1],
              opacity: [0.05, 0.08, 0.05]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            style={{ willChange: "transform, opacity" }}
            className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-blue-400/5 blur-[120px] rounded-full" 
          />
        </div>

        <div className="w-full max-w-7xl relative z-10 flex flex-col h-auto md:h-[98vh]">
          {/* Premium Header - Hidden on Mobile if Console takes over */}
          {!isMobile && (
            <div className="text-center mb-8 md:mb-10">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white border border-slate-200/60 shadow-sm backdrop-blur-md text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-6"
              >
                <span className="flex gap-1">
                  <span className="w-1 h-1 rounded-full bg-accent-3 animate-pulse" />
                  <span className="w-1 h-1 rounded-full bg-accent-3 animate-pulse delay-75" />
                </span>
                Secure_Intake // System_Active
              </motion.div>
              <h1 className="text-4xl md:text-6xl font-bold text-text tracking-tighter mb-4 leading-[1.1]">
                Brief our <span className="text-accent-3 relative inline-block">
                  specialist
                  <svg className="absolute -bottom-2 left-0 w-full h-2 text-accent-3/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 0 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
                  </svg>
                </span>
              </h1>
              <p className="text-subdued text-sm md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                Brief our specialist on your business objectives. Your briefing will be securely analyzed and forwarded to our executive team for immediate review and outreach.
              </p>
            </div>
          )}
          
          {isMobile ? (
            <div className="flex-1 flex flex-col pt-4">
              <MobileChatConsole
                messages={messages}
                inputValue={inputValue}
                setInputValue={setInputValue}
                handleSend={handleSend}
                isTyping={isTyping}
                recommendedQuestions={recommendedQuestions}
                title="Intake Specialist"
                subtitle="Active System"
                modelType="CRM Intake Agent Model"
                isLoading={isLoading}
              />
              {initError && (
                <div className="mt-4 p-4 bg-white rounded-2xl border border-red-100 text-center">
                   <p className="text-red-500 text-xs font-bold">{initError}</p>
                   <button onClick={() => window.location.reload()} className="mt-2 text-[10px] uppercase tracking-widest font-bold text-slate-400">Retry</button>
                </div>
              )}
            </div>
          ) : (
            /* Chat Container: High-End Industrial Console */
            <div className="flex-1 flex flex-col bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.08)] overflow-hidden relative">
              
              {/* Console Glass Header */}
              <div className="px-6 md:px-10 py-5 md:py-6 border-b border-slate-100 bg-white/80 backdrop-blur-xl flex items-center justify-between z-20">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-200">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-text leading-none mb-1">Tharros Intake Specialist</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active System</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex flex-col items-end px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl">
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Type</span>
                    <span className="text-[10px] font-bold text-text uppercase">CRM Intake Agent Model</span>
                  </div>
                </div>
              </div>

              {/* Cinematic Messages Area */}
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 md:p-12 flex flex-col gap-8 bg-[#fdfdfd] relative"
              >
                {/* Subtle Texture Overlay */}
                <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                
                {isLoading ? (
                  <div className="flex-1 flex flex-col items-center justify-center gap-6">
                    <div className="relative w-16 h-16">
                      <div className="absolute inset-0 rounded-full border-2 border-slate-100" />
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent-3" 
                      />
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] animate-pulse">Syncing_Neural_Parameters...</p>
                  </div>
                ) : initError ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl border border-slate-100 m-4 shadow-sm">
                    <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-6">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-text mb-2 tracking-tight">Initialization Halted</h3>
                    <p className="text-subdued text-sm max-w-sm mb-8 leading-relaxed">{initError}</p>
                    <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors">
                      Reset Protocol
                    </button>
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {messages.map((msg, i) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 20, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                      >
                        <div className={`max-w-[90%] md:max-w-[80%] text-[15px] md:text-[17px] leading-relaxed px-6 py-4 md:px-8 md:py-5 rounded-[1.8rem] border shadow-sm ${
                          msg.sender === "user" 
                          ? "bg-slate-900 text-white border-slate-800 rounded-tr-none shadow-slate-900/10" 
                          : "bg-white text-text border-slate-100 rounded-tl-none shadow-slate-100/50"
                        }`}>
                          {msg.text}
                        </div>
                        <span className="text-[10px] text-slate-300 font-bold mt-2.5 px-2 uppercase tracking-widest">{msg.time}</span>
                      </motion.div>
                    ))}
                    {isTyping && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex gap-2 p-4 bg-white border border-slate-100 rounded-2xl rounded-tl-none shadow-sm"
                      >
                        {[0, 1, 2].map((_, index) => (
                          <motion.div 
                            key={index} 
                            animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }} 
                            transition={{ repeat: Infinity, duration: 1, delay: index * 0.15 }} 
                            className="w-2 h-2 bg-accent-3 rounded-full" 
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>

              {/* Premium Input Dashboard */}
              <div className="p-6 md:p-10 border-t border-slate-100 bg-white relative z-20">
                {/* Quick Commands (Recommended Questions) */}
                <AnimatePresence>
                  {recommendedQuestions.length > 0 && !isTyping && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex overflow-x-auto no-scrollbar gap-3 mb-8 pb-1"
                    >
                      {recommendedQuestions.map((q) => (
                        <button 
                          key={q} 
                          onClick={() => handleSend(q)} 
                          className="px-5 py-2.5 bg-white border border-slate-200 rounded-full text-[11px] font-bold text-slate-500 hover:border-accent-3 hover:text-accent-3 hover:shadow-lg hover:shadow-accent-3/5 transition-all whitespace-nowrap active:scale-95"
                        >
                          {q}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form 
                  onSubmit={(e) => handleSend(inputValue, e)} 
                  className="flex items-center gap-4 bg-slate-50 p-2 md:p-2.5 rounded-[2rem] border border-slate-100 focus-within:border-accent-3/30 focus-within:bg-white focus-within:shadow-2xl focus-within:shadow-slate-200/50 transition-all duration-500"
                >
                  <div className="pl-4 text-slate-300">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Describe your project goals or ask about specific features..."
                    className="flex-1 bg-transparent px-2 py-3 text-[15px] md:text-base text-text placeholder:text-slate-400 focus:outline-none"
                  />
                  <button 
                    type="submit" 
                    disabled={!inputValue.trim() || isTyping || !agentInstance} 
                    className="h-12 w-12 md:h-14 md:w-14 flex items-center justify-center rounded-[1.4rem] bg-slate-900 text-white shadow-xl hover:bg-slate-800 disabled:opacity-20 transition-all active:scale-95 group"
                  >
                    <svg width="22" height="22" className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="m22 2-7 20-4-9-9-4Z" />
                      <path d="M22 2 11 13" />
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>

      <FooterSection />
    </div>
  );
}
