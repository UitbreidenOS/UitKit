---
description: Einen mehrstufigen Claude-Agent mit Tool-Use, Memory und einer definierten Stoppbedingung aufbauen
argument-hint: "[Agent-Ziel oder Aufgabenbeschreibung]"
---
Baue einen produktiven Claude-Agent auf, der folgendes erreicht: $ARGUMENTS

**Schritt 1 — Agent-Design-Spezifikation**

Bevor du Code schreibst, definiere:

- **Ziel** — die Erfolgsbedingung (kein Prozess, sondern ein Zustand)
- **Eingaben** — was der Agent bei Start erhält (Strings, Dateipfade, strukturierte Daten)
- **Ausgaben** — was er bei Fertigstellung produziert (geschriebene Dateien, API-Aufrufe, zurückgegebene strukturierte Ergebnisse)
- **Benötigte Tools** — enummeriere jedes Tool: Name, Zweck, Input-Schema, Rückgabeschema
- **Memory-Modell** — wähle eines:
  - Stateless (nur Kontextfenster, geeignet für <20 Tool-Aufrufe)
  - Summary Memory (Verlauf mit Haiku nach jedem N-ten Schritt komprimieren)
  - Externes Memory (wichtige Fakten in eine Scratchpad-Datei oder Key-Value-Store schreiben)
- **Stoppbedingungen** — was bewirkt, dass der Agent die Endausgabe zurückgibt statt weiterzumachen:
  - Erfolg: Zielzustand erreicht
  - Fehler: Fehlerzähler überschritten, widersprüchlicher Zustand erkannt
  - Obergrenze: max_iterations erreicht (immer einbeziehen)

**Schritt 2 — Agent generieren**

Schreibe `agent.py` mit dem Anthropic Python SDK. Anforderungen:

- Modell: `claude-sonnet-4-6` (konfigurierbar via `AGENT_MODEL` Umgebungsvariable)
- Implementiere die Agentic Loop:
  ```
  while not done and iterations < max_iterations:
      response = client.messages.create(tools=tools, messages=history)
      if response.stop_reason == "tool_use":
          results = execute_tools(response)
          history.append(assistant_turn)
          history.append(tool_results_turn)
      elif response.stop_reason == "end_turn":
          done = True
  ```
- Definiere jedes Tool als Dictionary mit `name`, `description`, `input_schema` (JSON Schema)
- Tool-Dispatch: eine `dispatch(tool_name, tool_input)` Funktion, die an Python-Callables weitergeleitet wird
- Nutze `cache_control: {"type": "ephemeral"}` auf der System-Prompt-Nachricht
- Strukturierte Endausgabe: Agent gibt einen typisierten Dataclass zurück, nicht reinen Text
- Protokolliere jede Iteration: aufgerufenes Tool, Input-Zusammenfassung, Ergebnis-Zusammenfassung (nicht vollständiger Inhalt)

**Schritt 3 — Fehlerbehandlung**

- Umhülle jeden Tool-Aufruf mit try/except; gib `{"error": str(e)}` als Tool-Ergebnis zurück — werfe niemals in die Loop
- Wenn `max_iterations` überschritten: gib Teilergebnisse mit `status: "incomplete"` Flag zurück
- Bei API-Fehlern (`anthropic.APIStatusError`): wiederhole bis zu 3 Mal mit exponentieller Backoff-Strategie

**Schritt 4 — CLI-Einstiegspunkt**

Exponiere via `argparse`:
- `--goal` (oder Position): überschreibe das hardcodierte Ziel
- `--max-iterations`: Standard 25
- `--dry-run`: gib den Plan aus (System-Prompt + Tools) ohne Ausführung

**Ausgabe:** `agent.py` mit allen implementierten Tools, keine Stubs. Füge ein Verwendungsbeispiel in einem Kommentarblock am Anfang der Datei ein.
