import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedExperiences() {
  const experiences = [
    {
      company: "Amazon",
      titleEn: "AI & LLM Application Engineer",
      titleAr: "مهندس تطبيقات الذكاء الاصطناعي ونماذج اللغة الكبيرة",
      startDate: new Date("2024-06-01"),
      isCurrent: true,
      summaryEn: "Designed and deployed high-performance conversational RAG systems and LLM agent workflows within secure cloud environments. Optimized chunking strategies and HNSW vector indexing to reduce hallucination and latency in client queries.",
      summaryAr: "تصميم ونشر أنظمة توليد معزز بالاسترجاع (RAG) عالية الأداء وسير عمل عملاء LLM الذكية في بيئات سحابية مؤمنة. تحسين استراتيجيات التقطيع وفهرسة HNSW المتجهية لتقليل الهلوسة وزمن الاستجابة لاستعلامات الزوار.",
    },
    {
      company: "Grammarly",
      titleEn: "Software Engineer - AI Platform",
      titleAr: "مهندس برمجيات - منصة الذكاء الاصطناعي",
      startDate: new Date("2022-03-01"),
      endDate: new Date("2024-05-30"),
      isCurrent: false,
      summaryEn: "Scaled internal NLP inference APIs and optimized prompt caching mechanisms. Developed automated evaluation frameworks to monitor grammar and stylistic suggestion models across millions of daily active users.",
      summaryAr: "توسيع نطاق واجهات برمجة تطبيقات الاستدلال لـ NLP الداخلية وتحسين آليات التخزين المؤقت للموجهات. تطوير أطر تقييم مؤتمتة لمراقبة نماذج القواعد النحوية والاقتراحات الأسلوبية لماليين المستخدمين النشطين يومياً.",
    },
  ];

  for (const exp of experiences) {
    await prisma.experience.upsert({
      where: { company: exp.company },
      update: exp,
      create: exp,
    });
  }
  console.log("Base experiences seeded successfully.");
}

async function seedProjects() {
  const projects = [
    {
      slug: "bashar-ai",
      titleEn: "bashar.ai Platform Engine",
      titleAr: "محرك منصة bashar.ai",
      descriptionEn: "A bilingual AI engineering portfolio with RAG-powered assistant. Designed to serve visitors with high accuracy, low latency, and low operational cost.",
      descriptionAr: "محفظة هندسة ذكاء اصطناعي ثنائية اللغة مع مساعد تفاعلي RAG. صُمم ليخدم الزوار بدقة عالية وكمون منخفض وتكلفة تشغيلية اقتصادية.",
      githubUrl: "https://github.com/bashar-ai/platform",
      featured: true,
    },
    {
      slug: "eval-framework",
      titleEn: "LLM Evaluation Framework",
      titleAr: "إطار تقييم النماذج اللغوية",
      descriptionEn: "An automated evaluation pipeline that runs Golden Set regression tests to measure performance of retrieval systems using LLM-as-a-Judge methodology.",
      descriptionAr: "خط أنابيب تقييم آلي ينفذ اختبارات انحدار المجموعة الذهبية لقياس جودة أنظمة الاسترجاع باستخدام منهجية المقيّم اللغوي التلقائي.",
      githubUrl: "https://github.com/bashar-ai/eval-framework",
      featured: true,
    },
    {
      slug: "rag-pipeline",
      titleEn: "Production RAG Pipeline",
      titleAr: "خط أنابيب RAG الإنتاجي",
      descriptionEn: "Retrieval-Augmented Generation system with semantic chunking, HNSW vector indexing, hybrid BM25 + cosine similarity search.",
      descriptionAr: "نظام توليد معزز بالاسترجاع يتضمن تقطيع دلالي وفهرسة متجهات HNSW وبحث هجين BM25 + تشابه جيب التمام.",
      githubUrl: "https://github.com/bashar-ai/rag-pipeline",
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
  console.log("Base projects seeded successfully.");
}

async function main() {
  console.log("Starting seed database...");

  // 1. Seed Whitelisted Admin User
  const admin = await prisma.user.upsert({
    where: { email: "owner@bashar.ai" },
    update: {},
    create: {
      email: "owner@bashar.ai",
      name: "Bashar",
      role: "ADMIN",
    },
  });
  console.log("Admin user seeded:", admin.email);

  // 2. Seed Base Experiences (NDA-safe Amazon/Grammarly)
  await seedExperiences();

  // 3. Seed Base Project Outlines
  await seedProjects();

  console.log("Database seed completed successfully.");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
