import type { Locale } from "@/lib/i18n";
import styles from "./experience.module.css";

interface ExperienceProps {
  dict: Record<string, Record<string, string>>;
  locale: Locale;
}

const experiences = {
  en: [
    {
      id: "amazon",
      company: "Amazon",
      role: "Software Development Engineer",
      period: "2022 — 2024",
      location: "Seattle, WA",
      logo: "🔶",
      highlights: [
        "Designed and shipped ML-powered recommendation engine serving 50M+ daily active users",
        "Reduced inference latency by 40% through model optimization and caching strategies",
        "Led migration of legacy monolith to event-driven microservices architecture",
        "Mentored 3 junior engineers and established team coding standards",
      ],
      tech: ["Python", "AWS", "ML Pipelines", "DynamoDB", "SageMaker"],
    },
    {
      id: "grammarly",
      company: "Grammarly",
      role: "ML Engineer — NLP Team",
      period: "2020 — 2022",
      location: "San Francisco, CA",
      logo: "🟢",
      highlights: [
        "Built transformer-based text classification pipeline processing 10M+ documents/day",
        "Improved model accuracy from 87% to 94% through advanced fine-tuning techniques",
        "Designed A/B testing framework for NLP model evaluation in production",
        "Contributed to core writing suggestion engine used by 30M+ users globally",
      ],
      tech: ["PyTorch", "Transformers", "GCP", "Kubernetes", "FastAPI"],
    },
  ],
  ar: [
    {
      id: "amazon",
      company: "أمازون",
      role: "مهندس تطوير برمجيات",
      period: "2022 — 2024",
      location: "سياتل، واشنطن",
      logo: "🔶",
      highlights: [
        "صممت وشحنت محرك توصيات مدعوم بالتعلم الآلي يخدم أكثر من 50 مليون مستخدم نشط يومياً",
        "خفضت زمن الاستدلال بنسبة 40% من خلال تحسين النماذج واستراتيجيات التخزين المؤقت",
        "قدت عملية ترحيل النظام القديم إلى بنية خدمات مصغرة قائمة على الأحداث",
        "أرشدت 3 مهندسين مبتدئين ووضعت معايير البرمجة للفريق",
      ],
      tech: ["Python", "AWS", "ML Pipelines", "DynamoDB", "SageMaker"],
    },
    {
      id: "grammarly",
      company: "جرامرلي",
      role: "مهندس تعلم آلي — فريق معالجة اللغات الطبيعية",
      period: "2020 — 2022",
      location: "سان فرانسيسكو، كاليفورنيا",
      logo: "🟢",
      highlights: [
        "بنيت خط أنابيب تصنيف نصي قائم على المحولات يعالج أكثر من 10 ملايين مستند يومياً",
        "حسّنت دقة النموذج من 87% إلى 94% من خلال تقنيات الضبط الدقيق المتقدمة",
        "صممت إطار اختبار A/B لتقييم نماذج NLP في بيئة الإنتاج",
        "ساهمت في محرك اقتراحات الكتابة الأساسي المستخدم من أكثر من 30 مليون مستخدم عالمياً",
      ],
      tech: ["PyTorch", "Transformers", "GCP", "Kubernetes", "FastAPI"],
    },
  ],
};

/**
 * Experience section — timeline-style cards showcasing work history.
 * Data is NDA-safe: high-level metrics only, no proprietary details.
 */
export function Experience({ dict, locale }: ExperienceProps) {
  const data = experiences[locale];

  return (
    <section id="experience" className={`section ${styles.section}`}>
      <div className="container">
        <h2 className={`${styles.heading} animate-fade-in-up`}>
          <span className="gradient-text">{dict.experience.title}</span>
        </h2>

        <div className={styles.timeline}>
          {data.map((exp, index) => (
            <article
              key={exp.id}
              className={`glass-card ${styles.card} animate-fade-in-up`}
              style={{ animationDelay: `${(index + 1) * 150}ms` }}
            >
              {/* ── Card Header ─────────────────────────────── */}
              <div className={styles.cardHeader}>
                <span className={styles.logo}>{exp.logo}</span>
                <div className={styles.headerText}>
                  <h3 className={styles.company}>{exp.company}</h3>
                  <p className={styles.role}>{exp.role}</p>
                </div>
                <div className={styles.meta}>
                  <span className={styles.period}>{exp.period}</span>
                  <span className={styles.location}>{exp.location}</span>
                </div>
              </div>

              {/* ── Highlights ──────────────────────────────── */}
              <ul className={styles.highlights}>
                {exp.highlights.map((item, i) => (
                  <li key={i} className={styles.highlight}>
                    <span className={styles.bulletIcon}>▸</span>
                    {item}
                  </li>
                ))}
              </ul>

              {/* ── Tech Stack ──────────────────────────────── */}
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
