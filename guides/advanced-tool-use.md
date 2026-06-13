# Advanced Tool Use in Claude API

Four patterns that reduce token costs and improve accuracy for tool-heavy Claude API applications. Each pattern solves a specific problem; the decision table at the end maps the problem to the pattern.

---

## Pattern 1: Programmatic Tool Calling (PTC)

**What it is:** instead of Claude calling tools one at a time in a loop, Claude writes orchestration code that calls multiple tools in a single inference pass.

When you need to read 20 files and extract a value from each, the standard approach calls the `read_file` tool 20 times — 20 round trips, 20 tool result messages, 20 additions to context. With PTC, Claude writes a Python script that calls `read_file` in a loop; the code executor runs it; you get one result.

**Token savings:** approximately 37% for multi-tool workflows. For a 3-tool sequence without PTC, you pay for the tool call message, tool result, and re-reading accumulated context on each round trip. PTC collapses this into one inference pass.

### Setup

Add `allowed_callers` to the tool definition to permit the code execution tool to invoke it:

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

### Before PTC (20 round trips)

```python
# Without PTC — Claude calls read_file 20 times
response = client.messages.create(
    model="claude-sonnet-4-6",
    tools=tools,
    messages=[{"role": "user", "content": "Extract the version from each of these 20 package.json files: [list]"}]
)
# Claude makes 20 sequential tool calls. 20 API round trips.
```

### After PTC (1 inference pass)

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

### When to use

- Repetitive tool patterns: read N files, extract X from each, transform Y
- Any workflow where the same tool is called more than 3 times with different inputs
- Batch data processing where the logic is straightforward

### When not to use

- Tools with side effects (write, delete, send) — code execution of side-effect tools is unpredictable
- Tools that depend on the output of a previous tool call when the dependency is not known upfront
- Interactive workflows where human review is required between steps

---

## Pattern 2: Dynamic Filtering for Web Tools

**What it is:** before web search or fetch results enter the context window, Claude writes filtering code that extracts only the relevant content. Raw web pages can be 50,000–200,000 tokens; filtered results are typically 1,000–5,000 tokens.

**Token savings:** approximately 24% fewer input tokens on typical retrieval tasks. Accuracy on retrieval-augmented tasks improves 13–16 percentage points because the model answers from a clean, relevant excerpt rather than scanning a noisy full document.

### Setup

Use the new tool types with the required beta header:

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

### How filtering works

With the beta header active, Claude is permitted to write filtering code before web content enters the message context. For a search for "Stripe API version":

1. Claude issues `web_search("Stripe API version changelog")`
2. Before results enter context, Claude writes: `[r for r in results if 'api-version' in r['url']]`
3. Only matching results (3 of 10) enter context
4. For each matching URL, Claude issues `web_fetch(url)` with an extraction script: `soup.find('h1', class_='version').text`
5. Only the extracted string enters context — not the full HTML

Without dynamic filtering, all 10 search results and full HTML of every fetched page would enter the context window on every turn.

### When to use

- Any application that uses web search or fetch to answer questions
- Research agents that fetch multiple sources
- Monitoring agents that poll URLs for specific data

### When not to use

- When you need the full document content (summarisation, full-page analysis)
- When the filtering criterion is not known until after seeing the content

---

## Pattern 3: Deferred Tool Loading (Tool Search)

**What it is:** tools are hidden from Claude's context until needed. Claude discovers available tools by calling a meta-tool (`MCPSearch` or equivalent), then loads and calls the specific tool it needs.

**Token savings:** approximately 85% for large tool catalogs. A 50-tool catalog adds roughly 15,000–25,000 tokens to every message in the conversation. With deferred loading, only 1–3 tool schemas are loaded per turn.

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

With `ENABLE_TOOL_SEARCH=auto:3`, Claude receives a `tool_search` meta-tool. When it needs a capability, it searches:

```json
{"type": "tool_use", "name": "tool_search", "input": {"query": "query database"}}
```

The harness returns the top 3 matching tool schemas. Claude then calls the tool directly.

### When to use

- 10 or more tools loaded simultaneously
- MCP servers with broad catalogs where only 2–3 tools are relevant per query
- Agents with domain-specific tools used only in specific situations

### When not to use

- Tools that are used on nearly every turn (file search, read) — the search overhead exceeds the loading cost
- Small tool catalogs (under 10 tools) where the token cost is manageable
- Latency-sensitive applications where the extra tool-search round trip is unacceptable

---

## Pattern 4: Tool Use Examples

**What it is:** concrete usage examples added directly to the tool definition, beyond the JSON schema. The schema describes structure; examples demonstrate intent.

**Accuracy improvement:** 72% → 90% on complex parameter combinations in internal benchmarks. The gap is largest for tools with nested parameters, enum combinations, or non-obvious field interactions.

### Format

Add an `input_examples` array to the tool definition:

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

### When to use

- Tools with complex nested parameters
- Tools with multiple enum fields where valid combinations are non-obvious
- Tools where the description alone is not enough to understand correct usage
- Any tool that has been called incorrectly in testing

### When not to use

- Simple tools with flat, self-documenting parameters
- Tools where adding examples would bloat context without improving accuracy (check: does the model already use this tool correctly?)

---

## Combining All Four Patterns

For maximum token efficiency in a production agentic application:

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

This configuration applies:
- **PTC**: `query_database` can be called in batch by the code executor
- **Dynamic filtering**: web tools filter before results enter context
- **Deferred loading**: `query_database` only loads when searched for
- **Input examples**: correct parameter usage is demonstrated in the tool definition

Combined savings on a 10-query analytical workflow: approximately 60% fewer tokens vs. vanilla tool use with the same catalog.

---

## Decision Table

| Problem | Pattern |
|---------|---------|
| Same tool called 3+ times in a workflow | PTC (Pattern 1) |
| Web content bloating the context window | Dynamic Filtering (Pattern 2) |
| Tool catalog > 10 tools; most are rarely needed | Deferred Loading (Pattern 3) |
| Tool called incorrectly; complex nested params | Input Examples (Pattern 4) |
| Retrieval accuracy is low | Dynamic Filtering (Pattern 2) + Input Examples (Pattern 4) |
| Large catalog AND complex tools | Deferred Loading (3) + Input Examples (4) |
| High token cost on every turn | All four combined |

---
