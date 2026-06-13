# Claude voor Technisch Schrijvers en Documentatie-engineers

Alles wat een Technisch Schrijver of Documentatie-engineer nodig heeft om AI-ondersteunde documentatieworkflows te draaien — API-documentatie, README's, runbooks, changelogs, ADR's, architectuur van docssites, stijlgidsen en inhoudsaudits.

---

## Voor wie is dit bedoeld

Je bent een technisch schrijver, documentatie-engineer of developer advocate wiens taak het is om complexe technische producten begrijpelijk te maken. Je schrijft API-documentatie, onboardinggidsen, runbooks en changelogs. Je beoordeelt PR's op documentatienauwkeurigheid. Je beheert een docssite. Je vecht om informatie actueel te houden. Claude Code maakt de mechanische delen van dit werk snel en consistent, zodat jij je kunt richten op het schrijven en de redactionele beoordeling die daadwerkelijk expertise vereist.

**Voor Claude Code:** 4 uur om een API-eindpunt van nul af te documenteren. 30 minuten om een changelog-vermelding te schrijven die 30 seconden wordt gelezen. 2 uur om een runbook te produceren uit een incident post-mortem. Wachten tot een engineer uitlegt wat een nieuwe functie doet voordat je kunt beginnen met schrijven.

**Erna:** API-eindpunt gedocumenteerd in 10 minuten vanuit de code of specificatie. Changelog uit een git-log in 5 minuten. Runbook uit een incidenttijdlijn in 20 minuten. Docssite IA-review in 30 minuten.

---

## Installatie in 30 seconden

```bash
# Installeer alle vaardigheden voor Technisch Schrijvers
npx claudient add skills productivity

# Of selecteer er zelf:
npx claudient add skill productivity/readme-generator
npx claudient add skill productivity/runbook-generator
npx claudient add skill productivity/adr-writer
npx claudient add skill productivity/doc-site-builder
npx claudient add skill productivity/api-doc-writer
npx claudient add skill productivity/changelog-writer
npx claudient add agents roles/changelog-narrator
```

---

## Jouw Claude Code-documentatiestack

### Vaardigheden (slash-commando's)

| Vaardigheid | Wat het doet | Wanneer te gebruiken |
|---|---|---|
| `/readme-generator` | Volledige README vanuit code of beschrijving | Nieuw project, nieuwe open-source release |
| `/runbook-generator` | Operationeel runbook vanuit een incident- of procesbeschrijving | Na elk incident, voor elk operationeel proces |
| `/adr-writer` | Architecture Decision Record vanuit een technische beslissing | Wanneer een belangrijke architectuurbeslissing wordt genomen |
| `/doc-site-builder` | Docssite IA: navigatiestructuur, sjablonen, inhoudsindeling, zoekstrategie | Starten of herstructureren van een docssite |
| `/api-doc-writer` | API-documentatie vanuit OpenAPI-specificatie of code: eindpunten, voorbeelden, foutcodes, SDK's | API-wijzigingen, nieuwe eindpunten, migratiegidsen |
| `/changelog-writer` | Gebruikersgerichte changelog vanuit git-log of PR-lijst | Elke release, wekelijkse samenvatting |

### Agents

| Agent | Model | Wanneer inzetten |
|---|---|---|
| `changelog-narrator` | Haiku | Batchgeneratie van changelogs over meerdere releases |

---

## Dagelijkse werkstroom

### Ochtend — Uitvoer van engineering standup naar documentatietaken

**Verander PR's van gisteren in documentatietaken:**
```
/changelog-writer

Deze PR's zijn gisteren samengevoegd. Classificeer elk als: heeft nieuwe doc nodig / heeft doc-update nodig /
heeft changelog-vermelding nodig / alleen intern (geen doc nodig).

PR-lijst:
[plak samengevoegde PR-titels en beschrijvingen]

Geef me voor elk dat een doc of changelog-vermelding nodig heeft: een briefje van 1 regel over wat te schrijven.
```

**Snelle API-documentatie van een nieuw eindpunt:**
```
/api-doc-writer

Documenteer dit API-eindpunt vanuit de code:

[plak de route-handler-code, OpenAPI-fragment of gewone beschrijving]

Uitvoer: volledige eindpuntreferentiedocumentatie met verzoek/antwoord-tabellen, alle parameters,
foutcodes en codevoorbeelden in curl, Python en TypeScript.
```

---

### Inhoudsbeoordelingscyclus

**Controleer een documentatiesectie op veroudering:**
```
/doc-site-builder

Controleer dit gedeelte van onze documentatie op inhoudsproblemen.

Pagina's (titel en datum van laatste bijwerking):
[lijst van pagina's]

Recente productwijzigingen die deze pagina's mogelijk verouderd hebben gemaakt:
[lijst productwijzigingen van de afgelopen 90 dagen — haal op uit changelog of release notes]

Identificeer: pagina's die waarschijnlijk verouderd zijn / pagina's met ontbrekende inhoud / pagina's die gesplitst of samengevoegd moeten worden.
Uitvoer: geprioriteerde achterstand voor inhoudsupdates.
```

**Stijlbeoordeling van een documentatiepagina:**
```
Beoordeel deze documentatiepagina op duidelijkheid, volledigheid en stijl.

Pagina: [plak inhoud]

Controleer op basis van:
1. Is het gebruikersdoel duidelijk uit alleen de titel?
2. Begint de pagina met wat de gebruiker kan bereiken, niet met wat de functie is?
3. Zijn codevoorbeelden uitvoerbaar zoals ze zijn (geen plaatsaanduidingswaarden die ze breken)?
4. Worden foutmeldingen uitgelegd met oorzaken en oplossingen, niet alleen opgesomd?
5. Is het geschreven in de tweede persoon ("je") door de gehele tekst?
6. Zijn er onnodige secties die kunnen worden geschrapt?

Uitvoer: specifieke bewerkingen op regelniveau met toelichting.
```

---

### Releasecyclus — Changelog schrijven

**Bij elke release:**
```
/changelog-writer

Converteer dit git-log naar een gebruikersgerichte changelog voor v[X.Y.Z].

Doelgroep: [eindgebruikers / ontwikkelaars / beheerders]
Releasedatum: [datum]

git log:
[plak git log --oneline uitvoer voor deze release]

Filter uit: afhankelijkheids-upgrades, interne refactors, alleen-test-wijzigingen.
Groepeer op: Brekende wijzigingen → Nieuwe functies → Verbeteringen → Oplossingen.
Schrijf voor een [ontwikkelaar / niet-technische gebruiker] doelgroep.
Voeg links toe naar documentatie voor elke nieuwe functie die documentatie heeft.
```

---

### Incidentdocumentatie — Runbooks

**Na een incident: leg de respons vast als runbook:**
```
/runbook-generator

Maak een runbook van deze incidenttijdlijn.

Service: [servicenaam]
Type incident: [wat er mis ging]
Incidenttijdlijn:
[plak vanuit je incidentvolgingstool of Slack-thread]

Produceer een runbook dat het volgende omvat:
- Symptomen en detectiecriteria
- Stapsgewijze diagnoseprocedure
- Herstelstappen (genummerd, met exacte commando's)
- Escalatiepad
- Preventielijst (wat te controleren voordat dit opnieuw gebeurt)

Formaat: operationeel runbook dat een on-call engineer die dit incident nog nooit heeft gezien, kan volgen.
```

---

### Architectuurbeslissingen — ADR's

**Leg een technische beslissing vast voordat die verloren gaat:**
```
/adr-writer

Schrijf een Architecture Decision Record voor [beslissing].

Beslissing: [wat er is besloten]
Context: [de situatie die een beslissing vereiste — waarom was het nodig?]
Overwogen opties: [geef de alternatieven weer die zijn geëvalueerd]
Beslissingsreden: [waarom deze optie werd gekozen boven de alternatieven]
Gevolgen: [de afwegingen — wat deze beslissing gemakkelijker maakt en wat het moeilijker maakt]
Status: [Geaccepteerd / Voorgesteld / Verouderd / Vervangen door ADR-N]

Gebruik het Nygard-formaat. Voeg in: titel, datum, status, context, beslissing, gevolgen.
```

---

### Docssite-architectuur

**Herstructureer een docssite:**
```
/doc-site-builder

Ontwerp de informatiearchitectuur voor onze docssite.

Product: [naam en beschrijving]
Doelgroep: [ontwikkelaars / eindgebruikers / beheerders / alle]
Huidige toestand: [migreren vanuit Notion / bestaande site herstructureren / opnieuw beginnen]
Benodigde documentatietypes: [aan de slag, API-referentie, handleidingen, conceptuele documentatie, release notes]
Inhoudsomvang: [geschat aantal pagina's]
Platform: [Docusaurus / MkDocs / Mintlify / nog niet gekozen]

Produceer:
- Navigatiestructuur op het hoogste niveau met rationale
- Diátaxis-inhoudsclassificatie (Tutorial / Handleiding / Referentie / Uitleg)
- Paginasjablonen voor elk inhoudstype
- Analyse van inhoudshiaten
- Checklist voor lanceergereedheid
```

---

## 30-daags ingroeiplan (nieuwe technisch schrijvers)

### Week 1 — Installatie en documentatieaudit
- Installeer alle productiviteitsvaardigheden: `npx claudient add skills productivity`
- Voer `/doc-site-builder` Diátaxis-classificatie uit op alle bestaande documentatie — identificeer hiaten en gemengde pagina's
- Lees elke bestaande documentatie in jouw primaire gebied — noteer alles wat verouderd is (vergelijk met recente PR's)
- Volg 2-3 engineering standups — hoor wat er in de volgende sprint wordt opgeleverd

### Week 2 — API-documentatie en referentie schrijven
- Kies 3 API-eindpunten zonder goede documentatie
- Gebruik `/api-doc-writer` om elk te ontwerpen vanuit de code — beoordeel samen met de engineer die het heeft geschreven
- Meet de tijd van concept tot goedkeuring — volg bewerkingscycli om je prompts te verbeteren
- Stel het docs-as-code PR-beoordelingsproces in met engineering

### Week 3 — Changelog en release notes
- Krijg toegang tot de git-log of samengevoegde PR-feed
- Schrijf de volgende release-changelog met `/changelog-writer` — vergelijk met eerdere changelogs voor toon en diepgang
- Schrijf 3 runbooks voor veelvoorkomende on-call-incidenten die nog geen documentatie hebben
- Bekijk je ADR-archief — zijn de genomen beslissingen gedocumenteerd?

### Week 4 — Inhoudsstrategie
- Voer een volledige inhoudsaudit uit: welke documenten hebben de meeste paginaweergaven? Hoogste uitstappercentage? Meeste correlatie met ondersteuningstickets?
- Gebruik analyses om de top 5 pagina's te identificeren waarop gebruikers terechtkomen maar die hen teleurstellen (hoog uitstappercentage + lage tevredenheid)
- Stel een verbeteringssprint voor documentatie voor aan engineering: 5 pagina's, meetbaar doel
- Presenteer de bevindingen van je inhoudsaudit aan het team

---

## Tool-integraties

### GitHub / GitLab (docs-as-code)

Voer CI-controles uit op elke documentatie-PR:

```yaml
# .github/workflows/docs.yml
- name: Check broken links
  uses: lycheeverse/lychee-action@v1

- name: Spell check
  uses: streetsidesoftware/cspell-action@v2

- name: Lint markdown
  uses: DavidAnson/markdownlint-cli2-action@v9
```

Claude Code kan proza schrijven — CI dwingt consistentie af en vangt gebroken links op voordat ze gebruikers bereiken.

### OpenAPI / Swagger (API-specificaties)

Als jouw team OpenAPI gebruikt:
- Commit de specificatie naar dezelfde repository als de documentatie
- Gebruik `/api-doc-writer` om mensvriendelijke documentatie te genereren vanuit de specificatie
- Regenereer bij elke specificatiewijziging — onderhoud API-referentie die gegenereerd kan worden niet handmatig

```bash
# Genereer documentatie vanuit specificatie
npx claudient run api-doc-writer --input openapi.yaml --audience developers
```

### Mintlify / Docusaurus / MkDocs (documentatieplatforms)

Al deze platforms ondersteunen MDX of Markdown met frontmatter. Claude Code genereert Markdown; jij beheert de platformconfiguratie.

Aanbevolen frontmatter-patroon:
```yaml
---
title: "Hoe authenticatie te configureren"
description: "Stel OAuth 2.0, API-sleutel of SSO-authenticatie in voor jouw integratie"
last_updated: "2026-06-02"
tags: [authenticatie, beveiliging, installatie]
---
```

### Linear / Jira (documentatieachterstand)

Volg documentatietaken als eersteklas engineering-tickets. Label: `docs`, `docs-api`, `docs-runbook`.

Claude Code genereert het concept — het ticket volgt beoordeling en publicatie. Sla de beoordelingscyclus niet over.

### Slack / Teams (engineeringsamenwerking)

Stel een `#docs-updates`-kanaal in waar:
- Samengevoegde PR's met gebruikerzichtbare wijzigingen een melding activeren
- Technisch schrijvers engineers kunnen vragen om context in een thread (doorzoekbaar voor toekomstige referentie)
- Release-changelogs worden geplaatst voor beoordeling vóór publicatie

---

## Statistieken om bij te houden

| Statistiek | Doel |
|---|---|
| Documentatiedekking van API-eindpunten | 100% van de publieke eindpunten gedocumenteerd |
| Aflevering van changelog na release | Zelfde dag als de release |
| ADR-dekking | ADR bestaat voor elke significante architectuurbeslissing |
| Runbook-dekking | Runbook bestaat voor elk P1-incidenttype |
| Gebroken links in productiedocumentatie | 0 (afgedwongen door CI) |
| Documentatiefeedbackscore ("Was dit nuttig?") | >70% positief |
| Tijd van PR-samenvoeging tot gepubliceerde documentatie | <24 uur voor kleine wijzigingen, <72 uur voor grote functies |
| Verouderde pagina's (niet bijgewerkt in >6 maanden vs. productwijzigingen) | <10% van de documentatie |

---

## Veelgemaakte fouten (en hoe Claude Code ze helpt vermijden)

**Fout 1: API-documentatie geschreven alsof het voor jezelf is, niet voor de integrator**
`/api-doc-writer` schrijft altijd vanuit het perspectief van de integrator, bevat werkende codevoorbeelden in meerdere talen en legt foutcodes uit met oorzaken en oplossingen — niet alleen een tabel met statuscodes.

**Fout 2: Changelogs die klinken als commit-berichten**
`/changelog-writer` herschrijft commit-berichten in taal van gebruikersgerichte voordelen, filtert interne ruis eruit en groepeert op gebruikersimpact.

**Fout 3: Documentatie die tutorial-, handleiding- en referentie-inhoud op één pagina mengt**
`/doc-site-builder` voert Diátaxis-classificatie uit en markeert gemengde pagina's. Splits ze voordat ze onbeheersbaar worden.

**Fout 4: Runbooks die nooit worden gebruikt omdat ze verouderd zijn**
Schrijf runbooks onmiddellijk na incidenten met `/runbook-generator` terwijl de context vers is. Voeg een datum van "laatste validatie" toe en valideer ze tijdens game days.

**Fout 5: ADR's die nooit worden geschreven**
ADR's schrijven moet gebeuren op het moment van de beslissing — niet zes maanden later. Gebruik `/adr-writer` in dezelfde PR waar de architectuurwijziging binnenkomt.

---

## Bronnen

- [Aan de slag met Claude Code](../getting-started.md)
- [Workflow voor documentatiesprinten](../workflows/docs-sprint.md)
- [Changelog narrator agent](../agents/roles/changelog-narrator.md)
- [ADR writer skill](../skills/productivity/adr-writer.md)
- [Runbook generator skill](../skills/productivity/runbook-generator.md)

---
