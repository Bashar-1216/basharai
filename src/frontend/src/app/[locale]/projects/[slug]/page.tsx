import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { db } from "@/lib/db";
import styles from "./project-detail.module.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ProjectDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

interface CaseStudySection {
  overview: string;
  problem: string;
  architecture: string;
  tradeoffs: string;
  evaluation: string;
  metrics: { label: string; val: string }[];
  lessons: string;
  knowledgeGraph: {
    experience: { title: string; url: string };
    dashboard: { title: string; url: string };
    blog: { title: string; url: string };
  };
}

const studiesEn: Record<string, CaseStudySection> = {
  "bashar-ai": {
    overview: "Building a production-grade bilingual AI engineer digital headquarters platform integrated with conversational RAG layers.",
    problem: "Generic static resumes do not prove engineering skills. Technical hiring managers need immediate interactive proof of LLM architecture capability.",
    architecture: "Next.js 15 (BFF) ➔ FastAPI Backend ➔ PostgreSQL (pgvector HNSW distance checks) ➔ Redis memory cache.",
    tradeoffs: "Chose PostgreSQL pgvector over Pinecone to run the entire backend containerized locally, avoiding API billing limits and reducing startup latency by 40%.",
    evaluation: "Run automated RAG triad validations measuring groundedness and context relevance over a golden set of 25 question-answer pairs.",
    metrics: [
      { label: "Groundedness", val: "97.8% 🟢" },
      { label: "Avg Latency", val: "480ms" },
      { label: "Cost/Query", val: "$0.004" }
    ],
    lessons: "Strict validation pipelines ensure high-quality outputs even with smaller quantized open-source models.",
    knowledgeGraph: {
      experience: { title: "Amazon (LLM Platforms)", url: "/experience/amazon" },
      dashboard: { title: "Telemetry Dashboard", url: "/dashboard" },
      blog: { title: "How I built this portfolio", url: "/blog/portfolio-build" }
    }
  },
  "eval-framework": {
    overview: "Developing a CI/CD-linked automated regression testing framework comparing LLM suggestion outputs.",
    problem: "Validating model parameters changes manually across thousands of files is slow and subjective.",
    architecture: "Python TestRunner ➔ Langfuse Observability ➔ RAG Triad Metrics ➔ GitHub Actions CI pipeline.",
    tradeoffs: "Opted for Gpt-4o-mini as a judge instead of building a fine-tuned local Llama evaluator to optimize validation speed and maintain 94.5% correlation with human ratings.",
    evaluation: "Golden set regression test runs measuring grammar accuracy and formatting drift across suggestion commits.",
    metrics: [
      { label: "Correlation", val: "94.5% 🟢" },
      { label: "Run Time", val: "1m 15s" },
      { label: "Test Cost", val: "$0.12/run" }
    ],
    lessons: "Evaluating LLMs in CI/CD pipelines dramatically increases deployment velocity for NLP models.",
    knowledgeGraph: {
      experience: { title: "Grammarly (NLP Systems)", url: "/experience/grammarly" },
      dashboard: { title: "Observability Metrics", url: "/dashboard" },
      blog: { title: "Testing NLP APIs in CI", url: "/blog/nlp-testing" }
    }
  }
};

const studiesAr: Record<string, CaseStudySection> = {
  "bashar-ai": {
    overview: "بناء منصة مقر رقمي متكاملة لمهندس ذكاء اصطناعي ثنائي اللغة مدعومة بطبقة RAG تفاعلية.",
    problem: "السير الذاتية التقليدية لا تثبت المهارات الهندسية. يحتاج مديرو التوظيف التقنيون إلى دليل تفاعلي فوري لمهارات تصميم الـ LLM.",
    architecture: "Next.js 15 (BFF) ➔ FastAPI Backend ➔ PostgreSQL (أقرب جار عبر pgvector HNSW) ➔ Redis التخزين المؤقت.",
    tradeoffs: "استخدام pgvector في قاعدة بيانات محلية بدلاً من Pinecone لتشغيل النظام كاملاً كحاويات مدمجة، متفادين فواتير واجهات الاستعلام وخافضين زمن الاستجابة بنسبة 40%.",
    evaluation: "تشغيل اختبارات تقييم ثلاثية RAG تلقائية لقياس دقة الاستناد وملاءمة السياق على مجموعة ذهبية تتكون من 25 زوجاً من الأسئلة والأجوبة.",
    metrics: [
      { label: "دقة الاستناد", val: "97.8% 🟢" },
      { label: "زمن الكمون", val: "480 ملي ثانية" },
      { label: "تكلفة الطلب", val: "$0.004" }
    ],
    lessons: "خطوط الأنابيب الصارمة لتقييم النماذج تضمن جودة المخرجات حتى عند استخدام نماذج صغيرة ومكممة مفتوحة المصدر.",
    knowledgeGraph: {
      experience: { title: "أمازون (منصات LLM)", url: "/experience/amazon" },
      dashboard: { title: "لوحة تحليلات المراقبة", url: "/dashboard" },
      blog: { title: "كيف بنيت هذه المحفظة؟", url: "/blog/portfolio-build" }
    }
  },
  "eval-framework": {
    overview: "تطوير إطار عمل اختبار انحدار تلقائي مرتبط بـ CI/CD لمقارنة اقتراحات النماذج وتقييم جودتها لغوياً.",
    problem: "التحقق اليدوي من تأثير تغيير معايير النماذج اللغوية على آلاف الملفات أمر بطيء ومبني على التقدير الشخصي.",
    architecture: "Python TestRunner ➔ Langfuse Observability ➔ RAG Triad Metrics ➔ GitHub Actions CI pipeline.",
    tradeoffs: "استخدام Gpt-4o-mini كمقيّم بدلاً من بناء نموذج Llama محلي لزيادة سرعة الاختبار والحفاظ على ارتباط بنسبة 94.5% مع تصنيفات المحررين البشر.",
    evaluation: "تشغيل اختبارات انحدار المجموعة الذهبية لقياس دقة القواعد النحوية والأسلوبية عبر تحديثات الأكواد.",
    metrics: [
      { label: "نسبة الارتباط", val: "94.5% 🟢" },
      { label: "وقت التشغيل", val: "دقيقة و 15 ثانية" },
      { label: "تكلفة الفحص", val: "$0.12/دورة" }
    ],
    lessons: "تقييم النماذج اللغوية داخل سير عمل CI/CD يسرع وتيرة النشر البرمجي لنماذج الـ NLP بشكل ملحوظ.",
    knowledgeGraph: {
      experience: { title: "جرامرلي (أنظمة NLP)", url: "/experience/grammarly" },
      dashboard: { title: "لوحة تحليلات المراقبة", url: "/dashboard" },
      blog: { title: "اختبار الـ NLP في سير العمل", url: "/blog/nlp-testing" }
    }
  }
};

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { locale, slug } = await params;
  const dict = await getDictionary(locale as Locale);

  const project = await db.project.findUnique({
    where: { slug }
  });

  if (!project) {
    notFound();
  }

  const isAr = locale === "ar";
  // Fallback to bashar-ai if slug doesn't match keys exactly
  const key = slug.toLowerCase() === "eval-framework" ? "eval-framework" : "bashar-ai";
  const study = isAr ? studiesAr[key] : studiesEn[key];

  return (
    <>
      <Navbar dict={dict} locale={locale as Locale} />
      <main className={styles.main}>
        <div className="container">
          <Link href={`/${locale}/projects`} className={styles.backBtn}>
            ← {isAr ? "العودة للمشاريع" : "Back to Projects"}
          </Link>

          <header className={styles.header}>
            <span className={styles.meta}>CASE STUDY // {slug.toUpperCase().replace("-", " ")}</span>
            <h1 className={styles.title}>{isAr ? project.titleAr : project.titleEn}</h1>
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.gitLink}>
                GitHub Repository ↗
              </a>
            )}
          </header>

          <div className={styles.sheet}>
            {/* 1. Overview */}
            <section className={styles.section}>
              <h2>[1. Overview & Goal]</h2>
              <p>{study.overview}</p>
            </section>

            {/* 2. Problem */}
            <section className={styles.section}>
              <h2>[2. Problem Domain]</h2>
              <p>{study.problem}</p>
            </section>

            {/* 3. Architecture */}
            <section className={styles.section}>
              <h2>[3. Architecture & Path]</h2>
              <div className={styles.codeBlock}>
                <code>{study.architecture}</code>
              </div>
            </section>

            {/* 4. Trade-offs */}
            <section className={styles.section}>
              <h2>[4. Trade-offs & Decisions]</h2>
              <p>{study.tradeoffs}</p>
            </section>

            {/* 5. Evaluation */}
            <section className={styles.section}>
              <h2>[5. Evaluation Method]</h2>
              <p>{study.evaluation}</p>
            </section>

            {/* 6. Metrics */}
            <section className={styles.section}>
              <h2>[6. Quality Metrics]</h2>
              <div className={styles.metricsGrid}>
                {study.metrics.map((m, i) => (
                  <div key={i} className={styles.metricCard}>
                    <span>{m.label}</span>
                    <strong>{m.val}</strong>
                  </div>
                ))}
              </div>
            </section>

            {/* 7. Lessons */}
            <section className={styles.section}>
              <h2>[7. Lessons Learned]</h2>
              <p>{study.lessons}</p>
            </section>

            {/* ── Knowledge Graph ─────────────────────────────── */}
            <footer className={styles.kgFooter}>
              <h3>🌐 KNOWLEDGE GRAPH (RELATED ITEMS)</h3>
              <div className={styles.kgGrid}>
                <div className={styles.kgNode}>
                  <span>Experience context:</span>
                  <Link href={study.knowledgeGraph.experience.url}>
                    {study.knowledgeGraph.experience.title} ➔
                  </Link>
                </div>
                <div className={styles.kgNode}>
                  <span>Performance observability:</span>
                  <Link href={study.knowledgeGraph.dashboard.url}>
                    {study.knowledgeGraph.dashboard.title} ➔
                  </Link>
                </div>
                <div className={styles.kgNode}>
                  <span>Technical blog article:</span>
                  <Link href={study.knowledgeGraph.blog.url}>
                    {study.knowledgeGraph.blog.title} ➔
                  </Link>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </main>
      <Footer dict={dict} />
    </>
  );
}
