# Hook: Permission Request Audit

Wordt geactiveerd op `PermissionRequest` om elke permissieaanvraag — toolnaam, argumenten en beslissingscontext — naar een gestructureerd auditlogboek te schrijven. Nuttig voor compliancebeoordeling, foutopsporing van overmachtige sessies en het begrijpen wat Claude tijdens een lange run heeft geprobeerd.

## Wat het doet

Leest de `PermissionRequest` payload van stdin en voegt een JSON-lines record toe aan `.claude/logs/permission-audit.jsonl`. Elk record bevat:

- `timestamp` — ISO-8601 UTC
- `session` — sessie-ID
- `tool` — de tool waarvoor Claude permissie aanvraagt
- `input_summary` — eerste 200 karakters van de tool input (gereiniigd — geheimen die door patroon worden gedetecteerd zijn geredigeerd)
- `event` — altijd `"permission_request"` voor gemakkelijk filteren

Voorbeeld JSONL regel:
```json
{"timestamp":"2026-06-03T10:22:01Z","session":"abc123","event":"permission_request","tool":"Bash","input_summary":"git push origin main --force"}
```

Het script geeft ook de volledige payload naar stderr uit (zichtbaar in Claude's debug output) zonder de permissie beslissing te beïnvloeden — exit 0 altijd, dus deze hook is puur observatief.

## Wanneer het wordt geactiveerd

`PermissionRequest` — wordt geactiveerd voordat Claude Code de gebruiker een permissieprompt toont voor elke tooloproep die expliciete goedkeuring vereist.

## settings.json entry

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

Stel `matcher` in op een specifieke toolnaam (bijvoorbeeld `"Bash"`) om alleen shell-oproepen te controleren.

## Script

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

## Instellen

```bash
cp hooks/permission/permission-request-audit.sh .claude/hooks/
chmod +x .claude/hooks/permission-request-audit.sh
mkdir -p .claude/logs
```

Als u de controle als een **blokkering** wilt uitvoeren (handmatige goedkeuring vereisen voor elk gevoelig hulpmiddel), wijzigt u exit 0 in exit 1 voor de tools die u wilt forceren. Om hard te blokkeren, exit 2.

## Opmerkingen

- `.jsonl` formaat maakt het gemakkelijk om in analytics te streamen: `jq -s '.' .claude/logs/permission-audit.jsonl` of importeren in elke logverzamelaar.
- De redactieregex is opzettelijk breed. Stel de `sed` patronen aan op basis van uw projectgeheimen.
- Koppel met `permission-denied-alert` om een melding te krijgen wanneer permissie uiteindelijk wordt geweigerd nadat de controle is geactiveerd.
- Roteer het logbestand regelmatig; een drukke sessie kan honderden records genereren.

---


📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
