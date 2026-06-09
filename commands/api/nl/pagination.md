---
description: Voeg cursor-gebaseerde of offset-paginering toe aan een lijst-endpoint met consistent responsschema
argument-hint: "[endpoint-or-model]"
---
Voeg paginering toe aan het endpoint of resource: $ARGUMENTS

Als $ARGUMENTS leeg is, zoek alle lijst-endpoints (die arrays retourneren) en pas paginering toe op elk.

Kies de pagineringstrategie op basis van het use case:
- Cursor-gebaseerd (standaard voor de meeste feeds en grote datasets): stabiel onder gelijktijdige schrijfbewerkingen, ondersteunt oneindig scrollen, kan niet naar willekeurige pagina springen
- Offset/pagina-gebaseerd (alleen als de UI "ga naar pagina N" vereist): eenvoudiger maar inconsistent onder schrijfbewerkingen

Cursor-gebaseerde implementatie:
- Cursor codeert de sorteerkolom-waarde + primaire sleutel van de laatst geziene rij — base64-coderen, nooit onbewerkte databasewaarden blootleggen
- Standaard sortering: aflopend op `created_at`, secundaire sortering op `id` voor gelijkbrekerwerking
- Accepteer `cursor` (ondoorzichtige tekenreeks) en `limit` (geheel getal, 1–100, standaard 20) als queryparameters
- Valideer `limit` — wijs < 1 of > 100 af met 400
- Responsschema:
  ```json
  {
    "data": [...],
    "pagination": {
      "next_cursor": "<opaque>",
      "has_more": true,
      "limit": 20
    }
  }
  ```
- `next_cursor` is null als er geen volgende pagina's zijn
- Geef nooit het totale aantal vrij tenzij expliciet vereist — het is kostbaar op schaal

Offset-gebaseerde implementatie (alleen indien aangevraagd):
- Accepteer `page` (1-geïndexeerd) en `per_page` (1–100, standaard 20)
- Voeg `total`, `page`, `per_page`, `total_pages` in de response-envelop in

Beide strategieën:
- Voeg een database-index toe aan de sorteerkolom als deze niet bestaat
- De query moet een enkele databaseoproep zijn — geen N+1 uit het afzonderlijk ophalen van aantal tenzij offset-paginering dit vereist
- Werk de OpenAPI-specificatie voor het endpoint bij als deze bestaat

Schrijf tests: eerste pagina, tweede pagina via cursor, leeg resultaat, limietgrens-validatie.
