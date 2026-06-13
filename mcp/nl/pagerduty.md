# MCP: PagerDuty

Verbind Claude Code naar PagerDuty voor incident management — list active incidents, controleer on-call schedules, acknowledge en resolve alerts, en maak nieuwe incidents zonder terminal laten.

## Waarom je dit nodig

Gedurende incident, wissel naar PagerDuty UI breekt focus. PagerDuty MCP laat Claude query live incident staat, identificeer wie on call, en neem acknowledge/resolve acties rechtstreeks — houdend je in editor terwijl je werk probleem.

## Vereisten

- PagerDuty account (enig plan met REST API toegang)
- **REST API Key** — gevonden onder **User Settings → API Access Keys** (user token) of **Integrations → API Access Keys** (account-level token; vereist Admin)
- Je email adres verbonden PagerDuty account (vereist voor schrijf operaties)

## Installatie

PagerDuty MCP server beschikbaar als npx pakket. Geen global installatie vereist.

```bash
npx @pagerduty/mcp --version
```

Als alternatief, PagerDuty ondersteunt SSE remote endpoint teams voorkeur niet loopend lokaal process. Zie Configuration beneden beide opties.

## Configuratie

**Optie A — npx (aanbevolen lokaal gebruik):**

```json
{
  "mcpServers": {
    "pagerduty": {
      "command": "npx",
      "args": ["-y", "@pagerduty/mcp"],
      "env": {
        "PD_API_TOKEN": "YOUR_PAGERDUTY_REST_API_KEY",
        "PD_USER_EMAIL": "you@yourcompany.com"
      }
    }
  }
}
```

**Optie B — SSE remote endpoint:**

```json
{
  "mcpServers": {
    "pagerduty": {
      "transport": "sse",
      "url": "https://mcp.pagerduty.com/sse",
      "headers": {
        "Authorization": "Token token=YOUR_PAGERDUTY_REST_API_KEY"
      }
    }
  }
}
```

Gebruik Optie B je team willen gedeelde, centraal beheerd verbinding zonder distribueren API tokens naar individual developer machines.

## Sleutel tools

| Tool | Beschrijving | Sleutel parameters |
|---|---|---|
| `list_incidents` | List incidents met status en urgency filters | `status` (`triggered`, `acknowledged`, `resolved`), `urgency` (`high`, `low`), `service_ids`, `limit` |
| `get_incident` | Haal volledige detail enkel incident | `incident_id` |
| `acknowledge_incident` | Acknowledge incident (stop escalatie) | `incident_id` |
| `resolve_incident` | Resolve incident | `incident_id`, `resolution_note` |
| `list_services` | List alle PagerDuty services account | `query` (naam filter) |
| `get_on_call` | Get huide on-call user(s) schedule of escalatie policy | `schedule_ids`, `escalation_policy_ids`, `since`, `until` |
| `create_incident` | Open nieuw incident op service | `title`, `service_id`, `urgency`, `body` |

## Gebruiksvoorbeelden

```
Wie is on call nu voor payments service?

List alle open P1 incidents over organization

Acknowledge incident INC-123456 en verlaat opmerking ik onderzoeken

Resolve INC-789012 met resolution opmerking "Rolled terug deploy v2.4.1"

Creëer hoog-urgency incident op checkout service getiteld "Database verbinding pool uitgeput"
```

## Authenticatie

**User API token (lees + schrijf je eigen gebruiker):**
1. Login PagerDuty en gaan **User Icon → Mijn Profiel → User Settings → Creëer API User Token**
2. Kopiëer token waarde — getoond slechts keer
3. Plak in `PD_API_TOKEN` je settings.json

**Account-level API token (volle account toegang, Admin rol vereist):**
1. Gaan **Integrations → API Access Keys → Creëer Nieuw API Key**
2. Label schoon (bijv. `claude-code-mcp`) en kopiëer waarde

Acknowledge en resolve operaties vereisen `PD_USER_EMAIL` ingesteld email verbonden token. Schrijf operaties uitgevoerd via account-level token vereisen ook email veld audit log attributie.

## Tips

- `list_incidents` met `status:triggered` geeft alle unacknowledged fires incidents — snelste weg snapshot blast radius gedurende outage.
- `get_on_call` accepteert time window (`since`, `until`) dus je kunt controleer toekomstige on-call rotaties, niet alleen huidig moment.
- PagerDuty incident ID's API zijn numeric (bijv. `P1234AB`) — je kunt vinden URL enig incident detail pagina.
- `create_incident` vereist geldige `service_id`. Gebruik `list_services` eerst geen ID memorized.
- Resolving incidents via MCP triggert PagerDuty's normale post-incident notification flow — belanghebbers zullen notify geconfigureerd.
- Accounts PagerDuty's AIOps of Event Intelligence plan, incident merging en alert correlatie data beschikbaar via extra tools niet hier gelisted — controleer pakket changelog nieuw voegde tools.

## Kosten opmerkingen

PagerDuty MCP gebruikt PagerDuty's REST API v2, welke inbegrepen alle betaalde plans. Geen per-call fees. Rate limieten handhaaft op 960 verzoeken/minuut per API token meeste endpoints — goed voorbij interactief gebruik, maar relevant automated workflows.

---
