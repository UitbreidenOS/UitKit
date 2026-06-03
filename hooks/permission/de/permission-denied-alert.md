# Hook: Permission Denied Alert

Wird bei `PermissionDenied` ausgelöst, um dich sofort zu benachrichtigen — über Desktop-Benachrichtigung oder Slack — wenn Claude Code daran gehindert wird, eine Aktion auszuführen. Hält dich informiert, ohne dass du das Terminal überwachen musst.

## Was es tut

Liest die `PermissionDenied`-Payload von stdin, extrahiert das blockierte Tool und den Grund, und:

1. Sendet eine **macOS-Desktop-Benachrichtigung** (über `osascript`) mit dem Tool-Namen und einem gekürzten Grund
2. POSTet optional eine Nachricht an einen **Slack-Webhook**, wenn `SLACK_WEBHOOK_URL` in der Umgebung gesetzt ist
3. Hängt einen Datensatz an `.claude/logs/permission-denied.log` an zur späteren Überprüfung

Beispiel-Desktop-Benachrichtigung:
```
Claude Code — Permission Denied
Bash: "git push --force origin main" was blocked. Reason: matched dangerous pattern.
```

Beispiel-Logeintrag:
```
2026-06-03T10:45:01Z [DENIED] tool=Bash session=abc123 reason="matched dangerous pattern" input="git push --force origin main"
```

## Wann es ausgelöst wird

`PermissionDenied` — wird ausgelöst, nachdem eine Berechtigungsentscheidung zu einer Blockierung führt (entweder durch einen Hook-Exit 2, einen Benutzer, der eine Aufforderung ablehnt, oder eine Richtlinienregel).

## settings.json-Eintrag

```json
{
  "hooks": {
    "PermissionDenied": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/permission-denied-alert.sh",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
```

## Skript

`permission-denied-alert.sh`

```bash
#!/usr/bin/env bash
# permission-denied-alert.sh
# Fires on PermissionDenied — desktop + Slack notification when an action is blocked

set -euo pipefail

LOG_DIR="${CLAUDE_PROJECT_DIR:-$HOME}/.claude/logs"
LOG_FILE="$LOG_DIR/permission-denied.log"

mkdir -p "$LOG_DIR"

PAYLOAD=$(cat)
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
SESSION="${CLAUDE_SESSION_ID:-unknown}"

if command -v jq &>/dev/null; then
  TOOL=$(echo "$PAYLOAD"   | jq -r '.tool_name // .tool // "unknown"')
  REASON=$(echo "$PAYLOAD" | jq -r '.reason // .message // "no reason given"' | head -c 120)
  INPUT=$(echo "$PAYLOAD"  | jq -r '.tool_input | tostring' | head -c 80)
else
  TOOL=$(echo "$PAYLOAD"   | grep -o '"tool_name":"[^"]*"' | cut -d'"' -f4 || echo "unknown")
  REASON="see log"
  INPUT=""
fi

# Log entry
echo "${TIMESTAMP} [DENIED] tool=${TOOL} session=${SESSION} reason=\"${REASON}\" input=\"${INPUT}\"" >> "$LOG_FILE"

# macOS desktop notification
if command -v osascript &>/dev/null; then
  osascript -e "display notification \"${TOOL}: ${REASON}\" with title \"Claude Code — Permission Denied\" sound name \"Basso\"" 2>/dev/null || true
fi

# Linux desktop notification
if command -v notify-send &>/dev/null; then
  notify-send "Claude Code — Permission Denied" "${TOOL}: ${REASON}" --urgency=normal 2>/dev/null || true
fi

# Slack webhook (optional — set SLACK_WEBHOOK_URL in your environment)
if [[ -n "${SLACK_WEBHOOK_URL:-}" ]] && command -v curl &>/dev/null; then
  SLACK_BODY=$(printf '{"text":"*Claude Code — Permission Denied*\n*Tool:* %s\n*Reason:* %s\n*Session:* %s"}' \
    "$TOOL" "$REASON" "$SESSION")
  curl -s -X POST -H 'Content-type: application/json' \
    --data "$SLACK_BODY" "$SLACK_WEBHOOK_URL" &>/dev/null || true
fi

exit 0
```

## Setup

```bash
cp hooks/permission/permission-denied-alert.sh .claude/hooks/
chmod +x .claude/hooks/permission-denied-alert.sh
mkdir -p .claude/logs
```

Für Slack-Benachrichtigungen exportiere `SLACK_WEBHOOK_URL` in deinem Shell-Profil oder füge es unter `env` in `.claude/settings.json` hinzu:

```json
{
  "env": {
    "SLACK_WEBHOOK_URL": "https://hooks.slack.com/services/T.../B.../..."
  }
}
```

## Notizen

- Der `Basso`-Sound auf macOS ist der Standard-Sound für „blockiert". Ändere ihn zu `"Funk"`, `"Sosumi"` oder `""` (kein Sound), je nach Vorliebe.
- Auf Linux ohne `notify-send` installiere `libnotify-bin` (`apt install libnotify-bin`) oder ersetze den Benachrichtigungsaufruf durch eine `wall`-Rundfunkmeldung.
- Dieser Hook beendet sich immer mit 0 — er ist rein reaktiv und beeinflusst nicht die Blockierungsentscheidung, die bereits getroffen wurde.
- Kombiniere mit `permission-request-audit`, um ein vollständiges Bild zu erfassen: was angefordert wurde und was letztendlich blockiert wurde.

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
