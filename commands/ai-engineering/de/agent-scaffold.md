---
description: Gerüst für einen Multi-Step Claude-Agenten mit Tool-Nutzung, Speicher und definierter Stoppbedingung erstellen
argument-hint: "[agent goal or task description]"
---
Gerüst für einen produktiven Claude-Agenten erstellen, der folgende Aufgabe erfüllt: $ARGUMENTS

**Schritt 1 — Agent-Design-Spezifikation**

Bevor Sie Code schreiben, definieren Sie:

- **Ziel** — die Terminal-Erfolgsbedingung (kein Prozess, sondern ein Zustand)
- **Eingaben** — was der Agent beim Start erhält (Strings, Dateipfade, strukturierte Daten)
- **Ausgaben** — was er nach Abschluss produziert (geschriebene Dateien, API-Aufrufe, zurückgegebenes strukturiertes Ergebnis)
- **Benötigte Tools** — zählen Sie jedes Tool auf: Name, Zweck, Input-Schema, Rückgabeform
- **Speichermodell** — wählen Sie eines:
  - Zustandslos (nur Kontextfenster, geeignet für <20 Tool-Aufrufe)
  - Zusammenfassungs-Speicher (komprimieren Sie die Historie mit Haiku nach jedem N Schritten)
  - Externer Speicher (schreiben Sie wichtige Fakten in eine Scratchpad-Datei oder einen Key-Value-Store)
- **Stoppbedingungen** — was löst aus, dass der Agent die endgültige Ausgabe zurückgibt oder weiterhin in Schleife läuft:
  - Erfolg: Zielzustand erreicht
  - Fehler: Fehlerzähler überschritten, widersprüchlicher Zustand erkannt
  - Obergrenze: max_iterations erreicht (immer einschließen)

**Schritt 2 — Agent generieren**

Schreiben Sie `agent.py` mit dem Anthropic Python SDK. Anforderungen:

- Modell: `claude-sonnet-4-6` (konfigurierbar über Umgebungsvariable `AGENT_MODEL`)
- Implementieren Sie die Agent-Schleife:
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
- Definieren Sie jedes Tool als ein Dictionary mit `name`, `description`, `input_schema` (JSON Schema)
- Tool-Dispatch: eine `dispatch(tool_name, tool_input)`-Funktion, die zu Python-Callables weiterleitet
- Verwenden Sie `cache_control: {"type": "ephemeral"}` auf der System-Prompt-Nachricht
- Strukturierte endgültige Ausgabe: Agent gibt eine typisierte Dataclass zurück, nicht rohen Text
- Protokollieren Sie jede Iteration: aufgerufenes Tool, Input-Zusammenfassung, Ergebnis-Zusammenfassung (nicht vollständiger Inhalt)

**Schritt 3 — Fehlerbehandlung**

- Umwickeln Sie jeden Tool-Aufruf mit try/except; geben Sie `{"error": str(e)}` als Tool-Ergebnis zurück — lösen Sie niemals Fehler in die Schleife aus
- Bei Überschreitung von `max_iterations`: geben Sie Teilergebnisse mit einer `status: "incomplete"`-Flagge zurück
- Bei API-Fehlern (`anthropic.APIStatusError`): wiederholen Sie bis zu 3 Mal mit exponentiellem Backoff

**Schritt 4 — CLI-Einstiegspunkt**

Exponieren Sie über `argparse`:
- `--goal` (oder positional): überschreiben Sie das hardcodierte Ziel
- `--max-iterations`: Standard 25
- `--dry-run`: drucken Sie den Plan (System-Prompt + Tools) ohne Ausführung

**Ausgabe:** `agent.py` mit allen implementierten Tools, keine Stubs. Schließen Sie ein Verwendungsbeispiel in einem Kommentarblock am Anfang der Datei ein.
