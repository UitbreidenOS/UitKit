# Auto Mode and Autonomous Operation

Auto Mode ermöglicht Claude die Bedienung mit minimalen Unterbrechungen — es genehmigt automatisch sichere, nicht-destruktive Operationen und pausiert nur bei menschlicher Eingabe für Aktionen, die irreversibel sind oder echtes Risiko tragen. Verwenden Sie es für lange Aufgaben, bei denen ständige Genehmigungswarnungen Ihren Fluss unterbrechen.

---

## Wie man es aktiviert

**Slash Command (Toggle für aktuelle Session):**
```
/auto
```

**Einstellungsdatei:**
```json
{
  "autoMode": true
}
```

**CLI Flag:**
```bash
claude --auto "Refactor all API handlers to use the new error middleware"
```

**Kombiniert mit effort für Overnight Autonomous Work:**
```bash
claude --auto --effort xhigh "Implement the full feature spec in tasks.jsonl"
```

---

## Was sich in Auto Mode ändert

In einer Standard-Session fragt Claude vor den meisten Tool-Aufrufen um Bestätigung. In Auto Mode ist die Bestätigung gestaffelt:

### Permission Tiers

**Immer automatisch genehmigen (keine Aufforderung)**
- `Read` — Lesen einer beliebigen Datei
- `Grep` / `Glob` — Durchsuchen der Codebase
- `Bash` (read-only) — `ls`, `cat`, `find`, `git log`, `git diff`, `git status`, `npm list`, Ausführen von Test-Befehlen, die keinen State mutieren
- `WebFetch` (GET Anfragen)

**Fragen einmal pro Session (erste Aufforderung, Antwort merken)**
- `git add`, `git commit`, `git checkout`
- `npm install`, `npm ci`
- Schreiben neuer Dateien
- Erstellen von Verzeichnissen

**Immer fragen (jedes Mal auffragen)**
- Dateilöschung (`rm`, `unlink`)
- `git push --force`
- Datenbankschreibvorgänge (INSERT, UPDATE, DELETE via MCP oder CLI)
- Externe API-Aufrufe, die State mutieren (POST, PUT, PATCH, DELETE)
- Alle `Bash`-Befehle mit `sudo`
- Befehle, die Systemkonfiguration ändern

---

## Safety-Mechanismen

### `--max-cost` Flag
Stoppen Sie die Session, wenn die Ausgaben einen Dollar-Schwellenwert überschreiten:
```bash
claude --auto --max-cost 5.00 "Refactor the entire auth module"
```
Session beendet sich sauber, wenn die Kosten das Limit erreichen. Claude schreibt eine Fortschrittsübersicht vor dem Stoppen.

### `.claude/stop` Sentinel-Datei
Erstellen Sie diese Datei zu jedem Zeitpunkt, um eine autonome Session zu beenden:
```bash
touch .claude/stop
```
Claude prüft diese Datei zwischen Turns. Wenn sie existiert, endet die Session elegant. Entfernen Sie die Datei, bevor Sie die nächste Session starten.

### Keepalive Hook
Für Sessions, die über Nacht oder über Netzwerkunterbrechungen hinweg laufen, konfigurieren Sie einen Keepalive, der Claude neu startet, wenn er unerwartet stoppt:

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "incomplete",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/keepalive.sh"
          }
        ]
      }
    ]
  }
}
```

```bash
# .claude/hooks/keepalive.sh
# Nur neu starten, wenn verbleibende Tasks vorhanden und keine Stop-Sentinel
if [ ! -f ".claude/stop" ] && [ -s ".claude/tasks.jsonl" ]; then
  claude --auto --effort high "Continue working through tasks.jsonl"
fi
```

### `maxTurns`
Harte Obergrenze für die Anzahl der Turns pro Session:
```json
{
  "autoMode": true,
  "maxTurns": 100
}
```

---

## Auto Mode vs `--dangerously-skip-permissions`

Dies sind nicht dasselbe:

| | Auto Mode | `--dangerously-skip-permissions` |
|---|---|---|
| **Destruktive Ops** | Fordert immer noch auf | Völlig umgangen — gar keine Aufforderungen |
| **Dateilöschung** | Fordert immer auf | Auto-genehmigt |
| **Force Push** | Fordert immer auf | Auto-genehmigt |
| **Verwenden für** | Lange Tasks mit Mensch in der Nähe | Vollständig vertrauenswürdige Sandboxes, CI-Umgebungen |
| **Risikolevel** | Niedrig — destruktives Gate bleibt | Hoch — keine Sicherheit |

Verwenden Sie `--dangerously-skip-permissions` nie in interaktiver Entwicklung. Es ist für sandboxed CI-Pipelines gedacht, wo Claude auf eine Einwegumgebung beschränkt wurde.

---

## Best Practices für autonome Operationen

**Definieren Sie eine Task-Warteschlange vor dem Start.** Claude arbeitet zuverlässiger durch definierte Tasks als durch offene Aufforderungen. Verwenden Sie `.claude/tasks.jsonl`:

```jsonl
{"id": "1", "task": "Add input validation to all POST endpoints in src/routes/", "status": "pending"}
{"id": "2", "task": "Write tests for each validation rule added in task 1", "status": "pending"}
{"id": "3", "task": "Update API docs to reflect new validation errors", "status": "pending"}
```

```bash
claude --auto "Work through tasks in .claude/tasks.jsonl. Mark each task done as you complete it."
```

**Setzen Sie maxTurns explizit.** Offene autonome Sessions treiben ab. Ein `maxTurns` von 50–150 ist für die meisten Multi-Stunden-Tasks angemessen.

**Testen Sie mit `--dry-run` zuerst.** Führen Sie denselben Prompt mit `--dry-run` aus, um die geplanten Tool-Aufrufe vor der Ausführung zu sehen:
```bash
claude --auto --dry-run "Delete all TODO comments from the codebase"
```

**Gültigkeitsbereich des Arbeitsverzeichnisses.** Auto Mode respektiert Projekt-Grenzen. Führen Sie Claude vom Projekt-Root oder einem Unterverzeichnis aus, um zu begrenzen, was es erreichen kann.

**Überprüfen Sie das Session-Transkript danach.** Auto-Mode-Sessions erzeugen ein vollständiges Transkript. Lesen Sie es — Claudes Entscheidungen in einer langen autonomen Session sind wert, überprüft zu werden, besonders die "ask once per session" Wahlen, die es traf.

---

## Beispiel: Overnight Autonomous Refactor

```bash
# Task-Warteschlange erstellen
cat > .claude/tasks.jsonl << 'EOF'
{"id": "1", "task": "Find all usages of the deprecated fetchUser() function across src/", "status": "pending"}
{"id": "2", "task": "Replace each fetchUser() call with the new getUser() API, preserving error handling", "status": "pending"}
{"id": "3", "task": "Run the test suite and fix any failures caused by the migration", "status": "pending"}
{"id": "4", "task": "Delete the deprecated fetchUser() function and its tests", "status": "pending"}
{"id": "5", "task": "Update CHANGELOG.md with a summary of the deprecation removal", "status": "pending"}
EOF

# Autonome Session mit Kostendeckel starten
claude --auto --effort high --max-cost 8.00 \
  "Work through .claude/tasks.jsonl in order. Mark each task completed in the file when done. Stop if you encounter an ambiguity that requires a product decision."
```

---
