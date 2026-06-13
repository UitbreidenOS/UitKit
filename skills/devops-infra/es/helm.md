---
name: helm
description: "Helm chart authoring y management: escribir charts desde cero, template best practices, values overrides, chart testing con helm-unittest y Helmfile para deployments multi-chart"
---

# Habilidad Helm

## Cuándo activar
- Escribir Helm chart para service que debe desplegarse en Kubernetes
- Empaquetar conjunto existente de manifests Kubernetes en Helm chart
- Configurar overrides de valores para diferentes ambientes (dev/staging/prod)
- Tester Helm charts antes del deployment
- Gestionar múltiples charts con Helmfile

## Cuándo NO usar
- Manifests Kubernetes crudos sin empaquetamiento — usa la habilidad kubernetes
- Setup de cluster Kubernetes — usa Terraform o habilidades cloud architect
- Configuración de pipeline CI/CD — usa la habilidad cicd

## Instrucciones

### Estructura del chart

```
Crea Helm chart para [servicio].

Servicio: [describe — API web / worker / cron job / servicio stateful]
Recursos Kubernetes necesarios: [Deployment / Service / Ingress / ConfigMap / Secret / HPA]

Estructura de directorio Helm chart:
my-service/
  Chart.yaml           ← metadatos del chart
  values.yaml          ← valores de configuración por defecto
  templates/
    deployment.yaml    ← template Deployment
    service.yaml       ← template Service
    ingress.yaml       ← Ingress (si es necesario)
    configmap.yaml     ← ConfigMap (si es necesario)
    hpa.yaml           ← HorizontalPodAutoscaler (si es necesario)
    _helpers.tpl       ← helpers compartidos
  charts/              ← dependencias de chart
  .helmignore          ← archivos a excluir

# Chart.yaml
apiVersion: v2
name: my-service
description: Helm chart para my-service
type: application
version: 0.1.0     # versión del chart
appVersion: "1.0.0"  # versión de la aplicación

Genera estructura del chart para mi servicio.
```

### Template Deployment

```
Escribe Helm templates para [servicio].

Tipo de servicio: [web app / worker / cron]
Configuración: [variables env / secretos / volumes necesarios]

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

### Archivo de valores

```
Escribe values.yaml para [servicio] con overrides de ambiente.

Ambientes: [dev / staging / prod]

# values.yaml (defaults — seguro para dev)
replicaCount: 1

image:
  repository: my-registry/my-service
  pullPolicy: IfNotPresent
  tag: ""  # usa Chart.AppVersion si está vacío

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

# values-production.yaml (override para prod)
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

Comandos de deploy:
helm install my-service ./my-service -f values-production.yaml
helm upgrade my-service ./my-service -f values-production.yaml
helm diff upgrade my-service ./my-service -f values-production.yaml  # vista previa de cambios
```

### Helmfile para multi-chart management

```
Setup Helmfile para [environment/aplicación].

Servicios a desplegar: [lista]
Ambientes: [dev / staging / production]

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
      - my-app/api  # desplegar después de API

Comandos Helmfile:
helmfile sync                          # desplegar todos los releases
helmfile diff                          # vista previa de cambios
helmfile apply                         # sync y confirmar
helmfile -e production sync            # desplegar a production
helmfile -l name=api sync             # desplegar solo release API
helmfile destroy                       # eliminar todos los releases
```

## Ejemplo

**Usuario:** Tengo Next.js app con manifests Kubernetes crudos. Necesito convertir a Helm. ¿Ruta más rápida?

**Enfoque de Claude:**

Una hora de conversión para típico deployment Next.js:

```bash
# Paso 1: scaffold chart (30 seg)
helm create nextjs-app
# Genera estructura con templates de ejemplo

# Paso 2: limpiar defaults (5 min)
rm -rf nextjs-app/templates/*
# Comienza con solo lo que necesitas

# Paso 3: convertir manifest Deployment (15 min)
# Toma deployment.yaml existente y parametriza valores:
# image: myapp:latest → image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
# replicas: 2 → replicas: {{ .Values.replicaCount }}
# PORT: 3000 → port: {{ .Values.service.port }}

# Paso 4: escribir values.yaml con valores prod actuales (10 min)
# Paso 5: testear localmente (5 min)
helm template nextjs-app ./nextjs-app  # renderiza templates sin desplegar
helm install nextjs-app ./nextjs-app --dry-run  # vista previa

# Paso 6: desplegar (5 min)
helm install nextjs-app ./nextjs-app -n my-app --create-namespace
```

De aquí en adelante, futuras actualizaciones son solo `helm upgrade nextjs-app ./nextjs-app`.

---
