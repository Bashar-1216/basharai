"use client";

interface ResumeActionsProps {
  isAr: boolean;
  activeView: "sheet" | "pdf";
  onToggleView: (view: "sheet" | "pdf") => void;
  onToggleCopilot: () => void;
}

export function ResumeActions({ isAr, activeView, onToggleView, onToggleCopilot }: ResumeActionsProps) {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
      {/* Toggle View Mode */}
      <div style={{ display: "flex", background: "rgba(255, 255, 255, 0.05)", borderRadius: "var(--radius-sm)", padding: "2px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
        <button
          type="button"
          onClick={() => onToggleView("sheet")}
          style={{
            padding: "0.4rem 0.85rem",
            backgroundColor: activeView === "sheet" ? "hsl(var(--color-primary))" : "transparent",
            color: activeView === "sheet" ? "#040D1A" : "hsl(var(--color-text-body))",
            border: "none",
            borderRadius: "var(--radius-xs)",
            fontSize: "0.8125rem",
            fontWeight: "700",
            cursor: "pointer",
            transition: "all var(--transition-fast)",
          }}
        >
          📝 {isAr ? "السيرة الذاتية التفاعلية" : "Interactive Sheet"}
        </button>
        <button
          type="button"
          onClick={() => onToggleView("pdf")}
          style={{
            padding: "0.4rem 0.85rem",
            backgroundColor: activeView === "pdf" ? "hsl(var(--color-primary))" : "transparent",
            color: activeView === "pdf" ? "#040D1A" : "hsl(var(--color-text-body))",
            border: "none",
            borderRadius: "var(--radius-xs)",
            fontSize: "0.8125rem",
            fontWeight: "700",
            cursor: "pointer",
            transition: "all var(--transition-fast)",
          }}
        >
          📄 {isAr ? "معاينة PDF المباشرة" : "PDF Preview"}
        </button>
      </div>

      {/* Download PDF Button */}
      <a
        href="/resume.pdf"
        download="Bashar_Almuntaser_AI_Engineer.pdf"
        style={{
          padding: "0.45rem 1rem",
          backgroundColor: "rgba(255, 255, 255, 0.08)",
          color: "hsl(var(--color-text))",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          borderRadius: "var(--radius-sm)",
          fontSize: "0.8125rem",
          fontWeight: "600",
          cursor: "pointer",
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          transition: "all var(--transition-fast)",
        }}
      >
        ⬇️ {isAr ? "تحميل PDF" : "Download PDF"}
      </a>

      {/* Print Button */}
      <button
        type="button"
        onClick={handlePrint}
        style={{
          padding: "0.45rem 0.85rem",
          backgroundColor: "rgba(255, 255, 255, 0.08)",
          color: "hsl(var(--color-text))",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          borderRadius: "var(--radius-sm)",
          fontSize: "0.8125rem",
          fontWeight: "600",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          transition: "all var(--transition-fast)",
        }}
      >
        🖨️ {isAr ? "طباعة" : "Print"}
      </button>

      {/* Fullscreen PDF Button */}
      <a
        href="/resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          padding: "0.45rem 0.85rem",
          backgroundColor: "rgba(255, 255, 255, 0.08)",
          color: "hsl(var(--color-text))",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          borderRadius: "var(--radius-sm)",
          fontSize: "0.8125rem",
          fontWeight: "600",
          cursor: "pointer",
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          transition: "all var(--transition-fast)",
        }}
      >
        🔍 {isAr ? "شاشة كاملة" : "Fullscreen"}
      </a>

      {/* Resume Copilot Drawer Trigger Button */}
      <button
        type="button"
        onClick={onToggleCopilot}
        style={{
          padding: "0.45rem 0.95rem",
          background: "linear-gradient(135deg, hsl(var(--color-primary)) 0%, #00B4D8 100%)",
          color: "#040D1A",
          border: "none",
          borderRadius: "var(--radius-sm)",
          fontSize: "0.8125rem",
          fontWeight: "800",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          boxShadow: "0 0 15px hsl(var(--color-primary) / 0.3)",
          transition: "all var(--transition-fast)",
        }}
      >
        ✨ {isAr ? "مساعد السيرة الذاتية (Resume Copilot)" : "Resume Copilot"}
      </button>
    </div>
  );
}
