# 🚀 bashar.ai — Personal AI Engineering Platform

> **"المقر الرقمي" — Digital Headquarters**

[![Phase](https://img.shields.io/badge/Current_Phase-07_Development-blue)]()
[![PRD](https://img.shields.io/badge/PRD-v2.0_Complete-green)]()
[![Status](https://img.shields.io/badge/Status-Planning-orange)]()

---

## Vision | الرؤية

A bilingual (EN/AR) engineering platform that reads, within 60 seconds, as unmistakable evidence — not a claim — that this is an engineer who has already shipped inside real production AI systems, and who independently builds and rigorously evaluates LLM systems when left to his own judgment.

منصة هندسية ثنائية اللغة (عربي/إنجليزي) تُقرأ خلال 60 ثانية كدليل لا يقبل الشك — وليس ادعاءً — أن هذا مهندس شحن أنظمة ذكاء اصطناعي حقيقية في بيئة الإنتاج، ويبني ويُقيّم أنظمة LLM بشكل مستقل وصارم.

---

## 📊 Project Status Dashboard | لوحة حالة المشروع

| # | Phase | المرحلة | Status | Progress |
|---|-------|---------|--------|----------|
| 01 | [PRD](./docs/01-PRD/) | متطلبات المنتج | ✅ Complete | █████████░ 100% |
| 02 | [Architecture](./docs/02-Architecture/) | هندسة البنية | ✅ Complete | █████████░ 100% |
| 03 | [System Design](./docs/03-System-Design/) | تصميم النظام | ✅ Complete | █████████░ 100% |
| 04 | [Database Design](./docs/04-Database/) | تصميم قواعد البيانات | ✅ Complete | █████████░ 100% |
| 05 | [API Design](./docs/05-API/) | تصميم الواجهات البرمجية | ✅ Complete | █████████░ 100% |
| 06 | [UI/UX](./docs/06-UI-UX/) | تصميم واجهة المستخدم | ✅ Complete | █████████░ 100% |
| 07 | [Development](./docs/07-Development/) | خطة التطوير | ⬜ Not Started | ░░░░░░░░░░ 0% |
| 08 | [Testing](./docs/08-Testing/) | الاختبارات | ⬜ Not Started | ░░░░░░░░░░ 0% |
| 09 | [Deployment](./docs/09-Deployment/) | النشر | ⬜ Not Started | ░░░░░░░░░░ 0% |
| 10 | [Operations](./docs/10-Operations/) | العمليات والمراقبة | ⬜ Not Started | ░░░░░░░░░░ 0% |

---

## 🏗️ Tech Stack Overview | نظرة عامة على التقنيات

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | Next.js 15 (App Router) | SSR/SSG, i18n routing, React ecosystem |
| **Backend API** | FastAPI (Python) | Async, OpenAPI auto-docs, ML ecosystem |
| **Database** | PostgreSQL | Robust, JSON support, proven at scale |
| **Vector Store** | pgvector / Pinecone | Embedding storage for RAG |
| **Cache** | Redis | Session management, API caching |
| **AI/LLM** | OpenAI API | GPT-4 for RAG assistant |
| **Auth** | NextAuth.js / JWT | OAuth + session management |
| **Styling** | Tailwind CSS | Rapid, responsive, RTL support |
| **Deployment** | Vercel + Railway/Render | Free-tier-first approach |
| **Monitoring** | Custom dashboard (Epic E2) | The dashboard IS the project |

> **Note:** Final technology decisions will be documented in `docs/02-Architecture/02.1-Technology-Stack.md` with full justification for each choice.

---

## 📅 Timeline Overview | الجدول الزمني

```
Phase 0 (Weeks 1-2)     ← Positioning, research, case study drafts
    ↓
Phase 1 (Weeks 3-6)     ← MVP Launch: Landing, Resume, Experience pages
    ↓
Phase 2 (Weeks 7-11)    ← RAG Assistant (Epic E1) + Blog
    ↓
Phase 3 (Weeks 12-16)   ← Eval Dashboard (Epic E2) + Hardening
    ↓
Phase 4 (Month 4+)      ← Content cadence, outreach, backlog
```

---

## 🎯 Content Pillars | ركائز المحتوى

| Pillar | الركيزة | Description |
|--------|---------|-------------|
| **Professional Experience** | الخبرة المهنية | Amazon & Grammarly case studies (NDA-safe, general-impact framing) |
| **Personal Flagship Projects** | المشاريع الشخصية الرائدة | RAG Assistant + Eval Dashboard (full technical disclosure) |
| **Technical Writing** | الكتابة التقنية | Blog posts demonstrating depth of thinking |

---

## 🗂️ Repository Structure | هيكل المستودع

```
basharai/
│
├── README.md                           ← 📌 You are here
├── CONTRIBUTING.md                     ← Workflow & conventions
├── AI-Engineer-Platform-PRD-v2.md      ← 📄 The PRD (Source of Truth)
├── .gitignore
│
├── docs/                               ← 📚 All project documentation
│   ├── README.md                       ← Documentation master index
│   ├── GLOSSARY.md                     ← Key terms & definitions
│   ├── DECISIONS.md                    ← Architecture Decision Records
│   │
│   ├── 01-PRD/                         ← Product Requirements ✅
│   ├── 02-Architecture/                ← Architecture Document
│   ├── 03-System-Design/               ← System Design & Diagrams
│   ├── 04-Database/                    ← Database Design
│   ├── 05-API/                         ← API Specification
│   ├── 06-UI-UX/                       ← UI/UX Specification
│   ├── 07-Development/                 ← Development Plan & Sprints
│   ├── 08-Testing/                     ← Testing Strategy
│   ├── 09-Deployment/                  ← Deployment & CI/CD
│   └── 10-Operations/                  ← Operations & Monitoring
│
└── src/                                ← 💻 Source code (Phase 7+)
    ├── frontend/                       ← Next.js application
    └── backend/                        ← FastAPI application
```

---

## 👤 Team | الفريق

| Role | Who |
|------|-----|
| **Product Owner / Architect** | Bashar (You) |
| **AI Pair Programmer** | Antigravity AI |
| **Approach** | Solo hands-on-code, enterprise-grade process |

---

## 🔗 Quick Links | روابط سريعة

- 📄 [PRD v2.0](./AI-Engineer-Platform-PRD-v2.md) — What we're building
- 📚 [Documentation Hub](./docs/README.md) — All project docs
- 📖 [Glossary](./docs/GLOSSARY.md) — Key terms
- 📝 [Decision Log](./docs/DECISIONS.md) — Architecture decisions
- 📋 [Contributing Guide](./CONTRIBUTING.md) — Workflow & conventions

---

## 🏁 Next Steps | الخطوات القادمة

1. **Now:** Set up the project workspace structure ← ✅ Done
2. **Next:** Write the Architecture Document (`docs/02-Architecture/`)
3. **Then:** Create System Design diagrams (`docs/03-System-Design/`)
4. **Then:** Design the database schema (`docs/04-Database/`)

---

*Last updated: July 6, 2026*
*هذا المستند هو المصدر الوحيد للحقيقة لمشروع bashar.ai*
