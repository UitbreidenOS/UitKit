---
name: argocd
description: "ArgoCD GitOps: declaratieve continue delivery voor Kubernetes — Application setup, sync policies, geautomatiseerde rollouts, RBAC, notifications en multi-cluster management"
---

# ArgoCD Skill

## Wanneer activeren
- GitOps continue delivery voor Kubernetes instellen
- Een ArgoCD Application voor een service definiëren
- Auto-sync, health checks en rollback configureren
- Multi-environment deployments (dev/staging/prod) instellen vanuit één Git repo
- RBAC en SSO voor ArgoCD configureren
- Debugging uit-sync of gedegradeerde applicaties

## Wanneer NIET gebruiken
- CI/CD pipeline setup (images bouwen, tests uitvoeren) — gebruik de cicd skill
- Kubernetes cluster setup — gebruik de cloud architect skills
- Niet-Kubernetes deployments — ArgoCD is K8s-native

## Instructies

### ArgoCD installeren

```
Installeer ArgoCD op [cluster].

Cluster: [EKS / GKE / AKS / self-managed]

# Standaard installatie
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Wacht op pods
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=argocd-server -n argocd --timeout=300s

# Haal initieel admin wachtwoord op
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d

# Toegang tot UI (port-forward voor lokaal)
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Inloggen via CLI
argocd login localhost:8080 --username admin --password [password]

# Expose via LoadBalancer (productie)
kubectl patch svc argocd-server -n argocd -p '{"spec":{"type":"LoadBalancer"}}'

# Expose via Ingress (productie — Nginx)
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

### Application definitie

```
Definieer een ArgoCD Application voor [service].

Service: [naam]
Git repo: [repo URL]
Pad: [pad naar manifests in repo — bijv. k8s/ of helm/my-service]
Target cluster: [in-cluster / cluster URL]
Target namespace: [namespace]
Sync policy: [manueel / automatisch]

apps/my-service.yaml:
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-service
  namespace: argocd
  finalizers:
    - resources-finalizer.argocd.argoproj.io  # cleanup bij verwijdering
spec:
  project: default
  
  source:
    repoURL: https://github.com/your-org/your-repo.git
    targetRevision: HEAD  # of een branch: main, staging
    path: k8s/my-service
    
    # Voor Helm charts:
    # helm:
    #   valueFiles:
    #     - values.yaml
    #     - values-production.yaml
  
  destination:
    server: https://kubernetes.default.svc  # in-cluster
    namespace: production
  
  syncPolicy:
    automated:
      prune: true       # verwijder resources verwijderd uit git
      selfHeal: true    # zet terug naar git state
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
        - /spec/replicas  # negeer HPA-beheerd replica count

Toepassen:
kubectl apply -f apps/my-service.yaml

Monitor:
argocd app get my-service
argocd app sync my-service  # handmatig sync als automatisch uit
argocd app history my-service
argocd app rollback my-service [revision]
```

### App-of-Apps patroon (multi-service)

```
Stel App-of-Apps patroon in voor [cluster/environment].

Use case: meerdere services beheren vanuit één ArgoCD Application

apps/
  apps.yaml           ← de "parent" app — beheert alle andere apps
  my-service.yaml     ← één bestand per service
  another-service.yaml

apps/apps.yaml (de root application):
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
    path: apps           # kijkt naar deze directory
  destination:
    server: https://kubernetes.default.svc
    namespace: argocd    # wordt toegepast op argocd namespace (maakt meer Application objecten)
  syncPolicy:
    automated:
      prune: true
      selfHeal: true

# Deploy root app eenmaal — het ontdekt en beheert dan alle andere apps
kubectl apply -f apps/apps.yaml

Voordelen:
- Voeg nieuwe service toe door yaml bestand toe te voegen aan apps/
- ArgoCD ontdekt en deployed het automatisch
- Één bron van waarheid voor alle deployments
```

### Multi-environment setup

```
Stel multi-environment GitOps in voor [project].

Environments: [dev / staging / production]
Strategy: [branch-per-env / directory-per-env / Helm values-per-env]

Directory-per-environment (aanbevolen):
k8s/
  base/                    ← gedeelde manifests (Deployment, Service)
    deployment.yaml
    service.yaml
  overlays/
    development/           ← kustomize overlay voor dev
      kustomization.yaml
      patches/
        replicas.yaml      ← 1 replica in dev
    staging/
      kustomization.yaml
    production/
      kustomization.yaml
      patches/
        replicas.yaml      ← 5 replicas in prod

Één ArgoCD Application per environment:
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
  --sync-policy none  # handmatige goedkeuring voor productie
```

### Notifications

```
Configureer ArgoCD notifications voor [channels].

Channels: [Slack / email / PagerDuty / GitHub]

# Installeer notifications controller
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/notifications_catalog/install.yaml

# Slack configuratie
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

## Voorbeeld

**Gebruiker:** We hebben 3 services op Kubernetes en willen GitOps instellen zodat elke git push naar main automatisch deployed. We zijn nieuw met ArgoCD.

**Claude's quickstart:**

**Stap 1 — Installeer ArgoCD (10 min):**
```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
kubectl port-forward svc/argocd-server -n argocd 8080:443
# Open https://localhost:8080, log in met admin + wachtwoord hierboven
```

**Stap 2 — Verbind je repo (5 min):**
```bash
argocd repo add https://github.com/your-org/your-repo.git \
  --username your-username --password your-token
```

**Stap 3 — Maak één Application per service (2 min elk):**
```bash
argocd app create api \
  --repo https://github.com/your-org/your-repo.git \
  --path k8s/api \
  --dest-server https://kubernetes.default.svc \
  --dest-namespace production \
  --sync-policy automated \
  --auto-prune
```

**Stap 4 — Je gitops loop is nu:**
```
git commit → git push → ArgoCD detecteert verandering → deployed automatisch
```

ArgoCD pollt je repo standaard elke 3 minuten. Voor instant sync, configureer een GitHub webhook die naar je ArgoCD instance wijst.

---
