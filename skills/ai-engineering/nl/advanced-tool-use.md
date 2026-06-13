# Advanced Tool Use

## Wanneer activeren
Gebruiker wil tool use patronen optimaliseren in Claude API applicaties, tokens van tool definities of call overhead reduceren, nauwkeurigheid verbeteren op complexe tool parameters, of geavanceerde tool-calling workflows bouwen.

## Wanneer NIET gebruiken
- Eenvoudige single-tool workflows waar overhead optimalisatie irrelevant is
- Applicaties met standard Messages API en minder dan 5 tools zonder herhaalde calls
- Debugging van gebroken tool definitie — zet eerst correctheid, daarna optimalisatie

## Instructies

### Pattern 1: Programmatic Tool Calling (PTC)
Claude schrijft Python orchestration code in plaats van tools één-voor-één aan te roepen. Reduceert round trips en tokens.

**Token reductie: ~37% voor multi-tool workflows.**

Inschakelen per tool:
```python
{
    "name": "read_file",
    "description": "Read a file",
    "input_schema": {"type": "object", "properties": {"path": {"type": "string"}}, "required": ["path"]},
    "allowed_callers": ["code_execution_20250825"],
}
```

Wanneer ingeschakeld, kan Claude ervoor kiezen Python loop te schrijven die deze tool N keer aanroept in plaats van N aparte tool_use blokken. Gebruik voor: repetitieve read/lookup patronen, data transformation pipelines, elke tool aangeroepen >3 keer per turn.

Niet inschakelen voor tools met side effects (write, delete, deploy) of tools die per-call autorisatie vereisen.

---

### Pattern 2: Dynamic Filtering for Web Tools
Nieuwe built-in tool types voor web search en fetch die resultaten filteren voordat ze context binnenkomen.

**Beta header vereist:** `anthropic-beta: code-execution-web-tools-2026-02-09`

**Token reductie: ~24% minder input tokens. Nauwkeurigheid verbetering: +13–16 percentage punten.**

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

Met deze tool types schrijft Claude filter code die alleen relevante data uit search resultaten of fetched pages extraheert voordat de content context window binnengaat. Een volledige web pagina van 50.000 tokens wordt een 200-token extract.

---

### Pattern 3: Tool Search / Deferred Loading
Voor grote tool catalogi, deferreer zelden gebruikte tools zodat ze niet in context geladen worden tenzij nodig.

**Token reductie: ~85% voor catalogi met veel tools.**

Inschakelen via environment variable:
```
ENABLE_TOOL_SEARCH=auto:N
```
Waarbij N de drempel is — tools voorbij top N meest relevant zijn uitgesteld.

Markeer individuele tools als deferrable:
```python
{
    "name": "advanced_analytics",
    "description": "Run complex analytics queries",
    "input_schema": {...},
    "defer_loading": True,  # Only load when Claude needs this tool
}
```

Uitgestelde tools worden on-demand door Claude ontdekt via MCPSearch wanneer het bepaalt dat het een capability nodig heeft niet in huidige geladen context. Gebruik voor: grote MCP tool catalogi, enterprise APIs met honderden endpoints, plugin systems waarbij meeste tools zelden gebruikt zijn.

Defer niet tools die in bijna elke conversatie aangeroepen zijn — de discovery overhead elimineert de savings.

---

### Pattern 4: Tool Use Examples (`input_examples`)
Voeg concrete call voorbeelden toe aan tool definities voorbij JSON schema.

**Nauwkeurigheid verbetering: ~72% → ~90% op complexe parameters.**

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

`input_examples` is meest waardevol voor:
- Tools met niet-voor-de-hand-liggende parameter combinaties
- Complexe geneste schemas
- Parameters waar format meer telt dan type (SQL strings, regex, JSON paths)
- Tools waar Claude consistent dezelfde parameter fout maakt zonder voorbeelden

---

### Combining Patterns

Maximale efficiency stack voor grote tool catalog:

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

Gebruik web tool types wanneer web search/fetch in scope is:
```python
tools += [
    {"type": "web_search_20260209", "name": "web_search"},
    {"type": "web_fetch_20260209", "name": "web_fetch"},
]
```

## Voorbeeld

Een agent met 120 tools (volledige API surface van SaaS platform):

Zonder optimalisatie: 120 tool definities × ~150 tokens elk = ~18.000 tokens per call, alleen voor tool definities. Meeste tools worden nooit aangeroepen.

Met deferred loading (`ENABLE_TOOL_SEARCH=auto:10`): alleen top 10 meest waarschijnlijke tools geladen. Token cost voor tool definities daalt van 18.000 naar ~1.500 — 85% reductie. Wanneer Claude zelden gebruikte tool nodig heeft, het zoekt en laadt on demand, voegend ~200 tokens toe voor die turn alleen.

Toevoegen van `input_examples` aan 10 altijd geladen tools verhoogt parameter nauwkeurigheid van 72% naar 90% op tools die het meeste uitmaken.

---
