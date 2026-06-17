# Command: /analyze-budget

## Trigger
User runs `/analyze-budget` with optional [period] parameter.

## What it does
Analyzes historical budget vs. actual spend; identifies variances, trends, and revised forecast implications.

## Instructions
1. Prompt user for: data source (file/system), reporting period, cost categories/centers to analyze.
2. Parse budget and actual data; calculate variances (absolute and %).
3. Invoke `budget-analyzer` skill.
4. Flag any data quality issues; surface key findings.
5. Log to `session-log.md`: date, period, status, key finding, assumptions.

## Example
`/analyze-budget Q2 2026` → Analyzes budget vs. actual for Q2; returns variance summary, trend chart, and revised full-year forecast.

## Output format
Executive summary (key variances, trends), supporting table (variance by category), and forward outlook.
