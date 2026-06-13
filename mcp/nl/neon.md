# MCP: Neon

Beheer Neon Postgres-databases rechtstreeks vanuit Claude Code — maak projecten aan, voer SQL uit, tak databases voor veilige migraties, en haal verbindingsreeksen op zonder je editor te verlaten.

## Waarom je dit nodig hebt

Database-werk tijdens development heeft twee faalwijzen: directe migraties op production uitvoeren (gevaarlijk) en een apart lokaal Postgres-exemplaar onderhouden (wrijving). Neon lost allebei op. Het vertakkingsmodel laat je een geïsoleerde kopie van elke database in ~2 seconden maken. Met de Neon MCP kan Claude vertakken, migreren, valideren en opschonen — alles in één gesprek.

## Installatie

Geen installatie vereist. Neon MCP is een remote server die toegankelijk is via SSE-transport.

## Configuratie

```json
{
  "mcpServers": {
    "neon": {
      "transport": "sse",
      "url": "https://mcp.neon.tech/sse",
      "headers": {
        "Authorization": "Bearer YOUR_NEON_API_KEY"
      }
    }
  }
}
```

Vervang `YOUR_NEON_API_KEY` door je sleutel (zie Verificatie hieronder).

## Sleuteltools

| Tool | Wat het doet |
|---|---|
| `create_project` | Maak een nieuw Neon-project aan |
| `list_projects` | Lijst alle projecten in je account |
| `get_project` | Haal projectdetails op inclusief regio, Postgres-versie en instellingen |
| `execute_sql` | Voer willekeurige SQL uit tegen elke database of vertakking |
| `create_branch` | Vertaak een database van main, een benoemde vertakking of een tijdstempel |
| `list_branches` | Lijst alle vertakkingen voor een project |
| `delete_branch` | Verwijder een vertakking wanneer je klaar bent |
| `get_connection_string` | Retourneer de verbindingsreeks voor een project/vertakking, opgemaakt voor een gegeven ORM |
| `run_migration` | Pas een migratiebestand toe tegen een gespecificeerde vertakking |
| `get_schema` | Onderzoek het volledige schema voor een database of vertakking |

## Gebruiksvoorbeelden

```
Maak een nieuw Neon-project aan genaamd my-app met een database genaamd app_db

Vertaak de productiedatabase voor deze migratietest

Voer deze migratie-SQL uit op de feature-auth-vertakking en toon me het resultaat

Vergelijk het schema tussen de main-vertakking en de feature-auth-vertakking

Geef me de Prisma-verbindingsreeks voor de staging-database

Verwijder de feature-auth-vertakking — migratie is samengevoegd
```

## Verificatie

1. Meld je aan bij [console.neon.tech](https://console.neon.tech)
2. Ga naar **Account Settings → API Keys**
3. Genereer een nieuwe API-sleutel — geef het een beschrijvende naam (bijv. `claude-mcp`)
4. Kopieer de sleutelwaarde onmiddellijk — deze wordt niet meer weergegeven
5. Voeg het toe aan de `Authorization`-header in het configuratieblok hierboven

## Tips

- Vertakkingscreatief duurt ongeveer 2 seconden ongeacht databasegrootte — gebruik een vertakking voor elke migratietest, niet alleen riskante.
- Neon Remote MCP gelanceerd februari 2026 als onderdeel van Neon's officiële ontwikkelingstools.
- `get_connection_string` auto-formats voor Drizzle, Prisma en psycopg2 — specificeer je ORM in het verzoek.
- Vertakkingen zijn copy-on-write op de opslaglaag, dus ze gebruiken minimale schijfruimte tot schrijfbewerkingen afwijken.
- Gebruik `create_branch` met een tijdstempel-argument om een bug te reproduceren die op een specifiek moment heeft plaatsgevonden.
- Nadat je een migratie op een vertakking hebt gevalideerd, gebruik je `execute_sql` op main om het toe te passen — of voeg dit in een implementatiewerkstroom in met de GitHub MCP.
- Free tier bevat 10 vertakkingen per project — meer dan genoeg voor actieve development.

---
