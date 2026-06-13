> 🇫🇷 This is the French translation. [English version](../kubernetes.md).

# Compétence Kubernetes

## Quand activer
- Rédiger des manifests Kubernetes (Deployments, Services, ConfigMaps, Secrets, Ingress)
- Configurer des charts Helm ou des fichiers de valeurs pour une application
- Déboguer un Pod en échec, CrashLoopBackOff, ou un conteneur OOMKilled
- Mettre en place un autoscaling horizontal (HPA) ou vertical (VPA) des pods
- Définir les requests et limits de ressources pour les conteneurs
- Rédiger ou réviser des politiques RBAC (Roles, ClusterRoles, RoleBindings)
- Configurer des sondes liveness, readiness et startup
- Configurer des volumes persistants et des revendications de volumes persistants
- Rédiger des politiques réseau pour contrôler le trafic entre pods
- Configurer des namespaces et l'isolation multi-tenant

## Quand NE PAS utiliser
- Configurations Docker Compose qui ne migrent pas vers Kubernetes
- Serverless (Cloud Run, Lambda, Fargate) — modèle de déploiement différent
- Applications mono-conteneur simples qui n'ont pas besoin d'orchestration
- Environnements de développement local où Docker seul suffit
- Nomad, Mesos, ou autres orchestrateurs non-Kubernetes

## Instructions

### Structure des manifests
Toujours définir ces champs dans chaque Deployment :
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-name
  namespace: production          # Toujours explicite — ne jamais se fier au namespace par défaut
  labels:
    app: app-name
    version: "1.0.0"
spec:
  replicas: 3
  selector:
    matchLabels:
      app: app-name
  template:
    metadata:
      labels:
        app: app-name
        version: "1.0.0"
    spec:
      containers:
        - name: app-name
          image: registry/app-name:tag   # Ne jamais utiliser :latest en production
          resources:
            requests:
              cpu: "100m"
              memory: "128Mi"
            limits:
              cpu: "500m"
              memory: "512Mi"
```

### Requests et limits de ressources
- Toujours définir `requests` et `limits` — ne jamais les omettre
- `requests` = ressources garanties (utilisées pour la planification)
- `limits` = maximum autorisé (OOMKilled si la mémoire est dépassée)
- Les limites CPU sont optionnelles dans les clusters avec limitation CPU désactivée — mais les limites mémoire sont obligatoires
- Commencer prudemment : requests à ~25% de l'attendu, limits à 2x l'attendu, puis ajuster avec les métriques réelles

### Sondes de santé
Tous les conteneurs de production doivent avoir des sondes :
```yaml
livenessProbe:
  httpGet:
    path: /healthz
    port: 8080
  initialDelaySeconds: 15
  periodSeconds: 20
  failureThreshold: 3

readinessProbe:
  httpGet:
    path: /ready
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 10
  failureThreshold: 3
```
- Échec de `livenessProbe` → redémarrage du conteneur
- Échec de `readinessProbe` → retiré du load balancer du Service (pas de trafic, pas de redémarrage)
- Ne jamais pointer les deux vers le même endpoint — la readiness doit vérifier les dépendances, pas la liveness

### Gestion des secrets
- Ne jamais mettre des secrets dans des ConfigMaps — utiliser des Secrets
- Ne jamais committer des manifests Secret avec de vraies valeurs — utiliser sealed-secrets, external-secrets-operator, ou Vault
- Référencer les secrets comme variables d'environnement, pas comme volumes, sauf si l'application requiert spécifiquement des secrets basés sur des fichiers :
```yaml
env:
  - name: DATABASE_URL
    valueFrom:
      secretKeyRef:
        name: app-secrets
        key: database-url
```

### Conventions des namespaces
- Namespace `default` : dev/test uniquement
- Les workloads de production toujours dans des namespaces nommés
- Utiliser `ResourceQuota` et `LimitRange` sur chaque namespace de production
- RBAC : les développeurs ont edit dans les namespaces dev, view en production

### Causes courantes de CrashLoopBackOff et corrections
1. Variable d'environnement manquante → vérifier la section Events de `kubectl describe pod`
2. Healthcheck échoué → les logs montrent la vraie erreur, la sonde la détecte seulement
3. OOMKilled → augmenter la limit mémoire ou corriger la fuite mémoire
4. Erreur de récupération d'image → vérifier imagePullPolicy et les credentials du registre
5. Échec d'un init container → `kubectl logs pod-name -c init-container-name`

## Exemple

**Utilisateur :** Déployer une application FastAPI avec une connexion PostgreSQL, 3 réplicas, des limits de ressources et des health checks.

**Structure de sortie attendue :**
- Manifest Namespace
- Secret pour `DATABASE_URL`
- Deployment avec 3 réplicas, requests/limits de ressources, sondes liveness + readiness pointant vers `/healthz` et `/ready`
- Service (ClusterIP) exposant le port 80 → port conteneur 8080
- HorizontalPodAutoscaler ciblant 70% d'utilisation CPU, min 3 / max 10 réplicas

---
