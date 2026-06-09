---
description: Ein konsistentes Fehlerantwort-Schema über alle API-Endpunkte definieren und durchsetzen
argument-hint: "[scope: file, router, or 'all']"
---
Audit und Durchsetzung eines konsistenten Fehlerantwort-Schemas für: $ARGUMENTS

Der Bereich wird auf die gesamte API standardisiert, falls $ARGUMENTS leer oder "all" ist.

Zielfehlerschema (RFC 9457 / Problem Details für HTTP APIs):
```json
{
  "type": "https://example.com/errors/validation-failed",
  "title": "Validation Failed",
  "status": 422,
  "detail": "The 'email' field must be a valid email address.",
  "instance": "/requests/abc-123",
  "trace_id": "3f2e1d..."
}
```

Verwenden Sie dieses Schema, es sei denn, das Projekt hat bereits ein etabliertes Fehlerformat — verwenden Sie in diesem Fall stattdessen eine Standardisierung auf dieses.

Schritte:
1. Scannen Sie alle Codepfade, die Fehler zurückgeben: Geworfene Ausnahmen, Error-Middleware, Catch-Blöcke, Validierungshandler
2. Identifizieren Sie Inkonsistenzen: Bare Strings, inkonsistente Keys (`message` vs `error` vs `detail`), fehlende Statuscodes, gemischte Formen
3. Definieren Sie einen einzelnen Fehlertyp/Interface/Klasse im Projektstamm (`ApiError` oder Äquivalent)
4. Ersetzen Sie jede Ad-hoc-Fehlerantwort durch strukturierte Konstruktion dieses Typs
5. Zentralisieren Sie alle Fehler-Serialisierung an einer Stelle (Error-Middleware / Exception Handler) — nicht verstreut über Controller
6. Stellen Sie sicher, dass Validierungsfehler Fehler pro Feld aufzählen:
   ```json
   "errors": [{ "field": "email", "message": "Invalid format" }]
   ```
7. Entfernen Sie Stack Traces aus Produktionsantworten — protokollieren Sie sie serverseitig, senden Sie sie niemals an den Client
8. Ordnen Sie interne Fehlertypen den HTTP-Statuscodes in einer Nachschlagetabelle zu — keine Statuscode-Literale außerhalb dieser Zuordnung
9. Fügen Sie eine `trace_id` hinzu, die mit Ihrem Protokollierungssystem korreliert, falls vorhanden

Ausgabe:
- Die Fehlertypdef inition
- Der zentralisierte Fehlerhandler
- Liste aller geänderten Dateien
- Alle Fehlerantworten, die nicht standardisiert werden konnten (mit Grund)
