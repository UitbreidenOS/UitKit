# MCP: Linear

Beheer Linear-issues, -projecten en -cycli rechtstreeks vanuit Claude Code — query-tickets, update status, maak issues aan en voer triageontshake-workflows uit zonder naar de browser te schakelen.

## Waarom je dit nodig hebt

Linear is waar engineering-werk wordt gevolgd. Zonder MCP kan Claude code schrijven maar heeft geen bewustzijn van wat het team werkelijk doet, wat geblokkeerd is of wat in de huidige sprint staat. Met Linear MCP:
- Issue-context stroomt rechtstreeks in codesessies — geen copy-pasten van ticketbeschrijvingen
- Het maken van issues uit code (TODO's, bug-ontdekkingen, refactor-kandidaten) neemt één prompt
- Sprint-planning, triage en statusupdates gebeuren in dezelfde workflow als development
- Cross-project-rapportage (snelheid, blockers, cycle-brandsnelheid) is één query weg

## Installatie

```bash
npm install -g @linear/mcp-server
```

## Configuratie

Voeg toe aan `~/.claude.json` of project `.claude/mcp.json`:

```json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "@linear/mcp-server"],
      "env": {
        "LINEAR_API_KEY": "your-linear-api-key-here"
      }
    }
  }
}
```

## Sleuteltools / Wat het doet

- `get_issue` — haal een enkele issue op via identificatie (bijv. ENG-123) of UUID, inclusief beschrijving, status, assignee en opmerkingen
- `create_issue` — maak een nieuw issue aan met titel, beschrijving, team, assignee, prioriteit, labels en cycle
- `update_issue` — werk elk veld op een bestaande issue bij: status, assignee, prioriteit, vervaldatum, schatting
- `search_issues` — volledige tekst- en gefilterde zoekopdracht in issues op team, status, assignee, label of cycle
- `list_teams` — lijst alle teams in de werkruimte met hun ID's en sleutels
- `list_projects` — lijst projecten met mijlpaal- en voortgangsgegevens
- `list_cycles` — lijst cycli (sprints) voor een team met start/einddatums en voortgang
- `get_cycle` — haal een specifieke cycle op met alle issues
- `create_comment` — voeg een opmerking toe aan een issue
- `list_workflow_states` — lijst alle staten voor een team (bijv. Todo, In Progress, In Review, Done)

## Gebruiksvoorbeelden

```
Toon me alle openstaande bugs die aan mij zijn toegewezen in de huidige cycle,
gesorteerd op prioriteit. Voeg de issue-ID en huidige status in.
```

```
Scan de codebase naar TODO- en FIXME-opmerkingen, maak dan een Linear-issue
voor elk in het ENG-team met label "tech-debt" en prioriteit Medium.
```

```
Verplaats issue ENG-123 naar "In Review"-staat en voeg een opmerking
toe met deze PR-link en een samenvatting van de wijziging in één zin.
```

```
Lijst alle issues in de backlog gesorteerd op prioriteit en schatting,
suggereer dan een sprint-plan dat past binnen 40 storypoints.
```

```
Toon me alles wat als geblokkeerd is gemarkeerd in de huidige cycle
en list de blokkeringafhankelijkheid voor elk issue.
```

## Verificatie

1. Ga naar **linear.app → Instellingen → API** (of directe link: `linear.app/settings/api`)
2. Klik op **Nieuwe API-sleutel maken** onder Persoonlijke API-sleutels
3. Geef het een naam (bijv. `claude-code`) en kopieer de sleutel — deze wordt slechts eenmaal weergegeven
4. Stel het in als `LINEAR_API_KEY` in het configuratieblok hierboven

Voor team-implementaties waar meerdere personen toegang nodig hebben, maak je in plaats daarvan een OAuth-app onder **Instellingen → API → OAuth-applicaties**.

## Tips

**Roep altijd eerst `list_teams` aan:** Team-ID's (UUID's, niet alleen de sleutel zoals `ENG`) zijn vereist bij het maken van issues. Voer `list_teams` eenmaal uit en noteer de UUID voor elk team waarmee je werkt.

**Issue-identificeerders versus UUID's:** De meeste tools accepteren zowel `ENG-123` (mensleesbare identificatie) als de volledige UUID. Gebruik de identificatie in prompts — het is gemakkelijker om te verwijzen en op te volgen.

**Workflowstaten variëren per team:** Staten zoals "In Review" of "QA" bestaan mogelijk niet in elk team. Roep `list_workflow_states` aan voor het relevante team voordat je status probeert bij te werken, zodat je de exacte statusnoemen en ID's kent.

**Cycle-queries voor sprint-werk:** Gebruik `get_cycle` in plaats van `search_issues` wanneer je alles in de huidige sprint wilt — het geeft de volledige issue-set terug zonder handmatig filteren.

**Bulk maken met voorzichtigheid:** Het maken van veel issues in één sessie gaat snel, maar Linear verzendt meldingen voor elk. Waarschuw het team of gebruik een service-account-API-sleutel voor bulkbewerkingen.

---
