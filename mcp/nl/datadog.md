# MCP: Datadog

Verbind Claude Code naar Datadog voor real-time observability — query metrieke, zoeken logs, inspecteer APM traces, en manage monitors zonder terminal laten.

## Waarom je dit nodig

Debugging latency spike of production incident middel springen tussen Datadog dashboards, kopiëren metric queries, plakken resultaten Claude, en verlies momentum. Datadog MCP elimineert die context wissel — Claude query je live metrieke, logs, en traces in-context en helpt diagnose en act onmiddellijk.

## Vereisten

- Datadog account met API toegang (enig betaald plan)
- **API Key** — gevonden onder **Organization Settings → API Keys**
- **Application Key** — gevonden onder **Organization Settings → Application Keys** (application keys zijn user-bereikt; gebruik service account gedeelde gebruik)
- Voor EU of GovCloud deployments, je `DD_SITE` waarde (zie Configuration beneden)

## Installatie

Installeer officiële Datadog MCP server via npx — geen global installatie vereist.

```bash
npx @datadog/mcp-datadog --version
```

Pakket resolver zonder error, je klaar om configure.

## Configuratie

Voeg volgende naar je `~/.claude/settings.json` (user-niveau) of `.claude/settings.json` (project-niveau):

```json
{
  "mcpServers": {
    "datadog": {
      "command": "npx",
      "args": ["-y", "@datadog/mcp-datadog"],
      "env": {
        "DD_API_KEY": "YOUR_DD_API_KEY",
        "DD_APP_KEY": "YOUR_DD_APP_KEY",
        "DD_SITE": "datadoghq.com"
      }
    }
  }
}
```

**`DD_SITE` waarden door regio:**

| Regio | Waarde |
|---|---|
| US1 (standaard) | `datadoghq.com` |
| US3 | `us3.datadoghq.com` |
| US5 | `us5.datadoghq.com` |
| EU1 | `datadoghq.eu` |
| GovCloud | `ddog-gov.com` |

Laat `DD_SITE` ingesteld als je op standaard US1 regio.

## Sleutel tools

| Tool | Beschrijving | Sleutel parameters |
|---|---|---|
| `query_metrics` | Laat Datadog metrics query lopen over time window | `query` (DDog query string), `from`, `to` |
| `search_logs` | Zoeken log events met filter syntax | `query`, `from`, `to`, `limit` |
| `list_dashboards` | List alle dashboards in org | `filter_name` |
| `get_monitors` | Haal monitors optioneel status filter | `status` (`Alert`, `Warn`, `OK`, `No Data`), `tags` |
| `create_incident` | Open nieuw incident in Datadog Incident Management | `title`, `severity`, `customer_impacted` |
| `query_apm_traces` | Zoeken APM traces bij service, operatie, resource | `service`, `operation`, `resource`, `from`, `to`, `limit` |

## Gebruiksvoorbeelden

```
Toon p99 latency voor /api/checkout over afgelopen 1 uur

Vind alle ERROR-level log entries in payment-service uit afgelopen 30 minuten

List alle monitors huidig in ALERT staat

Welke APM traces traagst voor orders service in afgelopen 15 minuten?

Maak Sev-2 incident getiteld "Elevated error rate op checkout service"
```

## Authenticatie

1. Login Datadog en gaan **Organization Settings → API Keys**
2. Creëer nieuwe API key — merk key waarde (getoond slechts keer)
3. Gaan **Organization Settings → Application Keys**
4. Creëer application key bereikt je gebruiker of service account
5. Voeg beide waarden `env` blok je settings.json getoond voorbij

Minimum permissions application key: `metrics_read`, `logs_read`, `monitors_read`, `apm_read`. Voeg `incidents_write` als je willen `create_incident` werk.

## Tips

- Datadog metric queries gebruiken zelfde syntax als Metrics Explorer: `avg:system.cpu.user{service:checkout}`. Kopiëer rechtstreeks UI.
- `from` en `to` parameters accepteren Unix timestamps of relative strings zoals `now-1h`.
- `search_logs` gebruik Datadog log query syntax — facet filters zoals `service:payment-service @http.status_code:500` werk verwacht.
- `get_monitors` met `status:Alert` snelste manier snapshot active fires gedurende incident.
- Hoog-cardinality APM query's, stel `limit` (standaard meestal 100) vermijden langzaam responses.
- Application keys user-bereikt standaard — meerdere team members deze MCP gebruiken, creëer gedeelde service account application key voorkomen permission drift wanneer iemand vertrekt.
- Gelanceerd maart 2026 als deel Datadog officiële MCP programma.

## Kosten opmerkingen

Alle MCP aanroepen verbruiken Datadog API quota. Metrics queries en log searches tellen tegen je plan API rate limieten. Vermijd loopend hoog-frequentie automated queries (bijv. via hooks) zonder review je plan's limieten — Datadog handhaaft per-seconde en per-uur API caps op organization niveau.

---
