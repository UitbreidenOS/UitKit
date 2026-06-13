---
description: Helm-Chart-Gerüst für die aktuelle Anwendung generieren
argument-hint: "[app-name] [optional: chart-type=app|library]"
---
Generiere ein Helm-Chart für: $ARGUMENTS

Inspiziere das Projekt, um den Anwendungstyp, offengelegte Ports und erforderliche Backend-Services abzuleiten.

Erstelle die vollständige Chart-Verzeichnisstruktur:
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

Anforderungen pro Datei:

`Chart.yaml`:
- `apiVersion: v2`, korrekter `type` (application oder library), semantische Versionierung `version` ab `0.1.0`, `appVersion` als Platzhalter

`values.yaml`:
- Top-Level-Schlüssel: `replicaCount`, `image` (repository/tag/pullPolicy), `service`, `ingress`, `resources`, `autoscaling`, `env`, `secrets`, `podAnnotations`, `nodeSelector`, `tolerations`, `affinity`
- Alle Werte müssen gültige Standardwerte sein, die ein einsatzbereites Chart ohne Änderungen erzeugen

`templates/deployment.yaml`:
- Nutze `_helpers.tpl` für Name- und Label-Helfer — kein raw `.Release.Name` inline
- `checksum/config` Annotation auf der Pod-Template, sodass Rollouts bei ConfigMap-Änderungen ausgelöst werden
- `livenessProbe` und `readinessProbe` — Pfade aus `values.yaml`
- Vollständiger `securityContext` auf Pod- und Container-Ebene: `runAsNonRoot`, `readOnlyRootFilesystem`, `allowPrivilegeEscalation: false`, alle Capabilities entfernen
- `resources` aus values ohne hartcodierte Limits

`ingress.yaml`:
- Bedingt auf `ingress.enabled`
- Unterstütze beide `networking.k8s.io/v1` und Legacy-Annotation-Muster
- TLS-Block bedingt auf `ingress.tls`

`NOTES.txt`: Post-Installation-Anweisungen mit dem exakten Befehl zur Abfrage der Service-URL

Nach dem Chart, gebe aus:
1. `helm lint` Befehl zur Validierung
2. `helm template . | kubectl apply --dry-run=client -f -` Befehl zur Vorschau
3. Der minimale `helmfile.yaml` Eintrag zum Bereitstellen dieses Charts in einem Cluster
