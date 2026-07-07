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
      title: "bashar.ai",
      subtitle: "This Platform",
      description:
        "A bilingual AI engineering portfolio with RAG-powered assistant. Features real-time streaming responses, automated evaluation pipelines (RAG Triad), and a cost-efficient architecture that serves each visitor for under $0.02.",
      metrics: [
        { label: "RAG Groundedness", value: "≥ 0.90" },
        { label: "Avg Latency", value: "< 800ms" },
        { label: "Cost per Visit", value: "< $0.02" },
      ],
      tech: ["Next.js", "FastAPI", "LangChain", "pgvector", "OpenAI"],
      color: "var(--color-primary)",
    },
    {
      id: "eval-framework",
      title: "LLM Evaluation Framework",
      subtitle: "Open-Source Tool",
      description:
        "An automated evaluation pipeline that uses LLM-as-a-Judge methodology to measure Groundedness, Context Relevance, and Answer Relevance. Runs golden-set regression tests in CI/CD pipelines to prevent quality degradation.",
      metrics: [
        { label: "Golden Set", value: "25 QA pairs" },
        { label: "Judge Model", value: "GPT-4o-mini" },
        { label: "CI Gate", value: "Blocks < 80%" },
      ],
      tech: ["Python", "Pytest", "OpenAI", "GitHub Actions", "PostgreSQL"],
      color: "var(--color-secondary)",
    },
    {
      id: "rag-pipeline",
      title: "Production RAG Pipeline",
      subtitle: "Architecture Deep Dive",
      description:
        "End-to-end Retrieval-Augmented Generation system with semantic chunking, HNSW vector indexing, hybrid BM25 + cosine similarity search, and streaming Server-Sent Events (SSE) for real-time token delivery.",
      metrics: [
        { label: "Vector Index", value: "HNSW" },
        { label: "Search", value: "Hybrid" },
        { label: "Streaming", value: "SSE" },
      ],
      tech: ["LangChain", "pgvector", "FastAPI", "Redis", "OpenAI"],
      color: "var(--color-accent)",
    },
  ],
  ar: [
    {
      id: "bashar-ai",
      title: "bashar.ai",
      subtitle: "هذه المنصة",
      description:
        "محفظة هندسة ذكاء اصطناعي ثنائية اللغة مع مساعد تفاعلي يعمل بتقنية RAG. تتميز بردود بث مباشر، وخطوط تقييم آلية (مثلث RAG)، وبنية فعالة التكلفة تخدم كل زائر بأقل من 0.02 دولار.",
      metrics: [
        { label: "دقة RAG", value: "≥ 0.90" },
        { label: "متوسط الكمون", value: "< 800ms" },
        { label: "تكلفة الزيارة", value: "< $0.02" },
      ],
      tech: ["Next.js", "FastAPI", "LangChain", "pgvector", "OpenAI"],
      color: "var(--color-primary)",
    },
    {
      id: "eval-framework",
      title: "إطار تقييم النماذج اللغوية",
      subtitle: "أداة مفتوحة المصدر",
      description:
        "خط أنابيب تقييم آلي يستخدم منهجية LLM كحَكَم لقياس التأريض والملاءمة السياقية وملاءمة الإجابة. ينفذ اختبارات انحدار المجموعة الذهبية في خطوط CI/CD لمنع تدهور الجودة.",
      metrics: [
        { label: "المجموعة الذهبية", value: "25 زوج سؤال/جواب" },
        { label: "نموذج الحَكَم", value: "GPT-4o-mini" },
        { label: "بوابة CI", value: "يحظر < 80%" },
      ],
      tech: ["Python", "Pytest", "OpenAI", "GitHub Actions", "PostgreSQL"],
      color: "var(--color-secondary)",
    },
    {
      id: "rag-pipeline",
      title: "خط أنابيب RAG الإنتاجي",
      subtitle: "تعمق في البنية",
      description:
        "نظام توليد معزز بالاسترجاع شامل يتضمن تقطيع دلالي وفهرسة متجهات HNSW وبحث هجين BM25 + تشابه جيب التمام وبث أحداث الخادم (SSE) لتسليم التوكنز فورياً.",
      metrics: [
        { label: "فهرس المتجهات", value: "HNSW" },
        { label: "البحث", value: "هجين" },
        { label: "البث", value: "SSE" },
      ],
      tech: ["LangChain", "pgvector", "FastAPI", "Redis", "OpenAI"],
      color: "var(--color-accent)",
    },
  ],
};

/**
 * Projects section — case study cards with metrics badges.
 * Showcases engineering depth and production-grade AI work.
 */
export function Projects({ dict, locale }: ProjectsProps) {
  const data = projects[locale];

  return (
    <section id="projects" className={`section ${styles.section}`}>
      <div className="container">
        <h2 className={`${styles.heading} animate-fade-in-up`}>
          <span className="gradient-text">{dict.projects.title}</span>
        </h2>

        <div className={styles.grid}>
          {data.map((project, index) => (
            <article
              key={project.id}
              className={`glass-card ${styles.card} animate-fade-in-up`}
              style={{ animationDelay: `${(index + 1) * 150}ms` }}
            >
              {/* ── Color Accent Bar ────────────────────────── */}
              <div
                className={styles.accentBar}
                style={{ background: `hsl(${project.color})` }}
              />

              {/* ── Card Content ────────────────────────────── */}
              <div className={styles.cardContent}>
                <span className={styles.subtitle}>{project.subtitle}</span>
                <h3 className={styles.title}>{project.title}</h3>
                <p className={styles.description}>{project.description}</p>

                {/* ── Metrics ───────────────────────────────── */}
                <div className={styles.metrics}>
                  {project.metrics.map((metric) => (
                    <div key={metric.label} className={styles.metric}>
                      <span className={styles.metricValue}>
                        {metric.value}
                      </span>
                      <span className={styles.metricLabel}>
                        {metric.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* ── Tech Stack ────────────────────────────── */}
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
