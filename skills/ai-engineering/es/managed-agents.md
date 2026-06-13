# Agentes Administrados

## Cuándo activar
Construyendo aplicaciones donde los agentes necesitan ejecutarse autónomamente en la nube, o cuando el usuario menciona Claude Managed Agents, tareas de agentes de larga duración, o construcción de productos impulsados por agentes a través de la API de Anthropic.

## Cuándo NO usar
- Subagentes de Claude Code ejecutándose en una sesión de terminal — esos usan la herramienta `Task`, no esta API
- Solicitudes síncronas cortas que se completan en menos de 10 segundos — usar la Messages API estándar
- Flujos de trabajo que requieren Retención Cero de Datos (ZDR) o BAA HIPAA — Managed Agents no son elegibles

## Instrucciones

### Conceptos Centrales
- **Agent:** entidad configurada con modelo, aviso del sistema y conjunto de herramientas permitidas
- **Environment:** sandbox de computación donde se ejecuta el agente (alojado en la nube por Anthropic, o auto-alojado)
- **Session:** una ejecución — tiene un inicio, un fin y una secuencia de eventos
- **Events:** secuencia de Server-Sent Events (SSE) que reporta lo que el agente está haciendo en tiempo real

**Distinción clave de subagentes de Claude Code:** Managed Agents se ejecutan independientemente de tu terminal en la nube de Anthropic. Úsalos para productos de agentes asincronos, de larga duración o impulsados por API — no para comandos de barra oblicua de Claude Code.

### Encabezado Beta
Todas las llamadas de API de Managed Agents requieren:
```
anthropic-beta: managed-agents-2026-04-01
```

### Tipo de Herramienta
Para dar a un agente acceso a todas las herramientas integradas (Bash, operaciones de archivo, búsqueda web, búsqueda web, MCP):
```python
tools=[{"type": "agent_toolset_20260401"}]
```

### Patrón de Python
```python
import anthropic

client = anthropic.Anthropic()

# 1. Create the agent (do once; reuse agent_id)
agent = client.beta.agents.create(
    model="claude-opus-4-5",
    name="research-agent",
    system="You are a research agent. When given a topic, search the web, gather facts, and produce a structured summary.",
    tools=[{"type": "agent_toolset_20260401"}],
)

# 2. Create an environment (cloud sandbox)
env = client.beta.environments.create(type="cloud")

# 3. Create a session and stream events
with client.beta.sessions.stream(
    agent_id=agent.id,
    environment_id=env.id,
    input="Research the latest developments in quantum computing and summarize in 3 bullet points.",
) as stream:
    for event in stream:
        if event.type == "agent.message":
            print(event.data.text, end="", flush=True)
        elif event.type == "agent.tool_use":
            print(f"\n[Tool: {event.data.name}]")
        elif event.type == "session.status_idle":
            print("\n[Session complete]")
            break
```

### Tipos de Eventos
| Event | Meaning |
|---|---|
| `agent.message` | Agent producing output text |
| `agent.tool_use` | Agent calling a tool — `data.name` is the tool name |
| `agent.tool_result` | Result returned from a tool call |
| `session.status_idle` | Agent has finished and is waiting |
| `session.status_error` | Session ended with an error |

### Sesión Asincrónica (Disparar y Sondear)
Para cargas de trabajo donde no quieres mantener una conexión abierta:
```python
# Start session without streaming
session = client.beta.sessions.create(
    agent_id=agent.id,
    environment_id=env.id,
    input="Analyze these 50 documents and extract action items.",
)
session_id = session.id

# Poll status later
import time
while True:
    session = client.beta.sessions.retrieve(session_id)
    if session.status in ("idle", "error"):
        break
    time.sleep(10)

# Retrieve output
output = client.beta.sessions.retrieve(session_id)
print(output.output)
```

### Límites de Velocidad
| Operation | Limit |
|---|---|
| Create session | 300 RPM |
| Read session / stream | 600 RPM |

### Prueba con la CLI `ant`
```bash
# Install
npm install -g @anthropic-ai/ant

# Test an agent interactively
ant run --agent-id <id> --environment cloud

# Run with a specific input
ant run --agent-id <id> --input "Summarize today's AI news"
```

### Gestión del Ciclo de Vida del Agente
- Los agentes son configuraciones persistentes — crear una vez, reutilizar en muchas sesiones
- Los entornos son sandboxes de computación por ejecución — crear uno nuevo por sesión para aislamiento
- Las sesiones son efímeras — almacena la salida antes de que la sesión expire
- Almacena `agent_id` en la configuración de tu aplicación; almacena la salida de la sesión en tu base de datos

### Cuándo Usar Entorno en Nube vs Auto-alojado
- **Cloud (`type: "cloud"`):** más rápido de iniciar, sin infraestructura, apropiado para la mayoría de casos de uso
- **Auto-alojado:** cuando el agente necesita acceso a recursos de red interna, almacenes de datos privados, o servidores de herramientas personalizadas no alcanzables desde la nube de Anthropic

## Ejemplo

Un producto que permite a los usuarios enviar tareas de investigación de forma asincrónica a través de un formulario web:

1. El usuario envía: "Find the top 5 competitors to our product and summarize their pricing"
2. La aplicación crea una sesión con entorno `type: "cloud"` — almacena `session_id` en la cola de trabajos
3. La aplicación regresa inmediatamente: "Your research report will be ready in ~10 minutes"
4. Un trabajador en segundo plano sondea el estado de la sesión cada 30 segundos
5. Cuando `session.status == "idle"`, el trabajador recupera `session.output` y envía un correo electrónico al usuario
6. El usuario recibe un análisis de 5 competidores estructurado con tablas de precios

Toda la ejecución del agente — búsquedas web, extracción de datos, síntesis — ocurre en la nube de Anthropic sin gestión de infraestructura.

---
