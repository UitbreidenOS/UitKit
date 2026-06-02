---
name: persona-builder
description: "Gebruikerspersona-bouwer op basis van onderzoeksdata: demografische gegevens, doelen, pijnpunten, gedrag, citaten"
---

# Vaardigheid: Persona-bouwer

## Wanneer te activeren
- Je hebt gebruikersonderzoeksdata (interviews, enquêtes, supporttickets, analytics) en moet deze destilleren tot bruikbare persona's
- Een design- of productteam staat op het punt een nieuw initiatief te starten en heeft een gedeeld begrip nodig van voor wie ze bouwen
- Je wilt aannames over je gebruikers uitdagen of valideren met data-gestuurde archetypen
- Je moet persona's maken om de prioritering van de roadmap, de kopijtoon of beslissingen over de reikwijdte van functies te sturen
- Nieuwe teamleden inwerken die de gebruikersbasis snel moeten begrijpen

## Wanneer NIET te gebruiken
- Je hebt geen werkelijke gebruikersdata — doe eerst het onderzoek; synthetische persona's op basis van aannames zijn schadelijk
- Je hebt een marketingpersona nodig voor targeting/segmentatie — ander doel en andere structuur dan een UX-persona
- Je wilt journey mapping doen — gebruik daarvoor `/ux-researcher` na het definiëren van persona's
- Je hebt een gedetailleerd gedragsprofiel nodig van een specifieke power user — dat is een gebruikersarchetype of job story, geen persona

## Instructies

### Volledige persona-generatie op basis van onderzoeksdata

```
Bouw gebruikerspersona's op basis van deze onderzoeksdata.

## Invoerdata
Beschikbare gegevensbronnen: [gebruikersinterviews (N) / enquêteresultaten (N reacties) / analyticsegmenten / supporttickets / bruikbaarheidssessies / alles]
Product: [naam en 1-zin beschrijving]
Gebruikersbasis: [wie dit product gebruikt — wees specifiek over het bereik van gebruikerstypes]

## Te analyseren ruwe data
[Plak interviewnotities, thema's uit enquêtereacties, analyticsegmenten, sleutelcitaten, supportticketthema's, of een combinatie]

## Vereisten voor persona's
Aantal benodigde persona's: [2-4 — aanbevolen bereik; minder is beter]
Primair gebruik: [productontwerp / roadmapprioritering / engineering-scoping / stakeholdercommunicatie]

## Lever per persona op:

---

### Persona [N]: [Archetypenaam]
[De naam moet een rolbeschrijving zijn, geen fictieve voornaam — bijv. "De Overstuurde Ops Manager", "De Power User Automatiseerder", "De Voorzichtige Inkoopverantwoordelijke"]

**Tagline:** [Één zin die de bepalende frustratie of het doel weergeeft — dit is het eerste wat lezers zien en moet memorabel zijn]

---

#### Rol en context
- **Functietitel / functie:** [realistisch titelsbereik — niet slechts één titel]
- **Branche / bedrijfstype:** [waar ze werken]
- **Bedrijfsgrootte:** [MKB / mid-market / enterprise — en waarom dat relevant is voor je product]
- **Technische vaardigheid:** [schaal 1-5 met een omschrijving in begrijpelijke taal]
- **Hoe ze je product gebruiken:** [dagelijks gebruik / af en toe / team-verplicht / omweg voor iets anders]
- **Wie ze beïnvloeden of mee samenwerken:** [hun stakeholders — relevant voor B2B-producten]

#### Doelen (hoe succes eruitziet voor hen)
- **Primair doel:** [de taak die ze proberen uit te voeren — gebruik waar mogelijk "Jobs to Be Done"-framing]
- **Secundair doel:** [een ondersteunende doelstelling die vaak concurreert met de primaire]
- **Succesmetriek die hen interesseert:** [het getal of resultaat waarop ze worden beoordeeld — dit stuurt gedrag]

#### Frustraties (met huidige oplossingen — bewijs-gestaafd)
Voeg bij elke frustratie het bewijs toe (citaat of datapunt dat ermee naar voren kwam):

1. **[Frustratietitel]:** [Specifieke beschrijving van de pijn]
   Bewijs: "[Verbatim of bijna-verbatim citaat uit onderzoek]" — [bron, bijv. P3 interview, of 34% van enquêtederespondenten]

2. **[Frustratietitel]:** [...]
   Bewijs: [...]

3. **[Frustratietitel]:** [...]
   Bewijs: [...]

#### Gedragspatronen
- **Hoe ze tools ontdekken:** [mond-tot-mond / managerverplichting / proefperiode / onderzoek / aanbeveling van collega]
- **Evaluatieproces:** [hoe ze beslissen of ze adopteren — proefperiode, demo, peer review, inkoop, etc.]
- **Gebruikspatroon:** [hoe ze het product dag-tot-dag gebruiken]
- **Workarounds die ze vandaag gebruiken:** [wat ze doen wanneer je product het probleem niet oplost — cruciaal voor ontwerp]
- **Communicatiestijl:** [Slack / e-mail / asynchroon / synchroon — relevant voor in-app messaging]

#### Het citaat dat deze persona definieert
"[Een enkel verbatim of bijna-verbatim citaat uit onderzoek dat de wereldvisie van deze persona weergeeft. Dit is het citaat dat je op een poster zou zetten.]"

#### Wat ze van het product nodig hebben (behoeften die beslissingen sturen)
- [Behoefte 1 — specifiek genoeg om een ontwerpbeslissing te sturen]
- [Behoefte 2]
- [Behoefte 3]

#### Wat hen doet vertrekken (churndrivers)
- [Risico 1 — de conditie waaronder deze persona het product verlaat]
- [Risico 2]

#### Ontwerpimplicaties (directe vertaling naar productbeslissingen)
- [Implicatie 1 — "Omdat deze persona X, moet het product Y"]
- [Implicatie 2]
- [Implicatie 3]

---

### Persona-vergelijkingstabel (na alle persona's)

| Dimensie | Persona 1 | Persona 2 | Persona 3 |
|---|---|---|---|
| Technische vaardigheid | Laag | Hoog | Gemiddeld |
| Beslissingsbevoegdheid | Geen | Beïnvloeder | Koper |
| Primaire pijn | [pijn] | [pijn] | [pijn] |
| Waardepropositie die resoneert | [prop] | [prop] | [prop] |
| Functieprioriteit | [functies] | [functies] | [functies] |
| Churnrisico | Hoog | Laag | Gemiddeld |

### Persona-prioritering
Voor welke persona eerst te ontwerpen — en waarom:
[Expliciete aanbeveling op basis van zakelijke impact en strategische fit — niet slechts "meest voorkomende gebruiker"]
```

### Snelle persona-schets (bij minimale data)

```
Maak een snelle persona-schets op basis van beperkte data.

Wat ik heb: [welke data je hebt — bijv. "5 supporttickets en de verbatims van onze NPS-enquête"]
Product: [naam]
Gebruikerstype dat ik probeer te begrijpen: [bijv. "de gebruikers die churnen in de eerste 30 dagen"]

Genereer een werkhypothese-persona — markeer deze duidelijk als HYPOTHESE, niet gevalideerd.

Format:
- Archetypenaam en tagline
- 3 bepalende kenmerken
- Primaire frustratie (met beschikbaar bewijs)
- 2 ontwerpimplicaties
- De 3 vragen die deze persona oproept en die echt onderzoek vereisen om te valideren

Markeer elke aanname duidelijk. Een hypothese-persona is een startpunt voor onderzoek, geen vervanging ervan.
```

### Persona-validatiechecklist

```
Valideer deze bestaande persona tegen nieuwe data.

Bestaande persona: [plak de persona]
Nieuwe data: [plak nieuwe interviewnotities, enquêteresultaten of analytics]

Controleer:
1. Bevestigen of weerleggen de nieuwe data het primaire doel? [Bevestigd / Weerlegdt / Gedeeltelijk ondersteund]
2. Zijn de genoemde frustraties nog aanwezig? [Vermeld welke in de nieuwe data voorkomen]
3. Zijn er nieuwe frustraties die niet in de huidige persona staan? [Vermeld ze]
4. Is het gedragspatroon veranderd? [Wat is anders?]
5. Is het representatieve citaat nog steeds representatief, of is er een beter citaat in de nieuwe data?

Resultaat: Bijgewerkte persona met [NIEUW] markeringen op gewijzigde velden, en een wijzigingssamenvatting.
```

### Anti-patroondetectie

```
Bekijk deze persona en markeer veelvoorkomende persona-anti-patronen.

[Plak bestaande persona]

Controleer op deze faalwijzen:
1. DEMOGRAFISCHE OPVULLING — Is er irrelevante demografische details (leeftijd, geslacht, locatie, hobby's) die geen productbeslissingen sturen? Markeer en adviseer te verwijderen.
2. AANNAME ZONDER BEWIJS — Worden beweringen gedaan zonder onderzoeksdata te citeren? Markeer elk geval.
3. ENKEL GEBRUIKERSARCHETYPE — Vertegenwoordigt deze persona meerdere afzonderlijke gebruikerstypes die aparte persona's nodig hebben? Markeer indien zo.
4. ASPIRATIONELE VERTEKENING — Beschrijft de persona wie het team wenst dat de gebruiker was, in plaats van wie ze werkelijk zijn? Let op taal die te positief is of die in strijd is met gangbare supportpatronen.
5. MARKETINGPERSONA-VERWARRING — Beschrijft deze persona koopgedrag in plaats van productgebruiksgedrag? Ze dienen verschillende doelen.
6. VERMENGING VAN ROLLEN — Is bij B2B-producten deze persona een mengeling van de Champion (dagelijkse gebruiker) en de Economic Buyer? Ze moeten apart zijn.

Per gevonden anti-patroon: leg uit waarom het een probleem is en adviseer een specifieke oplossing.
```

## Voorbeeld

**Gebruiker:** We hebben 8 gebruikers van onze projectmanagementtool geïnterviewd. Hier zijn de thema's: de meesten zijn teamleiders bij bedrijven van 50-200 mensen. Ze hechten aan zichtbaarheid over projecten zonder hun team om updates te hoeven vragen. Ze zijn gefrustreerd dat onze huidige rapportage te handmatig is — ze moeten hun eigen dashboards bouwen. Drie van hen zeiden dat ze onze tool schermafbeeldingen maken en in dia's plakken voor hun maandagochtend directieoverleg. Twee zeiden dat ze de rapportagefunctie hebben geprobeerd en het na 15 minuten hebben opgegeven.

**Uitvoer:**

```markdown
### Persona 1: De Zichtbaarheidshongerige Teamleider

**Tagline:** "Ik besteed de helft van mijn zondag aan het bouwen van de diashow die zichzelf zou moeten bouwen."

---

#### Rol en context
- **Functietitel / functie:** Teamleider, Engineering Manager, Ops Manager, of vergelijkbare rol met mensen-verantwoordelijkheid
- **Bedrijfsgrootte:** 50-200 medewerkers (mid-market; te groot om alles uit het hoofd bij te houden, te klein voor een eigen PMO)
- **Technische vaardigheid:** 3/5 — vertrouwd met tools, maar geen tijd voor configuratie
- **Hoe ze het product gebruiken:** Dagelijkse check-ins op eigen taken, maar hun echte behoefte is een overzicht over teams heen dat ze omhoog kunnen delen
- **Wie ze beïnvloeden:** Hun directe team (5-15 mensen) en hun eigen manager (de directie aan wie ze wekelijks rapporteren)

#### Doelen
- **Primair doel:** De status van alle actieve projecten kennen zonder hun team te hoeven onderbreken om te vragen
- **Secundair doel:** Een maandagochtend-diashow produceren in minder dan 10 minuten
- **Succesmetriek die hen interesseert:** Hun manager zegt "goed overzicht" zonder vervolgvragen te stellen

#### Frustraties
1. **Rapportage is handmatig en verliest info:** Ze moeten aangepaste dashboards of exports bouwen, en tegen de tijd dat het klaar is, is het al verouderd.
   Bewijs: "Ik maak schermafbeeldingen van het bord en plak ze elke week in dia's. Het voelt belachelijk." — P3 interview

2. **Rapportagefunctie is te complex om in te stellen:** De tool heeft rapportagemogelijkheden, maar vereist te veel configuratie voor iemand die alleen een wekelijks statusoverzicht nodig heeft.
   Bewijs: 2/8 deelnemers probeerden de rapportagefunctie; beiden gaven het na 15 minuten op. Geen deelnemer had een werkend rapport op het moment van het interview.

3. **Geen directie-gerichte export:** Outputs zijn geformatteerd voor projectmedewerkers, niet voor directieleden die een 3-dia samenvatting nodig hebben.
   Bewijs: 3/8 deelnemers noemden expliciet schermafbeeldingen voor directieoverleggen.

#### Het citaat dat deze persona definieert
"Ik besteed de helft van mijn zondag aan het bouwen van de diashow die zichzelf zou moeten bouwen."

#### Wat ze van het product nodig hebben
- Een automatisch gegenereerde wekelijkse statussamenvatting die ze zonder aanpassingen kunnen delen met hun manager
- Zichtbaarheid over projecten heen vanuit één overzicht — niet een per-projectbord
- Een exportformat dat werkt in Google Slides of PowerPoint

#### Ontwerpimplicaties
- Omdat de primaire workflow van deze persona opwaartse rapportage is, heeft het product een "managersweergave" nodig die los staat van de taakmedewerkerweergave
- Omdat ze vandaag schermafbeeldingen maken, is de weg van de minste weerstand voor adoptie het vervangen van die schermafbeelding door een één-klik export
- Omdat ze de rapportage-instelling opgaven, moet elke rapportageoplossing werken zonder configuratie voor het standaard geval (wekelijkse projectstatus)
```

---

> **Werk met ons samen:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — wij bouwen AI-producten en B2B-oplossingen met ontwikkelaarscommunities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
