# Error Budget Enforcement

SRE error budget workflow — tracks budget consumption against SLO windows and enforces feature freeze and post-mortem requirements when thresholds are crossed.

---

## When to use

- Teams with defined SLOs who need automated enforcement beyond manual monitoring
- Services where deployments continue unchecked even when reliability is degraded
- Post-incident reviews where "we didn't know the budget was exhausted" is a recurring theme
- Platforms deploying multiple times per day where manual budget checks are impractical

---

## Phases / Steps

### Error Budget Formula

```
error_budget_remaining = (1 - slo_target) × window_seconds - observed_error_seconds
burn_rate = current_error_rate / error_rate_that_exhausts_budget_in_window
```

For a 99.9% SLO over a 30-day window:
- Allowed error budget = 0.1% × 2,592,000s = **2,592 seconds** (~43 minutes)
- If current error rate is 1%: burn rate = 1% / 0.1% = **10×** (will exhaust budget in 3 days, not 30)

**Burn rate interpretation:**

| Burn rate | Exhaustion time (30d budget) | Urgency |
|-----------|------------------------------|---------|
| 1× | 30 days | Normal |
| 2× | 15 days | Watch |
| 6× | 5 days | Alert |
| 14.4× | ~2 days | Page |
| 36× | 20 hours | Immediate |

---

### Multi-Window Burn Rate Alerts

Single-window burn rates produce false positives (short spikes) or false negatives (slow leaks). Use two-window confirmation:

**Fast burn — page immediately:**
```
burn_rate(1h) > 14.4 AND burn_rate(6h) > 6
```
Meaning: burning >2% of monthly budget in 1 hour, confirmed over 6 hours. This is a production incident.

**Slow burn — create ticket:**
```
burn_rate(72h) > 3 AND burn_rate(24h) > 3
```
Meaning: burning >10% of monthly budget in 3 days, confirmed over 1 day. Needs investigation before next deploy.

**Rationale for two windows:** the short window catches fast spikes; the long window filters transient noise. Both must be true to trigger — eliminating the majority of false alerts from brief anomalies.

---

### PromQL Examples

**Remaining error budget (ratio, 30d window):**
```promql
(
  1 - (
    sum(increase(http_requests_total{status=~"5.."}[30d]))
    /
    sum(increase(http_requests_total[30d]))
  )
) / (1 - 0.999)
```
Returns 1.0 when full budget remains, 0.0 when exhausted, negative when over.

**Burn rate over a window:**
```promql
# 1h burn rate
(
  sum(rate(http_requests_total{status=~"5.."}[1h]))
  /
  sum(rate(http_requests_total[1h]))
) / (1 - 0.999)

# Replace [1h] with [6h], [24h], [72h] for other windows
```

**Fast burn alert rule:**
```yaml
- alert: ErrorBudgetFastBurn
  expr: |
    (
      sum(rate(http_requests_total{status=~"5.."}[1h]))
      / sum(rate(http_requests_total[1h]))
    ) / (1 - 0.999) > 14.4
    and
    (
      sum(rate(http_requests_total{status=~"5.."}[6h]))
      / sum(rate(http_requests_total[6h]))
    ) / (1 - 0.999) > 6
  for: 2m
  labels:
    severity: page
  annotations:
    summary: "Fast error budget burn — {{ $value }}× burn rate"
```

**Slow burn alert rule:**
```yaml
- alert: ErrorBudgetSlowBurn
  expr: |
    (
      sum(rate(http_requests_total{status=~"5.."}[24h]))
      / sum(rate(http_requests_total[24h]))
    ) / (1 - 0.999) > 3
    and
    (
      sum(rate(http_requests_total{status=~"5.."}[72h]))
      / sum(rate(http_requests_total[72h]))
    ) / (1 - 0.999) > 3
  for: 15m
  labels:
    severity: ticket
  annotations:
    summary: "Slow error budget burn — {{ $value }}× burn rate"
```

---

### Budget Policy Enforcement

| Budget consumed | Policy |
|-----------------|--------|
| < 50% | No restrictions |
| 50–100% | Freeze non-critical merges; require SRE sign-off on deploys |
| > 100% | Hard freeze on all feature work; post-mortem required before unfreeze |

**Freeze definition:**
- Non-critical merges: any PR not tagged `severity:critical` or `type:hotfix`
- Hard freeze: no merges to production branch regardless of tag — only reverts allowed
- Unfreeze conditions: post-mortem published, corrective actions tracked, budget restored above 20%

---

### Claude Code Workflow

A weekly cron agent reads Prometheus metrics, calculates burn rates, posts a budget report to Slack, and opens a freeze ticket when thresholds are crossed.

**Hook entry in `.claude/settings.json`:**
```json
{
  "hooks": {
    "schedule": [
      {
        "cron": "0 9 * * MON",
        "command": "claude -p 'Run the error-budget workflow: fetch metrics, calculate burn rates, post Slack report, create freeze ticket if >50% consumed.'",
        "description": "Weekly error budget report"
      }
    ]
  }
}
```

**Agent task breakdown:**

1. **Fetch metrics** — query Prometheus for 1h, 6h, 24h, 72h, 30d error rates
2. **Calculate burn rates** — apply formula for each window
3. **Determine policy state** — compare consumed% against thresholds
4. **Post Slack report** — format budget summary with burn rate table and policy state
5. **Create freeze ticket** — if >50% consumed, open a Linear/GitHub issue with budget breakdown and freeze instructions
6. **Log to file** — append result to `.claude/error-budget-log.jsonl` for trend tracking

**Slack report format:**
```
[Error Budget Report — week of 2026-05-23]
Service: api-gateway  SLO: 99.9%  Window: 30d

Budget consumed: 67% ⚠️  FREEZE ACTIVE
Remaining: 855 seconds

Burn rates:
  1h:  2.1×   6h:  1.8×
  24h: 3.4×   72h: 3.1×

Policy: Non-critical merges FROZEN. SRE sign-off required.
Ticket: LIN-2847
```

---

## Example

**Scenario:** API gateway degrades after a botched config deploy on day 8 of a 30-day window.

**Timeline:**

| Time | Event | Budget consumed |
|------|-------|-----------------|
| Day 1–7 | Normal operation, 0.05% error rate | 12% |
| Day 8, 14:00 | Config deploy raises error rate to 2% | — |
| Day 8, 15:00 | 1h burn rate = 20×; 6h burn rate = 8× | — |
| Day 8, 15:02 | FastBurn alert fires → page on-call | — |
| Day 8, 17:30 | Config rolled back, error rate returns to 0.05% | 71% consumed |
| Day 8, 18:00 | Claude agent reads metrics, posts Slack report | — |
| Day 8, 18:00 | Budget >50% → freeze ticket opened (LIN-2847) | — |
| Day 9 | SRE reviews. Slow burn clears. Freeze lifted after sign-off | — |
| Day 9 | Post-mortem scheduled (not required — budget not >100%) | — |

**Without this workflow:** engineers would continue merging feature work not knowing 71% of the month's reliability budget was consumed in one afternoon.

---
