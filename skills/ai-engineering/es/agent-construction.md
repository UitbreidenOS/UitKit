> 🇪🇸 Esta es la traducción en español. [Versión en inglés](../agent-construction.md).

# Skill de Construcción de Agentes

## Cuándo activar
- Diseñar un sistema multi-agente con Claude (orquestador + subagentes)
- Construir un agente impulsado por Claude que usa herramientas a lo largo de múltiples turnos
- Diseñar memoria para un agente de larga duración (en contexto vs. externa)
- Manejar errores, reintentos y condiciones de parada del agente
- Implementar transferencias de control entre subagentes especializados

## Cuándo NO usar
- Llamadas de API a Claude de un solo turno — el skill de Claude API es suficiente
- Chatbots simples sin uso de herramientas ni toma de decisiones autónoma
- Abstracciones de LangChain/LlamaIndex — abordar la capa de abstracción directamente

## Instrucciones

### Patrones de arquitectura de agentes

**Agente único con herramientas** — una instancia de Claude, múltiples herramientas, bucles hasta completar la tarea:
```
Usuario → Agente → [Herramienta A] → [Herramienta B] → Agente → Usuario
```

**Orquestador + subagentes** — un padre genera hijos especializados:
```
Usuario → Orquestador → [AgenteInvestigación] → [AgenteEscritura] → Orquestador → Usuario
```

**Pipeline** — los agentes pasan resultados en secuencia:
```
Usuario → Agente1(clasificar) → Agente2(extraer) → Agente3(generar) → Usuario
```

Elige la arquitectura más simple que resuelva el problema. Un agente único con herramientas maneja la mayoría de los casos.

### Diseño de herramientas
```python
# Definiciones de herramientas para el bucle del agente multi-turno
tools = [
    {
        "name": "search_web",
        "description": "Search the web for current information. Use when you need facts not in your training data.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Search query"}
            },
            "required": ["query"]
        }
    },
    {
        "name": "read_file",
        "description": "Read contents of a file by path.",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {"type": "string", "description": "Absolute file path"}
            },
            "required": ["path"]
        }
    },
    {
        "name": "write_file",
        "description": "Write content to a file. Creates the file if it doesn't exist.",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {"type": "string"},
                "content": {"type": "string"}
            },
            "required": ["path", "content"]
        }
    }
]
```

Reglas de diseño de herramientas:
- La descripción debe decirle a Claude CUÁNDO usarla, no solo qué hace
- Mantén `input_schema` mínimo — solo campos requeridos, sin ruido opcional
- Devuelve datos estructurados (JSON), no prosa, para que Claude pueda usarlos de forma fiable
- Una herramienta por acción — no combines lectura+escritura en una sola herramienta

### Bucle del agente
```python
import anthropic
import json

client = anthropic.Anthropic()

def run_agent(task: str, max_iterations: int = 20) -> str:
    messages = [{"role": "user", "content": task}]
    
    for iteration in range(max_iterations):
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=4096,
            system=AGENT_SYSTEM_PROMPT,
            tools=tools,
            messages=messages,
        )
        
        # Agregar la respuesta del asistente
        messages.append({"role": "assistant", "content": response.content})
        
        if response.stop_reason == "end_turn":
            # Extraer la respuesta de texto final
            return next(b.text for b in response.content if hasattr(b, "text"))
        
        if response.stop_reason == "tool_use":
            # Ejecutar todas las llamadas a herramientas en esta respuesta
            tool_results = []
            for block in response.content:
                if block.type == "tool_use":
                    result = execute_tool(block.name, block.input)
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": json.dumps(result) if not isinstance(result, str) else result
                    })
            
            messages.append({"role": "user", "content": tool_results})
        else:
            # Razón de parada inesperada
            break
    
    raise RuntimeError(f"Agent exceeded {max_iterations} iterations without completing")


def execute_tool(name: str, inputs: dict) -> any:
    match name:
        case "search_web":
            return search(inputs["query"])
        case "read_file":
            return Path(inputs["path"]).read_text()
        case "write_file":
            Path(inputs["path"]).write_text(inputs["content"])
            return {"success": True, "path": inputs["path"]}
        case _:
            return {"error": f"Unknown tool: {name}"}
```

### Prompt de sistema para agentes
```
AGENT_SYSTEM_PROMPT = """You are an autonomous agent completing tasks step by step.

Approach:
1. Analyze the task before acting
2. Use the minimum tools necessary
3. Check your work before declaring done
4. If a tool returns an error, diagnose and retry once — if it fails again, report the error

Stopping conditions — declare "DONE: <result>" when:
- The task is fully complete
- You've hit an unrecoverable error after retrying
- You've been asked to do something harmful or impossible

Never loop more than 3 times on the same tool call with the same inputs.
"""
```

### Patrones de memoria

**Memoria en contexto** (array de mensajes) — para sesión única, estado pequeño:
```python
# Resumir cuando el contexto crece
if count_tokens(messages) > 150_000:
    summary = summarize_messages(messages[:-5])  # mantener los últimos 5 turnos
    messages = [
        {"role": "user", "content": f"[Previous context summary]\n{summary}"},
        {"role": "assistant", "content": "Understood. Continuing from where we left off."},
        *messages[-5:]
    ]
```

**Memoria externa** (para agentes multi-sesión):
```python
# Memoria simple basada en archivos
class AgentMemory:
    def __init__(self, path: str):
        self.path = Path(path)
        self.data = json.loads(self.path.read_text()) if self.path.exists() else {}

    def remember(self, key: str, value: any):
        self.data[key] = {"value": value, "timestamp": datetime.utcnow().isoformat()}
        self.path.write_text(json.dumps(self.data, indent=2))

    def recall(self, key: str) -> any:
        entry = self.data.get(key)
        return entry["value"] if entry else None

    def as_context(self) -> str:
        if not self.data:
            return ""
        lines = [f"- {k}: {v['value']}" for k, v in self.data.items()]
        return "Known context:\n" + "\n".join(lines)
```

### Patrón de orquestador
```python
def orchestrate(task: str) -> str:
    # Paso 1: El agente de planificación descompone la tarea
    plan = run_subagent(
        model="claude-sonnet-4-6",
        system="You are a planner. Decompose tasks into numbered steps.",
        task=f"Decompose this task into steps: {task}",
        tools=[]  # No se necesitan herramientas para planificar
    )

    # Paso 2: Ejecutar cada paso con agentes especializados
    results = []
    for step in parse_steps(plan):
        agent_type = classify_step(step)  # "research" | "code" | "write"
        result = run_subagent(
            model=agent_model(agent_type),
            system=agent_system_prompt(agent_type),
            task=step,
            tools=agent_tools(agent_type),
            context="\n".join(results)  # Dar contexto de pasos anteriores
        )
        results.append(f"Step result: {result}")

    # Paso 3: El agente de síntesis combina los resultados
    return run_subagent(
        model="claude-sonnet-4-6",
        system="You are a synthesizer. Combine step results into a final answer.",
        task=f"Original task: {task}\n\nStep results:\n" + "\n".join(results),
        tools=[]
    )
```

### Manejo de errores y condiciones de parada
```python
class AgentError(Exception):
    pass

class MaxIterationsError(AgentError):
    pass

class ToolFailureError(AgentError):
    pass

def execute_tool_safe(name: str, inputs: dict, consecutive_failures: dict) -> dict:
    try:
        result = execute_tool(name, inputs)
        consecutive_failures[name] = 0
        return {"success": True, "result": result}
    except Exception as e:
        consecutive_failures[name] = consecutive_failures.get(name, 0) + 1
        if consecutive_failures[name] >= 3:
            raise ToolFailureError(f"Tool {name} failed 3 consecutive times: {e}")
        return {"success": False, "error": str(e), "retry": True}
```

### Patrón de transferencia de control
```python
# El agente padre pasa el contexto explícitamente — los subagentes no tienen memoria de sesión
def handoff_to_specialist(context: dict, task: str, specialist: str) -> str:
    handoff_prompt = f"""
Context from orchestrator:
{json.dumps(context, indent=2)}

Your task:
{task}
"""
    return run_subagent(
        system=SPECIALIST_PROMPTS[specialist],
        task=handoff_prompt,
        tools=SPECIALIST_TOOLS[specialist]
    )
```

## Ejemplo

**Usuario:** Construir un agente de investigación que toma un tema, busca 3 fuentes en la web, lee cada URL y escribe un resumen de 500 palabras con citas en un archivo.

**Salida esperada:**
- Lista de `tools`: `search_web`, `fetch_url`, `write_file`
- Prompt de sistema: instruye al agente a buscar → obtener 3 URLs → sintetizar → escribir archivo antes de declarar terminado
- Bucle `run_agent(task)` con `max_iterations=15`
- Manejo de errores: si `fetch_url` falla, intentar con el siguiente resultado de búsqueda
- Salida final: ruta al archivo de resumen escrito

---
