"use client";

import { useState } from "react";
import Link from "next/link";
import { ResumeActions } from "./resume-actions";
import { ResumeCopilotDrawer } from "./resume-copilot-drawer";
import styles from "./resume.module.css";

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
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

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
              onToggleCopilot={() => setIsCopilotOpen(!isCopilotOpen)}
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
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                </svg>
                <a href="https://github.com/Bashar-1216" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>github.com/Bashar-1216</a>
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

      {/* ── Non-intrusive Resume Copilot Slide-over Drawer ───────── */}
      <ResumeCopilotDrawer
        locale={locale}
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        onOpen={() => setIsCopilotOpen(true)}
      />
    </div>
  );
}
