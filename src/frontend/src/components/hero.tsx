"use client";

import type { Locale } from "@/lib/i18n";
import Image from "next/image";
import Link from "next/link";
import styles from "./hero.module.css";

import { HeroAgent } from "@/components/hero-agent";

interface HeroProps {
  dict: any;
  locale: Locale;
}

export function Hero({ dict, locale }: HeroProps) {
  const hero = dict.hero;
  const isAr = locale === "ar";

  return (
    <section className={styles.hero}>
      <div className={`container ${styles.gridContainer}`}>
        {/* ── Left Column: Bio & Value Proposition ──────────── */}
        <div className={styles.textContent}>
          <div className={`${styles.badgeWrapper} animate-fade-in-up`}>
            <span className={styles.statusDot} />
            <span className={styles.statusText}>{hero.availability}</span>
          </div>

          <h1 className={`${styles.name} animate-fade-in-up delay-100`}>
            {hero.name}
          </h1>

          <h2 className={`${styles.title} animate-fade-in-up delay-200`}>
            <span className="gradient-text">{hero.title}</span>
          </h2>

          <p className={`${styles.roleDescription} animate-fade-in-up delay-300`}>
            {isAr
              ? "مهندس ذكاء اصطناعي متخصص في بناء وتطوير أنظمة التعلم الآلي الإنتاجية، نماذج معالجة اللغات الطبيعية (LLM & RAG)، وتطبيقات الرؤية الحاسوبية عالية الأداء."
              : "AI Engineer specializing in production-grade machine learning systems, LLM & RAG pipelines, bilingual NLP, and real-time computer vision applications."}
          </p>

          <div className={`${styles.actions} animate-fade-in-up delay-400`}>
            <Link href={`/${locale}/projects`} className="btn-primary">
              {isAr ? "استعرض المشاريع" : "View Projects"}
            </Link>
            <Link href={`/${locale}/resume`} className="btn-secondary">
              {isAr ? "تحميل السيرة الذاتية" : "Download Resume"}
            </Link>
            <Link href={`/${locale}/contact`} className="btn-secondary">
              {isAr ? "تواصل معي" : "Contact Me"}
            </Link>
          </div>
        </div>

        {/* ── Right Column: Interactive Hero AI Agent ─────────── */}
        <div className={`${styles.cardColumn} animate-fade-in-up delay-200`}>
          <HeroAgent locale={locale} />
        </div>
      </div>
    </section>
  );
}
