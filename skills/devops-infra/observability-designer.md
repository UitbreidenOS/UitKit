---
name: observability-designer
description: "Observability strategy: design the three pillars (logs, metrics, traces), instrument services, choose tooling, define alerting philosophy, and move from reactive to proactive monitoring"
---

# Observability Designer Skill

## When to activate
- Designing an observability strategy from scratch for a service or platform
- Moving from log-only monitoring to full three-pillar observability
- Deciding between observability tools (Datadog, Grafana, Honeycomb, New Relic)
- Instrumenting a service with OpenTelemetry
- Setting up structured logging at scale
- Defining what to alert on (and what not to)

## When NOT to use
- SLO design — use the slo-architect skill first, then come here to implement
- Runbook writing — use the runbook-generator skill
- Security monitoring (SIEM) — different tooling and threat model
- Business analytics / product metrics — use the analytics-tracking skill

## Instructions

### Three-pillar observability design

```
Design an observability strategy for [system/service].

System: [describe — microservices / monolith / serverless / data pipeline]
Current state: [no observability / logs only / basic metrics / partial]
Team: [solo / small SRE team / large platform team]
Budget: [$0 (open source) / $X/month managed service]
Primary pain: [unknown failures / slow debugging / alert fatigue / no visibility into dependencies]

Three pillars:

1. LOGS — What happened (events)
   Purpose: debugging, audit trail, root cause analysis
   Best for: "tell me exactly what occurred and when"
   
   Structured logging standard:
   Every log line = valid JSON with:
   - timestamp (ISO 8601)
   - level (DEBUG/INFO/WARN/ERROR)
   - service (name of the emitting service)
   - trace_id (link to trace for correlation)
   - message (human-readable)
   - [context fields]: user_id, request_id, duration_ms, error_code
   
   Log levels — when to use each:
   DEBUG: development only — verbose, never in production by default
   INFO: business events that always matter (order placed, user registered)
   WARN: unexpected but recoverable (retry #2, slow query > 500ms)
   ERROR: needs human attention (payment failed, 3rd-party API down)
   FATAL: process must stop (unrecoverable state)

2. METRICS — How much / how fast (aggregations)
   Purpose: alerting, dashboards, trending, capacity planning
   Best for: "show me the current state at a glance"
   
   Metric types:
   Counter: cumulative, always increasing (requests_total, errors_total)
   Gauge: current snapshot (active_connections, queue_depth, memory_bytes)
   Histogram: distribution over time (request_duration_seconds — gives p50/p95/p99)
   
   Key metrics for every service (USE method):
   Utilisation: CPU %, memory %, thread pool saturation
   Saturation: queue depth, pending requests, throttle rate
   Errors: error_rate, 5xx_count, timeout_rate
   
   Key metrics for request-serving services (RED method):
   Rate: requests_per_second
   Errors: error_rate (%)
   Duration: p50, p95, p99 latency

3. TRACES — Why it happened (causality)
   Purpose: end-to-end latency attribution, distributed dependency visibility
   Best for: "show me the exact path of this slow request across all services"
   
   Trace anatomy:
   - Trace = one end-to-end request (single trace_id)
   - Span = one unit of work (service, function, DB query) within the trace
   - Context propagation = passing trace_id through all services (headers)
   
   What to instrument:
   - Inbound HTTP requests (auto-instrument with OTEL SDK)
   - Outbound HTTP calls (auto-instrument)
   - Database queries (auto-instrument for most ORMs)
   - Message queue publish/consume (manual span)
   - External API calls (manual span with provider, endpoint, status)

Design the three-pillar strategy for my system with specific tool recommendations.
```

### Tooling selection

```
Choose observability tooling for [team/budget].

Scale: [X services / X requests per second / X GB logs per day]
Team: [X engineers]
Budget: $[X/month]
Cloud provider: [AWS / GCP / Azure / multi-cloud / on-prem]
Existing stack: [what you already use]

Tool comparison:

MANAGED (pay-per-use, least ops overhead):
Datadog: Best all-in-one. Logs + Metrics + Traces + APM + Dashboards + Alerts.
  Cost: $15-23/host/month + $0.10/GB logs ingested. Expensive at scale.
  Best for: < 100 hosts, teams without dedicated ops

Honeycomb: Best for traces and high-cardinality data. Query any field, not just pre-aggregated.
  Cost: $130/month starter. Pricing by events.
  Best for: distributed systems with complex debugging needs

New Relic: Full-stack observability, generous free tier (100GB/month free).
  Cost: $0 for < 100GB/month. $0.30/GB after.
  Best for: teams wanting full stack on a budget

Grafana Cloud: Open source stack (Loki + Prometheus + Tempo) as managed service.
  Cost: Free tier generous. Paid from $8/month.
  Best for: teams comfortable with Prometheus/Grafana, wanting managed ops

SELF-HOSTED (more ops, lower cost at scale):
Prometheus + Grafana: Metrics + dashboards. Industry standard, free.
  Add Loki (logs) + Tempo (traces) for full three-pillar stack.
  Cost: infrastructure only (~$50-200/month on a small cluster)
  Best for: > $5K/month observability budget, teams with ops capacity

OpenTelemetry: Vendor-neutral instrumentation standard. Collect once, export anywhere.
  Use with: any backend above. Future-proofs your instrumentation.
  Recommendation: always instrument with OTEL — swap backends without code changes.

Recommendation for my constraints: [tool stack + rationale + estimated monthly cost]
```

### Structured logging implementation

```
Implement structured logging for [service].

Language/framework: [Node.js/Express / Python/FastAPI / Go / Java/Spring]
Current logging: [console.log / print() / basic logger / none]
Destination: [CloudWatch / Datadog / Elasticsearch / stdout (for k8s)]

Node.js (using Pino — fastest structured logger):
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  ...(process.env.NODE_ENV === 'development' && {
    transport: { target: 'pino-pretty' }  // Human-readable in dev
  }),
});

// Request logger middleware (Express):
import { randomUUID } from 'crypto';
app.use((req, res, next) => {
  req.id = randomUUID();
  req.log = logger.child({ req_id: req.id, path: req.path, method: req.method });
  req.log.info('request_received');
  next();
});

// Logging patterns:
req.log.info({ user_id: user.id, action: 'payment_initiated', amount_cents: 4999 }, 'Payment started');
req.log.warn({ retry_attempt: 3, service: 'stripe' }, 'Stripe slow response, retrying');
req.log.error({ error: err.message, stack: err.stack, order_id: order.id }, 'Payment failed');

Python (using structlog):
import structlog
log = structlog.get_logger()

# Bind context for the request:
log = log.bind(request_id=request_id, user_id=user_id)
log.info("payment_initiated", amount=49.99, currency="USD")
log.error("payment_failed", error=str(e), stripe_error_code=e.code)

Go (using zerolog):
log := zerolog.New(os.Stdout).With().Timestamp().Str("service", "payment").Logger()
log.Info().Str("user_id", userID).Int("amount_cents", 4999).Msg("payment_initiated")
log.Error().Err(err).Str("order_id", orderID).Msg("payment_failed")

Generate implementation for my specific language and framework.
```

### Alerting philosophy

```
Design an alerting strategy for [system].

Current state: [no alerts / too many alerts / alert fatigue]
Team size: [X people on-call]
On-call rotation: [24/7 / business hours / single person]
Incident history: [common failure patterns]

Alerting philosophy (Google SRE):

ALERT ON SYMPTOMS, NOT CAUSES:
❌ Alert: "CPU > 80%"  — cause (might not affect users)
✅ Alert: "Error rate > 1%"  — symptom (users are affected)

❌ Alert: "Disk > 85%"  — cause (logs rotate, it self-heals)
✅ Alert: "Disk will fill in < 4 hours"  — predictive, actionable

ALERT TIERS:

Page (wake someone up — severity: critical/P1):
- User-visible outage or impairment
- SLO burn rate fast-burn threshold exceeded
- Error rate > X% for > 5 minutes
- Service completely unreachable
Rule: if you wouldn't wake someone up for it, don't page

Ticket (fix next business day — severity: warning/P2):
- SLO slow-burn threshold exceeded
- Degraded performance below threshold
- Dependency showing instability
Rule: ticket fires are resolved in 1-2 business days; not page-worthy

Informational (log, don't act — Slack/dashboard):
- Deployments, restarts, scaling events
- Approaching capacity (not yet at threshold)
Rule: no alert → no action required

Alert design principles:
- Every alert must have a runbook link
- Alert name = what's happening + who's affected
- Every alert must be actionable — if no action is possible, it shouldn't alert
- Alert on rate of change, not static thresholds
- No alert with < 5-minute window — everything < 5 min is noise

Anti-patterns to eliminate:
□ Alerts that fire multiple times before anyone looks at them
□ Alerts with no clear owner
□ Alerts that are always acknowledged without investigation
□ "Dashboard-only" metrics that don't have corresponding alerts

Design the alerting strategy for my system with specific threshold recommendations.
```

## Example

**User:** We have 8 microservices, only basic CloudWatch logs, and we get paged 3x a week on average. Most pages are for things that auto-resolved. How do we fix this?

**Claude's observability plan:**

Three pages/week with mostly auto-resolving issues = alert fatigue from cause-based alerting, not symptom-based. Fix the alerting philosophy first, then add the observability you're missing.

**Phase 1 (this week) — Fix alerting, no new tooling:**
Change every CloudWatch alarm from threshold-based (`CPU > 80%`) to symptom-based:
- Replace `CPU > 80%` with `5xx error rate > 0.5% for 10 minutes`
- Replace `Memory > 85%` with `p99 latency > 2x baseline for 5 minutes`
- For auto-resolving issues: increase window from 5 min → 15 min — most will stop paging

Result: typically reduces page volume by 50-70% immediately.

**Phase 2 (this month) — Add traces:**
Your 8 microservices need distributed tracing or you'll never find the slow one.
Cheapest path: instrument all 8 with OpenTelemetry auto-instrumentation (1-2 lines of code per service), export to AWS X-Ray (free for first 100K traces/month).
This gives you: the slow span, the slow service, the slow database query — without manual log correlation.

**Phase 3 (next quarter) — Structured logs:**
Replace `console.log("Payment failed: " + err)` with structured JSON across all services. Add `trace_id` to every log line. Now you can: CloudWatch Insights query → find the exact log lines for a specific trace.

**Tool recommendation for 8 services at startup scale:**
Grafana Cloud free tier covers you: Prometheus metrics + Loki logs + Tempo traces. Zero cost until you scale beyond their generous free limits. When you hit $500/month Grafana cost, re-evaluate.

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
