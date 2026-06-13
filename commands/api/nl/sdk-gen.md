---
description: Genereer een getypeerde client SDK op basis van een OpenAPI-specificatie of bestaande API-routes
argument-hint: "[taal] [specbestand-of-basis-url]"
---
Genereer een client SDK voor: $ARGUMENTS

Interpreteren als: doeltaal (TypeScript, Python, Go, enz.) en ofwel een pad naar een OpenAPI-specbestand ofwel een basis-URL. Als er geen specbestand bestaat, genereer er eerst één uit de codebase voordat je de SDK genereert.

SDK-vereisten per taal:

TypeScript:
- ESM + CommonJS dual output via het `package.json` `exports`-veld
- Volledige generieke types — geen `any`, geen type assertions zonder rechtvaardiging
- Gebruik `fetch` natively; accepteer een optionele aangepaste fetch-implementatie voor test-mocking
- Zod-schema's voor runtime-responsvalidatie (optioneel maar opnemen als het project Zod gebruikt)
- Tree-shakeable: elke resource als een named export, niet een klasse met alles erop

Python:
- `httpx` voor async, `requests` voor sync — bied beide aan of vraag welke
- Pydantic-modellen voor alle request/response-types
- Type hints overal, `py.typed`-marker voor PEP 561-conformiteit
- Async-client als de primaire interface, sync als een dunne wrapper

Go:
- Idiomatische Go: methoden op een `Client`-struct, context als eerste parameter, `(T, error)`-retourpatroon
- Apart types-pakket voor gegenereerde modellen
- Geen externe afhankelijkheden buiten `net/http` tenzij het project er al één gebruikt

Alle talen:
- Één clientklasse/struct per resourcegroep (spiegelt de OpenAPI `tags`)
- Constructor accepteert: basis-URL, auth-token/API-sleutel, optionele HTTP-client
- Alle methoden corresponderen 1:1 met OpenAPI `operationId`-waarden
- Retourneer getypeerde response-objecten — nooit onbewerkte tekenreeksen of getypeerde kaarten
- Verspreid alle HTTP-fouten als getypeerde error-objecten met `status`, `code` en `message`
- README met installatie, initialisatie en één voorbeeld per resource

Voer de SDK uit als een mapstructuurlijst, gevolgd door de volledige bestandsinhoud voor elk bestand. Als de spec meer dan 20 operaties heeft, genereer dan de core client-infrastructuur en de eerste resourcegroep, en vermeld vervolgens de resterende groepen om op aanvraag te genereren.
