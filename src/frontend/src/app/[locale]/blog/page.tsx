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
  const isAr = locale === "ar";

  // Fetch real blog posts from database
  const dbPosts = await db.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  const posts = dbPosts.length > 0 ? dbPosts : [
    {
      slug: "portfolio-build",
      titleEn: "How to Build a Bilingual Portfolio with pgvector and Next.js 15",
      titleAr: "كيفية بناء محفظة ثنائية اللغة باستخدام pgvector و Next.js 15",
      contentEn: "An architectural deep dive into containerizing vector indexing databases and serving hybrid query results under 500ms.",
      contentAr: "تحليل معماري عميق لتشغيل قاعدة بيانات المتجهات كحاويات وخدمة نتائج البحث الهجين في أقل من 500 ملي ثانية.",
      publishedAt: new Date("2026-07-08"),
    },
    {
      slug: "nlp-testing",
      titleEn: "Automating LLM Quality Evaluations inside CI/CD pipelines",
      titleAr: "أتمتة تقييم جودة النماذج اللغوية الكبيرة داخل خطوط أنابيب CI/CD",
      contentEn: "How to configure Golden Sets regression runner using LLM-as-a-Judge with high correlation scores.",
      contentAr: "طريقة إعداد مشغل اختبارات انحدار المجموعة الذهبية باستخدام LLM-as-a-Judge لضمان دقة الاستجابات.",
      publishedAt: new Date("2026-07-05"),
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
                ? "مقالات تقنية تناقش أنظمة نماذج اللغة الكبيرة، هندسة RAG، وتجارب التعلم الآلي."
                : "Deep architectural articles on LLM pipelines, scaling ML operations, and vector indexing."}
            </p>
          </header>

          <div className={styles.grid}>
            {posts.map((post: any) => {
              const formattedDate = new Date(post.publishedAt).toLocaleDateString(
                isAr ? "ar-SA" : "en-US",
                { year: "numeric", month: "long", day: "numeric" }
              );

              return (
                <article key={post.slug} className={styles.card}>
                  <span className={styles.date}>{formattedDate}</span>
                  <h3 className={styles.cardTitle}>{isAr ? post.titleAr : post.titleEn}</h3>
                  <p className={styles.cardDesc}>
                    {(isAr ? post.contentAr : post.contentEn).substring(0, 160)}...
                  </p>
                  <Link href={`/${locale}/blog/${post.slug}`} className={styles.readBtn}>
                    {isAr ? "اقرأ المقال كاملًا ➔" : "Read Full Article ➔"}
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </main>
      <Footer dict={dict} />
    </>
  );
}
