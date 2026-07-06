# 📋 Phase 01 — Product Requirements Document (PRD)
## مرحلة ١ — وثيقة متطلبات المنتج

---

## Phase Status | حالة المرحلة

| Field | Value |
|-------|-------|
| **Status** | ✅ **Complete** |
| **Version** | v2.0 (supersedes v1.0) |
| **Date Completed** | July 2026 |
| **Dependencies** | None — this is the foundation phase |
| **Blocks** | Phase 02 (Architecture), Phase 03 (System Design), Phase 04 (Database) |

---

## Folder Purpose | الغرض من هذا المجلد

This phase answers the fundamental question: **ماذا نبني ولماذا؟ — What are we building and why?**

The PRD defines the complete product vision, target market, content strategy, feature scope, and success criteria for the basharai Personal AI Engineering Platform.

وثيقة متطلبات المنتج تحدد الرؤية الكاملة للمنتج، السوق المستهدف، استراتيجية المحتوى، نطاق الميزات، ومعايير النجاح لمنصة بشّر.ai.

---

## Document Location | موقع الوثيقة

> [!IMPORTANT]
> The PRD lives at the **project root**, not inside this folder.
> This is intentional — the PRD is a project-level document that predates the documentation structure.

**📄 Full PRD:** [`AI-Engineer-Platform-PRD-v2.md`](../../AI-Engineer-Platform-PRD-v2.md)

```
basharai/
├── AI-Engineer-Platform-PRD-v2.md    ← 📄 THE PRD IS HERE
└── docs/
    └── 01-PRD/
        └── README.md                 ← 📌 You are here (reference only)
```

---

## PRD Contents Summary | ملخص محتويات الوثيقة

The PRD v2.0 covers the following major sections:

| Section | Topic | الموضوع |
|---------|-------|---------|
| §0 | Discovery Summary v2.0 | ملخص الاستكشاف |
| §1 | Product Vision & Core Identity | رؤية المنتج والهوية الأساسية |
| §2 | Target Audience & Hiring Context | الجمهور المستهدف وسياق التوظيف |
| §3 | Content Pillars (3 pillars) | ركائز المحتوى |
| §4 | AI-Powered Features (RAG + Eval Dashboard) | الميزات المدعومة بالذكاء الاصطناعي |
| §5 | Epics & User Stories | الملاحم وقصص المستخدم |
| §6 | Engineering Evidence (dedicated Epic) | الأدلة الهندسية |
| §7 | Confidentiality Framework | إطار السرية |
| §8 | Roadmap & Phasing | خريطة الطريق والمراحل |
| §9 | Success Metrics | مقاييس النجاح |
| §10 | Architectural Constraints & Principles | القيود والمبادئ المعمارية |

---

## Key Decisions Captured in PRD | القرارات الرئيسية في الوثيقة

1. **GCC Priority Confirmed** — سوق الخليج (السعودية/الإمارات) يفوز عند وجود مفاضلة، حتى أمام OpenAI/Anthropic
2. **3 Content Pillars** — Professional Experience (NDA-safe) + Personal Flagship Projects + Technical Writing
3. **Exactly 2 AI Features** — RAG Assistant + Eval/Observability Dashboard (depth over breadth)
4. **Genuinely Bilingual** — Arabic is a hard requirement, not a translation layer
5. **Engineering Evidence Epic** — Promoted to its own dedicated Epic, not implicit

---

## What Comes Next | ما التالي

With the PRD complete, the next phase is **[Phase 02 — Architecture](../02-Architecture/README.md)**:

- Define the technology stack (Next.js, FastAPI, PostgreSQL, etc.)
- Design infrastructure and hosting strategy
- Plan authentication, i18n, and security architecture
- Design the RAG pipeline architecture

> [!NOTE]
> لا تعدّل وثيقة المتطلبات بعد بدء مرحلة العمارة إلا إذا ظهرت متطلبات جديدة تتطلب إعادة نظر.
> Do not modify the PRD after starting the Architecture phase unless new requirements emerge that warrant reconsideration.

---

*Last updated: July 6, 2026*
