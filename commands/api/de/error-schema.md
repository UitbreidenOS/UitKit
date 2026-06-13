---
description: Ein einheitliches Fehlerantwortschema für alle API-Endpunkte definieren und durchsetzen
argument-hint: "[scope: file, router, or 'all']"
---
Überprüfen und durchsetzen eines einheitlichen Fehlerantwortschemas für: $ARGUMENTS

Der Scope wird auf die gesamte API gesetzt, wenn $ARGUMENTS leer ist oder „all".

Zielfehlerschema (RFC 9457 / Problem Details for HTTP APIs):
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

Verwenden Sie dieses Schema, es sei denn, das Projekt hat bereits ein etabliertes Fehlerformat — falls ja, standardisieren Sie stattdessen auf dieses.

Schritte:
1. Scannen Sie alle Fehler-Rückgabepfade: geworfene Ausnahmen, Error Middleware, Catch-Blöcke, Validierungshandler
2. Identifizieren Sie Unstimmigkeiten: bloße Strings, inkonsistente Schlüssel (`message` vs `error` vs `detail`), fehlende Statuscodes, gemischte Formen
3. Definieren Sie einen einzelnen Fehlertyp/Interface/Klasse im Projektwurzelverzeichnis (`ApiError` oder äquivalent)
4. Ersetzen Sie jede Ad-hoc-Fehlerantwort mit einer strukturierten Konstruktion dieses Typs
5. Zentralisieren Sie alle Fehler-Serialisierung an einer Stelle (Error Middleware / Exception Handler) — nicht verstreut über Controller
6. Stellen Sie sicher, dass Validierungsfehler pro-Feld-Fehler aufzählen:
   ```json
   "errors": [{ "field": "email", "message": "Invalid format" }]
   ```
7. Entfernen Sie Stack Traces aus Produktionsantworten — protokollieren Sie sie serverseitig, senden Sie sie niemals an Clients
8. Ordnen Sie interne Fehlertypen HTTP-Statuscodes in einer Nachschlagetabelle zu — keine Statuscode-Literale außerhalb dieser Map
9. Fügen Sie eine `trace_id` hinzu, die mit Ihrem Logging-System korreliert, falls eines verwendet wird

Ausgabe:
- Die Fehlertyp-Definition
- Der zentralisierte Error Handler
- Liste aller geänderten Dateien
- Alle Fehlerantworten, die nicht standardisiert werden konnten (mit Grund)
