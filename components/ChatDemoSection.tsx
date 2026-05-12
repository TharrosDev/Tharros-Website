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
    <section id="demo" className="py-16 md:py-32 px-6 md:px-12 relative overflow-hidden bg-white">
      {/* Background Sophistication */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50/50 -skew-x-12 translate-x-1/4 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* Left: Authoritative Capabilities */}
        <div className="lg:col-span-5 pt-8">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-slate-100 border border-slate-200 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-3 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">Console_Link: Active</span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-bold text-text mb-10 leading-[0.9] tracking-tighter">
              Automate <br />
              <span className="text-accent-3">the Intake.</span>
            </h2>
            
            <p className="text-subdued text-lg md:text-xl mb-12 md:mb-16 leading-relaxed max-w-lg">
              Our agents are engineered for high-stakes business environments where precision is the only metric that matters. No corporate fluff. Just results.
            </p>
            
            <div className="grid grid-cols-1 gap-8">
              {[
                { id: "01", title: "Neural Logic", desc: "Handles complex multi-step reasoning without failure." },
                { id: "02", title: "Local Context", desc: "Native understanding of Ottawa neighborhoods and services." },
                { id: "03", title: "Deep Integration", desc: "Syncs directly with your existing CRM and schedule." }
              ].map((item, i) => (
                <motion.div 
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-6 group cursor-default"
                >
                  <span className="text-xs font-mono text-accent-3 pt-1">{item.id}</span>
                  <div className="flex flex-col gap-1 border-l border-slate-100 pl-6 group-hover:border-accent-3 transition-colors duration-500">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-text">{item.title}</h4>
                    <p className="text-sm text-subdued leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>

        {/* Right: The Executive Console */}
        <div className="lg:col-span-7">
          <AnimatedSection delay={0.2}>
            <div className="relative w-full max-w-[650px] mx-auto lg:ml-auto">
              
              {/* Console Frame */}
              <div className="relative flex flex-col h-[600px] md:h-[700px] w-full bg-slate-950 rounded-xl shadow-[0_64px_128px_-32px_rgba(15,23,42,0.3)] overflow-hidden border border-slate-800">
                
                {/* Console Header */}
                <div className="px-6 py-4 flex items-center justify-between border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-accent-3 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                    <div className="flex flex-col">
                      <h3 className="text-white font-bold text-xs uppercase tracking-[0.2em]">Tharros_Executive_Console</h3>
                      <span className="text-[9px] font-mono text-slate-500 uppercase">Status: Operating_In_Parameters</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden md:flex gap-1">
                      {[0, 1, 2].map(i => <div key={i} className="w-3 h-1 bg-slate-800" />)}
                    </div>
                    <span className="text-[10px] font-mono text-accent-3">V.1.04</span>
                  </div>
                </div>

                {/* Messages Feed */}
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-8 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-fixed"
                >
                  <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, ease: "circOut" }}
                        className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                      >
                        <div className="flex items-center gap-3 mb-2 px-1">
                          <span className={`text-[9px] font-mono uppercase tracking-widest ${msg.sender === "user" ? "text-accent-3" : "text-slate-500"}`}>
                            {msg.sender === "user" ? "[USER_INPUT]" : "[AGENT_RESPONSE]"}
                          </span>
                          <span className="text-[9px] font-mono text-slate-700">{msg.time}</span>
                        </div>
                        <div 
                          className={`max-w-[90%] text-sm leading-relaxed p-4 md:p-5 border ${
                            msg.sender === "user" 
                            ? "bg-slate-900/80 text-white border-accent-3/30 rounded-l-lg rounded-tr-sm" 
                            : "bg-slate-900/40 text-slate-300 border-slate-800 rounded-r-lg rounded-tl-sm"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </motion.div>
                    ))}
                    
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-start"
                      >
                        <div className="flex items-center gap-3 mb-2 px-1">
                          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">[AGENT_THINKING]</span>
                        </div>
                        <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-r-lg rounded-tl-sm flex items-center gap-4">
                          <div className="flex gap-1">
                            {[0, 1, 2].map((i) => (
                              <motion.div 
                                key={i}
                                animate={{ 
                                  opacity: [0.3, 1, 0.3],
                                  scale: [1, 1.2, 1]
                                }} 
                                transition={{ 
                                  repeat: Infinity, 
                                  duration: 1, 
                                  delay: i * 0.2 
                                }} 
                                className="w-1 h-1 bg-accent-3" 
                              />
                            ))}
                          </div>
                          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em]">Processing...</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Command Input Area */}
                <div className="p-6 bg-slate-900/80 border-t border-slate-800 backdrop-blur-xl">
                  
                  {/* Quick Commands */}
                  <AnimatePresence>
                    {recommendedQuestions.length > 0 && !isTyping && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-wrap gap-2 mb-6"
                      >
                        {recommendedQuestions.map((q) => (
                          <button
                            key={q}
                            onClick={() => handleSend(q)}
                            className="px-3 py-1.5 bg-slate-800/50 border border-slate-700 rounded-sm text-[10px] font-mono text-slate-400 hover:text-white hover:border-accent-3 hover:bg-accent-3/10 transition-all text-left uppercase tracking-tighter"
                          >
                            &gt; {q}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form 
                    onSubmit={(e) => handleSend(inputValue, e)}
                    className="flex items-center gap-4"
                  >
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="ENTER_COMMAND_HERE..."
                        disabled={!agentInstance || isTyping}
                        className="w-full bg-slate-950 border border-slate-800 px-5 py-4 rounded-lg text-sm font-mono text-white placeholder:text-slate-700 focus:outline-none focus:border-accent-3/50 transition-all disabled:opacity-50"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1 pointer-events-none opacity-20">
                        <div className="w-1 h-1 rounded-full bg-white" />
                        <div className="w-1 h-1 rounded-full bg-white" />
                      </div>
                    </div>
                    <button 
                      type="submit"
                      disabled={!inputValue.trim() || !agentInstance || isTyping}
                      className="h-[52px] w-[52px] flex items-center justify-center rounded-lg bg-accent-3 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:bg-blue-500 transition-all disabled:opacity-10 active:scale-95 shrink-0"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </button>
                  </form>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">Encrypted_Channel: Secured</span>
                    <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">Powered_by: Tharros_Neural_Engine</span>
                  </div>
                </div>
              </div>

              {/* Console Shadow/Reflection */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-4/5 h-8 bg-slate-900/10 blur-2xl rounded-full -z-10" />
            </div>
          </AnimatedSection>
        </div>

      </div>
    </section>
  );
}
