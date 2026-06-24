---
description: Generate a Helm chart scaffold for the current application
argument-hint: "[app-name] [optional: chart-type=app|library]"
---
Generate a Helm chart for: $ARGUMENTS

Inspect the project to infer the application type, exposed ports, and any required backing services.

Produce the full chart directory structure:
```
charts/<app-name>/
  Chart.yaml
  values.yaml
  values-prod.yaml
  templates/
    _helpers.tpl
    deployment.yaml
    service.yaml
    ingress.yaml
    configmap.yaml
    secret.yaml
    hpa.yaml
    serviceaccount.yaml
    NOTES.txt
```

Requirements per file:

`Chart.yaml`:
- `apiVersion: v2`, correct `type` (application or library), semver `version` starting at `0.1.0`, `appVersion` as a placeholder

`values.yaml`:
- Top-level keys: `replicaCount`, `image` (repository/tag/pullPolicy), `service`, `ingress`, `resources`, `autoscaling`, `env`, `secrets`, `podAnnotations`, `nodeSelector`, `tolerations`, `affinity`
- All values must be valid defaults that produce a deployable chart without modification

`templates/deployment.yaml`:
- Use `_helpers.tpl` for name/label helpers — no raw `.Release.Name` inline
- `checksum/config` annotation on the pod template so rollouts trigger on ConfigMap changes
- `livenessProbe` and `readinessProbe` — paths from `values.yaml`
- Full `securityContext` at pod and container level: `runAsNonRoot`, `readOnlyRootFilesystem`, `allowPrivilegeEscalation: false`, drop all capabilities
- `resources` from values with no hardcoded limits

`ingress.yaml`:
- Conditional on `ingress.enabled`
- Support both `networking.k8s.io/v1` and legacy annotation patterns
- TLS block conditional on `ingress.tls`

`NOTES.txt`: post-install instructions showing the exact command to get the service URL

After the chart, output:
1. `helm lint` command to validate
2. `helm template . | kubectl apply --dry-run=client -f -` command to preview
3. The minimal `helmfile.yaml` entry to deploy this chart to a cluster
