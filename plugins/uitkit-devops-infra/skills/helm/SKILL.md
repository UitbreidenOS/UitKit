---
name: "helm"
description: "Helm chart authoring and management: write charts from scratch, template best practices, values overrides, chart testing with helm-unittest, and Helmfile for multi-chart deployments"
---

# Helm Skill

## When to activate
- Writing a Helm chart for a service that needs to be deployed on Kubernetes
- Packaging an existing Kubernetes manifest set into a Helm chart
- Configuring values overrides for different environments (dev/staging/prod)
- Testing Helm charts before deployment
- Managing multiple charts with Helmfile

## When NOT to use
- Raw Kubernetes manifests without packaging — use the kubernetes skill
- Kubernetes cluster setup — use Terraform or the cloud architect skills
- CI/CD pipeline configuration — use the cicd skill

## Instructions

### Chart structure

```
Create a Helm chart for [service].

Service: [describe — web API / worker / cron job / stateful service]
Kubernetes resources needed: [Deployment / Service / Ingress / ConfigMap / Secret / HPA]

Helm chart directory structure:
my-service/
  Chart.yaml           ← chart metadata
  values.yaml          ← default configuration values
  templates/
    deployment.yaml    ← Deployment template
    service.yaml       ← Service template
    ingress.yaml       ← Ingress (if needed)
    configmap.yaml     ← ConfigMap (if needed)
    hpa.yaml           ← HorizontalPodAutoscaler (if needed)
    _helpers.tpl       ← shared template helpers
  charts/              ← chart dependencies
  .helmignore          ← files to exclude from chart package

# Chart.yaml
apiVersion: v2
name: my-service
description: A Helm chart for my-service
type: application
version: 0.1.0     # chart version
appVersion: "1.0.0"  # application version

Generate the chart structure for my service.
```

### Deployment template

```
Write Helm templates for [service].

Service type: [web app / worker / cron]
Config: [env vars / secrets / volumes needed]

# templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "my-service.fullname" . }}
  labels:
    {{- include "my-service.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      {{- include "my-service.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "my-service.selectorLabels" . | nindent 8 }}
      annotations:
        checksum/config: {{ include (print $.Template.BasePath "/configmap.yaml") . | sha256sum }}
    spec:
      containers:
        - name: {{ .Chart.Name }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.AppVersion }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          ports:
            - containerPort: {{ .Values.service.port }}
          env:
            {{- range .Values.env }}
            - name: {{ .name }}
              value: {{ .value | quote }}
            {{- end }}
            {{- range .Values.envFromSecret }}
            - name: {{ .name }}
              valueFrom:
                secretKeyRef:
                  name: {{ .secretName }}
                  key: {{ .secretKey }}
            {{- end }}
          resources:
            {{- toYaml .Values.resources | nindent 12 }}
          livenessProbe:
            httpGet:
              path: {{ .Values.probes.liveness.path }}
              port: {{ .Values.service.port }}
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: {{ .Values.probes.readiness.path }}
              port: {{ .Values.service.port }}
            initialDelaySeconds: 5
            periodSeconds: 5

# templates/_helpers.tpl
{{- define "my-service.fullname" -}}
{{- printf "%s-%s" .Release.Name .Chart.Name | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "my-service.labels" -}}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version }}
app.kubernetes.io/name: {{ .Chart.Name }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}

{{- define "my-service.selectorLabels" -}}
app.kubernetes.io/name: {{ .Chart.Name }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
```

### Values file

```
Write a values.yaml for [service] with environment overrides.

Environments: [dev / staging / prod]

# values.yaml (defaults — safe for dev)
replicaCount: 1

image:
  repository: my-registry/my-service
  pullPolicy: IfNotPresent
  tag: ""  # uses Chart.AppVersion if empty

service:
  type: ClusterIP
  port: 3000

ingress:
  enabled: false
  className: nginx
  host: my-service.example.com
  tls: false

resources:
  requests:
    cpu: 100m
    memory: 128Mi
  limits:
    cpu: 500m
    memory: 512Mi

autoscaling:
  enabled: false
  minReplicas: 1
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70

probes:
  liveness:
    path: /health
  readiness:
    path: /ready

env:
  - name: NODE_ENV
    value: development
  - name: LOG_LEVEL
    value: debug

envFromSecret: []
#  - name: DATABASE_URL
#    secretName: my-service-secrets
#    secretKey: database-url

# values-production.yaml (override for prod)
replicaCount: 3

image:
  pullPolicy: Always

ingress:
  enabled: true
  tls: true

resources:
  requests:
    cpu: 250m
    memory: 256Mi
  limits:
    cpu: 1000m
    memory: 1Gi

autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 20

env:
  - name: NODE_ENV
    value: production
  - name: LOG_LEVEL
    value: warn

Deploy commands:
helm install my-service ./my-service -f values-production.yaml
helm upgrade my-service ./my-service -f values-production.yaml
helm diff upgrade my-service ./my-service -f values-production.yaml  # preview changes
```

### Helmfile for multi-chart management

```
Set up Helmfile for [environment/application].

Services to deploy: [list]
Environments: [dev / staging / production]

# helmfile.yaml
repositories:
  - name: stable
    url: https://charts.helm.sh/stable
  - name: ingress-nginx
    url: https://kubernetes.github.io/ingress-nginx

environments:
  development:
    values:
      - environments/development/values.yaml
  production:
    values:
      - environments/production/values.yaml

releases:
  - name: ingress-nginx
    namespace: ingress-nginx
    chart: ingress-nginx/ingress-nginx
    version: 4.10.0

  - name: api
    namespace: my-app
    chart: ./charts/api
    values:
      - charts/api/values.yaml
      - environments/{{ .Environment.Name }}/api-values.yaml

  - name: worker
    namespace: my-app
    chart: ./charts/worker
    needs:
      - my-app/api  # deploy after API

Helmfile commands:
helmfile sync                          # deploy all releases
helmfile diff                          # preview changes
helmfile apply                         # sync and confirm
helmfile -e production sync            # deploy to production environment
helmfile -l name=api sync             # deploy only the API release
helmfile destroy                       # remove all releases
```

## Example

**User:** I have a Next.js app deployed with raw Kubernetes manifests. Need to convert it to Helm. What's the fastest path?

**Claude's approach:**

1-hour conversion for a typical Next.js deployment:

```bash
# Step 1: scaffold the chart (30 sec)
helm create nextjs-app
# Generates the structure with example templates

# Step 2: clean out the defaults (5 min)
rm -rf nextjs-app/templates/*
# Start with just what you need

# Step 3: convert your Deployment manifest (15 min)
# Take your existing deployment.yaml and parameterise the values:
# image: myapp:latest → image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
# replicas: 2 → replicas: {{ .Values.replicaCount }}
# PORT: 3000 → port: {{ .Values.service.port }}

# Step 4: write values.yaml with your current production values as defaults (10 min)
# Step 5: test locally (5 min)
helm template nextjs-app ./nextjs-app  # renders templates without deploying
helm lint ./nextjs-app                  # validates the chart

# Step 6: dry-run deploy (2 min)
helm install nextjs-app ./nextjs-app --dry-run --debug
```

The key insight: your current `deployment.yaml` is already ~80% of the Helm template. Just replace the hardcoded values with `{{ .Values.X }}` references and create the corresponding values.yaml.

---
