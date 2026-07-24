"use client";

import { useState, useRef, useEffect } from "react";
import type { Locale } from "@/lib/i18n";
import styles from "./assistant-console.module.css";

/** Strip <think>...</think> reasoning blocks from LLM output */
function stripThinkTags(text: string): string {
  let cleaned = text.replace(/<think>[\s\S]*?<\/think>/gi, "");
  cleaned = cleaned.replace(/<think>[\s\S]*$/gi, "");
  return cleaned.trimStart();
}

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
  const [isDevView, setIsDevView] = useState(false);
  const [telemetry, setTelemetry] = useState({
    model: "—",
    latency: "0ms",
    cost: "$0.00000",
    tokens: "0 In / 0 Out",
    groundedness: "—",
    relevance: "—"
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

  const handleNewChat = () => {
    setMessages([]);
    setTelemetry({
      model: "—",
      latency: "0ms",
      cost: "$0.00000",
      tokens: "0 In / 0 Out",
      groundedness: "—",
      relevance: "—"
    });
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
                  model: data.telemetry.model || "—",
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

  return (
    <div className={`${styles.consoleWrapper} ${isDevView ? styles.withDev : ""}`}>
      {/* Main Chat Area — full width */}
      <div className={styles.chatArea}>
        <div className={styles.threadHeader}>
          <div className={styles.headerTitle}>
            <h2>🤖 {isAr ? "مساعد بشار الذكي" : "Bashar AI Assistant"}</h2>
            <span>🟢 {isAr ? "نشط" : "Online"}</span>
          </div>
          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.newChatBtn}
              onClick={handleNewChat}
              title={isAr ? "محادثة جديدة" : "New Chat"}
            >
              ✨ {isAr ? "محادثة جديدة" : "New Chat"}
            </button>
            <button
              type="button"
              className={`${styles.devToggle} ${isDevView ? styles.devActive : ""}`}
              onClick={() => setIsDevView(!isDevView)}
            >
              {isDevView ? (isAr ? "إخفاء التفاصيل ⚙️" : "Hide Details ⚙️") : (isAr ? "عرض التفاصيل ⚙️" : "Dev Details ⚙️")}
            </button>
          </div>
        </div>

        <div className={styles.messagesArea}>
          {messages.length === 0 ? (
            <div className={styles.emptyConsole}>
              <div className={styles.emptyIcon}>🤖</div>
              <h2>{isAr ? "مرحباً! أنا مساعد بشار الذكي" : "Hi! I'm Bashar's AI Assistant"}</h2>
              <p>{isAr ? "اسألني عن مشاريع بشار، خبراته التقنية، أو أي شيء يخص ملفه المهني." : "Ask me about Bashar's projects, technical experience, or anything about his professional profile."}</p>
              <div className={styles.promptChips}>
                <button type="button" onClick={() => { setInput(isAr ? "ما هي مشاريع بشار؟" : "What are Bashar's projects?"); }} className={styles.promptChip}>
                  {isAr ? "🚀 المشاريع" : "🚀 Projects"}
                </button>
                <button type="button" onClick={() => { setInput(isAr ? "أخبرني عن خبرات بشار المهنية" : "Tell me about Bashar's experience"); }} className={styles.promptChip}>
                  {isAr ? "💼 الخبرات" : "💼 Experience"}
                </button>
                <button type="button" onClick={() => { setInput(isAr ? "ما هي التقنيات التي يستخدمها بشار؟" : "What technologies does Bashar use?"); }} className={styles.promptChip}>
                  {isAr ? "🛠️ التقنيات" : "🛠️ Tech Stack"}
                </button>
                <button type="button" onClick={() => { setInput(isAr ? "كيف يمكنني التواصل مع بشار؟" : "How can I contact Bashar?"); }} className={styles.promptChip}>
                  {isAr ? "📬 التواصل" : "📬 Contact"}
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
            placeholder={isAr ? "اسأل المساعد هنا..." : "Type your question here..."}
            rows={1}
          />
          <button type="submit" disabled={!input.trim() || isLoading} className="btn-primary">
            {isAr ? "إرسال" : "Send"}
          </button>
        </form>
      </div>

      {/* Developer Telemetry Panel — real data only */}
      {isDevView && (
        <aside className={styles.devPanel}>
          <div className={styles.panelHeader}>
            <h3>⚙️ {isAr ? "بيانات المطور" : "Developer Telemetry"}</h3>
          </div>
          <div className={styles.panelContent}>
            <div className={styles.section}>
              <h4>{isAr ? "النموذج" : "Model"}</h4>
              <ul className={styles.metricsList}>
                <li><span>LLM:</span> <strong>{telemetry.model}</strong></li>
                <li><span>Tokens:</span> <strong>{telemetry.tokens}</strong></li>
                <li><span>{isAr ? "التكلفة" : "Cost"}:</span> <strong>{telemetry.cost}</strong></li>
              </ul>
            </div>

            <div className={styles.section}>
              <h4>{isAr ? "الأداء" : "Performance"}</h4>
              <ul className={styles.metricsList}>
                <li><span>Latency:</span> <strong>{telemetry.latency}</strong></li>
              </ul>
            </div>

            <div className={styles.section}>
              <h4>{isAr ? "تقييم الدقة" : "RAG Evaluation"}</h4>
              <ul className={styles.metricsList}>
                <li><span>Groundedness:</span> <strong>{telemetry.groundedness}</strong></li>
                <li><span>Context Relevance:</span> <strong>{telemetry.relevance}</strong></li>
              </ul>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
