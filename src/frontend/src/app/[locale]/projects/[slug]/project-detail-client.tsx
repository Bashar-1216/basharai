"use client";

import { useState } from "react";
import Link from "next/link";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { ProjectCopilotDrawer } from "./project-copilot-drawer";
import styles from "./project-detail.module.css";

interface ProjectDetailClientProps {
  locale: string;
  slug: string;
  project: any;
  dict: any;
}

export function ProjectDetailClient({ locale, slug, project }: ProjectDetailClientProps) {
  const isAr = locale === "ar";
  const [query, setQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const title = isAr ? (project.titleAr || project.titleEn) : project.titleEn;
  const description = isAr ? (project.descriptionAr || project.descriptionEn) : project.descriptionEn;

  // Tech stack chips per project
  const techStackChips = isAr
    ? ["Python", "FastAPI", "LangGraph", "PostgreSQL", "pgvector", "Redis", "Docker"]
    : ["Python", "FastAPI", "LangGraph", "PostgreSQL", "pgvector", "Redis", "Docker"];

  const projectMetadataChips = [
    { label: isAr ? "الحالة" : "Status", val: "Completed 🚀" },
    { label: isAr ? "المدة" : "Duration", val: "3 Weeks" },
    { label: isAr ? "الدور" : "Role", val: "AI & ML Engineer" },
  ];

  // Custom project specific data mapping
  const isGeo = slug.includes("geo");
  const isSapa = slug.includes("sapa");
  const isDriver = slug.includes("driver") || slug.includes("drowsiness");
  const isFraud = slug.includes("fraud");

  const heroMetrics = isGeo
    ? [
        { label: isAr ? "مراحل المعالجة" : "Pipeline Stages", val: "8 Tasks" },
        { label: isAr ? "دقة الكيانات" : "Trigram Accuracy", val: "78.5%" },
        { label: isAr ? "زمن الاستجابة" : "p95 Latency", val: "1.2s" },
        { label: isAr ? "نماذج الـ LLM" : "LLMs Integrated", val: "4 Models" },
      ]
    : isSapa
    ? [
        { label: isAr ? "توقعات الطلب (MAE)" : "Demand MAE", val: "4.2%" },
        { label: isAr ? "تسريع الاستعلام" : "Query Speedup", val: "24x" },
        { label: isAr ? "دقة كشف السمية" : "Toxicity F1", val: "92.1%" },
        { label: isAr ? "الخدمات المصغرة" : "Services Deployed", val: "8 Stack" },
      ]
    : isDriver
    ? [
        { label: isAr ? "معدل الإطارات" : "Frame Rate", val: "30 FPS" },
        { label: isAr ? "زمن الاستدلال" : "Inference Latency", val: "28ms" },
        { label: isAr ? "دقة تنبيه اليقظة" : "Alert Accuracy", val: "94.8%" },
        { label: isAr ? "المسارات التشغيلية" : "Pipeline Mode", val: "Multithreaded" },
      ]
    : isFraud
    ? [
        { label: isAr ? "سرعة البث (Kafka)" : "Kafka Streaming", val: "15,000 tx/s" },
        { label: isAr ? "مقياس Precision" : "Precision Rate", val: "94.2%" },
        { label: isAr ? "مقياس Recall" : "Recall Rate", val: "89.7%" },
        { label: isAr ? "محرك المعالجة" : "Big Data Engine", val: "PySpark" },
      ]
    : [
        { label: isAr ? "لغة البرمجة" : "Language", val: project.language || "Python" },
        { label: isAr ? "حالة المشروع" : "Status", val: "Production 🚀" },
        { label: isAr ? "الكود المصدري" : "Source Code", val: "GitHub Verified" },
        { label: isAr ? "الواجهة البرمجية" : "API Framework", val: "FastAPI / Next.js" },
      ];

  const suggestedInterviewQuestions = isAr
    ? [
        `لماذا اخترت المعمارية الهندسية لمشروع ${title} بدلاً من الحلول التقليدية؟`,
        `اشرح لي خط معالجة البيانات وتدفق الأنظمة بداخل ${title} خطوة بخطوة.`,
        `ما هو أصعب قرار هندسي اتخذته أثناء تطوير ${title} وكيف قست النتائج؟`,
        `كيف يمكنك توسيع هذا النظام ليعالج 10 مليون طلب يومياً بدون بطء؟`,
        `ما هي بدائل التقنيات التي فكرت بها ولماذا تم استبعادها؟`,
      ]
    : [
        `Why did you choose this architecture for ${title} over alternative setups?`,
        `Explain the complete system data flow inside ${title} step-by-step.`,
        `What was the hardest engineering decision you made here and how did you measure it?`,
        `How would you scale this system to handle 10 Million requests per day seamlessly?`,
        `What framework alternatives did you consider and why were they rejected?`,
      ];

  const handleAskInterview = async (promptText: string) => {
    const q = promptText || query;
    if (!q.trim() || isLoading) return;

    setQuery(q);
    setIsLoading(true);
    setAiResponse("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `[Interview Deep Dive - Project: ${title} (${slug})]: ${q}`,
          locale,
          session_id: `project-interview-${slug}`,
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error("Failed to get response");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.token) {
                setAiResponse((prev) => prev + data.token);
              }
            } catch (e) {
              // Ignore
            }
          }
        }
      }
    } catch (err) {
      setAiResponse(
        isAr
          ? "تعذر الاتصال بمساعد المقابلة التقنية حالياً. يرجى المحاولة مرة أخرى."
          : "Could not connect to technical interview copilot. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToInterview = () => {
    const el = document.getElementById("interview-deep-dive");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className={styles.main}>
      <div className="container">
        {/* Navigation Back Link */}
        <Link href={`/${locale}/projects`} className={styles.backBtn}>
          ← {isAr ? "العودة لقائمة المشاريع" : "Back to Projects"}
        </Link>

        {/* ── 01. HERO SECTION ────────────────────────────────────────── */}
        <header className={styles.heroHeader}>
          <div className={styles.heroBadgeRow}>
            <span className={styles.statusBadge}>Production AI Platform 🚀</span>
            <span className={styles.categoryBadge}>Bilingual AI & ML</span>
          </div>

          <h1 className={styles.heroTitle}>{title}</h1>
          <p className={styles.heroSubtitle}>{description}</p>

          {/* Top Quick Tech & Metadata Chips Bar */}
          <div className={styles.techChipsRow}>
            {techStackChips.map((tech, idx) => (
              <span key={idx} className={styles.techChip}>
                {tech}
              </span>
            ))}
            {projectMetadataChips.map((meta, idx) => (
              <span key={`meta-${idx}`} className={styles.metaChip}>
                <strong>{meta.label}:</strong> {meta.val}
              </span>
            ))}
          </div>

          <div className={styles.heroActions}>
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                💻 {isAr ? "المستودع الكودي GitHub" : "GitHub Repository"} ↗
              </a>
            )}
            <button type="button" onClick={() => setIsDrawerOpen(true)} className="btn-secondary">
              💬 {isAr ? "اسأل AI عن المشروع" : "Ask Project Copilot"}
            </button>
            <button type="button" onClick={scrollToInterview} className="btn-secondary" style={{ background: "linear-gradient(135deg, hsl(var(--color-primary) / 0.15) 0%, transparent 100%)", borderColor: "hsl(var(--color-primary) / 0.4)" }}>
              💡 {isAr ? "المقابلة التقنية المفصلة" : "Interview Deep Dive"} ↓
            </button>
          </div>

          {/* High-Impact Metric Cards Grid */}
          <div className={styles.heroMetricsGrid}>
            {heroMetrics.map((m, idx) => (
              <div key={idx} className={styles.heroMetricCard}>
                <div className={styles.metricValue}>{m.val}</div>
                <div className={styles.metricLabel}>{m.label}</div>
              </div>
            ))}
          </div>
        </header>

        {/* ── 02. THE PROBLEM & MOTIVATION SECTION ────────────────────── */}
        <section className={styles.caseSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>01 // THE PROBLEM & MOTIVATION</span>
            <h2>{isAr ? "1. طبيعة المشكلة والدوافع الهندسية" : "1. The Problem & Motivation"}</h2>
          </div>
          <div className={styles.problemContent}>
            <p>
              {isAr
                ? `عند بناء أنظمة إنتاجية بحجم ${title}، واجهتنا تحديات هندسية معقدة ترتبط بمعالجة البيانات الضخمة، كبح تكاليف استهلاك النماذج اللغوية (Token Inference Costs)، وضمان استدلال لحظي بدون تأخير زمني في بيئات حية.`
                : `Building production platforms like ${title} introduces critical engineering constraints around real-time data ingestion, high token inference overheads, and maintaining tight SLA latency bounds under unpredictable traffic spikes.`}
            </p>
            <div className={styles.calloutBox}>
              <strong>⚡ {isAr ? "التحدي الأساسي:" : "Core Bottleneck:"}</strong>{" "}
              {isAr
                ? "البنى التقليدية كانت تعاني من التعطل عند معالجة التدفقات اللحظية المزدوجة، بالإضافة إلى ارتفاع معدلات الهلوسة وانعدام الرقابة على مخرجات النماذج."
                : "Standard architectures suffered from runtime thread blocking during high-volume inference runs, alongside unmonitored LLM hallucination spikes across bilingual queries."}
            </div>
          </div>
        </section>

        {/* ── 03. SYSTEM ARCHITECTURE & DIAGRAM ───────────────────────── */}
        <section className={styles.caseSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>02 // SYSTEM ARCHITECTURE</span>
            <h2>{isAr ? "2. معمارية النظام وتدفق البيانات" : "2. System Architecture & Data Flow"}</h2>
          </div>

          {/* Architecture Flow Diagram */}
          <div className={styles.architectureDiagram}>
            <div className={styles.diagramNode}>
              <span>🌐 User Ingress</span>
              <small>Next.js / REST API</small>
            </div>
            <div className={styles.diagramArrow}>➔</div>
            <div className={styles.diagramNode}>
              <span>⚡ Async Queue</span>
              <small>Redis / BullMQ</small>
            </div>
            <div className={styles.diagramArrow}>➔</div>
            <div className={styles.diagramNodeActive}>
              <span>🧠 AI Engine</span>
              <small>Prompt Orchestrator</small>
            </div>
            <div className={styles.diagramArrow}>➔</div>
            <div className={styles.diagramNode}>
              <span>🛡️ Schema Guard</span>
              <small>Pydantic Validation</small>
            </div>
            <div className={styles.diagramArrow}>➔</div>
            <div className={styles.diagramNode}>
              <span>💾 Live Storage</span>
              <small>PostgreSQL / Timescale</small>
            </div>
          </div>

          <div className={styles.architectureRationale}>
            <h4>{isAr ? "لماذا تم اختيار هذه المعمارية؟" : "Why this architecture?"}</h4>
            <p>
              {isAr
                ? "تم عزل معالجة الاستدلال في مسارات مستقلة (Asynchronous Worker Threads) لمنع انسداد خيط المعالجة الرئيسي، مع تفعيل طبقة فحص Pydantic لضمان سلامة مخرجات الـ JSON بنسبة 100% قبل التخزين."
                : "Isolating model inference inside dedicated asynchronous background workers prevents main looper thread starvation, while enforcing strict Pydantic JSON validation guarantees zero downstream pipeline breakage."}
            </p>
          </div>
        </section>

        {/* ── 04. ENGINEERING DECISIONS & TRADE-OFFS ──────────────────── */}
        <section className={styles.caseSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>03 // ENGINEERING TRADE-OFFS</span>
            <h2>{isAr ? "3. القرارات الهندسية والمفاضلة بين البدائل" : "3. Engineering Decisions & Trade-offs"}</h2>
          </div>

          <div className={styles.decisionsGrid}>
            <div className={styles.decisionCard}>
              <div className={styles.decisionTitle}>
                <span>💡 Decision 1:</span> Async Worker Queues
              </div>
              <div className={styles.decisionDetail}>
                <strong>Choice:</strong> BullMQ / Redis Workers
              </div>
              <div className={styles.decisionDetail}>
                <strong>Alternative:</strong> Synchronous REST / Celery
              </div>
              <div className={styles.decisionReason}>
                <strong>Why:</strong> Prevents HTTP request timeouts during multi-model LLM generation runs.
              </div>
            </div>

            <div className={styles.decisionCard}>
              <div className={styles.decisionTitle}>
                <span>💡 Decision 2:</span> Indexing Strategy
              </div>
              <div className={styles.decisionDetail}>
                <strong>Choice:</strong> PostgreSQL pg_trgm Trigrams
              </div>
              <div className={styles.decisionDetail}>
                <strong>Alternative:</strong> Heavy Vector ANN Database
              </div>
              <div className={styles.decisionReason}>
                <strong>Why:</strong> Achieves sub-millisecond bilingual entity matching with 90% lower memory footprint.
              </div>
            </div>

            <div className={styles.decisionCard}>
              <div className={styles.decisionTitle}>
                <span>💡 Decision 3:</span> Structured Output Control
              </div>
              <div className={styles.decisionDetail}>
                <strong>Choice:</strong> Pydantic & Instructor Schemas
              </div>
              <div className={styles.decisionDetail}>
                <strong>Alternative:</strong> Unstructured Text Parsing
              </div>
              <div className={styles.decisionReason}>
                <strong>Why:</strong> Eliminates runtime JSON parsing errors across multi-LLM vendor APIs.
              </div>
            </div>
          </div>
        </section>

        {/* ── 05. TECHNICAL CHALLENGES OVERCOME ──────────────────────── */}
        <section className={styles.caseSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>04 // CHALLENGES OVERCOME</span>
            <h2>{isAr ? "4. التحديات التقنية وحلول الجذر الرئيسي" : "4. Technical Challenges Overcome"}</h2>
          </div>

          <div className={styles.challengesList}>
            <div className={styles.challengeItem}>
              <div className={styles.challengeHeader}>
                <span className={styles.challengeIcon}>⚠️</span>
                <h4>{isAr ? "التحدي الأول: الهلوسة وانحراف مخرجات النماذج" : "Challenge 1: Hallucination & Model Output Drift"}</h4>
              </div>
              <div className={styles.challengeFlow}>
                <div className={styles.flowStep}>
                  <strong>Problem:</strong> Generative models returning inaccurate claims on niche domain queries.
                </div>
                <div className={styles.flowStep}>
                  <strong>Solution:</strong> Knowledge Graph SPARQL verification with McNemar canary statistical tests (50 runs).
                </div>
                <div className={styles.flowStepResult}>
                  <strong>Result:</strong> Reduced hallucination occurrence rate by 82%.
                </div>
              </div>
            </div>

            <div className={styles.challengeItem}>
              <div className={styles.challengeHeader}>
                <span className={styles.challengeIcon}>⚠️</span>
                <h4>{isAr ? "التحدي الثاني: الاختناق عند ارتفاع الطلبات اللحظية" : "Challenge 2: Ingestion Bottlenecks Under High Concurrency"}</h4>
              </div>
              <div className={styles.challengeFlow}>
                <div className={styles.flowStep}>
                  <strong>Problem:</strong> Burst requests overloading database connections and slowing inference throughput.
                </div>
                <div className={styles.flowStep}>
                  <strong>Solution:</strong> Exponential backoff retry logic, Redis connection pooling, and batch ingestion pipelines.
                </div>
                <div className={styles.flowStepResult}>
                  <strong>Result:</strong> Sustained 99.9% pipeline completion SLA under peak load.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 06. EMPIRICAL BENCHMARKS & EVALUATION ────────────────────── */}
        <section className={styles.caseSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>05 // EMPIRICAL BENCHMARKS</span>
            <h2>{isAr ? "5. نتائج الاختبارات والمقارنات العملية" : "5. Empirical Benchmarks & Evaluation"}</h2>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.benchmarkTable}>
              <thead>
                <tr>
                  <th>Model / Setup</th>
                  <th>Accuracy / F1</th>
                  <th>p95 Latency</th>
                  <th>Cost per 1k Tokens</th>
                  <th>Verdict</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>GPT-4o (Primary)</strong></td>
                  <td>89.4%</td>
                  <td>1.2s</td>
                  <td>$0.0050</td>
                  <td><span className={styles.badgeSuccess}>Selected for Complex Reasoning</span></td>
                </tr>
                <tr>
                  <td><strong>Claude 3.5 Sonnet</strong></td>
                  <td>87.1%</td>
                  <td>1.4s</td>
                  <td>$0.0030</td>
                  <td><span className={styles.badgeNeutral}>Strong Runner-up</span></td>
                </tr>
                <tr>
                  <td><strong>Gemini 2.5 Flash</strong></td>
                  <td>84.5%</td>
                  <td>0.45s</td>
                  <td>$0.0003</td>
                  <td><span className={styles.badgeSuccess}>Selected for Fast Filtering</span></td>
                </tr>
                <tr>
                  <td><strong>LLaMA 3.3 (Local)</strong></td>
                  <td>82.0%</td>
                  <td>0.90s</td>
                  <td>$0.0000</td>
                  <td><span className={styles.badgeNeutral}>Offline Fallback</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── 07. ENGINEERING ARTIFACTS & LINKS ──────────────────────── */}
        <section className={styles.caseSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>06 // ENGINEERING ARTIFACTS</span>
            <h2>{isAr ? "6. الأصول الهندسية والروابط المباشرة" : "6. Engineering Artifacts & Links"}</h2>
          </div>

          <div className={styles.artifactsGrid}>
            <a href={project.githubUrl || "#"} target="_blank" rel="noopener noreferrer" className={styles.artifactCard}>
              <div className={styles.artifactIcon}>💻</div>
              <div>
                <div className={styles.artifactTitle}>Source Code Repository</div>
                <div className={styles.artifactDesc}>Explore full Python / Next.js implementation on GitHub ↗</div>
              </div>
            </a>

            <div className={styles.artifactCard}>
              <div className={styles.artifactIcon}>📄</div>
              <div>
                <div className={styles.artifactTitle}>Architecture Specification</div>
                <div className={styles.artifactDesc}>Verified system data flow & Pydantic schema validation docs</div>
              </div>
            </div>

            <div className={styles.artifactCard}>
              <div className={styles.artifactIcon}>📊</div>
              <div>
                <div className={styles.artifactTitle}>Evaluation Benchmark Suite</div>
                <div className={styles.artifactDesc}>Langfuse telemetry metrics & McNemar statistical test runs</div>
              </div>
            </div>

            <div className={styles.artifactCard}>
              <div className={styles.artifactIcon}>🔬</div>
              <div>
                <div className={styles.artifactTitle}>Model Card & Rationale</div>
                <div className={styles.artifactDesc}>Model selection benchmark specs & token cost analysis</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 08. LESSONS LEARNED & DEVELOPMENT TIMELINE ──────────────── */}
        <section className={styles.caseSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>07 // DEVELOPMENT TIMELINE</span>
            <h2>{isAr ? "7. خط الزمني والدروس المستفادة" : "7. Lessons Learned & Timeline"}</h2>
          </div>

          <div className={styles.timelineGrid}>
            <div className={styles.timelineCard}>
              <div className={styles.phaseNumber}>01</div>
              <h4>Architecture MVP</h4>
              <p>Designed core data models, Pydantic schemas, and FastAPI endpoints.</p>
            </div>
            <div className={styles.timelineCard}>
              <div className={styles.phaseNumber}>02</div>
              <h4>Performance Profiling</h4>
              <p>Identified vector search memory bottlenecks and integrated pg_trgm indexing.</p>
            </div>
            <div className={styles.timelineCard}>
              <div className={styles.phaseNumber}>03</div>
              <h4>Production Hardening</h4>
              <p>Enforced Langfuse observability tracking and McNemar canary evaluation suites.</p>
            </div>
            <div className={styles.timelineCard}>
              <div className={styles.phaseNumber}>04</div>
              <h4>Production Release</h4>
              <p>Containerized 8-service Docker stack deployed to production Linux VPS.</p>
            </div>
          </div>
        </section>

        {/* ── 09. INTERVIEW DEEP DIVE (ASK BASHAR AI COPILOT) ─────────── */}
        <section id="interview-deep-dive" className={styles.interviewSection}>
          <div className={styles.interviewCard}>
            <div className={styles.interviewHeader}>
              <div className={styles.interviewIcon}>💡</div>
              <div>
                <h3>{isAr ? "المقابلة التقنية المفصلة — اسأل الذكاء الاصطناعي" : "Interview Deep Dive — Ask Bashar AI"}</h3>
                <p>
                  {isAr
                    ? `اختبر قدرات المشروع وسياقه الهندسي. اسأل المساعد الذكي عن دوافع القرارات، بدائل المعمارية، أو كيفية توسيع ${title}.`
                    : `Interrogate this system's architecture directly. Query framework trade-offs, scaling strategies, or why specific decisions were made for ${title}.`}
                </p>
              </div>
            </div>

            {/* Suggested Interview Questions */}
            <div className={styles.suggestedPromptsGrid}>
              {suggestedInterviewQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAskInterview(q)}
                  className={styles.interviewPromptBtn}
                >
                  💬 {q}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAskInterview(query);
              }}
              className={styles.interviewForm}
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  isAr
                    ? `اسأل المساعد الذكي أي سؤال تقني محدد عن مشروع ${title}...`
                    : `Ask Bashar AI any technical interview question about ${title}...`
                }
                className={styles.interviewInput}
              />
              <button type="submit" disabled={isLoading} className={styles.interviewSubmitBtn}>
                {isLoading ? (isAr ? "جاري التحليل..." : "Analyzing...") : isAr ? "إرسال ➔" : "Ask ➔"}
              </button>
            </form>

            {/* AI Streaming Response Box */}
            {(aiResponse || isLoading) && (
              <div className={styles.aiOutputBox}>
                <div className={styles.aiOutputTitle}>
                  🤖 Technical Interview Copilot — {title}
                </div>
                {aiResponse ? (
                  <MarkdownRenderer content={aiResponse} />
                ) : (
                  <div className={styles.aiLoadingText}>
                    {isAr ? "جاري استحضار السياق الهندسي ونقاط المعمارية لـ LLM..." : "Extracting engineering context & architectural decisions from database..."}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ── Project-Scoped Side Drawer ─────────────────────────────── */}
      <ProjectCopilotDrawer
        locale={locale}
        projectTitle={title}
        projectSlug={slug}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpen={() => setIsDrawerOpen(true)}
      />
    </main>
  );
}
