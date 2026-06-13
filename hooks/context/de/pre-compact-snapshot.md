# Hook: Pre-Compact Snapshot

Wird beim `PreCompact`-Ereignis ausgelöst, um das vollständige Gesprächstranskript zu sichern, bevor Claude Code es zusammenfasst und kürzt. Sie erhalten einen wiederherstellbaren Datensatz aller Aussagen in der Sitzung, auch nachdem die Komprimierung die ursprünglichen Nachrichten gelöscht hat.

## Was es tut

Liest die `PreCompact`-Nutzlast (die das zu komprimierende Transkript enthält) von stdin und schreibt sie als zeitgestempelte JSON-Datei in `.claude/snapshots/`. Die Datei wird nach Sitzungs-ID und Zeitstempel benannt, damit jedes Komprimierungsereignis innerhalb einer Sitzung eine eindeutige Datei erstellt.

Beispiel-Snapshot-Pfad:
```
.claude/snapshots/session-abc123-2026-06-03T10-30-00Z.json
```

Nach dem Schreiben hängt das Skript auch einen einzeiligen Indexeintrag an `.claude/snapshots/index.log` an, damit Sie vorherige Snapshots finden können, ohne das Verzeichnis aufzulisten:
```
2026-06-03T10:30:00Z  session=abc123  file=session-abc123-2026-06-03T10-30-00Z.json  turns=87
```

## Wann wird es ausgelöst

`PreCompact` — wird unmittelbar vor dem Komprimierungs-/Zusammenfassungsschritt von Claude Code ausgelöst, während das vollständige Transkript noch in der Nutzlast verfügbar ist.

## settings.json-Eintrag

```json
{
  "hooks": {
    "PreCompact": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/pre-compact-snapshot.sh",
            "timeout": 15
          }
        ]
      }
    ]
  }
}
```

Erhöhen Sie `timeout`, wenn Sie sehr lange Transkripte (>500 Abschnitte) haben und das Schreiben länger als 15 Sekunden dauert.

## Skript

`pre-compact-snapshot.sh`

```bash
#!/usr/bin/env bash
# pre-compact-snapshot.sh
# Fires on PreCompact — backs up the transcript before compaction

set -euo pipefail

SNAP_DIR="${CLAUDE_PROJECT_DIR:-$HOME}/.claude/snapshots"
INDEX_FILE="$SNAP_DIR/index.log"

mkdir -p "$SNAP_DIR"

PAYLOAD=$(cat)
TIMESTAMP=$(date -u +"%Y-%m-%dT%H-%M-%SZ")
SESSION="${CLAUDE_SESSION_ID:-unknown}"
FILENAME="session-${SESSION}-${TIMESTAMP}.json"
SNAP_PATH="$SNAP_DIR/$FILENAME"

# Write the raw transcript payload
echo "$PAYLOAD" > "$SNAP_PATH"

# Count turns if jq is available
TURNS="?"
if command -v jq &>/dev/null; then
  TURNS=$(echo "$PAYLOAD" | jq '.messages | length // 0' 2>/dev/null || echo "?")
fi

# Append to index
echo "$(date -u +"%Y-%m-%dT%H:%M:%SZ")  session=${SESSION}  file=${FILENAME}  turns=${TURNS}" >> "$INDEX_FILE"

# Keep at most 20 snapshots per session; prune oldest
SNAP_COUNT=$(ls -1 "$SNAP_DIR"/session-"${SESSION}"-*.json 2>/dev/null | wc -l | tr -d ' ')
if (( SNAP_COUNT > 20 )); then
  ls -1t "$SNAP_DIR"/session-"${SESSION}"-*.json | tail -n +21 | xargs rm -f
fi
```

## Setup

```bash
cp hooks/context/pre-compact-snapshot.sh .claude/hooks/
chmod +x .claude/hooks/pre-compact-snapshot.sh
mkdir -p .claude/snapshots
```

Fügen Sie `.claude/snapshots/` zu `.gitignore` hinzu — Snapshots können groß sein und Gesprächsinhalte enthalten, die Sie nicht eingecheckt haben möchten.

## Notizen

- Snapshots sind JSON; öffnen Sie jede Datei in einem Texteditor oder verwenden Sie `jq`, um bestimmte Abschnitte zu extrahieren: `jq '.messages[] | select(.role=="user")' snapshot.json`.
- Die Aufbewahrungsobergrenze von 20 Snapshots pro Sitzung verhindert unbegrenzten Speicherverbrauch bei sehr langen Sitzungen mit häufiger Komprimierung. Passen Sie die Obergrenze nach Bedarf im Skript an.
- Das Timeout ist auf 15 Sekunden eingestellt; Transkripte werden synchron geschrieben, sodass die Komprimierung wartet, bis die Sicherung abgeschlossen ist — das ist beabsichtigt.
- Wenn Speicherplatz ein Problem darstellt, leiten Sie durch `gzip` weiter: Ersetzen Sie `echo "$PAYLOAD" > "$SNAP_PATH"` mit `echo "$PAYLOAD" | gzip > "${SNAP_PATH}.gz"`.

---


📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
