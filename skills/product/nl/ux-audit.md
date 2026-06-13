---
name: ux-audit
description: "UX-audit op basis van heuristieken: bruikbaarheidsproblemen identificeren, prioriteren op impact, oplossingen aanbevelen"
---

# Vaardigheid: UX-audit

## Wanneer activeren
- Je evalueert een bestaand product of functie op bruikbaarheidsproblemen zonder gebruikerssessies uit te voeren
- Pre-lancering: je wilt een expertenreview voordat je investeert in gebruikerstests
- Na lancering: een functie presteert ondermaats en je moet diagnosticeren waarom zonder een onderzoeksronde af te wachten
- Je hebt een product geërfd en hebt een systematische basisbeoordeling nodig
- Je wilt een geprioriteerde lijst met oplossingen produceren voor een design- of engineeringsprint

## Wanneer NIET gebruiken
- Je hebt feitelijke gebruikersdata nodig — een UX-audit is een expertenevaluatie, geen gebruikersonderzoek; voor door gebruikers gevalideerde bevindingen gebruik `/usability-report`
- Je evalueert een gloednieuw prototype zonder interface om te beoordelen — schrijf eerst de specificatie
- Je moet de kwaliteit van visueel ontwerp beoordelen (merk, esthetiek) — heuristische evaluatie dekt functionele bruikbaarheid, geen merkontwerp
- Je wilt specifiek de toegankelijkheid controleren — voer een speciale WCAG 2.2-toegankelijkheidsaudit uit (de heuristieken van `/ux-audit` overlappen maar vervangen een volledige a11y-audit niet)

## Instructies

### Volledige heuristische UX-audit (Nielsen's 10 heuristieken)

```
Voer een UX-audit uit van [product / functie / scherm].

## Wat te auditen
Product: [naam]
Bereik: [specifieke schermen, stromen of het volledige product — wees precies]
Platform: [web / mobiel iOS / mobiel Android / desktop-app / alles]
Gebruikerstype waarvoor wordt geëvalueerd: [welke persona deze audit zich op richt]

## Screenshots / opnames / toegang
[Beschrijf wat je kunt delen — screenshots, Figma-link, staging-URL, videodoorloop of tekstbeschrijving van de interface]

## Auditframework: Nielsen's 10 bruikbaarheidsheuristieken

Beoordeel voor elke heuristiek het product: Slaagt / Op het randje / Mislukt
Geef dan specifieke gevonden problemen per onderdeel.

---

### H1 — Zichtbaarheid van systeemstatus
Het product moet gebruikers altijd informeren over wat er gaande is via passende feedback binnen een redelijke tijd.

Evaluatiecriteria:
- Bestaan er laadstatussen die voortgang communiceren?
- Zijn succes-/foutstatussen duidelijk zichtbaar na gebruikersacties?
- Weet de gebruiker altijd waar hij/zij zich bevindt in een meerstappenproces?
- Worden achtergrondoperaties (synchronisatie, automatisch opslaan) passend weergegeven?

Score: [ Slaagt / Op het randje / Mislukt ]
Gevonden problemen:
- [Probleem 1 — specifiek, observeerbaar, met locatieverwijzing]
- [Probleem 2]
Aanbeveling: [specifieke oplossing]

---

### H2 — Overeenkomst tussen systeem en echte wereld
Het product moet de taal van de gebruiker spreken — woorden, zinnen en concepten die hen bekend zijn, niet systeemgerichte jargon.

Evaluatiecriteria:
- Is de terminologie consistent met hoe gebruikers het domein beschrijven (controleer verkoopgesprekken, supporttickets, gebruikersinterviews voor de taal die gebruikers daadwerkelijk gebruiken)?
- Worden pictogrammen universeel begrepen zonder een label?
- Komen metaforen overeen met het echte object of concept dat ze vertegenwoordigen?

Score: [ Slaagt / Op het randje / Mislukt ]
Problemen:
- [Probleem met exacte label of terminologie die verkeerd is]
Aanbeveling: [specifieke formulering of pictogramwijziging]

---

### H3 — Gebruikerscontrole en vrijheid
Gebruikers moeten acties ongedaan kunnen maken/opnieuw uitvoeren en gemakkelijk ongewenste statussen kunnen verlaten.

Evaluatiecriteria:
- Is er een ongedaan maken voor destructieve acties (verwijderen, archiveren, overschrijven)?
- Kunnen gebruikers modals en stromen verlaten zonder ze te moeten voltooien?
- Zijn broodkruimels of achterwaartse navigatie beschikbaar in meerstappenstromen?
- Worden bevestigingsdialogen gebruikt voor onomkeerbare acties?

Score: [ Slaagt / Op het randje / Mislukt ]
Problemen:
- [Probleem]
Aanbeveling: [specifieke oplossing]

---

### H4 — Consistentie en standaarden
Gebruikers mogen zich niet afvragen of verschillende woorden, situaties of acties hetzelfde betekenen.

Evaluatiecriteria:
- Zijn gelijksoortige acties consistent gelabeld en gestyled door het hele product?
- Volgt het product platformconventies (OS, browser, apparaat)?
- Zijn CTA-labels consistent (bijv. "Sla op" vs. "Bijwerken" vs. "Bevestigen" — kies er één)?
- Is het gebruik van componenten consistent (bijv. dropdown vs. radio vs. schakelaar voor vergelijkbare keuzes)?

Score: [ Slaagt / Op het randje / Mislukt ]
Problemen:
- [Maak een lijst van inconsistenties met exacte schermlocaties]
Aanbeveling: [specifieke oplossing of component-audit nodig]

---

### H5 — Foutpreventie
Beter dan goede foutmeldingen is een zorgvuldig ontwerp dat problemen in de eerste plaats voorkomt.

Evaluatiecriteria:
- Zijn gevaarlijke acties beschermd door bevestigingsstappen of duidelijke waarschuwingen?
- Vindt formuliervalidatie inline plaats (vóór verzending) of alleen daarna?
- Worden onomkeerbare acties duidelijk als zodanig gelabeld voordat de gebruiker committeert?
- Zijn foutgevoelige invoervelden beperkt (bijv. datumkiezers in plaats van vrije tekst)?

Score: [ Slaagt / Op het randje / Mislukt ]
Problemen:
- [Probleem]
Aanbeveling: [specifieke oplossing]

---

### H6 — Herkenning boven herinnering
Minimaliseer de geheugenbelasting van de gebruiker — opties, acties en objecten moeten zichtbaar zijn of gemakkelijk op te roepen.

Evaluatiecriteria:
- Zijn de beschikbare acties op elk scherm zichtbaar zonder in menu's te hoeven graven?
- Worden recent bezochte items, eerdere zoektermen of opgeslagen statussen weergegeven?
- Toont de interface context voor besluitvorming (bijv. huidige planlimieten tonen bij upgraden)?
- Worden formuliervelden waar mogelijk vooraf ingevuld met bekende gebruikersdata?

Score: [ Slaagt / Op het randje / Mislukt ]
Problemen:
- [Probleem]
Aanbeveling: [specifieke oplossing]

---

### H7 — Flexibiliteit en efficiëntie van gebruik
Versnellers — onzichtbaar voor beginners — moeten de interactie versnellen voor ervaren gebruikers.

Evaluatiecriteria:
- Zijn sneltoetsen beschikbaar voor gevorderde gebruikers?
- Kunnen bulkacties worden uitgevoerd?
- Zijn repetitieve taken automatiseerbaar of als sjabloon opslaan?
- Is er een zoek-eerst-navigatiepad voor gebruikers die weten wat ze willen?

Score: [ Slaagt / Op het randje / Mislukt ]
Problemen:
- [Probleem — opmerking: deze heuristiek is vaak een nice-to-have; markeer de ernst dienovereenkomstig]
Aanbeveling: [specifieke oplossing]

---

### H8 — Esthetisch en minimalistisch ontwerp
Dialogen mogen geen irrelevante of zelden benodigde informatie bevatten.

Evaluatiecriteria:
- Is elk element op het scherm noodzakelijk voor de taak in kwestie?
- Is de primaire actie duidelijk prominenter dan secundaire acties?
- Is er visuele ruis (decoratieve elementen, redundante tekst, overvolle lay-outs) die om aandacht concurreert?

Score: [ Slaagt / Op het randje / Mislukt ]
Problemen:
- [Probleem met specifieke schermlocatie]
Aanbeveling: [specifieke opruimings- of hiërarchie-oplossing]

---

### H9 — Help gebruikers fouten te herkennen, te diagnosticeren en te herstellen
Foutmeldingen moeten in gewone taal worden uitgedrukt, het probleem precies aangeven en constructief een oplossing voorstellen.

Evaluatiecriteria:
- Zijn foutmeldingen geschreven in gewone taal (geen foutcodes)?
- Leggen ze uit wat er mis ging ÉN wat er aan te doen?
- Zijn foutmeldingen zichtbaar en in de buurt van het foutpunt (niet generieke melding bovenaan de pagina)?
- Worden fouten veroorzaakt door systeemproblemen onderscheiden van gebruikersfouten?

Score: [ Slaagt / Op het randje / Mislukt ]
Problemen:
- [Probleem — plak de werkelijke foutmelding als die slecht is]
Aanbeveling: [herschreven foutmelding]

---

### H10 — Help en documentatie
Ook al is het beter als het systeem zonder documentatie gebruikt kan worden, hulp moet beschikbaar zijn.

Evaluatiecriteria:
- Is er contextuele hulp beschikbaar (tooltips, inline hints, lege statussen met begeleiding)?
- Is de helpdocumentatie doorzoekbaar?
- Zijn er onboardingstromen aanwezig voor nieuwe gebruikers?
- Is er een snelreferentiepad voor vragen "hoe doe ik X"?

Score: [ Slaagt / Op het randje / Mislukt ]
Problemen:
- [Probleem]
Aanbeveling: [specifieke oplossing]

---

## Auditsamenvatting

### Heuristische scorekaart
| Heuristiek | Score | Gevonden problemen |
|---|---|---|
| H1 — Systeemstatus | Slaagt/Op het randje/Mislukt | N problemen |
| H2 — Overeenkomst echte wereld | Slaagt/Op het randje/Mislukt | N problemen |
| H3 — Gebruikerscontrole | Slaagt/Op het randje/Mislukt | N problemen |
| H4 — Consistentie | Slaagt/Op het randje/Mislukt | N problemen |
| H5 — Foutpreventie | Slaagt/Op het randje/Mislukt | N problemen |
| H6 — Herkenning | Slaagt/Op het randje/Mislukt | N problemen |
| H7 — Flexibiliteit | Slaagt/Op het randje/Mislukt | N problemen |
| H8 — Minimalisme | Slaagt/Op het randje/Mislukt | N problemen |
| H9 — Foutherstel | Slaagt/Op het randje/Mislukt | N problemen |
| H10 — Hulp | Slaagt/Op het randje/Mislukt | N problemen |

### Geprioriteerde lijst met oplossingen
| Prioriteit | Probleem | Heuristiek | Ernst | Inspanning | Aanbeveling |
|---|---|---|---|---|---|
| P1 | [probleemtitel] | H[N] | Kritiek | Laag | [oplossing] |
| P2 | [probleemtitel] | H[N] | Hoog | Gemiddeld | [oplossing] |
| P3 | [probleemtitel] | H[N] | Gemiddeld | Hoog | [oplossing] |

Algemene UX-kwaliteitsscore: [Slecht / Vraagt om verbetering / Acceptabel / Goed / Uitstekend]
Redenering: [2-3 zin samenvatting van de voornaamste UX-sterke punten en zwakke punten van het product]
```

### Snelle scan-audit (enkelvoudige stroom, 5 minuten)

```
Snelle UX-scan van [specifiek scherm of stroom].

Ik plak een beschrijving / screenshot. Identificeer de top 5 bruikbaarheidsproblemen aan de hand van Nielsen's heuristieken.

Voor elk probleem:
- Welke heuristiek het schendt
- Ernst: Kritiek / Hoog / Gemiddeld / Laag
- Oplossing in één zin

Overschrijd geen 5 problemen — prioriteer meedogenloos. Dit is een snelle scan, geen volledige audit.

Scherm / stroomomschrijving:
[beschrijf de UI of plak screenshot]
```

### Snelle toegankelijkheidscheck (WCAG snelle scan, naast heuristieken)

```
Voer naast de heuristische audit een snelle toegankelijkheidsscan uit van [product / functie].

Aandachtsgebieden:
1. Kleurcontrast: voldoen tekst-/achtergrondcombinaties aan WCAG 2.2 AA (4,5:1 voor hoofdtekst, 3:1 voor grote tekst)?
2. Doelgrootte: zijn interactieve elementen minstens 24×24px (WCAG 2.2 criterium 2.5.8)?
3. Toetsenbordnavigatie: kunnen alle interacties worden voltooid zonder muis?
4. Focusindicatoren: zijn gefocuste elementen zichtbaar gemarkeerd?
5. Formulierlabels: zijn alle formulierinvoervelden gelabeld (niet alleen tijdelijke aanduidingstekst)?
6. Foutidentificatie: worden fouten in tekst geïdentificeerd, niet alleen in kleur?
7. Alt-tekst: hebben afbeeldingen betekenisvolle alt-attributen?
8. Kopstructuur: is de kopstructuur logisch (H1 → H2 → H3, geen overgeslagen niveaus)?

Voor elk criterium: Slaagt / Mislukt / Niet te beoordelen zonder codebeoordeling
Bij Mislukt: specifieke locatie van het probleem en de oplossing.

Opmerking: dit is een snelle expertscan, geen volledige WCAG-conformiteitsaudit. Gebruik geautomatiseerde tools (Axe, WAVE) en tests met ondersteunende technologie voor volledige nalevingsbeoordeling.
```

## Voorbeeld

**Gebruiker:** Audit de onboardingstroom voor een B2B SaaS-analysetool. De stroom is: aanmeldingsformulier → e-mailverificatie → welkomstscherm met "nodig je team uit" → dashboard met lege staat → wizard voor eerste dataverbinding. Gebruikers haken af bij het lege staat-dashboard.

**Uitvoer (fragment):**

```markdown
## UX-audit: Onboardingstroom — Analysetool

### H1 — Zichtbaarheid van systeemstatus: OP HET RANDJE

Probleem 1: E-mailverificatie — geen statusindicatie na verzending van het formulier
Het aanmeldingsformulier wordt verzonden en de gebruiker ziet een generiek "controleer je e-mail"-bericht zonder indicatie
of de e-mail is verzonden, naar welk adres, of wat te doen als deze niet aankomt.
Ernst: Hoog | Locatie: Bevestigingsscherm na aanmelding
Oplossing: Toon het exacte e-mailadres waarnaar de verificatie is verzonden. Voeg "E-mail opnieuw verzenden" toe met een 30-seconden-wachttimer. Toon de tip "Controleer je spammap" na 60 seconden op de pagina.

---

### H6 — Herkenning boven herinnering: MISLUKT (hoofdoorzaak van afhaak bij lege staat)

Probleem: Leeg staat-dashboard biedt geen herkenningstekens voor volgende actie
Na het voltooien van de onboarding komen gebruikers aan op een dashboard dat lege grafieken toont zonder data.
De call to action is een kleine grijze link rechtsboven: "Verbind een databron."
Gebruikers die hier afhaken zijn niet in de war over het product — ze zien geen duidelijke volgende stap.

Bewijs: Het scherm "nodig-je-team-uit" (Stap 2) is de laatste zeer zichtbare stap. Daarna wordt het product stil. Het ingangspunt "data verbinden" is niet prominent genoeg voor een gebruiker
die net een onboarding heeft voltooid en verwacht te worden begeleid.

Ernst: Kritiek | Locatie: Leeg staat-dashboard
Oplossing 1: Voeg een aanhoudende "Begin hier" installatiechecklist toe die zichtbaar is totdat de eerste dataverbinding is gemaakt.
Oplossing 2: Vervang lege grafiekplaceholders door voorbeelddata en een "Vervang door jouw data" CTA.
Oplossing 3: Verplaats "Verbind een databron" naar een volledige breedte hero-CTA in de lege staat, niet een rechtsbovenlinkje.

Inspanning: Gemiddeld

---

### Prioritaire lijst met oplossingen
| P | Probleem | Ernst | Inspanning |
|---|---|---|---|
| 1 | Lege staat geen begeleiding | Kritiek | Gemiddeld |
| 2 | E-mailverificatie adres niet getoond | Hoog | Laag |
| 3 | Stap "team uitnodigen" vóór productwaarde | Hoog | Laag |
```

---
