# Advanced Tool Use

## Wann aktivieren
Der Nutzer möchte Tool-Use-Muster in Claude-API-Anwendungen optimieren, Tokens aus Tool-Definitionen oder Call-Overhead reduzieren, die Genauigkeit bei komplexen Tool-Parametern verbessern oder ausgefeilte Tool-Calling-Workflows aufbauen.

## Wann NICHT verwenden
- Einfache Single-Tool-Workflows, bei denen Overhead-Optimierung irrelevant ist
- Anwendungen mit der Standard-Messages-API mit weniger als 5 Tools und keine wiederholten Calls
- Debugging einer defekten Tool-Definition — erst Korrektheit beheben, dann optimieren

## Anweisungen

### Pattern 1: Programmatic Tool Calling (PTC)
Claude schreibt Python-Orchestrierungscode statt Tools einzeln aufzurufen. Reduziert Round Trips und Tokens.

**Token-Reduktion: ~37% bei Multi-Tool-Workflows.**

Aktivieren pro Tool:
```python
{
    "name": "read_file",
    "description": "Read a file",
    "input_schema": {"type": "object", "properties": {"path": {"type": "string"}}, "required": ["path"]},
    "allowed_callers": ["code_execution_20250825"],
}
```

Wenn aktiviert, kann Claude wählen, Python-Code zu schreiben, der dieses Tool N Mal aufruft, statt N separate tool_use Blöcke zu erstellen. Nutzen für: wiederholte Read/Lookup-Muster, Datentransformations-Pipelines, jedes Tool, das >3 Mal pro Turn aufgerufen wird.

Nicht aktivieren für Tools mit Nebenwirkungen (write, delete, deploy) oder Tools, die Pro-Call-Autorisierung erfordern.

---

### Pattern 2: Dynamic Filtering für Web Tools
Neue eingebaute Tool-Typen für Web-Suche und Abruf, die Ergebnisse filtern, bevor sie in den Kontext gelangen.

**Beta-Header erforderlich:** `anthropic-beta: code-execution-web-tools-2026-02-09`

**Token-Reduktion: ~24% weniger Input-Tokens. Genauigkeitsverbesserung: +13–16 Prozentpunkte.**

```python
import anthropic

client = anthropic.Anthropic(default_headers={"anthropic-beta": "code-execution-web-tools-2026-02-09"})

response = client.messages.create(
    model="claude-opus-4-5",
    max_tokens=2048,
    tools=[
        {"type": "web_search_20260209", "name": "web_search"},
        {"type": "web_fetch_20260209", "name": "web_fetch"},
    ],
    messages=[{"role": "user", "content": "What is the current price of NVDA stock?"}],
)
```

Mit diesen Tool-Typen schreibt Claude Filterungscode, der nur die relevanten Daten aus Suchergebnissen oder abgerufenen Seiten extrahiert, bevor der Inhalt das Kontextfenster betritt. Eine vollständige Web-Seite mit 50.000 Tokens wird zu einer 200-Token-Extraktion.

---

### Pattern 3: Tool Search / Deferred Loading
Für große Tool-Kataloge, verschieben Sie selten verwendete Tools, damit sie nicht in den Kontext geladen werden, es sei denn, sie werden benötigt.

**Token-Reduktion: ~85% bei Katalogen mit vielen Tools.**

Aktivieren über Umgebungsvariable:
```
ENABLE_TOOL_SEARCH=auto:N
```
Wobei N der Schwellwert ist — Tools über den Top-N-Most-Relevant-Tools werden verschoben.

Markieren Sie einzelne Tools als aufschiebbar:
```python
{
    "name": "advanced_analytics",
    "description": "Run complex analytics queries",
    "input_schema": {...},
    "defer_loading": True,  # Only load when Claude needs this tool
}
```

Verschobene Tools werden von Claude bei Bedarf über MCPSearch erkannt, wenn es feststellt, dass es eine Fähigkeit benötigt, die nicht im aktuell geladenen Kontext vorhanden ist. Nutzen für: große MCP-Tool-Kataloge, Enterprise-APIs mit Hunderten von Endpoints, Plugin-Systeme, bei denen die meisten Tools selten verwendet werden.

Verschieben Sie nicht Tools, die in fast jedem Gespräch aufgerufen werden — der Discovery-Overhead eliminiert die Einsparungen.

---

### Pattern 4: Tool-Use-Beispiele (`input_examples`)
Fügen Sie konkrete Call-Beispiele zu Tool-Definitionen über das JSON-Schema hinaus hinzu.

**Genauigkeitsverbesserung: ~72% → ~90% bei komplexen Parametern.**

```python
{
    "name": "query_database",
    "description": "Run a SQL query against the analytics database",
    "input_schema": {
        "type": "object",
        "properties": {
            "query": {"type": "string", "description": "SQL query to execute"},
            "timeout_seconds": {"type": "integer", "description": "Max execution time"},
            "read_only": {"type": "boolean", "description": "Enforce read-only mode"},
        },
        "required": ["query"],
    },
    "input_examples": [
        {
            "query": "SELECT user_id, count(*) as orders FROM orders WHERE created_at > NOW() - INTERVAL '7 days' GROUP BY user_id ORDER BY orders DESC LIMIT 10",
            "timeout_seconds": 30,
            "read_only": True,
        },
        {
            "query": "SELECT AVG(order_value) FROM orders WHERE status = 'completed'",
            "read_only": True,
        },
    ],
}
```

`input_examples` ist am wertvollsten für:
- Tools mit nicht offensichtlichen Parameterkombinationen
- Komplexe verschachtelte Schemas
- Parameter, bei denen das Format wichtiger ist als der Typ (SQL-Strings, Regex, JSON-Pfade)
- Tools, bei denen Claude konsistent denselben Parameter-Fehler ohne Beispiele macht

---

### Combining Patterns

Maximaler Effizienz-Stack für einen großen Tool-Katalog:

```python
tools = [
    # Frequently used tools — loaded always, PTC enabled, with examples
    {
        "name": "read_file",
        "allowed_callers": ["code_execution_20250825"],
        "input_examples": [{"path": "/src/api/users.ts"}],
        ...
    },
    # Infrequently used tools — deferred
    {
        "name": "run_migration",
        "defer_loading": True,
        ...
    },
    # Last frequent tool — cache everything up to here
    {
        "name": "list_files",
        "cache_control": {"type": "ephemeral"},
        ...
    },
]
```

Nutzen Sie Web-Tool-Typen, wenn Web-Suche/Abruf in Reichweite ist:
```python
tools += [
    {"type": "web_search_20260209", "name": "web_search"},
    {"type": "web_fetch_20260209", "name": "web_fetch"},
]
```

## Beispiel

Ein Agent mit 120 Tools (vollständige API-Oberfläche einer SaaS-Plattform):

Ohne Optimierung: 120 Tool-Definitionen × ~150 Tokens jeweils = ~18.000 Tokens pro Call, nur für Tool-Definitionen. Die meisten Tools werden nie aufgerufen.

Mit Deferred Loading (`ENABLE_TOOL_SEARCH=auto:10`): Nur die 10 wahrscheinlichsten Tools werden geladen. Token-Kosten für Tool-Definitionen sinken von 18.000 auf ~1.500 — 85% Reduktion. Wenn Claude ein selten verwendetes Tool benötigt, sucht und lädt es es bei Bedarf, was ~200 Tokens nur für diesen Turn hinzufügt.

Das Hinzufügen von `input_examples` zu den 10 Always-Loaded-Tools erhöht die Parameter-Genauigkeit von 72% auf 90% bei den Tools, die am meisten Sinn machen.

---
