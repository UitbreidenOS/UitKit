---
description: Générer un échafaudage de chart Helm pour l'application actuelle
argument-hint: "[app-name] [optional: chart-type=app|library]"
---
Générer un chart Helm pour : $ARGUMENTS

Inspecter le projet pour déduire le type d'application, les ports exposés et tout service de sauvegarde requis.

Produire la structure complète du répertoire des charts :
```
charts/<app-name>/
  Chart.yaml
  values.yaml
  values-prod.yaml
  templates/
    _helpers.tpl
    deployment.yaml
    service.yaml
    ingress.yaml
    configmap.yaml
    secret.yaml
    hpa.yaml
    serviceaccount.yaml
    NOTES.txt
```

Exigences par fichier :

`Chart.yaml` :
- `apiVersion: v2`, `type` correct (application ou library), version semver commençant par `0.1.0`, `appVersion` comme placeholder

`values.yaml` :
- Clés de haut niveau : `replicaCount`, `image` (repository/tag/pullPolicy), `service`, `ingress`, `resources`, `autoscaling`, `env`, `secrets`, `podAnnotations`, `nodeSelector`, `tolerations`, `affinity`
- Toutes les valeurs doivent être des valeurs par défaut valides qui produisent un chart déployable sans modification

`templates/deployment.yaml` :
- Utiliser `_helpers.tpl` pour les helpers de nom/label — pas de `.Release.Name` brut en ligne
- Annotation `checksum/config` sur le pod template pour que les rollouts se déclenchent lors des changements ConfigMap
- `livenessProbe` et `readinessProbe` — chemins depuis `values.yaml`
- `securityContext` complet au niveau du pod et du conteneur : `runAsNonRoot`, `readOnlyRootFilesystem`, `allowPrivilegeEscalation: false`, supprimer toutes les capacités
- `resources` depuis les valeurs sans limites codées en dur

`ingress.yaml` :
- Conditionnel sur `ingress.enabled`
- Prendre en charge les modèles `networking.k8s.io/v1` et annotation legacy
- Bloc TLS conditionnel sur `ingress.tls`

`NOTES.txt` : instructions post-installation montrant la commande exacte pour obtenir l'URL du service

Après le chart, sortir :
1. Commande `helm lint` pour valider
2. Commande `helm template . | kubectl apply --dry-run=client -f -` pour prévisualiser
3. L'entrée `helmfile.yaml` minimale pour déployer ce chart à un cluster
