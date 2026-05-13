"use client";

import { motion, AnimatePresence } from "motion/react";
import { useRef, useEffect, memo } from "react";

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
  userMessageCount: number;
  maxPrompts: number;
  isLoading?: boolean;
  height?: string;
  debugInfo?: any;
}

const MobileChatConsole = memo(({
  messages,
  inputValue,
  setInputValue,
  handleSend,
  isTyping,
  recommendedQuestions,
  title,
  userMessageCount,
  maxPrompts,
  isLoading = false,
  height = "h-[65dvh]",
}: MobileChatConsoleProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isLimitReached = userMessageCount >= maxPrompts;

  useEffect(() => {
    const scroll = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };
    const rafId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(rafId);
  }, [messages, isTyping]);

  return (
    <div className={`flex flex-col ${height} w-[calc(100%-24px)] max-w-full bg-white border border-slate-200 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] rounded-[2.5rem] overflow-hidden relative mx-auto mb-4`}>
      {/* Header - Minimalist Light Mode */}
      <div className="px-4 py-3 border-b border-slate-100 bg-white/95 backdrop-blur-2xl shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center text-white shadow-lg">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-white flex items-center justify-center border-2 border-white">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                </div>
              </div>
              <div className="text-left">
                <h3 className="text-xs font-black text-slate-950 tracking-tight leading-none mb-1 uppercase">{title}</h3>
                <span className="text-[7px] font-black text-slate-400 uppercase tracking-[0.2em]">Operational</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 bg-slate-50 rounded-lg border border-slate-100">
                <span className={`text-[9px] font-black tabular-nums ${isLimitReached ? 'text-red-500' : 'text-slate-400'}`}>
                  {userMessageCount}/{maxPrompts}
                </span>
              </div>
            </div>
          </div>
        </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-5 flex flex-col gap-5 bg-slate-50/30 relative scroll-smooth"
      >
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-slate-950 animate-spin" />
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">System_Initializing</span>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <MobileMessageItem key={msg.id} msg={msg} />
            ))}
            
            {isTyping && (
              <MobileTypingIndicator />
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100 shrink-0">
        <AnimatePresence>
          {recommendedQuestions.length > 0 && !isTyping && !isLimitReached && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex overflow-x-auto no-scrollbar gap-2 mb-4 pb-1"
            >
              {recommendedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-500 whitespace-nowrap active:scale-95 active:bg-slate-950 active:text-white transition-all uppercase tracking-widest"
                >
                  {q}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <form 
          onSubmit={(e) => handleSend(inputValue, e)}
          className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-2xl border border-slate-100"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isLimitReached ? "Limit reached." : "Type message..."}
            disabled={isLoading || isTyping || isLimitReached}
            className="flex-1 bg-transparent px-4 py-2.5 text-[16px] text-slate-950 placeholder:text-slate-300 focus:outline-none disabled:opacity-50 font-medium"
          />
          <button 
            type="submit"
            disabled={!inputValue.trim() || isLoading || isTyping || isLimitReached}
            className="h-11 w-11 flex items-center justify-center rounded-xl bg-slate-950 text-white shadow-lg active:scale-90 disabled:opacity-5 shrink-0 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
              <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
});

MobileChatConsole.displayName = "MobileChatConsole";

// Sub-components for better performance and readability
const MobileMessageItem = memo(({ msg }: { msg: LocalMessage }) => (
  <motion.div
    initial={{ opacity: 0, y: 15, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as any }}
    className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
  >
    <div 
      className={`max-w-[90%] text-[15px] leading-relaxed px-5 py-3.5 rounded-2xl border transition-all duration-300 ${
        msg.sender === "user" 
        ? "bg-slate-950 text-white border-slate-900 rounded-tr-none shadow-md font-medium" 
        : "bg-slate-50 text-slate-700 border-slate-100 rounded-tl-none"
      }`}
    >
      {msg.text}
    </div>
    <span className="text-[8px] text-slate-300 font-black mt-2 px-1 uppercase tracking-widest opacity-60">{msg.time}</span>
  </motion.div>
));
MobileMessageItem.displayName = "MobileMessageItem";

const MobileTypingIndicator = memo(() => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-start"
  >
    <div className="bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl rounded-tl-none flex items-center gap-2">
      <div className="flex gap-1">
        {[0, 1, 2].map((_, index) => (
          <motion.div 
            key={index}
            animate={{ opacity: [0.3, 1, 0.3] }} 
            transition={{ repeat: Infinity, duration: 1, delay: index * 0.2 }} 
            className="w-1 h-1 bg-slate-300 rounded-full" 
          />
        ))}
      </div>
      <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Thinking</span>
    </div>
  </motion.div>
));
MobileTypingIndicator.displayName = "MobileTypingIndicator";

export default MobileChatConsole;
