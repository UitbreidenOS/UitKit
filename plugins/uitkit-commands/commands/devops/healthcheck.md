---
description: Add or audit health check endpoints and probe configurations for the current service
argument-hint: "[service name or file path]"
---
Add or audit health check coverage for: $ARGUMENTS

Inspect the project to identify the framework, server type, and existing health check implementations.

**If no health endpoints exist — implement them:**

Generate the minimal code to add:
1. `GET /healthz` (liveness) — returns `200 OK` with `{"status":"ok"}` if the process is alive; no dependency checks
2. `GET /readyz` (readiness) — returns `200 OK` only if all critical dependencies (DB, cache, downstream services) are reachable; returns `503` with a JSON body listing which checks failed
3. `GET /metrics` — Prometheus-compatible exposition if the framework supports it (otherwise note what's needed)

Implementation rules:
- Both endpoints must respond in under 100ms under normal load
- `/readyz` dependency checks must have timeouts (default 2s per check) — never block indefinitely
- Do not require authentication on `/healthz` or `/readyz` — probes must be unauthenticated
- Log failures at WARN level, not ERROR — probe failures are operational signals, not application errors
- For `/readyz` DB check: use a lightweight query (`SELECT 1`) not a schema introspection

**If health endpoints already exist — audit them:**

Check for:
- Liveness vs readiness conflation (a liveness probe that checks DB will restart pods on DB outage — wrong)
- Missing timeout on dependency checks
- Endpoints that return 200 with an error body (breaks all probes)
- Probe configs in Kubernetes/Compose that are too aggressive (`failureThreshold: 1`) or too lenient (no `initialDelaySeconds`)

**In all cases, output the corresponding probe config for each deployment target found in the project:**

Kubernetes:
```yaml
livenessProbe:
  httpGet: { path: /healthz, port: <port> }
  initialDelaySeconds: 10
  periodSeconds: 15
  failureThreshold: 3

readinessProbe:
  httpGet: { path: /readyz, port: <port> }
  initialDelaySeconds: 5
  periodSeconds: 10
  failureThreshold: 3
```

Docker Compose:
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:<port>/healthz"]
  interval: 15s
  timeout: 5s
  retries: 3
  start_period: 10s
```

Flag anything that would cause false-positive restarts or silent readiness failures.
