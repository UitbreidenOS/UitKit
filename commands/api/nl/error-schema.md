---
description: Definieer en dwing een consistent error response schema af voor alle API endpoints
argument-hint: "[scope: file, router, or 'all']"
---
Audit en dwing een consistent error response schema af voor: $ARGUMENTS

Scope wordt standaard ingesteld op de gehele API als $ARGUMENTS leeg is of "all".

Doelschema voor fouten (RFC 9457 / Problem Details for HTTP APIs):
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

Gebruik dit schema tenzij het project al een vastgesteld error format heeft — als dat het geval is, standardiseer naar dat formaat in plaats daarvan.

Stappen:
1. Scan alle error-returnerende codepaths: gooi exceptions, error middleware, catch blokken, validation handlers
2. Identificeer inconsistenties: bare strings, inconsistente sleutels (`message` vs `error` vs `detail`), ontbrekende status codes, gemengde vormen
3. Definieer een enkel error type/interface/class aan de projectwortel (`ApiError` of gelijkwaardig)
4. Vervang elke ad-hoc error response met gestructureerde constructie van dat type
5. Centraliseer alle error serialisatie op één plaats (error middleware / exception handler) — niet verspreid over controllers
6. Zorg ervoor dat validatiefouten per-veld fouten opsommen:
   ```json
   "errors": [{ "field": "email", "message": "Invalid format" }]
   ```
7. Strip stack traces uit productieresponses — log ze aan de serverzijde, nooit verzenden naar client
8. Map interne error types naar HTTP status codes in één lookup table — geen status code literals buiten die map
9. Voeg een `trace_id` toe gecorreleerd met uw loggingsysteem als er één in gebruik is

Output:
- De error type definitie
- De gecentraliseerde error handler
- Lijst van alle bestanden gewijzigd
- Eventuele error responses die niet kunnen worden gestandaardiseerd (met reden)
