# Werkstroom voor foutonderzoek

Parallele multi-hypothese-debugging — wanneer de grondoorzaak van een bug onduidelijk is, voer je gelijktijdig meerdere agenten uit die verschillende theorieën onderzoeken. Aanzienlijk sneller dan sequentieel debuggen.

## Wanneer gebruiken

Gebruik deze werkstroom wanneer:
- Een bug meerdere waarschijnlijke oorzaken heeft en je weet niet welke
- Een productieprobleem vereist snelle grondoorzaakidentificatie
- Je dezelfde bug al meer dan 30 minuten debugt
- De bug is intermitterend en moeilijk deterministisch te reproduceren

## Fase 1: Hypothesegeneratie (5 minuten)

Voordat je agenten uitvoert, definieer je 3-5 elkaar uitsluitende hypothesen:

```
Bug: [beschrijf het symptoom — exacte fout of gedrag]
Context: [wat is onlangs veranderd, welke omgeving, welke voorwaarden veroorzaken het]

Genereer 3-5 verschillende grondoorzaak-hypothesen gerangschikt op waarschijnlijkheid.
Elke hypothese moet:
- Specifiek zijn (noemt een concrete oorzaak, niet "iets mis met auth")
- Testbaar zijn (kan worden bevestigd of uitgesloten door specifieke code te lezen)
- Elkaar uitsluiten (niet "misschien de cache of misschien de database")

Format:
H1 (meest waarschijnlijk): [hypothese] — bewijs: [waarom je dit denkt]
H2: [hypothese] — bewijs: [...]
H3: [hypothese] — bewijs: [...]
```

**Voorbeeldhypothesen voor "betaling mislukt intermitterend":**
```
H1: Racevoorwaarde — twee gelijktijdige verzoeken maken dubbele bestellingen
    Bewijs: fout gebeurt alleen bij hoge gelijktijdigheid, logs tonen dubbele bestel-ID's
H2: Stripe rate limit — bereiken 100 req/s limiet in piekverkeer
    Bewijs: fouten pieken precies bij verkeerspieken, 429 in sommige foutenlogboeken
H3: Database-verbindingsuitputting — pool time-out tijdens hoge belasting
    Bewijs: foutbericht "connection timeout" verschijnt in sommige gevallen
H4: Webhook-herhalingsbotsingng — Stripe herhaalt een eerder mislukte webhook
    Bewijs: sommige dubbele kosten traceren naar dezelfde webhook-event-ID
```

## Fase 2: Parallel onderzoek

Voeg één agent per hypothese in. Elke agent krijgt precies één theorie om te onderzoeken en niets anders:

```
[Voer deze agenten parallel uit, niet sequentieel]

Agent 1 (H1 — Racevoorwaarde):
"Onderzoek of een racevoorwaarde dubbele bestellingen veroorzaakt.
Kijk naar: src/api/orders/create.ts, database transactie isolatieniveau,
elk mutex- of vergrendelmechanisme.
Doel: bevestig of weerleg deze hypothese met specifiek code-bewijs."

Agent 2 (H2 — Stripe rate limit):
"Onderzoek of we Stripe API rate limits raken.
Kijk naar: src/services/stripe.ts, request logging, Stripe dashboard indien beschikbaar,
eventuele retry-logica of queue voor Stripe-oproepen.
Doel: bevestig of weerleg met bewijs."

Agent 3 (H3 — DB-verbindingsgroep):
"Onderzoek of database-verbindingsgroe-uitputting betalingsfouten veroorzaakt.
Kijk naar: database-verbindingsconfiguratie, groepgrootte vs. gelijktijdige aanvragen,
eventuele verbindingsfoutenlogboeken.
Doel: bevestig of weerleg met bewijs."

Agent 4 (H4 — Webhook-replay):
"Onderzoek of Stripe webhook-herhalingen dubbele verwerking veroorzaken.
Kijk naar: src/webhooks/stripe.ts, idempotentie-sleutelimplementatie,
webhook-event-ID-deduplicatie.
Doel: bevestig of weerleg met bewijs."
```

## Fase 3: Synthese (nadat alle agenten rapporteren)

```
Gegeven deze onderzoeksresultaten: [plak alle agenten-outputs]

1. Welke hypothese werd bevestigd en waarom?
2. Welk bewijs weerlegt de andere hypothesen?
3. Wat is de specifieke fix?
4. Welke tests zouden deze regressie voorkomen?
```

## Fase 4: Fix en verifiëring

Implementeer de fix alleen voor de bevestigde hypothese.

Voer het specifieke testgeval uit dat deze bug had moeten opvangen:
```bash
# Voeg eerst een regressietest toe
# Implementeer dan de fix
# Bevestig dan dat de test slaagt
```

## Alternatief: Snelle triage (< 15 min fouten)

Voor eenvoudiger fouten met een duidelijke schuldige, sla parallelle agenten over en gebruik deze snelle checklist:

```
1. Wat veranderde in de laatste inzet? (git log --since="2 hours ago")
2. Is de fout reproduceerbaar in isolatie? (minimale reproductie)
3. Wat zegt de stack trace? (lees de werkelijke regel, gok niet)
4. Is er een test die dit had moeten opvangen? (zo niet, schrijf het voor fixeren)
5. Fix → test verifiëren → implementeren
```

## Gerelateerde inhoud

- `/agents/roles/incident-commander` — voor productieincidenten die communicatie vereisen
- `/skills/productivity/debug` — debug-vaardigheid voor single-agent onderzoek
- `/skills/productivity/self-eval` — beoordeel de kwaliteit van uw debug-proces

---
