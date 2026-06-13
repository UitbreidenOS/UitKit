---
name: helm
description: "Helm-Chart-Authoring und -Verwaltung: Charts von Grund auf schreiben, Template Best Practices, Wert-Overrides, Chart-Tests mit helm-unittest und Helmfile für Multi-Chart-Bereitstellungen"
---

# Helm Skill

## Wann aktivieren
- Schreiben eines Helm-Charts für einen Service, der auf Kubernetes bereitgestellt werden muss
- Verpacken eines bestehenden Kubernetes-Manifest-Sets in ein Helm-Chart
- Konfigurieren von Wert-Overrides für verschiedene Umgebungen (dev/staging/prod)
- Testen von Helm-Charts vor der Bereitstellung
- Verwalten mehrerer Charts mit Helmfile

## Wann NICHT verwenden
- Rohe Kubernetes-Manifeste ohne Verpackung — verwenden Sie den kubernetes Skill
- Kubernetes-Cluster-Einrichtung — verwenden Sie Terraform oder Cloud-Architect-Skills
- CI/CD-Pipeline-Konfiguration — verwenden Sie den cicd Skill

## Anweisungen

### Chart-Struktur

```
Erstellen Sie ein Helm-Chart für [Service].

Service: [beschreiben — Web-API / Worker / Cron-Job / zustandsbehafteter Service]
Benötigte Kubernetes-Ressourcen: [Deployment / Service / Ingress / ConfigMap / Secret / HPA]

Helm-Chart-Verzeichnisstruktur:
my-service/
  Chart.yaml           ← Chart-Metadaten
  values.yaml          ← Standard-Konfigurationswerte
  templates/
    deployment.yaml    ← Deployment-Vorlage
    service.yaml       ← Service-Vorlage
    ingress.yaml       ← Ingress (falls erforderlich)
    configmap.yaml     ← ConfigMap (falls erforderlich)
    hpa.yaml           ← HorizontalPodAutoscaler (falls erforderlich)
    _helpers.tpl       ← gemeinsame Template-Helfer
  charts/              ← Chart-Abhängigkeiten
  .helmignore          ← Dateien zum Ausschließen aus dem Chart-Paket

# Chart.yaml
apiVersion: v2
name: my-service
description: Ein Helm-Chart für my-service
type: application
version: 0.1.0     # Chart-Version
appVersion: "1.0.0"  # Anwendungsversion

Generieren Sie die Chart-Struktur für meinen Service.
```

### Deployment-Vorlage

```
Schreiben Sie Helm-Templates für [Service].

Service-Typ: [Web-App / Worker / Cron]
Konfiguration: [Env-Variablen / Geheimnisse / benötigte Volumes]

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

### Wertedatei

```
Schreiben Sie eine values.yaml für [Service] mit Umgebungs-Overrides.

Umgebungen: [dev / staging / prod]

# values.yaml (Standards — sicher für dev)
replicaCount: 1

image:
  repository: my-registry/my-service
  pullPolicy: IfNotPresent
  tag: ""  # verwendet Chart.AppVersion wenn leer

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

# values-production.yaml (Override für prod)
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

Bereitstellungsbefehle:
helm install my-service ./my-service -f values-production.yaml
helm upgrade my-service ./my-service -f values-production.yaml
helm diff upgrade my-service ./my-service -f values-production.yaml  # Vorschau der Änderungen
```

### Helmfile für Multi-Chart-Verwaltung

```
Richten Sie Helmfile für [Umgebung/Anwendung] ein.

Bereitzustellende Services: [Liste]
Umgebungen: [dev / staging / production]

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
      - my-app/api  # nach API bereitstellen

Helmfile-Befehle:
helmfile sync                          # alle Releases bereitstellen
helmfile diff                          # Änderungen anzeigen
helmfile apply                         # sync und bestätigen
helmfile -e production sync            # in Produktionsumgebung bereitstellen
helmfile -l name=api sync             # nur API-Release bereitstellen
helmfile destroy                       # alle Releases entfernen
```

## Beispiel

**Benutzer:** Ich habe eine Next.js-App mit rohen Kubernetes-Manifesten bereitgestellt. Muss zu Helm konvertiert werden. Was ist der schnellste Weg?

**Claude's Ansatz:**

Eine Stunde Konvertierung für eine typische Next.js-Bereitstellung:

```bash
# Schritt 1: Chart scaffolden (30 sec)
helm create nextjs-app
# Generiert die Struktur mit beispielhaften Templates

# Schritt 2: Standardwerte bereinigen (5 Min)
rm -rf nextjs-app/templates/*
# Nur mit dem anfangen, was Sie brauchen

# Schritt 3: Ihr Deployment-Manifest konvertieren (15 Min)
# Nehmen Sie Ihre existierende deployment.yaml und parametrisieren Sie die Werte:
# image: myapp:latest → image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
# replicas: 2 → replicas: {{ .Values.replicaCount }}
# PORT: 3000 → port: {{ .Values.service.port }}

# Schritt 4: values.yaml mit Ihren aktuellen Produktionswerten als Standardwerte schreiben (10 Min)
# Schritt 5: lokal testen (5 Min)
helm template nextjs-app ./nextjs-app  # rendert Templates ohne Bereitstellung
helm install nextjs-app ./nextjs-app --dry-run  # zeigt Bereitstellungsvorschau

# Schritt 6: bereitstellen (5 Min)
helm install nextjs-app ./nextjs-app -n my-app --create-namespace
```

Von da an sind zukünftige Updates nur `helm upgrade nextjs-app ./nextjs-app`.

---
