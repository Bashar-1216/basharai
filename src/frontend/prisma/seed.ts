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

async function seedEducation() {
  // Clear old education entries first
  await prisma.education.deleteMany({});

  const educationList = [
    {
      institutionEn: "Emirates International University",
      institutionAr: "الجامعة الإماراتية الدولية",
      degreeEn: "Bachelor of Science in Computer Science & Artificial Intelligence",
      degreeAr: "بكالوريوس علوم الحاسوب والذكاء الاصطناعي",
      fieldEn: "Artificial Intelligence & Computer Science",
      fieldAr: "الذكاء الاصطناعي وعلوم الحاسوب",
      startYear: 2022,
      endYear: 2026,
      gpa: "87.62% (Very Good / جيد جداً)",
      highlightsEn: [
        "Cumulative Grade: 87.62% (Very Good / جيد جداً)",
        "Specialized in Artificial Intelligence, LLM Systems, and Machine Learning",
        "Graduation Project: SAPA — Smart Amazon Product Analyzer (AI Demand Forecasting & Review Sentiment Pipeline)"
      ],
      highlightsAr: [
        "المعدل التراكمي النهائي: 87.62% (بتقدير جيد جداً)",
        "التخصص في الذكاء الاصطناعي، أنظمة النماذج اللغوية الكبيرة، والتعلم الآلي",
        "مشروع التخرج: SAPA — المحلل الذكي لمنتجات أمازون (التنبؤ بالطلب وتحليل المشاعر وتصفية المراجعات)"
      ],
      sortOrder: 1,
    },
  ];

  for (const edu of educationList) {
    const existing = await prisma.education.findFirst({
      where: { institutionEn: edu.institutionEn },
    });
    if (existing) {
      await prisma.education.update({
        where: { id: existing.id },
        data: edu,
      });
    } else {
      await prisma.education.create({
        data: edu,
      });
    }
  }
  console.log("Education seeded successfully.");
}

async function seedProjectMetrics() {
  const metricsData = [
    {
      projectSlug: "geo-platform",
      metrics: [
        { metricName: "Pipeline Tasks", metricValue: 8, metricUnit: "stages", metricContext: "async BullMQ Python workers", displayOrder: 1 },
        { metricName: "Trigram Entity Accuracy", metricValue: 78.5, metricUnit: "%", metricContext: "bilingual Gulf Arabic/English entity resolution", displayOrder: 2 },
        { metricName: "Model Evaluation Runs", metricValue: 50, metricUnit: "runs", metricContext: "canary monitoring & McNemar tests", displayOrder: 3 },
      ],
    },
    {
      projectSlug: "sapa",
      metrics: [
        { metricName: "Demand Forecast MAE", metricValue: 4.2, metricUnit: "%", metricContext: "LightGBM 90-day Amazon product sales prediction", displayOrder: 1 },
        { metricName: "TimescaleDB Query Speedup", metricValue: 24, metricUnit: "x", metricContext: "compared to standard Postgres table range queries", displayOrder: 2 },
        { metricName: "Toxicity Detection F1", metricValue: 92.1, metricUnit: "%", metricContext: "LLaMA-3 & BERT hybrid review analysis", displayOrder: 3 },
      ],
    },
    {
      projectSlug: "arabic-sentiment-analysis",
      metrics: [
        { metricName: "F1 Score", metricValue: 91.4, metricUnit: "%", metricContext: "macro-averaged on ASTD Arabic test set", displayOrder: 1 },
        { metricName: "Inference Latency", metricValue: 38, metricUnit: "ms", metricContext: "p95, FastAPI, batch size 1", displayOrder: 2 },
        { metricName: "Dataset Size", metricValue: 12400, metricUnit: "docs", metricContext: "5-fold CV labeled Arabic social reviews", displayOrder: 3 },
      ],
    },
    {
      projectSlug: "real-time-driver-monitoring-system",
      metrics: [
        { metricName: "Frame Rate", metricValue: 30, metricUnit: "FPS", metricContext: "multithreaded OpenCV + MediaPipe pipeline", displayOrder: 1 },
        { metricName: "Inference Latency", metricValue: 28, metricUnit: "ms", metricContext: "real-time EAR calculation per frame", displayOrder: 2 },
        { metricName: "Classification Accuracy", metricValue: 94.8, metricUnit: "%", metricContext: "eye aspect ratio alertness trigger", displayOrder: 3 },
      ],
    },
    {
      projectSlug: "financial-fraud-detection",
      metrics: [
        { metricName: "Precision", metricValue: 94.2, metricUnit: "%", metricContext: "held-out test set of 284,807 transactions", displayOrder: 1 },
        { metricName: "Recall", metricValue: 89.7, metricUnit: "%", metricContext: "anomalous financial transaction bursts", displayOrder: 2 },
        { metricName: "Kafka Throughput", metricValue: 15000, metricUnit: "tx/s", metricContext: "real-time PySpark streaming pipeline", displayOrder: 3 },
      ],
    },
    {
      projectSlug: "fake-review-detection",
      metrics: [
        { metricName: "Cross-Domain Accuracy", metricValue: 88.6, metricUnit: "%", metricContext: "domain-adversarial transformer classifier", displayOrder: 1 },
        { metricName: "Detection Latency", metricValue: 45, metricUnit: "ms", metricContext: "FastAPI REST API inference endpoint", displayOrder: 2 },
        { metricName: "Training Corpus", metricValue: 25000, metricUnit: "reviews", metricContext: "multi-category e-commerce reviews", displayOrder: 3 },
      ],
    },
  ];

  for (const item of metricsData) {
    const project = await prisma.project.findUnique({
      where: { slug: item.projectSlug },
    });
    if (!project) continue;

    for (const m of item.metrics) {
      const existing = await prisma.projectMetric.findFirst({
        where: { projectId: project.id, metricName: m.metricName },
      });
      if (existing) {
        await prisma.projectMetric.update({
          where: { id: existing.id },
          data: {
            metricValue: m.metricValue,
            metricUnit: m.metricUnit,
            metricContext: m.metricContext,
            displayOrder: m.displayOrder,
          },
        });
      } else {
        await prisma.projectMetric.create({
          data: {
            projectId: project.id,
            metricName: m.metricName,
            metricValue: m.metricValue,
            metricUnit: m.metricUnit,
            metricContext: m.metricContext,
            displayOrder: m.displayOrder,
          },
        });
      }
    }
  }
  console.log("Project metrics seeded successfully.");
}

async function main() {
  console.log("Updating database with clean projects, experiences, education, and metrics...");
  await seedExperiences();
  await seedProjects();
  await seedEducation();
  await seedProjectMetrics();
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
