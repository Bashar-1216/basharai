"use client";

import { useState, useRef, useEffect } from "react";
import type { Locale } from "@/lib/i18n";
import styles from "./floating-chat.module.css";
import Link from "next/link";

/** Strip <think>...</think> reasoning blocks from LLM output */
function stripThinkTags(text: string): string {
  // Remove complete <think>...</think> blocks (including multiline)
  let cleaned = text.replace(/<think>[\s\S]*?<\/think>/gi, "");
  // Remove any trailing unclosed <think> block
  cleaned = cleaned.replace(/<think>[\s\S]*$/gi, "");
  return cleaned.trimStart();
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface FloatingChatProps {
  locale: Locale;
}

export function FloatingChat({ locale }: FloatingChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDevView, setIsDevView] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [telemetry, setTelemetry] = useState({
    latency: "0ms",
    cost: "$0.00000",
    tokens: "0 total",
    confidence: "100%"
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener("open-chat", handleOpenChat);
    return () => window.removeEventListener("open-chat", handleOpenChat);
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 80)}px`;
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

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: query,
          locale: locale,
        }),
      });

      if (!response.ok) {
        throw new Error("RAG connection failed");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No reader");

      let assistantResponse = "";
      const tempId = crypto.randomUUID();
      
      // Insert empty assistant response to update in real-time
      setMessages((prev) => [
        ...prev,
        {
          id: tempId,
          role: "assistant",
          content: "",
          timestamp: new Date(),
        },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.token) {
                assistantResponse += data.token;
                const cleaned = stripThinkTags(assistantResponse);
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === tempId ? { ...msg, content: cleaned } : msg
                  )
                );
              } else if (data.done && data.telemetry) {
                setTelemetry({
                  latency: data.telemetry.latency,
                  cost: data.telemetry.cost,
                  tokens: data.telemetry.tokens,
                  confidence: data.telemetry.groundedness,
                });
              }
            } catch (e) {
              // Ignore partial JSON chunks
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: locale === "ar" ? "تعذر الاتصال بالمساعد الذكي حالياً." : "Could not connect to the AI assistant at the moment.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isAr = locale === "ar";

  return (
    <div className={`${styles.chatWidget} no-print`}>
      {/* ── Level 1: Floating Action Button ──────────────── */}
      {!isOpen && (
        <button
          type="button"
          className={styles.fab}
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Assistant"
        >
          💬
        </button>
      )}

      {/* ── Level 2 & 3: Chat Popup Window ──────────────── */}
      {isOpen && (
        <div className={`${styles.popup} ${isDevView ? styles.splitPopup : ""}`}>
          {/* Header */}
          <div className={styles.popupHeader}>
            <div className={styles.headerInfo}>
              <span className={styles.avatar}>🤖</span>
              <div>
                <h4 className={styles.title}>
                  {isAr ? "مساعد بشار الذكي" : "Bashar AI Assistant"}
                </h4>
                <span className={styles.status}>🟢 {isAr ? "نشط" : "Online"}</span>
              </div>
            </div>
            <div className={styles.headerActions}>
              <button
                type="button"
                onClick={() => setIsDevView(!isDevView)}
                className={`${styles.devToggle} ${isDevView ? styles.devActive : ""}`}
                title={isAr ? "بيانات المطور" : "Developer Logs"}
              >
                ⚙️
              </button>
              <Link
                href={`/${locale}/assistant`}
                className={styles.expandBtn}
                title={isAr ? "تكبير الصفحة" : "Expand to Full Page"}
                onClick={() => setIsOpen(false)}
              >
                🗖
              </Link>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setIsOpen(false)}
                title={isAr ? "إغلاق" : "Close"}
              >
                ✕
              </button>
            </div>
          </div>

          <div className={styles.popupBody}>
            {/* Left Pane: Chat messages */}
            <div className={styles.chatPane}>
              <div className={styles.messagesArea}>
                {messages.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p>👋 {isAr ? "مرحباً! اسألني أي شيء عن خبرات بشار وماريعه." : "Hello! Ask me anything about Bashar's experience and projects."}</p>
                    <div className={styles.chips}>
                      <button type="button" onClick={() => { setInput(isAr ? "ما هي مشاريع بشار؟" : "What are Bashar's projects?"); }} className={styles.chip}>
                        {isAr ? "المشاريع" : "Projects"}
                      </button>
                      <button type="button" onClick={() => { setInput(isAr ? "أخبرني عن خلفية بشار المهنية" : "Tell me about Bashar's background"); }} className={styles.chip}>
                        {isAr ? "عن بشار" : "About Me"}
                      </button>
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
                    {isLoading && (
                      <div className={`${styles.message} ${styles.assistantMsg}`}>
                        <div className={styles.msgBubble}>
                          <div className={styles.typing}>
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

              {/* Input Form */}
              <form className={styles.inputForm} onSubmit={handleSubmit}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={isAr ? "اسأل هنا..." : "Ask a question..."}
                  rows={1}
                />
                <button type="submit" disabled={!input.trim() || isLoading}>
                  ➔
                </button>
              </form>
            </div>

            {/* Right Pane: Developer telemetry overlay */}
            {isDevView && (
              <aside className={styles.devPane}>
                <h5 className={styles.devTitle}>{isAr ? "سجل التشغيل" : "Telemetry logs"}</h5>
                <div className={styles.metrics}>
                  <div className={styles.metric}>
                    <span>Latency</span>
                    <strong>{telemetry.latency}</strong>
                  </div>
                  <div className={styles.metric}>
                    <span>Cost</span>
                    <strong>{telemetry.cost}</strong>
                  </div>
                  <div className={styles.metric}>
                    <span>Tokens</span>
                    <strong>{telemetry.tokens}</strong>
                  </div>
                  <div className={styles.metric}>
                    <span>Confidence</span>
                    <strong>{telemetry.confidence}</strong>
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
