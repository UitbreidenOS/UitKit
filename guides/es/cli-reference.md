# Referencia de CLI de Claude Code

Referencia completa para todos los indicadores CLI de Claude Code, comandos de inicio, administración de sesiones, comandos de barra diagonal y variables de entorno.

---

## Iniciando Claude Code

```bash
claude                          # interactive session
claude "do X"                   # non-interactive, single prompt
claude -p "do X"                # print mode (no interactive fallback)
claude -p "do X" --bare         # skip CLAUDE.md + MCP discovery (10x faster SDK startup)
claude --add-dir ../other-repo  # give Claude access to another directory
claude -r <session-id>          # resume a previous session
claude --resume <id> --fork-session  # fork at current point, keep original intact
```

`--bare` es la bandera más importante para casos de uso de SDK. Omite la carga CLAUDE.md, el descubrimiento de configuración y la conexión MCP — reduciendo la latencia de inicio en un orden de magnitud cuando no necesita contexto de proyecto.

---

## Comandos de administración de sesiones

```bash
claude agents                   # list all running sessions
claude agents --json            # machine-readable JSON array
claude agents --cwd .           # filter sessions by current directory
claude rm <session-id>          # remove session from agent view
claude respawn <session-id>     # restart session with history intact
claude respawn --all            # restart all running sessions
claude daemon status            # show supervisor process state
```

Los ID de sesión son UUID que se muestran en la lista de agentes. Pásentelos a `--resume` o `--fork-session` para continuar o ramificar el trabajo.

---

## Comandos del proyecto

```bash
claude project purge            # delete all local state for this project
claude plugin details <name>    # show plugin component inventory + token cost
```

`project purge` borra datos de sesión almacenados en caché, estado de complemento y configuración local almacenada en `.claude/`. No toca `.claude/settings.json` ni ningún archivo confirmado.

---

## Comandos de barra diagonal clave (en sesión)

| Comando | Descripción | Agregado |
|---|---|---|
| `/goal` | Establecer o ver el objetivo de sesión actual — fija la intención en la parte superior del contexto | 2024 |
| `/btw` | Agregar una nota de fondo al contexto sin desencadenar una respuesta | 2024 |
| `/voice` | Activar modo de dictado de voz | 2025 |
| `/compact` | Compactación de contexto desencadenante manual | 2024 |
| `/rewind` | Retroceder a un turno anterior en la sesión actual | 2025 |
| `/branch` | Crear un nuevo fork de sesión desde el estado actual | 2025 |
| `/diff` | Mostrar un diff unificado de todos los cambios realizados en la sesión | 2024 |
| `/code-review` | Inicie la habilidad de revisión de código integrada | 2024 |
| `/focus` | Estrechamiento de la atención de Claude a un archivo o directorio específico | 2025 |
| `/batch` | Ejecutar una lista de tareas en paralelo entre subagentes | 2025 |
| `/teleport` | Salte a un directorio diferente sin terminar la sesión | 2025 |
| `/remote-control` | Habilitar el control externo de la sesión a través de API | 2025 |
| `/loop` | Ejecute un aviso o comando en un intervalo recurrente | 2025 |
| `/powerup` | Aumentar temporalmente el nivel del modelo para una sola respuesta | 2025 |
| `/fast` | Cambiar sesión actual a Haiku para velocidad | 2025 |
| `/effort` | Establecer nivel de esfuerzo para sesión (`low` / `medium` / `high` / `xhigh`) | 2025 |
| `/cost` | Mostrar uso de tokens y costo estimado para sesión | 2024 |
| `/extra-usage` | Mostrar desglose del consumo de tokens de llamadas de herramientas | 2025 |
| `/scroll-speed` | Ajuste la velocidad de streaming de salida en la terminal | 2025 |
| `/recap` | Genere un resumen estructurado de la sesión hasta ahora | 2025 |
| `/team-onboarding` | Genere guía de incorporación para nuevo miembro del equipo desde contexto de proyecto | 2025 |

---

## Variables de entorno

| Variable | Propósito |
|---|---|
| `ANTHROPIC_API_KEY` | Clave API — requerida para todos los usos no interactivos |
| `ANTHROPIC_BASE_URL` | Reemplazar punto final de API (proxy personalizados, puertas de enlace internas) |
| `CLAUDE_CODE_TASK_LIST_ID` | ID de lista de tareas compartida — habilita coordinación de tareas entre sesiones |
| `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` | Establecer en `1` para habilitar la característica de equipos de agentes |
| `ENABLE_PROMPT_CACHING_1H` | Establecer en `1` para usar el nivel TTL de caché de 1 hora |
| `ENABLE_TOOL_SEARCH` | Umbral en el cual se activa la carga diferida de herramientas |
| `CLAUDE_EFFORT` | Nivel de esfuerzo predeterminado para nuevas sesiones (`low` / `medium` / `high` / `xhigh`) |
| `CLAUDE_AGENT_NAME` | Cadena de identidad para este agente — utilizada en variables de entorno hook |
| `OUTPUT_SIZE_WARN_THRESHOLD` | Umbral de byte que dispara advertencias de tamaño de salida hook |

Las variables establecidas en el shell anulan la configuración del proyecto. Las variables establecidas en `.env` en la raíz del proyecto se cargan automáticamente.

---

## Configuración `additionalDirectories`

Alternativa persistente a `--add-dir`. Configurado en `.claude/settings.json` o `~/.claude/settings.json`:

```json
{
  "additionalDirectories": ["../shared-lib", "../design-system"]
}
```

Las rutas se resuelven relativamente a la raíz del proyecto. Utilícelo cuando múltiples repositorios colaboren en un solo producto y Claude necesite acceso de lectura entre repositorios en cada sesión sin repetir la bandera.

---

## Resumen de referencia de banderas

| Bandera | Corto | Descripción |
|---|---|---|
| `--print` | `-p` | Modo de impresión no interactivo |
| `--bare` | | Omitir CLAUDE.md, configuración y descubrimiento MCP |
| `--add-dir <path>` | | Agregar directorio al conjunto de trabajo de Claude |
| `--resume <id>` | `-r` | Reanudar sesión anterior por ID |
| `--fork-session` | | Rama en lugar de reanudar cuando se usa con `--resume` |
| `--json` | | Salida de lista de sesión como JSON (usada con `agents`) |
| `--cwd <path>` | | Filtrar agentes por directorio de trabajo |
| `--all` | | Aplicar comando a todas las sesiones (usado con `respawn`) |

---
