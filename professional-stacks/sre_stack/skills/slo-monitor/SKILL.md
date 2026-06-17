# SLO Monitor

## When to activate
Scheduled check or escalated alert about service performance.

## When NOT to use
For one-off metric queries without SLO context.

## Instructions
1. Fetch current error budget for service
2. Calculate burn rate over last window
3. Project depletion date
4. Identify SLI contributors to error
5. Alert on trajectory if at risk
6. Update SLO dashboard

## Example
Service X: 99.95% uptime SLO, current error rate 0.1%, budget consumed 45% this month. Burn rate normal.
