# Budget Analyzer Skill

## When to activate
When analyzing historical budget vs. actual spend; identifying variances, trends, or revised forecast implications.

## When NOT to use
For predictive cash flow forecasting (use `cash-flow-forecaster`). For sensitivity modeling (use `financial-modeler`).

## Instructions
1. **Parse data** — Ingest budget and actual spend by category, month, or cost center.
2. **Calculate variances** — Identify absolute and percentage variances; flag >5% deviations.
3. **Trend analysis** — Chart spending patterns month-over-month; identify inflection points.
4. **Forecast impact** — Extrapolate variance drivers; estimate full-year impact if trend continues.
5. **Output** — Executive summary with supporting variance table, explanations, and forward outlook.

## Example
Budget: Q1 salaries $500K actual / $480K forecast (4% favorable).
Sales commissions: $150K actual / $120K forecast (25% unfavorable due to higher-than-expected deal velocity).
Output: [Variance report with trend analysis and revised full-year forecast]
