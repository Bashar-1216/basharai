import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import styles from "./hero.module.css";

interface HeroProps {
  dict: Record<string, Record<string, string>>;
  locale: Locale;
}

/**
 * Hero section — the first thing hiring managers see.
 * Must convey engineering credibility within 60 seconds.
 * Features animated gradient text, glowing CTA, and tech stack badges.
 */
export function Hero({ dict, locale }: HeroProps) {
  return (
    <section className={styles.hero}>
      {/* ── Background Glow Effects ─────────────────────── */}
      <div className={styles.glowOrb1} aria-hidden="true" />

      <div className={`container ${styles.content}`}>
        {/* ── Greeting Badge ────────────────────────────── */}
        <div className={`${styles.badge} animate-fade-in-up`}>
          <span className={styles.badgeDot} />
          {dict.hero.greeting}
        </div>

        {/* ── Main Heading ──────────────────────────────── */}
        <h1 className={`${styles.title} animate-fade-in-up delay-100`}>
          <span className="gradient-text">{dict.hero.title}</span>
        </h1>

        {/* ── Subtitle ──────────────────────────────────── */}
        <p className={`${styles.subtitle} animate-fade-in-up delay-200`}>
          {dict.hero.subtitle}
        </p>

        {/* ── CTA Buttons ───────────────────────────────── */}
        <div className={`${styles.cta} animate-fade-in-up delay-300`}>
          <Link
            href={`/${locale}/chat`}
            className="btn-primary animate-pulse-glow"
          >
            💬 {dict.hero.cta_chat}
          </Link>
          <Link href={`/${locale}#experience`} className="btn-secondary">
            📄 {dict.hero.cta_resume}
          </Link>
        </div>

        {/* ── Tech Stack Badges ─────────────────────────── */}
        <div className={`${styles.techStack} animate-fade-in-up delay-400`}>
          {["Next.js", "FastAPI", "LangChain", "pgvector", "TypeScript", "Python"].map(
            (tech) => (
              <span key={tech} className={styles.techBadge}>
                {tech}
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
}
