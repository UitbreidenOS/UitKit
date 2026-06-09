---
description: Produktionsreife Kubernetes-Manifeste für die aktuelle Anwendung generieren
argument-hint: "[resource-type or app-name] [namespace]"
---
Produktionsreife Kubernetes-Manifeste generieren für: $ARGUMENTS

Untersuche das Projekt, um den Workload-Typ zu ermitteln (zustandslose Dienste, Worker, CronJob, StatefulSet). Wähle die entsprechende Ressource.

Gib alle Manifeste als separate YAML-Dokumente aus, getrennt durch `---` in einer einzelnen Datei.

Schließe diese Ressourcen ein:
- `Namespace`, falls ein nicht-standardmäßiger Namespace angegeben ist
- `Deployment` oder `StatefulSet` für den primären Workload
- `Service` (standardmäßig ClusterIP; notiere wann LoadBalancer/NodePort sinnvoll ist)
- `ConfigMap` für nicht-sensitive Konfiguration
- `Secret` mit base64-codierten Platzhalterwerten und klarer Warnung zum Ersetzen vor dem Anwenden
- `HorizontalPodAutoscaler`, der auf CPU- und Speichermetriken zielt
- `PodDisruptionBudget` mit `minAvailable: 1`
- `Ingress`, falls der Dienst HTTP-seitig exponiert ist — nutze nginx Ingress-Klasse, füge TLS-Sektion mit cert-manager Annotation hinzu

Workload-Spezifikationsanforderungen:
- `resources.requests` und `resources.limits` für CPU und Speicher — Größe basierend auf dem erkannten Stack
- `livenessProbe` und `readinessProbe` — HTTP oder exec je nach Situation; schließe `initialDelaySeconds` und `failureThreshold` ein
- Pod-Ebene `securityContext`: `runAsNonRoot: true`, `seccompProfile: RuntimeDefault`
- Container-Ebene `securityContext`: `readOnlyRootFilesystem: true`, `allowPrivilegeEscalation: false`, `capabilities: drop: [ALL]`
- `terminationGracePeriodSeconds` auf das Shutdown-Verhalten der Anwendung abgestimmt
- `topologySpreadConstraints` zur Verteilung über Knoten und Zonen
- `app.kubernetes.io/*` Standard-Labels auf jeder Ressource

Nach den Manifesten gib eine Checkliste mit Elementen aus, die vor `kubectl apply` abgeschlossen werden müssen:
1. Ersetze Image-Tag Platzhalter mit dem echten Digest oder Semver-Tag
2. Fülle Secret-Werte aus (oder referenziere einen externen Secrets-Operator)
3. Stelle Ingress-Hostname und TLS-Secret-Namen ein
4. Bestätige Storage-Klassennamen, falls StatefulSet mit PVCs verwendet wird
5. Überprüfe, dass HPA-Metriken-Namen zu deiner metrics-server oder Prometheus Adapter Konfiguration passen
