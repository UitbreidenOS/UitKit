---
name: sdr-objection-handler
description: "Dynamische bezwaargenerator voor SDR's: contextbewuste weerleggingen voor prijs-, concurrent-, timing-, relevantie- en gatekeeperbezwaren — stem- en e-mailvarianten"
---

# SDR Bezwaarafhandeling Skill

## Wanneer activeren
- Je stuit op een bezwaar in een gesprek of e-mail en hebt onmiddellijk een reactie nodig
- Een bezwaarafhandelingsplaybook bouwen voor je team of nieuwe SDR's inwerken
- Trainingssessies — bezwaaroefeningsscenario's genereren
- Je wilt je pitch stress-testen door de moeilijkste bezwaren te genereren die een prospect kan opwerpen
- Eerdere gespreksttranscripten bekijken op gemiste bezwaarkansen

## Wanneer NIET gebruiken
- Antwoordtriage op schaal — gebruik `/sdr-reply-classifier` voor geautomatiseerde inboxtriage
- Bezwaren op AE-niveau tijdens afsluiting (juridisch, inkoop, definitieve prijsstelling) — andere skillset
- Klantbezwaren bij verlengingsgesprekken — CS-domein, niet SDR

## Instructies

### Directe bezwaarresponsgenerator

```
Genereer een reactie op dit bezwaar.

Context:
- Mijn product: [wat je verkoopt]
- Prospect: [titel, bedrijf, sector]
- Kanaal: [koud gesprek (stem) | e-mail | LinkedIn]
- Fase: [koude outreach | opvolging | ontdekking | einde gesprek]

Bezwaar: "[exacte woorden of samenvatting]"

Genereer:
1. Erkennen (1 zin — valideer zonder akkoord te gaan)
2. Herformuleren (1-2 zinnen — verschuif het perspectief)
3. Bewijs/Vraag (1 zin — bewijs of ontdekkingsvraag)
4. Volgende stap (1 zin — bevorder het gesprek)

Geef ook:
- Toon: [zelfverzekerd / empathisch / nieuwsgierig]
- Wat NIET te zeggen
- Of dit waarschijnlijk een echt bezwaar is of een afwijzing
```

### Volledige bezwaarplaybook generator

```
Bouw een bezwaarafhandelingsplaybook voor mijn product.

Product: [beschrijving]
ICP: [ideale klant — sector, omvang, rol]
Topconurrenten: [1-3 hoofdconcurrenten]
Typische bezwaren per categorie:

PRIJS:
- "Te duur"
- "Niet in budget"
- "Concurrent is goedkoper"

CONCURRENT:
- "We gebruiken [Concurrent]"
- "We hebben dit intern gebouwd"
- "We hebben iets soortgelijks geprobeerd en het werkte niet"

TIMING:
- "Nu is geen goed moment"
- "We zitten in een bevriezing"
- "Vraag me volgend kwartaal opnieuw"
- "We hebben net een contract getekend met iemand anders"

RELEVANTIE:
- "Dit is niet van toepassing op ons"
- "We zijn anders dan je andere klanten"
- "Ons team doet dit handmatig en het werkt prima"

VERTROUWEN:
- "Ik heb nog nooit van je bedrijf gehoord"
- "Ik moet meer onderzoek doen"
- "Stuur me eerst een case study"
- "Laat me met mijn team praten"

Genereer voor elk bezwaar: een stemreactie (<30 seconden) en een e-mailversie (4-6 zinnen).
```

### Het LAER-kader (best practice voor bezwaarafhandeling)

```
L — LUISTEREN
Niet onderbreken. Laat ze uitspreken. Let op de exacte woorden — die zijn belangrijk.

A — ACKNOWLEDGEN
"Dat begrijp ik." / "Ik hoor je." / "Goed punt."
Nooit: "Dat klopt eigenlijk niet" / "Maar..." / "Ik begrijp het, maar..."

E — EXPLOREREN
Stel een vraag voordat je antwoordt. Bezwaren hebben sub-bezwaren.
"Mag ik vragen — is dat omdat [A] of meer [B]?"
"Is de zorg de prijs zelf, of het ROI-vertrouwen?"

R — REAGEREN
Nu antwoorden — maar pas nadat je begrijpt wat er echt achter het bezwaar zit.
Begin met: bewijs, een vraag, of een herformulering.
Nooit: een functies-dump.

---
De meeste reps slaan A en E over en springen direct naar R.
Daarom lossen bezwaren zich niet op — prospects voelen zich niet gehoord.
```

### Bezwaarscripts — volledige bibliotheek

```
── PRIJSBEZWAREN ────────────────────────────────────────────────────────────

"Te duur"
STEM: "Volledig begrijpelijk — mag ik vragen, gaat het om de absolute kosten, of dat de ROI zinvol is?
       Want teams op jouw schaal besparen doorgaans [X uur/maand]. De moeite waard om de berekening te zien?"
E-MAIL: "De prijszorg is terecht — ik had met resultaten moeten beginnen.
         [Vergelijkbaar bedrijf] bespaart [X uur/week] met ons, wat neerkomt op [$ bespaard] op jouw uurtarief.
         Graag de ROI-berekening doorlopen in een snel gesprek — zou dat nuttig zijn?"

"Niet in budget"
STEM: "Is dit een situatie van 'we hebben momenteel nergens budget voor', of meer dat
       deze categorie geen budget heeft toegewezen? Want soms kunnen we werken met [kleinere startoptie]."
E-MAIL: "Begrepen over budget — is dit een Q3/Q4-gesprek, of staat het pas op de radar in [jaar]?
         We kunnen soms een beperkte pilot structureren die in een ander budgetpotje past.
         Hoe dan ook, de moeite waard om contact te houden?"

"Jouw concurrent is goedkoper"
STEM: "Waarschijnlijk wel. Mag ik vragen — krijg je [specifiek resultaat] met hen vandaag?
       De meeste teams die overstappen doen dat vanwege [1 concreet verschil], niet de prijs."
E-MAIL: "Je hebt gelijk dat [Concurrent] anders geprijsd is.
         Teams die naar ons overstappen doen dat doorgaans vanwege [specifieke kloof bij concurrent].
         Is [kloof] iets waar jij mee te maken hebt? Als niet, zijn zij misschien echt de betere keuze voor jou."

── CONCURRENTBEZWAREN ───────────────────────────────────────────────────────

"We gebruiken al [Concurrent]"
STEM: "Goed om te weten — ben je tevreden over hoe het werkt, of is er iets dat je wilt dat het beter doet?"
E-MAIL: "Begrijpelijk — [Concurrent] doet goed werk in [gebied]. De meeste teams die ons toevoegen gebruiken beide
         omdat [Concurrent] [X] afhandelt maar [Y] niet dekt. Is [Y] iets waar jij mee te maken hebt?"

"We hebben dit intern gebouwd"
STEM: "Indrukwekkend — wat heb je gebouwd? Ik ben benieuwd of je [specifieke kloof] dekt."
E-MAIL: "Interessant — interne tools zijn vaak een goede fit voor de kerngebruikscase.
         De reden waarom teams zoals de jouwe nog steeds met ons praten is doorgaans [onderhoudsbelasting / schaal / nieuwe gebruikscases].
         Is iets hiervan relevant, of ben je volledig gedekt?"

"We hebben iets soortgelijks geprobeerd en het werkte niet"
STEM: "Dat is goede context — wat is er gebeurd? Want dat bepaalt of wij echt anders zijn
       of gewoon een andere versie van hetzelfde probleem."
E-MAIL: "Dat is nuttig om te weten — mislukte implementaties komen doorgaans neer op [setup / adoptie / verkeerde gebruikscase].
         Mag ik vragen wat er misging? Want als het hetzelfde onderliggende probleem is, zou ik dat liever nu zeggen dan je tijd verspillen."

── TIMINGBEZWAREN ───────────────────────────────────────────────────────────

"Geen goed moment — we hebben het druk"
STEM: "Volledig begrijpelijk. Wanneer is realistisch — volgende week, of is dit meer een gesprek voor volgend kwartaal?"
       (Geef ze twee opties — open "wanneer het uitkomt" wordt nooit ingepland)
E-MAIL: "Begrepen — timing is belangrijk. Zou [specifieke maand] de moeite waard zijn om te herbekijken,
         of moet ik later in het jaar terugkomen? Doe graag wat het meest nuttig is."

"We zitten in een budgetbevriezing"
STEM: "Begrepen — wanneer wordt de bevriezing opgeheven? En is dit iets dat je wilt bekijken als dat het geval is?"
E-MAIL: "Budgetbevriezingen zijn reëel — wanneer opent het venster?
         Ik kan een herinnering instellen voor [specifieke maand] en dan contact opnemen, in plaats van nu je inbox te overspoelen."

"We hebben net met iemand anders getekend"
STEM: "Gefeliciteerd — dat is een grote beslissing. Uit nieuwsgierigheid, wat heeft je overtuigd?
       En wat zou er moeten veranderen om je over 12 maanden te laten herdenken?"
       (Verzamel concurrentinformatie. Plant een zaad. Ga door.)
E-MAIL: Geen e-mail — accepteer vriendelijk en stel een CRM-herinnering in voor de contractverloopdatum.

── RELEVANTIEBEZWAREN ────────────────────────────────────────────────────────

"We zijn anders / dit is niet van toepassing"
STEM: "Begrijpelijk — hoe ga je vandaag om met [specifieke gebruikscase]? Want soms lijkt het aan de oppervlakte anders
       maar is het onderliggende probleem soortgelijk."
E-MAIL: "Je kunt gelijk hebben — mag ik vragen: hoe gaat je team momenteel om met [specifiek proces]?
         Als je het opgelost hebt, verspil ik je tijd niet. Als er een kloof is, 15 minuten waard."

"We doen dit handmatig en het werkt"
STEM: "Hoelang duurt het per week? Want als het echt snel is, zijn wij waarschijnlijk geen goede fit.
       Maar als het [X uur] kost, is dat doorgaans waar het gesprek interessant wordt."
E-MAIL: "Handmatig werkt totdat het niet meer werkt — wat is het volume nu en waar is het plafond?
         De meeste teams praten met ons als ze een schaal- of nauwkeurigheidsprobleem tegenkomen.
         Als je daar ver vandaan bent, zijn wij waarschijnlijk nog niet relevant."

── VERTROUWENSBEZWAREN ────────────────────────────────────────────────────────

"Nog nooit van je gehoord"
STEM: "Begrijpelijk — we zijn [fase: vroeg stadium / snel groeiend / 3 jaar oud].
       Je kent misschien [bekende klant] — zij gebruiken ons voor [X].
       15 minuten waard om te zien of wat zij doen vertaalbaar is naar jouw situatie?"
E-MAIL: "Volledig begrijpelijk — we zijn nieuwer in [hun wereld].
         [Klantnaam] en [Klantnaam] gebruiken ons voor [resultaat]. Ik kan een korte case study delen.
         Als het aanslaat, de moeite waard voor een gesprek — zo niet, laat ik je met rust."

"Ik moet eerst meer onderzoek doen"
STEM: "Wat zou het onderzoek onthullen dat je helpt te beslissen?
       Want ik kan dat doorgaans sneller beantwoorden in een gesprek dan met een Google-zoekopdracht."
E-MAIL: "Begrijpelijk — wat probeer je specifiek te begrijpen?
         Ik kan een gerichte antwoord op die vraag sturen in plaats van een generieke overzichtspresentatie."

"Stuur me eerst een case study"
STEM: "Graag — wat zou de case study nuttig maken? Zodat ik de juiste stuur —
       ben je meer geïnteresseerd in [resultaat A] of [resultaat B]?"
E-MAIL: "Stuur ik nu — hier is de meest relevante voor [hun sector/omvang]:
         [Link]. Eén ding dat het waard is te noteren: [specifiek inzicht dat op hen van toepassing is].
         Graag uitpakken in een gesprek zodra je de kans hebt gehad het te lezen."

── GATEKEEPER BEZWAREN ───────────────────────────────────────────────────────

"Waar gaat dit over?"
STEM: "Ik neem contact op over [specifiek onderwerp] voor [naam beslisser].
       Het heeft betrekking op [hun aanleiding — bijv. de Series D die ze net aankondigden].
       Is [naam] de juiste persoon om mee te praten?"
(Zeg nooit "verkoopgesprek" — zeg "een specifieke vraag over [onderwerp]")

"Ze nemen geen koude gesprekken aan"
STEM: "Ik begrijp het. Is er een betere manier om hun aandacht te trekken —
       e-mail of iemand in hun team met wie ik eerst moet praten?"
(Het doel: een e-mailadres of warme introductie krijgen, niet langs de gatekeeper pushen)

"Laat een voicemail achter"
STEM: Accepteer het vriendelijk. Laat een krappe 20-seconden voicemail achter.
Probeer niet je weg langs te forceren.
```

### Stress-test je pitch (red-team modus)

```
Speel de advocaat van de duivel. Je bent een sceptische VP bij [BEDRIJF] die dit jaar 100 pitches heeft gehoord.

Mijn pitch: "[plak je huidige pitch of waardepropositie]"

Genereer:
1. De 5 moeilijkste bezwaren die deze VP zou opwerpen — in hun woorden (niet generiek)
2. Per bezwaar: hoe een zwakke reactie klinkt (wat de meeste SDR's zeggen)
3. Hoe een sterke reactie klinkt

Dit is voor training — wees brutaal eerlijk.
```

### Bezwaarpatroonanalyse (van gespreksttranscripten)

```
Analyseer deze [N] gespreksttranscripten en identificeer bezwaarpatronen.

[PLAK TRANSCRIPTEN]

Uitvoer:
1. Top 5 meest voorkomende bezwaren (gerangschikt op frequentie)
2. Per bezwaar: hoe het team het momenteel afhandelt (gemiddeld A/B/C/D-cijfer)
3. Het ene bezwaar waarbij het team consistent deals verliest
4. Aanbevolen: bezwaaroefeningsscript voor de volgende teamtrainingssessie
5. "Winpatroon": wat zeggen reps als ze het bezwaar succesvol overwinnen?
```

## Voorbeeld

**Gebruiker:** Ik stuitte net op "We gebruiken al Salesforce en het doet alles wat we nodig hebben." Ik verkoop een sales engagement platform.

**Uitvoer:**

**Intentie:** Concurrentbezwaar met ingebedde "relevantie"-laag — ze denken dat Salesforce jou vervangt, niet aanvult. Dit is een veel voorkomende verkeerde afstemming.

**Stemreactie (27 seconden):**
"Salesforce is geweldig — fijn dat je al in het systeem zit. We zitten eigenlijk bovenop Salesforce, niet ernaast. Wat wij doen is de sequencing- en engagementlaag die Salesforce van nature niet heeft — het automatiseren van de outreachcadentie, het bijhouden van openingen en antwoorden, en het automatisch doorsturen van hete leads naar Salesforce. Benieuwd — hoe beheren je reps hun outreachsequences vandaag? Rechtstreeks in Salesforce, of iets anders?"

**Wat NIET te zeggen:**
- "Salesforce is eigenlijk niet zo goed als mensen denken voor engagement" (defensief)
- "Oh, maar ken je alle functies die wij hebben?" (functies-dump)
- "We zijn compleet anders dan Salesforce" (verwarrend — ze zeiden net dat Salesforce alles doet)

**E-mailversie:**
> "Salesforce als CRM-ruggengraat is volkomen logisch — wij leven eigenlijk binnen Salesforce, niet ernaast.
>
> Wat wij toevoegen is de engagement- en sequencinglaag die het van nature niet doet: geautomatiseerde meerstappencadentie, antwoorddetectie, en lead-routering op basis van engagementsignalen — allemaal automatisch terugschrijvend naar Salesforce.
>
> De meeste teams die met ons praten gebruiken Salesforce + Outreach of een handmatig proces. Benieuwd in welke categorie jij valt — 15 minuten waard om te laten zien wat teams jouw omvang met de combinatie doen?"

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — we bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
