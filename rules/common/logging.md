# Logging Rules

Apply when adding, reviewing, or configuring application logs.

## Structure

- Emit structured JSON logs — never free-form strings in production
- Every log line must include: `timestamp` (ISO 8601 UTC), `level`, `service`, `message`
- Add `trace_id` and `span_id` to every log line for distributed tracing correlation
- Log the `request_id` on every line emitted during an HTTP request lifecycle
- Use consistent field names across services — agree on a schema once and enforce it

## Levels

| Level | Use for |
|---|---|
| `ERROR` | An operation failed; human attention may be required |
| `WARN` | Unexpected state but the operation continued; worth monitoring |
| `INFO` | Normal significant events: service started, job completed, user authenticated |
| `DEBUG` | Developer diagnostics — disabled in production by default |

- Never use `ERROR` for expected business failures (invalid input, not found) — use `WARN` or `INFO`
- Never use `INFO` for per-request noise on high-throughput endpoints — use `DEBUG`

## Content

- Log what happened, why it matters, and what identifiers are needed to investigate
- Include the full error message and stack trace on `ERROR` lines
- Never log secrets, tokens, passwords, credit card numbers, or raw PII
- Mask or omit `Authorization` headers, cookie values, and query parameters containing credentials
- Don't log request bodies unless debugging and even then strip sensitive fields

## Volume and cost

- Sample `DEBUG` and high-frequency `INFO` logs in production — log 1 in N, not every event
- Set log retention by tier: errors 90 days, info 30 days, debug 7 days (adjust by cost and compliance need)
- Add `slow_query` and `high_latency` markers rather than logging every request at full verbosity
- Centralise logs in one platform — fragmented logs across services are unworkable during incidents

## Operational requirements

- Logs must be queryable within seconds of emission — use a structured log aggregator (Loki, CloudWatch Logs Insights, Datadog)
- Alert on `ERROR` rate spikes, not just on individual errors
- Separate application logs from access logs — access logs have different retention and PII rules
- Never write logs to local disk only in a containerised environment — they will be lost on restart
