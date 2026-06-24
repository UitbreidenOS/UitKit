---
description: Generate production-ready Kubernetes manifests for the current application
argument-hint: "[resource-type or app-name] [namespace]"
---
Generate production-ready Kubernetes manifests for: $ARGUMENTS

Inspect the project to determine the workload type (stateless service, worker, CronJob, StatefulSet). Choose the correct resource accordingly.

Output all manifests as separate YAML documents separated by `---` in a single file.

Include these resources:
- `Namespace` if a non-default namespace is specified
- `Deployment` or `StatefulSet` for the primary workload
- `Service` (ClusterIP by default; note when LoadBalancer/NodePort is warranted)
- `ConfigMap` for non-sensitive configuration
- `Secret` with base64-encoded placeholder values and a clear warning to replace before applying
- `HorizontalPodAutoscaler` targeting CPU and memory metrics
- `PodDisruptionBudget` with `minAvailable: 1`
- `Ingress` if the service is HTTP-facing — use nginx ingress class, add TLS stanza with cert-manager annotation

Workload spec requirements:
- `resources.requests` and `resources.limits` for CPU and memory — size based on the detected stack
- `livenessProbe` and `readinessProbe` — HTTP or exec as appropriate; include `initialDelaySeconds` and `failureThreshold`
- Pod-level `securityContext`: `runAsNonRoot: true`, `seccompProfile: RuntimeDefault`
- Container-level `securityContext`: `readOnlyRootFilesystem: true`, `allowPrivilegeEscalation: false`, `capabilities: drop: [ALL]`
- `terminationGracePeriodSeconds` tuned to the app's shutdown behavior
- `topologySpreadConstraints` to spread across nodes and zones
- `app.kubernetes.io/*` standard labels on every resource

After the manifests, output a checklist of items to complete before `kubectl apply`:
1. Replace image tag placeholder with the real digest or semver tag
2. Fill in Secret values (or reference an external secrets operator)
3. Set ingress hostname and TLS secret name
4. Confirm storage class name if using a StatefulSet with PVCs
5. Verify HPA metric names match your metrics-server or Prometheus adapter config
