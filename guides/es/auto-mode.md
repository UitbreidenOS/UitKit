# Modo automático y operación autónoma

El modo automático permite que Claude opere con interrupciones mínimas — aprueba automáticamente operaciones seguras y no destructivas, y solo pausa para entrada humana en acciones que son irreversibles o conllevan riesgo real. Úsalo para tareas de larga duración donde los prompts de aprobación constantes rompen tu flujo.

---

## Cómo habilitar

**Comando de barra diagonal (alterna para sesión actual):**
```
/auto
```

**Archivo de configuración:**
```json
{
  "autoMode": true
}
```

**Bandera CLI:**
```bash
claude --auto "Refactor all API handlers to use the new error middleware"
```

**Combinado con esfuerzo para trabajo autónomo nocturno:**
```bash
claude --auto --effort xhigh "Implement the full feature spec in tasks.jsonl"
```

---

## Qué cambia en modo automático

En una sesión estándar, Claude solicita confirmación antes de la mayoría de llamadas de herramientas. En modo automático, la confirmación está en capas:

### Capas de permiso

**Siempre auto-aprueba (sin prompt)**
- `Read` — leer cualquier archivo
- `Grep` / `Glob` — buscar en la base de código
- `Bash` (solo lectura) — `ls`, `cat`, `find`, `git log`, `git diff`, `git status`, `npm list`, ejecutar comandos de prueba que no mutant estado
- `WebFetch` (solicitudes GET)

**Pedir una vez por sesión (prompt primera vez, recordar respuesta)**
- `git add`, `git commit`, `git checkout`
- `npm install`, `npm ci`
- Escribir archivos nuevos
- Crear directorios

**Siempre pedir (prompt cada vez)**
- Eliminación de archivos (`rm`, `unlink`)
- `git push --force`
- Escrituras en base de datos (INSERT, UPDATE, DELETE vía MCP o CLI)
- Llamadas de API externas que mutan estado (POST, PUT, PATCH, DELETE)
- Cualquier comando `Bash` contiene `sudo`
- Comandos que modifican configuración del sistema

---

## Mecanismos de seguridad

### Bandera `--max-cost`
Detén la sesión si el gasto excede un umbral en dólares:
```bash
claude --auto --max-cost 5.00 "Refactor the entire auth module"
```
La sesión termina limpiamente cuando el costo alcanza el límite. Claude escribe un resumen de progreso antes de parar.

### Archivo centinela `.claude/stop`
Crea este archivo en cualquier momento para terminar una sesión autónoma:
```bash
touch .claude/stop
```
Claude verifica este archivo entre turnos. Cuando existe, la sesión termina elegantemente. Elimina el archivo antes de iniciar la siguiente sesión.

### Hook keepalive
Para sesiones que se ejecutan durante la noche o a través de interrupciones de red, configura un keepalive que reinicia Claude si se detiene inesperadamente:

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "incomplete",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/keepalive.sh"
          }
        ]
      }
    ]
  }
}
```

```bash
# .claude/hooks/keepalive.sh
# Solo reinicia si hay tareas restantes y ningún sentinela de parada
if [ ! -f ".claude/stop" ] && [ -s ".claude/tasks.jsonl" ]; then
  claude --auto --effort high "Continue working through tasks.jsonl"
fi
```

### `maxTurns`
Límite duro en el número de turnos por sesión:
```json
{
  "autoMode": true,
  "maxTurns": 100
}
```

---

## Modo automático vs `--dangerously-skip-permissions`

Estos no son lo mismo:

| | Modo automático | `--dangerously-skip-permissions` |
|---|---|---|
| **Operaciones destructivas** | Sigue indicando | Omitido completamente — sin prompts en absoluto |
| **Eliminación de archivos** | Siempre pregunta | Auto-aprobado |
| **Force push** | Siempre pregunta | Auto-aprobado |
| **Usar para** | Tareas largas con humano cerca | Espacios aislados de confianza, ambientes CI |
| **Nivel de riesgo** | Bajo — puerta destructiva permanece | Alto — sin red de seguridad |

Nunca uses `--dangerously-skip-permissions` en desarrollo interactivo. Está diseñado para tuberías de CI aisladas donde Claude ha sido limitado a un ambiente desechable.

---

## Mejores prácticas para operación autónoma

**Define una cola de tareas antes de comenzar.** Claude trabaja a través de tareas definidas más confiablemente que un prompt abierto. Usa `.claude/tasks.jsonl`:

```jsonl
{"id": "1", "task": "Add input validation to all POST endpoints in src/routes/", "status": "pending"}
{"id": "2", "task": "Write tests for each validation rule added in task 1", "status": "pending"}
{"id": "3", "task": "Update API docs to reflect new validation errors", "status": "pending"}
```

```bash
claude --auto "Work through tasks in .claude/tasks.jsonl. Mark each task done as you complete it."
```

**Establece máximas iteraciones explícitamente.** Las sesiones autónomas abiertas se desplazan. Un `maxTurns` de 50–150 es apropiado para la mayoría de tareas de múltiples horas.

**Prueba con `--dry-run` primero.** Ejecuta el mismo prompt con `--dry-run` para ver las llamadas de herramientas planificadas antes de permitir ejecución:
```bash
claude --auto --dry-run "Delete all TODO comments from the codebase"
```

**Delimita el directorio de trabajo.** El modo automático respeta límites de proyecto. Ejecuta Claude desde la raíz del proyecto o un subdirectorio para limitar lo que puede alcanzar.

**Revisa la transcripción de sesión después.** Las sesiones de modo automático producen una transcripción completa. Léela — las decisiones de Claude en una sesión autónoma larga valen la pena auditar, especialmente las opciones "ask once per session" que hizo.

---

## Ejemplo: Refactor autónomo nocturno

```bash
# Crea cola de tareas
cat > .claude/tasks.jsonl << 'EOF'
{"id": "1", "task": "Find all usages of the deprecated fetchUser() function across src/", "status": "pending"}
{"id": "2", "task": "Replace each fetchUser() call with the new getUser() API, preserving error handling", "status": "pending"}
{"id": "3", "task": "Run the test suite and fix any failures caused by the migration", "status": "pending"}
{"id": "4", "task": "Delete the deprecated fetchUser() function and its tests", "status": "pending"}
{"id": "5", "task": "Update CHANGELOG.md with a summary of the deprecation removal", "status": "pending"}
EOF

# Inicia sesión autónoma con límite de costo
claude --auto --effort high --max-cost 8.00 \
  "Work through .claude/tasks.jsonl in order. Mark each task completed in the file when done. Stop if you encounter an ambiguity that requires a product decision."
```

---
