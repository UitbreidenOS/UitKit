# MCP: Task Master

Gestión de tareas impulsada por IA con aislamiento de contexto — desglosa características grandes en subtareas rastreadas, mantén progreso en sesiones y coordina trabajo de múltiples agentes desde un gráfico de tareas estructurado.

## Por qué lo necesitas

Las características largas abarcan múltiples sesiones e involucran a menudo streams de trabajo paralelos. Sin rastreo persistente de tareas, Claude comienza cada sesión sin saber qué está hecho, qué es lo siguiente o qué está bloqueado. Task Master resuelve esto:
- Un PRD o descripción de característica se convierte en una lista de tareas estructurada, ordenada por dependencia en una solicitud
- El progreso persiste en tu repositorio — cada sesión recoge exactamente dónde se detuvo la última
- El ordenamiento por dependencia significa que `next_task` siempre devuelve lo correcto para trabajar, no una adivinanza
- Las tareas complejas pueden expandirse en subtareas y entregarse a agentes paralelos, cada una con contexto aislado
- El análisis de complejidad destaca tareas de alto riesgo antes de que se conviertan en problemas de cronograma

## Instalación

```bash
npm install -g task-master-ai
```

## Configuración

Agrega a `~/.claude.json` o `.claude/mcp.json` del proyecto:

```json
{
  "mcpServers": {
    "taskmaster-ai": {
      "command": "npx",
      "args": ["-y", "task-master-ai"],
      "env": {
        "ANTHROPIC_API_KEY": "your-anthropic-api-key-here",
        "PERPLEXITY_API_KEY": "your-perplexity-api-key-here"
      }
    }
  }
}
```

`ANTHROPIC_API_KEY` es requerido — Task Master llama a Claude internamente para analizar PRDs y analizar tareas. `PERPLEXITY_API_KEY` es opcional; habilita desgloses de tareas mejorados con investigación que extraen prácticas recomendadas actuales.

## Herramientas clave / Qué hacen

- `initialize_project` — configurar Task Master en el proyecto actual, creando el directorio `.taskmaster/`
- `parse_prd` — leer un PRD o descripción de característica y auto-generar una lista de tareas estructurada con dependencias y prioridades
- `get_tasks` — listar todas las tareas con estado, prioridad y resumen de dependencias
- `get_task` — obtener detalles completos de una sola tarea incluyendo descripción, subtareas y notas
- `create_task` — crear manualmente una tarea con título, descripción, prioridad y dependencias
- `update_task` — actualizar título, descripción, prioridad o dependencias de una tarea
- `set_task_status` — marcar una tarea como `pending`, `in-progress`, `done` o `blocked`
- `next_task` — devolver la tarea con mayor prioridad sin bloqueos lista para trabajar, respetando orden de dependencia
- `expand_task` — desglosa una tarea en subtareas para ejecución paralela o rastreo más fino
- `add_subtask` — agregar manualmente una subtarea a una tarea existente
- `analyze_project_complexity` — calificar todas las tareas por complejidad e identificar elementos de alto riesgo con razonamiento
- `generate_task_files` — escribir archivos markdown individuales por tarea a `.taskmaster/tasks/` para contexto de agentes

## Ejemplos de uso

```
Inicializa Task Master para este proyecto, luego analiza el PRD en docs/prd.md
y genera la lista de tareas completa. Muéstrame el gráfico de dependencias.
```

```
¿Cuál es la siguiente tarea en la que debería trabajar? Respeta el orden de dependencia
y muéstrame la descripción de tarea y cualquier subtarea.
```

```
Terminé la tarea 5. Márcala como hecha, luego muéstrame qué tareas acababan
de desbloquearse y cuál tiene la mayor prioridad.
```

```
Expande la tarea 8 en subtareas lo suficientemente detalladas para ejecución de agentes paralelos.
Cada subtarea debe ser completable independientemente en menos de 2 horas.
```

```
Analiza la complejidad de todas las tareas restantes. Identifica cualquier cosa arriba
de una puntuación de complejidad de 7, explica por qué es compleja y sugiere
cómo reducirla antes de que comencemos.
```

## Autenticación

**Requerido:** `ANTHROPIC_API_KEY` — obtén de console.anthropic.com. Task Master usa Claude para analizar PRDs, analizar complejidad y expandir tareas. La clave se llama internamente por el servidor MCP, no por la sesión de Claude Code directamente.

**Opcional:** `PERPLEXITY_API_KEY` — obtén de perplexity.ai/api. Habilita a Task Master para aumentar desgloses de tareas con versiones actuales de biblioteca, problemas de migración conocidos y patrones de comunidad relevantes. Útil para tareas que involucren pilas de tecnología no familiares.

## Consejos

**Confirma `.taskmaster/` a git:** Los datos de tareas viven en `.taskmaster/tasks.json`. Confirmarlos significa que todo tu equipo ve el mismo estado de tareas, el progreso es auditable en el historial y las sesiones se reanudan con contexto completo después de cualquier brecha.

**Siempre usa `next_task` en lugar de seleccionar manualmente:** Task Master construye un gráfico de dependencia cuando analiza el PRD. `next_task` recorre este gráfico para mostrar lo que realmente está sin bloqueos y con mayor prioridad. La selección manual evita esta lógica y arriesga a iniciar tareas cuyas dependencias no están listas.

**`expand_task` antes de trabajo de agentes paralelos:** Cuando entregas a múltiples agentes a través de worktrees, expande la tarea relevante primero. Cada subtarea se convierte en una unidad de trabajo aislada con su propio contexto — los agentes no se interfieren.

**`generate_task_files` para contexto de agentes:** Escribir archivos de tareas individuales a `.taskmaster/tasks/` le da a cada agente un archivo de contexto limpio y enfocado con solo lo que necesita para una tarea. Los agentes no necesitan analizar la lista de tareas completa.

**`analyze_project_complexity` temprano:** Ejecuta análisis de complejidad justo después de `parse_prd`, antes de comenzar el trabajo. Las tareas identificadas como complejidad alta son donde vive el riesgo de cronograma. Aborda ambigüedad o desgloslas más antes de comprometerte a un cronograma.

**Las tareas bloqueadas necesitan desbloqueo explícito:** Si una tarea está marcada como `blocked`, Task Master no la mostrará a través de `next_task` hasta que su estado se actualice. Cuando se resuelva un bloqueador, establece la tarea bloqueada de vuelta a `pending` y agrega una nota explicando qué cambió.

---
