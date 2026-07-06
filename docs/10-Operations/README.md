# ⚙️ 10 - Operations | العمليات والتشغيل

> **المشروع**: basharai — Personal AI Engineering Platform
> **الحالة**: ✅ مكتمل | Complete
> **آخر تحديث**: 2026-07-06

---

## 🎯 الغرض من هذا المجلد | Folder Purpose

يحتوي هذا المجلد على **وثائق العمليات والتشغيل** لمنصة basharai. يشمل المراقبة (monitoring)، التنبيهات (alerting)، النسخ الاحتياطي والاسترداد، إدارة الحوادث، إدارة التكاليف، والـ runbooks التشغيلية — كل ما يلزم للحفاظ على المنصة تعمل بشكل موثوق بعد الإطلاق.

This folder contains the **operations documentation** for the basharai platform. It covers monitoring, alerting, backup & recovery, incident response, cost management, and operational runbooks — everything needed to keep the platform running reliably post-launch.

---

## 📄 المستندات المتوقعة | Expected Documents

| # | الملف | الوصف | الحالة |
|---|-------|-------|--------|
| 10.1 | [`10.1-Monitoring.md`](./10.1-Monitoring.md) | مراقبة التطبيق — application monitoring stack, metrics collection, dashboards (Grafana/CloudWatch), health check endpoints, uptime monitoring, LLM response quality monitoring. | ✅ Complete |
| 10.2 | [`10.2-Alerting.md`](./10.2-Alerting.md) | قواعد التنبيه — alert rules, severity levels, escalation procedures, notification channels (email, Slack, SMS), on-call schedule, alert fatigue prevention. | ✅ Complete |
| 10.3 | [`10.3-Backup-Recovery.md`](./10.3-Backup-Recovery.md) | النسخ الاحتياطي والاسترداد — backup strategy for PostgreSQL, vector database, file storage (S3), backup schedules, retention policies, disaster recovery plan, RTO/RPO targets. | ✅ Complete |
| 10.4 | [`10.4-Incident-Response.md`](./10.4-Incident-Response.md) | الاستجابة للحوادث — incident severity classification, response procedures, communication templates, post-mortem process, incident tracking, on-call rotation. | ✅ Complete |
| 10.5 | [`10.5-Cost-Management.md`](./10.5-Cost-Management.md) | إدارة التكاليف السحابية — cloud cost tracking, budget alerts, cost optimization strategies, LLM API cost monitoring (OpenAI/Anthropic), monthly cost projections, cost-per-visitor metrics. | ✅ Complete |
| 10.6 | [`10.6-Runbooks.md`](./10.6-Runbooks.md) | كتب التشغيل — step-by-step operational runbooks for common tasks: database migrations, cache clearing, LLM provider failover, scaling up/down, certificate renewal, dependency updates. | ✅ Complete |


---

## 🔗 الاعتماديات | Dependencies

يعتمد هذا المجلد على المراحل التالية:

| المرحلة | السبب |
|---------|-------|
| `03-Architecture` | البنية المعمارية التي تحدد المكونات المراد مراقبتها |
| `09-Deployment` | بنية النشر التي تحدد infrastructure المراد إدارتها |
| `08-Testing` | اختبارات الأداء التي تحدد الـ baselines للمراقبة |

---

## ⏰ متى يجب العمل على هذه المرحلة | When to Work on This Phase

> **التوقيت المثالي**: بالتوازي مع مرحلة Deployment (09) وقبل الإطلاق العلني.

هذه المرحلة هي **آخر مرحلة تخطيطية قبل الإطلاق**، لكن بعض عناصرها (مثل المراقبة الأساسية) يجب أن تكون جاهزة من أول deployment إلى staging. المستندات الأخرى (مثل incident response) يمكن أن تُطوّر تدريجياً مع نضج المنصة.

This is the **final planning phase before launch**, but some elements (like basic monitoring) should be ready from the first staging deployment. Other documents (like incident response) can evolve as the platform matures.

### الأولوية المقترحة | Suggested Priority

1. ✅ `10.1-Monitoring.md` — لا تشغّل شيئاً لا تستطيع مراقبته
2. ✅ `10.5-Cost-Management.md` — حرج لمشروع شخصي — تجنّب المفاجآت في الفاتورة
3. ✅ `10.3-Backup-Recovery.md` — احمِ بياناتك من البداية
4. ⬜ `10.2-Alerting.md` — بعد تحديد المقاييس في Monitoring
5. ⬜ `10.6-Runbooks.md` — يُبنى تدريجياً مع الخبرة التشغيلية
6. ⬜ `10.4-Incident-Response.md` — مهم ولكن يمكن أن يبدأ بسيطاً

---

## 📝 ملاحظات | Notes

- **تكلفة LLM APIs**: أهم عنصر تكلفة في هذا المشروع هو استدعاءات الـ LLM APIs (OpenAI, Anthropic, etc.). يجب مراقبة هذا عن كثب.
- **كمشروع شخصي**: الـ operations يجب أن تكون **مؤتمتة قدر الإمكان** — لا يوجد فريق ops مخصص.
- **المراقبة الذكية**: استخدام أدوات مجانية أو منخفضة التكلفة (Uptime Robot, Grafana Cloud free tier, Sentry free tier).
- **LLM Quality Monitoring**: مراقبة جودة ردود الـ AI بشكل مستمر — هل الـ RAG يرجع نتائج صحيحة؟ هل هناك hallucinations؟
- **Runbooks الحية**: الـ runbooks يجب أن تكون **مستندات حية** تُحدّث مع كل حادث أو تغيير تشغيلي.
- **GCC Compliance**: مراعاة أي متطلبات تنظيمية لتخزين البيانات في منطقة الخليج (data residency requirements).

---

*هذا الملف جزء من وثائق مشروع basharai — منصة هندسة الذكاء الاصطناعي الشخصية.*
