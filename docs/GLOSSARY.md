# 📖 Glossary | مصطلحات المشروع

> Standardized definitions for key terms used across the bashar.ai project documentation and codebase. All contributors and documents should reference terms as defined here.

> تعريفات موحدة للمصطلحات الرئيسية المستخدمة عبر توثيق ومصدر مشروع bashar.ai. يجب أن تشير جميع المساهمات والمستندات إلى المصطلحات كما هي معرّفة هنا.

**Last Updated | آخر تحديث:** 2026-07-06

---

## 📋 Table of Contents

- [AI & Machine Learning Terms](#-ai--machine-learning-terms--مصطلحات-الذكاء-الاصطناعي)
- [Web Development Terms](#-web-development-terms--مصطلحات-تطوير-الويب)
- [Project Management Terms](#-project-management-terms--مصطلحات-إدارة-المشاريع)
- [Business & Market Terms](#-business--market-terms--مصطلحات-الأعمال-والسوق)
- [bashar.ai-Specific Terms](#-basharai-specific-terms--مصطلحات-خاصة-بالمشروع)

---

## 🤖 AI & Machine Learning Terms | مصطلحات الذكاء الاصطناعي

### LLM — Large Language Model | نموذج لغوي كبير
A type of artificial intelligence model trained on vast amounts of text data to understand and generate human-like text. Examples include GPT-4, Claude, and LLaMA. In bashar.ai, LLMs power the chatbot, content recommendations, and intelligent search features.

### RAG — Retrieval-Augmented Generation | التوليد المعزز بالاسترجاع
An AI architecture pattern that combines information retrieval with text generation. Instead of relying solely on the LLM's training data, RAG retrieves relevant documents from a knowledge base and includes them as context for the LLM to generate more accurate, grounded responses. bashar.ai uses RAG for blog search and the portfolio chatbot.

### Embedding | التضمين / التمثيل المتجهي
A numerical vector representation of text (or other data) that captures semantic meaning. Embeddings allow the system to measure similarity between pieces of content — for example, finding blog posts related to a user's query. Generated using models like Sentence Transformers or OpenAI's embedding API.

### Vector Store | مخزن المتجهات
A specialized database optimized for storing and searching embedding vectors using similarity metrics (e.g., cosine similarity). bashar.ai uses **pgvector** (PostgreSQL extension) or **Pinecone** as its vector store for powering semantic search and content recommendations.

### Prompt Engineering | هندسة الأوامر
The practice of designing and optimizing input prompts to LLMs to achieve desired outputs. Includes techniques like few-shot learning, chain-of-thought prompting, and system prompt design.

### Fine-Tuning | الضبط الدقيق
The process of further training a pre-trained model on a specific dataset to specialize its behavior for a particular task or domain.

### Token | رمز / توكن
The basic unit of text processing in LLMs. A token can be a word, part of a word, or a character, depending on the tokenizer. Token counts affect API costs and context window limits.

### Context Window | نافذة السياق
The maximum amount of text (measured in tokens) that an LLM can process in a single request. Larger context windows allow for more information to be included in prompts but may increase cost and latency.

### Inference | الاستدلال
The process of using a trained AI model to generate predictions or outputs from new inputs. In the context of bashar.ai, inference refers to sending user queries to the LLM and receiving responses.

### Hallucination | الهلوسة
When an LLM generates information that sounds plausible but is factually incorrect or fabricated. RAG helps mitigate hallucination by grounding responses in retrieved source documents.

---

## 🌐 Web Development Terms | مصطلحات تطوير الويب

### SSR — Server-Side Rendering | التصيير من جانب الخادم
A web rendering strategy where HTML is generated on the server for each request. Provides better SEO and faster initial page loads. Next.js supports SSR through its App Router and Server Components.

### SSG — Static Site Generation | توليد المواقع الثابتة
A rendering strategy where HTML pages are generated at build time rather than on each request. Ideal for content that doesn't change frequently (e.g., blog posts, portfolio pages). Provides the fastest load times.

### ISR — Incremental Static Regeneration | التجديد الثابت التدريجي
A Next.js feature that allows statically generated pages to be updated after deployment without rebuilding the entire site. Pages are regenerated in the background when requested after a specified revalidation period.

### MDX
A format that lets you write JSX (React components) within Markdown documents. bashar.ai uses MDX for blog posts, enabling interactive code demos, charts, and custom components within written content.

### RTL — Right-to-Left | من اليمين إلى اليسار
Text directionality for languages like Arabic and Hebrew. bashar.ai implements full RTL support for Arabic content, including layout mirroring, font adjustments, and bidirectional text handling.

### WCAG — Web Content Accessibility Guidelines | إرشادات إتاحة محتوى الويب
International standards for making web content accessible to people with disabilities. bashar.ai targets **WCAG 2.1 Level AA** compliance, ensuring the platform is usable by everyone.

### CDN — Content Delivery Network | شبكة توصيل المحتوى
A distributed network of servers that delivers web content to users based on their geographic location. bashar.ai uses Cloudflare CDN to ensure fast load times across the GCC region and globally.

### API — Application Programming Interface | واجهة برمجة التطبيقات
A set of defined rules and protocols that allow different software applications to communicate with each other. bashar.ai exposes REST APIs via FastAPI for the frontend to consume.

### CI/CD — Continuous Integration / Continuous Deployment | التكامل المستمر / النشر المستمر
Automated practices for building, testing, and deploying code changes. bashar.ai uses GitHub Actions for CI/CD pipelines.

---

## 📋 Project Management Terms | مصطلحات إدارة المشاريع

### PRD — Product Requirements Document | وثيقة متطلبات المنتج
A comprehensive document that defines the product's purpose, features, user stories, and technical requirements. The PRD serves as the single source of truth for what the product should do and why. Located in the `01-prd/` folder.

### Epic | ملحمة
A large body of work that can be broken down into smaller user stories. In bashar.ai, epics represent major feature areas such as "Portfolio System," "Blog Platform," or "AI Chatbot."

### User Story | قصة مستخدم
A short, simple description of a feature from the perspective of the end user. Format: *"As a [type of user], I want [goal] so that [benefit]."*

### MVP — Minimum Viable Product | الحد الأدنى للمنتج القابل للتطبيق
The version of a product with just enough features to satisfy early adopters and provide feedback for future development. bashar.ai's MVP includes the portfolio, blog, and basic AI chatbot.

### ADR — Architecture Decision Record | سجل قرار معماري
A document that captures an important architectural decision along with its context, rationale, and consequences. ADRs are logged in [`docs/DECISIONS.md`](/docs/DECISIONS.md).

### Sprint | سبرنت
A fixed time period (typically 1-2 weeks) during which specific work items are completed. While bashar.ai doesn't follow strict Scrum, work is organized in sprint-like iterations.

### Milestone | معلم / حدث رئيسي
A significant point or event in the project timeline that marks the completion of a major deliverable or phase. bashar.ai defines 6 milestones from Foundation through Launch.

### NDA — Non-Disclosure Agreement | اتفاقية عدم إفشاء
A legal contract that prevents sharing confidential information. Relevant for bashar.ai portfolio case studies — some work from Amazon and Grammarly may be covered by NDAs, requiring careful handling of what can be publicly shared.

### KPI — Key Performance Indicator | مؤشر أداء رئيسي
A measurable value that demonstrates how effectively a project is achieving its key objectives. bashar.ai tracks KPIs like page load time, SEO ranking, and user engagement.

---

## 💼 Business & Market Terms | مصطلحات الأعمال والسوق

### GCC — Gulf Cooperation Council | مجلس التعاون الخليجي
A political and economic alliance of six Middle Eastern countries: Saudi Arabia, UAE, Kuwait, Qatar, Bahrain, and Oman. bashar.ai's primary target market, with content and services tailored for the region's growing AI/tech ecosystem.

### B2B — Business-to-Business | أعمال إلى أعمال
Commercial transactions between businesses. bashar.ai offers B2B services such as AI consulting and training for GCC enterprises.

### CRM — Customer Relationship Management | إدارة علاقات العملاء
A system for managing interactions with potential and current clients. bashar.ai integrates lightweight CRM capabilities for tracking consulting leads and client communications.

### SEO — Search Engine Optimization | تحسين محركات البحث
The practice of increasing the quantity and quality of traffic to a website through organic search engine results. Critical for bashar.ai's discoverability in both English and Arabic search markets.

---

## 🏗️ bashar.ai-Specific Terms | مصطلحات خاصة بالمشروع

### Engineering Evidence | الأدلة الهندسية
A core concept in bashar.ai — the idea that real, demonstrable engineering work (architecture decisions, production metrics, code quality, system design) is more valuable than static credentials or certifications. The platform is designed to showcase Engineering Evidence through interactive case studies, live demos, and detailed technical write-ups.

### Golden Set | مجموعة ذهبية
A curated set of question-answer pairs used to evaluate the quality of the AI chatbot and RAG pipeline. The Golden Set serves as a benchmark for measuring retrieval accuracy, answer quality, and regression detection across model updates.

### Digital Headquarters | المقر الرقمي
The overarching concept for bashar.ai — a comprehensive online presence that goes beyond a simple portfolio website. It combines portfolio, blog, services, AI tools, and professional branding into a unified platform.

### Evidence Card | بطاقة الأدلة
A structured UI component in the portfolio section that presents a specific engineering achievement with metrics, context, technology stack, and impact assessment. Evidence Cards are the primary unit of portfolio content.

### Skill Constellation | خريطة المهارات
An interactive visualization component that displays technical skills as an interconnected network/constellation, showing relationships between technologies and proficiency levels.

### Content Pipeline | خط أنابيب المحتوى
The automated workflow for blog content from draft to publication, including MDX processing, AI-assisted tagging, embedding generation, and CDN deployment.

---

## 🔤 Abbreviations Quick Reference | مرجع سريع للاختصارات

| Abbreviation | Full Form | Arabic |
|-------------|-----------|--------|
| ADR | Architecture Decision Record | سجل قرار معماري |
| API | Application Programming Interface | واجهة برمجة التطبيقات |
| B2B | Business-to-Business | أعمال إلى أعمال |
| CDN | Content Delivery Network | شبكة توصيل المحتوى |
| CI/CD | Continuous Integration/Deployment | التكامل/النشر المستمر |
| CRM | Customer Relationship Management | إدارة علاقات العملاء |
| GCC | Gulf Cooperation Council | مجلس التعاون الخليجي |
| ISR | Incremental Static Regeneration | التجديد الثابت التدريجي |
| KPI | Key Performance Indicator | مؤشر أداء رئيسي |
| LLM | Large Language Model | نموذج لغوي كبير |
| MDX | Markdown + JSX | — |
| MVP | Minimum Viable Product | الحد الأدنى للمنتج |
| NDA | Non-Disclosure Agreement | اتفاقية عدم إفشاء |
| PRD | Product Requirements Document | وثيقة متطلبات المنتج |
| RAG | Retrieval-Augmented Generation | التوليد المعزز بالاسترجاع |
| RTL | Right-to-Left | من اليمين إلى اليسار |
| SEO | Search Engine Optimization | تحسين محركات البحث |
| SSG | Static Site Generation | توليد المواقع الثابتة |
| SSR | Server-Side Rendering | التصيير من جانب الخادم |
| WCAG | Web Content Accessibility Guidelines | إرشادات إتاحة محتوى الويب |

---

> **Contributing to the Glossary:** When introducing a new term in any project document, add its definition here and link to this glossary from the document. Keep definitions concise but clear enough for someone unfamiliar with the term.

> **المساهمة في المصطلحات:** عند تقديم مصطلح جديد في أي مستند مشروع، أضف تعريفه هنا واربطه بهذا المصطلح من المستند.

---

<div align="center">

*Last updated: 2026-07-06 — يتم التحديث مع كل مرحلة جديدة*

</div>
