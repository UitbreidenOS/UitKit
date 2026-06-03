# Hook: Permission Request Audit

Wird bei `PermissionRequest` ausgelöst, um jede Berechtigungsanfrage — Werkzeugname, Argumente und Entscheidungskontext — in einem strukturierten Audit-Log zu protokollieren. Nützlich für Compliance-Überprüfungen, Debugging von zu permissiven Sitzungen und zum Verstehen, was Claude während eines langen Durchlaufs versucht hat.

## Was es tut

Liest die `PermissionRequest`-Payload aus stdin und fügt einen JSON-Lines-Datensatz zu `.claude/logs/permission-audit.jsonl` hinzu. Jeder Datensatz enthält:

- `timestamp` — ISO-8601 UTC
- `session` — Sitzungs-ID
- `tool` — das Werkzeug, für das Claude Berechtigung anfordert
- `input_summary` — erste 200 Zeichen der Werkzeugeingabe (bereinigt — Geheimnisse, die nach Muster erkannt werden, werden redigiert)
- `event` — immer `"permission_request"` für einfaches Filtern

Beispiel JSONL-Zeile:
```json
{"timestamp":"2026-06-03T10:22:01Z","session":"abc123","event":"permission_request","tool":"Bash","input_summary":"git push origin main --force"}
```

Das Skript gibt auch die vollständige Payload an stderr aus (sichtbar in Claudes Debug-Ausgabe), ohne die Berechtigungsentscheidung zu beeinflussen — exit 0 immer, daher ist dieser Hook rein beobachtend.

## Wann wird es ausgelöst

`PermissionRequest` — wird ausgelöst, bevor Claude Code dem Benutzer eine Berechtigungsaufforderung für jeden Werkzeugaufruf anzeigt, der explizite Genehmigung erfordert.

## settings.json Eintrag

```json
{
  "hooks": {
    "PermissionRequest": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/permission-request-audit.sh",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

Setzen Sie `matcher` auf einen bestimmten Werkzeugnamen (z.B. `"Bash"`), um nur Shell-Aufrufe zu überprüfen.

## Skript

`permission-request-audit.sh`

```bash
#!/usr/bin/env bash
# permission-request-audit.sh
# Fires on PermissionRequest — writes a JSONL audit record for every permission ask

set -euo pipefail

LOG_DIR="${CLAUDE_PROJECT_DIR:-$HOME}/.claude/logs"
LOG_FILE="$LOG_DIR/permission-audit.jsonl"

mkdir -p "$LOG_DIR"

PAYLOAD=$(cat)
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
SESSION="${CLAUDE_SESSION_ID:-unknown}"

if command -v jq &>/dev/null; then
  TOOL=$(echo "$PAYLOAD"  | jq -r '.tool_name // .tool // "unknown"')
  RAW_INPUT=$(echo "$PAYLOAD" | jq -r '.tool_input | tostring' | head -c 200)
else
  TOOL=$(echo "$PAYLOAD"  | grep -o '"tool_name":"[^"]*"' | cut -d'"' -f4 || echo "unknown")
  RAW_INPUT=$(echo "$PAYLOAD" | head -c 200)
fi

# Redact common secret patterns before writing
INPUT_SUMMARY=$(echo "$RAW_INPUT" \
  | sed 's/[A-Za-z0-9_\-]\{20,\}/[REDACTED]/g' \
  | sed 's/sk-[A-Za-z0-9]\+/[REDACTED]/g' \
  | sed 's/ghp_[A-Za-z0-9]\+/[REDACTED]/g')

# Write JSONL record
printf '{"timestamp":"%s","session":"%s","event":"permission_request","tool":"%s","input_summary":"%s"}\n' \
  "$TIMESTAMP" "$SESSION" "$TOOL" \
  "$(echo "$INPUT_SUMMARY" | sed 's/"/\\"/g')" \
  >> "$LOG_FILE"

# Always allow — this hook is audit-only
exit 0
```

## Einrichtung

```bash
cp hooks/permission/permission-request-audit.sh .claude/hooks/
chmod +x .claude/hooks/permission-request-audit.sh
mkdir -p .claude/logs
```

Um das Audit als **blockierendes** Gate auszuführen (erzwingt manuelle Genehmigung für jedes sensible Werkzeug), ändern Sie exit 0 in exit 1 für die Werkzeuge, für die Sie eine Forcierung durchführen möchten. Zum Hard-Block setzen Sie exit 2.

## Hinweise

- `.jsonl`-Format macht es einfach, in Analytics zu streamen: `jq -s '.' .claude/logs/permission-audit.jsonl` oder in jeden Log-Aggregator zu importieren.
- Die Redigierungsregex ist absichtlich breit. Stimmen Sie die `sed`-Muster auf die geheimen Formate Ihres Projekts ab.
- Koppeln Sie mit `permission-denied-alert`, um benachrichtigt zu werden, wenn die Berechtigung nach dem Auslösen des Audits letztendlich verweigert wird.
- Drehen Sie die Protokolldatei regelmäßig; eine aktive Sitzung kann Hunderte von Datensätzen generieren.

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
