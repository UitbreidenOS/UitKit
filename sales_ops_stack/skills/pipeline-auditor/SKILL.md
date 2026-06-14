---
name: pipeline-auditor
description: Audits pipeline health across all reps and segments. Analyzes stage distribution, conversion funnel, cycle time, stuck deals, data quality, and forecast accuracy. Returns structured health report with bottleneck identification and recommendations.
allowed-tools: Read, Write, WebFetch
effort: high
---

## When to activate

Before weekly pipeline reviews, monthly forecast runs, or when pipeline velocity has degraded. Provides executive visibility into deal flow, bottlenecks, and data integrity. Run weekly or on-demand via `/audit-pipeline` command.

## When NOT to use

Not for individual deal analysis — use deal-analyzer instead. Not for forecasting — use forecast-builder. Not for territory-level optimization — use territory-planner.

## Audit Checklist

Execute these ten steps in order. Record findings in structured report.

1. **Pipeline Snapshot** — Total pipeline value, weighted pipeline, deal count by stage, avg deal size
2. **Stage Distribution** — % of deals in each stage; compare to historical baseline (alert if >20% variance)
3. **Conversion Funnel** — Calculate stage-to-stage conversion rates; compare to historical benchmarks (alert if <hist avg - 10%)
4. **Cycle Time Analysis** — Days in each stage (Prospect, Qualification, Solution Design, Negotiation); identify bottlenecks
5. **Stuck Deal Identification** — Deals with no activity >14 days; by stage, by rep; total count and value at risk
6. **Data Quality Score** — % of records with all required fields; identify missing data by field and rep
7. **Forecast Accuracy Check** — Compare prior month forecast to actual; calculate variance; document reason for variance
8. **Rep-Level Performance** — Deals by rep, average deal size, cycle time, close rate; identify outliers (high/low)
9. **Segment Analysis** — Pipeline by segment (Enterprise, Mid-Market, SMB); conversion rates and cycle times by segment
10. **Risk Summary** — Aggregate risks: stuck deals >$50K, stage regression, probability drift, forecast miss >±10%

## Pipeline Audit Report Template

Save as `audits/pipeline-audit-[YYYY-MM-DD].md`

```markdown
# Pipeline Audit — [Date]

**Report Generated:** [timestamp]
**Data Source:** [CRM name, export date]
**Audit Period:** [date range]

---

## Executive Summary

- **Total Pipeline Value:** $[X]M across [X] deals
- **Weighted Pipeline:** $[X]M (pipeline × stage probability)
- **Forecast Accuracy:** [Prior month variance: +/-X%]
- **Critical Alerts:** [Count of high-risk flags]
- **Status:** [Green / Yellow / Red]

---

## Pipeline Snapshot

| Metric | Value | Target | Status |
|---|---|---|---|
| Total Pipeline Value | $[X]M | >2x quarterly target | [✓ or ✗] |
| Weighted Pipeline | $[X]M | >3x quarterly target | [✓ or ✗] |
| Total Deal Count | [X] | [baseline] | [✓ or ✗] |
| Average Deal Size | $[X]K | [baseline] | [✓ or ✗] |
| Pipeline Freshness (avg) | [X] days | <30 days | [✓ or ✗] |

---

## Stage Distribution

| Stage | Deal Count | % of Total | Pipeline Value | Avg Deal Size | vs. Baseline |
|---|---|---|---|---|---|
| Prospect | [X] | [X]% | $[X]M | $[X]K | [+/-X%] |
| Qualification | [X] | [X]% | $[X]M | $[X]K | [+/-X%] |
| Solution Design | [X] | [X]% | $[X]M | $[X]K | [+/-X%] |
| Negotiation | [X] | [X]% | $[X]M | $[X]K | [+/-X%] |
| **TOTAL** | [X] | 100% | $[X]M | $[X]K | — |

**Alert:** If >20% variance from baseline, investigate reason (seasonal, lost deals, new reps, pipeline refresh).

---

## Conversion Funnel

**Historical Conversion Rates (baseline):**
- Prospect → Qualification: [X]%
- Qualification → Solution Design: [X]%
- Solution Design → Negotiation: [X]%
- Negotiation → Closed/Won: [X]%
- **End-to-End Win Rate:** [X]%

**Current Month Conversion:**
- Prospect → Qualification: [X]% ([vs hist avg: +/-X%])
- Qualification → Solution Design: [X]% ([vs hist avg: +/-X%])
- Solution Design → Negotiation: [X]% ([vs hist avg: +/-X%])
- Negotiation → Closed/Won: [X]% ([vs hist avg: +/-X%])

**Alert:** If any conversion rate <hist avg - 10%, investigate bottleneck in that stage.

---

## Cycle Time Analysis

| Stage | Avg Days | Baseline | Trend | Alert |
|---|---|---|---|---|
| Prospect | [X] | [X] | [↑ or ↓ or →] | [if >baseline + 5 days] |
| Qualification | [X] | [X] | [↑ or ↓ or →] | [if >baseline + 5 days] |
| Solution Design | [X] | [X] | [↑ or ↓ or →] | [if >baseline + 5 days] |
| Negotiation | [X] | [X] | [↑ or ↓ or →] | [if >baseline + 5 days] |
| **Total Cycle Time** | [X] days | [X] days | [↑ or ↓ or →] | — |

**Bottleneck:** [Stage with longest avg days or trend upward]

---

## Stuck Deal Alerts

**Definition:** No activity >14 days in any stage.

| Deal ID | Account | Value | Stage | Days No Activity | Owner | Last Action | Recommendation |
|---|---|---|---|---|---|---|---|
| [ID] | [name] | $[X]K | [stage] | [X] days | [rep] | [date: action] | [Contact rep / Executive touch / Push timeline] |

**Stuck Deal Summary:**
- Count: [X] deals
- Value at Risk: $[X]M
- By Stage: Prospect [X], Qualification [X], Design [X], Negotiation [X]
- Alert: If value at risk >$[X]M (10% of pipeline), escalate to VP Sales

---

## Data Quality Score

**Target:** >98% of records with all required fields

| Field | % Complete | Issue | Action |
|---|---|---|---|
| Account Name | [X]% | [if <100%] | [List reps with gaps] |
| Deal Value | [X]% | [if <100%] | [List reps with gaps] |
| Sales Stage | [X]% | [if <100%] | [List reps with gaps] |
| Deal Owner | [X]% | [if <100%] | [List reps with gaps] |
| Close Date | [X]% | [if <100%] | [List reps with gaps] |
| Probability | [X]% | [if <100%] | [List reps with gaps] |
| Last Activity | [X]% | [if <100%] | [List reps with gaps] |
| Stakeholder Engagement | [X]% | [if <100%] | [List reps with gaps] |

**Overall Data Quality Score:** [X]%

---

## Rep-Level Performance

| Rep | Deals in Pipeline | Pipeline Value | Avg Deal Size | Cycle Time (days) | Close Rate (%) | Alert |
|---|---|---|---|---|---|---|
| [Name] | [X] | $[X]M | $[X]K | [X] | [X]% | [if outlier: high/low] |
| [Name] | [X] | $[X]M | $[X]K | [X] | [X]% | [if outlier: high/low] |

**Outlier Analysis:**
- Highest pipeline: [rep name] — [insight]
- Longest cycle time: [rep name] — [bottleneck]
- Highest close rate: [rep name] — [best practice to replicate]

---

## Segment Analysis

| Segment | Deal Count | Pipeline Value | Avg Deal Size | Cycle Time | Conv Rate | Probability Drift |
|---|---|---|---|---|---|---|
| Enterprise | [X] | $[X]M | $[X]K | [X] days | [X]% | [if >±10%] |
| Mid-Market | [X] | $[X]M | $[X]K | [X] days | [X]% | [if >±10%] |
| SMB | [X] | $[X]M | $[X]K | [X] days | [X]% | [if >±10%] |

**Segment Insights:**
- [Trend for Enterprise segment]
- [Trend for Mid-Market segment]
- [Trend for SMB segment]

---

## Forecast Accuracy

**Prior Month Forecast:** $[X]M  
**Actual Revenue:** $[X]M  
**Variance:** [+X% / -X%]  
**Status:** [✓ Within target <±10% / ✗ Exceeded target]

**Variance Root Cause:**
- Lost deals: [count, $X]M reason
- New opportunities: [count, $X]M
- Stage acceleration: [count, $X]M
- Stage regression: [count, $X]M
- [Others]

**Forecast Methodology Review:**
- Current model assumptions: [list]
- Adjustment needed: [if variance >±10%]
- Next month forecast variance expectation: [X%]

---

## Critical Risk Alerts

**High Priority (escalate within 24 hours):**
- [List critical risks: stuck $100K+ deals, probability drift, stage regression, forecast miss >±10%]

**Medium Priority (address within 48 hours):**
- [List medium risks]

**Low Priority (address in weekly 1:1):**
- [List low risks]

---

## Recommendations

1. **Immediate Actions:**
   - [Action 1 — owner, deadline]
   - [Action 2 — owner, deadline]

2. **This Week:**
   - [Action 1 — owner, deadline]
   - [Action 2 — owner, deadline]

3. **Next Forecast Cycle:**
   - [Methodology adjustment if variance >±10%]
   - [Rep coaching for outliers]
   - [Pipeline refresh strategy if <2x target]

---

## Next Review

**Scheduled:** [7 days from now]  
**Focus Areas:** [List based on current findings]

---
