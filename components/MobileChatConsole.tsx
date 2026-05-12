"use client";

import { motion, AnimatePresence } from "motion/react";
import { useRef, useEffect } from "react";

type LocalMessage = {
  id: string;
  sender: "user" | "agent";
  text: string;
  time: string;
};

interface MobileChatConsoleProps {
  messages: LocalMessage[];
  inputValue: string;
  setInputValue: (val: string) => void;
  handleSend: (text: string, e?: React.FormEvent) => void;
  isTyping: boolean;
  recommendedQuestions: string[];
  title: string;
  subtitle: string;
  modelType: string;
  isLoading?: boolean;
}

export default function MobileChatConsole({
  messages,
  inputValue,
  setInputValue,
  handleSend,
  isTyping,
  recommendedQuestions,
  title,
  subtitle,
  modelType,
  isLoading = false
}: MobileChatConsoleProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col h-[60dvh] md:h-[65dvh] w-full bg-white rounded-[1.5rem] border border-slate-100 shadow-2xl overflow-hidden relative">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 bg-white/80 backdrop-blur-xl flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xs font-bold text-text leading-none mb-1">{title}</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{subtitle} // {modelType}</span>
            </div>
          </div>
        </div>
        <div className="px-2 py-1 bg-slate-50 rounded-md border border-slate-100">
          <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest block leading-none">MOD_V</span>
          <span className="text-[8px] font-bold text-text uppercase leading-none">1.2.4b</span>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-slate-50/20 relative scroll-smooth"
      >
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-slate-100 border-t-accent-3 animate-spin" />
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">Syncing_System...</span>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div 
                  className={`max-w-[88%] text-[14px] leading-relaxed px-4 py-3 rounded-[1.2rem] border ${
                    msg.sender === "user" 
                    ? "bg-slate-900 text-white border-slate-800 rounded-tr-none" 
                    : "bg-white text-text border-slate-100 rounded-tl-none shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[8px] text-slate-300 font-bold mt-1.5 px-1 uppercase tracking-widest">{msg.time}</span>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-start"
              >
                <div className="bg-white border border-slate-100 px-4 py-2.5 rounded-[1.2rem] rounded-tl-none shadow-sm flex items-center gap-2">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((_, index) => (
                      <motion.div 
                        key={index}
                        animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }} 
                        transition={{ repeat: Infinity, duration: 0.8, delay: index * 0.15 }} 
                        className="w-1 h-1 bg-accent-3 rounded-full" 
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-slate-100 shrink-0">
        <AnimatePresence>
          {recommendedQuestions.length > 0 && !isTyping && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex overflow-x-auto no-scrollbar gap-2 mb-3 pb-1"
            >
              {recommendedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-[10px] font-bold text-slate-500 whitespace-nowrap active:scale-95 active:bg-accent-3 active:text-white transition-all"
                >
                  {q}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <form 
          onSubmit={(e) => handleSend(inputValue, e)}
          className="flex items-center gap-2 bg-slate-50 p-1 rounded-2xl border border-slate-100"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type message..."
            disabled={isLoading || isTyping}
            className="flex-1 bg-transparent px-3 py-2 text-sm text-text placeholder:text-slate-400 focus:outline-none disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={!inputValue.trim() || isLoading || isTyping}
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg active:scale-90 disabled:opacity-20 shrink-0 transition-transform"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
