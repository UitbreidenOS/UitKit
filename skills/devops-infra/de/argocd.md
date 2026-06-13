---
name: argocd
description: "ArgoCD GitOps: Deklarative kontinuierliche Lieferung für Kubernetes — Anwendungseinrichtung, Synchronisierungsrichtlinien, automatisierte Rollouts, RBAC, Benachrichtigungen und Multi-Cluster-Verwaltung"
---

# ArgoCD Skill

## Wann aktivieren
- GitOps kontinuierliche Lieferung für Kubernetes einrichten
- Eine ArgoCD-Anwendung für einen Service definieren
- Auto-Sync, Gesundheitschecks und Rollback konfigurieren
- Multi-Umgebungs-Bereitstellungen (dev/staging/prod) aus einem einzelnen Git-Repo einrichten
- RBAC und SSO für ArgoCD konfigurieren
- Debugging nicht synchronisierter oder beeinträchtigter Anwendungen

## Wann NICHT verwenden
- CI/CD-Pipeline-Einrichtung (Bilder erstellen, Tests ausführen) — verwenden Sie den cicd Skill
- Kubernetes-Cluster-Einrichtung — verwenden Sie die Cloud-Architect-Skills
- Nicht-Kubernetes-Bereitstellungen — ArgoCD ist K8s-nativ

## Anweisungen

### ArgoCD installieren

```
Installieren Sie ArgoCD auf [Cluster].

Cluster: [EKS / GKE / AKS / selbstverwalteter]

# Standardinstallation
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Auf Pods warten
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=argocd-server -n argocd --timeout=300s

# Anfängliches Admin-Passwort abrufen
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d

# Auf Benutzeroberfläche zugreifen (Port-Forward für lokal)
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Anmeldung über CLI
argocd login localhost:8080 --username admin --password [password]

# Via LoadBalancer freigeben (Produktion)
kubectl patch svc argocd-server -n argocd -p '{"spec":{"type":"LoadBalancer"}}'

# Via Ingress freigeben (Produktion — Nginx)
kubectl apply -f - << EOF
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: argocd-ingress
  namespace: argocd
  annotations:
    nginx.ingress.kubernetes.io/ssl-passthrough: "true"
spec:
  ingressClassName: nginx
  rules:
    - host: argocd.yourdomain.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: argocd-server
                port:
                  number: 443
EOF
```

### Anwendungsdefinition

```
Definieren Sie eine ArgoCD-Anwendung für [Service].

Service: [Name]
Git-Repo: [Repo-URL]
Pfad: [Pfad zu Manifesten im Repo — z.B. k8s/ oder helm/my-service]
Zielcluster: [in-cluster / Cluster-URL]
Ziel-Namespace: [Namespace]
Synchronisierungsrichtlinie: [manuell / automatisch]

apps/my-service.yaml:
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-service
  namespace: argocd
  finalizers:
    - resources-finalizer.argocd.argoproj.io  # Bereinigung beim Löschen
spec:
  project: default
  
  source:
    repoURL: https://github.com/your-org/your-repo.git
    targetRevision: HEAD  # oder ein Zweig: main, staging
    path: k8s/my-service
    
    # Für Helm-Charts:
    # helm:
    #   valueFiles:
    #     - values.yaml
    #     - values-production.yaml
  
  destination:
    server: https://kubernetes.default.svc  # in-cluster
    namespace: production
  
  syncPolicy:
    automated:
      prune: true       # Ressourcen löschen, die aus Git entfernt wurden
      selfHeal: true    # Zu Git-Status zurückkehren
    syncOptions:
      - CreateNamespace=true
      - PrunePropagationPolicy=foreground
    retry:
      limit: 3
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 3m
  
  ignoreDifferences:
    - group: apps
      kind: Deployment
      jsonPointers:
        - /spec/replicas  # HPA-verwaltete Replikaanzahl ignorieren

Anwenden:
kubectl apply -f apps/my-service.yaml

Überwachen:
argocd app get my-service
argocd app sync my-service  # Manuelle Synchronisierung wenn automatisch aus
argocd app history my-service
argocd app rollback my-service [revision]
```

### App-of-Apps-Muster (Multi-Service)

```
Richten Sie das App-of-Apps-Muster für [Cluster/Umgebung] ein.

Anwendungsfall: Mehrere Services aus einer einzigen ArgoCD-Anwendung verwalten

apps/
  apps.yaml           ← die "übergeordnete" App — verwaltet alle anderen Apps
  my-service.yaml     ← eine Datei pro Service
  another-service.yaml

apps/apps.yaml (die Root-Anwendung):
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: apps
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/your-org/your-repo.git
    targetRevision: HEAD
    path: apps           # überwacht dieses Verzeichnis
  destination:
    server: https://kubernetes.default.svc
    namespace: argocd    # gilt für argocd-Namespace (erstellt weitere Application-Objekte)
  syncPolicy:
    automated:
      prune: true
      selfHeal: true

# Einmalige Bereitstellung der Root-App — sie entdeckt und verwaltet dann alle anderen Apps
kubectl apply -f apps/apps.yaml

Vorteile:
- Neue Services durch Hinzufügen einer YAML-Datei zu apps/ hinzufügen
- ArgoCD entdeckt und stellt sie automatisch bereit
- Eine einzige Quelle der Wahrheit für alle Bereitstellungen
```

### Multi-Umgebungs-Einrichtung

```
Richten Sie Multi-Umgebungs-GitOps für [Projekt] ein.

Umgebungen: [dev / staging / production]
Strategie: [Branch-pro-Umgebung / Verzeichnis-pro-Umgebung / Helm-Werte-pro-Umgebung]

Verzeichnis-pro-Umgebung (empfohlen):
k8s/
  base/                    ← gemeinsame Manifeste (Deployment, Service)
    deployment.yaml
    service.yaml
  overlays/
    development/           ← Kustomize-Overlay für dev
      kustomization.yaml
      patches/
        replicas.yaml      ← 1 Replik in dev
    staging/
      kustomization.yaml
    production/
      kustomization.yaml
      patches/
        replicas.yaml      ← 5 Repliken in Prod

Eine ArgoCD-Anwendung pro Umgebung:
argocd app create my-service-dev \
  --repo https://github.com/your-org/repo.git \
  --path k8s/overlays/development \
  --dest-server https://kubernetes.default.svc \
  --dest-namespace development \
  --sync-policy automated

argocd app create my-service-prod \
  --repo https://github.com/your-org/repo.git \
  --path k8s/overlays/production \
  --dest-server https://prod-cluster.example.com \
  --dest-namespace production \
  --sync-policy none  # Manuelle Genehmigung für Produktion
```

### Benachrichtigungen

```
Konfigurieren Sie ArgoCD-Benachrichtigungen für [Kanäle].

Kanäle: [Slack / E-Mail / PagerDuty / GitHub]

# Benachrichtigungscontroller installieren
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/notifications_catalog/install.yaml

# Slack-Konfiguration
kubectl -n argocd apply -f - << EOF
apiVersion: v1
kind: ConfigMap
metadata:
  name: argocd-notifications-cm
data:
  service.slack: |
    token: $SLACK_TOKEN
  template.app-deployed: |
    message: |
      {{if eq .app.status.operationState.phase "Succeeded"}}✅{{else}}🚨{{end}} 
      App {{.app.name}} sync {{.app.status.operationState.phase}}
      Revision: {{.app.status.sync.revision}}
  trigger.on-deployed: |
    - when: app.status.operationState.phase in ['Succeeded', 'Error', 'Failed']
      send: [app-deployed]
  subscriptions: |
    - recipients:
      - slack:#deployments
      triggers:
      - on-deployed
EOF
```

## Beispiel

**Benutzer:** Wir haben 3 Services auf Kubernetes und möchten GitOps einrichten, damit jedes Git-Push auf main automatisch bereitgestellt wird. Wir sind neu bei ArgoCD.

**Claude's Schnellstart:**

**Schritt 1 — ArgoCD installieren (10 Min):**
```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
kubectl port-forward svc/argocd-server -n argocd 8080:443
# Öffnen Sie https://localhost:8080, melden Sie sich mit Admin + Passwort oben an
```

**Schritt 2 — Ihr Repo verbinden (5 Min):**
```bash
argocd repo add https://github.com/your-org/your-repo.git \
  --username your-username --password your-token
```

**Schritt 3 — Eine Anwendung pro Service erstellen (je 2 Min):**
```bash
argocd app create api \
  --repo https://github.com/your-org/your-repo.git \
  --path k8s/api \
  --dest-server https://kubernetes.default.svc \
  --dest-namespace production \
  --sync-policy automated \
  --auto-prune
```

**Schritt 4 — Ihre GitOps-Schleife ist jetzt:**
```
Git-Commit → Git-Push → ArgoCD erkennt Änderung → stellt automatisch bereit
```

ArgoCD fragt Ihr Repo standardmäßig alle 3 Minuten ab. Für sofortige Synchronisierung konfigurieren Sie einen GitHub-Webhook, der auf Ihre ArgoCD-Instanz verweist.

---
