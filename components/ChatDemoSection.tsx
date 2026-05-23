"use client";

import { useState, useEffect, useRef, useCallback, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Client, Key, Agent, type Task } from "@relevanceai/sdk";
import AnimatedSection from "./AnimatedSection";
import { useIsMobile } from "@/hooks/useIsMobile";
import MobileChatConsole from "./MobileChatConsole";
import FormattedMessage from "./FormattedMessage";

const REGION = process.env.NEXT_PUBLIC_RELEVANCE_REGION || "";
const PROJECT = process.env.NEXT_PUBLIC_RELEVANCE_PROJECT || "";
const AGENT_ID = process.env.NEXT_PUBLIC_RELEVANCE_AGENT_ID || "";

const MAX_PROMPTS = 3;
const TIME_FORMATTER = new Intl.DateTimeFormat([], { hour: "2-digit", minute: "2-digit" });
const formatTime = () => TIME_FORMATTER.format(new Date());

const NEURAL_LOGIC_FEATURES = [
  { title: "Real Answers", desc: "Answers questions the way your front desk would." },
  { title: "Your Voice", desc: "Tuned to your services, your tone, your scope." },
  { title: "Wired In", desc: "Connects to your CRM, intake, and messaging." },
] as const;

const VERIFICATION_BLOCKS = [
  { label: "Plain Talk", title: "Clear Answers", desc: "Short for simple questions, deeper when the work calls for it." },
  { label: "On Topic", title: "Stays in Scope", desc: "Trained on your services. Won't wander into territory it shouldn't." },
] as const;

type LocalMessage = {
  id: string;
  sender: "user" | "agent";
  text: string;
  time: string;
};

interface AgentResource {
  config?: { recommended_questions?: string[]; suggested_queries?: string[] };
  metadata?: { recommended_questions?: string[] };
  sendMessage: (text: string, task: Task<any, any> | null) => Promise<Task<any, any>>;
}

export default function ChatDemoSection() {
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [recommendedQuestions, setRecommendedQuestions] = useState<string[]>([]);
  const [agentInstance, setAgentInstance] = useState<AgentResource | null>(null);
  const [currentTask, setCurrentTask] = useState<Task<any, any> | null>(null);
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
          if (typeof window !== "undefined") {
            localStorage.setItem(storageKey, JSON.stringify({ embedKey, conversationPrefix: taskPrefix }));
          }
        }

        const client = new Client(keyInstance);
        const agent = await Agent.get(AGENT_ID, client);
        setAgentInstance(agent as unknown as AgentResource);

        const config = (agent as any).config || {};
        const metadata = (agent as any).metadata || {};
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
      } catch (err: any) {
        console.error("Failed to initialize Relevance AI:", err);
        setInitError(err.message || "System error.");
        setIsLoading(false);
      }
    }

    initRelevance();
  }, []);

  useEffect(() => {
    if (!currentTask) return;

    const handleMessage = ({ detail }: any) => {
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
    <section id="demo" className="rhythm-default bg-[color:var(--surface-dark)]">
      <div className="page-frame">
        {/* §-eyebrow */}
        <AnimatedSection>
          <div className="flex items-center gap-4 mb-12 md:mb-16">
            <span className="num text-xs text-[color:var(--ink-on-dark-muted)]">§ DEMO</span>
            <span className="h-px w-8 bg-[color:var(--rule-on-dark-strong)]" />
            <span className="type-meta-strong text-[color:var(--ink-on-dark-muted)]">Live console</span>
          </div>
        </AnimatedSection>

        {/* Headline */}
        <div className="grid grid-cols-12 gap-x-6 gap-y-4 mb-14 md:mb-20">
          <AnimatedSection className="col-span-12 lg:col-span-8">
            <h2 className="type-display-2 text-[color:var(--ink-on-dark)] max-w-[18ch]">
              An agent that <br />
              <span className="text-[color:var(--accent-on-dark)]">shows up.</span>
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.1} className="col-span-12 lg:col-span-4 lg:pt-2">
            <p className="type-body text-[color:var(--ink-on-dark-muted)] max-w-[42ch]">
              Built once, embedded into your site, live the moment your visitors land. Try ours in real time.
            </p>
          </AnimatedSection>
        </div>

        {/* Feature row — three numbered hairline columns, no cards */}
        <AnimatedSection delay={0.1}>
          <div className="border-t border-[color:var(--rule-on-dark)] mb-16 md:mb-24">
            <div className="grid grid-cols-1 md:grid-cols-3">
              {NEURAL_LOGIC_FEATURES.map((feature, i) => (
                <div
                  key={feature.title}
                  className="py-8 md:py-10 md:px-8 md:first:pl-0 md:last:pr-0 border-b md:border-b-0 md:border-l first:border-l-0 border-[color:var(--rule-on-dark)] grid grid-cols-[auto_1fr] gap-x-4 items-start"
                >
                  <span className="num text-xs text-[color:var(--accent-on-dark)] mt-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h4 className="type-meta-strong text-[color:var(--ink-on-dark)] mb-3">{feature.title}</h4>
                    <p className="type-body text-[color:var(--ink-on-dark-muted)] max-w-[36ch]">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Console + sidebar */}
        <div className="grid grid-cols-12 gap-x-6 gap-y-12 lg:gap-y-0 items-start">
          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-4 lg:sticky lg:top-32 lg:pr-4">
            <AnimatedSection>
              <h3 className="type-display-3 text-[color:var(--ink-on-dark)] max-w-[16ch] mb-5">
                A live agent, <br />
                <span className="text-[color:var(--accent-on-dark)]">right now.</span>
              </h3>
              <p className="type-body text-[color:var(--ink-on-dark-muted)] max-w-[40ch] mb-10 lg:mb-12">
                Same engine we embed into Ottawa small business sites. Ask it about Tharros, or how we&apos;d build one for you.
              </p>

              <div className="border-t border-[color:var(--rule-on-dark)] hidden lg:block">
                {VERIFICATION_BLOCKS.map((item, i) => (
                  <div key={item.title} className="py-6 border-b border-[color:var(--rule-on-dark)] grid grid-cols-[auto_1fr] gap-x-4 items-start">
                    <span className="num text-xs text-[color:var(--accent-on-dark)] mt-1">{String.fromCharCode(65 + i)}</span>
                    <div>
                      <div className="flex items-baseline gap-3 mb-2">
                        <span className="type-meta text-[color:var(--ink-on-dark-faint)]">{item.label}</span>
                      </div>
                      <h4 className="type-meta-strong text-[color:var(--ink-on-dark)] mb-2">{item.title}</h4>
                      <p className="type-body text-[color:var(--ink-on-dark-muted)] max-w-[36ch]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>

          {/* Console */}
          <div className="col-span-12 lg:col-span-8">
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
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Desktop console — schematic figure on graphite
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
    <figure className="border border-[color:var(--rule-on-dark-strong)] bg-[color:var(--surface-dark-elevated)] flex flex-col h-[560px] xl:h-[680px] 3xl:h-[820px]">
      {/* Top strip — FIG label + remaining counter */}
      <header className="flex items-center justify-between px-5 md:px-6 py-3 border-b border-[color:var(--rule-on-dark)]">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className={`w-2 h-2 ${initError ? "bg-[color:var(--color-danger)]" : "bg-[color:var(--accent-on-dark)]"}`}
          />
          <span className="num text-[11px] text-[color:var(--ink-on-dark-faint)] tracking-[0.14em]">
            FIG · 001 / LIVE AGENT · OTTAWA
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="num text-[11px] text-[color:var(--ink-on-dark-muted)] tracking-[0.14em]">
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
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 md:px-6"
      >
        {isLoading && <LoadingRow />}
        {!isLoading && initError && <ErrorRow error={initError} />}

        {!isLoading && !initError && (
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <TranscriptRow key={msg.id} msg={msg} />
            ))}
            {isTyping && <TypingRow />}
          </AnimatePresence>
        )}
      </div>

      {/* Bottom strip — suggestions, limit banner, input */}
      <div className="border-t border-[color:var(--rule-on-dark)]">
        <AnimatePresence>
          {isLimitReached && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between gap-4 px-5 md:px-6 py-4 border-b border-[color:var(--rule-on-dark)]"
            >
              <div className="flex items-baseline gap-3 min-w-0">
                <span className="num text-[11px] text-[color:var(--color-danger)] tracking-[0.16em]">// LIMIT</span>
                <span className="type-body text-[color:var(--ink-on-dark-muted)] truncate">
                  Want one trained on your business? Let&apos;s talk.
                </span>
              </div>
              <a href="/brief" className="btn-primary !min-h-[36px] !py-2 !px-4 text-[13px] shrink-0">
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
              className="px-5 md:px-6 pt-4 pb-2"
            >
              <span className="num text-[11px] text-[color:var(--ink-on-dark-faint)] tracking-[0.18em] block mb-3">
                TRY ASKING
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3">
                {recommendedQuestions.slice(0, 3).map((q, i) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleSend(q)}
                    className="group text-left grid grid-cols-[auto_1fr] gap-x-3 items-baseline py-3 md:px-3 md:first:pl-0 md:last:pr-0 border-t md:border-t-0 md:border-l first:border-l-0 border-[color:var(--rule-on-dark)] focus:outline-none"
                  >
                    <span className="num text-[11px] text-[color:var(--accent-on-dark)]">Q{i + 1}</span>
                    <span className="type-body text-[color:var(--ink-on-dark-muted)] group-hover:text-[color:var(--ink-on-dark)] transition-colors">
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
          className="flex items-stretch border-t border-[color:var(--rule-on-dark)]"
        >
          <span
            aria-hidden="true"
            className="num self-center pl-5 md:pl-6 pr-2 text-[color:var(--accent-on-dark)] select-none"
          >
            &gt;
          </span>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              isLoading
                ? "Connecting agent..."
                : isLimitReached
                  ? "Demo complete. Let's build yours."
                  : "Ask anything about your business..."
            }
            disabled={isLoading || isTyping || isLimitReached || !!initError}
            className="flex-1 min-w-0 bg-transparent py-4 pr-4 type-body text-[color:var(--ink-on-dark)] placeholder:text-[color:var(--ink-on-dark-faint)] focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            aria-label="Send message"
            disabled={!inputValue.trim() || !agentInstance || isLoading || isTyping || isLimitReached}
            className="flex items-center gap-2 bg-[color:var(--accent)] text-[color:var(--ink-on-dark)] px-5 md:px-6 type-meta-strong hover:bg-[color:var(--accent-strong)] disabled:bg-[color:var(--rule-on-dark-strong)] disabled:text-[color:var(--ink-on-dark-faint)] disabled:cursor-not-allowed transition-colors"
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
   Transcript rows
   ============================================================ */

const TranscriptRow = memo(({ msg }: { msg: LocalMessage }) => {
  const isAgent = msg.sender === "agent";
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="grid grid-cols-[64px_1fr_56px] gap-x-4 py-5 border-b border-[color:var(--rule-on-dark)] last:border-b-0 items-start"
    >
      <span
        className={`num text-[11px] tracking-[0.18em] mt-1 ${
          isAgent ? "text-[color:var(--accent-on-dark)]" : "text-[color:var(--ink-on-dark-faint)]"
        }`}
      >
        {isAgent ? "[AGENT]" : "[YOU]"}
      </span>
      <div
        className={`type-body min-w-0 ${
          isAgent ? "text-[color:var(--ink-on-dark)]" : "text-[color:var(--ink-on-dark-muted)]"
        }`}
      >
        {isAgent ? <FormattedMessage text={msg.text} /> : msg.text}
      </div>
      <span className="num text-[11px] text-[color:var(--ink-on-dark-faint)] tabular-nums text-right mt-1">
        {msg.time}
      </span>
    </motion.div>
  );
});
TranscriptRow.displayName = "TranscriptRow";

const TypingRow = memo(() => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="grid grid-cols-[64px_1fr_56px] gap-x-4 py-5 items-start"
  >
    <span className="num text-[11px] tracking-[0.18em] text-[color:var(--accent-on-dark)] mt-1">[AGENT]</span>
    <div className="flex items-center gap-3 type-body text-[color:var(--ink-on-dark-muted)]">
      <motion.span
        aria-hidden="true"
        animate={{ opacity: [0.25, 1, 0.25] }}
        transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut" }}
        className="inline-block w-[2px] h-[1.1em] bg-[color:var(--accent-on-dark)]"
      />
      <span className="num text-[11px] tracking-[0.18em]">THINKING</span>
    </div>
    <span aria-hidden="true" />
  </motion.div>
));
TypingRow.displayName = "TypingRow";

const LoadingRow = memo(() => (
  <div className="grid grid-cols-[64px_1fr] gap-x-4 py-8 items-start">
    <span className="num text-[11px] tracking-[0.18em] text-[color:var(--ink-on-dark-faint)] mt-1">[BOOT]</span>
    <div>
      <div className="flex items-baseline gap-3 mb-3">
        <span className="num text-[11px] tracking-[0.18em] text-[color:var(--ink-on-dark-muted)]">WARMING UP</span>
      </div>
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
LoadingRow.displayName = "LoadingRow";

const ErrorRow = memo(({ error }: { error: string }) => (
  <div className="grid grid-cols-[64px_1fr] gap-x-4 py-8 items-start">
    <span className="num text-[11px] tracking-[0.18em] text-[color:var(--color-danger)] mt-1">[ERR]</span>
    <div>
      <span className="num text-[11px] tracking-[0.18em] text-[color:var(--color-danger)] block mb-2">
        AGENT OFFLINE
      </span>
      <p className="type-body text-[color:var(--ink-on-dark-muted)] max-w-[52ch]">{error}</p>
    </div>
  </div>
));
ErrorRow.displayName = "ErrorRow";
