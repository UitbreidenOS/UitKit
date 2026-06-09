---
description: Controleer de API en produceer een versieringsstrategie met migratiepadden voor baanbrekende wijzigingen
argument-hint: "[current-version] [target-version]"
---
Produceer een API-versieringsplan voor: $ARGUMENTS

Analyseer als: huidige versie (bijv. v1) en doelversie (bijv. v2). Indien weggelaten, analyseer de bestaande API en beveel aan of versioning überhaupt nodig is.

Analysefase — lees de codebase en identificeer:
1. Alle openbare eindpunten (pad, methode, aanvraagvorm, antwoordvorm)
2. Welke wijzigingen baanbrekend zijn versus niet-baanbrekend:
   - Baanbrekend: een veld verwijderen, een veldtype wijzigen, een veld hernoemen, statuscodesemantiek wijzigen, een eindpunt verwijderen, verificatievereisten wijzigen
   - Niet-baanbrekend: een optioneel veld toevoegen, een nieuw eindpunt toevoegen, een nieuwe enum-waarde toevoegen (voorzichtig), validatie versoepelen
3. Eventuele bestaande clients of SDK-consumenten die hierdoor getroffen zouden worden

Versieringsstrategie selectie:
- URL-padversering (`/v2/`) — aanbevolen standaard; expliciet, cachable, gemakkelijk routeerbaar
- Headerversering (`API-Version: 2`) — schonere URL's maar moeilijker te testen in browsers; alleen gebruiken als het project dit al doet
- Query-param versering — vermijden; niet RESTful en breekt caching

Implementatieplan:
- Definieer het versievoorvoegsel op één plaats (routerconfiguratie, basis-URL-constante) — niet verspreid over elke route
- Oude versieroutes moeten tijdens een vervaldperiode functioneel blijven (aanbeveling: minimaal 6 maanden voor externe API's, 1 grote release voor interne)
- Voeg `Deprecation`- en `Sunset`-headers toe aan v1-responses wanneer v2 gelanceerd wordt
- Versier alleen de routes die baanbrekende wijzigingen hebben — identieke routes kunnen handlers delen over versies heen
- Definieer een migratiehandleidingsdocument waarin elke baanbrekende wijziging met voor/na-voorbeelden wordt opgesomd

Uitvoer:
1. Lijst met gevonden baanbrekende wijzigingen (of "geen gevonden" indien schoon)
2. Aanbevolen versieringsstrategie met rechtvaardiging
3. Routeringsstructuur die toont hoe v1 en v2 naast elkaar bestaan
4. Codewijzigingen nodig om de versiering uit te voeren
5. Aanbeveling voor vervaltijdlijn
6. Migratiehandleidingsskeletting voor API-consumenten
