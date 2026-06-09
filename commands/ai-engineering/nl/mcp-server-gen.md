---
description: Genereer een volledig ingestelde MCP-server die tools, resources of prompts beschikbaar maakt voor een bepaald domein
argument-hint: "[domain or service to expose, e.g. 'GitHub issues' or 'Postgres query']"
---
Genereer een production-ready MCP (Model Context Protocol) server voor: $ARGUMENTS

**Stap 1 — Capaciteitsontwerp**

Zet op basis van het domein in $ARGUMENTS uit wat de server moet beschikbaar stellen in elke MCP-primitive:

- **Tools** — acties die het model kan uitvoeren (create, update, delete, query). Vermeld naam, beschrijving, invoerschema (JSON Schema) en retourformaat.
- **Resources** — gegevens die het model kan lezen (lijst + lees URI-patronen). Vermeld URI-template en inhoudstype.
- **Prompts** — herbruikbare promptsjablonen die de host kan aanbieden. Vermeld naam, argumenten en prompttekst.

Vermeld alleen wat geschikt is voor het domein — niet alle drie primitives zijn altijd nodig.

**Stap 2 — Genereer de server**

Schrijf een complete Python MCP-server met het `mcp`-pakket (`pip install mcp`). Vereisten:

- Gebruik `mcp.server.Server` en `stdio_server()` transport
- Registreer elke tool, resource en prompt die in Stap 1 is geïdentificeerd
- Elke tool-handler moet:
  - Invoer valideren met Pydantic-modellen
  - Retourneer `[TextContent(...)]` of `[ImageContent(...)]` naar gelang van toepassing
  - Raise `McpError` met een passende `ErrorCode` bij fout (retourneer geen foutstrings in content)
- Voeg een `__main__`-blok in: `asyncio.run(main())`
- Gebruik `httpx.AsyncClient` of de relevante SDK voor uitgaande API-aanroepen — geen `requests`
- Secrets via omgevingsvariabelen alleen — nooit hardcoded

**Stap 3 — settings.json-registratiesnippet**

Toon het exacte JSON-blok dat in `.claude/settings.json` (of `~/.claude/settings.json`) moet worden geplakt om de server te registreren:

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

**Stap 4 — Smoke test**

Schrijf een `test_server.py` met `mcp.client.session.ClientSession` en `stdio_client` die:
- Verbinding maakt met de server via subprocess
- Tools, resources en prompts opsomst
- Elke tool aanroept met minimaal geldige invoer en stelt een antwoord zonder fouten vast
- Draait met `pytest -xvs test_server.py`

**Output:** `server.py`, `settings.json`-snippet, `test_server.py`. Geen `# TODO`-stubs. Geen placeholder-logica.
