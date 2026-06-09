---
description: Einen vollständig integrierten MCP-Server erstellen, der Tools, Ressourcen oder Prompts für eine bestimmte Domäne bereitstellt
argument-hint: "[domain or service to expose, e.g. 'GitHub issues' or 'Postgres query']"
---
Einen produktionsreifen MCP (Model Context Protocol) Server für folgende Domäne erstellen: $ARGUMENTS

**Schritt 1 — Funktiondesign**

Aus der in $ARGUMENTS angegebenen Domäne werden die Funktionen aufgezählt, die der Server über die einzelnen MCP-Grundelemente bereitstellen sollte:

- **Tools** — Aktionen, die das Modell aufrufen kann (erstellen, aktualisieren, löschen, abfragen). Listet Name, Beschreibung, Eingabeschema (JSON Schema) und Rückgabeform auf.
- **Ressourcen** — Daten, die das Modell lesen kann (Auflistung + URI-Muster lesen). Listet URI-Vorlage und Inhaltstyp auf.
- **Prompts** — wiederverwendbare Prompt-Vorlagen, die der Host anzeigen kann. Listet Name, Argumente und Prompt-Text auf.

Geben Sie nur an, was für die Domäne angemessen ist — nicht alle drei Grundelemente sind immer erforderlich.

**Schritt 2 — Server generieren**

Schreiben Sie einen vollständigen Python MCP Server mit dem `mcp` Paket (`pip install mcp`). Anforderungen:

- Verwenden Sie `mcp.server.Server` und `stdio_server()` Transport
- Registrieren Sie alle in Schritt 1 identifizierten Tools, Ressourcen und Prompts
- Jeder Tool-Handler muss:
  - Eingaben mit Pydantic-Modellen validieren
  - `[TextContent(...)]` oder `[ImageContent(...)]` als angemessen zurückgeben
  - `McpError` mit einem geeigneten `ErrorCode` bei Fehlern werfen (keine Fehlerzeichenketten in Inhalten zurückgeben)
- Ein `__main__` Block einschließen: `asyncio.run(main())`
- `httpx.AsyncClient` oder das entsprechende SDK für ausgehende API-Aufrufe verwenden — kein `requests`
- Secrets nur über Umgebungsvariablen — niemals hartcodiert

**Schritt 3 — settings.json Registrierungsausschnitt**

Zeigen Sie den genauen JSON-Block an, der in `.claude/settings.json` (oder `~/.claude/settings.json`) eingefügt werden soll, um den Server zu registrieren:

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

Schreiben Sie eine `test_server.py` mit `mcp.client.session.ClientSession` und `stdio_client`, die:
- Mit dem Server über einen Unterprozess verbunden ist
- Tools, Ressourcen und Prompts auflistet
- Jeden Tool mit einer minimalen gültigen Eingabe aufruft und eine Nicht-Fehler-Antwort assertiert
- Wird mit `pytest -xvs test_server.py` ausgeführt

**Ausgabe:** `server.py`, `settings.json` Ausschnitt, `test_server.py`. Keine `# TODO` Stubs. Keine Platzhalter-Logik.
