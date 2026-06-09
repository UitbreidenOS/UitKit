---
description: Gesundheitsprobe-Endpunkte und Sondenkonfigurationen für den aktuellen Service hinzufügen oder prüfen
argument-hint: "[service name or file path]"
---
Gesundheitsprobe-Abdeckung hinzufügen oder prüfen für: $ARGUMENTS

Überprüfen Sie das Projekt, um das Framework, den Servertyp und vorhandene Gesundheitsprobe-Implementierungen zu identifizieren.

**Falls keine Gesundheits-Endpunkte vorhanden sind — implementieren Sie diese:**

Generieren Sie den minimalen Code zum Hinzufügen von:
1. `GET /healthz` (Lebensfähigkeit) — gibt `200 OK` mit `{"status":"ok"}` zurück, wenn der Prozess aktiv ist; keine Abhängigkeitsprüfungen
2. `GET /readyz` (Bereitschaft) — gibt `200 OK` nur zurück, wenn alle kritischen Abhängigkeiten (DB, Cache, nachgelagerte Dienste) erreichbar sind; gibt `503` mit einem JSON-Text zurück, der auflistet, welche Prüfungen fehlgeschlagen sind
3. `GET /metrics` — Prometheus-kompatible Darstellung, falls das Framework dies unterstützt (andernfalls notieren Sie, was erforderlich ist)

Implementierungsregeln:
- Beide Endpunkte müssen unter normaler Last in weniger als 100 ms antworten
- `/readyz` Abhängigkeitsprüfungen müssen Timeouts haben (Standard 2 Sekunden pro Prüfung) — blockieren Sie niemals auf unbestimmte Zeit
- Authentifizierung nicht auf `/healthz` oder `/readyz` erforderlich — Sonden müssen nicht authentifiziert sein
- Fehler auf WARN-Ebene protokollieren, nicht ERROR — Sondenausfälle sind Operationssignale, keine Anwendungsfehler
- Für `/readyz` DB-Prüfung: Verwenden Sie eine einfache Abfrage (`SELECT 1`), keine Schemaintrospection

**Falls Gesundheits-Endpunkte bereits vorhanden sind — prüfen Sie diese:**

Überprüfen Sie auf:
- Vermischung von Lebensfähigkeit und Bereitschaft (eine Lebensfähigkeitssonde, die die Datenbank prüft, startet Pods bei DB-Ausfällen neu — falsch)
- Fehlendes Timeout bei Abhängigkeitsprüfungen
- Endpunkte, die 200 mit einem Fehlerkörper zurückgeben (bricht alle Sonden)
- Sondenkonfigurationen in Kubernetes/Compose, die zu aggressiv sind (`failureThreshold: 1`) oder zu tolerant (kein `initialDelaySeconds`)

**Geben Sie in allen Fällen die entsprechende Sondenkonfiguration für jedes im Projekt gefundene Bereitstellungsziel aus:**

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

Markieren Sie alles, was zu falsch-positiven Neustarts oder stillen Bereitschaftsfehlern führen würde.
