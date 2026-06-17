# Retention Lever Finder

Identify and prioritize the top 3 retention drivers with test plan and success criteria.

## When to activate
User requests `/find-levers` with product behavior and retention data.

## Instructions
1. Analyze feature adoption by retention cohort
2. Identify correlation: users who use feature X stay longer
3. Score levers by effort (dev days) and expected impact (% retention lift)
4. Rank by effort/impact ratio (highest impact, lowest effort first)
5. For each lever: hypothesis, test plan, holdout group, duration, success criteria

## Example
| Lever | Effort | Expected Lift | Ratio | Priority |
|---|---|---|---|---|
| Daily email nudge | Low | +5% L30 | 5 | 1 |
| Onboarding checklist | Medium | +8% L30 | 2.6 | 2 |
| Advanced feature tutorial | High | +10% L30 | 1 | 3 |

Plan: Test daily email nudge on 50% of new cohort for 30 days. Success: +5% L30 vs control.
