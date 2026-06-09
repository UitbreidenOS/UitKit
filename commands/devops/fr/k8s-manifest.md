---
description: Générer des manifests Kubernetes prêts pour la production pour l'application actuelle
argument-hint: "[resource-type or app-name] [namespace]"
---
Générer des manifests Kubernetes prêts pour la production pour : $ARGUMENTS

Inspectez le projet pour déterminer le type de charge de travail (service sans état, worker, CronJob, StatefulSet). Choisissez la ressource appropriée en conséquence.

Exportez tous les manifests en tant que documents YAML séparés séparés par `---` dans un seul fichier.

Incluez ces ressources :
- `Namespace` si un namespace non-par défaut est spécifié
- `Deployment` ou `StatefulSet` pour la charge de travail principale
- `Service` (ClusterIP par défaut ; notez quand LoadBalancer/NodePort est justifié)
- `ConfigMap` pour la configuration non sensible
- `Secret` avec des valeurs d'espace réservé codées en base64 et un avertissement clair pour remplacer avant l'application
- `HorizontalPodAutoscaler` ciblant les métriques CPU et mémoire
- `PodDisruptionBudget` avec `minAvailable: 1`
- `Ingress` si le service fait face à HTTP — utiliser la classe nginx ingress, ajouter un stanza TLS avec l'annotation cert-manager

Exigences de spécification de charge de travail :
- `resources.requests` et `resources.limits` pour CPU et mémoire — dimensionnement basé sur la pile détectée
- `livenessProbe` et `readinessProbe` — HTTP ou exec selon les besoins ; inclure `initialDelaySeconds` et `failureThreshold`
- `securityContext` au niveau du Pod : `runAsNonRoot: true`, `seccompProfile: RuntimeDefault`
- `securityContext` au niveau du Container : `readOnlyRootFilesystem: true`, `allowPrivilegeEscalation: false`, `capabilities: drop: [ALL]`
- `terminationGracePeriodSeconds` réglée au comportement d'arrêt de l'application
- `topologySpreadConstraints` pour propager sur les nœuds et zones
- `app.kubernetes.io/*` labels standards sur chaque ressource

Après les manifests, exportez une liste de contrôle des éléments à compléter avant `kubectl apply` :
1. Remplacez l'espace réservé de balise d'image par le vrai digest ou la balise semver
2. Remplissez les valeurs Secret (ou référencez un opérateur de secrets externes)
3. Définissez le nom d'hôte ingress et le nom du secret TLS
4. Confirmez le nom de classe de stockage si vous utilisez un StatefulSet avec des PVC
5. Vérifiez que les noms de métriques HPA correspondent à votre config metrics-server ou Prometheus adapter
