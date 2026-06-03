# Agent SDK Pack — Guía completa para desarrolladores

El SDK de Agent para Claude (`claude-agent-sdk` / `@anthropic-ai/claude-agent-sdk`) es una biblioteca de tiempo de ejecución dedicada para construir agentes autónomos que ejecutan el bucle completo de agentes de Claude Code de forma programática — fuera del terminal interactivo. No es un envoltorio delgado alrededor de la API de Messages. Incluye el bucle, las herramientas integradas, el sistema de hooks, la persistencia de sesiones, el modelo de permisos e integración con MCP como una biblioteca de primera clase que puedes incrustar en cualquier aplicación.

Esta guía es para ingenieros senior que construyen agentes en producción. Asume que ya estás familiarizado con la API de Anthropic y con Python o TypeScript.

---

## Cuándo usar el SDK de Agent frente a las alternativas

Existen tres niveles. Elige deliberadamente.

| Dimensión | Claude Code CLI interactivo | SDK de Agent | API de Messages sin procesar |
|---|---|---|---|
| Uso principal | Sesiones interactivas de desarrolladores | Código autónomo en tu app | Llamadas API únicas |
| Gestión de bucles | Manejada por CLI | Manejada por SDK | Tú la escribes |
| Herramientas integradas | Sí (Read, Write, Bash, etc.) | Sí — el mismo conjunto | No — defines todas |
| CLAUDE.md / skills | Sí | Sí (configurable) | No |
| Sistema de hooks | Sí | Sí | No |
| Sesiones reanudables | Sí (JSONL) | Sí (JSONL) | No |
| Integración MCP | Vía settings.json | Vía HTTP | No |
| Permisos | Solicitudes interactivas | Configuración allow/deny/ask | N/A |
| Caché de prompts | Automático | Debe cablearse explícitamente | Debe cablearse explícitamente |
| Fondo de créditos | Límites interactivos | Fondo separado del agent (junio 2026) | Presupuesto de tokens del API |
| Latencia | 2–5 s de startup | ~100–300 ms primera llamada | ~100 ms |
| Mejor para | Trabajo de desarrollo humano | Productos, tuberías, automatización | Recuperación simple, finalización |

**Usa el SDK de Agent cuando:**
- Estés incrustando un agente en un producto (no una terminal de desarrollo)
- Necesites el conjunto completo de herramientas integradas sin reimplementarlo
- Quieras hooks, sesiones, permisos e integración MCP cableados desde el primer día
- Estés construyendo un paso de CI/CD, un worker de fondo o una automatización desencadenada por el usuario

**Usa la API de Messages sin procesar cuando:**
- Necesites una sola finalización sin bucle de herramientas
- Estés construyendo un chatbot que no llama a herramientas o solo llama a herramientas que controlas completamente
- La latencia y el costo de tokens deben minimizarse al máximo

**Quédate en el CLI interactivo cuando:**
- Un humano está dirigiendo la sesión
- Necesites contexto en vivo de tu máquina local (estado de git, servicios locales)
- Quieras solicitudes de permiso interactivas y la capacidad de interrumpir

---

## Instalación

**Python**

```bash
pip install claude-agent-sdk
```

Requiere Python 3.10+. El SDK instala `anthropic` como dependencia — no necesitas instalarlo por separado.

**TypeScript / Node.js**

```bash
npm install @anthropic-ai/claude-agent-sdk
```

Requiere Node 18+. Se admiten tanto ESM como CJS.

**Entorno**

```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

Todas las llamadas del SDK se autentican mediante esta variable a menos que pases `api_key` explícitamente al constructor del cliente.

---

## Ejemplos mínimos

### Python

```python
from claude_agent_sdk import Agent, AgentConfig

agent = Agent(
    config=AgentConfig(
        model="claude-opus-4-7",
        system="You are a senior Python engineer. Fix bugs in the code you are given.",
        max_turns=20,
    )
)

async def main():
    async for event in agent.run("Fix the type errors in src/auth.py"):
        if event.type == "text":
            print(event.content, end="", flush=True)
        elif event.type == "tool_use":
            print(f"\n[{event.tool_name}] {event.tool_input}")
        elif event.type == "stop":
            print(f"\n[done — stop reason: {event.stop_reason}]")

import asyncio
asyncio.run(main())
```

### TypeScript

```typescript
import { Agent, AgentConfig } from "@anthropic-ai/claude-agent-sdk";

const agent = new Agent({
  config: {
    model: "claude-opus-4-7",
    system: "You are a senior Python engineer. Fix bugs in the code you are given.",
    maxTurns: 20,
  },
});

for await (const event of agent.run("Fix the type errors in src/auth.py")) {
  if (event.type === "text") {
    process.stdout.write(event.content);
  } else if (event.type === "tool_use") {
    console.log(`\n[${event.toolName}] ${JSON.stringify(event.toolInput)}`);
  } else if (event.type === "stop") {
    console.log(`\n[done — stop reason: ${event.stopReason}]`);
  }
}
```

Ambos ejemplos producen el mismo comportamiento: se le da una tarea al agente, ejecuta el bucle de forma autónoma (leyendo archivos, editando código, ejecutando comandos Bash), y emite eventos nuevamente a tu código. Nunca tocas las llamadas HTTP, el envío de herramientas o la lógica de continuación.

---

## El bucle del Agent

Entender el bucle es un requisito previo para usar correctamente hooks, herramientas personalizadas y sesiones.

```
Mensaje del usuario
    |
    v
[Llamada al modelo] → salida de texto y/o bloques de tool_use
    |
    |--- si solo texto → emitir eventos de texto → verificar condición de parada → hecho o continuar
    |
    |--- si tool_use:
    |       Para cada bloque de tool_use (paralelo por defecto):
    |           1. Verificar permisos (allow/deny/ask)
    |           2. Ejecutar herramienta
    |           3. Emitir tool_result
    |       Añadir tool_results al historial de mensajes
    |       Volver a [Llamada al modelo]
    |
    v
Parar cuando:
    - El modelo devuelve end_turn sin tool_use
    - Se alcanza max_turns
    - Un hook devuelve HookAction.STOP
    - Permiso denegado en una herramienta requerida
```

Cada iteración es una llamada API completa. El SDK gestiona el historial de mensajes automáticamente — nunca añades manualmente turnos de asistente y tool_result.

**Paralelismo:** Cuando el modelo devuelve múltiples bloques de `tool_use` en una respuesta, el SDK los envía concurrentemente por defecto. Si tienes herramientas con efectos secundarios que deben ejecutarse secuencialmente, establece `parallel_tool_execution=False` (Python) / `parallelToolExecution: false` (TS) en tu configuración.

**Gestión de la ventana de contexto:** El SDK rastrea el uso de tokens en todos los turnos. Cuando te acercas al límite de contexto, resume los turnos anteriores usando una estrategia compacta (igual que el comando `/compact` del CLI de Claude Code). Puedes deshabilitarlo con `auto_compact=False` o inyectar tu propio hook de resumen.

---

## Herramientas integradas

El SDK incluye las mismas herramientas integradas que el CLI de Claude Code. No las defines — están disponibles para el modelo automáticamente a menos que las excluyas explícitamente.

| Herramienta | Qué hace |
|---|---|
| `Read` | Leer contenidos de archivo |
| `Write` | Escribir/sobrescribir un archivo |
| `Edit` | Ediciones de reemplazo de cadena preciso |
| `Glob` | Descubrimiento de archivos basado en patrones |
| `Grep` | Búsqueda de contenido en archivos |
| `Bash` | Ejecutar comandos de shell |
| `WebSearch` | Búsqueda web |
| `WebFetch` | Obtener y analizar una URL |
| `AskUserQuestion` | Pausar bucle, solicitar entrada a humano |
| `Agent` | Generar un subagente |

Para restringir qué herramientas están disponibles:

```python
# Python — permitir solo herramientas de archivo, sin Bash, sin web
config = AgentConfig(
    model="claude-opus-4-7",
    tools=["Read", "Write", "Edit", "Glob", "Grep"],
)
```

```typescript
// TypeScript
const config: AgentConfig = {
  model: "claude-opus-4-7",
  tools: ["Read", "Write", "Edit", "Glob", "Grep"],
};
```

Pasar una lista explícita de `tools` reemplaza el conjunto completo predeterminado. Para añadir herramientas personalizadas además de los valores predeterminados, usa el parámetro `extra_tools`.

---

## Herramientas personalizadas

Define herramientas personalizadas con un esquema y un manejador asincrónico. El SDK las inyecta en la lista de herramientas del modelo y envía llamadas a tu manejador automáticamente.

### Python

```python
from claude_agent_sdk import Agent, AgentConfig, tool
from pydantic import BaseModel

class SearchCodebaseInput(BaseModel):
    query: str
    file_pattern: str = "**/*.py"

@tool(
    name="search_codebase",
    description="Search the internal code index for semantic matches. "
                "Faster than Grep for conceptual queries.",
    input_model=SearchCodebaseInput,
)
async def search_codebase(input: SearchCodebaseInput) -> str:
    # Your implementation — call an embedding index, vector DB, etc.
    results = await my_vector_index.search(input.query, pattern=input.file_pattern)
    return "\n".join(f"{r.path}:{r.line} — {r.snippet}" for r in results)

agent = Agent(
    config=AgentConfig(model="claude-opus-4-7"),
    extra_tools=[search_codebase],
)
```

### TypeScript

```typescript
import { Agent, tool } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";

const searchCodebase = tool({
  name: "search_codebase",
  description:
    "Search the internal code index for semantic matches. Faster than Grep for conceptual queries.",
  inputSchema: z.object({
    query: z.string(),
    filePattern: z.string().default("**/*.ts"),
  }),
  handler: async ({ query, filePattern }) => {
    const results = await myVectorIndex.search(query, { pattern: filePattern });
    return results.map((r) => `${r.path}:${r.line} — ${r.snippet}`).join("\n");
  },
});

const agent = new Agent({
  config: { model: "claude-opus-4-7" },
  extraTools: [searchCodebase],
});
```

Las herramientas personalizadas aparecen en la lista de herramientas del modelo junto a las herramientas integradas. El modelo decide cuándo llamarlas según tu descripción — escribe descripciones que hagan explícita la compensación entre tu herramienta y una alternativa integrada.

---

## Subagentes

La herramienta integrada `Agent` permite que el agente principal genere subagentes. Cada subagente obtiene su propio bucle aislado, conjunto de herramientas e historial de mensajes. Los resultados fluyen de vuelta al padre como resultado de herramienta.

**Desde la perspectiva del modelo**, llamar a la herramienta `Agent` es idéntico a llamar a cualquier otra herramienta. El SDK la intercepta, crea una instancia de `Agent` hijo, la ejecuta hasta completarse y devuelve el resultado.

**Desde la perspectiva de tu código**, configuras el comportamiento de subagentes vía `SubagentConfig`:

```python
from claude_agent_sdk import Agent, AgentConfig, SubagentConfig

agent = Agent(
    config=AgentConfig(
        model="claude-opus-4-7",
        system="You are a senior engineer. Orchestrate subagents to complete complex refactors.",
        subagent_config=SubagentConfig(
            model="claude-sonnet-4-6",  # cheaper model for subagents
            max_turns=10,
            tools=["Read", "Write", "Edit", "Bash"],  # restrict subagent tools
        ),
    )
)
```

Usa un modelo más barato para subagentes que hacen trabajo mecánico (lecturas de archivos, ediciones, búsquedas). Reserva Opus para el agente orquestador que hace razonamiento y planificación.

La profundidad de generación de subagentes es configurable (`max_subagent_depth`, predeterminado 3). El anidamiento profundo es raramente útil y caro — mantén la orquestación superficial.

---

## Hooks

Los hooks son funciones que se disparan en eventos del ciclo de vida del bucle del agente. Son el mecanismo principal para observabilidad, aplicación de seguridad, control de costos y enrutamiento personalizado.

### Tipos de hooks

| Hook | Cuándo se dispara | ¿Puede bloquear/modificar? |
|---|---|---|
| `SessionStart` | Antes de la primera llamada al modelo | No |
| `UserPromptSubmit` | Cuando un mensaje del usuario entra al bucle | Sí — puede reescribir el mensaje |
| `PreToolUse` | Antes de cada ejecución de herramienta | Sí — puede bloquear o modificar entrada |
| `PostToolUse` | Después de cada ejecución de herramienta | Sí — puede modificar el resultado |
| `Stop` | Cuando el bucle del agente termina | No |
| `SessionEnd` | Después de la limpieza | No |

### Python

```python
from claude_agent_sdk import Agent, AgentConfig, HookAction
from claude_agent_sdk.hooks import PreToolUseHook, PostToolUseHook, StopHook

class AuditHook(PreToolUseHook):
    async def run(self, tool_name: str, tool_input: dict) -> HookAction:
        # Log every tool call to your audit system
        await audit_log.record(tool=tool_name, input=tool_input)

        # Block writes to protected paths
        if tool_name in ("Write", "Edit") and is_protected(tool_input.get("path", "")):
            return HookAction.deny(reason=f"Write to protected path blocked: {tool_input['path']}")

        return HookAction.allow()

class CostGuardHook(StopHook):
    async def run(self, session_stats: dict) -> None:
        if session_stats["total_tokens"] > 500_000:
            await alert_slack(f"Agent session exceeded 500k tokens: {session_stats}")

agent = Agent(
    config=AgentConfig(model="claude-opus-4-7"),
    hooks=[AuditHook(), CostGuardHook()],
)
```

### TypeScript

```typescript
import {
  Agent,
  HookAction,
  type PreToolUseHook,
  type StopHook,
} from "@anthropic-ai/claude-agent-sdk";

const auditHook: PreToolUseHook = {
  async run(toolName, toolInput) {
    await auditLog.record({ tool: toolName, input: toolInput });

    if (
      ["Write", "Edit"].includes(toolName) &&
      isProtected(toolInput.path ?? "")
    ) {
      return HookAction.deny(`Write to protected path blocked: ${toolInput.path}`);
    }

    return HookAction.allow();
  },
};

const agent = new Agent({
  config: { model: "claude-opus-4-7" },
  hooks: [auditHook],
});
```

### PostToolUse — Modificar resultados

```python
class RedactSecrets(PostToolUseHook):
    async def run(self, tool_name: str, tool_input: dict, tool_result: str) -> str:
        if tool_name == "Read":
            return redact_env_vars(tool_result)
        return tool_result
```

Los hooks `PostToolUse` reciben la salida bruta de la herramienta y pueden devolver una versión modificada. El resultado modificado es lo que el modelo ve en su contexto — no la salida bruta. Usa esto para redacción, truncamiento o normalización de resultados.

---

## Sesiones y reanudabilidad

Las sesiones serializan el estado del agente a JSONL para que la ejecución pueda reanudarse después de la interrupción. Esto es esencial para agentes de larga duración (tuberías de CI, ejecuciones nocturnas) y para depuración.

### Guardar una sesión

```python
from claude_agent_sdk import Agent, AgentConfig, Session

agent = Agent(config=AgentConfig(model="claude-opus-4-7"))

session = Session(path="/tmp/refactor-session.jsonl")

async for event in agent.run("Refactor the authentication module", session=session):
    print(event)
    # Session state is written to disk after each turn automatically
```

Si el proceso falla durante la ejecución, `/tmp/refactor-session.jsonl` contiene cada turno completado.

### Reanudar una sesión

```python
session = Session(path="/tmp/refactor-session.jsonl", resume=True)

# The agent reconstructs message history from the JSONL
# and continues from where it stopped
async for event in agent.run("Continue the refactor", session=session):
    print(event)
```

Cuando `resume=True`, el SDK reproduce el JSONL en el historial de mensajes antes de llamar al modelo. El modelo ve el contexto previo completo y continúa naturalmente.

### Introspección de sesiones

```python
session = Session(path="/tmp/refactor-session.jsonl")
print(session.turns)         # number of completed turns
print(session.total_tokens)  # cumulative token usage
print(session.last_stop_reason)  # why the last session ended
```

Las sesiones son JSONL de solo apéndice — seguro para revisar con `tail -f` para monitoreo en vivo.

---

## Permisos y seguridad

El sistema de permisos controla qué llamadas de herramienta puede hacer el agente sin aprobación humana. Configúralo a nivel de `AgentConfig`.

### Modos de permiso

```python
from claude_agent_sdk import AgentConfig, PermissionMode

config = AgentConfig(
    model="claude-opus-4-7",
    permissions={
        # Always allow — no prompt, no log check
        "allow": [
            "Read(**)",
            "Grep(**)",
            "Glob(**)",
            "Bash(git status)",
            "Bash(git log *)",
            "Bash(git diff *)",
        ],
        # Always deny — blocked outright, returned as error
        "deny": [
            "Bash(rm -rf *)",
            "Write(/etc/*)",
            "Write(/usr/*)",
        ],
        # Ask human — AskUserQuestion fires automatically
        "ask": [
            "Bash(*)",
            "Write(*)",
        ],
    },
    permission_mode=PermissionMode.STRICT,  # deny anything not in allow/ask/deny
)
```

`PermissionMode.STRICT` rechaza cualquier llamada de herramienta no explícitamente listada. `PermissionMode.PERMISSIVE` (predeterminado) permite que las llamadas no listadas pasen. Usa `STRICT` en agentes de producción que operan en infraestructura sensible.

Los patrones de permisos admiten globs. `Bash(git *)` coincide con cualquier llamada Bash cuyo comando comience con `git`. `Write(/home/deploy/*)` coincide con cualquier Write en ese árbol de directorios.

### Manejando respuestas Ask

Cuando una herramienta coincide con la lista `ask`, el SDK dispara `AskUserQuestion` automáticamente. En una aplicación sin interfaz querrás manejar esto:

```python
from claude_agent_sdk.hooks import PreToolUseHook, HookAction

class AutoApproveReadonly(PreToolUseHook):
    async def run(self, tool_name: str, tool_input: dict) -> HookAction:
        # Auto-approve safe operations in headless mode
        if tool_name in ("Read", "Glob", "Grep"):
            return HookAction.allow()
        # For Bash, inspect before allowing
        if tool_name == "Bash":
            cmd = tool_input.get("command", "")
            if any(cmd.startswith(safe) for safe in ["git ", "pytest ", "python -m "]):
                return HookAction.allow()
        # Default: deny and log for manual review
        await review_queue.push(tool_name=tool_name, input=tool_input)
        return HookAction.deny("Queued for manual review")
```

---

## Integración MCP

El SDK se conecta a servidores MCP sobre HTTP. La configuración refleja el formato `settings.json` del CLI de Claude Code.

```python
from claude_agent_sdk import Agent, AgentConfig, MCPServer

agent = Agent(
    config=AgentConfig(
        model="claude-opus-4-7",
        mcp_servers=[
            MCPServer(
                name="github",
                url="https://mcp.example.com/github",
                api_key_env="GITHUB_MCP_KEY",
            ),
            MCPServer(
                name="postgres",
                url="http://localhost:5432/mcp",
                transport="http",
            ),
        ],
    )
)
```

Las herramientas MCP aparecen en la lista de herramientas del modelo con el nombre del servidor como prefijo (p.ej., `github__create_pr`, `postgres__query`). El modelo las llama como cualquier herramienta integrada. El SDK maneja envío HTTP, autenticación y formato de resultados.

**Opciones de autenticación:**
- `api_key_env` — leer la clave de una variable de entorno (recomendado)
- `api_key` — pasar la clave directamente (evita en producción — usa variables de entorno)
- `headers` — encabezados HTTP arbitrarios para esquemas de autenticación personalizados

**MCP + permisos:** Las llamadas de herramientas MCP pasan por el mismo sistema de permisos. Añade nombres de herramientas MCP a tus listas allow/deny/ask usando sus nombres prefijados:

```python
"allow": ["github__list_prs", "github__get_pr"],
"ask": ["github__create_pr", "github__merge_pr"],
"deny": ["github__delete_repo"],
```

---

## Caché de prompts

Las aplicaciones construidas con el SDK de Agent deben usar caché de prompts. Sin ella, los prompts largos del sistema y el contenido de CLAUDE.md se re-tokenizan en cada llamada API del bucle — a escala esta es una costo significativo y evitable.

El SDK no habilita el almacenamiento en caché automáticamente. Conéctalo explícitamente vía `cache_config`:

```python
from claude_agent_sdk import AgentConfig, CacheConfig

config = AgentConfig(
    model="claude-opus-4-7",
    system=long_system_prompt,  # e.g., your CLAUDE.md content + instructions
    cache_config=CacheConfig(
        # Cache breakpoints are inserted automatically at:
        # 1. The end of the system prompt
        # 2. The end of tools definitions
        # 3. The last user message (for multi-turn caching)
        auto_breakpoints=True,
        min_cache_tokens=1024,  # only cache blocks above this threshold
    ),
)
```

Con `auto_breakpoints=True`, el SDK inserta marcadores `cache_control: {"type": "ephemeral"}` en posiciones óptimas (cola de prompt de sistema, cola de lista de herramientas, y cola de conversación rodante).

**Tasas de aciertos de caché en la práctica:**
- Prompt del sistema: cerca del 100% después de la primera llamada en una sesión
- Definiciones de herramientas: cerca del 100% — no cambian entre turnos
- Historial de conversación: aciertos desde el turno 2 en adelante para contenido de prefijo estático

Para una sesión de agente de 50 turnos con un prompt del sistema de 4.000 tokens, el almacenamiento en caché típicamente reduce los costos de tokens de entrada en un 40–60%. A precios de Opus, esto es significativo.

**Puntos de interrupción manuales** (cuando necesitas control preciso):

```python
from claude_agent_sdk import CacheBreakpoint

config = AgentConfig(
    model="claude-opus-4-7",
    system=[
        {"type": "text", "text": stable_instructions},
        CacheBreakpoint(),                           # cache everything above here
        {"type": "text", "text": dynamic_context},  # not cached — changes per run
    ],
)
```

---

## Implementación del proveedor de nube

El SDK lee variables de entorno del proveedor para enrutar llamadas API a Bedrock, Vertex o Foundry. No se requieren cambios de código — solo configuración de entorno.

### AWS Bedrock

```bash
export CLAUDE_CODE_USE_BEDROCK=1
export AWS_REGION=us-east-1
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
# Or use an IAM role — the SDK uses boto3 credential chain
```

El SDK usa automáticamente el punto final de Bedrock cuando `CLAUDE_CODE_USE_BEDROCK=1` está establecido. Los IDs de modelo se asignan automáticamente — aún pasas `model="claude-opus-4-7"` en tu código.

### Google Vertex AI

```bash
export CLAUDE_CODE_USE_VERTEX=1
export CLOUD_ML_REGION=us-east5
export ANTHROPIC_VERTEX_PROJECT_ID=your-gcp-project-id
# gcloud auth application-default login
```

### AWS Bedrock con rol de cuenta cruzada explícito

```python
import boto3
from claude_agent_sdk import Agent, AgentConfig

session = boto3.Session(
    aws_access_key_id="...",
    aws_secret_access_key="...",
    aws_session_token="...",
    region_name="us-east-1",
)

agent = Agent(
    config=AgentConfig(model="claude-opus-4-7"),
    bedrock_session=session,  # override the default credential chain
)
```

### Anthropic Foundry

```bash
export ANTHROPIC_FOUNDRY_URL=https://your-foundry-endpoint.example.com
export ANTHROPIC_API_KEY=sk-ant-...
```

Los puntos finales de Foundry se comportan idénticamente a la API estándar — mismo SDK, mismos nombres de modelo, mismo formato de evento. Cambia entre Foundry y estándar alternando la variable de entorno.

---

## Modelo de costos — Actualización de junio de 2026

A partir del 15 de junio de 2026, las sesiones del SDK de Agent se extraen de un **fondo de crédito mensual separado** que es independiente de tus límites de terminal de Claude Code interactivo y tus límites de chat de Claude.ai.

Implicaciones prácticas:
- Ejecutar un agente autónomo largo durante la noche no consume tu cuota interactiva
- El fondo de agente tiene su propio límite mensual — monitoréalo por separado en la consola de Anthropic
- Los subagentes generados por el SDK también se extraen del fondo de agente, no del fondo interactivo
- Los Managed Agents (`client.beta.sessions.create`) y las sesiones del SDK de Agent comparten el mismo fondo

El uso del fondo es visible en console.anthropic.com → Usage → Agent SDK.

Si excedes el fondo de agente, las llamadas devuelven un `429` con `error_code: "agent_credit_exceeded"`. Maneja esto en producción:

```python
from claude_agent_sdk.exceptions import AgentCreditExceeded

try:
    async for event in agent.run(task):
        process(event)
except AgentCreditExceeded:
    await alert_oncall("Agent SDK credit pool exhausted — check Anthropic console")
    raise
```

---

## Ejemplo de extremo a extremo: Agente autónomo de corrección de código

Un agente de producción realista que monitorea una cola de fallos de CI, extrae salida de prueba fallida, identifica la causa raíz, aplica una corrección y abre una solicitud de extracción.

```python
# fix_agent.py
import asyncio
import os
from dataclasses import dataclass

from claude_agent_sdk import Agent, AgentConfig, CacheConfig, MCPServer, Session
from claude_agent_sdk import HookAction, PermissionMode
from claude_agent_sdk.hooks import PreToolUseHook, PostToolUseHook, StopHook

# --- System prompt (long, stable — prime caching candidate) ---
SYSTEM = """
You are an autonomous code-fixing agent. Your job:
1. Read the failing test output provided to you.
2. Locate the source of the failure — read the relevant files.
3. Apply the minimal correct fix — do not refactor unrelated code.
4. Run the tests to verify the fix.
5. Open a pull request via the github MCP tool with a clear description.

Rules:
- Never modify test files unless the test itself is wrong and you can prove it.
- Never modify lock files, generated files, or vendor directories.
- If you cannot find a clear fix in 10 tool calls, stop and write a detailed diagnosis instead.
- Your PR title must start with "fix: ".
""".strip()


# --- Hooks ---

class SafetyHook(PreToolUseHook):
    BLOCKED_PATTERNS = [
        "rm -rf",
        "git push --force",
        "DROP TABLE",
        "truncate",
    ]

    async def run(self, tool_name: str, tool_input: dict) -> HookAction:
        if tool_name == "Bash":
            cmd = tool_input.get("command", "")
            for pattern in self.BLOCKED_PATTERNS:
                if pattern in cmd:
                    return HookAction.deny(f"Blocked dangerous command pattern: {pattern!r}")
        if tool_name in ("Write", "Edit"):
            path = tool_input.get("path", "")
            for protected in ("vendor/", "node_modules/", ".git/", "package-lock.json"):
                if protected in path:
                    return HookAction.deny(f"Blocked write to protected path: {path}")
        return HookAction.allow()


class AuditHook(PostToolUseHook):
    def __init__(self, run_id: str):
        self.run_id = run_id
        self.calls: list[dict] = []

    async def run(self, tool_name: str, tool_input: dict, tool_result: str) -> str:
        self.calls.append({"tool": tool_name, "input": tool_input})
        return tool_result  # pass through unmodified


class BudgetHook(StopHook):
    async def run(self, session_stats: dict) -> None:
        tokens = session_stats.get("total_tokens", 0)
        cost_usd = tokens / 1_000_000 * 15  # rough Opus input cost
        if cost_usd > 5.0:
            import logging
            logging.warning(f"Fix agent session cost ~${cost_usd:.2f} ({tokens:,} tokens)")


# --- Agent factory ---

def build_fix_agent(run_id: str) -> Agent:
    audit = AuditHook(run_id=run_id)

    return Agent(
        config=AgentConfig(
            model="claude-opus-4-7",
            system=SYSTEM,
            max_turns=30,
            cache_config=CacheConfig(auto_breakpoints=True, min_cache_tokens=1024),
            permission_mode=PermissionMode.STRICT,
            permissions={
                "allow": [
                    "Read(**)",
                    "Glob(**)",
                    "Grep(**)",
                    "Bash(git status)",
                    "Bash(git diff *)",
                    "Bash(git log *)",
                    "Bash(git checkout -b *)",
                    "Bash(git add *)",
                    "Bash(git commit *)",
                    "Bash(pytest *)",
                    "Bash(python -m pytest *)",
                    "Bash(npm test *)",
                ],
                "ask": [
                    "Write(*)",
                    "Edit(*)",
                    "Bash(git push *)",
                ],
                "deny": [
                    "Bash(rm -rf *)",
                    "Bash(git push --force*)",
                    "Bash(git reset --hard *)",
                ],
            },
            mcp_servers=[
                MCPServer(
                    name="github",
                    url=os.environ["GITHUB_MCP_URL"],
                    api_key_env="GITHUB_MCP_KEY",
                )
            ],
            subagent_config={
                "model": "claude-sonnet-4-6",
                "max_turns": 10,
                "tools": ["Read", "Grep", "Glob", "Bash"],
            },
        ),
        hooks=[SafetyHook(), audit, BudgetHook()],
    )


# --- Task runner ---

@dataclass
class CIFailure:
    repo: str
    branch: str
    run_id: str
    test_output: str


async def fix_ci_failure(failure: CIFailure) -> bool:
    session_path = f"/tmp/fix-sessions/{failure.run_id}.jsonl"
    os.makedirs("/tmp/fix-sessions", exist_ok=True)

    agent = build_fix_agent(run_id=failure.run_id)
    session = Session(path=session_path)

    task = f"""
Repository: {failure.repo}
Branch: {failure.branch}

Failing test output:
---
{failure.test_output}
---

Fix the failure and open a pull request targeting main.
"""

    success = False
    async for event in agent.run(task, session=session):
        if event.type == "text":
            print(event.content, end="", flush=True)
        elif event.type == "tool_use":
            print(f"\n  [{event.tool_name}]", flush=True)
        elif event.type == "stop":
            success = event.stop_reason == "end_turn"
            print(f"\n[stop: {event.stop_reason}]")

    return success


# --- Entry point ---

async def main():
    # In production, pull from a queue (SQS, Redis, etc.)
    failure = CIFailure(
        repo="my-org/my-repo",
        branch="feature/user-auth",
        run_id="ci-run-20260602-001",
        test_output=open("/tmp/test-output.txt").read(),
    )

    fixed = await fix_ci_failure(failure)
    exit(0 if fixed else 1)


if __name__ == "__main__":
    asyncio.run(main())
```

Este agente:
- Usa permisos `STRICT` para que ninguna llamada de herramienta no listada pase silenciosamente
- Pone operaciones peligrosas (escrituras, pushes) en `ask` para que requieran aprobación de hook
- Cachea el prompt del sistema en todos los turnos (ahorro de costo significativo en 30 turnos)
- Persiste el estado de la sesión a JSONL para que un fallo durante la ejecución pueda reanudarse
- Usa Sonnet para subagentes para reducir costo en subtareas mecánicas
- Se conecta a GitHub vía MCP para creación de PR sin credenciales git a nivel de shell
- Audita cada llamada de herramienta para revisión de cumplimiento

---

## Lista de verificación de implementación

Antes de enviar una aplicación del SDK de Agent a producción:

- [ ] `CacheConfig(auto_breakpoints=True)` está establecido — no pagues por re-tokenización repetida de prompt del sistema
- [ ] `PermissionMode.STRICT` está establecido — no permitas llamadas de herramientas arbitrarias en producción
- [ ] `PreToolUseHook` bloquea patrones peligrosos de Bash — `rm -rf`, pushes forzados, drops de base de datos
- [ ] Las sesiones escriben en almacenamiento duradero (no `/tmp`) — usa S3, GCS o un volumen montado
- [ ] `AgentCreditExceeded` es capturado y alertado — el fondo de agente es separado y puede agotarse
- [ ] `max_turns` está establecido conservadoramente — un bucle de agente sin límites es un costo sin límites
- [ ] Las variables de entorno del proveedor de nube están establecidas vía administrador de secretos — no codificadas
- [ ] Las referencias de `api_key_env` de MCP están en variables de entorno — no strings en línea
- [ ] Los subagentes usan un modelo más barato — reserva Opus para orquestación, Sonnet para ejecución
- [ ] `StopHook` registra uso de tokens por sesión — necesario para atribución de costo

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
