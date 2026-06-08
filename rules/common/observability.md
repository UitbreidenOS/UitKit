# Observability Rules

## Apply to
All backend services, workers, and infrastructure — any system that runs in production.

## Rules

1. **Logs, metrics, and traces are distinct signals — instrument all three** — logs explain what happened, metrics show trends and trigger alerts, traces show where time was spent across service boundaries. One without the others leaves blind spots.

2. **Structured logs only — never raw strings** — `{"level":"error","service":"payments","user_id":"u123","error":"card declined"}` is queryable. `ERROR: card declined for user u123` is not. Use JSON or a structured logging library.

3. **Log at boundaries, not inside logic** — log at the entry and exit of HTTP handlers, queue consumers, and external calls. Don't log inside pure functions or tight loops.

4. **Include trace context in every log line** — `trace_id`, `span_id`, and `request_id` link logs to distributed traces. Without them, correlating a log line to a specific request across services is guesswork.

5. **Use the four golden signals as your baseline metric set** — latency (p50, p95, p99), traffic (requests/sec), error rate (5xx%), and saturation (queue depth, CPU, memory). Alert on these before adding custom metrics.

6. **Histograms over averages for latency** — averages hide bimodal distributions and long tails. Track p95 and p99. A p99 latency spike with a flat average means your slowest users are suffering in silence.

7. **Name metrics consistently** — `http_request_duration_seconds`, not `request_time` or `latency_ms`. Follow Prometheus naming conventions: `<namespace>_<subsystem>_<name>_<unit>`. Units in the name, base units (seconds, bytes, not milliseconds).

8. **Instrument every external call** — database queries, cache hits/misses, HTTP calls to third parties, message queue publishes/consumes. These are where latency accumulates and failures originate.

9. **Set SLOs before configuring alerts** — define acceptable error budget first. Alert on SLO burn rate, not raw metric thresholds. Threshold alerts generate noise; burn rate alerts signal real user impact.

10. **Avoid high-cardinality label values on metrics** — `user_id` as a Prometheus label creates one time series per user and crashes your metrics backend. Labels should have bounded cardinality (status code, endpoint, region — not user IDs or UUIDs).

11. **Sample traces, not all traces** — 100% trace sampling is expensive. Use head-based or tail-based sampling (sample errors always, sample a fraction of successes). OpenTelemetry supports both.

12. **Retention policy is part of the design** — decide upfront: logs 30 days, traces 7 days, raw metrics 15 days, aggregated metrics 13 months. Unplanned retention bloats storage costs and slows queries.

13. **Health endpoints are not observability** — `/healthz` tells the orchestrator if the process is alive. It doesn't tell you why requests are slow. Don't substitute health checks for real instrumentation.

14. **Use OpenTelemetry for instrumentation — avoid vendor-specific SDKs** — OTLP is the standard export format. Switch backends (Jaeger, Honeycomb, Datadog) by changing the exporter, not the instrumentation.

15. **Alert on symptoms, not causes** — alert on "error rate > 1% for 5 minutes", not "CPU > 80%". High CPU is a possible cause; elevated error rate is a confirmed symptom. Reduce alert fatigue by alerting on what users experience.


---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
