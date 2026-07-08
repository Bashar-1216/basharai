"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import styles from "./navbar.module.css";
import { SearchModal } from "./search-modal";

interface NavbarProps {
  dict: any;
  locale: Locale;
}

export function Navbar({ dict, locale }: NavbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const oppositeLocale = locale === "en" ? "ar" : "en";

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const isAr = locale === "ar";

  return (
    <header className={`${styles.header} no-print`}>
      <nav className={`container ${styles.nav}`}>
        {/* ── Logo ──────────────────────────────────────────── */}
        <Link href={`/${locale}`} className={styles.logo}>
          <span className="gradient-text">bashar</span>
          <span className={styles.logoDot}>.ai</span>
        </Link>

        {/* ── Nav Links ─────────────────────────────────────── */}
        <ul className={styles.links}>
          <li>
            <Link href={`/${locale}/experience`} className={styles.link}>
              {isAr ? "الخبرة" : "Experience"}
            </Link>
          </li>
          <li>
            <Link href={`/${locale}/projects`} className={styles.link}>
              {isAr ? "المشاريع" : "Projects"}
            </Link>
          </li>
          <li>
            <Link href={`/${locale}/blog`} className={styles.link}>
              {isAr ? "المدونة" : "Blog"}
            </Link>
          </li>
          <li>
            <Link href={`/${locale}/resume`} className={styles.link}>
              {isAr ? "السيرة الذاتية" : "Resume"}
            </Link>
          </li>
          <li>
            <Link href={`/${locale}/dashboard`} className={styles.link}>
              {isAr ? "التحليلات" : "Telemetry"}
            </Link>
          </li>
          <li>
            <Link href={`/${locale}/now`} className={styles.link}>
              {isAr ? "الآن" : "Now"}
            </Link>
          </li>
        </ul>

        {/* ── Actions (Search + Language) ───────────────────── */}
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.searchBtn}
            onClick={() => setIsSearchOpen(true)}
            aria-label="Open Search (Ctrl+K)"
            title="Search (Ctrl+K)"
          >
            🔍
          </button>

          <Link
            href={`/${oppositeLocale}`}
            className={styles.langToggle}
            aria-label={`Switch to ${dict.nav.language}`}
          >
            {dict.nav.language}
          </Link>
        </div>
      </nav>

      {/* Global Command Search Modal */}
      <SearchModal
        locale={locale}
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </header>
  );
}
