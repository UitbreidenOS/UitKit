# MCP: Atlassian

Verbind Claude Code met Jira en Confluence. Lees tickets, update de status van issues, schrijf documentatie, voer JQL-queries uit en koppel commits aan issues — zonder browser of het verlaten van je werkstroom.

## Waarom je dit nodig hebt

Projectmanagement en documentatie bevinden zich in Atlassian, maar context-switching tussen Jira, Confluence en je editor doet je flow verdwijnen. Met Atlassian MCP:
- Sprint-planning, issue-triage en statusupdates gebeuren in dezelfde sessie als je codewijzigingen
- Claude kan direct koppelen wat het zojuist heeft gebouwd aan het Jira-ticket dat erom vroeg
- Confluence-documentatie blijft in sync met implementatie omdat Claude beide tegelijk kan schrijven
- JQL-queries laten je sprint-data snijden, blockers vinden of werkbelasting auditen zonder de board-UI te laden
- Release notes, retro-samenvattingen en architectuurdocs worden gegenereerd uit echte ticketgegevens, niet uit geheugen

## Installatie

Installeer via het officiële Atlassian MCP-pakket van de Atlassian-ontwikkelaarsportal of npm:

```bash
npm install -g @atlassian/mcp
```

Als het pakket beschikbaar is via directe download van de Atlassian-ontwikkelaarsportal, volg je het platformspecifieke installatieprogramma en noteer je het binaire pad voor het configuratieblok hieronder.

## Configuratie

Voeg toe aan `~/.claude.json` of project `.claude/mcp.json`:

```json
{
  "mcpServers": {
    "atlassian": {
      "command": "npx",
      "args": ["-y", "@atlassian/mcp"],
      "env": {
        "ATLASSIAN_API_TOKEN": "your-atlassian-api-token",
        "ATLASSIAN_EMAIL": "you@yourcompany.com",
        "ATLASSIAN_BASE_URL": "https://your-org.atlassian.net"
      }
    }
  }
}
```

Vervang `your-org` door je werkelijke Atlassian-subdomein.

## Sleuteltools

**Jira**

- `get_issue` — haal een Jira-issue op met volledige details: beschrijving, reacties, status, assignee, gekoppelde issues
- `create_issue` — maak een nieuw ticket met type, samenvatting, beschrijving, assignee, labels en prioriteit
- `update_issue` — werk elk veld op een bestaande issue bij
- `search_issues` — voer een JQL-query uit en retourneer overeenkomende issues
- `get_project` — haal projectmetagegevens en bordconfiguratie op
- `add_comment` — voeg een opmerking toe aan een issue
- `transition_issue` — verplaats een issue door de workflow (bijv. To Do → In Progress → Done)
- `get_sprint` — haal alle issues op in de huidige of een gespecificeerde sprint

**Confluence**

- `get_page` — haal een Confluence-pagina op op ID of titel met volledige inhoud
- `create_page` — maak een nieuwe pagina in een gespecificeerde ruimte
- `update_page` — werk de inhoud van een bestaande pagina bij
- `search_content` — zoek in volledige tekst in alle Confluence-ruimten

## Gebruiksvoorbeelden

```
Zoek alle tickets in de huidige sprint die aan mij zijn toegewezen en geef een samenvatting
van wat er nog te doen is, gegroepeerd op status.
```

```
Ik heb PROJ-123 zojuist gerepareerd — verplaats het naar Done en voeg een opmerking
toe met een link naar PR #456 en een samenvatting van de fix in één zin.
```

```
Zoek in Confluence naar onze authenticatie-architectuurdocumentatie
en vat de belangrijkste ontwerpbeslissingen en openstaande vragen samen.
```

```
Zoek de codebase naar alle TODO-opmerkingen, maak dan een Jira-ticket
voor elk in het TECH-project, toegewezen aan mij, met het bestandspad
en regelnummer in de beschrijving.
```

```
Genereer release notes van alle tickets die in de laatste sprint naar Done zijn verplaatst
en maak een nieuwe Confluence-pagina in de Engineering-ruimte
met de titel "Release Notes — Sprint 42".
```

## Verificatie

1. Meld je aan bij je Atlassian-account en ga naar **Accountinstellingen → Beveiliging → API-tokens**
2. Klik op **API-token maken**, geef het een label en kopieer de waarde onmiddellijk (deze wordt niet meer weergegeven)
3. Stel de drie vereiste omgevingsvariabelen in:
   - `ATLASSIAN_API_TOKEN` — het token dat je zojuist hebt gekopieerd
   - `ATLASSIAN_EMAIL` — het e-mailadres van je Atlassian-account
   - `ATLASSIAN_BASE_URL` — je instantie-URL, bijv. `https://acme.atlassian.net`
4. Het token gebruikt HTTP Basic-authenticatie: e-mail als gebruikersnaam, token als wachtwoord

**OAuth vs API-token:** API-tokens zijn eenvoudiger en voldoende voor persoonlijk of klein teamgebruik. Gebruik Atlassian OAuth 2.0 (3-legged) als je een server-side integratie maakt die namens meerdere gebruikers optreedt.

## Tips

**JQL-syntaxis:** `search_issues` accepteert elke geldige JQL. Nuttige patronen:
- Huidige sprint: `sprint in openSprints() AND assignee = currentUser()`
- Blockers: `issueType = Bug AND priority = Highest AND status != Done`
- Recente wijzigingen: `updated >= -7d AND project = PROJ ORDER BY updated DESC`

**Paginering:** Grote JQL-resultaatsets zijn gepagineerd. Als je alle resultaten nodig hebt, zeg tegen Claude dat het volgende pagina's moet ophalen met de `startAt`-offset tot de totaal is uitgeput.

**Confluence-pagina-ID's:** De pagina-ID verschijnt in de Confluence-URL als `/pages/123456789/`. Gebruik deze wanneer je `get_page` of `update_page` aanroept voor precisie — op titel gebaseerde zoekopdrachten kunnen in grote ruimten dubbelzinnig zijn.

**Jira en Confluence combineren:** De krachtigste workflows gebruiken allebei. Haal sprint-tickets op met `search_issues`, vat het werk samen en schrijf de uitvoer naar een Confluence-pagina met `create_page` — alles in één prompt.

**Geen credentials committen:** Houd `ATLASSIAN_API_TOKEN` in je globale `~/.claude.json`, niet in een project-niveau `.claude/mcp.json` die naar versiecontrole kan worden gecommit.

---
