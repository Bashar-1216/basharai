# 🤝 Contributing Guide | دليل المساهمة

> Guidelines for maintaining consistency, quality, and structure across the bashar.ai project documentation and codebase.

> إرشادات للحفاظ على الاتساق والجودة والهيكلية عبر توثيق ومصدر مشروع bashar.ai.

---

## 📋 Table of Contents

- [Document Naming Conventions](#-document-naming-conventions--اصطلاحات-تسمية-المستندات)
- [Phase Status Management](#-phase-status-management--إدارة-حالة-المراحل)
- [Review Process](#-review-process--عملية-المراجعة)
- [Quality Standards](#-quality-standards--معايير-الجودة)
- [Git Workflow](#-git-workflow--سير-عمل-git)
- [Writing Guidelines](#-writing-guidelines--إرشادات-الكتابة)

---

## 📛 Document Naming Conventions | اصطلاحات تسمية المستندات

### Format: `XX.Y-Name-Here.md`

All project documents follow a strict naming convention to ensure consistency and easy navigation.

| Component | Description | Example |
|-----------|-------------|---------|
| `XX` | **Phase number** (01–10), zero-padded | `01`, `05`, `10` |
| `.` | Separator between phase and document number | — |
| `Y` | **Document number** within the phase (0–9) | `0`, `3`, `6` |
| `-` | Separator between number and name | — |
| `Name-Here` | **Descriptive name** in Title-Case, hyphenated | `PRD-Main`, `User-Stories` |
| `.md` | File extension (always Markdown) | — |

### Naming Rules

1. **Phase prefix is mandatory** — Every document must start with its phase number
2. **Document 0 is the main document** — `XX.0-*` is always the primary/overview document for that phase
3. **Use Title-Case** — Capitalize the first letter of each significant word
4. **Use hyphens, not spaces** — `User-Stories.md` not `User Stories.md`
5. **Be descriptive but concise** — Names should be self-explanatory
6. **No special characters** — Only letters, numbers, hyphens, and dots

### Examples

```
✅ Good:
01.0-PRD-Main.md
01.2-User-Stories.md
02.1-System-Architecture.md
04.0-Database-Schema.md

❌ Bad:
PRD.md                    # Missing phase number
01-PRD Main.md            # Space in name, missing document number
1.0-prd-main.md           # Not zero-padded, not Title-Case
01.0_PRD_Main.md          # Underscores instead of hyphens
```

### Sub-documents and Appendices

For additional documents that extend a main document, use a letter suffix:

```
01.2-User-Stories.md          # Main user stories document
01.2a-User-Stories-Backlog.md # Extended backlog (appendix)
01.2b-User-Stories-Archive.md # Archived stories
```

---

## 📊 Phase Status Management | إدارة حالة المراحل

### Status Values

| Status | Icon | Meaning |
|--------|------|---------|
| Not Started | ⬜ | Phase has not begun |
| In Progress | 🟡 | Active work underway |
| In Review | 🔵 | Documents complete, under review |
| Complete | ✅ | All documents reviewed and finalized |
| Blocked | 🔴 | Blocked by dependency or issue |

### How to Update Status

1. **Update the root `README.md`** — Modify the Project Status table
2. **Update the phase README** — Each phase folder should have its own status in its README
3. **Update progress percentage** — Estimate based on documents completed within the phase
4. **Add a note** — If changing to Blocked or In Review, add context

### Progress Calculation

Progress within a phase is calculated as:

```
Progress = (Completed Documents / Total Planned Documents) × 100%
```

Round to the nearest 5% for the progress bar display.

---

## 🔍 Review Process | عملية المراجعة

### Document Lifecycle

Every document goes through the following lifecycle:

```
Draft → Self-Review → AI Review → Finalized
```

| Stage | Description | Actions Required |
|-------|-------------|-----------------|
| **Draft** | Initial creation of the document | Write content, follow templates |
| **Self-Review** | Author reviews their own work | Check completeness, consistency, links |
| **AI Review** | AI pair reviews for quality | Verify accuracy, suggest improvements |
| **Finalized** | Document is approved and locked | Update status, commit with message |

### Review Checklist

Before marking any document as complete, verify:

#### Content Quality | جودة المحتوى
- [ ] All sections from the template are filled
- [ ] No placeholder text remains (e.g., "TODO", "TBD")
- [ ] Technical accuracy verified
- [ ] Consistent with other project documents
- [ ] No contradictions with PRD or architecture decisions

#### Formatting | التنسيق
- [ ] Follows naming convention (`XX.Y-Name-Here.md`)
- [ ] Proper Markdown formatting
- [ ] Tables are properly aligned
- [ ] Code blocks have language specified
- [ ] Links are valid and relative where possible

#### Bilingual Standards | معايير ثنائية اللغة
- [ ] Section headers include Arabic translations where appropriate
- [ ] Key terms match the [Glossary](/docs/GLOSSARY.md)
- [ ] Arabic text uses proper RTL formatting if needed

#### Cross-References | المراجع التبادلية
- [ ] Links to related documents are correct
- [ ] Referenced documents exist
- [ ] Decision records are logged in [DECISIONS.md](/docs/DECISIONS.md)
- [ ] New terms are added to [GLOSSARY.md](/docs/GLOSSARY.md)

---

## ⭐ Quality Standards | معايير الجودة

### Document Quality Tiers

| Tier | Standard | When to Apply |
|------|----------|---------------|
| **Tier 1 — Production** | Comprehensive, reviewed, finalized | Main documents (XX.0-*) |
| **Tier 2 — Working** | Complete but may evolve | Supporting documents |
| **Tier 3 — Draft** | Work in progress, clearly marked | Early-stage documents |

### Minimum Quality Requirements

1. **Every document must have:**
   - A clear title with phase prefix
   - Table of contents (for documents > 3 sections)
   - Last updated date in the document header or metadata
   - Author/reviewer attribution

2. **Every phase folder must have:**
   - A `README.md` with phase overview and document index
   - All planned documents listed (even if marked as TODO)

3. **Every code file must have:**
   - Header comments explaining purpose
   - Type annotations (TypeScript/Python)
   - Unit test coverage ≥ 80%
   - Documentation for public APIs

### Consistency Rules

- **Terminology** — Always use terms as defined in [GLOSSARY.md](/docs/GLOSSARY.md)
- **Date format** — Use ISO 8601: `YYYY-MM-DD` (e.g., `2026-07-06`)
- **Version references** — Specify exact versions (e.g., "Next.js 14.2", not "Next.js")
- **Status indicators** — Use only the approved status icons from this guide
- **Cross-references** — Use relative links within the repository

---

## 🔄 Git Workflow | سير عمل Git

### Branch Naming Convention

```
<type>/<phase>-<description>

Examples:
docs/01-prd-main
docs/02-architecture-overview
feat/07-portfolio-component
fix/07-blog-search-bug
```

| Prefix | Usage |
|--------|-------|
| `docs/` | Documentation changes |
| `feat/` | New features |
| `fix/` | Bug fixes |
| `refactor/` | Code refactoring |
| `test/` | Test additions/changes |
| `chore/` | Tooling, config, maintenance |

### Commit Message Format

```
<type>(phase-XX): <short description>

[optional body]

[optional footer]
```

**Examples:**
```
docs(phase-01): finalize PRD main document
docs(phase-01): add user stories for portfolio epic
feat(phase-07): implement blog post component
fix(phase-07): resolve Arabic RTL layout issue
```

### Commit Types

| Type | Description |
|------|-------------|
| `docs` | Documentation only changes |
| `feat` | New feature or capability |
| `fix` | Bug fix |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `test` | Adding or correcting tests |
| `style` | Formatting, missing semicolons, etc. |
| `chore` | Maintenance tasks, dependency updates |
| `perf` | Performance improvement |

---

## ✍️ Writing Guidelines | إرشادات الكتابة

### General Principles

1. **Clarity over cleverness** — Write for a reader who is new to the project
2. **Be specific** — Use concrete numbers, examples, and references
3. **Stay consistent** — Match the voice and style of existing documents
4. **Think bilingual** — Include Arabic where it adds value for GCC audience
5. **Link generously** — Cross-reference related documents and decisions

### Markdown Best Practices

- Use `##` for main sections, `###` for subsections (reserve `#` for document title)
- Use tables for structured data
- Use code blocks with language specification
- Use relative links for internal references
- Add alt text to images
- Keep lines under 120 characters where possible

### Arabic Content Guidelines

- Section headers: Include Arabic translation after `|` separator
- Key terms: Provide Arabic equivalent on first use
- Full Arabic sections: Use for executive summaries or GCC-specific content
- RTL: Let the rendering engine handle directionality

---

## 🚨 Important Notes | ملاحظات مهمة

1. **Solo project with AI assistance** — While this is a solo project, these guidelines ensure consistency and professionalism as if working in a team environment
2. **Documentation-first approach** — Design documents must be completed and reviewed before implementation begins for each phase
3. **Living documents** — Documents may be updated as the project evolves, but changes should be tracked through git history and noted in the Decision Log

---

<div align="center">

*Consistency is the foundation of quality — الاتساق هو أساس الجودة*

</div>
