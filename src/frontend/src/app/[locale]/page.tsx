import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { db } from "@/lib/db";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Footer } from "@/components/footer";
import StatsBar from "@/components/stats-bar";
import CurrentStatus from "@/components/current-status";
import { AssistantTrigger } from "@/components/assistant-trigger";
import Link from "next/link";
import styles from "./home.module.css";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  // Fetch stats counts from DB dynamically
  const projectCount = await db.project.count();
  const experienceCount = await db.experience.count();
  const articleCount = await db.blogPost.count() || 18; // Fallback to 18 target articles if 0

  // Fetch experiences & featured projects from the DB
  const experiences = await db.experience.findMany({
    orderBy: { startDate: "desc" },
    take: 2,
  });

  const featuredProject = await db.project.findFirst({
    where: { slug: "geo-platform" },
  }) || await db.project.findFirst();

  const isAr = locale === "ar";

  return (
    <>
      <Navbar dict={dict} locale={locale as Locale} />
      <main>
        {/* 1. Redesigned Hero */}
        <Hero dict={dict} locale={locale as Locale} />

        {/* 2. Dynamic Stats Bar (NEW) */}
        <StatsBar
          dict={dict}
          locale={locale}
          projectCount={projectCount}
          experienceCount={experienceCount}
          articleCount={articleCount}
        />

        {/* 3. Current Status Section (NEW) */}
        <CurrentStatus dict={dict} />

        {/* 4. Featured Case Study Preview */}
        {featuredProject && (
          <section className={styles.section}>
            <div className="container">
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{dict.sections.featured_projects}</h2>
                <Link href={`/${locale}/projects`} className={styles.viewAll}>
                  {dict.sections.view_all_projects} ➔
                </Link>
              </div>
              <div className={styles.featuredCard}>
                <div className={styles.featuredHeader}>
                  <span className={styles.tag}>RAG // LLM ENGINE</span>
                  {featuredProject.githubUrl && (
                    <a href={featuredProject.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.githubLink}>
                      GitHub ↗
                    </a>
                  )}
                </div>
                <h3 className={styles.featuredTitle}>{isAr ? featuredProject.titleAr : featuredProject.titleEn}</h3>
                <p className={styles.featuredDesc}>
                  {isAr ? featuredProject.descriptionAr : featuredProject.descriptionEn}
                </p>
                <div className={styles.metricsRow}>
                  <div className={styles.metric}>
                    <span>Groundedness</span>
                    <strong>97.8% 🟢</strong>
                  </div>
                  <div className={styles.metric}>
                    <span>Avg Latency</span>
                    <strong>480ms</strong>
                  </div>
                </div>
                <Link href={`/${locale}/projects/${featuredProject.slug}`} className={styles.readCaseFull}>
                  {dict.sections.read_case_study} ➔
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* 5. Experience Timeline Preview */}
        <section className={`${styles.section} ${styles.altBg}`}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{dict.sections.experience_timeline}</h2>
              <Link href={`/${locale}/experience`} className={styles.viewAll}>
                {dict.sections.view_full_timeline} ➔
              </Link>
            </div>
            <div className={styles.experienceList}>
              {experiences.map((exp) => (
                <div key={exp.id} className={styles.expItem}>
                  <div className={styles.expMeta}>
                    <span className={styles.expYear}>
                      {exp.startDate.getFullYear()} —{" "}
                      {exp.isCurrent
                        ? dict.experience.present
                        : exp.endDate?.getFullYear()}
                    </span>
                    <strong className={styles.expCompany}>{exp.company}</strong>
                  </div>
                  <div className={styles.expContent}>
                    <h4 className={styles.expTitle}>{isAr ? exp.titleAr : exp.titleEn}</h4>
                    <p className={styles.expSummary}>{isAr ? exp.summaryAr : exp.summaryEn}</p>
                    <Link href={`/${locale}/experience`} className={styles.readCase}>
                      {dict.sections.read_case_study} ←
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Live Dashboard Preview (NEW) */}
        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{dict.sections.live_dashboard}</h2>
              <Link href={`/${locale}/dashboard`} className={styles.viewAll}>
                {dict.sections.open_dashboard} ➔
              </Link>
            </div>
            <div className={styles.featuredCard}>
              <div className={styles.featuredHeader}>
                <span className={styles.tag}>OBSERVABILITY // TELEMETRY</span>
                <span className={styles.githubLink}>Live 🟢</span>
              </div>
              <h3 className={styles.featuredTitle}>{dict.sections.live_dashboard}</h3>
              <p className={styles.featuredDesc}>
                {dict.sections.dashboard_desc}
              </p>
              <div className={styles.metricsRow}>
                <div className={styles.metric}>
                  <span>System Health</span>
                  <strong>98.2% 🟢</strong>
                </div>
                <div className={styles.metric}>
                  <span>RAG Accuracy</span>
                  <strong>95.4%</strong>
                </div>
                <div className={styles.metric}>
                  <span>Total Queries</span>
                  <strong>1,248</strong>
                </div>
              </div>
              <Link href={`/${locale}/dashboard`} className={styles.readCaseFull}>
                {dict.sections.open_dashboard} ➔
              </Link>
            </div>
          </div>
        </section>

        {/* 7. AI Assistant Preview */}
        <section className={`${styles.section} ${styles.altBg}`}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{dict.sections.ai_assistant}</h2>
              <Link href={`/${locale}/assistant`} className={styles.viewAll}>
                {dict.sections.open_console} ➔
              </Link>
            </div>
            <div className={styles.assistantPreview}>
              <p>{dict.sections.assistant_desc}</p>
              <div className={styles.chips}>
                <AssistantTrigger isAr={isAr} />
                <Link href={`/${locale}/assistant`} className={styles.chipLink}>
                  🗖 {dict.sections.open_console}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Latest Blog Articles Preview */}
        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{dict.sections.latest_articles}</h2>
              <Link href={`/${locale}/blog`} className={styles.viewAll}>
                {dict.sections.read_all} ➔
              </Link>
            </div>
            <div className={styles.blogPreview}>
              <span className={styles.blogDate}>July 12, 2026</span>
              <h3 className={styles.blogTitle}>
                {isAr
                  ? "بناء منصات الـ AI ثنائية اللغة المتكاملة مع النظم المحلية"
                  : "Building Production-Ready Bilingual AI Agents for Enterprise Scale"}
              </h3>
              <p className={styles.blogSummary}>
                {isAr
                  ? "نظرة متعمقة في كيفية تصميم خطوط استرجاع دلالية (RAG) تدعم العربية والإنجليزية بالتوازي وبسرعات قياسية."
                  : "An architectural review of serving hybrid bilingual embeddings, scaling vector lookups, and monitoring RAG telemetry under strict latency constraints."}
              </p>
              <Link href={`/${locale}/blog`} className={styles.readBlogBtn}>
                {dict.sections.read_all} ➔
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer dict={dict} />
    </>
  );
}
