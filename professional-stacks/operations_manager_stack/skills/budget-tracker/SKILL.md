---
name: budget-tracker
description: Monitor operational budgets, forecast spend, track variances, and flag potential overruns
allowed-tools: [Read, Write, Bash, Grep]
effort: medium
---

## When to activate

- Tracking monthly operational spend against budget
- Forecasting quarterly and annual budget needs
- Identifying budget variances and root causes
- Preparing budget reports for leadership
- Evaluating cost-saving opportunities

## When NOT to use

- For financial accounting or bookkeeping
- For capital expenditure planning (use finance team)
- For individual expense approval

## Instructions

1. **Define budget categories.** Personnel, software/tools, facilities, travel, training, contractors, miscellaneous.
2. **Set monthly allocations.** Budget per category based on annual plan divided by 12 with seasonal adjustments.
3. **Track actual spend.** Pull data from accounting system weekly; categorize and reconcile.
4. **Calculate variance.** (Actual - Budget) / Budget × 100. Flag anything >10% over or >20% under.
5. **Forecast remaining.** Based on run rate, project year-end spend. Flag if forecast exceeds budget by >5%.
6. **Identify savings.** Unused licenses, redundant tools, renegotiation opportunities, consolidation.
7. **Generate monthly report.** Executive summary: total spend vs. budget, top variances with explanations, forecast.

## Example

```
Operations Budget — June 2026

Category        | Budget    | Actual    | Variance | Status
Personnel       | $125,000  | $123,500  | -1.2%    | 🟢
Software/Tools  | $18,000   | $21,200   | +17.8%   | 🔴 Over
Facilities      | $12,000   | $11,800   | -1.7%    | 🟢
Contractors     | $25,000   | $24,000   | -4.0%    | 🟢
Training        | $5,000    | $2,100    | -58.0%   | 🟡 Under-utilized

Total: $185,000 budget | $182,600 actual | -1.3% variance

Variance Notes:
- Software over budget due to unplanned Datadog tier upgrade (approved by CTO)
- Training under-utilized — recommend team training session in July
```
