---
description: OpenAPI 3.1-spec genereren of bijwerken op basis van bestaande routes of een beschrijving
argument-hint: "[source-file-or-description]"
---
OpenAPI 3.1-specificatie genereren of bijwerken op basis van: $ARGUMENTS

Als $ARGUMENTS een bestandspad is, lees de routedefinities uit dat bestand. Hvis het een beschrijving is, stel een spec van nul af op. Indien leeg, scan de codebase op alle routedefinities en genereer een volledige spec.

Vereisten:
- Gebruik OpenAPI 3.1.0 (niet 3.0.x — gebruik `type: "null"` niet `nullable: true`)
- Elk pad moet hebben: summary, operationId (camelCase, uniek), tags, parameters, requestBody (indien van toepassing), en responses
- Definieer alle schema's onder `components/schemas` — inline schema's in path items zijn verboden
- Gebruik `$ref` voor elk schema waarnaar meer dan eenmaal wordt verwezen
- Documenteer elke mogelijke responsstatus-code die de code daadwerkelijk retourneert — verzin geen extra codes
- Vereiste velden moeten in `required`-arrays staan — geen stille optionals
- Enum-waarden moeten overeenkomen met wat de code enforceert
- Voeg beveiligingsschema-definities toe als de API authenticatie gebruikt (Bearer JWT, API-sleutel, OAuth2, etc.)
- Voeg `description`-velden toe aan alle niet-voor-de-hand-liggende properties
- Markeer verouderde eindpunten met `deprecated: true` als gevonden

Opmaakregels:
- YAML-uitvoer, 2-spaties inspringing
- Houd `paths` alfabetisch gesorteerd op route
- Houd `components/schemas` alfabetisch gesorteerd

Voer het volledige `openapi.yaml`-bestand uit. Bij het bijwerken van een bestaande spec, toon alleen de gewijzigde secties met voldoende context om ze te plaatsen, en schrijf vervolgens het volledige bijgewerkte bestand.

Als de routebron dubbelzinnig is of framework-specifieke decorators niet herkend worden, vermeld welke routes zijn overgeslagen en waarom.
