import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { db } from "@/lib/db";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Footer } from "@/components/footer";
import { AssistantTrigger } from "@/components/assistant-trigger";
import Link from "next/link";
import styles from "./home.module.css";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  // Fetch top 3 projects from DB
  const projects = await db.project.findMany({
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  // Fetch top 2 experiences from DB
  const experiences = await db.experience.findMany({
    orderBy: { startDate: "desc" },
    take: 2,
  });

  // Fetch latest blog post from DB
  const latestPost = await db.blogPost.findFirst({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  // Fetch cached GitHub stats from DB
  const githubStats = await db.githubRepository.findMany();

  const getRepoStats = (githubUrl: string | null) => {
    if (!githubUrl) return null;
    const path = githubUrl.replace("https://github.com/", "").replace("http://github.com/", "").trim();
    return githubStats.find((r) => r.repoName.toLowerCase() === path.toLowerCase());
  };

  const isAr = locale === "ar";

  return (
    <>
      <Navbar dict={dict} locale={locale as Locale} />
      <main>
        {/* 1. Minimized Hero with Hologram Portrait */}
        <Hero dict={dict} locale={locale as Locale} />

        {/* 2. Featured Projects Preview */}
        {projects.length > 0 && (
          <section className={styles.section}>
            {/* Ambient background glows */}
            <div className={styles.goldGlow} />
            <div className={styles.blueGlow} />

            <div className="container" style={{ position: "relative", zIndex: 2 }}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{dict.sections.featured_projects}</h2>
                <Link href={`/${locale}/projects`} className={styles.viewAll}>
                  {dict.sections.view_all_projects} ➔
                </Link>
              </div>
              <div className={styles.projectsGrid}>
                {projects.map((project) => {
                  const stats = getRepoStats(project.githubUrl);
                  return (
                    <div key={project.id} className={styles.projectCard}>
                      <div className={styles.projectHeader}>
                        <span className={styles.projectTag}>AI // ML ENGINE</span>
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.githubLink}>
                            GitHub ↗
                          </a>
                        )}
                      </div>
                      <h3 className={styles.projectTitle}>{isAr ? project.titleAr : project.titleEn}</h3>
                      <p className={styles.projectDesc}>
                        {isAr ? project.descriptionAr : project.descriptionEn}
                      </p>
                      
                      {/* GitHub stats row */}
                      {stats && (
                        <div className={styles.projectStatsRow}>
                          <span className={styles.statBadge}>⭐ {stats.stars}</span>
                          <span className={styles.statBadge}>🍴 {stats.forks}</span>
                          <span className={styles.langBadge}>
                            <span className={styles.langDot} />
                            {stats.language}
                          </span>
                        </div>
                      )}
                      
                      <Link href={`/${locale}/projects/${project.slug}`} className={styles.readCase}>
                        {dict.sections.read_case_study} ➔
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* 3. Experience Preview */}
        {experiences.length > 0 && (
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
        )}

        {/* 4. Latest Blog Article Preview */}
        {latestPost ? (
          <section className={styles.section}>
            <div className={styles.goldGlow} />
            <div className="container" style={{ position: "relative", zIndex: 2 }}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{dict.sections.latest_articles}</h2>
                <Link href={`/${locale}/blog`} className={styles.viewAll}>
                  {dict.sections.read_all} ➔
                </Link>
              </div>
              <div className={styles.blogTeaser}>
                <span className={styles.blogDate}>
                  {latestPost.publishedAt.toLocaleDateString(locale, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <h3 className={styles.blogTitle}>
                  {isAr ? latestPost.titleAr : latestPost.titleEn}
                </h3>
                <p className={styles.blogSummary}>
                  {isAr ? latestPost.contentAr.slice(0, 160) + "..." : latestPost.contentEn.slice(0, 160) + "..."}
                </p>
                <Link href={`/${locale}/blog`} className={styles.readBlogBtn}>
                  {dict.sections.read_all} ➔
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <section className={styles.section}>
            <div className={styles.goldGlow} />
            <div className="container" style={{ position: "relative", zIndex: 2 }}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{dict.sections.latest_articles}</h2>
                <Link href={`/${locale}/blog`} className={styles.viewAll}>
                  {dict.sections.read_all} ➔
                </Link>
              </div>
              <div className={styles.blogTeaser}>
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
        )}

        {/* 5. Clean AI Assistant Trigger Section */}
        <section className={`${styles.section} ${styles.altBg}`}>
          <div className={styles.blueGlow} />
          <div className="container" style={{ position: "relative", zIndex: 2 }}>
            <div className={styles.assistantPreview}>
              <h2 className={styles.sectionTitle}>{dict.sections.ai_assistant}</h2>
              <p className={styles.assistantDesc}>{dict.sections.assistant_desc}</p>
              <div className={styles.chips}>
                <AssistantTrigger isAr={isAr} />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer dict={dict} />
    </>
  );
}
