# Advanced Tool Use in Claude API

Vier Patterns, die Token-Kosten reduzieren und Genauigkeit für Tool-umfangreiche Claude API-Anwendungen verbessern. Jedes Pattern löst ein spezifisches Problem; die Entscheidungstabelle am Ende mappt das Problem zum Pattern.

---

## Pattern 1: Programmatic Tool Calling (PTC)

**Was es ist:** Anstatt Claude ruft Tools eins nach dem anderen in einer Schleife auf, schreibt Claude Orchestrierungs-Code, der mehrere Tools in einem einzigen Inference Pass aufruft.

Wenn Sie 20 Dateien lesen und einen Wert aus jeder extrahieren müssen, ruft der Standard-Ansatz das `read_file` Tool 20 Mal auf — 20 Round Trips, 20 Tool Result Messages, 20 Kontextadditions. Mit PTC schreibt Claude ein Python Script, das `read_file` in einer Schleife aufruft; der Code-Executor führt es aus; Sie bekommen ein Ergebnis.

**Token-Einsparungen:** ungefähr 37% für Multi-Tool Workflows. Für eine 3-Tool Sequenz ohne PTC zahlen Sie für das Tool Call Message, Tool Result und Relesen angehäufter Kontexte auf jedem Round Trip. PTC kollabiert dies in einem Inference Pass.

### Setup

Fügen Sie `allowed_callers` zur Tool-Definition hinzu, um dem Code Execution Tool zu erlauben, es aufzurufen:

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

### Vor PTC (20 Round Trips)

```python
# Ohne PTC — Claude ruft read_file 20 Mal auf
response = client.messages.create(
    model="claude-sonnet-4-6",
    tools=tools,
    messages=[{"role": "user", "content": "Extract the version from each of these 20 package.json files: [list]"}]
)
# Claude macht 20 sequenzielle Tool Calls. 20 API Round Trips.
```

### Nach PTC (1 Inference Pass)

```python
# Mit PTC — Claude schreibt Code zum Batch der Reads
response = client.messages.create(
    model="claude-sonnet-4-6",
    tools=tools + [{"type": "code_execution_20250825"}],
    messages=[{"role": "user", "content": "Extract the version from each of these 20 package.json files: [list]"}]
)
# Claude schreibt: results = [read_file(p) for p in paths]; return [json.loads(r)['version'] for r in results]
# Eine Code Execution. Ein Round Trip.
```

### Wann zu verwenden

- Wiederholte Tool Patterns: Lesen Sie N Dateien, extrahieren Sie X von jeder, transformieren Sie Y
- Alle Workflows, wo das gleiche Tool mehr als 3 Mal mit verschiedenen Inputs aufgerufen wird
- Batch-Datenverarbeitung, wo die Logik unkompliziert ist

### Wann nicht zu verwenden

- Tools mit Nebeneffekten (schreiben, löschen, versenden) — Code Execution von Nebeneffekt-Tools ist unpredictable
- Tools, die von der Ausgabe eines vorherigen Tool Calls abhängen, wenn die Abhängigkeit nicht im Voraus bekannt ist
- Interactive Workflows, wo Human Review zwischen Schritten erforderlich ist

---

## Pattern 2: Dynamic Filtering for Web Tools

**Was es ist:** Bevor Web Search oder Fetch Ergebnisse das Context Window betreten, schreibt Claude Filtering-Code, der nur relevanten Inhalt extrahiert. Raw Webseiten können 50.000–200.000 Tokens sein; gefilterte Ergebnisse sind typischerweise 1.000–5.000 Tokens.

**Token-Einsparungen:** ungefähr 24% weniger Input Tokens auf typischen Retrieval Tasks. Genauigkeit auf Retrieval-Augmented Tasks verbessert sich 13–16 Prozentpunkte, weil das Modell aus einem sauberen, relevanten Excerption antwortet, statt einen lärmigen volles Dokument zu scannen.

### Setup

Verwenden Sie die neuen Tool-Typen mit dem erforderlichen Beta-Header:

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

### Wie Filtering funktioniert

Mit dem Beta-Header aktiv, darf Claude Filtering-Code schreiben, bevor Web-Inhalt das Message-Kontext betritt. Für eine Suche nach "Stripe API version":

1. Claude gibt `web_search("Stripe API version changelog")` aus
2. Bevor Ergebnisse in den Kontext betreten, schreibt Claude: `[r for r in results if 'api-version' in r['url']]`
3. Nur Ergebnisse, die passen (3 von 10) betreten den Kontext
4. Für jede passende URL gibt Claude `web_fetch(url)` mit einem Extraktions-Script aus: `soup.find('h1', class_='version').text`
5. Nur der extrahierte String betritt den Kontext — nicht das ganze HTML

Ohne Dynamic Filtering würden alle 10 Suchergebnisse und volles HTML jeder fetched Seite den Context Window auf jedem Turn betreten.

### Wann zu verwenden

- Jede Anwendung, die Web Search oder Fetch zum Beantworten von Fragen nutzt
- Research Agents, die mehrere Quellen fetchen
- Monitoring Agents, die URLs für spezifische Daten pollen

### Wann nicht zu verwenden

- Wenn Sie den volles Dokument-Inhalt brauchen (Zusammenfassung, Ganz-Seite Analyse)
- Wenn das Filtering-Kriterium nicht bekannt ist, bis nach dem Anschauen des Inhalts

---

## Pattern 3: Deferred Tool Loading (Tool Search)

**Was es ist:** Tools sind versteckt vor Claudes Kontext bis erforderlich. Claude entdeckt verfügbare Tools durch Aufrufen eines Meta-Tools (`MCPSearch` oder Äquivalent), lädt dann und ruft das spezifische Tool auf, das es braucht.

**Token-Einsparungen:** ungefähr 85% für große Tool Kataloge. Ein 50-Tool Katalog addiert ungefähr 15.000–25.000 Tokens zu jeder Nachricht in der Konversation. Mit Deferred Loading sind nur 1–3 Tool Schemas pro Turn geladen.

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

Mit `ENABLE_TOOL_SEARCH=auto:3`, erhält Claude ein `tool_search` Meta-Tool. Wenn es eine Fähigkeit braucht, sucht es:

```json
{"type": "tool_use", "name": "tool_search", "input": {"query": "query database"}}
```

Das Harness gibt die Top 3 passenden Tool Schemas zurück. Claude ruft dann das Tool direkt auf.

### Wann zu verwenden

- 10 oder mehr Tools gleichzeitig geladen
- MCP Server mit breiten Katalogen, wo nur 2–3 Tools pro Query relevant sind
- Agents mit Domänen-spezifischen Tools, verwendet nur in spezifischen Situationen

### Wann nicht zu verwenden

- Tools, die auf fast jedem Turn verwendet werden (Dateisuche, Lesen) — die Such-Overhead übersteigt die Laden-Kosten
- Kleine Tool Kataloge (unter 10 Tools), wo die Token-Kosten managebar sind
- Latenz-empfindliche Anwendungen, wo der extra Tool-Search Round Trip unakzeptabel ist

---

## Pattern 4: Tool Use Examples

**Was es ist:** konkrete Nutzungsbeispiele, direkt zur Tool-Definition addiert, jenseits des JSON-Schemas. Das Schema beschreibt Struktur; Beispiele demonstrieren Absicht.

**Genaukeits-Verbesserung:** 72% → 90% auf komplexen Parameter-Kombinationen in internen Benchmarks. Die Lücke ist am größten für Tools mit verschachtelten Parametern, Enum-Kombinationen oder nicht-offensichtlichen Feld-Interaktionen.

### Format

Addieren Sie ein `input_examples` Array zur Tool-Definition:

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

### Wann zu verwenden

- Tools mit komplexen verschachtelten Parametern
- Tools mit mehreren Enum-Feldern, wo gültige Kombinationen nicht-offensichtlich sind
- Tools, wo die Beschreibung allein nicht genug ist, um korrekte Nutzung zu verstehen
- Alle Tools, die in Tests falsch aufgerufen wurden

### Wann nicht zu verwenden

- Einfache Tools mit flachen, selbst-dokumentierenden Parametern
- Tools, wo das Addieren von Beispielen Context ohne Genaukeits-Verbesserung aufblähen würde (Prüfung: verwendet das Modell bereits dieses Tool korrekt?)

---

## Kombination aller vier Patterns

Für maximale Token-Effizienz in einer Produktions-Agentic-Anwendung:

```python
import anthropic
import os

os.environ["ENABLE_TOOL_SEARCH"] = "auto:3"

client = anthropic.Anthropic()

# Tool Katalog — alle Deferred außer dem Meta-Tool
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

Diese Konfiguration wendet an:
- **PTC**: `query_database` kann in Batch vom Code Executor aufgerufen werden
- **Dynamic Filtering**: Web Tools filtern, bevor Ergebnisse in den Kontext betreten
- **Deferred Loading**: `query_database` lädt nur, wenn gesucht wird
- **Input Examples**: korrekte Parameter-Nutzung wird in der Tool-Definition demonstriert

Kombinierte Einsparungen bei einem 10-Query Analytischen Workflow: ungefähr 60% weniger Tokens vs. Vanilla Tool Use mit dem gleichen Katalog.

---

## Entscheidungstabelle

| Problem | Pattern |
|---------|---------|
| Gleches Tool 3+ Mal in einem Workflow aufgerufen | PTC (Pattern 1) |
| Web-Inhalt bläht das Context Window auf | Dynamic Filtering (Pattern 2) |
| Tool Katalog > 10 Tools; die meisten sind selten erforderlich | Deferred Loading (Pattern 3) |
| Tool aufgerufen falsch; komplexe verschachtelte Params | Input Examples (Pattern 4) |
| Retrieval-Genaukeit ist niedrig | Dynamic Filtering (Pattern 2) + Input Examples (Pattern 4) |
| Großer Katalog UND komplexe Tools | Deferred Loading (3) + Input Examples (4) |
| Hohe Token-Kosten bei jedem Turn | Alle vier kombiniert |

---
