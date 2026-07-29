"use client";

import { useState } from "react";
import { MarkdownRenderer } from "@/components/markdown-renderer";

interface ResumeCopilotDrawerProps {
  locale: string;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export function ResumeCopilotDrawer({ locale, isOpen, onClose, onOpen }: ResumeCopilotDrawerProps) {
  const isAr = locale === "ar";
  const [query, setQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const samplePrompts = isAr
    ? [
        "اشرح لي معمارية مشروع SAPA بالتفصيل",
        "لماذا اخترت FastAPI و pgvector لنظام الـ RAG؟",
        "ماهي أبرز مهارات بشار في الذكاء الاصطناعي؟",
        "اشرح لي منصة كشف الاحتيال المالي Financial Fraud",
        "هل بشار متاح للانتقال والعمل الفوري في السعودية؟",
      ]
    : [
        "Explain SAPA architecture in detail",
        "Why did you choose FastAPI & pgvector for RAG?",
        "What are Bashar's strongest AI & LLM skills?",
        "Show Financial Fraud Detection pipeline",
        "Is Bashar available for immediate relocation to Saudi Arabia?",
      ];

  const handleAskAi = async (promptText: string) => {
    const q = promptText || query;
    if (!q.trim() || isLoading) return;

    setQuery(q);
    setIsLoading(true);
    setAiResponse("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `[Context: Viewing Resume of Bashar Almuntaser] ${q}`,
          locale,
          session_id: "resume-copilot-session",
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error("Failed to connect to AI server");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.token) {
                setAiResponse((prev) => prev + data.token);
              }
            } catch (e) {
              // Ignore partial JSON parse errors
            }
          }
        }
      }
    } catch (err) {
      setAiResponse(
        isAr
          ? "تعذر الاتصال بالنماذج الحية حالياً. يرجى إعادة المحاولة."
          : "Could not connect to live LLM server right now. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* ── Auto-Hiding Glass Floating Side Pill Trigger (Hidden in Print) ──── */}
      {!isOpen && (
        <button
          type="button"
          onClick={onOpen}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="no-print"
          style={{
            position: "fixed",
            top: "50%",
            right: isAr ? "auto" : "0px",
            left: isAr ? "0px" : "auto",
            transform: "translateY(-50%)",
            zIndex: 45,
            background: "rgba(10, 25, 47, 0.75)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(100, 255, 218, 0.3)",
            borderRight: isAr ? "1px solid rgba(100, 255, 218, 0.3)" : "none",
            borderLeft: isAr ? "none" : "1px solid rgba(100, 255, 218, 0.3)",
            borderRadius: isAr ? "0 30px 30px 0" : "30px 0 0 30px",
            padding: isHovered ? "0.75rem 1.25rem" : "0.75rem 0.85rem",
            color: "hsl(var(--color-primary))",
            fontWeight: "800",
            fontSize: "0.875rem",
            cursor: "pointer",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(100,255,218,0.2)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          title={isAr ? "فتح مساعد السيرة الذاتية (Resume Copilot)" : "Open Resume Copilot"}
        >
          <span style={{ fontSize: "1.1rem" }}>✨</span>
          <span>{isHovered ? (isAr ? "مساعد السيرة الذاتية" : "Resume Copilot") : (isAr ? "المساعد" : "Copilot")}</span>
        </button>
      )}

      {/* ── Slide-over Drawer Overlay & Panel ───────────────────────────── */}
      {isOpen && (
        <div className="no-print" style={{ position: "fixed", inset: 0, zIndex: 999, display: "flex" }}>
          {/* Backdrop Blur Overlay */}
          <div
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(4, 13, 26, 0.6)",
              backdropFilter: "blur(6px)",
            }}
          />

          {/* Drawer Content Card */}
          <div
            style={{
              position: "fixed",
              top: 0,
              bottom: 0,
              right: isAr ? "auto" : 0,
              left: isAr ? 0 : "auto",
              width: "420px",
              maxWidth: "90vw",
              background: "rgba(10, 25, 47, 0.92)",
              backdropFilter: "blur(25px)",
              borderLeft: isAr ? "none" : "1px solid rgba(100, 255, 218, 0.25)",
              borderRight: isAr ? "1px solid rgba(100, 255, 218, 0.25)" : "none",
              boxShadow: "0 0 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(100, 255, 218, 0.1)",
              display: "flex",
              flexDirection: "column",
              zIndex: 1000,
              overflow: "hidden",
            }}
          >
            {/* Drawer Header */}
            <div
              style={{
                padding: "1.25rem 1.5rem",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "rgba(255, 255, 255, 0.03)",
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 800, color: "hsl(var(--color-text))", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span>✨</span> {isAr ? "مساعد السيرة الذاتية" : "Resume Copilot"}
                </h3>
                <div style={{ fontSize: "0.75rem", color: "hsl(var(--color-primary))", marginTop: "0.2rem", fontWeight: 600 }}>
                  📄 {isAr ? "سياق نشط: السيرة الذاتية لبشار المنتصر" : "Active Context: Bashar Almuntaser CV"}
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "hsl(var(--color-text))",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  fontSize: "1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✕
              </button>
            </div>

            {/* Drawer Body (Prompts & Messages) */}
            <div style={{ flex: 1, padding: "1.25rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Quick Prompt Chips */}
              <div>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "hsl(var(--color-text-muted))", marginBottom: "0.6rem" }}>
                  💡 {isAr ? "اسأل بنقرة واحدة:" : "Quick prompts:"}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {samplePrompts.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAskAi(p)}
                      style={{
                        padding: "0.5rem 0.75rem",
                        background: "rgba(255, 255, 255, 0.04)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "10px",
                        color: "hsl(var(--color-text-body))",
                        fontSize: "0.8125rem",
                        textAlign: isAr ? "right" : "left",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Streaming Output Box */}
              {(aiResponse || isLoading) && (
                <div
                  style={{
                    marginTop: "0.5rem",
                    padding: "1rem 1.15rem",
                    background: "rgba(0, 0, 0, 0.4)",
                    borderRadius: "14px",
                    border: "1px solid hsl(var(--color-primary) / 0.3)",
                    fontSize: "0.875rem",
                    lineHeight: 1.65,
                    color: "hsl(var(--color-text-body))",
                  }}
                >
                  <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "hsl(var(--color-primary))", marginBottom: "0.5rem" }}>
                    🤖 Resume Copilot
                  </div>
                  {aiResponse ? (
                    <MarkdownRenderer content={aiResponse} />
                  ) : (
                    <div style={{ color: "hsl(var(--color-text-muted))" }}>
                      {isAr ? "جاري صياغة الاستجابة..." : "Formulating response..."}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Drawer Input Footer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAskAi(query);
              }}
              style={{
                padding: "1rem 1.25rem",
                borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                display: "flex",
                gap: "0.5rem",
                background: "rgba(0, 0, 0, 0.3)",
              }}
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isAr ? "اسأل عن أي تفاصيل في السيرة..." : "Ask anything about this CV..."}
                style={{
                  flex: 1,
                  padding: "0.65rem 0.85rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "10px",
                  color: "hsl(var(--color-text))",
                  fontSize: "0.875rem",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  padding: "0 1.15rem",
                  background: "hsl(var(--color-primary))",
                  color: "#040D1A",
                  fontWeight: "800",
                  fontSize: "0.8125rem",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              >
                {isLoading ? "..." : isAr ? "إرسال" : "Ask"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
