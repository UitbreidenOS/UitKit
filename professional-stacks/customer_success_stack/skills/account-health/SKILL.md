# Skill: Account Health

## When to activate

Run health scoring on active accounts; triggered by hourly health audit or manual request.

## When NOT to use

Do not use for prospects or churned accounts (use separate churn module).

## Instructions

1. Aggregate engagement metrics (logins, feature usage, support tickets)
2. Weight by contract value and tenure
3. Score 0–100, flag <30 as at-risk
4. Log score and trend to session-log

## Example

```
/cs-health-check --account=acme-corp
→ Health: 72 (↑ +5 from last week)
```
