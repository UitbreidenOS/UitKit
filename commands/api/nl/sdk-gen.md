---
description: Genereer een getypeerde client-SDK uit een OpenAPI-spec of bestaande API-routes
argument-hint: "[language] [spec-file-or-base-url]"
---
Genereer een client-SDK voor: $ARGUMENTS

Parse als: doeltaal (TypeScript, Python, Go, etc.) en ofwel een pad naar een OpenAPI-spec-bestand ofwel een basis-URL. Als er geen spec-bestand bestaat, genereer er eerst een uit de codebase voordat je de SDK genereert.

SDK-vereisten per taal:

TypeScript:
- ESM + CommonJS dual output via `package.json` `exports` field
- Volledige generic types — geen `any`, geen type assertions zonder rechtvaardiging
- Gebruik `fetch` natively; accepteer een optionele aangepaste fetch-implementatie voor test-mocking
- Zod-schema's voor runtime response-validatie (optioneel maar include als het project Zod gebruikt)
- Tree-shakeable: elke resource als een benoemde export, niet een klasse met alles erop

Python:
- `httpx` voor async, `requests` voor sync — bied beide aan of vraag welke
- Pydantic-modellen voor alle request/response-types
- Type hints overal, `py.typed` marker voor PEP 561-conformiteit
- Async-client als de primaire interface, sync als een dunne wrapper

Go:
- Idiomatisch Go: methoden op een `Client` struct, context als eerste param, `(T, error)` return-patroon
- Aparte types package voor gegenereerde modellen
- Geen externe dependencies buiten `net/http` tenzij het project er al een gebruikt

Alle talen:
- Één client klasse/struct per resourcegroep (spiegelt de OpenAPI `tags`)
- Constructor accepteert: basis-URL, auth token/API key, optionele HTTP-client
- Alle methoden komen 1:1 overeen met OpenAPI `operationId` waarden
- Retourneer getypeerde response-objecten — nooit raw strings of ongetypeerde maps
- Propageer alle HTTP-fouten als getypeerde error-objecten met `status`, `code`, en `message`
- README met installatie, initialisatie, en één voorbeeld per resource

Output de SDK als een directory structure listing, dan de volledige bestandsinhoud voor elk bestand. Als de spec meer dan 20 operaties heeft, genereer dan de client-infrastructuur en de eerste resourcegroep, dan list de resterende groepen om op aanvraag te genereren.
