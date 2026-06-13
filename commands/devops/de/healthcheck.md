---
description: Health-Check-Endpunkte und Probe-Konfigurationen für den aktuellen Service hinzufügen oder prüfen
argument-hint: "[Service-Name oder Dateipfad]"
---
Health-Check-Abdeckung prüfen und hinzufügen für: $ARGUMENTS

Projekt inspizieren, um Framework, Server-Typ und vorhandene Health-Check-Implementierungen zu identifizieren.

**Falls keine Health-Endpunkte vorhanden — implementieren:**

Minimalen Code generieren, um hinzuzufügen:
1. `GET /healthz` (Liveness) — gibt `200 OK` mit `{"status":"ok"}` zurück, wenn der Prozess läuft; keine Abhängigkeitsprüfungen
2. `GET /readyz` (Readiness) — gibt `200 OK` nur zurück, wenn alle kritischen Abhängigkeiten (DB, Cache, Downstream-Services) erreichbar sind; gibt `503` mit JSON-Body zurück, der auflistet, welche Prüfungen fehlgeschlagen sind
3. `GET /metrics` — Prometheus-kompatible Exposition, falls das Framework dies unterstützt (andernfalls notieren, was erforderlich ist)

Implementierungsregeln:
- Beide Endpunkte müssen unter normaler Last in unter 100ms antworten
- `/readyz` Abhängigkeitsprüfungen müssen Timeouts haben (Standard 2s pro Prüfung) — niemals unendlich blockieren
- Authentifizierung auf `/healthz` oder `/readyz` nicht erforderlich — Probes müssen unauthentifiziert sein
- Fehler auf WARN-Stufe protokollieren, nicht ERROR — Probe-Fehler sind Betriebssignale, keine Anwendungsfehler
- Für `/readyz` DB-Prüfung: leichte Abfrage (`SELECT 1`) verwenden, nicht Schema-Introspektion

**Falls Health-Endpunkte bereits vorhanden — prüfen:**

Überprüfen auf:
- Vermischung von Liveness und Readiness (Liveness-Probe, die DB prüft, führt zu Pod-Neustart bei DB-Ausfall — falsch)
- Fehlende Timeouts bei Abhängigkeitsprüfungen
- Endpunkte, die 200 mit Fehlerbody zurückgeben (bricht alle Probes)
- Probe-Konfigurationen in Kubernetes/Compose, die zu aggressiv sind (`failureThreshold: 1`) oder zu lenient (kein `initialDelaySeconds`)

**In allen Fällen die entsprechende Probe-Konfiguration für jedes im Projekt gefundene Deployment-Ziel ausgeben:**

Kubernetes:
```yaml
livenessProbe:
  httpGet: { path: /healthz, port: <port> }
  initialDelaySeconds: 10
  periodSeconds: 15
  failureThreshold: 3

readinessProbe:
  httpGet: { path: /readyz, port: <port> }
  initialDelaySeconds: 5
  periodSeconds: 10
  failureThreshold: 3
```

Docker Compose:
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:<port>/healthz"]
  interval: 15s
  timeout: 5s
  retries: 3
  start_period: 10s
```

Kennzeichne alles, das falsch-positive Neuerstarts oder stille Readiness-Fehler verursachen würde.
