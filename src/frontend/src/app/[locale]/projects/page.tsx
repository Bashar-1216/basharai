import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { db } from "@/lib/db";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProjectList } from "./project-list";

export const dynamic = "force-dynamic";
export const revalidate = 0;


interface ProjectsIndexProps {
  params: Promise<{ locale: string }>;
}

export default async function ProjectsIndex({ params }: ProjectsIndexProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  // Fetch all projects and cached GitHub stats from database with safe fallback
  let projects: any[] = [];
  let githubStats: any[] = [];

  try {
    projects = await db.project.findMany({
      orderBy: { publishedAt: "desc" },
    });
    githubStats = await db.githubRepository.findMany();
  } catch (err) {
    console.warn("Projects DB fetch fallback:", err);
  }

  // Safe static fallback projects array if DB is unreachable on Vercel
  if (projects.length === 0) {
    projects = [
      {
        id: "1",
        slug: "geo-platform",
        titleEn: "AI Discovery Monitor — GEO Platform",
        titleAr: "منصة GEO لمراقبة الاكتشاف الذكي",
        descriptionEn: "Bilingual entity resolution engine, Wikidata SPARQL, Google Knowledge Graph, hallucination detection layer, and competitor feature gap analysis.",
        descriptionAr: "محرك مطابقة كيانات ثنائي اللغة، Wikidata SPARQL، واجهة Google Knowledge Graph، طبقة التحقق من الهلوسة، وتحليل الفجوات التنافسية.",
        githubUrl: "https://github.com/Bashar-1216/basharai",
        liveUrl: null,
      },
      {
        id: "2",
        slug: "sapa",
        titleEn: "SAPA — Smart Amazon Product Analyzer",
        titleAr: "SAPA — المحلل الذكي لمنتجات أمازون",
        descriptionEn: "Margin Kill-Switch automation, Herfindahl-Hirschman Index market analysis, LightGBM forecasting, and toxic review NLP pipelines.",
        descriptionAr: "أتمتة مفتاح إيقاف الأرباح الهامشية، تحليل السوق بمؤشر HHI، توقعات الطلب بـ LightGBM، وتحليل سمية المراجعات.",
        githubUrl: "https://github.com/Bashar-1216/SAPA",
        liveUrl: null,
      },
      {
        id: "3",
        slug: "real-time-driver-monitoring-system",
        titleEn: "Real Time Driver Monitoring System",
        titleAr: "نظام مراقبة السائق في الوقت الفعلي",
        descriptionEn: "EAR alertness classification, 3D pose estimation positional drift detection, and multithreaded non-blocking video/audio pipeline.",
        descriptionAr: "تصنيف اليقظة بمعدل EAR، كشف الانحراف بتقدير وضعية الرأس ثلاثية الأبعاد، وخط معالجة فيديو وصوت متعدد المسارات.",
        githubUrl: "https://github.com/Bashar-1216/Real-Time-Driver-Monitoring-System",
        liveUrl: null,
      },
      {
        id: "4",
        slug: "financial-fraud-detection",
        titleEn: "Financial Fraud Detection Platform",
        titleAr: "منصة الكشف عن الاحتيال المالي",
        descriptionEn: "Transaction anomaly classification, real-time transaction streaming using PySpark and Apache Kafka, and predictions storage in MongoDB.",
        descriptionAr: "تصنيف المعاملات الشاذة، بث المعاملات في الوقت الفعلي باستخدام PySpark و Apache Kafka، وتخزين التوقعات في MongoDB.",
        githubUrl: "https://github.com/Bashar-1216/Financial-Fraud-Detection",
        liveUrl: null,
      },
      {
        id: "5",
        slug: "arabic-sentiment-analysis",
        titleEn: "Arabic Sentiment Analysis",
        titleAr: "تحليل المشاعر باللغة العربية",
        descriptionEn: "Fine-tuned CAMeL-BERT and BiLSTM sentiment classifier deployed as a real-time inference service using FastAPI.",
        descriptionAr: "تصنيف المشاعر المعتمد على ضبط دقة CAMeL-BERT و BiLSTM المنشور كخدمة استدلال فوري باستخدام FastAPI.",
        githubUrl: "https://github.com/Bashar-1216/Arabic-Sentiment-Analysis",
        liveUrl: null,
      },
      {
        id: "6",
        slug: "fake-review-detection",
        titleEn: "Fake Review Detection",
        titleAr: "كشف التقييمات المزيفة",
        descriptionEn: "Domain-adversarial transformer-based NLP system for cross-category fake review detection.",
        descriptionAr: "نظام معالجة لغات طبيعية لكشف المراجعات المزيفة عبر الفئات المختلفة المنشور كخدمة FastAPI.",
        githubUrl: "https://github.com/Bashar-1216/Fake-Review-Detection",
        liveUrl: null,
      },
    ];
  }

  // Determine tags dynamically based on actual project slugs
  const projectsWithTags = projects.map((p) => {
    let tags: string[] = ["All"];
    if (p.slug === "geo-platform") tags.push("RAG", "LLM");
    if (p.slug === "sapa") tags.push("Automation", "LLM");
    if (p.slug === "real-time-driver-monitoring-system" || p.slug === "drowsiness-detection") tags.push("Vision", "Automation");
    if (p.slug === "financial-fraud-detection" || p.slug === "fraud-detection") tags.push("Automation");
    if (p.slug === "arabic-sentiment-analysis" || p.slug === "sentiment-analysis" || p.slug === "fake-review-detection") tags.push("LLM");
    return { ...p, tags };
  });

  return (
    <>
      <Navbar dict={dict} locale={locale as Locale} />
      <main style={{ minHeight: "100vh", padding: "8rem 0 4rem", background: "hsl(var(--color-bg))" }}>
        <div className="container">
          <header style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h1 className="gradient-text" style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 800, marginBottom: "0.5rem" }}>
              {locale === "ar" ? "دراسات الحالة والمشاريع" : "Case Studies & Projects"}
            </h1>
            <p style={{ color: "hsl(var(--color-text-body))", fontSize: "1.0625rem" }}>
              {locale === "ar"
                ? "استعراض عميق للمشاريع الهندسية وأنظمة الذكاء الاصطناعي التي قمت ببنائها."
                : "Deep dives into engineering architectural decisions and AI systems built."}
            </p>
          </header>

          <ProjectList 
            initialProjects={projectsWithTags} 
            githubStats={githubStats}
            locale={locale as Locale} 
          />
        </div>
      </main>
      <Footer dict={dict} />
    </>
  );
}
