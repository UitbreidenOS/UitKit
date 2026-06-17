# Observability Framework

## When to activate

When designing logging and monitoring for agents, setting up metrics and tracing, implementing audit trails, or detecting anomalies in multi-agent systems.

## When NOT to use

For low-stakes systems without compliance requirements; for one-off scripts; for non-production code.

## Instructions

Observability is the ability to ask arbitrary questions about system behavior from the outside, without modifying code. For agentic systems, observability means:

1. **Structured logging** — Every agent decision logged with all context
2. **Metrics** — Quantitative measurements (latency, throughput, errors)
3. **Tracing** — Distributed tracing across multi-agent workflows
4. **Audit trails** — Immutable, timestamped record of all actions
5. **Anomaly detection** — Automated alerting on unusual patterns
6. **Dashboards** — Real-time visualization of system health

### Core Principles

- **Everything is logged.** No action without a log entry.
- **Logs are structured.** JSON format, not free-form text.
- **Logs are immutable.** Written once to append-only log; never modified.
- **Tracing spans workflows.** Follow a request through multiple agents with request ID.
- **Metrics are dimensioned.** Separate metrics by agent, operation, outcome (success/failure).
- **Alerts are actionable.** If triggered, there is a clear action to take.

### Template

```markdown
# Observability Framework: [System Name]

## Logging Strategy

### Log Levels

- **CRITICAL:** Hard constraint violated; escalation required; security incident
- **ERROR:** Agent failed; invalid output; timeout after retries
- **WARN:** Escalation triggered; retry in progress; anomaly detected
- **INFO:** Agent decision made; task completed; state transition
- **DEBUG:** Internal reasoning; intermediate outputs; performance details

### Structured Log Format

All logs are JSON. Fields are:

```json
{
  "timestamp": "ISO 8601",
  "level": "CRITICAL|ERROR|WARN|INFO|DEBUG",
  "trace_id": "request_id; unique per orchestration run",
  "span_id": "specific task within trace; incremental ID",
  "agent_name": "which agent produced this log",
  "agent_version": "version of agent definition",
  "model_version": "which Claude model was used",
  "event": "what happened (agent_started, decision_made, failure, escalation)",
  "status": "success|failure|timeout|validation_error|escalation",
  
  "input": { "sanitized request data" },
  "output": { "agent decision/result" },
  "decision": "the core decision (approve/reject/escalate)",
  "confidence": "confidence score 0-1",
  "reasoning": "brief reasoning (first 500 chars)",
  
  "latency_ms": "how long did this take",
  "tokens_input": "input tokens used",
  "tokens_output": "output tokens used",
  "cost_usd": "approximate cost",
  
  "constraints_checked": ["constraint_1", "constraint_2"],
  "constraint_violations": [],
  
  "retry_count": "how many retries if any",
  "backoff_ms": "backoff time used",
  
  "error_type": "timeout|validation|constraint_violation|null",
  "error_message": "human-readable error",
  "error_trace": "stack trace if applicable",
  
  "user_id": "who initiated this",
  "resource_id": "what was being acted on",
  
  "custom_fields": { "domain-specific fields" }
}
```

### Log Destinations

- **Local file:** `/var/log/agents/[agent_name].log` (JSON Lines format)
- **Centralized logging:** Send to DataDog, ELK, or Splunk
- **Audit log:** Immutable append-only log for compliance (separate from operational logs)

### Log Retention

- **Operational logs:** 30 days hot, 1 year cold storage
- **Audit logs:** 7 years (compliance requirement)

## Metrics

### Key Metrics (Required for all agents)

| Metric | Type | Dimensions | Target | Alert |
|---|---|---|---|---|
| `agent_decisions_total` | Counter | agent, decision | N/A | N/A |
| `agent_latency_ms` | Histogram | agent, decision | P95 < [target] | P95 > 2x target |
| `agent_success_rate` | Gauge | agent | > 95% | < 90% |
| `agent_escalation_rate` | Gauge | agent | target: 5-20% | > 30% |
| `agent_retry_rate` | Gauge | agent, failure_type | < 10% | > 20% |
| `agent_tokens_used_total` | Counter | agent | N/A | per-step usage |
| `constraint_violations` | Counter | agent, constraint | 0 | > 0 (immediate alert) |
| `output_validation_failures` | Counter | agent | 0 | > 0 (per retry) |

### Optional Metrics (Domain-specific)

- `agent_confidence_average` — Average confidence of decisions (by agent, decision type)
- `human_override_rate` — % of agent decisions overridden by humans
- `cost_per_decision` — Token cost per decision (aggregate, not per request for privacy)
- `orchestration_completion_time` — End-to-end latency for multi-agent workflows
- `cascading_failure_rate` — % of failures that trigger downstream failures

### Metric Collection

```
Every agent decision triggers:

counter(
  name="agent_decisions_total",
  agent=agent_name,
  decision=decision_made,
  outcome=success|failure
)

histogram(
  name="agent_latency_ms",
  agent=agent_name,
  value=latency
)

gauge(
  name="agent_confidence",
  agent=agent_name,
  value=confidence_score
)

counter(
  name="agent_tokens_used",
  agent=agent_name,
  type=input|output,
  value=token_count
)
```

## Tracing Strategy

### Trace Design

Every orchestration run has a `trace_id`. Each task within the run has a `span_id`.

```
trace_id: req-20260615-001
├─ span_id: 1 (Agent A started)
├─ span_id: 2 (Agent A decision made)
├─ span_id: 3 (Agent B started)
├─ span_id: 4 (Agent B decision made)
└─ span_id: 5 (Merge completed)
```

### Span Format

```json
{
  "trace_id": "req-20260615-001",
  "span_id": "span_3",
  "parent_span_id": "span_2",
  "operation": "agent_b_execution",
  "start_time": "2026-06-15T10:30:15Z",
  "end_time": "2026-06-15T10:30:45Z",
  "duration_ms": 30000,
  "status": "success|failure",
  "tags": {
    "agent.name": "Agent B",
    "input.size": 2048,
    "output.size": 512,
    "error": null
  }
}
```

### Tracing Tools

- **Jaeger** — Distributed tracing, visualization, latency analysis
- **Datadog APM** — Commercial, full-stack observability
- **Zipkin** — Open-source distributed tracing

## Audit Trail

An audit trail is an immutable, chronological record of all actions. Required for compliance.

### Audit Log Fields

Every audited action must include:

```json
{
  "timestamp": "ISO 8601, server-generated",
  "action_id": "unique identifier for this action",
  "actor": "who performed this (user_id or system)",
  "agent_name": "which agent made the decision",
  "action": "what was done (approve, reject, escalate)",
  "resource_type": "what was acted on (request, content, expense, etc.)",
  "resource_id": "which specific resource",
  "old_state": "state before action",
  "new_state": "state after action",
  "decision_reasoning": "why this decision was made",
  "approved_by": "if escalated, who approved",
  "result": "success|failure",
  "error": "null or error message"
}
```

### Audit Trail Requirements

- Append-only (no modifications after write)
- Tamper-evident (detect unauthorized changes)
- Accessible for compliance audits
- Searchable by resource_id, actor, timestamp
- Retention: 7 years minimum

### Audit Log Destinations

- **Primary:** Immutable append-only storage (S3, BigQuery, dedicated audit DB)
- **Secondary:** Searchable index (Elasticsearch, Datadog)
- **Export:** Regular backups to cold storage

## Anomaly Detection

### Detection Mechanisms

| Anomaly | Signal | Check Frequency | Alert Action |
|---|---|---|---|
| High failure rate | Error rate > 10% | Per minute | Page on-call |
| High latency | P95 > 2x baseline | Per minute | Investigate bottleneck |
| Constraint violation | Count > 0 | Per request | Immediate page |
| Cascading failure | Failure depth > 2 | Per task | Pause orchestration |
| Unusual escalation | Rate > 3x baseline | Per 5 minutes | Investigate model drift |
| High retry rate | > 20% of requests | Per 5 minutes | Check external services |
| Output validation failures | > 2 in a row | Per task | Investigate prompt/model |
| Resource exhaustion | Token usage > 90% | Per minute | Throttle new requests |
| Deadlock | No progress > T seconds | Real-time | Auto-abort; escalate |

### Anomaly Detection Implementation

```python
# Example: High failure rate detection
failure_count = metrics.counter("agent_failures_total", agent="Agent A").sum(window=60s)
total_count = metrics.counter("agent_decisions_total", agent="Agent A").sum(window=60s)
failure_rate = failure_count / total_count

if failure_rate > 0.10:
    alert("high_failure_rate", agent="Agent A", rate=failure_rate)
    pause_agent("Agent A")
    escalate_to_oncall()
```

## Dashboards

### Dashboard 1: Agent Health

- Success rate by agent (gauge)
- P95 latency by agent (line chart)
- Escalation rate by agent (gauge)
- Constraint violations by agent (counter)

Refresh: Every 30 seconds

### Dashboard 2: Multi-Agent Orchestration

- Orchestration completion rate (gauge)
- Task dependency graph with status (diagram)
- Latency distribution by task (histogram)
- Resource usage (token count, concurrency)

Refresh: Real-time

### Dashboard 3: Failure & Recovery

- Failure types breakdown (pie chart)
- Retry effectiveness (% recovered on N-th attempt)
- Circuit breaker status (red/green per agent)
- Time to recovery by failure type (histogram)

Refresh: Every 60 seconds

### Dashboard 4: Audit & Compliance

- Actions taken per day (line chart)
- Actions by decision type (stacked bar)
- Escalations per day (gauge)
- Top resources actioned (table)

Refresh: Daily

### Dashboard 5: Cost Tracking

- Tokens used per agent (stacked bar)
- Cost per decision (line chart)
- Cost breakdown by decision type (pie)
- Efficiency metric (decisions per $1)

Refresh: Hourly

## Implementation Checklist

- [ ] All agent decisions logged in structured format (JSON)
- [ ] Trace IDs connect requests through multi-agent workflows
- [ ] Key metrics collected for every agent
- [ ] Metrics have dimensions (agent, decision type, outcome)
- [ ] Anomaly detection configured with alert thresholds
- [ ] Audit trail immutable and compliant with retention policy
- [ ] Dashboards created and monitored
- [ ] Alerts tested (verify pages when triggered)
- [ ] Log destinations configured (local + central)
- [ ] Log retention policy documented
- [ ] Access controls on logs (who can query audit trail)
```

## Example

### Example: Content Moderation Observability

```markdown
# Observability Framework: ContentModerator

## Structured Logging

Every content moderation decision produces JSON:

```json
{
  "timestamp": "2026-06-15T10:30:15.123Z",
  "level": "INFO",
  "trace_id": "content_req_12345",
  "agent_name": "ContentModerator",
  "agent_version": "1.2.0",
  "event": "decision_made",
  "status": "success",
  
  "content_id": "c-98765",
  "user_id": "user-abc",
  "content_type": "post",
  
  "decision": "approve",
  "confidence": 0.95,
  "reasoning": "Policy-compliant; no violations detected",
  
  "policy_categories_checked": ["violence", "harassment", "hate_speech"],
  "constraint_violations": [],
  
  "latency_ms": 2345,
  "tokens_input": 1024,
  "tokens_output": 256,
  "cost_usd": 0.0032,
  
  "escalation_required": false
}
```

## Key Metrics

| Metric | Target | Alert |
|---|---|---|
| `moderation_decisions_total` | — | — |
| `moderation_latency_p95_ms` | < 5000 | > 10000 |
| `moderation_success_rate` | > 98% | < 95% |
| `moderation_escalation_rate` | 5-15% | > 30% |
| `moderation_retry_rate` | < 5% | > 10% |
| `moderation_constraint_violations` | 0 | > 0 |

## Dashboards

**Health Dashboard:**
- Moderation success rate (real-time)
- Latency distribution (P50, P95, P99)
- Escalation volume (per hour)
- Constraint violations (counter)

**Audit Dashboard:**
- Decisions by type (approved, rejected, escalated)
- Decisions by content type (post, comment, image)
- User activity (high-volume posters, common escalation reasons)
- Timestamp of all escalations

## Alerts

- Escalation rate > 30% → investigate model drift
- Constraint violation > 0 → immediate page
- Latency P95 > 10s → investigate bottleneck
- Validation failure rate > 2% → retrain or adjust prompt
```

## Success Criteria

A complete observability framework:

- [ ] All agent decisions logged with full context
- [ ] Logs are structured (JSON, machine-parseable)
- [ ] Trace IDs connect multi-agent workflows
- [ ] Key metrics collected and dimensioned
- [ ] Anomaly detection configured with thresholds
- [ ] Audit trail is immutable and compliant
- [ ] Dashboards provide visibility into system health
- [ ] Alerts are actionable (clear what to do when triggered)
- [ ] Log retention meets compliance requirements
- [ ] Access controls protect sensitive logs
