import type { Locale } from "@/lib/i18n";
import styles from "./experience.module.css";

interface ExperienceProps {
  dict: Record<string, Record<string, string>>;
  locale: Locale;
}

const experiences = {
  en: [
    {
      id: "geo-platform",
      company: "GEO Platform",
      role: "Lead ML Engineer",
      period: "2024 — Present",
      location: "Yemen (Remote)",
      logo: "🌍",
      highlights: [
        "Designed and implemented an 8-stage asynchronous AI analysis pipeline running multi-LLM workflows",
        "Resolved bilingual Arabic/English entity matches using custom pg_trgm trigram indexing and Wikidata",
        "Enforced prompt version control, model drift canaries, and Langfuse observability monitoring",
      ],
      tech: ["Python", "NestJS", "Next.js", "PostgreSQL", "Redis", "Langfuse"],
    },
    {
      id: "sapa",
      company: "SAPA Product Analyzer",
      role: "Solo Full-Stack ML Engineer",
      period: "2023 — 2024",
      location: "Yemen",
      logo: "📦",
      highlights: [
        "Engineered a five-indicator product scoring engine combining LightGBM demand forecasting",
        "Built BERT and LLaMA-3 NLP pipeline (via Ollama) for review toxicity detection",
        "Designed an automated Margin Kill-Switch that rejects investment opportunities when net ROI falls below critical targets",
      ],
      tech: ["Python", "FastAPI", "React", "TimescaleDB", "LLaMA-3", "LightGBM"],
    },
  ],
  ar: [
    {
      id: "geo-platform",
      company: "منصة GEO",
      role: "مهندس تعلم آلي رئيسي",
      period: "2024 — الآن",
      location: "اليمن (عن بعد)",
      logo: "🌍",
      highlights: [
        "تصميم وتنفيذ خط معالجة غير متزامن مكون من 8 مراحل لتحليل البيانات ومطابقتها عبر نماذج LLM متعددة",
        "مطابقة الكيانات ثنائية اللغة باستخدام Unicode normalization وفهرسة pg_trgm",
        "تطوير أنظمة ضبط الموجهات وكشف الانحراف ومراقبة التكاليف عبر Langfuse",
      ],
      tech: ["Python", "NestJS", "Next.js", "PostgreSQL", "Redis", "Langfuse"],
    },
    {
      id: "sapa",
      company: "محلل المنتجات SAPA",
      role: "مهندس تعلم آلي متكامل",
      period: "2023 — 2024",
      location: "اليمن",
      logo: "📦",
      highlights: [
        "تطوير محرك تقييم منتجات ذو خمس مؤشرات يدمج توقعات الطلب بـ LightGBM",
        "تطوير خط أنابيب NLP هجين BERT و LLaMA-3 للكشف عن سمية المراجعات",
        "أتمتة مفتاح إيقاف الأرباح الهامشية الذي يرفض فرص الاستثمار عند انخفاض العائد الصافي",
      ],
      tech: ["Python", "FastAPI", "React", "TimescaleDB", "LLaMA-3", "LightGBM"],
    },
  ],
};

export function Experience({ dict, locale }: ExperienceProps) {
  const data = experiences[locale];

  return (
    <section id="experience" className={`section ${styles.section}`}>
      <div className="container">
        <h2 className={`${styles.heading} animate-fade-in-up`}>
          <span className="gradient-text">{dict.experience.title}</span>
        </h2>

        <div className={styles.resumeList}>
          {data.map((exp, index) => (
            <article
              key={exp.id}
              className={`${styles.resumeItem} animate-fade-in-up`}
              style={{ animationDelay: `${(index + 1) * 120}ms` }}
            >
              <div className={styles.resumeHeader}>
                <div>
                  <h3 className={styles.company}>
                    {exp.logo} {exp.company}
                  </h3>
                  <h4 className={styles.role}>{exp.role}</h4>
                </div>
                <div className={styles.meta}>
                  <span className={styles.period}>{exp.period}</span>
                  <span className={styles.location}>{exp.location}</span>
                </div>
              </div>
              <ul className={styles.highlights}>
                {exp.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
              <div className={styles.techStack}>
                {exp.tech.map((t) => (
                  <span key={t} className={styles.techBadge}>
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
