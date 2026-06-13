# Werkstroom voor API-ontwerp

Gestructureerde werkstroom voor het ontwerpen van een nieuwe API — van vereisten tot implementatiegereerde specificatie.

## Wanneer gebruiken

Gebruik vóór het implementeren van een nieuw API-eindpunt of service-interface, vooral wanneer:
- Meerdere teams of services zullen de API gebruiken
- De API zal extern/klantgericht zijn
- Het eindpunt gegevensmutatie of complexe bedrijfslogica omvat
- U ontwerpt een nieuwe servicegrens

## Fase 1: Vereisten (30 minuten)

**Beantwoord eerst deze vragen:**

1. Wie zijn de consumenten?
   - Alleen interne service / meerdere interne services / externe API-consumenten / mobiele clients?
   
2. Wat moet elke consument doen?
   - Zet de use cases op, niet de eindpunten

3. Welke gegevens zijn betrokken?
   - Welke entiteiten worden gemaakt, gelezen, bijgewerkt of verwijderd?
   - Wat zijn de gegevenstoegangspatronen (op ID, op gebruiker, op datumbereik)?

4. Wat zijn de niet-functionele vereisten?
   - Latentiedoel (p99 < X ms)
   - Doorvoer (X verzoeken/seconde)
   - Consistentievereisten (sterk / eventual)
   - Verificatievereisten (openbaar / geverifieerd / service-naar-service)

## Fase 2: Interface-ontwerp (45 minuten)

**Ontwerp de eindpunten vanuit het perspectief van de consument:**

1. Begin met de use cases, niet het gegevensmodel
   ```
   Use case: "Gebruiker wil zijn bestellingsgeschiedenis zien"
   → GET /api/orders?userId={id}&status=completed&limit=20&cursor={cursor}
   
   Use case: "Gebruiker wil een bestelling annuleren"
   → POST /api/orders/{id}/cancel  (actiepunt, niet PATCH met status)
   ```

2. Pas REST-conventies toe (zie rules/common/api-design.md)

3. Ontwerp verzoek/responsschema's:
   ```typescript
   // Definieer TypeScript-typen of JSON Schema vóór implementatie
   type CreateOrderRequest = {
     customerId: string
     items: Array<{ productId: string; quantity: number }>
     shippingAddressId: string
   }
   
   type Order = {
     id: string
     customerId: string
     status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
     items: OrderItem[]
     total: number
     createdAt: string  // ISO 8601
   }
   ```

4. Ontwerp foutresponsen voor elk eindpunt:
   - Wat kan misgaan? (ongeldige invoer, niet gevonden, conflict, verificatiefout)
   - Hoe ziet elke foutrespons eruit?

## Fase 3: Validatie en review (20 minuten)

**Beoordeel het ontwerp aan de hand van deze criteria:**

**Perspectief consument:**
- Kan een consument alle use cases voltooien met de ontworpen eindpunten?
- Zijn responsvormen voorspelbaar en consistent?
- Helpen foutcodes de consument bij herstel?

**Implementatieperspectief:**
- Vereist dit N+1-query's om te implementeren? (ontwerp om te vermijden)
- Zijn er latentvallen? (grote joins, synchrone externe oproepen)
- Is paginering ontworpen voor het verwachte gegevensvolume?

**Veiligheidsperspectief:**
- Heeft elk eindpunt duidelijke verificatievereisten?
- Zijn er eindpunten die gegevens tussen gebruikers kunnen lekken?
- Wordt snelheidsbeperking overwogen?

**Versioning:**
- Is dit achterwaarts compatibel met bestaande consumenten?
- Indien breaking: is versioning gepland?

## Fase 4: Document en deel (20 minuten)

**API-specificatieformaat (OpenAPI of eenvoudig markdown):**

```markdown
## POST /api/orders

Maak een nieuwe bestelling.

**Verificatie:** Vereist (gebruiker)

**Verzoek:**
\```json
{
  "customerId": "string (UUID)",
  "items": [{ "productId": "string", "quantity": "integer (> 0)" }],
  "shippingAddressId": "string (UUID)"
}
\```

**Antwoord 201:**
\```json
{ "id": "string", "status": "pending", "total": "number" }
\```

**Antwoord 400:**
\```json
{ "error": { "code": "validation_error", "message": "string", "details": {} } }
\```

**Antwoord 404:**
\```json
{ "error": { "code": "not_found", "message": "Customer not found" } }
\```
```

**Deel met:**
- Consumerende teams (voor feedback vóór implementatie)
- Engineering lead (voor architectuurreview)
- Beveiliging (als gevoelige gegevens worden verwerkt)

## Fase 5: Implementatie

1. Schrijf eerst de tests (van de specificatie — deze worden uw acceptatietests)
2. Implementeer de handler
3. Valideer handmatig aan de hand van de specificatie
4. Documenteer alle afwijkingen van de originele specificatie

## Gerelateerde vaardigheden

- `/rules/common/api-design` — REST-conventies om toe te passen
- `/skills/productivity/spec-driven-workflow` — specificatie → test → implementatiepatroon
- `/skills/productivity/api-test-builder` — testsuites genereren van specificaties

---
