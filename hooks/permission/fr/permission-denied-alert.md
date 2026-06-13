# Hook: Permission Denied Alert

S'exécute sur `PermissionDenied` pour vous notifier immédiatement — via une notification de bureau ou Slack — chaque fois que Claude Code se voit refuser l'exécution d'une action. Vous permet de rester informé sans avoir besoin de surveiller le terminal.

## Ce qu'il fait

Lit la charge utile `PermissionDenied` depuis stdin, extrait l'outil bloqué et la raison, et :

1. Envoie une **notification de bureau macOS** (via `osascript`) avec le nom de l'outil et une raison tronquée
2. POSTe optionnellement un message vers un **webhook Slack** si `SLACK_WEBHOOK_URL` est défini dans l'environnement
3. Ajoute un enregistrement à `.claude/logs/permission-denied.log` pour examen ultérieur

Exemple de notification de bureau :
```
Claude Code — Permission Denied
Bash: "git push --force origin main" was blocked. Reason: matched dangerous pattern.
```

Exemple de ligne de journal :
```
2026-06-03T10:45:01Z [DENIED] tool=Bash session=abc123 reason="matched dangerous pattern" input="git push --force origin main"
```

## Quand il s'exécute

`PermissionDenied` — s'exécute après qu'une décision de permission entraîne un blocage (soit d'une sortie de hook 2, soit d'un utilisateur refusant une invite, soit d'une règle de politique).

## Entrée settings.json

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

## Installation

```bash
cp hooks/permission/permission-denied-alert.sh .claude/hooks/
chmod +x .claude/hooks/permission-denied-alert.sh
mkdir -p .claude/logs
```

Pour les notifications Slack, exportez `SLACK_WEBHOOK_URL` dans votre profil shell ou ajoutez-la à `.claude/settings.json` sous `env` :

```json
{
  "env": {
    "SLACK_WEBHOOK_URL": "https://hooks.slack.com/services/T.../B.../..."
  }
}
```

## Notes

- Le son `Basso` sur macOS est le son système par défaut de « bloqué ». Changez vers `"Funk"`, `"Sosumi"`, ou `""` (pas de son) selon votre préférence.
- Sur Linux sans `notify-send`, installez `libnotify-bin` (`apt install libnotify-bin`) ou remplacez l'appel de notification par une diffusion `wall`.
- Ce hook sort toujours 0 — il est purement réactif et n'affecte pas la décision de refus qui a déjà eu lieu.
- Associez-le avec `permission-request-audit` pour enregistrer l'image complète avant/après : ce qui a été demandé et ce qui a finalement été bloqué.

---


📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
