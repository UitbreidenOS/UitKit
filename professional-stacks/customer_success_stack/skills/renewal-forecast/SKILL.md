# Skill: Renewal Forecast

## When to activate

Quarterly or on-demand renewal pipeline reviews; flag accounts within 90-day window.

## When NOT to use

Do not use for multi-year contracts or committed accounts (use renewal metadata directly).

## Instructions

1. Query renewal dates by cohort
2. Cross-reference with health score
3. Predict renewal probability based on engagement
4. Generate action list (low-risk, medium, high-risk)

## Example

```
/renewal-forecast --cohort=2024-q3 --window=90d
→ 12 renewals in window; 8 green, 3 yellow, 1 red
```
