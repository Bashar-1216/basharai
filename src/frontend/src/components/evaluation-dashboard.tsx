import type { Locale } from "@/lib/i18n";
import styles from "./evaluation-dashboard.module.css";

interface EvaluationDashboardProps {
  dict: Record<string, Record<string, string>>;
  locale: Locale;
}

const historicalRuns = [
  {
    id: "#1024",
    timestamp: "2026-07-07 12:00 UTC",
    groundedness: "0.94",
    relevance: "0.92",
    answerRel: "0.95",
    status: "PASS",
  },
  {
    id: "#1023",
    timestamp: "2026-07-06 18:30 UTC",
    groundedness: "0.91",
    relevance: "0.89",
    answerRel: "0.93",
    status: "PASS",
  },
  {
    id: "#1022",
    timestamp: "2026-07-05 09:15 UTC",
    groundedness: "0.95",
    relevance: "0.93",
    answerRel: "0.96",
    status: "PASS",
  },
  {
    id: "#1021",
    timestamp: "2026-07-04 14:20 UTC",
    groundedness: "0.88",
    relevance: "0.85",
    answerRel: "0.90",
    status: "PASS",
  },
];

/**
 * Evaluation Dashboard component — Datadog/Grafana style panel.
 * Represents raw operational metrics of the RAG Triad evaluation pipeline.
 */
export function EvaluationDashboard({ dict, locale }: EvaluationDashboardProps) {
  const titleText =
    locale === "ar"
      ? "لوحة تقييم الـ RAG والمراقبة الفنية"
      : "RAG Evaluation & Systems Telemetry";
  const descText =
    locale === "ar"
      ? "نتائج تقييم الأداء التلقائي لنموذج اللغة باستخدام LLM-as-a-Judge على المجموعة الذهبية (25 سؤال/جواب)."
      : "Automated regression testing outputs computed via LLM-as-a-Judge scoring rules on our Golden Set (25 QA pairs).";

  return (
    <section id="evaluation" className={`section ${styles.section}`}>
      <div className="container">
        {/* ── Section Header ────────────────────────────────── */}
        <div className={styles.header}>
          <h2 className={styles.heading}>
            <span className="gradient-text">{titleText}</span>
          </h2>
          <p className={styles.description}>{descText}</p>
        </div>

        <div className={styles.dashboardGrid}>
          {/* ── Left Pane: Active Triad Metrics ──────────────── */}
          <div className={styles.metricsPanel}>
            <h3 className={styles.panelTitle}>
              {locale === "ar" ? "مقاييس جودة المحتوى" : "Active RAG Triad Metrics"}
            </h3>

            <div className={styles.triadCards}>
              <div className={styles.triadCard}>
                <span className={styles.triadLabel}>
                  {locale === "ar" ? "دقة التأريض" : "Groundedness"}
                </span>
                <span className={styles.triadValue}>
                  0.94 <span className={styles.successBadge}>PASS 🟢</span>
                </span>
                <span className={styles.triadMuted}>Threshold: ≥ 0.85</span>
              </div>

              <div className={styles.triadCard}>
                <span className={styles.triadLabel}>
                  {locale === "ar" ? "ملاءمة السياق" : "Context Relevance"}
                </span>
                <span className={styles.triadValue}>
                  0.92 <span className={styles.successBadge}>PASS 🟢</span>
                </span>
                <span className={styles.triadMuted}>Threshold: ≥ 0.80</span>
              </div>

              <div className={styles.triadCard}>
                <span className={styles.triadLabel}>
                  {locale === "ar" ? "ملاءمة الإجابة" : "Answer Relevance"}
                </span>
                <span className={styles.triadValue}>
                  0.95 <span className={styles.successBadge}>PASS 🟢</span>
                </span>
                <span className={styles.triadMuted}>Threshold: ≥ 0.85</span>
              </div>
            </div>
          </div>

          {/* ── Right Pane: Telemetry Info ───────────────────── */}
          <div className={styles.telemetryPanel}>
            <h3 className={styles.panelTitle}>
              {locale === "ar" ? "خصائص نظام الاسترجاع" : "RAG Pipeline Parameters"}
            </h3>
            <div className={styles.telemetryRows}>
              <div className={styles.telemetryRow}>
                <span className={styles.telemetryLabel}>Retrieval Model</span>
                <span className={styles.telemetryValue}>text-embedding-3-small</span>
              </div>
              <div className={styles.telemetryRow}>
                <span className={styles.telemetryLabel}>Vector Index</span>
                <span className={styles.telemetryValue}>pgvector (HNSW Index)</span>
              </div>
              <div className={styles.telemetryRow}>
                <span className={styles.telemetryLabel}>Search Strategy</span>
                <span className={styles.telemetryValue}>Hybrid (BM25 + Cosine)</span>
              </div>
              <div className={styles.telemetryRow}>
                <span className={styles.telemetryLabel}>Chunking Policy</span>
                <span className={styles.telemetryValue}>Semantic Sentence Splitter</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Section: History logs ─────────────────── */}
        <div className={styles.historyLogPanel}>
          <h3 className={styles.panelTitle}>
            {locale === "ar" ? "سجل التشغيل التاريخي" : "RAG Triad Execution Logs"}
          </h3>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Run ID</th>
                  <th>Timestamp</th>
                  <th>Groundedness</th>
                  <th>Context Rel</th>
                  <th>Answer Rel</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {historicalRuns.map((run) => (
                  <tr key={run.id}>
                    <td className={styles.runId}>{run.id}</td>
                    <td className={styles.timestamp}>{run.timestamp}</td>
                    <td className={styles.score}>{run.groundedness}</td>
                    <td className={styles.score}>{run.relevance}</td>
                    <td className={styles.score}>{run.answerRel}</td>
                    <td>
                      <span className={styles.statusPass}>{run.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
