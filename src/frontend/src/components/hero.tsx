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
      <div className={`container ${styles.content}`}>
        {/* Prominent, Crisp Avatar Frame */}
        <div className={`${styles.avatarContainer} animate-fade-in-up`}>
          <div className={styles.avatarGlow} />
          <Image
            src="/avatar.jpg"
            alt={hero.name}
            width={120}
            height={120}
            className={styles.avatarImg}
            priority
          />
        </div>

        <span className={`${styles.name} animate-fade-in-up delay-100`}>{hero.name}</span>
        <h1 className={`${styles.title} animate-fade-in-up delay-200`}>
          <span className="gradient-text">{hero.title}</span>
        </h1>
        <div className={`${styles.statusLine} animate-fade-in-up delay-300`}>
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
