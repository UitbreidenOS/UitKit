---
name: argocd
description: "ArgoCD GitOps : livraison continue déclarative pour Kubernetes — Configuration d'application, politiques de synchronisation, déploiements automatisés, RBAC, notifications et gestion multi-cluster"
---

# Compétence ArgoCD

## Quand activer
- Configurer la livraison continue GitOps pour Kubernetes
- Définir une Application ArgoCD pour un service
- Configurer l'auto-sync, les vérifications de santé et la restauration
- Configurer des déploiements multi-environnement (dev/staging/prod) à partir d'un seul repo Git
- Configurer RBAC et SSO pour ArgoCD
- Déboguer les applications désynchronisées ou dégradées

## Quand NE PAS utiliser
- Configuration de pipeline CI/CD (construction d'images, exécution de tests) — utiliser la compétence cicd
- Configuration du cluster Kubernetes — utiliser les compétences cloud architect
- Déploiements non-Kubernetes — ArgoCD est natif K8s

## Instructions

### Installer ArgoCD

```
Installer ArgoCD sur [cluster].

Cluster : [EKS / GKE / AKS / auto-géré]

# Installation standard
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Attendre les pods
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=argocd-server -n argocd --timeout=300s

# Obtenir le mot de passe administrateur initial
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d

# Accéder à l'interface utilisateur (port-forward pour local)
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Se connecter via CLI
argocd login localhost:8080 --username admin --password [password]

# Exposer via LoadBalancer (production)
kubectl patch svc argocd-server -n argocd -p '{"spec":{"type":"LoadBalancer"}}'

# Exposer via Ingress (production — Nginx)
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

### Définition d'Application

```
Définir une Application ArgoCD pour [service].

Service : [nom]
Repo Git : [URL du repo]
Chemin : [chemin vers les manifests dans le repo — ex : k8s/ ou helm/my-service]
Cluster cible : [in-cluster / URL du cluster]
Namespace cible : [namespace]
Politique de synchronisation : [manuelle / automatique]

apps/my-service.yaml:
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-service
  namespace: argocd
  finalizers:
    - resources-finalizer.argocd.argoproj.io  # nettoyage à la suppression
spec:
  project: default
  
  source:
    repoURL: https://github.com/your-org/your-repo.git
    targetRevision: HEAD  # ou une branche : main, staging
    path: k8s/my-service
    
    # Pour les charts Helm :
    # helm:
    #   valueFiles:
    #     - values.yaml
    #     - values-production.yaml
  
  destination:
    server: https://kubernetes.default.svc  # in-cluster
    namespace: production
  
  syncPolicy:
    automated:
      prune: true       # supprimer les ressources supprimées de git
      selfHeal: true    # revenir à l'état git
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
        - /spec/replicas  # ignorer le nombre de répliques gérées par HPA

Appliquer :
kubectl apply -f apps/my-service.yaml

Surveiller :
argocd app get my-service
argocd app sync my-service  # synchronisation manuelle si l'auto-sync est désactivé
argocd app history my-service
argocd app rollback my-service [revision]
```

### Pattern App-of-Apps (multi-service)

```
Configurer le pattern App-of-Apps pour [cluster/environnement].

Cas d'usage : gérer plusieurs services à partir d'une seule Application ArgoCD

apps/
  apps.yaml           ← l'application "parent" — gère toutes les autres apps
  my-service.yaml     ← un fichier par service
  another-service.yaml

apps/apps.yaml (l'application racine) :
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
    path: apps           # surveille ce répertoire
  destination:
    server: https://kubernetes.default.svc
    namespace: argocd    # s'applique au namespace argocd (crée d'autres objets Application)
  syncPolicy:
    automated:
      prune: true
      selfHeal: true

# Déployer l'application racine une fois — elle découvre et gère ensuite toutes les autres apps
kubectl apply -f apps/apps.yaml

Avantages :
- Ajouter un nouveau service en ajoutant un fichier yaml à apps/
- ArgoCD découvre et le déploie automatiquement
- Une source unique de vérité pour tous les déploiements
```

### Configuration multi-environnement

```
Configurer la GitOps multi-environnement pour [projet].

Environnements : [dev / staging / production]
Stratégie : [branche-par-env / répertoire-par-env / valeurs-Helm-par-env]

Répertoire-par-environnement (recommandé) :
k8s/
  base/                    ← manifests partagés (Deployment, Service)
    deployment.yaml
    service.yaml
  overlays/
    development/           ← superposition kustomize pour dev
      kustomization.yaml
      patches/
        replicas.yaml      ← 1 réplique en dev
    staging/
      kustomization.yaml
    production/
      kustomization.yaml
      patches/
        replicas.yaml      ← 5 répliques en prod

Une Application ArgoCD par environnement :
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
  --sync-policy none  # approbation manuelle pour la production
```

### Notifications

```
Configurer les notifications ArgoCD pour [canaux].

Canaux : [Slack / email / PagerDuty / GitHub]

# Installer le contrôleur de notifications
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/notifications_catalog/install.yaml

# Configuration Slack
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

## Exemple

**Utilisateur :** Nous avons 3 services sur Kubernetes et voulons configurer GitOps pour que chaque git push vers main se déploie automatiquement. Nous sommes nouveaux à ArgoCD.

**Démarrage rapide de Claude :**

**Étape 1 — Installer ArgoCD (10 min) :**
```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
kubectl port-forward svc/argocd-server -n argocd 8080:443
# Ouvrir https://localhost:8080, se connecter avec admin + mot de passe ci-dessus
```

**Étape 2 — Connecter votre repo (5 min) :**
```bash
argocd repo add https://github.com/your-org/your-repo.git \
  --username your-username --password your-token
```

**Étape 3 — Créer une Application par service (2 min chacun) :**
```bash
argocd app create api \
  --repo https://github.com/your-org/your-repo.git \
  --path k8s/api \
  --dest-server https://kubernetes.default.svc \
  --dest-namespace production \
  --sync-policy automated \
  --auto-prune
```

**Étape 4 — Votre boucle gitops est maintenant :**
```
git commit → git push → ArgoCD détecte le changement → déploie automatiquement
```

ArgoCD scrute votre repo toutes les 3 minutes par défaut. Pour une synchronisation instantanée, configurez un webhook GitHub pointant vers votre instance ArgoCD.

---
