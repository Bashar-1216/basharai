"use client";

import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import styles from "./navbar.module.css";

interface NavbarProps {
  dict: Record<string, Record<string, string>>;
  locale: Locale;
}

/**
 * Top navigation bar with language toggle and section links.
 * Uses glassmorphism styling and fixed position.
 */
export function Navbar({ dict, locale }: NavbarProps) {
  const oppositeLocale = locale === "en" ? "ar" : "en";

  return (
    <header className={styles.header}>
      <nav className={`container ${styles.nav}`}>
        {/* ── Logo ──────────────────────────────────────────── */}
        <Link href={`/${locale}`} className={styles.logo}>
          <span className="gradient-text">bashar</span>
          <span className={styles.logoDot}>.ai</span>
        </Link>

        {/* ── Nav Links ─────────────────────────────────────── */}
        <ul className={styles.links}>
          <li>
            <Link href={`/${locale}#experience`} className={styles.link}>
              {dict.nav.experience}
            </Link>
          </li>
          <li>
            <Link href={`/${locale}#projects`} className={styles.link}>
              {dict.nav.projects}
            </Link>
          </li>
          <li>
            <Link href={`/${locale}/chat`} className={styles.link}>
              {dict.nav.assistant}
            </Link>
          </li>
        </ul>

        {/* ── Language Toggle ───────────────────────────────── */}
        <Link
          href={`/${oppositeLocale}`}
          className={styles.langToggle}
          aria-label={`Switch to ${dict.nav.language}`}
        >
          {dict.nav.language}
        </Link>
      </nav>
    </header>
  );
}
