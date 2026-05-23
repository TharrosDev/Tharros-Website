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

const MobileChatConsole = memo(
  ({
    messages,
    inputValue,
    setInputValue,
    handleSend,
    isTyping,
    recommendedQuestions,
    userMessageCount,
    maxPrompts,
    isLoading = false,
    height = "h-[70dvh] min-h-[520px] max-h-[760px]",
    debugInfo,
  }: MobileChatConsoleProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const isLimitReached = userMessageCount >= maxPrompts;
    const remaining = Math.max(0, maxPrompts - userMessageCount);
    const initError = debugInfo?.error ?? null;

    useEffect(() => {
      const scroll = () => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      };
      const rafId = requestAnimationFrame(scroll);
      return () => cancelAnimationFrame(rafId);
    }, [messages, isTyping]);

    return (
      <figure
        className={`flex flex-col ${height} w-full border border-[color:var(--rule-on-dark-strong)] bg-[color:var(--surface-dark-elevated)] relative`}
      >
        {/* Top strip */}
        <header className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[color:var(--rule-on-dark)] shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <span
              aria-hidden="true"
              className={`w-2 h-2 shrink-0 ${initError ? "bg-[color:var(--color-danger)]" : "bg-[color:var(--accent-on-dark)]"}`}
            />
            <span className="num text-[10px] text-[color:var(--ink-on-dark-faint)] tracking-[0.14em] truncate">
              FIG · 001 / LIVE AGENT
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="num text-[10px] text-[color:var(--ink-on-dark-muted)] tracking-[0.14em]">
              {isLimitReached
                ? "LIMIT"
                : `${String(remaining).padStart(2, "0")} / ${String(maxPrompts).padStart(2, "0")}`}
            </span>
            <div className="flex items-center gap-[2px]" aria-hidden="true">
              {Array.from({ length: maxPrompts }).map((_, i) => {
                const filled = !isLimitReached && i < remaining;
                return (
                  <span
                    key={i}
                    className={`h-2 w-3.5 ${
                      isLimitReached
                        ? "bg-[color:var(--color-danger)]"
                        : filled
                          ? "bg-[color:var(--accent-on-dark)]"
                          : "border border-[color:var(--rule-on-dark-strong)]"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </header>

        {/* Transcript */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4">
          {isLoading ? (
            <MobileLoadingRow />
          ) : initError ? (
            <MobileErrorRow error={initError} />
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <MobileTranscriptRow key={msg.id} msg={msg} />
              ))}
              {isTyping && <MobileTypingRow />}
            </AnimatePresence>
          )}
        </div>

        {/* Bottom strip */}
        <div className="border-t border-[color:var(--rule-on-dark)] shrink-0">
          <AnimatePresence>
            {isLimitReached && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[color:var(--rule-on-dark)]"
              >
                <div className="min-w-0">
                  <span className="num text-[10px] text-[color:var(--color-danger)] tracking-[0.16em] block">
                    // LIMIT
                  </span>
                  <span className="type-body text-[color:var(--ink-on-dark-muted)] text-[14px] truncate block">
                    Let&apos;s build yours.
                  </span>
                </div>
                <a href="/brief" className="btn-primary !min-h-[36px] !py-2 !px-3 !w-auto text-[12px] shrink-0">
                  Start
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </a>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {recommendedQuestions.length > 0 && !isTyping && !isLimitReached && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="px-4 pt-3 pb-1"
              >
                <span className="num text-[10px] text-[color:var(--ink-on-dark-faint)] tracking-[0.18em] block mb-2">
                  TRY ASKING
                </span>
                <div className="flex flex-col">
                  {recommendedQuestions.slice(0, 3).map((q, i) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => handleSend(q)}
                      className="text-left grid grid-cols-[auto_1fr] gap-x-3 items-baseline py-2.5 border-t first:border-t-0 border-[color:var(--rule-on-dark)] active:bg-[color:var(--rule-on-dark)]/30 transition-colors min-h-[44px]"
                    >
                      <span className="num text-[10px] text-[color:var(--accent-on-dark)]">Q{i + 1}</span>
                      <span className="type-body text-[color:var(--ink-on-dark-muted)] text-[14.5px]">{q}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input */}
          <form
            onSubmit={(e) => handleSend(inputValue, e)}
            className="flex items-stretch border-t border-[color:var(--rule-on-dark)]"
          >
            <span
              aria-hidden="true"
              className="num self-center pl-4 pr-1 text-[color:var(--accent-on-dark)] select-none"
            >
              &gt;
            </span>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isLimitReached ? "Demo complete." : "Ask anything..."}
              disabled={isLoading || isTyping || isLimitReached}
              enterKeyHint="send"
              autoComplete="off"
              autoCorrect="off"
              className="flex-1 min-w-0 bg-transparent py-3.5 pr-3 text-[16px] text-[color:var(--ink-on-dark)] placeholder:text-[color:var(--ink-on-dark-faint)] focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              aria-label="Send message"
              disabled={!inputValue.trim() || isLoading || isTyping || isLimitReached}
              className="flex items-center justify-center px-4 bg-[color:var(--accent)] text-[color:var(--ink-on-dark)] type-meta-strong disabled:bg-[color:var(--rule-on-dark-strong)] disabled:text-[color:var(--ink-on-dark-faint)] disabled:cursor-not-allowed transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </button>
          </form>
        </div>

        <figcaption className="sr-only">Live Tharros AI agent console (mobile).</figcaption>
      </figure>
    );
  },
);
MobileChatConsole.displayName = "MobileChatConsole";

const MobileTranscriptRow = memo(({ msg }: { msg: LocalMessage }) => {
  const isAgent = msg.sender === "agent";
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as any }}
      className="grid grid-cols-[44px_1fr] gap-x-3 py-4 border-b border-[color:var(--rule-on-dark)] last:border-b-0"
    >
      <span
        className={`num text-[10px] tracking-[0.18em] mt-1 ${
          isAgent ? "text-[color:var(--accent-on-dark)]" : "text-[color:var(--ink-on-dark-faint)]"
        }`}
      >
        {isAgent ? "[AGT]" : "[YOU]"}
      </span>
      <div>
        <div
          className={`type-body text-[15px] leading-[1.55] ${
            isAgent ? "text-[color:var(--ink-on-dark)]" : "text-[color:var(--ink-on-dark-muted)]"
          }`}
        >
          {isAgent ? <FormattedMessage text={msg.text} /> : msg.text}
        </div>
        <span className="num text-[10px] text-[color:var(--ink-on-dark-faint)] tabular-nums mt-1.5 block">
          {msg.time}
        </span>
      </div>
    </motion.div>
  );
});
MobileTranscriptRow.displayName = "MobileTranscriptRow";

const MobileTypingRow = memo(() => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="grid grid-cols-[44px_1fr] gap-x-3 py-4"
  >
    <span className="num text-[10px] tracking-[0.18em] text-[color:var(--accent-on-dark)] mt-1">[AGT]</span>
    <div className="flex items-center gap-2.5">
      <motion.span
        aria-hidden="true"
        animate={{ opacity: [0.25, 1, 0.25] }}
        transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut" }}
        className="inline-block w-[2px] h-[1.05em] bg-[color:var(--accent-on-dark)]"
      />
      <span className="num text-[10px] tracking-[0.18em] text-[color:var(--ink-on-dark-muted)]">THINKING</span>
    </div>
  </motion.div>
));
MobileTypingRow.displayName = "MobileTypingRow";

const MobileLoadingRow = memo(() => (
  <div className="grid grid-cols-[44px_1fr] gap-x-3 py-6">
    <span className="num text-[10px] tracking-[0.18em] text-[color:var(--ink-on-dark-faint)] mt-1">[BOOT]</span>
    <div>
      <span className="num text-[10px] tracking-[0.18em] text-[color:var(--ink-on-dark-muted)] block mb-2">
        WARMING UP
      </span>
      <div className="h-px bg-[color:var(--rule-on-dark-strong)] relative overflow-hidden">
        <motion.span
          aria-hidden="true"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
          className="absolute inset-y-[-1px] left-0 w-1/3 bg-[color:var(--accent-on-dark)]"
        />
      </div>
    </div>
  </div>
));
MobileLoadingRow.displayName = "MobileLoadingRow";

const MobileErrorRow = memo(({ error }: { error: string }) => (
  <div className="grid grid-cols-[44px_1fr] gap-x-3 py-6">
    <span className="num text-[10px] tracking-[0.18em] text-[color:var(--color-danger)] mt-1">[ERR]</span>
    <div>
      <span className="num text-[10px] tracking-[0.18em] text-[color:var(--color-danger)] block mb-1.5">
        AGENT OFFLINE
      </span>
      <p className="type-body text-[14px] text-[color:var(--ink-on-dark-muted)]">{error}</p>
    </div>
  </div>
));
MobileErrorRow.displayName = "MobileErrorRow";

export default MobileChatConsole;
