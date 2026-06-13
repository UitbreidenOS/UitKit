---
name: pipeline-analyzer
description: Generates real-time pipeline health snapshot with deal velocity, stage aging, forecast accuracy, conversion rates, and at-risk deal identification. Compares to monthly targets and historical baselines.
allowed-tools: Read, Write, WebFetch
effort: medium
---

## When to activate

Run weekly (every Monday) before leadership update, or on-demand when pipeline visibility needed. Requires access to CRM export or API feed with deal records, stage history, and close dates.

## When NOT to use

Not for historical trend analysis—use deal-velocity-analyzer instead. Not for individual rep performance—use quota-tracker. Not without current CRM data; stale snapshots produce inaccurate insights.

## Pipeline Health Checklist

Execute in sequence. Mark each complete before moving next.

1. **Data validation** — Verify CRM export timestamp (<24 hours old). Count total open deals, total pipeline value. Flag if counts differ from last week by >15% (data quality check).
2. **Stage breakdown** — Categorize deals by sales stage (e.g., Prospecting, Qualification, Proposal, Negotiation, Closed-Won, Closed-Lost). Calculate count and value per stage.
3. **Age analysis** — For each deal, calculate days in current stage (today minus last stage change date). Flag deals aged >30 days in same stage as stalled.
4. **Forecast accuracy** — Compare pipeline value by stage vs. historical conversion rates. Multiply each stage value by win rate; sum for projected close value. Compare to submitted forecast and prior month actual close.
5. **Conversion rate trending** — Calculate stage-to-stage conversion (% of deals that progressed from stage N to stage N+1 in past 30 days). Compare to 90-day rolling average.
6. **Deal risk scoring** — For deals >$50K, assess: buyer committee health (known vs. unknown stakeholders), competitive threats (disclosed), close probability (rep-submitted). Flag as high-risk if <50% probability.
7. **Quota pacing** — Compare month-to-date close value vs. pro-rata monthly target. Calculate daily run rate needed to hit target. Surface shortfall forecast.

## Pipeline Health Metrics

Calculate and report these seven metrics:

**Pipeline Coverage Ratio** = Total open pipeline value / annual quota target. Target: 3.5:1 to 4.5:1. Red flag: <3:1 (quota miss risk) or >6:1 (stalled pipeline).

**Average Deal Age per Stage** = Sum of (days in stage for all deals) / count of deals in stage. Benchmark by stage. Red flag if >30 days in same stage.

**Stage Conversion Rate** = Count of deals progressing stage → stage in past 30 days / count of deals in source stage at start of period. Expected: 40–60% depending on industry and stage.

**Weighted Forecast Health** = Projected close value (sum of stage values × historical win rate) / submitted forecast. Confidence level: >1.0 = conservative, <0.9 = aggressive. Target: 0.95–1.05.

**At-Risk Deal Count** = Count of deals with close probability <50% or aged >30 days. Separate by stage. Flag for manager re-engagement.

**Sales Cycle Trending** = Average days from first opportunity creation to close, by deal size cohort. Compare to 90-day rolling average. Red flag if trending +20% (slowing cycle).

**Quota Attainment Forecast** = (YTD closed value + projected month close) / YTD + 1-month quota target. Forecast if trending team misses quarter, trigger escalation.

## Output Format

Save as `reports/pipeline-snapshot-{YYYY-MM-DD}.md`. Use template:

```markdown
# Pipeline Health Snapshot — {Date}

**Report Period:** {Start date} to {End date}  
**Data Refresh:** {Timestamp of CRM export}  
**Prepared by:** [Name]

---

## Executive Summary

{1 sentence on overall health: Green / Yellow / Red}  
{Top 2–3 findings: risks, opportunities, actions}  
{Forecast accuracy vs. plan}

---

## Pipeline Overview

| Metric | Value | Target | Status |
|---|---|---|---|
| Total Open Deals | {N} | — | {Green/Yellow/Red} |
| Total Pipeline Value | ${} | ${3.5x quota} | {Green/Yellow/Red} |
| Pipeline Coverage Ratio | {#}:1 | 3.5:1–4.5:1 | {Green/Yellow/Red} |
| Weighted Forecast Health | {%} | 95–105% | {Green/Yellow/Red} |

---

## Stage Breakdown

| Stage | Count | Value | Avg Age | Win Rate | At Risk |
|---|---|---|---|---|---|
| Prospecting | {N} | ${} | {D} days | {%} | {N} |
| Qualification | {N} | ${} | {D} days | {%} | {N} |
| Proposal | {N} | ${} | {D} days | {%} | {N} |
| Negotiation | {N} | ${} | {D} days | {%} | {N} |
| **Total** | **{N}** | **${}** | — | — | **{N}** |

---

## At-Risk Deals (Stalled >30 days or <50% close probability)

| Deal | Company | Stage | Age | Probability | Owner | Recommended Action |
|---|---|---|---|---|---|---|
| {ID} | {Name} | {Stage} | {D} days | {%} | {Rep} | Re-engage buyer / escalate to champion |

---

## Sales Cycle Trending

Average cycle time (Opportunity Created → Close): {N} days  
90-day rolling average: {N} days  
Trend: {+/- %} vs. baseline  
Status: {Green/Yellow/Red — flag if >20% increase}

---

## Quota Pacing

**Month-to-date closed:** ${} (vs. pro-rata target of ${})  
**Forecast for month-end:** ${} (based on deal stage × win rate)  
**Variance vs. target:** {+/- %}  
**Forecast confidence:** {High/Medium/Low}

---

## Conversion Rate Trending (30-day)

| Transition | Conversion | 90-Day Avg | Trend |
|---|---|---|---|
| Prospecting → Qualification | {%} | {%} | {+/- %} |
| Qualification → Proposal | {%} | {%} | {+/- %} |
| Proposal → Negotiation | {%} | {%} | {+/- %} |
| Negotiation → Close | {%} | {%} | {+/- %} |

---

## Recommended Actions

- {Action 1: Specific deal escalation or re-engagement}
- {Action 2: Process or messaging fix}
- {Action 3: Forecast/capacity adjustment}

**Next Review:** {Date}
```

## Example

# Pipeline Health Snapshot — 2026-06-10

**Report Period:** 2026-06-03 to 2026-06-10  
**Data Refresh:** 2026-06-10 09:00 UTC  
**Prepared by:** Sales Ops

---

## Executive Summary

**Status: YELLOW** — Pipeline healthy overall, but two large deals (>$100K) showing age concerns and buyer committee gaps.

**Key Findings:**
- Negotiation stage aging 35+ days (above 30-day threshold); requires champion escalation for two deals
- Forecast accuracy trending 92% vs. submitted 95%; conservative estimate suggests 94% attainment vs. commit
- Win rate in Proposal stage declined from 48% to 41% in past 30 days; possible product/pricing messaging issue

---

## Pipeline Overview

| Metric | Value | Target | Status |
|---|---|---|---|
| Total Open Deals | 67 | — | Green |
| Total Pipeline Value | $4.2M | $3.85M (3.5x $1.1M quota) | Green |
| Pipeline Coverage Ratio | 3.8:1 | 3.5–4.5:1 | Green |
| Weighted Forecast Health | 92% | 95–105% | Yellow |

---

## Stage Breakdown

| Stage | Count | Value | Avg Age | Win Rate | At Risk |
|---|---|---|---|---|---|
| Prospecting | 18 | $400K | 8 days | 35% | 0 |
| Qualification | 22 | $900K | 15 days | 48% | 2 |
| Proposal | 16 | $1.1M | 22 days | 41% | 3 |
| Negotiation | 8 | $600K | 32 days | 72% | 2 |
| **Total** | **64** | **$3.0M** | — | — | **7** |

---

## At-Risk Deals (Stalled >30 days or <50% close probability)

| Deal | Company | Stage | Age | Probability | Owner | Recommended Action |
|---|---|---|---|---|---|---|
| OPP-2847 | Acme Corp | Negotiation | 38 days | 55% | John Smith | Champion introduction; needs exec sponsor sign-off |
| OPP-2903 | TechFlow Inc | Proposal | 28 days | 35% | Maria Garcia | Feature gap vs. competitor; request decision timeline |
| OPP-2911 | Global Services | Negotiation | 35 days | 60% | James Lee | Procurement delay; escalate to VP Procurement |

---

## Sales Cycle Trending

Average cycle time (Opportunity Created → Close): 62 days  
90-day rolling average: 58 days  
Trend: +7% vs. baseline  
Status: **Yellow** — Slight increase; monitor for bottleneck in Proposal stage

---

## Quota Pacing

**Month-to-date closed:** $320K (vs. pro-rata target of $366K per week for $1.1M monthly quota)  
**Forecast for month-end:** $940K (based on deal stage × win rate)  
**Variance vs. target:** -14% vs. commit forecast  
**Forecast confidence:** Medium — Dependent on 2 large deals (>$100K) closing on time

---

## Conversion Rate Trending (30-day)

| Transition | Conversion | 90-Day Avg | Trend |
|---|---|---|---|
| Prospecting → Qualification | 42% | 45% | -7% |
| Qualification → Proposal | 65% | 68% | -4% |
| Proposal → Negotiation | 48% | 52% | -8% |
| Negotiation → Close | 72% | 75% | -4% |

---

## Recommended Actions

- **Immediate:** Schedule exec sponsor intro for OPP-2847 (Acme Corp); without buyer champion escalation, deal at risk of slipping to Q3
- **This week:** Sales manager coaching on Proposal stage messaging; win rate decline suggests product positioning or competitor differentiation gap
- **Weekly:** Monitor cycle time trend; if continues +20%, audit sales process for approval delays or capability gaps
- **Monthly forecast:** Adjust commit to 94% coverage based on weighted forecast; surface to finance for revenue recognition review

**Next Review:** 2026-06-17

---
