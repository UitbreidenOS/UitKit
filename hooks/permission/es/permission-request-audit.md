# Hook: Permission Request Audit

Se dispara en `PermissionRequest` para escribir cada solicitud de permiso — nombre de la herramienta, argumentos y contexto de decisión — en un registro de auditoría estructurado. Útil para revisiones de cumplimiento, depuración de sesiones excesivamente permisivas y comprensión de lo que Claude intentó durante una ejecución prolongada.

## Qué hace

Lee la carga útil de `PermissionRequest` desde stdin y añade un registro en formato JSON-lines a `.claude/logs/permission-audit.jsonl`. Cada registro contiene:

- `timestamp` — ISO-8601 UTC
- `session` — ID de sesión
- `tool` — la herramienta para la que Claude solicita permiso
- `input_summary` — primeros 200 caracteres de la entrada de la herramienta (sanitizada — los secretos detectados por patrón se ocultan)
- `event` — siempre `"permission_request"` para filtrado fácil

Línea JSONL de ejemplo:
```json
{"timestamp":"2026-06-03T10:22:01Z","session":"abc123","event":"permission_request","tool":"Bash","input_summary":"git push origin main --force"}
```

El script también emite la carga útil completa a stderr (visible en la salida de depuración de Claude) sin afectar la decisión de permiso — exit 0 siempre, por lo que este hook es puramente observacional.

## Cuándo se dispara

`PermissionRequest` — se dispara antes de que Claude Code muestre al usuario un aviso de permiso para cualquier llamada de herramienta que requiera aprobación explícita.

## Entrada en settings.json

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

Establece `matcher` en un nombre de herramienta específica (por ejemplo, `"Bash"`) para auditar solo llamadas de shell.

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

## Configuración

```bash
cp hooks/permission/permission-request-audit.sh .claude/hooks/
chmod +x .claude/hooks/permission-request-audit.sh
mkdir -p .claude/logs
```

Para ejecutar la auditoría como una compuerta **bloqueante** (requiere aprobación manual para cada herramienta sensible), cambia exit 0 a exit 1 para las herramientas que deseas forzar-avisar. Para bloquear completamente, usa exit 2.

## Notas

- El formato `.jsonl` facilita la transmisión a analítica: `jq -s '.' .claude/logs/permission-audit.jsonl` o importar en cualquier agregador de registros.
- La expresión regular de ocultamiento es intencionalmente amplia. Ajusta los patrones `sed` para coincidir con los formatos de secretos de tu proyecto.
- Empareja con `permission-denied-alert` para recibir notificaciones cuando el permiso sea finalmente rechazado después de que se dispare la auditoría.
- Rota el archivo de registro regularmente; una sesión ocupada puede generar cientos de registros.

---


📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
