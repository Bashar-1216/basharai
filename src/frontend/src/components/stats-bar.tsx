"use client";

import Link from "next/link";
import styles from "./stats-bar.module.css";

interface StatsBarProps {
  dict: any;
  locale: string;
  projectCount: number;
  experienceCount: number;
  articleCount: number;
}

export default function StatsBar({ dict, locale, projectCount, experienceCount, articleCount }: StatsBarProps) {
  const stats = dict.stats;
  
  const cards = [
    {
      label: stats.projects,
      value: String(projectCount),
      sub: "",
      href: `/${locale}/projects`,
      icon: "📁",
    },
    {
      label: stats.experience,
      value: `${experienceCount}+`,
      sub: stats.years,
      href: `/${locale}/experience`,
      icon: "💼",
    },
    {
      label: stats.articles,
      value: String(articleCount),
      sub: "",
      href: `/${locale}/blog`,
      icon: "📝",
    },
    {
      label: stats.telemetry,
      value: stats.live,
      sub: `98% ${stats.health}`,
      href: `/${locale}/dashboard`,
      icon: "📊",
      live: true,
    },
    {
      label: stats.assistant,
      value: stats.online,
      sub: stats.ask_me,
      href: `/${locale}/assistant`,
      icon: "🤖",
      live: true,
    },
  ];

  return (
    <section className={styles.statsSection}>
      <div className={styles.statsGrid}>
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className={styles.statCard}>
            <span className={styles.statIcon}>{card.icon}</span>
            <span className={styles.statLabel}>{card.label}</span>
            <span className={styles.statValue}>
              {card.live && <span className={styles.liveDot} />}
              {card.value}
            </span>
            {card.sub && <span className={styles.statSub}>{card.sub}</span>}
          </Link>
        ))}
      </div>
    </section>
  );
}
