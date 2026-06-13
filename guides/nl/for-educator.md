# Claude voor Docenten en Cursusmakers

Alles wat een leraar, professor, instructional designer of cursusmaker nodig heeft om AI-ondersteunde lesplanning, curriculumontwikkeling, analyse van studentfeedback, toetsontwerp en contentcreatie uit te voeren in Claude Code.

---

## Voor wie is dit bedoeld

Je bent een leraar, docent, instructional designer, L&D-professional of zelfstandig cursusmaker. Je besteedt enorm veel tijd aan het plannen van lessen, het schrijven van toetsen, het maken van content en het interpreteren van studentfeedback — werk dat voor en na de les plaatsvindt, zelden tijdens betaalde uren. Claude Code comprimeer het voorbereidingswerk zodat je meer tijd kunt besteden aan wat alleen jij kunt doen: daadwerkelijk lesgeven, begeleiden en in het moment reageren op leerlingen.

**Voor Claude Code:** 3 uur om een goed gestructureerd lesplan van nul op te bouwen. 2 uur om een quiz met kwalitatieve vragen te maken. 90 minuten om 30 open feedbackenquêtes te verwerken.

**Erna:** Lesplan in 20 minuten. Quiz met antwoordsleutel in 15 minuten. Feedbacksynthese in 10 minuten.

---

## Installatie in 30 seconden

```bash
# Installeer docentvaardigheden
npx claudient add skill productivity/lesson-planner
npx claudient add skill productivity/student-feedback-analyzer
npx claudient add skill small-business/online-course-creator
npx claudient add skill small-business/newsletter-publisher
npx claudient add skill productivity/lit-review

# Installeer de wetenschappelijke onderzoeker-agent
npx claudient add agent roles/scientific-researcher
```

---

## Jouw Claude Code-docentenstack

### Vaardigheden (slash-commando's)

| Vaardigheid | Wat het doet | Wanneer te gebruiken |
|---|---|---|
| `/lesson-planner` | Volledig lesplan: doelstellingen, activiteiten, toetsen, differentiatie, materialen | Elke nieuwe les of aanpassing |
| `/student-feedback-analyzer` | Analyseer enquêteresultaten en toetsdata: thema's, hiaten, verbeteringen | Na het verzamelen van feedback, na toetsen |
| `/online-course-creator` | Volledige cursusstructuur: modules, leerpaden, videoscripts, quizzen, verkoopteksten | Een cursus bouwen voor een platform (Teachable, Thinkific, etc.) |
| `/newsletter-publisher` | Cursusnewsletter of e-mailreeks voor leerlingen — drip-content, betrokkenheid | Community-opbouw, voortdurende leerlingcommunicatie |
| `/lit-review` | Literatuur- en onderzoeksbeoordeling voor cursusinhoud — evidence-based onderwijs | Academische cursussen, onderzoeksgebaseerd curriculum |

### Agent

| Agent | Model | Wanneer te starten |
|---|---|---|
| `scientific-researcher` | Opus | Diepgaand literatuuronderzoek, evidence-based curriculumontwikkeling, academisch onderzoek |

---

## Dagelijkse workflow

### Voor de les (20-30 minuten voorbereiding)

**1. Lesplan — een nieuwe les voorbereiden**
```
/lesson-planner

Maak een les over [onderwerp] voor [doelgroep].

Duur: [X minuten]
Vorm: [persoonlijk / online / hybride]
Voorkennis: [wat ze al weten]
Doelstellingen: [wat ze daarna moeten kunnen doen — of laat Claude deze opstellen]
Belangrijke beperkingen: [beschikbare technologie, klasgrootte, toegankelijkheidsbehoeften]

Genereer het volledige lesplan met timing, activiteiten en een exitticket.
```

**2. Toetsontwerp — voor de quiz of projectopdracht van morgen**
```
/lesson-planner

Ontwerp een toets voor [lesonderwerp].

Leerdoelstellingen: [lijst uit het lesplan]
Toetsvorm: [quiz / korte antwoorden / project / presentatierubriek]
Toegestane tijd: [X minuten / X dagen]
Bloom-niveau: [herinnering / toepassing / analyse / evaluatie]

Genereer vragen met een antwoordsleutel en een rubriek voor open onderdelen.
```

---

### Na de les / einde van de eenheid

**3. Feedbackanalyse — betekenis geven aan enquêtedata**
```
/student-feedback-analyzer

Analyseer feedback van [cursus/lesnaam].

Kwantitatieve beoordelingen: [plak je enquêtegemiddelden]
Open antwoorden (geanonimiseerd): [plak alle antwoorden]

Welke patronen zijn er? Wat moet ik volgende keer veranderen? Wat werkte goed?
```

**4. Toetsbespreking — wat de resultaten je vertellen**
```
/student-feedback-analyzer

Mijn klas heeft zojuist [toetsnaam] afgerond.

Klasgemiddelde: [X]%
Scoreverdeling: [plak]
Vraag-voor-vraag-overzicht: [plak slagingspercentage per vraag]
Getoetste doelstellingen: [lijst]

Waar zitten de leerachterstanden? Wat moet ik opnieuw behandelen? Wat is beheerst?
```

---

### Cursus­ontwikkeling (werk op langere termijn)

**5. Online cursusstructuur**
```
/online-course-creator

Bouw de cursusstructuur voor een cursus over [onderwerp].

Doelgroep: [wie ze zijn, voorkennis]
Vorm: [zelfgestuurd video / cohortgebaseerd / bootcamp]
Lengte: [X weken / X uur content]
Platform: [Teachable / Thinkific / Udemy / intern LMS]
Leerdoelen: [belangrijkste transformatie — wat kunnen ze daarna?]

Genereer: module-overzicht, lessenreeks, toetsmomenten, afsluitende activiteiten.
```

**6. Literatuuronderzoek voor cursusinhoud**
```
/lit-review

Onderzoek de wetenschappelijke basis voor [onderwijsmethode / onderwerpsgebied].

Ik ontwerp een cursus over [onderwerp] en wil zeker stellen dat het curriculum evidence-based is.
Wat zegt het onderzoek over [specifiek aspect van jouw curriculum]?
Zijn er baanbrekende publicaties of consensusbevindingen die ik moet kennen?
```

---

### Community en leerlingbetrokkenheid

**7. E-mailreeks voor leerlingen**
```
/newsletter-publisher

Schrijf een e-mailreeks voor ingeschreven leerlingen van [cursusnaam].

Doel van de reeks: [onboarding / wekelijkse check-in / heractivering / viering]
Toon: [aanmoedigend / professioneel / informeel]
Kernboodschappen voor [deze e-mail of deze week]: [beschrijf]
Lengte: [kort — 150 woorden / volledig — 300 woorden]
```

---

## 30-dagenplan (nieuwe docenten of nieuwe cursus)

### Week 1 — Lesplanningsfundament
- Installeer alle docentvaardigheden: `npx claudient add skill productivity/[naam]`
- Gebruik `/lesson-planner` om je volgende 3 lessen te plannen — vergelijk dit met wat je normaal doet
- Voer de schrijver van leerdoelstellingen uit voor elke les — scherp vage doelen aan tot meetbare uitkomsten
- Maak je eerste exitticket en gebruik het in de les

### Week 2 — Toetsing en feedback
- Gebruik `/lesson-planner` om één toets te ontwerpen — genereer de vragen en rubriek
- Plak na de toets de resultaten in `/student-feedback-analyzer` — oefen met het interpreteren van data
- Voer één exitticket-analyse uit — wat moet je aan het begin van de volgende les bespreken?

### Week 3 — Feedback en verbetering
- Stuur een halverwege-cursus-feedbackenquête (maximaal 5 vragen)
- Gebruik `/student-feedback-analyzer` om de resultaten te analyseren
- Maak ten minste één zichtbare verandering op basis van feedback — en vertel studenten dat je dit hebt gedaan (bouwt vertrouwen en verhoogt respons bij toekomstige enquêtes)

### Week 4 — Cursusontwikkeling
- Gebruik `/online-course-creator` als je een cursus bouwt, of gebruik `/lesson-planner` om de volgende eenheid uit te stippelen
- Gebruik `/lit-review` om te verifiëren dat één belangrijke onderwijsaanpak in jouw curriculum evidence-based is
- Houd tijd bij: hoe lang duurt lesplanning nu vergeleken met vóór Claude?

---

## Contentcreatie-workflows

### Een quiz bouwen (van begin tot eind)

```
/lesson-planner

Ontwerp een quiz voor [les/eenheidsonderwerp].

Getoetste leerdoelstellingen:
1. [Doelstelling]
2. [Doelstelling]
3. [Doelstelling]

Benodigde vraagtypen: [meerkeuzevraag / kort antwoord / waar-onwaar / invuloefening / casusgebaseerd]
Moeilijkheidsgraad: [inleidend / gemiddeld / gevorderd]
Totaal aantal vragen: [N]
Toegestane tijd: [X minuten]
Te dekken Bloom-niveaus: [herinnering: X vragen / toepassing: X vragen / analyse: X vragen]

Genereer: de quiz met antwoordsleutel, afleiders voor meerkeuzevragen gericht op veelgemaakte fouten, en een beoordelingsrubriek voor open vragen.
```

### Een rubriek bouwen

```
/lesson-planner

Ontwerp een beoordelingsrubriek voor [opdrachttype: essay / project / presentatie / practicumverslag].

Getoetste leerdoelstellingen: [lijst]
Opdrachtomschrijving: [korte beschrijving van wat studenten inleveren]
Puntenschaal: [4-puntsschaal / percentage / cijfer / standaardgebaseerd]

Genereer een rubriek met:
- 4-5 dimensies (criteria)
- 4 prestatieniveaus per dimensie (uitstekend / bekwaam / in ontwikkeling / beginnend)
- Duidelijke, gedragsmatige beschrijvingen voor elke cel — geen vage taal zoals "toont begrip"
```

### Spreekpunten voor een diavoorstelling schrijven

```
Ik heb een presentatie over [onderwerp] met deze dia's:

Dia 1: [titel en kernpunt]
Dia 2: [titel en kernpunt]
[Ga door]

Schrijf voor elke dia:
- 2-3 zinnen spreekpunten (wat je zegt, niet wat er op de dia staat)
- Één discussievraag om na deze dia aan de klas te stellen
- Één veelgemaakte misvatting om preventief te bespreken
```

### Facilitatiegids voor een workshop

```
Schrijf een facilitatiegids voor een [X uur] workshop over [onderwerp].

Doelgroep: [wie ze zijn]
Doel: [wat ze na afloop moeten kunnen doen of anders over moeten denken]
Vorm: [persoonlijk / virtueel / hybride]
Groepsgrootte: [N deelnemers]

Genereer:
1. Voorbereidingsopdrachten (indien van toepassing)
2. Instructies voor ruimte/platform-inrichting
3. IJsbreker of opener (sluit aan bij het workshopthema)
4. Hoofdactiviteiten met facilitatienotities
5. Discussievragen voor elk segment
6. Veelvoorkomende facilitatie-uitdagingen en hoe ermee om te gaan
7. Afsluitende reflectie en handelingsbelofte
8. E-mail na de workshop om naar deelnemers te sturen
```

---

## Integraties met hulpmiddelen

### Google Classroom / Canvas / Blackboard
Claude genereert lesplannen, quizvragen, rubrieken en aankondigingen als tekst → je plakt ze in je LMS. Voor quizvragen specifiek: formatteer Claude's uitvoer als genummerde vragen → importeer via de bulk-importfunctie van je LMS.

### Google Forms / Microsoft Forms
Claude schrijft je feedbackenquêtevragen → plak ze in Forms → verzamel → exporteer CSV → plak antwoorden terug in `/student-feedback-analyzer`. De volledige cyclus duurt ongeveer 15 minuten zodra de data verzameld is.

### Notion (voor cursusorganisatie)
Bouw je cursusstructuur in Notion — één pagina per les. Claude genereert lesplancontent → plak in elke pagina. Gebruik Notion's database om bij te houden welke lessen exitticketdata en verzamelde feedback hebben.

### Canva (voor visueel materiaal)
Claude schrijft de inhoud van dia's, hand-outs en infographics → jij ontwerpt in Canva. Gebruik Claude om specifieke, heldere opsommingspunten te schrijven — Canva werkt het beste wanneer de tekst al strak is.

### Zoom / Google Meet
Plak na online synchrone sessies chattranscripten of sessienotities in `/meeting-to-action` om discussiepunten en onbeantwoorde vragen voor follow-up te extraheren.

---

## Bij te houden statistieken

| Activiteit | Handmatige tijd | Met Claude |
|---|---|---|
| Lesplan (nieuw onderwerp) | 3 uur | 20-30 min |
| Quiz met antwoordsleutel | 90 min | 15 min |
| Opdrachtrubriek | 45 min | 10 min |
| Analyse feedbackenquête | 90 min | 15 min |
| Analyse toetsdata | 60 min | 20 min |
| Facilitatiegids workshop | 3 uur | 30 min |

**Wat te doen met de bespaard tijd:** Meer individuele studentbegeleiding, snellere feedback op studentwerk, diepere lespersonalisatie, professioneel lezen en ontwikkelen.

---

## Veelgemaakte fouten (en hoe Claude Code ze voorkomt)

**Fout 1: Vage leerdoelstellingen**
`/lesson-planner` dwingt Bloom-taxonomie-werkwoorden af — geen "begrijpen" of "waarderen" meer. Doelstellingen worden meetbaar.

**Fout 2: Toetsen die herinnering testen terwijl doelstellingen toepassing vereisen**
`/lesson-planner` koppelt toetsvragen aan doelstellingen per Bloom-niveau. Misalignment is zichtbaar.

**Fout 3: Feedbackdata die nooit tot veranderingen leidt**
`/student-feedback-analyzer` eindigt met specifieke, uitvoerbare aanbevelingen. De uitvoer is een takenlijst, geen rapport.

**Fout 4: Lessen zonder check for understanding**
Elk lesplan van `/lesson-planner` bevat een exitticket. Als de les te kort is, is het een formatieve vraag ingebed in de activiteit.

**Fout 5: Jaar na jaar op dezelfde manier lesgeven omdat redesign te lang duurt**
Met Claude duurt een cursusvernieuwing die voorheen een week kostte een dag. De activeringsenergie voor verbetering daalt dramatisch.

---

## Bronnen

- [Aan de slag met Claude Code](getting-started.md)
- [Lesplanner-vaardigheid](../skills/productivity/lesson-planner.md)
- [Studentfeedbackanalyse-vaardigheid](../skills/productivity/student-feedback-analyzer.md)
- [Online cursusmaker-vaardigheid](../skills/small-business/online-course-creator.md)
- [Literatuuronderzoek-vaardigheid](../skills/productivity/lit-review.md)

---
