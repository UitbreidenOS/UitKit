---
name: candidate-sourcer
description: "Passief kandidaten werven: LinkedIn-zoekstrings, Booleaanse zoekopdrachten, outreach-berichtreeksen en pipelinetracking voor recruiters"
---

# Candidate Sourcer Vaardigheid

## Wanneer activeren
- Je hebt een openstaande functie zonder sollicitanten en moet proactief werven
- De kwaliteit van inkomende sollicitanten is laag en je moet passieve kandidaten vinden
- Je hebt een Booleaanse zoekstring nodig om specifieke profielen te vinden op LinkedIn Recruiter of Google
- Het schrijven van het eerste outreach-bericht voor een passieve kandidaat die niet actief op zoek is
- Het opbouwen van een wervingspipeline — je moet 50+ profielen vinden om mee te werken
- Het bijhouden van een wervingscampagne voor meerdere functies tegelijkertijd

## Wanneer NIET gebruiken
- Functieomschrijving schrijven — gebruik `/job-description` daarvoor
- Kandidaten screenen of interviewen — gebruik `/interview-scorecard`
- Compensatieaanbiedingen — gebruik `/comp-benchmarker`
- Interne mobiliteit of herinhuur situaties — andere gespreksvorm en proces

## Instructies

### LinkedIn-zoekstring bouwer

```
Bouw een LinkedIn-zoekstring om [functie] kandidaten te vinden.

Functie: [Functietitel]
Verplichte kwalificaties:
- [Vaardigheid of ervaring 1]
- [Vaardigheid of ervaring 2]
- [Referentie, tool of branche-ervaring]

Wenselijk:
- [Onderscheidend kenmerk 1]
- [Onderscheidend kenmerk 2]

Doelbedrijven (waar ze nu of eerder kunnen werken):
- Directe concurrenten: [lijst]
- Aanverwante bedrijven met overdraagbare vaardigheden: [lijst]
- Sectoren die sterke achtergronden produceren voor deze functie: [lijst]

Uitsluiten:
- [Bedrijven waar je niet van wilt werven — bijv. je eigen bedrijf, bedrijven bekend om slechte praktijken]
- [Locaties om uit te sluiten]

Senioriteit / ervaringsbereik:
- Jaren ervaring: [X-Y jaar]
- Niveau: [IC / Manager / Director / VP]

Produceer:

## LinkedIn Recruiter Booleaanse String
(Gebruik in LinkedIn Recruiter Zoeken → Trefwoorden veld)

("functietitel variant 1" OR "functietitel variant 2" OR "functietitel variant 3")
AND ("vaardigheid 1" OR "vaardigheid 2")
AND ("bedrijfsnaam" OR "bedrijfsnaam 2")
NOT ("uitgesloten term")

## Google X-Ray Zoekopdracht
(Voor het vinden van LinkedIn-profielen zonder Recruiter-toegang)
site:linkedin.com/in "[functietitel]" "[vaardigheid]" "[locatie]" -intitle:"profiles" -inurl:"dir/"

## Booleaanse logica uitgelegd
Gebruik AND om beide termen te vereisen
Gebruik OR om een van beide termen te vinden (breder)
Gebruik NOT om termen uit te sluiten
Gebruik aanhalingstekens voor exacte zinsdelen
Gebruik haakjes om logica te groeperen

## Verfijningen
Als zoekopdracht te veel resultaten oplevert: voeg AND toe met een andere vereiste vaardigheid
Als te weinig resultaten: vervang AND door OR tussen sleuteltermen, of verwijder bedrijfsfilter
Doel: 50-200 sterke profielen voor actieve wervingscampagne — niet duizenden

## Zoekvariaties om parallel uit te voeren
Variatie 1: [focus op titel]
Variatie 2: [focus op vaardigheden]
Variatie 3: [focus op bedrijf/achtergrond]
```

### Outreach-berichtsjablonen

```
Schrijf outreach-berichten voor passieve kandidaatwering.

Functie: [Functietitel]
Bedrijf: [Naam van jouw bedrijf]
Wat deze functie aantrekkelijk maakt: [3 specifieke dingen — niet generiek]
Achtergrond kandidaat: [beschrijf naar wie je dit stuurt — hun waarschijnlijke achtergrond en huidige functie]
Kanaal: [LinkedIn InMail / E-mail / intro via wederzijdse connectie]
Toon: [professioneel / informeel — passend bij de senioriteit van de functie]

Berichtkader:

STRUCTUUR (op volgorde):
1. Patroononderbreking — begin niet met "Hallo, mijn naam is [Recruiter] van [Bedrijf]"
2. Relevantiebewijs — waarom zij specifiek
3. Functiehook — 1 specifiek aantrekkelijk ding over de functie
4. Lichte vraag — laagdrempelige volgende stap, niet "Bent u geïnteresseerd om te solliciteren?"

---

SJABLOON A — LinkedIn InMail (onder 150 woorden — kom direct ter zake)

Onderwerp: [Functie] bij [Bedrijf] — zag uw werk bij [hun bedrijf]

Hallo [Naam],

[Specifieke observatie over hun achtergrond — "Uw ervaring met het leiden van [X] bij [Bedrijf] trok mijn aandacht omdat..."] — niet "Ik stuitte op uw profiel."

We bouwen [één overtuigende zin over wat het bedrijf doet — fase, missie, momentum].

De [functie] waaraan ik werk zou eigenaar zijn van [specifiek impactvol ding], en gezien uw achtergrond in [specifieke match] denk ik dat het een gesprek waard is.

Zou een 20 minuten durend gesprek deze week zinvol zijn om te zien of er een match is?

[Uw naam]

---

SJABLOON B — Warme intro via wederzijdse connectie (e-mail)

Onderwerp: [Wederzijdse contactpersoon] stelde voor dat ik contact opnam

Hallo [Naam],

[Wederzijdse contactpersoon] noemde dat u misschien openstaat voor wat we bouwen bij [Bedrijf] — ik hoop dat het in orde is dat ik direct contact opneem.

[Één zin over het bedrijf — wees specifiek, niet standaard.]

De [functie] die ik probeer in te vullen is [specifieke pitch — wat ze zouden bezitten, met wie ze zouden werken, waarom nu].

Ik weet dat dit soort gesprekken het beste werken als er een echte match is van beide kanten, dus ik praat liever eerst voor ik iets formeels stuur. Zou 20 minuten deze week werken?

[Uw naam]

---

SJABLOON C — Opvolging (als er geen reactie is op eerste bericht na 7 dagen)

Hallo [Naam],

Ik weet dat u niet de hele dag naar InMail staart — ik wil dit gewoon één keer bovenaan brengen voor het geval het begraven was.

Als de timing niet goed is, helemaal geen probleem. Als u nieuwsgierig bent naar wat we bouwen, vertel ik graag eerst meer context voor elk formeel gesprek.

[Uw naam]

---

Regels:
- Personaliseer de eerste zin — als je niets specifieks over hen kunt zeggen, stuur het dan niet
- Eén duidelijk verzoek aan het einde — 20-minuten gesprek, niet "laat me uw gedachten weten"
- Voeg nooit een functieomschrijving bij het eerste bericht — het wijst op een standaardbrief
- Volg één keer op — daarna verder gaan

Genereer outreach-berichten voor [functie] gericht op het [kandidaattype] dat ik zoek.
```

### Wervingspipeline tracker

```
Bouw een wervingspipeline tracker voor [functie].

Functie: [Functietitel]
Wervingsdoel: [X gekwalificeerde kandidaten in pipeline om 1 aanstelling te produceren]
Doel eerste aanstelling op: [datum]

Pipeline-wiskunde (vuistregel voor wervingsconversieratio's):
- Geïdentificeerde profielen → Outreach verzonden: 30-50% (filter op kwaliteit voor outreach)
- Outreach verzonden → Gereageerd: 15-30% (passieve kandidaten hebben lage responspercentages)
- Gereageerd → Geïnteresseerd in gesprek: 50-70% (van degenen die reageren is de meeste nieuwsgierig)
- Telefonische screening geslaagd → Doorstroming naar panelgesprek: 40-60%
- Panelgesprek → Aanbod: 30-50%
- Aanbod → Acceptatie: 70-90%

Voor 1 aanstelling, terugrekenen:
Beoogde aanstelsdatum in [X weken]
Te doen aanbiedingen: ~1,5 (ga uit van 1 afwijzing)
Geslaagde panelgesprekken nodig: ~3-4
Telefonische screenings: ~7-10
Geïnteresseerde reacties: ~12-15
Outreach verzonden: ~50-80
Geïdentificeerde en gekwalificeerde profielen: ~100-150

Pipeline fase tracker (bouw in Notion, Airtable of Google Sheets):

| Kandidaat | Bedrijf | Functie | Bron | Fase | Laatste contact | Volgende actie | Notities |
|---|---|---|---|---|---|---|---|
| [Naam] | [Bedrijf] | [Titel] | [LinkedIn / Verwijzing / Vacaturebank] | [Geïdentificeerd / Outreach verzonden / Gereageerd / Screening / Panelgesprek / Aanbod / Afgewezen / Aangesteld] | [datum] | [actie + datum] | [notities] |

Faseomschrijvingen:
1. Geïdentificeerd — gevonden op LinkedIn, nog niet benaderd
2. Outreach verzonden — eerste bericht verzonden, wachten op reactie
3. Gereageerd — heeft gereageerd, positief of met verzoek om meer informatie
4. Telefonische screening — ingepland of voltooid
5. Doorgestroomd — gaat door naar panelgesprek
6. Panelgesprek — in sollicitatieprocedure
7. Aanbod — aanbod gedaan
8. Aangesteld / Afgewezen / Gepauzeerd

Wekelijkse wervingscadans:
- Maandag: pipeline beoordelen, kandidaten doorstromen of afsluit stagnerende kandidaten
- Dinsdag-donderdag: nieuwe outreach — batchverzending van 15-20 berichten
- Vrijdag: opvolging van niet-respondenten (slechts 1 opvolging, na 7 dagen)

Produceer een wervingsplan met tijdlijn, pipelinedoelen en outreachschema.
```

### Kandidaatonderzoeksbrief

```
Onderzoek deze kandidaat voor ik contact opneem of hen interview.

Kandidaat: [Naam]
Huidig bedrijf: [Bedrijf]
Huidige functie: [Titel]
LinkedIn: [URL of profielgegevens]

Produceer een kandidaatbrief:

ACHTERGRONDOVERZICHT
- Huidige functie en dienstverband: [X jaar bij Bedrijf — is dit een typisch dienstverband of ongewoon kort/lang?]
- Loopbaantraject: [beweegt deze persoon omhoog, zijwaarts of omlaag in senioriteit?]
- Branche-ervaring: [in welke sectoren hebben ze gewerkt?]
- Bedrijfstypen: [startup / scale-up / enterprise / bureau — welke omgevingen kennen ze van binnenuit?]
- Vaardigheden en tools: [welke technische of vakspecifieke vaardigheden zijn zichtbaar in het profiel?]

FUNCTIEPASSINGSSIGNALEN
- Relevante ervaring voor [uw openstaande functie]: [sterk / gedeeltelijk / ontbrekend]
- Lacune om in te vullen tijdens interview: [wat kun je niet vertellen uit het profiel?]
- Mogelijke zorg: [iets in het traject dat verklaring behoeft?]

PERSONALISATIEHOOKS VOOR OUTREACH
- Iets specifieks om naar te verwijzen: [recente post / bedrijfsmijlpaal / loopbaanstap / wederzijdse connectie]
- Wat hen op dit moment ontvankelijk zou kunnen maken: [hun bedrijf heeft net ontslagen doorgevoerd / ze zijn net gepromoveerd — nieuwe functie = waarschijnlijk snel niet aan het bewegen]
- Waar ze waarschijnlijk om geven: [loopbaanontwikkeling / technische uitdaging / missie / compensatie — afleiden uit traject]

INFORMATIE VOOR INTERVIEW
- Wat te onderzoeken: [specifieke transities of lacunes in het profiel]
- Waarschijnlijke motivaties: [waarom zouden ze openstaan voor een overstap?]
- Waarschijnlijke concurrerende aanbiedingen: [wie werft er nu nog vergelijkbare profielen?]

Produceer de kandidaatbrief voor [naam].
```

## Voorbeeld

**Gebruiker:** Ik werf voor een Growth Marketing Manager bij mijn B2B SaaS-bedrijf in Amsterdam. Ze moeten ervaring hebben met betaalde acquisitie (Google/Meta), enige SEO, en idealiter een SaaS-achtergrond hebben. Help me mijn zoektocht en outreach op te bouwen.

**Wervingsplan van Claude:**

**LinkedIn Booleaanse Zoekopdracht:**

```
("Growth Marketing Manager" OR "Performance Marketing Manager" OR "Digital Marketing Manager" OR "Growth Manager")
AND ("Google Ads" OR "paid acquisition" OR "PPC" OR "SEM")
AND ("SaaS" OR "B2B" OR "software")
AND (Amsterdam OR Netherlands OR "The Netherlands")
```

**Google X-Ray (geen LinkedIn Recruiter nodig):**
```
site:linkedin.com/in "growth marketing" ("google ads" OR "paid acquisition") "saas" "amsterdam"
```

**Doelbedrijven om binnen te zoeken:**
Bedrijven in Amsterdam met SaaS-bedrijfsmodellen waar groeimakelaars vaak vandaan komen: Booking.com (performance marketing talent), Adyen, MessageBird (nu Bird), Sendcloud, Picnic, Mews — kijk ook naar Amsterdamse bureaus die betaalde marketing voor SaaS-klanten doen.

**Outreach-bericht — LinkedIn InMail:**

Onderwerp: Growth Marketing functie in Amsterdam — uw SaaS-achtergrond viel op

Hallo [Naam],

Uw tijd bij [hun bedrijf] met het beheren van [specifiek kanaal] trok mijn aandacht — met name de [specifiek ding wat ze hebben gedaan als zichtbaar op profiel].

We schalen groei bij [uw bedrijf] — [één-zins bedrijfspitch: "een B2B SaaS-tool gebruikt door 2.000+ logistieke bedrijven in heel Europa"] — en ik zoek een Growth Marketing Manager om onze betaalde acquisitie en SEO-aanpak van begin tot eind te beheren. Echte eigenaarschap, niet uitvoering voor een bureau.

Zou een 20-minuten gesprek zinvol zijn om te zien of er hier iets is?

[Naam]

**Pipelinedoel:**
- 80-100 profielen identificeren deze week
- 30-40 outreach-berichten verzenden (filter op kwaliteit voor verzending)
- Verwacht 6-10 reacties in 2 weken
- 5-7 telefonisch screenen, 2-3 doorstromen naar panelgesprek
- 1 aanstelling in 6-8 weken vanaf start actief werven

---
