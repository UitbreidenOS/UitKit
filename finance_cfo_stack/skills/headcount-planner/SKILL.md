# Headcount Planner Skill

## When to activate
When forecasting headcount and payroll impact; modeling hiring plans, attrition, and cost implications.

## When NOT to use
For general cost optimization (use `cost-optimizer`). For overall financial modeling (use `financial-modeler`).

## Instructions
1. **Establish baseline** — Current headcount by function (eng, sales, ops, g&a), salary bands, benefits cost.
2. **Hiring plan** — Planned hires by function, month, and salary band; ramp timeline (e.g., 50% productive first month).
3. **Attrition model** — Historical turnover rate by function; assumed turnover for projection period.
4. **Payroll impact** — Salary + benefits + taxes + equity impact; gross-up factor (typically 1.25–1.4x base salary).
5. **Scenario modeling** — Base (on-plan hiring), accelerated, or conservative (slower hiring / higher attrition).
6. **Output** — Headcount forecast table, payroll projection chart, and FTE productivity trend.

## Example
Current: 45 FTEs, $2.4M annual payroll (gross-up 1.3x). Planned hires: 15 in next 12 months (avg 6/mo ramp).
Attrition: 8% annual (1 FTE/quarter lost). Year-end headcount: 52 FTE. Payroll: $3.1M (29% increase).
Output: [Headcount plan with payroll impact and productivity analysis]
