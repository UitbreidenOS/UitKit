---
name: agent-handoff
description: "Implémenter des transferts structurés entre agents avec transfert d'état basé sur JSON, détection de conflits et protocoles d'accusé de réception"
updated: 2026-06-15
---

# Compétence Agent Handoff

## Quand l'activer

- Transférer le travail d'un agent à un autre dans un workflow multi-agents
- Implémenter des cycles demande/réponse entre agents dans un pipeline
- Construire des équipes d'agents où un agent dépend de la sortie d'un autre
- Déboguer pourquoi un agent reçoit une entrée incorrecte ou incomplète d'un agent antérieur
- S'assurer que les mutations d'état sont correctement propagées entre les agents

## Quand NE PAS l'utiliser

- Boucles mono-agents (pas de handoff nécessaire)
- Workflows asynchrones pilotés par les événements sans cycles explicites demande/réponse
- Workflows où les agents ne dépendent pas directement des sorties les uns des autres

## Instructions

### Schéma du paquet de handoff

Un handoff est un paquet JSON transmis d'un agent à l'autre :

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

### Validation avant handoff

L'agent d'envoi doit valider la charge utile avant le handoff :

```python
def validate_handoff(handoff_packet, expected_schema):
    """
    Valider que le paquet de handoff correspond au schéma attendu.
    Lève ValueError si la validation échoue.
    """
    # Vérifier les champs obligatoires
    required = ['handoff_id', 'from_agent', 'to_agent', 'payload', 'timestamp']
    for field in required:
        if field not in handoff_packet:
            raise ValueError(f"Missing required field: {field}")
    
    # Valider la charge utile par rapport au schéma
    import jsonschema
    jsonschema.validate(
        instance=handoff_packet['payload'],
        schema=expected_schema
    )
    
    # Valider que l'horodatage est récent
    from datetime import datetime, timedelta
    ts = datetime.fromisoformat(handoff_packet['timestamp'].replace('Z', '+00:00'))
    if datetime.now(ts.tzinfo) - ts > timedelta(seconds=300):
        raise ValueError("Handoff timestamp is stale (> 5 minutes old)")
    
    return True
```

Ne pas procéder au handoff si la validation échoue. Enregistrer l'erreur et escalader.

### Envoi d'un handoff

```python
def send_handoff(handoff_packet, to_agent_inbox='.claude/agent-inboxes/'):
    """
    Écrire le paquet de handoff dans la boîte de réception de l'agent destinataire.
    Retourner le handle d'attente d'accusé de réception.
    """
    import json
    from pathlib import Path
    
    # Écrire dans la boîte de réception de l'agent
    inbox_dir = Path(to_agent_inbox) / handoff_packet['to_agent']
    inbox_dir.mkdir(parents=True, exist_ok=True)
    
    handoff_file = inbox_dir / f"{handoff_packet['handoff_id']}.json"
    with open(handoff_file, 'w') as f:
        json.dump(handoff_packet, f)
    
    # Retourner le handle d'attente (attendre l'accusé de réception)
    return {
        'handoff_id': handoff_packet['handoff_id'],
        'acknowledgment_file': inbox_dir / f"{handoff_packet['handoff_id']}.ack"
    }

def wait_for_acknowledgment(wait_handle, timeout_seconds=30):
    """
    Vérifier les accusés de réception de l'agent destinataire.
    Timeout si aucun accusé de réception reçu.
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

### Réception d'un handoff

```python
def receive_handoff(from_agent, inbox_dir='.claude/agent-inboxes/'):
    """
    Vérifier les handoffs entrants d'un agent spécifique.
    Retourner le premier handoff disponible.
    """
    from pathlib import Path
    import json
    
    inbox = Path(inbox_dir) / from_agent
    
    # Trouver le premier handoff non accusé
    for handoff_file in sorted(inbox.glob('*.json')):
        ack_file = handoff_file.with_suffix('.ack')
        if not ack_file.exists():
            with open(handoff_file, 'r') as f:
                handoff = json.load(f)
            return handoff
    
    return None

def acknowledge_handoff(handoff_packet):
    """
    Envoyer un accusé de réception à l'agent d'envoi.
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

### Détection de conflits

Quand un handoff arrive, vérifier les conflits avec l'état précédemment reçu :

```python
def detect_handoff_conflict(new_handoff, previous_state):
    """
    Détecter si le nouveau handoff entre en conflit avec l'état précédent.
    Retourne les détails du conflit ou None s'il n'y a pas de conflit.
    """
    if not previous_state:
        return None
    
    # Vérifier si from_agent est le même (handoff linéaire)
    if new_handoff['from_agent'] != previous_state.get('last_handoff_from'):
        return {
            'type': 'source_mismatch',
            'last_agent': previous_state.get('last_handoff_from'),
            'new_agent': new_handoff['from_agent']
        }
    
    # Vérifier une inadéquation de version (les données ont-elles été modifiées depuis que je les ai reçues?)
    if new_handoff.get('version', 1) < previous_state.get('last_handoff_version', 1):
        return {
            'type': 'version_downgrade',
            'previous_version': previous_state.get('last_handoff_version'),
            'new_version': new_handoff.get('version', 1)
        }
    
    return None
```

Si un conflit est détecté, escalader vers le superviseur avant de procéder.

### Exemple : Handoff Recherche → Analyse

```python
# Agent chercheur (expéditeur)
def researcher_finalize():
    handoff = {
        'handoff_id': 'hof_r2a_001',
        'from_agent': 'researcher',
        'to_agent': 'analyst',
        'timestamp': '2026-06-15T14:15:30Z',
        'phase_name': 'research',
        'phase_status': 'completed',
        'payload': {
            'sources': [...],  # 15 sources
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

# Agent analyste (destinataire)
def analyst_receive():
    handoff = receive_handoff('researcher')
    if handoff:
        print(f"Received handoff {handoff['handoff_id']} from {handoff['from_agent']}")
        print(f"Sources: {len(handoff['payload']['sources'])}")
        acknowledge_handoff(handoff)
        
        # Maintenant, procéder à l'analyse
        analyze(handoff['payload'])
```

---
