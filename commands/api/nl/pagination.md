---
description: Voeg cursor-gebaseerde of offset-paginering toe aan een list-endpoint met een consistente response-shape
argument-hint: "[endpoint-of-model]"
---
Paginering toevoegen aan het endpoint of de resource: $ARGUMENTS

Als $ARGUMENTS leeg is, vind alle list-endpoints (die arrays retourneren) en pas paginering toe op elk.

Kies de pagineringsstrategie op basis van het gebruik:
- Cursor-gebaseerd (standaard voor feeds en grote datasets): stabiel onder gelijktijdige schrijfbewerkingen, ondersteunt infinite scroll, kan niet naar willekeurige pagina gaan
- Offset/page-gebaseerd (alleen als de gebruikersinterface "ga naar pagina N" vereist): eenvoudiger maar inconsistent onder schrijfbewerkingen

Cursor-gebaseerde implementatie:
- Cursor codeert de sorteerkolom-waarde + primaire sleutel van de laatst geziene rij — base64-codering gebruiken, nooit ruwe DB-waarden blootstellen
- Standaardsortering: aflopend op `created_at`, secundaire sortering op `id` voor tie-breaking
- Accepteer `cursor` (ondoorzichtige string) en `limit` (geheel getal, 1–100, standaard 20) als queryparameters
- Valideer `limit` — wijs < 1 of > 100 af met 400
- Response-shape:
  ```json
  {
    "data": [...],
    "pagination": {
      "next_cursor": "<ondoorzichtig>",
      "has_more": true,
      "limit": 20
    }
  }
  ```
- `next_cursor` is null wanneer er geen volgende pagina's meer zijn
- Geef totale aantal nooit prijs tenzij expliciet vereist — het is duur op schaal

Offset-gebaseerde implementatie (alleen indien aangevraagd):
- Accepteer `page` (1-geïndexeerd) en `per_page` (1–100, standaard 20)
- Voeg `total`, `page`, `per_page`, `total_pages` toe aan de response-envelope

Beide strategieën:
- Voeg een database-index toe aan de sorteerkolom als deze nog niet bestaat
- De query moet één DB-aanroep zijn — geen N+1 door afzonderlijk het aantal op te halen tenzij offset-paginering dit vereist
- Werk de OpenAPI-specificatie voor het endpoint bij als deze bestaat

Tests schrijven: eerste pagina, tweede pagina via cursor, leeg resultaat, limiet-grensvalidatie.
