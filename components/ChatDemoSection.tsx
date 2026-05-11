"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Client, Key, Agent, type Task } from "@relevanceai/sdk";
import AnimatedSection from "./AnimatedSection";

// Relevance AI Configuration
const REGION = "bcbe5a";
const PROJECT = "53ba4219-0247-4c7e-a441-cd107d5783e0";
const AGENT_ID = "f0398db0-96a2-4f11-8db8-b4c5b6fe769a";

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
      try {
        // Generate or restore embed key
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
            text: "Hi! I'm your Tharros-powered AI agent. How can I help your business today?",
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
      
      // We only care about agent-message types for the bot's response in the UI
      if (message.type === "agent-message") {
        setMessages((prev) => {
          // Prevent duplicate messages
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
      currentTask.unsubscribe(); // Use the SDK's unsubscribe method
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
    
    // Add user message to UI
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
        text: "I'm sorry, I encountered an error. Please try again.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    }
  };

  return (
    <section id="demo" className="py-24 md:py-32 px-6 md:px-12 relative overflow-hidden bg-white">
      {/* Background soft gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-3/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] -z-10" />
      
      <div className="max-w-6xl mx-auto relative">
        <AnimatedSection className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-3/10 text-accent-3 text-xs font-bold uppercase tracking-wider mb-6">
            Custom SDK Integration
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text mb-6 tracking-tight">
            Seamless <span className="accent-text">AI Experience</span>
          </h2>
          <p className="text-subdued text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Using the Relevance AI SDK, we create high-performance chat interfaces 
            that feel like a native part of your brand.
          </p>
        </AnimatedSection>

        {/* Wide "Comfortable" Chat UI */}
        <AnimatedSection delay={0.2} variant="scale-in">
          <div className="max-w-5xl mx-auto relative">
            {/* Desktop-style Window Container */}
            <div className="clean-card overflow-hidden shadow-2xl border-border/40 bg-white min-h-[600px] md:min-h-[700px] flex flex-col">
              
              {/* Sleek Window Header */}
              <div className="px-6 py-4 border-b border-border bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400/20 border border-red-400/40" />
                    <div className="w-3 h-3 rounded-full bg-amber-400/20 border border-amber-400/40" />
                    <div className="w-3 h-3 rounded-full bg-green-400/20 border border-green-400/40" />
                  </div>
                  <div className="h-4 w-[1px] bg-border mx-2" />
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-sm font-semibold text-text">Tharros Agent SDK</span>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-6 text-xs font-medium text-subdued uppercase tracking-widest">
                  <span>Custom UI</span>
                  <span>SDK Powered</span>
                </div>
              </div>

              {/* Messages Area */}
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-slate-50/30"
              >
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                    >
                      <div 
                        className={`max-w-[85%] md:max-w-[75%] p-4 rounded-2xl text-sm md:text-base leading-relaxed ${
                          msg.sender === "user" 
                          ? "bg-accent text-white rounded-tr-none shadow-md" 
                          : "bg-white text-text border border-border shadow-sm rounded-tl-none"
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-muted mt-1.5 px-1 font-medium">{msg.time}</span>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-1.5 p-4 bg-white border border-border rounded-2xl rounded-tl-none w-16 shadow-sm"
                    >
                      <motion.div 
                        animate={{ opacity: [0.3, 1, 0.3] }} 
                        transition={{ repeat: Infinity, duration: 1 }} 
                        className="w-1.5 h-1.5 rounded-full bg-accent" 
                      />
                      <motion.div 
                        animate={{ opacity: [0.3, 1, 0.3] }} 
                        transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} 
                        className="w-1.5 h-1.5 rounded-full bg-accent" 
                      />
                      <motion.div 
                        animate={{ opacity: [0.3, 1, 0.3] }} 
                        transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} 
                        className="w-1.5 h-1.5 rounded-full bg-accent" 
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Input Area */}
              <div className="p-4 md:p-6 bg-white border-t border-border">
                <form 
                  onSubmit={handleSend}
                  className="relative flex items-center"
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                    disabled={!agentInstance || isTyping}
                    className="w-full bg-surface border border-border rounded-2xl pl-5 pr-14 py-4 text-sm md:text-base focus:outline-none focus:border-accent-3 focus:ring-4 focus:ring-accent-3/5 transition-all text-text placeholder:text-muted disabled:opacity-50"
                  />
                  <button 
                    type="submit"
                    disabled={!inputValue.trim() || !agentInstance || isTyping}
                    className="absolute right-2 w-10 h-10 md:w-11 md:h-11 rounded-xl bg-accent text-white flex items-center justify-center hover:bg-accent-2 transition-all disabled:opacity-30 disabled:grayscale shadow-lg shadow-accent/20"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                  </button>
                </form>
                <p className="text-[10px] text-center text-muted mt-3 uppercase tracking-widest font-semibold">
                  Powered by Relevance AI JS SDK
                </p>
              </div>
            </div>

            {/* Subtle floating badge below */}
            <div className="mt-8 flex flex-wrap justify-center gap-8 md:gap-16">
              <div className="flex items-center gap-3">
                <span className="text-2xl opacity-80">🛡️</span>
                <div>
                  <p className="text-sm font-bold text-text">SOC2 Compliant</p>
                  <p className="text-[10px] text-subdued uppercase tracking-tight">Security first</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl opacity-80">🌐</span>
                <div>
                  <p className="text-sm font-bold text-text">Multilingual</p>
                  <p className="text-[10px] text-subdued uppercase tracking-tight">Handles 50+ languages</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl opacity-80">📈</span>
                <div>
                  <p className="text-sm font-bold text-text">Auto-Sync</p>
                  <p className="text-[10px] text-subdued uppercase tracking-tight">Syncs to your CRM</p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

      </div>
    </section>
  );
}
