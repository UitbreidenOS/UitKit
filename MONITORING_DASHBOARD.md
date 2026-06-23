# Claudient Monitoring Dashboard

**Version:** 1.0 | **Last Updated:** 2026-06-22 | **Scope:** Matrix Theme, SVG Inspector, Swarm Sandbox

Production-grade monitoring for Claudient's 3 core features using Prometheus metrics, Grafana dashboards, alert rules, and SLO/SLI definitions. Deploy via Docker Compose or Kubernetes.

---

## Quick Start

```bash
# Deploy monitoring stack (Docker Compose)
docker-compose -f observability/docker-compose.yml up -d

# Deploy to Kubernetes
kubectl apply -f observability/k8s-monitoring/

# Verify stack
curl http://localhost:9090/metrics  # Prometheus
curl http://localhost:3000/api/health  # Grafana
```

**Dashboards available at:**
- Grafana: http://localhost:3000 (admin/admin)
- Prometheus: http://localhost:9090
- Alertmanager: http://localhost:9093

---

## 1. Grafana Dashboard Definitions

### 1.1 Matrix Theme Dashboard

**Dashboard ID:** `matrix-theme-001`  
**Refresh Rate:** 30s  
**Time Range:** Last 24h (default)

```json
{
  "dashboard": {
    "title": "Matrix Theme Adoption & Performance",
    "id": null,
    "uid": "matrix-theme-001",
    "version": 1,
    "refresh": "30s",
    "time": {"from": "now-24h", "to": "now"},
    "timepicker": {
      "refresh_intervals": ["5s", "10s", "30s", "1m", "5m", "15m", "30m", "1h"]
    },
    "rows": [
      {
        "title": "Matrix Theme Activation Overview",
        "height": 250,
        "panels": [
          {
            "id": 1,
            "title": "Daily Active Users (Matrix)",
            "type": "graph",
            "targets": [
              {
                "expr": "increase(feature_calls_total{skill_name='matrix-theme'}[24h])",
                "legendFormat": "Total Activations"
              }
            ],
            "gridPos": {"h": 8, "w": 12, "x": 0, "y": 0},
            "yaxes": [
              {"format": "short", "label": "Activations"},
              {"format": "short"}
            ]
          },
          {
            "id": 2,
            "title": "Theme Retention (30d Cohort)",
            "type": "stat",
            "targets": [
              {
                "expr": "100 * (feature_calls_total{status='success'} / feature_calls_total)",
                "legendFormat": "Retention %"
              }
            ],
            "gridPos": {"h": 8, "w": 12, "x": 12, "y": 0},
            "thresholds": {
              "mode": "absolute",
              "steps": [
                {"color": "red", "value": null},
                {"color": "yellow", "value": 50},
                {"color": "green", "value": 70}
              ]
            }
          }
        ]
      },
      {
        "title": "Performance Metrics",
        "height": 250,
        "panels": [
          {
            "id": 3,
            "title": "Startup Time Overhead",
            "type": "gauge",
            "targets": [
              {
                "expr": "histogram_quantile(0.95, rate(latency_ms{skill_name='matrix-theme'}[5m]))",
                "legendFormat": "p95 Latency (ms)"
              }
            ],
            "gridPos": {"h": 8, "w": 6, "x": 0, "y": 8},
            "min": 0,
            "max": 500,
            "thresholds": {
              "mode": "absolute",
              "steps": [
                {"color": "green", "value": null},
                {"color": "yellow", "value": 50},
                {"color": "red", "value": 200}
              ]
            }
          },
          {
            "id": 4,
            "title": "Memory Footprint (MB)",
            "type": "gauge",
            "targets": [
              {
                "expr": "memory_usage_bytes{component='theme-renderer'} / 1024 / 1024",
                "legendFormat": "Memory (MB)"
              }
            ],
            "gridPos": {"h": 8, "w": 6, "x": 6, "y": 8},
            "min": 0,
            "max": 100,
            "thresholds": {
              "mode": "absolute",
              "steps": [
                {"color": "green", "value": null},
                {"color": "yellow", "value": 5},
                {"color": "red", "value": 15}
              ]
            }
          },
          {
            "id": 5,
            "title": "Render Lag (% Frame Drops)",
            "type": "gauge",
            "targets": [
              {
                "expr": "100 * (errors_total{skill_name='matrix-theme'} / feature_calls_total{skill_name='matrix-theme'})",
                "legendFormat": "Error Rate %"
              }
            ],
            "gridPos": {"h": 8, "w": 6, "x": 12, "y": 8},
            "min": 0,
            "max": 10,
            "thresholds": {
              "mode": "absolute",
              "steps": [
                {"color": "green", "value": null},
                {"color": "yellow", "value": 2},
                {"color": "red", "value": 5}
              ]
            }
          }
        ]
      },
      {
        "title": "Engagement & Satisfaction",
        "height": 250,
        "panels": [
          {
            "id": 6,
            "title": "Skill Invocation Rate (Matrix vs Baseline)",
            "type": "graph",
            "targets": [
              {
                "expr": "rate(feature_calls_total{skill_category='productivity'}[5m])",
                "legendFormat": "Matrix Sessions"
              },
              {
                "expr": "rate(feature_calls_total{skill_category='backend'}[5m])",
                "legendFormat": "Non-Matrix Sessions"
              }
            ],
            "gridPos": {"h": 8, "w": 12, "x": 0, "y": 16},
            "yaxes": [
              {"format": "reqps", "label": "Invocations/sec"}
            ]
          },
          {
            "id": 7,
            "title": "Support Tickets vs Active Users",
            "type": "graph",
            "targets": [
              {
                "expr": "increase(errors_total{component='matrix-support'}[1d])",
                "legendFormat": "Support Issues"
              }
            ],
            "gridPos": {"h": 8, "w": 12, "x": 12, "y": 16}
          }
        ]
      }
    ],
    "annotations": {
      "list": [
        {
          "datasource": "Prometheus",
          "enable": true,
          "expr": "ALERTS{dashboard='matrix-theme-001'}",
          "name": "Alerts"
        }
      ]
    },
    "templating": {
      "list": [
        {
          "name": "datasource",
          "type": "datasource",
          "datasource": "prometheus",
          "current": {"value": "Prometheus", "text": "Prometheus"}
        }
      ]
    }
  }
}
```

---

### 1.2 SVG Map Generation Dashboard

**Dashboard ID:** `svg-inspector-001`  
**Refresh Rate:** 30s  
**Time Range:** Last 7d (default)

```json
{
  "dashboard": {
    "title": "SVG Map Generation Analytics",
    "id": null,
    "uid": "svg-inspector-001",
    "version": 1,
    "refresh": "30s",
    "time": {"from": "now-7d", "to": "now"},
    "rows": [
      {
        "title": "Adoption & Usage",
        "height": 250,
        "panels": [
          {
            "id": 1,
            "title": "Monthly Map Generations",
            "type": "stat",
            "targets": [
              {
                "expr": "increase(feature_calls_total{skill_name='svg-inspector'}[30d])",
                "legendFormat": "Maps Generated"
              }
            ],
            "gridPos": {"h": 8, "w": 6, "x": 0, "y": 0},
            "thresholds": {
              "mode": "absolute",
              "steps": [
                {"color": "red", "value": null},
                {"color": "yellow", "value": 100},
                {"color": "green", "value": 200}
              ]
            }
          },
          {
            "id": 2,
            "title": "Active Map Users",
            "type": "stat",
            "targets": [
              {
                "expr": "count(count by (user_id) (feature_calls_total{skill_name='svg-inspector'}) >= 1)",
                "legendFormat": "Active Users"
              }
            ],
            "gridPos": {"h": 8, "w": 6, "x": 6, "y": 0},
            "thresholds": {
              "mode": "absolute",
              "steps": [
                {"color": "red", "value": null},
                {"color": "yellow", "value": 10},
                {"color": "green", "value": 25}
              ]
            }
          },
          {
            "id": 3,
            "title": "Avg Maps per Active User",
            "type": "stat",
            "targets": [
              {
                "expr": "increase(feature_calls_total{skill_name='svg-inspector'}[30d]) / count(count by (user_id) (feature_calls_total{skill_name='svg-inspector'}))",
                "legendFormat": "Maps/User"
              }
            ],
            "gridPos": {"h": 8, "w": 6, "x": 12, "y": 0},
            "thresholds": {
              "mode": "absolute",
              "steps": [
                {"color": "red", "value": null},
                {"color": "yellow", "value": 4},
                {"color": "green", "value": 8}
              ]
            }
          }
        ]
      },
      {
        "title": "Generation Quality & Performance",
        "height": 250,
        "panels": [
          {
            "id": 4,
            "title": "Generation Success Rate",
            "type": "gauge",
            "targets": [
              {
                "expr": "100 * (feature_calls_total{skill_name='svg-inspector',status='success'} / feature_calls_total{skill_name='svg-inspector'})",
                "legendFormat": "Success %"
              }
            ],
            "gridPos": {"h": 8, "w": 6, "x": 0, "y": 8},
            "min": 0,
            "max": 100,
            "thresholds": {
              "mode": "absolute",
              "steps": [
                {"color": "red", "value": null},
                {"color": "yellow", "value": 95},
                {"color": "green", "value": 98}
              ]
            }
          },
          {
            "id": 5,
            "title": "Median Generation Time (ms)",
            "type": "gauge",
            "targets": [
              {
                "expr": "histogram_quantile(0.5, rate(latency_ms{operation_type='svg_generation'}[5m]))",
                "legendFormat": "p50 Latency (ms)"
              }
            ],
            "gridPos": {"h": 8, "w": 6, "x": 6, "y": 8},
            "min": 0,
            "max": 5000,
            "thresholds": {
              "mode": "absolute",
              "steps": [
                {"color": "green", "value": null},
                {"color": "yellow", "value": 1500},
                {"color": "red", "value": 3000}
              ]
            }
          },
          {
            "id": 6,
            "title": "Validation Pass Rate",
            "type": "gauge",
            "targets": [
              {
                "expr": "100 * (feature_calls_total{skill_name='svg-inspector',validation='pass'} / feature_calls_total{skill_name='svg-inspector'})",
                "legendFormat": "Pass %"
              }
            ],
            "gridPos": {"h": 8, "w": 6, "x": 12, "y": 8},
            "min": 0,
            "max": 100,
            "thresholds": {
              "mode": "absolute",
              "steps": [
                {"color": "red", "value": null},
                {"color": "yellow", "value": 98},
                {"color": "green", "value": 99.5}
              ]
            }
          }
        ]
      },
      {
        "title": "Latency Distribution & Output Size",
        "height": 250,
        "panels": [
          {
            "id": 7,
            "title": "Generation Latency Percentiles",
            "type": "graph",
            "targets": [
              {
                "expr": "histogram_quantile(0.5, rate(latency_ms{operation_type='svg_generation'}[5m]))",
                "legendFormat": "p50"
              },
              {
                "expr": "histogram_quantile(0.95, rate(latency_ms{operation_type='svg_generation'}[5m]))",
                "legendFormat": "p95"
              },
              {
                "expr": "histogram_quantile(0.99, rate(latency_ms{operation_type='svg_generation'}[5m]))",
                "legendFormat": "p99"
              }
            ],
            "gridPos": {"h": 8, "w": 12, "x": 0, "y": 16},
            "yaxes": [
              {"format": "ms", "label": "Latency"}
            ]
          },
          {
            "id": 8,
            "title": "SVG Output Size Distribution (KB)",
            "type": "graph",
            "targets": [
              {
                "expr": "histogram_quantile(0.5, rate(api_response_size_bytes{endpoint='/svg'}[5m])) / 1024",
                "legendFormat": "p50 Size (KB)"
              },
              {
                "expr": "histogram_quantile(0.95, rate(api_response_size_bytes{endpoint='/svg'}[5m])) / 1024",
                "legendFormat": "p95 Size (KB)"
              }
            ],
            "gridPos": {"h": 8, "w": 12, "x": 12, "y": 16},
            "yaxes": [
              {"format": "short", "label": "Kilobytes"}
            ]
          }
        ]
      },
      {
        "title": "User Outcomes",
        "height": 250,
        "panels": [
          {
            "id": 9,
            "title": "Map Reuse & Export Rate",
            "type": "graph",
            "targets": [
              {
                "expr": "rate(feature_calls_total{skill_name='svg-inspector',action='regenerate'}[1d])",
                "legendFormat": "Regenerations/day"
              },
              {
                "expr": "rate(feature_calls_total{skill_name='svg-inspector',action='export'}[1d])",
                "legendFormat": "Exports/day"
              }
            ],
            "gridPos": {"h": 8, "w": 12, "x": 0, "y": 24},
            "yaxes": [
              {"format": "ops", "label": "Events/day"}
            ]
          },
          {
            "id": 10,
            "title": "Documentation Integration Rate",
            "type": "stat",
            "targets": [
              {
                "expr": "increase(feature_calls_total{skill_name='svg-inspector',action='embed'}[30d])",
                "legendFormat": "Embedded in Docs"
              }
            ],
            "gridPos": {"h": 8, "w": 12, "x": 12, "y": 24},
            "thresholds": {
              "mode": "absolute",
              "steps": [
                {"color": "red", "value": null},
                {"color": "yellow", "value": 20},
                {"color": "green", "value": 60}
              ]
            }
          }
        ]
      }
    ]
  }
}
```

---

### 1.3 Swarm Sandbox Execution Dashboard

**Dashboard ID:** `swarm-sandbox-001`  
**Refresh Rate:** 1m  
**Time Range:** Last 24h (default)

```json
{
  "dashboard": {
    "title": "Swarm Sandbox Execution & Performance",
    "id": null,
    "uid": "swarm-sandbox-001",
    "version": 1,
    "refresh": "1m",
    "time": {"from": "now-24h", "to": "now"},
    "rows": [
      {
        "title": "Execution Overview",
        "height": 250,
        "panels": [
          {
            "id": 1,
            "title": "Daily Sandbox Executions",
            "type": "stat",
            "targets": [
              {
                "expr": "increase(feature_calls_total{skill_name='swarm-sandbox'}[24h])",
                "legendFormat": "Executions"
              }
            ],
            "gridPos": {"h": 8, "w": 6, "x": 0, "y": 0},
            "thresholds": {
              "mode": "absolute",
              "steps": [
                {"color": "red", "value": null},
                {"color": "yellow", "value": 25},
                {"color": "green", "value": 50}
              ]
            }
          },
          {
            "id": 2,
            "title": "Success Rate (24h)",
            "type": "gauge",
            "targets": [
              {
                "expr": "100 * (feature_calls_total{skill_name='swarm-sandbox',status='success'} / feature_calls_total{skill_name='swarm-sandbox'})",
                "legendFormat": "Success %"
              }
            ],
            "gridPos": {"h": 8, "w": 6, "x": 6, "y": 0},
            "min": 0,
            "max": 100,
            "thresholds": {
              "mode": "absolute",
              "steps": [
                {"color": "red", "value": null},
                {"color": "yellow", "value": 95},
                {"color": "green", "value": 99}
              ]
            }
          },
          {
            "id": 3,
            "title": "Avg Agents per Execution",
            "type": "stat",
            "targets": [
              {
                "expr": "avg(active_tasks{task_type='swarm_agent'})",
                "legendFormat": "Avg Agents"
              }
            ],
            "gridPos": {"h": 8, "w": 6, "x": 12, "y": 0},
            "thresholds": {
              "mode": "absolute",
              "steps": [
                {"color": "red", "value": null},
                {"color": "yellow", "value": 2},
                {"color": "green", "value": 5}
              ]
            }
          }
        ]
      },
      {
        "title": "Execution Performance",
        "height": 250,
        "panels": [
          {
            "id": 4,
            "title": "End-to-End Execution Time (p50, p95, p99)",
            "type": "graph",
            "targets": [
              {
                "expr": "histogram_quantile(0.5, rate(workflow_duration_ms{workflow_name='swarm-sandbox'}[5m]))",
                "legendFormat": "p50 (ms)"
              },
              {
                "expr": "histogram_quantile(0.95, rate(workflow_duration_ms{workflow_name='swarm-sandbox'}[5m]))",
                "legendFormat": "p95 (ms)"
              },
              {
                "expr": "histogram_quantile(0.99, rate(workflow_duration_ms{workflow_name='swarm-sandbox'}[5m]))",
                "legendFormat": "p99 (ms)"
              }
            ],
            "gridPos": {"h": 8, "w": 12, "x": 0, "y": 8},
            "yaxes": [
              {"format": "ms", "label": "Duration"}
            ]
          },
          {
            "id": 5,
            "title": "Agent Concurrency & Active Tasks",
            "type": "graph",
            "targets": [
              {
                "expr": "active_tasks{task_type='swarm_agent',status='in_progress'}",
                "legendFormat": "Active Agents"
              },
              {
                "expr": "active_tasks{task_type='swarm_agent',status='pending'}",
                "legendFormat": "Pending Agents"
              },
              {
                "expr": "active_tasks{task_type='swarm_agent',status='blocked'}",
                "legendFormat": "Blocked Agents"
              }
            ],
            "gridPos": {"h": 8, "w": 12, "x": 12, "y": 8},
            "yaxes": [
              {"format": "short", "label": "Task Count"}
            ]
          }
        ]
      },
      {
        "title": "Resource Utilization",
        "height": 250,
        "panels": [
          {
            "id": 6,
            "title": "Memory Usage by Component",
            "type": "graph",
            "targets": [
              {
                "expr": "memory_usage_bytes{component='swarm_engine'} / 1024 / 1024 / 1024",
                "legendFormat": "Swarm Engine (GB)"
              },
              {
                "expr": "memory_usage_bytes{component='agent_pool'} / 1024 / 1024 / 1024",
                "legendFormat": "Agent Pool (GB)"
              },
              {
                "expr": "memory_usage_bytes{component='context_cache'} / 1024 / 1024 / 1024",
                "legendFormat": "Context Cache (GB)"
              }
            ],
            "gridPos": {"h": 8, "w": 12, "x": 0, "y": 16},
            "yaxes": [
              {"format": "short", "label": "Gigabytes"}
            ]
          },
          {
            "id": 7,
            "title": "Queue Length & Backpressure",
            "type": "graph",
            "targets": [
              {
                "expr": "queue_length{queue_name='api_requests'}",
                "legendFormat": "API Queue"
              },
              {
                "expr": "queue_length{queue_name='workflows'}",
                "legendFormat": "Workflow Queue"
              },
              {
                "expr": "queue_length{queue_name='swarm_tasks'}",
                "legendFormat": "Swarm Task Queue"
              }
            ],
            "gridPos": {"h": 8, "w": 12, "x": 12, "y": 16},
            "yaxes": [
              {"format": "short", "label": "Queue Depth"}
            ]
          }
        ]
      },
      {
        "title": "Error & Failure Analysis",
        "height": 250,
        "panels": [
          {
            "id": 8,
            "title": "Error Types in Sandbox Execution",
            "type": "graph",
            "targets": [
              {
                "expr": "increase(errors_total{component='swarm_sandbox',error_type='timeout'}[1h])",
                "legendFormat": "Timeouts"
              },
              {
                "expr": "increase(errors_total{component='swarm_sandbox',error_type='permission'}[1h])",
                "legendFormat": "Permission Errors"
              },
              {
                "expr": "increase(errors_total{component='swarm_sandbox',error_type='runtime'}[1h])",
                "legendFormat": "Runtime Errors"
              },
              {
                "expr": "increase(errors_total{component='swarm_sandbox',error_type='validation'}[1h])",
                "legendFormat": "Validation Errors"
              }
            ],
            "gridPos": {"h": 8, "w": 12, "x": 0, "y": 24},
            "yaxes": [
              {"format": "short", "label": "Error Count/hour"}
            ]
          },
          {
            "id": 9,
            "title": "Context Window Utilization (%)",
            "type": "gauge",
            "targets": [
              {
                "expr": "model_context_utilization{model_id='claude-haiku-4-5',context_type='input'}",
                "legendFormat": "Input Context %"
              }
            ],
            "gridPos": {"h": 8, "w": 12, "x": 12, "y": 24},
            "min": 0,
            "max": 100,
            "thresholds": {
              "mode": "absolute",
              "steps": [
                {"color": "green", "value": null},
                {"color": "yellow", "value": 70},
                {"color": "red", "value": 90}
              ]
            }
          }
        ]
      }
    ]
  }
}
```

---

## 2. Prometheus Alert Rules

Alert rules in YAML format (Prometheus & AlertManager).

### 2.1 Matrix Theme Alerts

```yaml
groups:
  - name: matrix_theme_alerts
    interval: 30s
    rules:
      - alert: MatrixThemeHighLatency
        expr: histogram_quantile(0.95, rate(latency_ms{skill_name='matrix-theme'}[5m])) > 200
        for: 5m
        labels:
          severity: warning
          feature: matrix_theme
        annotations:
          summary: "Matrix theme startup latency elevated"
          description: "p95 latency: {{ $value }}ms (target: <200ms)"

      - alert: MatrixThemeHighErrorRate
        expr: |
          (increase(errors_total{skill_name='matrix-theme'}[5m]) / 
           increase(feature_calls_total{skill_name='matrix-theme'}[5m])) > 0.05
        for: 5m
        labels:
          severity: warning
          feature: matrix_theme
        annotations:
          summary: "Matrix theme error rate above 5%"
          description: "Error rate: {{ $value | humanizePercentage }}"

      - alert: MatrixThemeMemoryLeak
        expr: |
          (memory_usage_bytes{component='theme-renderer'} - 
           memory_usage_bytes{component='theme-renderer'} offset 1h) > 5242880
        for: 30m
        labels:
          severity: high
          feature: matrix_theme
        annotations:
          summary: "Potential memory leak in Matrix theme renderer"
          description: "Memory increased {{ $value | humanize }}B in 1 hour"

      - alert: MatrixThemeUnavailable
        expr: skill_availability{skill_name='matrix-theme'} == 0
        for: 1m
        labels:
          severity: critical
          feature: matrix_theme
        annotations:
          summary: "Matrix theme feature unavailable"
          description: "Matrix theme failed to load: {{ $labels.unavailability_reason }}"

      - alert: MatrixThemeLowAdoption
        expr: |
          increase(feature_calls_total{skill_name='matrix-theme'}[24h]) < 10
        for: 1h
        labels:
          severity: info
          feature: matrix_theme
        annotations:
          summary: "Matrix theme adoption unexpectedly low"
          description: "Only {{ $value }} activations in last 24 hours"
```

### 2.2 SVG Inspector Alerts

```yaml
groups:
  - name: svg_inspector_alerts
    interval: 30s
    rules:
      - alert: SVGGenerationSuccessRateLow
        expr: |
          (feature_calls_total{skill_name='svg-inspector',status='success'} / 
           feature_calls_total{skill_name='svg-inspector'}) < 0.98
        for: 10m
        labels:
          severity: warning
          feature: svg_inspector
        annotations:
          summary: "SVG map generation success rate below 98%"
          description: "Success rate: {{ $value | humanizePercentage }} (target: ≥98%)"

      - alert: SVGGenerationLatencyHigh
        expr: |
          histogram_quantile(0.95, rate(latency_ms{operation_type='svg_generation'}[5m])) > 5000
        for: 10m
        labels:
          severity: warning
          feature: svg_inspector
        annotations:
          summary: "SVG generation p95 latency exceeds 5 seconds"
          description: "p95 latency: {{ $value | humanizeDuration }}s"

      - alert: SVGValidationFailureRate
        expr: |
          (increase(errors_total{skill_name='svg-inspector',error_type='validation'}[1h]) / 
           increase(feature_calls_total{skill_name='svg-inspector'}[1h])) > 0.01
        for: 5m
        labels:
          severity: warning
          feature: svg_inspector
        annotations:
          summary: "SVG validation failures exceed 1%"
          description: "Validation fail rate: {{ $value | humanizePercentage }}"

      - alert: SVGOutputSizeExceeded
        expr: |
          histogram_quantile(0.95, rate(api_response_size_bytes{endpoint='/svg'}[5m])) > 524288000
        for: 5m
        labels:
          severity: warning
          feature: svg_inspector
        annotations:
          summary: "SVG output size exceeding limits (p95 > 500MB)"
          description: "p95 size: {{ $value | humanize }}B"

      - alert: SVGDependencyTimeout
        expr: |
          increase(errors_total{skill_name='svg-inspector',error_type='timeout'}[1h]) > 5
        for: 5m
        labels:
          severity: high
          feature: svg_inspector
        annotations:
          summary: "Excessive SVG generation timeouts"
          description: "{{ $value }} timeouts in the last hour"

      - alert: SVGInputParsingLatency
        expr: |
          histogram_quantile(0.99, rate(input_parsing_duration_ms{parser_type='svg'}[5m])) > 500
        for: 10m
        labels:
          severity: warning
          feature: svg_inspector
        annotations:
          summary: "SVG input parsing latency high (p99 > 500ms)"
          description: "p99 parsing time: {{ $value }}ms"
```

### 2.3 Swarm Sandbox Alerts

```yaml
groups:
  - name: swarm_sandbox_alerts
    interval: 1m
    rules:
      - alert: SwarmSandboxExecutionFailureRate
        expr: |
          (feature_calls_total{skill_name='swarm-sandbox',status='error'} / 
           feature_calls_total{skill_name='swarm-sandbox'}) > 0.02
        for: 10m
        labels:
          severity: warning
          feature: swarm_sandbox
        annotations:
          summary: "Swarm sandbox failure rate above 2%"
          description: "Failure rate: {{ $value | humanizePercentage }}"

      - alert: SwarmSandboxHighLatency
        expr: |
          histogram_quantile(0.95, rate(workflow_duration_ms{workflow_name='swarm-sandbox'}[5m])) > 300000
        for: 15m
        labels:
          severity: warning
          feature: swarm_sandbox
        annotations:
          summary: "Swarm sandbox p95 execution time exceeds 5 minutes"
          description: "p95 duration: {{ $value | humanizeDuration }}"

      - alert: SwarmSandboxMemoryPressure
        expr: |
          (memory_usage_bytes{component='swarm_engine'} / 1073741824) > 4
        for: 5m
        labels:
          severity: high
          feature: swarm_sandbox
        annotations:
          summary: "Swarm engine memory usage exceeds 4GB"
          description: "Current usage: {{ $value | humanize }}GB"

      - alert: SwarmSandboxQueueBacklog
        expr: |
          queue_length{queue_name='swarm_tasks'} > 500
        for: 5m
        labels:
          severity: critical
          feature: swarm_sandbox
        annotations:
          summary: "Swarm sandbox task queue backlog critical"
          description: "Queue depth: {{ $value }} tasks"

      - alert: SwarmSandboxAgentTimeout
        expr: |
          increase(errors_total{component='swarm_sandbox',error_type='timeout'}[1h]) > 10
        for: 5m
        labels:
          severity: high
          feature: swarm_sandbox
        annotations:
          summary: "Excessive agent timeouts in swarm sandbox"
          description: "{{ $value }} timeouts in the last hour"

      - alert: SwarmSandboxContextExhaustion
        expr: |
          model_context_utilization{context_type='input'} > 90
        for: 5m
        labels:
          severity: critical
          feature: swarm_sandbox
        annotations:
          summary: "Model context window approaching exhaustion"
          description: "Context utilization: {{ $value }}%"

      - alert: SwarmSandboxMCPCallFailure
        expr: |
          (increase(mcp_calls_total{invocation_status='error'}[5m]) / 
           increase(mcp_calls_total[5m])) > 0.05
        for: 5m
        labels:
          severity: warning
          feature: swarm_sandbox
        annotations:
          summary: "MCP integration errors in swarm sandbox"
          description: "MCP error rate: {{ $value | humanizePercentage }}"

      - alert: SwarmSandboxTokenBudget
        expr: |
          increase(tokens_processed_total[1h]) > 1000000000
        for: 10m
        labels:
          severity: critical
          feature: swarm_sandbox
        annotations:
          summary: "Token consumption rate exceeds budget"
          description: "Tokens in last hour: {{ $value | humanize }}"
```

---

## 3. SLO & SLI Definitions

### 3.1 Matrix Theme SLOs

| SLI | Definition | Target (SLO) | Measurement | Error Budget |
|-----|-----------|--------------|-------------|--------------|
| **Availability** | Uptime % (1 - (errors/total)) | 99.9% | Prometheus alert tracking | 43.2 min/month |
| **Latency (p95)** | Response time p95 < 200ms | 95% of requests | histogram_quantile(0.95) | 2.4 hours/month |
| **Success Rate** | Successful activations % | 98% of all calls | feature_calls_total{status='success'} | 14.4 min/month |
| **Error Rate** | Errors per 1000 calls | < 5 | errors_total / feature_calls_total | N/A |

**Error Budget per Month:**
- Availability budget: 6 minutes 48 seconds
- Latency budget: 3 hours
- Success budget: 14 minutes 24 seconds

### 3.2 SVG Inspector SLOs

| SLI | Definition | Target (SLO) | Measurement | Error Budget |
|-----|-----------|--------------|-------------|--------------|
| **Availability** | Feature uptime % | 99.5% | skill_availability{skill_name='svg-inspector'} | 3.6 hours/month |
| **Success Rate** | Generation success % | 98% of operations | feature_calls_total{status='success'} | 14.4 min/month |
| **Latency (p50)** | Median generation time < 1.5s | 90% percentile | histogram_quantile(0.5) | 2.4 hours/month |
| **Latency (p99)** | 99th percentile < 5s | 99% percentile | histogram_quantile(0.99) | 43.2 min/month |
| **Validation Pass** | Schema validation pass rate | 99.5% | feature_calls_total{validation='pass'} | 3.6 hours/month |

**Error Budget per Month:**
- Availability budget: 3 hours 36 minutes
- Success budget: 14 minutes 24 seconds
- Latency (p50) budget: 2 hours 24 minutes
- Validation budget: 3 hours 36 minutes

### 3.3 Swarm Sandbox SLOs

| SLI | Definition | Target (SLO) | Measurement | Error Budget |
|-----|-----------|--------------|-------------|--------------|
| **Availability** | Execution uptime % | 99.5% | skill_availability{skill_name='swarm-sandbox'} | 3.6 hours/month |
| **Success Rate** | Successful executions % | 99% of workflows | workflow_executions_total{result='success'} | 7.2 min/month |
| **Latency (p95)** | End-to-end time p95 < 5min | 95% of runs | histogram_quantile(0.95, workflow_duration_ms) | 2.4 hours/month |
| **Agent Reliability** | Agent completion without timeout | 98% of agents | 1 - (errors_total{error_type='timeout'} / active_tasks) | 14.4 min/month |
| **Context Efficiency** | Context util. < 85% | 99% of time | model_context_utilization < 85 | 7.2 min/month |

**Error Budget per Month:**
- Availability budget: 3 hours 36 minutes
- Success budget: 7 minutes 12 seconds
- Latency budget: 2 hours 24 minutes
- Agent reliability: 14 minutes 24 seconds

---

## 4. Docker Compose Deployment

**File:** `observability/docker-compose.yml`

```yaml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    container_name: claudient-prometheus
    volumes:
      - ./observability/prometheus.yml:/etc/prometheus/prometheus.yml
      - ./observability/alert-rules.yml:/etc/prometheus/alert-rules.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/usr/share/prometheus/console_libraries'
      - '--web.console.templates=/usr/share/prometheus/consoles'
    ports:
      - "9090:9090"
    networks:
      - monitoring

  alertmanager:
    image: prom/alertmanager:latest
    container_name: claudient-alertmanager
    volumes:
      - ./observability/alertmanager.yml:/etc/alertmanager/alertmanager.yml
      - alertmanager_data:/alertmanager
    command:
      - '--config.file=/etc/alertmanager/alertmanager.yml'
      - '--storage.path=/alertmanager'
    ports:
      - "9093:9093"
    networks:
      - monitoring

  grafana:
    image: grafana/grafana:latest
    container_name: claudient-grafana
    environment:
      GF_SECURITY_ADMIN_USER: admin
      GF_SECURITY_ADMIN_PASSWORD: admin
      GF_INSTALL_PLUGINS: grafana-piechart-panel,grafana-clock-panel
    volumes:
      - grafana_data:/var/lib/grafana
      - ./observability/grafana/provisioning/dashboards:/etc/grafana/provisioning/dashboards
      - ./observability/grafana/provisioning/datasources:/etc/grafana/provisioning/datasources
    ports:
      - "3000:3000"
    depends_on:
      - prometheus
    networks:
      - monitoring

  node-exporter:
    image: prom/node-exporter:latest
    container_name: claudient-node-exporter
    ports:
      - "9100:9100"
    networks:
      - monitoring

volumes:
  prometheus_data:
  alertmanager_data:
  grafana_data:

networks:
  monitoring:
    driver: bridge
```

---

## 5. Prometheus Configuration

**File:** `observability/prometheus.yml`

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s
  external_labels:
    cluster: 'claudient-prod'
    environment: 'production'

alerting:
  alertmanagers:
    - static_configs:
        - targets: ['alertmanager:9093']

rule_files:
  - '/etc/prometheus/alert-rules.yml'

scrape_configs:
  - job_name: 'claudient-api'
    static_configs:
      - targets: ['localhost:8000']
    relabel_configs:
      - source_labels: [__address__]
        target_label: instance
        replacement: 'api-server'

  - job_name: 'skill-engine'
    static_configs:
      - targets: ['localhost:8001']
    scrape_interval: 10s

  - job_name: 'workflow-engine'
    static_configs:
      - targets: ['localhost:8002']
    scrape_interval: 10s

  - job_name: 'mcp-gateway'
    static_configs:
      - targets: ['localhost:8003']
    scrape_interval: 10s

  - job_name: 'node'
    static_configs:
      - targets: ['node-exporter:9100']
    relabel_configs:
      - source_labels: [__address__]
        target_label: instance
        replacement: 'monitoring-node'

  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
```

---

## 6. AlertManager Configuration

**File:** `observability/alertmanager.yml`

```yaml
global:
  resolve_timeout: 5m
  slack_api_url: '${SLACK_WEBHOOK_URL}'

route:
  receiver: 'default'
  group_by: ['alertname', 'cluster', 'feature']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 12h
  routes:
    - match:
        severity: 'critical'
      receiver: 'pagerduty'
      repeat_interval: 5m
    - match:
        feature: 'matrix_theme'
      receiver: 'matrix-theme-team'
      group_wait: 5s
    - match:
        feature: 'svg_inspector'
      receiver: 'svg-inspector-team'
    - match:
        feature: 'swarm_sandbox'
      receiver: 'swarm-sandbox-team'

receivers:
  - name: 'default'
    slack_configs:
      - channel: '#claudient-alerts'
        title: 'Claudient Alert: {{ .GroupLabels.alertname }}'
        text: '{{ range .Alerts }}{{ .Annotations.description }}{{ end }}'

  - name: 'pagerduty'
    pagerduty_configs:
      - service_key: '${PAGERDUTY_SERVICE_KEY}'
        description: '{{ .GroupLabels.alertname }}'

  - name: 'matrix-theme-team'
    slack_configs:
      - channel: '#matrix-theme-alerts'
        title: 'Matrix Theme: {{ .GroupLabels.alertname }}'
        text: '{{ range .Alerts }}{{ .Annotations.summary }}\n{{ end }}'

  - name: 'svg-inspector-team'
    slack_configs:
      - channel: '#svg-inspector-alerts'
        title: 'SVG Inspector: {{ .GroupLabels.alertname }}'

  - name: 'swarm-sandbox-team'
    slack_configs:
      - channel: '#swarm-sandbox-alerts'
        title: 'Swarm Sandbox: {{ .GroupLabels.alertname }}'
```

---

## 7. Kubernetes Deployment

**File:** `observability/k8s-monitoring/kustomization.yaml`

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
  - prometheus-configmap.yaml
  - prometheus-deployment.yaml
  - prometheus-service.yaml
  - alertmanager-configmap.yaml
  - alertmanager-deployment.yaml
  - alertmanager-service.yaml
  - grafana-deployment.yaml
  - grafana-service.yaml

namespace: monitoring
namePrefix: claudient-

commonLabels:
  app: claudient-monitoring
  version: "1.0"
```

---

## 8. Getting Started

### Installation

```bash
# Clone & navigate
git clone https://github.com/UitbreidenOS/Claudient.git
cd Claudient

# Start Docker Compose stack
docker-compose -f observability/docker-compose.yml up -d

# Wait for services to be ready
sleep 30

# Verify
curl http://localhost:9090/api/v1/status/rtscts
curl http://localhost:3000/api/health
```

### Accessing Dashboards

1. **Grafana** (http://localhost:3000)
   - Admin user: `admin` / `admin`
   - Import dashboards from JSON files in `observability/grafana/dashboards/`

2. **Prometheus** (http://localhost:9090)
   - Query metrics directly
   - View scrape targets and alert status
   - Query language: PromQL

3. **AlertManager** (http://localhost:9093)
   - View active alerts and firing rules
   - Manage alert grouping and routing

### Configuration

Customize monitoring via environment variables:

```bash
# Slack integration
export SLACK_WEBHOOK_URL="https://hooks.slack.com/..."

# PagerDuty integration
export PAGERDUTY_SERVICE_KEY="xxx"

# Restart services to apply
docker-compose restart
```

---

## 9. Operational Runbooks

### High Latency Alert (Matrix Theme)

**Alert:** `MatrixThemeHighLatency`

1. Check Grafana dashboard: "Matrix Theme Adoption & Performance"
2. Correlate with: system load, API calls, memory usage
3. Actions:
   - Scale horizontally if CPU-bound
   - Clear cache if memory pressure
   - Review recent code changes in `site/src/components/os/apps/CliApp.tsx`
4. Escalate if persists > 30 minutes

### SVG Generation Failure

**Alert:** `SVGGenerationSuccessRateLow`

1. Check recent SVG generation attempts in Prometheus
2. Review error types: validation, timeout, runtime
3. Actions:
   - Restart SVG generator service
   - Check input size distribution
   - Review MCP dependencies
4. Investigate if input validation rule changed

### Swarm Sandbox Queue Backlog

**Alert:** `SwarmSandboxQueueBacklog`

1. Check active tasks and queue depth in Grafana
2. Review workflow execution times (p95)
3. Actions:
   - Scale agent pool horizontally
   - Reduce workflow complexity (split into smaller tasks)
   - Check for stuck agents (review logs)
4. Monitor token consumption for budget exhaustion

---

## 10. Metric Export & API

### Export Metrics to S3

```bash
# Automated daily export
docker run --rm \
  -v ~/.aws/credentials:/root/.aws/credentials \
  prom/prometheus:latest \
  /bin/prometheus \
    --config.file=/etc/prometheus/prometheus.yml \
    --storage.tsdb.path=/prometheus \
    --remote-write-url=s3://claudient-metrics/prometheus/
```

### Query Metrics API

```bash
# Current metric value
curl 'http://localhost:9090/api/v1/query?query=feature_calls_total'

# Metric range (last 1 hour)
curl 'http://localhost:9090/api/v1/query_range?query=feature_calls_total&start=1623369600&end=1623373200&step=60'

# Alert status
curl 'http://localhost:9090/api/v1/alerts'
```

---

## Maintenance & Retention

- **Raw metrics:** 15 days
- **1h aggregation:** 90 days
- **1d aggregation:** 1 year
- **Cardinality cleanup:** Daily at 2 AM UTC

Monitor disk space for Prometheus:

```bash
df -h /prometheus
du -sh /prometheus/wal
```

---

**Support:** [GitHub Issues](https://github.com/UitbreidenOS/Claudient/issues) · [Discussions](https://github.com/UitbreidenOS/Claudient/discussions)
