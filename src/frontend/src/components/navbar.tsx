"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import styles from "./navbar.module.css";
import { SearchModal } from "./search-modal";

interface NavbarProps {
  dict: any;
  locale: Locale;
}

export function Navbar({ dict, locale }: NavbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
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

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (path: string) => {
    const segments = pathname.split("/").filter(Boolean);
    if (path === "") {
      return segments.length <= 1; // overview route "/"
    }
    return segments.includes(path);
  };

  const navItems = [
    { key: "overview", path: "", label: dict.nav.overview },
    { key: "experience", path: "experience", label: dict.nav.experience },
    { key: "projects", path: "projects", label: dict.nav.projects },
    { key: "assistant", path: "assistant", label: dict.nav.assistant },
    { key: "blog", path: "blog", label: dict.nav.blog },
    { key: "resume", path: "resume", label: dict.nav.resume },
    { key: "contact", path: "contact", label: dict.nav.contact },
  ];

  return (
    <header className={`${styles.header} no-print`}>
      <nav className={`container ${styles.nav}`}>
        {/* ── Logo ──────────────────────────────────────────── */}
        <Link href={`/${locale}`} className={styles.logo}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="url(#navLogoSparkle)"/>
            <defs>
              <linearGradient id="navLogoSparkle" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#64FFDA"/>
                <stop offset="1" stopColor="#00B4D8"/>
              </linearGradient>
            </defs>
          </svg>
          <span className={styles.logoText}>
            <span className="gradient-text">bashar</span>
            <span className={styles.logoDot}>.ai</span>
          </span>
        </Link>

        {/* ── Desktop Nav Links ─────────────────────────────── */}
        <ul className={styles.links}>
          {navItems.map((item) => (
            <li key={item.key}>
              <Link
                href={`/${locale}/${item.path}`}
                className={`${styles.link} ${isActive(item.path) ? styles.activeLink : ""}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* ── Actions (Search + Lang + Hamburger) ───────────── */}
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

          <button
            type="button"
            className={styles.hamburger}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* ── Mobile Navigation Drawer ────────────────────────── */}
      {isMobileMenuOpen && (
        <div className={styles.mobileDrawer} onClick={() => setIsMobileMenuOpen(false)}>
          <div className={styles.drawerContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <span className="gradient-text">bashar.ai</span>
              <button
                type="button"
                className={styles.closeDrawerBtn}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ✕
              </button>
            </div>
            <ul className={styles.drawerLinks}>
              {navItems.map((item) => (
                <li key={item.key}>
                  <Link
                    href={`/${locale}/${item.path}`}
                    className={`${styles.drawerLink} ${isActive(item.path) ? styles.activeDrawerLink : ""}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Global Command Search Modal */}
      <SearchModal
        locale={locale}
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </header>
  );
}
