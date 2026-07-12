"use client";

import type { Locale } from "@/lib/i18n";
import Image from "next/image";
import styles from "./hero.module.css";

interface HeroProps {
  dict: any;
  locale: Locale;
}

export function Hero({ dict }: HeroProps) {
  const hero = dict.hero;

  return (
    <section className={styles.hero}>
      {/* ── Holographic Background Watermark ──────────────── */}
      <div className={styles.watermarkWrapper}>
        <Image
          src="/avatar.jpg"
          alt={hero.name}
          width={720}
          height={720}
          className={styles.watermarkImg}
          priority
        />
        <div className={styles.watermarkScanline} />
      </div>

      <div className={`container ${styles.content}`}>
        <span className={`${styles.name} animate-fade-in-up`}>{hero.name}</span>
        <h1 className={`${styles.title} animate-fade-in-up delay-100`}>
          <span className="gradient-text">{hero.title}</span>
        </h1>
        <div className={`${styles.statusLine} animate-fade-in-up delay-200`}>
          <span>{hero.role}</span>
          <span className={styles.separator}>·</span>
          <span>{hero.location_status}</span>
          <span className={styles.separator}>·</span>
          <span className={styles.badge}>{hero.availability}</span>
        </div>
      </div>
    </section>
  );
}
