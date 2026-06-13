# Claude Code Routines

Las rutinas son sesiones de Claude Code programadas y recurrentes — ejecutan un prompt predefinido según un cronograma similar a cron sin su presencia. Configure una y Claude triará sus PR cada mañana, auditará dependencias cada lunes, o generará un resumen de standup antes de su 9am.

---

## Qué son las Rutinas

Una rutina es una sesión de Claude Code que:
- Inicia a una hora programada (no activada por usted)
- Ejecuta un prompt específico que usted define
- Funciona en un directorio de trabajo que especifica
- Utiliza todas las herramientas y skills configurados para ese proyecto
- Registra salida que puede revisar después

Las rutinas no son daemons. Cada invocación es una sesión nueva — sin memoria de la ejecución anterior a menos que escriba explícitamente el estado en un archivo y lo lea en el prompt.

---

## Dónde configurar

**Interfaz web:** claude.ai/code → pestaña Routines → Nueva Rutina

**Archivo de configuración** (`settings.json` o `~/.claude/settings.json`):

```json
{
  "routines": [
    {
      "name": "daily-pr-triage",
      "schedule": "0 8 * * 1-5",
      "prompt": "Review all open PRs in this repo. For each PR: check if CI is passing, identify any review comments that need a response, flag PRs older than 3 days with no activity. Write a summary to .claude/pr-triage.md",
      "workingDirectory": "/home/user/projects/my-app",
      "model": "claude-sonnet-4-5"
    }
  ]
}
```

---

## Campos de Definición de Rutina

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `name` | string | sí | Identificador único, mostrado en los registros |
| `schedule` | string | sí | Expresión cron o lenguaje natural |
| `prompt` | string | sí | El prompt completo que Claude recibe cuando inicia la sesión |
| `workingDirectory` | string | sí | Ruta absoluta; directorio de trabajo de Claude para la sesión |
| `model` | string | no | Por defecto su modelo predeterminado configurado |
| `maxTurns` | integer | no | Parada forzada después de N turnos (previene sesiones descontroladas) |
| `enabled` | boolean | no | `false` para pausar una rutina sin eliminarla |

### Formatos de Cronograma

```
# Expresión cron
"schedule": "0 8 * * 1-5"        # 8am lunes–viernes
"schedule": "0 9 * * 1"          # 9am cada lunes
"schedule": "0 23 * * *"         # 11pm cada noche
"schedule": "0 */4 * * *"        # Cada 4 horas

# Lenguaje natural (convertido a cron internamente)
"schedule": "every weekday at 8am"
"schedule": "every Monday at 9am"
"schedule": "daily at 11pm"
"schedule": "every 4 hours"
```

---

## Patrones Comunes de Rutinas

### Triage Diaria de PR

```json
{
  "name": "pr-triage",
  "schedule": "0 8 * * 1-5",
  "prompt": "Check all open PRs using gh pr list. For each: note CI status, days open, and whether there are unresolved review comments. Output a markdown table to .claude/daily-triage.md. Flag anything blocked or stale.",
  "workingDirectory": "/home/user/projects/my-app",
  "model": "claude-haiku-4-5"
}
```

### Auditoría Semanal de Dependencias

```json
{
  "name": "dep-audit",
  "schedule": "0 9 * * 1",
  "prompt": "Run npm audit and npm outdated. Summarize critical vulnerabilities and packages more than 2 major versions behind. Write findings to .claude/dep-audit.md with a recommended action for each item.",
  "workingDirectory": "/home/user/projects/my-app",
  "model": "claude-haiku-4-5"
}
```

### Ejecución de Pruebas Nocturna y Resumen

```json
{
  "name": "nightly-tests",
  "schedule": "0 23 * * *",
  "prompt": "Run the full test suite with npm test. Capture output. If any tests fail, analyze the failure, check git log for today's commits that touched those files, and write a failure report to .claude/test-failures.md including the most likely cause per failure.",
  "workingDirectory": "/home/user/projects/my-app",
  "model": "claude-sonnet-4-5",
  "maxTurns": 20
}
```

### Resumen de Standup Diario

```json
{
  "name": "standup-prep",
  "schedule": "30 8 * * 1-5",
  "prompt": "Prepare my standup briefing for today. Read: (1) git log --since=yesterday to see what I committed, (2) .claude/pr-triage.md for PR status, (3) any TODO comments I left in code yesterday. Write a 3-section standup doc to .claude/standup-today.md: What I did, What I'm doing today, Blockers.",
  "workingDirectory": "/home/user/projects/my-app",
  "model": "claude-haiku-4-5"
}
```

---

## Rutinas vs Hooks vs `/loop`

| | Rutinas | Hooks | `/loop` |
|---|---|---|---|
| **Disparador** | Cronograma (cron) | Evento en sesión activa | Continuo / intervalo en sesión actual |
| **Sesión** | Nueva sesión en cada ejecución | Se activa en sesión existente | Sesión actual |
| **¿Usted presente?** | No | Sí (o ejecutándose desatendido) | Sí (o ejecutándose desatendido) |
| **Usar para** | Tareas recurrentes en segundo plano | Automatización reactiva | Monitoreo continuo dentro de una sesión |

**Distinción clave:** Las rutinas y los hooks no son alternativas — se componen entre sí. Una rutina inicia una nueva sesión en un cronograma, y todos los hooks configurados para ese proyecto se activan en sus puntos de evento normales.

---

## Combinando Rutinas con Hooks

Cuando se ejecuta una rutina, se aplica el ciclo de vida completo de la sesión de Claude Code. Los hooks configurados en `settings.json` se activan en sus puntos de evento normales:

```
Rutina se activa a las 8am
  → Inicia nueva sesión de Claude Code
  → Claude lee el prompt y comienza a trabajar
  → Hook PostToolCall se activa después de cada uso de herramienta (ej: ejecuta linter)
  → Hook Stop se activa cuando Claude termina (ej: envía notificación a Slack)
```

Ejemplo: rutina ejecuta pruebas por la noche, hook `Stop` envía resultados a Slack:

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/notify-slack.sh"
          }
        ]
      }
    ]
  }
}
```

---

## Depurando Rutinas Fallidas

1. **Revise el registro de Rutinas** — claude.ai/code → pestaña Routines → haga clic en la rutina → vea el historial de ejecuciones. Cada ejecución muestra hora de inicio, hora de fin, número de turnos y estado de salida.

2. **Inspeccione la salida de la sesión** — la transcripción completa está disponible en la vista detallada de ejecución. Busque errores de herramienta, denegaciones de permiso o Claude deteniéndose prematuramente.

3. **Pruebe el prompt manualmente** — copie el prompt de rutina y ejecútelo interactivamente en el mismo directorio de trabajo. Esto aísla si el problema está en la lógica del prompt o en la programación.

4. **Revise `maxTurns`** — si una rutina se detiene a mitad de la tarea, puede haber alcanzado el límite de turnos. Aumente `maxTurns` o haga el prompt más enfocado.

5. **Revise directorio de trabajo** — una rutina que no puede encontrar archivos a menudo tiene un `workingDirectory` incorrecto. Utilice rutas absolutas.

---

## Gestión Programática de Rutinas

Claude Code ahora expone tres herramientas para gestionar rutinas desde dentro de una sesión — sin necesidad de editar settings.json manualmente:

**CronCreate** — cree una nueva rutina desde dentro de una sesión de Claude Code:
```
CronCreate(
  prompt: "Check all open PRs and write summary to .claude/pr-triage.md",
  schedule: "0 8 * * 1-5",
  name: "daily-pr-triage"           // optional
)
```
Devuelve el ID de la rutina creada. La rutina está inmediatamente activa.

**CronList** — liste todas las rutinas configuradas para el proyecto actual:
```
CronList()
```
Devuelve un array de rutinas con id, nombre, cronograma, hora de última ejecución, hora de próxima ejecución, y estado habilitado.

**CronDelete** — elimine una rutina por ID:
```
CronDelete(id: "routine-abc123")
```

**Cuándo importa esto:**
- Pedirle a Claude que configure una rutina durante una sesión: "Create a routine that runs my test suite every night at 11pm"
- Claude puede crear rutinas como parte de flujos de trabajo de configuración de proyectos
- Combine con el skill `skill/productivity/autofix-pr.md`: Claude configura la rutina después de instalar el skill

**Ejemplo — Claude configura su propio monitoreo:**
```
Usuario: "Set up a routine to audit our npm dependencies every Monday morning"
Claude: [llama a CronCreate con prompt y cronograma apropiados "0 9 * * 1"]
Claude: "Done — routine 'dep-audit' will run every Monday at 9am. Use CronList to verify."
```

**Crons de sesión vs rutinas persistentes:** CronCreate crea rutinas persistentes que sobreviven al final de la sesión. Para programación dentro de sesión (activarse una vez después de un retraso), use ScheduleWakeup en su lugar.

---

## Inspeccionando Rutinas Activas desde Hooks

El payload del hook Stop ahora incluye un campo `session_crons` listando todas las rutinas que estaban activas durante la sesión. Esto permite que su hook Stop registre qué rutinas están programadas, o alerte si se eliminó una rutina crítica.

Ejemplo de hook Stop que registra rutinas activas:
```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/log-session-crons.sh"
          }
        ]
      }
    ]
  }
}
```

```bash
#!/usr/bin/env bash
# log-session-crons.sh
INPUT=$(cat)
SESSION_CRONS=$(echo "$INPUT" | python3 -c "
import json, sys
data = json.load(sys.stdin)
crons = data.get('session_crons', [])
for c in crons:
    print(f\"  {c.get('name','unnamed')} → {c.get('schedule','?')}\")
")
if [ -n "$SESSION_CRONS" ]; then
  echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] Active routines this session:" >> .claude/session.log
  echo "$SESSION_CRONS" >> .claude/session.log
fi
```

---
