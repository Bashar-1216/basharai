import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { db } from "@/lib/db";
import styles from "./project-detail.module.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ProjectDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

interface CaseStudySection {
  overview: string;
  problem: string;
  architecture: string;
  tradeoffs: string;
  evaluation: string;
  metrics: { label: string; val: string }[];
  lessons: string;
  knowledgeGraph: {
    experience: { title: string; url: string };
    dashboard: { title: string; url: string };
    blog: { title: string; url: string };
  };
}

const studiesEn: Record<string, CaseStudySection> = {
  "geo-platform": {
    overview: "Designed and implemented an 8-stage asynchronous AI analysis pipeline executing structured prompt workflows across GPT-4, Claude, Gemini, and Perplexity using a Python worker architecture with Redis task queues.",
    problem: "Real-time competitor feature gap analysis and brand mention tracking under high token cost conditions.",
    architecture: "Next.js (BFF) ➔ NestJS Backend ➔ Python Workers (Celery/BullMQ) ➔ PostgreSQL trigram search.",
    tradeoffs: "Leveraged pg_trgm indexing instead of heavy ML semantic search to keep the bilingual Arabic/English entity resolution extremely lightweight, achieving 70-80% accuracy for Gulf entities.",
    evaluation: "Implemented canary entity monitoring and McNemar's statistical significance tests (min 50 runs per model run).",
    metrics: [
      { label: "Pipeline Stages", val: "8 Tasks" },
      { label: "Trigram Accuracy", val: "70-80% 🟢" },
      { label: "Observability", val: "Langfuse" }
    ],
    lessons: "Structured output constraints (Pydantic schema validation) prevent downstream pipeline breakdowns.",
    knowledgeGraph: {
      experience: { title: "GEO Project Lead", url: "/experience/geo-platform" },
      dashboard: { title: "Telemetry Dashboard", url: "/dashboard" },
      blog: { title: "How I built this platform", url: "/blog/portfolio-build" }
    }
  },
  sapa: {
    overview: "Engineered a five-indicator product scoring engine combining LightGBM demand forecasting with a hybrid BERT and LLaMA-3 NLP pipeline (via Ollama) for review toxicity detection.",
    problem: "Processing bulk reviews and determining institutional ROI demand scores under configurable margin thresholds.",
    architecture: "React ➔ FastAPI ➔ TimescaleDB (Time-series) ➔ Elasticsearch ➔ LLaMA-3 (Ollama local inference).",
    tradeoffs: "Opted for time-series optimized TimescaleDB over vanilla Postgres to keep tracking of high-frequency Amazon product pricing history under low memory requirements.",
    evaluation: "Automated review toxicity validations compared against human rating baselines.",
    metrics: [
      { label: "Containers Deployed", val: "8 Services" },
      { label: "NLP Models", val: "LLaMA-3 & BERT" },
      { label: "Demand Prediction", val: "LightGBM" }
    ],
    lessons: "TimescaleDB hypertable setups make scaling pricing data pipelines extremely fast and memory-efficient.",
    knowledgeGraph: {
      experience: { title: "SAPA ML Engineer", url: "/experience/sapa" },
      dashboard: { title: "Telemetry Metrics", url: "/dashboard" },
      blog: { title: "Processing reviews in bulk", url: "/blog/nlp-testing" }
    }
  },
  "drowsiness-detection": {
    overview: "Built a real-time drowsiness detection pipeline using OpenCV and MediaPipe FaceMesh to classify driver alertness.",
    problem: "Classifying driver fatigue and position deviance without causing UI or video inference delays.",
    architecture: "Camera Feed ➔ OpenCV Frame Parsing ➔ MediaPipe FaceMesh (EAR calculations) ➔ Multithreaded Speech Alerting.",
    tradeoffs: "Used multithreaded non-blocking Python loops instead of sequential frame executions to ensure video frames render at a stable 30fps while audio speech runs in parallel.",
    evaluation: "Validated Eye Aspect Ratio (EAR) accuracy thresholds across varying lighting environments.",
    metrics: [
      { label: "Frame Rate", val: "30 FPS 🟢" },
      { label: "Model Used", val: "MediaPipe Mesh" },
      { label: "Latency", val: "<30ms" }
    ],
    lessons: "Multithreading video and audio processing is mandatory to keep real-time inference pipelines fluid.",
    knowledgeGraph: {
      experience: { title: "CV Safety Engineer", url: "/experience/drowsiness-detection" },
      dashboard: { title: "Telemetry Dashboard", url: "/dashboard" },
      blog: { title: "Real-time CV pipelines", url: "/blog/nlp-testing" }
    }
  },
  "fraud-detection": {
    overview: "Built an end-to-end fraud detection pipeline using PySpark and ensemble machine learning models to classify anomalous transactions.",
    problem: "Detecting malicious transaction bursts in high throughput data channels.",
    architecture: "Transaction Stream ➔ Apache Kafka ➔ PySpark Processing ➔ MongoDB Storage ➔ Scikit-learn Classifier.",
    tradeoffs: "Selected PySpark over pandas to process historical transaction logs containing millions of rows, preparing feature pipelines in parallel.",
    evaluation: "Evaluated Random Forests and XGBoost outputs using F1-score and confusion matrix runs.",
    metrics: [
      { label: "Throughput", val: "10k msg/s" },
      { label: "Database", val: "MongoDB" },
      { label: "Model", val: "Random Forest" }
    ],
    lessons: "Kafka partitioning is crucial to ensure high throughput analytics scalability.",
    knowledgeGraph: {
      experience: { title: "PySpark Developer", url: "/experience/fraud-detection" },
      dashboard: { title: "Telemetry Dashboard", url: "/dashboard" },
      blog: { title: "Big Data Pipelines", url: "/blog/nlp-testing" }
    }
  },
  "sentiment-analysis": {
    overview: "Fine-tuned CAMeL-BERT and BiLSTM architectures for domain-specific Arabic sentiment classification and fake review detection.",
    problem: "Classifying colloquial social media reviews and filtering out fake reviewers.",
    architecture: "Raw Arabic Text ➔ pyarabic Normalizer ➔ CAMeL-BERT Fine-Tuning ➔ FastAPI REST Endpoint.",
    tradeoffs: "Selected CAMeL-BERT instead of general multilingual BERT to capture regional Arabic dialects and NER tags with high precision.",
    evaluation: "Regression tests comparing custom transformer classifications against human baseline annotations.",
    metrics: [
      { label: "Model", val: "CAMeL-BERT" },
      { label: "Accuracy", val: "91% 🟢" },
      { label: "Serving", val: "FastAPI" }
    ],
    lessons: "Pre-processing steps (Arabic normalization, diacritics removal) determine more than 50% of the classification success.",
    knowledgeGraph: {
      experience: { title: "Arabic NLP Lead", url: "/experience/sentiment-analysis" },
      dashboard: { title: "Telemetry Dashboard", url: "/dashboard" },
      blog: { title: "Bilingual NLP pipelines", url: "/blog/portfolio-build" }
    }
  }
};

const studiesAr: Record<string, CaseStudySection> = {
  "geo-platform": {
    overview: "تصميم وتنفيذ خط معالجة تحليلي غير متزامن مكون من 8 مراحل ينفذ قوالب موجهات مهيكلة عبر GPT-4 و Claude و Gemini و Perplexity.",
    problem: "تحليل الفجوات الميزاتية ومراقبة الهلوسة للنماذج اللغوية المتعددة في الوقت الفعلي.",
    architecture: "Next.js (BFF) ➔ NestJS Backend ➔ Python Workers (Celery/BullMQ) ➔ PostgreSQL trigram search.",
    tradeoffs: "استخدام فهرسة pg_trgm لربط ومطابقة الكيانات ثنائية اللغة لأسواق الخليج بدقة 70-80% دون استهلاك موارد المعالجة الدلالية المعقدة.",
    evaluation: "تفعيل سجل تتبع مراقبة انحراف النماذج واختبارات McNemar الإحصائية (بحد أدنى 50 دورة تشغيل).",
    metrics: [
      { label: "مراحل المعالجة", val: "8 مهام" },
      { label: "دقة مطابقة الكيانات", val: "70-80% 🟢" },
      { label: "المراقبة والملاحظة", val: "Langfuse" }
    ],
    lessons: "التحقق المسبق من المخرجات عبر مخططات Pydantic يمنع تعطل خطوط المعالجة غير المتزامنة.",
    knowledgeGraph: {
      experience: { title: "قائد مشروع منصة GEO", url: "/experience/geo-platform" },
      dashboard: { title: "لوحة تحليلات المراقبة", url: "/dashboard" },
      blog: { title: "كيف بنيت هذا النظام؟", url: "/blog/portfolio-build" }
    }
  },
  sapa: {
    overview: "تطوير محرك تقييم منتجات ذو خمس مؤشرات يدمج توقعات الطلب بـ LightGBM مع خط أنابيب NLP هجين BERT و LLaMA-3 للكشف عن سمية المراجعات.",
    problem: "معالجة مراجعات منتجات أمازون الضخمة وتوقيت هوامش الربح تحت معايير استثمارية مخصصة.",
    architecture: "React ➔ FastAPI ➔ TimescaleDB (Time-series) ➔ Elasticsearch ➔ LLaMA-3 (Ollama local inference).",
    tradeoffs: "اختيار TimescaleDB بدلاً من Postgres الافتراضي لتخزين تحليلات الأسعار عالية التردد بأقل حجم ذاكرة مستهلك.",
    evaluation: "تشغيل تصنيف سمية المراجعات ومقارنة النتائج مقابل مراجعات المدققين البشريين.",
    metrics: [
      { label: "حاويات التشغيل", val: "8 خدمات" },
      { label: "النماذج اللغوية", val: "LLaMA-3 & BERT" },
      { label: "توقع الطلب", val: "LightGBM" }
    ],
    lessons: "توزيع جداول TimescaleDB يجعل توسيع وتتبع بيانات الأسعار فعالاً وسريعاً للغاية.",
    knowledgeGraph: {
      experience: { title: "مهندس تعلم آلي SAPA", url: "/experience/sapa" },
      dashboard: { title: "تحليلات المراقبة", url: "/dashboard" },
      blog: { title: "تحليل التعليقات الضخمة", url: "/blog/nlp-testing" }
    }
  },
  "drowsiness-detection": {
    overview: "بناء خط معالجة لحظي للكشف عن النعاس باستخدام OpenCV و MediaPipe FaceMesh لتصنيف يقظة السائق.",
    problem: "تصنيف تعيق السائق وحركته دون إعاقة سرعة استدلال النموذج البصري.",
    architecture: "Camera Feed ➔ OpenCV Frame Parsing ➔ MediaPipe FaceMesh (EAR calculations) ➔ Multithreaded Speech Alerting.",
    tradeoffs: "استخدام الحلقات المتوازية (Multithreaded) بدلاً من معالجة الإطارات المتسلسلة لضمان تشغيل الفيديو بمعدل 30 إطاراً في الثانية دون انقطاع.",
    evaluation: "التحقق من حساسية معدلات فتح العين عبر إضاءات بيئية مختلفة.",
    metrics: [
      { label: "معدل الإطارات", val: "30 FPS 🟢" },
      { label: "النموذج المستخدم", val: "MediaPipe Mesh" },
      { label: "زمن الاستجابة", val: "<30ms" }
    ],
    lessons: "المعالجة المتوازية للفيديو والصوت هي الحل الوحيد للحفاظ على سرعة أنظمة الاستدلال الحية.",
    knowledgeGraph: {
      experience: { title: "مهندس رؤية حاسوبية", url: "/experience/drowsiness-detection" },
      dashboard: { title: "لوحة تحليلات المراقبة", url: "/dashboard" },
      blog: { title: "أنظمة الرؤية اللحظية", url: "/blog/nlp-testing" }
    }
  },
  "fraud-detection": {
    overview: "بناء خط معالجة متكامل لكشف الاحتيال باستخدام PySpark ونماذج التعلم الآلي لتصنيف المعاملات المالية غير العادية.",
    problem: "كشف المعاملات المالية المشبوهة وسط تدفقات معاملات ضخمة وبلحظات سريعة.",
    architecture: "Transaction Stream ➔ Apache Kafka ➔ PySpark Processing ➔ MongoDB Storage ➔ Scikit-learn Classifier.",
    tradeoffs: "استخدام PySpark على pandas لمعالجة وتحضير الميزات لآلاف المعاملات المالية التاريخية بشكل متوازي.",
    evaluation: "تقييم أداء نماذج Random Forests و XGBoost باستخدام مقاييس F1-score ودقة التصنيف.",
    metrics: [
      { label: "معدل البث", val: "10k رسالة/ث" },
      { label: "قاعدة البيانات", val: "MongoDB" },
      { label: "نموذج التصنيف", val: "Random Forest" }
    ],
    lessons: "تقسيم مواضيع Kafka ضروري للحفاظ على موثوقية استيعاب تدفق البيانات الكبيرة.",
    knowledgeGraph: {
      experience: { title: "مطور أنظمة PySpark", url: "/experience/fraud-detection" },
      dashboard: { title: "تحليلات المراقبة", url: "/dashboard" },
      blog: { title: "معالجة البيانات الكبيرة", url: "/blog/nlp-testing" }
    }
  },
  "sentiment-analysis": {
    overview: "ضبط دقة نماذج CAMeL-BERT و BiLSTM لتصنيف المشاعر العربية في مجالات محددة وكشف التقييمات المزيفة.",
    problem: "تصنيف مشاعر اللهجات العامية وتصفية المعلقين الوهميين بكفاءة عالية.",
    architecture: "Raw Arabic Text ➔ pyarabic Normalizer ➔ CAMeL-BERT Fine-Tuning ➔ FastAPI REST Endpoint.",
    tradeoffs: "اختيار نموذج CAMeL-BERT بدلاً من BERT الافتراضي لالتقاط قواعد اللهجات العربية والكيانات المسماة بدقة فائقة.",
    evaluation: "مقارنة دقة تصنيف النموذج المخصص بالنتائج الموثقة من المدققين البشريين.",
    metrics: [
      { label: "النموذج", val: "CAMeL-BERT" },
      { label: "دقة التصنيف", val: "91% 🟢" },
      { label: "النشر", val: "FastAPI" }
    ],
    lessons: "مرحلة معالجة وتنسيق النصوص العربية (التقطيع والتشكيل والتطهير) تمثل أكثر من 50% من نجاح جودة التصنيف.",
    knowledgeGraph: {
      experience: { title: "مهندس معالجة لغة طبيعية", url: "/experience/sentiment-analysis" },
      dashboard: { title: "لوحة تحليلات المراقبة", url: "/dashboard" },
      blog: { title: "معالجة اللغة الطبيعية", url: "/blog/portfolio-build" }
    }
  }
};

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { locale, slug } = await params;
  const dict = await getDictionary(locale as Locale);

  const project = await db.project.findUnique({
    where: { slug }
  });

  if (!project) {
    notFound();
  }

  const isAr = locale === "ar";
  const key = slug.toLowerCase();
  const study = isAr ? studiesAr[key] : studiesEn[key];

  if (!study) {
    notFound();
  }

  return (
    <>
      <Navbar dict={dict} locale={locale as Locale} />
      <main className={styles.main}>
        <div className="container">
          <Link href={`/${locale}/projects`} className={styles.backBtn}>
            ← {isAr ? "العودة للمشاريع" : "Back to Projects"}
          </Link>

          <header className={styles.header}>
            <span className={styles.meta}>CASE STUDY // {slug.toUpperCase().replace("-", " ")}</span>
            <h1 className={styles.title}>{isAr ? project.titleAr : project.titleEn}</h1>
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.gitLink}>
                GitHub Repository ↗
              </a>
            )}
          </header>

          <div className={styles.sheet}>
            {/* 1. Overview */}
            <section className={styles.section}>
              <h2>[1. Overview & Goal]</h2>
              <p>{study.overview}</p>
            </section>

            {/* 2. Problem */}
            <section className={styles.section}>
              <h2>[2. Problem Domain]</h2>
              <p>{study.problem}</p>
            </section>

            {/* 3. Architecture */}
            <section className={styles.section}>
              <h2>[3. Architecture & Path]</h2>
              <div className={styles.codeBlock}>
                <code>{study.architecture}</code>
              </div>
            </section>

            {/* 4. Trade-offs */}
            <section className={styles.section}>
              <h2>[4. Trade-offs & Decisions]</h2>
              <p>{study.tradeoffs}</p>
            </section>

            {/* 5. Evaluation */}
            <section className={styles.section}>
              <h2>[5. Evaluation Method]</h2>
              <p>{study.evaluation}</p>
            </section>

            {/* 6. Metrics */}
            <section className={styles.section}>
              <h2>[6. Quality Metrics]</h2>
              <div className={styles.metricsGrid}>
                {study.metrics.map((m, i) => (
                  <div key={i} className={styles.metricCard}>
                    <span>{m.label}</span>
                    <strong>{m.val}</strong>
                  </div>
                ))}
              </div>
            </section>

            {/* 7. Lessons */}
            <section className={styles.section}>
              <h2>[7. Lessons Learned]</h2>
              <p>{study.lessons}</p>
            </section>

            {/* ── Knowledge Graph ─────────────────────────────── */}
            <footer className={styles.kgFooter}>
              <h3>🌐 KNOWLEDGE GRAPH (RELATED ITEMS)</h3>
              <div className={styles.kgGrid}>
                <div className={styles.kgNode}>
                  <span>Experience context:</span>
                  <Link href={study.knowledgeGraph.experience.url}>
                    {study.knowledgeGraph.experience.title} ➔
                  </Link>
                </div>
                <div className={styles.kgNode}>
                  <span>Performance observability:</span>
                  <Link href={study.knowledgeGraph.dashboard.url}>
                    {study.knowledgeGraph.dashboard.title} ➔
                  </Link>
                </div>
                <div className={styles.kgNode}>
                  <span>Technical blog article:</span>
                  <Link href={study.knowledgeGraph.blog.url}>
                    {study.knowledgeGraph.blog.title} ➔
                  </Link>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </main>
      <Footer dict={dict} />
    </>
  );
}
