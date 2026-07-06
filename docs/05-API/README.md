# 📡 05 - API Specification | مواصفات واجهة برمجة التطبيقات

> **المشروع**: basharai — Personal AI Engineering Platform
> **الحالة**: 🔴 لم يبدأ بعد | Not Started
> **آخر تحديث**: 2026-07-06

---

## 🎯 الغرض من هذا المجلد | Folder Purpose

يحتوي هذا المجلد على **المواصفات الكاملة لواجهة برمجة التطبيقات (API)** لمنصة basharai. يغطي جميع الـ endpoints المطلوبة للمنصة بما في ذلك المصادقة، إدارة المحتوى، خدمات الذكاء الاصطناعي (Chat, RAG, Evaluation)، ولوحة الإدارة.

This folder contains the **complete API specification** for the basharai platform. It covers all endpoints required for authentication, content management, AI services (Chat, RAG, Evaluation), and the admin panel — designed to power a professional AI engineering portfolio targeting the GCC market.

---

## 📄 المستندات المتوقعة | Expected Documents

| # | الملف | الوصف | الحالة |
|---|-------|-------|--------|
| 05.1 | `05.1-API-Overview.md` | مبادئ تصميم RESTful API، استراتيجية الإصدارات (versioning)، base URL structure، وقواعد التسمية العامة. | 🔴 Not Started |
| 05.2 | `05.2-Authentication-Endpoints.md` | واجهات المصادقة والتفويض — registration, login, token refresh, OAuth flows, password reset. | 🔴 Not Started |
| 05.3 | `05.3-Content-Endpoints.md` | واجهات إدارة المحتوى — Projects CRUD, Experience/Resume data, Blog posts, Skills taxonomy. | 🔴 Not Started |
| 05.4 | `05.4-AI-Endpoints.md` | واجهات خدمات الذكاء الاصطناعي — Chat completions, RAG-powered Q&A, LLM evaluation triggers, streaming responses. | 🔴 Not Started |
| 05.5 | `05.5-Admin-Endpoints.md` | واجهات لوحة الإدارة — CMS operations, analytics dashboards, content moderation, user management. | 🔴 Not Started |
| 05.6 | `05.6-Error-Codes.md` | نظام أكواد الأخطاء الموحد — standardized error response format, error code registry, localized error messages (EN/AR). | 🔴 Not Started |
| 05.7 | `05.7-Rate-Limiting.md` | استراتيجية تحديد معدل الطلبات — rate limiting tiers, throttling policy, burst handling, per-endpoint limits. | 🔴 Not Started |
| 05.8 | `05.8-OpenAPI-Spec.yaml` | ملف المواصفات القابل للقراءة آلياً — machine-readable OpenAPI 3.1 specification for automated tooling, SDK generation, and Swagger UI. | 🔴 Not Started |

---

## 🔗 الاعتماديات | Dependencies

يعتمد هذا المجلد على المراحل التالية:

| المرحلة | السبب |
|---------|-------|
| `01-Project-Brief` | فهم أهداف المشروع العامة والجمهور المستهدف |
| `02-PRD` | متطلبات المنتج التفصيلية التي تحدد الـ features المطلوبة |
| `03-Architecture` | القرارات المعمارية التي تحدد بنية الـ API (microservices vs monolith, database schema) |
| `04-Data-Model` | مخطط قاعدة البيانات الذي يحدد الـ request/response schemas |

---

## ⏰ متى يجب العمل على هذه المرحلة | When to Work on This Phase

> **التوقيت المثالي**: بعد الانتهاء من مراحل Architecture (03) و Data Model (04).

هذه المرحلة تأتي **بعد تحديد البنية المعمارية ونموذج البيانات** وقبل البدء في التطوير الفعلي. مواصفات الـ API تعمل كعقد (contract) بين الـ frontend والـ backend، مما يسمح للفريقين بالعمل بشكل متوازٍ.

This phase should begin **after Architecture and Data Model are finalized** and before active development starts. The API specification serves as a contract between frontend and backend, enabling parallel development workflows.

### الأولوية المقترحة | Suggested Priority

1. ✅ `05.1-API-Overview.md` — ابدأ هنا لتحديد القواعد العامة
2. ✅ `05.2-Authentication-Endpoints.md` — المصادقة أولاً لأنها أساس كل شيء
3. ✅ `05.4-AI-Endpoints.md` — الـ AI endpoints هي القيمة المضافة الأساسية للمنصة
4. ⬜ `05.3-Content-Endpoints.md` — المحتوى يأتي بعد الأساسيات
5. ⬜ `05.5-Admin-Endpoints.md` — الإدارة يمكن أن تتأخر قليلاً
6. ⬜ `05.6-Error-Codes.md` + `05.7-Rate-Limiting.md` — يمكن تطويرها بالتوازي
7. ⬜ `05.8-OpenAPI-Spec.yaml` — يُولّد تلقائياً أو يُكتب أخيراً

---

## 📝 ملاحظات | Notes

- جميع الـ API responses يجب أن تدعم **اللغتين العربية والإنجليزية** (bilingual error messages, content).
- يجب مراعاة **GCC market requirements** في تصميم الـ API (timezone handling, locale support).
- الـ AI endpoints يجب أن تدعم **streaming responses** (Server-Sent Events) للـ chat functionality.
- يُفضّل استخدام **OpenAPI 3.1** لتوليد SDK و documentation تلقائياً.

---

*هذا الملف جزء من وثائق مشروع basharai — منصة هندسة الذكاء الاصطناعي الشخصية.*
