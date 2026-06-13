---
description: Générer un échafaudage de graphique Helm pour l'application actuelle
argument-hint: "[app-name] [optional: chart-type=app|library]"
---
Générer un graphique Helm pour : $ARGUMENTS

Inspecter le projet pour déduire le type d'application, les ports exposés et les services de support requis.

Produire la structure complète du répertoire de graphique :
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

`Chart.yaml`:
- `apiVersion: v2`, `type` correct (application ou library), `version` semver commençant à `0.1.0`, `appVersion` comme placeholder

`values.yaml`:
- Clés de haut niveau : `replicaCount`, `image` (repository/tag/pullPolicy), `service`, `ingress`, `resources`, `autoscaling`, `env`, `secrets`, `podAnnotations`, `nodeSelector`, `tolerations`, `affinity`
- Toutes les valeurs doivent être des valeurs par défaut valides qui produisent un graphique déployable sans modification

`templates/deployment.yaml`:
- Utiliser `_helpers.tpl` pour les assistants de nom/label — pas de `.Release.Name` brut en ligne
- Annotation `checksum/config` sur le modèle de pod pour que les déploiements se déclenchent lors des changements ConfigMap
- `livenessProbe` et `readinessProbe` — chemins issus de `values.yaml`
- Contexte de sécurité complet au niveau pod et conteneur : `runAsNonRoot`, `readOnlyRootFilesystem`, `allowPrivilegeEscalation: false`, supprimer toutes les capacités
- `resources` provenant des valeurs sans limites codées en dur

`ingress.yaml`:
- Conditionnel sur `ingress.enabled`
- Prendre en charge à la fois les modèles `networking.k8s.io/v1` et d'annotation hérités
- Bloc TLS conditionnel sur `ingress.tls`

`NOTES.txt`: instructions post-installation affichant la commande exacte pour obtenir l'URL du service

Après le graphique, produire :
1. Commande `helm lint` pour valider
2. Commande `helm template . | kubectl apply --dry-run=client -f -` pour prévisualiser
3. L'entrée `helmfile.yaml` minimale pour déployer ce graphique sur un cluster
