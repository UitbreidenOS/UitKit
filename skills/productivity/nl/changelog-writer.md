---
name: changelog-writer
description: "Gebruikersgerichte changelog op basis van git-geschiedenis of PR's: groepeer op impact, begrijpelijke taal, links naar documentatie"
---

# Changelog Writer Vaardigheid

## Wanneer activeren
- Een release voorbereiden en een git-log of lijst van PR's omzetten naar een gebruikersgerichte changelog
- Uw team levert continu en u moet een wekelijks of maandelijks overzicht van wijzigingen schrijven
- De technische CHANGELOG.md is te technisch om met klanten te delen
- U moet release-opmerkingen produceren voor een productaankondiging, e-mail of in-app melding
- U wijzigingen wilt classificeren op gebruikersinvloed (nieuwe functie / verbetering / bugfix / brekende wijziging)

## Wanneer NIET gebruiken
- U interne technische release-opmerkingen schrijft voor engineers — die kunnen dichter bij het commit-logboek blijven
- U een volledig blogbericht nodig heeft voor een aankondiging van een grote functie — dat is marketingtekst, geen changelog-vermelding
- U een migratiegids nodig heeft voor brekende wijzigingen — gebruik `/api-doc-writer` voor de migratiegids; de changelog-vermelding moet ernaar linken, niet het vervangen
- U nog niets heeft verzonden — schrijf de changelog nadat de code is geland, niet ervoor

## Instructies

### Git-logboek → gebruikersgerichte changelog

```
Converteer deze git-geschiedenis / PR-lijst naar een gebruikersgerichte changelog-vermelding.

## Releasecontext
Product: [naam]
Versie: [v2.4.0 / "Juni 2026 release" / wekelijks overzicht]
Releasedatum: [datum]
Doelgroep: [eindgebruikers / ontwikkelaars / beheerders / gemengd]

## Ruwe invoer
[Plak een van: git log uitvoer / lijst van samengevoegde PR's / Jira release / Linear mijlpaal / vrije lijst van wijzigingen]

Voorbeeld git log formaat:
abc1234 feat: add bulk invite flow for workspace admins (#1203)
def5678 fix: pagination breaks when filter is active (#1188)
ghi9012 chore: upgrade React to 18.3 (#1201)  ← deze overslaan
jkl3456 feat(api): add cursor-based pagination to /v1/events (#1195)
mno7890 fix: email notifications sent twice on plan upgrade (#1179)
pqr2345 perf: reduce dashboard initial load time by 40% (#1197)
stu6789 BREAKING: remove deprecated /v1/users/bulk endpoint (#1200)

## Instructies

1. FILTER: Sla interne wijzigingen over:
   - Afhankelijkheidsupgrades zonder zichtbare impact voor gebruikers (`chore: upgrade X`)
   - Refactors zonder zichtbare wijziging voor gebruikers (`refactor:`)
   - Alleen testwijzigingen (`test:`)
   - CI/CD-wijzigingen (`ci:`, `build:`)
   - Interne tooling

2. CLASSIFICEER elke resterende wijziging:
   - Nieuwe functie: nieuwe mogelijkheid die de gebruiker eerder niet had
   - Verbetering: bestaande functie werkt nu beter (sneller, eenvoudiger, uitgebreid)
   - Bugfix: iets dat kapot was werkt nu
   - Brekende wijziging: iets dat gebruikersactie vereist om te blijven werken
   - Beveiliging: beveiligingsrelevante fix

3. HERSCHRIJF in begrijpelijke taal:
   - Schrijf voor [doelgroep] — niet voor engineers die de code lezen
   - Geen commit-hashes, branchnamen of interne ticketnummers in de uitvoer
   - Actieve stem: "U kunt nu..." / "We hebben... opgelost" / "We hebben... verbeterd"
   - Één zin per vermelding voor bugfixes en verbeteringen; 2-3 zinnen voor nieuwe functies
   - Link naar documentatie waar relevant: "(Zie [documentatielink])"

4. SORTEER op impact:
   - Brekende wijzigingen eerst (zodat gebruikers ze onmiddellijk zien)
   - Nieuwe functies
   - Verbeteringen
   - Bugfixes

## Uitvoerformaat

---

## [Versie / Releasenaam] — [Datum]

### Brekende wijzigingen
> Actie vereist voor upgraden

- **[Wijzigingstitel]:** [Begrijpelijke beschrijving van wat er is gewijzigd en wat de gebruiker moet doen.] [Migratiegids →](#)

### Nieuwe functies
- **[Functienaam]:** [Wat het doet en voor wie het is. Welk probleem het oplost.]
- **[Functienaam]:** [...]

### Verbeteringen
- [Begrijpelijke beschrijving van de verbetering en het voordeel voor de gebruiker]
- [...]

### Bugfixes
- Opgelost: [beschrijving van wat er kapot was en wat het correcte gedrag nu is]
- [...]

---
```

### Continu release-overzicht (wekelijks/maandelijks)

```
Schrijf een [wekelijks / maandelijks] productupdate van deze lijst van verzonden wijzigingen.

Periode: [datumbereik]
Doelgroep: [klanten in een productnewsletter / ontwikkelaars / enterprise-beheerders]
Toon: [informeel / formeel / technisch]

In deze periode verzonden wijzigingen:
[lijst of plak git log / PR's]

Formaat:
- Begin met de meest impactvolle wijziging (1-2 zinnen — de haak)
- Groepeer op productgebied of thema, niet op verzenddatum
- Gebruik "we"-taal voor wijzigingen ("We hebben X sneller gemaakt..."), "u" voor voordelen ("U kunt nu...")
- Eindig met een "coming up"-sectie als u toegezegde roadmap-items wilt aankondigen

Uitvoer: een changelog-overzicht klaar om in een e-mail, in-app melding of blogbericht te plakken.
Lengte: [kort (onder 200 woorden) / standaard (200-400 woorden) / gedetailleerd (400+ woorden voor grote releases)]
```

### Vermelding van brekende wijziging (gedetailleerd)

```
Schrijf een changelog-vermelding voor een brekende wijziging.

Wijziging: [beschrijf de brekende wijziging in technische termen]
Wat vroeger werkte: [het oude gedrag]
Wat er nu gebeurt: [het nieuwe gedrag]
Waarom we het hebben gewijzigd: [de reden — wees eerlijk als het voor technische schuld is, niet alleen "verbeteringen"]
Getroffen gebruikers: [wie er impact van heeft — iedereen / alleen gebruikers van functie X / alleen op plan X]
Wat ze moeten doen: [specifieke actiestappen genummerd 1, 2, 3]
Deadline: [datum waarop het oude gedrag wordt verwijderd / wanneer ze moeten migreren]
Migratiegids: [link naar documentatie]
Ondersteuning: [waar hulp te krijgen]

Uitvoer: een changelog-vermelding die alarmerend genoeg is voor gebruikers om te lezen, maar niet paniekverwekkend.
Voeg toe: een duidelijk gemarkeerde "Actie vereist"-header.
Niet doen: de vereiste actie verbergen in paragraaftekst.
```

### Changelog kwaliteitsbeoordeling

```
Beoordeel deze changelog op kwaliteit en volledigheid.

[Plak bestaande changelog-vermelding]

Controleer aan de hand van deze kwaliteitscriteria:

VOLLEDIGHEID:
- [ ] Alle brekende wijzigingen vermeld en duidelijk gemarkeerd?
- [ ] Elke vermelding heeft een begrijpelijke beschrijving (geen jargon, geen commit-hashes)?
- [ ] Links naar documentatie voor grote nieuwe functies?
- [ ] Bugfixes leggen uit wat er kapot was, niet alleen "bugfix gedaan"?

TAAL:
- [ ] Geschreven voor [eindgebruikers / ontwikkelaars] — niet voor het interne team?
- [ ] Actieve stem door de hele tekst?
- [ ] Vermeldingen gesorteerd op gebruikersinvloed (brekend → nieuw → verbetering → bugfix)?
- [ ] Geen interne ticketnummers (JIRA-1234) zichtbaar voor externe lezers?

BREKENDE WIJZIGINGEN:
- [ ] Duidelijk gescheiden van andere wijzigingen?
- [ ] Specifieke actie bevatten die de gebruiker moet ondernemen?
- [ ] Deadline en link naar migratiedocumentatie bevatten?

Voor elke lacune: de vermelding correct herschrijven.
```

### Begeleiding bij semantische versiebeheer

```
Aanbeveling voor de juiste semantische versieverhoging op basis van deze wijzigingen.

Huidige versie: [vX.Y.Z]
Wijzigingen in deze release:
[geef de wijzigingen op]

Regels voor semantisch versiebeheer:
- MAJOR (X): brekende wijzigingen — incompatibele API-wijziging, verwijderde functie, gewijzigd gedrag dat bestaand gebruik verbreekt
- MINOR (Y): nieuwe functies — achterwaarts compatibele toevoegingen
- PATCH (Z): bugfixes — alleen achterwaarts compatibele fixes

Aanbeveling: verhoog naar v[X.Y.Z]
Reden: [welke wijziging het verhoogde niveau heeft geactiveerd]

Bij MAJOR-verhoging: herinnering om de migratiegids bij te werken en de tijdlijn duidelijk te communiceren.
```

## Voorbeeld

**Gebruiker:** Hier is ons git-logboek voor de afgelopen sprint. Schrijf de changelog voor v3.2.0.

```
a1b2c3d feat: workspace members can now export their own data (#445)
d4e5f6a feat(api): add filtering by date range to GET /v1/reports (#441)
g7h8i9j fix: CSV export includes duplicate rows when >1000 records (#438)
k1l2m3n fix: notifications not sent when user is on legacy plan (#436)
o4p5q6r perf: report generation 3x faster for large datasets (#440)
s7t8u9v chore: upgrade lodash to 4.17.21 (#443)
w1x2y3z docs: update API authentication guide (#444)
a4b5c6d BREAKING: /v1/exports now returns 202 Accepted instead of 200 OK for async exports (#439)
```

**Uitvoer:**

```markdown
## v3.2.0 — 2 juni 2026

### Brekende wijzigingen
> Actie vereist: update uw integratie als u de Exports API gebruikt

- **Exports API geeft nu 202 terug voor asynchrone exports:** `POST /v1/exports` gaf voorheen `200 OK` terug met de export-URL. Het geeft nu onmiddellijk `202 Accepted` terug en u pollt `GET /v1/exports/{id}` voor de status. Dit maakt het mogelijk dat exports asynchroon worden uitgevoerd zonder uw verzoek te blokkeren. Update eventuele code die op een `200`-statuscode bij het aanmaken van exports controleert. [Migratiegids →](https://docs.example.com/guides/exports-migration)

### Nieuwe functies
- **Zelfbediening gegevensexport:** Werkruimteleden kunnen nu hun eigen gegevens exporteren vanuit hun accountinstellingen, zonder dat een beheerder dit voor hen hoeft te doen.
- **Datumbereikfiltering in de Reports API:** `GET /v1/reports` accepteert nu `start_date`- en `end_date`-queryparameters om resultaten te filteren op een aangepast datumbereik. [Zie referentie →](https://docs.example.com/api/reports)

### Verbeteringen
- Rapportgeneratie is nu 3x sneller voor grote datasets. Rapporten die eerder 30+ seconden duurden, zijn nu klaar in minder dan 10 seconden.

### Bugfixes
- Opgelost: een bug waarbij CSV-exports dubbele rijen bevatten wanneer de export meer dan 1.000 records bevatte.
- Opgelost: een probleem waarbij e-mailmeldingen niet werden verzonden naar gebruikers op legacy-abonnementen.
```

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — we bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
