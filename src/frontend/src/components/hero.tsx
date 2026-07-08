"use client";

import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import styles from "./hero.module.css";

interface HeroProps {
  dict: any;
  locale: Locale;
}

export function Hero({ locale }: HeroProps) {
  const triggerChat = () => {
    window.dispatchEvent(new CustomEvent("open-chat"));
  };

  const isAr = locale === "ar";

  return (
    <section className={styles.hero}>
      <div className={`container ${styles.content}`}>
        {/* Title */}
        <h1 className={`${styles.title} animate-fade-in-up`}>
          {isAr ? (
            <>
              بناء أنظمة ذكاء اصطناعي إنتاجية <br />
              <span className="gradient-text">لملايين المستخدمين.</span>
            </>
          ) : (
            <>
              Building Production AI Systems <br />
              <span className="gradient-text">for Millions of Users.</span>
            </>
          )}
        </h1>

        {/* Roles & Companies */}
        <div className={`${styles.companies} animate-fade-in-up delay-100`}>
          <span className={styles.role}>
            {isAr ? "مهندس تطبيقات نماذج اللغة (LLM)" : "LLM Application Engineer"}
          </span>
          <span className={styles.separator}>•</span>
          <span className={styles.companyName}>Amazon</span>
          <span className={styles.separator}>•</span>
          <span className={styles.companyName}>Grammarly</span>
        </div>

        {/* GCC Context Subtitle */}
        <p className={`${styles.subtitle} animate-fade-in-up delay-200`}>
          {isAr
            ? "أعمل حالياً على تطوير منصات ذكاء اصطناعي ثنائية اللغة تدعم متطلبات الشرق الأوسط ومؤسسات الخليج العربي."
            : "Now building bilingual AI platforms tailored for GCC organizations and regional enterprise teams."}
        </p>

        {/* CTAs */}
        <div className={`${styles.cta} animate-fade-in-up delay-300`}>
          <Link href={`/${locale}/projects`} className="btn-primary">
            📁 {isAr ? "تصفح المشاريع" : "Explore Projects"}
          </Link>
          <Link href={`/${locale}/resume`} className="btn-secondary">
            📄 {isAr ? "السيرة الذاتية" : "View Resume"}
          </Link>
          <button type="button" onClick={triggerChat} className={styles.chatTrigger}>
            💬 {isAr ? "حدث مساعدي الذكي" : "Talk to My AI"}
          </button>
        </div>
      </div>
    </section>
  );
}
