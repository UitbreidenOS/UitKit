# Claude voor UX-designers en -onderzoekers

Alles wat een UX-designer of -onderzoeker nodig heeft om AI-ondersteunde onderzoekssynthese, bruikbaarheidsanalyse, persona-creatie en ontwerpkritiek uit te voeren in Claude Code.

---

## Voor wie is dit bedoeld

Je bent een UX-designer, UX-onderzoeker of productdesigner wiens werk zich uitstrekt over gebruikersonderzoekssynthese, bruikbaarheidstests, persona-creatie, journey mapping, ontwerpkritiek, toegankelijkheidsbeoordelingen en communicatie met belanghebbenden. Je besteedt te veel tijd aan het opmaken van onderzoeksbevindingen, het schrijven van rapporten die niemand leest en het opnieuw maken van persona's van nul. Claude Code vermindert die overhead zodat je tijd kunt besteden aan wat daadwerkelijk menselijk oordeel vereist: met gebruikers praten, ontwerpbeslissingen nemen en het product beïnvloeden.

**Voor Claude Code:** 3-4 uur om een bruikbaarheidsrapport te schrijven. 2 uur om een persona te bouwen vanuit interviewaantekeningen. Een halve dag om een UX-audit te produceren voor een functie-overdracht.

**Erna:** Volledig bruikbaarheidsrapport in 30 minuten. Persona in 10 minuten vanuit ruwe aantekeningen. UX-audit in 45 minuten, geprioriteerd op ernst en inspanning.

---

## Installatie in 30 seconden

```bash
# Installeer alle UX-designervaardigheden
npx claudient add skills product

# Of selecteer wat je nodig hebt:
npx claudient add skill product/ux-researcher
npx claudient add skill product/usability-report
npx claudient add skill product/persona-builder
npx claudient add skill product/ux-audit
npx claudient add skill product/product-discovery
npx claudient add skill product/experiment-designer
npx claudient add agents roles/hypothesis-tester
```

---

## Jouw Claude Code UX-stack

### Vaardigheden (slash-commando's)

| Vaardigheid | Wat het doet | Wanneer te gebruiken |
|---|---|---|
| `/ux-researcher` | Gebruikerspersona's, journey maps, plannen voor bruikbaarheidstests, onderzoekssynthese | Kern onderzoekswerk |
| `/usability-report` | Volledig bruikbaarheidsrapport: sessiesamenvattingen, ernstclassificaties, aanbevelingen | Na elke ronde bruikbaarheidstests |
| `/persona-builder` | Op data gebaseerde gebruikerspersona's: doelen, frustraties, gedragingen, citaten | Na onderzoekssynthese |
| `/ux-audit` | Heuristische evaluatie op basis van Nielsens 10 heuristieken, geprioriteerde bevindingen | Vóór lancering, bij functie-overdrachten |
| `/product-discovery` | Discoveryframeworks: probleemomschrijving, aanname-mapping, kansgrootte-inschatting | Vroege discovery-fase |
| `/experiment-designer` | A/B-testontwerp, hypotheseformulering, metriekkeuze, steekproefgrootte | Ontwerpbeslissingen valideren met data |

### Agents

| Agent | Model | Wanneer inzetten |
|---|---|---|
| `hypothesis-tester` | Sonnet | Ontwerphypothesen valideren met onderzoeks- of analysedata |

---

## Dagelijkse werkstroom

### Ochtend — Onderzoekssynthesesessies

**Verander ruwe aantekeningen in inzichten:**
```
/ux-researcher

Synthetiseer gebruikersonderzoeksbevindingen uit deze 5 interviewaantekeningen.

Onderzoekstype: gebruikersinterviews
Aantal sessies: 5
Ruwe bevindingen: [plak je interviewaantekeningen, één per sessie]

Ik heb nodig: geclusterde thema's, geprioriteerde inzichten in "Wanneer X, doen gebruikers Y — dit betekent Z"-formaat,
en P1/P2/P3-aanbevelingen.
```

**Bouw een persona vanuit de synthese:**
```
/persona-builder

Bouw gebruikerspersona's vanuit deze onderzoeksdata.

Databronnen: gebruikersinterviews (5), ondersteuningstickets (3 maanden), NPS-verbatims
Product: [naam]
Gebruikersgroep: [wie dit product gebruikt]

[plak gesynthetiseerde bevindingen van hierboven]

Ik heb 2 persona's nodig voor een designsprint volgende week. Primair gebruik: ontwerpbeslissingen en scopediscussies.
```

---

### Na een bruikbaarheidstest — rapportage schrijven

**Verander sessieaantekeningen in een geprioriteerd rapport:**
```
/usability-report

Schrijf een bruikbaarheidstestrapport voor [functienaam].

Product: [naam]
Geteste functie: [specifieke flow]
Testformaat: gemodereerd op afstand
Deelnemers: 6 — [screeningcriteria]
Uitgevoerde sessies: [datumbereik]
Onderzoeksvragen:
1. [Primaire vraag]
2. [Secundaire vraag]

Ruwe bevindingen:
[Plak observatoraantekeningen, citaten, taakvoltooiingsrecords]
```

---

### Vóór lancering — UX-audit

**Voordat een functie wordt uitgebracht:**
```
/ux-audit

Voer een UX-audit uit van [functie/flow].

Product: [naam]
Scope: [schermen of flow te auditen]
Platform: web
Gebruikerstype: [personanaam]

[Beschrijf de UI — plak screenshot-links, Figma-links of beschrijf de interface]

Geef me: Nielsen-heuristiekscores, alle problemen met ernstclassificaties en een geprioriteerde herstellijst
gesorteerd op impact × inspanning.
```

---

### Facilitatie van ontwerpkritiek

**Gestructureerde kritiek op je eigen werk of een ontwerpbeoordeling:**
```
/ux-researcher

Voer een gestructureerde ontwerpkritiek uit op dit ontwerp.

Ontwerp: [beschrijf of deel Figma-link]
Gebruikersdoel: [wat de gebruiker probeert te bereiken]
Context: [waar dit verschijnt in de flow]
Beperkingen: [technische beperkingen, randgevallen om te overwegen]

Kritiek op basis van:
1. Bereikt het het gebruikersdoel zonder training?
2. Zijn er heuristische overtredingen (Nielsen)?
3. Wat is de meest waarschijnlijke gebruikersfout?
4. Waardoor zou dit mislukken voor randgevalgebruikers?
5. Hoe zou een 10x betere versie eruitzien (om aannames te betwisten)?

Uitvoer: gestructureerde feedback met ernstclassificaties en specifieke herontwerpsugesties.
```

---

### Communicatie met belanghebbenden

**Vertaal onderzoek naar een beslissingsbrief:**
```
/usability-report

Converteer dit bruikbaarheidsrapport naar een beslissingsbrief voor belanghebbenden.

Doelgroep: VP Product en engineering lead — maximaal 10 minuten leestijd
Doel: goedkeuring krijgen om 3 kritieke oplossingen te prioriteren vóór lancering

[plak bruikbaarheidsrapportbevindingen]

Formaat: uitvoerende samenvatting → 3 kritieke problemen → zakelijke impact → aanbevolen actie → inspanningsschatting.
Voeg geen methodologiedetails in — die staan in de bijlage.
```

---

### Wekelijks — Journey mapping

**Breng de huidige ervaringsstatus in kaart:**
```
/ux-researcher

Maak een klantreis-map voor [ervaring].

Ervaring: [end-to-end-ervaring in kaart te brengen]
Gebruikerspersona: [welke persona]
Contactpunten: [te behandelen kanalen — e-mail, product, ondersteuning, website]

Gebruik het 5-fasenformaat. Voor elke fase: gebruikersacties, contactpunten, gedachten, gevoelens (score 1-5),
pijnpunten (🔴 kritiek / 🟡 opvallend) en kansen.

Voeg een algehele ervaringscurve in die het sentiment over de fasen heen weergeeft.
Laagste sentimentpunt = hoogste prioriteit voor ontwerpmogelijkheden.

Bewijsbasis: [beschikbare onderzoeksdata — interviews / analyses / ondersteuningstickets / aanname]
```

---

## 30-daags ingroeiplan (nieuwe UX-medewerkers of carrièreoverstappers)

### Week 1 — Installatie en onderzoekstools
- Installeer alle productvaardigheden: `npx claudient add skills product`
- Voer `/persona-builder` uit op bestaande gebruikersonderzoeksdata — maak kennis met het huidige gebruikersbegrip
- Voer `/ux-audit` uit op de meest gebruikte flow van het product — basisheuristieke beoordeling
- Bekijk bestaande bruikbaarheidstestrapporten met `/usability-report` als opmaakreferentie

### Week 2 — Onderzoekspraktijk
- Voer je eerste gebruikersinterviews uit — maak ruwe aantekeningen
- Gebruik `/ux-researcher` om direct na elke sessie te synthetiseren (laat aantekeningen niet afkoelen)
- Stel een onderzoekssyntheserapport op en deel het met het team
- Oefen `/ux-audit` op 3 concurrerende producten — ontwikkel je heuristische evaluatie-instinct

### Week 3 — Rapportage en communicatie
- Voer een volledige bruikbaarheidstest uit op een huidige functie
- Schrijf het rapport met `/usability-report` — deel met PM en engineering
- Converteer bevindingen naar een brief voor belanghebbenden met het bovenstaande formaat
- Volg welke aanbevelingen worden geaccepteerd vs. uitgesteld — en waarom

### Week 4 — Experimenteren en valideren
- Gebruik `/experiment-designer` om een test te ontwerpen voor je beste ontwerphypothese
- Gebruik de `hypothesis-tester`-agent om aannames te valideren op basis van bestaande analyses of onderzoek
- Voer een heuristische walkthrough uit met een engineer met behulp van je `/ux-audit`-uitvoer als agenda

---

## Tool-integraties

### Figma (ontwerptool)
Claude Code leest Figma-bestanden niet rechtstreeks. Best practice:
- Exporteer belangrijke schermen als afbeeldingen en verwijs ernaar in je auditprompt
- Gebruik de Figma "Delen voor presentatie"-link als referentie in je aantekeningen
- Beschrijf de UI in gestructureerde termen als je geen screenshots kunt delen

### Dovetail / Notion (onderzoeksrepository)
Exporteer interviewaantekeningen als platte tekst → plak in `/ux-researcher`-synthese-prompts.
Kopieer voor gestructureerde repositories de ruwe aantekeningen of hoogtepunten — niet de getagde/gecodeerde weergave.

### Maze / UserTesting.com (onbegeleide tests)
Exporteer sessiesamenvattingen en taakvoltooiingsstatistieken → plak in `/usability-report`.
Voeg de kwantitatieve statistieken (voltooiingspercentage, tijd voor taak) en de kwalitatieve hoogtepunten toe.

### Miro / FigJam (samenwerkende workshops)
Gebruik Claude om de affiniteitskaartinhoud te genereren → exporteer naar Miro voor visuele groepering.
De `/usability-report`-synthese-stap produceert gegroepeerde thema's die je direct kunt vertalen naar sticky notes.

### Linear / Jira (probleemopvolging)
Gebruik de geprioriteerde herstellijst van `/usability-report` en `/ux-audit` om problemen direct te genereren.

```bash
# Vraag Claude om de herstellijst op te maken als Linear/Jira-tickets
"Formatteer de P1- en P2-bevindingen als Linear-probleembeschrijvingen met:
- Titel (gebiedend)
- Gebruikersverhaal (als een [persona], wil ik...)
- Acceptatiecriteria (3-5 bullet points)
- Labels: [ux] [bug] of [ux] [improvement]"
```

---

## Statistieken om bij te houden

Gebruik deze om de impact van onderzoek aan te tonen:

| Statistiek | Doel |
|---|---|
| Doorlooptijd van onderzoek tot aanbeveling | <2 dagen van laatste sessie tot gedeeld rapport |
| Aanbevelingsadoptiepercentage | >60% van P1/P2-bevindingen aangepakt binnen 2 sprints |
| SUS-scoreverbetering (na reparatie) | +5 SUS-punten per grote heuristische reparatiecyclus |
| Tijd tot persona-update na onderzoek | <1 week |
| Toegankelijkheidsproblemen gevonden vóór lancering (vs. na lancering) | 100% gevonden vóór lancering |
| Levering van bruikbaarheidsrapport na testafronding | <48 uur |

---

## Veelgemaakte fouten (en hoe Claude Code ze helpt vermijden)

**Fout 1: Rapporten schrijven die niemand leest**
Belanghebbenden lezen geen rapporten van 20 pagina's. Gebruik het uitvoerende samenvattingsformaat van `/usability-report` en de beslissingsbrief-uitvoer. Één pagina, drie bevindingen, een aanbeveling en een inspanningsschatting.

**Fout 2: Persona's zonder data erachter**
`/persona-builder` markeert elke claim die bewijs mist en weigert citaten te verzinnen. Voed het met echte data.

**Fout 3: Alles even grondig auditen**
`/ux-audit` scoort op ernst × frequentie en produceert een gedwongen gerangschikte lijst. Behandel een cosmetisch probleem en een taakblokkerend probleem niet als gelijkwaardig.

**Fout 4: Onderzoekssynthese die een week duurt**
Voer `/ux-researcher` onmiddellijk na elke sessie uit. Niet batchen — synthetiseer terwijl je bezig bent. Aantekeningen die 3 dagen oud zijn, verliezen hun nuance.

**Fout 5: De "waarom het belangrijk is"-vertaling overslaan**
Engineers en PM's moeten de zakelijke impact begrijpen, niet alleen het UX-probleem. De `/usability-report`-uitvoer bevat altijd een sectie "waarom het belangrijk is" voor elke bevinding — sla die niet over.

---

## Bronnen

- [Aan de slag met Claude Code](../getting-started.md)
- [UX-onderzoekssprint-workflow](../workflows/ux-research-sprint.md)
- [Experiment design skill](../skills/product/experiment-designer.md)
- [Product discovery skill](../skills/product/product-discovery.md)
- [Hypothesis tester agent](../agents/roles/hypothesis-tester.md)

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — wij bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
