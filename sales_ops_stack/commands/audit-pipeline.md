---
description: Comprehensive pipeline health check. Analyzes stage distribution, conversion funnel, cycle time, stuck deals, data quality, and forecast accuracy. Outputs detailed audit report with bottleneck identification and recommendations.
---

# /audit-pipeline

## What This Does

Runs the pipeline-auditor skill to comprehensively assess pipeline health across all reps and segments. Analyzes pipeline composition, deal velocity, data quality, forecast accuracy, and identifies stuck deals and bottlenecks.

## Steps Claude Follows

1. Ask for: Pipeline export data source (CRM name, export date, or direct access)
2. Run pipeline-auditor skill — complete audit checklist (snapshot, stage distribution, funnel, cycle time, stuck deals, data quality, forecast accuracy, rep performance, segment analysis, risk summary)
3. Check for critical alerts: stuck deals >$100K, forecast variance >±10%, stage regression, data quality <95%
4. Compile findings into structured audit report
5. Save report to `audits/pipeline-audit-[YYYY-MM-DD].md`
6. Display summary with key findings and recommendations

## Summary Output Logic

**Status Indicators:**
- **Green (Healthy):** Pipeline >2x target, weighted pipeline >3x target, conversion rates at/above baseline, <5% stuck deals, forecast variance <±10%, data quality >98%
- **Yellow (Caution):** Pipeline at 1.5–2x target, conversion rates 5–10% below baseline, 5–10% stuck deals, forecast variance ±10–15%, data quality 95–98%
- **Red (Alert):** Pipeline <1.5x target, conversion rates >10% below baseline, >10% stuck deals, forecast variance >±15%, data quality <95%, or critical lost deals

## Output Format

### Pipeline Audit Report
```
# Pipeline Audit — [Date]

## Executive Summary
- Total Pipeline Value: $[X]M
- Weighted Pipeline: $[X]M
- Forecast Accuracy: [+/-X%]
- Status: [Green / Yellow / Red]

## Key Findings
1. [Finding 1 — metric, variance, impact]
2. [Finding 2 — metric, variance, impact]
3. [Finding 3 — metric, variance, impact]

## Bottlenecks
1. [Bottleneck 1 — stage, days, impact on forecast]
2. [Bottleneck 2 — rep or segment specific]

## Critical Alerts
- [Alert 1: e.g., "5 stuck deals >$50K, no activity 14+ days"]
- [Alert 2: e.g., "Data quality score 92% — critical missing fields"]

## Recommendations
1. [Action 1 — owner, deadline]
2. [Action 2 — owner, deadline]
3. [Action 3 — owner, deadline]
```

### Executive Summary Line
```
Pipeline: $[X]M | Weighted: $[X]M | Forecast Accuracy: [+/-X%] | Status: [Green/Yellow/Red] | Critical Alerts: [X]
```

---

## When to Run

- **Weekly:** Every Monday morning before sales team standup
- **Monthly:** Before monthly pipeline/forecast review
- **On-Demand:** After major lost deal, hiring change, or when velocity degrades

---

## Required Data

- Current pipeline export from CRM with: account name, deal value, stage, deal owner, close date, probability, last activity date
- Historical baseline for: conversion rates by stage, average cycle time by stage, rep productivity benchmarks
- Prior month forecast (for variance analysis)

---

## Typical Time to Run

- **Data gathering:** 5 minutes (CRM export)
- **Analysis:** 15–20 minutes (pipeline-auditor skill)
- **Report generation:** 5 minutes (compile findings and recommendations)
- **Total:** ~30 minutes

---

## Next Steps After Audit

### If Green (Healthy)
- Log findings to session log
- Continue weekly monitoring
- Next audit: 1 week

### If Yellow (Caution)
- Escalate findings to VP Sales
- Implement one or more recommendations
- Schedule rep-level deep-dive on bottleneck stages
- Next audit: 3–4 days to check progress

### If Red (Alert)
- Immediate escalation to VP Sales and CFO (if revenue risk)
- Implement emergency response: rep coaching on stuck deals, data cleanup, territory review
- Daily pipeline snapshots until status improves
- Next audit: Next business day to verify remediation

---

## Related Commands

- `/analyze-deal [deal-id]` — Deep dive on specific high-risk deal
- `/generate-forecast` — Build forecast based on audit findings
- `/plan-territory` — Optimize rep workload if imbalance identified in audit

---
