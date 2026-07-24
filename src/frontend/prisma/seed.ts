import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedExperiences() {
  const experiences = [
    {
      company: "AI Discovery Monitor — GEO Platform",
      titleEn: "Lead ML Engineer — Generative Engine Optimization",
      titleAr: "مهندس تعلم آلي رئيسي — منصة تحسين المحركات التوليدية (GEO)",
      startDate: new Date("2025-01-01"),
      isCurrent: true,
      summaryEn: "Architected an 8-stage asynchronous AI analysis pipeline executing structured prompt workflows across GPT-4, Claude, Gemini, and Perplexity using a Python worker architecture with BullMQ/Redis queues and Pydantic validation.",
      summaryAr: "هندسة خط معالجة تحليلي غير متزامن مكون من 8 مراحل ينفذ موجهات مهيكلة عبر GPT-4 و Claude و Gemini و Perplexity مع فحص Pydantic وزمن استجابة فائق السرعة.",
    },
    {
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

  for (const exp of experiences) {
    await prisma.experience.upsert({
      where: { company: exp.company },
      update: exp,
      create: exp,
    });
  }
  console.log("Experiences updated successfully.");
}

async function seedProjects() {
  const projects = [
    {
      slug: "geo-platform",
      titleEn: "AI Discovery Monitor — GEO Platform",
      titleAr: "منصة GEO لمراقبة الاكتشاف الذكي",
      descriptionEn: "Bilingual entity resolution engine, Wikidata SPARQL, Google Knowledge Graph, hallucination detection layer, and competitor feature gap analysis.",
      descriptionAr: "محرك مطابقة كيانات ثنائي اللغة، Wikidata SPARQL، واجهة Google Knowledge Graph، طبقة التحقق من الهلوسة، وتحليل الفجوات التنافسية.",
      githubUrl: "https://github.com/Bashar-1216/basharai",
      featured: true,
    },
    {
      slug: "sapa",
      titleEn: "SAPA — Smart Amazon Product Analyzer",
      titleAr: "SAPA — المحلل الذكي لمنتجات أمازون",
      descriptionEn: "Margin Kill-Switch automation, Herfindahl-Hirschman Index market analysis, LightGBM forecasting, and toxic review NLP pipelines.",
      descriptionAr: "أتمتة مفتاح إيقاف الأرباح الهامشية، تحليل السوق بمؤشر HHI، توقعات الطلب بـ LightGBM، وتحليل سمية المراجعات.",
      githubUrl: "https://github.com/Bashar-1216/SAPA",
      featured: true,
    },
    {
      slug: "real-time-driver-monitoring-system",
      titleEn: "Real Time Driver Monitoring System",
      titleAr: "نظام مراقبة السائق في الوقت الفعلي",
      descriptionEn: "EAR alertness classification, 3D pose estimation positional drift detection, and multithreaded non-blocking video/audio pipeline.",
      descriptionAr: "تصنيف اليقظة بمعدل EAR، كشف الانحراف بتقدير وضعية الرأس ثلاثية الأبعاد، وخط معالجة فيديو وصوت متعدد المسارات.",
      githubUrl: "https://github.com/Bashar-1216/Real-Time-Driver-Monitoring-System",
      featured: true,
    },
    {
      slug: "financial-fraud-detection",
      titleEn: "Financial Fraud Detection Platform",
      titleAr: "منصة الكشف عن الاحتيال المالي",
      descriptionEn: "Transaction anomaly classification, real-time transaction streaming using PySpark and Apache Kafka, and predictions storage in MongoDB.",
      descriptionAr: "تصنيف المعاملات الشاذة، بث المعاملات في الوقت الفعلي باستخدام PySpark و Apache Kafka، وتخزين التوقعات في MongoDB.",
      githubUrl: "https://github.com/Bashar-1216/Financial-Fraud-Detection",
      featured: true,
    },
    {
      slug: "arabic-sentiment-analysis",
      titleEn: "Arabic Sentiment Analysis",
      titleAr: "تحليل المشاعر باللغة العربية",
      descriptionEn: "Fine-tuned CAMeL-BERT and BiLSTM sentiment classifier deployed as a real-time inference service using FastAPI.",
      descriptionAr: "تصنيف المشاعر المعتمد على ضبط دقة CAMeL-BERT و BiLSTM المنشور كخدمة استدلال فوري باستخدام FastAPI.",
      githubUrl: "https://github.com/Bashar-1216/Arabic-Sentiment-Analysis",
      featured: true,
    },
    {
      slug: "fake-review-detection",
      titleEn: "Fake Review Detection",
      titleAr: "كشف التقييمات المزيفة",
      descriptionEn: "Domain-adversarial transformer-based NLP system for cross-category fake review detection.",
      descriptionAr: "نظام معالجة لغات طبيعية لكشف المراجعات المزيفة عبر الفئات المختلفة المنشور كخدمة FastAPI.",
      githubUrl: "https://github.com/Bashar-1216/Fake-Review-Detection",
      featured: true,
    },
    {
      slug: "money-tracker",
      titleEn: "Money Tracker",
      titleAr: "متتبع المصاريف والمالية",
      descriptionEn: "Personal finance tracking application with data visualization and analytics capabilities.",
      descriptionAr: "تطبيق تتبع المالية الشخصية وإدارة الميزانيات مع تصورات بيانية تحليليية.",
      githubUrl: "https://github.com/Bashar-1216/Money-Tracker",
      featured: true,
    },
    {
      slug: "air-quality-analysis",
      titleEn: "Air Quality Analysis",
      titleAr: "تحليل جودة الهواء والبيئة",
      descriptionEn: "Environmental data analysis project focused on monitoring and interpreting air quality metrics.",
      descriptionAr: "مشروع تحليل البيانات البيئية لمعالجة مؤشرات جودة الهواء وتصور اتجاهات التلوث.",
      githubUrl: "https://github.com/Bashar-1216/air-quality-analysis",
      featured: true,
    },
  ];

  for (const proj of projects) {
    await prisma.project.upsert({
      where: { slug: proj.slug },
      update: proj,
      create: proj,
    });
  }
  console.log("Projects updated successfully without duplicates.");
}

async function main() {
  console.log("Updating database with clean projects and experiences...");
  await seedExperiences();
  await seedProjects();
  console.log("Database update completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
