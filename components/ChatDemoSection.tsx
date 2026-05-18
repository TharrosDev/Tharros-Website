"use client";

import { useState, useEffect, useRef, useCallback, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Client, Key, Agent, type Task } from "@relevanceai/sdk";
import AnimatedSection from "./AnimatedSection";
import { useIsMobile } from "@/hooks/useIsMobile";
import MobileChatConsole from "./MobileChatConsole";
import FormattedMessage from "./FormattedMessage";

// Relevance AI Configuration
const REGION = process.env.NEXT_PUBLIC_RELEVANCE_REGION || "";
const PROJECT = process.env.NEXT_PUBLIC_RELEVANCE_PROJECT || "";
const AGENT_ID = process.env.NEXT_PUBLIC_RELEVANCE_AGENT_ID || "";

// Performance Constants & Static Data
const MAX_PROMPTS = 3;
const TIME_FORMATTER = new Intl.DateTimeFormat([], { hour: '2-digit', minute: '2-digit' });
const formatTime = () => TIME_FORMATTER.format(new Date());

const NEURAL_LOGIC_FEATURES = [
  { title: "Real Answers", desc: "Answers questions the way your front desk would." },
  { title: "Your Voice", desc: "Tuned to your services, your tone, your scope." },
  { title: "Wired In", desc: "Connects to your CRM, intake, and messaging." }
] as const;

const VERIFICATION_BLOCKS = [
  { label: "Plain Talk", title: "Clear Answers", desc: "Short for simple questions, deeper when the work calls for it." },
  { label: "On Topic", title: "Stays in Scope", desc: "Trained on your services. Won't wander into territory it shouldn't." },
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
    <section className="section-padding px-4 sm:px-5 md:px-12 xl:px-20 relative overflow-hidden bg-slate-950 industrial-grid">
      {/* Anchor for navigation */}
      <div id="demo" className="absolute top-16 md:top-24 xl:top-32 pointer-events-none" />

      {/* Background Sophistication */}
      <div className="scanline" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-900/40 -skew-x-12 translate-x-1/4 pointer-events-none" />

      {/* Neural Glows */}
      <div className="absolute top-1/4 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-accent-3/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-white/5 blur-[120px] rounded-full pointer-events-none" style={{ animationDelay: '1s' }} />

      <div className="max-w-7xl xl:max-w-[90rem] 3xl:max-w-[120rem] 4xl:max-w-[140rem] mx-auto relative flex flex-col items-center z-10">

        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-32 3xl:mb-48 w-full">
          <AnimatedSection>


            <h2 className="text-[2.4rem] leading-[1.05] sm:text-5xl md:text-8xl xl:text-9xl 3xl:text-[11rem] 4xl:text-[13rem] font-bold text-white mb-6 sm:mb-10 md:mb-12 3xl:mb-20 sm:leading-[1.1] tracking-tighter">
              An agent that <br />
              <span className="text-slate-500">shows up.</span>
            </h2>

            <p className="text-slate-200 text-base leading-relaxed sm:text-lg md:text-2xl xl:text-3xl 3xl:text-4xl 4xl:text-5xl mb-10 sm:mb-16 3xl:mb-24 max-w-md sm:max-w-3xl 3xl:max-w-6xl mx-auto font-medium opacity-90">
              Built once, embedded into your site, live the moment your visitors land. <br className="hidden md:block" />
              Try ours in <span className="text-accent-3">real time</span>.
            </p>

            <div className="grid grid-cols-1 sm:flex sm:flex-wrap justify-center gap-6 sm:gap-12 md:gap-20 lg:gap-24 3xl:gap-32 max-w-md sm:max-w-none mx-auto">
              {NEURAL_LOGIC_FEATURES.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center text-center max-w-full sm:max-w-[280px] 3xl:max-w-[400px]"
                >
                  <h4 className="text-accent-3 font-black text-[11px] sm:text-xs md:text-sm 3xl:text-base uppercase tracking-[0.3em] mb-2.5 sm:mb-4 3xl:mb-8">
                    {feature.title}
                  </h4>
                  <p className="text-slate-200 text-base md:text-lg lg:text-xl 3xl:text-3xl font-medium leading-relaxed">
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-16 xl:gap-24 3xl:gap-32 items-start">

              {/* Left Column: Briefing & Strategy */}
              <div className="lg:col-span-5 xl:col-span-4 3xl:col-span-3 lg:sticky lg:top-32">
                <div className="mb-6 sm:mb-8 lg:mb-12 3xl:mb-24">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6 3xl:mb-12">
                    <div className="w-8 h-px bg-accent-3 3xl:w-16" />
                  </div>
                  <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 3xl:text-8xl 4xl:text-9xl font-bold text-white tracking-tighter mb-5 sm:mb-8 md:mb-10 3xl:mb-16 leading-[1.1]">
                    A live agent, <br />
                    <span className="text-accent-3">right now.</span>
                  </h3>
                  <p className="text-base sm:text-lg text-slate-300 3xl:text-2xl leading-relaxed mb-6 sm:mb-10 3xl:mb-20 max-w-md lg:max-w-sm 3xl:max-w-xl">
                    Same engine we embed into Ottawa small business sites. Ask it about Tharros, or how we&apos;d build one for you.
                  </p>
                </div>

                <div className="space-y-4 3xl:space-y-8 hidden lg:block">
                  {VERIFICATION_BLOCKS.map((item) => (
                    <div key={item.title} className="flex flex-col gap-2 3xl:gap-4 p-5 3xl:p-10 rounded-[2rem] 3xl:rounded-[3rem] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-500 group">
                      <span className="text-[9px] 3xl:text-xs font-black uppercase tracking-[0.3em] text-accent-3 opacity-50 group-hover:opacity-100 transition-opacity">{item.label}</span>
                      <h4 className="text-sm 3xl:text-xl font-bold text-white uppercase tracking-tight">{item.title}</h4>
                      <p className="text-xs 3xl:text-lg text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Chat Console */}
              <div className="lg:col-span-7 xl:col-span-8 3xl:col-span-9 relative">
                {/* Decorative Frame Elements (hidden on mobile to avoid clipping) */}
                <div className="hidden lg:block absolute -top-12 -right-12 w-48 h-48 3xl:w-80 3xl:h-80 border-t-2 border-r-2 border-white/5 rounded-tr-[4rem] 3xl:rounded-tr-[8rem] pointer-events-none" />
                <div className="hidden lg:block absolute -bottom-12 -left-12 w-48 h-48 3xl:w-80 3xl:h-80 border-b-2 border-l-2 border-white/5 rounded-bl-[4rem] 3xl:rounded-bl-[8rem] pointer-events-none" />

                <div className="relative w-full">
                  {/* Industrial Disclaimer */}
                  <div className="mb-4 sm:mb-6 3xl:mb-10 px-2 sm:px-4">
                    <p className="text-[10px] 3xl:text-sm font-black text-white/30 uppercase tracking-[0.25em] flex items-center gap-2.5">
                      <span className="relative flex w-1.5 h-1.5 3xl:w-3 3xl:h-3">
                        <span className="absolute inset-0 rounded-full bg-accent-3/60 animate-ping" />
                        <span className="relative w-1.5 h-1.5 3xl:w-3 3xl:h-3 rounded-full bg-accent-3" />
                      </span>
                      Live Preview
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
                      subtitle="Online"
                      modelType="Live Demo"
                      userMessageCount={userMessageCount}
                      maxPrompts={MAX_PROMPTS}
                      isLoading={isLoading}
                      debugInfo={initError ? { error: initError } : null}
                    />
                  ) : (
                    <div className="relative flex flex-col h-[500px] xl:h-[650px] 3xl:h-[900px] 4xl:h-[1100px] w-full bg-white rounded-[3rem] 3xl:rounded-[5rem] shadow-[0_60px_120px_-30px_rgba(2,6,23,0.55)] overflow-hidden border border-slate-200 group/console ring-1 ring-slate-900/5" style={{ willChange: "transform" }}>

                      {/* Accent strip at top of console */}
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-3/60 to-transparent pointer-events-none z-20" />

                      {/* Chat Header */}
                      <div className="relative p-4 md:p-5 3xl:p-10 border-b border-slate-200 bg-gradient-to-b from-white to-slate-50/60 backdrop-blur-2xl z-10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 3xl:gap-8">
                            <div className="relative group/icon">
                              <div className="absolute inset-0 rounded-2xl 3xl:rounded-3xl bg-accent-3/30 blur-xl opacity-0 group-hover/icon:opacity-100 transition-opacity duration-500" />
                              <div className="relative w-11 h-11 3xl:w-20 3xl:h-20 rounded-2xl 3xl:rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center text-white shadow-[0_8px_24px_-8px_rgba(2,6,23,0.6)] group-hover/icon:scale-105 transition-transform duration-500 ring-1 ring-white/10">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="3xl:scale-150">
                                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                </svg>
                              </div>
                              <span className="absolute -bottom-0.5 -right-0.5 3xl:-bottom-2 3xl:-right-2 flex w-3.5 h-3.5 3xl:w-6 3xl:h-6">
                                <span className="absolute inset-0 rounded-full bg-accent-3/50 animate-ping" />
                                <span className="relative w-3.5 h-3.5 3xl:w-6 3xl:h-6 rounded-full bg-accent-3 border-2 border-white" />
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <h3 className="text-slate-950 font-bold text-base 3xl:text-4xl tracking-tighter leading-none mb-1.5 3xl:mb-3">Tharros AI Agent</h3>
                              <span className="text-slate-400 text-[9px] 3xl:text-sm font-black uppercase tracking-[0.25em]">Online · Ottawa</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 3xl:gap-6">
                            <div className="flex flex-col items-end gap-1.5 3xl:gap-3">
                              <span className={`text-[8px] 3xl:text-xs font-black uppercase tracking-[0.25em] leading-none transition-colors duration-500 ${isLimitReached ? "text-red-500" : "text-slate-400"}`}>
                                {isLimitReached ? "Limit Reached" : "Left"}
                              </span>
                              <div className="flex items-center gap-1 3xl:gap-2">
                                {Array.from({ length: MAX_PROMPTS }).map((_, i) => (
                                  <span
                                    key={i}
                                    className={`h-1.5 w-6 3xl:h-3 3xl:w-12 rounded-full transition-colors duration-500 ${
                                      isLimitReached
                                        ? "bg-red-500"
                                        : i < MAX_PROMPTS - userMessageCount
                                          ? "bg-slate-950"
                                          : "bg-slate-200"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto p-6 md:p-10 3xl:p-20 flex flex-col gap-6 3xl:gap-14 scroll-smooth relative bg-gradient-to-b from-slate-50/40 via-white to-slate-50/40"
                      >
                        {/* Ambient accent glow */}
                        <div className="absolute top-12 -left-24 w-72 h-72 3xl:w-[32rem] 3xl:h-[32rem] bg-accent-3/[0.05] blur-[90px] rounded-full pointer-events-none" />

                        {isLoading && (
                          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-16 relative">
                            <div className="relative">
                              <div className="absolute inset-0 rounded-full bg-accent-3/20 blur-xl" />
                              <div className="relative w-10 h-10 3xl:w-16 3xl:h-16 border-2 3xl:border-4 border-slate-200 border-t-accent-3 rounded-full animate-spin" />
                            </div>
                            <p className="text-[11px] 3xl:text-sm font-black text-slate-400 uppercase tracking-[0.3em]">Warming Up</p>
                          </div>
                        )}

                        {!isLoading && initError && (
                          <div className="flex-1 flex flex-col items-center justify-center gap-3 py-16 relative">
                            <p className="text-[11px] 3xl:text-sm font-black text-red-500 uppercase tracking-[0.2em]">Agent Offline</p>
                            <p className="text-xs 3xl:text-xl text-slate-400 text-center max-w-xs 3xl:max-w-2xl">{initError}</p>
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
                      <div className="relative p-5 md:p-6 3xl:p-14 bg-white border-t border-slate-200">
                        {/* Limit Reached Banner */}
                        <AnimatePresence>
                          {isLimitReached && (
                            <motion.div
                              initial={{ opacity: 0, y: -6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              className="mb-4 3xl:mb-10 flex items-center justify-between gap-3 px-4 py-3 3xl:px-8 3xl:py-6 rounded-2xl 3xl:rounded-[2rem] bg-red-50 border border-red-200"
                            >
                              <div className="flex items-center gap-3 3xl:gap-5 min-w-0">
                                <span className="flex w-2 h-2 3xl:w-3.5 3xl:h-3.5 rounded-full bg-red-500 shrink-0" />
                                <div className="flex flex-col min-w-0">
                                  <span className="text-[10px] 3xl:text-sm font-black text-red-600 uppercase tracking-[0.25em] leading-none">Demo Limit Reached</span>
                                  <span className="text-xs 3xl:text-lg text-slate-600 font-medium mt-1 3xl:mt-2 truncate">Want one trained on your business? Let&apos;s talk.</span>
                                </div>
                              </div>
                              <a
                                href="/brief"
                                className="shrink-0 inline-flex items-center gap-1.5 3xl:gap-3 px-4 py-2 3xl:px-8 3xl:py-4 rounded-full bg-slate-950 text-white text-[10px] 3xl:text-base font-black uppercase tracking-[0.2em] hover:bg-accent-3 transition-colors duration-300"
                              >
                                Get Started
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="3xl:w-4 3xl:h-4">
                                  <path d="M5 12h14M13 5l7 7-7 7" />
                                </svg>
                              </a>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Suggestions */}
                        <AnimatePresence>
                          {recommendedQuestions.length > 0 && !isTyping && !isLimitReached && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 5 }}
                              className="mb-5 3xl:mb-12"
                            >
                              <p className="text-[9px] 3xl:text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-3 3xl:mb-6 px-1">Try asking</p>
                              <div className="flex overflow-x-auto no-scrollbar gap-2 3xl:gap-4 -mx-1 px-1 pb-1">
                                {recommendedQuestions.map((q) => (
                                  <motion.button
                                    key={q}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => handleSend(q)}
                                    className="group/chip relative px-4 py-2.5 3xl:px-10 3xl:py-5 bg-white border border-slate-200 rounded-full text-xs 3xl:text-lg font-medium text-slate-700 hover:border-slate-900 hover:bg-slate-950 hover:text-white transition-all duration-300 whitespace-nowrap shadow-sm hover:shadow-md"
                                  >
                                    <span className="flex items-center gap-2">
                                      {q}
                                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="opacity-0 -ml-1 -translate-x-1 group-hover/chip:opacity-100 group-hover/chip:translate-x-0 transition-all 3xl:w-4 3xl:h-4">
                                        <path d="M5 12h14M13 5l7 7-7 7" />
                                      </svg>
                                    </span>
                                  </motion.button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <form
                          onSubmit={(e) => handleSend(inputValue, e)}
                          className={`relative flex items-center gap-3 3xl:gap-6 p-1.5 3xl:p-3 rounded-full border transition-all duration-300 ${
                            isLimitReached
                              ? "bg-red-50/60 border-red-200"
                              : "bg-slate-50 border-slate-200 focus-within:bg-white focus-within:border-slate-900 focus-within:shadow-[0_0_0_4px_rgba(14,165,233,0.12)]"
                          }`}
                        >
                          <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={isLoading ? "Connecting agent..." : isLimitReached ? "Demo complete — let's build yours." : "Ask anything about your business..."}
                            disabled={isLoading || isTyping || isLimitReached || !!initError}
                            className="flex-1 min-w-0 bg-transparent px-5 3xl:px-12 py-3 3xl:py-8 text-base 3xl:text-3xl text-slate-950 placeholder:text-slate-400 focus:outline-none disabled:opacity-50 font-medium tracking-tight"
                          />
                          <button
                            type="submit"
                            aria-label="Send message"
                            disabled={!inputValue.trim() || !agentInstance || isLoading || isTyping || isLimitReached}
                            className="relative h-12 w-12 3xl:h-24 3xl:w-24 flex items-center justify-center rounded-full bg-gradient-to-br from-accent-3 to-accent-bright text-white shadow-[0_8px_24px_-6px_rgba(14,165,233,0.55)] hover:shadow-[0_12px_28px_-6px_rgba(14,165,233,0.7)] hover:scale-105 transition-all duration-300 disabled:from-slate-200 disabled:to-slate-200 disabled:shadow-none disabled:scale-100 active:scale-95 shrink-0"
                          >
                            <svg width="18" height="18" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="3xl:scale-150">
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

const AgentAvatar = memo(() => (
  <div className="relative w-8 h-8 3xl:w-14 3xl:h-14 shrink-0 mt-1">
    <div className="absolute inset-0 rounded-xl 3xl:rounded-2xl bg-accent-3/20 blur-md" />
    <div className="relative w-8 h-8 3xl:w-14 3xl:h-14 rounded-xl 3xl:rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center text-white shadow-md ring-1 ring-white/10">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="3xl:scale-150">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    </div>
  </div>
));
AgentAvatar.displayName = "AgentAvatar";

const MessageItem = memo(({ msg }: { msg: LocalMessage }) => {
  const isAgent = msg.sender === "agent";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`flex ${isAgent ? "items-start gap-3 3xl:gap-6" : "justify-end"}`}
    >
      {isAgent && <AgentAvatar />}
      <div className={`flex flex-col ${isAgent ? "items-start" : "items-end"} ${isAgent ? "max-w-[calc(85%-3rem)]" : "max-w-[85%] md:max-w-[75%]"}`}>
        <div
          className={`relative text-base 3xl:text-3xl leading-relaxed px-5 py-3.5 3xl:px-10 3xl:py-7 rounded-2xl 3xl:rounded-[2.5rem] transition-all duration-300 ${
            isAgent
            ? "bg-white text-slate-800 border border-slate-200/80 shadow-[0_4px_14px_-6px_rgba(2,6,23,0.08)] rounded-tl-md"
            : "bg-gradient-to-br from-slate-900 to-slate-950 text-white shadow-[0_8px_24px_-8px_rgba(2,6,23,0.5)] rounded-tr-md font-medium ring-1 ring-white/5"
          }`}
        >
          {isAgent ? <FormattedMessage text={msg.text} /> : msg.text}
        </div>
        <span className="text-[9px] 3xl:text-sm font-bold mt-1.5 3xl:mt-3 px-2 uppercase tracking-[0.2em] text-slate-400">
          {msg.time}
        </span>
      </div>
    </motion.div>
  );
});
MessageItem.displayName = "MessageItem";

const TypingIndicator = memo(() => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    className="flex items-start gap-3 3xl:gap-6"
  >
    <AgentAvatar />
    <div className="bg-white border border-slate-200/80 px-5 py-3.5 3xl:px-10 3xl:py-7 rounded-2xl rounded-tl-md 3xl:rounded-[2.5rem] flex items-center gap-3 3xl:gap-6 shadow-[0_4px_14px_-6px_rgba(2,6,23,0.08)]">
      <div className="flex gap-1.5 3xl:gap-3">
        {[0, 1, 2].map((_, index) => (
          <motion.div
            key={index}
            animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.1, delay: index * 0.15, ease: "easeInOut" }}
            className="w-1.5 h-1.5 3xl:w-3 3xl:h-3 bg-accent-3 rounded-full"
          />
        ))}
      </div>
      <span className="text-[9px] 3xl:text-sm font-black text-slate-400 uppercase tracking-[0.25em]">Thinking</span>
    </div>
  </motion.div>
));
TypingIndicator.displayName = "TypingIndicator";

