"use client";

interface ResumeActionsProps {
  isAr: boolean;
}

export function ResumeActions({ isAr }: ResumeActionsProps) {
  return (
    <a
      href="/api/resume/download"
      download="Bashar_Almuntaser_AI_Engineer.pdf"
      style={{
        padding: "0.5rem 1.25rem",
        backgroundColor: "hsl(var(--color-primary))",
        color: "#F8FAFC",
        border: "none",
        borderRadius: "var(--radius-sm)",
        fontSize: "0.875rem",
        fontWeight: "600",
        cursor: "pointer",
        textDecoration: "none",
        display: "inline-block",
        transition: "background var(--transition-fast)",
      }}
    >
      📄 {isAr ? "تحميل كـ PDF" : "Download PDF"}
    </a>
  );
}
