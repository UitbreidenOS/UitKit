---
name: interview-scorecard
description: "Gestructureerde sollicitatiescorekaart: competentiegerichte vragen, evaluatierubric en debriefsjabloon voor consistente, biasbestendige aanwervingsbeslissingen"
---

# Vaardigheid: Sollicitatiescorekaart

## Wanneer activeren
- Je hebt een openstaande functie en hebt een gestructureerd sollicitatieproces nodig vóór het eerste kandidaatgesprek
- Je wilt de subjectiviteit van de interviewer en aanwervingsbeslissingen op basis van onderbuikgevoel verminderen
- Je moet nieuwe interviewers trainen in het beoordelen van een functie waarvoor ze nog nooit hebben aangenomen
- Je bereidt je voor op een specifiek kandidaatgesprek en wilt gerichte vragen op basis van hun achtergrond
- Je debriefproces is inconsistent — mensen stemmen duim omhoog/omlaag zonder bewijs
- Je bouwt een aanwervingsproces voor een functietype dat je nog nooit hebt aangenomen (nieuwe functie, nieuw senioriteitsniveau)

## Wanneer NIET gebruiken
- Je hebt alleen een functiebeschrijving nodig — gebruik `/job-description` daarvoor
- Kandidaten sourcen — gebruik `/candidate-sourcer`
- Compensatiebenchmarking — gebruik `/comp-benchmarker`
- Referentiecontroles — andere vaardigheid
- Wanneer je de kandidaat al hebt geïnterviewd en een evaluatie schrijft vanuit geheugen zonder notities (reconstrueer alleen vanuit werkelijke gespreksnotities)

## Instructies

### Scorekaartbouwer

```
Bouw een gestructureerde sollicitatiescorekaart voor [functie].

Functie: [Functietitel]
Niveau: [IC / Manager / Director / VP / C-suite]
Afdeling: [Engineering / Verkoop / Marketing / CS / Ops / Finance]
Belangrijkste verantwoordelijkheden: [top 3-5 dingen die deze persoon zal bezitten]
Vereiste competenties: [3-5 niet-onderhandelbare vaardigheden of eigenschappen]
Prettig om te hebben: [2-3 differentiators die goed van geweldig onderscheiden]
Dealbreakers: [specifieke achtergronden, signalen of eigenschappen die diskwalificeren]

Bouw een scorekaart met:

## Te evalueren competenties (4-6 per functie)
Voor elke competentie:
- Naam: [bijv. "Analytisch denken" / "Communicatie met directie" / "Eigenaarschapsmentaliteit"]
- Definitie: [hoe ziet sterk er precies uit voor deze functie op dit niveau?]
- Waarom het belangrijk is: [hoe beïnvloedt deze competentie direct het succes in de functie?]
- 2-3 sollicitatievragen:
  Vraag 1: [gedragsmatig — "Vertel me over een moment dat je..."]
  Vraag 2: [situationeel — "Hoe zou je benaderen..."]
  Vraag 3 (optioneel): [vervolgvraag — "Wat zou je anders doen?"]
- Bewijs om naar te zoeken in antwoorden:
  Sterk signaal: [specifieke taal, voorbeelden of gedragspatronen]
  Zwak signaal: [vage antwoorden, kan geen voorbeelden geven, ontwijkt verantwoordelijkheid]
  Rode vlag: [specifieke antwoordpatronen die diskwalificeren]

## Scorerubric (voor elke competentie)
4 — Uitzonderlijk: [specifieke beschrijving — gaat verder dan functievereisten]
3 — Sterk: [voldoet aan en overtreft consistent de verwachtingen]
2 — In ontwikkeling: [voldoet inconsistent aan verwachtingen — coaching nodig]
1 — Niet geschikt: [onder de lat voor deze functie op dit niveau]

## Algehele aanbeveling
Op basis van scores:
Gemiddelde ≥ 3,5 → Sterk Aannemen
Gemiddelde 3,0-3,4 → Aannemen met voorbehouden (noteer ze)
Gemiddelde 2,5-2,9 → Niet Aannemen (hiaten te significant)
Gemiddelde < 2,5 → Duidelijk Niet Aannemen

## Debriefsjabloon
Na elk gesprek vult elke interviewer in:
- Beoordeelde competentie: [welke van de 4-6 competenties evalueerde jij?]
- Verzameld bewijs: [specifieke voorbeelden die de kandidaat gaf — citeer ze]
- Score per competentie: [1-4 voor elk]
- Algehele score: [1-4]
- Algehele aanbeveling: [Sterk Aannemen / Aannemen / Niet Aannemen / Sterk Niet Aannemen]
- Voornaamste reden voor aanbeveling: [1-2 zinnen, op bewijs gebaseerd]
- Vragen voor het panel: [iets wat je wilt dat andere interviewers verder onderzoeken]

Genereer de volledige scorekaart voor [functie].
```

### Competentiegerichte vragenbibliotheek

```
Genereer competentiegerichte sollicitatievragen voor [competentie].

Competentie: [bijv. "Klantobsessie" / "Gegevensgestuurde besluitvorming" / "Cross-functionele invloed"]
Functieniveau: [IC / Manager / Senior IC / Director]
Functie: [Verkoop / Engineering / Product / Marketing / Operaties]

Vraagformaat: altijd gedragsmatig STAR-formaat (Situatie, Taak, Actie, Resultaat)

Genereer:
- 3 primaire vragen (open, gedragsmatig, specifiek voor deze competentie)
- 2 vervolgvragen (dieper graven als antwoorden vaag of te hoogdrempelig zijn)
- 1 situationele/hypothetische vraag (voor functies waarbij kandidaten geen directe ervaring hebben)

Geef voor elke vraag:
Wat je test: [de specifieke subvaardigheid binnen deze competentie]
Sterk antwoord ziet er zo uit: [concreet, specifiek, neemt verantwoordelijkheid voor de uitkomst, kwantificeert indien mogelijk]
Zwak antwoord ziet er zo uit: [vaag, zegt "wij" in plaats van "ik", geen duidelijke uitkomst, verschuift de schuld]
Rode vlag in dit antwoord: [ontwijkt de vraag, verzint een verhaal, spreekt het cv tegen]

Veelvoorkomende competenties voor SaaS/tech-functies:
- Probleemoplossing onder ambiguïteit
- Stakeholderscommunicatie en -invloed
- Gegevensgestuurde besluitvorming
- Klantempathie en -obsessie
- Eigenaarschap en verantwoordelijkheid
- Leervermogen en groeimindset
- Samenwerking en conflictoplossing
- Uitvoering en levering onder druk
- Strategisch denken en prioritering
- Teams bouwen en ontwikkelen (managerniveau)

Genereer de vragenbibliotheek voor [competentie].
```

### Ontwerp van het sollicitatiepanel

```
Ontwerp de structuur van het sollicitatiepanel voor [functie].

Functie: [titel]
Totale sollicitatiefasen: [X] (aanbevolen 3-5 fasen — meer dan 5 verliest kandidaten)
Sollicitatieformaat: [remote / persoonlijk / hybride]
Beslissingsnemer: [hiring manager]
Doelstelling voor tijd om te vullen: [X weken]

Aanbevolen panelontwerp:

FASE 1 — Recruteringsscherm (20-30 min, telefonisch)
Doel: Basisprincipes kwalificeren — compensatie, beschikbaarheid, motivatie, communicatie
Wie: Recruiter
Evalueert: basislijn culturele fit, communicatie, dealbreakers

FASE 2 — Scherm hiring manager (30-45 min, video)
Doel: Technische competentie en functiepassing op hoog niveau beoordelen
Wie: Hiring manager
Evalueert: [top 2 competenties voor deze functie]
Uitkomsten: beslissing om door te gaan of af te wijzen — geen dubbelzinnige "misschiens" zonder details

FASE 3 — Technische / vaardigheidsbeoordeling (varieert)
Doel: Functiespecifieke evaluatie — presentatie, casestudy, huiswerk, live oefening
Wie: Hiring manager + 1-2 domeinexperts
Formaat: [kies — live case / huiswerk met debrief / werkmonster / portfoliobeoordeling]
Regel: Maak het realistisch en relevant — geen trucvragen, niets dat meer dan 2 uur duurt

FASE 4 — Panelgesprekken (60-90 min totaal, 2-3 achtereenvolgende gesprekken)
Doel: Brede beoordeling van competenties vanuit meerdere perspectieven
Wie: 2-3 teamleden van relevante functies
Elke interviewer krijgt 1-2 te evalueren competenties toegewezen — geen overlapping
Interviewers delen hun indrukken NIET vóór de debrief

FASE 5 — Directie / leiderschapsgesprek (30-45 min, optioneel voor seniorfuncties)
Doel: Cultuur, leiderschapswaarden, strategische fit
Wie: Manager van de hiring manager of C-suite
Evalueert: Visie-afstemming, communicatie op directieniveau, ambitie

DEBRIEFPROCES:
- Elke interviewer dient de scorekaart in binnen 24 uur na het gesprek
- Debriefvergadering: 30-45 min met alle panelleden
- Gestructureerd: elke persoon deelt score + bewijs vóór enige discussie
- Niemand verandert zijn score vanwege groepsdruk — noteer meningsverschillen
- Beslissing: Aannemen / Niet Aannemen / Proces verlengen

Ontwerp het sollicitatiepanel voor [functie].
```

### Handleiding voor debriefbegeleiding

```
Begeleid de sollicitatiede brief voor [kandidaat] voor [functie].

Kandidaat: [Naam]
Functie: [Titel]
Sollicitatiepanel:
- [Interviewer 1] — evalueerde [competentie A, B]
- [Interviewer 2] — evalueerde [competentie C, D]
- [Interviewer 3] — evalueerde [competentie E, F]

Debriefstructuur (volg deze volgorde — sta GEEN vrije discussie toe om te beginnen):

REGEL: Scores en bewijs vóór meningen. Niemand mag anderen beïnvloeden vóórdat ze hun eigen beoordeling hebben gedeeld.

1. Ga rond: elke interviewer deelt score per competentie en algehele aanbeveling
   - "Mijn algemene aanbeveling is [Sterk Aannemen / Aannemen / Niet Aannemen / Sterk Niet Aannemen] omdat [1 specifiek stuk bewijs]"
   - Geen commentaar van anderen totdat alle scores op tafel liggen

2. Noteer meningsverschillen
   - Als twee interviewers meer dan 1 punt verschillen op dezelfde competentie: bespreek
   - "Jij scoorde gegevensgestuurde besluitvorming een 4; ik scoorde het een 2. Laten we delen wat we observeerden."
   - Doel: op bewijs gebaseerde consensus bereiken, niet middelen of deferencie tonen aan senioriteit

3. Scores samenvoegen
   - Gemiddelde per competentie over alle interviewers
   - Algeheel gemiddelde
   - Aanwervingsdrempel: [jouw drempel — bijv. 3,0+ gemiddeld]

4. Expliciete beslissingsdiscussie
   - Bij sterke consensus → ga naar aanbod of afwijzing
   - Bij verdeeld panel → de hiring manager neemt de beslissing en documenteert de reden
   - Verlaat de debrief nooit met "laat me erover nadenken" — verbind je aan een beslissing

5. Als aangenomen: Welke onboardingbehoeften heeft deze kandidaat?
   - Hiaten aan te pakken in 30-60-90 plan
   - Wie zou hun vroege mentor of buddy moeten zijn?

6. Als niet aangenomen: feedback aan recruiter
   - Welke competentie was de diskwalificatie?
   - Is deze kandidaat het waard om in de pipeline te houden voor een andere functie?
   - Was er een sourcing/screeningprobleem stroomopwaarts?

Produceer debriefoverzicht en aanwervingsbeslissing.
```

## Voorbeeld

**Gebruiker:** Ik ben een Head of Customer Success aan het aannemen. Ze zullen 3 CSM's beheren en een $4M ARR-portfolio bezitten. Welke scorekaart moet ik gebruiken?

**Claude's scorekaart:**

**Head of Customer Success — Sollicitatiescorekaart**

**Te evalueren competenties:**

**1. Commercieel inzicht (eigenaarschap van Net Revenue Retention)**
Vragen:
- "Vertel me over een moment dat je een verlengingsstrategie ontwikkelde voor een klant die risico liep. Wat was de uitkomst?"
- "Hoe denk je over het balanceren van klantgezondheid met uitbreidingsdoelstellingen — en hoe heb je die spanning beheerd?"
Vervolgvraag: "Wat zou je anders doen als je die verlenging opnieuw moest uitvoeren?"
Sterk: Spreekt specifiek over NRR als metriek, toont dat ze uitbreidingseconomie begrijpen, niet alleen "klanten blij maken"
Rode vlag: Definieert CS-succes puur als tevredenheid/NPS zonder omzetbijdrage

**2. Management en teamontwikkeling**
Vragen:
- "Vertel me over een CSM die je hebt ontwikkeld en die ondermaats presteerde. Wat deed je en wat gebeurde er?"
- "Hoe structureer je 1:1's en zorg je ervoor dat je team professioneel groeit, niet alleen hun cijfers haalt?"
Sterk: Specifieke persoon, specifieke coachingsactie, voor/na-uitkomst. Toont dat ze coaching kunnen onderscheiden van uitstoten.
Rode vlag: "Ik stel duidelijke verwachtingen en houd mensen verantwoordelijk" — beschrijft uitkomsten, niet hun werkelijke managementgedrag.

**3. Relatiebeheer met directie**
Vragen:
- "Vertel me over een directielid bij een klant die niet tevreden was met je product. Hoe heb je dat aangepakt?"
- "Hoe krijg en houd je executive sponsors betrokken bij accounts waar je product operationeel maar niet strategisch wordt gebruikt?"
Sterk: Proactief benaderd, eigende de relatie, intern geëscaleerd indien nodig, duidelijke uitkomst.
Rode vlag: Alle escalaties via de champion afgehandeld in plaats van rechtstreeks contact met de directie.

**4. Gegevensgestuurde CS-operaties**
Vragen:
- "Beschrijf het gezondheidsscoremodel dat je hebt gebouwd of verbeterd. Welke signalen gebruikte je en hoe heb je het gevalideerd?"
- "Hoe prioriteer je de tijd van je team over een portfolio van 50+ accounts?"
Sterk: Kan specifieke signalen noemen, afwegingen uitleggen, beschrijven hoe ze de voorspellende nauwkeurigheid hebben gemeten.
Rode vlag: Gezondheidsscore is "gevoel" + inlogfrequentie alleen. Geen melding van validatie of iteratie.

**5. Cross-functionele invloed (Product en Engineering)**
Vraag: "Vertel me over een moment dat je intern pleitte voor een klantbehoefte en ofwel won of verloor. Wat was het proces en wat zou je anders doen?"
Sterk: Bouwde een businesscase met omzetdata, werkte samen met Product in plaats van te eisen, beïnvloedde zonder gezag.
Rode vlag: Klaagt dat "Product nooit naar CS luistert." Beschrijft hun eigen rol in de dynamiek niet.

**Algehele drempel: 3,0+ gemiddeld om aan te nemen op dit niveau.**

---
