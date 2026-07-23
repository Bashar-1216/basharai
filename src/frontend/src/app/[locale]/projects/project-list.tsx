"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import Link from "next/link";
import styles from "./project-list.module.css";

interface Project {
  id: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  githubUrl: string | null;
  liveUrl?: string | null;
  tags: string[];
}

interface GithubStats {
  repoName: string;
  stars: number;
  forks: number;
  language: string;
  lastCommit?: string;
}

interface ProjectListProps {
  initialProjects: Project[];
  githubStats: GithubStats[];
  locale: Locale;
}

export function ProjectList({ initialProjects, githubStats, locale }: ProjectListProps) {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("All");

  const categories = [
    { en: "All", ar: "الكل" },
    { en: "LLM", ar: "LLM" },
    { en: "RAG", ar: "RAG" },
    { en: "AI Agents", ar: "وكلاء الذكاء الاصطناعي" },
    { en: "Evaluation", ar: "التقييم" },
    { en: "Automation", ar: "الأتمتة" },
    { en: "Vision", ar: "رؤية الحاسوب" },
  ];

  const filtered = initialProjects.filter((p) => {
    const title = locale === "ar" ? p.titleAr : p.titleEn;
    const desc = locale === "ar" ? p.descriptionAr : p.descriptionEn;
    const matchesSearch =
      title.toLowerCase().includes(search.toLowerCase()) ||
      desc.toLowerCase().includes(search.toLowerCase());

    const matchesTag = activeTag === "All" || p.tags.includes(activeTag);

    return matchesSearch && matchesTag;
  });

  const getRepoStats = (githubUrl: string | null) => {
    if (!githubUrl) return null;
    const path = githubUrl.replace("https://github.com/", "").replace("http://github.com/", "").trim();
    return githubStats.find((r) => r.repoName.toLowerCase() === path.toLowerCase());
  };

  // Helper to determine automated status badge based on live project metadata
  const getProjectStatus = (project: Project, stats: any) => {
    if (project.liveUrl) {
      return {
        labelEn: "In Production 🚀",
        labelAr: "في مرحلة الإنتاج 🚀",
        type: "inProduction",
      };
    }
    if (stats && stats.lastCommit) {
      const commitDate = new Date(stats.lastCommit);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - commitDate.getTime()) / (1000 * 3600 * 24));
      if (!isNaN(diffDays) && diffDays <= 30) {
        return {
          labelEn: "Active Build 🟢",
          labelAr: "تطوير نشط 🟢",
          type: "activeBuild",
        };
      }
    }
    return {
      labelEn: "Completed ✅",
      labelAr: "مكتمل ✅",
      type: "completed",
    };
  };

  const isAr = locale === "ar";

  return (
    <div className={styles.container}>
      {/* Search Input */}
      <div className={styles.searchBar}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={isAr ? "ابحث عن مشروع..." : "Search project case studies..."}
        />
      </div>

      {/* Filter Categories */}
      <div className={styles.filters}>
        {categories.map((cat) => {
          const label = isAr ? cat.ar : cat.en;
          const value = cat.en;
          return (
            <button
              key={value}
              type="button"
              className={`${styles.filterBtn} ${activeTag === value ? styles.active : ""}`}
              onClick={() => setActiveTag(value)}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Grid of Results */}
      {filtered.length > 0 ? (
        <div className={styles.grid}>
          {filtered.map((proj) => {
            const stats = getRepoStats(proj.githubUrl);
            const status = getProjectStatus(proj, stats);
            return (
              <article key={proj.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={`${styles.statusBadge} ${styles[status.type]}`}>
                    {isAr ? status.labelAr : status.labelEn}
                  </span>
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.githubLink}
                    >
                      GitHub ↗
                    </a>
                  )}
                </div>
                <h3 className={styles.cardTitle}>{isAr ? proj.titleAr : proj.titleEn}</h3>
                <p className={styles.cardDesc}>
                  {isAr ? proj.descriptionAr : proj.descriptionEn}
                </p>

                {/* Dynamic GitHub stats row */}
                {stats && (
                  <div className={styles.projectStatsRow}>
                    <span className={styles.statBadge}>⭐ {stats.stars}</span>
                    <span className={styles.statBadge}>🍴 {stats.forks}</span>
                    <span className={styles.langBadge}>
                      <span className={styles.langDot} />
                      {stats.language}
                    </span>
                  </div>
                )}

                <Link href={`/${locale}/projects/${proj.slug}`} className={styles.readBtn}>
                  {isAr ? "قراءة دراسة الحالة كاملة ➔" : "Read Full Case Study ➔"}
                </Link>
              </article>
            );
          })}
        </div>
      ) : (
        <div className={styles.noResults}>
          {isAr ? "لا توجد دراسات حالة تطابق خيارات البحث." : "No case studies match your selection."}
        </div>
      )}
    </div>
  );
}
