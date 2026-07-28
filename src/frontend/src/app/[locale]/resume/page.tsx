import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { db } from "@/lib/db";
import styles from "./resume.module.css";
import Link from "next/link";
import { ResumeActions } from "./resume-actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ResumePageProps {
  params: Promise<{ locale: string }>;
}

export default async function ResumePage({ params }: ResumePageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  // Fetch experiences and projects from the database with safe fallback
  let experiences: any[] = [];
  let projects: any[] = [];
  try {
    experiences = await db.experience.findMany({
      orderBy: { startDate: "desc" },
    });
    projects = await db.project.findMany({
      where: { featured: true },
      orderBy: { publishedAt: "desc" },
    });
  } catch (err) {
    console.warn("Resume page DB fetch fallback:", err);
  }

  const isAr = locale === "ar";

  return (
    <div className={styles.resumePage}>
      {/* ── Action Header (Hidden in Print) ──────────────── */}
      <div className={`${styles.actionHeader} no-print`}>
        <div className="container">
          <div className={styles.headerWrapper}>
            <Link href={`/${locale}`} className={styles.backLink}>
              ← {isAr ? "العودة للرئيسية" : "Back to Home"}
            </Link>
            <ResumeActions isAr={isAr} />
          </div>
        </div>
      </div>

      {/* ── Printable CV Sheet ───────────────────────────── */}
      <main className={`${styles.cvSheet} container`}>
        {/* ── Header ─────────────────────────────────────── */}
        <header className={styles.cvHeader}>
          <div className={styles.headerInfo}>
            <h1 className={styles.name}>{isAr ? "بشار" : "Bashar"}</h1>
            <p className={styles.title}>
              {isAr ? "مهندس تطبيقات نماذج اللغة (LLM)" : "LLM Application Engineer"}
            </p>
          </div>
          <div className={styles.contactInfo}>
            <p>📧 owner@bashar.ai</p>
            <p>🌐 bashar.ai</p>
            <p>📍 {isAr ? "الرياض، المملكة العربية السعودية" : "Riyadh, Saudi Arabia"}</p>
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
            {experiences.map((exp) => (
              <article key={exp.id} className={styles.item}>
                <div className={styles.itemHeader}>
                  <h3 className={styles.itemTitle}>
                    {exp.company} — {isAr ? exp.titleAr : exp.titleEn}
                  </h3>
                  <span className={styles.period}>
                    {exp.startDate.getFullYear()} —{" "}
                    {exp.isCurrent
                      ? isAr
                        ? "الآن"
                        : "Present"
                      : exp.endDate?.getFullYear()}
                  </span>
                </div>
                <p className={styles.itemSummary}>
                  {isAr ? exp.summaryAr : exp.summaryEn}
                </p>
              </article>
            ))}
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
    </div>
  );
}
