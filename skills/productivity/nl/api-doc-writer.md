---
name: api-doc-writer
description: "API-documentatie op basis van OpenAPI-specificaties of code: endpoints, parameters, voorbeelden, foutcodes, SDK's"
---

# API Doc Writer Vaardigheid

## Wanneer activeren
- Je hebt een OpenAPI/Swagger-specificatie en moet leesbare referentiedocumentatie produceren
- Je schrijft documentatie voor een REST-, GraphQL- of webhook-API op basis van code of een specificatiebestand
- Bestaande API-documentatie is onvolledig — ontbrekende voorbeelden, foutcodes of authenticatiedocumentatie
- Je moet SDK-quickstarts of codevoorbeelden in meerdere talen produceren
- Je maakt een migratiegids tussen API-versies (v1 → v2, brekende wijzigingen)

## Wanneer NIET gebruiken
- Je wilt de API zelf ontwerpen — deze vaardigheid documenteert bestaande API's, ontwerpt geen nieuwe
- Je hebt een changelog nodig uit de git-geschiedenis — gebruik `/changelog-writer`
- Je hebt een volledige documentatiesitearchitectuur nodig — gebruik `/doc-site-builder` daarvoor eerst, en gebruik daarna deze vaardigheid om de referentiesectie te schrijven
- De API is alleen intern en het publiek is je eigen team — pas de diepgang en stijl aan; interne wiki's hebben niet de volledige consumentgerichte behandeling nodig

## Instructies

### OpenAPI-specificatie → referentiedocumentatie

```
Converteer deze OpenAPI-specificatie (of API-beschrijving) naar leesbare referentiedocumentatie.

## Invoer
Specificatieformaat: [OpenAPI 3.x / Swagger 2.x / gewone beschrijving van endpoints]
API-naam: [naam]
API-versie: [v1 / v2 / etc.]
Basis-URL: [https://api.example.com/v1]
Authenticatie: [API-sleutel / Bearer-token / OAuth 2.0 / Basic]

[Plak OpenAPI JSON/YAML hier, of beschrijf endpoints]

## Uitvoerformaat
Produceer voor elk endpoint een documentatiesectie:

---

### [HTTP-methode] [/pad]
[Één zin — wat dit endpoint doet en wanneer het te gebruiken]

**Authenticatie:** [vereist / optioneel — en hoe]

**Verzoek**

Headers:
| Header | Vereist | Waarde |
|---|---|---|
| `Authorization` | Ja | `Bearer {token}` |
| `Content-Type` | Ja | `application/json` |

Padparameters:
| Parameter | Type | Beschrijving |
|---|---|---|
| `{id}` | string | De unieke identificator van de [resource] |

Queryparameters:
| Parameter | Type | Vereist | Standaard | Beschrijving |
|---|---|---|---|---|
| `limit` | integer | Nee | 20 | Max aantal resultaten (1-100) |
| `cursor` | string | Nee | — | Paginatiecursor uit vorig antwoord |

Verzoeklichaam:
```json
{
  "field_name": "string",        // Vereist. Beschrijving van veld.
  "optional_field": 42,          // Optioneel. Standaard: 0. Beschrijving.
  "nested_object": {
    "child_field": true          // Vereist. Beschrijving.
  }
}
```

**Antwoord**

Succesantwoord — `200 OK`:
```json
{
  "id": "res_abc123",
  "created_at": "2026-06-01T12:00:00Z",
  "status": "active",
  "data": {
    "field": "value"
  }
}
```

Antwoordvelden:
| Veld | Type | Beschrijving |
|---|---|---|
| `id` | string | Unieke identificator, voorafgegaan door `res_` |
| `created_at` | ISO 8601 | Tijdstempel van aanmaken resource (UTC) |
| `status` | enum | `active` \| `inactive` \| `pending` |

**Foutantwoorden**
| Status | Foutcode | Wanneer het optreedt |
|---|---|---|
| `400` | `invalid_request` | Ontbrekend verplicht veld of ongeldig formaat |
| `401` | `unauthorized` | Ontbrekende of ongeldige API-sleutel |
| `403` | `forbidden` | Geauthenticeerd maar onvoldoende rechten |
| `404` | `not_found` | Resource met dat ID bestaat niet |
| `429` | `rate_limited` | Snelheidslimiet overschreden — zie sectie snelheidslimieten |
| `500` | `internal_error` | Serverfout — probeer opnieuw met exponentiële back-off |

**Codevoorbeelden**

```bash
# cURL
curl -X POST https://api.example.com/v1/[pad] \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "field_name": "value"
  }'
```

```python
import requests

response = requests.post(
    "https://api.example.com/v1/[pad]",
    headers={"Authorization": f"Bearer {api_key}"},
    json={"field_name": "value"}
)
response.raise_for_status()
data = response.json()
```

```typescript
const response = await fetch('https://api.example.com/v1/[pad]', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ field_name: 'value' }),
});
const data = await response.json();
```

---

## Sectieoverstijgende secties die naast endpointdocumentatie geproduceerd moeten worden:

### Authenticatiegids
[Schrijf een volledige gids voor het instellen van authenticatie — niet alleen een vermelding]

Secties:
1. Hoe een API-sleutel / token te verkrijgen
2. Hoe verzoeken te authenticeren (toon alle ondersteunde methoden)
3. Sleutels roteren / token vernieuwen
4. Scopes en rechten (indien van toepassing)
5. Authenticatie testen (een curl-opdracht die ze kunnen uitvoeren om te verifiëren dat het werkt)

### Snelheidslimieten
- Waarden van snelheidslimieten: [X verzoeken per minuut / uur / dag]
- Welke headers informatie over snelheidslimieten bevatten: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- Hoe om te gaan met 429's: retry-after-header, exponentiële back-off
- Limieten per endpoint versus globale limieten

### Paginatie
Als de API cursor- of offsetpaginatie gebruikt:
- Leg het paginatiemodel uit (op cursor gebaseerd / offset / paginagebaseerd)
- Toon hoe door alle resultaten te pagineren met een codevoorbeeld (een lus)
- Leg uit wat er gebeurt op de laatste pagina

### Webhooks-sectie (indien van toepassing)
- Webhookpayloadstructuur (met voorbeeld)
- Handtekeningverificatie (met codevoorbeeld in 3 talen)
- Beleid voor opnieuw proberen en leveringsgaranties
- Hoe webhook-endpoints te registreren
- Hoe lokaal te testen (ngrok / Cloudflare Tunnel)

### Gids voor foutafhandeling (sectieoverstijgend)
Maak niet alleen een lijst van foutcodes — schrijf een gids:
- Hoe onderscheid te maken tussen herstaartbare (5xx, 429) en niet-herstaartbare (4xx) fouten
- Implementatievoorbeeld van exponentiële back-off
- Idempotentiesleutels — wanneer ze te gebruiken
- Hoe de foutresponslichaam te lezen en te gebruiken

### SDK-quickstart
Voor elke ondersteunde SDK-taal een minimaal werkend voorbeeld:
- De SDK installeren
- Authenticeren
- De meest voorkomende API-aanroep doen
- Fouten afhandelen
- Volledig codevoorbeeld, uitvoerbaar zonder aanpassing (geen plaatshouderwaarden die het breken)
```

### API-migratiegids (versie-upgrade)

```
Schrijf een migratiegids van [API vOUD] naar [API vNIEUW].

## Te documenteren brekende wijzigingen
[Geef elke brekende wijziging op — hernoemd endpoint, verwijderde parameter, gewijzigde antwoordvorm, gewijzigde authenticatiemethode]

## Structuur van de migratiegids:

### Overzicht
- Wat is gewijzigd en waarom (gebruikersgericht reden, niet technisch)
- Tijdlijn: wanneer v[OUD] wordt afgeschreven, wanneer het wordt beëindigd
- Migratiescomplexiteit: [uren / dagen / weken voor een typische integratie]

### Brekende wijzigingen

Voor elke brekende wijziging:
**[Titel van wijziging]**
Wat is gewijzigd: [duidelijke beschrijving]
Voor (v[OUD]):
```[taal]
[oude code]
```
Na (v[NIEUW]):
```[taal]
[nieuwe code]
```
Migratiestappen:
1. [Specifieke stap]
2. [Specifieke stap]
Impact: [wat er kapot gaat als je dit niet migreert]

### Niet-brekende toevoegingen
[Functies beschikbaar in vNIEUW die niet in vOUD zitten — optioneel lezen voor v[OUD]-gebruikers]

### Migratielijst
- [ ] SDK-versie bijwerken naar [X]
- [ ] Basis-URL bijwerken van [oud] naar [nieuw]
- [ ] [Elke brekende wijziging als selectievakje]
- [ ] Testpakket uitvoeren
- [ ] Implementeren naar staging en verifiëren
- [ ] Implementeren naar productie

### Hulp tijdens migratie
[Link naar supportkanaal, migratie-spreekuren of feedbackformulier]
```

### Kwaliteitsaudit van documentatie — API-referentie

```
Controleer deze API-documentatie op volledigheid en kwaliteit.

[Plak bestaande API-documentatie]

Controleer aan de hand van dit beoordelingsschema:

VOLLEDIGHEID:
- [ ] Elk endpoint heeft: beschrijving, alle parameters gedocumenteerd, succesvol antwoord, foutantwoorden
- [ ] Authenticatie is uitgelegd met werkend voorbeeld
- [ ] Snelheidslimieten gedocumenteerd
- [ ] Paginatie gedocumenteerd (indien van toepassing)
- [ ] Codevoorbeelden in minimaal 2 talen voor elk endpoint
- [ ] Webhookdocumentatie (indien van toepassing) bevat handtekeningverificatie

NAUWKEURIGHEID:
- [ ] Parametertypes zijn nauwkeurig
- [ ] Verplicht versus optioneel correct gemarkeerd
- [ ] Standaardwaarden vermeld voor optionele parameters
- [ ] Foutcodes zijn echt (niet verzonnen)

BRUIKBAARHEID:
- [ ] Kan een ontwikkelaar integreren zonder de codebase te lezen?
- [ ] Zijn er werkende codevoorbeelden (geen pseudocode)?
- [ ] Is de taal eenvoudig en precies (geen marketingtekst)?
- [ ] Zijn valkuilen en randgevallen gedocumenteerd waar ze bestaan?

Voor elke ontbrekende zaak: specifieke aanbeveling voor herstel.
Prioriteit: welke ontbrekende zaken het meest waarschijnlijk integratiefouten of ondersteuningstickets veroorzaken.
```

## Voorbeeld

**Gebruiker:** Documenteer dit REST-endpoint. Het is `POST /v1/payments` dat een betaling aanmaakt. Verplichte velden: amount (integer, in centen), currency (ISO 4217-string), customer_id (string). Optioneel: description (string), metadata (object). Retourneert het betalingsobject met id, status, amount, currency, created_at. Fouten: 400 voor ongeldig bedrag, 401 voor slechte auth, 402 voor betalingsfout (met een decline_code-veld).

**Uitvoer:**

```markdown
### POST /v1/payments

Maak een nieuwe betalingsafschrijving aan voor een klant.

**Authenticatie:** Vereist — Bearer-token

**Verzoeklichaam**
```json
{
  "amount": 2000,
  "currency": "usd",
  "customer_id": "cus_abc123",
  "description": "Factuur #1042",
  "metadata": {
    "order_id": "ord_789"
  }
}
```

| Veld | Type | Vereist | Beschrijving |
|---|---|---|---|
| `amount` | integer | Ja | Bedrag in kleinste valuta-eenheid (centen voor USD). Moet > 0 zijn. |
| `currency` | string | Ja | ISO 4217-valutacode in kleine letters (`usd`, `eur`, `gbp`). |
| `customer_id` | string | Ja | ID van de te belasten klant. Moet bestaan. |
| `description` | string | Nee | Een voor mensen leesbare beschrijving opgeslagen bij de betaling. |
| `metadata` | object | Nee | Sleutel-waardeparen voor uw interne referentie. Max 50 sleutels, 500 tekens per waarde. |

**Succesantwoord — `200 OK`**
```json
{
  "id": "pay_abc123",
  "status": "succeeded",
  "amount": 2000,
  "currency": "usd",
  "customer_id": "cus_abc123",
  "created_at": "2026-06-01T12:00:00Z"
}
```

**Foutantwoorden**
| Status | Code | Wanneer |
|---|---|---|
| `400` | `invalid_amount` | Bedrag is 0, negatief of geen integer |
| `401` | `unauthorized` | Ontbrekend of ongeldig Bearer-token |
| `402` | `payment_failed` | Kaart geweigerd — controleer `decline_code` in antwoordlichaam |

Voor `402`-antwoorden bevat het lichaam:
```json
{
  "error": "payment_failed",
  "decline_code": "insufficient_funds",
  "message": "De kaart heeft onvoldoende saldo om de aankoop te voltooien."
}
```

Veelvoorkomende `decline_code`-waarden: `insufficient_funds`, `card_declined`, `expired_card`, `incorrect_cvc`.

**Codevoorbeelden**

```bash
curl -X POST https://api.example.com/v1/payments \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"amount": 2000, "currency": "usd", "customer_id": "cus_abc123"}'
```

```python
response = requests.post(
    "https://api.example.com/v1/payments",
    headers={"Authorization": f"Bearer {api_key}"},
    json={"amount": 2000, "currency": "usd", "customer_id": customer_id},
)
if response.status_code == 402:
    decline_code = response.json()["decline_code"]
    # verwerk weigering
response.raise_for_status()
payment = response.json()
```
```

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — we bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
