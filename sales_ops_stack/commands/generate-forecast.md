---
description: Build rolling 13-week revenue forecast using historical conversion rates, stage-weighted pipeline, and velocity analysis. Compares to prior forecast and actuals. Returns detailed forecast breakdown with risk adjustments and sensitivity analysis.
---

# /generate-forecast

## What This Does

Runs the forecast-builder skill to generate a detailed 13-week rolling revenue forecast. Uses historical conversion rates, current pipeline composition, stage weights, velocity trends, and risk adjustments to produce forecast with confidence assessment.

## Steps Claude Follows

1. Ask for: Pipeline data source, historical conversion rates by stage/segment, prior month forecast and actual revenue
2. Pull baseline metrics: historical conversion rates (12-month average), stage-weighted pipeline, deal velocity (past 12 weeks)
3. Run forecast-builder skill — complete forecast checklist (baseline conversion model, pipeline snapshot, velocity analysis, 13-week projection, risk adjustment, segment breakdown, variance analysis, sensitivity analysis, confidence assessment)
4. Apply risk adjustments: exclude or downweight high-risk deals (probability drift >20%, no activity >21 days, cycle time >baseline +100%)
5. Generate three scenarios: Downside (-10% conversion rates), Base Case (historical average), Upside (+10% conversion rates)
6. Compare to prior month forecast and actual; calculate variance and root cause
7. Save detailed forecast report to `forecasts/forecast-[YYYY-WW].md`
8. Display summary with confidence rating and variance explanation

## Summary Output Logic

**Forecast Status:**

- **✓ HIGH CONFIDENCE:** Data quality >98%, forecast variance <±5%, pipeline fresh (<7 days), <5% in high-risk deals
- **✓ MEDIUM CONFIDENCE:** Data quality 95–98%, forecast variance ±5–10%, pipeline 7–14 days old, 5–10% in high-risk deals
- **⚠ LOW CONFIDENCE:** Data quality <95%, forecast variance >±10%, pipeline >14 days old, >10% in high-risk deals

**Forecast Recommendation:**

- **Publish:** Confidence = High or Medium; variance within acceptable range
- **Hold for Review:** Low confidence; flag data quality or risk adjustment issues
- **Revise:** Variance >±15%; review methodology and assumptions

## Output Format

### Sales Forecast Report
```
# Sales Forecast — [Date] (13-Week Rolling)

## Executive Summary
- 13-Week Forecast: $[X]M
- Prior Month Forecast: $[X]M
- Variance: [+/-X%]
- Confidence: [High / Medium / Low]

## Key Inputs
- Current Pipeline: $[X]M (weighted: $[X]M)
- Baseline Win Rates: [Prospect X%, Qual X%, Design X%, Neg X%]
- 12-week Deal Velocity: [X] deals/week advancing

## 13-Week Breakdown
- Week 1–4: $[X]M ([X] deals closing)
- Week 5–8: $[X]M ([X] deals closing)
- Week 9–13: $[X]M ([X] deals closing)

## Segment Breakdown
- Enterprise: $[X]M
- Mid-Market: $[X]M
- SMB: $[X]M

## Risk Adjustments
- High-risk deals excluded/downweighted: $[X]M
- Risk-adjusted forecast: $[X]M

## Scenario Analysis
- Downside (-10% conversion): $[X]M
- Base Case: $[X]M
- Upside (+10% conversion): $[X]M

## Variance Analysis
- Actual last month vs. forecast: [+/-X%]
- Root cause: [Lost deals / Acceleration / New wins / Other]

## Confidence Rating: [High / Medium / Low]
```

### Executive Summary Line
```
Forecast: $[X]M | Variance from Prior: [+/-X%] | Confidence: [High/Med/Low] | Status: [Publish/Review/Revise]
```

---

## When to Run

**Scheduled:**
- Monthly: First Friday of each month (before monthly review meeting)
- Quarterly: Before board/executive review

**On-Demand:**
- When pipeline composition changes significantly (new major deal, lost deal >$100K)
- When forecast variance exceeds ±10% variance trigger
- After major hiring/turnover impacting rep productivity

---

## Required Data

- Current pipeline by stage and segment (deal count, total value, individual probabilities)
- Historical conversion rates by stage and segment (12-month average)
- Prior month forecast and actual revenue closed
- Deal velocity trends (past 12 weeks)
- Rep productivity benchmarks (deals per rep, average deal size)
- Known high-risk factors (stuck deals, probability drift, competitive threats)

---

## Typical Time to Run

- **Data gathering:** 10 minutes (pipeline export + metrics pull)
- **Analysis:** 20–25 minutes (forecast-builder skill)
- **Sensitivity analysis & variance review:** 10 minutes
- **Report generation:** 5 minutes
- **Total:** ~45–50 minutes

---

## Forecast Quality Checks

**Before publishing forecast, verify:**

- [ ] Data quality score >95% (all required fields captured)
- [ ] Pipeline freshness <14 days old
- [ ] Historical conversion rates updated with recent actuals
- [ ] Risk adjustments applied (high-risk deals identified and downweighted)
- [ ] Variance from prior month documented and explained
- [ ] Three scenarios modeled (Downside / Base / Upside)
- [ ] Confidence level justified by data quality and variance history

---

## Next Steps After Forecast

### If HIGH CONFIDENCE (Publish)
- Present forecast to sales leadership
- Use as basis for commission/incentive planning
- Lock down forecast for month
- Set weekly tracking to monitor actual vs. forecast
- Next action: Weekly pipeline check-ins to catch variance early

### If MEDIUM CONFIDENCE (Publish with Caveats)
- Present forecast with confidence caveats
- Highlight key assumptions and risks
- Plan for weekly forecast adjustments as data improves
- Identify data cleanup actions needed before next forecast
- Next action: Execute data quality improvements; re-run forecast if major discovery

### If LOW CONFIDENCE (Hold for Review)
- Do not publish; mark as "Internal Estimate Only"
- Identify root causes (data quality, risk concentration, methodology issues)
- Create action plan to improve confidence
- Schedule next forecast run in 3–5 business days (after data cleanup)
- Escalate to VP Sales any revenue risk from forecast uncertainty
- Next action: Fix data quality or adjust methodology; re-run forecast

---

## Forecast Variance Tracking

Log each forecast variance to improve model over time:

- **Month:** [Date]
- **Forecast:** $[X]M
- **Actual:** $[X]M
- **Variance:** [+/-X%]
- **Root Cause:** [Category: Lost deals / Acceleration / New wins / Pipeline miss / Activity miss]
- **Insight:** [What changed? How will this inform next forecast?]

**Rolling Accuracy (last 3 months):**
- Calculate average absolute variance
- If >±10%, review and adjust conversion rate assumptions or risk weighting
- If <±5%, model is well-calibrated; maintain approach

---

## Related Commands

- `/audit-pipeline` — For pipeline context and baseline metrics
- `/analyze-deal [deal-id]` — For deep dive on high-value deals in forecast
- `/plan-territory` — To optimize rep capacity if forecast gap identified

---

## Forecast Distribution

**Audience:**
- CEO/CFO: Executive summary line + top 3 risks
- VP Sales: Full forecast report with segment breakdown and confidence assessment
- Sales team: Weekly actual vs. forecast tracking (not full forecast)

---
