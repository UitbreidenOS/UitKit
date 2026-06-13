---
name: lit-review
description: "Academisch literatuurbeoordeling: systematische zoekstrategie, artikel screening, synthesekaders, citaatbeheer en produceren van een gestructureerd beoordelingsgedeelte of samenvatting"
---

# Lit Review Skill

## Wanneer activeren
- Een systematische of scoping review van academische literatuur uitvoeren
- Bevindingen over meerdere papers over een onderwerp synthetiseren
- Een literatuurbeoordeling schrijven voor een thesis, rapport of paper
- Lacunes in bestaand onderzoek identificeren
- De kwaliteit van academisch bewijs evalueren
- De canonieke citaten voor een technisch concept zoeken

## Wanneer NIET gebruiken
- Patent analyse — gebruik de patent-analysis skill
- Algemeen internetonderzoek — dit is specifiek voor academische literatuur
- Primaire dataverzameling of onderzoeksopzet — ander onderzoeksmethodeskill
- Het volledige paper schrijven — deze skill dekt review, niet origineel onderzoek

## Instructies

### Zoekstrategie

```
Ontwerp een literatuurzoekstrategie voor [onderwerp].

Onderzoeksonderwerp: [beschrijving — welke vraag probeert u te beantwoorden?]
Beoordelingstype: [systematisch (uitputtend) / scoping (brede toewijzing) / narratief (selectief)]
Te doorzoeken databases: [PubMed / Scopus / Web of Science / ACM / IEEE / Google Scholar / arXiv]
Datumbereik: [afgelopen 5 jaar / 2000-heden / alle tijd]
Talen: [alleen Engels / alle talen]

Zoekstrategie:

1. Verdeel het onderwerp in concepten:
   PICO (voor medisch/klinisch) of SPIDER (kwalitatief):
   Populatie: [wie/wat wordt onderzocht]
   Interventie/blootstelling: [wat wordt gedaan/onderzocht]
   Vergelijking: [waarmee wordt het vergeleken, indien van toepassing]
   Uitkomst: [wat wordt gemeten]

2. Bouw trefwoordlijsten voor elk concept:
   Concept 1: [hoofdterm] EN [synoniemen] EN [afkortingen]
   Voorbeeld: "machine learning" OF "ML" OF "artificial intelligence" OF "deep learning"
   
   Concept 2: [hoofdterm] EN [synoniemen]
   Voorbeeld: "clinical prediction" OF "diagnostic accuracy" OF "clinical decision support"

3. Combineer met Booleaanse operatoren:
   (Concept 1 trefwoorden) EN (Concept 2 trefwoorden) EN (Concept 3 trefwoorden)

4. Pas filters toe:
   - Datumbereik: gepubliceerd: [YYYY] tot [YYYY]
   - Documenttype: tijdschriftartikelen / conferentiepapieren / dissertaties uitsluiten
   - Taal: Engels
   - Onderzoekstype (indien van toepassing): gerandomiseerde gecontroleerde proef / systematische review / cohort

5. Voer in elke database afzonderlijk uit (ga niet ervan uit dat ze hetzelfde zijn):
   - Registratie: database, gebruikte zoekstring, uitvoeringsdatum, aantal resultaten

6. Beheer duplicaten in databases:
   Gebruik: Zotero / Mendeley / Rayyan voor deduplicatie
   Exporteer alle resultaten → combineer → dedupliceer op titel/DOI

Genereer de zoekstrategie voor mijn onderwerp met databasespecifieke zoekstrings.
```

### Screening protocol

```
Screen papers voor inclusie/exclusie voor [beoordeling].

Totaal opgehaald: [X papers]
Incluside criteria: [wat kwalificeert voor opname]
Exclusie criteria: [wat wordt verwijderd en waarom]

Screening protocol:

STADIUM 1 — Titel en abstract screening (snelste):
Opnemen als: titel of abstract suggereert dat het paper [uw onderwerp] adresseert
Uitsluiten als: duidelijk buiten onderwerp, verkeerde populatie, verkeerd onderzoekstype
Beslissing: opnemen / uitsluiten / onzeker (onzeker → opnemen voor volledige tekstbeoordeling)

STADIUM 2 — Volledige tekstscreening:
Lees de methodologische sectie: voldoet het aan alle incluside criteria?
Pas exclusie criteria systematisch toe

Incluside criteria checklist (pas aan voor uw onderwerp):
☐ Populatie: [beschrijf wie/wat kwalificeert]
☐ Interventie: [beschrijf wat moet worden onderzocht]
☐ Uitkomst: [wat moet worden gemeten/gerapporteerd]
☐ Onderzoeksontwerp: [acceptabele ontwerpen — bijv. RCT, cohort, voor-na]
☐ Publicatie: [alleen peer-reviewed / grijze literatuur OK / conferentiepapieren OK]
☐ Taal: [alleen Engels]
☐ Datum: [gepubliceerd na YYYY]

Exclusie criteria:
☐ Dubbele publicatie van dezelfde studie
☐ Onvoldoende gegevens voor extractie (alleen abstract beschikbaar)
☐ Protocolpaper zonder resultaten
☐ Conferencesamenvatting zonder volledig paper
☐ Niet peer-reviewed (indien van toepassing)

Registreer besluiten:
| Paper | Titel | Beslissing | Reden voor uitsluiting |
|---|---|---|---|
| [1] | [titel] | Opnemen | — |
| [2] | [titel] | Uitsluiten | Verkeerde populatie |

Doel: opnamequote van 5-15% is typisch voor systematische reviews.
Als > 30%: zoekopdracht is te eng of criteria te breed — herzien.
Als < 2%: zoekopdracht is te breed of criteria te eng — aanpassen.

Genereer screening criteria voor mijn specifieke beoordelingsonderwerp.
```

### Gegevensextractiesjabloon

```
Extraheer gegevens uit papers voor [beoordeling].

Papers om te extraheren: [X opgenomen papers]
Onderzoeksvraag: [herformuleren]
Gegevens om te extraheren: [welke informatie hebt u uit elk paper nodig]

Gegevensextractietabel (pas kolommen aan voor uw onderwerp):

Voor elke paper registreren:
| Veld | Beschrijving |
|---|---|
| Citatie | Auteur (Jaar). Titel. Tijdschrift. DOI. |
| Onderzoeksontwerp | RCT / cohort / dwarsdoornede / geval-controle / kwalitatief |
| Populatie | N, demografie, setting, land |
| Interventie | Wat werd gedaan, duur, dosis |
| Vergelijking | Controlvoorwaarde |
| Uitkomstmaat | Primaire uitkomst, hoe gemeten |
| Sleutelresultaat | Voornaamste bevinding (effectgrootte / p-waarde / CI opnemen) |
| Bias risico | Hoog / Matig / Laag (gebaseerd op onderzoeksontwerp) |
| Relevantie voor onze vraag | Directe / Indirecte / Perifeer |
| Notities | Beperkingen, ongebruikelijke bevindingen, auteurconflicten |

Kwaliteitsbeoordeling tools per onderzoekstype:
- RCTs: Cochrane Risk of Bias tool (RoB 2)
- Cohort studies: Newcastle-Ottawa Scale (NOS)
- Kwalitatief: CASP checklist
- Systematische reviews: AMSTAR-2
- Alle onderzoekstypen: GRADE voor zekerheid van bewijs

Extractiebeste praktijken:
- Extraheer door één persoon, controleer door een tweede (dubbele extractie vermindert fouten)
- Extraheer naar analyseeenheid — als paper 3 relevante uitkomsten rapporteert, extraheer elk
- Noteer als gegevens ontbreken of onduidelijk zijn — niet imputeren
- Registreer de figuur/tabelbron voor elk geëxtraheerd getal

Genereer de extractiesjabloon voor mijn beoordelingsvraag en papertypen.
```

### Synthese en schrijven

```
Synthetiseer bevindingen en schrijf een literatuurbeoordelingsgedeelte.

Opgenomen papers: [X]
Opkomende thema's: [beschrijf 3-5 terugkerende thema's in papers]
Consensus bevindingen: [waar papers het eens zijn]
Tegenstellingen: [waar papers het oneens zijn en waarom]
Lacunes: [wat niet is onderzocht]
Publiek: [thesis commissie / tijdschrift reviewers / beleidsmakers / niet-specialisten]

Synthese benaderingen:

NARRATIEVE SYNTHESE (meest voorkomend):
Groepeer papers op thema of bevinding, niet per individueel paper.
Niet: "Smith (2020) vond X. Jones (2021) vond Y. Brown (2022) vond Z."
Wel: "Meerdere studies demonstreren [X], vooral in [context] (Smith 2020; Jones 2021). Echter, bewijs is gemengd in [ander context], met Brown (2022) vindt [Y] maar Chen (2023) rapporteert [Z], mogelijk vanwege [methodologisch verschil]."

META-ANALYSE (als kwantitatieve gegevens homogeen zijn):
Pool effectgrootten over studies → gewogen gemiddelde
Vereist: dezelfde uitkomstmaat, vergelijkbare populaties, compatibele onderzoeksontwerpen
Tools: RevMan, R metafor package

THEMATISCHE ANALYSE (voor kwalitatief):
Code thema's over papers → synthetiseer patronen

Literatuurbeoordelingsgedeelte structuur:

1. Openingsparagraaf:
   [Frame de beoordeling in context van uw onderzoeksvraag]
   "Dit gedeelte beoordeelt [X] studies onderzoeken [onderwerp]."

2. Hoofdtekst (georganiseerd op thema, niet op paper):
   Thema 1: [Bevinding over meerdere papers + citaties]
   Thema 2: [Tegenstrijdig bewijs + verklaring]
   Thema 3: [Methodologische vooruitgang]

3. Lacunesparagraaf:
   "Ondanks substantieel bewijs voor [X], blijft [lacune] onderzocht. [Slechts N studies] hebben [specifieke populatie/context] onderzocht. Deze review [identificeert / adresseert] deze lacune."

4. Sluitingsparagraaf:
   [Wat de beoordeling vaststelt / wat het niet kan vaststellen / hoe dit uw onderzoek opzet]

Schrijf het literatuurbeoordelingsgedeelte voor mijn opgenomen papers en thema's.
```

## Voorbeeld

**Gebruiker:** Ik beoordeel literatuur over LLM-hallucinaties in medische instellingen voor een conferentiepaper. Ik heb 32 papers gevonden. Hoe synthetiseer ik ze?

**Claudies syntheseplan:**

32 papers is beheersbaar voor een narratieve synthese in een conferentiepaper (in plaats van een volledige systematische review). Organiseer op thema, niet op paper.

**Waarschijnlijke thema's over 32 papers over LLM-hallucinaties in medicijn:**

1. **Frequentie en klinische domeinen** — Welke hallucinatiesnelheid? Welke klinische domeinen (radiologie, medicijndosering, zeldzame ziekten) zijn het ergst? (Organiseer papers op domein en rapporteer snelheden)

2. **Detectiemethoden** — Hoe identificeren onderzoekers hallucinaties? (Deskundige beoordeling / geautomatiseerde feitcontrole / patiëntuitkomst correlatie) — synthetiseer methodologische benaderingen

3. **Risicofactoren** — Wat verhoogt hallucinatierisico? (Langformige uitvoer? Zeldzame aandoeningen? Specifieke LLMs?) — hier leeft onenigheid meestal

4. **Mitigatie strategieën** — RAG, fine-tuning, mens-in-de-lus, constitutionele AI — welk bewijs bestaat voor elk?

5. **Methodologische lacunes** — Meeste studies: klein N, enkele instelling, alleen Engels, algemene LLMs in plaats van klinische fine-tunes. Dit is uw lacunagedeelte.

**Voorbeeld syntheseparagraaf (thema 1):**

"Hallucinatiesnelheden in klinische LLM-toepassingen variëren aanzienlijk per domein en taakcomplexiteit. Bij geneesmiddeldoseerings- en farmacoloağietaken rapporteren [X] studies [bereik]% foutpercentages (Smith 2023; Lee 2024; Patel 2024), met hogere snelheden waargenomen voor zeldzame medicijnen of complexe polyfarmacyscenario's (Smith 2023; Brown 2024). Radiologierapportgeneratie toont vergelijkbaar lagere hallucinatiesnelheden ([Y]%) in taken met gestructureerde bevindingen (Jones 2023), hoewel narratieve interpretatietaken snelheden vertonen die [Z]% benaderen (Kim 2024; Thomas 2024). Over alle domeinen heen zijn hallucinatiesnelheden consistent hoger in contexten waar het model specifieke numerieke waarden moet genereren (doseringen, laboratorium referentiebereiken) vergeleken met algemene klinische begeleiding (Smith 2023; Lee 2024; Kim 2024)."

Opmerking: Ik synthetiseer over papers op bevinding, niet op paper — dit is de sleutel structurele verandering.

---
