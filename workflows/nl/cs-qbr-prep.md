# CS QBR Prep Workflow

End-to-end voorbereidingsproces voor een Quarterly Business Review — van dataverzameling tot opvolging na het gesprek — met Claude Code om de voorbereidingstijd te verkorten van 4-6 uur naar minder dan 60 minuten.

---

## Overzicht

Deze workflow omvat de volledige QBR-levenscyclus:

1. Dataverzameling (14 dagen van tevoren)
2. Gezondheidsbeoordeling en risicoidentificatie (10 dagen van tevoren)
3. ROI-kwantificering (7 dagen van tevoren)
4. Deck en gespreksonderwerpen (5 dagen van tevoren)
5. Voorbereiding vóór het gesprek (1 dag van tevoren)
6. Opvolging na het gesprek (dezelfde dag)

**Totale voorbereidingstijd met Claude Code:** 60-90 minuten verspreid over de twee weken vóór de QBR

**Wie voert dit uit:** CSM, met coördinatie van de AE en CS-leiderschap voor strategische accounts

---

## Fase 1 — Dataverzameling (14 dagen van tevoren)

**Doel:** Verzamel alle invoergegevens voordat je Claude opent. Je kunt niet samenvatten wat je niet hebt verzameld.

**Checklist van te verzamelen data:**

**Uit productanalyse:**
- Maandelijks actieve gebruikers (afgelopen 3 maanden, trend)
- Inlogfrequentie en -actualiteit
- Gebruik van kernfuncties per functie (welke functies, hoe vaak)
- Stoelbenutting (actieve stoelen / gelicentieerde stoelen)
- Nieuwe functies die dit kwartaal zijn aangenomen

**Uit je CRM:**
- Alle supporttickets afgelopen 90 dagen — typen, oplostijden, openstaande problemen
- Alle CSM-contactmomenten afgelopen 90 dagen — gespreksnotities, e-mailthreads
- NPS-score (meest recent) en trend
- Stakeholderkaart — wie is betrokken, wie is niet gecontacteerd, eventuele personeelswijzigingen

**Uit de commerciële afdeling:**
- Huidige ARR en verlengingsdatum
- Contractvoorwaarden — wat is inbegrepen, wat hebben ze gekocht vs. gebruikt
- Factuurstatus — actueel of achterstallig
- Eventuele uitbreidingsgesprekken die dit kwartaal hebben plaatsgevonden

**Van de klant:**
- Hun vermelde succescriteria bij contractstart (uit kick-offnotities)
- Eventueel publiek nieuws over hun bedrijf — personeelsbezetting, productlanceringen, financiering, leiderschapswijzigingen

**Stap 1.1 — Organiseer je data**

Maak een eenvoudig document met secties voor elke bovenstaande categorie. Plak wat je hebt. Laat gaten zichtbaar — het zijn signalen die je voor de QBR moet opvullen.

Als je gaten hebt in productdata: vraag dit op bij je analyse- of datateam 10+ dagen voor de QBR. Rennen voor gebruiksdata 2 dagen van tevoren is te voorkomen.

---

## Fase 2 — Gezondheidsbeoordeling en risicoidentificatie (10 dagen van tevoren)

**Stap 2.1 — Voer gezondheidsanalyse uit**

```
/health-score-analyzer

Analyse the health of [Customer Name] ahead of their QBR on [date].

[Paste all data gathered in Phase 1]

Produce:
1. Overall health score and risk tier
2. Top 3 risk signals (ranked by severity)
3. Top 3 positive signals (what's genuinely working)
4. Churn probability: low / medium / high
5. Expansion readiness: ready / not yet / blocked by [issue]
6. What needs to be addressed in the QBR vs. resolved before it
```

**Stap 2.2 — Bepaal de QBR-houding**

Kies op basis van de gezondheidsbeoordeling een van drie QBR-modi:

**GROENE account — Partnership QBR**
Doel: vieringen van overwinningen, relatie verdiepen, uitbreidingsgesprek opzetten
Toon: samenwerkend, vooruitkijkend
Uitbreiding: breng het in de sessie ter sprake — "Gegeven wat je hebt bereikt, is dit wat er als volgende mogelijk is"

**GELE account — Bijsturings-QBR**
Doel: de blokkades identificeren en oplossen die volledige waardebenutten verhinderen
Toon: eerlijk, probleemoplossend
Uitbreiding: breng het niet ter sprake tenzij de gezondheid duidelijk verbetert — focus op vertrouwen winnen

**RODE account — Herstel-QBR**
Doel: het probleem erkennen, een concrete oplossing presenteren, vertrouwen herbouwen
Toon: direct, verantwoordelijk — ga niet van start met goed nieuws als de relatie beschadigd is
Uitbreiding: volledig van tafel — focus op het redden van de account
Speciale voorbereiding vereist: schakel VP CS of executive in; bereid servicetegoed of herstelvoorstel voor indien nodig

---

## Fase 3 — ROI-kwantificering (7 dagen van tevoren)

**Dit is de belangrijkste slide in elke QBR. Het vereist specifieke cijfers, geen vage uitspraken.**

**Stap 3.1 — Bouw de ROI-onderbouwing**

```
/qbr-builder

Quantify the ROI [Customer Name] has received from our product this quarter.

Customer use case: [specific workflow they use our product for]
Contract value: $[X] ARR

Available data:
- Usage: [describe what you have — feature usage counts, user sessions, etc.]
- Success criteria from kickoff: [paste what was agreed at contract start]
- Any outcomes they've mentioned on calls: [paste relevant call notes]
- Industry benchmarks for this use case (if known): [X hours saved / X% efficiency gain]

ROI dimensions to quantify:
1. Time savings: [how much time does this use case save per user per week?]
2. Error reduction: [if applicable]
3. Revenue impact: [if their use of our product influences their revenue]
4. Headcount avoided: [if applicable]

Produce: ROI statement suitable for a QBR slide — specific numbers, their language, not product feature language.
```

**Regels voor de ROI-slide:**
- Gebruik hun cijfers, niet die van jou. Hun procentuele verbetering telt zwaarder dan jouw functielijst.
- Als je niet kunt kwantificeren, gebruik hun woorden. Citaten uit gespreksnotities of supporttickets zijn geldig.
- Zeg nooit "we hebben je geholpen X te doen." Zeg "jij hebt X bereikt." Zij zijn de protagonist.
- Één slide, maximaal drie punten. Begraaf de ROI niet in een muur van data.

**Stap 3.2 — Gebruiksdata voorbereiden voor het deck**

Haal een overzichtelijke datasamenvatting op voor het QBR-deck:

| Maatstaf | Vorig kwartaal | Dit kwartaal | Trend |
|---|---|---|---|
| Actieve gebruikers | [N] | [N] | [omhoog/gelijk/omlaag X%] |
| Gebruik kernfunctie | [N keer] | [N keer] | [trend] |
| Stoelbenutting | [X%] | [X%] | [trend] |

---

## Fase 4 — Deck en gespreksonderwerpen (5 dagen van tevoren)

**Stap 4.1 — Bouw de QBR-structuur**

```
/qbr-builder

Build the complete QBR structure for [Customer Name].

QBR date: [date]
Duration: [60 minutes]
Attendees (customer): [exec title, champion title, others]
Attendees (us): [CSM, AE if applicable]
QBR mode: [GREEN partnership / YELLOW course correction / RED recovery]
Primary goal: [retain / expand / relationship reset]

Context:
- Health score: [X/100]
- ROI delivered (from Phase 3): [paste ROI summary]
- Open issues to address: [list]
- Expansion opportunity (if GREEN): $[X], based on [signal]
- Competitive threat (if any): [describe]

Produce:
1. Full 60-minute agenda with time blocks
2. Talking points for each section — what to say and what to listen for
3. Questions to ask in each section (listen > talk)
4. How to handle if they raise [most likely objection or concern]
5. Expansion discussion framework (if GREEN account)
6. Renewal discussion timing and approach
```

**Stap 4.2 — Stuur de agenda (5 dagen van tevoren)**

Stuur de agenda minimaal 5 dagen van tevoren naar de klant — niet de avond ervoor.

E-mailsjabloon:
```
Subject: [Company] + [Your Company] — QBR Agenda, [Date]

Hi [Name],

Looking forward to our QBR on [date]. Sharing the agenda in advance so we can make the most of our time together.

[TIME] — [Topic 1]
[TIME] — [Topic 2]
[TIME] — [Topic 3]
[TIME] — [Topic 4: Next quarter goals and action items]

Before we meet, one question for you:
What would make this the most valuable [60] minutes for your team this quarter?

Feel free to add anything you'd like us to cover. See you on [date].

[CSM Name]
```

---

## Fase 5 — Voorbereiding vóór het gesprek (1 dag van tevoren)

**Stap 5.1 — Briefing van het interne team**

Als de AE of VP meedoet, brief ze dan vóór het gesprek:

```
/qbr-builder

Write an internal briefing for the [AE / VP CS] joining the QBR with [Customer Name] tomorrow.

Key points they need to know:
- Account health and the reason for the current rating
- Commercial situation: ARR, renewal date, churn risk if any
- The primary goal of this QBR
- One thing they should NOT bring up
- One thing they should reinforce if it comes up naturally
- Expansion opportunity (if applicable) — what it is and whether to raise it in this session

Keep it to half a page — they need context, not a full history.
```

**Stap 5.2 — Anticipeer op de moeilijke vraag**

Elke QBR heeft één ongemakkelijk onderwerp. Identificeer het en zorg dat je antwoord klaarstaat.

Vraag jezelf: "Wat is het ene ding waarvan ik hoop dat ze het niet aansnijden?" — dat is precies waar je je op moet voorbereiden.

Bereid je antwoord voor met `/qbr-builder` en oefen het hardop te zeggen vóór het gesprek.

**Stap 5.3 — Eindcontrole**

- Deck is klaar en getest (scherm delen werkt, links zijn actief)
- Alle data is opgehaald en opgemaakt
- Productdemo (indien inbegrepen) is gescript en getest op de omgeving van de klant indien mogelijk
- Je kent de verlengingsdatum van de klant tot op de week nauwkeurig — niet bij benadering
- Je weet wie de economische koper is en of ze in de vergadering aanwezig zijn

---

## Fase 6 — Tijdens de QBR

**Gouden verhouding: 40% jij aan het woord, 60% zij aan het woord.**

Als je meer dan 40% van de tijd aan het woord bent, presenteer je — geen QBR.

**Kritieke regels:**
- Open met een vraag, niet je agenda
- Als ze een prioriteit of zorg geven, schrijf het zichtbaar op — het geeft aan dat je het hebt gehoord
- Reageer niet defensief op kritiek — erken het, vraag door, begrijp het
- Sla de actiepuntensectie niet over — sluit altijd af met gedocumenteerde vervolgstappen, eigenaren en datums

**Als het gesprek ontspoort:**
"Dat is heel belangrijk — ik wil ervoor zorgen dat we er goed op ingaan. Kunnen we het parkeren en er in de laatste 10 minuten op terugkomen? Ik wil er de tijd voor nemen die het verdient."

---

## Fase 7 — Opvolging na het gesprek (dezelfde dag, binnen 2 uur)

**Stap 7.1 — Opvolgings-e-mail**

```
/qbr-builder

Write the post-QBR follow-up email for [Customer Name].

The call was: [45/60/90 minutes] with [attendees]
What we covered:
- Key topics discussed: [list]
- Value delivered recap: [1-2 sentences]
- Issues raised by them: [describe]
- How I responded or what we committed to: [describe]
- Expansion discussion: [did it happen? What was the outcome?]
- Renewal: [what was discussed? Timeline?]

Action items agreed:
- [Action]: Owner [who], due [date]
- [Action]: Owner [who], due [date]

Next touchpoint: [date and format]

Write: professional, warm follow-up email that recaps the session, documents all commitments,
and confirms next steps. Send same day.
```

**Stap 7.2 — CRM-update**

Werk de account in CRM bij binnen 24 uur na de QBR:
- Gezondheidsscore (herzien indien nodig op basis van het gesprek)
- Datum laatste QBR
- Volgende verlengingsdatum bevestigd
- Uitbreidingskans genoteerd (bedrag, tijdlijn, status)
- Actiepunten als taken met vervaldatums
- Belangrijke citaten of signalen van de klant

**Stap 7.3 — Interne debriefing**

Als een executive of AE aanwezig was, stuur ze een interne samenvatting van 3 regels:
- Wat goed ging
- Welke zorgen naar voren kwamen
- Wat de overeengekomen vervolgstap is

---

## QBR-kwaliteitsbenchmarks

| Maatstaf | Groen | Geel | Rood |
|---|---|---|---|
| QBR-voltooiingspercentage (% van in aanmerking komende accounts) | 100% | 75-99% | < 75% |
| Verlengingsgesprek voltooid in QBR | Ja | - | Nee (zal rennen bij verlenging) |
| Actiepunten gedocumenteerd | Alle | De meeste | Geen ("geweldig gesprek!") |
| Opvolging dezelfde dag verstuurd | Ja | Volgende dag | Later of nooit |
| Klant bevestigt datum vóór vervaldatum | 5+ dagen van tevoren | 1-4 dagen | Dag-van rennen |
| Uitbreidingskansen geïdentificeerd | ≥ 1 per GROENE account | - | Geen onderzocht |

---
