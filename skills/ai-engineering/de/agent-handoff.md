---
name: agent-handoff
description: "Implementieren Sie strukturierte Übergaben zwischen Agenten mit JSON-basierter Statusübertragung, Konflikterkennung und Bestätigungsprotokollen"
updated: 2026-06-15
---

# Agent Handoff Fähigkeit

## Wann aktivieren

- Übergabe von Arbeiten von einem Agenten zu einem anderen in einem Multi-Agent-Workflow
- Implementieren von Request/Response-Zyklen zwischen Agenten in einer Pipeline
- Erstellen von Agent-Teams, bei denen ein Agent von der Ausgabe eines anderen abhängt
- Debuggen, warum ein Agent falsche oder unvollständige Eingaben von einem vorherigen Agenten erhält
- Sicherstellen, dass Statusmutationen ordnungsgemäß zwischen Agenten propagiert werden

## Wann NICHT verwenden

- Single-Agent-Schleifen (kein Handoff erforderlich)
- Asynchrone ereignisgesteuerte Workflows ohne explizite Request/Response-Zyklen
- Workflows, bei denen Agenten nicht direkt voneinander abhängig sind

## Anleitung

### Handoff-Paketschema

Ein Handoff ist ein JSON-Paket, das von einem Agenten zum nächsten übertragen wird:

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

### Validierung vor Handoff

Der sendende Agent muss die Nutzlast vor dem Handoff validieren:

```python
def validate_handoff(handoff_packet, expected_schema):
    """
    Validieren Sie, dass das Handoff-Paket dem erwarteten Schema entspricht.
    Wirft ValueError, wenn die Validierung fehlschlägt.
    """
    # Erforderliche Felder überprüfen
    required = ['handoff_id', 'from_agent', 'to_agent', 'payload', 'timestamp']
    for field in required:
        if field not in handoff_packet:
            raise ValueError(f"Missing required field: {field}")
    
    # Nutzlast gegen Schema validieren
    import jsonschema
    jsonschema.validate(
        instance=handoff_packet['payload'],
        schema=expected_schema
    )
    
    # Überprüfen, ob der Zeitstempel kürzlich ist
    from datetime import datetime, timedelta
    ts = datetime.fromisoformat(handoff_packet['timestamp'].replace('Z', '+00:00'))
    if datetime.now(ts.tzinfo) - ts > timedelta(seconds=300):
        raise ValueError("Handoff timestamp is stale (> 5 minutes old)")
    
    return True
```

Führen Sie den Handoff nicht durch, wenn die Validierung fehlschlägt. Fehler protokollieren und eskalieren.

### Senden eines Handoffs

```python
def send_handoff(handoff_packet, to_agent_inbox='.claude/agent-inboxes/'):
    """
    Schreiben Sie das Handoff-Paket in den Posteingang des empfangenden Agenten.
    Rückgabe des Bestätigungswarte-Handles.
    """
    import json
    from pathlib import Path
    
    # In den Agent-Posteingang schreiben
    inbox_dir = Path(to_agent_inbox) / handoff_packet['to_agent']
    inbox_dir.mkdir(parents=True, exist_ok=True)
    
    handoff_file = inbox_dir / f"{handoff_packet['handoff_id']}.json"
    with open(handoff_file, 'w') as f:
        json.dump(handoff_packet, f)
    
    # Warte-Handle zurückgeben (auf Bestätigung warten)
    return {
        'handoff_id': handoff_packet['handoff_id'],
        'acknowledgment_file': inbox_dir / f"{handoff_packet['handoff_id']}.ack"
    }

def wait_for_acknowledgment(wait_handle, timeout_seconds=30):
    """
    Überprüfen Sie die Bestätigung vom empfangenden Agenten.
    Timeout, wenn keine Bestätigung erhalten.
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

### Empfangen eines Handoffs

```python
def receive_handoff(from_agent, inbox_dir='.claude/agent-inboxes/'):
    """
    Überprüfen Sie eingehende Handoffs von einem bestimmten Agenten.
    Rückgabe des ersten verfügbaren Handoffs.
    """
    from pathlib import Path
    import json
    
    inbox = Path(inbox_dir) / from_agent
    
    # Ersten unbestätigten Handoff finden
    for handoff_file in sorted(inbox.glob('*.json')):
        ack_file = handoff_file.with_suffix('.ack')
        if not ack_file.exists():
            with open(handoff_file, 'r') as f:
                handoff = json.load(f)
            return handoff
    
    return None

def acknowledge_handoff(handoff_packet):
    """
    Senden Sie eine Bestätigung an den sendenden Agenten.
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

### Konflikterkennung

Überprüfen Sie bei Ankunft eines Handoffs auf Konflikte mit dem zuvor empfangenen Zustand:

```python
def detect_handoff_conflict(new_handoff, previous_state):
    """
    Erkennen Sie, ob das neue Handoff mit dem vorherigen Zustand in Konflikt steht.
    Rückgabe von Konfliktdetails oder None, wenn kein Konflikt.
    """
    if not previous_state:
        return None
    
    # Überprüfen Sie, ob from_agent gleich ist (linearer Handoff)
    if new_handoff['from_agent'] != previous_state.get('last_handoff_from'):
        return {
            'type': 'source_mismatch',
            'last_agent': previous_state.get('last_handoff_from'),
            'new_agent': new_handoff['from_agent']
        }
    
    # Überprüfen Sie auf Versionskonflikt (wurden Daten seit dem Empfang geändert?)
    if new_handoff.get('version', 1) < previous_state.get('last_handoff_version', 1):
        return {
            'type': 'version_downgrade',
            'previous_version': previous_state.get('last_handoff_version'),
            'new_version': new_handoff.get('version', 1)
        }
    
    return None
```

Wenn ein Konflikt erkannt wird, eskalieren Sie vor dem Fortfahren zum Supervisor.

### Beispiel: Recherche → Analyse Handoff

```python
# Recherche-Agent (Sender)
def researcher_finalize():
    handoff = {
        'handoff_id': 'hof_r2a_001',
        'from_agent': 'researcher',
        'to_agent': 'analyst',
        'timestamp': '2026-06-15T14:15:30Z',
        'phase_name': 'research',
        'phase_status': 'completed',
        'payload': {
            'sources': [...],  # 15 Quellen
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

# Analyse-Agent (Empfänger)
def analyst_receive():
    handoff = receive_handoff('researcher')
    if handoff:
        print(f"Received handoff {handoff['handoff_id']} from {handoff['from_agent']}")
        print(f"Sources: {len(handoff['payload']['sources'])}")
        acknowledge_handoff(handoff)
        
        # Jetzt mit Analyse fortfahren
        analyze(handoff['payload'])
```

---
