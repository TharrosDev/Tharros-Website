"use client";

import { motion, AnimatePresence } from "motion/react";
import { useRef, useEffect, memo } from "react";
import FormattedMessage from "./FormattedMessage";

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
    <div className={`flex flex-col ${height} w-[calc(100%-24px)] max-w-full bg-white border border-slate-200 ring-1 ring-slate-900/5 shadow-[0_40px_80px_-20px_rgba(2,6,23,0.35)] rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden relative mx-auto mb-4`}>
      {/* Accent strip */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-3/60 to-transparent pointer-events-none z-20" />

      {/* Header */}
      <div className="relative px-4 py-3 border-b border-slate-200 bg-gradient-to-b from-white to-slate-50/60 backdrop-blur-2xl shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-accent-3/20 blur-md" />
                <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center text-white shadow-md ring-1 ring-white/10">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 flex w-3 h-3">
                  <span className="absolute inset-0 rounded-full bg-accent-3/60 animate-ping" />
                  <span className="relative w-3 h-3 rounded-full bg-accent-3 border-2 border-white" />
                </span>
              </div>
              <div className="text-left">
                <h3 className="text-[11px] sm:text-xs font-bold text-slate-950 tracking-tight leading-none mb-1">{title}</h3>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.25em]">Online · Ottawa</span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span className="text-[7px] font-black text-slate-400 uppercase tracking-[0.25em] leading-none">Left</span>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: maxPrompts }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-1 w-4 rounded-full transition-colors duration-500 ${
                      i < maxPrompts - userMessageCount ? (isLimitReached ? "bg-red-400" : "bg-slate-950") : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 relative scroll-smooth bg-gradient-to-b from-slate-50/40 via-white to-slate-50/40"
      >
        <div className="absolute top-10 -left-20 w-56 h-56 bg-accent-3/[0.05] blur-[70px] rounded-full pointer-events-none" />

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 relative">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-accent-3/20 blur-md" />
              <div className="relative w-8 h-8 rounded-full border-2 border-slate-200 border-t-accent-3 animate-spin" />
            </div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Warming Up</span>
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
      <div className="relative p-4 bg-white border-t border-slate-200 shrink-0">
        <AnimatePresence>
          {recommendedQuestions.length > 0 && !isTyping && !isLimitReached && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-3"
            >
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 px-1">Try asking</p>
              <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1">
                {recommendedQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    className="px-3.5 py-2 bg-white border border-slate-200 rounded-full text-[11px] font-medium text-slate-700 whitespace-nowrap active:scale-95 active:bg-slate-950 active:text-white transition-all shadow-sm shrink-0"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form
          onSubmit={(e) => handleSend(inputValue, e)}
          className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-full border border-slate-200 transition-all duration-300 focus-within:bg-white focus-within:border-slate-900 focus-within:shadow-[0_0_0_3px_rgba(14,165,233,0.12)]"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isLimitReached ? "Demo complete." : "Ask anything..."}
            disabled={isLoading || isTyping || isLimitReached}
            className="flex-1 min-w-0 bg-transparent px-4 py-2.5 text-[16px] text-slate-950 placeholder:text-slate-400 focus:outline-none disabled:opacity-50 font-medium"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading || isTyping || isLimitReached}
            className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-accent-3 to-accent-bright text-white shadow-[0_6px_18px_-4px_rgba(14,165,233,0.55)] active:scale-90 disabled:from-slate-200 disabled:to-slate-200 disabled:shadow-none shrink-0 transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
});

MobileChatConsole.displayName = "MobileChatConsole";

const MobileAgentAvatar = memo(() => (
  <div className="relative w-7 h-7 shrink-0 mt-0.5">
    <div className="absolute inset-0 rounded-lg bg-accent-3/20 blur-sm" />
    <div className="relative w-7 h-7 rounded-lg bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center text-white shadow-sm ring-1 ring-white/10">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    </div>
  </div>
));
MobileAgentAvatar.displayName = "MobileAgentAvatar";

const MobileMessageItem = memo(({ msg }: { msg: LocalMessage }) => {
  const isAgent = msg.sender === "agent";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as any }}
      className={`flex ${isAgent ? "items-start gap-2" : "justify-end"}`}
    >
      {isAgent && <MobileAgentAvatar />}
      <div className={`flex flex-col ${isAgent ? "items-start max-w-[calc(85%-2rem)]" : "items-end max-w-[85%]"}`}>
        <div
          className={`text-[15px] leading-relaxed px-4 py-3 rounded-2xl transition-all duration-300 ${
            isAgent
            ? "bg-white text-slate-800 border border-slate-200/80 shadow-[0_3px_10px_-4px_rgba(2,6,23,0.08)] rounded-tl-md"
            : "bg-gradient-to-br from-slate-900 to-slate-950 text-white shadow-[0_6px_18px_-6px_rgba(2,6,23,0.5)] rounded-tr-md font-medium ring-1 ring-white/5"
          }`}
        >
          {isAgent ? <FormattedMessage text={msg.text} /> : msg.text}
        </div>
        <span className="text-[8px] font-bold mt-1.5 px-1.5 uppercase tracking-[0.2em] text-slate-400">
          {msg.time}
        </span>
      </div>
    </motion.div>
  );
});
MobileMessageItem.displayName = "MobileMessageItem";

const MobileTypingIndicator = memo(() => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    className="flex items-start gap-2"
  >
    <MobileAgentAvatar />
    <div className="bg-white border border-slate-200/80 px-4 py-3 rounded-2xl rounded-tl-md flex items-center gap-2 shadow-[0_3px_10px_-4px_rgba(2,6,23,0.08)]">
      <div className="flex gap-1">
        {[0, 1, 2].map((_, index) => (
          <motion.div
            key={index}
            animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.1, delay: index * 0.15, ease: "easeInOut" }}
            className="w-1.5 h-1.5 bg-accent-3 rounded-full"
          />
        ))}
      </div>
      <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.25em]">Thinking</span>
    </div>
  </motion.div>
));
MobileTypingIndicator.displayName = "MobileTypingIndicator";

export default MobileChatConsole;
