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
  height = "h-[65dvh]",
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
    const rafId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(rafId);
  }, [messages, isTyping]);

  return (
    <div className={`flex flex-col ${height} w-[calc(100%-24px)] max-w-full bg-slate-900 border border-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] rounded-[2.5rem] overflow-hidden relative mx-auto mb-4`}>
      {/* Header - Industrial Control Pod */}
      <div className="px-5 py-4 border-b border-white/10 bg-slate-900/95 backdrop-blur-2xl flex items-center justify-between shrink-0">
          <button 
            onClick={() => setLogsOpen(!logsOpen)}
            className="flex items-center gap-4 active:opacity-70 transition-opacity"
          >
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
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">{subtitle}</span>
                <span className="w-1 h-1 rounded-full bg-white/10" />
                <span className="text-[8px] font-bold text-accent-3 uppercase tracking-widest">ACTIVE</span>
              </div>
            </div>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 flex items-center gap-2">
              <span className={`text-[10px] font-black tabular-nums ${isLimitReached ? 'text-red-400' : 'text-slate-400'}`}>
                {userMessageCount}/{maxPrompts}
              </span>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">CALS</span>
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
            <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
              <span className="text-accent-3 font-black uppercase tracking-[0.3em]">System_Logs_v1.0.4</span>
              <button onClick={() => setLogsOpen(false)} className="text-white hover:text-accent-3 font-black uppercase tracking-widest">
                [CLOSE]
              </button>
            </div>
            <div className="space-y-4 text-slate-500">
              <p><span className="text-green-500 font-bold">[INIT]</span> SDK_CORE_READY</p>
              <p><span className="text-green-500 font-bold">[SYNC]</span> CONTEXT_INJECTED: {modelType}</p>
              <p><span className="text-blue-500 font-bold">[STAT]</span> SESSION_PROMPTS: {userMessageCount}/{maxPrompts}</p>
              <p><span className="text-blue-500 font-bold">[STAT]</span> BUFFER_LEN: {messages.length}</p>
              <p><span className="text-amber-500 font-bold">[INFO]</span> REGION: {typeof window !== 'undefined' ? 'CA-OTTAWA-01' : 'N/A'}</p>
              {debugInfo && (
                <pre className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10 whitespace-pre-wrap break-all text-slate-400">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse">Initializing_Model...</span>
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
    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
  >
    <div 
      className={`max-w-[90%] text-[15px] leading-relaxed px-5 py-4 rounded-[1.5rem] border font-medium ${
        msg.sender === "user" 
        ? "bg-white text-slate-950 border-white/10 rounded-tr-none shadow-xl" 
        : "bg-slate-800 text-white border-white/5 rounded-tl-none shadow-2xl"
      }`}
    >
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
    <div className="bg-slate-800 border border-white/5 px-5 py-3 rounded-[1.5rem] rounded-tl-none shadow-sm flex items-center gap-3">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((_, index) => (
          <motion.div 
            key={index}
            animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }} 
            transition={{ repeat: Infinity, duration: 0.8, delay: index * 0.15 }} 
            className="w-1.5 h-1.5 bg-accent-3 rounded-full shadow-[0_0_8px_rgba(14,165,233,0.6)]" 
          />
        ))}
      </div>
    </div>
  </motion.div>
));
MobileTypingIndicator.displayName = "MobileTypingIndicator";

export default MobileChatConsole;
