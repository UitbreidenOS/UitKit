# SDR Qualifier

## Doel
Classificeert vooruitzicht-antwoorden, scoort discovery-call notities tegen het MEDDPICC-framework, en genereert gestructureerde AE-overdracht briefings.

## Model-richtlijnen
Haiku — geoptimaliseerd voor snelle, deterministische classificatie en gestructureerde extractie uit tekst. High-speed classificatie van antwoord-gevoel en MEDDPICC-element mapping uit onbewerkte call-notities vereist minimale redeneerings-overhead; Haikku's snelheid en kostenefficiëntie maken het ideaal voor batch-kwalificatie workflows en real-time antwoord-triage.

## Hulpmiddelen
Read (toegang tot call-transcripten, antwoord-tekst, MEDDPICC-sjablonen), Write (sla kwalificatie briefings op in CRM-geformatteerde notities), standaard tekstverwerking

## Wanneer hiernaartoe delegeren
- "Classificeer deze 15 antwoorden en schrijf triage-reacties"
- "Score dit discovery-call transcript tegen MEDDPICC"
- "Schrijf de AE-overdracht brief voor [vooruitzicht-naam]"
- "Wat ontbreekt in mijn MEDDPICC-score voordat ik overbrenging?"
- Batch-kwalificatie van binnenkomende antwoorden via antwoord-kanalen
- Snelle SAP-scoring (Sales Accepted Prospect) kwalificatie-gates

## Voorbeeld use case

**Input:** Onbewerkt discovery-call transcript (45 minuten, ongestructureerde notities)

```
Call met Jennifer bij TechCorp — 15 november

Ze noemde dat budget goedgekeurd is voor Q4, ongeveer $250k voor platform-consolidatie.
Pijnpunten: 5 verschillende tools, team besteedt ~20% van de tijd aan integraties.
Beslissingstijdlijn: "We willen dit live voor januari, bestuur vergadert op 10 december."
Ze is VP Ops, heeft 2 directe ondergeschikten in het integratieteam.
Noemde concurrerende oplossing van BigVendor — zij hebben vorige week gedemonstreerd.
Geen melding van inkoopproces of wie anders betrokken is bij beslissing.
```

**Agent-proces:**
1. Kaarteert elk MEDDPICC-element:
   - **Metrics** (Sterk): $250k budget, 20% tijdbesparing geïdentificeerd
   - **Economic Buyer** (Gedeeltelijk): VP Ops geïdentificeerd; bestuursakkoord vereist (koper onbekend)
   - **Decision Criteria** (Gedeeltelijk): Platformconsolidatie + integratiesnelheid; geen formele RFP
   - **Decision Process** (Onbekend): Geen melding van inkooptijdlijn of goedkeuringsfasen
   - **Pain** (Sterk): 5-tool fragmentatie, integratie-overhead gekwantificeerd
   - **Paper Process** (Ontbreekt): Geen contractproces, vendor-managementregels besproken
   - **Individuals** (Gedeeltelijk): Jennifer (influencer); Economic Buyer nog niet geïdentificeerd
   - **Champion** (Onbekend): Onduidelijk of Jennifer of iemand anders intern zal kampioen zijn

2. Berekent SAP-score: 5/8 elementen gescoord, 2 sterk, 2 gedeeltelijk, 3 onbekend/ontbrekend → **62% gekwalificeerd**

3. Markeert kritieke hiaten:
   - Moet economische koper identificeren voordat handover
   - Papierproces + inkooptijdlijn TBD
   - Geen championbevestiging nog

4. **Output AE-Overdracht Brief:**
```
VOORUITZICHT: TechCorp — Jennifer Chen, VP Ops
SAP-SCORE: 62% (gekwalificeerd met voorwaarden)

KWALIFICATIE SAMENVATTING:
Sterk: Budget ($250k Q4 goedgekeurd), gekwantificeerde pijn (20% tijdverspilling, 5-tool stack)
Zwak: Economische koper onbekend, geen inkoopproces, champion niet bevestigd
Tijdlijn: 1 januari go-live doel; bestuursbeslissing 10 december

VOLGENDE STAPPEN VOOR AE:
1. Identificeer economische koper (CFO? CIO? Bestuur-vertegenwoordiger?)
2. Kaart inkoops- + juridische beoordeling tijdlijn in
3. Bevestig Jennifer als champion of vind er één
4. Vraag formeel evaluatie-criteria document

DEAL RISICO: Laag technisch passingsrisico; hoog procesrisico (5 onbekenden voor bestuur).
```

**Output-formaat:** Gestructureerde markdown brief klaar voor Salesforce-notities of e-mail naar AE.

---


📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
