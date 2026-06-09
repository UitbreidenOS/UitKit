---
description: Implementieren Sie Rate Limiting für API-Endpunkte mit konfigurierbaren Strategien und korrekt formatierten 429-Antworten
argument-hint: "[endpoint-or-router] [limit] [window]"
---
Implementieren Sie Rate Limiting für: $ARGUMENTS

Analysieren Sie folgende Parameter: Ziel-Endpunkt oder Router-Pfad, Anfragelimit (z. B. 100), Zeitfenster (z. B. 1m, 1h). Falls nicht angegeben, wenden Sie sinnvolle Standards an: 100 Anfragen/min für öffentliche Endpunkte, 1000 Anfragen/min für authentifizierte.

Implementierungsanforderungen:
- Identifizieren Sie die vorhandene Rate-Limiting-Infrastruktur (Redis, speicherintern, Middleware-Bibliothek) — nutzen Sie diese, anstatt ein zweites System einzuführen
- Falls kein Rate Limiter vorhanden ist, wählen Sie basierend auf dem Deployment: Redis-gestützt für Mehrinstanz-Setups, speicherintern mit Warnung für Single-Instance
- Schlüsseln Sie nach: IP-Adresse für nicht authentifizierte Routes, Benutzer-/Mandanten-ID für authentifizierte Routes, API-Schlüssel für schlüssel-authentifizierte Routes
- Wenden Sie Limits auf Middleware-/Decorator-Ebene an — verteilen Sie Limit-Checks nicht über die Geschäftslogik
- Geben Sie `429 Too Many Requests` mit folgenden Headern zurück:
  - `Retry-After: <seconds>`
  - `X-RateLimit-Limit: <limit>`
  - `X-RateLimit-Remaining: <remaining>`
  - `X-RateLimit-Reset: <unix-timestamp>`
- Response-Body: `{ "error": "rate_limit_exceeded", "retry_after": <seconds> }`
- Sliding-Window wird gegenüber Fixed-Window bevorzugt — vermeidet Bursts an der Fenstergrenze
- Unterstützen Sie Pro-Route-Überschreibung von Limits ohne Änderung der globalen Konfiguration

Konfiguration:
- Limits müssen über Umgebungsvariablen oder Konfigurationsdatei konfigurierbar sein — keine Magic Numbers in der Middleware
- Dokumentieren Sie die Umgebungsvariablennamen in einem Kommentar am Definitionsort

Schreiben Sie Tests für:
- Anfrage innerhalb des Limits (erfolgreich)
- Anfrage genau beim Limit (erfolgreich)
- Anfrage über dem Limit (429 mit korrekten Headern)
- Limit-Zurückstellung nach dem Ablauf des Fensters
