# Hook: Subagent Start Logger

Se activa en `SubagentStart` para registrar qué subagente se ejecutó, qué tarea recibió y cuándo — creando un rastro continuo de toda la actividad del agente en la sesión.

## Qué hace

Lee la carga útil de `SubagentStart` desde stdin (JSON que contiene el nombre del agente, el modelo y la descripción de la tarea) y agrega una línea de una sola línea con marca de tiempo a `.claude/logs/subagent-activity.log`. La entrada del registro incluye:

- Marca de tiempo ISO-8601
- Nombre del agente / nombre de la herramienta
- Los primeros 120 caracteres del prompt de la tarea (suficiente contexto, no demasiado verboso)
- ID de sesión (de la variable de entorno `CLAUDE_SESSION_ID` cuando esté disponible)

Ejemplo de línea de registro:
```
2026-06-03T09:14:22Z [START] agent=security-reviewer session=abc123 task="Review the pending diff for injection vulnerabilities in src/api/..."
```

## Cuándo se activa

`SubagentStart` — se activa cada vez que Claude Code genera un subagente (llamadas de herramientas paralelas, agentes delegados, invocaciones de habilidades que se ejecutan como un subproceso).

## Entrada en settings.json

```json
{
  "hooks": {
    "SubagentStart": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/subagent-start-logger.sh",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

Establece `matcher` en `""` para capturar todos los subagentes, o proporciona una subcadena del nombre del agente (por ejemplo, `"security"`) para filtrar.

## Script

`subagent-start-logger.sh`

```bash
#!/usr/bin/env bash
# subagent-start-logger.sh
# Fires on SubagentStart — logs agent name + task snippet to subagent-activity.log

set -euo pipefail

LOG_DIR="${CLAUDE_PROJECT_DIR:-$HOME}/.claude/logs"
LOG_FILE="$LOG_DIR/subagent-activity.log"

mkdir -p "$LOG_DIR"

# Read the full JSON payload from stdin
PAYLOAD=$(cat)

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
SESSION="${CLAUDE_SESSION_ID:-unknown}"

# Extract fields with jq; fall back to raw grep if jq is absent
if command -v jq &>/dev/null; then
  AGENT=$(echo "$PAYLOAD" | jq -r '.agent_name // .tool_name // "unknown"')
  TASK=$(echo "$PAYLOAD"  | jq -r '.task // .prompt // ""' | head -c 120)
else
  AGENT=$(echo "$PAYLOAD" | grep -o '"agent_name":"[^"]*"' | cut -d'"' -f4 || echo "unknown")
  TASK=$(echo "$PAYLOAD"  | grep -o '"task":"[^"]*"'       | cut -d'"' -f4 | head -c 120 || echo "")
fi

echo "${TIMESTAMP} [START] agent=${AGENT} session=${SESSION} task=\"${TASK}\"" >> "$LOG_FILE"
```

## Configuración

```bash
cp hooks/subagent/subagent-start-logger.sh .claude/hooks/
chmod +x .claude/hooks/subagent-start-logger.sh
mkdir -p .claude/logs
```

Añade el fragmento de `settings.json` a `.claude/settings.json` o `~/.claude/settings.json`.

## Notas

- El archivo de registro crece indefinidamente; rota con `logrotate` o un cron semanal que archive archivos más antiguos de 30 días.
- `SubagentStart` se activa antes de que se ejecute el subagente, por lo que el campo de tarea refleja el trabajo previsto, no el resultado final — empareja con `subagent-stop-summary` para capturar resultados.
- Si `jq` no está instalado (`brew install jq` / `apt install jq`), el análisis de respaldo de grep es menos robusto — instala jq para uso en producción.

---


📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
