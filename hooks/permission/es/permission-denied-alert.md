# Hook: Permission Denied Alert

Se activa en `PermissionDenied` para notificarte inmediatamente — mediante notificación de escritorio o Slack — siempre que Claude Code esté bloqueado para realizar una acción. Te mantiene informado sin necesidad de ver la terminal.

## Qué hace

Lee la carga útil de `PermissionDenied` desde stdin, extrae la herramienta bloqueada y el motivo, y:

1. Envía una **notificación de escritorio de macOS** (a través de `osascript`) con el nombre de la herramienta y un motivo truncado
2. Opcionalmente envía un POST a un **webhook de Slack** si `SLACK_WEBHOOK_URL` está configurado en el entorno
3. Añade un registro a `.claude/logs/permission-denied.log` para revisión posterior

Ejemplo de notificación de escritorio:
```
Claude Code — Permission Denied
Bash: "git push --force origin main" was blocked. Reason: matched dangerous pattern.
```

Ejemplo de línea de registro:
```
2026-06-03T10:45:01Z [DENIED] tool=Bash session=abc123 reason="matched dangerous pattern" input="git push --force origin main"
```

## Cuándo se activa

`PermissionDenied` — se activa después de que una decisión de permiso resulte en un bloqueo (ya sea desde un hook exit 2, un usuario rechazando un mensaje, o una regla de política).

## Entrada en settings.json

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

## Configuración

```bash
cp hooks/permission/permission-denied-alert.sh .claude/hooks/
chmod +x .claude/hooks/permission-denied-alert.sh
mkdir -p .claude/logs
```

Para notificaciones de Slack, exporta `SLACK_WEBHOOK_URL` en tu perfil de shell o añádelo a `.claude/settings.json` bajo `env`:

```json
{
  "env": {
    "SLACK_WEBHOOK_URL": "https://hooks.slack.com/services/T.../B.../..."
  }
}
```

## Notas

- El sonido `Basso` en macOS es el sonido de sistema "bloqueado" predeterminado. Cambia a `"Funk"`, `"Sosumi"`, o `""` (sin sonido) según tu preferencia.
- En Linux sin `notify-send`, instala `libnotify-bin` (`apt install libnotify-bin`) o reemplaza la llamada de notificación con un broadcast `wall`.
- Este hook siempre sale con 0 — es puramente reactivo y no afecta la decisión de bloqueo que ya ocurrió.
- Empareja con `permission-request-audit` para registrar la imagen completa antes/después: qué se solicitó y qué fue finalmente bloqueado.

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
