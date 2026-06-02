---
name: engineering-strategy
description: "Engineering strategiedocument: technische visie, bouwen versus kopen beslissingen, teamtopologie, 12-maanden roadmap"
---

# Engineering Strategy Vaardigheid

## Wanneer activeren
- Het schrijven van het engineering strategiedocument voor een nieuwe CTO-rol of aan het begin van een planningscyclus
- De engineering richting presenteren aan de raad van bestuur, CEO of investeerders
- Beslissen of een grote technische mogelijkheid gebouwd, gekocht of via partnerschap verkregen moet worden
- Teamtopologie opnieuw ontwerpen na significante groei, een reorganisatie of een productpivot
- Een 12-maanden roadmap opstellen die productlevering en platformgezondheid in evenwicht brengt
- De technische visie documenteren na grote architectuurbeslissingen

## Wanneer NIET gebruiken
- Individuele architectuurbeslissingen — gebruik `/adr-writer` daarvoor
- Planning op sprintniveau — gebruik uw projectmanagementtool
- Individuele functies werven — gebruik een functieomschrijving en een aannamecriteria in plaats daarvan
- Post-incident reviews — dat is een specifiek operationeel artefact, geen strategiedocument

## Instructies

### Volledig engineering strategiedocument

```
Schrijf een engineering strategiedocument voor [BEDRIJF].

Context:
- Bedrijfsfase: [seed / serie A / serie B / groei / enterprise]
- Huidige engineering teamgrootte: [X engineers]
- Huidige architectuur: [monoliet / microservices / serverless / hybride]
- Primaire techstack: [talen, frameworks, cloudprovider]
- Huidig grootste technisch pijnpunt: [bijv. deploysnelheid, betrouwbaarheid, schaling, technische schuld]
- Bedrijfscontext: [wat het bedrijf de komende 12 maanden probeert te bereiken]
- Top 3 productprioriteiten van CEO/CPO: [geef ze op]

Produceer een strategiedocument met:

## 1. Engineering Visie (12 maanden)
Één paragraaf: Hoe ziet onze engineeringorganisatie er over 12 maanden uit?
Adresseer specifiek:
- Deployfrequentie (doel)
- Systeembetrouwbaarheid (uptime / foutpercentage doel)
- Teamstructuur (hoeveel teams, welk model)
- Ontwikkelaarservaring (hoe snel kan een nieuwe engineer hun eerste functie leveren?)

## 2. Beoordeling huidige staat
Eerlijke diagnose — wat werkt, wat is gebroken:
- Architectuur: [huidige staat en belangrijkste beperkingen]
- Technische schuld: [kwantificeer indien mogelijk — % ontwikkeltijd verloren]
- Deploysnelheid: [huidige deploys per dag of week]
- Betrouwbaarheid: [huidige uptime, incidentpercentage]
- Teamstructuur: [huidige topologie en waar het faalt]

## 3. Strategische Prioriteiten (gerangschikt)
Top 3-5 engineeringinzetten voor de komende 12 maanden.
Voor elke prioriteit:
- Wat het is
- Waarom het belangrijk is (bedrijfsimpact, niet technische elegantie)
- Hoe succes eruitziet (meetbaar)
- Ruwe investering vereist (engineering weken / headcount)

## 4. Bouwen versus Kopen versus Partneren
Voor elke grote technische mogelijkheid die we nodig hebben:
| Mogelijkheid | Bouwen | Kopen | Partneren | Aanbeveling | Motivering |
Gebruik criteria:
- Kerndifferentiator? → Bouwen
- Commodity/opgelost probleem? → Kopen
- Bereik/netwerk nodig? → Partneren
- Time-to-market kritisch? → Neig naar Kopen

## 5. Teamtopologie
Huidige → Doelstructuur over 12 maanden.
Teammodellen om uit te kiezen:
- Stroomaflijnde teams (product-functie eigenaarschap)
- Platform/enabling teams (ontwikkelaarservaring, infra)
- Teams voor complexe subsystemen (ML, zoeken, datapijplijn)
Gebruik Team Topologies vocabulaire: stroomaflijnend, platform, enabling, complex subsysteem.
Voor elk team: missie, grootte, tech eigenaarschap, interfaces met andere teams.

## 6. Technologische Inzetten
Waar committerenwe ons aan over de komende 2-3 jaar?
- Kerntalen en frameworks (waarop we standaardiseren)
- Cloudprovider en belangrijkste beheerde diensten
- Wat we afbouwen (afbouwplan)
- Wat we in de gaten houden maar nog niet committeren

## 7. Engineering Gezondheidsmetrieken
Hoe meten we of de strategie werkt?
| Metriek | Huidig | 6-maanden doel | 12-maanden doel |
Inclusief: DORA-metrieken (deployfrequentie, doorlooptijd, MTTR, wijzigingsfaalpercentage), beschikbaarheid, ontwikkelaars-NPS, technische schuld ratio.

## 8. Risico's en Mitigaties
Top 3 risico's voor deze strategie:
- Risico, waarschijnlijkheid, impact, mitigatie

## 9. Investeringsverzoek
Wat hebben we nodig om deze strategie uit te voeren?
- Headcount: [X engineers aan te nemen de komende 12 maanden]
- Toolingbudget: [$X voor bouwen-versus-kopen beslissingen]
- Infrastructuur: [verwachte infrakostenwijziging]
```

### Bouwen versus Kopen beslissingskader

```
Help me beslissen of ik [MOGELIJKHEID] moet bouwen of kopen.

Beschrijving van mogelijkheid: [wat we ervan nodig hebben]
Onze huidige aanpak: [hoe we het vandaag afhandelen, als überhaupt]
Tijdlijndruk: [wanneer we het nodig hebben]
Engineering kosten om te bouwen: [schatting in engineeringweken, of vraag Claude te schatten]
Koopmogelijkheden die ik heb geïdentificeerd: [leveranciersnamen, prijzen indien bekend]
Expertise van ons team op dit gebied: [sterk / zwak / geen]

Evalueer aan de hand van deze criteria:

1. Kerndifferentiator test
Is deze mogelijkheid onderdeel van onze unieke waardepropositie?
- JA → Sterk signaal om te bouwen (eigenaarschap = concurrentievoordeel)
- NEE → Sterk signaal om te kopen (het is commodityinfrastructuur)

2. Complexiteit versus expertise
- Hoge complexiteit + lage teamexpertise → Kopen (bouwrisico is hoog)
- Hoge complexiteit + sterke teamexpertise → Bouwen (als gedifferentieerd)
- Lage complexiteit + enige expertise → Bouwen (tenzij kant-en-klaar triviaal is)

3. Time-to-market
- Nodig in < 3 maanden → Kopen wint bijna altijd
- 3-12 maanden → afhankelijk van strategisch belang
- 12+ maanden → bouwen als differentiërend

4. Total cost of ownership (3-jaar horizon)
Bouwen: engineeringkosten + onderhoudsoverhead + opportuniteitskosten
Kopen: licentiekosten + integratie + lock-in premie

5. Leveranciersrisico
- Startup leverancier: lock-in risico, overnamerisico
- Gevestigde leverancier: prijsmachtrisico, traag roadmaprisico
- Open source: onderhoudsbelasting, gemeenschapsrisico

Uitvoer:
- Aanbeveling: Bouwen / Kopen / Hybride / Uitstellen
- 3 sterkste redenen voor de aanbeveling
- Wat uw mening zou veranderen
- Bij Kopen: leverancierskortelijst en volgende stap
- Bij Bouwen: ruwe architectuur en teamtoewijzing
```

### Teamtopologie ontwerp

```
Ontwerp de teamtopologie voor onze engineeringorganisatie.

Huidige staat:
- Totaal aantal engineers: [X]
- Huidige teams: [geef ze op en wat ze doen]
- Grootste coördinatieproblemen: [waar gaan overdrachten kapot of vertragen?]
- Productgebieden: [geef de grote productdomeinen op]
- Platform/infra volwassenheid: [sterk / zwak / niet-bestaand]

Doelstaat:
- Engineers over 12 maanden: [X (inclusief aanstellingsplan)]
- Primaire bedrijfsprioriteit: [productfuncties leveren / infrastructuur schalen / incidenten verminderen]

Ontwerp de doeltopologie met deze teamtypen:
1. Stroomaflijnde teams: Eigen een productdomein van begin tot eind, snelle doorstroming, bevoegd
2. Platform team: Intern product — CI/CD, observeerbaarheid, developer tooling, infra
3. Enabling team: Tijdelijk, coacht andere teams door transities (migratie, nieuwe technologie)
4. Complex subsysteem team: Diepe expertise vereist — ML, zoeken, betalingsverwerking

Voor elk team in het doelontwerp:
- Teamnaam en missie
- Teamgrootte (doel en tussentijds)
- Wat ze bezitten (diensten, functies, infra)
- Waar ze van afhankelijk zijn (van platformteam of extern)
- Hoe ze omgaan met aangrenzende teams (API, gedeelde dienst, consultatie)
- Succesmetriek voor dit team

Interactiemodi tussen teams:
- Samenwerking: werkt nauw samen, frequente communicatie (tijdelijk, voor transities)
- X-als-een-Dienst: consument/leverancier relatie met gedefinieerde interface
- Faciliteren: één team helpt een ander vermogen op te bouwen (tijdgebonden)

Uitvoer: organogram + teamcharters + interactiemodelddiagram (tekstgebaseerd)
```

### 12-maanden engineering roadmap

```
Bouw een 12-maanden engineering roadmap.

Bedrijfsprioriteiten van leiderschap:
K1: [wat het bedrijf moet leveren / bereiken]
K2: [wat het bedrijf moet leveren / bereiken]
K3: [wat het bedrijf moet leveren / bereiken]
K4: [wat het bedrijf moet leveren / bereiken]

Engineering beperkingen:
- Huidige teamcapaciteit: [X engineers × 10 productieve dagen/sprint]
- Geplande aanstellingen: [wanneer en welke functies]
- Bekende technische schuld verplichtingen: [wat moet worden aangepakt]
- Geplande migraties: [bijv. overstap naar microservices, infra upgraden]

Roadmapformaat:

## K1 — [Thema]
Productleverables: [geef op]
Platform / infra werk: [geef op]
Technische schuld aangepakt: [geef op]
Aanstellingen: [functies]
Risico: [wat dit kwartaal kan ontsporen]

[herhaal voor K2, K3, K4]

## Investeringssplitsing (doel)
- Nieuwe productfuncties: [X]%
- Platform en infrastructuur: [X]%
- Vermindering technische schuld: [X]%
- Betrouwbaarheid en on-call: [X]%

Doelverhouding voor gezonde engineeringorganisaties:
- Vroege fase: 70/15/10/5 (snel leveren, schuld later aanpakken)
- Groeifase: 60/20/15/5 (begin te investeren in platform)
- Schaalfase: 50/25/20/5 (schuld en betrouwbaarheid worden existentieel)

## Afhankelijkheden en blokkades
Wat moet er buiten engineering gebeuren voor deze roadmap om te slagen?
- Productbeslissingen nodig voor [datum]
- Ontwerpresources nodig in [kwartaal]
- Data / juridische / compliance goedkeuringen nodig voor [functie]
```

### DORA-metrieken basislijn

```typescript
interface DORAMetrics {
  // Deployfrequentie: hoe vaak u naar productie deployt
  deploymentFrequency: 'multiple_per_day' | 'daily' | 'weekly' | 'monthly' | 'less_than_monthly'

  // Doorlooptijd voor wijzigingen: tijd van commit tot productie
  leadTimeHours: number

  // Wijzigingsfaalpercentage: % van deploys dat incidenten veroorzaakt
  changeFailureRate: number  // 0.0 tot 1.0

  // Gemiddelde tijd tot herstel: gemiddelde tijd om te herstellen van een incident
  mttrHours: number
}

// Benchmarks voor elite presteerders (DORA State of DevOps rapport)
const DORA_ELITE: DORAMetrics = {
  deploymentFrequency: 'multiple_per_day',
  leadTimeHours: 1,
  changeFailureRate: 0.05,   // < 5%
  mttrHours: 1,
}

// Benchmarks voor hoge presteerders
const DORA_HIGH: DORAMetrics = {
  deploymentFrequency: 'daily',
  leadTimeHours: 24,
  changeFailureRate: 0.10,   // < 10%
  mttrHours: 8,
}

// Gebruik deze om de huidige staat te benchmarken en doelen te stellen in de engineering strategie
```

## Voorbeeld

**Gebruiker:** Ik ben een nieuwe CTO bij een Serie B-startup (120 medewerkers, 18 engineers). We hebben een Rails-monoliet die 6 jaar oud is, 4 ongedifferentieerde teams, 1 deploy per week en 97% uptime. De raad van bestuur wil onze productlevering in 12 maanden verdrievoudigen.

**Uitvoerfragment:**

```
## Engineering Visie (12 maanden)
Een engineeringorganisatie van 25 personen die 10x per dag naar productie deployt met 99,5% uptime,
gestructureerd in 4 stroomaflijnde productteams en 1 platformteam. Een nieuwe engineer deployt
in hun eerste week naar productie.

## Beoordeling Huidige Staat
Architectuur: Rails 6 monoliet, 6 jaar schuld. Belangrijkste beperking: feature flags bestaan niet,
dus elke deploy is alles-of-niets — dit is waarom wekelijkse deploys noodzakelijk aanvoelen.
Deploysnelheid: 1 deploy/week = DORA "gemiddeld" presteerder. Doel: dagelijks minimaal, meerdere/dag in K4.
Betrouwbaarheid: 97% uptime = ~260 uur/jaar uitvaltijd. Doel: 99,5% = < 44 uur/jaar.
Teamstructuur: 4 ongedifferentieerde teams = iedereen is afhankelijk van iedereen. Coördinatieoverhead
verklaart waarom 18 engineers het gevoel hebben langzaam te bewegen.

## Strategische Prioriteiten
1. Feature flag infrastructuur (K1): Veilig continu deployen mogelijk maken. Zonder dit kan de snelheid niet verbeteren.
2. Platformteam vorming (K1): 3 engineers van productwerk af, voltijds op CI/CD, observeerbaarheid, deployment
3. Team domeineigenaarschap (K2): Duidelijke productdomeiggrenzen toewijzen — stop het web van cross-teamafhankelijkheden
4. Service extractie (K3-K4): 2-3 hoogste waarde begrensde contexten uit de monoliet extraheren

## Bouwen versus Kopen
| Mogelijkheid | Aanbeveling | Motivering |
|---|---|---|
| Feature flags | Kopen (LaunchDarkly) | Geen differentiator. $20K/jaar bespaart 8 engineeringweken |
| Observeerbaarheid | Kopen (Datadog of Honeycomb) | Commodity. Nu kopen, datapijplijn later bouwen |
| CI/CD pijplijn | Bouwen op GitHub Actions | Al in bezit, team heeft expertise |
| Incidentbeheer | Kopen (PagerDuty) | Opgelost probleem, kritiek pad |
```

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — we bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
