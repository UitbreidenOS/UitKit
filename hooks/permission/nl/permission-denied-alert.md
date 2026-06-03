# Hook: Machtiging Geweigerd Alert

Wordt geactiveerd op `PermissionDenied` om je onmiddellijk op de hoogte te stellen — via desktopmelding of Slack — wanneer Claude Code wordt geblokkeerd van het uitvoeren van een actie. Houdt je geïnformeerd zonder dat je de terminal hoeft in de gaten te houden.

## Wat het doet

Leest de `PermissionDenied` payload van stdin, extraheert het geblokkeerde gereedschap en reden, en:

1. Stuurt een **macOS desktopmelding** (via `osascript`) met de naam van het gereedschap en een ingekort beredenatie
2. Stuurt optioneel een bericht naar een **Slack webhook** als `SLACK_WEBHOOK_URL` is ingesteld in de omgeving
3. Voegt een record toe aan `.claude/logs/permission-denied.log` voor later review

Voorbeeld desktopmelding:
```
Claude Code — Machtiging Geweigerd
Bash: "git push --force origin main" was geblokkeerd. Reden: matched dangerous pattern.
```

Voorbeeld logboekregel:
```
2026-06-03T10:45:01Z [DENIED] tool=Bash session=abc123 reason="matched dangerous pattern" input="git push --force origin main"
```

## Wanneer het wordt geactiveerd

`PermissionDenied` — wordt geactiveerd nadat een machtigingsbesluit resulteert in een blokkering (ofwel van een hook exit 2, een gebruiker die een prompt weigert, of een beleid regel).

## settings.json invoer

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

## Script

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

## Instellen

```bash
cp hooks/permission/permission-denied-alert.sh .claude/hooks/
chmod +x .claude/hooks/permission-denied-alert.sh
mkdir -p .claude/logs
```

Voor Slack-meldingen exporteert u `SLACK_WEBHOOK_URL` in uw shell-profiel of voegt u het toe aan `.claude/settings.json` onder `env`:

```json
{
  "env": {
    "SLACK_WEBHOOK_URL": "https://hooks.slack.com/services/T.../B.../..."
  }
}
```

## Notities

- De `Basso` geluid op macOS is het standaard "geblokkeerd" systeemgeluid. Wijzig in `"Funk"`, `"Sosumi"`, of `""` (geen geluid) naar smaak.
- Op Linux zonder `notify-send` installeert u `libnotify-bin` (`apt install libnotify-bin`) of vervangt u de melding aanroep met een `wall` uitzending.
- Deze hook sluit altijd af met 0 — het is zuiver reactief en beïnvloedt niet het weigerings besluit dat al heeft plaatsgevonden.
- Combineer met `permission-request-audit` om het volledige voor/na beeld te registreren: wat werd aangevraagd en wat werd uiteindelijk geblokkeerd.

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
