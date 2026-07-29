import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { db } from "@/lib/db";
import styles from "./experience-detail.module.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ExperienceDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

interface DetailSection {
  overview: string;
  problem: string;
  role: string;
  challenges: string;
  impact: string;
  technologies: string;
  learned: string;
  faq: { q: string; a: string }[];
}

const detailsEn: Record<string, DetailSection> = {
  "geo-platform": {
    overview: "Designed and implemented an 8-stage asynchronous AI analysis pipeline executing structured prompt workflows across GPT-4, Claude, Gemini, and Perplexity using a Python worker architecture with Redis task queues.",
    problem: "Real-time competitor feature gap analysis and hallucination monitoring across multiple LLMs.",
    role: "Solo ML Engineer, designing the async task queuing logic and the entity resolution engine.",
    challenges: "Resolving bilingual Arabic/English entities using custom Unicode normalization, legaleses suffix stripping, and pg_trgm indexing.",
    impact: "Established prompt version control, model drift canaries, and Langfuse observability tracking.",
    technologies: "Python, NestJS, Next.js, PostgreSQL, Redis, Docker, Langfuse.",
    learned: "Multi-model LLM orchestration requires strict schema validation and structured prompts output control.",
    faq: [
      { q: "What statistical tests did you use?", a: "We enforced McNemar's test (minimum 50 runs per entity per model) to guarantee statistical significance." }
    ]
  },
  sapa: {
    overview: "Engineered a five-indicator product scoring engine combining LightGBM demand forecasting with a hybrid BERT and LLaMA-3 NLP pipeline (via Ollama) for review toxicity detection.",
    problem: "Processing bulk Amazon product reviews and estimating ROI margin limits dynamically.",
    role: "Solo Full-Stack ML Engineer, designing the HHI index calculator and review analysis pipelines.",
    challenges: "Building an automated Margin Kill-Switch that rejects investment opportunities when net ROI falls below critical targets.",
    impact: "Successfully containerized an 8-container microservices compose stack deployed on Linux servers.",
    technologies: "Python, FastAPI, React, TimescaleDB, Elasticsearch, LLaMA-3, LightGBM.",
    learned: "TimescaleDB is extremely efficient for handling high-frequency time-series product telemetry.",
    faq: [
      { q: "How did you implement review toxicity checks?", a: "Using custom BERT classifiers fine-tuned for customer feedback validation." }
    ]
  },
  "drowsiness-detection": {
    overview: "Built a real-time drowsiness detection pipeline using OpenCV and MediaPipe FaceMesh to analyze Eye Aspect Ratio (EAR) and facial landmark geometry for driver alertness classification.",
    problem: "Detecting fatigue positional drift before critical driver impairment occurs in real-time.",
    role: "Solo ML Engineer, developing landmark geometry and 3D pose estimation filters.",
    challenges: "Running concurrent video loops, audio alerts, and voice actions without blocking the core inference thread.",
    impact: "Achieved non-blocking multithreaded edge video/audio loop execution.",
    technologies: "Python, OpenCV, MediaPipe, SpeechRecognition, pyttsx3.",
    learned: "Temporal state tracking reduces false positive drowsiness triggers significantly.",
    faq: [
      { q: "How did you monitor head posture?", a: "Through 3D pose estimation and deviance calculations from center alignment." }
    ]
  },
  "fraud-detection": {
    overview: "Built an end-to-end fraud detection pipeline using PySpark and ensemble machine learning models to classify anomalous financial transactions.",
    problem: "Handling high-velocity transaction streams and identifying anomalies with low false-positive rates.",
    role: "ML Engineer, engineering transaction features and modeling fraud anomaly scores.",
    challenges: "Managing real-time streaming data synchronization between Kafka topics and MongoDB.",
    impact: "Established real-time Kafka simulation pipeline with PySpark classification nodes.",
    technologies: "Python, PySpark, Apache Kafka, MongoDB, Scikit-learn.",
    learned: "Kafka partitioning is crucial to ensure high throughput analytics scalability.",
    faq: [
      { q: "Which models performed best?", a: "Ensemble trees (Random Forests & XGBoost) yielded the highest F1-scores." }
    ]
  },
  "sentiment-analysis": {
    overview: "Fine-tuned CAMeL-BERT and BiLSTM architectures for domain-specific Arabic sentiment classification and fake review detection.",
    problem: "Identifying fake reviews and social media dialects in Arabic NLP contexts.",
    role: "ML Engineer, developing preprocessing pipelines and fine-tuning transformer checkpoints.",
    challenges: "Handling domain generalization across cross-category social datasets.",
    impact: "Deployed real-time inference NLP services using FastAPI.",
    technologies: "Python, CAMeL-BERT, BiLSTM, Hugging Face, FastAPI.",
    learned: "Unicode normalization and pyarabic dialect parsing are mandatory for high-quality Arabic NLP.",
    faq: [
      { q: "Why use CAMeL-BERT?", a: "It provides superior performance on dialectal Arabic Named Entity Recognition (NER)." }
    ]
  }
};

const detailsAr: Record<string, DetailSection> = {
  "geo-platform": {
    overview: "تصميم وتنفيذ خط معالجة غير متزامن مكون من 8 مراحل لتحليل البيانات البرمجية ومطابقتها عبر نماذج GPT-4 و Claude و Gemini و Perplexity باستخدام Redis.",
    problem: "مراقبة دقة الاستناد ومطابقة الفجوات التنافسية دلالياً في الوقت الفعلي.",
    role: "مهندس تعلم آلي رئيسي، مسؤول عن مطابقة الكيانات وبناء طبقات تصفية الهلوسة.",
    challenges: "مطابقة الكيانات ثنائية اللغة لأسواق الخليج باستخدام Unicode normalization وفهرسة pg_trgm.",
    impact: "تطوير أنظمة ضبط الموجهات وكشف الانحراف ومراقبة التكاليف عبر Langfuse.",
    technologies: "Python, NestJS, Next.js, PostgreSQL, Redis, Docker, Langfuse.",
    learned: "تطوير النماذج المتعددة يتطلب التحقق المستمر من المخرجات عبر مخططات Pydantic الصارمة.",
    faq: [
      { q: "ما هي الاختبارات الإحصائية المستخدمة؟", a: "قمنا بفرض اختبار McNemar لضمان دقة النتائج الإحصائية بحد أدنى 50 دورة لكل كيان." }
    ]
  },
  sapa: {
    overview: "تطوير محرك تقييم منتجات ذو خمس مؤشرات يدمج توقعات الطلب بـ LightGBM مع خط أنابيب NLP هجين BERT و LLaMA-3 للكشف عن سمية المراجعات.",
    problem: "معالجة أعداد ضخمة من مراجعات أمازون وتوقع هوامش الربح بدقة تامة.",
    role: "مهندس تعلم آلي متكامل، مسؤول عن فحص المراجعات وتصنيف سمية النصوص.",
    challenges: "أتمتة مفتاح إيقاف الأرباح الهامشية الذي يرفض فرص الاستثمار عند انخفاض العائد الصافي عن النسب المستهدفة.",
    impact: "نشر بنية خوادم مدمجة من 8 حاويات Docker Compose تعمل بسلاسة على خوادم Linux.",
    technologies: "Python, FastAPI, React, TimescaleDB, Elasticsearch, LLaMA-3, LightGBM.",
    learned: "قاعدة بيانات TimescaleDB ممتازة لإدارة تحليلات السلاسل الزمنية للمنتجات البرمجية.",
    faq: [
      { q: "كيف تم فحص سمية التعليقات؟", a: "عبر ضبط تصنيفات نماذج BERT المخصصة لتقييم آراء الزوار واستخلاص العبارات السامة." }
    ]
  },
  "drowsiness-detection": {
    overview: "بناء خط معالجة لحظي للكشف عن النعاس باستخدام OpenCV و MediaPipe FaceMesh لتحليل معدل فتح العين ومعالم الوجه لتصنيف يقظة السائق.",
    problem: "كشف انحراف وضعية الرأس وعلامات التعب قبل حدوث أي عجز حقيقي للسائق.",
    role: "مهندس تعلم آلي، مسؤول عن معادلات EAR وتقدير وضعية الرأس ثلاثية الأبعاد.",
    challenges: "تشغيل بث الفيديو المزدوج والتنبيهات الصوتية دون التسبب في بطء الاستدلال البصري للنموذج.",
    impact: "تحقيق تشغيل متوازي بالكامل لمعالجة الفيديو دون إعاقة خط المعالجة الأساسي.",
    technologies: "Python, OpenCV, MediaPipe, SpeechRecognition, pyttsx3.",
    learned: "مراقبة الحالة المؤقتة (Temporal state tracking) تقلل التنبيهات الخاطئة للنعاس بشكل كبير.",
    faq: [
      { q: "كيف تم حساب انحراف الرأس؟", a: "عبر تقدير وضعية الرأس ثلاثية الأبعاد وحساب زاوية الانحراف عن المركز اللحظي." }
    ]
  },
  "fraud-detection": {
    overview: "بناء خط معالجة متكامل لكشف الاحتيال باستخدام PySpark ونماذج التعلم الآلي لتصنيف المعاملات المالية غير العادية.",
    problem: "التعامل مع تدفقات مالية سريعة وتحديد الأنشطة المشبوهة بنسب إنذار خاطئ متدنية.",
    role: "مهندس تعلم آلي، مسؤول عن استخلاص الميزات وتدريب نماذج كشف الشذوذ.",
    challenges: "ضمان تزامن تدفق البيانات اللحظية بين مواضيع Kafka وقاعدة بيانات MongoDB.",
    impact: "إنشاء محاكاة متكاملة لبث المعاملات عبر Kafka مع تصنيفها بواسطة PySpark.",
    technologies: "Python, PySpark, Apache Kafka, MongoDB, Scikit-learn.",
    learned: "تقسيم مواضيع Kafka (Partitioning) أمر أساسي لضمان كفاءة معالجة البيانات الكبيرة.",
    faq: [
      { q: "ما هي النماذج الأكثر دقة؟", a: "النماذج الشجرية مثل Random Forests و XGBoost حققت أعلى مقاييس F1-score." }
    ]
  },
  "sentiment-analysis": {
    overview: "ضبط دقة نماذج CAMeL-BERT و BiLSTM لتصنيف المشاعر العربية في مجالات محددة وكشف التقييمات المزيفة.",
    problem: "التعرف على التقييمات المزيفة واللهجات الدارجة في نصوص وسائل التواصل الاجتماعي العربية.",
    role: "مهندس تعلم آلي، مسؤول عن خطوط المعالجة المسبقة للمفردات وضبط النماذج المحولة.",
    challenges: "ضمان تعميم النماذج (Generalization) للعمل عبر مجالات وتصنيفات نصوص مختلفة.",
    impact: "نشر واجهات برمجية للاستدلال اللحظي في الوقت الفعلي باستخدام FastAPI.",
    technologies: "Python, CAMeL-BERT, BiLSTM, Hugging Face, FastAPI.",
    learned: "التنسيق الموحد (Unicode normalization) ومكتبات pyarabic هما الأساس لمعالجة طبيعية ناجحة للغة العربية.",
    faq: [
      { q: "لماذا تم اختيار CAMeL-BERT؟", a: "لأنه يقدم أداءً فائقاً في التعرف على الكيانات المسماة (NER) للهجات العربية." }
    ]
  }
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ExperienceDetailPage({ params }: ExperienceDetailPageProps) {
  const { locale, slug } = await params;
  const dict = await getDictionary(locale as Locale);
  const isAr = locale === "ar";
  const decodedSlug = decodeURIComponent(slug).toLowerCase();

  const allExperiences = await db.experience.findMany({
    orderBy: { startDate: "desc" },
  });

  let experience = allExperiences.find((exp) => {
    const comp = exp.company.toLowerCase();
    if (decodedSlug.includes("geo") && comp.includes("geo")) return true;
    if (decodedSlug.includes("sapa") && comp.includes("sapa")) return true;
    if (decodedSlug.includes("drowsiness") && comp.includes("drowsiness")) return true;
    if (decodedSlug.includes("fraud") && comp.includes("fraud")) return true;
    if (decodedSlug.includes("sentiment") && comp.includes("sentiment")) return true;
    return comp === decodedSlug || comp.includes(decodedSlug) || decodedSlug.includes(comp);
  });

  if (!experience) {
    experience = allExperiences[0];
  }

  if (!experience) {
    notFound();
  }

  // Query dynamic project and case study from Prisma DB
  const project = await db.project.findFirst({
    where: {
      OR: [
        { slug: decodedSlug },
        { titleEn: { contains: experience.company, mode: "insensitive" } },
      ],
    },
    include: {
      caseStudy: true,
      metrics: true,
    },
  });

  const cs = project?.caseStudy;

  let matchedKey = "geo-platform";
  const compLower = experience.company.toLowerCase();
  if (compLower.includes("sapa")) matchedKey = "sapa";
  else if (compLower.includes("drowsiness")) matchedKey = "drowsiness-detection";
  else if (compLower.includes("fraud")) matchedKey = "fraud-detection";
  else if (compLower.includes("sentiment")) matchedKey = "sentiment-analysis";

  const staticFallback = (isAr ? detailsAr[matchedKey] : detailsEn[matchedKey]);

  const detail: DetailSection = {
    overview: cs ? (isAr ? (cs.architectureDescAr || cs.architectureDescEn || staticFallback?.overview) : (cs.architectureDescEn || staticFallback?.overview)) : (isAr ? experience.summaryAr : experience.summaryEn),
    problem: cs ? (isAr ? (cs.problemAr || cs.problemEn || staticFallback?.problem) : (cs.problemEn || staticFallback?.problem)) : staticFallback?.problem || "High-performance enterprise AI system delivery.",
    role: isAr ? experience.titleAr : experience.titleEn,
    challenges: cs ? (isAr ? (cs.challengesAr || cs.challengesEn || staticFallback?.challenges) : (cs.challengesEn || staticFallback?.challenges)) : staticFallback?.challenges || "Microservices containerization and real-time execution optimization.",
    impact: cs ? (isAr ? (cs.resultsAr || cs.resultsEn || staticFallback?.impact) : (cs.resultsEn || staticFallback?.impact)) : staticFallback?.impact || "Production release under strict latency SLA constraints.",
    technologies: staticFallback?.technologies || "Python, Next.js, PostgreSQL, Docker, Redis",
    learned: cs ? (isAr ? (cs.lessonsAr || cs.lessonsEn || staticFallback?.learned) : (cs.lessonsEn || staticFallback?.learned)) : staticFallback?.learned || "Component isolation and clean architecture.",
    faq: staticFallback?.faq || [{ q: "What was the key engineering takeaway?", a: "Production isolation and clean schema design." }]
  };


  return (
    <>
      <Navbar dict={dict} locale={locale as Locale} />
      <main className={styles.main}>
        <div className="container">
          <Link href={`/${locale}/experience`} className={styles.backBtn}>
            ← {isAr ? "العودة للخبرات" : "Back to Experience"}
          </Link>

          <header className={styles.header}>
            <span className={styles.company}>{experience.company}</span>
            <h1 className={styles.title}>{isAr ? experience.titleAr : experience.titleEn}</h1>
            <span className={styles.period}>
              {experience.startDate.getFullYear()} —{" "}
              {experience.isCurrent ? (isAr ? "الآن" : "Present") : experience.endDate?.getFullYear()}
            </span>
          </header>

          <div className={styles.contentGrid}>
            {/* Left: Deep Dive Sections */}
            <div className={styles.deepDive}>
              <section className={styles.section}>
                <h2>{isAr ? "1. نظرة عامة" : "1. Overview"}</h2>
                <p>{detail.overview}</p>
              </section>

              <section className={styles.section}>
                <h2>{isAr ? "2. طبيعة المشكلة" : "2. Problem Domain"}</h2>
                <p>{detail.problem}</p>
              </section>

              <section className={styles.section}>
                <h2>{isAr ? "3. دوري ومسؤولياتي" : "3. My Role"}</h2>
                <p>{detail.role}</p>
              </section>

              <section className={styles.section}>
                <h2>{isAr ? "4. التحديات التقنية" : "4. Technical Challenges"}</h2>
                <p>{detail.challenges}</p>
              </section>

              <section className={styles.section}>
                <h2>{isAr ? "5. الأثر المحقق" : "5. Impact & Metrics"}</h2>
                <p className={styles.impactHighlight}>{detail.impact}</p>
              </section>

              <section className={styles.section}>
                <h2>{isAr ? "6. التقنيات المستخدمة" : "6. Technologies"}</h2>
                <div className={styles.badgeList}>
                  {detail.technologies.split(", ").map((t) => (
                    <span key={t} className={styles.badge}>{t}</span>
                  ))}
                </div>
              </section>

              <section className={styles.section}>
                <h2>{isAr ? "7. ماذا تعلمت؟" : "7. What I Learned"}</h2>
                <p>{detail.learned}</p>
              </section>
            </div>

            {/* Right: FAQs */}
            <aside className={styles.sidebar}>
              <div className={styles.sidebarCard}>
                <h3>{isAr ? "الأسئلة الشائعة" : "Technical FAQ"}</h3>
                <div className={styles.faqList}>
                  {detail.faq.map((item, index) => (
                    <div key={index} className={styles.faqItem}>
                      <strong>Q: {item.q}</strong>
                      <p>A: {item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer dict={dict} />
    </>
  );
}
