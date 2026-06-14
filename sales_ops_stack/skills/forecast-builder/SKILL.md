---
name: forecast-builder
description: Builds rolling 13-week revenue forecast using historical conversion rates, stage-weighted pipeline, velocity analysis, and risk adjustments. Compares to prior forecast and actuals. Returns detailed forecast breakdown by stage, segment, and risk tier with variance analysis.
allowed-tools: Read, Write, WebFetch
effort: high
---

## When to activate

Monthly before forecast review (recommended: first Friday of month). Also on-demand when pipeline composition changes significantly or when variance from prior forecast exceeds ±10%. Provides revenue visibility and variance explanation for leadership.

## When NOT to use

Not for deal-level probability assessment — use deal-analyzer instead. Not for pipeline auditing — use pipeline-auditor. Not for new rep ramp forecasting — use ramp-tracker.

## Forecast Building Checklist

Execute these nine steps in sequence.

1. **Baseline Conversion Rates** — Pull historical stage conversion rates by segment (Enterprise, Mid-Market, SMB); identify trends
2. **Pipeline Snapshot** — Current pipeline by stage and segment; calculate stage-weighted pipeline using baseline probabilities
3. **Velocity Analysis** — Calculate daily pipeline velocity (rate of deals moving through each stage); trend over past 12 weeks
4. **13-Week Projection** — Apply velocity and conversion rates to current pipeline; project closures by week
5. **Risk Adjustment** — Apply discount to high-risk deals (probability <stage baseline - 20%); exclude stuck deals >21 days no activity
6. **Segment Breakdown** — Forecast by segment (Enterprise, Mid-Market, SMB); apply segment-specific conversion rates and cycle times
7. **Variance Analysis** — Compare current forecast to prior month forecast and actual; document reasons for changes
8. **Sensitivity Analysis** — Model upside scenario (conversion rates +10%), base case (historical), and downside (conversion rates -10%)
9. **Confidence Assessment** — Rate forecast confidence (High / Medium / Low) based on data quality, pipeline freshness, and variance history

## Forecast Report Template

Save as `forecasts/forecast-[YYYY-WW].md` (e.g., `forecast-2026-24.md` for week 24)

```markdown
# Sales Forecast — [Date] (13-Week Rolling)

**Forecast Generated:** [timestamp]
**Forecast Period:** Week [X] through Week [X]
**Data Source:** [CRM export date]
**Forecast Confidence:** [High / Medium / Low]

---

## Executive Summary

| Metric | Value | Prior Month | Variance | Status |
|---|---|---|---|---|
| **13-Week Forecast** | $[X]M | $[X]M | [+/-X%] | [✓ or ✗] |
| **Expected Closures (Week 1–4)** | $[X]M | $[X]M | [+/-X%] | — |
| **Pipeline Value** | $[X]M | $[X]M | [+/-X%] | — |
| **Weighted Pipeline** | $[X]M | $[X]M | [+/-X%] | — |
| **Forecast Confidence** | [High / Medium / Low] | [Prior] | — | — |

**Key Narrative:**
- [One sentence summary of forecast direction: increasing, stable, or declining]
- [Primary driver of variance from prior month: new opportunities, lost deals, acceleration, deceleration]
- [Risk factors: missing conversions, stuck deals, rep productivity]
- [Upside/downside scenarios]

---

## Baseline Conversion Model

**Historical Stage Conversion Rates (12-month average):**

| Segment | Prospect→Qual | Qual→Design | Design→Negotiation | Negotiation→Won | End-to-End Win Rate |
|---|---|---|---|---|---|
| Enterprise | [X]% | [X]% | [X]% | [X]% | [X]% |
| Mid-Market | [X]% | [X]% | [X]% | [X]% | [X]% |
| SMB | [X]% | [X]% | [X]% | [X]% | [X]% |
| **BLENDED** | [X]% | [X]% | [X]% | [X]% | [X]% |

**Conversion Rate Trend (12 weeks):**
- Enterprise: [Stable / Improving (+X%) / Declining (-X%)] — [Reason if trending]
- Mid-Market: [Stable / Improving / Declining] — [Reason if trending]
- SMB: [Stable / Improving / Declining] — [Reason if trending]

---

## Pipeline Composition

**Current Pipeline (as of [date]):**

| Stage | Deal Count | Pipeline Value | Avg Deal Size | % of Total |
|---|---|---|---|---|
| Prospect | [X] | $[X]M | $[X]K | [X]% |
| Qualification | [X] | $[X]M | $[X]K | [X]% |
| Solution Design | [X] | $[X]M | $[X]K | [X]% |
| Negotiation | [X] | $[X]M | $[X]K | [X]% |
| **TOTAL** | [X] | $[X]M | $[X]K | 100% |

**Stage-Weighted Pipeline (using baseline probabilities):**

| Stage | Baseline Probability | Pipeline Value | Weighted Value |
|---|---|---|---|
| Prospect | 15% | $[X]M | $[X]M |
| Qualification | 35% | $[X]M | $[X]M |
| Solution Design | 60% | $[X]M | $[X]M |
| Negotiation | 80% | $[X]M | $[X]M |
| **TOTAL WEIGHTED PIPELINE** | — | $[X]M | $[X]M |

---

## Velocity Analysis

**Deal Flow (past 12 weeks):**

| Metric | 12-Week Avg | Trend | Forecast Impact |
|---|---|---|---|
| Deals entering Prospect per week | [X] | [↑ or ↓ or →] | [Increases/Decreases forecast volume in 4+ weeks] |
| Deals moving Prospect→Qualification per week | [X] | [↑ or ↓ or →] | [Affects 1–2 week forecast] |
| Deals moving Qualification→Design per week | [X] | [↑ or ↓ or →] | [Affects 2–4 week forecast] |
| Deals moving Design→Negotiation per week | [X] | [↑ or ↓ or →] | [Affects 1–2 week forecast] |
| Deals closing (Negotiation→Won) per week | [X] | [↑ or ↓ or →] | [Direct forecast impact] |

**Velocity Adjustment:**
- If trend up: Forecast velocity +[X]% above baseline
- If trend down: Forecast velocity -[X]% below baseline
- If stable: Use 12-week average

---

## 13-Week Forecast Breakdown

**Week-by-week revenue forecast (next 13 weeks):**

| Week | Forecast Revenue | Deal Count | Pipeline Value EOW | Notes |
|---|---|---|---|---|
| Week 1 | $[X]K | [X] deals | $[X]M | [Notes: e.g., "3 deals closing"] |
| Week 2 | $[X]K | [X] deals | $[X]M | — |
| Week 3 | $[X]K | [X] deals | $[X]M | — |
| Week 4 | $[X]K | [X] deals | $[X]M | — |
| **Month 1 Total** | **$[X]M** | [X] deals | — | — |
| | | | | |
| Week 5 | $[X]K | [X] deals | $[X]M | — |
| Week 6 | $[X]K | [X] deals | $[X]M | — |
| Week 7 | $[X]K | [X] deals | $[X]M | — |
| Week 8 | $[X]K | [X] deals | $[X]M | — |
| **Month 2 Total** | **$[X]M** | [X] deals | — | — |
| | | | | |
| Week 9 | $[X]K | [X] deals | $[X]M | — |
| Week 10 | $[X]K | [X] deals | $[X]M | — |
| Week 11 | $[X]K | [X] deals | $[X]M | — |
| Week 12 | $[X]K | [X] deals | $[X]M | — |
| Week 13 | $[X]K | [X] deals | $[X]M | — |
| **Month 3 Total** | **$[X]M** | [X] deals | — | — |
| | | | | |
| **13-WEEK TOTAL** | **$[X]M** | [X] deals | — | — |

---

## Segment Breakdown

**Forecast by Segment:**

| Segment | Enterprise | Mid-Market | SMB | TOTAL |
|---|---|---|---|---|
| **Current Pipeline** | $[X]M | $[X]M | $[X]M | $[X]M |
| **Expected Closures (13w)** | $[X]M | $[X]M | $[X]M | $[X]M |
| **Weighted Conv Rate** | [X]% | [X]% | [X]% | [X]% |
| **Forecast** | $[X]M | $[X]M | $[X]M | $[X]M |

**Segment Insights:**
- Enterprise: [Trend, new deals, stuck deals, risk]
- Mid-Market: [Trend, new deals, stuck deals, risk]
- SMB: [Trend, new deals, stuck deals, risk]

---

## Risk Adjustments

**High-Risk Deal Exclusions:**

| Risk Category | Deal Count | Value | Adjustment | Rationale |
|---|---|---|---|---|
| Probability drift >20% below model | [X] | $[X]M | Exclude or -[X]% | [If probability drifting, reduce forecast confidence] |
| No activity >21 days | [X] | $[X]M | -50% weighting | [Higher risk of not closing] |
| Cycle time >baseline +100% | [X] | $[X]M | -[X]% weighting | [Stalled deals lower confidence] |
| Missing economic buyer | [X] | $[X]M | -[X]% weighting | [Cannot close without budget approver] |
| Imminent close date (<7 days) + low probability | [X] | $[X]M | Exclude | [Low probability with imminent date = false forecast] |
| **Total Risk-Adjusted Reduction** | — | **$[X]M** | — | — |

**Risk-Adjusted Forecast:** $[X]M (base forecast minus risk adjustments)

---

## Variance Analysis

**Prior Month Forecast:** $[X]M  
**Current Forecast:** $[X]M  
**Variance:** [+X% / -X%]  
**Confidence Assessment:** [Variance explanation]

**Forecast vs. Actual (Last Month):**

| Category | Actual | Forecast | Variance | Root Cause |
|---|---|---|---|---|
| Closures | $[X]M | $[X]M | [+/-X%] | [Lost deals / Acceleration / New wins] |
| New Pipeline | $[X]M | $[X]M | [+/-X%] | [Higher/lower sales activity] |
| Stage Velocity | [X] deals/week | [X] deals/week | [+/-X%] | [Faster/slower progression] |

**Cumulative Forecast Accuracy (3 months):**
- Month 1 variance: [+/-X%]
- Month 2 variance: [+/-X%]
- Month 3 variance: [+/-X%]
- 3-month average variance: [+/-X%]

---

## Sensitivity Analysis

**Three scenarios: Downside / Base / Upside**

| Scenario | Assumption | 13-Week Forecast | Variance from Base |
|---|---|---|---|
| **Downside** | Conversion rates -10%, no new pipeline acceleration | $[X]M | -[X]% |
| **Base Case** | Historical conversion rates, normal velocity | $[X]M | 0% |
| **Upside** | Conversion rates +10%, above-average velocity | $[X]M | +[X]% |

**Scenario Probability:**
- Downside: [X]% probability (if: [condition])
- Base Case: [X]% probability (expected)
- Upside: [X]% probability (if: [condition])

---

## Forecast Confidence Assessment

**Confidence Rating:** [High / Medium / Low]

**High Confidence Criteria (all met):**
- Data quality score >98%
- Pipeline freshness <7 days old
- Forecast variance vs. actual <±5% (2-month average)
- <5% of forecast in deals with cycle time >baseline +100%
- All stages represented with historical closure data

**Medium Confidence Criteria (2–3 gaps):**
- Data quality 95–98%
- Pipeline freshness 7–14 days
- Forecast variance ±5–10%
- 5–10% of forecast in high-risk deals
- One stage with limited historical data

**Low Confidence Criteria (4+ gaps):**
- Data quality <95%
- Pipeline freshness >14 days
- Forecast variance >±10%
- >10% of forecast in high-risk deals
- Multiple stages with limited data or new reps

**Confidence Justification:**
[Explain which confidence criteria are met or not met; note any caveats or remediation needed before next forecast]

---

## Monthly Review Gate

**Forecast Published?** [Yes / No]

If No, reasons for hold:
- [Reason 1]
- [Reason 2]

**VP Sales Approval?** [Approved / Pending / Revision Requested]

**Notes:**
[Any caveats, assumptions, or follow-up actions]

---

## Next Forecast Cycle

**Scheduled:** [Date, typically 4 weeks out]  
**Key Focus Areas:** [Based on variance analysis and confidence gaps]  
**Data Cleanup Needed:** [List if applicable]  
**Methodology Adjustment:** [If variance >±10%, note adjustment for next run]

---
