# Hook: Nutzungsverfolger

Protokolliert jede Claude Code-Werkzeugaufrufe in `.claude/usage-log.jsonl` zur DX-Metriksammlung, Einführungsverfolgung und Messeffektivität von Kompetenzen.

## Veranstaltung

`PostToolUse` — wird sofort nach jedem Werkzeugaufruf ausgelöst (Bash, Read, Write, WebSearch, API-Aufrufe, etc.)

## settings.json Eintrag

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/usage-tracker.sh",
            "async": true
          }
        ]
      }
    ]
  },
  "dx": {
    "tracking_enabled": true,
    "usage_log_file": "${CLAUDE_PROJECT_DIR}/.claude/usage-log.jsonl",
    "rotation_size_mb": 50,
    "retention_days": 90
  }
}
```

## Was es tut

Fügt `.claude/usage-log.jsonl` eine JSON-Zeile für jeden Werkzeugaufruf hinzu und erfasst:

- **Zeitstempel** (ISO 8601 UTC)
- **Sitzungs-ID** und Benutzer
- **Kompetenznamen** (aus Kontext analysiert, falls verfügbar)
- **Aufgerufenes Werkzeug** (Bash, Read, Write, WebSearch, etc.)
- **Dauer** (Millisekunden)
- **Erfolg** (Exitcode 0 = wahr)
- **Werkzeugspezifische Metadaten** (Befehl, Dateipfad, Abfrage, etc.)

Beispieldatensatz:

```json
{
  "timestamp": "2026-06-15T14:32:15.234Z",
  "session_id": "sess_abc123",
  "user_id": "alice@company.com",
  "skill_name": "code-review",
  "tool_called": "Bash",
  "tool_input_summary": "git diff --name-only",
  "duration_ms": 2847,
  "exit_code": 0,
  "success": true,
  "invocation_num": 3,
  "retry_count": 0,
  "metadata": {
    "project_dir": "/Users/alice/myapp",
    "git_branch": "feature/auth",
    "model": "haiku-4.5"
  }
}
```

## Eigenschaften

- **Leichtgewichtig**: Asynchrones Protokollieren blockiert Claude Code-Ausführung nicht
- **Datenschutzfreundlich**: Protokolliert Befehlszusammenfassungen, nicht vollständig sensible Eingaben
- **Einführungsverfolgung**: Verknüpft Werkzeugaufrufe mit Kompetenzen zur /dx-metrics-Analyse
- **Minimaler Overhead**: ~10ms pro Protokolleintrag, Batch-Schreibvorgänge
- **Automatische Rotation**: Verschiebt alte Protokolle zu `.jsonl.1`, `.jsonl.2` wenn > 50MB
- **Aufbewahrungsrichtlinie**: Löscht automatisch Protokolle älter als 90 Tage
- **Sitzungsverfolgung**: Alle Aufrufe in einer Sitzung teilen sich eine session_id zur Korrelation
- **Wiederholungserkennung**: Zählt wiederholte Aufrufe desselben Werkzeugs innerhalb von 30 Sekunden

## Einrichtung

```bash
# Kopie des Hook-Skripts zum Projekt
cp hooks/usage-tracker.sh .claude/hooks/
chmod +x .claude/hooks/usage-tracker.sh

# Protokollverzeichnis erstellen
mkdir -p .claude
touch .claude/usage-log.jsonl

# Zu .gitignore hinzufügen (Nutzungsprotokolle enthalten Metadaten, keine Geheimnisse)
echo ".claude/usage-log.jsonl*" >> .gitignore
echo ".claude/dx-scorecard*.json" >> .gitignore
echo ".claude/session-log*.md" >> .gitignore

# In settings.json verifizieren (über Hooks-Eintrag hinzufügen)
cat >> .claude/settings.json << 'EOF'
  "dx": {
    "tracking_enabled": true,
    "usage_log_file": "${CLAUDE_PROJECT_DIR}/.claude/usage-log.jsonl",
    "rotation_size_mb": 50,
    "retention_days": 90
  }
EOF
```

## Abfragebeispiele

**Alle Werkzeugaufrufe in einer Sitzung auflisten**:
```bash
jq 'select(.session_id == "sess_abc123")' .claude/usage-log.jsonl
```

**Kompetenzaufrufe zählen (für /dx-metrics)**:
```bash
jq -s 'group_by(.skill_name) | map({skill: .[0].skill_name, count: length})' \
  .claude/usage-log.jsonl
```

**Fehler finden**:
```bash
jq 'select(.success == false)' .claude/usage-log.jsonl | jq -s 'length'
```

**Durchschnittliche Dauer pro Werkzeug berechnen**:
```bash
jq -s 'group_by(.tool_called) | map({tool: .[0].tool_called, avg_ms: (map(.duration_ms) | add / length)})' \
  .claude/usage-log.jsonl
```

**Langsame Vorgänge finden** (> 30 Sekunden):
```bash
jq 'select(.duration_ms > 30000) | {timestamp, tool_called, duration_ms}' \
  .claude/usage-log.jsonl | head -10
```

**Wiederholungsschleifen erkennen** (dasselbe Werkzeug 3+ mal in 60 Sekunden aufgerufen):
```bash
jq -s '[.[] | select(.retry_count > 0)]' .claude/usage-log.jsonl
```

## Integration mit /dx-metrics

Der Usage-Tracker-Hook speist Rohdaten in `/dx-metrics`, die für DX-Bewertung aggregiert:

```
[Werkzeugaufrufe]
  ↓
[PostToolUse Hook]
  ↓
[usage-tracker.sh fügt zu .claude/usage-log.jsonl hinzu]
  ↓
[/dx-metrics liest usage-log.jsonl]
  ↓
[Generiert .claude/dx-scorecard.json (Aufrufe, Erfolgsrate, Zeiteinsparungen, etc.)]
```

## Kompetenznamen-Erkennung

Der Hook versucht, `skill_name` aus dem Kontext abzuleiten:

1. Umgebungsvariable `CLAUDE_ACTIVE_SKILL` überprüfen (gesetzt, wenn in einer Kompetenz ausgeführt)
2. Sitzungsmetadaten für laufenden `/skill-name`-Befehl analysieren
3. Aus Werkzeugsequenz ableiten (z. B. wenn Bash + Read + Write hintereinander, wahrscheinlich Code-Review-Typ-Kompetenz)
4. Fallback: `skill_name = "manual"` (Benutzer führt Werkzeuge direkt aus)

Für beste Ergebnisse sollten Kompetenzen bei Aufrufen `CLAUDE_ACTIVE_SKILL` setzen:

```bash
# Innerhalb einer Kompetenz (z. B. skills/productivity/code-review.md)
export CLAUDE_ACTIVE_SKILL="code-review"
# ... Kompetenmanweisungen folgen
```

## Leistungsoptimierung

Wenn die Protokollierung die Responsivität beeinträchtigt:

1. **Größe der Rotation erhöhen**, um weniger Protokollrotationen zu verarbeiten:
   ```json
   "rotation_size_mb": 100
   ```

2. **Aufbewahrung verringern**, um Festplattenverbrauch zu reduzieren:
   ```json
   "retention_days": 30
   ```

3. **Temporär deaktivieren** (während intensiver Berechnung):
   ```bash
   export DX_TRACKING_DISABLED=1
   ```

4. **Beispiel-Protokolle** (jeden Nten Aufruf protokollieren) — usage-tracker.sh bearbeiten:
   ```bash
   SAMPLE_RATE=10  # Protokolliere 1 von 10 Aufrufen
   [ $((RANDOM % SAMPLE_RATE)) -ne 0 ] && exit 0
   ```

## Datenverwaltung

- **Eigentümer**: Projektteam / DX-Leiter
- **Zugriff**: Benutzer können `.claude/usage-log.jsonl` lokal abfragen; kein Upload zur Cloud
- **Anonymisierung**: user_id vor dem Freigeben von Berichten entfernen (optional):
  ```bash
  jq 'del(.user_id)' .claude/usage-log.jsonl > usage-log-anon.jsonl
  ```
- **Aufbewahrung**: Automatisches Löschen nach 90 Tagen (konfigurierbar)
- **Opt-out**: `DX_TRACKING_DISABLED=1` setzen, um Protokollierung zu überspringen

## Troubleshooting

**Keine Protokolle werden geschrieben**:
- Überprüfen Sie, ob Hook in `.claude/settings.json` aktiviert ist
- Überprüfen Sie `.claude/usage-log.jsonl`-Dateiberechtigungen: `ls -la .claude/`
- Test ausführen: `echo '{"test": 1}' | bash .claude/hooks/usage-tracker.sh`

**Protokolle wachsen zu schnell**:
- Erhöhen Sie `rotation_size_mb` oder verringern Sie `retention_days`
- Überprüfen Sie, ob Hook wirklich asynchron ist (sollte Claude Code nicht blockieren)

**Fehlender Kompetenznamen**:
- Umwrap-Kompetenzen-Code mit `export CLAUDE_ACTIVE_SKILL="skill-name"`
- Oder fügen Sie Kompetenznamen zum `.claude/settings.json`-Kontext hinzu

---
