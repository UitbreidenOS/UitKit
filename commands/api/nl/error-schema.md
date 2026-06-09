---
description: Definieer en zet een consistent foutresponsieschema af voor alle API-endpoints
argument-hint: "[scope: file, router, or 'all']"
---
Controleer en zet een consistent foutresponsieschema af voor: $ARGUMENTS

Scope standaard naar de gehele API als $ARGUMENTS leeg is of "all".

Doelfoutschema (RFC 9457 / Problem Details for HTTP APIs):
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

Gebruik dit schema tenzij het project al een gevestigd foutformat heeft — als dat het geval is, standaardiseer in plaats daarvan naar dat.

Stappen:
1. Scan alle foutretournerende codepaden: geworpen uitzonderingen, foutmiddleware, catchblokken, validatiehandlers
2. Identificeer inconsistenties: blote strings, inconsistente sleutels (`message` vs `error` vs `detail`), ontbrekende statuscodes, gemengde vormen
3. Definieer een enkel fouttype/interface/klasse op de projectroot (`ApiError` of equivalent)
4. Vervang alle ad-hoc foutresponsen met gestructureerde constructie van dat type
5. Centraliseer alle foutserialisatie op één plek (foutmiddleware / exceptionhandler) — niet verspreid over controllers
6. Zorg ervoor dat validatiefouten per-veld fouten opsommen:
   ```json
   "errors": [{ "field": "email", "message": "Invalid format" }]
   ```
7. Strip stack traces uit productieresponsen — log ze aan serverzijde, stuur nooit naar client
8. Kaart interne fouttypen toe aan HTTP-statuscodes in één opzoektabel — geen statuscode-literals buiten die kaart
9. Voeg een `trace_id` toe die gecorreleerd is met uw loggingsysteem als er één in gebruik is

Output:
- De fouttype-definitie
- De gecentraliseerde fouthandler
- Lijst van alle gewijzigde bestanden
- Eventuele foutresponsen die niet konden worden gestandaardiseerd (met reden)
