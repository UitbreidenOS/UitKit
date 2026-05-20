---
name: ai-impact-assessment
description: "AI-effectbeoordeling (AIA): EU AI Act-classificatie, risicopad, use case-selectie, beleidsconformiteit, leverancier AI-beoordeling — voor juridische en compliance-teams"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../ai-impact-assessment.md).

# AI-effectbeoordelingsvaardigheid

## Wanneer activeren
- Uw organisatie implementeert een nieuw AI-systeem of use case
- U moet een AI-systeem classificeren onder de EU AI Act
- Een AI-beoordeling van leveranciers uitvoeren voordat u een AI-product aanschaft
- Controle van bestaande AI-implementaties op compliance-hiaten
- Generering van een AI-effectbeoordelingsdocument voor interne governance

## Wanneer NIET gebruiken
- Vervanging van een formele gegevensbeschermings-effectbeoordeling (DPIA) — voer beide uit waar vereist
- Juridisch advies over AI Act-verplichtingen — raadpleeg gespecialiseerde juridische advies
- Real-time AI-systeemmonitoring — vereist speciale gereedschappen

## Belangrijk

De EU AI Act trad volledig in werking in augustus 2026. AI-systemen met hoog risico vereisen verplichte conformiteitsbeoordelingen en registratie. Claude structureert de beoordeling — uw DPO en juridisch adviseur moeten vóór formele inzendingen beoordelen.

## Instructies

### Stap 1 — Use case intake

```
Nieuw AI-systeem/use case ter beoordeling:

Naam: [systeem- of use casenaam]
Beschrijving: [wat het doet, in eenvoudige taal]
Implementeerder/ontwikkelaar: [bouwen we dit of kopen we het in?]
Gebruikers: [medewerkers / klanten / derden / publiek]
Uitvoertype: [beslissing / aanbeveling / inhoud / classificatie / voorspelling]
Gevolgen van resultaten: [wat gebeurt er op basis van de AI-output?]
Datainvoer: [persoonsgegevens / biometrisch / gevoelige categorieën?]
Schaal: [hoeveel mensen worden getroffen?]
```

### Stap 2 — EU AI Act-classificatie

```
Classificeer dit AI-systeem onder de EU AI Act:

VERBODEN (Artikel 5) — eerst controleren:
- Maatschappelijke scoring door overheidsinstanties
- Real-time biometrische identificatie op publieke plaatsen
- Subliminale manipulatie
- Uitbuiting van kwetsbare groepen
- Afleiden van politieke/religieuze/raciale kenmerken van biometrische gegevens

Als geen van het bovenstaande van toepassing is, classificeer op risicotier:

HOOG RISICO (Bijlage III) — verplichte conformiteitsbeoordeling vereist:
- Biometrische identificatie/categorisatie
- Beheer van kritieke infrastructuur
- Onderwijs-/beroepsopleidingsresultaten
- Werk-/HR-besluiten
- Toegang tot essentiële diensten (krediet, verzekering, gezondheidszorg)
- Rechtshandhaving
- Migratie/grensbewaking
- Rechtstoepassing en gerechtelijke zaken

BEPERKT RISICO:
- Chatbots en conversatie-AI (transparantieverplichting)
- Emotieherkenning (openbaarmaking vereist)
- Door AI gegenereerde inhoud (watermarking)
- Algemene AI-modellen

MINIMAAL RISICO:
- AI in games
- Anti-spamfilters
- AI-aangedreven zoekopdrachten

[VERIFY] classificatie met juridische adviseur voordat u erop vertrouwt.
```

### Stap 3 — Risicopad (snelspoor vs. volledige beoordeling)

```
Op basis van classificatie:

SNELSPOOR (minimaal/beperkt risico):
- Documenteer het systeem en het doel
- Implementeer vereiste transparantieregels
- Registreer de beoordeling in de AI-inventaris

VOLLEDIG SPOOR (hoog risico):
Vereiste documentatie:
1. Technische documentatie (Art. 11)
2. Conformiteitsbeoordeling (Art. 43)
3. Registratie in EU-database (Art. 71)
4. Monitoringplan na marktintroductie (Art. 72)
5. Procedure voor melding van ernstige incidenten (Art. 73)

Ook vereist waar persoonlijke gegevens betrokken zijn:
- Gegevensbeschermings-effectbeoordeling (DPIA) onder GDPR
- Minimalisering van gegevensreview
- Doelbeperking controleren

Welk spoor is van toepassing op dit systeem?
```

### Stap 4 — Beleidsconformiteitscontrole

```
Controleer deze AI-use case tegen ons interne beleid:

Use case: [beschrijven]
Ons AI-beleid zegt: [relevant beleidstext plakken of beschrijven]

Is deze use case consistent met:
1. Ons acceptabel gebruik beleid voor AI?
2. Onze normen voor dataverwerkingsprocedures?
3. Ons leverancier-goedkeuringsprocedure?
4. Onze risicoappetijt-verklaring?

Identificeer hiaten tussen de use case en ons aangegeven beleid.
Ontwerp een uitzonderingsaanvraag als een hiaat bestaat maar de use case nog steeds gerechtvaardigd is.
```

### Stap 5 — Leverancier AI-beoordeling

```
We kopen een AI-product in van [leverancier naam].
Product: [wat het doet]
Hun AI-claims: [wat ze zeggen over hun AI-mogelijkheden]

Beoordeel deze leverancier op AI-governance:
1. Publiceren ze een modelkaart of systeemkaart?
2. Geven ze bronnen van trainingsgegevens vrij?
3. Hebben ze bias-testresultaten?
4. Hebben ze een verantwoord AI-beleid?
5. Welke gegevens gebruiken ze van onze invoer voor het trainen van toekomstige modellen?
6. EU AI Act-nalevingsstatus?
7. Sleutelcontractbepalingen die we moeten eisen?

Markeer alle rode vlaggen die procurement zonder verdere beoordeling zouden moeten blokkeren.
```

### Stap 6 — Genereer het AIA-document

```
Genereer een formeel AI-effectbeoordelingsdocument.

Systeem: [naam]
Classificatie: [hoog risico / beperkt / minimaal]
Samenvatting van beoordeling: [bevindingen uit stappen 1-4 plakken]

Documentgedeelten:
1. Systeembeschrijving en doel
2. Risicoclassificatie en onderbouwing
3. Datainvoer en beoordeling persoonlijke gegevens
4. Mogelijke schade en getroffen groepen
5. Bias- en billijkheidsoverwegingen
6. Mechanismen voor menselijk toezicht
7. Governance en verantwoordelijkheden
8. Restrisico's en beperkingsmaatregelen
9. Voorwaarden voor inzet
10. Controleschema

[VERIFY] met DPO en juridische adviseur voordat u afrondt.
```

## Voorbeeld

**Use case:** Een HR-team wil een AI-tool gebruiken die CV's screent en kandidaten scoort voordat menselijke beoordeling plaatsvindt.

**Beoordeling van Claude:**

**Classificatie: HOOG RISICO** — Bijlage III, Sectie 4: AI-systemen gebruikt in tewerkstelling en werknemersbeheer, inclusief werving, selectie en evaluatie van kandidaten.

**Vereist vóór inzet:**
- Volledige technische documentatie (Art. 11)
- Conformiteitsbeoordeling of derdepartijaudit
- Registratie in EU AI Act-database
- DPIA (verwerkt biometrisch gelijkende gegevens — foto's, leeftijdsafleiding)

**Sleutelrisico's:**
- Proxy-discriminatie: model kan substitutie voor beschermde kenmerken via postcode, naam, afstudeerjaar
- Trainingsgegevens bias: als getraind op historische aanstellingen, repliceert historische vertekening
- Gebrek aan transparantie: kandidaten hebben recht op betekenisvolle uitleg van geautomatiseerde besluiten (GDPR Art. 22)

**Vereiste waarborgen:**
- Menselijke beoordeling verplicht voor elke afwijzing
- Kandidaten-openbaarmaking dat AI in screening wordt gebruikt
- Bias-tests op beschermde kenmerken vóór inzet
- Recht op menselijke beoordeling op verzoek
- Regelmatige bias-audits na inzet

**Aanbevolen:** Aankoop moet afhankelijk zijn van leverancier die conformiteitsdocumentatie verstrekt en contractuele auditrechten accepteert.

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — we bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
