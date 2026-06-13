---
name: "product-roadmap"
description: "Product roadmap building: prioritisation frameworks (RICE, MoSCoW, opportunity scoring), roadmap formats, OKR alignment, stakeholder communication, and quarterly planning"
---

# Product Roadmap Skill

## When to activate
- Building or restructuring a product roadmap
- Prioritising a backlog of features and opportunities
- Aligning the roadmap to company OKRs
- Communicating roadmap to different stakeholders (engineering, sales, executives, customers)
- Running a quarterly planning process
- Deciding what to cut when capacity is constrained

## When NOT to use
- Sprint-level task planning — that's delivery management, not roadmap
- Discovery (deciding what problems to solve) — use the product-discovery skill
- Writing technical specs or user stories — that's after the roadmap decision
- A/B test design — use the experiment-designer skill

## Instructions

### Prioritisation framework

```
Prioritise this backlog using [RICE / MoSCoW / opportunity scoring].

Items to prioritise: [list — can be features, projects, or problem areas]
Constraints: [team size, time horizon, budget]
Strategic goals this quarter: [OKRs or top priorities]

RICE scoring (for feature decisions):
| Item | Reach | Impact | Confidence | Effort | RICE Score |
|---|---|---|---|---|---|
| Feature A | 500 users/q | 3 (high) | 80% | 3 weeks | (500×3×0.8)/3 = 400 |
| Feature B | 1000 users/q | 1 (low) | 90% | 1 week | (1000×1×0.9)/1 = 900 |

Reach: users affected per quarter
Impact: massive=3 / high=2 / medium=1 / low=0.5 / minimal=0.25
Confidence: % certainty about reach and impact estimates
Effort: engineering weeks for one engineer

MoSCoW (for fixed-scope releases):
- Must have: without this, the release fails
- Should have: high value, include if capacity allows
- Could have: nice-to-have, first to cut
- Won't have: explicitly out of scope (prevents scope creep)

Opportunity scoring (problem-level prioritisation):
Score = Importance + (Importance − Satisfaction)
Items scoring > 10 = strong opportunity

Apply [chosen framework] to my backlog and output a prioritised list with rationale.
```

### Roadmap format design

```
Design a roadmap format for [audience and timeframe].

Audience: [internal engineering / sales team / customers / executive team / all]
Timeframe: [quarterly / annual / rolling 6-month]
Level of commitment: [committed / directional / aspirational]
Current tool: [Linear / Jira / Notion / ProductBoard / spreadsheet]

Roadmap formats by audience:

Engineering roadmap (high fidelity, committed near-term):
| Theme | Feature | Quarter | Status | Owner | Dependencies |
|---|---|---|---|---|---|
High confidence in Q1, directional for Q2-Q3, placeholder for Q4.

Sales roadmap (directional, no dates):
"Now / Next / Later" format — avoids committing to specific dates with customers.
Now: what's in active development
Next: what comes after (this quarter or next — no specific date)
Later: what we're considering (no commitment)

Executive roadmap (outcome-focused, not feature lists):
Show OKRs → initiatives → expected outcomes
Not: "Build feature X"
Yes: "Reduce time-to-activation by 40% → onboarding redesign + email sequence"

Customer-facing roadmap:
Themes only, no dates ("coming soon" / "planned" / "exploring")
Never include dates unless the feature is weeks away
Safety: don't commit publicly to features that might be cut

Design the roadmap format for my specific audience and generate a template.
```

### OKR alignment

```
Align roadmap items to OKRs.

Company OKRs for [quarter/year]: [list — objective + key results]
Product OKRs (if separate): [list]
Roadmap items currently planned: [list of features or initiatives]

Alignment check:

For each roadmap item:
- Which OKR does it contribute to? (must link to at least one)
- Which key result does it move? (be specific)
- How confident are we it'll move that KR? (high / medium / low)
- Items with no OKR link: cut or deprioritise unless there's a compelling exception

For each OKR:
- Which roadmap items contribute? (should be 1-3 items per KR)
- Is there a KR with no roadmap coverage? (gap — need to add initiatives)
- Is there a KR over-covered? (too many items chasing same outcome — focus)

Output: 
- Roadmap-to-OKR mapping table
- Gaps (OKRs without coverage)
- Over-investments (too many items on one KR)
- Recommendations for cuts or additions

Align my roadmap to the OKRs I provide.
```

### Quarterly planning process

```
Run a quarterly planning process for [product team].

Team size: [X engineers + X PMs + X designers]
Planning horizon: [Q3 2026 — July to September]
Current OKRs: [paste]
Capacity: [X engineering weeks available after on-call, tech debt, bugs]

Quarterly planning timeline (4-week process):

Week 1 — Input gathering:
□ Compile: customer feedback, support tickets, NPS verbatims, sales lost/won reasons
□ Run: data review (which metrics are healthy / unhealthy?)
□ Collect: stakeholder asks (from sales, CS, marketing)
□ Identify: tech debt that's actively slowing the team

Week 2 — Opportunity sizing:
□ Cluster inputs into themes (not features yet — problems)
□ Score each theme: user impact × frequency × strategic fit
□ Identify the top 3-5 opportunities for the quarter

Week 3 — Scoping and sequencing:
□ For each opportunity: rough T-shirt size (S/M/L/XL)
□ Capacity fit: X engineering weeks total
□ Sequence: what must go first (dependencies, risk)?
□ Negotiate: cut until capacity is met + 20% buffer

Week 4 — Alignment and communication:
□ Engineering review: technical feasibility check
□ Executive sign-off: OKR alignment confirmed
□ Sales/CS briefing: what's coming, what's not
□ Publish: internal roadmap updated
□ Team kickoff: Q3 planning complete

Output: completed quarterly plan template with items, owners, and capacity allocation.
```

## Example

**User:** We have 8 engineers, 2 PMs, Q3 OKRs focused on activation rate (+30%) and NPS (+10pts). Backlog has 23 items. Help me prioritise.

**Claude's process:**

First — filter ruthlessly before scoring.

**Filter 1 — OKR relevance:**
Of your 23 items, separate into:
- Activation impact: [items that affect time-to-value, onboarding, first week engagement]
- NPS impact: [items customers have explicitly requested or complained about]
- Neither: [items that are technically interesting but don't move these two KRs]

The "neither" pile should be cut or moved to Q4 before you even score.

**Filter 2 — Effort reality check:**
At 8 engineers for 13 weeks = ~104 engineering weeks. Reserve 20% for bugs/incidents = ~83 weeks available.
XL items (>8 weeks each) = can only do 2-3 in a quarter. Cut the rest or scope down.

**RICE scoring the shortlist (example):**

| Item | Reach | Impact | Confidence | Effort | RICE | OKR |
|---|---|---|---|---|---|---|
| Onboarding checklist redesign | 400 | 3 | 85% | 3w | 340 | Activation |
| Email sequence improvement | 800 | 2 | 70% | 2w | 560 | Activation |
| In-app NPS survey | 1000 | 1 | 90% | 1w | 900 | NPS |
| Bulk export feature | 200 | 2 | 60% | 6w | 40 | Neither |

**Recommendation:**
In-app NPS survey (1w, high RICE) first — quick win, enables measurement of your NPS OKR.
Email sequence (2w) second — highest activation ROI per week.
Onboarding redesign (3w) third — most strategic activation improvement.
Bulk export — push to Q4 unless sales is losing deals over it.

---
