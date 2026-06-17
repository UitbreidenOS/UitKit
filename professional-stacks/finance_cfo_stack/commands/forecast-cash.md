# Command: /forecast-cash

## Trigger
User runs `/forecast-cash` with optional [periods] parameter (e.g., 12m, 24m).

## What it does
Builds 12–24 month cash flow projection; models base, upside, and downside scenarios with sensitivity analysis.

## Instructions
1. Prompt user for: starting cash, revenue model, operating expenses, capex plans.
2. Build base case from historical patterns and forward assumptions.
3. Create upside (+15–20% revenue) and downside (-15–20% revenue) scenarios.
4. Run sensitivity on revenue, costs, AR days, AP days.
5. Invoke `cash-flow-forecaster` skill.
6. Flag liquidity risks (cash drops below minimum threshold).
7. Log to `session-log.md`: period, preparer, key finding, assumptions, next steps.

## Example
`/forecast-cash 12m` → 12-month cash flow projection with 3 scenarios; highlights any liquidity risk; shows impact of ±10% revenue change.

## Output format
Waterfall chart (cash in/out), scenario table (base/upside/downside), sensitivity heatmap, and liquidity runway.
