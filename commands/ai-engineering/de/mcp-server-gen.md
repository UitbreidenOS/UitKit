---
description: Generiere einen vollständig konfigurierten MCP-Server, der Tools, Ressourcen oder Prompts für eine bestimmte Domäne verfügbar macht
argument-hint: "[Domäne oder Service zum Exposieren, z.B. 'GitHub Issues' oder 'Postgres-Abfrage']"
---
Generiere einen produktionsreifen MCP (Model Context Protocol) Server für: $ARGUMENTS

**Schritt 1 — Funktionalitätsdesign**

Aus der Domäne in $ARGUMENTS aufzählen, was der Server über jedes MCP-Primitiv verfügbar machen soll:

- **Tools** — Aktionen, die das Modell aufrufen kann (erstellen, aktualisieren, löschen, abfragen). Name, Beschreibung, Input-Schema (JSON Schema) und Rückgabeform auflisten.
- **Ressourcen** — Daten, die das Modell lesen kann (List- und Read-URI-Muster). URI-Template und Content-Type auflisten.
- **Prompts** — wiederverwendbare Prompt-Templates, die der Host verfügbar machen kann. Name, Argumente und Prompt-Text auflisten.

Nur das für die Domäne Angemessene angeben — nicht alle drei Primitive sind immer notwendig.

**Schritt 2 — Server generieren**

Schreibe einen vollständigen Python-MCP-Server mit dem `mcp`-Paket (`pip install mcp`). Anforderungen:

- Verwende `mcp.server.Server` und `stdio_server()`-Transport
- Registriere alle in Schritt 1 identifizierten Tools, Ressourcen und Prompts
- Jeder Tool-Handler muss:
  - Input mit Pydantic-Modellen validieren
  - `[TextContent(...)]` oder `[ImageContent(...)]` zurückgeben, je nachdem was passt
  - `McpError` mit einem angemessenen `ErrorCode` bei Fehlern werfen (keine Error-Strings in Content zurückgeben)
- Einen `__main__`-Block enthalten: `asyncio.run(main())`
- `httpx.AsyncClient` oder das relevante SDK für ausgehende API-Aufrufe verwenden — kein `requests`
- Secrets nur über Umgebungsvariablen — niemals hardcodiert

**Schritt 3 — settings.json Registrierungs-Snippet**

Zeige den genauen JSON-Block zum Einfügen in `.claude/settings.json` (oder `~/.claude/settings.json`) zur Registrierung des Servers:

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

**Schritt 4 — Smoke Test**

Schreibe einen `test_server.py` mit `mcp.client.session.ClientSession` und `stdio_client`, der:
- Sich mit dem Server über Subprocess verbindet
- Tools, Ressourcen und Prompts auflistet
- Jeden Tool mit minimalem gültigem Input aufruft und eine nicht-Error-Antwort überprüft
- Mit `pytest -xvs test_server.py` ausgeführt wird

**Output:** `server.py`, `settings.json` Snippet, `test_server.py`. Keine `# TODO` Stubs. Keine Platzhalter-Logik.
