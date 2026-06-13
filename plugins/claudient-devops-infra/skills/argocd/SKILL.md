---
name: "argocd"
description: "ArgoCD GitOps: declarative continuous delivery for Kubernetes — Application setup, sync policies, automated rollouts, RBAC, notifications, and multi-cluster management"
---

# ArgoCD Skill

## When to activate
- Setting up GitOps continuous delivery for Kubernetes
- Defining an ArgoCD Application for a service
- Configuring auto-sync, health checks, and rollback
- Setting up multi-environment deployments (dev/staging/prod) from a single Git repo
- Configuring RBAC and SSO for ArgoCD
- Debugging out-of-sync or degraded applications

## When NOT to use
- CI/CD pipeline setup (building images, running tests) — use the cicd skill
- Kubernetes cluster setup — use the cloud architect skills
- Non-Kubernetes deployments — ArgoCD is K8s-native

## Instructions

### Install ArgoCD

```
Install ArgoCD on [cluster].

Cluster: [EKS / GKE / AKS / self-managed]

# Standard install
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Wait for pods
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=argocd-server -n argocd --timeout=300s

# Get initial admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d

# Access UI (port-forward for local)
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Login via CLI
argocd login localhost:8080 --username admin --password [password]

# Expose via LoadBalancer (production)
kubectl patch svc argocd-server -n argocd -p '{"spec":{"type":"LoadBalancer"}}'

# Expose via Ingress (production — Nginx)
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

### Application definition

```
Define an ArgoCD Application for [service].

Service: [name]
Git repo: [repo URL]
Path: [path to manifests in repo — e.g. k8s/ or helm/my-service]
Target cluster: [in-cluster / cluster URL]
Target namespace: [namespace]
Sync policy: [manual / automatic]

apps/my-service.yaml:
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-service
  namespace: argocd
  finalizers:
    - resources-finalizer.argocd.argoproj.io  # cleanup on delete
spec:
  project: default
  
  source:
    repoURL: https://github.com/your-org/your-repo.git
    targetRevision: HEAD  # or a branch: main, staging
    path: k8s/my-service
    
    # For Helm charts:
    # helm:
    #   valueFiles:
    #     - values.yaml
    #     - values-production.yaml
  
  destination:
    server: https://kubernetes.default.svc  # in-cluster
    namespace: production
  
  syncPolicy:
    automated:
      prune: true       # delete resources removed from git
      selfHeal: true    # revert manual changes to git state
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
        - /spec/replicas  # ignore HPA-managed replica count

Apply:
kubectl apply -f apps/my-service.yaml

Monitor:
argocd app get my-service
argocd app sync my-service  # manual sync if automated is off
argocd app history my-service
argocd app rollback my-service [revision]
```

### App-of-Apps pattern (multi-service)

```
Set up the App-of-Apps pattern for [cluster/environment].

Use case: manage multiple services from a single ArgoCD Application

apps/
  apps.yaml           ← the "parent" app — manages all other apps
  my-service.yaml     ← one file per service
  another-service.yaml

apps/apps.yaml (the root application):
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
    path: apps           # watches this directory
  destination:
    server: https://kubernetes.default.svc
    namespace: argocd    # applies to argocd namespace (creates more Application objects)
  syncPolicy:
    automated:
      prune: true
      selfHeal: true

# Deploy the root app once — it then discovers and manages all other apps
kubectl apply -f apps/apps.yaml

Benefits:
- Add a new service by adding a yaml file to apps/
- ArgoCD discovers and deploys it automatically
- One source of truth for all deployments
```

### Multi-environment setup

```
Set up multi-environment GitOps for [project].

Environments: [dev / staging / production]
Strategy: [branch-per-env / directory-per-env / Helm values-per-env]

Directory-per-environment (recommended):
k8s/
  base/                    ← shared manifests (Deployment, Service)
    deployment.yaml
    service.yaml
  overlays/
    development/           ← kustomize overlay for dev
      kustomization.yaml
      patches/
        replicas.yaml      ← 1 replica in dev
    staging/
      kustomization.yaml
    production/
      kustomization.yaml
      patches/
        replicas.yaml      ← 5 replicas in prod

One ArgoCD Application per environment:
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
  --sync-policy none  # manual approval for production
```

### Notifications

```
Configure ArgoCD notifications for [channels].

Channels: [Slack / email / PagerDuty / GitHub]

# Install notifications controller
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/notifications_catalog/install.yaml

# Slack configuration
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

## Example

**User:** We have 3 services on Kubernetes and want to set up GitOps so every git push to main automatically deploys. We're new to ArgoCD.

**Claude's quickstart:**

**Step 1 — Install ArgoCD (10 min):**
```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
kubectl port-forward svc/argocd-server -n argocd 8080:443
# Open https://localhost:8080, login with admin + password above
```

**Step 2 — Connect your repo (5 min):**
```bash
argocd repo add https://github.com/your-org/your-repo.git \
  --username your-username --password your-token
```

**Step 3 — Create one Application per service (2 min each):**
```bash
argocd app create api \
  --repo https://github.com/your-org/your-repo.git \
  --path k8s/api \
  --dest-server https://kubernetes.default.svc \
  --dest-namespace production \
  --sync-policy automated \
  --auto-prune
```

**Step 4 — Your gitops loop is now:**
```
git commit → git push → ArgoCD detects change → deploys automatically
```

ArgoCD polls your repo every 3 minutes by default. For instant sync, configure a GitHub webhook pointing to your ArgoCD instance.

---
