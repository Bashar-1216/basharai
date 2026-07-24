import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { db } from "@/lib/db";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import styles from "./blog-detail.module.css";
import Link from "next/link";
import { notFound } from "next/navigation";

interface BlogPostProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostProps) {
  const { locale, slug } = await params;
  const dict = await getDictionary(locale as Locale);
  const isAr = locale === "ar";

  // Try DB first
  const dbPost = await db.blogPost.findUnique({
    where: { slug },
  });

  const staticFallback: Record<string, any> = {
    "portfolio-build": {
      titleEn: "How to Build a Bilingual Portfolio with pgvector and Next.js 15",
      titleAr: "كيفية بناء محفظة ثنائية اللغة باستخدام pgvector و Next.js 15",
      publishedAt: new Date("2026-07-08"),
      contentEn: "Building a production-grade bilingual retrieval-augmented generation (RAG) interface poses significant formatting and semantic alignment challenges for RTL (Arabic) and LTR (English) layouts. We opted for PostgreSQL's pgvector extension as it integrates directly with our relational queries and avoids external API request latency.\n\nThe system architecture centers around Next.js 15 serving as the BFF (Backend for Frontend), communicating with a FastAPI RAG worker that executes hybrid keyword + cosine similarity vector lookups over local HNSW index tables.\n\nA crucial takeaway from operating this stack is that deploying LLM applications without automated regression gates (testing Groundedness via LLM-as-a-Judge) is highly risky. Enforcing validation pipelines ensures reliable response outputs.",
      contentAr: "تعد عملية تصميم وعاء استرجاع المتجهات دلالياً (Semantic RAG) تحدياً كبيراً عند إدخال نصوص ثنائية اللغة (Arabic RTL + English LTR). قمنا باختيار ملحق pgvector كخيار مثالي في قاعدة البيانات المحلية نظراً لقدرته على تمثيل المتجهات بأقل كمون وتوفير تكاليف استهلاك واجهات برمجة التطبيقات السحابية.\n\nتتكون معمارية النظام من ثلاث طبقات أساسية: Next.js كبوابة عرض برمجية، FastAPI كمعالج RAG خلفي، و PostgreSQL لتخزين فهارس المتجهات وحساب مسافات جيب التمام دلالياً عبر فهارس HNSW.\n\nمن أهم الدروس المستفادة خلال مرحلة التطوير هو أهمية بناء خط أنابيب تقييم صارم (Regression Testing CI) لمراقبة دقة الاسترجاع ومنع الهلوسة في الوقت الفعلي."
    },
    "nlp-testing": {
      titleEn: "Automating LLM Quality Evaluations inside CI/CD pipelines",
      titleAr: "أتمتة تقييم جودة النماذج اللغوية الكبيرة داخل خطوط أنابيب CI/CD",
      publishedAt: new Date("2026-07-05"),
      contentEn: "How to configure Golden Sets regression runner using LLM-as-a-Judge with high correlation scores.\n\nRunning automated LLM evaluations ensures that model prompt modifications, context retrieval updates, or system instruction changes do not introduce performance regressions or hallucinations.\n\nBy integrating Groundedness and Context Relevance metrics into continuous integration pipelines, we achieve measurable quality guarantees for production AI workflows.",
      contentAr: "طريقة إعداد مشغل اختبارات انحدار المجموعة الذهبية باستخدام LLM-as-a-Judge لضمان دقة الاستجابات.\n\nيضمن تشغيل التقييمات التلقائية لنماذج اللغة عدم حدوث تراجع في الأداء أو هلوسات عند تحديث الموجهات أو استرجاع السياق.\n\nمن خلال دمج مقاييس الترابط والصحة في خطوط أنابيب البناء المستمر، نحصل على ضمانات جودة قابلة للقياس لأنظمة الذكاء الاصطناعي الإنتاجية."
    }
  };

  const post = dbPost || staticFallback[slug];

  if (!post) {
    notFound();
  }

  const title = isAr ? post.titleAr : post.titleEn;
  const content = isAr ? post.contentAr : post.contentEn;
  const formattedDate = new Date(post.publishedAt).toLocaleDateString(
    isAr ? "ar-SA" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  const paragraphs = content.split("\n\n");

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
              <span className={styles.date}>{formattedDate}</span>
              <h1 className={styles.title}>{title}</h1>
            </header>

            <div className={styles.body}>
              {paragraphs.map((p: string, i: number) => (
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
