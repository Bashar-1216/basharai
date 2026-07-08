import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import styles from "./blog-detail.module.css";
import Link from "next/link";

interface BlogPostProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostProps) {
  const { locale, slug } = await params;
  const dict = await getDictionary(locale as Locale);

  const isAr = locale === "ar";

  const post = {
    title: isAr
      ? "كيفية بناء محفظة ثنائية اللغة باستخدام pgvector و Next.js 15"
      : "How to Build a Bilingual Portfolio with pgvector and Next.js 15",
    date: "July 8, 2026",
    content: isAr
      ? [
          "تعد عملية تصميم وعاء استرجاع المتجهات دلالياً (Semantic RAG) تحدياً كبيراً عند إدخال نصوص ثنائية اللغة (Arabic RTL + English LTR). قمنا باختيار ملحق pgvector كخيار مثالي في قاعدة البيانات المحلية نظراً لقدرته على تمثيل المتجهات بأقل كمون وتوفير تكاليف استهلاك واجهات برمجة التطبيقات السحابية.",
          "تتكون معمارية النظام من ثلاث طبقات أساسية: Next.js كبوابة عرض برمجية، FastAPI كمعالج RAG خلفي، و PostgreSQL لتخزين فهارس المتجهات وحساب مسافات جيب التمام دلالياً عبر فهارس HNSW.",
          "من أهم الدروس المستفادة خلال مرحلة التطوير هو أهمية بناء خط أنابيب تقييم صارم (Regression Testing CI) لمراقبة دقة الاسترجاع ومنع الهلوسة في الوقت الفعلي."
        ]
      : [
          "Building a production-grade bilingual retrieval-augmented generation (RAG) interface poses significant formatting and semantic alignment challenges for RTL (Arabic) and LTR (English) layouts. We opted for PostgreSQL's pgvector extension as it integrates directly with our relational queries and avoids external API request latency.",
          "The system architecture centers around Next.js 15 serving as the BFF (Backend for Frontend), communicating with a FastAPI RAG worker that executes hybrid keyword + cosine similarity vector lookups over local HNSW index tables.",
          "A crucial takeaway from operating this stack is that deploying LLM applications without automated regression gates (testing Groundedness via LLM-as-a-Judge) is highly risky. Enforcing validation pipelines ensures reliable response outputs."
        ]
  };

  return (
    <>
      <Navbar dict={dict} locale={locale as Locale} />
      <main className={styles.main}>
        <div className="container">
          <Link href={`/${locale}/blog`} className={styles.backBtn}>
            ← {isAr ? "العودة للمدونة" : "Back to Blog"}
          </Link>

          <article className={styles.article}>
            <header className={styles.header}>
              <span className={styles.date}>{post.date}</span>
              <h1 className={styles.title}>{post.title}</h1>
            </header>

            <div className={styles.body}>
              {post.content.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </article>
        </div>
      </main>
      <Footer dict={dict} />
    </>
  );
}
