"use client";

import { useState, useEffect, useRef } from "react";
import type { Locale } from "@/lib/i18n";
import styles from "./search-modal.module.css";
import { useRouter } from "next/navigation";

interface SearchModalProps {
  locale: Locale;
  isOpen: boolean;
  onClose: () => void;
}

interface SearchItem {
  title: string;
  category: string;
  url: string;
}

export function SearchModal({ locale, isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle global hotkey Ctrl+K / Cmd+K handled outside (in layout or navbar)

  const items: SearchItem[] = [
    { title: locale === "ar" ? "خبرة شركة أمازون" : "Amazon Experience", category: "Experience", url: `/${locale}/experience/amazon` },
    { title: locale === "ar" ? "خبرة شركة جرامرلي" : "Grammarly Experience", category: "Experience", url: `/${locale}/experience/grammarly` },
    { title: locale === "ar" ? "محرك منصة RAG الذكي" : "bashar.ai Platform Engine", category: "Projects", url: `/${locale}/projects/rag-platform` },
    { title: locale === "ar" ? "إطار عمل تقييم النماذج" : "LLM Evaluation Framework", category: "Projects", url: `/${locale}/projects/evaluation-framework` },
    { title: locale === "ar" ? "لوحة تحليلات المراقبة" : "Observability Telemetry Dashboard", category: "Observability", url: `/${locale}/dashboard` },
    { title: locale === "ar" ? "ماذا أفعل الآن؟" : "What I'm doing Now", category: "Now", url: `/${locale}/now` },
    { title: locale === "ar" ? "السيرة الذاتية التفاعلية" : "Interactive CV / Resume", category: "CV", url: `/${locale}/resume` },
  ];

  const handleSearch = (val: string) => {
    setQuery(val);
    if (!val.trim()) {
      setResults([]);
      return;
    }
    const filtered = items.filter((item) =>
      item.title.toLowerCase().includes(val.toLowerCase()) ||
      item.category.toLowerCase().includes(val.toLowerCase())
    );
    setResults(filtered);
  };

  const handleSelect = (url: string) => {
    router.push(url);
    onClose();
    setQuery("");
    setResults([]);
  };

  if (!isOpen) return null;

  const isAr = locale === "ar";

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.icon}>🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={isAr ? "ابحث عن ملفات، خبرات، أو تقارير..." : "Search documents, experience, or logs..."}
          />
          <button type="button" className={styles.esc} onClick={onClose}>
            ESC
          </button>
        </div>

        <div className={styles.body}>
          {results.length > 0 ? (
            <div className={styles.list}>
              <h5 className={styles.sectionTitle}>{isAr ? "النتائج المطابقة" : "Matching Results"}</h5>
              {results.map((item, idx) => (
                <div
                  key={idx}
                  className={styles.item}
                  onClick={() => handleSelect(item.url)}
                >
                  <span className={styles.itemTitle}>{item.title}</span>
                  <span className={styles.itemCategory}>{item.category}</span>
                </div>
              ))}
            </div>
          ) : query.trim() ? (
            <div className={styles.empty}>{isAr ? "لا توجد نتائج مطابقة." : "No matching results found."}</div>
          ) : (
            <div className={styles.list}>
              <h5 className={styles.sectionTitle}>{isAr ? "المقترحات السريعة" : "Quick Links"}</h5>
              {items.slice(0, 4).map((item, idx) => (
                <div
                  key={idx}
                  className={styles.item}
                  onClick={() => handleSelect(item.url)}
                >
                  <span className={styles.itemTitle}>{item.title}</span>
                  <span className={styles.itemCategory}>{item.category}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
