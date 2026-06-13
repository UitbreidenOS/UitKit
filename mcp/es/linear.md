# MCP: Linear

Gestiona problemas, proyectos y ciclos de Linear directamente desde Claude Code — consulta tickets, actualiza estado, crea problemas y ejecuta flujos de trabajo de clasificación sin cambiar al navegador.

## Por qué lo necesitas

Linear es donde se rastrea el trabajo de ingeniería. Sin MCP, Claude puede escribir código pero no tiene conciencia de lo que el equipo realmente está haciendo, qué está bloqueado o qué está en el sprint actual. Con Linear MCP:
- El contexto del problema fluye directamente a sesiones de código — sin copiar y pegar descripciones de tickets
- Crear problemas a partir del código (TODOs, descubrimientos de bugs, candidatos de refactor) toma una solicitud
- La planificación de sprints, la clasificación y las actualizaciones de estado ocurren en el mismo flujo de trabajo que el desarrollo
- Los reportes entre proyectos (velocidad, bloqueadores, gráficos de quemado de ciclos) están a una consulta de distancia

## Instalación

```bash
npm install -g @linear/mcp-server
```

## Configuración

Agrega a `~/.claude.json` o `.claude/mcp.json` del proyecto:

```json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "@linear/mcp-server"],
      "env": {
        "LINEAR_API_KEY": "your-linear-api-key-here"
      }
    }
  }
}
```

## Herramientas clave / Qué hacen

- `get_issue` — recuperar un solo problema por identificador (p. ej., ENG-123) o UUID, incluyendo descripción, estado, asignado y comentarios
- `create_issue` — crear un nuevo problema con título, descripción, equipo, asignado, prioridad, etiquetas y ciclo
- `update_issue` — actualizar cualquier campo en un problema existente: estado, asignado, prioridad, fecha de vencimiento, estimación
- `search_issues` — búsqueda de texto completo y filtrada en todos los problemas por equipo, estado, asignado, etiqueta o ciclo
- `list_teams` — listar todos los equipos en el workspace con sus IDs y claves
- `list_projects` — listar proyectos con datos de hito y progreso
- `list_cycles` — listar ciclos (sprints) para un equipo con fechas de inicio/fin y progreso
- `get_cycle` — obtener un ciclo específico con todos sus problemas
- `create_comment` — agregar un comentario a cualquier problema
- `list_workflow_states` — listar todos los estados para un equipo (p. ej., Todo, In Progress, In Review, Done)

## Ejemplos de uso

```
Muéstrame todos los bugs abiertos asignados a mí en el ciclo actual,
ordenados por prioridad. Incluye el ID del problema y estado actual.
```

```
Escanea el código base para TODO y FIXME comentarios, luego crea un problema de Linear
para cada uno en el equipo ENG con etiqueta "tech-debt" y prioridad Medium.
```

```
Mueve el problema ENG-123 al estado "In Review" y agrega un comentario
con este enlace de PR y un resumen de una línea del cambio.
```

```
Lista todos los problemas en el backlog ordenados por prioridad y estimación,
luego sugiere un plan de sprint que se ajuste dentro de 40 puntos de historia.
```

```
Muéstrame todo lo que está marcado como bloqueado en el ciclo actual
y lista la dependencia bloqueante para cada problema.
```

## Autenticación

1. Ve a **linear.app → Settings → API** (o enlace directo: `linear.app/settings/api`)
2. Haz clic en **Crear nueva clave de API** bajo Claves de API personales
3. Nómbrala (p. ej., `claude-code`) y copia la clave — se mostrará solo una vez
4. Establécela como `LINEAR_API_KEY` en el bloque de configuración anterior

Para despliegues de equipo donde múltiples personas necesiten acceso, crea una aplicación OAuth bajo **Settings → API → OAuth applications** en su lugar de usar una clave personal.

## Consejos

**Siempre llama a `list_teams` primero:** Los IDs de equipo (UUIDs, no solo la clave como `ENG`) se requieren cuando creas problemas. Ejecuta `list_teams` una vez y anota el UUID para cada equipo con el que trabajes.

**Identificadores de problemas vs UUIDs:** La mayoría de las herramientas aceptan tanto `ENG-123` (identificador legible por humanos) como el UUID completo. Usa el identificador en solicitudes — es más fácil de referenciar y rastrear.

**Los estados del flujo de trabajo varían por equipo:** Estados como "In Review" o "QA" pueden no existir en cada equipo. Llama a `list_workflow_states` para el equipo relevante antes de intentar actualizar el estado, para saber los nombres de estado exactos e IDs.

**Consultas de ciclos para trabajo de sprint:** Usa `get_cycle` en lugar de `search_issues` cuando quieras todo en el sprint actual — devuelve el conjunto completo de problemas sin necesidad de filtrar manualmente.

**Crear en lote con cuidado:** Crear muchos problemas en una sesión es rápido, pero Linear envía notificaciones para cada uno. Advierte al equipo o usa una clave de API de cuenta de servicio para operaciones en lote.

---
