---
name: agent-handoff
description: "Implementeer gestructureerde overdrachten tussen agenten met JSON-gebaseerde state transfer, conflictdetectie en acknowledgment protocollen"
updated: 2026-06-15
---

# Agent Handoff Vaardigheid

## Wanneer activeren

- Werk overdragen van ene agent naar andere in multi-agent workflow
- Request/response cycli implementeren tussen agenten in pipeline
- Agent teams bouwen waar ene agent afhangt van ander output
- Debuggen waarom agent incorrecte/onvolledigte input van vorige agent ontvangt
- Garanderen dat state mutaties correct tussen agenten propageren

## Wanneer NIET gebruiken

- Single-agent loops (geen handoff nodig)
- Async event-driven workflows zonder expliciete request/response
- Workflows waar agenten niet directafhankelijk van elkaar zijn

## Instructies

### Handoff Pakket Schema

Handoff is JSON pakket van ene naar volgende agent:

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
    "sources": [...],
    "research_summary": "Found 15 credible sources..."
  },
  "metadata": {
    "tokens_used": {"input": 2400, "output": 1850},
    "model": "claude-opus-4-20250514"
  }
}
```

### Validatie Voor Handoff

Verzendende agent moet payload valideren:

```python
def validate_handoff(handoff_packet, expected_schema):
    """Valideer handoff pakket tegen schema."""
    required = ['handoff_id', 'from_agent', 'to_agent', 'payload', 'timestamp']
    for field in required:
        if field not in handoff_packet:
            raise ValueError(f"Missing required field: {field}")
    
    import jsonschema
    jsonschema.validate(
        instance=handoff_packet['payload'],
        schema=expected_schema
    )
    return True
```

### Handoff Versturen

```python
def send_handoff(handoff_packet, to_agent_inbox='.claude/agent-inboxes/'):
    """Schrijf handoff pakket naar receiver's inbox."""
    import json
    from pathlib import Path
    
    inbox_dir = Path(to_agent_inbox) / handoff_packet['to_agent']
    inbox_dir.mkdir(parents=True, exist_ok=True)
    
    handoff_file = inbox_dir / f"{handoff_packet['handoff_id']}.json"
    with open(handoff_file, 'w') as f:
        json.dump(handoff_packet, f)
    
    return {
        'handoff_id': handoff_packet['handoff_id'],
        'acknowledgment_file': inbox_dir / f"{handoff_packet['handoff_id']}.ack"
    }
```

---
