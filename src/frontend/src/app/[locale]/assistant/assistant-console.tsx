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

    setTimeout(() => {
      const mockResponse =
        locale === "ar"
          ? "أهلاً بك في الكونسول البرمجي! تم بناء نظام الـ Reranking الهجين وبوابات الفلترة بنجاح، وربط قاعدة البيانات pgvector جاهز للاستخدام. اسألني عن دراسات الحالة للمشاريع للاطلاع على الكود المصدري وقرارات التصميم."
          : "Welcome to the engineer console! The hybrid reranking pipelines and validation gateways are online. Database connectors are ready for search operations. Ask me about project case studies for code references and architectural decisions.";

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: mockResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsLoading(false);
    }, 1000);
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
                <li><span>Tokens:</span> <strong>480 In / 120 Out</strong></li>
                <li><span>API Cost:</span> <strong>$0.003</strong></li>
              </ul>
            </div>

            <div className={styles.section}>
              <h4>{isAr ? "2. سجل استرجاع المتجهات" : "2. Retrieval Chunks"}</h4>
              <div className={styles.chunkCard}>
                <span>Source: docs/projects/basharai.md</span>
                <p>...bashar.ai Platform Engine is a bilingual AI engineering portfolio with RAG-powered assistant. Groundedness evaluations scored 97.8%...</p>
              </div>
            </div>

            <div className={styles.section}>
              <h4>{isAr ? "3. مقاييس دقة الاستجابة" : "3. Evaluation Gates"}</h4>
              <ul className={styles.metricsList}>
                <li><span>Groundedness:</span> <strong>97.8% 🟢</strong></li>
                <li><span>Context Relevance:</span> <strong>95.4% 🟢</strong></li>
                <li><span>Latency:</span> <strong>480ms</strong></li>
              </ul>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
