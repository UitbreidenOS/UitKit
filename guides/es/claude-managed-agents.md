# Agentes gestionados de Claude

Managed Agents es el tiempo de ejecución del agente hospedado en la nube de Anthropic, accesible a través de la API de Anthropic. Usted define un agente — su modelo, mensaje de sistema y herramientas — y Anthropic maneja la infraestructura: sandboxes de computación, bucles de ejecución, redes y ciclo de vida de la sesión. Interactúa con ella a través del SDK estándar de Anthropic o la CLI `ant`.

Esto es diferente de los subagentes de Claude Code. Los subagentes se ejecutan en su sesión de Claude Code local. Los agentes gestionados se ejecutan en la nube de Anthropic, independientemente de su terminal, y pueden activarse programáticamente desde su propio producto.

---

## Cuatro conceptos principales

**Agente** — El modelo, el mensaje del sistema y la configuración de herramientas. Define qué es el agente y qué puede hacer. Creado una vez, reutilizado en múltiples sesiones.

**Entorno** — La sandbox de computación donde se ejecuta el agente. Puede estar hospedado en la nube (administrado por Anthropic) o autohospedado. Los entornos persisten entre sesiones si se configuran para hacerlo — pueden contener estado, archivos y paquetes instalados.

**Sesión** — Una sola ejecución: un agente en un entorno, activado por un mensaje inicial. Las sesiones producen un flujo de eventos. Una sesión termina cuando el agente se detiene o genera un error.

**Eventos** — Eventos enviados por el servidor (SSE) emitidos durante una sesión. Los tipos de eventos incluyen `agent.message` (salida de texto), `agent.tool_use` (invocaciones de herramientas), `agent.tool_result` (salida de herramientas) y `agent.done` (fin de sesión). Su aplicación consume este flujo.

---

## Requisitos y disponibilidad

**Encabezado beta:** La API está en beta. Todas las solicitudes requieren el encabezado `anthropic-beta: managed-agents-2026-04-01`. Los SDK de Python y TypeScript lo establecen automáticamente cuando usa el espacio de nombres `client.beta.agents`.

**Tipo de herramienta:** Para dar al agente el conjunto completo de herramientas integradas (Bash, operaciones de archivo, búsqueda web, búsqueda web, servidores MCP), incluya esta configuración de herramienta:

```json
{ "type": "agent_toolset_20260401" }
```

**No elegible para:** Zero Data Retention o HIPAA BAA. No use Managed Agents para datos de salud o cargas de trabajo que requieren ZDR.

**Límites de velocidad:** 300 RPM para operaciones de creación, 600 RPM para operaciones de lectura.

**Soporte SDK:** Python, TypeScript, Java, Go, C#, Ruby, PHP.

---

## Tipos de entorno

```python
# Administrado por la nube — Anthropic proporciona computación
# networking.type: "unrestricted" (internet completo) o "none" (aislado)
config = {"type": "cloud", "networking": {"type": "unrestricted"}}

# Autohospedado — usted proporciona la sandbox
config = {"type": "self_hosted", "url": "https://your-sandbox.example.com"}
```

Utilice redes `unrestricted` cuando el agente necesite obtener URL, llamar a API externas o clonar repositorios. Utilice `none` para ejecución de código aislada o tareas de análisis donde el acceso a la red sería una desventaja.

---

## SDK de Python

### Instalación

```bash
pip install anthropic
```

### Ejemplo completo

```python
import anthropic

client = anthropic.Anthropic()

# 1. Cree el agente (haga esto una vez — reutilice el ID)
agent = client.beta.agents.create(
    name="code-reviewer",
    model="claude-opus-4-7",
    tools=[{"type": "agent_toolset_20260401"}],
    system="You are a senior engineer. Review code for correctness, performance, and security. Be specific — cite line numbers and explain your reasoning."
)

# 2. Cree el entorno
environment = client.beta.environments.create(
    name="review-env",
    config={"type": "cloud", "networking": {"type": "none"}}
)

# 3. Inicie una sesión
session = client.beta.sessions.create(
    agent=agent.id,
    environment_id=environment.id,
    initial_message="Clone https://github.com/my-org/my-repo and review the auth module for security issues."
)

# 4. Eventos de flujo
with client.beta.sessions.events.stream(session.id) as stream:
    for event in stream:
        if event.type == "agent.message":
            print(event.content, end="", flush=True)
        elif event.type == "agent.tool_use":
            print(f"\n[tool: {event.name}]")
        elif event.type == "agent.done":
            print(f"\n[session complete — status: {event.status}]")
```

### Reutilización de agentes y entornos

La creación de agentes y entornos está separada de la creación de sesiones por diseño. Cree el agente una vez, almacene su ID y reutilícelo:

```python
# Almacenar agent.id y environment.id en su base de datos o configuración
AGENT_ID = "agt_01abc..."
ENV_ID = "env_01xyz..."

# Activar una nueva sesión para cada tarea
session = client.beta.sessions.create(
    agent=AGENT_ID,
    environment_id=ENV_ID,
    initial_message=user_request
)
```

### Sondeo en lugar de streaming

```python
import time

session = client.beta.sessions.create(
    agent=AGENT_ID,
    environment_id=ENV_ID,
    initial_message="Summarize the README."
)

# Sonde hasta completar
while True:
    status = client.beta.sessions.retrieve(session.id)
    if status.status in ("completed", "failed", "cancelled"):
        break
    time.sleep(2)

# Recuperar salida completa
events = client.beta.sessions.events.list(session.id)
for event in events.data:
    if event.type == "agent.message":
        print(event.content)
```

---

## SDK de TypeScript

```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const agent = await client.beta.agents.create({
  name: "code-reviewer",
  model: "claude-opus-4-7",
  tools: [{ type: "agent_toolset_20260401" }],
  system: "You are a senior engineer. Review code for correctness, performance, and security.",
});

const environment = await client.beta.environments.create({
  name: "review-env",
  config: { type: "cloud", networking: { type: "none" } },
});

const session = await client.beta.sessions.create({
  agent: agent.id,
  environment_id: environment.id,
  initial_message: "Review the auth module for security issues.",
});

const stream = client.beta.sessions.events.stream(session.id);

for await (const event of stream) {
  if (event.type === "agent.message") {
    process.stdout.write(event.content);
  } else if (event.type === "agent.done") {
    console.log(`\nDone — status: ${event.status}`);
  }
}
```

---

## La CLI `ant`

Anthropic envía una CLI separada (`ant`) para trabajar con Managed Agents desde la terminal. Es distinta de la CLI `claude`.

**Instalación:**

```bash
# macOS vía Homebrew
brew install anthropic/tap/ant

# Instalador curl
curl -fsSL https://anthropic.com/install-ant.sh | sh

# Go
go install github.com/anthropics/ant@latest
```

**Comandos básicos:**

```bash
# Crear un agente desde un archivo de configuración
ant agents create --config agent.yaml

# Iniciar una sesión interactivamente
ant sessions start --agent agt_01abc --env env_01xyz

# Seguimiento del flujo de eventos de una sesión en ejecución
ant sessions tail <session-id>

# Listar sesiones en ejecución
ant sessions list
```

**Incorporación:** Desde Claude Code, ejecute `/claude-api managed-agents-onboard` para recorrer la vinculación de cuentas, la creación del primer agente y la configuración del entorno de forma interactiva.

---

## Agentes gestionados vs subagentes de Claude Code

| Dimensión | Agentes gestionados | Subagentes de Claude Code |
|---|---|---|
| Dónde se ejecutan | Nube de Anthropic (o su sandbox) | Su sesión local de Claude Code |
| Terminal requerida | No — se ejecuta independientemente | Sí — vive en su sesión |
| Caso de uso | Async, orientado a API, incrustado en producto | Interactivo, flujos de trabajo de desarrollo local |
| Activación | Via API o CLI `ant` | Via `/agent` u orquestación en CLAUDE.md |
| Persistencia de estado | El entorno persiste entre sesiones | Solo con alcance de sesión |
| Redes | Configurable (sin restricciones o ninguna) | Hereda la red local |
| ZDR / HIPAA | No elegible | Sujeto a su nivel de cuenta |

**Use Managed Agents cuando:**
- Necesite que un agente se ejecute sin que su terminal permanezca abierto
- Está construyendo un producto donde los usuarios activan agentes mediante programación
- Desea ejecuciones de agentes paralelas y aisladas (un entorno por cliente)
- La tarea es de larga duración y desea ejecución alojada en la nube

**Use subagentes de Claude Code cuando:**
- Está en un flujo de trabajo de desarrollo local
- El agente necesita leer archivos locales, ejecutar servicios locales o usar herramientas de su máquina
- Desea control interactivo ajustado con la capacidad de interrumpir y redirigir

---

## Patrones prácticos

### Fan-out: ejecutar agentes en paralelo

```python
import asyncio
import anthropic

client = anthropic.Anthropic()

async def run_agent_session(agent_id: str, env_id: str, task: str) -> str:
    session = client.beta.sessions.create(
        agent=agent_id,
        environment_id=env_id,
        initial_message=task
    )
    output = []
    with client.beta.sessions.events.stream(session.id) as stream:
        for event in stream:
            if event.type == "agent.message":
                output.append(event.content)
    return "".join(output)

# Ejecutar múltiples tareas en paralelo en entornos separados
tasks = [
    "Review module A for security issues",
    "Review module B for performance issues",
    "Review module C for correctness",
]

results = asyncio.run(asyncio.gather(*[
    run_agent_session(AGENT_ID, env_id, task)
    for env_id, task in zip(env_ids, tasks)
]))
```

### Agentes activados por webhook

```python
from flask import Flask, request
import anthropic

app = Flask(__name__)
client = anthropic.Anthropic()

@app.route("/trigger", methods=["POST"])
def trigger_agent():
    data = request.json
    session = client.beta.sessions.create(
        agent=AGENT_ID,
        environment_id=ENV_ID,
        initial_message=data["task"]
    )
    # Retorne el ID de sesión — cliente sondea o se suscribe vía SSE
    return {"session_id": session.id}
```

---
