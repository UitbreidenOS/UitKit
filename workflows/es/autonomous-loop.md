# Bucle de Tareas Autónomas

Sesión de Claude Code de larga duración que procesa una cola de tareas sin intervención humana — lee tareas, las ejecuta, verifica, las marca como completadas y continúa hasta que la cola está vacía o se cumple una condición de terminación.

---

## Cuándo usar

- Procesamiento de grandes acumulaciones de tareas similares (revisión de código, migración, arreglos de lint, generación de pruebas)
- Ejecuciones de automatización nocturna o de fin de semana cuando ningún humano está disponible para continuar sesiones
- Pasos de tubería CI/CD que requieren juicio agentivo, no solo ejecución de scripts
- Operaciones por lotes donde la unidad de trabajo está bien definida y el límite de error es claro

No use para tareas que requieren juicio humano en cada elemento, operaciones destructivas sin validación de dry-run o flujos de trabajo donde una sola mala decisión se propaga en cascada a todas las tareas restantes.

---

## Fases / Pasos

### El patrón de bucle

```
leer tarea de cola
  → ejecutar tarea
    → verificar salida
      → marcar como completada / fallida
        → leer siguiente tarea (o terminar)
```

Cada iteración escribe el estado antes de continuar. Si la sesión muere a mitad de una tarea, la siguiente sesión retoma desde el último estado comprometido en lugar de volver a ejecutar trabajo completado.

---

### Formato de cola de tareas

Las tareas residen en `.claude/tasks.jsonl` — un objeto JSON por línea, añadido en orden.

```jsonl
{"id": "t_001", "type": "review_pr", "payload": {"pr_number": 1042, "repo": "api-service"}, "status": "pending"}
{"id": "t_002", "type": "review_pr", "payload": {"pr_number": 1043, "repo": "api-service"}, "status": "pending"}
{"id": "t_003", "type": "auto_merge", "payload": {"pr_number": 1038, "repo": "api-service"}, "status": "pending", "requires_approval": true}
```

**Valores de estado:** `pending` → `in_progress` → `done` | `failed` | `skipped`

**Campos requeridos:** `id` (único), `type` (clave de manejador de tareas), `payload` (datos específicos de la tarea), `status`

**Campos opcionales:**
- `requires_approval: true` — puerta de bucle humano antes de la ejecución
- `dry_run: true` — ejecutar lógica pero omitir escrituras/mutaciones
- `depends_on: ["t_001"]` — no ejecutar hasta que las tareas listadas sean `done`
- `max_retries: 3` — reintentar tras fallos antes de marcar como `failed`

---

### Persistencia de estado

Después de completar cada tarea (éxito o fracaso), escribir el estado actualizado a `.claude/loop-state.json`:

```json
{
  "session_id": "loop_20260523_1400",
  "started_at": "2026-05-23T14:00:00Z",
  "last_updated": "2026-05-23T14:47:33Z",
  "iteration": 17,
  "tasks_total": 50,
  "tasks_done": 16,
  "tasks_failed": 1,
  "tasks_remaining": 33,
  "error_count": 1,
  "last_task_id": "t_016",
  "status": "running"
}
```

Al iniciar sesión, el bucle lee este archivo para reanudar desde donde se dejó. Si el archivo no existe, es una ejecución nueva.

---

### Mecanismo Keepalive

Las sesiones de Claude Code terminan cuando Claude deja de responder. El gancho Stop inyecta un mensaje de continuación para reiniciar automáticamente el bucle.

**Entrada `.claude/settings.json`:**

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/loop-keepalive.sh"
          }
        ]
      }
    ]
  }
}
```

**`.claude/loop-keepalive.sh`:**

```bash
#!/bin/bash
# Only keepalive if loop is active and not terminated
STATE_FILE=".claude/loop-state.json"
STOP_SENTINEL=".claude/stop"

if [ -f "$STOP_SENTINEL" ]; then
  echo "Stop sentinel found. Loop terminated." >&2
  exit 0
fi

if [ ! -f "$STATE_FILE" ]; then
  exit 0
fi

STATUS=$(python3 -c "import json,sys; d=json.load(open('$STATE_FILE')); print(d.get('status',''))")
if [ "$STATUS" = "running" ]; then
  echo "Continue the autonomous loop. Read .claude/loop-state.json for current position and .claude/tasks.jsonl for the task queue. Resume from where you left off."
fi
```

El gancho se activa cuando Claude se detiene. Si el bucle todavía está en estado `running`, el mensaje de continuación hace que Claude Code reinicie automáticamente el bucle.

---

### Condiciones de terminación del bucle

El bucle termina (establece `status: terminated` en loop-state.json) cuando cualquiera de estas es verdadera:

| Condición | Disparador | Acción |
|-----------|---------|--------|
| Cola vacía | Sin tareas `pending` restantes | Establecer estado `completed` |
| Max iteraciones | `iteration >= max_iterations` (predeterminado 200) | Establecer estado `terminated_max_iter` |
| Umbral de error | `error_count >= error_budget` (predeterminado 5) | Establecer estado `terminated_error_budget` |
| Centinela de parada | Archivo `.claude/stop` existe | Establecer estado `terminated_sentinel` |
| Eliminación manual | `SIGINT` / `SIGTERM` | Escribir estado, establecer estado `terminated_signal` |

Para detener un bucle en ejecución: `touch .claude/stop` — la siguiente verificación de keepalive verá el centinela y se detendrá.

---

### Barreras de seguridad

**Puertas de aprobación humana:**

Para tareas con `requires_approval: true`, el bucle se pausa y emite:

```
[LOOP PAUSED — human approval required]
Task: t_003 (auto_merge pr #1038)
Payload: {"pr_number": 1038, "repo": "api-service"}
Type 'approve t_003' to continue or 'skip t_003' to skip this task.
```

El bucle espera una respuesta humana antes de continuar. Esto es apropiado para operaciones destructivas (merges, deletes, deploys) incluso en una sesión por lo demás autónoma.

**Modo dry-run:**

Pasar `--dry-run` al mensaje inicial del bucle, o establecer `dry_run: true` en tareas individuales. En modo dry-run, el bucle ejecuta todos los pasos de lectura y análisis pero omite escrituras, mutaciones de API y efectos secundarios. Dry-run es el primer paso correcto para cualquier tipo de tarea nueva.

**Auto-interrupción de presupuesto de error:**

```python
if state["error_count"] >= ERROR_BUDGET:
    state["status"] = "terminated_error_budget"
    write_state(state)
    print(f"[LOOP ABORTED] Error budget of {ERROR_BUDGET} exceeded. "
          f"Last failed task: {state['last_task_id']}. Review .claude/loop-state.json.")
    break
```

El presupuesto de error predeterminado es de 5 fallos consecutivos o acumulativos. Mayor para tareas ruidosas, menor para operaciones de alto riesgo.

---

### Indicador del bucle

El indicador que inicia o reanuda un bucle autónomo:

```
You are running an autonomous task loop. Your state is in .claude/loop-state.json and your task queue is in .claude/tasks.jsonl.

Loop rules:
1. Read loop-state.json to find your current position.
2. Read the next pending task from tasks.jsonl.
3. Execute the task according to its type and payload.
4. Verify the output meets the task's success criteria.
5. Update the task's status in tasks.jsonl (done/failed/skipped).
6. Update loop-state.json with current progress.
7. If the task has requires_approval: true, pause and wait for human input.
8. Check termination conditions. If none apply, proceed to the next task.

On any unexpected error: mark the task failed, increment error_count in state, and continue unless error_count >= error_budget.

Do not ask for permission between tasks unless requires_approval is set. Work autonomously.
```

---

## Ejemplo

**Caso de uso CI/CD: revisión automática y auto-merge de 50 PRs**

**Configuración:**

```bash
# Generate task queue from open PRs
gh pr list --repo my-org/api-service --state open --limit 50 --json number \
  | jq -r '.[] | {"id": ("t_" + (.number|tostring)), "type": "review_pr", "payload": {"pr_number": .number, "repo": "api-service"}, "status": "pending"}' \
  > .claude/tasks.jsonl

# Add auto-merge tasks for PRs that pass review (depends_on will be set by the loop)
# The review task itself appends an auto_merge task if review passes
```

**Lógica del manejador de tareas (en indicador de bucle):**

- `review_pr`: obtener diff de PR con `gh pr diff {pr_number}`, ejecutar habilidad de revisión de código, publicar comentario de revisión, añadir resultado al estado
- `auto_merge`: si la revisión pasó y CI es verde (`gh pr checks {pr_number}`), fusionar con `gh pr merge {pr_number} --squash`; si CI está pendiente, marcar como `skipped` y volver a encolar

**Procesamiento paralelo:**

Para tareas independientes (todas las tareas de revisión, sin dependencias de fusión), generar subagentos:

```
For tasks t_001 through t_025: spawn a subagent for each review_pr task.
Each subagent writes its result back to tasks.jsonl atomically (use file locking).
Wait for all subagents to complete before processing auto_merge tasks.
```

**Ejecución del bucle (50 PRs):**

```
[14:00:00] Loop started. 50 tasks pending.
[14:00:05] Spawned 25 review subagents (t_001–t_025)
[14:12:30] Reviews complete: 22 passed, 3 failed (changes requested)
[14:12:30] Processing auto_merge tasks for 22 approved PRs
[14:14:15] 19 merged (CI green). 3 skipped (CI pending — re-queued for next run).
[14:14:15] Queue empty. Loop completed. 41 done, 3 skipped, 3 failed (changes requested).
[14:14:15] Status: completed. Written to .claude/loop-state.json.
```

Tiempo total: ~14 minutos para 50 PRs. Tiempo manual equivalente: 3–4 horas.

---
