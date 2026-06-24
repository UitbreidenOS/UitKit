---
name: "slo-architect"
description: "SLO design: define SLIs, set reliability targets, calculate error budgets, design alerting policies, build runbooks — Google SRE methodology"
---

# SLO Architect Skill

## When to activate
- Defining Service Level Objectives (SLOs) for a service
- Calculating error budgets and setting burn rate alerts
- Moving from reactive "is it up?" monitoring to proactive SLO-based alerting
- Writing SLAs for customers based on internal SLOs
- Building a reliability culture from scratch

## When NOT to use
- Specific monitoring tool configuration (use tool docs for Prometheus/Datadog syntax)
- Incident response procedures — use the runbook skill
- Pure uptime monitoring — Uptime Robot is simpler for basic checks

## Instructions

### Define SLIs (Service Level Indicators)

```
Define SLIs for this service.

Service: [describe — API / web app / data pipeline / payment processor]
Users: [who depends on this service?]
What "working" means to users: [their experience when things are good]

Common SLI types:
1. Availability: % of time the service is reachable
   Measurement: successful requests / total requests
   
2. Latency: how fast responses come
   Measurement: % of requests completing under threshold (e.g. p99 < 200ms)
   
3. Error rate: % of requests that fail
   Measurement: error responses / total responses
   
4. Throughput: capacity to handle load
   Measurement: requests processed per second
   
5. Data freshness: how stale is the data?
   Measurement: % of queries returning data < X minutes old
   
6. Correctness: are results accurate?
   Measurement: % of outputs matching expected (requires synthetic probing)

For my service, define 2-4 SLIs with exact measurement formulas.
```

### Set SLO targets

```
Help me set appropriate SLO targets.

Service criticality: [critical / important / internal-only]
Current reliability baseline: [uptime / error rate over last 90 days]
Business impact of downtime: [describe — revenue loss / customer impact]
Team maturity: [no SRE / small SRE team / experienced SRE]

SLO target guidance:
- 99% (2 nines): ~7.3 hours downtime/month — OK for internal tools
- 99.5%: ~3.6 hours downtime/month — typical B2B SaaS
- 99.9% (3 nines): ~43 minutes downtime/month — standard for customer-facing
- 99.95%: ~21 minutes — high-reliability expectation
- 99.99% (4 nines): ~4.3 minutes — payments, healthcare, critical infrastructure

Rule: SLO should be achievable but meaningful. Never set 100% — it's unachievable and creates wrong incentives.

For my service: what SLO target is appropriate and why?
```

### Error budget calculation

```
Calculate error budget for these SLOs.

SLO 1: [metric] = [X]% over [28 days / calendar month / rolling]
SLO 2: [metric] = [X]%

Error budget = 1 - SLO target
For 28-day window:
- 99.9% SLO → 0.1% error budget = 40.3 minutes of downtime allowed
- 99.5% SLO → 0.5% error budget = 3.36 hours allowed

Current error budget consumption:
- How much budget have we used so far this period? [%]
- How many days remain in the period?
- Are we on track to stay within budget?

If over budget: what should we stop doing (new feature launches) until budget recovers?
If under budget: what risk can we take on (planned maintenance, experiments)?
```

### Alerting design (burn rate alerts)

```
Design burn rate alerts for this SLO.

SLO: [X]% availability over 28 days
Error budget: [calculated above]

Alerting strategy (Google SRE handbook):
1. Fast burn (critical): consuming budget 14x faster than normal
   → Fires in: 1 hour of sustained burn
   → Alert: page immediately, this will exhaust budget in ~2 days
   
2. Slow burn (warning): consuming budget 6x faster than normal  
   → Fires in: 6 hours of sustained burn
   → Alert: ticket, review at next standup, not a wake-up call
   
3. Budget at X%: absolute threshold alert
   → When 50% of budget is consumed in the first 14 days
   → Alert: "on track to exhaust budget, review velocity"

For my SLO, generate:
- Alert thresholds (actual numbers, not X)
- Alert names and severity levels
- On-call escalation policy
- Runbook reference for each alert type
```

### SLO dashboard design

```
Design an SLO dashboard for [service].

Key stakeholders viewing this:
- Engineering: need to see error budget and burn rate
- Product: need to see reliability trends, impact on users
- Leadership: need overall health, nothing too technical

Dashboard sections:
1. Current SLO status: green/yellow/red for each SLO
2. Error budget remaining: gauge chart, % remaining this period
3. Burn rate: 1-hour and 6-hour burn rate vs. target
4. Historical trend: 90-day SLO performance
5. Incident correlation: recent incidents and their budget impact

Tools: [Grafana / Datadog / Google Cloud Monitoring / New Relic / Honeycomb]
```

## Example

**User:** I have a REST API used by paying customers. No SLOs currently, just "is it up" alerting. Where do I start?

**Claude's SLO starter pack:**

**Step 1 — Define 3 SLIs:**
- Availability: `successful_requests / total_requests` (exclude 400s, count 500s + timeouts as failures)
- Latency: `p99_response_time < 500ms` as a ratio of all requests
- Error rate: `5xx_responses / total_responses`

**Step 2 — Set initial SLO targets (conservative):**
- Availability: 99.5% (3.6 hours budget/month)
- p99 latency: 99% of requests under 500ms
- Error rate: < 0.5%

**Step 3 — One alert to start:**
Burn rate alert: if availability drops below 99.5% for 1 hour straight → page the on-call engineer.

**Step 4 — Review in 90 days:**
Look at actual performance vs. SLO. If you never used error budget, the target may be too loose. If you're constantly over, the target needs adjustment or investment.

---
