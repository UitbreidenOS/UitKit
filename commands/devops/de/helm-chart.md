---
description: Generieren Sie ein Helm-Chart-Gerüst für die aktuelle Anwendung
argument-hint: "[app-name] [optional: chart-type=app|library]"
---
Generieren Sie ein Helm-Chart für: $ARGUMENTS

Untersuchen Sie das Projekt, um den Anwendungstyp, die freiliegenden Ports und erforderliche Backend-Services abzuleiten.

Erzeugen Sie die vollständige Chart-Verzeichnisstruktur:
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
- `apiVersion: v2`, korrekt `type` (application oder library), semver `version` ab `0.1.0`, `appVersion` als Platzhalter

`values.yaml`:
- Top-Level-Schlüssel: `replicaCount`, `image` (repository/tag/pullPolicy), `service`, `ingress`, `resources`, `autoscaling`, `env`, `secrets`, `podAnnotations`, `nodeSelector`, `tolerations`, `affinity`
- Alle Werte müssen gültige Standardwerte sein, die ein funktionierendes Chart ohne Änderungen erzeugen

`templates/deployment.yaml`:
- Verwenden Sie `_helpers.tpl` für Name/Label-Helfer — keine rohen `.Release.Name` inline
- `checksum/config`-Annotation im Pod-Template, damit Rollouts bei ConfigMap-Änderungen ausgelöst werden
- `livenessProbe` und `readinessProbe` — Pfade aus `values.yaml`
- Vollständiger `securityContext` auf Pod- und Container-Ebene: `runAsNonRoot`, `readOnlyRootFilesystem`, `allowPrivilegeEscalation: false`, alle Capabilities löschen
- `resources` aus values ohne hardcodierte Limits

`ingress.yaml`:
- Bedingt durch `ingress.enabled`
- Unterstützen Sie beide `networking.k8s.io/v1` und ältere Annotation-Muster
- TLS-Block bedingt durch `ingress.tls`

`NOTES.txt`: Nach der Installation Anweisungen anzeigen, die den genauen Befehl zur Abfrage der Service-URL zeigen

Nach dem Chart folgende Ausgabe erzeugen:
1. `helm lint`-Befehl zur Validierung
2. `helm template . | kubectl apply --dry-run=client -f -`-Befehl zur Vorschau
3. Der minimale `helmfile.yaml`-Eintrag zur Bereitstellung dieses Charts in einem Cluster
