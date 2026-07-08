"use client";

interface ResumeActionsProps {
  isAr: boolean;
}

export function ResumeActions({ isAr }: ResumeActionsProps) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      style={{
        padding: "0.5rem 1.25rem",
        backgroundColor: "hsl(var(--color-primary))",
        color: "#F8FAFC",
        border: "none",
        borderRadius: "var(--radius-sm)",
        fontSize: "0.875rem",
        fontWeight: "600",
        cursor: "pointer",
        transition: "background var(--transition-fast)",
      }}
    >
      📄 {isAr ? "تحميل كـ PDF / طباعة" : "Download PDF / Print"}
    </button>
  );
}
