"use client";

import { useState, useRef, useEffect } from "react";
import type { Locale } from "@/lib/i18n";
import styles from "./hero-agent.module.css";
import { MarkdownRenderer } from "./markdown-renderer";

interface HeroAgentProps {
  locale: Locale;
}

const SUGGESTED_PROMPTS = {
  en: [
    "Explain the GEO Platform architecture",
    "What are Bashar's ML metrics?",
    "Run a technical interview",
    "Compare SAPA vs GEO Platform",
  ],
  ar: [
    "اشرح بنية منصة GEO",
    "ما هي مقاييس أداء مشاريع بشار؟",
    "أجرِ مقابلة تقنية",
    "قارن بين SAPA ومنصة GEO",
  ],
};

export function HeroAgent({ locale }: HeroAgentProps) {
  const isAr = locale === "ar";
  const prompts = isAr ? SUGGESTED_PROMPTS.ar : SUGGESTED_PROMPTS.en;

  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content: isAr
        ? "أهلاً بك! أنا المساعد الذكي لبشار المنتصر. يمكنك استئثاري بأسئلة حول المشاريع والمعمارية، أو إجراء مقابلة تقنية تفاعلية."
        : "Welcome! I am Bashar Almuntaser's AI Assistant. Ask me about system architectures, ML metrics, or start an interactive technical interview.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (queryText?: string) => {
    const query = queryText || input.trim();
    if (!query || isLoading) return;

    setMessages((prev) => [...prev, { role: "user", content: query }]);
    if (!queryText) setInput("");
    setIsLoading(true);

    const tempId = crypto.randomUUID();
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query, locale }),
      });

      if (!response.ok) throw new Error("Connection failed");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No reader");

      let assistantText = "";

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
                assistantText += data.token;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { role: "assistant", content: assistantText };
                  return updated;
                });
              }
            } catch (e) {
              // Ignore partial chunk parsing errors
            }
          }
        }
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: "assistant",
          content: isAr
            ? "تعذر الاتصال بالمساعد حالياً. حاول مرة أخرى."
            : "Could not connect to the assistant right now. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.agentCard}>
      <div className={styles.cardHeader}>
        <div className={styles.agentInfo}>
          <span className={styles.agentDot} />
          <span className={styles.agentTitle}>Bashar AI — {isAr ? "متصل" : "Online"}</span>
        </div>
        <span className={styles.modelTag}>Groq / Gemini</span>
      </div>

      <div className={styles.chatArea}>
        {messages.map((m, i) => (
          <div
            key={i}
            className={`${styles.msgBubble} ${m.role === "user" ? styles.userMsg : styles.assistantMsg}`}
          >
            <MarkdownRenderer content={m.content} />
          </div>
        ))}
        {isLoading && (
          <div className={`${styles.msgBubble} ${styles.assistantMsg} ${styles.loadingMsg}`}>
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length <= 2 && (
        <div className={styles.promptsGrid}>
          {prompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              className={styles.promptBtn}
              onClick={() => handleSubmit(p)}
              disabled={isLoading}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <form
        className={styles.inputRow}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isAr ? "اسأل بشار AI أي شيء..." : "Ask Bashar AI anything..."}
          disabled={isLoading}
        />
        <button type="submit" disabled={!input.trim() || isLoading}>
          {isAr ? "إرسال" : "Send"}
        </button>
      </form>
    </div>
  );
}
