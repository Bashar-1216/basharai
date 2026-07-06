# 🏗️ Phase 02 — Architecture Document
## مرحلة ٢ — وثيقة العمارة التقنية

---

## Phase Status | حالة المرحلة

| Field | Value |
|-------|-------|
| **Status** | ✅ **Complete** |
| **Dependencies** | Phase 01 (PRD) — ✅ Complete |
| **Blocks** | Phase 03 (System Design), Phase 04 (Database) |
| **Estimated Sub-documents** | 10 |
| **When to Start** | Immediately after PRD review and approval |

---

## Folder Purpose | الغرض من هذا المجلد

This phase answers the critical question: **كيف سنبنيه؟ — How will we build it?**

The Architecture phase translates the PRD's *what* into concrete technical decisions. Every technology choice, infrastructure decision, and architectural pattern is documented here with clear rationale.

مرحلة العمارة تترجم "ماذا" من وثيقة المتطلبات إلى قرارات تقنية ملموسة. كل اختيار تقني، قرار بنية تحتية، ونمط معماري يتم توثيقه هنا مع مبررات واضحة.

---

## Expected Documents | الوثائق المتوقعة

| # | Document | Description | الوصف | Status |
|---|----------|-------------|-------|--------|
| 02.1 | [**Technology-Stack.md**](./02.1-Technology-Stack.md) | Why Next.js for frontend, FastAPI for backend, PostgreSQL for data, and every other technology choice — with alternatives considered and rejected | لماذا اخترنا كل تقنية وما البدائل التي تم رفضها | ✅ Complete |
| 02.2 | [**Infrastructure.md**](./02.2-Infrastructure.md) | Hosting platform selection, CDN strategy, DNS configuration, and deployment regions (GCC-optimized) | استضافة، شبكة توصيل محتوى، DNS، ومناطق النشر المحسّنة للخليج | ✅ Complete |
| 02.3 | [**Authentication.md**](./02.3-Authentication.md) | Auth strategy — OAuth providers, session management, JWT vs cookie decisions, role-based access | استراتيجية المصادقة والتحكم في الوصول | ✅ Complete |
| 02.4 | [**Internationalization.md**](./02.4-Internationalization.md) | i18n/l10n strategy for genuine EN/AR bilingual support — RTL layout, content translation approach, locale routing, date/number formatting | استراتيجية التعريب الحقيقي ثنائي اللغة (عربي/إنجليزي) | ✅ Complete |
| 02.5 | [**RAG-Architecture.md**](./02.5-RAG-Architecture.md) | RAG pipeline design — embedding model selection, vector store, chunking strategy, retrieval approach, prompt engineering, and evaluation methodology | تصميم خط أنابيب RAG — النماذج، التخزين المتجهي، استراتيجية التقطيع | ✅ Complete |
| 02.6 | [**Logging-Monitoring.md**](./02.6-Logging-Monitoring.md) | Observability strategy — structured logging, APM, error tracking, metrics collection, alerting, and the eval/observability dashboard architecture | استراتيجية المراقبة — سجلات منظمة، تتبع أخطاء، مقاييس أداء | ✅ Complete |
| 02.7 | [**Security.md**](./02.7-Security.md) | Security architecture — OWASP considerations, input sanitization, rate limiting, CORS, CSP headers, data encryption, and NDA-compliance safeguards | العمارة الأمنية وحماية البيانات | ✅ Complete |
| 02.8 | [**Performance.md**](./02.8-Performance.md) | Caching strategy (CDN, application, database), image optimization, bundle size management, Core Web Vitals targets, and GCC-region latency optimization | استراتيجية الأداء والتخزين المؤقت وتحسين السرعة في منطقة الخليج | ✅ Complete |
| 02.9 | [**Error-Handling.md**](./02.9-Error-Handling.md) | Error handling strategy — error boundaries, graceful degradation, user-facing error messages (bilingual), retry policies, and fallback behaviors | استراتيجية معالجة الأخطاء ورسائل المستخدم ثنائية اللغة | ✅ Complete |
| 02.10 | [**Configuration-Management.md**](./02.10-Configuration-Management.md) | Environment variables, secrets management, feature flags, configuration per environment (dev/staging/prod), and twelve-factor app compliance | إدارة المتغيرات البيئية والأسرار والتهيئة لكل بيئة | ✅ Complete |


---

## Guiding Principles | المبادئ التوجيهية

These principles (established in the PRD §10) guide all architectural decisions:

1. **Depth over breadth** — Better to do 2 things excellently than 7 things superficially
2. **Production-grade or don't bother** — Every component should be demonstrably production-ready
3. **GCC-first optimization** — Latency, CDN, and content delivery optimized for the Gulf region
4. **Genuinely bilingual** — Arabic is not a CSS afterthought; it's a first-class architectural concern
5. **Evidence-driven choices** — Every "why" must have a documented rationale, not "because it's popular"

---

## PRD Constraints to Honor | قيود وثيقة المتطلبات الواجب مراعاتها

From the PRD, these constraints are non-negotiable in architectural decisions:

- **Exactly 2 AI features** — RAG Assistant + Eval/Observability Dashboard
- **NDA compliance** — Architecture must support the confidentiality framework (Amazon/Grammarly content bounded)
- **Arabic hard requirement** — RTL, locale routing, bilingual content at the infrastructure level
- **Mid-level positioning** — Architecture should be sophisticated but not over-engineered; demonstrate competence, not complexity theater

---

## Document Writing Order | ترتيب كتابة الوثائق

> [!TIP]
> الترتيب المقترح أدناه يبني كل وثيقة على ما قبلها. التزم بالترتيب قدر الإمكان.

**Recommended sequence:**

```
02.1 Technology Stack        ← Foundation: defines all tools
  ↓
02.2 Infrastructure          ← Where the stack runs
  ↓
02.3 Authentication          ← Who can access it
  ↓
02.4 Internationalization    ← How it speaks two languages
  ↓
02.5 RAG Architecture        ← Core AI feature design
  ↓
02.6 Logging & Monitoring    ← How we observe it (includes eval dashboard)
  ↓
02.7 Security                ← How we protect it
  ↓
02.8 Performance             ← How we make it fast
  ↓
02.9 Error Handling          ← How we handle failure
  ↓
02.10 Configuration Mgmt    ← How we manage environments
```

---

## Dependencies on PRD | التبعيات على وثيقة المتطلبات

| PRD Section | Feeds Into |
|-------------|------------|
| §4 — AI Features | 02.5 RAG Architecture, 02.6 Logging & Monitoring |
| §7 — Confidentiality Framework | 02.7 Security, 02.3 Authentication |
| §10 — Architectural Constraints | All documents |
| §3 — Content Pillars | 02.4 Internationalization |
| §8 — Roadmap | 02.2 Infrastructure (phased deployment) |

---

## What Comes Next | ما التالي

Once the Architecture phase is complete:

- **Phase 03 (System Design)** can begin — translating architecture into visual diagrams and flows
- **Phase 04 (Database)** can begin — designing schemas that implement the architecture

> [!NOTE]
> مرحلة العمارة هي الأطول والأكثر تفصيلاً. خذ الوقت الكافي — القرارات هنا تؤثر على كل شيء يأتي بعدها.
> The Architecture phase is the longest and most detailed. Take the necessary time — decisions made here affect everything downstream.

---

*Last updated: July 6, 2026*
