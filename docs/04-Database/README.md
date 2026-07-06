# 🗄️ Phase 04 — Database Design
## مرحلة ٤ — تصميم قاعدة البيانات

---

## Phase Status | حالة المرحلة

| Field | Value |
|-------|-------|
| **Status** | 🔲 **Not Started** |
| **Dependencies** | Phase 01 (PRD) — ✅ Complete, Phase 02 (Architecture) — 🔲 Not Started |
| **Blocks** | Implementation phase |
| **Estimated Sub-documents** | 5 |
| **When to Start** | After Phase 02 (Architecture) is substantially complete — can run in parallel with Phase 03 |

---

## Folder Purpose | الغرض من هذا المجلد

This phase answers the question: **كيف ننظّم البيانات؟ — How do we organize data?**

Database Design translates the data requirements from the PRD and the technology choices from Architecture into concrete **schemas, relationships, and data management strategies**. This includes both traditional relational data (PostgreSQL) and vector embeddings storage for the RAG pipeline.

مرحلة تصميم قاعدة البيانات تترجم متطلبات البيانات من وثيقة المتطلبات والخيارات التقنية من العمارة إلى **مخططات وعلاقات واستراتيجيات إدارة بيانات** ملموسة. يشمل ذلك البيانات العلائقية التقليدية (PostgreSQL) وتخزين المتجهات (embeddings) لخط أنابيب RAG.

---

## Expected Documents | الوثائق المتوقعة

| # | Document | Description | الوصف | Status |
|---|----------|-------------|-------|--------|
| 04.1 | **ERD.md** | Entity Relationship Diagram — visual representation of all entities (users, projects, case studies, blog posts, conversations, etc.) and their relationships | رسم العلاقات بين الكيانات — عرض مرئي لجميع الكيانات وعلاقاتها | 🔲 Not Started |
| 04.2 | **Schema.md** | Full schema definitions — complete SQL/ORM schema for every table, including column types, constraints, indexes, and comments | تعريفات المخطط الكاملة — كل جدول بأعمدته وقيوده وفهارسه | 🔲 Not Started |
| 04.3 | **Migrations-Strategy.md** | Migration approach — tooling (Alembic/Prisma), versioning strategy, rollback procedures, zero-downtime migration patterns | استراتيجية الترحيل — الأدوات، إصدار المخططات، إجراءات التراجع | 🔲 Not Started |
| 04.4 | **Seed-Data.md** | Initial data — what data ships with a fresh deployment: default content, sample case studies, configuration records, and admin user setup | البيانات الأولية — ما يُشحن مع كل نشر جديد | 🔲 Not Started |
| 04.5 | **Vector-Store.md** | Embeddings storage — vector database design for the RAG pipeline: embedding dimensions, indexing strategy (HNSW/IVF), metadata schema, and query patterns | تصميم تخزين المتجهات لخط أنابيب RAG — الأبعاد، الفهرسة، المخطط | 🔲 Not Started |

---

## Key Data Domains | مجالات البيانات الرئيسية

Based on the PRD, the database must support these primary data domains:

```
┌─────────────────────────────────────────────────────────┐
│                    basharai Data Domains                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  👤 User & Auth         │  📝 Content & Portfolio       │
│  ─────────────          │  ──────────────────           │
│  • User accounts        │  • Case studies (NDA-safe)    │
│  • Sessions             │  • Blog posts / articles      │
│  • OAuth tokens         │  • Project showcases          │
│  • Roles & permissions  │  • Technical writing          │
│                         │                               │
│  🤖 RAG & AI            │  📊 Analytics & Eval          │
│  ──────────             │  ────────────────             │
│  • Vector embeddings    │  • Query logs                 │
│  • Conversation history │  • Response evaluations       │
│  • Chunk metadata       │  • Performance metrics        │
│  • Source documents     │  • Dashboard data             │
│                         │                               │
│  🌐 i18n & Config       │                               │
│  ─────────────          │                               │
│  • Translations (EN/AR) │                               │
│  • Site configuration   │                               │
│  • Feature flags        │                               │
│                         │                               │
└─────────────────────────────────────────────────────────┘
```

---

## How Architecture Feeds Database Design | كيف تغذي العمارة تصميم قاعدة البيانات

| Architecture Document | Feeds Into Database Design |
|----------------------|---------------------------|
| 02.1 Technology Stack | Choice of PostgreSQL, ORM, vector store technology |
| 02.3 Authentication | User/session/token schema in 04.2 |
| 02.4 Internationalization | Translation storage strategy in 04.2 |
| 02.5 RAG Architecture | Vector store design in 04.5, chunk metadata in 04.2 |
| 02.6 Logging & Monitoring | Analytics/eval tables in 04.2 |
| 02.10 Configuration Management | Config/feature flag tables in 04.2 |

---

## Document Writing Order | ترتيب كتابة الوثائق

> [!TIP]
> ابدأ بالكيانات والعلاقات أولاً (ERD)، ثم فصّل المخطط، ثم خطط للترحيل والبيانات الأولية. المتجهات يمكن أن تُكتب بالتوازي.

**Recommended sequence:**

```
04.1 ERD                    ← Define entities and relationships first
  ↓
04.2 Schema                 ← Translate ERD into concrete schema
  ↓
04.5 Vector Store           ← Can run in parallel with 04.2
  ↓
04.3 Migrations Strategy    ← How we version and deploy schema changes
  ↓
04.4 Seed Data              ← What ships with a fresh deployment
```

---

## Design Principles | مبادئ التصميم

1. **Bilingual from the start** — Schema must natively support EN/AR content, not as an afterthought
2. **NDA-aware data model** — Clear separation between public portfolio data and any reference metadata
3. **Vector-native** — Embeddings storage is a first-class concern, not bolted on later
4. **Migration-safe** — Every schema change must be reversible and support zero-downtime deployment
5. **Seed-complete** — A fresh deployment should be immediately functional with meaningful sample data

---

## Quality Criteria | معايير الجودة

Each document should meet these criteria before being marked complete:

- [ ] **Normalized appropriately** — No unnecessary denormalization, but pragmatic where performance demands it
- [ ] **Indexed strategically** — Indexes defined based on actual query patterns, not guesswork
- [ ] **Bilingual-ready** — All user-facing text fields support both EN and AR content
- [ ] **Documented** — Every table, column, and relationship has a clear purpose comment
- [ ] **Traceable** — References the specific PRD requirements and Architecture decisions it implements

---

## What Comes Next | ما التالي

With Database Design complete alongside System Design (Phase 03), the project has everything needed to begin **implementation**:

- ERD provides the data model foundation
- Schema definitions can be directly translated to migration files
- Vector store design guides the RAG pipeline implementation
- Seed data enables immediate testing after deployment

> [!NOTE]
> مرحلة قاعدة البيانات ومرحلة التصميم النظامي (٣) يمكن أن تسيرا بالتوازي. كلاهما يعتمد على مرحلة العمارة (٢) وكلاهما يغذي مرحلة التنفيذ.
> Database Design (Phase 04) and System Design (Phase 03) can run in parallel. Both depend on Architecture (Phase 02) and both feed into Implementation.

---

*Last updated: July 6, 2026*
