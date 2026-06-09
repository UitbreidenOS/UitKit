---
description: Genereer een Helm chart scaffold voor de huidige applicatie
argument-hint: "[app-name] [optional: chart-type=app|library]"
---
Genereer een Helm chart voor: $ARGUMENTS

Inspecteer het project om het toepassingstype, blootgestelde poorten en eventuele vereiste ondersteunende services af te leiden.

Produceer de volledige chart directory-structuur:
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

Vereisten per bestand:

`Chart.yaml`:
- `apiVersion: v2`, correct `type` (application of library), semver `version` beginnend bij `0.1.0`, `appVersion` als placeholder

`values.yaml`:
- Top-level sleutels: `replicaCount`, `image` (repository/tag/pullPolicy), `service`, `ingress`, `resources`, `autoscaling`, `env`, `secrets`, `podAnnotations`, `nodeSelector`, `tolerations`, `affinity`
- Alle waarden moeten geldige standaardwaarden zijn die een inzetbaar chart produceren zonder wijziging

`templates/deployment.yaml`:
- Gebruik `_helpers.tpl` voor naam-/labelhelpers — geen onbewerkte `.Release.Name` inline
- `checksum/config` annotatie op de pod-template zodat rollouts activeren bij ConfigMap-wijzigingen
- `livenessProbe` en `readinessProbe` — paden uit `values.yaml`
- Volledige `securityContext` op pod- en containerniveau: `runAsNonRoot`, `readOnlyRootFilesystem`, `allowPrivilegeEscalation: false`, laat alle capabilities vallen
- `resources` uit values zonder hardcoded limieten

`ingress.yaml`:
- Voorwaardelijk op `ingress.enabled`
- Ondersteuning voor zowel `networking.k8s.io/v1` als legacy annotation patronen
- TLS blok voorwaardelijk op `ingress.tls`

`NOTES.txt`: post-install instructies die het exacte commando tonen om de service URL te krijgen

Na de chart, output:
1. `helm lint` commando om te valideren
2. `helm template . | kubectl apply --dry-run=client -f -` commando voor voorbeeld
3. De minimale `helmfile.yaml` entry om deze chart in een cluster in te zetten
