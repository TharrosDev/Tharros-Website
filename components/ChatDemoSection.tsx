"use client";

import { useState, useEffect, useRef, useCallback, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Client, Key, Agent, type Task, type Region } from "@relevanceai/sdk";
import AnimatedSection from "./AnimatedSection";
import SectionEyebrow from "./SectionEyebrow";
import { useIsMobile } from "@/hooks/useIsMobile";
import MobileChatConsole from "./MobileChatConsole";
import FormattedMessage from "./FormattedMessage";

const REGION = process.env.NEXT_PUBLIC_RELEVANCE_REGION || "";
const PROJECT = process.env.NEXT_PUBLIC_RELEVANCE_PROJECT || "";
const AGENT_ID = process.env.NEXT_PUBLIC_RELEVANCE_AGENT_ID || "";

const MAX_PROMPTS = 3;
const TIME_FORMATTER = new Intl.DateTimeFormat([], { hour: "2-digit", minute: "2-digit" });
const formatTime = () => TIME_FORMATTER.format(new Date());

const TRUST_POINTS = [
  { title: "Real Answers", desc: "Answers questions the way your front desk would, then knows when to hand off to you." },
  { title: "Your Voice", desc: "Trained on your services, your tone, and your scope. It stays on topic." },
  { title: "Wired In", desc: "Connects to your CRM, intake forms, and messaging channels." },
] as const;

const WHITE = "oklch(99% 0.002 25)";

type LocalMessage = {
  id: string;
  sender: "user" | "agent";
  text: string;
  time: string;
};

interface AgentMessagePayload {
  type?: string;
  id: string;
  text?: string;
  details?: { recommended_questions?: string[] };
  recommended_questions?: string[];
}

interface AgentResource {
  config?: { recommended_questions?: string[]; suggested_queries?: string[] };
  metadata?: { recommended_questions?: string[] };
  sendMessage: (text: string, task: Task<Agent> | null) => Promise<Task<Agent>>;
}

export default function ChatDemoSection() {
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [recommendedQuestions, setRecommendedQuestions] = useState<string[]>([]);
  const [agentInstance, setAgentInstance] = useState<AgentResource | null>(null);
  const [currentTask, setCurrentTask] = useState<Task<Agent> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const [userMessageCount, setUserMessageCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const countRef = useRef(0);

  const isLimitReached = userMessageCount >= MAX_PROMPTS;
  const remaining = Math.max(0, MAX_PROMPTS - userMessageCount);

  useEffect(() => {
    countRef.current = userMessageCount;
  }, [userMessageCount]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`pc-${AGENT_ID}`);
      if (stored) {
        const count = parseInt(stored, 10);
        // eslint-disable-next-line react-hooks/set-state-in-effect -- restore prompt count from localStorage after mount
        setUserMessageCount(count);
        countRef.current = count;
      }
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      localStorage.setItem(`pc-${AGENT_ID}`, userMessageCount.toString());
    }
  }, [userMessageCount, isInitialized]);

  useEffect(() => {
    async function initRelevance() {
      if (!REGION || !PROJECT || !AGENT_ID) {
        setInitError("Agent not configured. Please contact support.");
        setIsLoading(false);
        return;
      }
      try {
        const storageKey = `r-${AGENT_ID}`;
        const storedJson = localStorage.getItem(storageKey);
        const stored = storedJson ? JSON.parse(storedJson) : null;

        let keyInstance;
        if (typeof window !== "undefined" && stored?.embedKey && stored?.conversationPrefix) {
          keyInstance = new Key({
            key: stored.embedKey,
            region: REGION as Region,
            project: PROJECT,
            agentId: AGENT_ID,
            taskPrefix: stored.conversationPrefix,
          });
        } else {
          keyInstance = await Key.generateEmbedKey({
            region: REGION as Region,
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
        const resource = agent as unknown as AgentResource;
        setAgentInstance(resource);

        const config = resource.config || {};
        const metadata = resource.metadata || {};
        const initialQuestions =
          config.recommended_questions ||
          metadata.recommended_questions ||
          config.suggested_queries ||
          [];

        if (initialQuestions.length > 0) {
          setRecommendedQuestions(initialQuestions);
        }

        setMessages([
          {
            id: "1",
            sender: "agent",
            text: "Hi! I'm your Tharros-powered AI agent. Ask me anything about our services.",
            time: formatTime(),
          },
        ]);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to initialize Relevance AI:", err);
        setInitError(err instanceof Error ? err.message : "System error.");
        setIsLoading(false);
      }
    }

    initRelevance();
  }, []);

  useEffect(() => {
    if (!currentTask) return;

    const handleMessage = ({ detail }: { detail: { message: AgentMessagePayload } }) => {
      const { message } = detail;
      if (message.type === "agent-message") {
        setMessages((prev) => {
          if (prev.some((m) => m.id === message.id)) return prev;
          return [...prev, { id: message.id, sender: "agent", text: message.text || "...", time: formatTime() }];
        });
        if (countRef.current < MAX_PROMPTS) {
          if (message.details?.recommended_questions) {
            setRecommendedQuestions(message.details.recommended_questions);
          } else if (message.recommended_questions) {
            setRecommendedQuestions(message.recommended_questions);
          }
        }
        setIsTyping(false);
      }
    };

    currentTask.addEventListener("message", handleMessage);
    return () => {
      currentTask.removeEventListener("message", handleMessage);
      currentTask.unsubscribe();
    };
  }, [currentTask]);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior });
    }
  }, []);

  useEffect(() => {
    scrollToBottom(messages.length <= 1 ? "auto" : "smooth");
  }, [messages, isTyping, scrollToBottom]);

  const handleSend = useCallback(
    async (text: string, e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (!text.trim() || !agentInstance || isTyping || countRef.current >= MAX_PROMPTS) return;

      setInputValue("");
      setRecommendedQuestions([]);
      setUserMessageCount((prev) => prev + 1);

      const userMsgId = Date.now().toString();
      setMessages((prev) => [
        ...prev,
        { id: userMsgId, sender: "user", text, time: formatTime() },
      ]);

      setIsTyping(true);

      try {
        const newTask = await agentInstance.sendMessage(text, currentTask);
        if (newTask !== currentTask) setCurrentTask(newTask);
      } catch (error) {
        console.error("Error sending message:", error);
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          { id: "error", sender: "agent", text: "I encountered an error. Please try again.", time: formatTime() },
        ]);
      }
    },
    [agentInstance, currentTask, isTyping],
  );

  return (
    <section id="demo" className="rhythm-default bg-[color:var(--surface)] border-t border-[color:var(--rule)]">
      <div className="page-frame">
        <SectionEyebrow numeral="§ 02" label="Live agent" />

        {/* Headline */}
        <div className="grid grid-cols-12 gap-x-6 gap-y-6 mb-12 md:mb-16">
          <AnimatedSection className="col-span-12 lg:col-span-7">
            <h2 className="type-display-2 max-w-[15ch]">
              Don&apos;t take our word for it. <span className="accent-text">Ask it.</span>
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.1} className="col-span-12 lg:col-span-5 lg:pt-2">
            <p className="type-lead">
              The same engine we embed into Ottawa small business sites, live right here. Ask it
              about Tharros, or how we&apos;d build one for you.
            </p>
            <dl className="meta-row mt-6 pt-5 border-t-2 border-[color:var(--ink)]">
              <div><dt>Cost</dt><dd>Free</dd></div>
              <div><dt>Sign-up</dt><dd>None</dd></div>
              <div><dt>Questions</dt><dd className="num">03</dd></div>
            </dl>
          </AnimatedSection>
        </div>

        {/* Console */}
        <AnimatedSection delay={0.1}>
          {isMobile ? (
            <MobileChatConsole
              messages={messages}
              inputValue={inputValue}
              setInputValue={setInputValue}
              handleSend={handleSend}
              isTyping={isTyping}
              recommendedQuestions={recommendedQuestions}
              title="Tharros AI Agent"
              subtitle="Online"
              modelType="Live Demo"
              userMessageCount={userMessageCount}
              maxPrompts={MAX_PROMPTS}
              isLoading={isLoading}
              debugInfo={initError ? { error: initError } : null}
            />
          ) : (
            <DesktopConsole
              scrollRef={scrollRef}
              messages={messages}
              isTyping={isTyping}
              isLoading={isLoading}
              initError={initError}
              inputValue={inputValue}
              setInputValue={setInputValue}
              handleSend={handleSend}
              recommendedQuestions={recommendedQuestions}
              remaining={remaining}
              isLimitReached={isLimitReached}
              agentInstance={agentInstance}
            />
          )}
        </AnimatedSection>

        {/* Trust row */}
        <AnimatedSection delay={0.15}>
          <div className="mt-12 md:mt-16 border-t-2 border-[color:var(--ink)] grid grid-cols-1 md:grid-cols-3">
            {TRUST_POINTS.map((point, i) => (
              <div
                key={point.title}
                className={`py-7 md:py-9 md:px-7 md:first:pl-0 md:last:pr-0 border-b md:border-b-0 md:border-l first:border-l-0 border-[color:var(--rule)] grid grid-cols-[auto_1fr] gap-x-4 items-start`}
              >
                <span className="num text-sm font-semibold text-[color:var(--red)] mt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="type-meta-strong mb-2.5">{point.title}</h3>
                  <p className="type-body text-[color:var(--ink-muted)] max-w-[34ch]">{point.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ============================================================
   Desktop console — white surface, black machine header
   ============================================================ */

type ConsoleProps = {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  messages: LocalMessage[];
  isTyping: boolean;
  isLoading: boolean;
  initError: string | null;
  inputValue: string;
  setInputValue: (v: string) => void;
  handleSend: (text: string, e?: React.FormEvent) => void;
  recommendedQuestions: string[];
  remaining: number;
  isLimitReached: boolean;
  agentInstance: AgentResource | null;
};

function DesktopConsole({
  scrollRef,
  messages,
  isTyping,
  isLoading,
  initError,
  inputValue,
  setInputValue,
  handleSend,
  recommendedQuestions,
  remaining,
  isLimitReached,
  agentInstance,
}: ConsoleProps) {
  return (
    <figure className="border-2 border-[color:var(--ink)] bg-[color:var(--surface-elevated)] flex flex-col h-[580px] xl:h-[700px] 3xl:h-[820px]">
      {/* Top strip — black machine header */}
      <header className="flex items-center justify-between px-5 md:px-7 py-3.5 bg-[color:var(--ink)]">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className={`w-2 h-2 ${initError ? "bg-[color:var(--color-danger)]" : "bg-[color:var(--red-bright)]"}`}
          />
          <span className="num text-[11px] tracking-[0.16em]" style={{ color: WHITE }}>
            LIVE AGENT · OTTAWA
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="num text-[11px] tracking-[0.16em] text-[color:var(--ink-on-dark-muted)]">
            {isLimitReached ? "LIMIT REACHED" : `${String(remaining).padStart(2, "0")} / ${String(MAX_PROMPTS).padStart(2, "0")} LEFT`}
          </span>
          <div className="flex items-center gap-[3px]" aria-hidden="true">
            {Array.from({ length: MAX_PROMPTS }).map((_, i) => {
              const filled = !isLimitReached && i < remaining;
              return (
                <span
                  key={i}
                  className={`h-2 w-5 ${
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
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 md:px-7 bg-[color:var(--surface)]"
      >
        {isLoading && <LoadingRow />}
        {!isLoading && initError && <ErrorRow error={initError} />}

        {!isLoading && !initError && (
          <div className="py-6 flex flex-col gap-5">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <TranscriptRow key={msg.id} msg={msg} />
              ))}
              {isTyping && <TypingRow />}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Bottom strip — limit banner, suggestions, input */}
      <div className="border-t-2 border-[color:var(--ink)] bg-[color:var(--surface-elevated)]">
        <AnimatePresence>
          {isLimitReached && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between gap-4 px-5 md:px-7 py-4 bg-[color:var(--red-soft)] border-b border-[color:var(--rule-strong)]"
            >
              <div className="flex items-baseline gap-3 min-w-0">
                <span className="num text-[11px] text-[color:var(--red-deep)] font-semibold tracking-[0.16em]">{"// LIMIT"}</span>
                <span className="type-body text-[color:var(--ink)] truncate">
                  Want one trained on your business? Let&apos;s talk.
                </span>
              </div>
              <a href="/brief" className="btn-primary !min-h-[40px] !w-auto !py-2.5 !px-4 text-[13px] shrink-0">
                Get started
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
              className="px-5 md:px-7 pt-4 pb-2"
            >
              <span className="num text-[11px] text-[color:var(--ink-faint)] tracking-[0.18em] block mb-3">
                TRY ASKING
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                {recommendedQuestions.slice(0, 3).map((q, i) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleSend(q)}
                    className="group text-left grid grid-cols-[auto_1fr] gap-x-2.5 items-baseline p-3 border border-[color:var(--rule-strong)] hover:border-[color:var(--red)] hover:bg-[color:var(--red-soft)] transition-colors focus:outline-none"
                  >
                    <span className="num text-[11px] text-[color:var(--red)] font-semibold">Q{i + 1}</span>
                    <span className="text-[14px] leading-snug text-[color:var(--ink-muted)] group-hover:text-[color:var(--ink)] transition-colors">
                      {q}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input bar */}
        <form
          onSubmit={(e) => handleSend(inputValue, e)}
          className="flex items-stretch border-t border-[color:var(--rule-strong)]"
        >
          <span
            aria-hidden="true"
            className="num self-center pl-5 md:pl-7 pr-2 text-[color:var(--red-deep)] font-semibold select-none"
          >
            &gt;
          </span>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value.slice(0, 400))}
            placeholder={
              isLoading
                ? "Connecting agent..."
                : isLimitReached
                  ? "Demo complete. Let's build yours."
                  : "Ask anything about your business..."
            }
            disabled={isLoading || isTyping || isLimitReached || !!initError}
            maxLength={400}
            enterKeyHint="send"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            aria-label="Ask the Tharros agent"
            className="flex-1 min-w-0 bg-transparent py-4 pr-4 type-body text-[color:var(--ink)] placeholder:text-[color:var(--ink-faint)] focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            aria-label="Send message"
            disabled={!inputValue.trim() || !agentInstance || isLoading || isTyping || isLimitReached}
            className="flex items-center gap-2 bg-[color:var(--red-deep)] px-5 md:px-7 font-mono text-[12px] font-bold uppercase tracking-[0.14em] hover:bg-[color:var(--red-deeper)] disabled:bg-[color:var(--rule-strong)] disabled:text-[color:var(--ink-faint)] disabled:cursor-not-allowed transition-colors"
            style={{ color: WHITE }}
          >
            <span>Send</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </button>
        </form>
      </div>

      <figcaption className="sr-only">Live Tharros AI agent console.</figcaption>
    </figure>
  );
}

/* ============================================================
   Transcript rows — agent left (plain), user right (black bubble)
   ============================================================ */

const ROW_EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const TranscriptRow = memo(({ msg }: { msg: LocalMessage }) => {
  const isAgent = msg.sender === "agent";

  if (isAgent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: ROW_EASE }}
        className="flex flex-col items-start max-w-[88%] self-start"
      >
        <div className="flex items-center gap-2.5 mb-2">
          <span className="num text-[10px] tracking-[0.2em] text-[color:var(--red)] font-semibold">AGENT</span>
          <span className="num text-[10px] text-[color:var(--ink-faint)] tabular-nums">{msg.time}</span>
        </div>
        <div className="text-[15px] leading-relaxed text-[color:var(--ink)]">
          <FormattedMessage text={msg.text} />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: ROW_EASE }}
      className="flex flex-col items-end max-w-[82%] self-end"
    >
      <div className="flex items-center gap-2.5 mb-2">
        <span className="num text-[10px] text-[color:var(--ink-faint)] tabular-nums">{msg.time}</span>
        <span className="num text-[10px] tracking-[0.2em] text-[color:var(--ink-faint)]">YOU</span>
      </div>
      <div
        className="px-4 py-2.5 text-[15px] leading-[1.5] bg-[color:var(--ink)]"
        style={{ color: WHITE }}
      >
        {msg.text}
      </div>
    </motion.div>
  );
});
TranscriptRow.displayName = "TranscriptRow";

const TypingRow = memo(() => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex flex-col items-start self-start"
  >
    <span className="num text-[10px] tracking-[0.2em] text-[color:var(--red)] font-semibold mb-2">AGENT</span>
    <div className="flex items-center gap-3 text-[color:var(--ink-muted)]">
      <motion.span
        aria-hidden="true"
        animate={{ opacity: [0.25, 1, 0.25] }}
        transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut" }}
        className="inline-block w-[3px] h-[1.1em] bg-[color:var(--red)]"
      />
      <span className="num text-[10px] tracking-[0.2em]">THINKING</span>
    </div>
  </motion.div>
));
TypingRow.displayName = "TypingRow";

const LoadingRow = memo(() => (
  <div className="py-8">
    <div className="flex items-baseline gap-3 mb-3">
      <span className="num text-[11px] tracking-[0.2em] text-[color:var(--ink-faint)]">[BOOT]</span>
      <span className="num text-[11px] tracking-[0.2em] text-[color:var(--ink-muted)]">WARMING UP</span>
    </div>
    <div className="h-[2px] bg-[color:var(--rule-strong)] relative overflow-hidden max-w-[280px]">
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
LoadingRow.displayName = "LoadingRow";

const ErrorRow = memo(({ error }: { error: string }) => (
  <div className="py-8">
    <span className="num text-[11px] tracking-[0.2em] text-[color:var(--color-danger)] block mb-2">
      [ERR] AGENT OFFLINE
    </span>
    <p className="type-body text-[color:var(--ink-muted)] max-w-[52ch]">{error}</p>
  </div>
));
ErrorRow.displayName = "ErrorRow";
