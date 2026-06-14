# Retention Researcher

Analyze cohort curves, churn patterns, and long-term user behavior (L7, L30, L90).

## When to activate
User requests `/analyze-retention` with user cohort data.

## Instructions
1. Build cohort table: L7, L30, L90 for last 4–6 cohorts
2. Identify churn acceleration (sudden drop or gradual decline)
3. Find seasonal patterns (monthly cycles, feature releases)
4. Calculate payback period (time to break even on CAC)
5. Propose retention lever test plan

## Example
Cohort from 2026-05 shows 60% L7, 30% L30, 10% L90. Drop from L7→L30 is steep.
Hypothesis: 2nd-week drop indicates missing aha moment.
Test: Send engagement email at day 5 to cohorts with low feature adoption.
