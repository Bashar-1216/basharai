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

  // Fetch experiences & featured projects from the DB
  const experiences = await db.experience.findMany({
    orderBy: { startDate: "desc" },
    take: 2,
  });

  const featuredProject = await db.project.findFirst({
    where: { slug: "bashar-ai" },
  });

  const isAr = locale === "ar";

  return (
    <>
      <Navbar dict={dict} locale={locale as Locale} />
      <main>
        {/* 1. Redesigned Hero */}
        <Hero dict={dict} locale={locale as Locale} />

        {/* 2. Who I Am (Human & Narrative Aspect) */}
        <section className={styles.section}>
          <div className="container">
            <h2 className={styles.sectionTitle}>{isAr ? "من أنا // الهندسة الفائقة" : "WHO I AM // PREMIUM ENGINEERING"}</h2>
            <div className={styles.whoIAmContent}>
              <p>
                {isAr
                  ? "أنا مهندس برمجيات ونظم ذكاء اصطناعي متخصص في بناء وتأمين تطبيقات نماذج اللغة الكبيرة (LLM) في بيئات الإنتاج الحقيقية. من خلال مسيرتي في أمازون وجرامرلي، اكتسبت خبرة عميقة في تصميم طبقات الاسترجاع الدلالي (RAG) وبناء بنيات معالجة متجهات فعالة من حيث التكلفة وزمن الكمون."
                  : "I am a production-focused AI systems engineer specializing in deploying and validating LLM agent structures. With engineering backgrounds at Amazon and Grammarly, I develop semantic indexing (RAG) architectures designed for low latency, tight query validation, and containerized efficiency."}
              </p>
            </div>
          </div>
        </section>

        {/* 3. Experience Preview */}
        <section className={`${styles.section} ${styles.altBg}`}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{isAr ? "الخبرة والمسيرة المهنية" : "EXPERIENCE TIMELINE"}</h2>
              <Link href={`/${locale}/experience`} className={styles.viewAll}>
                {isAr ? "عرض المسيرة كاملة ➔" : "View Full Timeline ➔"}
              </Link>
            </div>
            <div className={styles.experienceList}>
              {experiences.map((exp) => {
                const slug = exp.company.toLowerCase();
                return (
                  <div key={exp.id} className={styles.expItem}>
                    <div className={styles.expMeta}>
                      <span className={styles.expYear}>
                        {exp.startDate.getFullYear()} —{" "}
                        {exp.isCurrent
                          ? isAr
                            ? "الآن"
                            : "Present"
                          : exp.endDate?.getFullYear()}
                      </span>
                      <strong className={styles.expCompany}>{exp.company}</strong>
                    </div>
                    <div className={styles.expContent}>
                      <h4 className={styles.expTitle}>{isAr ? exp.titleAr : exp.titleEn}</h4>
                      <p className={styles.expSummary}>{isAr ? exp.summaryAr : exp.summaryEn}</p>
                      <Link href={`/${locale}/experience/${slug}`} className={styles.readCase}>
                        {isAr ? "اقرأ ورقة العمل ←" : "Read Case Study ←"}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. Featured Project */}
        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{isAr ? "دراسة حالة مميزة" : "FEATURED CASE STUDY"}</h2>
              <Link href={`/${locale}/projects`} className={styles.viewAll}>
                {isAr ? "جميع المشاريع ➔" : "All Projects ➔"}
              </Link>
            </div>
            {featuredProject && (
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
                  {isAr
                    ? "بناء منصة مقر رقمي متكاملة لمهندس ذكاء اصطناعي ثنائي اللغة مدعومة بطبقة RAG تفاعلية."
                    : "A production-grade bilingual AI engineer digital headquarters platform integrated with conversational RAG layers."}
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
                  {isAr ? "قراءة دراسة الحالة كاملة ➔" : "Read Full Case Study ➔"}
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* 5. AI Assistant Preview */}
        <section className={`${styles.section} ${styles.altBg}`}>
          <div className="container">
            <h2 className={styles.sectionTitle}>{isAr ? "المساعد الذكي التفاعلي" : "AI ASSISTANT CONSOLE"}</h2>
            <div className={styles.assistantPreview}>
              <p>
                {isAr
                  ? "اسأل المساعد الذكي للحصول على مراجع دقيقة وإجابات دلالية موثقة حول خبراتي التقنية وبنية RAG."
                  : "Query the conversational assistant to retrieve grounded citations and architectural references regarding my experience."}
              </p>
              <div className={styles.chips}>
                <AssistantTrigger isAr={isAr} />
                <Link href={`/${locale}/assistant`} className={styles.chipLink}>
                  🗖 {isAr ? "فتح الكونسول الكامل" : "Open Full Page Console"}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Latest Blog Post */}
        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{isAr ? "المقالات الهندسية" : "LATEST BLOG ARTICLE"}</h2>
              <Link href={`/${locale}/blog`} className={styles.viewAll}>
                {isAr ? "المدونة كاملة ➔" : "All Blog Posts ➔"}
              </Link>
            </div>
            <div className={styles.blogPreview}>
              <span className={styles.blogDate}>July 8, 2026</span>
              <h3 className={styles.blogTitle}>
                {isAr
                  ? "كيفية بناء محفظة ثنائية اللغة باستخدام pgvector و Next.js 15"
                  : "How to Build a Bilingual Portfolio with pgvector and Next.js 15"}
              </h3>
              <p className={styles.blogSummary}>
                {isAr
                  ? "تحليل معماري عميق لتشغيل قاعدة بيانات المتجهات كحاويات وخدمة نتائج البحث الهجين في أقل من 500 ملي ثانية."
                  : "An architectural deep dive into containerizing vector indexing databases and serving hybrid query results under 500ms."}
              </p>
              <Link href={`/${locale}/blog/portfolio-build`} className={styles.readBlogBtn}>
                {isAr ? "اقرأ المقال كاملًا ➔" : "Read Full Article ➔"}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer dict={dict} />
    </>
  );
}
