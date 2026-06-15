---
name: multi-agent-memory
description: "Construir sistemas de memoria compartida y versionada para equipos multiagente usando patrón de pizarra, resolución de conflictos y consistencia eventual"
updated: 2026-06-15
---

# Habilidad Multi-Agent Memory

## Cuándo activar

- Construir sistemas multiagente donde los agentes necesitan acceder y modificar estado compartido
- Implementar arquitecturas de patrón de pizarra para flujos de trabajo colaborativos
- Manejar conflictos de memoria cuando múltiples agentes actualizan los mismos datos concurrentemente
- Diseñar memoria de agente que persista a través de múltiples ejecuciones de flujo de trabajo
- Implementar memoria de equipo de agentes (conocimiento episódico y semántico compartido entre agentes)

## Cuándo NO usar

- Flujos de trabajo monoagente con memoria privada (usar memoria en contexto)
- Flujos de trabajo de solo lectura sin estado compartido mutable
- Flujos de trabajo donde los agentes nunca acceden a los datos del otro

## Instrucciones

### Estructura de datos de pizarra

La pizarra es el repositorio central para todo el estado compartido:

```json
{
  "session_id": "sess_abc123",
  "created_at": "2026-06-15T14:00:00Z",
  "phases": {
    "phase_1": {
      "name": "research",
      "status": "completed",
      "owner": "researcher",
      "version": 5,
      "data": {
        "sources": [...],
        "summary": "..."
      },
      "locked_by": null,
      "locked_until": null
    }
  },
  "conflicts": [],
  "audit_log": ".claude/blackboard-audit.jsonl"
}
```

**Reglas:**
- Cada fase tiene un único propietario (el agente actualmente trabajando en ella)
- Las fases están versionadas (incrementar en cada escritura)
- Los agentes deben adquirir un bloqueo antes de escribir
- Los bloqueos tienen tiempos de espera (por defecto 30 minutos)

### Lectura desde la pizarra

```python
def read_blackboard(phase_name, blackboard_file='.claude/blackboard.json'):
    """
    Leer una fase desde la pizarra.
    Retorna los datos y número de versión.
    """
    import json
    
    with open(blackboard_file, 'r') as f:
        blackboard = json.load(f)
    
    if phase_name not in blackboard['phases']:
        raise KeyError(f"Phase '{phase_name}' not found in blackboard")
    
    phase = blackboard['phases'][phase_name]
    return {
        'data': phase['data'],
        'version': phase['version'],
        'status': phase['status']
    }
```

### Escritura en la pizarra

Siempre siga esta secuencia:

```python
def write_blackboard(phase_name, new_data, agent_name, blackboard_file='.claude/blackboard.json'):
    """
    Escribir en una fase de la pizarra.
    
    Pasos:
    1. Adquirir bloqueo
    2. Verificar versión (asegurar que nadie más la ha modificado)
    3. Fusionar cambios (no sobrescribir a ciegas)
    4. Escribir
    5. Liberar bloqueo
    """
    import json
    from datetime import datetime, timedelta
    
    with open(blackboard_file, 'r') as f:
        blackboard = json.load(f)
    
    phase = blackboard['phases'][phase_name]
    
    # Paso 1: Verificar si está bloqueada por otro agente
    if phase['locked_by'] and phase['locked_by'] != agent_name:
        lock_expired = datetime.fromisoformat(phase['locked_until']) < datetime.now()
        if not lock_expired:
            raise RuntimeError(f"Phase locked by {phase['locked_by']} until {phase['locked_until']}")
    
    # Paso 2: Adquirir bloqueo
    phase['locked_by'] = agent_name
    phase['locked_until'] = (datetime.now() + timedelta(minutes=30)).isoformat()
    
    # Paso 3: Fusionar cambios (para actualizaciones sin conflictos)
    merged_data = {**phase['data'], **new_data}
    
    # Paso 4: Escribir
    phase['data'] = merged_data
    phase['version'] += 1
    phase['owner'] = agent_name
    
    # Registrar en auditoría
    log_to_audit(blackboard_file, {
        'timestamp': datetime.now().isoformat(),
        'agent': agent_name,
        'phase': phase_name,
        'version': phase['version'],
        'action': 'write'
    })
    
    # Paso 5: Liberar bloqueo
    phase['locked_by'] = None
    phase['locked_until'] = None
    
    with open(blackboard_file, 'w') as f:
        json.dump(blackboard, f)
```

### Resolución de conflictos

Cuando múltiples agentes intentan modificar la misma fase:

```python
def detect_write_conflict(phase_name, version_read, blackboard_file='.claude/blackboard.json'):
    """
    Verificar si otro agente ha modificado la fase desde que la leímos.
    """
    import json
    
    with open(blackboard_file, 'r') as f:
        blackboard = json.load(f)
    
    phase = blackboard['phases'][phase_name]
    
    if phase['version'] > version_read:
        return {
            'conflict': True,
            'version_read': version_read,
            'version_current': phase['version'],
            'modified_by': phase['owner'],
            'action': 'merge' if is_mergeable(version_read, phase) else 'escalate'
        }
    
    return {'conflict': False}
```

### Fases de memoria

Definir fases para diferentes tipos de trabajo:

```json
{
  "phases": {
    "research": {"name": "Information gathering", "dependencies": []},
    "analysis": {"name": "Synthesizing findings", "dependencies": ["research"]},
    "synthesis": {"name": "Generating report", "dependencies": ["analysis"]}
  }
}
```

Los agentes pueden leer solo fases con `status: completed`.

### Ejemplo: Flujo de trabajo de memoria compartida

```python
# Agent 1: Investigador
def researcher_work():
    sources = search_web("quantum computing")
    write_blackboard('research', {'sources': sources}, agent_name='researcher')

# Agent 2: Analista
def analyst_work():
    research = read_blackboard('research')
    themes = extract_themes(research['data']['sources'])
    write_blackboard('analysis', {'themes': themes}, agent_name='analyst')
```

---
