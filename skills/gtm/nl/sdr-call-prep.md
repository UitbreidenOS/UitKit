---
name: sdr-call-prep
description: "Gespreksvoorbereiding voor SDR's: accountbriefing, gepersonaliseerde gespreksscripts, bezwaarresponsen, ontdekkingsvragen en gespreksstructuur — gegenereerd in minder dan 2 minuten"
---

# SDR Gespreksvoorbereiding Skill

## Wanneer activeren
- Je hebt in de komende 30-60 minuten een koud gesprek of ontdekkingsgesprek
- Je wilt een gestructureerd gespreksscript afgestemd op de specifieke context van een prospect
- Je hebt scripts voor bezwaarafhandeling klaar voordat je de telefoon oppakt
- Voorbereiding voor een prioriteitsaccount en je hebt snel onderzoek + invalshoeken nodig
- Een herbruikbare sjabloon voor gespreksvoorbereiding bouwen voor je SDR-team

## Wanneer NIET gebruiken
- Na een gesprek — gebruik `/sdr-call-analysis` voor opvolging en coaching
- Generieke koude-belscripts zonder prospectcontext — die werken niet
- Interne gesprekken of customer success check-ins — andere kaders
- Als je minder dan 5 minuten hebt — gebruik het onderstaande snelle briefformaat

## Instructies

### Volledige gespreksvoorbereiding prompt

```
Bereid me voor op een koud gesprek met [NAAM], [TITEL] bij [BEDRIJF].

Mijn product: [wat je verkoopt in één zin]
Mijn ICP-fitsignalen voor dit account: [waarom dit bedrijf past]
Recente aanleiding: [financiering, executive-aanstelling, productlancering, groeispurt in hiring — of "geen geïdentificeerd"]
Gespreksdoel: [boek een 20-minuten durend ontdekkingsgesprek / kwalificeer voor demo / heractiveer koude lead]

Genereer:

## 1. Pre-gespreks briefing (lees dit voor het bellen)
- Wat [BEDRIJF] doet (1 zin)
- Waar [NAAM] om geeft in hun rol
- De ENE reden om hen vandaag te bellen (aanleiding of timing)
- Het meest waarschijnlijke resultaat: [zal opnemen / gatekeeper / voicemail]

## 2. Opening (eerste 15 seconden)
Voicemailversie (als er geen antwoord is):
Live gespreksversie (als ze opnemen):

Regels:
- Naam + bedrijf in de eerste zin
- Toestemmingsgebaseerde opener: "Heb ik je op een slecht moment te pakken?"
- Verwijzing naar aanleiding in de eerste 10 seconden
- Zeg NIET "Hoe gaat het?" — verspilling van tijd en klinkt gescript

## 3. Gespreksscript (als ze aan de lijn blijven)
Haak: [gepersonaliseerde reden voor het bellen — verwijs naar de aanleiding]
Brug: [verbind hun wereld met jouw product — 2 zinnen]
Ontdekkingsvragen: [3 open vragen om hun situatie te begrijpen]
Overgang naar meeting: [hoe de volgende stap te boeken]

## 4. Bezwaarafhandeling (top 4 voor deze prospect)
Gebaseerd op hun rol en bedrijf:
[Bezwaar 1]: [Reactie]
[Bezwaar 2]: [Reactie]
[Bezwaar 3]: [Reactie]
[Bezwaar 4]: [Reactie]

## 5. Ontdekkingsvragen (als ze zich openstellen)
Doel: pijn, tijdlijn, stakeholders, budgetbevoegdheid begrijpen
[5 open vragen — niet productgericht, pijngericht]

## 6. Meeting afsluiting
Hoe over te gaan van een positief gesprek naar een geboekte meeting:
[Exacte bewoordingen te gebruiken — specifieke tijdslots, niet "wanneer het uitkomt"]

## 7. Voicemailscript (maximaal 30 seconden)
[Volledige voicemail — naam, haak, terugbelverzoek]
```

### Snel briefformaat (onder 2 minuten, gebruiken als tijd kort is)

```
Snelle gespreksvoorbereiding voor [NAAM] bij [BEDRIJF].

Geef me:
1. Wat ze doen (10 woorden)
2. Waarom hen vandaag bellen (1 aanleiding)
3. Openingszin (gescript, niet generiek)
4. Hun #1 waarschijnlijk bezwaar + reactie van 1 zin
5. Afsluiting: exacte woorden om de meeting te boeken
```

### Gespreksscriptstructuur (het A-B-C kader)

```
A — ANKER (waarom je hen specifiek belt)
"Ik bel omdat ik opmerkte [specifieke aanleiding] — dat is meestal het moment waarop bedrijven zoals het jouwe [relevante pijn] ervaren."

B — BRUG (verbind hun wereld met jouw product)
"We helpen [hun type bedrijf] [specifieke pijn] op te lossen — [resultaat in cijfers indien mogelijk]."

C — BEVESTIG (snel naar ja/nee)
"Is dat iets waar je over nadenkt? / De moeite waard voor 20 minuten om te zien of er een match is?"

---

GEAVANCEERD: Voeg de LOOP-opener toe voor koude gesprekken
"Hey [NAAM], [JOUW NAAM] van [BEDRIJF]. Ik weet dat ik uit het niets bel —
heb je 27 seconden zodat ik kan uitleggen waarom ik bel, en als het geen zin heeft
kun je direct ophangen?"
→ Deze ontwapende opener heeft een 60%+ responsratio vs. traditionele openers
```

### Ontdekkingsvragenbank (per pijncategorie)

```
PRODUCTIVITEIT / TIJD:
- "Vertel me hoe je team momenteel [X] afhandelt — waar loopt het vast?"
- "Als je één handmatige taak die je team elke week doet zou kunnen elimineren, wat zou dat zijn?"

GROEI / OMZET:
- "Wat staat [doel] momenteel in de weg?"
- "Hoeveel [leads / deals / klanten] laat je liggen vanwege [proceskloof]?"

TEAM / SCHAAL:
- "Hoe is het team gestructureerd om [functie] vandaag af te handelen?"
- "Wanneer is dit proces voor het laatst vastgelopen bij schaal?"

CONCURREREND:
- "Wat gebruik je vandaag voor [X] — wat vind je er goed aan en wat ontbreekt?"
- "Heb je de afgelopen 6 maanden naar alternatieven gekeken?"

TIJDLIJN / URGENTIE:
- "Is [probleem] iets dat je dit kwartaal moet oplossen, of is het meer een prioriteit voor 2027?"
- "Wat zou waar moeten zijn om binnen de komende 60 dagen door te gaan?"

STAKEHOLDERS:
- "Wie zou er nog meer betrokken zijn bij het evalueren van zoiets?"
- "Als dit voor jou zinvol was, hoe wordt een dergelijke beslissing doorgaans genomen?"
```

### Scripts voor bezwaarafhandeling (stemgeoptimaliseerd — korter dan e-mail)

```
BEZWAAR: "Ik ben niet geïnteresseerd"
→ "Volledig begrijpelijk — mag ik vragen, is het omdat dit niet relevant is, of gewoon niet het juiste moment?"
   (Als niet relevant: verduidelijken. Als timing: "Wanneer zou beter zijn?")

BEZWAAR: "We hebben al een oplossing"
→ "Goed om te weten. Ben je er tevreden mee of is er iets dat je wilt dat het beter doet?"
   (Opent een ingang. Niet pushen — laat ze antwoorden.)

BEZWAAR: "Stuur me een e-mail"
→ "Graag — zodat ik het juiste stuur, wat zou je specifiek willen dat het behandelt?"
   (Zet een afwijzing om in betrokkenheid. Dan: "Kan ik donderdag terugbellen voor een snel gesprek?")

BEZWAAR: "Nu is geen goed moment"
→ "Geen probleem — wanneer zou beter zijn? Ik kan over 5 minuten terugbellen of volgende week —
   wat werkt beter."
   (Bied specifieke alternatieven, niet "wanneer je wilt")

BEZWAAR: "We hebben geen budget"
→ "Begrijpelijk — is dit een timingkwestie, of heeft het probleem überhaupt geen budget?
   Soms kunnen we pilots structureren op een manier die uit een ander potje komt."

BEZWAAR: "Wie ben je ook alweer?"
→ "Sorry — [NAAM] van [BEDRIJF]. We [wat je doet in 10 woorden]. Ik bel omdat
   [aanleiding]. Klinkt dat als iets dat 20 minuten waard is?"
```

### Voicemailformule (maximaal 27 seconden)

```
"Hey [NAAM], [JOUW NAAM] van [BEDRIJF].

Ik bel omdat [specifieke aanleiding — bijv. "Ik zag dat je team net een nieuwe VP Sales heeft aangesteld"].

We helpen [hun type bedrijf] [resultaat — bijv. "40% meer meetings boeken zonder extra headcount"].

Ik probeer je opnieuw [specifieke dag/tijd — bijv. "donderdag om 14:00"],
of pak gerust een moment hier: [korte Calendly-link].

Fijne [dag/week], [NAAM]."

---

Regels:
- 27 seconden of minder — langere voicemails hebben <5% terugbelratio
- Gebruik voornaam twee keer — begin en einde
- Geef ze een specifieke volgende stap (ze bellen niet terug zonder aansporing)
- Zeg NOOIT "bel me terug op je vroegste gelegenheid"
```

### Matrix voor gesprekken met meerdere stakeholders

```
Als je een bedrijf belt met meerdere contacten, bereid je voor op elk:

| Contact | Rol | Hun prioriteit | Beste opener | Kernbezwaar |
|---|---|---|---|---|
| [Champion] | Gebruikt product | Efficiëntie / functies | Peer-referentie | "Ons team heeft X al geprobeerd" |
| [Econ Buyer] | CFO/VP | ROI / risico | Business outcome data | "Niet in budget" |
| [Tech Eval] | CTO/IT | Beveiliging / integratie | Architectuurfit | "Onze stack is anders" |
| [Gatekeeper] | EA/receptionist | Beschermt de tijd van de baas | Warm, direct | "Waar gaat dit over?" |
```

## Voorbeeld

**Gebruiker:** Gespreksvoorbereiding voor Marcus Chen, VP of Sales bij Lattice. Ik verkoop een salescoachingplatform. Ze hebben net een Series D aangekondigd ($175M).

**Uitvoer:**

**Pre-gespreks briefing:**
Lattice is een HR- en prestatiebeheerplatform voor people teams. Marcus Chen leidt een groeiende salesorganisatie die net een grote financieringsimpuls heeft gekregen — ze zullen snel reps opschalen. Zijn prioriteit: snelheid van inwerking en consistente prestaties in een groter team.

**Opening (live gesprek):**
"Hey Marcus, [Naam] van [Bedrijf]. Ik weet dat ik koud bel — heb je 30 seconden? Ik zag dat Lattice de Series D heeft afgerond — gefeliciteerd. Een salesteam snel opschalen betekent meestal dat coachingconsistentie een echt probleem wordt. Dat is precies wat wij oplossen. 20 minuten waard?"

**Top 3 bezwaren + reacties:**
1. "We gebruiken Gong" → "We integreren eigenlijk met Gong — we zitten bovenop het voor gestructureerde coachingworkflows. Ben je tevreden over hoe reps momenteel inwerken?"
2. "Niet in budget" → "Begrijpelijk — is dit een Q3-prioriteit, of staat het pas volgend jaar op de radar?"
3. "Stuur me info" → "Graag — wat is het handigst: ROI-data of een snelle democlip? Ik kan binnen 5 minuten iets sturen."

**Meeting afsluiting:**
"Als dit ergens op slaat, heb ik donderdag om 14:00 of vrijdag om 10:00 — wat werkt beter?"

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — we bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
