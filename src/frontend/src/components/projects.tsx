import type { Locale } from "@/lib/i18n";
import styles from "./projects.module.css";

interface ProjectsProps {
  dict: Record<string, Record<string, string>>;
  locale: Locale;
}

const projects = {
  en: [
    {
      id: "bashar-ai",
      title: "bashar.ai Platform Engine",
      subtitle: "This Platform",
      overview: "A bilingual AI engineering portfolio with RAG-powered assistant. Designed to serve visitors with high accuracy, low latency, and low operational cost.",
      problem: "Creating an interactive, grounded portfolio assistant that avoids hallucinations without incurring high LLM API costs or complex database server requirements.",
      architecture: "Next.js (BFF, Vercel) ➔ FastAPI RAG Backend (Railway) ➔ PostgreSQL (pgvector, HNSW Index) with Redis Cache.",
      tradeoffs: "Chose PostgreSQL (pgvector) over standalone vector databases (Pinecone/Milvus) to keep infrastructure local, relational, and 100% cost-contained under $0.02 per visit.",
      metrics: [
        { label: "RAG Groundedness", value: "≥ 0.94 🟢" },
        { label: "Avg Latency", value: "420ms" },
        { label: "Cost per Visit", value: "$0.003" },
      ],
      tech: ["Next.js", "FastAPI", "LangChain", "pgvector", "OpenAI"],
    },
    {
      id: "eval-framework",
      title: "LLM Evaluation Framework",
      subtitle: "Open-Source Tool",
      overview: "An automated evaluation pipeline that runs Golden Set regression tests to measure performance of retrieval systems.",
      problem: "LLM system behavior degrades silently after prompt updates or retrieval changes. Manual validation does not scale.",
      architecture: "Python Pytest suite ➔ LLM-as-a-Judge API ➔ GitHub Actions CI Pipeline ➔ PostgreSQL Run History.",
      tradeoffs: "Implemented a local judge scoring rule with GPT-4o-mini to strike a balance between evaluation cost and score consistency, rejecting expensive GPT-4 API calls for routine CI commits.",
      metrics: [
        { label: "Golden Set", value: "25 QA pairs" },
        { label: "Judge Model", value: "GPT-4o-mini" },
        { label: "CI Gate Status", value: "Pass 🟢" },
      ],
      tech: ["Python", "Pytest", "OpenAI", "GitHub Actions", "PostgreSQL"],
    },
    {
      id: "rag-pipeline",
      title: "Production RAG Pipeline",
      subtitle: "Architecture Deep Dive",
      overview: "Retrieval-Augmented Generation system with semantic chunking, HNSW vector indexing, hybrid BM25 + cosine similarity search.",
      problem: "Standard token-based chunking splits paragraphs mid-sentence, causing retrieval of fragmented context and poor quality answers.",
      architecture: "LangChain Chunkers ➔ Semantic similarity splitting ➔ Redis Cache ➔ SSE streaming response.",
      tradeoffs: "Leveraged hybrid BM25 lexical keyword search combined with semantic vector embeddings to ensure precise matching of exact project names and tech terms.",
      metrics: [
        { label: "Vector Index", value: "HNSW" },
        { label: "Search Mode", value: "Hybrid" },
        { label: "Streaming", value: "SSE (Live)" },
      ],
      tech: ["LangChain", "pgvector", "FastAPI", "Redis", "OpenAI"],
    },
  ],
  ar: [
    {
      id: "bashar-ai",
      title: "محرك منصة bashar.ai",
      subtitle: "هذه المنصة",
      overview: "محفظة هندسة ذكاء اصطناعي ثنائية اللغة مع مساعد تفاعلي RAG. صُمم ليخدم الزوار بدقة عالية وكمون منخفض وتكلفة تشغيلية اقتصادية.",
      problem: "إنشاء مساعد تفاعلي مؤصل يتجنب الهلوسة البرمجية دون زيادة تكاليف واجهات OpenAI البرمجية أو تعقيد البنية التحتية.",
      architecture: "Next.js (BFF) ➔ FastAPI (RAG) ➔ PostgreSQL (pgvector, HNSW) مع Redis Cache.",
      tradeoffs: "اختيار PostgreSQL (pgvector) بدلاً من قواعد بيانات المتجهات المستقلة لضمان محلية البيانات وتقليص التكلفة لتخدم كل زائر بأقل من 0.02 دولار.",
      metrics: [
        { label: "دقة RAG", value: "≥ 0.94 🟢" },
        { label: "متوسط الكمون", value: "420ms" },
        { label: "تكلفة الزيارة", value: "$0.003" },
      ],
      tech: ["Next.js", "FastAPI", "LangChain", "pgvector", "OpenAI"],
    },
    {
      id: "eval-framework",
      title: "إطار تقييم النماذج اللغوية",
      subtitle: "أداة مفتوحة المصدر",
      overview: "خط أنابيب تقييم آلي ينفذ اختبارات انحدار المجموعة الذهبية لقياس جودة أنظمة الاسترجاع.",
      problem: "تراجع أداء أنظمة نماذج اللغة بصمت بعد تحديثات النماذج أو الصياغات البرمجية دون إمكانية التحقق اليدوي المستمر.",
      architecture: "مجموعة اختبارات Python Pytest ➔ نموذج LLM كحَكَم ➔ خط أنابيب GitHub Actions CI.",
      tradeoffs: "الاعتماد على نموذج GPT-4o-mini كحَكَم لتقليل تكلفة التقييم المستمر للتعليمات البرمجية وتفادي تكلفة GPT-4 المرتفعة.",
      metrics: [
        { label: "المجموعة الذهبية", value: "25 زوج سؤال/جواب" },
        { label: "نموذج الحَكَم", value: "GPT-4o-mini" },
        { label: "حالة بوابة CI", value: "PASS 🟢" },
      ],
      tech: ["Python", "Pytest", "OpenAI", "GitHub Actions", "PostgreSQL"],
    },
    {
      id: "rag-pipeline",
      title: "خط أنابيب RAG الإنتاجي",
      subtitle: "تعمق في البنية",
      overview: "نظام توليد معزز بالاسترجاع يتضمن تقطيع دلالي وفهرسة متجهات HNSW وبحث هجين BM25 + تشابه جيب التمام.",
      problem: "التقطيع التقليدي المبني على عدد الأحرف يقطع الجمل في منتصفها مما يؤدي إلى ضياع السياق وتدهور جودة الإجابات.",
      architecture: "أدوات LangChain للتقطيع الدلالي ➔ فرز المتجهات HNSW ➔ تخزين مؤقت Redis ➔ بث SSE.",
      tradeoffs: "دمج البحث الدلالي مع البحث اللفظي BM25 لضمان دقة استرجاع أسماء المشاريع المحددة والاختصارات البرمجية.",
      metrics: [
        { label: "فهرس المتجهات", value: "HNSW" },
        { label: "طريقة البحث", value: "هجين" },
        { label: "البث المباشر", value: "SSE (Live)" },
      ],
      tech: ["LangChain", "pgvector", "FastAPI", "Redis", "OpenAI"],
    },
  ],
};

/**
 * Projects section — Case Study narrative layout.
 * Showcases engineering depth and structured trade-off evaluations.
 */
export function Projects({ dict, locale }: ProjectsProps) {
  const data = projects[locale];

  return (
    <section id="projects" className={`section ${styles.section}`}>
      <div className="container">
        <h2 className={`${styles.heading} animate-fade-in-up`}>
          <span className="gradient-text">{dict.projects.title}</span>
        </h2>

        <div className={styles.caseStudies}>
          {data.map((project, index) => (
            <article
              key={project.id}
              className={`${styles.caseSheet} animate-fade-in-up`}
              style={{ animationDelay: `${(index + 1) * 120}ms` }}
            >
              {/* ── Header ─────────────────────────────────── */}
              <div className={styles.sheetHeader}>
                <div>
                  <span className={styles.subtitle}>{project.subtitle}</span>
                  <h3 className={styles.title}>{project.title}</h3>
                </div>
              </div>

              {/* ── Case Narrative sections ───────────────── */}
              <div className={styles.sheetContent}>
                <div className={styles.narrativeSection}>
                  <h4 className={styles.sectionLabel}>
                    {locale === "ar" ? "1. نظرة عامة والهدف" : "1. Overview & Goal"}
                  </h4>
                  <p className={styles.text}>{project.overview}</p>
                </div>

                <div className={styles.narrativeSection}>
                  <h4 className={styles.sectionLabel}>
                    {locale === "ar" ? "2. المشكلة الفنية" : "2. Technical Challenge"}
                  </h4>
                  <p className={styles.text}>{project.problem}</p>
                </div>

                <div className={styles.narrativeSection}>
                  <h4 className={styles.sectionLabel}>
                    {locale === "ar" ? "3. الهيكل المعماري" : "3. Architecture"}
                  </h4>
                  <p className={styles.code}>{project.architecture}</p>
                </div>

                <div className={styles.narrativeSection}>
                  <h4 className={styles.sectionLabel}>
                    {locale === "ar" ? "4. التضحيات والقرارات" : "4. Trade-offs & Decisions"}
                  </h4>
                  <p className={styles.text}>{project.tradeoffs}</p>
                </div>
              </div>

              {/* ── Metrics Block ──────────────────────────── */}
              <div className={styles.metricsRow}>
                {project.metrics.map((metric) => (
                  <div key={metric.label} className={styles.metricCard}>
                    <span className={styles.metricValue}>{metric.value}</span>
                    <span className={styles.metricLabel}>{metric.label}</span>
                  </div>
                ))}
              </div>

              {/* ── Footer / Tech stack ────────────────────── */}
              <div className={styles.sheetFooter}>
                <div className={styles.techStack}>
                  {project.tech.map((t) => (
                    <span key={t} className={styles.techBadge}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
