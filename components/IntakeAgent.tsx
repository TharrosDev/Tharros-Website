"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Client, Key, Agent, type Task } from "@relevanceai/sdk";
import NavBar from "./NavBar";
import FooterSection from "./FooterSection";

// Relevance AI Configuration
const REGION = process.env.NEXT_PUBLIC_RELEVANCE_REGION || "";
const PROJECT = process.env.NEXT_PUBLIC_RELEVANCE_PROJECT || "";
// Fallback to the main agent if intake ID isn't set yet
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
  const [agentInstance, setAgentInstance] = useState<Agent | null>(null);
  const [currentTask, setCurrentTask] = useState<Task<any, any> | null>(null);
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

        const config = (agent as any).config || {};
        const metadata = (agent as any).metadata || {};
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
      } catch (err) {
        console.error("Failed to initialize Intake Agent:", err);
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
    return () => currentTask.unsubscribe();
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
      const newTask = await agentInstance.sendMessage(text, (currentTask as any));
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
        {/* Background Accents */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50 -skew-x-12 translate-x-1/4 opacity-50" />
          <div className="absolute bottom-0 left-0 w-1/2 h-full bg-slate-50 skew-x-12 -translate-x-1/4 opacity-50" />
        </div>

        <div className="w-full max-w-4xl relative z-10 flex flex-col h-[75vh] md:h-[80vh]">
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
            <p className="text-subdued text-sm md:text-base max-w-xl mx-auto">
              Tell our agent about your business. We&apos;ll use this information to build your custom solution profile.
            </p>
          </div>

          {/* Chat Interface */}
          <div className="flex-1 flex flex-col bg-white rounded-[2rem] border border-slate-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] overflow-hidden">
            {/* Console Header */}
            <div className="px-6 py-4 border-b border-slate-100 bg-white/70 backdrop-blur-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text leading-none">Intake Specialist</h3>
                  <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest mt-1">Ready for Briefing</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-mono text-slate-400">
                <span className="hidden sm:block">ENCRYPTED_STREAM</span>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col gap-6 bg-slate-50/5 relative"
            >
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]" />
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                  >
                    <div 
                      className={`max-w-[85%] md:max-w-[75%] text-sm md:text-base leading-relaxed px-5 py-3 rounded-[1.5rem] border ${
                        msg.sender === "user" 
                        ? "bg-slate-900 text-white border-slate-800 rounded-tr-none shadow-sm" 
                        : "bg-white text-text border-slate-100 rounded-tl-none shadow-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-slate-300 font-bold mt-2 uppercase tracking-widest px-1">{msg.time}</span>
                  </motion.div>
                ))}
                {isTyping && (
                  <div className="flex gap-1.5 p-3 bg-white border border-slate-100 rounded-2xl rounded-tl-none shadow-sm">
                    {[0, 1, 2].map((i) => (
                      <motion.div 
                        key={i}
                        animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }} 
                        transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }} 
                        className="w-1.5 h-1.5 bg-accent-3 rounded-full" 
                      />
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Input Area */}
            <div className="p-4 md:p-8 border-t border-slate-100 bg-white">
              {recommendedQuestions.length > 0 && !isTyping && (
                <div className="flex overflow-x-auto no-scrollbar gap-2 mb-6 -mx-1 px-1">
                  {recommendedQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-[10px] md:text-[11px] font-bold text-slate-500 hover:bg-accent-3 hover:text-white transition-all whitespace-nowrap active:scale-95"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
              <form 
                onSubmit={(e) => handleSend(inputValue, e)}
                className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-2xl border border-slate-100"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Describe your business needs..."
                  className="flex-1 bg-transparent px-4 py-2 text-sm text-text focus:outline-none"
                />
                <button 
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg active:scale-90 transition-all disabled:opacity-20"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
                  </svg>
                </button>
              </form>
            </div>
          </div>

          {/* Email Fallback */}
          <div className="mt-8 text-center">
            <p className="text-xs md:text-sm text-subdued font-medium">
              Prefer the traditional way?{" "}
              <a 
                href="mailto:Magnus.Abdelnour@gmail.com?subject=Inquiry" 
                className="text-accent-3 font-bold hover:underline"
              >
                Email us directly
              </a>
            </p>
          </div>
        </div>
      </main>

      <FooterSection />
    </div>
  );
}
