---
name: helm
description: "Helm chart authoring en management: charts schrijven van nul, template best practices, values overrides, chart testing met helm-unittest en Helmfile voor multi-chart deployments"
---

# Helm Skill

## Wanneer activeren
- Helm chart schrijven voor service die op Kubernetes moet deployen
- Bestaande Kubernetes manifest set inpakken in Helm chart
- Values overrides configureren voor verschillende environments (dev/staging/prod)
- Helm charts testen voor deployment
- Meerdere charts beheren met Helmfile

## Wanneer NIET gebruiken
- Ruwe Kubernetes manifests zonder verpakking — gebruik de kubernetes skill
- Kubernetes cluster setup — gebruik Terraform of cloud architect skills
- CI/CD pipeline configuratie — gebruik de cicd skill

## Instructies

### Chart structuur

```
Maak Helm chart voor [service].

Service: [beschrijf — web API / worker / cron job / stateful service]
Benodigde Kubernetes resources: [Deployment / Service / Ingress / ConfigMap / Secret / HPA]

Helm chart directory structuur:
my-service/
  Chart.yaml           ← chart metadata
  values.yaml          ← standaard configuratie values
  templates/
    deployment.yaml    ← Deployment template
    service.yaml       ← Service template
    ingress.yaml       ← Ingress (indien nodig)
    configmap.yaml     ← ConfigMap (indien nodig)
    hpa.yaml           ← HorizontalPodAutoscaler (indien nodig)
    _helpers.tpl       ← gedeelde template helpers
  charts/              ← chart afhankelijkheden
  .helmignore          ← bestanden om uit te sluiten

# Chart.yaml
apiVersion: v2
name: my-service
description: Helm chart voor my-service
type: application
version: 0.1.0     # chart versie
appVersion: "1.0.0"  # applicatie versie

Genereer chart structuur voor mijn service.
```

### Deployment template

```
Schrijf Helm templates voor [service].

Service type: [web app / worker / cron]
Config: [env vars / secrets / volumes nodig]

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

### Values bestand

```
Schrijf values.yaml voor [service] met environment overrides.

Environments: [dev / staging / prod]

# values.yaml (defaults — veilig voor dev)
replicaCount: 1

image:
  repository: my-registry/my-service
  pullPolicy: IfNotPresent
  tag: ""  # gebruikt Chart.AppVersion als leeg

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

# values-production.yaml (override voor prod)
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

Deploy commando's:
helm install my-service ./my-service -f values-production.yaml
helm upgrade my-service ./my-service -f values-production.yaml
helm diff upgrade my-service ./my-service -f values-production.yaml  # bekijk wijzigingen
```

### Helmfile voor multi-chart management

```
Setup Helmfile voor [environment/application].

Services te deployen: [list]
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
      - my-app/api  # deploy na API

Helmfile commands:
helmfile sync                          # deploy alle releases
helmfile diff                          # bekijk wijzigingen
helmfile apply                         # sync en bevestig
helmfile -e production sync            # deploy naar production
helmfile -l name=api sync             # deploy alleen API release
helmfile destroy                       # verwijder alle releases
```

## Voorbeeld

**Gebruiker:** Ik heb Next.js app met ruwe Kubernetes manifests. Moet naar Helm. Wat is snelste weg?

**Claude's benadering:**

Één uur conversie voor typische Next.js deployment:

```bash
# Stap 1: scaffold chart (30 sec)
helm create nextjs-app
# Genereert structuur met voorbeeld templates

# Stap 2: defaults opruimen (5 min)
rm -rf nextjs-app/templates/*
# Start met wat je nodig hebt

# Stap 3: converteer Deployment manifest (15 min)
# Neem bestaande deployment.yaml en parametriseer values:
# image: myapp:latest → image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
# replicas: 2 → replicas: {{ .Values.replicaCount }}
# PORT: 3000 → port: {{ .Values.service.port }}

# Stap 4: schrijf values.yaml met huidige prod values (10 min)
# Stap 5: test lokaal (5 min)
helm template nextjs-app ./nextjs-app  # render templates zonder deploy
helm install nextjs-app ./nextjs-app --dry-run  # preview deployment

# Stap 6: deploy (5 min)
helm install nextjs-app ./nextjs-app -n my-app --create-namespace
```

Voortaan zijn updates gewoon `helm upgrade nextjs-app ./nextjs-app`.

---
