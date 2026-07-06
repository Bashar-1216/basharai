# 🎨 06 - UI/UX Specification | مواصفات واجهة المستخدم وتجربة الاستخدام

> **المشروع**: basharai — Personal AI Engineering Platform
> **الحالة**: 🔴 لم يبدأ بعد | Not Started
> **آخر تحديث**: 2026-07-06

---

## 🎯 الغرض من هذا المجلد | Folder Purpose

يحتوي هذا المجلد على **مواصفات واجهة المستخدم وتجربة الاستخدام الكاملة** لمنصة basharai. يشمل نظام التصميم (Design System)، wireframes، تدفقات المستخدم (User Flows)، واستراتيجيات الـ responsive design والـ RTL — وهي ضرورية لمنصة تستهدف سوق الخليج العربي بدعم كامل للعربية.

This folder contains the **complete UI/UX specification** for the basharai platform. It includes the design system, wireframes, user flows, and strategies for responsive design and RTL layout — critical for a platform targeting the GCC market with full Arabic language support.

---

## 📄 المستندات المتوقعة | Expected Documents

| # | الملف | الوصف | الحالة |
|---|-------|-------|--------|
| 06.1 | `06.1-Design-System.md` | نظام التصميم الشامل — color palette (light/dark mode), typography scale (Arabic & English fonts), spacing system, component library (buttons, cards, inputs, modals). | 🔴 Not Started |
| 06.2 | `06.2-Page-Inventory.md` | جرد كامل لصفحات المنصة — every page, its purpose, primary content, key interactions, and navigation hierarchy. | 🔴 Not Started |
| 06.3 | `06.3-Wireframes/` | مجلد الإطارات الشبكية — wireframe files for each page/component, organized by section (public site, admin panel, AI chat). | 🔴 Not Started |
| 06.4 | `06.4-User-Flows.md` | خرائط رحلة المستخدم — user journey maps for key personas: recruiter browsing portfolio, visitor chatting with AI, admin managing content. | 🔴 Not Started |
| 06.5 | `06.5-Responsive-Strategy.md` | استراتيجية التصميم المتجاوب — breakpoints, mobile-first approach, tablet adaptations, desktop optimizations, touch-friendly interactions. | 🔴 Not Started |
| 06.6 | `06.6-RTL-Strategy.md` | استراتيجية الكتابة من اليمين لليسار — RTL layout architecture, bidirectional text handling, mirrored components, CSS logical properties, Arabic typography best practices. | 🔴 Not Started |
| 06.7 | `06.7-Accessibility.md` | الوصولية — WCAG 2.1 AA compliance plan, ARIA labels, keyboard navigation, screen reader support, color contrast requirements. | 🔴 Not Started |
| 06.8 | `06.8-Animation-Spec.md` | مواصفات الحركة والتفاعل — micro-interactions, page transitions, loading states, scroll animations, reduced-motion preferences. | 🔴 Not Started |

---

## 🔗 الاعتماديات | Dependencies

يعتمد هذا المجلد على المراحل التالية:

| المرحلة | السبب |
|---------|-------|
| `01-Project-Brief` | فهم الجمهور المستهدف (GCC recruiters, tech community) والانطباع المطلوب |
| `02-PRD` | متطلبات المنتج التي تحدد الصفحات والميزات المطلوبة |
| `03-Architecture` | فهم الـ frontend framework (Next.js) والقيود التقنية |
| `05-API` | فهم البيانات المتاحة لكل صفحة وتصميم الـ states (loading, error, empty) |

---

## ⏰ متى يجب العمل على هذه المرحلة | When to Work on This Phase

> **التوقيت المثالي**: بالتوازي مع مرحلة API (05) أو بعدها مباشرة.

هذه المرحلة يمكن أن تبدأ **بالتوازي مع مواصفات الـ API**. نظام التصميم و wireframes يمكن أن يبدآ بمجرد اكتمال الـ PRD. استراتيجية الـ RTL مهمة بشكل خاص لأن المنصة تستهدف سوق الخليج العربي.

This phase can begin **in parallel with API specification**. The design system and wireframes can start as soon as the PRD is complete. The RTL strategy is especially critical since the platform targets the GCC market and must provide a first-class Arabic experience.

### الأولوية المقترحة | Suggested Priority

1. ✅ `06.1-Design-System.md` — الأساس لكل شيء بصري
2. ✅ `06.6-RTL-Strategy.md` — حرج لسوق الخليج، يؤثر على كل القرارات التصميمية
3. ✅ `06.2-Page-Inventory.md` — تحديد نطاق العمل التصميمي
4. ✅ `06.4-User-Flows.md` — فهم رحلة المستخدم قبل التصميم التفصيلي
5. ⬜ `06.5-Responsive-Strategy.md` — القواعد العامة للتجاوب
6. ⬜ `06.3-Wireframes/` — بعد تحديد الصفحات والتدفقات
7. ⬜ `06.7-Accessibility.md` — يمكن تطويرها بالتوازي مع الـ wireframes
8. ⬜ `06.8-Animation-Spec.md` — التفاصيل الأخيرة بعد استقرار التصميم

---

## 📝 ملاحظات | Notes

- **الدعم الثنائي للغات أساسي**: كل component يجب أن يُصمّم للعمل بالعربية والإنجليزية من البداية.
- **RTL ليست مجرد mirror**: بعض العناصر (icons, charts, media players) لا تنعكس. يجب توثيق الاستثناءات.
- **الخطوط العربية**: يجب اختيار خط عربي احترافي يتناسب مع الخط الإنجليزي المختار (e.g., IBM Plex Arabic + IBM Plex Sans).
- **الوضع الداكن (Dark Mode)**: المنصة يجب أن تدعم dark/light mode كمعيار لمنصات المطورين.
- **الأداء البصري**: يجب أن تعكس المنصة مستوى احترافي يليق بمهندس ذكاء اصطناعي بخبرة في Amazon و Grammarly.

---

*هذا الملف جزء من وثائق مشروع basharai — منصة هندسة الذكاء الاصطناعي الشخصية.*
