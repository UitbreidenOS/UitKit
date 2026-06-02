---
name: lesson-planner
description: "Lesplanbouwer: leerdoelen, inhoudsoverzicht, activiteiten, beoordelingen, materialenlijst en differentiatiestrategieën — voor K-12, hoger onderwijs en bedrijfsopleidingen"
---

# Vaardigheid: Lesplanner

## Wanneer activeren
- Een les, eenheid of module plannen van nul
- Een bestaande les aanpassen voor een ander publiek, niveau of formaat
- Interactieve activiteiten ontwerpen die verder gaan dan college
- Duidelijke, meetbare leerdoelen schrijven (geen vage doelen)
- Beoordelingen plannen die daadwerkelijk testen wat je hebt onderwezen
- Instructie differentiëren voor gemengde-niveau klaslokalen of cohorten

## Wanneer NIET gebruiken
- Volledig curriculumontwerp over een semester of jaar — gebruik de `/online-course-creator` vaardigheid daarvoor
- Het schrijven van de werkelijke inhoud van de les (dia's, hand-outs, leesstof) — deze vaardigheid plant de les, maakt niet alle inhoud
- Beoordelingsrubric-ontwerp op schaal — gebruik dit als startpunt, verfijn vervolgens met domeinexpertise

## Instructies

### Volledige lesplanprompt

```
Bouw een lesplan.

LESCONTEXT:
- Onderwerp/Onderwerp: [bijv. "Inleiding tot Lineaire Vergelijkingen" / "Overtuigend Schrijven" / "Python Lussen" / "Projectmanagement Grondbeginselen"]
- Cursus of programma: [de bredere cursus waartoe deze les behoort]
- Publiek: [wie zijn de lerenden — niveau / professionele achtergrond / voorkennis]
- Formaat: [persoonlijk / online synchroon / asynchroon / gemengd]
- Duur: [X minuten / X uur]
- Klasgrootte: [N studenten]

VOORKENNIS:
Wat lerenden al weten bij het begin van deze les: [beschrijf]
Waarmee ze moeite hadden in eerdere sessies: [beschrijf of "niet van toepassing"]

LEERDOELEN (wat lerenden na deze les kunnen doen):
[Als je doelen hebt, lijst ze. Zo niet, laat Claude ze opstellen op basis van het onderwerp.]
Na het voltooien van deze les kunnen studenten:
1. [Doel — gebruik een werkwoord van Bloom's taxonomie: identificeren, analyseren, construeren, evalueren, etc.]
2. [Doel]
3. [Doel]

TE BEHANDELEN KERNCONCEPTEN:
[Lijst de hoofdideeën, termen of vaardigheden die deze les moet behandelen]

ONDERWIJSBEPERKINGEN:
- Beschikbare technologie: [alleen projector / studentapparaten / geen technologie / videoplatform]
- Materialen: [whiteboard / gedrukte hand-outs / gedeeld document / LMS]
- Toegankelijkheidsoverwegingen: [Engelstalige lerenden / leesniveaus / fysieke toegang]

LESVOORKEUR:
[College-zwaar / op discussie gebaseerd / activiteit-zwaar / omgekeerd / Socratisch / projectgebaseerd]

Genereer een volledig lesplan met:
1. Leerdoelen (SMART-formaat)
2. Materialen en voorbereidingslijst
3. Lesstructuur met timing
4. Activiteitsbeschrijvingen (met facilitatienotities)
5. Beoordeling (hoe je weet dat ze het hebben geleerd)
6. Differentiatiestrategieën (voor gevorderde en worstelstuder lerenden)
7. Afsluiting en huiswerk (indien van toepassing)
```

---

### Schrijver van leerdoelen

De basis van elke les. Gebruik dit onafhankelijk:

```
Schrijf leerdoelen voor een les over [onderwerp].

PUBLIEK: [lerenden — wie zijn ze, wat weten ze]
CURSUSCONTEXT: [waar past dit in het curriculum]
BESCHIKBARE TIJD: [X minuten — doelen moeten binnen deze tijd haalbaar zijn]

DOEL BLOOMS TAXONOMIENIVEAU:
[Selecteer het cognitieve niveau dat geschikt is voor deze les]
- Onthouden: feiten, termen, definities herinneren
- Begrijpen: uitleggen, samenvatten, classificeren
- Toepassen: kennis gebruiken in een nieuwe situatie, problemen oplossen
- Analyseren: opsplitsen, vergelijken, onderscheiden
- Evalueren: beoordelen, bekritiseren, rechtvaardigen
- Creëren: ontwerpen, construeren, ontwikkelen

Stel 3 leerdoelen op. Elk moet zijn:
- Specifiek: precies wat de lerende zal doen
- Meetbaar: je kunt het observeren of testen
- Haalbaar: mogelijk binnen de beschikbare tijd
- Relevant: verbonden met de cursus/het curriculum
- Tijdgebonden: haalbaar binnen deze les

Formaat: "Aan het einde van deze les kunnen studenten [Bloom's werkwoord] [specifieke inhoud] [voorwaarde of criterium indien van toepassing]."

Voorbeeld: "Aan het einde van deze les kunnen studenten een geldig logisch argument construeren met behulp van bewijs uit twee primaire bronnen."
```

---

### Raamwerk voor activiteitsontwerp

```
Ontwerp leeractiviteiten voor een les over [onderwerp].

TE BEREIKEN LEERDOEL: [het doel dat deze activiteit moet leveren]
BESCHIKBARE DUUR: [X minuten voor de activiteit]
PUBLIEK: [lerenden — achtergrond, niveau, voorkeuren]
KLASGROOTTE: [N]
FORMAAT: [persoonlijk / online / hybride]

TE OVERWEGEN ACTIVITEITSTYPEN:
[ ] Denk-koppel-deel: individuele reflectie → koppeldiscussie → klasdeling
[ ] Jigsaw: groepen worden experts → hergroeperen om elkaar te onderwijzen
[ ] Casestudy: concepten toepassen op een real-world scenario
[ ] Rollenspel of simulatie: het concept beleven
[ ] Galeriewandeling: fysieke of digitale stations met inhoud/vragen
[ ] Probleemgebaseerd leren: een echt probleem aanpakken met de lesinhoud
[ ] Debat of gestructureerde controverse: beide kanten beargumenteren
[ ] Formatieve quiz: laagrisico begripscheck

Voor elke activiteit die je ontwerpt:
1. Naam en formaat
2. Stapsgewijze facilitatie-instructies (wat de instructeur doet, minuut voor minuut)
3. Wat lerenden doen (instructies die je hen zou geven)
4. Tijdsverdeling
5. Benodigde materialen
6. Hoe je het afrondt (wat te bespreken na de activiteit)
7. Hoe je meet wat ze ervan hebben geleerd
```

---

### Beoordelingsontwerp

```
Ontwerp beoordelingen voor een les over [onderwerp].

LEERDOELEN: [lijst de doelen van de les]
BEOORDELINGSDOEL: [formatief (tijdens leren) / summatief (na leren) / beide]
BESCHIKBARE TIJD VOOR BEOORDELING: [X minuten binnen de les / huiswerk / examen]

BEOORDELINGSOPTIES (genereer geschikte voor deze doelen):

FORMATIEF (begrip controleren tijdens de les):
- Uitgangsticket: 1-3 vragen beantwoord op papier of digitaal formulier aan het einde van de les
- Troebels punt: "Wat is nog onduidelijk?" — lerende schrijft het, leraar verzamelt
- Duim-check: visuele begripscheck op sleutelmomenten
- Koude oproep met denktime: stel een vraag → 30 seconden denken → willekeurige oproep
- Snel schrijven: 2 minuten om het concept in eigen woorden uit te leggen

SUMMATIEF (leren meten na afloop):
- Korte antwoordvragen (3-5 vragen)
- Toepassingsprobleem (het concept toepassen op een nieuw scenario)
- Reflectieprompt (evalueren, rechtvaardigen of synthetiseren)
- Product of demonstratie (iets maken dat leren aantoont)

Genereer:
1. Een uitgangsticket voor deze les (3 vragen: één herinnering, één toepassing, één metacognitie)
2. Een summatieve beoordelingsoptie (afgestemd op het hoogste Bloom's-niveaudoel)
3. Een rubric of succescriteria voor de summatieve beoordeling (hoe "uitstekend" eruit ziet)
```

---

### Differentiatiestrategieën

```
Genereer differentiatiestrategieën voor deze les.

LESONDERWERP: [onderwerp]
LEERDOELEN: [lijst]
GEMENGD-NIVEAU CONTEXT: [beschrijf je klaslokaal — welk bereik van niveaus, specifieke behoeften]

Genereer drie differentiatielagen:

STEIGERING (ondersteuning voor worstelstuder lerenden):
- Vooraf onderwijzen: [welke woordenschat of concepten voor te stellen vóór de hoofdles]
- Verminderde complexiteit: [hoe de taak te vereenvoudigen zonder het doel te verminderen]
- Visuele ondersteuning: [grafische organizers, zinsframes, diagrammen]
- Koppelingstrategie: [koppel aan een sterkere peer, strategische groepering]
- Verlengde tijd: [welke activiteiten flexibel kunnen zijn in tijd]

KERN (op niveau — de standaardlesson):
[Beschrijf de baseles voor de meerderheid van de lerenden]

UITBREIDING (uitdaging voor gevorderde lerenden):
- Diepere toepassing: [een moeilijkere versie van de kerntaak]
- Synthese: [verbind deze les met een groter concept of vraag]
- Zelfstandig project: [open uitbreiding die geen leraarstijd vereist]
- Peer-onderwijzen: [laat hen het uitleggen aan een andere lerende — verdiept hun begrip]

ONDERSTEUNING VOOR ENGELSTALIGE LERENDEN (indien van toepassing):
- Kernwoordenschat met visuele ondersteuning
- Vereenvoudigde schriftelijke instructies naast de standaard
- Zinsframes voor discussie
- Brainstormen in de thuistaal toestaan
```

---

### Eenheidsoverzicht (meerdere lessen)

Voor het plannen van een reeks lessen:

```
Bouw een eenheidsplan voor [eenheidsonderwerp].

EENHEIDSCONTEXT:
- Onderwerp: [vakgebied]
- Publiek: [niveau / professionele achtergrond]
- Duur: [X weken / X sessies van X minuten]
- Grote vraag of blijvend begrip: [wat moeten lerenden begrijpen lang nadat deze eenheid is afgelopen?]

EENHEIDSDOELEN:
Aan het einde van deze eenheid kunnen lerenden:
[3-5 doelen — hoger niveau dan individuele lesdoelen]

BEOORDELING VAN DE EENHEID:
- Summatieve beoordeling (hoe je weet dat ze het hebben geleerd): [project / examen / portfolio / presentatie]
- Formatieve controlepunten (halverwege de eenheid): [beschrijf hoe je de voortgang inschat]

LESSEN IN DE EENHEID:
Genereer een lessenreeks met:
- Les #, titel en doel in 1 zin
- Hoe elke les voortbouwt op de vorige
- Sleutelactiviteitstype per les
- Welke lessen beoordelingscontrolepunten zijn

PACING-GIDS:
[Als er specifieke datums of kalenderbeperkingen zijn, noteer ze]
```

---

### Uitvoerformaat lesplan

```markdown
# Lesplan: [Lestitel]
**Cursus:** [Cursusnaam] | **Niveau:** [Niveau] | **Duur:** [X min]
**Datum:** [Datum] | **Instructeur:** [Naam]

---

## Leerdoelen
Aan het einde van deze les kunnen studenten:
1. [Doel — specifiek en meetbaar]
2. [Doel]
3. [Doel]

---

## Materialen en Voorbereiding
- [Materiaal 1 — digitaal of fysiek]
- [Materiaal 2]
- Voorbereiding: [alles wat de instructeur voor de les moet doen]

---

## Lesstructuur

| Tijd | Fase | Activiteit | Instructeursrol | Studentenrol |
|---|---|---|---|---|
| 0:00–0:05 | Opwarming | [Activeren van voorkennis of haak] | [Faciliteren] | [Doen] |
| 0:05–0:15 | Directe instructie | [Kernconceptlevering] | [Presenteren/modelleren] | [Noteren/betrekken] |
| 0:15–0:35 | Begeleide oefening | [Gestructureerde activiteit met ondersteuning] | [Faciliteren] | [Oefenen] |
| 0:35–0:50 | Zelfstandige/groepsoefening | [Toepassingsactiviteit] | [Rondlopen/ondersteunen] | [Toepassen] |
| 0:50–0:55 | Beoordeling | [Uitgangsticket of formatieve check] | [Verzamelen] | [Aantonen] |
| 0:55–1:00 | Afsluiting | [Samenvatting, voorbeeld, brug] | [Afronden] | [Reflecteren] |

---

## Activiteitsdetails

### [Activiteitsnaam]
**Duur:** [X min]
**Opstelling:** [hoe de ruimte of online omgeving in te richten]
**Instructies voor lerenden:** [wat je zegt/toont]
**Facilitatienotities:** [waar op te letten, veelvoorkomende misvattingen, hoe af te ronden]

---

## Beoordeling

### Formatief (in de les)
[Beschrijving van hoe je begrip controleert tijdens de les]

### Uitgangsticket
1. [Herinnervraag]
2. [Toepassingsvraag]
3. [Metacognitie: "Wat is nog onduidelijk?"]

---

## Differentiatie

**Voor lerenden die ondersteuning nodig hebben:**
[Steigeringsstrategieën]

**Voor gevorderde lerenden:**
[Uitbreidingsactiviteiten]

---

## Huiswerk / Volgende Stappen
[Optioneel — wat het leren buiten vandaag uitbreidt]
```

## Voorbeeld

**Gebruiker:** Les over "Inleiding tot Eenheidseconomie" voor een cohort van 25 vroege-fase startup-oprichters. Sessie van 90 minuten, persoonlijk. Ze begrijpen omzet en kosten conceptueel maar hebben nooit CAC, LTV of terugverdientijd berekend. Mijn doel: ze verlaten de sessie in staat om deze drie metrieke te berekenen en te interpreteren voor hun eigen bedrijven.

**Verwachte uitvoer:** Drie leerdoelen met toepassen/berekenen-niveau Bloom's werkwoorden. Lesstructuur: 10-minuten haak (waarom eenheidseconomie bedrijven heeft gedood die je hebt gehoord), 20-minuten directe instructie over CAC/LTV/terugverdientijd met formules, 30-minuten workshop waarbij elke oprichter hun eigen metrieke berekent met een verstrekt sjabloon, 15-minuten paard-deel en debrief ("wat heb je ontdekt over jouw eigen bedrijf?"), 10-minuten uitgangsticket (bereken een gegeven scenario + beantwoord "wat vertelt dit je over bedrijfsgezondheid?"). Uitbreiding voor oprichters wier cijfers er al goed uitzien: bereken gevoeligheidsanalyse — wat gebeurt er met LTV/CAC als churn met 10% daalt?

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — we bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
