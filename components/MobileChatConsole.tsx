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
    <div className={`flex flex-col ${height} w-[calc(100%-24px)] max-w-full bg-slate-900 border border-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] rounded-[2.5rem] overflow-hidden relative mx-auto mb-4`}>
      {/* Header - Industrial Control Pod */}
        <div className="px-5 py-4 border-b border-white/10 bg-slate-900/95 backdrop-blur-2xl shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-950 shadow-lg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-slate-900 flex items-center justify-center border-2 border-slate-900">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                </div>
              </div>
              <div className="text-left">
                <h3 className="text-sm font-black text-white tracking-tight leading-none mb-1.5 uppercase">{title}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Ready</span>
                  <span className="w-1 h-1 rounded-full bg-white/10" />
                  <span className="text-[8px] font-bold text-accent-3 uppercase tracking-widest">ACTIVE</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 flex items-center gap-2">
                <span className={`text-[10px] font-black tabular-nums ${isLimitReached ? 'text-red-400' : 'text-slate-400'}`}>
                  {userMessageCount}/{maxPrompts}
                </span>
                <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">CAP</span>
              </div>
            </div>
          </div>

          {/* Mobile Telemetry */}
          <div className="flex items-center gap-4 pt-3 border-t border-white/[0.03]">
            <div className="flex items-center gap-2">
              <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">NEURAL:</span>
              <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  animate={{ width: ["20%", "60%", "40%"] }} 
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="h-full bg-accent-3" 
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">LATENCY:</span>
              <span className="text-[7px] font-black text-accent-3 tabular-nums">24ms</span>
            </div>
          </div>
        </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-5 flex flex-col gap-5 bg-black/40 relative scroll-smooth"
      >
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
        
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl border-2 border-white/5 border-t-accent-3 animate-spin" />
              <div className="absolute inset-0 bg-accent-3/20 blur-xl rounded-full animate-pulse" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse">Starting Agent...</span>
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
      <div className="p-4 bg-slate-900/95 border-t border-white/10 shrink-0 backdrop-blur-xl">
        <AnimatePresence>
          {recommendedQuestions.length > 0 && !isTyping && !isLimitReached && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex overflow-x-auto no-scrollbar gap-3 mb-4 pb-1"
            >
              {recommendedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black text-slate-300 whitespace-nowrap active:scale-95 active:bg-white active:text-slate-950 transition-all uppercase tracking-widest shadow-lg"
                >
                  {q}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <form 
          onSubmit={(e) => handleSend(inputValue, e)}
          className="flex items-center gap-3 bg-white/5 p-2 rounded-[1.75rem] border border-white/10 shadow-inner"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isLimitReached ? "Session limit reached." : "Type inquiry..."}
            disabled={isLoading || isTyping || isLimitReached}
            className="flex-1 bg-transparent px-4 py-3 text-[16px] text-white placeholder:text-slate-500 focus:outline-none disabled:opacity-50 font-medium"
          />
          <button 
            type="submit"
            disabled={!inputValue.trim() || isLoading || isTyping || isLimitReached}
            className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white text-slate-950 shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-90 disabled:opacity-5 shrink-0 transition-all"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
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
      className={`relative max-w-[90%] text-[15px] leading-relaxed px-5 py-4 border transition-all duration-500 ${
        msg.sender === "user" 
        ? "bg-white text-slate-950 border-white/10 rounded-[1.5rem] rounded-tr-none shadow-xl font-semibold" 
        : "bg-slate-800/80 text-white border-white/5 rounded-[1.5rem] rounded-tl-none shadow-2xl backdrop-blur-md"
      }`}
      style={{
        clipPath: msg.sender === "user"
          ? "polygon(0 0, 100% 0, 100% 85%, 90% 100%, 0 100%)"
          : "polygon(0 0, 100% 0, 100% 100%, 10% 100%, 0 85%)"
      }}
    >
      {msg.sender === "agent" && (
        <div className="absolute top-0 left-0 w-1 h-full bg-accent-3/30" />
      )}
      {msg.text}
    </div>
    <span className="text-[8px] text-slate-500 font-black mt-2 px-1 uppercase tracking-[0.2em] opacity-60">{msg.time}</span>
  </motion.div>
));
MobileMessageItem.displayName = "MobileMessageItem";

const MobileTypingIndicator = memo(() => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-start"
  >
    <div className="bg-slate-800/80 border border-white/10 px-5 py-3 rounded-2xl rounded-tl-none shadow-sm flex flex-col gap-2 min-w-[140px] backdrop-blur-md">
      <div className="flex items-center justify-between">
        <span className="text-[8px] font-black text-accent-3 uppercase tracking-[0.2em] animate-pulse">Processing</span>
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
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-full bg-accent-3/50" 
        />
      </div>
    </div>
  </motion.div>
));
MobileTypingIndicator.displayName = "MobileTypingIndicator";

export default MobileChatConsole;
