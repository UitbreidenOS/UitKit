---
name: argocd
description: "ArgoCD GitOps: entrega continua declarativa para Kubernetes — configuración de Application, políticas de sincronización, despliegues automatizados, RBAC, notificaciones y gestión multi-cluster"
---

# Habilidad ArgoCD

## Cuándo activar
- Configurar la entrega continua GitOps para Kubernetes
- Definir una Aplicación ArgoCD para un servicio
- Configurar auto-sync, checks de salud y rollback
- Configurar despliegues multi-ambiente (dev/staging/prod) desde un único repo Git
- Configurar RBAC y SSO para ArgoCD
- Debuguear aplicaciones desincronizadas o degradadas

## Cuándo NO usar
- Configuración de pipeline CI/CD (construir imágenes, ejecutar pruebas) — usa la habilidad cicd
- Configuración de cluster Kubernetes — usa las habilidades cloud architect
- Despliegues no-Kubernetes — ArgoCD es nativo de K8s

## Instrucciones

### Instalar ArgoCD

```
Instala ArgoCD en [cluster].

Cluster: [EKS / GKE / AKS / auto-gestionado]

# Instalación estándar
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Esperar a los pods
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=argocd-server -n argocd --timeout=300s

# Obtener contraseña de admin inicial
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d

# Acceder a la UI (port-forward para local)
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Iniciar sesión via CLI
argocd login localhost:8080 --username admin --password [password]

# Exponer via LoadBalancer (producción)
kubectl patch svc argocd-server -n argocd -p '{"spec":{"type":"LoadBalancer"}}'

# Exponer via Ingress (producción — Nginx)
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

### Definición de Application

```
Define una Aplicación ArgoCD para [servicio].

Servicio: [nombre]
Repo Git: [URL del repo]
Ruta: [ruta a manifests en repo — ej. k8s/ o helm/my-service]
Cluster destino: [in-cluster / URL del cluster]
Namespace destino: [namespace]
Política de sincronización: [manual / automática]

apps/my-service.yaml:
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-service
  namespace: argocd
  finalizers:
    - resources-finalizer.argocd.argoproj.io  # cleanup al eliminar
spec:
  project: default
  
  source:
    repoURL: https://github.com/your-org/your-repo.git
    targetRevision: HEAD  # o una rama: main, staging
    path: k8s/my-service
    
    # Para charts Helm:
    # helm:
    #   valueFiles:
    #     - values.yaml
    #     - values-production.yaml
  
  destination:
    server: https://kubernetes.default.svc  # in-cluster
    namespace: production
  
  syncPolicy:
    automated:
      prune: true       # elimina resources removidos de git
      selfHeal: true    # revierte cambios manuales al estado git
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
        - /spec/replicas  # ignora conteo de replicas gestionado por HPA

Aplicar:
kubectl apply -f apps/my-service.yaml

Monitorear:
argocd app get my-service
argocd app sync my-service  # sincronización manual si automática está apagada
argocd app history my-service
argocd app rollback my-service [revision]
```

### Patrón App-of-Apps (multi-service)

```
Configura el patrón App-of-Apps para [cluster/ambiente].

Caso de uso: gestionar múltiples servicios desde una única Aplicación ArgoCD

apps/
  apps.yaml           ← la app "padre" — gestiona todas las otras apps
  my-service.yaml     ← un archivo por servicio
  another-service.yaml

apps/apps.yaml (la aplicación raíz):
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
    path: apps           # observa este directorio
  destination:
    server: https://kubernetes.default.svc
    namespace: argocd    # aplica al namespace argocd (crea más objetos Application)
  syncPolicy:
    automated:
      prune: true
      selfHeal: true

# Desplega la app raíz una vez — luego descubre y gestiona todas las otras apps
kubectl apply -f apps/apps.yaml

Beneficios:
- Agrega nuevo servicio añadiendo un archivo yaml a apps/
- ArgoCD lo descubre y lo despliega automáticamente
- Una única fuente de verdad para todos los despliegues
```

### Configuración multi-ambiente

```
Configura GitOps multi-ambiente para [proyecto].

Ambientes: [dev / staging / production]
Estrategia: [rama-por-ambiente / directorio-por-ambiente / valores-Helm-por-ambiente]

Directorio-por-ambiente (recomendado):
k8s/
  base/                    ← manifests compartidos (Deployment, Service)
    deployment.yaml
    service.yaml
  overlays/
    development/           ← overlay kustomize para dev
      kustomization.yaml
      patches/
        replicas.yaml      ← 1 réplica en dev
    staging/
      kustomization.yaml
    production/
      kustomization.yaml
      patches/
        replicas.yaml      ← 5 replicas en prod

Una Aplicación ArgoCD por ambiente:
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
  --sync-policy none  # aprobación manual para producción
```

### Notificaciones

```
Configura notificaciones ArgoCD para [canales].

Canales: [Slack / email / PagerDuty / GitHub]

# Instala notifications controller
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/notifications_catalog/install.yaml

# Configuración de Slack
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

## Ejemplo

**Usuario:** Tenemos 3 servicios en Kubernetes y queremos configurar GitOps para que cada git push a main se despliegue automáticamente. Somos nuevos en ArgoCD.

**Quickstart de Claude:**

**Paso 1 — Instala ArgoCD (10 min):**
```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
kubectl port-forward svc/argocd-server -n argocd 8080:443
# Abre https://localhost:8080, inicia sesión con admin + contraseña arriba
```

**Paso 2 — Conecta tu repo (5 min):**
```bash
argocd repo add https://github.com/your-org/your-repo.git \
  --username your-username --password your-token
```

**Paso 3 — Crea una Application por servicio (2 min cada):**
```bash
argocd app create api \
  --repo https://github.com/your-org/your-repo.git \
  --path k8s/api \
  --dest-server https://kubernetes.default.svc \
  --dest-namespace production \
  --sync-policy automated \
  --auto-prune
```

**Paso 4 — Tu bucle gitops es ahora:**
```
git commit → git push → ArgoCD detecta cambio → despliega automáticamente
```

ArgoCD escanea tu repo cada 3 minutos por defecto. Para sincronización instantánea, configura un webhook de GitHub que apunte a tu instancia de ArgoCD.

---
