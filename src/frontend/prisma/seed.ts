import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedExperiences() {
  const experiences = [
    {
      company: "GEO Platform",
      titleEn: "Lead ML Engineer - AI Discovery Monitor",
      titleAr: "مهندس تعلم آلي رئيسي - منصة GEO للمراقبة",
      startDate: new Date("2025-01-01"),
      isCurrent: true,
      summaryEn: "Designed and implemented an 8-stage asynchronous AI analysis pipeline executing structured prompt workflows across GPT-4, Claude, Gemini, and Perplexity using a Python worker architecture with Redis task queues. Engineered a bilingual entity resolution engine utilizing trigram indexing.",
      summaryAr: "تصميم وتنفيذ خط معالجة تحليلي غير متزامن مكون من 8 مراحل ينفذ قوالب موجهات مهيكلة عبر GPT-4 و Claude و Gemini و Perplexity. تطوير محرك مطابقة كيانات ثنائي اللغة باستخدام فهرسة trigram.",
    },
    {
      company: "SAPA Product Analyzer",
      titleEn: "Solo Full-Stack ML Engineer - Smart Amazon Product Analyzer",
      titleAr: "مهندس تعلم آلي متكامل - محلل منتجات أمازون الذكي",
      startDate: new Date("2025-01-01"),
      endDate: new Date("2026-06-30"),
      isCurrent: false,
      summaryEn: "Engineered a five-indicator product scoring engine combining LightGBM demand forecasting with a hybrid BERT and LLaMA-3 NLP pipeline (via Ollama) for review toxicity detection. Deployed an 8-container microservices compose stack on Linux servers.",
      summaryAr: "تطوير محرك تقييم منتجات ذو خمس مؤشرات يدمج توقعات الطلب بـ LightGBM مع خط أنابيب NLP هجين BERT و LLaMA-3 للكشف عن سمية المراجعات. نشر بنية خوادم مدمجة من 8 حاويات Docker Compose.",
    },
    {
      company: "Drowsiness Detection System",
      titleEn: "Solo ML Engineer - Driver Safety Pipeline",
      titleAr: "مهندس تعلم آلي - كشف نعاس السائق لحظياً",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2025-12-31"),
      isCurrent: false,
      summaryEn: "Built a real-time drowsiness detection pipeline using OpenCV and MediaPipe FaceMesh to analyze Eye Aspect Ratio (EAR) and facial landmark geometry for driver alertness classification. Implemented 3D pose estimation.",
      summaryAr: "بناء خط معالجة لحظي للكشف عن النعاس باستخدام OpenCV و MediaPipe FaceMesh لتحليل معدل فتح العين ومعالم الوجه لتصنيف يقظة السائق. دمج تقدير الوضعية ثلاثي الأبعاد.",
    },
    {
      company: "Financial Fraud Detection",
      titleEn: "ML Engineer - PySpark Transaction Analytics",
      titleAr: "مهندس تعلم آلي - كشف الاحتيال المالي بـ PySpark",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-12-31"),
      isCurrent: false,
      summaryEn: "Built an end-to-end fraud detection pipeline using PySpark and ensemble machine learning models to classify anomalous financial transactions. Simulated real-time transaction streaming using Apache Kafka.",
      summaryAr: "بناء خط معالجة متكامل لكشف الاحتيال باستخدام PySpark ونماذج التعلم الآلي لتصنيف المعاملات المالية غير العادية. محاكاة البث اللحظي للبيانات باستخدام Apache Kafka.",
    },
    {
      company: "Sentiment Analysis System",
      titleEn: "ML Engineer - Arabic Sentiment & Fake Review Classifier",
      titleAr: "مهندس تعلم آلي - تصنيف المشاعر والتقييمات المزيفة",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-08-31"),
      isCurrent: false,
      summaryEn: "Fine-tuned CAMeL-BERT and BiLSTM architectures for domain-specific Arabic sentiment classification, building custom Arabic text preprocessing pipelines to handle social media dialects.",
      summaryAr: "ضبط دقة نماذج CAMeL-BERT و BiLSTM لتصنيف المشاعر العربية في مجالات محددة، وبناء خطوط معالجة مسبقة للنصوص العربية للتعامل مع لهجات شبكات التواصل.",
    },
  ];

  for (const exp of experiences) {
    await prisma.experience.upsert({
      where: { company: exp.company },
      update: exp,
      create: exp,
    });
  }
  console.log("Actual Experiences seeded successfully.");
}

async function seedProjects() {
  const projects = [
    {
      slug: "geo-platform",
      titleEn: "AI Discovery Monitor — GEO Platform",
      titleAr: "منصة GEO لمراقبة الاكتشاف الذكي",
      descriptionEn: "Bilingual entity resolution engine, Wikidata SPARQL, Google Knowledge Graph, hallucination detection layer, and competitor feature gap analysis.",
      descriptionAr: "محرك مطابقة كيانات ثنائي اللغة، Wikidata SPARQL، واجهة Google Knowledge Graph، طبقة التحقق من الهلوسة، وتحليل الفجوات التنافسية.",
      githubUrl: "https://github.com/Bashar-1216/AI-Discovery-Monitor-GEO-Platform",
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
      slug: "drowsiness-detection",
      titleEn: "Real-Time Driver Drowsiness Detection",
      titleAr: "نظام كشف نعاس السائق في الوقت الفعلي",
      descriptionEn: "EAR alertness classification, 3D pose estimation positional drift detection, and multithreaded non-blocking video/audio pipeline.",
      descriptionAr: "تصنيف اليقظة بمعدل EAR، كشف الانحراف بتقدير وضعية الرأس ثلاثية الأبعاد، وخط معالجة فيديو وصوت متعدد المسارات.",
      githubUrl: "https://github.com/Bashar-1216/AI-Powered-Exercise-Tracker-Squat-Counter-Gesture-Control",
      featured: true,
    },
    {
      slug: "fraud-detection",
      titleEn: "Financial Fraud Detection Platform",
      titleAr: "منصة الكشف عن الاحتيال المالي",
      descriptionEn: "Transaction anomaly classification, real-time transaction streaming using PySpark and Apache Kafka, and predictions storage in MongoDB.",
      descriptionAr: "تصنيف المعاملات الشاذة، بث المعاملات في الوقت الفعلي باستخدام PySpark و Apache Kafka، وتخزين التوقعات في MongoDB.",
      githubUrl: "https://github.com/Bashar-1216/Financial-Fraud-Detection",
      featured: false,
    },
    {
      slug: "sentiment-analysis",
      titleEn: "Arabic Sentiment & Fake Review Classifier",
      titleAr: "تصنيف المشاعر والتقييمات المزيفة باللغة العربية",
      descriptionEn: "Fine-tuned CAMeL-BERT and BiLSTM sentiment classifier deployed as a real-time inference service using FastAPI.",
      descriptionAr: "تصنيف المشاعر المعتمد على ضبط دقة CAMeL-BERT و BiLSTM المنشور كخدمة استدلال فوري باستخدام FastAPI.",
      githubUrl: "https://github.com/Bashar-1216/Fake-Review-Detection",
      featured: false,
    },
  ];

  for (const proj of projects) {
    await prisma.project.upsert({
      where: { slug: proj.slug },
      update: proj,
      create: proj,
    });
  }
  console.log("Actual Projects seeded successfully.");
}

async function main() {
  console.log("Starting seed database with Bashar Almuntaser's CV...");

  // WIPE existing placeholder records first to avoid stale entries
  await prisma.experience.deleteMany({});
  await prisma.project.deleteMany({});
  console.log("Stale experiences and projects cleared.");

  const admin = await prisma.user.upsert({
    where: { email: "owner@bashar.ai" },
    update: {},
    create: {
      email: "owner@bashar.ai",
      name: "Bashar Almuntaser",
      role: "ADMIN",
    },
  });
  console.log("Admin user seeded:", admin.name);

  await seedExperiences();
  await seedProjects();

  console.log("Database seed completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
