# MCP: Sentry Remote

Verbind Claude Code rechtstreeks met Sentry voor fouttracking, issue-triage en release-health-monitoring — geen npm-installatie vereist, draait als afstandsMCP via HTTP.

## Waarom je dit nodig hebt

Debugging van productiefouten betekent overschakelen naar het Sentry-dashboard, stack traces kopiëren, in Claude plakken en context verliezen. De Sentry Remote MCP eliminateert die round-trip — Claude leest je echte issues, volledige stack traces en releasegegevens in-context en helpt je er onmiddellijk op te handelen.

## Installatie

Geen installatie vereist. Sentry Remote MCP verbindt via SSE-transport. Er is geen npm-pakket om te installeren of onderhouden.

## Configuratie

```json
{
  "mcpServers": {
    "sentry": {
      "transport": "sse",
      "url": "https://mcp.sentry.io/sse",
      "headers": {
        "Authorization": "Bearer YOUR_SENTRY_AUTH_TOKEN"
      }
    }
  }
}
```

Vervang `YOUR_SENTRY_AUTH_TOKEN` door je token (zie Verificatie hieronder).

## Sleuteltools

| Tool | Wat het doet |
|---|---|
| `list_issues` | Query openstaande issues met filters (project, prioriteit, env, datumbereik) |
| `get_issue` | Haal volledige issue-detail op inclusief stack trace en metagegevens |
| `resolve_issue` | Markeer een issue als opgelost |
| `list_events` | Lijst alle gebeurtenissen die aan een issue zijn gekoppeld |
| `get_event` | Haal een specifieke event-payload op |
| `list_releases` | Lijst releases voor een project |
| `get_release` | Release-detail inclusief foutfrequentie, aanname en regressies |
| `list_projects` | Lijst alle projecten in je organisatie |
| `create_comment` | Voeg een opmerking toe aan een issue |
| `assign_issue` | Wijs een issue toe aan een teamlid |

## Gebruiksvoorbeelden

```
Lijst alle onopgeloste P0-issues van de afgelopen 24 uur

Toon de volledige stack trace voor issue PROJ-1234

Los alle issues op die als duplicaat zijn getagd in het auth-project

Wat is de foutfrekwentietrend voor de release v2.1.0?

Zoek alle TypeErrors in production deze week en groepeer op bestand

Welke issues hebben de hoogste gebruikersimpact in production nu?
```

## Verificatie

1. Meld je aan bij Sentry en ga naar **User Settings → API Tokens**
2. Maak een nieuw token met de volgende scopes aan:
   - `project:read`
   - `issue:read`
   - `issue:write` (vereist voor resolve- en comment-acties)
3. Kopieer de tokenwaarde — deze wordt slechts eenmaal weergegeven
4. Plak deze in de `Authorization`-header in het configuratieblok hierboven

Organisatie-niveau-tokens (voor multi-project-orgs) werken op dezelfde manier — maak ze aan onder **Organization Settings → API Tokens**.

## Tips

- Remote MCP's gebruiken `transport: "sse"` en een URL — geen `command`- of `args`-velden. Als je opstarttfouten ziet, verifieer dat de config niet de npx-stijlindeling gebruikt.
- Sentry Remote MCP gelanceerd februari 2026 als onderdeel van Sentry's officiële MCP-programma.
- Filter altijd op `environment` (production versus staging) bij het querying van issues — het mixen van omgevingen in triage verspilt tijd.
- `search_errors` ondersteunt Sentry's query-syntaxis: `is:unresolved level:error user.email:*` — dezelfde syntaxis als in de Sentry-UI.
- `get_release` is de snelste manier om te controleren of een nieuwe implementatie een regressie heeft geïntroduceerd voordat je monitoringwaarschuwing afgaat.
- Pipe `get_issue`-uitvoer in een code-fix-verzoek — Claude heeft de volledige context die nodig is om een gerichte patch te schrijven.

---
