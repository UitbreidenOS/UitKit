---
name: agent-handoff
description: "Implementar transferencias estructuradas entre agentes con transferencia de estado basada en JSON, detección de conflictos y protocolos de confirmación"
updated: 2026-06-15
---

# Habilidad Agent Handoff

## Cuándo activar

- Pasar trabajo de un agente a otro en un flujo de trabajo multiagente
- Implementar ciclos de solicitud/respuesta entre agentes en un pipeline
- Construir equipos de agentes donde un agente depende de la salida de otro
- Depurar por qué un agente recibe entrada incorrecta o incompleta de un agente anterior
- Garantizar que las mutaciones de estado se propaguen correctamente entre agentes

## Cuándo NO usar

- Bucles monoagente (no se requiere handoff)
- Flujos de trabajo asincronos dirigidos por eventos sin ciclos explícitos de solicitud/respuesta
- Flujos de trabajo donde los agentes no son directamente dependientes entre sí

## Instrucciones

### Esquema de paquete de handoff

Un handoff es un paquete JSON que se pasa de un agente al siguiente:

```json
{
  "handoff_id": "hof_xyz123",
  "from_agent": "researcher",
  "to_agent": "analyst",
  "timestamp": "2026-06-15T14:15:30Z",
  "session_id": "sess_abc789",
  "trace_id": "tr_xyz456",
  
  "phase_name": "research",
  "phase_status": "completed",
  
  "payload": {
    "sources": [
      {"title": "...", "url": "...", "credibility": "high", "summary": "..."},
      {"title": "...", "url": "...", "credibility": "medium", "summary": "..."}
    ],
    "research_summary": "Found 15 credible sources on quantum computing...",
    "research_duration_seconds": 900
  },
  
  "metadata": {
    "tokens_used": {"input": 2400, "output": 1850},
    "model": "claude-opus-4-20250514",
    "output_schema": {
      "type": "object",
      "properties": {
        "sources": {"type": "array"},
        "research_summary": {"type": "string"}
      }
    }
  },
  
  "constraints_for_next_agent": [
    "Do not contradict findings from sources with credibility = 'high'",
    "Budget max 30 minutes for analysis phase"
  ],
  
  "required_tools_for_next_agent": ["web_search", "fetch_url"],
  
  "next_steps": {
    "agent": "analyst",
    "action": "analyze_findings",
    "estimated_latency_seconds": 1800
  }
}
```

### Validación antes de handoff

El agente que envía debe validar la carga útil antes del handoff:

```python
def validate_handoff(handoff_packet, expected_schema):
    """
    Valide que el paquete de handoff coincida con el esquema esperado.
    Genera ValueError si la validación falla.
    """
    # Verificar campos requeridos
    required = ['handoff_id', 'from_agent', 'to_agent', 'payload', 'timestamp']
    for field in required:
        if field not in handoff_packet:
            raise ValueError(f"Missing required field: {field}")
    
    # Validar carga útil contra esquema
    import jsonschema
    jsonschema.validate(
        instance=handoff_packet['payload'],
        schema=expected_schema
    )
    
    # Validar que la marca de tiempo sea reciente
    from datetime import datetime, timedelta
    ts = datetime.fromisoformat(handoff_packet['timestamp'].replace('Z', '+00:00'))
    if datetime.now(ts.tzinfo) - ts > timedelta(seconds=300):
        raise ValueError("Handoff timestamp is stale (> 5 minutes old)")
    
    return True
```

No proceda con handoff si la validación falla. Registre el error y escale.

### Enviar un handoff

```python
def send_handoff(handoff_packet, to_agent_inbox='.claude/agent-inboxes/'):
    """
    Escriba el paquete de handoff en la bandeja de entrada del agente receptor.
    Retorna el identificador de espera de confirmación.
    """
    import json
    from pathlib import Path
    
    # Escribir en la bandeja de entrada del agente
    inbox_dir = Path(to_agent_inbox) / handoff_packet['to_agent']
    inbox_dir.mkdir(parents=True, exist_ok=True)
    
    handoff_file = inbox_dir / f"{handoff_packet['handoff_id']}.json"
    with open(handoff_file, 'w') as f:
        json.dump(handoff_packet, f)
    
    # Retornar identificador de espera (esperar confirmación)
    return {
        'handoff_id': handoff_packet['handoff_id'],
        'acknowledgment_file': inbox_dir / f"{handoff_packet['handoff_id']}.ack"
    }

def wait_for_acknowledgment(wait_handle, timeout_seconds=30):
    """
    Sondear confirmación del agente receptor.
    Timeout si no se recibe confirmación.
    """
    from pathlib import Path
    from time import sleep
    from datetime import datetime, timedelta
    
    ack_file = Path(wait_handle['acknowledgment_file'])
    start = datetime.now()
    
    while datetime.now() - start < timedelta(seconds=timeout_seconds):
        if ack_file.exists():
            with open(ack_file, 'r') as f:
                import json
                ack = json.load(f)
            return ack
        sleep(0.5)
    
    raise TimeoutError(f"No acknowledgment after {timeout_seconds}s for {wait_handle['handoff_id']}")
```

### Recibir un handoff

```python
def receive_handoff(from_agent, inbox_dir='.claude/agent-inboxes/'):
    """
    Sondear handoffs entrantes de un agente específico.
    Retornar el primer handoff disponible.
    """
    from pathlib import Path
    import json
    
    inbox = Path(inbox_dir) / from_agent
    
    # Encontrar el primer handoff no reconocido
    for handoff_file in sorted(inbox.glob('*.json')):
        ack_file = handoff_file.with_suffix('.ack')
        if not ack_file.exists():
            with open(handoff_file, 'r') as f:
                handoff = json.load(f)
            return handoff
    
    return None

def acknowledge_handoff(handoff_packet):
    """
    Enviar confirmación al agente remitente.
    """
    import json
    from pathlib import Path
    
    ack = {
        'handoff_id': handoff_packet['handoff_id'],
        'acknowledged_by': 'analyst',
        'timestamp': datetime.utcnow().isoformat() + 'Z',
        'ready_to_proceed': True
    }
    
    ack_file = Path('.claude/agent-inboxes') / handoff_packet['from_agent'] / f"{handoff_packet['handoff_id']}.ack"
    with open(ack_file, 'w') as f:
        json.dump(ack, f)
```

### Detección de conflictos

Cuando llega un handoff, verificar conflictos con el estado recibido anteriormente:

```python
def detect_handoff_conflict(new_handoff, previous_state):
    """
    Detectar si el nuevo handoff entra en conflicto con el estado anterior.
    Retorna detalles del conflicto o None si no hay conflicto.
    """
    if not previous_state:
        return None
    
    # Verificar si from_agent es igual (handoff lineal)
    if new_handoff['from_agent'] != previous_state.get('last_handoff_from'):
        return {
            'type': 'source_mismatch',
            'last_agent': previous_state.get('last_handoff_from'),
            'new_agent': new_handoff['from_agent']
        }
    
    # Verificar incompatibilidad de versión (¿han sido modificados los datos desde que los recibí?)
    if new_handoff.get('version', 1) < previous_state.get('last_handoff_version', 1):
        return {
            'type': 'version_downgrade',
            'previous_version': previous_state.get('last_handoff_version'),
            'new_version': new_handoff.get('version', 1)
        }
    
    return None
```

Si se detecta un conflicto, escale al supervisor antes de proceder.

### Ejemplo: Handoff de Investigación → Análisis

```python
# Agente de investigación (remitente)
def researcher_finalize():
    handoff = {
        'handoff_id': 'hof_r2a_001',
        'from_agent': 'researcher',
        'to_agent': 'analyst',
        'timestamp': '2026-06-15T14:15:30Z',
        'phase_name': 'research',
        'phase_status': 'completed',
        'payload': {
            'sources': [...],  # 15 fuentes
            'research_summary': '...'
        },
        'output_schema': {
            'type': 'object',
            'properties': {'sources': {'type': 'array'}, 'research_summary': {'type': 'string'}}
        },
        'constraints_for_next_agent': [
            'Do not ignore high-credibility sources',
            'Budget 30 min for analysis'
        ]
    }
    
    validate_handoff(handoff, handoff['output_schema'])
    wait_handle = send_handoff(handoff)
    ack = wait_for_acknowledgment(wait_handle)
    print(f"Handoff {handoff['handoff_id']} acknowledged at {ack['timestamp']}")

# Agente analista (receptor)
def analyst_receive():
    handoff = receive_handoff('researcher')
    if handoff:
        print(f"Received handoff {handoff['handoff_id']} from {handoff['from_agent']}")
        print(f"Sources: {len(handoff['payload']['sources'])}")
        acknowledge_handoff(handoff)
        
        # Ahora proceder con análisis
        analyze(handoff['payload'])
```

---
