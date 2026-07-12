"use client";

import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import styles from "./hero.module.css";

interface HeroProps {
  dict: any;
  locale: Locale;
}

export function Hero({ dict, locale }: HeroProps) {
  const hero = dict.hero;

  return (
    <section className={styles.hero}>
      <div className={`container ${styles.content}`}>
        {/* Title */}
        <h1 className={`${styles.title} animate-fade-in-up`}>
          {hero.title} <br />
          <span className="gradient-text">{hero.title_accent}</span>
        </h1>

        {/* Roles & Tagline (No fictional references) */}
        <div className={`${styles.roleContainer} animate-fade-in-up delay-100`}>
          <span className={styles.roleBadge}>
            {hero.role}
          </span>
          <span className={styles.separator}>·</span>
          <span className={styles.tagline}>
            {hero.tagline}
          </span>
        </div>

        {/* Subtitle */}
        <p className={`${styles.subtitle} animate-fade-in-up delay-200`}>
          {hero.subtitle}
        </p>

        {/* CTAs */}
        <div className={`${styles.cta} animate-fade-in-up delay-300`}>
          <Link href={`/${locale}/projects`} className="btn-primary">
            📁 {hero.cta_projects}
          </Link>
          <Link href={`/${locale}/resume`} className="btn-secondary">
            📄 {hero.cta_resume}
          </Link>
        </div>
      </div>
    </section>
  );
}
