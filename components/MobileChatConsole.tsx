"use client";

import { motion, AnimatePresence } from "motion/react";
import { useRef, useEffect, memo } from "react";
import FormattedMessage from "./FormattedMessage";

const WHITE = "oklch(99% 0.002 25)";

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
  debugInfo?: { error?: string | null } | null;
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
        className={`flex flex-col ${height} w-full border-2 border-[color:var(--ink)] bg-[color:var(--surface-elevated)] relative`}
      >
        {/* Top strip — black machine header */}
        <header className="flex items-center justify-between gap-3 px-4 py-3 bg-[color:var(--ink)] shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <span
              aria-hidden="true"
              className={`w-2 h-2 shrink-0 ${initError ? "bg-[color:var(--color-danger)]" : "bg-[color:var(--red-bright)]"}`}
            />
            <span className="num text-[10px] tracking-[0.16em] truncate" style={{ color: WHITE }}>
              LIVE AGENT
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="num text-[10px] text-[color:var(--ink-on-dark-muted)] tracking-[0.16em]">
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
                          ? "bg-[color:var(--red-bright)]"
                          : "border border-[color:oklch(97%_0.002_25/0.35)]"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </header>

        {/* Transcript */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 bg-[color:var(--surface)]">
          {isLoading ? (
            <MobileLoadingRow />
          ) : initError ? (
            <MobileErrorRow error={initError} />
          ) : (
            <div className="py-4 flex flex-col gap-4">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <MobileTranscriptRow key={msg.id} msg={msg} />
                ))}
                {isTyping && <MobileTypingRow />}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Bottom strip */}
        <div className="border-t-2 border-[color:var(--ink)] bg-[color:var(--surface-elevated)] shrink-0">
          <AnimatePresence>
            {isLimitReached && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-between gap-3 px-4 py-3 bg-[color:var(--red-soft)] border-b border-[color:var(--rule-strong)]"
              >
                <div className="min-w-0">
                  <span className="num text-[10px] text-[color:var(--red-deep)] font-semibold tracking-[0.16em] block">
                    {"// LIMIT"}
                  </span>
                  <span className="type-body text-[color:var(--ink)] text-[14px] truncate block">
                    Let&apos;s build yours.
                  </span>
                </div>
                <a href="/brief" className="btn-primary !min-h-[38px] !py-2 !px-3 !w-auto text-[12px] shrink-0">
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
                <span className="num text-[10px] text-[color:var(--ink-faint)] tracking-[0.18em] block mb-2">
                  TRY ASKING
                </span>
                <div className="flex flex-col gap-2">
                  {recommendedQuestions.slice(0, 3).map((q, i) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => handleSend(q)}
                      className="text-left grid grid-cols-[auto_1fr] gap-x-2.5 items-baseline p-2.5 border border-[color:var(--rule-strong)] active:bg-[color:var(--red-soft)] active:border-[color:var(--red)] transition-colors min-h-[44px]"
                    >
                      <span className="num text-[10px] text-[color:var(--red)] font-semibold">Q{i + 1}</span>
                      <span className="text-[14.5px] leading-snug text-[color:var(--ink-muted)]">{q}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input */}
          <form
            onSubmit={(e) => handleSend(inputValue, e)}
            className="flex items-stretch border-t border-[color:var(--rule-strong)]"
          >
            <span
              aria-hidden="true"
              className="num self-center pl-4 pr-1 text-[color:var(--red-deep)] font-semibold select-none"
            >
              &gt;
            </span>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value.slice(0, 400))}
              placeholder={isLimitReached ? "Demo complete." : "Ask anything..."}
              disabled={isLoading || isTyping || isLimitReached}
              maxLength={400}
              enterKeyHint="send"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              aria-label="Ask the Tharros agent"
              className="flex-1 min-w-0 bg-transparent py-3.5 pr-3 text-[16px] text-[color:var(--ink)] placeholder:text-[color:var(--ink-faint)] focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              aria-label="Send message"
              disabled={!inputValue.trim() || isLoading || isTyping || isLimitReached}
              className="flex items-center justify-center px-4 bg-[color:var(--red-deep)] disabled:bg-[color:var(--rule-strong)] disabled:text-[color:var(--ink-faint)] disabled:cursor-not-allowed transition-colors"
              style={{ color: WHITE }}
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

  if (isAgent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="flex flex-col items-start max-w-[90%] self-start"
      >
        <div className="flex items-center gap-2 mb-1.5">
          <span className="num text-[10px] tracking-[0.2em] text-[color:var(--red)] font-semibold">AGENT</span>
          <span className="num text-[10px] text-[color:var(--ink-faint)] tabular-nums">{msg.time}</span>
        </div>
        <div className="text-[15px] leading-[1.55] text-[color:var(--ink)]">
          <FormattedMessage text={msg.text} />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className="flex flex-col items-end max-w-[85%] self-end"
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className="num text-[10px] text-[color:var(--ink-faint)] tabular-nums">{msg.time}</span>
        <span className="num text-[10px] tracking-[0.2em] text-[color:var(--ink-faint)]">YOU</span>
      </div>
      <div className="px-3.5 py-2.5 text-[15px] leading-[1.5] bg-[color:var(--ink)]" style={{ color: WHITE }}>
        {msg.text}
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
    className="flex flex-col items-start self-start"
  >
    <span className="num text-[10px] tracking-[0.2em] text-[color:var(--red)] font-semibold mb-1.5">AGENT</span>
    <div className="flex items-center gap-2.5 text-[color:var(--ink-muted)]">
      <motion.span
        aria-hidden="true"
        animate={{ opacity: [0.25, 1, 0.25] }}
        transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut" }}
        className="inline-block w-[3px] h-[1.05em] bg-[color:var(--red)]"
      />
      <span className="num text-[10px] tracking-[0.2em]">THINKING</span>
    </div>
  </motion.div>
));
MobileTypingRow.displayName = "MobileTypingRow";

const MobileLoadingRow = memo(() => (
  <div className="py-6">
    <div className="flex items-baseline gap-2.5 mb-2">
      <span className="num text-[10px] tracking-[0.2em] text-[color:var(--ink-faint)]">[BOOT]</span>
      <span className="num text-[10px] tracking-[0.2em] text-[color:var(--ink-muted)]">WARMING UP</span>
    </div>
    <div className="h-[2px] bg-[color:var(--rule-strong)] relative overflow-hidden max-w-[220px]">
      <motion.span
        aria-hidden="true"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
        className="absolute inset-y-0 left-0 w-1/3 bg-[color:var(--red)]"
      />
    </div>
  </div>
));
MobileLoadingRow.displayName = "MobileLoadingRow";

const MobileErrorRow = memo(({ error }: { error: string }) => (
  <div className="py-6">
    <span className="num text-[10px] tracking-[0.2em] text-[color:var(--color-danger)] block mb-1.5">
      [ERR] AGENT OFFLINE
    </span>
    <p className="type-body text-[14px] text-[color:var(--ink-muted)]">{error}</p>
  </div>
));
MobileErrorRow.displayName = "MobileErrorRow";

export default MobileChatConsole;
