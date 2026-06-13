---
name: deal-velocity-analyzer
description: Analyzes deal progression time by stage, cycle-time trends, bottleneck identification, and win/loss patterns by stage. Benchmarks against historical baselines and industry standards.
allowed-tools: Read, Write
effort: medium
---

## When to activate

Weekly or monthly, or on-demand to investigate cycle-time delays. Requires deal history with stage change timestamps.

## When NOT to use

Not for individual deal coaching (use deal-risk-analyzer). Not for forecast accuracy (use forecast-builder). Not for rep performance (use quota-tracker).

## Cycle-Time Analysis Framework

**Average time-in-stage** = (Today - last stage entry date) for all deals in stage, averaged.

**Benchmarking:**
- Enterprise: Negotiation 45+ days expected; Proposal 30–45 days.
- Mid-Market: Negotiation 20–30 days; Proposal 15–25 days.
- Commercial: Negotiation 10–15 days; Proposal 5–10 days.

**Bottleneck identification:**
- Any stage where average time >30% above benchmark = bottleneck.
- Analyze: missing stakeholder approval, technical evaluation, legal review, budget confirmation.

## Output Template

```markdown
# Deal Velocity Analysis — {Date}

**Analysis Period:** {Date range}

---

## Time-in-Stage Breakdown

| Stage | Count | Avg Days | Benchmark | Variance | Status |
|---|---|---|---|---|---|
| Prospecting | {N} | {D} | {D} | {+/-D} | {Color} |
| Negotiation | {N} | {D} | {D} | {+/-D} | {Color} |

---

## Bottleneck Analysis & Recommended Actions

**Stage:** {Name}  
**Variance:** +{%} vs. benchmark  
**Root causes:** [List]  
**Actions:** [List with owners and deadlines]

---

## Cycle-Time Trending

Current: {D} days vs. benchmark: {D} days | Trend: {+/- %}  
Status: {Green/Yellow/Red}
```
