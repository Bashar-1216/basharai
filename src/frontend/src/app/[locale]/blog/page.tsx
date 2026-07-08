import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { db } from "@/lib/db";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import styles from "./blog.module.css";
import Link from "next/link";

interface BlogIndexProps {
  params: Promise<{ locale: string }>;
}

export default async function BlogIndex({ params }: BlogIndexProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  const posts = await db.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  const isAr = locale === "ar";

  // If there are no posts in the DB, let's render a static list of technical articles
  const mockPosts = [
    {
      slug: "portfolio-build",
      titleEn: "How to Build a Bilingual Portfolio with pgvector and Next.js 15",
      titleAr: "كيفية بناء محفظة ثنائية اللغة باستخدام pgvector و Next.js 15",
      summaryEn: "An architectural deep dive into containerizing vector indexing databases and serving hybrid query results under 500ms.",
      summaryAr: "تحليل معماري عميق لتشغيل قاعدة بيانات المتجهات كحاويات وخدمة نتائج البحث الهجين في أقل من 500 ملي ثانية.",
      date: "July 8, 2026",
    },
    {
      slug: "nlp-testing",
      titleEn: "Automating LLM Quality Evaluations inside CI/CD pipelines",
      titleAr: "أتمتة تقييم جودة النماذج اللغوية الكبيرة داخل خطوط أنابيب CI/CD",
      summaryEn: "How to configure Golden Sets regression runner using gpt-4o-mini as a judge with 94.5% correlation score.",
      summaryAr: "طريقة إعداد مشغل اختبارات انحدار المجموعة الذهبية باستخدام gpt-4o-mini كمقيّم لضمان دقة نسبتها 94.5%.",
      date: "July 5, 2026",
    },
  ];

  return (
    <>
      <Navbar dict={dict} locale={locale as Locale} />
      <main className={styles.main}>
        <div className="container">
          <header className={styles.header}>
            <h1 className="gradient-text">
              {isAr ? "المدونة الهندسية" : "Engineering Blog"}
            </h1>
            <p className={styles.subtitle}>
              {isAr
                ? "مقالات تقنية تناقش أنظمة نماذج اللغة الكبيرة وتجارب الحوسبة السحابية."
                : "Deep architectural articles on LLM pipelines, scaling operations, and vector indexing."}
            </p>
          </header>

          <div className={styles.grid}>
            {mockPosts.map((post) => (
              <article key={post.slug} className={styles.card}>
                <span className={styles.date}>{post.date}</span>
                <h3 className={styles.cardTitle}>{isAr ? post.titleAr : post.titleEn}</h3>
                <p className={styles.cardDesc}>
                  {isAr ? post.summaryAr : post.summaryEn}
                </p>
                <Link href={`/${locale}/blog/${post.slug}`} className={styles.readBtn}>
                  {isAr ? "اقرأ المقال كاملًا ➔" : "Read Full Article ➔"}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer dict={dict} />
    </>
  );
}
