"use client";

import { motion, AnimatePresence } from "motion/react";
import { useRef, useEffect, memo, useState } from "react";

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
  subtitle,
  modelType,
  userMessageCount,
  maxPrompts,
  isLoading = false,
  height = "h-[60dvh]",
  debugInfo
}: MobileChatConsoleProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [logsOpen, setLogsOpen] = useState(false);
  const isLimitReached = userMessageCount >= maxPrompts;

  useEffect(() => {
    const scroll = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };
    // Use rAF to ensure DOM is updated before scrolling
    const rafId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(rafId);
  }, [messages, isTyping]);

  return (
    <div className={`flex flex-col ${height} md:h-[65dvh] w-[calc(100%-24px)] md:w-full max-w-full bg-slate-900 border border-white/10 shadow-2xl rounded-3xl overflow-hidden relative mx-auto mb-4`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 bg-slate-900/90 backdrop-blur-xl flex items-center justify-between shrink-0">
          <button 
            onClick={() => setLogsOpen(!logsOpen)}
            className="flex items-center gap-3 active:opacity-70 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-950 shadow-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xs font-bold text-white leading-none mb-1">{title}</h3>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">{subtitle} // {modelType}</span>
              </div>
            </div>
          </button>
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 bg-white/5 rounded-md border border-white/10 flex items-center gap-1.5">
              <span className={`text-[9px] font-black tabular-nums ${isLimitReached ? 'text-red-400' : 'text-slate-400'}`}>
                {userMessageCount}/{maxPrompts}
              </span>
            </div>
          </div>
        </div>

      {/* Logs Overlay */}
      <AnimatePresence>
        {logsOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute inset-0 z-50 bg-slate-950 p-6 font-mono text-[10px] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
              <span className="text-accent-3 font-bold uppercase tracking-[0.2em]">System_Logs</span>
              <button onClick={() => setLogsOpen(false)} className="text-white hover:text-accent-3">
                [CLOSE]
              </button>
            </div>
            <div className="space-y-3 text-slate-400">
              <p><span className="text-green-500">[INIT]</span> SDK_CORE_READY</p>
              <p><span className="text-green-500">[SYNC]</span> CONTEXT_INJECTED: {modelType}</p>
              <p><span className="text-blue-500">[STAT]</span> PROMPTS: {userMessageCount}/{maxPrompts}</p>
              <p><span className="text-blue-500">[STAT]</span> MSG_BUFFER: {messages.length}</p>
              {debugInfo && (
                <pre className="mt-4 p-3 bg-white/5 rounded border border-white/10 whitespace-pre-wrap break-all">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              )}
              <div className="mt-8 pt-8 border-t border-white/10 opacity-50">
                <p>UA: {typeof window !== 'undefined' ? navigator.userAgent : 'N/A'}</p>
                <p>TS: {new Date().toISOString()}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-black/20 relative scroll-smooth"
      >
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-accent-3 animate-spin" />
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">Syncing_System...</span>
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
      <div className="p-3 bg-slate-900 border-t border-white/10 shrink-0">
        <AnimatePresence>
          {recommendedQuestions.length > 0 && !isTyping && !isLimitReached && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex overflow-x-auto no-scrollbar gap-2 mb-3 pb-1"
            >
              {recommendedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-slate-300 whitespace-nowrap active:scale-95 active:bg-accent-3 active:text-white transition-all"
                >
                  {q}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <form 
          onSubmit={(e) => handleSend(inputValue, e)}
          className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/10"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isLimitReached ? "Limit reached." : "Type message..."}
            disabled={isLoading || isTyping || isLimitReached}
            className="flex-1 bg-transparent px-3 py-2 text-[16px] text-white placeholder:text-slate-400 focus:outline-none disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={!inputValue.trim() || isLoading || isTyping || isLimitReached}
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-white text-slate-950 shadow-lg active:scale-90 disabled:opacity-20 shrink-0 transition-transform"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
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
    initial={{ opacity: 0, y: 10, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
  >
    <div 
      className={`max-w-[88%] text-[14px] leading-relaxed px-4 py-3 rounded-[1.2rem] border ${
        msg.sender === "user" 
        ? "bg-white text-slate-950 border-white/10 rounded-tr-none shadow-white/5" 
        : "bg-slate-800 text-white border-white/5 rounded-tl-none shadow-black/50"
      }`}
    >
      {msg.text}
    </div>
    <span className="text-[8px] text-slate-300 font-bold mt-1.5 px-1 uppercase tracking-widest">{msg.time}</span>
  </motion.div>
));
MobileMessageItem.displayName = "MobileMessageItem";

const MobileTypingIndicator = memo(() => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-start"
  >
    <div className="bg-slate-800 border border-white/5 px-4 py-2.5 rounded-[1.2rem] rounded-tl-none shadow-sm flex items-center gap-2">
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
));
MobileTypingIndicator.displayName = "MobileTypingIndicator";

export default MobileChatConsole;
