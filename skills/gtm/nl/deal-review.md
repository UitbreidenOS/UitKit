---
name: deal-review
description: "Dealreview-voorbereiding: MEDDPICC-scoring, risicosignalen, concurrentiepositie, vervolgstappen, prognose-categorie"
---

# Deal Review Vaardigheid

## Wanneer activeren
- Voorbereiding op een wekelijkse pipelinereview of prognose-gesprek met je manager
- Een kans zit te lang vast in een fase en je moet diagnosticeren waarom
- Je hebt net een sleutel-discovery of demo-gesprek gehad en wilt de dealstatus scoren voor je verder gaat
- Einde kwartaal: het controleren van prognosenauwkeurigheid en het identificeren van risico-deals
- Een deal is in de laatste fase en je moet een sluitplan bouwen voor de eindsprint

## Wanneer NIET gebruiken
- Je bouwt een gezamenlijk succesplan met de koper — gebruik `/mutual-success-plan`
- Je werkt aan een kampioenstrategie — gebruik `/champion-builder`
- Je moet dealvoorwaarden en economie structureren — gebruik `/deal-desk`
- Je doet territorium- of pipeline-prognoses over meerdere deals — gebruik `/commercial-forecaster`

## Instructies

### Volledige MEDDPICC dealreview

```
Voer een MEDDPICC dealreview uit voor [naam kans].

## Dealcontext
Bedrijf: [naam]
Dealgrootte: $[ACV] / $[TCV]
Fase: [Discovery / Demo / Evaluatie / Voorstel / Onderhandeling / Mondeling / Gewonnen gesloten]
Prognose-categorie: [Pipeline / Best Case / Commit / Gesloten]
Verwachte sluitdatum: [datum]
Dealleeftijd: [dagen since kans aangemaakt]

## MEDDPICC-scoring

Score elke dimensie: Sterk (2) / Aanwezig (1) / Zwak (0) / Ontbrekend (–1)
Totaal: /16. Gebruik als gezondheidssignaal, niet als strikt poortwachtersinstrument.

---

### M — Metrics
Welk meetbaar bedrijfsresultaat verwacht de koper van onze oplossing?

Gedocumenteerde metrics: [plak wat je weet, of schrijf "onbekend"]
Vereist: De koper moet een specifiek, gekwantificeerd resultaat opgeven dat ze proberen te bereiken.

Score: [2/1/0/-1]
Bewijs: [citaat uit discovery-gesprek, of noteer dat dit ontbreekt]
Risico als ontbrekend: Zonder duidelijke metrics kun je geen ROI aantonen, kan de koper de investering intern niet rechtvaardigen, en verlies je aan "niets doen."
Actie als ontbrekend: Plan een metrics-workshop of stuur een business case sjabloon — ga niet naar voorstel zonder dit.

---

### E — Economische Koper
Wie beheert het budget? Heb je met hen gesproken?

Economische koper geïdentificeerd: [Naam / Titel / Onbekend]
Heb je ze ontmoet? [Ja / Nee / Alleen introductie]
Weten ze de dealgrootte? [Ja / Nee]
Hebben ze budgetbevoegdheid? [Ja — bevestigd / Aangenomen / Onbekend]

Score: [2/1/0/-1]
Risico: Als de economische koper niet weet dat deze deal bestaat, heb je geen deal — je hebt een kampioen met een wens.
Actie als ontbrekend: Vraag een introductie van je kampioen. Sluit nooit een deal zonder goedkeuring van de economische koper.

---

### D — Beslissingscriteria
Welke criteria gebruikt de koper voor hun definitieve beslissing?

Vermelde beslissingscriteria: [vermeld wat je weet]
Niet-vermelde/aangenomen criteria: [wat je vermoedt maar niet hebt bevestigd]
Sluiten jouw sterke punten aan bij hun top-criteria? [Ja / Grotendeels / Nee]
Heb je geholpen de criteria te vormen? [Ja / Nee]

Score: [2/1/0/-1]
Risico: Onbevestigde of niet-gevormde criteria zijn een rode vlag — concurrenten kunnen de criteria definiëren in jouw nadeel.
Actie: Stuur een "afstemming beslissingscriteria" document naar je kampioen. Vraag hen te bevestigen en toe te voegen wat je miste.

---

### D — Beslissingsproces
Hoe neemt het koopteam de beslissing? Welke stappen blijven er over voor ze tekenen?

Beslissingsproces gedocumenteerd: [stappen die ze beschreven]
Stakeholders in het proces: [betrokken rollen]
Juridische/beveiligings-/inkoopbeoordeling: [Ja / Nog niet / Niet nodig]
Papierproces: [wie stelt op, wie tekent, hoe lang duurt juridische review]
Tijdlijn die ze hebben beschreven: [hun vermelde tijdlijn vs. jouw verwachte sluitdatum]

Score: [2/1/0/-1]
Risico: Elke onbekende stap in het proces is potentiële vertraging. "We moeten Legal er nog bij betrekken" is een waarschuwing van 4-8 weken.
Actie: Vraag direct: "Loop me door elke stap tussen vandaag en een getekend contract." Koppel het aan kalenderdatums.

---

### P — Papierproces / Identificeer Pijn
(Dubbel gebruik — kies interpretatie op basis van je verkoopmethodologie)

**Optie A — Papierproces:**
Contractvorm: [hun papier / ons papier / MSA al aanwezig]
Ondertekeningsbevoegdheid: [wie tekent — bij welk drempelbedrag escaleert het?]
Juridische reviewtijd: [geschat — vraag je kampioen, niet hun advocaat]
Financiële goedkeuring: [vereist / niet vereist]
Inkoop: [betrokken / niet betrokken / nog te bepalen]

**Optie B — Identificeer Pijn (Impliceer Pijn):**
Vermelde pijn: [wat de kampioen zegt]
Geïmpliceerde pijn: [wat er gebeurt als ze dit niet oplossen — weten ze dat?]
Pijnurgentie: [heeft een deadline of gebeurtenis urgentie gecreëerd, of is dit nice-to-have?]
Dwingende gebeurtenis: [wat verandert op [datum] dat het oplossen hiervan urgent maakt?]

Score: [2/1/0/-1]

---

### I — Identificeer Kampioen
Is er iemand binnen het account die voor deze deal zal vechten als jij niet in de kamer bent?

Naam en titel kampioen: [Naam / Onbekend]
Geslaagde kampionstests:
- [ ] Ze hebben je toegang gegeven tot de economische koper
- [ ] Ze hebben vertrouwelijke informatie gedeeld (org chart, competitieve evaluatie, interne politiek)
- [ ] Ze hebben voor je gepleit in meetings waar jij niet bij was (bewijs?)
- [ ] Ze zijn responsief en proactief — niet alleen beleefd betrokken

Kampioenkracht: [Sterk / Passief / Zwak / Geen]

Score: [2/1/0/-1]
Risico: Een passieve of zwakke kampioen betekent dat je deal vastzit in het midden van de org. Deals zonder sterke kampioenen sluiten niet.
Actie: Zie `/champion-builder` voor een volledige kampionsontwikkelingsstrategie.

---

### C — Concurrentie
Tegen wie concurreren we en wat is de competitieve dynamiek?

Concurrenten in deze deal: [benoemd / "evalueren alternatieven" / onbekend]
Ons winstpercentage vs. elke concurrent: [X%]
Perceptie van de koper van onze differentiators: [wat ze zeiden dat wij beter doen]
Perceptie van de koper van hiaten: [wat ze zeiden dat concurrenten beter doen]
Hebben we de criteria opnieuw geframed om onze sterke punten te bevoordelen? [Ja / Gedeeltelijk / Nee]

Score: [2/1/0/-1]
Risico: Als je niet weet tegen wie je concurreert, kun je niet positioneren. "Geen concurrentie" is doorgaans onjuist.
Actie: Vraag direct: "Evalueren jullie andere oplossingen? Wie zit er nog meer in de mix?"

---

## Samenvatting dealstatus

MEDDPICC totaal: [X]/16

| Dimensie | Score | Kernrisico |
|---|---|---|
| Metrics | X/2 | [risico] |
| Economische Koper | X/2 | [risico] |
| Beslissingscriteria | X/2 | [risico] |
| Beslissingsproces | X/2 | [risico] |
| Papierproces/Pijn | X/2 | [risico] |
| Kampioen | X/2 | [risico] |
| Concurrentie | X/2 | [risico] |

**Algehele dealstatus:** [Sterk (12-16) / Gemiddeld (8-11) / Risico (4-7) / Vastgelopen (0-3)]

**Top 3 risico's voor het sluiten van deze deal:**
1. [Meest kritiek — met specifieke actie om het aan te pakken]
2. [Tweede risico]
3. [Derde risico]

**Aanbeveling prognose-categorie:**
Op basis van MEDDPICC-score en nabijheid sluitdatum:
- [ ] Gewonnen Gesloten
- [ ] Commit (≥80% vertrouwen, duidelijk pad naar ondertekening)
- [ ] Best Case (50-80% vertrouwen, risico aanwezig maar beheersbaar)
- [ ] Pipeline (<50% vertrouwen, meerdere onbekenden)
- [ ] Risico (markeer voor manager-review)

**Volgende 3 acties (specifiek, met datums):**
1. [Actie] voor [datum] — eigenaar: [AE / kampioen / koper]
2. [Actie] voor [datum]
3. [Actie] voor [datum]
```

### Snelle dealstatuscheck (5 minuten voor gesprek)

```
Snelle MEDDPICC buikcheck voor [dealnaam] voor mijn [manager-review / QBR / klantgesprek].

Deal: [dealnaam, grootte, fase, sluitdatum]

Vertel me in 5 punten:
1. Sterkste MEDDPICC-dimensie (wat we weten)
2. Zwakste MEDDPICC-dimensie (grootste hiaat)
3. Of de sluitdatum realistisch is op basis van wat ik heb beschreven
4. Het enige belangrijkste dat in de komende 7 dagen moet worden bereikt
5. Of dit in Commit of Best Case thuishoort — en waarom

Context:
[plak alles wat je weet over de deal — discovery-notities, e-maildraden, vergadernotities]
```

### Diagnose vastgelopen deal

```
Deze deal zit al [N] dagen in [fase] zonder beweging. Diagnosticeer waarom en geef me een plan.

Deal: [naam, grootte, fase, oorspronkelijke sluitdatum]
Wat er is gebeurd: [samenvatting recente activiteit]
Laatste betekenisvolle koperactie: [datum en wat ze deden]
Mijn laatste actie: [datum en wat ik deed]
Kampionstatus: [betrokken / stil geworden / bedrijf verlaten]

Diagnosekader:
1. PROCESSTAGNATIE: Zijn we kwijtgeraakt in inkoop/legal/IT? → Welk specifiek document of stap blokkeert ons?
2. KAMPIOEN STIL GEWORDEN: Vermijdt de kampioen ons omdat ze interne steun zijn verloren? → Hoe opnieuw betrekken?
3. ECONOMISCHE KOPER NOOIT BETROKKEN: Hebben we de kampioen nooit overstegen? → Hoe nu een introductie krijgen?
4. DWINGENDE GEBEURTENIS VERDWENEN: Is er iets veranderd (budgetbevriezing, reorganisatie, nieuwe prioriteiten)? → Hoe een nieuwe dwingende gebeurtenis vinden?
5. CONCURRENT KRIJGT DE DEAL: Evalueren ze iemand anders? → Hoe het concurrentiegesprek heropenen?
6. ONS EIGEN PROCES: Hebben we een follow-up gemist, een document niet gestuurd, of een vraag onbeantwoord gelaten?

Voor de meest waarschijnlijke oorzaak: geef me een specifiek herbetrokkenheidsscript (e-mail of gesprekopening).
```

## Voorbeeld

**Gebruiker:** Dealreview: Acme Corp, $85K ACV, 45 dagen in de Evaluatiefase. Kampioen is de VP Operations. We hebben de CFO niet ontmoet. Ze vertelden ons dat ze één concurrent (ServiceMax) evalueren. Sluitdatum is einde van deze maand. Ik heb een goede productfit.

**Uitvoer:**

```markdown
## Dealreview: Acme Corp — $85K ACV

### MEDDPICC Samenvatting

| Dimensie | Score | Status |
|---|---|---|
| Metrics | 1/2 | Aanwezig — ROI-claim moet worden gekwantificeerd |
| Economische Koper (CFO) | 0/2 | Ontbrekend — nooit ontmoet; dit is risico #1 |
| Beslissingscriteria | 1/2 | Gedeeltelijk bekend — moet schriftelijk bevestigd worden |
| Beslissingsproces | 0/2 | Onbekend — 45 dagen in evaluatie zonder sluitplan |
| Pijn | 2/2 | Sterk — VP Ops heeft een duidelijk probleem |
| Kampioen (VP Ops) | 1/2 | Passief — heeft je niet aan CFO voorgesteld |
| Concurrentie (ServiceMax) | 1/2 | Bekende concurrent, geen concurrentiepositie gedocumenteerd |

**Totaal: 6/16 — Risico**

### Top 3 risico's

1. **CFO nooit betrokken (Kritiek):** Bij $85K bezit de CFO vrijwel zeker de budgetgoedkeuring.
   Je hebt een kampioen maar geen deal. Als de CFO voor het eerst over deze deal hoort wanneer
   ze worden gevraagd te tekenen, stopt of sterft de deal.
   Actie: E-mail je kampioen vandaag: "Om zeker te zijn dat we jouw einde-van-de-maandtijdlijn halen, wil ik
   20 minuten plannen met [naam CFO] om de business case door te nemen. Kun je deze week een intro maken?"

2. **Geen sluitplan met 30 dagen resterend (Kritiek):** 45 dagen in evaluatie zonder gedocumenteerde
   vervolgstappen of papierproces betekent dat er geen pad is van hier naar ondertekening deze maand.
   Actie: Stuur vandaag een Mutual Success Plan naar je kampioen. (Zie `/mutual-success-plan`)

3. **ServiceMax-positie ongedefinieerd (Hoog):** Je weet dat ze in de deal zitten maar hebt geen
   gedocumenteerde concurrentiepositie. Ze vormen mogelijk de evaluatiecriteria in jouw nadeel.
   Actie: Vraag je kampioen direct: "Wat hoor je van ServiceMax? Wat benadrukken ze dat wij
   niet hebben gedekt?" Neutraliseer het dan.

**Prognose-categorie: Best Case (niet Commit)**
Sluiten deze maand is mogelijk maar niet waarschijnlijk totdat de CFO betrokken is en een sluitplan is ondertekend.
```

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — we bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
