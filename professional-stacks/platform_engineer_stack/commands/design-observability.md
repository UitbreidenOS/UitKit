# /design-observability

## When to activate

Use this command when designing a monitoring and observability system from scratch or auditing existing monitoring gaps. Covers metrics, dashboards, alerts, SLOs, logging, and distributed tracing.

## When NOT to use

For operational troubleshooting (use runbooks). For implementing specific tools (Prometheus, Grafana, Datadog), use tool-specific documentation.

## Instructions

When you invoke this command, follow this workflow:

### 1. Understand Current State (5 minutes)

Ask the user:
- **Current tools:** Do they have monitoring, logging, tracing?
- **What's measured:** Uptime, latency, error rate, or nothing?
- **SLOs defined:** Do they have explicit reliability targets?
- **On-call support:** Who gets paged when things break?
- **Incident response:** Do they have runbooks? Procedures?
- **Tool preference:** Open source (Prometheus, Grafana) or managed (Datadog, New Relic)?

### 2. Define SLOs (15 minutes)

Guide them through:

**Availability SLO:**
- Target: 99.9%, 99.95%, or 99.99%?
- Calculate error budget (minutes/month allowed to be down)
- Define what counts as "down" (5xx errors, timeouts, etc.)

**Latency SLO:**
- Target p99 latency (e.g., < 500ms)
- Definition: Does include database query time? Network latency?

**Error Rate SLO:**
- Target: < 1% errors
- Exclude: Known failures (invalid input), maintenance windows

### 3. Design Metrics Collection (20 minutes)

Identify key metrics:

**Application Metrics:**
- Request count, latency, error rate by endpoint
- Database query latency, pool utilization
- Cache hit rate, eviction rate
- Message queue depth, processing latency

**Infrastructure Metrics:**
- CPU, memory, disk usage per pod/node
- Network I/O, bandwidth utilization
- Pod restart rate, crash loop back-offs

**Business Metrics:**
- Revenue, conversion rate, active users
- API usage by customer
- Feature adoption

### 4. Design Dashboards (15 minutes)

Create dashboards for:

**Service Health (real-time):**
- Error rate, latency (p50, p99)
- Request volume, success rate
- Infrastructure status (CPU, memory, disk)

**Error Debugging:**
- Error rate by type/endpoint
- Error traces with stack traces
- Recently erroring requests

**Capacity Planning:**
- Resource usage trend
- Growth rate (requests/sec, data)
- Forecasted capacity exhaustion

### 5. Configure Alerting (15 minutes)

Define alerts for:

**Critical (page on-call):**
- Error rate > 5% for > 5 minutes
- Service completely unreachable
- Database connection pool exhausted

**Warning (Slack only):**
- Error rate > 1% for > 10 minutes
- Latency > 1 second for > 5 minutes
- Error budget < 20% remaining

**Informational:**
- New deployment detected
- Unusual traffic pattern
- Database backup complete

### 6. Configure Logging & Tracing (15 minutes)

Design for:

**Structured Logging:**
- JSON format with timestamp, level, message, context
- Correlation ID to trace requests across services
- Request ID, user ID, important business fields

**Log Aggregation:**
- Central logging system (Loki, Elasticsearch, Splunk)
- Queryable (can find logs by correlation ID, user, endpoint)
- Retention: 30 days for most logs, longer for compliance

**Distributed Tracing:**
- Track requests across services
- Identify bottlenecks (which service is slow?)
- Understand failure chains (service A calls B, B calls C, C failed)

### 7. Document Observability Architecture

Provide:
- Metrics collection architecture (where metrics come from, where stored)
- Dashboard descriptions (what each shows, why it matters)
- Alert thresholds and escalation policy
- Logging strategy and retention policy
- Links to dashboards and observability tools
- Runbooks for common alerts

## Example Invocation

**User:** "Building user onboarding service. 1000 req/sec average, 99.9% uptime required. What should I monitor?"

**You should:**

1. Define SLO: 99.9% = 43.2 minutes error budget/month
2. Identify SLI: % of requests returning 2xx-3xx status
3. Key metrics:
   - Request count, latency (p50, p95, p99), error rate
   - Database query latency, connection pool utilization
   - Auth service latency and error rate
   - Email sending latency and delivery rate

4. Design dashboards:
   - Service Health: real-time error rate, latency, requests/sec
   - Errors: by type, by endpoint, with traces
   - Dependencies: auth latency, email latency, database latency

5. Configure alerts:
   - Critical: error rate > 5% for 5 min OR service unreachable
   - Warning: error rate > 1% for 10 min OR latency p99 > 500ms
   - Error budget at risk: < 20% remaining

6. Logging: JSON format, correlation ID for tracing
7. Tracing: Jaeger for cross-service request tracing

## Success Criteria

A well-designed observability system:

1. **SLOs defined** — Clear reliability targets, error budget known
2. **Metrics tell the story** — Can understand service health at a glance
3. **Dashboards useful** — Operators actually use them, updated regularly
4. **Alerts are actionable** — When alert fires, there's a runbook
5. **Logging is queryable** — Can find specific requests by ID
6. **Tracing shows dependencies** — Can see which service is slow
7. **Low noise** — Alerts aren't firing constantly (no alert fatigue)

---
