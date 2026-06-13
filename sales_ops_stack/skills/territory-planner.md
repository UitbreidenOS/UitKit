---
name: territory-planner
description: Analyzes and optimizes territory assignment for maximum productivity and coverage. Calculates workload balance across reps, identifies over/under-utilized territories, proposes segmentation strategy, and aligns quotas with capacity and historical benchmarks.
allowed-tools: Read, Write, WebFetch
effort: high
---

## When to activate

Quarterly territory reviews or when onboarding new reps. Use when hiring triggers territory expansion or when rep workload is significantly unbalanced. Provides balanced territory plan and quota recommendations.

## When NOT to use

Not for individual rep performance assessment — use ramp-tracker. Not for annual compensation planning. Not for account strategy — focus is territory and workload optimization.

## Territory Planning Checklist

Execute these eight steps in sequence.

1. **Current Territory Inventory** — List all assigned territories, reps, account count, pipeline value, quota, current productivity
2. **Workload Analysis** — Calculate FTE-equivalent capacity per rep; compare to assigned account load
3. **Productivity Benchmarking** — Calculate deals closed/rep, ACV/rep, pipeline value/rep; identify high/low performers
4. **Account Segmentation** — Segment accounts by: revenue potential (high/medium/low), engagement level, and growth trajectory
5. **Coverage Gaps** — Identify unassigned accounts or territories; calculate lost revenue from gaps
6. **New Rep Ramp Plan** — Design territory for new hire: account mix, quota progression, coaching focus
7. **Balancing Recommendations** — Propose territory realignment to equalize workload and opportunity distribution
8. **Quota Alignment** — Set quotas based on territory opportunity, rep experience level, and ramp stage

## Territory Plan Template

Save as `territories/territory-plan-[date].md`

```markdown
# Territory Plan — [Date]

**Plan Created:** [timestamp]
**Planning Horizon:** [Next quarter / Year]
**Total Accounts:** [X]
**Total Territory Value:** $[X]M
**Rep Count:** [X]
**Plan Status:** [Draft / VP Approved / Implemented]

---

## Executive Summary

**Current State:**
- [X] territories assigned
- [X] reps active
- [X] accounts unassigned
- Total territory value: $[X]M
- Average workload/rep: [X] accounts, $[X]M pipeline

**Key Finding:**
[Workload balance score: Balanced / Imbalanced. E.g., "Highest loaded rep has 2.5x accounts of lowest loaded rep" or "Territory gaps represent $[X]M lost revenue"]

**Recommendation:**
[Summary of rebalancing proposal or new rep onboarding plan]

---

## Current Workload Distribution

| Rep | Assigned Accounts | Pipeline Value | Current Quota | Productivity (deals/year) | Workload Index |
|---|---|---|---|---|---|
| [Name] | [X] | $[X]M | $[X]M | [X] deals | [1.2x / 0.8x / etc baseline] |
| [Name] | [X] | $[X]M | $[X]M | [X] deals | — |
| [Name] | [X] | $[X]M | $[X]M | [X] deals | — |
| **Unassigned** | [X] | $[X]M | — | — | — |
| **TOTAL** | [X] | $[X]M | $[X]M | [X] deals | — |

**Workload Balance Score:** [High: all within ±15% / Medium: ±15–30% / Low: >±30%]

---

## Account Segmentation Model

**Segment all accounts by two dimensions: Revenue Potential + Growth Stage**

### Revenue Potential Tiers

- **High:** Current ARR >$50K or estimated potential >$100K
- **Medium:** Current ARR $10K–$50K or estimated potential $50K–$100K
- **Low:** Current ARR <$10K or estimated potential <$50K

### Growth Stage Categories

- **Growth:** Recent funding, hiring surge, product launch, or market expansion signal
- **Stable:** Mature company, stable headcount, organic growth
- **Declining:** Lost recent customer, headcount reduction, or market exit signal

### Account Matrix (Example)

| High Potential + Growth | High Potential + Stable | Medium Potential + Growth | Medium Potential + Stable | Low Potential |
|---|---|---|---|---|
| [X] accounts | [X] accounts | [X] accounts | [X] accounts | [X] accounts |
| Priority: 1 | Priority: 2 | Priority: 3 | Priority: 4 | Priority: 5 |
| Example: Acme | Example: XYZ Inc | Example: Growth Co | Example: Stable Inc | Example: Small Biz |

---

## Current Territory Assignment

### Territory 1: [Rep Name]

| Metric | Value | Benchmark |
|---|---|---|
| **Assigned Accounts** | [X] | Avg: [X] |
| **Pipeline Value** | $[X]M | Avg: $[X]M |
| **Annual Quota** | $[X]M | Avg: $[X]M |
| **2024 Productivity** | [X] deals, $[X]M closed | Avg: [X] deals |
| **Quota Attainment** | [X]% | Target: 100% |
| **Account Segmentation** | [X] High, [X] Medium, [X] Low | Ideal: Balanced |
| **Coverage Ratio** | [X]% (assigned/available) | Target: 95%+ |

**Territory Health:** [Healthy / Needs Rebalance / Understaffed]

**Notes:**
- [Strength: e.g., "Strong in Enterprise segment"]
- [Gap: e.g., "Underlevered in Mid-Market growth accounts"]

---

## Coverage Gap Analysis

**Unassigned or Under-Served Accounts:**

| Account | Revenue Potential | Growth Signal | Current Status | Recommended Assignment |
|---|---|---|---|---|
| [Account] | [High/Med/Low] | [Yes/No] | [Unassigned / Part-time] | [Rep name or new hire] |
| [Account] | [High/Med/Low] | [Yes/No] | [Unassigned / Part-time] | [Rep name or new hire] |

**Coverage Gap Value:** $[X]M in unassigned high-potential accounts

**Remediation:** 
- Assign [X] accounts to [rep name]
- Hire [new rep] to cover [X] accounts / $[X]M pipeline

---

## New Rep Onboarding Plan (if applicable)

**Rep Name:** [Name]  
**Start Date:** [Date]  
**Ramp Target:** Full quota by Month [X]

### Territory Assignment for New Rep

| Attribute | Target | Rationale |
|---|---|---|
| **Account Count** | [X] accounts | Easier to manage; focus on ramping |
| **Pipeline Value** | $[X]M | Realistic for [X]-month ramp |
| **Segment Mix** | [X] High, [X] Medium, [X] Low | Mix of opportunity sizes for learning |
| **Geographic Focus** | [Region] | Existing company presence; easier logistics |
| **Account Health** | [X]% existing customers | Lower prospecting load during ramp |

**Ramp Milestones:**
- Month 1–2: Build prospecting pipeline; target [X] new accounts identified
- Month 3–4: Early stage deals (Prospect/Qualification); target $[X]M pipeline
- Month 5–6: Deals advancing to close; target [X] deals closing, [X]% quota
- Month 7–12: Full territory coverage; target 100% quota

**Support Plan:**
- Weekly 1:1 with sales manager
- Monthly territory review (embedded in larger sales ops review)
- Peer mentor: [Experienced rep name] — co-calls for first [X] weeks

---

## Balancing Recommendations

### Current State Assessment

**Workload Balance:** [Imbalanced / Balanced]

**Imbalance Evidence:**
- [Rep name] has [X] accounts (Highest)
- [Rep name] has [X] accounts (Lowest)
- Ratio: [X]:1 (should be ≤1.3:1 for balance)

**Opportunity Concentration:**
- Top [X] reps own [X]% of total pipeline value
- Lowest [X] reps own [X]% of total pipeline value
- Recommendation: Rebalance toward [Y]% / [Z]% split

### Proposed Rebalancing

**Option A: Reassign Accounts (Recommended if [reason])**

| From Rep | To Rep | Accounts | Pipeline Value | Impact |
|---|---|---|---|---|
| [Name] | [Name] | [X] accounts | $[X]M | [Reduces workload for Name from X to Y; increases for Name] |
| [Name] | [Name] | [X] accounts | $[X]M | — |

**Transition Plan:**
- Reassignment date: [Date]
- Handoff period: [X] weeks (both reps co-managing accounts)
- Customer communication: [Approach: warm intro, account continuity briefing]

**Option B: New Hire**

- Hire [X] new rep(s)
- Reduce workload for [X] rep(s)
- Expand coverage into [region/segment]

---

## Quota Recommendations

**Quota-Setting Framework:**

| Factor | Formula | Output |
|---|---|---|
| Territory Opportunity | Sum of account potential | $[X]M |
| Rep Experience Multiplier | [New = 0.6x, Intermediate = 0.8x, Senior = 1.0x] | [X]x |
| Ramp Adjustment | [Month 1–3 = 0.3x, Month 4–6 = 0.65x, Month 7–12 = 1.0x] | [X]x |
| **Recommended Quota** | [Opportunity × Experience × Ramp] | **$[X]M** |

### Proposed Annual Quotas (by rep)

| Rep | Experience Level | Territory Opportunity | Recommended Quota | Variance from Current | Status |
|---|---|---|---|---|---|
| [Name] | [Senior / Intermediate / New] | $[X]M | $[X]M | [+/-X% vs. current] | [Increase / Maintain / Reduce] |
| [Name] | [Senior / Intermediate / New] | $[X]M | $[X]M | [+/-X% vs. current] | — |

**Approval Gate:**
- VP Sales approval required before implementing quota changes
- Quota changes tied to territory rebalancing (if applicable)
- Effective date: [Date]

---

## Success Metrics (Post-Implementation)

Track quarterly:

- **Workload Balance Index:** Ratio between highest and lowest loaded rep (target: <1.3:1)
- **Coverage Ratio:** % of total addressable accounts with assigned owner (target: >95%)
- **Quota Attainment:** % of reps at/above quota by segment (target: >85%)
- **Territory Value Growth:** YoY pipeline value per territory (target: +10%)
- **Rep Retention:** Turnover rate in roles (target: <15% annually)

---

## Implementation Timeline

- **Week 1:** Gain VP Sales approval on plan
- **Week 2–3:** Communicate changes to affected reps and customers
- **Week 4:** Execute account reassignments; monitor transition
- **Week 5–8:** Weekly check-ins with impacted reps; resolve issues
- **Week 12:** Post-implementation review; adjust if needed

---
