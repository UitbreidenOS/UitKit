---
description: Voeg rate limiting toe aan API-eindpunten met configureerbare strategieën en juiste 429-antwoorden
argument-hint: "[endpoint-or-router] [limit] [window]"
---
Implementeer rate limiting voor: $ARGUMENTS

Parse als: doeleindpunt of router-pad, verzoeklimiet (bijv. 100), tijdvenster (bijv. 1m, 1u). Indien niet opgegeven, pas verstandige standaardwaarden toe: 100 verzoeken/min voor openbare eindpunten, 1000 verzoeken/min voor geverifieerde.

Implementatievereisten:
- Identificeer de bestaande rate-limit-infrastructuur (Redis, in-memory, middleware-bibliotheek) — gebruik deze in plaats van een tweede systeem in te voeren
- Als er geen rate limiter bestaat, kies op basis van implementatie: Redis-gebaseerd voor multi-instance, in-memory met waarschuwing voor single-instance
- Sleutel op: IP voor niet-geverifieerde routes, gebruiker/tenant-ID voor geverifieerde routes, API-sleutel voor sleutel-geverifieerde routes
- Pas limieten toe op middleware/decorator-niveau — plaats limietcontroles niet verspreid in bedrijfslogica
- Retourneer `429 Too Many Requests` met deze headers:
  - `Retry-After: <seconds>`
  - `X-RateLimit-Limit: <limit>`
  - `X-RateLimit-Remaining: <remaining>`
  - `X-RateLimit-Reset: <unix-timestamp>`
- Responsebody: `{ "error": "rate_limit_exceeded", "retry_after": <seconds> }`
- Schuifend venster voorkeur boven vast venster — voorkomt burst bij venstergrenzen
- Ondersteun per-route overschrijving van limieten zonder de globale configuratie aan te raken

Configuratie:
- Limieten moeten configureerbaar zijn via omgevingsvariabelen of configuratiebestand — geen magische getallen in middleware
- Documenteer de omgevingsvariabelenamen in een opmerking op de definitieplek

Schrijf tests voor:
- Verzoek binnen limiet (geslaagd)
- Verzoek exact op limiet (geslaagd)
- Verzoek overschrijdt limiet (429 met juiste headers)
- Limiet herstelt na vensterverlopen
