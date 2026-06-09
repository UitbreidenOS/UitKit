---
description: Voeg rate limiting toe aan API-eindpunten met configureerbare strategieën en juiste 429-responses
argument-hint: "[endpoint-or-router] [limit] [window]"
---
Implementeer rate limiting voor: $ARGUMENTS

Parse als: doeleindpunt of routerpad, aanvraagslimiet (bijv. 100), tijdvenster (bijv. 1m, 1h). Indien niet opgegeven, pas verstandige standaardwaarden toe: 100 aanvr./min voor openbare eindpunten, 1000 aanvr./min voor geverifieerde eindpunten.

Implementatievereisten:
- Identificeer de bestaande rate-limit-infrastructuur (Redis, in-memory, middleware-bibliotheek) — gebruik deze in plaats van een tweede systeem in te voeren
- Indien geen rate limiter bestaat, kies op basis van implementatie: Redis-ondersteund voor multi-instance, in-memory met waarschuwing voor single-instance
- Sleutel op: IP voor niet-geverifieerde routes, gebruiker-/tenant-ID voor geverifieerde routes, API-sleutel voor sleutel-geverifieerde routes
- Pas limieten toe op middleware-/decorator-niveau — verspreid limitcontroles niet in bedrijfslogica
- Retourneer `429 Too Many Requests` met deze headers:
  - `Retry-After: <seconds>`
  - `X-RateLimit-Limit: <limit>`
  - `X-RateLimit-Remaining: <remaining>`
  - `X-RateLimit-Reset: <unix-timestamp>`
- Response body: `{ "error": "rate_limit_exceeded", "retry_after": <seconds> }`
- Sliding window wordt verkozen boven fixed window — vermijdt burst op venstergrens
- Ondersteuning voor per-route-overschrijving van limieten zonder de globale configuratie aan te raken

Configuratie:
- Limieten moeten configureerbaar zijn via omgevingsvariabelen of configuratiebestand — geen magische nummers in middleware
- Documenteer de omgevingsvariabelnamen in een opmerking op de definitieplaats

Schrijf tests voor:
- Aanvraag binnen limiet (geslaagd)
- Aanvraag op exacte limiet (geslaagd)
- Aanvraag die limiet overschrijdt (429 met juiste headers)
- Limiet opnieuw ingesteld nadat venster vervalt
