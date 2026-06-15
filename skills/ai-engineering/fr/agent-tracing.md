---
name: agent-tracing
description: "Construire l'observabilité dans les systèmes multi-agents avec traces distribuées, corrélation de traces, points d'arrêt et relecture d'exécution"
updated: 2026-06-15
---

# Compétence Agent Tracing

## Quand l'activer

- Déboguer le comportement non-déterministe des agents (la même entrée produit des sorties différentes)
- Analyser la performance des agents et identifier les goulots d'étranglement (quel agent est lent?)
- Analyse post-incident des workflows défaillants (qu'est-il passé?)
- Tester les nouvelles architectures d'agents ou les prompts avant le déploiement en production
- Construire des tableaux de bord et la surveillance des systèmes multi-agents

## Quand NE PAS l'utiliser

- Débogage simple mono-agent (attacher directement un débogueur)
- Systèmes de production sans aucune instrumentation (commencer par un traçage basique d'abord)
- Systèmes à haut débit où l'overhead de traçage est inacceptable (utiliser l'échantillonnage)

## Instructions

### Structure de trace

Chaque appel d'agent génère une trace :

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
      "tokens": {
        "input": 2400,
        "output": 1850,
        "total": 4250
      },
      "input": {
        "task": "Research Quantum Computing",
        "constraints": {"max_sources": 10}
      },
      "output": {
        "sources": [...],
        "summary": "..."
      },
      "tool_calls": [
        {
          "tool": "web_search",
          "args": {"query": "quantum computing 2026"},
          "result": {...},
          "duration_ms": 450
        }
      ],
      "status": "completed",
      "cost_cents": 78
    }
  ],
  
  "metadata": {
    "request_id": "req_xyz789",
    "user_id": "user_123",
    "environment": "production"
  }
}
```

Sauvegarder dans `.claude/agent-traces.jsonl` (JSONL en ajout seul).

### Instrumentation des appels d'agents

```python
def trace_agent_call(agent_name, input_data, parent_call_id=None):
    """
    Décorateur pour les appels d'agents qui génère automatiquement des traces.
    """
    from datetime import datetime
    import uuid
    import json
    
    call_id = f"call_{uuid.uuid4().hex[:8]}"
    started_at = datetime.utcnow().isoformat() + 'Z'
    
    def decorator(agent_func):
        def wrapper(*args, **kwargs):
            # Appeler l'agent
            result = agent_func(*args, **kwargs)
            
            # Enregistrer la trace
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
            
            # Ajouter au fichier de trace
            with open('.claude/agent-traces.jsonl', 'a') as f:
                f.write(json.dumps(trace) + '\n')
            
            return result
        
        return wrapper
    
    return decorator

# Utilisation :
@trace_agent_call('researcher', {'topic': 'Quantum Computing'})
def run_researcher():
    # Implémentation de l'agent
    return {...}
```

### Interrogation de traces

```python
def find_traces(workflow=None, agent=None, status=None, date_range=None):
    """
    Interroger les traces par divers critères.
    """
    import json
    from pathlib import Path
    
    matching_traces = []
    
    with open('.claude/agent-traces.jsonl', 'r') as f:
        for line in f:
            trace = json.loads(line)
            
            # Filtrer par workflow
            if workflow and trace.get('workflow') != workflow:
                continue
            
            # Filtrer par agent
            if agent:
                if not any(c['agent'] == agent for c in trace.get('agent_calls', [])):
                    continue
            
            # Filtrer par statut
            if status and trace.get('status') != status:
                continue
            
            matching_traces.append(trace)
    
    return matching_traces

def analyze_trace(trace_id):
    """
    Analyser une seule trace pour trouver les goulots d'étranglement.
    """
    import json
    
    with open('.claude/agent-traces.jsonl', 'r') as f:
        for line in f:
            trace = json.loads(line)
            if trace.get('trace_id') == trace_id:
                # Analyser
                analysis = {
                    'total_duration_ms': trace.get('completed_at') - trace.get('started_at'),
                    'agent_breakdown': {}
                }
                
                for call in trace.get('agent_calls', []):
                    agent = call['agent']
                    duration = call.get('duration_ms', 0)
                    
                    if agent not in analysis['agent_breakdown']:
                        analysis['agent_breakdown'][agent] = {
                            'calls': 0,
                            'total_ms': 0,
                            'total_tokens': 0
                        }
                    
                    analysis['agent_breakdown'][agent]['calls'] += 1
                    analysis['agent_breakdown'][agent]['total_ms'] += duration
                    analysis['agent_breakdown'][agent]['total_tokens'] += call.get('tokens', {}).get('total', 0)
                
                return analysis
    
    raise ValueError(f"Trace {trace_id} not found")
```

### Points d'arrêt interactifs

```python
def set_breakpoint(condition_fn, action='pause', inspect_keys=None):
    """
    Définir un point d'arrêt qui se déclenche quand la condition est vraie.
    
    condition_fn: fonction(agent_call) -> bool
    action: 'pause', 'log_warning', 'abort'
    inspect_keys: liste des clés à afficher quand le point d'arrêt se déclenche
    """
    return {
        'condition': condition_fn,
        'action': action,
        'inspect_keys': inspect_keys or []
    }

def check_breakpoints(agent_call, breakpoints):
    """
    Vérifier si un point d'arrêt doit se déclencher pour cet appel d'agent.
    """
    for bp in breakpoints:
        if bp['condition'](agent_call):
            if bp['action'] == 'pause':
                print(f"BREAKPOINT HIT for {agent_call['agent']}")
                print(f"Call ID: {agent_call['call_id']}")
                
                # Inspecter
                for key in bp.get('inspect_keys', []):
                    value = agent_call.get(key)
                    print(f"  {key} = {value}")
                
                # Menu interactif
                while True:
                    cmd = input("> ").strip()
                    if cmd == 'continue':
                        break
                    elif cmd.startswith('inspect '):
                        key = cmd.split(' ', 1)[1]
                        print(f"  {key} = {agent_call.get(key)}")
                    elif cmd == 'abort':
                        raise KeyboardInterrupt("Workflow aborted by user")
            
            elif bp['action'] == 'log_warning':
                print(f"WARNING: Breakpoint fired for {agent_call['agent']}")
            
            elif bp['action'] == 'abort':
                raise RuntimeError(f"Breakpoint aborted workflow for {agent_call['agent']}")

# Utilisation :
breakpoints = [
    set_breakpoint(
        lambda c: c['agent'] == 'analyst' and c['duration_ms'] > 300000,
        action='pause',
        inspect_keys=['duration_ms', 'tokens', 'output']
    )
]
```

### Relecture d'exécution

```python
def replay_from_call(trace_id, call_id, modifications=None):
    """
    Re-exécuter une trace à partir d'un ID d'appel spécifique avec les modifications optionnelles.
    """
    import json
    
    # Trouver la trace
    trace = None
    with open('.claude/agent-traces.jsonl', 'r') as f:
        for line in f:
            t = json.loads(line)
            if t.get('trace_id') == trace_id:
                trace = t
                break
    
    if not trace:
        raise ValueError(f"Trace {trace_id} not found")
    
    # Trouver l'appel à relire à partir de
    calls = {c['call_id']: c for c in trace.get('agent_calls', [])}
    if call_id not in calls:
        raise ValueError(f"Call {call_id} not found in trace")
    
    replay_call = calls[call_id]
    
    # Appliquer les modifications (par ex., changer la température)
    input_data = replay_call['input']
    if modifications:
        input_data = {**input_data, **modifications}
    
    # Re-exécuter l'agent
    agent_func = get_agent_function(replay_call['agent'])
    new_result = agent_func(input_data, model=replay_call['model'])
    
    # Comparer
    original_output = replay_call['output']
    diff = compare_outputs(original_output, new_result)
    
    return {
        'original': original_output,
        'new': new_result,
        'diff': diff,
        'deterministic': len(diff) == 0
    }
```

### Exemple : Débogage d'un agent instable

```python
# Trouver toutes les traces du workflow
traces = find_traces(workflow='research_and_synthesize')
print(f"Found {len(traces)} traces")

# Analyser les traces où l'analyste avait une faible confiance
low_confidence_traces = [
    t for t in traces
    if any(
        c['agent'] == 'analyst' and c['output'].get('confidence', 1.0) < 0.7
        for c in t.get('agent_calls', [])
    )
]
print(f"{len(low_confidence_traces)} traces had low analyst confidence")

# Relire la première trace à faible confiance
trace_id = low_confidence_traces[0]['trace_id']
call_id = [c['call_id'] for c in low_confidence_traces[0]['agent_calls'] if c['agent'] == 'analyst'][0]

result = replay_from_call(trace_id, call_id, modifications={'temperature': 0})
print(f"With temperature=0, analyst is deterministic: {result['deterministic']}")

# Cause racine : température non nulle dans le prompt de l'analyste
# Correctif : Définir temperature=0 pour l'agent analyste
```

---
