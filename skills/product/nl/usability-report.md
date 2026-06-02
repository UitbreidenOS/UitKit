---
name: usability-report
description: "Bruikbaarheidstest rapport: sessie-samenvattingen, ernstbeoordelingen, bevindingen, geprioriteerde aanbevelingen"
---

# Vaardigheid: Bruikbaarheidsrapport

## Wanneer activeren
- Je hebt een ronde bruikbaarheidstests voltooid (begeleid of onbegeleid) en moet de bevindingen uitschrijven
- Je hebt ruwe sessieaantekeningen, opnames of observatielogboeken die je wilt omzetten in een gestructureerd rapport
- Stakeholders hebben een geprioriteerde lijst met problemen nodig vóór een ontwerpbeoordeling of sprint planning
- Je wilt bruikbaarheidsproblemen scoren en rangschikken op ernst voordat je beslist wat je aanpakt
- Je moet een deelbaar artefact produceren waarop niet-onderzoekers (PM's, engineers, leidinggevenden) actie kunnen ondernemen

## Wanneer NIET gebruiken
- Je hebt nog geen sessies uitgevoerd — gebruik de `/ux-researcher`-vaardigheid om de test eerst te plannen
- Je wilt kwalitatieve interviews samenvatten (geen bruikbaarheidstaken) — dat is onderzoekssynthese, geen bruikbaarheidsrapport
- Je hebt een UX-audit op basis van heuristieken nodig zonder sessies — gebruik `/ux-audit`
- Je wilt persona's bouwen op basis van de data — gebruik `/persona-builder` nadat het rapport klaar is

## Instructies

### Volledige generator voor bruikbaarheidsrapporten

```
Schrijf een bruikbaarheidstestrapport voor [product/functie].

## Context
Product: [naam en korte beschrijving]
Geteste functie: [de specifieke stroom of interactie die wordt geëvalueerd]
Testformaat: [begeleid op afstand / begeleid persoonlijk / onbegeleid (bijv. Maze, UserTesting.com)]
Deelnemers: [N] — [korte screeningscriteria, bijv. "operatiemanagers mid-market, bestaande klanten"]
Uitgevoerde sessies: [datumreeks]
Onderzoeksvragen:
1. [Primaire vraag — bijv. "Kunnen gebruikers een nieuwe factuur aanmaken zonder hulp?"]
2. [Secundaire vraag — bijv. "Begrijpen gebruikers het verschil tussen de staten Concept en In behandeling?"]

## Ruwe bevindingen (plak hier je sessieaantekeningen)
[Plak observatieaantekeningen, videotijdstempels, hardop-denk-citaten, taakvoltooiingsrecords]

## Produceer dit rapport:

### Managementsamenvatting (halve pagina)
- Wat we hebben getest en waarom
- De 3 meest kritieke bevindingen in gewone taal
- Aanbevolen vervolgstappen (top 3 acties die het team moet ondernemen)
- Algehele bruikbaarheidsindruk: [Vraagt om verbetering / Acceptabel / Sterk]

### Methodologie
- Testdoelstellingen
- Deelnemersprofiel en wervingscriteria
- Takenlijst (letterlijke taakopdrachten gebruikt)
- Verzamelde meetgegevens: taakvoltooiingspercentage, tijd per taak, foutpercentage, SUS-score (indien verzameld), kwalitatieve observaties

### Kwantitatieve resultaten
| Taak | Voltooiingspercentage | Gem. Tijd (s) | Foutpercentage | SUS-bijdrage |
|---|---|---|---|---|
| Taak 1: [naam] | X/N (X%) | Xs | X fouten/gebruiker | - |
| Taak 2: [naam] | X/N (X%) | Xs | X fouten/gebruiker | - |

SUS-score: [X]/100
- 85+: Uitstekend
- 71-84: Goed (bovengemiddeld)
- 51-70: OK (ondergemiddeld — aandacht vereist)
- <51: Slecht (herontwerp nodig)

### Bruikbaarheidsbevindingen (geprioriteerd)

Voor elke bevinding:

**Bevinding [N]: [Korte beschrijvende titel]**
Ernst: [Kritiek / Hoog / Gemiddeld / Laag] — zie ernstsrubric hieronder
Frequentie: [X van N deelnemers getroffen]
Betrokken taak/taken: [Taaknaam/namen]

**Wat we hebben geobserveerd:**
[Specifieke, observeerbare beschrijving van het gedrag — nog geen interpretatie]
"[Representatief deelnemerscitaat letterlijk]"

**Waarom het belangrijk is:**
[De gevolgen — taakmislukking, afhaken, onjuiste actie, supportgesprek, enz.]

**Aanbeveling:**
[Specifieke, uitvoerbare ontwerp- of inhoudswijziging — niet "verbeter de UI"]

Bewijs: [Deelnemers-ID's + tijdstempels indien van opnames]
Inspanningsschatting: [Laag / Gemiddeld / Hoog — voor engineeringprioritering]

---

### Ernstsrubric (Nielsen's schaal, aangepast)

| Ernst | Definitie | Aanbevolen actie |
|---|---|---|
| Kritiek | Blokkeert taakvoltooiing; deelnemer kan niet verder | Oplossen vóór release |
| Hoog | Grote wrijving; de meeste gebruikers hebben ernstige moeite, sommigen haken af | Oplossen in volgende sprint |
| Gemiddeld | Merkbare wrijving; vertraagt gebruikers of veroorzaakt fouten | Inplannen binnen 2-4 sprints |
| Laag | Kleine ergernis; polijstprobleem | Backlog / nice to have |

Ernst = Impact × Frequentie:
- Impactscore: Cosmetisch (1) / Klein (2) / Groot (3) / Catastrofaal (4)
- Frequentiescore: Zelden (1) / Sommigen (2) / De meesten (3) / Allen (4)
- Prioriteitsscore = Impact × Frequentie; sorteer bevindingen aflopend

### Geprioriteerde aanbevelingentabel

| Prioriteit | Bevinding | Ernst | Frequentie | Inspanning | Aanbevolen oplossing | Eigenaar |
|---|---|---|---|---|---|---|
| P1 | [Bevindingstitel] | Kritiek | X/N | Laag | [Korte aanbeveling] | Design |
| P2 | [Bevindingstitel] | Hoog | X/N | Gemiddeld | [Korte aanbeveling] | Design+Eng |
| P3 | [Bevindingstitel] | Gemiddeld | X/N | Hoog | [Korte aanbeveling] | PM |

### Wat we nog niet weten
- [Hiaat 1 — een vraag die deze ronde testen niet kon beantwoorden]
- [Hiaat 2 — een hypothese die nog niet is gevalideerd]

Aanbevolen vervolgonderzoek: [het ene vervolgonderzoek dat de grootste resterende onzekerheid zou wegnemen]

### Bijlage
- Demografietabel deelnemers
- Volledige sessieaantekeningen / ruwe observaties
- Taakvoltooiingsdata per deelnemer
- Opnamelinks (indien van toepassing)
```

### Snelle ernst-triage (plak ruwe aantekeningen, ontvang geprioriteerde lijst)

```
Ik heb ruwe observatieaantekeningen van [N] bruikbaarheidssessies. Triage deze bevindingen op ernst.

Product: [naam]
Getoetste taak: [taakomschrijving]

Ruwe aantekeningen:
[plak sessieaantekeningen — één observatie per regel of alinea is prima]

Geef voor elke afzonderlijke bevinding:
- Bevindingstitel (kort)
- Ernst: Kritiek / Hoog / Gemiddeld / Laag
- Frequentie: X/N deelnemers
- Aanbeveling in één regel

Sorteer op ernst aflopend. Markeer de top 3 voor directe actie.
```

### SUS-scoring en interpretatie

```
Bereken en interpreteer een SUS (System Usability Scale) score op basis van ruwe antwoorden.

SUS heeft 10 items, elk beoordeeld 1-5 door deelnemers.
Oneven items (1, 3, 5, 7, 9): score = antwoord - 1
Even items (2, 4, 6, 8, 10): score = 5 - antwoord

SUS-score = (som van alle gecorrigeerde scores) × 2,5

Deelnemersantwoorden (plak als CSV of tabel):
[P1: 4, 2, 4, 1, 4, 1, 5, 1, 5, 2]
[P2: ...]

Bereken:
1. SUS-score per deelnemer
2. Gemiddelde SUS-score over alle deelnemers
3. Percentiel en adjectiefbeoordeling:
   - 90-100: Best denkbaar
   - 85-89: Uitstekend
   - 71-84: Goed
   - 51-70: OK (onder gemiddeld)
   - 25-50: Slecht
   - <25: Slechtst denkbaar
4. Vergeleken met het branchegemiddelde (68 = branchegemiddelde voor software)
5. Trendanalyse als je SUS-scores hebt van een vorige ronde

Inclusief: interpretatiealinea voor stakeholders die niet weten wat SUS is.
```

### Overzicht presentatiepresentatie voor stakeholders

```
Zet dit bruikbaarheidsrapport om in een presentatie van 10 dia's voor stakeholders.

Publiek: [PM's en engineering leads / leidinggevenden / designteam / iedereen]
Tijd: [20-minuten presentatie]
Doel: [goedkeuring krijgen om oplossingen te prioriteren / team informeren / volgende sprint plannen]

Structuur van de presentatie:
Dia 1: Wat we hebben getest + waarom het er nu toe deed
Dia 2: Wie we hebben getest (deelnemersprofiel — geen namen, geen demografische opvulling)
Dia 3: Algemeen resultaat — één kopcijfer (SUS / voltooiingspercentage / top statistiek)
Dia 4: Bevinding 1 — meest kritiek (inclusief screenshot of citaat)
Dia 5: Bevinding 2 — op één na meest kritiek
Dia 6: Bevinding 3 — op twee na meest kritiek
Dia 7: Volledige geprioriteerde probleementabel (alle bevindingen)
Dia 8: Aanbevolen oplossingen en inspanningsschatting
Dia 9: Wat we hierna doen (vervolgplan)
Dia 10: Bijlage — methodologie voor de sceptici

Voor elke bevindingsdia:
- Één titel die een uitspraak in gewone taal is over het probleem (niet "Bevinding 4")
- Één deelnemerscitaat in groot lettertype
- Wat het betekent voor het bedrijf (niet alleen de UX)
- De specifieke aanbeveling

Schrijf diatitels en sprekernotities. Beperk elke dia tot maximaal 3-5 opsommingspunten.
```

## Voorbeeld

**Gebruiker:** We hebben 6 begeleide sessies op afstand uitgevoerd om onze nieuwe checkout-stroom te testen. Taak 1 (kortingscode toepassen) had 3/6 voltooiingen. Taak 2 (verzendadres wijzigen bij checkout) had 5/6. Belangrijkste observaties: gebruikers zoeken het kortingsveld onderaan de winkelwagen, maar het staat bovenaan. Twee gebruikers sloten het tabblad en dachten dat ze iets hadden stukgemaakt toen de pagina opnieuw laadde na het invoeren van de code.

**Uitvoer:**

```markdown
# Bruikbaarheidsrapport: Checkout-stroom — Juni 2026

## Managementsamenvatting
We hebben de herontworpen checkout-stroom getest met 6 deelnemers. De stroom voor het invoeren van kortingscodes heeft een kritiek vindbaarheidssprobleem dat 50% taakmislukking veroorzaakt, en een pagina-herlaad na het invoeren van de code veroorzaakt het afhaken van gebruikers. De wijziging van het verzendadres is grotendeels succesvol (83% voltooiing) met kleine wrijving.

**Top 3 acties:**
1. [KRITIEK] Verplaats het kortingscodeveld naar de onderkant van de bestellingsoverzicht — gebruikers scannen van boven naar beneden
   en zoeken het codeveld naast het totaal, niet bovenaan.
2. [KRITIEK] Vervang het volledig herladen van de pagina na het invoeren van de kortingscode door een inline prijsupdate (geen herlaad).
3. [GEMIDDELD] Voeg inline bevestiging toe wanneer de korting is toegepast ("€15 bespaard" in groen, naast het totaal).

Algemene indruk: Vraagt om verbetering vóór lancering.

---

## Kwantitatieve resultaten

| Taak | Voltooiingspercentage | Gem. Tijd | Foutpercentage |
|---|---|---|---|
| Kortingscode toepassen | 3/6 (50%) | 94s | 1,8 fouten/gebruiker |
| Verzendadres wijzigen | 5/6 (83%) | 41s | 0,4 fouten/gebruiker |

---

## Bevinding 1: Positie kortingsveld veroorzaakt systematische taakmislukking
**Ernst: Kritiek** | **Frequentie: 6/6 deelnemers zochten eerst op de verkeerde plek**

Wat we hebben geobserveerd: Alle 6 deelnemers scrolden naar de onderkant van de winkelwagen op zoek naar het kortingsveld.
Het veld staat bovenaan de winkelwagen, boven de itemlijst — de laatste plek waar gebruikers kijken.
3 van de 6 gaven op voordat ze het vonden.

"Ik dacht gewoon dat er geen kortingsveld was. Ik heb overal onderaan gezocht." — P4

Waarom het belangrijk is: 50% taakmislukking bij een primaire kortingsinstapstroom = verlaten winkelwagens,
meer supportcontacten en kortingsomzet die nooit wordt omgezet.

Aanbeveling: Verplaats het kortingscodeveld naar de onderkant van het bestellingsoverzicht,
direct boven het bestellingstotaal. Dit is de positie die gebruikers verwachten (consistent met
Amazon, Shopify en de meeste grote e-commerce checkout-stromen).

Inspanning: Laag (CSS-herpositionering + kleine sjabloonwijziging)

---

## Bevinding 2: Pagina-herlaad bij code-invoer veroorzaakt waargenomen foutstatus
**Ernst: Kritiek** | **Frequentie: 2/6 deelnemers haakten af; 4/6 toonden zichtbare verwarring**

Wat we hebben geobserveerd: Na het invoeren van een geldige kortingscode laadt de pagina volledig opnieuw.
Twee deelnemers dachten dat ze weg waren genavigeerd van checkout of dat er een fout was opgetreden.
Eén deelnemer sloot het tabblad.

"Ik dacht dat ik alles kwijt was. Dat draaien — ik wist niet of het had gewerkt." — P2

Aanbeveling: Vervang het volledig herladen van de pagina door een in-place AJAX-prijsupdate.
Toon inline bevestiging: "Code SUMMER20 toegepast — je hebt €15 bespaard" in groene tekst.

Inspanning: Gemiddeld (asynchroon frontend-updatepatroon)
```

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — wij bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
