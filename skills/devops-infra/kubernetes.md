---
name: kubernetes
description: "Kubernetes manifests, resource limits, health probes, secrets, RBAC, HPA, CrashLoopBackOff diagnosis"
updated: 2026-06-13
---

# Kubernetes Skill

## When to activate
- Writing Kubernetes manifests (Deployments, Services, ConfigMaps, Secrets, Ingress)
- Configuring Helm charts or values files for an application
- Debugging a failing Pod, CrashLoopBackOff, or OOMKilled container
- Setting up horizontal pod autoscaling (HPA) or vertical pod autoscaling (VPA)
- Defining resource requests and limits for containers
- Writing or reviewing RBAC policies (Roles, ClusterRoles, RoleBindings)
- Setting up liveness, readiness, and startup probes
- Configuring persistent volumes and persistent volume claims
- Writing network policies to control pod-to-pod traffic
- Setting up namespaces and multi-tenant isolation

## When NOT to use
- Docker Compose setups that aren't being migrated to Kubernetes
- Serverless (Cloud Run, Lambda, Fargate) — different deployment model
- Simple single-container apps that don't need orchestration
- Local development environments where Docker alone suffices
- Nomad, Mesos, or other non-Kubernetes orchestrators

## Instructions

### Manifest structure
Always set these fields in every Deployment:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-name
  namespace: production          # Always explicit — never rely on default namespace
  labels:
    app: app-name
    version: "1.0.0"
spec:
  replicas: 3
  selector:
    matchLabels:
      app: app-name
  template:
    metadata:
      labels:
        app: app-name
        version: "1.0.0"
    spec:
      containers:
        - name: app-name
          image: registry/app-name:tag   # Never use :latest in production
          resources:
            requests:
              cpu: "100m"
              memory: "128Mi"
            limits:
              cpu: "500m"
              memory: "512Mi"
```

### Resource requests and limits
- Always set both `requests` and `limits` — never omit
- `requests` = guaranteed resources (used for scheduling)
- `limits` = maximum allowed (OOMKilled if memory exceeded)
- CPU limits are optional in clusters with CPU throttling disabled — but memory limits are mandatory
- Start conservative: requests at ~25% of expected, limits at 2x expected, then tune with actual metrics

### Health probes
All production containers must have probes:
```yaml
livenessProbe:
  httpGet:
    path: /healthz
    port: 8080
  initialDelaySeconds: 15
  periodSeconds: 20
  failureThreshold: 3

readinessProbe:
  httpGet:
    path: /ready
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 10
  failureThreshold: 3
```
- `livenessProbe` failure → container restart
- `readinessProbe` failure → removed from Service load balancer (no traffic, no restart)
- Never point both at the same endpoint — readiness should check dependencies, liveness should not

### Secrets management
- Never put secrets in ConfigMaps — use Secrets
- Never commit Secret manifests with real values — use sealed-secrets, external-secrets-operator, or Vault
- Reference secrets as env vars, not volumes, unless the app specifically requires file-based secrets:
```yaml
env:
  - name: DATABASE_URL
    valueFrom:
      secretKeyRef:
        name: app-secrets
        key: database-url
```

### Namespace conventions
- `default` namespace: dev/testing only
- Production workloads always in named namespaces
- Use `ResourceQuota` and `LimitRange` on every production namespace
- RBAC: developers get edit in dev namespaces, view in production

### Common CrashLoopBackOff causes and fixes
1. Missing env var → check `kubectl describe pod` Events section
2. Failed healthcheck → logs show the real error, probe just detects it
3. OOMKilled → increase memory limit or fix memory leak
4. Image pull error → check imagePullPolicy and registry credentials
5. Init container failure → `kubectl logs pod-name -c init-container-name`

## Example

**User:** Deploy a FastAPI app with PostgreSQL connection, 3 replicas, resource limits, and health checks.

**Expected output structure:**
- Namespace manifest
- Secret for `DATABASE_URL`
- Deployment with 3 replicas, resource requests/limits, liveness + readiness probes pointing to `/healthz` and `/ready`
- Service (ClusterIP) exposing port 80 → container port 8080
- HorizontalPodAutoscaler targeting 70% CPU utilization, min 3 / max 10 replicas

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities. Building Kubernetes infrastructure or cloud-native AI products? [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
