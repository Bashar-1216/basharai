"use client";

import { useState } from "react";
import Link from "next/link";
import { ResumeActions } from "./resume-actions";
import styles from "./resume.module.css";
import { MarkdownRenderer } from "@/components/markdown-renderer";

interface Experience {
  id: string;
  company: string;
  titleEn: string;
  titleAr: string;
  summaryEn: string;
  summaryAr: string;
  startDate: string | Date;
  endDate?: string | Date | null;
  isCurrent: boolean;
}

interface Project {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  githubUrl?: string | null;
}

interface ResumeViewProps {
  locale: string;
  experiences: Experience[];
  projects: Project[];
}

export function ResumeView({ locale, experiences, projects }: ResumeViewProps) {
  const isAr = locale === "ar";
  const [activeView, setActiveView] = useState<"sheet" | "pdf">("sheet");

  // AI Resume Copilot State
  const [query, setQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const samplePrompts = isAr
    ? [
        "لماذا فضلت استخدام FastAPI و pgvector في مشاريعك؟",
        "اشرح لي معمارية منصة الاحتيال المالي Financial Fraud Detection.",
        "ما هو أكثر مشروع هندسي تفتخر ببنائه ولماذا؟",
        "هل أنت متاح للانتقال والعمل الفوري في المملكة العربية السعودية / الخليج؟",
      ]
    : [
        "Why did you choose FastAPI & pgvector for your RAG architectures?",
        "Explain the Financial Fraud Detection platform architecture.",
        "What is your most proud engineering accomplishment and why?",
        "Are you available for immediate relocation to Saudi Arabia / GCC?",
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
        body: JSON.stringify({ message: q, locale, session_id: "resume-page-session" }),
      });

      if (!res.ok || !res.body) {
        throw new Error("Failed to get response");
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
          ? "تعذر الاتصال بالمساعد الذكي حالياً. يرجى المحاولة مرة أخرى."
          : "Could not connect to the AI assistant right now. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.resumePage}>
      {/* ── Top Action Header (Hidden in Print) ─────────────────── */}
      <div className={`${styles.actionHeader} no-print`}>
        <div className="container">
          <div className={styles.headerWrapper}>
            <Link href={`/${locale}`} className={styles.backLink}>
              ← {isAr ? "العودة للرئيسية" : "Back to Home"}
            </Link>
            <ResumeActions
              isAr={isAr}
              activeView={activeView}
              onToggleView={setActiveView}
            />
          </div>
        </div>
      </div>

      {/* ── Main View Content (Sheet or PDF Viewer) ─────────────── */}
      {activeView === "pdf" ? (
        <div className="container no-print" style={{ margin: "2rem auto" }}>
          <div style={{ background: "hsl(var(--color-bg-card))", borderRadius: "16px", padding: "1rem", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
            <iframe
              src="/resume.pdf"
              title="Bashar Almuntaser Resume PDF"
              width="100%"
              height="800px"
              style={{ border: "none", borderRadius: "12px", background: "#ffffff" }}
            />
          </div>
        </div>
      ) : (
        <main className={`${styles.cvSheet} container`}>
          {/* ── CV Header ─────────────────────────────────────── */}
          <header className={styles.cvHeader}>
            <div className={styles.headerInfo}>
              <h1 className={styles.name}>{isAr ? "بشار المنتصر" : "Bashar Almuntaser"}</h1>
              <p className={styles.title}>
                {isAr ? "مهندس تطبيقات نماذج اللغة والتعلم الآلي (AI / LLM Engineer)" : "AI & LLM Application Engineer"}
              </p>
            </div>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <a href="mailto:almuntaserbashar@gmail.com" className={styles.contactLink}>almuntaserbashar@gmail.com</a>
              </div>

              <div className={styles.contactItem}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10z"/>
                </svg>
                <a href="https://bashar.ai" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>bashar.ai</a>
              </div>

              <div className={styles.contactItem}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 9 0 1 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span>{isAr ? "الرياض، المملكة العربية السعودية (جاهز للانتقال)" : "Riyadh, Saudi Arabia (Open to Relocation)"}</span>
              </div>
            </div>
          </header>

          {/* ── Summary ────────────────────────────────────── */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {isAr ? "الملخص المهني" : "Professional Summary"}
            </h2>
            <p className={styles.summaryText}>
              {isAr
                ? "مهندس ذكاء اصطناعي ونماذج لغة كبيرة (LLM) متخصص في بناء منصات RAG ثنائية اللغة وتطوير خطوط تقييم مؤتمتة وتأمين استدلال النماذج بفعالية تكلفة عالية وزمن استجابة منخفض."
                : "AI and LLM Application Engineer specializing in building bilingual RAG systems, developing automated evaluation pipelines, and optimizing token inference with high performance and cost containment."}
            </p>
          </section>

          {/* ── Experience ─────────────────────────────────── */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {isAr ? "الخبرة المهنية" : "Professional Experience"}
            </h2>
            <div className={styles.list}>
              {experiences.map((exp) => {
                const sDate = new Date(exp.startDate);
                const eDate = exp.endDate ? new Date(exp.endDate) : null;
                return (
                  <article key={exp.id} className={styles.item}>
                    <div className={styles.itemHeader}>
                      <h3 className={styles.itemTitle}>
                        {exp.company} — {isAr ? exp.titleAr : exp.titleEn}
                      </h3>
                      <span className={styles.period}>
                        {sDate.getFullYear()} —{" "}
                        {exp.isCurrent
                          ? isAr
                            ? "الآن"
                            : "Present"
                          : eDate?.getFullYear()}
                      </span>
                    </div>
                    <p className={styles.itemSummary}>
                      {isAr ? exp.summaryAr : exp.summaryEn}
                    </p>
                  </article>
                );
              })}
            </div>
          </section>

          {/* ── Featured Projects ──────────────────────────── */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {isAr ? "المشاريع المميزة" : "Featured Projects"}
            </h2>
            <div className={styles.list}>
              {projects.map((proj) => (
                <article key={proj.id} className={styles.item}>
                  <div className={styles.itemHeader}>
                    <h3 className={styles.itemTitle}>
                      {isAr ? proj.titleAr : proj.titleEn}
                    </h3>
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${styles.githubLink} no-print`}
                      >
                        GitHub ↗
                      </a>
                    )}
                  </div>
                  <p className={styles.itemSummary}>
                    {isAr ? proj.descriptionAr : proj.descriptionEn}
                  </p>
                </article>
              ))}
            </div>
          </section>

          {/* ── Skills & Tech ──────────────────────────────── */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {isAr ? "المهارات والتقنيات" : "Skills & Technologies"}
            </h2>
            <div className={styles.skillsGrid}>
              <div className={styles.skillCategory}>
                <strong>AI & LLMs:</strong> LangChain, LlamaIndex, pgvector, HNSW Indexing, Transformers, Prompt Engineering
              </div>
              <div className={styles.skillCategory}>
                <strong>Backend:</strong> FastAPI, Python, PostgreSQL, Redis Cache, AWS (SageMaker, Lambda)
              </div>
              <div className={styles.skillCategory}>
                <strong>Frontend:</strong> Next.js (App Router), TypeScript, React, CSS Modules
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ── Interactive Ask Bashar AI Section (Hidden in Print) ──── */}
      <section className="container no-print" style={{ margin: "3rem auto 5rem" }}>
        <div
          style={{
            background: "linear-gradient(135deg, hsl(var(--color-bg-card) / 0.9) 0%, hsl(var(--color-bg) / 0.95) 100%)",
            border: "1px solid hsl(var(--color-primary) / 0.35)",
            borderRadius: "24px",
            padding: "2rem",
            boxShadow: "0 20px 40px rgba(0,0,0,0.4), 0 0 30px 2px hsl(var(--color-primary) / 0.1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <span style={{ fontSize: "1.75rem" }}>💬</span>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800, color: "hsl(var(--color-text))" }}>
                {isAr ? "اسأل المساعد الذكي عن السيرة الذاتية" : "Ask Bashar AI about this Resume"}
              </h3>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "hsl(var(--color-text-body))" }}>
                {isAr
                  ? "استفسر فوراً عن أي تقنية، معمارية هندسية، أو تفاصيل المشاريع والخبرات المسجلة بالسيرة الذاتية."
                  : "Query technical rationale, framework decisions, project metrics, or relocation details directly."}
              </p>
            </div>
          </div>

          {/* Sample Prompts */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAskAi(p)}
                style={{
                  padding: "0.5rem 0.85rem",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "12px",
                  color: "hsl(var(--color-text))",
                  fontSize: "0.8125rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  textAlign: "left",
                }}
              >
                💡 {p}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAskAi(query);
            }}
            style={{ display: "flex", gap: "0.5rem" }}
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                isAr
                  ? "اسأل المساعد الذكي أي سؤال يتعلق بالسيرة الذاتية..."
                  : "Ask Bashar AI anything about this resume..."
              }
              style={{
                flex: 1,
                padding: "0.75rem 1rem",
                background: "rgba(0, 0, 0, 0.3)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "12px",
                color: "hsl(var(--color-text))",
                fontSize: "0.875rem",
                outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: "0 1.5rem",
                backgroundColor: "hsl(var(--color-primary))",
                color: "#040D1A",
                fontWeight: "700",
                fontSize: "0.875rem",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                transition: "opacity 0.2s ease",
              }}
            >
              {isLoading ? (isAr ? "جاري التفكير..." : "Thinking...") : isAr ? "إرسال ➔" : "Ask ➔"}
            </button>
          </form>

          {/* AI Response Output Box */}
          {(aiResponse || isLoading) && (
            <div
              style={{
                marginTop: "1.5rem",
                padding: "1.5rem 1.75rem",
                background: "rgba(4, 13, 26, 0.75)",
                borderRadius: "16px",
                border: "1px solid hsl(var(--color-primary) / 0.4)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5), 0 0 20px hsl(var(--color-primary) / 0.1)",
                fontSize: "0.9375rem",
                lineHeight: 1.7,
                color: "hsl(var(--color-text-body))",
              }}
            >
              <div style={{ fontSize: "0.8125rem", fontWeight: 800, color: "hsl(var(--color-primary))", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span>🤖</span> Bashar AI Copilot
              </div>
              {aiResponse ? (
                <MarkdownRenderer content={aiResponse} />
              ) : (
                <div style={{ color: "hsl(var(--color-text-muted))" }}>
                  {isAr ? "جاري صياغة الإجابة من قاعدة البيانات ونموذج الذكاء الاصطناعي..." : "Formulating response from database context and LLM model..."}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
