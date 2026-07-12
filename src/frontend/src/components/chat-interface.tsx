"use client";

import { useState, useRef, useEffect } from "react";
import type { Locale } from "@/lib/i18n";
import styles from "./chat-interface.module.css";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  dict: Record<string, Record<string, string>>;
  locale: Locale;
}

const suggestedQuestions = {
  en: [
    "What AI systems has Bashar built?",
    "Tell me about the SAPA project",
    "What is the RAG Triad evaluation?",
    "What tech stack does this platform use?",
  ],
  ar: [
    "ما هي أنظمة الذكاء الاصطناعي التي بناها بشار؟",
    "أخبرني عن مشروع SAPA",
    "ما هو تقييم مثلث RAG؟",
    "ما هي التقنيات المستخدمة في هذه المنصة؟",
  ],
};

/**
 * Chat Interface — Dual-mode interactive RAG assistant.
 * Offers a simple chat mode by default, and a Developer Console splitting
 * the screen on request to display RAG telemetry stats.
 */
export function ChatInterface({ dict, locale }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDevView, setIsDevView] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const query = input.trim();
    if (!query || isLoading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: query,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    setTimeout(() => {
      const mockResponse =
        locale === "ar"
          ? "هذا رد تجريبي من المساعد الذكي. سيتم ربطه بخادم FastAPI RAG قريباً لتقديم إجابات حقيقية مبنية على بيانات المحفظة الموثقة."
          : "This is a mock response from the AI assistant. It will be connected to the FastAPI RAG backend soon to provide real answers grounded in verified portfolio data.";

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: mockResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsLoading(false);
    }, 1200);
  };

  const handleSuggestionClick = (question: string) => {
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: question,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    setTimeout(() => {
      const mockResponse =
        locale === "ar"
          ? "هذا رد تجريبي من المساعد الذكي. سيتم ربطه بخادم FastAPI RAG قريباً لتقديم إجابات حقيقية مبنية على بيانات المحفظة الموثقة."
          : "This is a mock response from the AI assistant. It will be connected to the FastAPI RAG backend soon to provide real answers grounded in verified portfolio data.";

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: mockResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsLoading(false);
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={styles.chatContainer}>
      {/* ── Chat Header ──────────────────────────────────── */}
      <div className={styles.chatHeader}>
        <div className={styles.headerInfo}>
          <div className={styles.avatarGlow}>
            <span className={styles.avatar}>🤖</span>
          </div>
          <div className={styles.headerTitles}>
            <h1 className={styles.title}>{dict.assistant.title}</h1>
            <p className={styles.disclaimer}>{dict.assistant.disclaimer}</p>
          </div>
        </div>

        {/* ── Dev View Toggle ──────────────────────────────── */}
        <button
          type="button"
          onClick={() => setIsDevView(!isDevView)}
          className={`${styles.devToggle} ${isDevView ? styles.devActive : ""}`}
        >
          ⚙️ {locale === "ar" ? "عرض المطور" : "Developer View"}
        </button>
      </div>

      {/* ── View Split Pane ──────────────────────────────── */}
      <div className={`${styles.chatViewport} ${isDevView ? styles.splitView : ""}`}>
        {/* ── Left Pane: Active Chat Area ──────────────────── */}
        <div className={styles.chatPane}>
          <div className={styles.messagesArea}>
            {messages.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>💬</div>
                <p className={styles.emptyText}>
                  {locale === "ar"
                    ? "اسأل أي شيء عن خبرات بشار ومهاراته ومشاريعه"
                    : "Ask anything about Bashar's experience, skills, or projects"}
                </p>

                {/* ── Suggested Questions ──────────────────── */}
                <div className={styles.suggestions}>
                  {suggestedQuestions[locale].map((q) => (
                    <button
                      key={q}
                      className={styles.suggestionBtn}
                      onClick={() => handleSuggestionClick(q)}
                      type="button"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className={styles.messagesList}>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`${styles.message} ${
                      msg.role === "user" ? styles.userMsg : styles.assistantMsg
                    }`}
                  >
                    <div className={styles.msgBubble}>
                      <p className={styles.msgContent}>{msg.content}</p>
                    </div>
                  </div>
                ))}

                {/* ── Typing Indicator ──────────────────────── */}
                {isLoading && (
                  <div className={`${styles.message} ${styles.assistantMsg}`}>
                    <div className={styles.msgBubble}>
                      <div className={styles.typingIndicator}>
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* ── Input Area ───────────────────────────────────── */}
          <form className={styles.inputArea} onSubmit={handleSubmit}>
            <div className={styles.inputWrapper}>
              <textarea
                ref={inputRef}
                className={styles.input}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={dict.assistant.placeholder}
                rows={1}
                disabled={isLoading}
              />
              <button
                type="submit"
                className={styles.sendBtn}
                disabled={!input.trim() || isLoading}
                aria-label={dict.assistant.send}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </form>
        </div>

        {/* ── Right Pane: Developer Console (Telemetry) ────── */}
        {isDevView && (
          <aside className={styles.consolePane}>
            <h3 className={styles.consoleTitle}>
              {locale === "ar" ? "بيانات تشغيل الـ RAG" : "RAG Telemetry Logs"}
            </h3>
            <div className={styles.consoleMetrics}>
              <div className={styles.consoleMetric}>
                <span className={styles.consoleLabel}>Model</span>
                <span className={styles.consoleValue}>gpt-4o-mini</span>
              </div>
              <div className={styles.consoleMetric}>
                <span className={styles.consoleLabel}>Latency</span>
                <span className={styles.consoleValue}>420ms</span>
              </div>
              <div className={styles.consoleMetric}>
                <span className={styles.consoleLabel}>Confidence</span>
                <span className={styles.consoleValue}>94.2%</span>
              </div>
              <div className={styles.consoleMetric}>
                <span className={styles.consoleLabel}>Cost</span>
                <span className={styles.consoleValue}>$0.003</span>
              </div>
              <div className={styles.consoleMetric}>
                <span className={styles.consoleLabel}>Token Usage</span>
                <span className={styles.consoleValue}>480 In / 120 Out</span>
              </div>
              <div className={styles.consoleSources}>
                <span className={styles.consoleLabel}>Retrieved Sources</span>
                <ul className={styles.sourcesList}>
                  <li>docs/experience/nlp.md</li>
                  <li>docs/projects/eval.md</li>
                </ul>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
