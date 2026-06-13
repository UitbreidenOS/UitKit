# Geavanceerd toolgebruik in Claude API

Vier patronen die tokenkosten verminderen en nauwkeurigheid verbeteren voor tool-zware Claude API-applicaties. Elk patroon lost een specifiek probleem op; de beslissingstabel aan het einde wijst het probleem toe aan het patroon.

---

## Patroon 1: programmatisch tooloproepen (PTC)

**Wat het is:** in plaats van Claude tools één tegelijk in een lus op te roepen, schrijft Claude orchestratie-code die meerdere tools in een enkele afleidingspass aanroept.

Wanneer u 20 bestanden moet lezen en een waarde uit elk moet extraheren, roept de standaardbenadering het `read_file`-hulpmiddel 20 keer op — 20 retourritten, 20 toolresultaatberichten, 20 toevoegingen aan context. Met PTC schrijft Claude een Python-script dat `read_file` in een lus aanroept; de codecoderunner voert het uit; u krijgt één resultaat.

**Token besparing:** ongeveer 37% voor multi-tool workflows. Voor een 3-tool volgorde zonder PTC betaalt u voor het tooloproepbericht, toolresultaat en het opnieuw lezen van geaccumuleerde context bij elke retourrit. PTC vouwt dit in één afleidingspass.

### Setup

Voeg `allowed_callers` toe aan de gereedschapdefinitie om de coderunner-tool toe te staan het aan te roepen:

```python
tools = [
    {
        "name": "read_file",
        "description": "Read a file from the codebase",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {"type": "string"}
            },
            "required": ["path"]
        },
        "allowed_callers": ["code_execution_20250825"]  # enables PTC
    }
]
```

### Vóór PTC (20 retourritten)

```python
# Without PTC — Claude calls read_file 20 times
response = client.messages.create(
    model="claude-sonnet-4-6",
    tools=tools,
    messages=[{"role": "user", "content": "Extract the version from each of these 20 package.json files: [list]"}]
)
# Claude makes 20 sequential tool calls. 20 API round trips.
```

### Na PTC (1 afleidingspass)

```python
# With PTC — Claude writes code to batch the reads
response = client.messages.create(
    model="claude-sonnet-4-6",
    tools=tools + [{"type": "code_execution_20250825"}],
    messages=[{"role": "user", "content": "Extract the version from each of these 20 package.json files: [list]"}]
)
# Claude writes: results = [read_file(p) for p in paths]; return [json.loads(r)['version'] for r in results]
# One code execution. One round trip.
```

### Wanneer te gebruiken

- Herhalende tool patronen: lees N bestanden, extraheer X uit elk, transformeer Y
- Elke workflow waarbij hetzelfde gereedschap meer dan 3 keer met verschillende invoer wordt aangeroepen
- Batch gegevensverwerking waarbij de logica recht is

### Wanneer NIET te gebruiken

- Gereedschappen met neveneffecten (schrijven, verwijderen, verzenden) — coderunner van neveneffectgereedschappen is onvoorspelbaar
- Gereedschappen die afhangen van de uitvoer van een vorige gereedschapoproep wanneer de afhankelijkheid niet vooraf bekend is
- Interactieve workflows waarbij menselijke review vereist is tussen stappen

---

## Patroon 2: dynamisch filteren voor webgereedschappen

**Wat het is:** voordat de resultaten van webzoeking of fetch in het contextvenster voorkomen, schrijft Claude filteringscode die alleen de relevante inhoud extraheert. Ruwe webpagina's kunnen 50.000–200.000 tokens zijn; gefilterde resultaten zijn meestal 1.000–5.000 tokens.

**Token besparing:** ongeveer 24% minder invoertokens op typische ophaal taken. Nauwkeurigheid op retrieval-augmented taken verbetert 13–16 procentpunten omdat het model antwoorden uit een schone, relevante uittreksel in plaats van een rommelige volledig document.

### Setup

Gebruik de nieuwe tooltypen met de vereiste beta-header:

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-6",
    tools=[
        {"type": "web_search_20260209", "name": "web_search"},
        {"type": "web_fetch_20260209", "name": "web_fetch"}
    ],
    messages=[{"role": "user", "content": "What is the current Stripe API version?"}],
    betas=["code-execution-web-tools-2026-02-09"]
)
```

### Hoe filteren werkt

Met de beta-header actief mag Claude filteringscode schrijven voordat webinhoud in het berichtcontext invoert. Voor een zoekopdracht naar "Stripe API version":

1. Claude geeft `web_search("Stripe API version changelog")`
2. Voordat resultaten context voorkomen, schrijft Claude: `[r for r in results if 'api-version' in r['url']]`
3. Alleen overeenkomstige resultaten (3 van 10) voorkomen context
4. Voor elke overeenkomstige URL geeft Claude `web_fetch(url)` met een extractiescript: `soup.find('h1', class_='version').text`
5. Alleen de geëxtraheerde tekenreeks voorkomen context — niet de volledige HTML

Zonder dynamisch filteren zouden alle 10 zoekresultaten en volledige HTML van elke opgehaalde pagina bij elke beurt in het contextvenster voorkomen.

### Wanneer te gebruiken

- Elke applicatie die webzoeking of fetch gebruikt om vragen te beantwoorden
- Onderzoeksagents die meerdere bronnen ophalen
- Controlerende agents die URL's voor specifieke gegevens peilen

### Wanneer NIET te gebruiken

- Wanneer u de volledige documentinhoud nodig hebt (samenvatting, volledige-pagina analyse)
- Wanneer het filtercriterium niet bekend is totdat na het zien van de inhoud

---

## Patroon 3: uitgestelde toolloading (tool search)

**Wat het is:** tools zijn verborgen uit Claudes context totdat nodig. Claude ontdekt beschikbare tools door een meta-tool aan te roepen (`MCPSearch` of gelijkaardig), laadt vervolgens de specifieke tool die het nodig heeft.

**Token besparing:** ongeveer 85% voor grote toolcatalogi. Een catalogus met 50 tools voegt ruwweg 15.000–25.000 tokens toe aan elk bericht in het gesprek. Met uitgestelde laadberging worden slechts 1–3 toolschema's per beurt geladen.

### Setup

```python
tools = [
    {
        "name": "database_query",
        "description": "Query the production database",
        "input_schema": { ... },
        "defer_loading": True   # hide this tool until requested
    },
    # ... 49 more tools with defer_loading: True
]

# Set the number of tools auto-loaded from search results
import os
os.environ["ENABLE_TOOL_SEARCH"] = "auto:3"  # auto-load top 3 matches
```

Met `ENABLE_TOOL_SEARCH=auto:3` ontvangt Claude een `tool_search` meta-tool. Wanneer het een capaciteit nodig heeft, doorzoekt het:

```json
{"type": "tool_use", "name": "tool_search", "input": {"query": "query database"}}
```

De harnas retourneert de top 3 overeenkomende toolschema's. Claude roept het gereedschap vervolgens rechtstreeks aan.

### Wanneer te gebruiken

- 10 of meer tools tegelijk geladen
- MCP-servers met brede catalogi waarbij slechts 2–3 tools relevant zijn per query
- Agents met domein-specifieke tools die alleen in specifieke situaties worden gebruikt

### Wanneer NIET te gebruiken

- Tools die op bijna elke beurt worden gebruikt (bestandszoeking, lezen) — de zoekoploopkosten overschrijden de laadkosten
- Kleine toolcatalogi (onder 10 tools) waarbij de tokenkosten beheersbaar zijn
- Latency-gevoelige applicaties waarbij de extra tool-search retourrit onaanvaardbaar is

---

## Patroon 4: voorbeelden van toolgebruik

**Wat het is:** concrete gebruiksvoorbeelden rechtstreeks toegevoegd aan de tooldef, voorbij het JSON-schema. Het schema beschrijft structuur; voorbeelden demonstreren bedoeling.

**Nauwkeurigheidsverbetering:** 72% → 90% op complexe parametercombinaties in interne benchmarks. Het gat is het grootste voor tools met geneste parameters, enum-combinaties of niet-voor de hand liggende veldbetrekkingen.

### Formaat

Voeg een `input_examples`-array toe aan de gereedschapdefinitie:

```python
{
    "name": "create_alert",
    "description": "Create a monitoring alert with conditions and notification channels",
    "input_schema": {
        "type": "object",
        "properties": {
            "metric": {"type": "string"},
            "condition": {
                "type": "object",
                "properties": {
                    "operator": {"type": "string", "enum": ["gt", "lt", "eq"]},
                    "threshold": {"type": "number"},
                    "window_minutes": {"type": "integer"}
                }
            },
            "channels": {
                "type": "array",
                "items": {"type": "string", "enum": ["slack", "pagerduty", "email"]}
            },
            "severity": {"type": "string", "enum": ["info", "warning", "critical"]}
        }
    },
    "input_examples": [
        {
            "description": "Page on high error rate",
            "input": {
                "metric": "http_error_rate",
                "condition": {"operator": "gt", "threshold": 0.05, "window_minutes": 5},
                "channels": ["pagerduty", "slack"],
                "severity": "critical"
            }
        },
        {
            "description": "Ticket on slow p99 latency",
            "input": {
                "metric": "api_latency_p99_ms",
                "condition": {"operator": "gt", "threshold": 2000, "window_minutes": 15},
                "channels": ["slack"],
                "severity": "warning"
            }
        }
    ]
}
```

### Wanneer te gebruiken

- Tools met complexe geneste parameters
- Tools met meerdere enum velden waarbij geldige combinaties niet voor de hand liggend zijn
- Tools waarbij de beschrijving alleen niet volstaat om correct gebruik te begrijpen
- Elk gereedschap dat in tests onjuist is aangeroepen

### Wanneer NIET te gebruiken

- Eenvoudige tools met vlak, zelf-documenterend parameters
- Tools waarbij het toevoegen van voorbeelden context zou opblazen zonder nauwkeurigheid te verbeteren (controle: gebruikt het model dit gereedschap al correct?)

---

## Alle vier patronen combineren

Voor maximale token-efficiëntie in een production agentische applicatie:

```python
import anthropic
import os

os.environ["ENABLE_TOOL_SEARCH"] = "auto:3"

client = anthropic.Anthropic()

# Tool catalog — all deferred except the meta-tool
tools = [
    # Always-loaded tools (used every turn)
    {"type": "web_search_20260209", "name": "web_search"},
    {"type": "web_fetch_20260209", "name": "web_fetch"},

    # Deferred tools (loaded on demand via tool_search)
    {
        "name": "query_database",
        "description": "Run a read-only SQL query against the analytics database",
        "input_schema": {
            "type": "object",
            "properties": {"sql": {"type": "string"}},
            "required": ["sql"]
        },
        "defer_loading": True,
        "allowed_callers": ["code_execution_20250825"],  # PTC enabled
        "input_examples": [
            {
                "description": "Count users by plan",
                "input": {"sql": "SELECT plan, COUNT(*) FROM users GROUP BY plan"}
            }
        ]
    },
    # ... more deferred tools
]

response = client.messages.create(
    model="claude-sonnet-4-6",
    tools=tools + [{"type": "code_execution_20250825"}],
    messages=[{"role": "user", "content": "..."}],
    betas=["code-execution-web-tools-2026-02-09"]
)
```

Deze configuratie past toe:
- **PTC**: `query_database` kan in batch door de coderunner worden aangeroepen
- **Dynamisch filteren**: webtools filteren voordat resultaten context invoeren
- **Uitgestelde laadberging**: `query_database` laadt alleen bij zoekopdracht
- **Invoervoorbeelden**: correct parametergebruik wordt gedemonstreerd in de gereedschapdefinitie

Gecombineerde besparing op een 10-query analytische workflow: ongeveer 60% minder tokens versus vanilla toolgebruik met dezelfde catalogus.

---

## Beslissingstabel

| Probleem | Patroon |
|---------|---------|
| Dezelfde tool 3+ keer in een workflow aangeroepen | PTC (Patroon 1) |
| Web inhoud opblazen van het contextvenster | Dynamisch filteren (Patroon 2) |
| Tool catalogus > 10 tools; de meeste zijn zelden nodig | Uitgestelde laadberging (Patroon 3) |
| Tool aangeroepen incorrect; complexe geneste params | Invoervoorbeelden (Patroon 4) |
| Ophaal nauwkeurigheid is laag | Dynamisch filteren (Patroon 2) + Invoervoorbeelden (Patroon 4) |
| Grote catalogus EN complexe tools | Uitgestelde laadberging (3) + Invoervoorbeelden (4) |
| Hoge tokenkosten bij elke beurt | Alle vier gecombineerd |

---
