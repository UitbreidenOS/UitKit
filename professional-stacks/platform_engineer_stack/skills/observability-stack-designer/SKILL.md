# Observability Stack Designer

## When to activate

When designing monitoring infrastructure, defining SLOs/SLIs, creating dashboards, configuring alerts, setting up distributed tracing, or establishing log aggregation. Use when building observability from scratch or auditing existing monitoring gaps.

## When NOT to use

For operational troubleshooting (use runbooks). For implementing specific integrations, use MCP/connections skills. This is for designing the observability architecture.

## Instructions

### 1. Define Service Level Objectives (SLOs)

Establish what "healthy" means for your service:

**The SLO Framework:**
- **SLO (Service Level Objective):** Target reliability (e.g., 99.9% uptime)
- **SLI (Service Level Indicator):** Measurable metric (e.g., HTTP 200-399 responses)
- **Error budget:** Allowed failures within SLO window (e.g., 43.2 seconds/month for 99.9%)

**Common SLO Targets:**
- Consumer-facing services: 99.9% (9 nines) = 43.2 minutes/month downtime
- Infrastructure services: 99.95% (4.5 nines) = 21.6 minutes/month
- Enterprise SaaS: 99.99% (4 nines) = 4.32 minutes/month
- Internal tools: 95% (2 nines) = 36 hours/month

**Define SLI Metrics:**

1. **Availability:** % of requests that return 2xx/3xx (success)
   ```
   SLI = valid_requests / total_requests
   ```
   Include: 200, 201, 204, 301, 302, 304
   Exclude: 4xx client errors, 5xx server errors, timeouts

2. **Latency:** % of requests faster than target
   ```
   SLI = fast_requests / total_requests
   where fast = p99_latency < 500ms
   ```

3. **Error Rate:** % of requests without errors
   ```
   SLI = (total_requests - errors) / total_requests
   where errors = 5xx + timeouts + connection resets
   ```

4. **Correctness:** % of responses returning expected data
   ```
   SLI = correct_responses / total_responses
   Requires validation logic (e.g., schema validation)
   ```

**Calculate Error Budget:**
```
Error Budget = (1 - SLO) * time_window
Example for 99.9% over 30 days:
= (1 - 0.999) * 30 * 24 * 60 minutes
= 0.001 * 43,200
= 43.2 minutes/month
```

**Alert When Error Budget At Risk:**
```
IF (error_rate > SLO_threshold) AND (errors_this_month > error_budget)
  THEN alert: "Error budget exhausted, freeze deploys"
```

### 2. Design Metrics Collection

What to measure and how:

**Application Metrics (Prometheus format):**

```python
from prometheus_client import Counter, Histogram, Gauge

# Counter: monotonically increasing (requests, errors, deployments)
requests_total = Counter(
    'http_requests_total',
    'Total HTTP requests',
    labelnames=['method', 'endpoint', 'status']
)

# Histogram: distribution of values (latency, size)
request_duration = Histogram(
    'http_request_duration_seconds',
    'HTTP request latency',
    labelnames=['method', 'endpoint'],
    buckets=(0.01, 0.05, 0.1, 0.5, 1.0, 5.0)
)

# Gauge: can go up/down (memory, CPU, connections)
db_connection_pool_size = Gauge(
    'db_connections_active',
    'Active database connections'
)

# Instrument code
@app.route('/api/users')
def get_users():
    start = time.time()
    try:
        users = db.query(User).all()
        requests_total.labels(
            method='GET',
            endpoint='/api/users',
            status=200
        ).inc()
    except Exception as e:
        requests_total.labels(
            method='GET',
            endpoint='/api/users',
            status=500
        ).inc()
        raise
    finally:
        duration = time.time() - start
        request_duration.labels(
            method='GET',
            endpoint='/api/users'
        ).observe(duration)
    return users
```

**Key Metrics Per Service:**

| Type | Metrics | Thresholds | Alert |
|------|---------|-----------|-------|
| **HTTP** | Request count, latency, error rate | p99 < 500ms, errors < 1% | Latency > 1s for 5m or errors > 5% |
| **Database** | Connection pool, query latency, slow queries | Connections < 90% pool, latency < 100ms | Slow queries > 10 per minute |
| **Cache** | Hit rate, latency, eviction rate | Hit rate > 80%, latency < 10ms | Hit rate < 60% for 5m |
| **Queue** | Depth, processing latency, dead letter rate | Depth < 1000, latency < 100ms | Depth > 5000 or DLQ growing |
| **Infrastructure** | CPU, memory, disk, network | CPU < 70%, memory < 80%, disk < 85% | CPU > 90% or memory OOMKilled |

### 3. Set Up Log Aggregation

Centralize logs for debugging:

**Log Collection (Fluentd/Logstash/Vector):**

```yaml
# Deploy Fluentd as DaemonSet
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: fluentd
  namespace: logging
spec:
  selector:
    matchLabels:
      app: fluentd
  template:
    metadata:
      labels:
        app: fluentd
    spec:
      containers:
      - name: fluentd
        image: fluent/fluentd-kubernetes-daemonset:latest
        volumeMounts:
        - name: varlog
          mountPath: /var/log
        - name: config
          mountPath: /fluentd/etc/fluent.conf
          subPath: fluent.conf
      volumes:
      - name: varlog
        hostPath:
          path: /var/log
      - name: config
        configMap:
          name: fluentd-config

---
# Fluentd configuration
apiVersion: v1
kind: ConfigMap
metadata:
  name: fluentd-config
  namespace: logging
data:
  fluent.conf: |
    <source>
      @type tail
      path /var/log/containers/*.log
      pos_file /var/log/fluentd-containers.log.pos
      tag kubernetes.*
      <parse>
        @type json
        time_key time
        time_format %Y-%m-%dT%H:%M:%S.%NZ
      </parse>
    </source>

    <filter kubernetes.**>
      @type kubernetes_metadata
      kubernetes_url "#{ENV['FLUENT_FILTER_KUBERNETES_URL'] || 'https://' + ENV.fetch('KUBERNETES_SERVICE_HOST') + ':' + ENV.fetch('KUBERNETES_SERVICE_PORT') + '/api'}"
    </filter>

    <match **>
      @type elasticsearch
      @id output_elasticsearch
      @log_level info
      include_timestamp false
      host elasticsearch
      port 9200
      path_without_params /my-app-${Time.now.strftime('%Y.%m.%d')}/
      <buffer tag,time>
        @type file
        path /var/log/fluentd-buffers/kubernetes.system.buffer
        flush_mode interval
        retry_type exponential_backoff
        flush_interval 5s
        retry_forever false
        retry_max_interval 30
        chunk_limit_size "#{ENV['FLUENT_ELASTICSEARCH_BUFFER_CHUNK_LIMIT_SIZE'] || '5M'}"
        queue_limit_length "#{ENV['FLUENT_ELASTICSEARCH_BUFFER_QUEUE_LIMIT_LENGTH'] || '256'}"
        flush_at_shutdown true
      </buffer>
    </match>
```

**Structured Logging (JSON format):**

```python
import json
import logging

class JSONFormatter(logging.Formatter):
    def format(self, record):
        log_data = {
            'timestamp': self.formatTime(record),
            'level': record.levelname,
            'logger': record.name,
            'message': record.getMessage(),
            'path': record.pathname,
            'line': record.lineno,
        }
        if record.exc_info:
            log_data['exception'] = self.formatException(record.exc_info)
        # Add correlation ID for request tracing
        if hasattr(record, 'correlation_id'):
            log_data['correlation_id'] = record.correlation_id
        return json.dumps(log_data)

# Configure logging
handler = logging.StreamHandler()
handler.setFormatter(JSONFormatter())
logger = logging.getLogger()
logger.addHandler(handler)
logger.setLevel(logging.INFO)
```

**Query Logs (Loki/Elasticsearch):**

```
# Find errors for service X in last hour
{job="api-service"} | json | level="ERROR" | 1h

# Find slow requests (> 1 second)
{job="api-service"} | json | duration > 1000

# Find requests for user ID 123
{job="api-service"} | json | user_id="123"

# Track deployment: find all logs from version v1.2.3
{job="api-service", version="v1.2.3"}
```

### 4. Create Dashboards

Visualize health and key metrics:

**Dashboard: Service Health (Real-time View)**

```
Title: API Service - Health Overview
Refresh: 30 seconds

Row 1: Key Metrics
- Error rate (last 5m) [red if > 1%, yellow if > 0.5%]
- p99 latency (last 5m) [ms]
- Success rate (last 5m) [%]
- Requests/sec (last 5m) [number]

Row 2: Request Breakdown
- Requests by method (pie chart)
- Requests by endpoint (table)
- Requests by status code (stacked bar)

Row 3: Performance
- Latency distribution (p50, p95, p99, p99.9) [histogram]
- Latency over time (line chart)
- Error rate over time (line chart)

Row 4: Infrastructure
- CPU usage (gauge: 0-100%)
- Memory usage (gauge: 0-100%)
- Pod restart rate (number)
- Network I/O (bytes/sec)

Row 5: Dependencies
- Database latency (p99)
- Cache hit rate (%)
- External API latency (p99)
```

**Dashboard: Error Tracking**

```
Title: Errors & Incidents

Row 1: Error Rate
- Error rate by status code (stacked area chart)
- Top error types (table: error message, count, %)
- Error rate trend (line chart, last 24h)

Row 2: Problem Services
- Services with highest error rate (table)
- Error rate per service (bar chart)
- Error budget remaining per service (gauge)

Row 3: Trace Debugging
- Recent error traces (logs with stack traces)
- Trace ID search box
- Correlation ID to trace relationship
```

### 5. Configure Alerting Rules

Define when to wake up on-call:

**Alert Rule: High Error Rate**

```yaml
groups:
- name: api-service
  rules:
  - alert: HighErrorRate
    expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.01
    for: 5m
    labels:
      severity: critical
      team: platform
    annotations:
      summary: "High error rate on {{ $labels.service }}"
      description: "Error rate is {{ $value | humanizePercentage }} for {{ $labels.service }}"
      dashboard: "https://grafana.example.com/d/abc123"
      runbook: "https://wiki.example.com/runbooks/high-error-rate"

  - alert: HighLatency
    expr: histogram_quantile(0.99, http_request_duration_seconds) > 0.5
    for: 5m
    labels:
      severity: warning
      team: platform
    annotations:
      summary: "High latency on {{ $labels.service }}"
      description: "p99 latency is {{ $value }}s"

  - alert: ErrorBudgetExhausted
    expr: |
      (
        sum(rate(http_requests_total{status=~"5.."}[30d])) /
        sum(rate(http_requests_total[30d]))
      ) > 0.001
    for: 5m
    labels:
      severity: critical
      team: platform
    annotations:
      summary: "Error budget exhausted for {{ $labels.service }}"
      description: "Stop deployments and focus on reliability"
```

**Alert Routing (AlertManager):**

```yaml
global:
  resolve_timeout: 5m
  slack_api_url: 'https://hooks.slack.com/services/...'

route:
  receiver: 'default'
  group_by: ['service', 'severity']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 4h
  
  routes:
  - match:
      severity: critical
    receiver: 'pagerduty'
    group_wait: 1s
    repeat_interval: 30m
  
  - match:
      severity: warning
    receiver: 'slack-warnings'
    repeat_interval: 2h

receivers:
- name: 'default'
  slack_configs:
  - channel: '#alerts'
    title: '{{ .GroupLabels.service }}'
    text: '{{ range .Alerts }}{{ .Annotations.summary }}\n{{ end }}'

- name: 'pagerduty'
  pagerduty_configs:
  - service_key: '{{ .GroupLabels.pagerduty_key }}'

- name: 'slack-warnings'
  slack_configs:
  - channel: '#platform-warnings'
```

### 6. Distributed Tracing

Track requests across services:

```python
from opentelemetry import trace, metrics
from opentelemetry.exporter.jaeger.thrift import JaegerExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

# Configure Jaeger exporter
jaeger_exporter = JaegerExporter(
    agent_host_name="jaeger",
    agent_port=6831,
)

trace.set_tracer_provider(TracerProvider())
trace.get_tracer_provider().add_span_processor(
    BatchSpanProcessor(jaeger_exporter)
)

# Instrument Flask
from opentelemetry.instrumentation.flask import FlaskInstrumentor
from opentelemetry.instrumentation.requests import RequestsInstrumentor

FlaskInstrumentor().instrument_app(app)
RequestsInstrumentor().instrument()

# Manual span creation
tracer = trace.get_tracer(__name__)

@app.route('/api/users/<user_id>')
def get_user(user_id):
    with tracer.start_as_current_span("get_user") as span:
        span.set_attribute("user.id", user_id)
        
        with tracer.start_as_current_span("db.query") as db_span:
            user = db.query(User).filter_by(id=user_id).first()
            db_span.set_attribute("db.rows", 1 if user else 0)
        
        return user.to_dict()
```

## Best Practices

1. **SLO first** — Define what "healthy" means before designing monitoring
2. **Measure the right thing** — User-facing latency, not internal metrics
3. **Alert on symptoms, not causes** — Alert on error rate, not CPU. High CPU is the cause, not the symptom
4. **Avoid alert fatigue** — Tune thresholds so alerts are actionable
5. **Link alerts to runbooks** — When alert fires, oncall should know what to do
6. **Test dashboards** — Verify they update correctly, aren't missing data
7. **Retention policies** — Keep metrics for 1 year, logs for 30 days (adjust to your SLA)
8. **Understand your baseline** — Know what "normal" looks like before alerting on deviations
9. **Correlate metrics, logs, traces** — Use correlation IDs to tie requests together
10. **Postmortem metrics** — Track MTTR, incident frequency, error budget utilization

---
