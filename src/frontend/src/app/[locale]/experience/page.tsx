import type { Locale } from "@/lib/i18n";
import { db } from "@/lib/db";
import styles from "./experience.module.css";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getDictionary } from "@/lib/i18n";

interface ExperienceIndexProps {
  params: Promise<{ locale: string }>;
}

function getExperienceSlug(companyName: string): string {
  const c = companyName.toLowerCase();
  if (c.includes("geo")) return "geo-platform";
  if (c.includes("sapa")) return "sapa";
  if (c.includes("drowsiness")) return "drowsiness-detection";
  if (c.includes("fraud")) return "fraud-detection";
  if (c.includes("sentiment")) return "sentiment-analysis";
  return c.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ExperienceIndex({ params }: ExperienceIndexProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  let experiences: any[] = [];
  try {
    experiences = await db.experience.findMany({
      orderBy: { startDate: "desc" },
    });
  } catch (err) {
    console.warn("Experiences DB fetch fallback:", err);
  }

  if (experiences.length === 0) {
    experiences = [
      {
        id: "1",
        company: "AI Discovery Monitor — GEO Platform",
        titleEn: "Lead ML Engineer — Generative Engine Optimization",
        titleAr: "مهندس تعلم آلي رئيسي — منصة تحسين المحركات التوليدية (GEO)",
        startDate: new Date("2025-01-01"),
        endDate: null,
        isCurrent: true,
        summaryEn: "Architected an 8-stage asynchronous AI analysis pipeline executing structured prompt workflows across GPT-4, Claude, Gemini, and Perplexity using a Python worker architecture with BullMQ/Redis queues and Pydantic validation.",
        summaryAr: "هندسة خط معالجة تحليلي غير متزامن مكون من 8 مراحل ينفذ موجهات مهيكلة عبر GPT-4 و Claude و Gemini و Perplexity مع فحص Pydantic وزمن استجابة فائق السرعة.",
      },
      {
        id: "2",
        company: "SAPA Intelligence",
        titleEn: "Solo Full-Stack ML Engineer — Amazon Market Analytics",
        titleAr: "مهندس تعلم آلي متكامل — المحلل الذكي لمنتجات أمازون",
        startDate: new Date("2025-01-01"),
        endDate: new Date("2026-06-30"),
        isCurrent: false,
        summaryEn: "Engineered a five-indicator product scoring engine combining LightGBM demand forecasting with a hybrid BERT and LLaMA-3 NLP pipeline (via Ollama) for review toxicity detection and competitive market analysis using HHI.",
        summaryAr: "تطوير محرك تقييم منتجات يدمج توقعات الطلب بـ LightGBM مع خط NLP هجين من BERT و LLaMA-3 للتحليل التنافسي واكتشاف سمية المراجعات.",
      },
      {
        id: "3",
        company: "Driver Safety AI Systems",
        titleEn: "Computer Vision ML Engineer — Real-Time Alertness Pipeline",
        titleAr: "مهندس تعلم آلي للرؤية الحاسوبية — نظام كشف السلامة والنعاس",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2025-12-31"),
        isCurrent: false,
        summaryEn: "Built a real-time drowsiness detection pipeline using OpenCV and MediaPipe FaceMesh to analyze EAR and facial landmark geometry for driver alertness classification with 3D pose estimation.",
        summaryAr: "بناء نظام رؤية حاسوبية لحظي لكشف نعاس وحركات رأس السائق باستخدام OpenCV و MediaPipe مع تقدير الوضعية ثلاثية الأبعاد.",
      },
      {
        id: "4",
        company: "Financial Analytics Engine",
        titleEn: "Big Data ML Engineer — PySpark Transaction Fraud Analytics",
        titleAr: "مهندس تعلم آلي للبيانات الضخمة — منصة كشف الاحتيال المالي",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-12-31"),
        isCurrent: false,
        summaryEn: "Built an end-to-end fraud detection pipeline using PySpark and ensemble machine learning models to classify anomalous financial transactions with real-time Kafka streaming.",
        summaryAr: "بناء خط معالجة متكامل لكشف المعاملات المالية الشاذة باستخدام PySpark ونماذج التعلم الآلي مع بث لحظي عبر Apache Kafka.",
      },
      {
        id: "5",
        company: "Arabic NLP Lab",
        titleEn: "NLP Research Engineer — Arabic Sentiment & Fake Review Classifier",
        titleAr: "مهندس أبحاث معالجة اللغات الطبيعية — تصنيف المشاعر والتقييمات العربية",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-08-31"),
        isCurrent: false,
        summaryEn: "Fine-tuned CAMeL-BERT and BiLSTM architectures for domain-specific Arabic sentiment classification with custom text preprocessing for social media dialects.",
        summaryAr: "ضبط دقة نماذج CAMeL-BERT و BiLSTM لتصنيف المشاعر باللغة العربية وتحديد التقييمات المزيفة مع معالجة اللهجات المحلية.",
      },
    ];
  }

  const isAr = locale === "ar";

  return (
    <>
      <Navbar dict={dict} locale={locale as Locale} />
      <main className={styles.main}>
        <div className="container">
          <header className={styles.header}>
            <h1 className="gradient-text">
              {isAr ? "الخبرة والمسيرة المهنية" : "Professional Experience"}
            </h1>
            <p className={styles.subtitle}>
              {isAr
                ? "تفاصيل المسيرة الهندسية وتطوير الأنظمة البرمجية في بيئات تقنية رائدة."
                : "Timeline of engineering impact and production-grade systems delivery."}
            </p>
          </header>

          <div className={styles.timeline}>
            {experiences.map((exp, idx) => {
              const slug = getExperienceSlug(exp.company);
              return (
                <div key={exp.id} className={styles.timelineItem}>
                  <div className={styles.timelineMarker}>
                    <div className={styles.markerCircle} />
                    {idx < experiences.length - 1 && <div className={styles.markerLine} />}
                  </div>

                  <div className={styles.timelineContent}>
                    <span className={styles.year}>
                      {exp.startDate.getFullYear()} —{" "}
                      {exp.isCurrent
                        ? isAr
                          ? "الآن"
                          : "Present"
                        : exp.endDate?.getFullYear()}
                    </span>

                    <h3 className={styles.companyName}>{exp.company}</h3>
                    <h4 className={styles.roleTitle}>
                      {isAr ? exp.titleAr : exp.titleEn}
                    </h4>

                    <p className={styles.summary}>
                      {isAr ? exp.summaryAr : exp.summaryEn}
                    </p>

                    <Link href={`/${locale}/experience/${slug}`} className={styles.readCase}>
                      {isAr ? "اقرأ ورقة العمل الكاملة ←" : "Read Full Case Study ←"}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer dict={dict} />
    </>
  );
}
