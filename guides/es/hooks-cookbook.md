# Libro de Recetas de Hooks

Patrones de hooks reales y listos para usar para automatizar calidad, seguridad y observabilidad en Claude Code.

---

## Fundamentos de Hooks

Los hooks son scripts de shell o comandos que Claude Code ejecuta automáticamente en respuesta a eventos. Se ejecutan fuera del contexto de Claude — son procesos de shell reales, no instrucciones de Claude.

**Eventos de hook:**
| Evento | Cuándo se dispara |
|---|---|
| `SessionStart` | Cuando comienza una sesión de Claude Code |
| `PreToolUse` | Antes de que se ejecute cualquier llamada de herramienta |
| `PostToolUse` | Después de que se complete cualquier llamada de herramienta |
| `PreCompact` | Antes de que se dispare la compactación de contexto |
| `PostCompact` | Después de que se complete la compactación de contexto |
| `Stop` | Cuando Claude termina de responder |
| `Notification` | Cuando Claude envía una notificación de escritorio |

**Ubicación de configuración de hook:** `.claude/settings.json` (proyecto) o `~/.claude/settings.json` (nivel de usuario)

**Estructura básica de hook:**
```json
{
  "hooks": {
    "EventName": [
      {
        "matcher": "ToolName",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/your-script.sh",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

**Matcher:** Filtra qué llamadas de herramienta disparan el hook. String vacío `""` coincide con todos. `"Bash"` solo coincide con llamadas de herramienta Bash. `"Write|Edit"` coincide con Write o Edit.

---

## Receta 1 — Auto-formato Prettier en Escritura de Archivo

Formatea automáticamente archivos después de que Claude los escribe o edita. Sin más indicaciones "por favor ejecuta prettier".

**settings.json:**
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write ${tool_input.file_path}",
            "async": true
          }
        ]
      }
    ]
  }
}
```

**Notas:**
- `async: true` ejecuta el formateo en el fondo — Claude no espera por ello
- Solo se ejecuta en llamadas de herramienta Write y Edit
- `${tool_input.file_path}` es la ruta del archivo que fue escrito

---

## Receta 2 — Bloquear Comandos Shell Peligrosos

Previene que Claude ejecute comandos destructivos incluso si decide intentarlo.

**.claude/hooks/block-dangerous.sh:**
```bash
#!/usr/bin/env bash
# Lee la entrada de herramienta de stdin como JSON
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('command',''))")

# Patrones bloqueados
BLOCKED_PATTERNS=("rm -rf" "sudo " "| bash" "| sh" "curl.*| " "wget.*| " "git push --force" "git reset --hard" "DROP TABLE" "truncate ")

for pattern in "${BLOCKED_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -qi "$pattern"; then
    echo "BLOCKED: command matches dangerous pattern '$pattern'" >&2
    exit 2  # Código de salida 2 = bloquear la llamada de herramienta
  fi
done

exit 0  # Permitir
```

**settings.json:**
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/block-dangerous.sh",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

**Códigos de salida:** `0` = permitir, `1` = advertencia (Claude ve la salida pero continúa), `2` = bloquear (llamada de herramienta cancelada).

---

## Receta 3 — Registro de Auditoría de Cada Llamada de Herramienta

Registra cada llamada de herramienta con timestamp, nombre de herramienta y resumen de entrada. Esencial para depuración y auditoría de seguridad.

**.claude/hooks/audit-log.sh:**
```bash
#!/usr/bin/env bash
INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('tool_name','unknown'))" 2>/dev/null)
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
LOG_FILE="${CLAUDE_PROJECT_DIR}/.claude/logs/audit.log"

mkdir -p "$(dirname "$LOG_FILE")"
echo "${TIMESTAMP} | ${TOOL_NAME} | $(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); inp=d.get('tool_input',{}); print(str(inp)[:200])" 2>/dev/null)" >> "$LOG_FILE"
```

**settings.json:**
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/audit-log.sh",
            "async": true
          }
        ]
      }
    ]
  }
}
```

Añade `.claude/logs/` a `.gitignore`.

---

## Receta 4 — Guardador de Estado de Sesión Pre-Compactación

Antes de que se dispare la compactación, guarda el estado de sesión actual para que el contexto sobreviva.

**.claude/hooks/pre-compact-save.sh:**
```bash
#!/usr/bin/env bash
MEMORY_FILE="${CLAUDE_PROJECT_DIR}/.claude/memory/session-state.md"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

mkdir -p "$(dirname "$MEMORY_FILE")"

cat >> "$MEMORY_FILE" << EOF

---
## Session snapshot: ${TIMESTAMP}
[Claude will append a summary here during PreCompact]
EOF
```

**settings.json:**
```json
{
  "hooks": {
    "PreCompact": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/pre-compact-save.sh"
          }
        ]
      }
    ]
  }
}
```

Empareja esto con una instrucción CLAUDE.md: "Cuando se dispare PreCompact, resume: tarea actual, archivos cambiados, decisiones abiertas, próximos pasos — añade a `.claude/memory/session-state.md`."

---

## Receta 5 — Rastreador de Costos

Estima costos de tokens por sesión y regístralos.

**.claude/hooks/cost-tracker.sh:**
```bash
#!/usr/bin/env bash
INPUT=$(cat)
COST_FILE="${CLAUDE_PROJECT_DIR}/.claude/logs/costs.log"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

mkdir -p "$(dirname "$COST_FILE")"

# Extrae datos de uso si está disponible
USAGE=$(echo "$INPUT" | python3 -c "
import sys, json
d = json.load(sys.stdin)
usage = d.get('usage', {})
inp = usage.get('input_tokens', 0)
out = usage.get('output_tokens', 0)
print(f'input={inp} output={out}')
" 2>/dev/null || echo "usage=unavailable")

echo "${TIMESTAMP} | ${USAGE}" >> "$COST_FILE"
```

**settings.json:**
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/cost-tracker.sh",
            "async": true
          }
        ]
      }
    ]
  }
}
```

---

## Receta 6 — Verificación de Tipo TypeScript en Edición

Ejecuta `tsc --noEmit` después de que Claude edita archivos TypeScript. Detecta errores de tipo antes de que se comprueben.

**settings.json:**
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'echo \"${tool_input.file_path}\" | grep -q \"\\.tsx\\?$\" && npx tsc --noEmit 2>&1 | head -20 || true'",
            "async": false,
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

Configura `async: false` para que Claude vea los errores de tipo y pueda corregirlos inmediatamente.

---

## Receta 7 — Recordatorio de Git Push

Recuerda a Claude que confirme antes de cualquier operación de git push.

**.claude/hooks/git-push-confirm.sh:**
```bash
#!/usr/bin/env bash
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('command',''))" 2>/dev/null)

if echo "$COMMAND" | grep -q "git push"; then
  echo "⚠️  About to push to remote. Confirm this is intentional." >&2
  exit 1  # Advertencia — Claude ve esto y debería preguntar al usuario antes de proceder
fi

exit 0
```

**settings.json:**
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/git-push-confirm.sh"
          }
        ]
      }
    ]
  }
}
```

---

## Receta 8 — Cargador de Contexto de Inicio de Sesión

Al inicio de sesión, recuerda automáticamente a Claude que lea archivos de contexto clave.

**.claude/hooks/session-start.sh:**
```bash
#!/usr/bin/env bash
# Salida de texto que se prepone al contexto de Claude al inicio de sesión
MEMORY_FILE="${CLAUDE_PROJECT_DIR}/.claude/memory/session-state.md"

if [ -f "$MEMORY_FILE" ]; then
  echo "Previous session state found at .claude/memory/session-state.md — read it before starting work."
fi

if [ -f "${CLAUDE_PROJECT_DIR}/CONTEXT.md" ]; then
  echo "Domain glossary available at CONTEXT.md — read it for project terminology."
fi
```

**settings.json:**
```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/session-start.sh"
          }
        ]
      }
    ]
  }
}
```

---

## Combinando Hooks

Los hooks se componen — puedes tener múltiples hooks en el mismo evento, cada uno con diferentes matchers.

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          { "type": "command", "command": "npx prettier --write ${tool_input.file_path}", "async": true }
        ]
      },
      {
        "matcher": "Write|Edit",
        "hooks": [
          { "type": "command", "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/tsc-check.sh", "async": false }
        ]
      },
      {
        "matcher": "",
        "hooks": [
          { "type": "command", "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/audit-log.sh", "async": true }
        ]
      }
    ]
  }
}
```

Esto ejecuta: prettier (async) + verificación de TypeScript (sync, Claude espera) + registro de auditoría (async) en cada escritura de archivo.

---

## Solución de Problemas de Hooks

**Hook no se dispara:**
- Verifica que el nombre del evento sea exacto: `PreToolUse`, `PostToolUse`, `SessionStart`, `PreCompact`
- Verifica que el script sea ejecutable: `chmod +x .claude/hooks/your-script.sh`
- Verifica que la ruta use `${CLAUDE_PROJECT_DIR}` correctamente

**Hook bloqueando todo:**
- Si tu hook sale con `2` en cada llamada, todas las llamadas de herramienta se bloquean
- Añade logging al hook para ver qué entrada está recibiendo
- Prueba el hook manualmente: `echo '{"tool_name":"Bash","tool_input":{"command":"ls"}}' | bash .claude/hooks/your-script.sh`

**Hook ejecutando pero salida no visible:**
- Stdout de hooks async se descarta. Usa stderr (`>&2`) para mensajes que quieras ver.
- Para hooks sync, stdout se muestra a Claude; stderr se muestra al usuario.

---

## Capacidades Avanzadas de Hook

### continueOnBlock

Por defecto, cuando un hook PostToolUse sale con código `2` para bloquear una llamada de herramienta, el turno de Claude termina. Con `continueOnBlock: true`, la razón del bloqueo se alimenta de vuelta a Claude como un mensaje y el turno continúa — Claude puede leer la razón e intentar un enfoque diferente sin requerir intervención del usuario.

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Bash",
      "hooks": [{"type": "command", "command": "bash /hooks/validate-command.sh"}],
      "continueOnBlock": true
    }]
  }
}
```

Caso de uso principal: hooks de lint y formateo que bloquean en violaciones y permiten que Claude auto-corrija el archivo e intente de nuevo, en lugar de detenerse y esperar un indicador humano.

---

### terminalSequence output

Los hooks pueden emitir secuencias de escape OSC en su stdout JSON para disparar notificaciones de escritorio, configurar el título de la ventana, o hacer sonar la campana del terminal — sin requerir un terminal controlador.

```python
import json, sys

result = {
    "terminalSequence": "\033]0;Claude — Task Complete\007",  # configura el título de la ventana
}
print(json.dumps(result))
```

Útil para exponer estado de finalización o errores en la barra de título de la ventana cuando se ejecutan tareas largas en el fondo.

---

### exec form (args array)

En lugar de un string `command`, pasa un array `args` para generar el proceso de hook directamente sin invocar un shell. Esto elimina problemas de entrecomillado y escape cuando valores interpolados como `${tool_name}` o `${tool_input}` contienen espacios, comillas o caracteres especiales.

```json
{
  "type": "command",
  "command": {
    "args": ["/usr/local/bin/my-hook", "--tool", "${tool_name}", "--input", "${tool_input}"]
  }
}
```

Usa la forma args para cualquier hook que reciba datos estructurados de entradas de herramienta. Usa la forma string solo cuando genuinamente necesites características de shell (pipes, condicionales, globs).

---

### type: "mcp_tool"

Los hooks pueden llamar a una herramienta en un servidor MCP ya conectado directamente, sin generar un subproceso. Esto tiene menor overhead que un script de shell y mantiene el hook dentro del contexto de autenticación de la conexión MCP.

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write",
      "hooks": [{
        "type": "mcp_tool",
        "server": "my-mcp-server",
        "tool": "log_file_write",
        "input": {"path": "${tool_input.file_path}"}
      }]
    }]
  }
}
```

El servidor MCP nombrado en `server` debe estar ya conectado en la sesión. El campo `tool` es el nombre exacto de herramienta expuesto por ese servidor. Usa este patrón para logging de auditoría, notificaciones, o sincronización de estado via MCP sin añadir una capa de subproceso.

---

### PreCompact — bloquear compactación

Los hooks PreCompact pueden bloquear activamente la compactación saliendo con código `2` o devolviendo `{"decision": "block"}` en stdout. Usa esto para ejecutar una operación de guardado o respaldo y solo permitir que la compactación proceda una vez que el estado está seguramente persistido.

**.claude/hooks/pre-compact-backup.sh:**
```bash
#!/bin/bash
# Guarda transcripción primero, luego permite compactación
cp .claude/session.jsonl .claude/backups/session-$(date +%s).jsonl
# Salida 0 para permitir compactación, salida 2 para bloquearla
exit 0
```

Si el respaldo falla y quieres prevenir la compactación, sal con `2`. Claude expondrá la razón del bloqueo y la sesión continúa sin compactar.

---

### Hooks con ámbito de agente

Los hooks pueden estar limitados a un agente específico añadiendo un campo `hooks:` al frontmatter del agente. Estos hooks solo se disparan cuando ese agente es el agente activo — no afectan la sesión raíz u otros agentes.

```yaml
---
name: my-agent
description: "..."
hooks:
  Stop:
    - type: command
      command: echo "Agent finished" >> .claude/agent.log
---
```

Usa hooks con ámbito de agente para observabilidad específica del agente (logging cuando un agente se completa), limpieza de recursos (eliminando archivos temp que el agente creó), o seguimiento de costos limitado a la actividad de un único agente.

---

### effort.level en entorno de hook

El nivel de esfuerzo activo está disponible como la variable de entorno `$CLAUDE_EFFORT` dentro de scripts de hook. Valores: `low`, `normal`, `high`, `xhigh`.

```bash
#!/bin/bash
if [ "$CLAUDE_EFFORT" = "xhigh" ]; then
  echo "Running extended validation..."
  run-full-test-suite
fi
```

Usa esto para ejecutar validación costosa condicionalmente solo cuando Claude está operando en modo de esfuerzo extendido, o para saltar verificaciones opcionales en esfuerzo bajo para reducir latencia.

---

### Hooks Condicionales `if:`

Ejecuta un hook solo cuando una condición es verdadera. El campo `if:` toma una expresión de shell que se evalúa antes de que el hook se ejecute. Si sale con código distinto de cero, el hook se omite completamente.

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write",
      "if": "echo \"$TOOL_INPUT\" | grep -q '\\.(ts|tsx)$'",
      "hooks": [{"type": "command", "command": "npx tsc --noEmit"}]
    }]
  }
}
```

La expresión `if:` tiene acceso a las mismas variables de entorno que el hook mismo — `$TOOL_INPUT`, `$TOOL_NAME`, `$CLAUDE_PROJECT_DIR`, `$CLAUDE_EFFORT`, etc.

**Patrones `if:` comunes:**

Ejecuta solo en archivos TypeScript:
```bash
"if": "echo \"$TOOL_INPUT\" | grep -q '\\.tsx\\?$'"
```

Ejecuta solo cuando está en la rama main:
```bash
"if": "[ \"$(git branch --show-current)\" = \"main\" ]"
```

Ejecuta solo cuando existe un archivo de configuración específico:
```bash
"if": "[ -f .env.production ]"
```

Ejecuta solo en esfuerzo xhigh:
```bash
"if": "[ \"$CLAUDE_EFFORT\" = \"xhigh\" ]"
```

Los hooks condicionales se componen limpidamente con el sistema matcher existente — el matcher filtra por nombre de herramienta, `if:` filtra por condiciones en tiempo de ejecución. Usa ambos juntos para crear triggers de hook precisos y de bajo overhead.

---

### `background_tasks` y `session_crons` en Hooks Stop/SubagentStop

Los payloads de hook `Stop` y `SubagentStop` ahora incluyen dos campos adicionales que reportan qué sigue ejecutándose cuando la sesión termina:

```json
{
  "event": "Stop",
  "background_tasks": [
    {"id": "task-123", "status": "running", "started_at": "2026-05-23T10:00:00Z"}
  ],
  "session_crons": [
    {"id": "cron-456", "schedule": "0 * * * *", "last_run": "2026-05-23T09:00:00Z"}
  ]
}
```

**`background_tasks`** — tareas iniciadas vía `claude --bg` o generadas por el agente durante la sesión que siguen ejecutándose en el tiempo de parada.

**`session_crons`** — trabajos recurrentes registrados con `/loop` o la API de Cron que están programados y siguen activos.

**Casos de uso:**

Espera tareas de fondo antes de archivar:
```bash
#!/bin/bash
INPUT=$(cat)
RUNNING=$(echo "$INPUT" | python3 -c "
import sys, json
d = json.load(sys.stdin)
tasks = d.get('background_tasks', [])
print(len([t for t in tasks if t['status'] == 'running']))
" 2>/dev/null || echo "0")

if [ "$RUNNING" -gt 0 ]; then
  echo "Session stopped with $RUNNING background task(s) still running." >&2
fi
```

Alerta cuando un cron será huérfano por finalización de sesión:
```bash
#!/bin/bash
INPUT=$(cat)
CRON_COUNT=$(echo "$INPUT" | python3 -c "
import sys, json
d = json.load(sys.stdin)
print(len(d.get('session_crons', [])))
" 2>/dev/null || echo "0")

if [ "$CRON_COUNT" -gt 0 ]; then
  echo "Warning: $CRON_COUNT session cron(s) will stop when this session ends." >&2
fi
```

Registra este script como un hook `Stop` con `matcher: ""` para ejecutarlo en cada finalización de sesión.

---

## Reemplazo de Salida PostToolUse

Los hooks PostToolUse pueden reemplazar lo que Claude ve de la salida de CUALQUIER herramienta — no solo herramientas MCP. Esta es una de las características de hook más impactantes para gestionar el presupuesto de contexto, ya que los resultados de herramienta consumen ~60% de tokens de contexto en sesiones típicas agentics.

**Cómo funciona:**
El hook recibe la salida de herramienta en stdin. Puede devolver una versión modificada via `hookSpecificOutput.updatedToolOutput`. Claude ve la salida reemplazada en lugar de la original. La herramienta ya se ejecutó — archivos escritos, comandos ejecutados, solicitudes de red enviadas — así que esto solo cambia lo que entra en el contexto de Claude, no lo que sucedió.

**Configuración:**
```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Bash",
      "hooks": [{
        "type": "command",
        "command": "python3 ~/.claude/hooks/compress-output.py"
      }]
    }]
  }
}
```

**Ejemplo de script — comprimir salida de bash verbosa:**
```python
#!/usr/bin/env python3
"""Compress Bash tool output that exceeds a threshold."""
import json, sys

THRESHOLD = 10_000  # characters

data = json.load(sys.stdin)
output = data.get("tool_output", "")

if len(output) > THRESHOLD:
    # Mantén primeros 2000 y últimos 2000 caracteres, resume el medio
    compressed = (
        output[:2000]
        + f"\n\n... [{len(output) - 4000} characters truncated] ...\n\n"
        + output[-2000:]
    )
    result = {
        "hookSpecificOutput": {
            "updatedToolOutput": compressed
        }
    }
    print(json.dumps(result))
else:
    # Salida sin cambios — no imprime nada (sin reemplazo)
    pass
```

**Casos de uso:**
- **Redactar secretos:** escanea la salida para claves de API/tokens y reemplaza con `[REDACTED]` antes de que Claude los vea
- **Normalizar diffs:** elimina ruido de salida git diff (timestamps, líneas de índice)
- **Comprimir salida verbosa:** trunca registros de npm install, resultados de consulta grandes, salida de construcción
- **Recuperación de presupuesto de contexto:** los resultados de herramienta consumen ~60% de tokens; reemplazar 50K caracteres con 500 caracteres recupera contexto masivo

**Importante:** la salida original se captura en telemetría/análisis antes de que el hook se ejecute. El reemplazo solo afecta lo que Claude ve en su ventana de contexto.

**Disponible desde:** v2.1.121+

---

## Eventos de Hook de Equipo de Agentes

Tres eventos de hook específicamente para Agent Teams. Estos se disparan durante coordinación de equipo y te permiten enforcer compuertas de calidad en gestión de tareas.

### TeammateIdle

Se dispara cuando un compañero está a punto de quedarse inactivo (dejar de trabajar). Usa para mantener a los compañeros productivos.

- **Salida 0:** permite que el compañero se quede inactivo
- **Salida 2:** envía retroalimentación al compañero y lo mantiene trabajando

```json
{
  "hooks": {
    "TeammateIdle": [{
      "hooks": [{
        "type": "command",
        "command": "bash ~/.claude/hooks/check-remaining-tasks.sh"
      }]
    }]
  }
}
```

```bash
#!/bin/bash
# check-remaining-tasks.sh — mantén al compañero trabajando si quedan tareas
PENDING=$(cat ~/.claude/tasks/*/tasks.json 2>/dev/null | python3 -c "
import json,sys
tasks = json.load(sys.stdin)
pending = [t for t in tasks if t.get('status') == 'pending']
print(len(pending))
" 2>/dev/null || echo "0")

if [ "$PENDING" -gt 0 ]; then
  echo "There are $PENDING pending tasks. Pick up the next one."
  exit 2  # mantén trabajando
fi
exit 0  # permite inactividad
```

### TaskCreated

Se dispara cuando una tarea está siendo añadida a la lista de tareas compartida. Usa para enforcer estándares de calidad de tarea.

- **Salida 0:** permite creación de tarea
- **Salida 2:** previene creación y envía retroalimentación

```json
{
  "hooks": {
    "TaskCreated": [{
      "hooks": [{
        "type": "command",
        "command": "python3 ~/.claude/hooks/validate-task.py"
      }]
    }]
  }
}
```

Caso de uso: rechazar tareas que son demasiado vagas (sin criterios de aceptación), demasiado grandes (necesita splitting), o tareas duplicadas existentes.

### TaskCompleted

Se dispara cuando una tarea está siendo marcada como completada. Usa como compuerta de calidad.

- **Salida 0:** permite finalización
- **Salida 2:** previene finalización y envía retroalimentación (el compañero debe dirigirse al problema)

```json
{
  "hooks": {
    "TaskCompleted": [{
      "hooks": [{
        "type": "command",
        "command": "bash ~/.claude/hooks/verify-tests-pass.sh"
      }]
    }]
  }
}
```

```bash
#!/bin/bash
# verify-tests-pass.sh — bloquea finalización de tarea si las pruebas fallan
if ! npm test --silent 2>/dev/null; then
  echo "Tests are failing. Fix test failures before marking this task complete."
  exit 2  # bloquea finalización
fi
exit 0  # permite finalización
```

**Nota:** Estos hooks solo se disparan cuando Agent Teams está habilitado (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`). No tienen efecto en modo de sesión única regular.

---

## Trabaja Con Nosotros
