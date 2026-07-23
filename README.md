# 🚀 bashar.ai — Production AI Engineering Platform & Digital HQ

> **Digital Headquarters & Interactive RAG Portfolio of Bashar Almuntaser**
> 
> *Building Production-Grade Bilingual AI Systems, RAG Pipelines & AI Agents for Enterprise Scale.*

[![Next.js](https://img.shields.io/badge/Frontend-Next.js_16_(Turbopack)-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI_(Python_3.11)-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL_+_pgvector-4169E1?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![LLM Engine](https://img.shields.io/badge/LLM_Engine-Groq_Qwen3.6--27B_+_Gemini-8A2BE2?style=flat-square)](https://groq.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](./LICENSE)

---

## 🌟 Overview | نبذة عن المنصة

**bashar.ai** is a production-grade, bilingual (English/Arabic) AI engineering platform and digital headquarters. It serves as live interactive proof of real-world AI engineering capabilities—featuring a production RAG (Retrieval-Augmented Generation) assistant, real-time LLM telemetry observability, dynamic GitHub project sync, and deep-dive engineering case studies.

منصة هندسية ثنائية اللغة (عربي/إنجليزي) تُمثّل المقر الرقمي والإثبات التفاعلي الحي لبناء أنظمة الذكاء الاصطناعي، نماذج استرجاع البيانات (RAG)، محركات المراقبة (Telemetry)، واستعراض دراسات الحالة الهندسية الحقيقية.

---

## ✨ Key Features | الميزات الرئيسية

- 🤖 **Interactive RAG AI Assistant:** Bilingual conversational agent trained on real technical background, architecture tradeoffs, and project case studies with semantic pgvector search.
- 📊 **Real-time LLM Telemetry & Observability:** Live tracking of inference latency (ms), token usage, cost optimization, and automated LLM-as-a-Judge evaluation scoring.
- 🐙 **Dynamic GitHub Repository Sync:** Automated synchronization of stars, forks, primary language indicators, and dynamic project status badges (`In Production 🚀`, `Active Build 🟢`, `Completed ✅`).
- 🎨 **Executive Cyberpunk / Glassmorphic UI:** Modern Dark Mode interface with subtle ambient radial glows, responsive layout grids, and seamless LTR/RTL internationalization.

---

## 🏗️ Architecture & Tech Stack | البنية التقنية

```
┌────────────────────────────────────────────────────────────────────────┐
│                        NEXT.JS 16 FRONTEND (BFF)                       │
│      React 19 · NextAuth · Dynamic i18n (EN/AR) · Glassmorphism UI     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / REST APIs
┌───────────────────────────────────▼────────────────────────────────────┐
│                         FASTAPI BACKEND SERVICE                        │
│   Async SQLAlchemy · LangChain RAG Pipeline · LLM Judge Evaluation     │
└─────────┬─────────────────────────┬──────────────────────────┬─────────┘
          │                         │                          │
┌─────────▼───────────┐   ┌─────────▼───────────┐    ┌─────────▼─────────┐
│ POSTGRESQL + PGVECTOR│   │   REDIS CACHE       │    │  LLM PROVIDERS    │
│ Embedding Store & DB│   │ Rate Limit & Cache  │    │ Groq & Gemini API │
└─────────────────────┘   └─────────────────────┘    └───────────────────┘
```

| Layer | Technology | Key Responsibility |
|-------|-----------|--------------------|
| **Frontend** | Next.js 16 (App Router, Turbopack) | SSR/SSG rendering, i18n routing, responsive UI |
| **Backend API** | FastAPI (Python 3.11) | Async RAG pipeline execution, telemetry, LLM evaluation |
| **Database** | PostgreSQL + Prisma ORM | Relational domain models & vector embeddings (`pgvector`) |
| **LLM Inference** | Groq (`qwen/qwen3.6-27b`) & Google Gemini | High-speed LLM generation & automated Judge scoring |
| **Cache & Queue** | Redis | Session state, rate limiting, and response caching |
| **Styling** | Vanilla CSS Modules | Custom design tokens, glassmorphic cards, ambient radial glows |

---

## 📁 Key Project Case Studies | دراسات الحالة الرئيسية

- 🛰️ **AI Discovery Monitor — GEO Platform:** 8-stage asynchronous AI analysis pipeline executing structured prompt workflows across GPT-4, Claude, and Gemini with bilingual trigram entity resolution.
- 📦 **SAPA — Smart Amazon Product Analyzer:** Margin Kill-Switch automation, Herfindahl-Hirschman Index market analysis, LightGBM demand forecasting, and toxic review NLP pipeline.
- 🚗 **Real-Time Driver Drowsiness Detection:** Eye Aspect Ratio (EAR) alertness classification, 3D pose estimation drift detection, and multithreaded non-blocking video/audio pipeline.
- 💳 **Financial Fraud Detection Platform:** Transaction anomaly classification, real-time transaction streaming using PySpark and Apache Kafka.
- 💬 **Arabic Sentiment & Fake Review Classifier:** Fine-tuned CAMeL-BERT and BiLSTM classifier deployed as a real-time inference service using FastAPI.

---

## 🚀 Quick Setup | دليل التشغيل السريع

### 1. Prerequisites
- Node.js 20+ & `pnpm` / `npm`
- Python 3.11+
- PostgreSQL database (with `pgvector` extension)

### 2. Backend Setup
```bash
cd src/backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Start FastAPI Uvicorn Server
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd src/frontend
pnpm install

# Run database migrations / seed
npx prisma db push
npx tsx prisma/seed.ts

# Start Next.js Development Server
pnpm dev
```

Open `http://localhost:3000` in your browser.

---

## 👤 Author & Contact | التواصل

**Bashar Almuntaser** — *AI Engineer*
- 📍 **Location:** Yemen → Saudi Arabia (GCC)
- 🌐 **Portfolio Website:** [bashar.ai](https://bashar.ai)
- 🐙 **GitHub:** [@Bashar-1216](https://github.com/Bashar-1216)

---

*© 2026 bashar.ai — All rights reserved.*
