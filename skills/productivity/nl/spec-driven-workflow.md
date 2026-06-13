---
name: spec-driven-workflow
description: "Spec-gestuurde ontwikkeling: schrijf eerst de spec, dan tests, dan implementatie — vermindert rework, verduidelijkt vereisten vóór codering en produceert beter gedocumenteerde systemen"
---

# Spec-gestuurde Workflow Skill

## Wanneer activeren
- Een niet-triviale functie starten waar vereisten ambigu zijn
- Bouw een API of interface waarvan andere teams afhankelijk zijn
- Verminder rework veroorzaakt door het bouwen van het verkeerde
- Oefen testgestuurde ontwikkeling (TDD) op functieniveau
- Wil dat Claude de spec begrijpt voordat code wordt geschreven

## Wanneer NIET gebruiken
- Kleine bugfixes — repareer ze gewoon
- Verkennende prototypes waar het doel is om te leren, niet uit te sturen
- Taken waarbij de spec al perfect duidelijk en geschreven is
- Hotfixes die onmiddellijk uit moeten

## Instructies

### Spec-first sjabloon

```
Schrijf een spec voor [functie].

Functie: [beschrijf in gewoon Engels wat u wilt bouwen]
Gebruikers: [wie zal deze functie gebruiken]
Context: [waar dit in het systeem past — welke service, pagina of API]
Beperkingen: [prestaties, beveiliging, achterwaartse compatibiliteit, bestaande interfaces]

Spec sjabloon:

## Functie: [Naam]

### Samenvatting
[1-2 zinnen — wat deze functie doet en waarom]

### Achtergrond
[Waarom bouwen we dit? Welk probleem lost het op?]

### Scope
In scope:
- [Specifiek gedrag 1]
- [Specifiek gedrag 2]

Buiten scope (expliciet):
- [Ding dat we NIET bouwen]
- [Edge case die we uitstellen]

### Interface definitie
[Voor API: endpoints, inputs, outputs, statuscodes]
[Voor UI: user journey, states, transitions]
[Voor bibliotheek: functie handtekeningen, typen, retourwaarden]

Voorbeeld (API):
POST /api/invoices
Verzoek:
  { customer_id: string, items: [{sku: string, qty: int, price_cents: int}], due_date: string }
Antwoord 201:
  { invoice_id: string, total_cents: int, pdf_url: string }
Antwoord 400:
  { error: "invalid_customer" | "items_empty" | "invalid_date" }

### Acceptatiecriteria (testbaar)
Format: Gegeven [context], wanneer [actie], dan [waarneembaar resultaat]

- GEGEVEN een geldige klant en items, WANNEER het endpoint wordt aangeroepen, DAN wordt een 201-antwoord met invoice_id geretourneerd
- GEGEVEN een ongeldige customer_id, WANNEER het endpoint wordt aangeroepen, DAN wordt een 400-antwoord met error: "invalid_customer" geretourneerd
- GEGEVEN lege items array, WANNEER het endpoint wordt aangeroepen, DAN wordt een 400-antwoord geretourneerd
- GEGEVEN items met negatieve prijs, WANNEER het endpoint wordt aangeroepen, DAN wordt een 400-antwoord geretourneerd

### Open vragen (oplos voordat u bouwt)
- [ ] [Vraag 1 — beslissing nodig]
- [ ] [Vraag 2 — veronderstelling te valideren]

### Afhankelijkheden
- [Externe service of API waarvan dit afhangt]
- [Interne service- of team-afhankelijkheid]

Schrijf de volledige spec voor mijn functie.
```

### Spec-naar-test vertaling

```
Converteer deze spec naar falende tests vóór implementatie.

Spec: [plak spec van hierboven]
Taal/framework: [TypeScript/Jest / Python/pytest / Go/testing / Ruby/RSpec]

Regels voor spec-naar-test:
1. Een test per acceptatiecriterium
2. Test de interface (inputs/outputs), niet de implementatie
3. Tests moeten als documentatie leesbaar zijn — iemand zou de functie moeten begrijpen door tests te lezen
4. Ongelukkige paden zijn net zo belangrijk als gelukkige paden

TypeScript/Jest voorbeeld (uit de factuurspec hierboven):

describe('POST /api/invoices', () => {
  describe('success cases', () => {
    it('creates an invoice with valid inputs and returns 201 with invoice_id', async () => {
      const res = await request(app).post('/api/invoices').send({
        customer_id: 'cust_valid',
        items: [{ sku: 'SKU-001', qty: 2, price_cents: 2999 }],
        due_date: '2026-12-31',
      });
      
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        invoice_id: expect.stringMatching(/^inv_/),
        total_cents: 5998,
        pdf_url: expect.stringContaining('https://'),
      });
    });
  });

  describe('validation errors', () => {
    it('returns 400 with invalid_customer when customer_id does not exist', async () => {
      const res = await request(app).post('/api/invoices').send({
        customer_id: 'cust_nonexistent',
        items: [{ sku: 'SKU-001', qty: 1, price_cents: 1000 }],
        due_date: '2026-12-31',
      });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('invalid_customer');
    });

    it('returns 400 when items array is empty', async () => {
      const res = await request(app).post('/api/invoices').send({
        customer_id: 'cust_valid',
        items: [],
        due_date: '2026-12-31',
      });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('items_empty');
    });
  });
});

Converteer mijn spec naar falende tests. Tests moeten falen totdat ik de functie implementeer.
```

### Implementatie uit spec

```
Implementeer [functie] volgens deze spec en tests.

Spec: [plak spec]
Tests: [plak falende tests]
Taal/framework: [opgeven]
Bestaande code context: [plak relevante bestaande interfaces, typen of aangrenzende code]

Implementatieregels:
1. Maak de tests slagen — niets meer, niets minder
2. Bouw geen functies die niet in de spec staan (zelfs als ze duidelijk nodig lijken)
3. Optimaliseer niet voortijdig — eenvoudig en correct slaat slim
4. Behandel elk foutgeval in de acceptatiecriteria van de spec
5. Vraag of een acceptatiecriterium ambigu is in plaats van aan te nemen

Implementatie volgorde:
1. Definieer eerst typen / interfaces (compileert naar geen output, documenteert de vorm)
2. Happy path implementatie (maak de 201 test slagen)
3. Validatie en foutbehandeling (maak de 400 tests slagen)
4. Edge cases (indien aanwezig in spec)
5. Voer alle tests uit — bevestig alles geslaagd voordat u indient

Geproduceerde code moet:
- Geen TODOs of tijdelijke commentaren hebben
- Geen commented-out code hebben
- Zonder wijziging compileren en uitvoeren

Implementeer de functie.
```

### Spec review

```
Controleer deze spec voordat we het bouwen.

Spec: [plak]
Doel: ambiguïteiten, ontbrekende edge cases en niet-uitgelijnde aannames voor codering vangen

Review checklist:

VOLLEDIGHEID:
□ Zijn alle inputs volledig opgegeven (typen, formaten, beperkingen)?
□ Zijn alle outputs volledig opgegeven (succes + foutresponsen)?
□ Zijn alle fouttoestanden opgesomd?
□ Zijn acceptatiecriteria specifiek en testbaar?
□ Zijn out-of-scope items expliciet vermeld?

AMBIGUÏTEIT:
□ Is enig criterium open voor meerdere interpretaties?
□ Worden termen consistent gebruikt?
□ Zijn er impliciete aannames die expliciet moeten zijn?
□ Heeft "due_date: string" een formaatspecificatie nodig? (ISO 8601? YYYY-MM-DD? Timezone-bewust?)

ONTBREKENDE EDGE CASES:
□ Wat gebeurt er met lege inputs?
□ Wat gebeurt er met inputs van maximale grootte?
□ Wat gebeurt er als een afhankelijkheid niet beschikbaar is?
□ Wat gebeurt er met gelijktijdige verzoeken?
□ Wat gebeurt er na rate limiting?

INTERFACE REVIEW:
□ Is de API consistent met bestaande endpoints?
□ Worden naamconventies gevolgd?
□ Is het responsformat consistent met andere endpoints?
□ Worden statuscodes correct gebruikt (201 voor creëren, 200 voor update, 404 voor niet gevonden)?

OPEN VRAGEN:
□ Zijn alle open vragen opgelost voordat we bouwen?
□ Zijn er beslissingen die worden uitgesteld maar nu moeten worden genomen?

Produceer: lijst met gaten en vragen om op te lossen voordat implementatie begint.
```

## Voorbeeld

**Gebruiker:** Ik wil een functie bouwen waar gebruikers een CSV met contacten kunnen uploaden en deze massaal importeren. Help me het eerst te specifiëren.

**Claudies spec:**

---

## Functie: Bulk Contact Import via CSV

### Samenvatting
Sta gebruikers toe een CSV-bestand met contactgegevens te uploaden. Het systeem valideert elke rij, importeert geldige contacten en retourneert een rapport met successen en mislukkingen.

### Scope
In scope:
- CSV-bestand upload via API endpoint
- Validatie van elke rij (vereiste velden, format)
- Import van geldige rijen als contacten
- Per-rij foutrapportage (welke rijen zijn mislukt en waarom)
- Duplicaatdetectie (dezelfde e-mail → overslaan of bijwerken, configureerbaar)

Buiten scope:
- UI bestandskiezer (voorlopig alleen API)
- CSV template download
- Asynchrone verwerking voor bestanden > 10.000 rijen (synchroon voor v1)
- Contactdeduplicatie in bestaande contacten (alleen e-mail match)

### Interface definitie

```
POST /api/contacts/import
Content-Type: multipart/form-data

Velden:
  file: CSV bestand (vereist)
  duplicate_strategy: "skip" | "update" (optioneel, standaard: "skip")

CSV format (header rij vereist):
  email (vereist), first_name, last_name, phone, company

Antwoord 200 (altijd 200, zelfs als enkele rijen mislukten):
{
  total_rows: 847,
  imported: 821,
  skipped: 14,        // duplicates
  failed: 12,          // validation errors
  errors: [
    { row: 3,  email: "bad-email", reason: "invalid_email_format" },
    { row: 17, email: null,       reason: "email_required" },
  ]
}

Antwoord 400 (fouten op bestandsniveau vóór verwerking):
  { error: "no_file_attached" | "invalid_file_type" | "file_too_large" }
  Max bestandsgrootte: 10MB
```

### Acceptatiecriteria
- GEGEVEN een geldig CSV met 100 rijen, WANNEER geïmporteerd, DAN wordt 200 geretourneerd met imported: 100
- GEGEVEN een CSV met 1 ongeldige e-mail, WANNEER geïmporteerd, DAN is de rij in errors[], alle anderen geïmporteerd
- GEGEVEN geen bestand bijgevoegd, WANNEER het endpoint wordt aangeroepen, DAN 400 met no_file_attached
- GEGEVEN een .xlsx bestand, WANNEER geüpload, DAN 400 met invalid_file_type
- GEGEVEN duplicate_strategy: "skip" en een dubbele e-mail, WANNEER geïmporteerd, DAN is het duplicate in overgeslagen aantal
- GEGEVEN duplicate_strategy: "update" en een dubbele e-mail, WANNEER geïmporteerd, DAN wordt het bestaande contact bijgewerkt

### Open vragen (oplos voordat u bouwt)
- [ ] Wat is het maximum aantal rijen per bestand? (voorgesteld: 10.000 — PM-goedkeuring nodig)
- [ ] Welke velden zijn vereist vs. optioneel? (voorgesteld: alleen e-mail vereist)
- [ ] Is "company" een vrij-tekststring of gekoppeld aan een Company-record?
- [ ] Wie kan dit endpoint aanroepen — alle gebruikers of alleen admins?

---

Los eerst de open vragen op, dan genereer ik de falende tests.

---
