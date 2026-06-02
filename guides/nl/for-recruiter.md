# Claude voor Recruiters en HR

Alles wat een Recruiter of HR-professional nodig heeft om AI-ondersteunde wervingspijplijnen te runnen — van het schrijven van de vacaturetekst tot het structureren van interviews tot het genereren van aanbiedingsbrieven — zonder het menselijk oordeel te verliezen dat goede wervingsbeslissingen maakt.

---

## Voor wie is dit bedoeld

Je bent een recruiter, talent acquisition-specialist of HR-generalist die verantwoordelijk is voor het snel en goed invullen van vacatures. Je beheert meerdere open posities, coördineert met hiring managers die onduidelijke vereisten hebben, en wordt verwacht kandidaten te sourcen, screenen, beoordelen en binnenhalen — vaak zonder een volledig team.

**Voor Claude Code:** 2-3 uur om een complete vacaturetekst en scorecard te schrijven. 1 uur om een sourcingzoekopdracht en outreach-sequentie te bouwen. 30 minuten om elke interviewdebrief te documenteren. Marktonderzoek voor beloningsbenchmarking handmatig gedaan via Glassdoor.

**Erna:** Complete vacaturetekst in 15 minuten. Sourcingzoekopdracht + outreach-berichten in 20 minuten. Scorecard gebouwd voor elke functie in 30 minuten. Beloningsbenchmarks onderzocht en gestructureerd in 10 minuten. Je besteedt meer tijd aan gesprekken met kandidaten en minder aan documentatie.

---

## Installatie in 30 seconden

```bash
# Installeer de volledige recruiterstack
npx claudient add skill productivity/interview-scorecard
npx claudient add skill productivity/comp-benchmarker
npx claudient add skill productivity/candidate-sourcer
npx claudient add skill small-business/hiring-pipeline
npx claudient add skill small-business/job-description
npx claudient add skill productivity/team-onboarding
npx claudient add agent advisors/chro-advisor
```

---

## Jouw Claude Code recruiterstack

### Vaardigheden (slash-commando's)

| Vaardigheid | Wat het doet | Wanneer te gebruiken |
|---|---|---|
| `/candidate-sourcer` | Boolean-zoekstrings, LinkedIn outreach-berichten, pijplijntracking | Wanneer je proactief moet sourcen |
| `/interview-scorecard` | Competentiegerichte vragen, scoringsrubric, panelontwerp, debriefsjabloon | Elke nieuwe functie — vóór het eerste interview |
| `/comp-benchmarker` | Salarisschalen, aandelenrichtlijnen, aanbiedingsbrief genereren | Vóór het plaatsen van de vacature en vóór het doen van een aanbieding |
| `/job-description` | Functiedefinitie, vereistenschrijven, toonafstemming | Een nieuwe vacature openen |
| `/hiring-pipeline` | Pijplijnfasen, SLA's, rapportagesjablonen | Beheren van meerdere open functies |
| `/team-onboarding` | 30-60-90 dagen onboardingplan voor nieuwe medewerkers | Wanneer een aanbieding wordt geaccepteerd |

### Agents

| Agent | Model | Wanneer te starten |
|---|---|---|
| `chro-advisor` | Opus | Organisatieontwerp, HR-strategie, omgaan met gevoelige personeelskwesties |

---

## Dagelijkse workflow

### Ochtend (20-30 minuten)

**1. Pijplijnreview — maandagochtend**
```
/hiring-pipeline

Wekelijkse pijplijnreview — week van [DATUM].

Open functies:
| Functie | Afdeling | Fase | Kandidaten in pijplijn | Doeldatum |
|---|---|---|---|---|
| [Titel] | [Afdeling] | [Sourcen / Screenen / Interviews / Aanbieding] | [N] | [datum] |
| [Titel] | [Afdeling] | [fase] | [N] | [datum] |

Voor elke functie:
- Wat is het knelpunt? (niet genoeg kandidaten / kandidaten die niet vorderen / aanbiedingen die worden afgeslagen)
- Welke acties zijn deze week verschuldigd?
- Zijn er functies die hun doeldatum dreigen te missen?

Geef me een geprioriteerde actielijst voor deze week.
```

**2. Kandidaatoutreach — twee keer per week in batch**
```
/candidate-sourcer

Ik sourceer voor [Functie] in [Locatie].

Verplichte kwalificaties:
- [Kwalificatie 1]
- [Kwalificatie 2]

Doelbedrijven: [lijst 5-8 bedrijven waar ik deze achtergrond zou vinden]

Bouw:
1. LinkedIn Recruiter Boolean-zoekstring
2. Google X-Ray-zoekvariant
3. Outreach-berichtsjabloon (gepersonaliseerde eerste regel + functie-haak + CTA)
4. Follow-up bericht (voor niet-reageerders na 7 dagen)

Ik stuur deze week 20 berichten — help me de outreach te structureren.
```

---

### Interviewvoorbereiding

**3. Scorecard bouwen voor een nieuwe functie**
```
/interview-scorecard

Bouw een interviewscorecard voor [Functie].

Niveau: [Senior IC / Manager / Director]
Afdeling: [Afdeling]
Kernverantwoordelijkheden:
- [Verantwoordelijkheid 1]
- [Verantwoordelijkheid 2]
- [Verantwoordelijkheid 3]

Verplichte competenties:
- [Competentie 1]
- [Competentie 2]
- [Competentie 3]

Diskwalificaties:
- [Alles wat iemand uitsluit]

Bouw: 4-5 competenties met elk 2-3 vragen, scoringsrubric (1-4),
interviewpanelontwerp (wie interviewt voor welke competentie),
en debriefsjabloon voor de hiring manager.
```

**4. Kandidaatspecifieke voorbereiding (vóór een panelinterview)**
```
/interview-scorecard

Ik interview morgen [Kandidaatnaam] voor [Functie].

Hun achtergrond: [beschrijf — huidige functie, bedrijf, relevante ervaring van LinkedIn of CV]
De competentie die ik evalueer: [welke competentie kreeg ik toegewezen]
Wat ik weet over hun sterke punten: [wat opvalt uit hun CV/screening]
Waar ik onzeker over ben: [de gaten of dingen die ik wil onderzoeken]

Geef me:
- 3 op maat gemaakte vragen voor deze kandidaat (niet generiek — verwijs naar hun achtergrond)
- Hoe sterke vs. zwakke antwoorden eruitzien voor elke vraag
- Vervolgvragen als ze een antwoord op hoog niveau geven
- Wat ik moet markeren voor de debrief
```

---

### Aanbiedingsbeheer

**5. Beloningsonderzoek en aanbieding opbouwen**
```
/comp-benchmarker

Bouw een beloningsaanbieding voor [Functie] bij [Bedrijf].

Functie: [Titel]
Niveau: [Senior IC / Manager]
Locatie: [Stad, Land]
Bedrijfsfase: [Serie A / B / beursgenoteerd / enterprise]

Onze huidige schaal voor deze functie: €[X] - €[Y] basis
Huidige beloning kandidaat: €[X] basis, €[X] bonus, €[X] aandelen
Concurrerend aanbod (indien bekend): €[X] bij [Bedrijf]

Bouw:
1. Marktbenchmark voor deze functie en locatie (waar valt onze schaal?)
2. Aanbevolen aanbieding binnen onze schaal met rationale
3. Aandelenpakket (opties of RSU's op basis van onze fase)
4. Volledig aanbiedingspakket samenvatting
5. Script voor het mondelinge aanbiedingsgesprek
6. Reacties op bezwaren als ze tegenbieden
```

**6. Aanbiedingsbrief**
```
/comp-benchmarker

Genereer een aanbiedingsbrief voor [Kandidaat volledige naam] voor de [Functie]-positie.

Bedrijf: [Naam]
Startdatum: [datum]
Basissalaris: €[X]
Bonus: [X% van basis, jaarlijks uitbetaald]
Aandelen: [X aandelen, 4-jaar vest, 1-jaar cliff]
Voordelen: [beschrijf]
Locatie: [stad of remote]
Rapporteert aan: [Manager naam, Titel]
Aanbieding vervalt: [datum — geef 5-7 werkdagen]

Genereer een professionele aanbiedingsbrief met alle onderdelen duidelijk vermeld.
Inclusief opmerking dat aandelen onderhevig zijn aan bestuurdsgoedkeuring.
```

---

### Onboardingoverdracht

**7. Onboardingplan voor nieuwe medewerker**
```
/team-onboarding

Bouw een 30-60-90 dagen onboardingplan voor [Nieuwe medewerker naam] die start als [Functie].

Startdatum: [datum]
Manager: [naam]
Team: [beschrijf het team waaraan ze deelnemen]
Kernstakeholders om in de eerste 30 dagen te ontmoeten: [lijst]
Primaire doelen voor de eerste 90 dagen: [hoe ziet succes eruit?]
In te stellen tools en systemen: [lijst]
Functiespecifieke context: [nuances, lopende projecten, uitdagingen die ze overnemen]

Maak: gestructureerd 30-60-90 plan met wekelijkse mijlpalen, stakeholder-vergaderschema,
en succescriteria voor elke fase.
```

---

## 30-daags opstartplan (nieuwe recruiters of HR-generalisten)

### Week 1 — Functievereisten en procesontwerp
- Installeer alle vaardigheden via de bovenstaande installatieopdrachten
- Voor elke open functie: voer `/interview-scorecard` uit om te documenteren waarvoor je werft voordat je kandidaten aanraakt
- Voer `/comp-benchmarker` uit voor elke open functie — ken je schaal voordat je sourcet of screent
- Audit je huidige pijplijn: welke functies zijn vastgelopen en waarom?

### Week 2 — Actief sourcen
- Voer `/candidate-sourcer` uit voor je top 2 open functies — bouw zoekstrings en outreach-sequenties
- Stuur 20+ outreach-berichten per functie deze week
- Gebruik `/job-description` om vacatureteksten te controleren of te herschrijven die al > 30 dagen live zijn zonder kwaliteitsaanvragers
- Stel je conversieratio van sourcen naar screening in als baseline

### Week 3 — Interviewproces
- Voer elk gepland interview uit met de scorecard van week 1
- Voer debrief uit met het gestructureerde debriefproces — geen open discussie
- Bijhouden: waar worden aanbiedingen afgewezen? Beloning, functieduidelijkheid of proceslengte?
- Deel één verbetering van sourcen en scoringsproces met de hiring manager

### Week 4 — Aanbieding en rapportage
- Doe je eerste aanbieding met `/comp-benchmarker`-data — verdedig het getal met marktonderzoek
- Voer de wekelijkse pijplijnreview uit en deel metrieken met leiderschap
- Bouw je eerste maandelijkse wervingsrapport: doorlooptijd per functie, bronnenkwaliteit, acceptatieratio aanbiedingen
- Identificeer: wat is het #1 knelpunt in je wervingsproces nu?

---

## Tool-integraties

### LinkedIn Recruiter

Gebruik `/candidate-sourcer` om Boolean-strings te genereren → voer uit in LinkedIn Recruiter. Exporteer profielen → bouw je outreach-lijst in Recruiter → gebruik door Claude gegenereerde sjablonen voor InMail.

### Greenhouse / Lever / Ashby (ATS)

Exporteer kandidaatpijplijndata als CSV → plak in Claude voor analyse. Claude werkt met elke ATS-output. Gebruik Claude om:
- Gestructureerde interviewfeedback te schrijven die in het ATS gaat
- Aanbiedingtekst te genereren om in DocuSign te plakken
- Pijplijndropoff per fase te analyseren

### HubSpot of Notion voor pijplijntracking

Als je geen formele ATS hebt, gebruik de pijplijntracker-structuur van `/candidate-sourcer` in Notion of een spreadsheet. Claude kan je pijplijndata lezen en wekelijkse statusrapporten genereren.

### Levels.fyi / Glassdoor (beloningsonderzoek)

Claude gebruikt je ingeplakte marktdata van deze bronnen om aanbevelingen te kalibreren in `/comp-benchmarker`. Haal de relevante data op, plak het erin, en Claude analyseert het in de context van je functie en bedrijfsfase.

---

## Bij te houden metrieken

| Metriek | Definitie | Groen | Geel | Rood |
|---|---|---|---|---|
| Doorlooptijd | Dagen van vacature openen tot aanbieding geaccepteerd | < 30 dagen | 30-60 dagen | > 60 dagen |
| Aanbiedingacceptatieratio | % van gedane aanbiedingen die worden geaccepteerd | > 85% | 70-85% | < 70% |
| Sourcingresponsratio | % van outreach-berichten dat een reactie krijgt | > 20% | 10-20% | < 10% |
| Trechterconversie (gesourceerd → aangenomen) | % van gesourceerde profielen die aanwervingen worden | > 3% | 1-3% | < 1% |
| Interview-tot-aanbieding-verhouding | # interviews per aanwerving | < 5:1 | 5-8:1 | > 8:1 |
| Nieuwe medewerker 90-daagse retentie | % van aanwervingen die nog in dienst zijn op dag 90 | > 90% | 80-90% | < 80% |
| Tevredenheid hiring manager | Beoordeeld door hiring managers na aanwerving | > 4/5 | 3-4/5 | < 3/5 |

---

## Veelgemaakte wervingsfouten (en hoe Claude Code ze helpt vermijden)

**Fout 1: Sourcen beginnen voordat je weet waarvoor je werft**
`/interview-scorecard` dwingt competentiedefinitie vóór elke outreach. Als je de scorecard niet kunt schrijven, weet je nog niet waarvoor je werft.

**Fout 2: Generieke InMail-berichten**
`/candidate-sourcer` maakt sjablonen die een gepersonaliseerde eerste regel vereisen. Geen persoonlijke haak = niet sturen.

**Fout 3: Beloningsverrassingen bij de aanbiedingsfase**
`/comp-benchmarker` bouwt de schaal voordat je begint met screenen. Kandidaten wier verwachtingen niet overeenkomen met je bandbreedte moeten worden uitgekwalificeerd in het eerste gesprek, niet bij de aanbieding.

**Fout 4: Debrief op basis van consensus (HiPPO-effect)**
De debriefstructuur in `/interview-scorecard` vereist dat elke interviewer scores deelt vóór open discussie. Dit voorkomt dat de meest senior persoon in de kamer ieders mening verankert.

**Fout 5: Geen onboardingplan klaar op Dag 1**
`/team-onboarding` genereert het 30-60-90 plan vóórdat de kandidaat begint — niet de week dat ze arriveren. Een slechte eerste week is een vermijdbaar vroeg verloopssignaal.

---

## Bronnen

- [Aan de slag met Claude Code](./getting-started.md)
- [Interview scorecard-vaardigheid](../skills/productivity/interview-scorecard.md)
- [Comp benchmarker-vaardigheid](../skills/productivity/comp-benchmarker.md)
- [Candidate sourcer-vaardigheid](../skills/productivity/candidate-sourcer.md)
- [Wervingspijplijn-workflow](../workflows/recruiting-pipeline.md)
- [Team onboarding-vaardigheid](../skills/productivity/team-onboarding.md)

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — we bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
