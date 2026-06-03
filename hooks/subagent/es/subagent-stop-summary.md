# Hook: Subagent Stop Summary

Se ejecuta en `SubagentStop` para añadir un resumen de resultado de una línea al registro de sesión — proporcionándote un registro cronológico de cada invocación de subagente y su resultado en un único archivo.

## Qué hace

Lee la carga útil de `SubagentStop` desde stdin y añade una línea de resumen con marca de tiempo a `.claude/logs/subagent-activity.log` (el mismo archivo escrito por `subagent-start-logger`). La línea incluye:

- Marca de tiempo ISO-8601
- Marcador `[STOP]` para filtrado fácil con grep/awk
- Nombre del agente
- Estado de salida / indicador de éxito
- Primeros 120 caracteres del mensaje de resultado o error

Línea de registro de ejemplo:
```
2026-06-03T09:14:35Z [STOP]  agent=security-reviewer session=abc123 status=success result="No critical vulnerabilities found. 2 low-severity warnings in src/api/routes.py."
```

Emparejar líneas `[START]` y `[STOP]` en el registro hace que sea sencillo medir el tiempo de reloj de pared del subagente con un simple script awk.

## Cuándo se ejecuta

`SubagentStop` — se ejecuta cada vez que un subagente finaliza, ya sea que haya tenido éxito, error o fue interrumpido.

## Entrada en settings.json

```json
{
  "hooks": {
    "SubagentStop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/subagent-stop-summary.sh",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

## Script

`subagent-stop-summary.sh`

```bash
#!/usr/bin/env bash
# subagent-stop-summary.sh
# Fires on SubagentStop — appends result summary to subagent-activity.log

set -euo pipefail

LOG_DIR="${CLAUDE_PROJECT_DIR:-$HOME}/.claude/logs"
LOG_FILE="$LOG_DIR/subagent-activity.log"

mkdir -p "$LOG_DIR"

PAYLOAD=$(cat)

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
SESSION="${CLAUDE_SESSION_ID:-unknown}"

if command -v jq &>/dev/null; then
  AGENT=$(echo "$PAYLOAD"  | jq -r '.agent_name // .tool_name // "unknown"')
  STATUS=$(echo "$PAYLOAD" | jq -r 'if .error then "error" else "success" end')
  RESULT=$(echo "$PAYLOAD" | jq -r '.result // .error // .output // ""' | head -c 120)
else
  AGENT=$(echo "$PAYLOAD"  | grep -o '"agent_name":"[^"]*"' | cut -d'"' -f4 || echo "unknown")
  STATUS="unknown"
  RESULT=$(echo "$PAYLOAD" | grep -o '"result":"[^"]*"' | cut -d'"' -f4 | head -c 120 || echo "")
fi

echo "${TIMESTAMP} [STOP]  agent=${AGENT} session=${SESSION} status=${STATUS} result=\"${RESULT}\"" >> "$LOG_FILE"
```

## Configuración

```bash
cp hooks/subagent/subagent-stop-summary.sh .claude/hooks/
chmod +x .claude/hooks/subagent-stop-summary.sh
mkdir -p .claude/logs
```

Despliega junto a `subagent-start-logger` para obtener un registro de inicio/parada completo. Ambos hooks escriben en el mismo archivo de registro, por lo que un simple `grep agent=security-reviewer .claude/logs/subagent-activity.log` muestra el historial completo de cualquier agente.

## Notas

- Para medir la duración del subagente: `awk '/\[START\].*agent=X/{s=$1} /\[STOP\].*agent=X/{print s, $1}' subagent-activity.log` (requiere matemática de marca de tiempo — canaliza a través de Python o `dateutil` para precisión).
- Si un subagente se detiene a mitad de la ejecución puede haber un `[START]` sin un `[STOP]` correspondiente; trata esos como eventos de tiempo de espera/interrupción en tu análisis.
- Combina con el hook de ciclo de vida `cost-tracker` para correlacionar el gasto del subagente con los resultados.

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
