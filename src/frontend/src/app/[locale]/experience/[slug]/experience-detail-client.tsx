"use client";

import { useState } from "react";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { ExperienceCopilotDrawer } from "./experience-copilot-drawer";
import styles from "./experience-detail.module.css";

interface ExperienceDetailClientProps {
  locale: string;
  slug: string;
  companyName: string;
  roleTitle: string;
  detail: any;
}

export function ExperienceDetailClient({
  locale,
  slug,
  companyName,
  roleTitle,
  detail,
}: ExperienceDetailClientProps) {
  const isAr = locale === "ar";
  const [query, setQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const techChips = detail.technologies ? detail.technologies.split(", ") : ["Python", "FastAPI", "PostgreSQL", "Redis", "Docker"];

  const suggestedInterviewQuestions = isAr
    ? [
        `ما هو الدور المستقل والمحوري لبشار في مشروع/شركة ${companyName}؟`,
        `كيف قمت بإصلاح الفجوات وتحديات الكيانات ثنائية اللغة في ${companyName}؟`,
        `ما هي أهم النتائج الملموسة والمقاييس التشغيلية التي حققتها هنا؟`,
        `ما هي القرارات البرمجية والبدائل التي تمت مفاضلتها في هذه الخبرة؟`,
      ]
    : [
        `What was Bashar's precise engineering role and scope at ${companyName}?`,
        `How did you resolve bilingual Unicode entity matching challenges here?`,
        `What were the key quantitative metrics and business impact achieved?`,
        `What framework decisions & trade-offs were evaluated during this role?`,
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
          message: `[Context: Interview Deep Dive for Experience at ${companyName} (${roleTitle})]: ${q}`,
          locale,
          session_id: `experience-interview-${slug}`,
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error("Failed to connect to AI server");
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
          ? "تعذر الاتصال بالمساعد الذكي حالياً. يرجى المحاولة مرة أخرى."
          : "Could not connect to AI interview copilot. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToInterview = () => {
    const el = document.getElementById("experience-interview-deep-dive");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className={styles.main}>
      <div className="container">
        {/* Navigation Back Link */}
        <a href={`/${locale}/experience`} className={styles.backBtn}>
          ← {isAr ? "العودة لقائمة الخبرات" : "Back to Experiences"}
        </a>

        {/* ── HERO HEADER ──────────────────────────────────────────────── */}
        <header className={styles.heroHeader}>
          <div className={styles.heroBadgeRow}>
            <span className={styles.statusBadge}>Engineering Experience 🏛️</span>
            <span className={styles.categoryBadge}>{companyName}</span>
          </div>

          <h1 className={styles.heroTitle}>{companyName}</h1>
          <h2 className={styles.roleSubTitle}>{roleTitle}</h2>
          <p className={styles.heroSubtitle}>{detail.overview}</p>

          {/* Quick Tech Chips Bar */}
          <div className={styles.techChipsRow}>
            {techChips.map((tech: string, idx: number) => (
              <span key={idx} className={styles.techChip}>
                {tech}
              </span>
            ))}
            <span className={styles.metaChip}>
              <strong>{isAr ? "الدور:" : "Role:"}</strong> {isAr ? detail.role : detail.role}
            </span>
          </div>

          <div className={styles.heroActions}>
            <button type="button" onClick={() => setIsDrawerOpen(true)} className="btn-primary">
              💬 {isAr ? "اسأل AI عن الخبرة" : "Ask Role Copilot"}
            </button>
            <button type="button" onClick={() => setIsDrawerOpen(true)} className="btn-secondary" style={{ background: "linear-gradient(135deg, hsl(var(--color-primary) / 0.15) 0%, transparent 100%)", borderColor: "hsl(var(--color-primary) / 0.4)" }}>
              💡 {isAr ? "المقابلة التقنية للخبرة" : "Interview Deep Dive"}
            </button>
          </div>
        </header>

        {/* ── 01. EXECUTIVE SUMMARY & PROBLEM DOMAIN ────────────────────── */}
        <section className={styles.caseSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>01 // EXECUTIVE SUMMARY & PROBLEM</span>
            <h2>{isAr ? "1. الملخص المهني ونطاق التحدي" : "1. Executive Summary & Problem Domain"}</h2>
          </div>
          <div className={styles.problemContent}>
            <p><strong>{isAr ? "طبيعة التحدي والمهمة:" : "Problem & Scope:"}</strong> {detail.problem}</p>
            <div className={styles.calloutBox}>
              <strong>🎯 {isAr ? "النطاق الهندسي لبشار:" : "Bashar's Engineering Scope:"}</strong> {detail.role}
            </div>
          </div>
        </section>

        {/* ── 02. TECHNICAL CHALLENGES & SOLUTIONS ──────────────────────── */}
        <section className={styles.caseSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>02 // CHALLENGES OVERCOME</span>
            <h2>{isAr ? "2. التحديات الهندسية المعقدة وحلول الجذر" : "2. Technical Challenges Overcome"}</h2>
          </div>
          <div className={styles.challengeCard}>
            <h4>⚠️ {isAr ? "التحدي التقني الرئيسي:" : "Key Engineering Challenge:"}</h4>
            <p>{detail.challenges}</p>
          </div>
        </section>

        {/* ── 03. QUANTIFIABLE IMPACT & METRICS ──────────────────────────── */}
        <section className={styles.caseSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>03 // SYSTEM IMPACT</span>
            <h2>{isAr ? "3. الأثر الهندسي والنتائج الملموسة" : "3. Quantifiable System Impact"}</h2>
          </div>
          <div className={styles.impactCard}>
            <div className={styles.impactValue}>99.9% SLA</div>
            <div className={styles.impactText}>{detail.impact}</div>
          </div>
        </section>

        {/* ── 04. LESSONS LEARNED ────────────────────────────────────────── */}
        <section className={styles.caseSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>04 // LESSONS LEARNED</span>
            <h2>{isAr ? "4. الدروس الهندسية المستفادة" : "4. Lessons Learned & Key Takeaways"}</h2>
          </div>
          <div className={styles.lessonsCard}>
            <p>💡 {detail.learned}</p>
          </div>
        </section>
      </div>

      {/* Role-Scoped Side Drawer */}
      <ExperienceCopilotDrawer
        locale={locale}
        companyName={companyName}
        roleTitle={roleTitle}
        slug={slug}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpen={() => setIsDrawerOpen(true)}
      />
    </main>
  );
}
