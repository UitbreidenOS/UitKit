---
name: roadmap-prioritizer
description: Analyzes feature requests, customer feedback, and business metrics to prioritize product roadmap. Applies weighted scoring matrix (impact, effort, alignment, technical debt). Returns ranked backlog with rationale for each item.
allowed-tools: Read, Write, WebSearch
effort: medium
---

# Roadmap Prioritizer

## When to activate

Before planning a quarter or release cycle. You have a list of candidate features, bug fixes, and initiatives, plus supporting data: customer feedback, usage metrics, strategic goals, and team velocity. Activation requires documented backlog items with acceptance criteria and at least baseline customer impact signals.

## When NOT to use

Not for tactical bug triage (use this only for strategic roadmap planning). Not for design feedback or UX critique—this prioritizes by business value, not design quality. Not without a clearly stated product strategy or OKR. Not for roadmap communication or stakeholder presentations (use output-formatter for that). Not for real-time incident response or production issues.

## Prioritization Framework

**Scoring Matrix (0–100):**

| Dimension | High (25 pts) | Medium (15 pts) | Low (5 pts) |
|---|---|---|---|
| **Customer Impact** | Solves critical pain, affects 50%+ users | Addresses common feedback, 20–50% users | Nice-to-have, <20% users |
| **Revenue Impact** | Unlocks new segment, $500k+ ARR potential | Improves retention/upsell, $100–500k | Marginal, <$100k |
| **Effort (Inverse)** | Low complexity, 1–2 sprint weeks | Medium complexity, 3–5 weeks | High complexity, 6+ weeks |
| **Alignment** | Core to product strategy, blocks 3+ OKRs | Supports strategy, enables 1–2 OKRs | Tangential, minimal OKR impact |
| **Technical Debt** | Eliminates tech blocker | Reduces risk moderately | No clear technical benefit |

**Decision Rule:**
- **Top Tier (≥80):** Must-have, schedule first
- **High (60–79):** Should-have, schedule if capacity permits
- **Medium (40–59):** Nice-to-have, defer or batch with dependent features
- **Low (<40):** Consider dropping or moving to backlog

## Output Format

Return ranked backlog in order of priority score:

```markdown
## Roadmap Priority (by Score)

### [Feature Name] — Score: [X/100]

**Rationale:** [1–2 sentence explanation of score]

**Customer Impact:** [X/25] — [context]
**Revenue Impact:** [X/25] — [context]
**Effort (Inverse):** [X/25] — [context]
**Alignment:** [X/25] — [context]
**Technical Debt:** [X/25] — [context]

**Customer Signals:** [1–2 mentions of feedback, usage data, or pain point]
**Blockers:** [Any dependencies, risks, or technical debt]
**Recommendation:** [TOP TIER / HIGH / MEDIUM / LOW]

---
```

Include at the end a summary table showing all items ranked, with score, recommendation tier, and estimated effort.

## Example

### User Segment Analytics Dashboard — Score: 92/100

**Rationale:** Directly addresses top customer pain point (visibility into feature adoption), aligns with retention OKR, moderate effort, unblocks go-to-market segmentation.

**Customer Impact:** 25/25 — 60% of accounts request usage analytics; top reason for churn
**Revenue Impact:** 23/25 — Enables micro-segmentation, 15–20% upsell potential
**Effort (Inverse):** 20/25 — 3-week sprint, existing analytics infrastructure
**Alignment:** 22/25 — Directly supports Retention + Expansion OKRs
**Technical Debt:** 2/25 — No technical debt reduction

**Customer Signals:** 12 feature requests this quarter, 2 lost deals cited this
**Blockers:** None; depends on existing event tracking pipeline (ready)
**Recommendation:** TOP TIER — Schedule for next sprint

---

### Dark Mode Support — Score: 38/100

**Rationale:** Requested by <15% of users, moderate effort, no revenue or strategic impact.

**Customer Impact:** 8/25 — <15% users request
**Revenue Impact:** 5/25 — No revenue signal
**Effort (Inverse):** 15/25 — 4-week sprint, component refactor required
**Alignment:** 5/25 — Nice-to-have, no OKR connection
**Technical Debt:** 5/25 — Minor CSS debt reduction

**Customer Signals:** 3 polite requests, no support escalations
**Blockers:** None
**Recommendation:** LOW — Defer to backlog, reconsider if adoption demand grows

---
