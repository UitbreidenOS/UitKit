---
description: Forecasts hiring needs for 6–12 months. Builds team structure, timelines, and cost models. Outputs hiring-plan-{quarter}.md.
---

# /hiring-plan

## What This Does

Builds a comprehensive 6–12 month hiring forecast based on your current headcount, business growth targets, and attrition assumptions. Generates budget impact, team structure recommendations, timeline for posting roles, and risk assessment.

## Steps Claude Follows

1. **Ask for:** Current headcount (by team/level), growth targets (revenue/headcount %), attrition assumption (default 12% annual)
2. **Run hiring-plan-builder skill** — Full planning checklist
3. **Model hiring pipeline** — Calculate time-to-hire for each role; work backwards to posting dates
4. **Build cost model** — Salary, benefits, equity, recruiting costs; annualized payroll impact
5. **Assess risks** — Identify hard-to-hire roles, compensation challenges, span-of-control gaps
6. **Generate team structure diagrams** — Current org chart vs. planned
7. **Output hiring-plan-{quarter}.md** with all data, assumptions, and next steps
8. **Summary recommendation** — "Ready to post immediately: Staff Engineer, Sales Manager. Plan 90-day search for both. Total Year 1 payroll impact: $2.3M."

## Output Format

### Hiring Plan Document
```
# Hiring Plan — [Quarter] [Year]

## Business Context
[Revenue/growth targets; strategic initiatives]

## Current Headcount Snapshot
[Team breakdown by level]

## Hiring Plan by Quarter
[Role, priority, timeline, reason for hire]

## Cost Modeling
[Payroll impact; recruiting costs; comparison to budget]

## Timeline & Posting Calendar
[When to post each role to hit target start date]

## Risk Assessment
[Hard-to-hire roles; compensation gaps; span of control issues]

## Key Metrics & KPIs
[How to track: hiring velocity, quality of hire, cost-per-hire]
```

### Summary Recommendation
```
Forecast: 5 net new hires over next 6 months
Payroll impact: $1.2M (Year 1 fully loaded)
Critical path: Post Staff Engineer immediately (90-day search)
Budget green light: Ready to move? [YES/NO with confidence]
```

## Next Action Logic

- **All roles ready:** "Post all roles this week. Start with Staff Engineer (longest timeline)."
- **Budget uncertain:** "Pending finance approval on hiring freeze. Recommend getting sign-off before posting."
- **Compensation concerns:** "Recommend compensation benchmarking before posting. Market for Staff Engineer may require 10% premium."
- **High-risk cohort:** "Recent Q1 2025 cohort had retention issues. Fix onboarding before scaling hiring."

## Inputs You Provide

- Current total headcount and breakdown (by team, level)
- Headcount budget allocation (if exists)
- Revenue/growth targets (if known)
- Strategic hiring priorities (e.g., "scale engineering," "build sales org")
- Compensation budget constraints (if any)
- Known departures or retention risks

## Outputs

- Hiring forecast (by quarter)
- Fully-loaded cost model
- Posting timeline (when to post to hit start dates)
- Risk assessment and mitigation
- Team structure (current vs. planned)
- Success metrics (how to track execution)

## Example

```
Input: "We have 120 people today. Want to hit 180 by end of next year.
        Engineering is 60 now, need to be 90. Sales is 20, want 30.
        Budget: $3M for headcount additions."

Output:
Hiring Plan — 2026–2027

Total plan: 60 new hires (50% growth)
- 30 in Engineering (all ICs at this stage; 2 managers within 18 months)
- 10 in Sales (mix of SDRs and AEs)
- 8 in Product
- 7 in Operations
- 5 in Finance/Marketing/HR

Cost impact: $2.8M (within budget)
Timeline: Start with engineering (90-day searches); sales concurrent
Risk: Hard-to-hire Staff-level roles; budget for 20% recruiting premium
Next action: Post Staff Engineer, Senior Product Manager, Sales Manager this month
```
