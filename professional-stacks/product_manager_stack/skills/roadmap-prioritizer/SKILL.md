---
name: roadmap-prioritizer
description: Scores a list of feature candidates using the RICE matrix (Reach × Impact × Confidence ÷ Effort). Returns a ranked backlog with RICE scores, quarters recommended for build, and business justification for each feature. Highlights the critical path for the current quarter.
allowed-tools: Read, Write
effort: medium
---

# Roadmap Prioritizer

## When to activate
Quarterly roadmap planning. Use this to score feature requests and build a data-driven queue.

## When NOT to use
Do not use for features that are already committed (e.g., contractual obligations, legal requirements) — those go to the top regardless of RICE score. Do use for discretionary prioritization.

## Instructions

1. Gather the feature list: name, rough description, and any estimates or data about reach/impact.
2. For each feature, score across RICE dimensions:
   - **Reach (20 pts max):** How many users/month affected? 10k+ = 20, 1k–10k = 10, <1k = 3.
   - **Impact (20 pts max):** How much will behavior change? 50%+ = 20, 10–50% = 10, <10% = 3.
   - **Confidence (20 pts max):** How confident are you in the estimate? 90%+ = 20, 50–90% = 10, <50% = 3.
   - **Effort (divisor):** Time to ship in weeks. 2 weeks = 2, 6 weeks = 6, etc.
3. Calculate: RICE Score = (Reach × Impact × Confidence) ÷ Effort.
4. Rank by RICE score, highest first.
5. Assign to quarters based on effort. Current quarter = top N features that fit in capacity.
6. Document dependencies and blockers for each feature.

## Output Format

```
# Product Roadmap — 2026 Q[X]

## Q[Current] — Build (Committed)
| Rank | Feature | RICE | Reach | Impact | Conf | Effort | Start | Notes |
|---|---|---|---|---|---|---|---|---|
| 1 | [Feature A] | 240 | 15k | 50% | 90% | 2 wks | Week 1 | Critical path; unblocks [Feature B] |
| 2 | [Feature B] | 180 | 12k | 40% | 80% | 3 wks | Week 3 | Blocked by [Feature A] |
| 3 | [Feature C] | 130 | 8k | 35% | 75% | 4 wks | Week 2 | Design in progress |

**Capacity:** 3–4 features this quarter (8–12 weeks effort)

## Q[Next] — Build (High Confidence)
[Same format]

## Backlog — Defer/Kill
| Feature | RICE | Reason |
|---|---|---|
| [Low RICE feature] | 35 | Low reach, high effort; revisit in H2 if strategy shifts |
| [Speculative feature] | 18 | Unproven impact; requires market validation first |

## Critical Path (Current Quarter)
[Feature A] (2 wks) → [Feature B] (3 wks) → optional [Feature C] (4 wks)
**Minimum viable completion:** [Feature A] + [Feature B] by [date]

## Dependencies & Risks
- [Feature X] requires [API/design/data infrastructure]
- [Competitor launching] [Feature Y] in [month] — accelerate [Feature Z] if possible
```

---
