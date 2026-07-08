"use client";

import { useState, useRef, useEffect } from "react";
import type { Locale } from "@/lib/i18n";
import styles from "./assistant-console.module.css";
import Link from "next/link";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AssistantConsoleProps {
  locale: Locale;
}

export function AssistantConsole({ locale }: AssistantConsoleProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDevView, setIsDevView] = useState(true); // Default open in full page console!
  const [telemetry, setTelemetry] = useState({
    latency: "0ms",
    cost: "$0.00000",
    tokens: "0 In / 0 Out",
    groundedness: "100% 🟢",
    relevance: "100% 🟢"
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === tempId ? { ...msg, content: assistantResponse } : msg
                  )
                );
              } else if (data.done && data.telemetry) {
                setTelemetry({
                  latency: data.telemetry.latency,
                  cost: data.telemetry.cost,
                  tokens: data.telemetry.tokens,
                  groundedness: data.telemetry.groundedness,
                  relevance: data.telemetry.context_relevance,
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

  const history = [
    { id: "1", title: isAr ? "مناقشة بنية RAG" : "RAG Pipeline Architecture" },
    { id: "2", title: isAr ? "خبرة منصات أمازون" : "Amazon Platform Scaling" },
    { id: "3", title: isAr ? "مراقبة التكاليف والرموز" : "LLM Cost Metrics check" },
  ];

  return (
    <div className={styles.consoleWrapper}>
      {/* 1. Sidebar: Chat History */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h3>{isAr ? "سجل المحادثات" : "Conversation History"}</h3>
        </div>
        <div className={styles.historyList}>
          {history.map((item) => (
            <button key={item.id} type="button" className={styles.historyItem}>
              💬 {item.title}
            </button>
          ))}
        </div>
        <div className={styles.sidebarFooter}>
          <Link href={`/${locale}/dashboard`} className={styles.dashLink}>
            📊 {isAr ? "لوحة تحليلات القياس" : "Observability Dashboard"}
          </Link>
        </div>
      </aside>

      {/* 2. Main Chat Thread */}
      <div className={styles.chatArea}>
        <div className={styles.threadHeader}>
          <div className={styles.headerTitle}>
            <h2>🤖 {isAr ? "كونسول مساعد الذكاء الاصطناعي" : "AI Assistant Console"}</h2>
            <span>Status: online</span>
          </div>
          <button
            type="button"
            className={`${styles.devToggle} ${isDevView ? styles.devActive : ""}`}
            onClick={() => setIsDevView(!isDevView)}
          >
            {isDevView ? (isAr ? "إخفاء التفاصيل ⚙️" : "Hide Developer Details ⚙️") : (isAr ? "عرض التفاصيل ⚙️" : "Show Developer Details ⚙️")}
          </button>
        </div>

        <div className={styles.messagesArea}>
          {messages.length === 0 ? (
            <div className={styles.emptyConsole}>
              <h2>👋 {isAr ? "مرحباً في لوحة التحكم التفاعلية" : "Welcome to the Interactive Console"}</h2>
              <p>{isAr ? "ابدأ المحادثة مع المساعد لمراجعة قرارات الهندسة والخبرات التقنية." : "Initiate a chat session to query candidate architectures, experience credentials, and RAG evaluation methods."}</p>
              <div className={styles.promptChips}>
                <button type="button" onClick={() => setInput(isAr ? "اشرح منهجية تقييم RAG" : "Explain RAG evaluation methodology")} className={styles.promptChip}>
                  {isAr ? "كيف تقيم دقة RAG؟" : "Explain RAG Evaluations"}
                </button>
                <button type="button" onClick={() => setInput(isAr ? "ما هي أدواتك في بيئة المطور؟" : "What is in the developer view?")} className={styles.promptChip}>
                  {isAr ? "ما هي تكنولوجيا المطورين؟" : "What is Developer View?"}
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
                    <p className={styles.msgText}>{msg.content}</p>
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

        {/* Input */}
        <form className={styles.inputForm} onSubmit={handleSubmit}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={isAr ? "اسأل المساعد هنا..." : "Type your query here..."}
            rows={1}
          />
          <button type="submit" disabled={!input.trim() || isLoading} className="btn-primary">
            {isAr ? "إرسال" : "Send"}
          </button>
        </form>
      </div>

      {/* 3. Developer Telemetry Panel */}
      {isDevView && (
        <aside className={styles.devPanel}>
          <div className={styles.panelHeader}>
            <h3>⚙️ {isAr ? "بيانات المطور والـ RAG" : "RAG Telemetry Logs"}</h3>
          </div>
          <div className={styles.panelContent}>
            <div className={styles.section}>
              <h4>{isAr ? "1. معلومات النموذج" : "1. Model Metadata"}</h4>
              <ul className={styles.metricsList}>
                <li><span>LLM Router:</span> <strong>gpt-4o-mini</strong></li>
                <li><span>Tokens:</span> <strong>{telemetry.tokens}</strong></li>
                <li><span>API Cost:</span> <strong>{telemetry.cost}</strong></li>
              </ul>
            </div>

            <div className={styles.section}>
              <h4>{isAr ? "2. سجل استرجاع المتجهات" : "2. Retrieval Chunks"}</h4>
              <div className={styles.chunkCard}>
                <span>Source: postgres.Experience & Project</span>
                <p>{isAr ? "تم استرجاع ومطابقة تفاصيل دراسات الحالة وخبرات العمل للرد على الاستفسار." : "Retrieved relevant project summaries and career credentials to form grounding context."}</p>
              </div>
            </div>

            <div className={styles.section}>
              <h4>{isAr ? "3. مقاييس دقة الاستجابة" : "3. Evaluation Gates"}</h4>
              <ul className={styles.metricsList}>
                <li><span>Groundedness:</span> <strong>{telemetry.groundedness}</strong></li>
                <li><span>Context Relevance:</span> <strong>{telemetry.relevance}</strong></li>
                <li><span>Latency:</span> <strong>{telemetry.latency}</strong></li>
              </ul>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
