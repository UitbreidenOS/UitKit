---
description: Genereer een Helm chart scaffold voor de huidige applicatie
argument-hint: "[app-naam] [optioneel: chart-type=app|library]"
---
Genereer een Helm chart voor: $ARGUMENTS

Inspecteer het project om het applicatietype, blootgestelde poorten en eventuele vereiste ondersteunende services af te leiden.

Genereer de volledige chart mapstructuur:
```
charts/<app-naam>/
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
- `apiVersion: v2`, correct `type` (application of library), semver `version` startend bij `0.1.0`, `appVersion` als tijdelijke aanduiding

`values.yaml`:
- Top-level sleutels: `replicaCount`, `image` (repository/tag/pullPolicy), `service`, `ingress`, `resources`, `autoscaling`, `env`, `secrets`, `podAnnotations`, `nodeSelector`, `tolerations`, `affinity`
- Alle waarden moeten geldige standaarden zijn die een inzetbare chart zonder aanpassing produceren

`templates/deployment.yaml`:
- Gebruik `_helpers.tpl` voor naam-/label helpers — geen raw `.Release.Name` inline
- `checksum/config` annotatie op de pod template zodat rollouts triggeren bij ConfigMap-wijzigingen
- `livenessProbe` en `readinessProbe` — paden van `values.yaml`
- Volledige `securityContext` op pod- en container-niveau: `runAsNonRoot`, `readOnlyRootFilesystem`, `allowPrivilegeEscalation: false`, drop alle capabilities
- `resources` van values zonder hardcoded limits

`ingress.yaml`:
- Voorwaardelijk op `ingress.enabled`
- Ondersteuning voor zowel `networking.k8s.io/v1` als legacy annotatie patronen
- TLS blok voorwaardelijk op `ingress.tls`

`NOTES.txt`: post-installatie instructies met de exacte commando om de service URL op te halen

Na de chart uitvoer:
1. `helm lint` commando om te valideren
2. `helm template . | kubectl apply --dry-run=client -f -` commando voor preview
3. De minimale `helmfile.yaml` entry om deze chart in een cluster in te zetten
