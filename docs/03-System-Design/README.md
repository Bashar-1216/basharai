# 📐 Phase 03 — System Design
## مرحلة ٣ — التصميم النظامي

---

## Phase Status | حالة المرحلة

| Field | Value |
|-------|-------|
| **Status** | 🔲 **Not Started** |
| **Dependencies** | Phase 01 (PRD) — ✅ Complete, Phase 02 (Architecture) — 🔲 Not Started |
| **Blocks** | Implementation phase |
| **Estimated Sub-documents** | 6 |
| **When to Start** | After Phase 02 (Architecture) is substantially complete |

---

## Folder Purpose | الغرض من هذا المجلد

This phase answers the question: **ما هو شكل النظام؟ — What does the system look like?**

System Design translates architectural decisions into **visual diagrams and flow documentation**. Where Architecture says "we will use X," System Design shows "here is how X connects to Y and Z, with data flowing in this direction."

مرحلة التصميم النظامي تترجم القرارات المعمارية إلى **رسوم بيانية مرئية وتوثيق تدفقات**. حيث تقول العمارة "سنستخدم X"، يُظهر التصميم النظامي "هكذا يتصل X بـ Y وZ، مع تدفق البيانات في هذا الاتجاه."

---

## Expected Documents | الوثائق المتوقعة

| # | Document | Description | الوصف | Status |
|---|----------|-------------|-------|--------|
| 03.1 | **High-Level-Architecture.md** | System overview diagram — shows all major components (frontend, backend, database, vector store, external APIs) and how they connect at the highest level | رسم عام للنظام — جميع المكونات الرئيسية وكيف تتصل ببعضها | 🔲 Not Started |
| 03.2 | **RAG-Flow.md** | RAG pipeline flow — step-by-step visualization of how a user query enters the system, gets embedded, retrieves relevant chunks, and generates a response | تدفق خط أنابيب RAG — من استعلام المستخدم إلى الاستجابة النهائية | 🔲 Not Started |
| 03.3 | **Authentication-Flow.md** | Auth flows — login, registration, OAuth callback, session refresh, and logout sequences as sequence diagrams | تدفقات المصادقة — تسجيل الدخول، التسجيل، OAuth كرسوم تسلسلية | 🔲 Not Started |
| 03.4 | **Deployment-Flow.md** | CI/CD pipeline — from code push to production deployment, including build, test, preview, and promote stages | خط أنابيب CI/CD — من دفع الكود إلى النشر في الإنتاج | 🔲 Not Started |
| 03.5 | **Data-Flow.md** | Data flow diagrams — how data moves through the system: user input → API → processing → storage → response, including caching layers | رسوم تدفق البيانات — كيف تتحرك البيانات عبر النظام | 🔲 Not Started |
| 03.6 | **Component-Diagram.md** | Component interactions — detailed view of frontend components, backend services, and their communication patterns (REST, WebSocket, etc.) | تفاعلات المكونات — عرض تفصيلي للمكونات الأمامية والخلفية وأنماط تواصلها | 🔲 Not Started |

---

## Diagram Standards | معايير الرسوم البيانية

All diagrams in this phase should follow these conventions:

| Standard | Details |
|----------|---------|
| **Primary Format** | Mermaid (`.md` with embedded Mermaid blocks) — version-control friendly |
| **Backup Format** | PNG/SVG exports stored alongside for quick viewing |
| **Color Coding** | Frontend (blue), Backend (green), Database (orange), External Services (gray) |
| **Naming** | Components use their actual technology names (e.g., "Next.js App Router" not "Frontend") |
| **Bilingual Labels** | Diagram titles bilingual; internal labels in English for technical clarity |

---

## How Architecture Feeds System Design | كيف تغذي العمارة التصميم النظامي

| Architecture Document | Feeds Into System Design |
|----------------------|--------------------------|
| 02.1 Technology Stack | 03.1 High-Level Architecture, 03.6 Component Diagram |
| 02.2 Infrastructure | 03.4 Deployment Flow |
| 02.3 Authentication | 03.3 Authentication Flow |
| 02.5 RAG Architecture | 03.2 RAG Flow |
| 02.8 Performance | 03.5 Data Flow (caching layers) |
| All documents | 03.1 High-Level Architecture (unified view) |

---

## Document Writing Order | ترتيب كتابة الوثائق

> [!TIP]
> ابدأ بالرسم العام أولاً، ثم انتقل إلى التدفقات التفصيلية. كل رسم تفصيلي هو "تكبير" لجزء من الرسم العام.

**Recommended sequence:**

```
03.1 High-Level Architecture    ← The "big picture" — start here
  ↓
03.6 Component Diagram          ← Zoom into components
  ↓
03.5 Data Flow                  ← How data moves between components
  ↓
03.2 RAG Flow                   ← Deep dive: core AI feature
  ↓
03.3 Authentication Flow        ← Deep dive: auth sequences
  ↓
03.4 Deployment Flow            ← How it all gets to production
```

---

## Quality Criteria | معايير الجودة

Each diagram document should meet these criteria before being marked complete:

- [ ] **Self-explanatory** — A senior engineer unfamiliar with the project can understand it without verbal explanation
- [ ] **Consistent** — Uses the same component names and colors across all diagrams
- [ ] **Complete** — Covers both the happy path and key error/edge cases
- [ ] **Bilingual** — Title and summary in both English and Arabic
- [ ] **Traceable** — References the specific Architecture document(s) it implements

---

## What Comes Next | ما التالي

System Design diagrams, together with Phase 04 (Database), provide everything needed to begin **implementation**:

- Frontend component hierarchy is clear from 03.6
- API contracts are visible from 03.5
- The RAG pipeline is fully mapped in 03.2
- Deployment strategy is documented in 03.4

> [!NOTE]
> مرحلة التصميم النظامي ومرحلة قاعدة البيانات يمكن أن تسيرا بالتوازي بعد اكتمال مرحلة العمارة.
> System Design (Phase 03) and Database (Phase 04) can proceed in parallel once Architecture (Phase 02) is substantially complete.

---

*Last updated: July 6, 2026*
