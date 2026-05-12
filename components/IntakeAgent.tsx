"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Client, Key, Agent, Workforce, type Task } from "@relevanceai/sdk";
import NavBar from "./NavBar";
import FooterSection from "./FooterSection";

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

export default function IntakeAgent() {
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [recommendedQuestions, setRecommendedQuestions] = useState<string[]>([]);
  const [agentInstance, setAgentInstance] = useState<any>(null);
  const [currentTask, setCurrentTask] = useState<Task<any, any> | null>(null);
  const [initError, setInitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function initRelevance() {
      if (!REGION || !PROJECT || !AGENT_ID) return;
      try {
        const storageKey = `r-intake-${AGENT_ID}`;
        const stored = JSON.parse(localStorage.getItem(storageKey) ?? "null");
        
        let keyInstance;
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
        let resource;
        if ((keyInstance as any)._isWorkforce || stored?.isWorkforce) {
          resource = await Workforce.get(AGENT_ID, client);
        } else {
          resource = await Agent.get(AGENT_ID, client);
        }
        setAgentInstance(resource);

        const config = (resource as any).config || {};
        const metadata = (resource as any).metadata || {};
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
    <div className="min-h-screen bg-white flex flex-col">
      <NavBar />
      
      <main className="flex-1 pt-24 pb-12 px-4 md:px-6 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50 -skew-x-12 translate-x-1/4 opacity-50" />
          <div className="absolute bottom-0 left-0 w-1/2 h-full bg-slate-50 skew-x-12 -translate-x-1/4 opacity-50" />
        </div>

        <div className="w-full max-w-6xl relative z-10 flex flex-col h-[85vh] md:h-[90vh]">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/[0.03] border border-slate-900/5 backdrop-blur-sm text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-900/60 mb-4"
            >
              Intake Portal // Unit_02
            </motion.div>
            <h1 className="text-3xl md:text-5xl font-bold text-text tracking-tight mb-4">
              Start your <span className="text-accent-3">AI journey</span>
            </h1>
          </div>

          <div className="flex-1 flex flex-col bg-white rounded-[2rem] border border-slate-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-white/70 backdrop-blur-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text leading-none">Intake Specialist</h3>
                </div>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-mono text-slate-400">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              </div>
            </div>

            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col gap-6 bg-slate-50/5 relative"
            >
              {isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full border-2 border-slate-100 border-t-accent-3 animate-spin mb-4" />
                </div>
              ) : initError ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <h3 className="text-xl font-bold text-text mb-2">Configuration Error</h3>
                  <p className="text-subdued text-sm max-w-sm mb-6">{initError}</p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                    >
                      <div className={`max-w-[90%] md:max-w-[85%] text-sm md:text-base leading-relaxed px-5 py-3 rounded-[1.5rem] border ${msg.sender === "user" ? "bg-slate-900 text-white border-slate-800 rounded-tr-none" : "bg-white text-text border-slate-100 rounded-tl-none"}`}>
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-1.5 p-3 bg-white border border-slate-100 rounded-2xl rounded-tl-none">
                      {[0, 1, 2].map((i) => <div key={i} className="w-1.5 h-1.5 bg-accent-3 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />)}
                    </div>
                  )}
                </AnimatePresence>
              )}
            </div>

            <div className="p-4 md:p-8 border-t border-slate-100 bg-white">
              {recommendedQuestions.length > 0 && !isTyping && (
                <div className="flex overflow-x-auto no-scrollbar gap-2 mb-6">
                  {recommendedQuestions.map((q) => (
                    <button key={q} onClick={() => handleSend(q)} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-[10px] font-bold text-slate-500 hover:bg-accent-3 hover:text-white transition-all whitespace-nowrap">
                      {q}
                    </button>
                  ))}
                </div>
              )}
              <form onSubmit={(e) => handleSend(inputValue, e)} className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Describe your business needs..."
                  className="flex-1 bg-transparent px-4 py-2 text-sm text-text focus:outline-none"
                />
                <button type="submit" disabled={!inputValue.trim() || isTyping} className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-900 text-white">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <FooterSection />
    </div>
  );
}
