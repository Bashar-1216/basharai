"use client";

import { useState, useRef, useEffect } from "react";
import type { Locale } from "@/lib/i18n";
import styles from "./floating-chat.module.css";
import Link from "next/link";

function stripThinkTags(text: string): string {
  let cleaned = text.replace(/<think>[\s\S]*?<\/think>/gi, "");
  cleaned = cleaned.replace(/<think>[\s\S]*$/gi, "");
  return cleaned.trimStart();
}

function parseFormattedMarkdown(
  text: string,
  isAr: boolean,
  copiedId: string | null,
  onCopy: (txt: string, id: string) => void
) {
  if (!text) return null;

  const parts = text.split(/(```[a-z0-9_-]*\n[\s\S]*?```)/gi);

  return parts.map((part, idx) => {
    if (part.startsWith("```")) {
      const firstLineEnd = part.indexOf("\n");
      const langHeader = part.slice(3, firstLineEnd).trim().toLowerCase();
      const codeBody = part.slice(firstLineEnd + 1, -3).trim();
      const blockId = `block-float-${idx}`;

      if (langHeader === "mermaid") {
        return (
          <div key={idx} className={styles.diagramCard}>
            <div className={styles.diagramHeader}>
              <span>🌐 {isAr ? "المخطط الهيكلي للنظام" : "System Flow"}</span>
            </div>
            <div className={styles.diagramFlow}>{renderMermaidNodes(codeBody)}</div>
          </div>
        );
      }

      return (
        <div key={idx} className={styles.codeBlock}>
          <div className={styles.codeHeader}>
            <span>{langHeader || "code"}</span>
            <button type="button" onClick={() => onCopy(codeBody, blockId)} className={styles.copyBtn}>
              {copiedId === blockId ? (isAr ? "✓ تم" : "✓ Copied") : (isAr ? "📋 نسخ" : "📋 Copy")}
            </button>
          </div>
          <pre className={styles.codeText}>{codeBody}</pre>
        </div>
      );
    }

    return (
      <div key={idx} className={styles.markdownText}>
        {renderMarkdownParagraphs(part)}
      </div>
    );
  });
}

function renderMermaidNodes(mermaidText: string) {
  const lines = mermaidText.split("\n").filter((l) => l.includes("-->") || l.includes("---") || l.includes("->"));
  if (lines.length === 0) {
    return <pre className={styles.diagramCode}>{mermaidText}</pre>;
  }

  const cleanLabel = (str: string) => {
    const cleaned = str.trim();
    const bracketMatch = cleaned.match(/\[(.*?)\]/);
    if (bracketMatch && bracketMatch[1]) {
      return bracketMatch[1].replace(/["']/g, "").trim();
    }
    return cleaned.replace(/^[A-Z0-9_-]+\s*/i, "").replace(/["']/g, "").trim() || cleaned;
  };

  const nodes: { from: string; to: string }[] = [];
  lines.forEach((line) => {
    const parts = line.split(/-->|---|->/);
    if (parts.length >= 2) {
      const from = cleanLabel(parts[0]);
      const to = cleanLabel(parts[1]);
      if (from && to) nodes.push({ from, to });
    }
  });

  if (nodes.length === 0) {
    return <pre className={styles.diagramCode}>{mermaidText}</pre>;
  }

  return (
    <div className={styles.visualFlowNodes}>
      {nodes.map((node, idx) => (
        <div key={idx} className={styles.flowRow}>
          <div className={styles.flowNode}>{node.from}</div>
          <div className={styles.flowArrow}>➔</div>
          <div className={styles.flowNodeActive}>{node.to}</div>
        </div>
      ))}
    </div>
  );
}

function renderMarkdownParagraphs(text: string) {
  const paragraphs = text.split("\n\n");
  return paragraphs.map((para, pIdx) => {
    const lines = para.split("\n");
    return (
      <p key={pIdx} className={styles.paragraph}>
        {lines.map((line, lIdx) => {
          const parts = line.split(/(\*\*.*?\*\*)/g);
          const formattedLine = parts.map((part, bIdx) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return <strong key={bIdx}>{part.slice(2, -2)}</strong>;
            }
            return part;
          });

          return (
            <span key={lIdx}>
              {formattedLine}
              {lIdx < lines.length - 1 && <br />}
            </span>
          );
        })}
      </p>
    );
  });
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
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [userScrolled, setUserScrolled] = useState(false);

  const [telemetry, setTelemetry] = useState({
    latency: "120ms",
    cost: "$0.00000",
    tokens: "180 In / 94 Out",
    confidence: "98.5%"
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener("open-chat", handleOpenChat);
    return () => window.removeEventListener("open-chat", handleOpenChat);
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isAtBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 60;
    setUserScrolled(!isAtBottom);
  };

  useEffect(() => {
    if (isOpen && !userScrolled) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, userScrolled]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 80)}px`;
  };

  const handleCopy = (codeText: string, blockId: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedId(blockId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSubmit = async (e?: React.FormEvent, overrideQuery?: string) => {
    e?.preventDefault();
    const query = overrideQuery || input.trim();
    if (!query || isLoading) return;

    setUserScrolled(false);

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: query,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    if (!overrideQuery) setInput("");
    setIsLoading(true);

    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query, locale }),
      });

      if (!response.ok) {
        throw new Error("RAG connection failed");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No reader");

      let assistantResponse = "";
      const tempId = crypto.randomUUID();

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
                  prev.map((msg) => (msg.id === tempId ? { ...msg, content: cleaned } : msg))
                );
              } else if (data.done && data.telemetry) {
                setTelemetry({
                  latency: data.telemetry.latency || "120ms",
                  cost: "$0.00000",
                  tokens: data.telemetry.tokens || "180 total",
                  confidence: data.telemetry.groundedness || "98.5%",
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
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: locale === "ar" ? "تعذر الاتصال بالمساعد الذكي حالياً." : "Could not connect to the AI assistant at the moment.",
          timestamp: new Date(),
        },
      ]);
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

      {isOpen && (
        <div className={`${styles.popup} ${isDevView ? styles.splitPopup : ""}`}>
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
            <div className={styles.chatPane}>
              <div className={styles.messagesArea} onScroll={handleScroll}>
                {messages.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p>👋 {isAr ? "مرحباً! اسألني أي شيء عن خبرات بشار ومشاريعه." : "Hello! Ask me anything about Bashar's experience and projects."}</p>
                    <div className={styles.chips}>
                      <button type="button" onClick={() => handleSubmit(null, isAr ? "ما هي مشاريع بشار؟" : "What are Bashar's projects?")} className={styles.chip}>
                        {isAr ? "المشاريع" : "Projects"}
                      </button>
                      <button type="button" onClick={() => handleSubmit(null, isAr ? "أخبرني عن خلفية بشار المهنية" : "Tell me about Bashar's background")} className={styles.chip}>
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
                          {parseFormattedMarkdown(msg.content, isAr, copiedId, handleCopy)}
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
