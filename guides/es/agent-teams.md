# Agent Teams — Coordinación Multi-Sesión

Agent Teams te permite ejecutar múltiples instancias de Claude Code trabajando juntas como un equipo coordinado. Una sesión actúa como el líder, coordinando trabajo, asignando tareas y sintetizando resultados. Los compañeros de equipo trabajan de forma independiente, cada uno en su propia ventana de contexto, y pueden comunicarse directamente entre sí.

A diferencia de los subagentes (que se ejecutan dentro de una única sesión y solo reportan al que los llamó), los compañeros de equipo de Agent Teams son sesiones de Claude Code completamente independientes que comparten una lista de tareas y se comunican directamente entre sí.

**Esta característica es experimental** y está deshabilitada por defecto.

---

## Cuándo Usar Agent Teams

| Caso de uso | Por qué funcionan los equipos |
|----------|---------------|
| Investigación y revisión | Múltiples compañeros investigan aspectos diferentes simultáneamente, luego comparten y cuestionan hallazgos |
| Nuevos módulos/características | Cada compañero posee una pieza separada sin interfieren uno con el otro |
| Depuración con hipótesis competentes | Los compañeros prueban diferentes teorías en paralelo y convergen más rápido |
| Coordinación entre capas | Cambios frontend, backend y pruebas cada uno propiedad de un compañero diferente |

Cuándo NO usar equipos (usa una sesión única o subagentes en su lugar):

- **Tareas secuenciales** donde cada paso depende del anterior
- **Ediciones del mismo archivo** — los compañeros se sobrescribirán mutuamente
- **Trabajo con muchas dependencias entre tareas** — el overhead de coordinación domina
- **Tareas simples** donde el overhead de crear un equipo supera el beneficio

---

## Agent Teams vs Subagentes

| | Subagentes | Agent Teams |
|---|---|---|
| Contexto | Contexto propio; resultados regresan al que llama | Contexto propio; completamente independiente |
| Comunicación | Reportan solo al agente principal | Los compañeros se comunican directamente entre sí |
| Coordinación | El agente principal gestiona todo el trabajo | Lista de tareas compartida con auto-coordinación |
| Mejor para | Tareas enfocadas donde solo importa el resultado | Trabajo complejo que requiere discusión y colaboración |
| Costo de tokens | Menor (resultados resumidos) | Mayor (cada compañero es una instancia de Claude separada) |

Regla de oro: usa subagentes cuando los trabajadores solo necesitan reportar. Usa equipos cuando los trabajadores necesitan compartir hallazgos, cuestionarse mutuamente y coordinarse por su cuenta.

---

## Habilitando Agent Teams

Añade la bandera experimental a tu configuración:

```json
// ~/.claude/settings.json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

O configúralo en tu shell:

```bash
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
```

Requiere Claude Code v2.1.32 o posterior. Verifica con `claude --version`.

---

## Iniciando un Equipo

Después de habilitar, dile a Claude que cree un equipo en lenguaje natural:

```
I'm designing a CLI tool for tracking TODO comments. Create an agent team:
one teammate on UX, one on technical architecture, one playing devil's advocate.
```

Claude crea el equipo, genera compañeros, coordina trabajo y sintetiza hallazgos. No necesitas escribir archivos de configuración — describe la estructura del equipo en tu indicación.

---

## Modos de Visualización

Dos modos de visualización controlan cómo aparecen los compañeros en tu terminal.

### En proceso (por defecto)

Todos los compañeros se ejecutan en tu terminal principal.

| Tecla | Acción |
|-----|--------|
| `Shift+Down` | Ciclar entre compañeros |
| Escribir | Enviar mensaje a un compañero directamente |
| `Enter` | Ver la sesión de un compañero |
| `Escape` | Interrumpir el turno actual del compañero |
| `Ctrl+T` | Alternar la lista de tareas compartida |

Funciona en cualquier terminal. No requiere configuración extra.

### Paneles divididos

Cada compañero obtiene su propio panel de terminal. Puedes ver la salida de todos a la vez y hacer clic en un panel para interactuar directamente.

Requiere **tmux** o **iTerm2**:
- tmux: instala vía tu gestor de paquetes (`brew install tmux`, `apt install tmux`)
- iTerm2: instala el CLI `it2` y habilita Python API en las preferencias de iTerm2

### Configuración

```json
{
  "teammateMode": "in-process"
}
```

Valores válidos: `"in-process"`, `"tmux"`, `"auto"` (detecta multiplexor de terminal disponible).

Anula por sesión:

```bash
claude --teammate-mode in-process
```

---

## Lista de Tareas y Asignación

La lista de tareas compartida coordina trabajo entre todos los compañeros. Las tareas tienen tres estados:

| Estado | Significado |
|-------|---------|
| **pending** | Aún no reclamada por ningún compañero |
| **in progress** | Reclamada y siendo trabajada activamente |
| **completed** | Completada |

Las tareas pueden depender de otras tareas. Una tarea pendiente con dependencias no resueltas no puede ser reclamada hasta que esas dependencias se completen.

### Modos de asignación

- **El líder asigna** — dile al líder qué tarea dar a qué compañero
- **Auto-reclamación** — después de terminar una tarea, un compañero automáticamente recoge la siguiente tarea sin asignar y sin bloqueos

La reclamación de tareas usa file locking para prevenir condiciones de carrera cuando múltiples compañeros intentan reclamar simultáneamente.

---

## Especificando Compañeros y Modelos

Claude decide el tamaño del equipo basado en la tarea, o puedes ser explícito:

```
Create a team with 4 teammates to refactor these modules in parallel.
Use Sonnet for each teammate.
```

Los compañeros no heredan la selección de `/model` del líder por defecto. Para cambiar esto, configura **Default teammate model** en `/config` y elige **Default (leader's model)**.

---

## Compuertas de Aprobación de Planes

Para tareas riesgosas, requiere que los compañeros planifiquen antes de implementar:

```
Spawn an architect teammate to refactor the auth module.
Require plan approval before they make any changes.
```

Cuando un compañero termina la planificación, envía una solicitud de aprobación de plan al líder. El líder revisa y puede:

- **Aprobar** — el compañero comienza la implementación
- **Rechazar con retroalimentación** — el compañero revisa el plan y lo vuelve a enviar

Puedes influir en el criterio del líder:

```
Only approve plans that include test coverage.
Reject plans that modify the database schema.
```

---

## Hablando Directamente con Compañeros

Cada compañero es una sesión de Claude Code completa e independiente. Puedes enviar un mensaje a cualquier compañero en cualquier momento.

- **Modo en proceso:** `Shift+Down` para ciclar al compañero, luego escribe tu mensaje
- **Modo paneles divididos:** haz clic en el panel del compañero y escribe directamente

---

## Usando Definiciones de Subagentes como Compañeros

Referencia un tipo de subagente existente cuando generas un compañero:

```
Spawn a teammate using the security-reviewer agent type to audit the auth module.
```

El compañero usa la lista permitida de `tools` y `model` de esa definición. El cuerpo de la definición se añade al prompt del sistema del compañero como instrucciones adicionales.

**Lo que se trasferencia:** `tools`, `model`, cuerpo del prompt del sistema.

**Lo que NO se trasferencia:** `skills` y `mcpServers`. Los compañeros cargan skills y servidores MCP desde la configuración del proyecto/usuario como cualquier sesión regular.

---

## Arquitectura y Almacenamiento

| Componente | Rol |
|-----------|------|
| Líder del equipo | Sesión principal que crea el equipo, genera compañeros, coordina |
| Compañeros | Instancias separadas de Claude Code que trabajan en tareas asignadas |
| Lista de tareas | Elementos de trabajo compartidos que los compañeros reclaman y completan |
| Buzón | Sistema de mensajería para comunicación entre agentes |

### Ubicaciones de almacenamiento

| Ruta | Contenidos |
|------|----------|
| `~/.claude/teams/{team-name}/config.json` | Configuración del equipo (auto-generada, no editar manualmente) |
| `~/.claude/tasks/{team-name}/` | Datos de lista de tareas compartida |

No hay configuración de equipo a nivel de proyecto. Un archivo como `.claude/teams/teams.json` en tu directorio de proyecto no es reconocido.

---

## Permisos

Todos los compañeros comienzan con los ajustes de permisos del líder. Si el líder se ejecuta con `--dangerously-skip-permissions`, todos los compañeros también.

Puedes cambiar modos individuales de compañeros después de generarlos, pero no en el momento de generación.

---

## Contexto y Comunicación

### Lo que reciben los compañeros

Los compañeros cargan el mismo contexto de proyecto que una sesión regular: `CLAUDE.md`, servidores MCP, skills. También reciben el prompt de generación del líder. El historial de conversación del líder NO se transfiere.

### Cómo funciona la comunicación

- Los mensajes se entregan automáticamente (no se requiere polling)
- Las notificaciones de inactividad se envían al líder cuando un compañero se detiene
- La lista de tareas compartida es visible para todos los agentes
- Envía un mensaje a cualquier compañero por nombre (nombres asignados por el líder en generación)

---

## Eventos de Hook para Agent Teams

Tres eventos de hook proporcionan compuertas de calidad para la coordinación del equipo.

### TeammateIdle

Se dispara cuando un compañero está a punto de quedarse inactivo. El código de salida `2` envía retroalimentación y mantiene el compañero trabajando.

### TaskCreated

Se dispara cuando se está creando una tarea. El código de salida `2` previene la creación con retroalimentación.

### TaskCompleted

Se dispara cuando se está marcando una tarea como completada. El código de salida `2` previene la finalización con retroalimentación.

```json
{
  "hooks": {
    "TaskCompleted": [{
      "hooks": [{
        "type": "command",
        "command": "bash ~/.claude/hooks/verify-task-tests.sh"
      }]
    }]
  }
}
```

Usa hooks `TaskCompleted` para enforcer estándares — por ejemplo, verificar que un compañero escribió pruebas antes de marcar una tarea como completada.

---

## Apagado y Limpieza

### Apagando un compañero

```
Ask the researcher teammate to shut down.
```

El compañero puede aprobar (salida elegante) o rechazar con una explicación de por qué debe seguir ejecutándose.

### Limpiando el equipo

```
Clean up the team.
```

Siempre usa el líder para limpiar. Los compañeros no deben ejecutar limpieza por sí mismos. Apaga todos los compañeros antes de ejecutar limpieza.

---

## Mejores Prácticas

1. **Tamaño del equipo: 3-5 compañeros.** Más significa más overhead de coordinación con retornos decrecientes.
2. **Tareas por compañero: 5-6.** Mantiene a todos productivos sin cambio de contexto excesivo.
3. **Da contexto.** Los compañeros no heredan la conversación del líder. Incluye detalles específicos de tarea en prompts de generación.
4. **Evita conflictos de archivos.** Asigna a cada compañero archivos diferentes. Dos compañeros editando el mismo archivo causa sobrescrituras.
5. **Comienza con investigación.** Si eres nuevo en equipos, comienza con tareas que no impliquen código (revisión, investigación, investigación) antes de implementación paralela.
6. **Monitorea y dirige.** Verifica el progreso. Dejar un equipo ejecutándose desatendido demasiado tiempo aumenta el riesgo de esfuerzo desperdiciado.
7. **Espera a los compañeros.** Dile al líder "espera a que tus compañeros completen sus tareas antes de proceder" si comienza implementando en lugar de delegar.

---

## Ejemplos de Casos de Uso

### Revisión Paralela de Código

```
Create an agent team to review PR #142. Spawn three reviewers:
- One focused on security implications
- One checking performance impact
- One validating test coverage
Have them each review and report findings.
```

### Hipótesis Competentes

```
Users report the app exits after one message. Spawn 5 teammates to
investigate different hypotheses. Have them talk to each other to
disprove each other's theories. Update findings doc with consensus.
```

### Característica Entre Capas

```
Build the notifications feature. Spawn teammates:
- Backend: API endpoints and database schema
- Frontend: React components and state management
- Tests: integration and unit tests for both layers
Each teammate owns their layer. Coordinate via the shared task list.
```

---

## Limitaciones

- Sin reanudación de sesión con `/resume` o `/rewind` para compañeros en proceso
- El estado de la tarea puede retrasarse — los compañeros a veces no marcan tareas como completadas
- El apagado puede ser lento (los compañeros terminan su solicitud actual primero)
- Un equipo a la vez por líder
- Sin equipos anidados (los compañeros no pueden generar sus propios equipos)
- El líder está fijo para la vida útil del equipo
- Los permisos se configuran en generación (cambiar individualmente después, no en tiempo de generación)
- Los paneles divididos requieren tmux o iTerm2 (no terminal VS Code, Windows Terminal, o Ghostty)

---

## Costo de Tokens

Agent Teams usa significativamente más tokens que una sesión única. Cada compañero tiene su propia ventana de contexto, y el uso de tokens se escala linealmente con compañeros activos.

Para investigación, revisión y nuevas características, los tokens extra usualmente valen la pena. Para tareas rutinarias, una sesión única es más rentable.

---
