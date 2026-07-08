import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { db } from "@/lib/db";
import styles from "./experience-detail.module.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ExperienceDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

interface DetailSection {
  overview: string;
  problem: string;
  role: string;
  challenges: string;
  impact: string;
  technologies: string;
  learned: string;
  faq: { q: string; a: string }[];
}

const detailsEn: Record<string, DetailSection> = {
  amazon: {
    overview: "Led the development of production-grade bilingual conversational search (RAG) and retrieval infrastructure within highly secure corporate cloud frameworks.",
    problem: "Retrieving relevant data across millions of unstructured files with high security guardrails and low latency requirements.",
    role: "AI & Retrieval Engineer, leading prompt templates testing, HNSW indexes setup, and semantic caching layers integration.",
    challenges: "Handling complex Arabic RTL + English LTR layout differences in document chunk parsing and resolving vector model bias during retrieval.",
    impact: "Boosted query Groundedness score to 97.8%, while lowering typical end-to-end response latency to 480ms.",
    technologies: "AWS SageMaker, DynamoDB, pgvector, FastAPI, Python, Redis Cache.",
    learned: "System evaluations and regressions testing are the true pillars of operating AI products in production.",
    faq: [
      { q: "How did you scale the vector databases?", a: "We optimized pgvector HNSW indexing using specific m and ef_construction parameters for cosine distance search." },
      { q: "Did you use open-source embeddings?", a: "Yes, we deployed custom multi-lingual sentence-transformers models on AWS SageMaker endpoints." }
    ]
  },
  grammarly: {
    overview: "Built automated pipeline checks and optimized machine learning inference engines to serve stylistic suggestion models.",
    problem: "Processing millions of writing events daily, maintaining real-time latency limits, and keeping model serving costs low.",
    role: "ML Platform SDE, optimizing PyTorch checkpoints and prompt routing algorithms.",
    challenges: "Minimizing token costs when validating grammatical suggestion models against large golden evaluation sets.",
    impact: "Served 10M+ daily active users while reducing operational API hosting costs by 25%.",
    technologies: "PyTorch, Transformers, GCP, Kubernetes, FastAPI, Python.",
    learned: "Prompt caching and semantic deduplication are vital to containing LLM expenses.",
    faq: [
      { q: "What was the throughput of suggestion models?", a: "We processed up to 5,000 requests per second at peak times using optimized Kubernetes autoscaling." },
      { q: "How was accuracy verified?", a: "Through automated daily Golden Set evaluations comparing suggestions against human editors." }
    ]
  }
};

const detailsAr: Record<string, DetailSection> = {
  amazon: {
    overview: "قيادة تطوير محركات البحث التفاعلي ثنائي اللغة (RAG) وبنية استرجاع المتجهات ضمن بيئات حوسبة سحابية مؤمنة.",
    problem: "استرجاع البيانات الدقيقة من بين ملايين الملفات غير المنظمة بضمان السرية التامة والاستجابة السريعة.",
    role: "مهندس أنظمة استرجاع وذكاء اصطناعي، مسؤول عن صياغة القوالب وتهيئة فهارس HNSW وتفعيل طبقات التخزين المؤقت.",
    challenges: "التعامل مع النصوص العربية والإنجليزية المعقدة وتفادي الهلوسة وانحياز النماذج المتجهية أثناء البحث.",
    impact: "رفع دقة التأريض للردود إلى 97.8% وتقليص زمن الاستجابة إلى 480 ملي ثانية كمتوسط.",
    technologies: "AWS SageMaker, DynamoDB, pgvector, FastAPI, Python, Redis Cache.",
    learned: "أنظمة التقييم الدوري واختبارات الانحدار هي الضامن الوحيد لجودة منتجات الذكاء الاصطناعي التشغيلية.",
    faq: [
      { q: "كيف تم توسيع قاعدة البيانات المتجهية؟", a: "قمنا بتهيئة فهارس HNSW الخاصة بملحق pgvector باستخدام معايير m و ef_construction متوافقة مع حساب مسافة جيب التمام." },
      { q: "هل استخدمتم نماذج تضمين مفتوحة المصدر؟", a: "نعم، قمنا باستضافة نماذج مخصصة ثنائية اللغة لتمثيل الجمل دلالياً على خوادم AWS SageMaker." }
    ]
  },
  grammarly: {
    overview: "بناء خطوط فحص مؤتمتة وتحسين محركات الاستدلال لخدمة نماذج الاقتراحات اللغوية والنحوية في الوقت الفعلي.",
    problem: "معالجة ملايين النصوص يومياً مع الحفاظ على سرعة الاستجابة اللحظية وخفض تكاليف الاستضافة التشغيلية.",
    role: "مهندس منصات تعلم آلي، مسؤول عن تحسين أداء نماذج PyTorch وجدولة الموجهات اللغوية.",
    challenges: "تقليل استهلاك الرموز (Tokens) عند تقييم اقتراحات النماذج مقابل ملفات الاختبارات الذهبية الضخمة.",
    impact: "خدمة أكثر من 10 ملايين مستخدم نشط يومياً مع تقليص تكاليف واجهات برمجة التطبيقات بنسبة 25%.",
    technologies: "PyTorch, Transformers, GCP, Kubernetes, FastAPI, Python.",
    learned: "التخزين المؤقت الدلالي وإزالة الموجهات المتكررة أمر بالغ الأهمية لخفض فواتير الـ LLM.",
    faq: [
      { q: "ما هو معدل الطلبات لنماذج الاقتراحات؟", a: "عالجنا ما يصل إلى 5000 طلب في الثانية في أوقات الذروة باستخدام خطط القياس التلقائي لـ Kubernetes." },
      { q: "كيف تم التحقق من دقة الاقتراحات؟", a: "عبر تشغيل تقييمات يومية مؤتمتة تقارن ردود النماذج مقابل تصحيحات المحررين البشر." }
    ]
  }
};

export default async function ExperienceDetailPage({ params }: ExperienceDetailPageProps) {
  const { locale, slug } = await params;
  const dict = await getDictionary(locale as Locale);

  const experience = await db.experience.findFirst({
    where: {
      company: {
        equals: slug,
        mode: "insensitive"
      }
    }
  });

  if (!experience) {
    notFound();
  }

  const isAr = locale === "ar";
  const detail = isAr ? detailsAr[slug.toLowerCase()] : detailsEn[slug.toLowerCase()];

  if (!detail) {
    notFound();
  }

  return (
    <>
      <Navbar dict={dict} locale={locale as Locale} />
      <main className={styles.main}>
        <div className="container">
          <Link href={`/${locale}/experience`} className={styles.backBtn}>
            ← {isAr ? "العودة للخبرات" : "Back to Experience"}
          </Link>

          <header className={styles.header}>
            <span className={styles.company}>{experience.company}</span>
            <h1 className={styles.title}>{isAr ? experience.titleAr : experience.titleEn}</h1>
            <span className={styles.period}>
              {experience.startDate.getFullYear()} —{" "}
              {experience.isCurrent ? (isAr ? "الآن" : "Present") : experience.endDate?.getFullYear()}
            </span>
          </header>

          <div className={styles.contentGrid}>
            {/* Left: Deep Dive Sections */}
            <div className={styles.deepDive}>
              <section className={styles.section}>
                <h2>{isAr ? "1. نظرة عامة" : "1. Overview"}</h2>
                <p>{detail.overview}</p>
              </section>

              <section className={styles.section}>
                <h2>{isAr ? "2. طبيعة المشكلة" : "2. Problem Domain"}</h2>
                <p>{detail.problem}</p>
              </section>

              <section className={styles.section}>
                <h2>{isAr ? "3. دوري ومسؤولياتي" : "3. My Role"}</h2>
                <p>{detail.role}</p>
              </section>

              <section className={styles.section}>
                <h2>{isAr ? "4. التحديات التقنية" : "4. Technical Challenges"}</h2>
                <p>{detail.challenges}</p>
              </section>

              <section className={styles.section}>
                <h2>{isAr ? "5. الأثر المحقق" : "5. Impact & Metrics"}</h2>
                <p className={styles.impactHighlight}>{detail.impact}</p>
              </section>

              <section className={styles.section}>
                <h2>{isAr ? "6. التقنيات المستخدمة" : "6. Technologies"}</h2>
                <div className={styles.badgeList}>
                  {detail.technologies.split(", ").map((t) => (
                    <span key={t} className={styles.badge}>{t}</span>
                  ))}
                </div>
              </section>

              <section className={styles.section}>
                <h2>{isAr ? "7. ماذا تعلمت؟" : "7. What I Learned"}</h2>
                <p>{detail.learned}</p>
              </section>
            </div>

            {/* Right: FAQs */}
            <aside className={styles.sidebar}>
              <div className={styles.sidebarCard}>
                <h3>{isAr ? "الأسئلة الشائعة" : "Technical FAQ"}</h3>
                <div className={styles.faqList}>
                  {detail.faq.map((item, index) => (
                    <div key={index} className={styles.faqItem}>
                      <strong>Q: {item.q}</strong>
                      <p>A: {item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer dict={dict} />
    </>
  );
}
