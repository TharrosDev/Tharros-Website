"use client";

import { useState, useEffect, useRef, useCallback, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Client, Key, Agent, type Task } from "@relevanceai/sdk";
import AnimatedSection from "./AnimatedSection";
import { useIsMobile } from "@/hooks/useIsMobile";
import MobileChatConsole from "./MobileChatConsole";

// Relevance AI Configuration
const REGION = process.env.NEXT_PUBLIC_RELEVANCE_REGION || "";
const PROJECT = process.env.NEXT_PUBLIC_RELEVANCE_PROJECT || "";
const AGENT_ID = process.env.NEXT_PUBLIC_RELEVANCE_AGENT_ID || "";

// Performance Constants & Static Data
const MAX_PROMPTS = 3;
const TIME_FORMATTER = new Intl.DateTimeFormat([], { hour: '2-digit', minute: '2-digit' });
const formatTime = () => TIME_FORMATTER.format(new Date());

const NEURAL_LOGIC_FEATURES = [
  { title: "Core Reasoning", desc: "Handles complex multi-step tasks." },
  { title: "Brand Identity", desc: "Perfectly mirrors your professional tone." },
  { title: "System Integration", desc: "Syncs directly with your existing tools." }
] as const;

const VERIFICATION_BLOCKS = [
  { label: "Logic Flow", title: "Adaptive Reasoning", desc: "Dynamically adjusts response depth based on inquiry complexity." },
  { label: "Identity", title: "Brand Safe", desc: "Hard-coded boundaries ensure absolute professional integrity." },
] as const;

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
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [recommendedQuestions, setRecommendedQuestions] = useState<string[]>([]);
  const [agentInstance, setAgentInstance] = useState<AgentResource | null>(null);
  const [currentTask, setCurrentTask] = useState<Task<any, any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const [userMessageCount, setUserMessageCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const countRef = useRef(0); // For stable access in listeners

  const isLimitReached = userMessageCount >= MAX_PROMPTS;

  // Sync ref with state
  useEffect(() => {
    countRef.current = userMessageCount;
  }, [userMessageCount]);

  // Persistence: Load count on mount
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`pc-${AGENT_ID}`);
      if (stored) {
        const count = parseInt(stored, 10);
        setUserMessageCount(count);
        countRef.current = count;
      }
      setIsInitialized(true);
    }
  }, []);

  // Persistence: Save count on change (only after initialization)
  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      localStorage.setItem(`pc-${AGENT_ID}`, userMessageCount.toString());
    }
  }, [userMessageCount, isInitialized]);

  // Initialize Relevance AI Client and Agent
  useEffect(() => {
    async function initRelevance() {
      if (!REGION || !PROJECT || !AGENT_ID) {
        setInitError("Agent not configured. Please contact support.");
        setIsLoading(false);
        return;
      }
      try {
        const storageKey = `r-${AGENT_ID}`;
        const storedJson = localStorage.getItem(storageKey);
        const stored = storedJson ? JSON.parse(storedJson) : null;
        
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
              time: formatTime(),
            }
          ]);
          setIsLoading(false);
        } catch (innerErr: any) {
          console.error("Inner Relevance init error:", innerErr);
          setInitError(innerErr.message || "Failed to initialize agent.");
          setIsLoading(false);
        }
      } catch (err: any) {
        console.error("Failed to initialize Relevance AI:", err);
        setInitError(err.message || "System error.");
        setIsLoading(false);
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
            time: formatTime(),
          }];
        });
        
        // Extract recommended questions if available in the message
        // Use countRef to avoid re-subscribing on every message
        if (countRef.current < MAX_PROMPTS) {
          if (message.details?.recommended_questions) {
            setRecommendedQuestions(message.details.recommended_questions);
          } else if (message.recommended_questions) {
            setRecommendedQuestions(message.recommended_questions);
          }
        }
        
        setIsTyping(false);
      }
    };

    currentTask.addEventListener("message", handleMessage);
    return () => {
      currentTask.removeEventListener("message", handleMessage);
      currentTask.unsubscribe();
    };
  }, [currentTask]); // Only re-subscribe if the task instance changes

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior,
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom(messages.length <= 1 ? "auto" : "smooth");
  }, [messages, isTyping, scrollToBottom]);

  const handleSend = useCallback(async (text: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() || !agentInstance || isTyping || countRef.current >= MAX_PROMPTS) return;

    setInputValue("");
    setRecommendedQuestions([]); // Hide while thinking
    setUserMessageCount(prev => prev + 1);
    
    const userMsgId = Date.now().toString();
    setMessages((prev) => [...prev, {
      id: userMsgId,
      sender: "user",
      text,
      time: formatTime(),
    }]);

    setIsTyping(true);

    try {
      const newTask = await agentInstance.sendMessage(text, currentTask);
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
        time: formatTime(),
      }]);
    }
  }, [agentInstance, currentTask, isTyping]);

  return (
    <section className="section-padding px-4 md:px-12 xl:px-20 relative overflow-hidden bg-slate-950 industrial-grid">
      {/* Anchor for navigation */}
      <div id="demo" className="absolute top-16 md:top-24 xl:top-32 pointer-events-none" />
      
      {/* Background Sophistication */}
      <div className="scanline" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-900/40 -skew-x-12 translate-x-1/4 pointer-events-none" />
      
      {/* Neural Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-3/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-white/5 blur-[120px] rounded-full pointer-events-none" style={{ animationDelay: '1s' }} />

      <div className="max-w-7xl xl:max-w-[90rem] mx-auto relative flex flex-col items-center z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-32">
          <AnimatedSection>

            
            <h2 className="text-5xl md:text-8xl xl:text-9xl font-bold text-white mb-12 leading-[1.1] tracking-tighter">
              An agent that <br />
              <span className="text-slate-500">commands results.</span>
            </h2>
            
            <p className="text-slate-200 text-lg md:text-2xl xl:text-3xl mb-16 leading-relaxed max-w-3xl mx-auto font-medium opacity-90">
              High-stakes automation for high-impact businesses. <br className="hidden md:block" />
              Test our <span className="text-accent-3">Commercial Model</span> in real-time.
            </p>

            <div className="flex flex-wrap justify-center gap-12 md:gap-20 lg:gap-24">
              {NEURAL_LOGIC_FEATURES.map((feature, i) => (
                <motion.div 
                  key={feature.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center text-center max-w-[280px]"
                >
                  <h4 className="text-accent-3 font-black text-xs md:text-sm uppercase tracking-[0.3em] mb-4">
                    {feature.title}
                  </h4>
                  <p className="text-slate-200 text-base md:text-lg lg:text-xl font-medium leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>

        {/* Re-arranged Split Layout: Header & Console side-by-side */}
        <div className="w-full">
          <AnimatedSection delay={0.2} variant="scale-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24 items-start">
              
              {/* Left Column: Briefing & Strategy */}
              <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-32">
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-px bg-accent-3" />
                  </div>
                  <h3 className="text-5xl md:text-6xl xl:text-7xl font-bold text-white tracking-tighter mb-10 leading-[1.1]">
                    Operational <br />
                    <span className="text-accent-3">Excellence.</span>
                  </h3>
                  <p className="text-lg text-slate-300 leading-relaxed mb-10 max-w-sm">
                    This instance demonstrates the core intelligence used in our custom service deployments.
                  </p>
                </div>

                <div className="space-y-4 hidden lg:block">
                  {VERIFICATION_BLOCKS.map((item) => (
                    <div key={item.title} className="flex flex-col gap-2 p-5 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-500 group">
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-accent-3 opacity-50 group-hover:opacity-100 transition-opacity">{item.label}</span>
                      <h4 className="text-sm font-bold text-white uppercase tracking-tight">{item.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Chat Console */}
              <div className="lg:col-span-7 xl:col-span-8 relative">
                {/* Decorative Frame Elements */}
                <div className="absolute -top-12 -right-12 w-48 h-48 border-t-2 border-r-2 border-white/5 rounded-tr-[4rem] pointer-events-none" />
                <div className="absolute -bottom-12 -left-12 w-48 h-48 border-b-2 border-l-2 border-white/5 rounded-bl-[4rem] pointer-events-none" />

                <div className="relative w-full">
                  {/* Industrial Disclaimer */}
                  <div className="mb-6 flex items-center justify-between px-4">
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                      SESSION CAPACITY: {MAX_PROMPTS} INQUIRIES
                    </p>
                  </div>

                  {isMobile ? (
                    <MobileChatConsole
                      messages={messages}
                      inputValue={inputValue}
                      setInputValue={setInputValue}
                      handleSend={handleSend}
                      isTyping={isTyping}
                      recommendedQuestions={recommendedQuestions}
                      title="Tharros AI Agent"
                      subtitle="Live Operational"
                      modelType="Commercial Demo"
                      userMessageCount={userMessageCount}
                      maxPrompts={MAX_PROMPTS}
                      isLoading={isLoading}
                      debugInfo={initError ? { error: initError } : null}
                    />
                  ) : (
                    <div className="relative flex flex-col h-[500px] xl:h-[650px] w-full bg-slate-900/40 rounded-[3rem] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.7)] overflow-hidden border border-white/10 group/console" style={{ willChange: "transform" }}>
                      
                      {/* Chat Header - Glassmorphism Bento Style with Telemetry */}
                      <div className="p-6 md:p-8 border-b border-white/5 bg-slate-900/90 backdrop-blur-2xl sticky top-0 z-10">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-6">
                            <div className="relative group/icon">
                              <div className="w-14 h-14 rounded-[1.25rem] bg-white flex items-center justify-center text-slate-950 shadow-2xl group-hover/icon:scale-110 transition-transform duration-500">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                </svg>
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-900 flex items-center justify-center border-[3px] border-slate-900">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                              </div>
                            </div>
                            <div className="flex flex-col gap-1">
                              <h3 className="text-white font-bold text-xl tracking-tighter leading-none">Tharros AI Agent</h3>
                              <div className="flex items-center gap-3">
                                <span className="text-green-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                                  Status: Ready
                                </span>
                                <span className="w-1 h-1 rounded-full bg-white/10" />
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Ottawa, Canada</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/10 shadow-inner">
                              <div className="flex flex-col items-end">
                                <span className={`text-[12px] font-black tabular-nums leading-none mb-0.5 ${isLimitReached ? 'text-red-400' : 'text-white'}`}>
                                  {userMessageCount}/{MAX_PROMPTS}
                                </span>
                                <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">INQUIRIES</span>
                              </div>
                              <div className="w-px h-6 bg-white/10" />
                              <div className="w-2 h-2 rounded-full bg-accent-3 animate-pulse" />
                            </div>
                          </div>
                        </div>

                        {/* Live Telemetry Row */}
                        <div className="flex items-center gap-6 pt-4 border-t border-white/[0.03]">
                          <div className="flex items-center gap-2">
                            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Neural_Load:</span>
                            <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                              <motion.div 
                                animate={{ width: ["15%", "45%", "30%"] }} 
                                transition={{ repeat: Infinity, duration: 4 }}
                                className="h-full bg-accent-3" 
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Latency:</span>
                            <span className="text-[8px] font-black text-accent-3 tabular-nums">24ms</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Uptime:</span>
                            <span className="text-[8px] font-black text-white/40 tabular-nums">99.98%</span>
                          </div>
                        </div>
                      </div>

                      {/* Messages Area */}
                      <div
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto p-8 md:p-12 flex flex-col gap-8 bg-black/40 scroll-smooth relative"
                      >
                        {/* Subtle Grainy Overlay */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />

                        {isLoading && (
                          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-16">
                            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em]">Initializing_Agent</p>
                          </div>
                        )}

                        {!isLoading && initError && (
                          <div className="flex-1 flex flex-col items-center justify-center gap-3 py-16">
                            <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-red-400">
                                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                              </svg>
                            </div>
                            <p className="text-[11px] font-black text-red-400/70 uppercase tracking-[0.2em]">Agent Offline</p>
                            <p className="text-xs text-slate-500 text-center max-w-xs">{initError}</p>
                          </div>
                        )}

                        <AnimatePresence initial={false}>
                          {messages.map((msg) => (
                            <MessageItem key={msg.id} msg={msg} />
                          ))}

                          {isTyping && (
                            <TypingIndicator />
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Footer / Input Area */}
                      <div className="p-6 md:p-7 bg-slate-900/80 border-t border-white/10 backdrop-blur-xl">
                        
                        {/* Suggestions */}
                        <AnimatePresence>
                          {recommendedQuestions.length > 0 && !isTyping && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex overflow-x-auto no-scrollbar gap-3 mb-8 -mx-1 px-1 pb-1"
                            >
                              {recommendedQuestions.map((q) => (
                                <button
                                  key={q}
                                  onClick={() => handleSend(q)}
                                  className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black text-slate-300 hover:bg-white hover:text-slate-950 hover:border-white transition-all whitespace-nowrap active:scale-95 shadow-lg uppercase tracking-widest"
                                >
                                  {q}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <form 
                          onSubmit={(e) => handleSend(inputValue, e)}
                          className="flex items-center gap-4 bg-white/5 p-3 rounded-[2.5rem] border border-white/10 focus-within:border-accent-3/40 focus-within:bg-white/[0.08] transition-all duration-500 shadow-2xl"
                        >
                          <div className="flex items-center gap-4 px-6 py-4 flex-1">
                            <span className="text-accent-3 font-black text-lg select-none opacity-50 tracking-tighter font-mono">{">"}</span>
                            <input
                              type="text"
                              value={inputValue}
                              onChange={(e) => setInputValue(e.target.value)}
                              placeholder={isLoading ? "BOOTING_SYSTEM..." : isLimitReached ? "CAPACITY_LIMIT_REACHED" : "INITIATE_INQUIRY..."}
                              disabled={isLoading || isTyping || isLimitReached || !!initError}
                              className="flex-1 bg-transparent text-lg text-white placeholder:text-slate-600 focus:outline-none disabled:opacity-50 font-medium tracking-tight"
                            />
                          </div>
                          <button
                            type="submit"
                            aria-label="Send message"
                            disabled={!inputValue.trim() || !agentInstance || isLoading || isTyping || isLimitReached}
                            className="h-14 w-14 flex items-center justify-center rounded-[1.75rem] bg-white text-slate-950 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:bg-slate-100 hover:scale-105 transition-all disabled:opacity-5 disabled:grayscale active:scale-95 shrink-0"
                          >
                            <svg width="24" height="24" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
                            </svg>
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>

  );
}

// Sub-components for better performance and readability
const MessageItem = memo(({ msg }: { msg: LocalMessage }) => {
  const isAgent = msg.sender === "agent";
  
  return (
    <motion.div
      initial={{ opacity: 0, x: isAgent ? -20 : 20, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
    >
      <div 
        className={`relative max-w-[85%] md:max-w-[75%] text-base leading-relaxed px-7 py-5 shadow-2xl border transition-all duration-500 ${
          isAgent 
          ? "bg-slate-900/60 text-white border-white/5 rounded-[2rem] rounded-tl-none backdrop-blur-md" 
          : "bg-white text-slate-950 border-white/10 rounded-[2rem] rounded-tr-none font-semibold"
        }`}
        style={{
          clipPath: isAgent 
            ? "polygon(0 0, 100% 0, 100% 100%, 8% 100%, 0 85%)" 
            : "polygon(0 0, 100% 0, 100% 85%, 92% 100%, 0 100%)"
        }}
      >
        {isAgent && (
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
            <div className="absolute top-0 left-0 w-1 h-full bg-accent-3/40" />
            <div className="absolute top-0 left-0 w-full h-px bg-white/10" />
          </div>
        )}
        <p className={isAgent ? "font-medium" : ""}>
          {msg.text}
        </p>
      </div>
      <div className={`flex items-center gap-2 mt-3 px-2 ${isAgent ? "flex-row" : "flex-row-reverse"}`}>
        <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">{isAgent ? "MODEL_OUT" : "USER_IN"}</span>
        <div className="w-1 h-1 rounded-full bg-white/10" />
        <span className="text-[9px] text-slate-400 font-bold tabular-nums uppercase tracking-widest">{msg.time}</span>
      </div>
    </motion.div>
  );
});
MessageItem.displayName = "MessageItem";

const TypingIndicator = memo(() => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    className="flex flex-col items-start gap-3"
  >
    <div className="bg-slate-900/60 border border-white/10 px-6 py-4 rounded-2xl rounded-tl-none flex flex-col gap-3 min-w-[160px] backdrop-blur-md">
      <div className="flex items-center justify-between gap-8">
        <span className="text-[9px] font-black text-accent-3 uppercase tracking-[0.2em] animate-pulse">Neural_Processing</span>
        <div className="flex gap-1">
          {[0, 1, 2].map((_, index) => (
            <motion.div 
              key={index}
              animate={{ opacity: [0.3, 1, 0.3] }} 
              transition={{ repeat: Infinity, duration: 1, delay: index * 0.2 }} 
              className="w-1 h-1 bg-accent-3 rounded-full" 
            />
          ))}
        </div>
      </div>
      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, repeat: Infinity }}
          className="h-full bg-accent-3/50" 
        />
      </div>
    </div>
  </motion.div>
));
TypingIndicator.displayName = "TypingIndicator";

