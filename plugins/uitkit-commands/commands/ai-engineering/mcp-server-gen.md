---
description: Generate a fully wired MCP server exposing tools, resources, or prompts for a given domain
argument-hint: "[domain or service to expose, e.g. 'GitHub issues' or 'Postgres query']"
---
Generate a production-ready MCP (Model Context Protocol) server for: $ARGUMENTS

**Step 1 — Capability design**

From the domain in $ARGUMENTS, enumerate what the server should expose across each MCP primitive:

- **Tools** — actions the model can invoke (create, update, delete, query). List name, description, input schema (JSON Schema), and return shape.
- **Resources** — data the model can read (list + read URI patterns). List URI template and content type.
- **Prompts** — reusable prompt templates the host can surface. List name, arguments, and prompt text.

State only what is appropriate for the domain — not all three primitives are always needed.

**Step 2 — Generate the server**

Write a complete Python MCP server using the `mcp` package (`pip install mcp`). Requirements:

- Use `mcp.server.Server` and `stdio_server()` transport
- Register every tool, resource, and prompt identified in Step 1
- Each tool handler must:
  - Validate input with Pydantic models
  - Return `[TextContent(...)]` or `[ImageContent(...)]` as appropriate
  - Raise `McpError` with an appropriate `ErrorCode` on failure (do not return error strings in content)
- Include a `__main__` block: `asyncio.run(main())`
- Use `httpx.AsyncClient` or the relevant SDK for outbound API calls — no `requests`
- Secrets via environment variables only — never hardcoded

**Step 3 — settings.json registration snippet**

Show the exact JSON block to paste into `.claude/settings.json` (or `~/.claude/settings.json`) to register the server:

```json
{
  "mcpServers": {
    "<server-name>": {
      "command": "python",
      "args": ["path/to/server.py"],
      "env": {
        "API_KEY": "${API_KEY}"
      }
    }
  }
}
```

**Step 4 — Smoke test**

Write a `test_server.py` using `mcp.client.session.ClientSession` and `stdio_client` that:
- Connects to the server via subprocess
- Lists tools, resources, and prompts
- Calls each tool with a minimal valid input and asserts a non-error response
- Runs with `pytest -xvs test_server.py`

**Output:** `server.py`, `settings.json` snippet, `test_server.py`. No `# TODO` stubs. No placeholder logic.
