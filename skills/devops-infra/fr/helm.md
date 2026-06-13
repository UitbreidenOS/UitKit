---
name: helm
description: "Authoring et gestion de charts Helm : écrire des charts à partir de zéro, bonnes pratiques de templating, surcharges de valeurs, tests de charts avec helm-unittest et Helmfile pour déploiements multi-charts"
---

# Compétence Helm

## Quand activer
- Écrire un chart Helm pour un service qui doit être déployé sur Kubernetes
- Empaqueter un ensemble de manifests Kubernetes existants dans un chart Helm
- Configurer les surcharges de valeurs pour différents environnements (dev/staging/prod)
- Tester les charts Helm avant le déploiement
- Gérer plusieurs charts avec Helmfile

## Quand NE PAS utiliser
- Manifests Kubernetes bruts sans empaquetage — utiliser la compétence kubernetes
- Configuration du cluster Kubernetes — utiliser Terraform ou les compétences cloud architect
- Configuration de pipeline CI/CD — utiliser la compétence cicd

## Instructions

### Structure du chart

```
Créer un chart Helm pour [service].

Service : [décrire — API web / worker / cron job / service stateful]
Ressources Kubernetes nécessaires : [Deployment / Service / Ingress / ConfigMap / Secret / HPA]

Structure du répertoire du chart Helm :
my-service/
  Chart.yaml           ← métadonnées du chart
  values.yaml          ← valeurs de configuration par défaut
  templates/
    deployment.yaml    ← modèle Deployment
    service.yaml       ← modèle Service
    ingress.yaml       ← Ingress (si nécessaire)
    configmap.yaml     ← ConfigMap (si nécessaire)
    hpa.yaml           ← HorizontalPodAutoscaler (si nécessaire)
    _helpers.tpl       ← helpers de modèle partagés
  charts/              ← dépendances de chart
  .helmignore          ← fichiers à exclure du package du chart

# Chart.yaml
apiVersion: v2
name: my-service
description: Un chart Helm pour my-service
type: application
version: 0.1.0     # version du chart
appVersion: "1.0.0"  # version de l'application

Générer la structure du chart pour mon service.
```

### Modèle Deployment

```
Écrire des modèles Helm pour [service].

Type de service : [application web / worker / cron]
Configuration : [variables d'env / secrets / volumes nécessaires]

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

### Fichier de valeurs

```
Écrire un values.yaml pour [service] avec surcharges d'environnement.

Environnements : [dev / staging / prod]

# values.yaml (défauts — sûr pour dev)
replicaCount: 1

image:
  repository: my-registry/my-service
  pullPolicy: IfNotPresent
  tag: ""  # utilise Chart.AppVersion si vide

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

# values-production.yaml (surcharge pour prod)
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

Commandes de déploiement :
helm install my-service ./my-service -f values-production.yaml
helm upgrade my-service ./my-service -f values-production.yaml
helm diff upgrade my-service ./my-service -f values-production.yaml  # aperçu des changements
```

### Helmfile pour la gestion de multi-charts

```
Configurer Helmfile pour [environnement/application].

Services à déployer : [liste]
Environnements : [dev / staging / production]

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
      - my-app/api  # déployer après API

Commandes Helmfile :
helmfile sync                          # déployer tous les releases
helmfile diff                          # aperçu des changements
helmfile apply                         # sync et confirmer
helmfile -e production sync            # déployer vers environnement production
helmfile -l name=api sync             # déployer uniquement le release API
helmfile destroy                       # supprimer tous les releases
```

## Exemple

**Utilisateur :** J'ai une app Next.js déployée avec des manifests Kubernetes bruts. Besoin de la convertir en Helm. Quel est le chemin le plus rapide ?

**Approche de Claude :**

Conversion d'une heure pour un déploiement Next.js typique :

```bash
# Étape 1 : scaffolder le chart (30 sec)
helm create nextjs-app
# Génère la structure avec modèles d'exemple

# Étape 2 : nettoyer les défauts (5 min)
rm -rf nextjs-app/templates/*
# Commencer avec juste ce dont vous avez besoin

# Étape 3 : convertir votre manifeste Deployment (15 min)
# Prendre votre deployment.yaml existant et paramétrer les valeurs :
# image: myapp:latest → image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
# replicas: 2 → replicas: {{ .Values.replicaCount }}
# PORT: 3000 → port: {{ .Values.service.port }}

# Étape 4 : écrire values.yaml avec vos valeurs production actuelles par défaut (10 min)
# Étape 5 : tester localement (5 min)
helm template nextjs-app ./nextjs-app  # rend les modèles sans déployer
helm install nextjs-app ./nextjs-app --dry-run  # prévisualise le déploiement

# Étape 6 : déployer (5 min)
helm install nextjs-app ./nextjs-app -n my-app --create-namespace
```

À partir de là, les futures mises à jour sont juste `helm upgrade nextjs-app ./nextjs-app`.

---
