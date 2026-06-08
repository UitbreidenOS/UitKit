# Kubernetes Rules

## Apply to
All Kubernetes manifests (`*.yaml` in `k8s/`, `manifests/`, `helm/`), Helm charts, and Kustomize overlays.

## Rules

1. **Set `requests` and `limits` on every container** — unset requests cause unpredictable scheduling. Unset limits allow a single pod to starve a node. CPU limit throttling is real; measure and tune.

2. **Never use the `default` namespace for application workloads** — create purpose-specific namespaces (`payments`, `workers`, `monitoring`). The `default` namespace is for exploration, not production.

3. **Set `replicas: 2` minimum for any availability-critical Deployment** — a single replica means a rolling update or eviction causes downtime. Use `PodDisruptionBudget` to prevent simultaneous evictions.

4. **Define `readinessProbe` and `livenessProbe`** — readiness gates traffic. Liveness restarts stuck processes. They are different tools for different failures. Never use a liveness probe for initialization delays — use `startupProbe`.

5. **Pin image tags to immutable SHA digests in production** — `myapp@sha256:abc123` is immutable. `myapp:v1.2.3` is a mutable tag. Use digest pinning via your CI pipeline or tools like `kustomize edit set image`.

6. **Use `RollingUpdate` with `maxUnavailable: 0` for zero-downtime deployments** — default `maxUnavailable: 1` drops traffic during updates. Set `maxSurge: 1` to allow a new pod before the old one terminates.

7. **Store secrets in a secrets manager, not as base64 in manifests** — Kubernetes `Secret` objects are base64, not encrypted, by default in etcd. Use External Secrets Operator, Vault, or AWS Secrets Manager.

8. **Apply `NetworkPolicy` to restrict pod-to-pod traffic** — by default all pods can reach all pods. Namespace-level deny-all + explicit allow rules limits blast radius on compromise.

9. **Use `topologySpreadConstraints` or `podAntiAffinity` for multi-AZ resilience** — scheduling replicas to the same node or AZ defeats the purpose of having multiple replicas.

10. **Label resources consistently** — minimum: `app.kubernetes.io/name`, `app.kubernetes.io/version`, `app.kubernetes.io/component`. Labels are used by selectors, monitoring, and cost allocation.

11. **Set `terminationGracePeriodSeconds` to match your app's shutdown time** — the default 30 seconds is too short for some workloads and too long for others. Set it to shutdown time + buffer.

12. **Use `HorizontalPodAutoscaler` (HPA) for stateless workloads, not manual scaling** — HPA on CPU and custom metrics allows automatic scale-out. Manual replica management doesn't survive load spikes.

13. **Never run containers as root** — set `securityContext.runAsNonRoot: true` and `runAsUser` at the pod or container level. Also set `allowPrivilegeEscalation: false` and `readOnlyRootFilesystem: true` where possible.

14. **Validate manifests in CI before applying** — use `kubeval`, `kube-score`, or `kubectl --dry-run=server`. Catch schema errors and policy violations before they hit the cluster.

15. **Use namespaced RBAC roles, not ClusterRole, unless cluster-wide access is required** — principle of least privilege. A service account for a single namespace should never have cluster-wide read/write.


---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
