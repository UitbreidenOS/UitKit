---
name: agent-tracing
description: "Construir observabilidad en sistemas multiagente con trazas distribuidas, correlación de trazas, puntos de interrupción y reproducciones de ejecución"
updated: 2026-06-15
---

# Habilidad Agent Tracing

## Cuándo activar

- Depurar comportamiento no determinista del agente (la misma entrada produce salidas diferentes)
- Analizar rendimiento del agente e identificar cuellos de botella (¿qué agente es lento?)
- Análisis posterior a incidentes de flujos de trabajo fallidos (¿qué salió mal?)
- Probar nuevas arquitecturas de agentes o prompts antes del despliegue en producción
- Construir tableros y monitoreo para sistemas multiagente

## Cuándo NO usar

- Depuración simple monoagente (adjuntar debugger directamente)
- Sistemas en producción sin instrumentación (comenzar con tracing básico primero)
- Sistemas de alto volumen donde la sobrecarga de tracing no es aceptable (usar muestreo)

## Instrucciones

### Estructura de traza

Cada llamada de agente genera una traza:

```json
{
  "trace_id": "tr_abc123xyz",
  "session_id": "sess_def456",
  "workflow": "research_and_synthesize",
  "started_at": "2026-06-15T14:00:00Z",
  "completed_at": "2026-06-15T14:20:15Z",
  
  "agent_calls": [
    {
      "call_id": "call_1",
      "agent": "researcher",
      "parent_call_id": null,
      "depth": 0,
      "model": "claude-opus-4-20250514",
      "started_at": "2026-06-15T14:00:01Z",
      "completed_at": "2026-06-15T14:15:30Z",
      "duration_ms": 929000,
      "tokens": {"input": 2400, "output": 1850, "total": 4250},
      "input": {"task": "Research Quantum Computing", "constraints": {"max_sources": 10}},
      "output": {"sources": [...], "summary": "..."},
      "tool_calls": [{"tool": "web_search", "args": {"query": "quantum computing 2026"}, "result": {...}, "duration_ms": 450}],
      "status": "completed",
      "cost_cents": 78
    }
  ],
  
  "metadata": {"request_id": "req_xyz789", "user_id": "user_123", "environment": "production"}
}
```

Guardar en `.claude/agent-traces.jsonl` (solo añadir JSONL).

### Instrumentación de llamadas de agentes

```python
def trace_agent_call(agent_name, input_data, parent_call_id=None):
    """
    Decorador para llamadas de agentes que genera trazas automáticamente.
    """
    from datetime import datetime
    import uuid
    import json
    
    call_id = f"call_{uuid.uuid4().hex[:8]}"
    started_at = datetime.utcnow().isoformat() + 'Z'
    
    def decorator(agent_func):
        def wrapper(*args, **kwargs):
            result = agent_func(*args, **kwargs)
            trace = {
                'call_id': call_id,
                'agent': agent_name,
                'parent_call_id': parent_call_id,
                'started_at': started_at,
                'completed_at': datetime.utcnow().isoformat() + 'Z',
                'input': input_data,
                'output': result,
                'status': 'completed'
            }
            with open('.claude/agent-traces.jsonl', 'a') as f:
                f.write(json.dumps(trace) + '\n')
            return result
        return wrapper
    return decorator
```

### Consulta de trazas

```python
def find_traces(workflow=None, agent=None, status=None):
    """
    Consultar trazas por varios criterios.
    """
    import json
    matching_traces = []
    with open('.claude/agent-traces.jsonl', 'r') as f:
        for line in f:
            trace = json.loads(line)
            if workflow and trace.get('workflow') != workflow:
                continue
            if agent and not any(c['agent'] == agent for c in trace.get('agent_calls', [])):
                continue
            if status and trace.get('status') != status:
                continue
            matching_traces.append(trace)
    return matching_traces
```

### Puntos de interrupción interactivos

```python
def set_breakpoint(condition_fn, action='pause', inspect_keys=None):
    """
    Establecer un punto de interrupción que se dispara cuando la condición es verdadera.
    """
    return {
        'condition': condition_fn,
        'action': action,
        'inspect_keys': inspect_keys or []
    }
```

### Reproducción de ejecución

```python
def replay_from_call(trace_id, call_id, modifications=None):
    """
    Re-ejecutar una traza desde un ID de llamada específico con modificaciones opcionales.
    """
    import json
    trace = None
    with open('.claude/agent-traces.jsonl', 'r') as f:
        for line in f:
            t = json.loads(line)
            if t.get('trace_id') == trace_id:
                trace = t
                break
    
    if not trace:
        raise ValueError(f"Trace {trace_id} not found")
    
    calls = {c['call_id']: c for c in trace.get('agent_calls', [])}
    if call_id not in calls:
        raise ValueError(f"Call {call_id} not found in trace")
    
    replay_call = calls[call_id]
    input_data = replay_call['input']
    if modifications:
        input_data = {**input_data, **modifications}
    
    agent_func = get_agent_function(replay_call['agent'])
    new_result = agent_func(input_data, model=replay_call['model'])
    original_output = replay_call['output']
    diff = compare_outputs(original_output, new_result)
    
    return {
        'original': original_output,
        'new': new_result,
        'diff': diff,
        'deterministic': len(diff) == 0
    }
```

---
