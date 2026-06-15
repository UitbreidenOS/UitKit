---
name: agent-supervisor
description: "Construir agentes orquestadores que gestionen flujos de trabajo multiagente, apliquen SLA, manejen escaladas y mantengan la finalización general de tareas"
updated: 2026-06-15
---

# Habilidad Agent Supervisor

## Cuándo activar

- Construir un agente orquestrador que cree y gestione múltiples subagentes
- Implementar lógica de timeout/retry/escalación para flujos de trabajo multiagente
- Aplicar límites de recursos (tokens, latencia, costo) en un equipo de agentes
- Manejar descomposición de tareas y asignación de trabajo entre agentes
- Implementar gates de calidad y validación entre transferencias de agentes

## Cuándo NO usar

- Flujos de trabajo monoagente (no se requiere orquestación)
- Sistemas dirigidos por eventos sin coordinación centralizada
- Sistemas donde los agentes son completamente autónomos (sin supervisor)

## Instrucciones

### Responsabilidades del supervisor

El agente supervisor es propietario de:

1. **Planificación de tareas:** Descomponer solicitud del usuario en subtareas
2. **Delegación de agentes:** Asignar subtareas a agentes específicos
3. **Gestión de estado:** Mantener estado del flujo de trabajo y progreso
4. **Gates de calidad:** Validar salidas de agentes antes de proceder
5. **Manejo de errores:** Reintentar agentes fallidos, escalar problemas irresolubles
6. **Aplicación de recursos:** Rastrear y aplicar presupuestos (tokens, latencia, costo)
7. **Ensamblaje de resultados:** Recopilar salidas de agentes y producir resultado final

### Plantilla de prompt del sistema

```
You are a supervisor agent. Your job is to manage a team of specialized agents
and ensure they complete a complex task.

Your team consists of:
- researcher: Gathers information from sources
- analyst: Synthesizes findings
- writer: Generates final report

Your workflow:
1. Break the user's request into subtasks
2. Delegate subtasks to agents in sequence
3. Validate each agent's output
4. If output is invalid, retry the agent or escalate
5. Combine outputs into final result
```

### Descomposición de tareas

```python
def decompose_task(user_request: str) -> list:
    """
    Utilizar el agente supervisor para descomponer una tarea en subtareas.
    Retorna lista de subtareas con asignaciones de agentes.
    """
    import anthropic
    client = anthropic.Anthropic()
    response = client.messages.create(
        model="claude-opus-4-20250514",
        max_tokens=2048,
        system=SUPERVISOR_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": f"Decompose this task:\n\n{user_request}"}]
    )
    import json
    subtasks = json.loads(response.content[0].text)
    return subtasks
```

### Delegación de agentes

```python
def delegate_to_agent(subtask: dict, agent_name: str) -> dict:
    """
    Delegar una subtarea a un agente específico.
    Retorna la salida del agente.
    """
    subagent_result = spawn_agent(
        agent=agent_name,
        input=subtask['input'],
        timeout_ms=subtask.get('timeout_ms', 300000)
    )
    return {
        'subtask_id': subtask['subtask_id'],
        'agent': agent_name,
        'status': subagent_result['status'],
        'output': subagent_result['output'],
        'tokens_used': subagent_result['tokens_used'],
        'latency_ms': subagent_result['latency_ms']
    }
```

### Validación de gate de calidad

```python
def validate_agent_output(output: dict, expected_schema: dict) -> bool:
    """
    Validar que la salida del agente coincida con el esquema esperado.
    Retorna True si es válida, False en caso contrario.
    """
    import jsonschema
    try:
        jsonschema.validate(instance=output, schema=expected_schema)
        return True
    except jsonschema.ValidationError:
        return False
```

### Retry con backoff exponencial

```python
import asyncio

async def delegate_with_retry(subtask, agent_name, max_retries=3):
    """
    Delegar con retry automático en caso de fallo.
    Utiliza backoff exponencial: 1s, 2s, 4s
    """
    for attempt in range(max_retries):
        try:
            result = delegate_to_agent(subtask, agent_name)
            if result['status'] == 'success':
                return result
            if attempt < max_retries - 1:
                wait_time = 2 ** attempt
                await asyncio.sleep(wait_time)
        except Exception as e:
            if attempt == max_retries - 1:
                raise
    raise RuntimeError(f"Agent {agent_name} failed after {max_retries} attempts")
```

### Aplicación de recursos

```python
class ResourceBudget:
    def __init__(self, max_tokens=5000, max_latency_ms=300000, max_cost_cents=150):
        self.max_tokens = max_tokens
        self.max_latency_ms = max_latency_ms
        self.max_cost_cents = max_cost_cents
        self.tokens_used = 0
        self.latency_ms = 0
        self.cost_cents = 0
    
    def record_agent_call(self, agent_result):
        self.tokens_used += agent_result['tokens_used']['input'] + agent_result['tokens_used']['output']
        self.latency_ms += agent_result['latency_ms']
        self.cost_cents += agent_result.get('cost_cents', 0)
    
    def check_budget(self):
        if self.tokens_used > self.max_tokens:
            raise RuntimeError(f"Token budget exceeded: {self.tokens_used} / {self.max_tokens}")
```

---
