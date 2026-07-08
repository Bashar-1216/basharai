import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import styles from "./now.module.css";

interface NowPageProps {
  params: Promise<{ locale: string }>;
}

export default async function NowPage({ params }: NowPageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  const isAr = locale === "ar";

  return (
    <>
      <Navbar dict={dict} locale={locale as Locale} />
      <main className={styles.main}>
        <div className="container">
          <article className={styles.sheet}>
            <header className={styles.header}>
              <span className={styles.meta}>STATUS REPORT // ACTIVE</span>
              <h1 className={styles.title}>{isAr ? "ماذا أفعل الآن؟" : "What I'm Doing Now"}</h1>
              <p className={styles.subtitle}>
                {isAr
                  ? "صفحة مستوحاة من فكرة Derek Sivers توضح اهتماماتي ومشاريعي الحالية."
                  : "A page inspired by Derek Sivers showing my current focus, reading list, and roadmap."}
              </p>
            </header>

            <div className={styles.content}>
              {/* Building */}
              <section className={styles.section}>
                <h2>🔨 {isAr ? "أقوم ببناء:" : "Currently Building:"}</h2>
                <ul>
                  <li>
                    {isAr
                      ? "إعادة هيكلة منصة bashar.ai بالكامل إلى بنية متعددة الصفحات."
                      : "Restructuring bashar.ai platform into a robust multi-page application."}
                  </li>
                  <li>
                    {isAr
                      ? "بناء طبقة استرجاع RAG دلالية ثنائية اللغة مدعومة بـ pgvector."
                      : "Developing a bilingual semantic RAG engine utilizing PostgreSQL pgvector."}
                  </li>
                </ul>
              </section>

              {/* Learning */}
              <section className={styles.section}>
                <h2>📚 {isAr ? "أتعلم حالياً:" : "Learning:"}</h2>
                <ul>
                  <li>
                    {isAr
                      ? "طرق ضغط المتجهات وفهرستها المتقدمة (HNSW + Product Quantization)."
                      : "Advanced vector compression and indexing optimization (HNSW + PQ)."}
                  </li>
                  <li>
                    {isAr
                      ? "تقييم مخرجات نماذج اللغة الكبيرة آلياً باستخدام الرادود الركيزي (RAG Triad)."
                      : "RAG Triad automated evaluation metrics and grounding loops."}
                  </li>
                </ul>
              </section>

              {/* Reading */}
              <section className={styles.section}>
                <h2>📖 {isAr ? "أقرأ:" : "Reading:"}</h2>
                <ul>
                  <li>
                    <strong>Designing Data-Intensive Applications</strong> {isAr ? "بواسطة مارتن كليبمان." : "by Martin Kleppmann."}
                  </li>
                </ul>
              </section>

              {/* Experiments */}
              <section className={styles.section}>
                <h2>🧪 {isAr ? "تجارب تقنية:" : "Experiments:"}</h2>
                <ul>
                  <li>
                    {isAr
                      ? "قياس تكاليف التوجيه اللغوي التلقائي (Semantic Router) لتوفير استهلاك الرموز."
                      : "Benchmarking semantic routing models to contain prompt token overhead."}
                  </li>
                </ul>
              </section>

              {/* Roadmap */}
              <section className={styles.section}>
                <h2>🗺️ {isAr ? "خارطة الطريق:" : "Roadmap:"}</h2>
                <ul>
                  <li>
                    {isAr
                      ? "إضافة لوحة تفصيلية لتقييمات الاستجابة الفورية ثنائية اللغة."
                      : "Adding dynamic bilingual latency/cost tracer charts."}
                  </li>
                </ul>
              </section>

              {/* Last Updated */}
              <footer className={styles.footer}>
                <p>
                  {isAr ? "آخر تحديث:" : "Last Updated:"} <strong>July 8, 2026</strong>
                </p>
              </footer>
            </div>
          </article>
        </div>
      </main>
      <Footer dict={dict} />
    </>
  );
}
