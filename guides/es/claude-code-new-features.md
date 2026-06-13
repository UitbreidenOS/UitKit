# Guía de nuevas funciones de Claude Code (2026)

La guía definitiva de las capacidades más recientes de Claude Code — basada en el registro de cambios oficial y la documentación Qué hay de nuevo. Cubre Agent View, /goal, /ultrareview, Auto Mode, Opus 4.7, Computer Use, Ultraplan y el escritorio rediseñado.

---

## Referencia rápida — Todos los nuevos comandos

| Comando | Qué hace | Desde |
|---|---|---|
| `claude agents` | Panel de control para todas las sesiones paralelas | v2.1.139 |
| `/goal [condition]` | Claude trabaja autónomamente hasta que se cumpla la condición | v2.1.139 |
| `/ultrareview` | Flota de agentes en la nube revisa su código | v2.1.111 |
| `claude ultrareview [target]` | Revisión en la nube no interactiva para CI | v2.1.120 |
| `/effort` | Control deslizante interactivo para establecer el nivel de inteligencia | v2.1.111 |
| `/loop [interval]` | Ejecutar un comando en un cronograma recurrente | v2.1.95 |
| `/goal` | Finalización de tareas autónomas | v2.1.139 |
| `/autofix-pr` | Corrección automática de PR desde su terminal | v2.1.100 |
| `/team-onboarding` | Empacar su configuración como una guía reproducible | v2.1.100 |
| `claude project purge` | Eliminar todo el estado local de un proyecto | v2.1.126 |
| `--plugin-url <url>` | Cargar plugin desde una URL para la sesión actual | v2.1.129 |
| `--plugin-dir <path.zip>` | Cargar plugin desde un archivo .zip | v2.1.128 |

---

## Agent View — Todas las sesiones en un panel

`claude agents` (lanzado el 11 de mayo de 2026 — Vista previa de investigación) le da una pantalla para cada sesión de Claude Code: qué se está ejecutando, qué está bloqueado esperando su entrada, qué se completó.

```bash
# Abrir Agent View
claude agents

# Agent View con configuración específica
claude agents --model claude-opus-4-7 --effort xhigh

# Listar sesiones como JSON (para scripts, barras de estado, tmux)
claude agents --json

# Limitar a un directorio específico
claude agents --cwd /path/to/project
```

**Lo que ve:**
- Cada sesión en ejecución con su tarea actual y estado
- Sesiones bloqueadas esperando su entrada (marcadas prominentemente)
- Sesiones completadas con cuánto tiempo se ejecutaron
- Costos en tiempo real por sesión

**Responder sin perder el contexto:**
Puede responder a cualquier sesión en espera directamente desde Agent View sin cambiar ventanas de terminal.

**El título de la pestaña muestra el recuento en espera:**
El título de la pestaña del terminal se actualiza para mostrar cuántas sesiones esperan su entrada — visible de un vistazo sin abrir Agent View.

**Mejor práctica — sesiones de worktree paralelas:**
```bash
# Crear worktrees aislados para cada tarea
git worktree add ../myapp-auth feature/auth
git worktree add ../myapp-payments fix/payment-timeout
git worktree add ../myapp-docs docs/api-reference

# Inicie Claude en cada uno (modo de fondo)
cd ../myapp-auth     && claude --bg "implement OAuth with Better Auth"
cd ../myapp-payments && claude --bg "fix the Stripe webhook signature verification"
cd ../myapp-docs     && claude --bg "write API documentation for all routes"

# Monitorear los tres desde una sola pantalla
claude agents
```

---

## /goal — Finalización de tareas autónomas

Establezca una condición de finalización medible. Claude itera — escribiendo código, ejecutando pruebas, corrigiendo errores — hasta que se cumpla la condición.

```bash
# En modo interactivo
/goal all tests pass for the auth module

# Con una condición medible específica
/goal the /api/users endpoint returns 201 with valid input and 422 with invalid email

# Con un presupuesto de tiempo
/goal migrate the database schema and verify all existing tests still pass

# También se ejecuta en modo no interactivo (-p bandera)
claude -p "..." --goal "all TypeScript errors resolved"
```

**Cómo funciona /goal:**
1. Claude entiende el estado actual
2. Escribe o corrige código hacia el objetivo
3. Ejecuta pruebas o comandos de verificación
4. Lee los resultados, corrige errores
5. Repite hasta que se cumpla la condición de objetivo o se alcance un punto muerto
6. Se detiene e informa el resultado

**Buenos objetivos (específicos, comprobables):**
```
/goal npm test passes with zero failures
/goal the Lighthouse score for the homepage is above 90
/goal the Docker container builds and all health checks pass
/goal all TypeScript errors in src/ are resolved
/goal the migration runs cleanly on the staging database
```

**Evite objetivos vagos:**
```
/goal make the app better           ← not testable
/goal fix all the bugs              ← too open-ended
/goal improve code quality          ← no clear signal
```

**Nota:** El evaluador /goal espera a que se completen todos los shells y subagentes en ejecución antes de verificar la condición.

---

## /ultrareview — Revisión de código de flota en la nube

Una flota de agentes especializados se ejecuta en la nube para revisar su código. Los hallazgos llegan directamente a su CLI o Escritorio.

```bash
# Revisar rama actual (interactivo)
/ultrareview

# Revisar un PR específico
/ultrareview PR#123

# No interactivo (para scripts CI/CD)
claude ultrareview                    # review current branch
claude ultrareview --pr 123          # review specific PR
claude ultrareview --focus security  # focus on security only
```

**Lo que revisa la flota:**
- Vulnerabilidades de seguridad (inyección, evasión de auth, secretos expuestos)
- Errores lógicos y casos límite perdidos en pruebas
- Cuellos de botella de rendimiento (consultas N+1, pérdidas de memoria)
- Cambios de API incompatibles
- Brechas de cobertura de pruebas

**vs. /code-review (local):**
- `/code-review` — agente único, contexto de sesión actual, más rápido
- `/ultrareview` — múltiples agentes especializados en paralelo, cobertura más amplia, mejor antes de fusionar

---

## Auto Mode — Manejo inteligente de permisos

Auto Mode clasifica automáticamente sus indicadores de permiso:
- **Operaciones seguras** (solo lectura, sandbox) → ejecutar sin interrumpir
- **Operaciones riesgosas** (destructivas, red, acceso a credenciales) → bloqueadas o escaladas

```bash
# Habilitar modo automático
claude --auto-mode

# El modo automático ahora está disponible sin la bandera para suscriptores Max
# En Opus 4.7 con suscripción Max: habilitado por defecto

# Reglas de denegación dura (bloqueadas incondicionalmente independientemente de excepciones permitidas)
# En .claude/settings.json:
{
  "autoMode": {
    "hard_deny": [
      "Bash(rm -rf *)",
      "Bash(git push --force)"
    ]
  }
}
```

**El spinner del modo automático se vuelve rojo** cuando una verificación de permiso se bloquea — señal visual de que algo necesita su atención.

---

## Claude Opus 4.7 + Niveles de esfuerzo

Opus 4.7 es ahora el modelo predeterminado para Max y Team Premium. Introduce el nivel de esfuerzo `xhigh` — la configuración recomendada para tareas complejas de codificación.

```bash
# Establecer nivel de esfuerzo interactivamente
/effort

# Utilize el deslizador de esfuerzo (teclas de flecha, Intro para confirmar)
# Niveles: low → medium → high → xhigh

# Establecer mediante línea de comandos
claude --effort xhigh "debug this race condition"
claude --effort low   "rename this variable"

# Comprobar nivel de esfuerzo en hooks via $CLAUDE_EFFORT
# O effort.level en entrada JSON del hook

# El modo rápido ahora usa Opus 4.7 por defecto
# Volver a 4.6: CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE=1
```

**Cuándo usar cada nivel de esfuerzo:**

| Nivel | Usar para | Gasto de tokens |
|---|---|---|
| `low` | Renombre de variable, formato, completaciones simples | Mínimo |
| `medium` | Trabajo de características estándar, depuración de errores comunes | Moderado |
| `high` | Refactors, revisiones de arquitectura, escritura de pruebas | Superior |
| `xhigh` | Auditorías de seguridad, condiciones de carrera, cambios complejos multi-archivo | Máximo |

**Comprimir contexto anterior:**
El menú Rewind ahora incluye "Summarize up to here" — comprime los giros anteriores manteniendo el contexto reciente. Reduce costos sin perder decisiones clave.

---

## Computer Use — Control CLI de aplicaciones GUI

Claude puede abrir aplicaciones nativas, hacer clic en la interfaz de usuario y verificar cambios que solo una GUI puede confirmar.

```bash
# Habilitar uso de computadora (vista previa de investigación)
claude --computer-use

# Claude ahora puede:
# - Abrir aplicaciones en su escritorio
# - Hacer clic en botones y rellenar formularios
# - Tomar capturas de pantalla y verificar el estado de la interfaz de usuario
# - Ejecutar flujos de extremo a extremo que requieren un navegador real o aplicación
```

**Mejores casos de uso:**
- Verificar que un cambio de interfaz de usuario se vea correcto
- Automatizar flujos que no tienen CLI (aplicaciones heredadas, interfaces web complejas)
- Cerrar la brecha después de cambios de código: "¿funciona esto realmente en el navegador?"

**También disponible en la aplicación de escritorio** — el uso de computadora funciona en CLI y en el escritorio rediseñado.

---

## Ultraplan — Planificación en la nube + Ejecución remota

Redacte un plan en la nube, revise y comente en un editor web, luego ejecútelo de forma remota o devuélvalo localmente.

```bash
# Iniciar Ultraplan (vista previa temprana)
/ultraplan

# Claude redacta un plan estructurado
# → Obtiene una URL para revisar y anotar en un editor web
# → Comente sobre pasos, apruebe/rechace partes
# → Ejecutar de forma remota en un entorno en la nube
# → O devolver localmente y ejecutar allí

# La primera ejecución crea automáticamente un entorno en la nube para usted
```

**Ideal para:**
- Tareas largas de múltiples días que se benefician de un plan escrito estructurado antes de la ejecución
- Compartir un plan con compañeros para revisión antes de ejecutar
- Tareas que necesitan ejecutarse en un entorno limpio en la nube (no su máquina local)

---

## Routines — Agentes en la nube programados

En Claude Code Web, Routines ejecuta agentes en la nube basados en plantillas desde un cronograma, un evento de GitHub o una llamada API.

```
Ejemplos de Routines:
- "Every Monday: review open PRs and summarize what needs attention"
- "On push to main: run /ultrareview on the diff"
- "Daily at 9am: check for dependency security advisories"
- "On GitHub issue opened: triage and label it"
```

Configure en la interfaz Claude Code Web → Routines.

---

## Monitor Tool — Transmisión de registros en directo

La herramienta Monitor transmite eventos de fondo a la conversación — Claude puede seguir registros y reaccionar en tiempo real.

```bash
# Claude puede usar la herramienta Monitor automáticamente cuando supervisa procesos
# O puede invocarlo explícitamente:
/monitor <process or log source>

# Ejemplo: Claude monitorea una implementación y reacciona a errores
"Deploy this to staging and monitor the logs — fix any errors that appear"
```

---

## Experiencia de escritorio rediseñada

Claude Code Desktop (Web) recibió un rediseño importante con:

**Diseño paralelo:**
- Múltiples agentes visibles simultáneamente desde una ventana
- Chats laterales sin perder el hilo principal
- Arreglo de paneles de arrastrar y soltar
- Barra lateral de sesiones para navegar entre proyectos

**Herramientas integradas:**
- Visores HTML y PDF (ver salida generada en línea)
- Editor de archivos integrado (editar archivos sin cambiar a su IDE)
- Visor de diferencias reconstruido (revisar cambios sin otra herramienta)
- Temas personalizados (crear desde `/theme` o mediante plugin)

**Auto-archivo:**
Las sesiones se archivan automáticamente cuando su PR asociado se fusiona — mantiene su espacio de trabajo limpio.

**Resumen de sesión:**
Cuando vuelve a una sesión que se ha estado ejecutando en segundo plano, Claude proporciona un resumen de lo que sucedió mientras estaba ausente.

---

## Plugins: Carga .zip y URL

```bash
# Cargar un plugin desde un archivo .zip (para la sesión actual)
claude --plugin-dir ./my-plugin.zip

# Cargar desde una URL
claude --plugin-url https://example.com/my-plugin.zip

# Navegar e instalar desde marketplace
/plugin

# Mostrar detalles del plugin (componentes, costo del token)
claude plugin details <name>

# Listar componentes del plugin antes de instalar
# /plugin ahora muestra skills, hooks, agentes, servidores MCP en el panel de exploración
```

---

## Windows: No se requiere Git Bash

Claude Code ahora funciona de forma nativa en Windows con PowerShell — Git para Windows ya no es un requisito previo.

```powershell
# Instale Claude Code en Windows (sin Git Bash requerido)
winget install Anthropic.ClaudeCode

# O vía npm
npm install -g @anthropic-ai/claude-code

# PowerShell es ahora el shell principal en Windows
# La herramienta Bash retrocede automáticamente a PowerShell
```

---

## Otros añadidos notables

**Auto-ritmo `/loop`:**
```bash
/loop 5m /check-deploy    # run every 5 minutes
/loop /monitor-tests      # self-pace (Claude decides interval)
```

**`/team-onboarding`:**
Empaqueta su configuración de Claude Code (hooks, skills, CLAUDE.md) en una guía reproducible para nuevos miembros del equipo.

**`/autofix-pr`:**
Habilita sugerencias automáticas de corrección de PR desde su terminal — Claude monitorea resultados de CI y propone correcciones.

**Correcciones de entrada de voz:**
El push de voz ahora funciona en el panel de respuesta de Agent View. Confiabilidad mejorada en macOS.

**Notificaciones push móviles:**
Cuando una tarea larga se completa o Claude necesita su entrada, reciba una notificación push en su teléfono (vía Remote Control).
```bash
# Requiere configuración de Claude Code Remote Control
# Configurar en Configuración de Escritorio → Notificaciones → Móvil
```

---

## Comandos CLI adicionales

**`claude agents --json`** (v2.1.145+)
Listado de sesión legible por máquina — imprime todas las sesiones activas como matriz JSON y sale:
```bash
claude agents --json | jq '.[] | select(.status == "running")'
```
Campos: `pid`, `cwd`, `kind`, `startedAt`, `sessionId`, `name`, `status`. Combine con `--cwd` para filtrar por directorio.

**`claude respawn`**
Reinicie una sesión con el historial de conversación intacto:
```bash
claude respawn <session-id>      # restart one session
claude respawn --all             # restart all running sessions
```

**`claude daemon status`**
Mostrar el estado del proceso supervisor y el recuento de trabajadores. Útil para diagnosticar por qué las sesiones no se inician.

**`/scroll-speed`**
Ajuste la velocidad de desplazamiento de la rueda del ratón en la CLI. `/scroll-speed 3` (predeterminado), `/scroll-speed 1` (lento), `/scroll-speed 10` (rápido).

**`/code-review` (renombrado de `/simplify`)**
A partir de v2.1.146, `/simplify` fue renombrado a `/code-review`. El nombre antiguo aún funciona como alias. Ahora acepta un nivel de esfuerzo opcional:
```
/code-review
/code-review xhigh
```
Revisa diffs actuales para errores de compilación, errores lógicos, vulnerabilidades de seguridad — no estilos o formato.

---
