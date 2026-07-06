# Product Requirements Document — v2.0
## Personal AI Engineering Platform — "Digital Headquarters"

| | |
|---|---|
| **Version** | 2.0 (supersedes v1.0) |
| **Date** | July 2026 |
| **Status** | Draft — Ready for Review |
| **Primary Target Market** | GCC (Saudi Arabia / UAE) — confirmed priority even against global AI labs |
| **Target Role** | LLM / AI Application Engineer (mid-level, 2–5 yrs) |
| **Candidate Profile** | Real production experience at Amazon and Grammarly (confidentiality-bounded) + independent flagship projects in progress |

---

## Changelog: v1.0 → v2.0

This section exists because a v2 that silently changes direction without saying why is a worse document than v1, not a better one. Here's exactly what changed and what didn't:

| Change | v1.0 | v2.0 | Why |
|---|---|---|---|
| Candidate baseline | "Starting from scratch," no prior projects | Real production AI experience at **Amazon and Grammarly**, confidentiality-bounded | This is the single biggest change in this document — it upgrades the entire credibility baseline and requires a new content category |
| Content pillars | 1 pillar: personal flagship projects | **3 pillars**: Professional Experience (NDA-safe) + Personal Flagship Projects (full disclosure) + Technical Writing | Employer work and personal work have fundamentally different disclosure rules and serve different proof functions |
| AI-powered site features | Implicit, undersized (1 assistant) | **Finalized at exactly 2** (RAG assistant + eval/observability dashboard), against a request for 7 | Depth over breadth remains the core differentiator; 7 shallow features would now read as a *regression* against real Amazon/Grammarly pedigree, not an enhancement |
| Engineering Evidence | Implicit within Epic D | **Promoted to its own dedicated Epic**, applied fully to personal projects and partially (NDA-safe) to professional experience | This was the single best idea to come out of the review of v1.0, and it deserves first-class status |
| Region priority | GCC primary, Europe/remote secondary | **Reconfirmed unchanged** — GCC wins ties even against Google/OpenAI/Anthropic as aspirational targets | Explicitly re-tested against the strongest possible counter-pressure (naming OpenAI/Anthropic) and held |
| Document length | ~5,600 words | **Longer where it earns it** (new Epics, confidentiality framework, revised roadmap) — deliberately *not* padded to an arbitrary page count | A 200-page target was rejected in discovery on the same principle applied to architecture in v1 §10.5: over-sizing for effect, not need, is a negative signal |
| Roadmap | Phase 1 launches with placeholder "in progress" case studies | Phase 1 can launch with **real, populated case studies from day one** (Amazon + Grammarly), since that content already exists as lived experience | Real experience de-risks the weakest part of v1's plan — the thin-launch risk — significantly |

---

## 0. Discovery Summary v2.0 (Full, Current State)

**Reconfirmed from v1.0, unchanged:**
- Career stage: mid-level (2–5 years).
- Timeline: foundation-building over the next few months.
- Primary market when trade-offs arise: **GCC (Saudi Arabia / UAE)** — re-tested directly against Google/OpenAI/Anthropic as competing priorities, and GCC still wins.
- Arabic: hard requirement, genuinely bilingual, not a translation layer.
- Target role: LLM/AI application engineer.
- Success definition: interviews at 3–5 target companies within 6 months.

**New in this round — and the reason this is v2.0, not a patch:**
- **Real, confirmed production experience at Amazon and Grammarly.** This was not disclosed in the original discovery and materially changes the persona from "junior-adjacent, building first proof" to "mid-level engineer with brand-name production pedigree, building his first *public* platform to surface it."
- **Confidentiality status: partial NDA restriction.** General, non-sensitive descriptions of scope and impact are permitted; specific technical/architectural/proprietary details are not. This is a normal, expected constraint — most engineers at large companies operate under exactly this rule, and hiring managers read it as professional, not evasive, *as long as it's framed correctly.*
- **Presentation decision: a general-impact case study**, not a deep technical case study, for both Amazon and Grammarly work. This directly shapes Epic D1 below.
- **AI feature scope: finalized by recommendation** — 2 deep features (not 7), given the explicit delegation of this call and the reasoning that a raised credibility baseline raises the cost of shallow work rather than lowering it.

**Still open (explicitly deferred, not blocking v2.0):**
- Exact role, dates, and domain of work at Amazon and Grammarly — needed before the actual case-study copy is drafted, not before this PRD is finalized.
- The specific 3–5 target company names (§5.4, unchanged from v1.0).
- Whether current employment status requires any discretion in how the job search is signaled publicly — a judgment call for you, not a PRD requirement.

---

## 1. Executive Summary

This platform now tells a three-part story instead of one: **(1) I've already operated inside real production AI systems at Amazon and Grammarly — here's the scope and impact, responsibly disclosed; (2) here's what I build independently, end-to-end, when nobody's reviewing my architecture decisions but me — full technical disclosure, warts included; (3) here's how I think and write about this field.** Each part proves something the other two cannot. Professional experience alone proves you can operate inside constraints; personal projects alone prove you can own something end-to-end; neither alone proves both. Together, they're a materially stronger case than either v1.0's "portfolio + hypothetical projects" framing or the "one giant kitchen-sink platform" alternative that was proposed and partly rejected in review.

The differentiator remains **production rigor**, now with a credibility floor most competing portfolios simply don't have: this isn't a candidate claiming they *could* build production systems — they already have, at Amazon and Grammarly, and the personal projects prove they can do it without a large company's infrastructure and review process underneath them.

---

## 2. Vision & Mission

**Vision:** A bilingual (EN/AR) engineering platform that reads, within 60 seconds, as unmistakable evidence — not a claim — that this is an engineer who has already shipped inside real production AI systems, and who independently builds and rigorously evaluates LLM systems when left to his own judgment.

**Mission:** Launch Phase 1 within 4–6 weeks with genuinely populated content (not placeholders) by drawing on real professional experience immediately, then use the following 8–12 weeks to build and fully document 2 personal flagship projects with complete Engineering Evidence — architecture decisions, evaluation results, cost/latency data, and honestly-documented failure modes.

---

## 3. Objectives & Success Metrics

### 3.1 Primary objective (unchanged)
Generate qualified interview conversations at 3–5 named target companies within 6 months.

### 3.2 Target company tiering (new — resolves the Google/OpenAI/Anthropic question productively rather than forcing a binary choice)

| Tier | Composition | Why this tier | Positioning implication |
|---|---|---|---|
| **Tier 1 (primary, wins ties)** | GCC AI-focused enterprises, government-linked AI institutions, funded regional startups | Confirmed priority in discovery, twice | Arabic-first framing, region-specific case-study framing (§5.4), Amazon/Grammarly pedigree reads as a strong differentiator here since Western brand-name AI experience is highly valued in GCC hiring |
| **Tier 2 (stretch, secondary)** | Google, OpenAI, Anthropic, and comparable global AI labs/remote-first companies | Explicitly named as aspirational, not primary | English-first technical depth matters most here; Amazon/Grammarly experience reads as peer-level pedigree recognition, but Engineering Evidence rigor matters *more* than pedigree at this tier — these orgs interview on fundamentals, not résumé lines |

This tiering means the site doesn't need to fork into two different personas — the same Engineering Evidence-driven, bilingual platform serves both tiers, with Tier 1 getting slightly more Arabic-forward framing and Tier 2 getting slightly more evaluation-methodology depth. No conflicting requirements emerged from re-testing this.

### 3.3 KPI Tree (updated)

| Level | Metric | Target | Why it matters |
|---|---|---|---|
| **North Star** | Interview requests from target companies (Tier 1 + Tier 2) | 3–5 in 6 months | Unchanged from v1.0 |
| Leading | Sessions on Professional Experience case studies vs. Personal Project case studies | Track both, separately | Tells you which pillar is actually driving interest — don't assume, measure |
| Leading | Resume downloads (EN + AR split) | Track split | Validates the bilingual bet |
| Leading | Contact submissions from recruiter/hiring-manager domains | Qualify manually | Volume without qualified senders is vanity |
| Leading | Time-on-page for the 2 deep AI feature pages (assistant + eval dashboard) | > 2 minutes | These 2 features carry disproportionate proof weight — if engagement is shallow, the depth-over-breadth bet isn't landing |
| Site health | Core Web Vitals, Lighthouse, bilingual parity | Same as v1.0 (§10) | Unchanged |

---

## 4. Competitive & Market Analysis (updated)

### 4.1 What changed about the competitive position
v1.0 assumed a generic mid-level candidate competing against generic AI-portfolio templates (§4.2 of v1.0 still holds as background). v2.0 adds a real complication worth naming honestly: **candidates with FAANG-adjacent pedigree (Amazon, Grammarly) are not rare** in absolute terms — plenty of engineers list this on LinkedIn. What's rare is a candidate who (a) discloses that experience *responsibly* within real confidentiality bounds instead of vaguely, and (b) backs it up with independently-owned, fully-transparent work that proves the pedigree wasn't just proximity to smart systems, but actual capability.

### 4.2 The specific failure mode to avoid
Many candidates with brand-name experience either over-claim (implying access to confidential specifics they shouldn't share — a credibility and professionalism risk) or under-sell (a single vague resume line that wastes a real asset). The correct position, and the one this PRD is built around, is the middle path: **a clearly-labeled, honestly-bounded professional case study**, paired with **fully-open personal work** that proves the same caliber of thinking without any confidentiality constraint at all.

### 4.3 Updated Unique Value Proposition
> "A bilingual LLM application engineer who has already shipped inside production AI systems at Amazon and Grammarly — and who backs that experience with independently-built, fully-evaluated LLM systems, disclosed in complete technical depth, for engineers who need to operate credibly across GCC and global AI teams."

---

## 5. User Personas & Journeys (updated)

The persona table from v1.0 §5.1 is unchanged in structure. What changes is what each persona *finds* on the journey:

| Persona | What changes with real Amazon/Grammarly experience in the picture |
|---|---|
| Recruiter | Immediate seniority/credibility signal from company names alone — reduces the "is this person legitimate" question to near-zero in the first pass |
| Hiring Manager (technical) | Will read the professional case studies for scope/impact, but will judge actual engineering *depth* from the personal projects' Engineering Evidence — this persona should not conflate the two, and the site's IA must not let them |
| CTO / Founder | Amazon/Grammarly signals "can operate in a real company"; personal projects signal "can operate without one" — both matter to this persona, for different reasons |

### 5.4 Target-company research framework (unchanged process from v1.0, now with tiering from §3.2 applied)

---

## 6. Information Architecture & Sitemap (updated)

```
/{en|ar}/
/{en|ar}/about                      → Bio, timeline, skills (unchanged from v1.0)
/{en|ar}/resume                     → Interactive + PDF (EN+AR) — now includes real employment history
/{en|ar}/experience                 → NEW: Professional Experience case studies (Amazon, Grammarly) — general-impact framing
/{en|ar}/projects                   → Personal flagship project case studies — full Engineering Evidence
/{en|ar}/projects/[slug]
/{en|ar}/blog
/{en|ar}/blog/[slug]
/{en|ar}/contact
  [global] AI Assistant widget       → Finalized deep feature #1
  [global] Eval/Observability panel  → Finalized deep feature #2 (visualizes the assistant's own real usage data — see §8, Epic E2)
/admin
```

**Critical IA rule, worth stating explicitly:** `/experience` (professional, NDA-bounded) and `/projects` (personal, fully disclosed) must be visually and structurally distinct — different page templates, different depth of technical content, and a brief, honest note on `/experience` pages explaining that specifics are generalized due to confidentiality. This is not a weakness to hide; stated plainly, it reads as professional maturity. Hiding the distinction, or worse, blurring it so a `/experience` page reads like a full technical case study, is the actual risk — reviewers can tell, and it undermines trust in every other claim on the site.

---

## 7. Strategic Recommendation: Build Approach (unchanged from v1.0 §7)
Solo, hands-on-code, with the AI assistant as a real engineered artifact. Fallback path unchanged (§12). Nothing about the new professional-experience content changes this recommendation — if anything, it strengthens the case for it, since the personal projects now carry more weight as the *sole* place where full technical depth can be shown without any confidentiality boundary.

---

## 8. Functional Requirements (Epics) — Updated

### Epic A — Landing & Positioning [M]
Unchanged structurally from v1.0. **Updated positioning copy example:** "LLM/AI Application Engineer — production experience at Amazon & Grammarly, independently building and evaluating bilingual AI systems for GCC and global teams." This single line now does the work that used to require a full case study to establish (legitimacy), freeing the rest of the site to focus entirely on depth.

### Epic B — Bilingual Content System [M]
Unchanged from v1.0 §Epic B. Note: `/experience` pages need bilingual parity exactly like `/projects` — a GCC hiring manager reading the Amazon/Grammarly case study in Arabic is a high-value moment, not a nice-to-have.

### Epic C — Interactive Resume/CV [M]
Unchanged, with one addition: employment history section now includes real dates, titles, and one-line impact statements for Amazon and Grammarly, written to the same confidentiality standard as Epic D1 below.

### Epic D1 — Professional Experience Case Studies (Amazon, Grammarly) [M — NEW]
**Why it exists:** Converts real pedigree into structured proof without crossing confidentiality lines — the single highest-leverage new addition in v2.0.
**User stories:**
- As a hiring manager, I want to understand the scope and impact of the candidate's work at Amazon/Grammarly, so I can calibrate seniority and domain relevance, even without confidential specifics.
- As the candidate, I want a clear, defensible framing that protects me from any NDA exposure while still conveying real credibility.
**Acceptance criteria:**
- Given a `/experience/[company]` page, when viewed, then it includes: role/tenure, general problem domain, generalized scope of contribution, and impact framed in terms that do not require disclosing proprietary metrics, system names, or internal architecture.
- Given any claim on this page, when reviewed, then it passes the Confidentiality Review Checklist (Appendix B) before publishing.
- Given the page, when compared to a `/projects/[slug]` page, then a first-time visitor can immediately tell they are different content types (visual template, an explicit "Professional Experience" label, and a short note on confidentiality scope).
**Complexity:** Low (templating) + Medium (careful copywriting under real constraints). **Dependency:** your own confirmation of exact role/domain/dates (open item, §14).

### Epic D2 — Personal Flagship Project Case Studies [M] (renamed from v1.0 Epic D)
Unchanged in structure from v1.0 Epic D. **Updated project selection**, replacing the 5-item menu from v1.0 §11.3: given the finalized 2-deep-feature decision (§8, Epic E1/E2 below), these two projects **are** the flagship case studies — no separate project list needed. This is more efficient than v1.0's plan: the AI assistant and the eval dashboard are not just site features, they are simultaneously the two personal flagship projects, each fully documented per Epic D2's acceptance criteria (problem framing, architecture, decisions/trade-offs, evaluation, known limitations).

### Epic E1 — Site AI Assistant (bilingual RAG) [M — finalized, was "S" in v1.0]
Unchanged acceptance criteria from v1.0 Epic E. Promoted from Should-have to Must-have given the finalized 2-features decision.

### Epic E2 — LLM Evaluation & Observability Dashboard [M — NEW, finalized as the second deep feature]
**Why it exists:** This is the project most competing portfolios skip entirely, and pairing it directly with Epic E1 is deliberately efficient: it visualizes the assistant's own real production data rather than requiring a separate dataset or use case.
**User stories:**
- As a hiring manager, I want to see real cost, latency, and evaluation-accuracy data for the site's own AI assistant, so I can judge production-monitoring maturity directly rather than take a claim on faith.
**Acceptance criteria:**
- Given the dashboard, when viewed, then it shows: token cost trends, latency distribution (p50/p95), a golden-set evaluation pass rate over time, and at least one documented failure case with root-cause analysis.
- Given a change to the assistant (Epic E1), when the golden-set eval suite is re-run, then results are reflected on the dashboard — demonstrating a real regression-testing loop, not a static screenshot.
**Complexity:** Medium-High. **Dependency:** Epic E1 must exist first; this is explicitly the second thing built, not built in parallel.

### Epics F, G, H, I, J
Unchanged from v1.0 (Blog, Integrations, Contact, Admin/CMS, Analytics). See v1.0 for full acceptance criteria — no material changes.

---

## 9. Explicit Scope Discipline — Updated Won't-Have List

All of v1.0 §9's exclusions remain in force. **Added in v2.0, with reasoning preserved for accountability:**

| Rejected idea (from review of v1.0) | Disposition | Reasoning |
|---|---|---|
| 7 separate AI-powered page demos (Resume Analyzer, Recruiter Mode, Career Advisor, Documentation Search, Project Explorer, Architecture Explainer, Code Explorer) | **Won't-have in v2.0**; individually reconsiderable in backlog (§15) only after E1+E2 ship with full Engineering Evidence | Breadth-over-depth directly contradicts the core differentiator (§4.3); 2 deep features beat 7 shallow ones for this specific audience and goal |
| 200-page PRD target | **Rejected as a target metric**; this document is sized to what the content actually needs | Documentation length is not a proxy for rigor — same principle as v1.0 §10.5 applied to process instead of architecture |
| Naming personal or professional case studies literally after employers (e.g., "Amazon AI" as a project title) | **Rejected**; replaced with `/experience/[company]` general-impact framing (Epic D1) | Using a real company's name as an independent project title risks implying affiliation or endorsement that doesn't exist, regardless of intent |
| Expanding scope to include future company/product-building infrastructure (ToS, multi-tenancy, business model canvas) | **Deferred, not rejected** — noted as a live open question (§14) | Not yet confirmed whether this is a stated goal or an aspirational aside; changes real requirements if confirmed, so it stays explicitly open rather than silently folded in |

---

## 10. Non-Functional Requirements — Addition

### 10.7 Confidentiality & Disclosure Guidelines [NEW]
Every `/experience/[company]` page must pass the Confidentiality Review Checklist (Appendix B) before publishing. In general: describe problem domain and role using only what is already publicly knowable about the company's business area; frame impact in outcome terms rather than internal metrics; never reference internal system/project codenames, proprietary architecture, or unreleased features; when uncertain, default to more general framing, not less. This isn't just risk management — a well-framed, honestly-bounded professional case study reads as more credible to an experienced hiring manager than an oversharing one would, precisely because it demonstrates the same judgment they'd want from an employee handling their own company's confidential systems.

All other Non-Functional Requirements (§10.1–10.6) are unchanged from v1.0.

---

## 11. Technical Architecture — Updates

### 11.3 Flagship project menu — replaced
v1.0 §11.3 proposed a 5-item menu to choose from. **v2.0 finalizes this decision**: the two flagship personal projects are Epic E1 (bilingual RAG assistant) and Epic E2 (evaluation/observability dashboard) — no further selection needed. The remaining 3 items from v1.0's original menu (Arabic document Q&A, agentic workflow automation, fine-tuning/OSS contribution) move to §15 (Future Enhancements) as legitimate Phase 4+ additions once E1/E2 are fully shipped and documented — not abandoned, just sequenced honestly against real available time.

All other architecture decisions (§11.1, §11.2 in v1.0) are unchanged — the stack recommendation doesn't change based on the new professional-experience content, since that content is static (MDX/git-based), not AI-powered.

---

## 12. Roadmap & Milestones — Updated

| Phase | Timeframe | Scope | Exit criteria | What changed from v1.0 |
|---|---|---|---|---|
| **Phase 0** | Weeks 1–2 | Positioning statement; target-company research with tiering (§3.2); IA/wireframes; **draft Amazon/Grammarly case-study content and run it through the Confidentiality Checklist** | Positioning approved; 3–5 target companies identified across both tiers; `/experience` copy drafted and confidentiality-reviewed | New: professional case-study drafting moved into Phase 0, since the underlying material already exists as lived experience |
| **Phase 1 — MVP Launch** | Weeks 3–6 | Landing, About, Resume, **`/experience` with both Amazon and Grammarly case studies live**, Projects index (E1 in progress, honestly marked), Contact, bilingual base | Site live with **real, non-placeholder credibility content** from day one | Materially de-risked vs. v1.0 — no more launching with thin "in progress" placeholders across the board |
| **Phase 2** | Weeks 7–11 | Build + fully document Epic E1 (RAG assistant) as a complete case study with real evaluation results; blog launch (3 articles); GitHub integration; analytics live | E1 published with real eval metrics | Unchanged in substance from v1.0 Phase 2, retargeted to the finalized single project |
| **Phase 3** | Weeks 12–16 | Build + document Epic E2 (eval/observability dashboard), feeding off E1's real usage data; accessibility/SEO/performance hardening | E2 live, both flagship projects fully documented with Engineering Evidence | Replaces v1.0's "1–2 more flagship projects" with the specific, sequenced E1→E2 pairing |
| **Phase 4 — Ongoing** | Month 4+ | Content cadence; outreach using tiered target list; optional backlog items from §15 (remaining project menu, custom admin GUI, additional AI features if truly warranted by evidence of demand) | Interview pipeline forming | Unchanged |

**Fallback path (unchanged from v1.0 §12):** if bandwidth is the binding constraint, Epic E1/E2 can slip to Phase 3+ without blocking Phase 1 — the `/experience` case studies alone (now real, not hypothetical) already carry meaningfully more credibility weight than v1.0's fallback scenario did.

---

## 13. Risks & Mitigations — Addition

| Risk | Impact | Mitigation |
|---|---|---|
| **NDA/confidentiality breach, even unintentional, in `/experience` case studies** | Reputational and potentially contractual risk — the single highest-severity risk in this document | Mandatory Confidentiality Review Checklist (Appendix B) before publishing either `/experience` page; default to more general framing whenever uncertain; if genuinely unsure about a specific detail, exclude it rather than include it "just this once" |
| `/experience` and `/projects` blur together in presentation, undermining trust in both | A sharp reviewer notices the professional case study is suspiciously detailed for something under NDA, and starts doubting everything else on the site | Enforced visual/structural distinction between the two content types (§6); explicit confidentiality note on `/experience` pages |
| Resting on Amazon/Grammarly pedigree without independently demonstrating depth | Especially fatal for Tier 2 (Google/OpenAI/Anthropic), which interviews on fundamentals over résumé lines | Epic E1/E2 exist specifically to prevent this — pedigree opens the door, Engineering Evidence is what gets you through the interview |

All risks from v1.0 §13 remain in force and unchanged.

---

## 14. Open Questions — Updated

1. Exact role, dates, and general domain of work at Amazon and Grammarly — needed to draft actual `/experience` copy (not to finalize this PRD).
2. The specific 3–5 target companies across both tiers (§3.2) — unchanged from v1.0.
3. Whether the "digital headquarters as a future company launchpad" idea from the review is a real, standing goal or an aspirational aside — still unresolved from the last round of feedback, and still changes real requirements (ToS, multi-tenancy, business model) if confirmed. Worth a direct yes/no before Phase 3.
4. Budget ceiling for hosting/tools — unchanged from v1.0, still assumed near-zero/free-tier-first.
5. Whether current employment status requires discretion in how publicly the job search is signaled — your call, not a spec requirement, but worth deciding before Phase 1 launch copy is finalized.

---

## 15. Future Enhancements (Updated Backlog)

- The 3 deferred personal project ideas from v1.0's original menu (Arabic enterprise document Q&A, agentic workflow automation, fine-tuning/OSS contribution) — legitimate Phase 4+ additions once E1/E2 are fully shipped.
- Any of the 7 originally-proposed AI page demos — reconsiderable individually, one at a time, only after E1/E2 prove the depth-first approach is working (measured via §3.3 KPIs), never all at once.
- Custom admin GUI, Speaking/Certifications standalone pages, newsletter — unchanged from v1.0 §15.

---

## Appendix A — Assumptions Log (Updated)

| Assumption | Where used | Status |
|---|---|---|
| Solo, hands-on-code build approach | §7 | Recommended, reversible via fallback in §12 (unchanged from v1.0) |
| GCC remains the tie-breaking priority even against Google/OpenAI/Anthropic | §3.2 | **Confirmed directly**, not assumed |
| General-impact (not deep-technical) framing for Amazon/Grammarly case studies | §8 Epic D1 | **Confirmed directly** |
| 2 deep AI features (not 7) is the right scope given the confirmed pedigree | §8 Epic E1/E2 | Recommended by Claude under explicit delegation; not yet independently confirmed by you — flag if you disagree |
| Near-zero/low budget (free-tier-first architecture) | §11 | Unchanged assumption from v1.0; still unconfirmed |

## Appendix B — Confidentiality Review Checklist (for `/experience` pages)

Before publishing any Professional Experience case study, confirm:
- [ ] No internal project/system codenames are used — only generally-known company/business-area context.
- [ ] No specific internal metrics, growth numbers, or performance figures are stated unless already publicly disclosed by the company.
- [ ] No architecture diagrams or implementation specifics beyond what a generally-informed outsider could already infer about how such a system typically works.
- [ ] No unreleased features, products, or roadmap items are referenced.
- [ ] Impact is framed in terms of your role and general contribution, not proprietary company results.
- [ ] If in doubt about any single fact, it is excluded, not included "generally."
- [ ] The page includes an explicit, honest note that specifics are generalized due to confidentiality — this is a credibility asset, not a disclaimer to hide.
