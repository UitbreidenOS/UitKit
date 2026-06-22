# Prometheus Metrics Collection Guide

Comprehensive guide for instrumenting Claudient services with Prometheus metrics. Covers counter, gauge, and histogram patterns, cardinality management, and alerting integration.

---

## Metrics Overview

Claudient exports three primary metric types aligned with Prometheus best practices:

| Type | Use Case | Example |
|------|----------|---------|
| **Counter** | Total occurrences (monotonic) | Feature invocations, API requests, total errors |
| **Gauge** | Point-in-time snapshots | Active tasks, memory usage, queue length |
| **Histogram** | Distribution of measurements | Request latency, token consumption, render time |

---

## Counter Metrics

Counters are monotonically increasing and never decrease. Use for measuring total events since service start.

### Feature Usage Counters

```prometheus
# Total feature invocations
feature_calls_total{
  skill_name="code_review",
  skill_category="code_quality",
  status="success",
  user_id="user_123"
} 1542
```

**Labels:**
- `skill_name` — Specific skill/feature (low cardinality: ~50 max)
- `skill_category` — Category grouping (code_quality, automation, integration, etc.)
- `status` — success | error | timeout | skipped
- `user_id` — Anonymized/hashed user identifier (HIGH CARDINALITY — see limits below)

**Instrumentation pattern:**

```python
from prometheus_client import Counter

feature_calls = Counter(
    'feature_calls_total',
    'Total feature invocations',
    ['skill_name', 'skill_category', 'status', 'user_id']
)

# In your skill executor
try:
    result = execute_skill(skill_name, params)
    feature_calls.labels(
        skill_name=skill_name,
        skill_category=get_category(skill_name),
        status='success',
        user_id=hash_user_id(user_id)
    ).inc()
except Exception as e:
    feature_calls.labels(
        skill_name=skill_name,
        skill_category=get_category(skill_name),
        status='error',
        user_id=hash_user_id(user_id)
    ).inc()
```

### API Request Counters

```prometheus
api_requests_total{
  endpoint="/api/v1/execute",
  method="POST",
  status_code="200",
  source="claude_code"
} 8932
```

**Labels:**
- `endpoint` — API path (e.g., /api/v1/execute, /api/v1/workflows)
- `method` — HTTP method (GET, POST, PUT, DELETE, PATCH)
- `status_code` — HTTP status (200, 400, 401, 403, 404, 500, etc.)
- `source` — Request origin (claude_code, mcp, webhook, cli)

### Token Processing Counters

```prometheus
tokens_processed_total{
  model_id="claude-haiku-4-5",
  operation_type="inference",
  direction="input"
} 125000000
```

**Labels:**
- `model_id` — Model identifier (claude-haiku-4-5, claude-sonnet-4, etc.)
- `operation_type` — inference | fine_tune | embeddings | completion
- `direction` — input | output (separates prompt vs. completion token counting)

**Instrumentation pattern:**

```python
tokens_processed = Counter(
    'tokens_processed_total',
    'Total tokens processed',
    ['model_id', 'operation_type', 'direction']
)

# Track token usage per API call
tokens_processed.labels(
    model_id=model_id,
    operation_type='inference',
    direction='input'
).inc(prompt_tokens)

tokens_processed.labels(
    model_id=model_id,
    operation_type='inference',
    direction='output'
).inc(completion_tokens)
```

### Error Counters

```prometheus
errors_total{
  error_type="validation",
  error_code="INVALID_PARAMS",
  severity="medium",
  component="skill_engine"
} 47
```

**Labels:**
- `error_type` — validation | permission | timeout | runtime | parse | resource
- `error_code` — Machine-readable error (e.g., INVALID_PARAMS, TIMEOUT_EXCEEDED)
- `severity` — low | medium | high | critical
- `component` — Service/module where error occurred

**Keep cardinality low:** limit error_code to ~10 categories max.

### Workflow Execution Counters

```prometheus
workflow_executions_total{
  workflow_name="deploy_to_prod",
  workflow_type="sequential",
  result="success"
} 342
```

**Labels:**
- `workflow_name` — Workflow identifier
- `workflow_type` — sequential | parallel | conditional | loop
- `result` — success | failure | partial

---

## Gauge Metrics

Gauges represent instantaneous values and can go up or down. Use for capacity, current state, or resource measurements.

### Active Tasks Gauge

```prometheus
active_tasks{
  task_type="skill_execution",
  priority="high",
  status="in_progress"
} 23
```

**Labels:**
- `task_type` — skill_execution | workflow | api_request | background_job
- `priority` — low | medium | high | critical
- `status` — pending | in_progress | blocked

**Instrumentation pattern:**

```python
from prometheus_client import Gauge

active_tasks = Gauge(
    'active_tasks',
    'Number of active tasks',
    ['task_type', 'priority', 'status']
)

# When task starts
active_tasks.labels(
    task_type='skill_execution',
    priority=task.priority,
    status='in_progress'
).inc()

# When task completes
active_tasks.labels(
    task_type='skill_execution',
    priority=task.priority,
    status='in_progress'
).dec()
```

### Active Connections Gauge

```prometheus
active_connections{
  connection_type="api",
  client_type="web"
} 127

active_connections{
  connection_type="mcp",
  client_type="cli"
} 45
```

### Queue Length Gauge

```prometheus
queue_length{
  queue_name="api_requests",
  priority="high"
} 342

queue_length{
  queue_name="workflows",
  priority="low"
} 1200
```

**Critical thresholds:**
- > 500 items — Warning: investigate backpressure
- > 1000 items — Critical: queue overflow imminent

### Memory Usage Gauge

```prometheus
memory_usage_bytes{
  component="skill_engine",
  memory_type="heap"
} 536870912  # 512 MB
```

**Labels:**
- `component` — cache | skill_engine | workflow_engine | mcp_gateway
- `memory_type` — heap | non_heap | rss (resident set size)

### Cached Items Gauge

```prometheus
cached_items{
  cache_name="skill_results",
  ttl_bucket="short"
} 1250
```

**Labels:**
- `cache_name` — skill_results | api_responses | feature_metadata
- `ttl_bucket` — short (<1m) | medium (1-60m) | long (>1h)

### Concurrent Users Gauge

```prometheus
concurrent_users{
  user_tier="pro",
  region="us"
} 245

concurrent_users{
  user_tier="enterprise",
  region="eu"
} 89
```

### Skill Availability Gauge

```prometheus
skill_availability{
  skill_name="code_review",
  skill_category="code_quality",
  unavailability_reason="none"
} 1  # 1 = available, 0 = unavailable
```

**Instrumentation pattern:**

```python
skill_availability = Gauge(
    'skill_availability',
    'Skill availability status',
    ['skill_name', 'skill_category', 'unavailability_reason']
)

# Health check
def check_skill_health(skill_name):
    try:
        result = test_skill(skill_name)
        skill_availability.labels(
            skill_name=skill_name,
            skill_category=get_category(skill_name),
            unavailability_reason='none'
        ).set(1)
    except TimeoutError:
        skill_availability.labels(
            skill_name=skill_name,
            skill_category=get_category(skill_name),
            unavailability_reason='timeout'
        ).set(0)
    except Exception as e:
        skill_availability.labels(
            skill_name=skill_name,
            skill_category=get_category(skill_name),
            unavailability_reason='error'
        ).set(0)
```

### Context Utilization Gauge

```prometheus
model_context_utilization{
  model_id="claude-sonnet-4",
  context_type="input"
} 65.4  # Percentage
```

**Threshold alerts:**
- > 80% — Warning: context pressure building
- > 95% — Critical: approaching limit

---

## Histogram Metrics

Histograms measure distributions of values across configurable buckets. Use for latencies, sizes, and durations.

### Request Latency Histogram

```prometheus
# Bucket boundaries in milliseconds
latency_ms_bucket{
  operation_type="skill_call",
  operation_name="code_review",
  status="success",
  le="10"
} 124
latency_ms_bucket{le="50"} 412
latency_ms_bucket{le="100"} 598
latency_ms_bucket{le="500"} 876
latency_ms_bucket{le="1000"} 892
latency_ms_bucket{le="+Inf"} 895

latency_ms_sum{...} 342500  # Total milliseconds
latency_ms_count{...} 895    # Total observations
```

**Bucket configuration:**
```
[1, 5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000]
```

**Instrumentation pattern:**

```python
from prometheus_client import Histogram
import time

latency_histogram = Histogram(
    'latency_ms',
    'Request latency',
    ['operation_type', 'operation_name', 'status'],
    buckets=[1, 5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000]
)

# Record latency
start = time.time()
try:
    result = execute_operation()
    elapsed = (time.time() - start) * 1000
    latency_histogram.labels(
        operation_type='skill_call',
        operation_name='code_review',
        status='success'
    ).observe(elapsed)
except Exception:
    elapsed = (time.time() - start) * 1000
    latency_histogram.labels(
        operation_type='skill_call',
        operation_name='code_review',
        status='error'
    ).observe(elapsed)
```

### Token Usage Histogram

```prometheus
token_usage_bucket{
  model_id="claude-haiku-4-5",
  operation_type="inference",
  direction="input",
  le="100"
} 450
token_usage_bucket{le="1000"} 820
token_usage_bucket{le="10000"} 1200
token_usage_bucket{le="100000"} 1250
token_usage_bucket{le="+Inf"} 1253

token_usage_sum{...} 125000000
token_usage_count{...} 1253
```

**Bucket configuration:**
```
[10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000, 500000]
```

### Workflow Duration Histogram

```prometheus
workflow_duration_ms_bucket{
  workflow_name="deploy_to_prod",
  workflow_type="sequential",
  result="success",
  le="1000"
} 5
workflow_duration_ms_bucket{le="10000"} 28
workflow_duration_ms_bucket{le="60000"} 340  # 1 minute
workflow_duration_ms_bucket{le="600000"} 342  # 10 minutes
workflow_duration_ms_bucket{le="+Inf"} 342

workflow_duration_ms_sum{...} 67500000  # 18.75 hours total
workflow_duration_ms_count{...} 342
```

**Bucket configuration (milliseconds):**
```
[100, 500, 1000, 5000, 10000, 30000, 60000, 300000, 600000]
```

### Cache Hit Latency Histogram

```prometheus
cache_hit_latency_ms_bucket{
  cache_name="skill_results",
  hit_type="hit",
  le="0.1"
} 8450
cache_hit_latency_ms_bucket{le="1"} 8920
cache_hit_latency_ms_bucket{le="10"} 8950
cache_hit_latency_ms_bucket{le="+Inf"} 8952

cache_hit_latency_ms_sum{...} 2850
cache_hit_latency_ms_count{...} 8952
```

**Bucket configuration (milliseconds):**
```
[0.1, 0.5, 1, 5, 10, 25, 50, 100]
```

### Skill Execution Time Histogram

```prometheus
skill_execution_time_ms_bucket{
  skill_name="code_review",
  skill_category="code_quality",
  outcome="success",
  le="250"
} 1250
skill_execution_time_ms_bucket{le="500"} 1420
skill_execution_time_ms_bucket{le="1000"} 1580
skill_execution_time_ms_bucket{le="5000"} 1620
skill_execution_time_ms_bucket{le="10000"} 1625
skill_execution_time_ms_bucket{le="+Inf"} 1627

skill_execution_time_ms_sum{...} 812500
skill_execution_time_ms_count{...} 1627
```

### API Response Size Histogram

```prometheus
api_response_size_bytes_bucket{
  endpoint="/api/v1/execute",
  method="POST",
  compression="gzip",
  le="10000"
} 450
api_response_size_bytes_bucket{le="100000"} 720
api_response_size_bytes_bucket{le="1000000"} 892
api_response_size_bytes_bucket{le="+Inf"} 895

api_response_size_bytes_sum{...} 125000000
api_response_size_bytes_count{...} 895
```

**Bucket configuration (bytes):**
```
[100, 1000, 10000, 100000, 1000000, 10000000]
```

### Input Parsing Duration Histogram

```prometheus
input_parsing_duration_ms_bucket{
  parser_type="json",
  input_size_bytes="medium",
  le="25"
} 150
input_parsing_duration_ms_bucket{le="100"} 280
input_parsing_duration_ms_bucket{le="500"} 295
input_parsing_duration_ms_bucket{le="+Inf"} 298

input_parsing_duration_ms_sum{...} 8950
input_parsing_duration_ms_count{...} 298
```

**Bucket configuration (milliseconds):**
```
[1, 5, 10, 25, 50, 100, 250, 500]
```

### MCP Round-Trip Latency Histogram

```prometheus
mcp_roundtrip_ms_bucket{
  mcp_server="bash_executor",
  tool_name="bash_run",
  network_type="local",
  le="50"
} 420
mcp_roundtrip_ms_bucket{le="250"} 1240
mcp_roundtrip_ms_bucket{le="1000"} 1450
mcp_roundtrip_ms_bucket{le="5000"} 1520
mcp_roundtrip_ms_bucket{le="+Inf"} 1527

mcp_roundtrip_ms_sum{...} 450000
mcp_roundtrip_ms_count{...} 1527
```

**Bucket configuration (milliseconds):**
```
[1, 10, 50, 100, 250, 500, 1000, 5000]
```

---

## Cardinality Management

**Cardinality = number of unique label combinations.** High cardinality causes memory bloat and query slowdowns.

### Cardinality Budget Distribution

```yaml
cardinality_budget:
  total_limit: 1000  # Maximum unique metric combinations
  
  feature_calls_total:
    max: 600
    formula: "50 skills × 3 statuses × 4 categories"
    estimated: 450
    
  api_requests_total:
    max: 300
    formula: "20 endpoints × 4 methods × 4 status codes"
    estimated: 200
    
  tokens_processed_total:
    max: 50
    formula: "3 models × 2 directions × 5 operation types"
    estimated: 30
    
  errors_total:
    max: 250
    formula: "5 error types × 5 error codes × 10 components"
    estimated: 150
    
  latency_ms:
    max: 250
    formula: "30 operations × 5 status variants"
    estimated: 150
```

### High-Cardinality Danger Zones

**AVOID these label patterns:**

```prometheus
# ❌ DO NOT — user_id is unbounded
feature_calls_total{skill="X", user_id="user_123", ...}

# ❌ DO NOT — request_id is unique per request
latency_ms{operation="X", request_id="req-abc123", ...}

# ❌ DO NOT — timestamp varies continuously
error_rate{component="X", timestamp="2026-06-22T10:15:30Z", ...}

# ❌ DO NOT — arbitrary error messages
errors_total{error_message="...", ...}  # Could be thousands of unique values
```

**✓ CORRECT — bounded, meaningful labels:**

```prometheus
# ✓ DO — category-based user segmentation
feature_calls_total{skill="code_review", user_tier="pro", region="us"}

# ✓ DO — operation name, not request ID
latency_ms{operation="code_review", operation_name="analyze_file"}

# ✓ DO — standardized error codes
errors_total{error_type="validation", error_code="INVALID_PARAMS"}
```

### Cardinality Enforcement Rules

1. **Pre-declare label values** — Never allow unbounded string labels
2. **Use enums** — Restrict labels to known values:
   ```python
   STATUS_VALUES = ['success', 'error', 'timeout', 'skipped']
   REGIONS = ['us', 'eu', 'asia', 'other']
   ```

3. **Monitor cardinality growth:**
   ```promql
   # Prometheus query to detect cardinality bloat
   count(count by (__name__) (metric_name))
   ```

4. **Cleanup policy** — Daily cardinality audit (see METRICS_DEFINITIONS.yaml)

5. **Selective high-cardinality labels** — If needed, isolate to separate metrics:
   ```python
   # OK: dedicated metric with controlled cardinality
   user_daily_usage{user_id="...", date="2026-06-22"}  # One series per user per day
   
   # NOT OK: inline in every counter
   feature_calls_total{user_id="...", ...}  # Explodes cardinality
   ```

---

## Alert Rules Integration

See `ALERTING_RULES.yaml` for complete alert definitions. Key thresholds:

| Metric | Warning Threshold | Critical | Duration |
|--------|-------------------|----------|----------|
| `error_rate_percent` | 2% | 5% | 5m |
| `queue_length` | 500 | 1000 | 5m |
| `memory_usage_bytes` | 750 MB | 1 GB | 5m |
| `model_context_utilization` | 80% | 95% | 10m |
| `p95_latency_ms` | 2000 | 5000 | 10m |
| `skill_availability` | N/A | 0 (down) | 1m |

### Sample Alert Rules

```yaml
# Error rate exceeds 5%
- alert: HighErrorRate
  expr: (errors_total / api_requests_total) * 100 > 5
  for: 5m
  severity: critical

# Queue backlog building
- alert: QueueBacklog
  expr: queue_length > 1000
  for: 5m
  severity: critical

# P95 latency degradation
- alert: HighLatency
  expr: histogram_quantile(0.95, latency_ms) > 5000
  for: 10m
  severity: warning

# Skill unavailable
- alert: SkillDown
  expr: skill_availability == 0
  for: 1m
  severity: critical
```

---

## Exemplars (Optional)

Exemplars link metrics to logs/traces via trace IDs. Include when tracing is enabled:

```python
# With trace context
latency_histogram.labels(
    operation_type='skill_call',
    operation_name='code_review',
    status='success'
).observe(elapsed, exemplar={'trace_id': trace_id})

# Prometheus scrape config
exemplars:
  enabled: true
  max_exemplar_count: 100000
```

---

## Instrumentation Checklist

- [ ] All counters increment atomically (use `inc()`, not manual add)
- [ ] Gauge values reflect actual state (not cached)
- [ ] Histogram buckets align with SLO targets (p95, p99)
- [ ] Label cardinality verified (< 1000 total)
- [ ] Error codes standardized (5-10 categories max)
- [ ] Service name and instance labels included in scrape config
- [ ] Histogram observations include non-error paths (success, timeout, etc.)
- [ ] Metric names follow `<namespace>_<unit>_<type>` convention
- [ ] Cache hit/miss tracked separately when meaningful
- [ ] Exemplars populated if distributed tracing enabled

---

## Recording Rules (PromQL Aggregations)

Pre-compute expensive queries to reduce load:

```yaml
groups:
  - name: claudient_recording
    interval: 30s
    rules:
      # Success rate (computed every 30s)
      - record: job:success_rate:30s
        expr: |
          sum(rate(feature_calls_total{status="success"}[30s])) by (job)
          /
          sum(rate(feature_calls_total[30s])) by (job)

      # P95 latency
      - record: job:p95_latency_ms:30s
        expr: |
          histogram_quantile(0.95,
            sum(rate(latency_ms_bucket[30s])) by (le, job)
          )

      # Error rate percentage
      - record: job:error_rate_percent:30s
        expr: |
          (sum(rate(errors_total[30s])) by (job) /
           sum(rate(api_requests_total[30s])) by (job)) * 100
```

---

## Retention & Cleanup

```yaml
retention_policy:
  raw_data: 15d              # Keep raw metrics 15 days
  aggregated_1h: 90d         # Keep hourly summaries 3 months
  aggregated_1d: 1y          # Keep daily summaries 1 year
  cardinality_cleanup: daily # Remove stale series daily
  max_label_values: 1000     # Hard limit per metric
```

---

## Testing Metrics Locally

```bash
# Start Prometheus with scrape interval 5s (for testing)
docker run -p 9090:9090 \
  -v /path/to/prometheus.yml:/etc/prometheus/prometheus.yml \
  -e PROMETHEUS_OPTS="--storage.tsdb.retention.time=1d" \
  prom/prometheus

# Visit http://localhost:9090

# Query examples:
# - feature_calls_total
# - rate(feature_calls_total[5m])
# - histogram_quantile(0.95, latency_ms)
# - errors_total
# - active_tasks
```

---

## References

- [Prometheus Documentation](https://prometheus.io/docs/prometheus/latest/querying/basics/)
- [Metric and Label Naming Conventions](https://prometheus.io/docs/practices/naming/)
- [Cardinality Limits Best Practices](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#tsdb)
- [PromQL Best Practices](https://prometheus.io/docs/practices/instrumentation/)
