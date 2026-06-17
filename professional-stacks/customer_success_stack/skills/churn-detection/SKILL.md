# Skill: Churn Detection

## When to activate

Continuous monitoring; alert on engagement drop >30% week-over-week.

## When NOT to use

Do not trigger on planned feature sunsetting or scheduled maintenance.

## Instructions

1. Monitor login frequency, feature use, API calls
2. Detect anomalies vs. baseline
3. Trigger alert if drop exceeds threshold
4. Notify account owner with action recommendation

## Example

```
/churn-alert --threshold=30
→ acme-corp: 45% drop in API calls
→ Escalate to account team
```
