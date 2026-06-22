# Claudient Observability

Prometheus alerting rules and configuration for monitoring Claudient services.

## Files

- **ALERTING_RULES.yaml** — Prometheus alert rules for:
  - Feature error rate (>5%)
  - Don't Stop budget utilization (>90%, critical at 100%)
  - SVG Inspector rendering time (>10s, critical at >30s)
  - Swarm Sandbox failure rate (>2%)
  - Swarm Sandbox health checks

- **alertmanager.yml** — Alertmanager routing and notification config with Slack integration

## Setup

### 1. Environment Variables

Set Slack webhook URL:
```bash
export SLACK_WEBHOOK_URL='https://hooks.slack.com/services/YOUR/WEBHOOK/URL'
```

### 2. Prometheus Configuration

Add to your `prometheus.yml`:

```yaml
rule_files:
  - '/etc/prometheus/rules/ALERTING_RULES.yaml'

alerting:
  alertmanagers:
    - static_configs:
        - targets: ['alertmanager:9093']
```

### 3. Alertmanager Configuration

Point Alertmanager to use `alertmanager.yml`:

```bash
alertmanager --config.file=alertmanager.yml
```

## Metrics Required

Each component must expose these metrics:

### Features
```
feature_requests_total{feature="...", status="..."}
```

### Don't Stop
```
dont_stop_budget_spent_seconds{job="...", instance="..."}
dont_stop_budget_limit_seconds{job="...", instance="..."}
```

### SVG Inspector
```
svg_inspector_render_duration_seconds_bucket{operation="...", le="..."}
svg_inspector_render_duration_seconds_sum{operation="..."}
svg_inspector_render_duration_seconds_count{operation="..."}
```

### Swarm Sandbox
```
swarm_sandbox_executions_total{sandbox_id="...", region="...", status="..."}
swarm_sandbox_health_status{sandbox_id="...", region="..."}
```

## Alert Severity Levels

| Level | Description | Response Time |
|-------|-------------|---|
| **critical** | Service degradation, immediate action required | 5 minutes |
| **warning** | Threshold exceeded, monitor closely | 15 minutes |

## Slack Integration

Alerts are routed to:
- `#alerts` — General alerts
- `#alerts-critical` — Critical severity only
- `#alerts-warnings` — Warning severity only

Each alert includes:
- Summary and detailed description
- Prometheus link for investigation
- Color-coded urgency (red/orange/green)

## Testing Alerts

### Fire a test alert:
```bash
curl -X POST http://prometheus:9090/api/v1/rules \
  -H "Content-Type: application/json" \
  -d '{"alert_name": "FeatureHighErrorRate"}'
```

### Check alert status:
```bash
curl http://prometheus:9090/api/v1/alerts
```

### Verify Alertmanager connectivity:
```bash
curl http://alertmanager:9093/-/healthy
```

## Monitoring Guidelines

### Feature Error Rate
- Normal: < 1%
- Warning: 1-5%
- Critical: > 5%

Review logs for root causes: failed deployments, external API issues, or resource exhaustion.

### Don't Stop Budget
- Normal: < 50%
- Warning: 50-90%
- Critical: >= 100%

Indicates long-running operations or continuous retries. Adjust timeout or batch processing strategies.

### SVG Inspector Rendering
- Normal: < 5s
- Warning: 5-10s
- Critical: > 10s

Caused by large SVGs, complex transforms, or under-resourced rendering pipeline.

### Swarm Sandbox Failures
- Normal: < 0.5%
- Warning: 0.5-2%
- Critical: > 2%

Indicates sandbox resource constraints, isolation issues, or network problems.

## Tuning

Adjust thresholds in ALERTING_RULES.yaml:
- `expr` — The metric query
- `for` — Duration before alert fires (prevents flapping)
- `severity` — Alert level

Example: Increase feature error threshold to 10%:
```yaml
) > 0.10  # Changed from 0.05
```

Reload Prometheus:
```bash
curl -X POST http://prometheus:9090/-/reload
```
