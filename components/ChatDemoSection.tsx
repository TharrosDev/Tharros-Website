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
  { title: "Neural Logic", desc: "Handles complex multi-step reasoning." },
  { title: "Brand Integrity", desc: "Perfectly mirrors your professional tone." },
  { title: "Deep Integration", desc: "Syncs directly with your existing CRM." }
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
      if (!REGION || !PROJECT || !AGENT_ID) return;
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
      
      <div className="max-w-7xl xl:max-w-[90rem] mx-auto relative flex flex-col items-center">
        
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 mx-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-3 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-100">Live Deployment</span>
            </div>
            
            <h2 className="text-5xl md:text-7xl xl:text-8xl font-bold text-white mb-8 leading-[1] tracking-tighter">
              An agent that <br />
              <span className="text-slate-100">commands results.</span>
            </h2>
            
            <p className="text-slate-100 text-lg md:text-xl xl:text-2xl mb-12 leading-relaxed max-w-2xl mx-auto">
              Don&apos;t just chat. Automate. Our agents are engineered for high-stakes business environments where precision is the only metric that matters.
            </p>

            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
              {NEURAL_LOGIC_FEATURES.map((item, i) => (
                <motion.div 
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col gap-1 text-center group cursor-default"
                >
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white group-hover:text-accent-3 transition-colors">{item.title}</h4>
                  <p className="text-xs text-slate-100 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>

        {/* Re-arranged Split Layout: Header & Console side-by-side */}
        <div className="w-full">
          <AnimatedSection delay={0.2} variant="scale-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20 items-start">
              
              {/* Left Column: Briefing & Strategy */}
              <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-32">
                <div className="mb-8">
                  <p className="text-[10px] font-bold text-white uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <span className="w-2 h-[1px] bg-slate-400" />
                    Industrial Logic Demo
                  </p>
                  <h3 className="text-4xl md:text-5xl xl:text-6xl font-bold text-white tracking-tighter mb-6 leading-[1.1]">
                    Interact with <br />
                    our <span className="text-accent-3">Light Model.</span>
                  </h3>
                  <p className="text-base text-slate-100 leading-relaxed mb-10 max-w-sm">
                    Experience the responsiveness and brand alignment of a Tharros-engineered Customer Q&A Agent.
                  </p>
                </div>

                <div className="space-y-8 hidden lg:block">
                  {VERIFICATION_BLOCKS.map((item) => (
                    <div key={item.title} className="flex flex-col gap-1.5 p-4 rounded-2xl bg-slate-900/50 border border-slate-800 hover:bg-slate-900 transition-colors duration-300">
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-200">{item.label}</span>
                      <h4 className="text-xs font-bold text-white uppercase tracking-tight">{item.title}</h4>
                      <p className="text-[11px] text-white leading-normal">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Chat Console */}
              <div className="lg:col-span-7 xl:col-span-8">
                <div className="relative w-full">
                  {/* Industrial Disclaimer */}
                  <div className="mb-4 px-6">
                    <p className="text-[10px] font-bold text-white uppercase tracking-[0.15em] flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-white" />
                      Sandbox instance restricted to {MAX_PROMPTS} baseline inferences.
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
                      title="Tharros Agent"
                      subtitle="Light Model Operational"
                      modelType="Industrial Logic Demo"
                      userMessageCount={userMessageCount}
                      maxPrompts={MAX_PROMPTS}
                      isLoading={isLoading}
                      debugInfo={initError ? { error: initError } : null}
                    />
                  ) : (
                    <div className="relative flex flex-col h-[450px] xl:h-[550px] w-full bg-slate-900/40 rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden border border-white/5" style={{ willChange: "transform" }}>
                      
                      {/* Chat Header - Glassmorphism Bento Style */}
                      <div className="px-5 md:px-10 py-5 border-b border-white/5 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-slate-950 shadow-lg shadow-white/5">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                </svg>
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-slate-900 flex items-center justify-center border-2 border-slate-900">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <h3 className="text-white font-bold text-base tracking-tight leading-none mb-1.5">Tharros Agent &mdash; Light Model</h3>
                              <div className="flex items-center gap-2">
                                <span className="text-green-500 text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1">
                                  <span className="w-1 h-1 rounded-full bg-green-500 animate-ping" />
                                  Operational
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                              <span className={`text-[10px] font-black tabular-nums ${isLimitReached ? 'text-red-400' : 'text-slate-400'}`}>
                                {userMessageCount}/{MAX_PROMPTS}
                              </span>
                              <span className="text-[9px] font-bold text-slate-100 uppercase tracking-tight">Prompts</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Messages Area */}
                      <div 
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col gap-6 bg-black/20 scroll-smooth relative"
                      >
                        {/* Subtle Grainy Overlay */}
                        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
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
                      <div className="p-6 md:p-8 bg-slate-900/60 border-t border-white/5">
                        
                        {/* Suggestions */}
                        <AnimatePresence>
                          {recommendedQuestions.length > 0 && !isTyping && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex overflow-x-auto no-scrollbar gap-2 mb-6 -mx-1 px-1 pb-1"
                            >
                              {recommendedQuestions.map((q) => (
                                <button
                                  key={q}
                                  onClick={() => handleSend(q)}
                                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[11px] font-bold text-slate-300 hover:bg-accent-3 hover:text-white hover:border-accent-3 transition-all whitespace-nowrap active:scale-95"
                                >
                                  {q}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <form 
                          onSubmit={(e) => handleSend(inputValue, e)}
                          className="flex items-center gap-4 bg-white/5 p-2 rounded-[2rem] border border-white/10 focus-within:border-accent-3/30 transition-all"
                        >
                          <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={isLimitReached ? "Demo limit reached." : "Message..."}
                            disabled={!agentInstance || isTyping || isLimitReached}
                            className="flex-1 bg-transparent px-4 py-3 text-base text-white placeholder:text-slate-400 focus:outline-none disabled:opacity-50"
                          />
                          <button 
                            type="submit"
                            aria-label="Send message"
                            disabled={!inputValue.trim() || !agentInstance || isTyping || isLimitReached}
                            className="h-12 w-12 flex items-center justify-center rounded-[1.2rem] bg-white text-slate-950 shadow-lg hover:bg-slate-100 transition-all disabled:opacity-10 active:scale-90 shrink-0"
                          >
                            <svg width="20" height="20" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
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
const MessageItem = memo(({ msg }: { msg: LocalMessage }) => (
  <motion.div
    initial={{ opacity: 0, y: 15, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
  >
    <div 
      className={`max-w-[85%] md:max-w-[75%] text-base leading-relaxed px-6 py-4 rounded-[1.5rem] md:rounded-[2rem] shadow-sm border ${
        msg.sender === "user" 
        ? "bg-white text-slate-950 border-white/10 rounded-tr-none shadow-white/5" 
        : "bg-slate-800 text-white border-white/5 rounded-tl-none shadow-black/50"
      }`}
    >
      {msg.text}
    </div>
    <span className="text-[9px] text-slate-300 font-bold mt-2 px-1 uppercase tracking-widest">{msg.time}</span>
  </motion.div>
));
MessageItem.displayName = "MessageItem";

const TypingIndicator = memo(() => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-start"
  >
    <div className="bg-slate-800 border border-white/5 px-6 py-4 rounded-[1.5rem] rounded-tl-none shadow-sm flex items-center gap-3">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((_, index) => (
          <motion.div 
            key={index}
            animate={{ 
              y: [0, -6, 0],
              opacity: [0.4, 1, 0.4]
            }} 
            transition={{ 
              repeat: Infinity, 
              duration: 0.8, 
              delay: index * 0.15 
            }} 
            className="w-1.5 h-1.5 bg-accent-3 rounded-full" 
          />
        ))}
      </div>
    </div>
  </motion.div>
));
TypingIndicator.displayName = "TypingIndicator";

