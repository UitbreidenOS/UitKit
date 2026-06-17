---
name: kpi-dashboard-builder
description: Design operational KPI dashboards with metric definitions, targets, data sources, and visualization recommendations
allowed-tools: [Read, Write, Grep]
effort: medium
---

## When to activate

- Designing new operational dashboards
- Defining KPIs for teams or departments
- Setting up automated reporting frameworks
- Auditing existing metrics for relevance and accuracy
- Creating executive operations reports

## When NOT to use

- For financial accounting reports
- For marketing campaign analytics
- For product analytics (use product tools)

## Instructions

1. **Identify stakeholders.** Who consumes this dashboard? Exec, manager, or individual contributor?
2. **Define KPIs.** 5-8 max per dashboard. Each needs: name, definition, formula, data source, owner, update frequency.
3. **Set targets and thresholds.** Green/Yellow/Red zones with clear numerical boundaries.
4. **Choose visualization.** Time-series for trends, gauges for targets, tables for details, heatmaps for comparisons.
5. **Design layout.** Executive summary at top, drill-down details below. Mobile-friendly if needed.
6. **Automate data pipeline.** Identify data sources, ETL requirements, refresh schedule.
7. **Define review cadence.** Weekly team review, monthly leadership review, quarterly target reassessment.

## Example

```
Operations Dashboard — Weekly Review

KPI: Order Fulfillment Rate
Definition: % of orders shipped within SLA (same-day or next-day)
Formula: (orders shipped on time / total orders) × 100
Target: ≥95% (Green), 90-94% (Yellow), <90% (Red)
Current: 96.2% 🟢
Data Source: ERP → nightly ETL → dashboard
Owner: Fulfillment Manager

KPI: Operational Cost per Unit
Definition: Total ops cost / units processed
Target: ≤$4.50 (Green), $4.50-$5.00 (Yellow), >$5.00 (Red)
Current: $4.12 🟢
```
