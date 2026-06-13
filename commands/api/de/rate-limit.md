---
description: Rate-Limiting für API-Endpunkte mit konfigurierbaren Strategien und korrekten 429-Antworten hinzufügen
argument-hint: "[endpoint-oder-router] [grenzwert] [zeitfenster]"
---
Implementiere Rate-Limiting für: $ARGUMENTS

Interpretiere als: Ziel-Endpunkt oder Router-Pfad, Anfragegrenzwert (z. B. 100), Zeitfenster (z. B. 1m, 1h). Falls nicht angegeben, wende sinnvolle Standards an: 100 Anfragen/Min. für öffentliche Endpunkte, 1000 Anfragen/Min. für authentifizierte.

Implementierungsanforderungen:
- Identifiziere die bestehende Rate-Limiting-Infrastruktur (Redis, im Speicher, Middleware-Bibliothek) — nutze sie statt ein zweites System einzuführen
- Falls kein Rate-Limiter existiert, wähle basierend auf Deployment aus: Redis-gestützt für Multi-Instance, im Speicher mit Warnung für Single-Instance
- Schlüssel nach: IP für nicht authentifizierte Routen, Benutzer-/Mandanten-ID für authentifizierte Routen, API-Schlüssel für schlüssel-authentifizierte Routen
- Wende Grenzwerte auf Middleware-/Decorator-Ebene an — streue Grenzwert-Kontrollen nicht in der Geschäftslogik
- Gebe `429 Too Many Requests` mit diesen Headern zurück:
  - `Retry-After: <sekunden>`
  - `X-RateLimit-Limit: <grenzwert>`
  - `X-RateLimit-Remaining: <verbleibend>`
  - `X-RateLimit-Reset: <unix-timestamp>`
- Antwortkörper: `{ "error": "rate_limit_exceeded", "retry_after": <sekunden> }`
- Sliding Window bevorzugt gegenüber Fixed Window — verhindert Ansturm an Fenstergrenzen
- Unterstütze Limit-Überschreibung pro Route ohne die globale Konfiguration zu beeinflussen

Konfiguration:
- Grenzwerte müssen über Umgebungsvariablen oder Konfigurationsdatei konfigurierbar sein — keine magischen Zahlen in Middleware
- Dokumentiere die Umgebungsvariablennamen in einem Kommentar an der Definitionsstelle

Schreibe Tests für:
- Anfrage innerhalb des Grenzwerts (erfolgreich)
- Anfrage genau beim Grenzwert (erfolgreich)
- Anfrage über dem Grenzwert (429 mit korrekten Headern)
- Grenzwert-Zurückstellung nach Fensterablauf
