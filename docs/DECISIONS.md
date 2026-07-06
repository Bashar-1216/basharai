# 📋 Architecture Decision Records | سجل القرارات المعمارية

> This document tracks all significant architecture and design decisions made during the bashar.ai project. Each decision is recorded as an **Architecture Decision Record (ADR)** to provide context, rationale, and consequences for future reference.

> يتتبع هذا المستند جميع القرارات المعمارية والتصميمية المهمة المتخذة خلال مشروع bashar.ai. يتم تسجيل كل قرار كـ **سجل قرار معماري (ADR)** لتوفير السياق والمبررات والعواقب للرجوع إليها مستقبلاً.

**Last Updated | آخر تحديث:** 2026-07-06

---

## 📖 What are ADRs? | ما هي سجلات القرارات المعمارية؟

An **Architecture Decision Record (ADR)** is a short document that captures an important architectural or design decision along with its context and consequences. ADRs help teams (and future-you) understand:

- **Why** a decision was made (not just what)
- **What alternatives** were considered
- **What trade-offs** were accepted
- **What impact** the decision has on the project

### When to Create an ADR

Create a new ADR when you make a decision that:

- Affects the overall system architecture or structure
- Involves choosing between multiple viable alternatives
- Has significant consequences that are hard to reverse
- Changes an existing approach or convention
- Would be non-obvious to someone joining the project later

### ADR Lifecycle

```
Proposed → Accepted → [Superseded | Deprecated | Amended]
```

| Status | Meaning |
|--------|---------|
| **Proposed** | Decision is under consideration |
| **Accepted** | Decision has been approved and is in effect |
| **Superseded** | Replaced by a newer decision (link to replacement) |
| **Deprecated** | No longer relevant but kept for historical context |
| **Amended** | Modified from the original (link to amendment) |

---

## 📝 ADR Template | قالب سجل القرار

Use this template when creating a new ADR. Copy the section below and fill in the details.

```markdown
---

### ADR-XXX: [Decision Title]

| Field | Value |
|-------|-------|
| **Date** | YYYY-MM-DD |
| **Status** | Proposed / Accepted / Superseded / Deprecated |
| **Deciders** | [Who made this decision] |
| **Phase** | [Which project phase this relates to] |

#### Context | السياق

[Describe the situation and the problem that needs to be addressed. 
What forces are at play? What constraints exist?]

#### Decision | القرار

[State the decision clearly. What are you going to do?]

#### Alternatives Considered | البدائل المدروسة

| Alternative | Pros | Cons | Why Not Chosen |
|-------------|------|------|----------------|
| [Option A] | ... | ... | ... |
| [Option B] | ... | ... | ... |

#### Consequences | العواقب

**Positive:**
- [Benefit 1]
- [Benefit 2]

**Negative:**
- [Trade-off 1]
- [Trade-off 2]

**Risks:**
- [Risk 1]

#### Related Decisions | قرارات ذات صلة

- [Link to related ADRs if any]
```

---

## 📊 Decision Log Summary | ملخص سجل القرارات

| ADR # | Date | Decision | Status | Phase |
|-------|------|----------|--------|-------|
| [ADR-001](#adr-001-project-documentation-structure) | 2026-07-06 | Project Documentation Structure | ✅ Accepted | Phase 01 |

---

## 📑 Decision Records | سجلات القرارات

---

### ADR-001: Project Documentation Structure

| Field | Value |
|-------|-------|
| **Date** | 2026-07-06 |
| **Status** | ✅ Accepted |
| **Deciders** | Solo Developer + AI Pair |
| **Phase** | Phase 01 — PRD |

#### Context | السياق

At the start of the bashar.ai project, a decision was needed on how to organize project documentation. The project spans 10 phases — from PRD through Operations — and will generate a significant volume of design documents, technical specs, and reference materials. As a solo developer project with AI pair programming, the documentation needs to be:

1. **Self-explanatory** — Any document should be understandable without verbal context
2. **Navigable** — Easy to find the right document quickly
3. **Scalable** — The structure should accommodate growth without reorganization
4. **Version-controlled** — All documents should be in Git alongside code

The documentation structure will serve as the project's "operating system" — the primary way to track progress, communicate decisions, and maintain institutional knowledge.

#### Decision | القرار

Adopt a **phase-numbered folder structure** with a **hierarchical document naming convention** (`XX.Y-Name-Here.md`):

1. **10 phase folders** (`01-prd/` through `10-operations/`) corresponding to the SDLC phases
2. **Numbered documents** within each phase using the `XX.Y-Name-Here.md` format
3. **A `docs/` folder** for cross-cutting concerns (glossary, decisions, standards)
4. **Root-level meta-documents** (`README.md`, `CONTRIBUTING.md`, `.gitignore`)
5. **Markdown-only** documentation (no Word docs, PDFs, or wikis)

Directory structure:
```
basharai/
├── README.md
├── CONTRIBUTING.md
├── .gitignore
├── 01-prd/
├── 02-architecture/
├── 03-system-design/
├── 04-database/
├── 05-api/
├── 06-uiux/
├── 07-development/
├── 08-testing/
├── 09-deployment/
├── 10-operations/
├── docs/
└── src/
```

#### Alternatives Considered | البدائل المدروسة

| Alternative | Pros | Cons | Why Not Chosen |
|-------------|------|------|----------------|
| **Wiki (GitHub/Notion)** | Rich editing, easy collaboration, search | Separate from code, no version control for Notion, harder to maintain consistency | Separation of docs from code reduces discoverability; Git provides better version history |
| **Flat structure** (all docs in one `/docs` folder) | Simple, everything in one place | Hard to navigate at scale, no phase grouping, cluttered | Would become unmanageable with 30+ documents across 10 phases |
| **Tool-specific** (Confluence, Google Docs) | Familiar, collaborative features | Not in Git, external dependency, potential access issues | Violates docs-as-code principle; creates dependency on external tools |
| **Monorepo with separate docs repo** | Clean separation of concerns | Two repos to manage, cross-referencing harder | Over-engineering for a solo project; adds unnecessary complexity |

#### Consequences | العواقب

**Positive:**
- ✅ All documentation lives alongside code in version control
- ✅ Phase numbers provide natural ordering and navigation
- ✅ Document numbering (`XX.Y`) creates a clear hierarchy within phases
- ✅ Standard Markdown ensures readability on GitHub, VS Code, and any text editor
- ✅ Scalable — new documents fit naturally into the existing structure
- ✅ Grep-friendly — easy to search across all documents
- ✅ AI-pair-friendly — AI assistants can easily read and reference all docs

**Negative:**
- ⚠️ Manual process to keep README status dashboard in sync
- ⚠️ No built-in search across documents (relies on IDE/CLI tools)
- ⚠️ Markdown formatting is limited compared to rich document editors
- ⚠️ Renaming/reorganizing requires updating all cross-references

**Risks:**
- 🔶 Document sprawl — Mitigate by following strict naming conventions and reviewing periodically
- 🔶 Stale cross-references — Mitigate by running link checks before major commits

#### Related Decisions | قرارات ذات صلة

- (None yet — this is the foundational decision)

---

<!-- 
  ============================================================
  ADD NEW ADRs ABOVE THIS LINE
  Follow the template in the section above
  Update the Decision Log Summary table
  ============================================================
-->

---

## 📌 Guidelines for Future ADRs | إرشادات للقرارات المستقبلية

1. **Number sequentially** — ADR-002, ADR-003, etc.
2. **Never delete** — Mark as Superseded or Deprecated instead
3. **Link related decisions** — If ADR-005 supersedes ADR-002, link both ways
4. **Keep it concise** — An ADR should be readable in 5 minutes
5. **Include the "why"** — The rationale is more important than the decision itself
6. **Update the summary table** — Every new ADR must appear in the log summary

### Expected Future ADRs | قرارات معمارية متوقعة

| Expected ADR | Phase | Topic |
|-------------|-------|-------|
| ADR-002 | Phase 02 | Frontend Framework Selection (Next.js justification) |
| ADR-003 | Phase 02 | Backend Framework Selection (FastAPI justification) |
| ADR-004 | Phase 02 | AI/LLM Provider Strategy |
| ADR-005 | Phase 04 | Database Selection (PostgreSQL + pgvector) |
| ADR-006 | Phase 05 | API Design Philosophy (REST vs GraphQL) |
| ADR-007 | Phase 06 | Design System Approach |
| ADR-008 | Phase 07 | State Management Strategy |
| ADR-009 | Phase 09 | Hosting & Deployment Architecture |
| ADR-010 | Phase 09 | Domain & CDN Strategy |

---

<div align="center">

*Good decisions are well-documented decisions — القرارات الجيدة هي القرارات الموثّقة جيداً*

</div>
