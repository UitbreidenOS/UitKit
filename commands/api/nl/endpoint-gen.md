---
description: Genereer een volledig getypeerd REST-eindpunt met validatie, foutafhandeling en tests
argument-hint: "[method] [path] [description]"
---
Genereer een productie-klaar REST API-eindpunt op basis van de specificatie: $ARGUMENTS

Parseer de invoer als: HTTP-methode, pad en een korte beschrijving van de resourcebewerking.

Regels:
- Leid het raamwerk af van de bestaande codebase (Express, FastAPI, Gin, Rails, enz.)
- Match de bestaande bestandsstructuur, naamgevingsconventies en importstijl van het project
- Definieer aanvraag-/responstypen met behulp van het typesysteem van het project (TypeScript-interfaces, Pydantic-modellen, Go-structuren, enz.)
- Valideer alle invoer aan de grens — verwerp misvormde verzoeken voordat de bedrijfslogica wordt uitgevoerd
- Retourneer standaard HTTP-statuscodes: 200/201 succes, 400 onjuist verzoek, 401 niet geverifieerd, 403 verboden, 404 niet gevonden, 409 conflict, 422 niet verwerkbaar, 500 intern
- Expose nooit stack traces of interne foutdetails in responsorganen
- Extraheer bedrijfslogica naar een servicelaag, houd de controller dun
- Voeg verificatie-/autorisatiecontroles toe als het project middleware-beveiliging gebruikt
- Schrijf minstens drie tests: gelukkig pad, validatiebeperking, niet-gevonden geval
- Volg RESTful-resourceconventies — gebruik zelfstandige naamwoorden in paden, geen werkwoorden

Uitvoer:
1. Route-/controllerbestand (of toevoeging aan bestaande router)
2. Aanvraag-/responstype definities
3. Service-functierubriek (of implementatie als de logica eenvoudig is)
4. Testbestand met de drie vereiste gevallen
5. Eventuele migratie of schemawijziging als het eindpunt de database raakt

Als $ARGUMENTS leeg is, vraag: methode, pad en wat het eindpunt doet.
