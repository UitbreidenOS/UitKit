---
name: agent-tracing
description: "Erstellen Sie Observability in Multi-Agent-Systemen mit verteilten Traces, Trace-Korrelation, Breakpoints und Execution-Replay"
updated: 2026-06-15
---

# Agent Tracing Fähigkeit

## Wann aktivieren

- Debuggen nichtdeterministischen Agent-Verhaltens (die gleiche Eingabe erzeugt verschiedene Ausgaben)
- Analysieren von Agent-Performance und Identifikation von Engpässen (welcher Agent ist langsam?)
- Post-Incident-Analyse fehlgeschlagener Workflows (was ging falsch?)
- Testen neuer Agent-Architekturen oder Prompts vor der Produktion-Bereitstellung
- Erstellen von Dashboards und Überwachung für Multi-Agent-Systeme

## Wann NICHT verwenden

- Einfaches Single-Agent-Debugging (Debugger direkt anhängen)
- Produktionssysteme ohne Instrumentation (zuerst mit grundlegendem Tracing beginnen)
- Hochvolumige Systeme, bei denen Tracing-Overhead nicht akzeptabel ist (Sampling verwenden)

## Anleitung

### Trace-Struktur

Jeder Agent-Aufruf generiert eine Trace:

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

Speichern Sie in `.claude/agent-traces.jsonl` (nur anhängen JSONL).

### Instrumentierung von Agent-Aufrufen

```python
def trace_agent_call(agent_name, input_data, parent_call_id=None):
    """
    Decorator für Agent-Aufrufe, die Traces automatisch generieren.
    """
    from datetime import datetime
    import uuid
    import json
    
    call_id = f"call_{uuid.uuid4().hex[:8]}"
    started_at = datetime.utcnow().isoformat() + 'Z'
    
    def decorator(agent_func):
        def wrapper(*args, **kwargs):
            # Agent aufrufen
            result = agent_func(*args, **kwargs)
            
            # Trace aufzeichnen
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
            
            # In Trace-Datei anhängen
            with open('.claude/agent-traces.jsonl', 'a') as f:
                f.write(json.dumps(trace) + '\n')
            
            return result
        
        return wrapper
    
    return decorator

# Verwendung:
@trace_agent_call('researcher', {'topic': 'Quantum Computing'})
def run_researcher():
    # Agent-Implementierung
    return {...}
```

### Trace-Abfrage

```python
def find_traces(workflow=None, agent=None, status=None, date_range=None):
    """
    Traces nach verschiedenen Kriterien abfragen.
    """
    import json
    from pathlib import Path
    
    matching_traces = []
    
    with open('.claude/agent-traces.jsonl', 'r') as f:
        for line in f:
            trace = json.loads(line)
            
            # Nach Workflow filtern
            if workflow and trace.get('workflow') != workflow:
                continue
            
            # Nach Agent filtern
            if agent:
                if not any(c['agent'] == agent for c in trace.get('agent_calls', [])):
                    continue
            
            # Nach Status filtern
            if status and trace.get('status') != status:
                continue
            
            matching_traces.append(trace)
    
    return matching_traces

def analyze_trace(trace_id):
    """
    Analysieren Sie eine einzelne Trace, um Engpässe zu finden.
    """
    import json
    
    with open('.claude/agent-traces.jsonl', 'r') as f:
        for line in f:
            trace = json.loads(line)
            if trace.get('trace_id') == trace_id:
                # Analysieren
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

### Interaktive Breakpoints

```python
def set_breakpoint(condition_fn, action='pause', inspect_keys=None):
    """
    Setzen Sie einen Breakpoint, der sich bei Erfüllung der Bedingung auslöst.
    
    condition_fn: Funktion(agent_call) -> bool
    action: 'pause', 'log_warning', 'abort'
    inspect_keys: Liste der Schlüssel, die angezeigt werden, wenn der Breakpoint auslöst
    """
    return {
        'condition': condition_fn,
        'action': action,
        'inspect_keys': inspect_keys or []
    }

def check_breakpoints(agent_call, breakpoints):
    """
    Überprüfen Sie, ob Breakpoints für diesen Agent-Aufruf auslösen sollten.
    """
    for bp in breakpoints:
        if bp['condition'](agent_call):
            if bp['action'] == 'pause':
                print(f"BREAKPOINT HIT for {agent_call['agent']}")
                print(f"Call ID: {agent_call['call_id']}")
                
                # Inspizieren
                for key in bp.get('inspect_keys', []):
                    value = agent_call.get(key)
                    print(f"  {key} = {value}")
                
                # Interaktives Menü
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

# Verwendung:
breakpoints = [
    set_breakpoint(
        lambda c: c['agent'] == 'analyst' and c['duration_ms'] > 300000,
        action='pause',
        inspect_keys=['duration_ms', 'tokens', 'output']
    )
]
```

### Ausführungs-Replay

```python
def replay_from_call(trace_id, call_id, modifications=None):
    """
    Führen Sie eine Trace ab einem spezifischen Call-ID mit optionalen Änderungen erneut aus.
    """
    import json
    
    # Trace finden
    trace = None
    with open('.claude/agent-traces.jsonl', 'r') as f:
        for line in f:
            t = json.loads(line)
            if t.get('trace_id') == trace_id:
                trace = t
                break
    
    if not trace:
        raise ValueError(f"Trace {trace_id} not found")
    
    # Aufruf zum Replay finden
    calls = {c['call_id']: c for c in trace.get('agent_calls', [])}
    if call_id not in calls:
        raise ValueError(f"Call {call_id} not found in trace")
    
    replay_call = calls[call_id]
    
    # Änderungen anwenden (z.B. Temperatur ändern)
    input_data = replay_call['input']
    if modifications:
        input_data = {**input_data, **modifications}
    
    # Agent erneut ausführen
    agent_func = get_agent_function(replay_call['agent'])
    new_result = agent_func(input_data, model=replay_call['model'])
    
    # Vergleichen
    original_output = replay_call['output']
    diff = compare_outputs(original_output, new_result)
    
    return {
        'original': original_output,
        'new': new_result,
        'diff': diff,
        'deterministic': len(diff) == 0
    }
```

### Beispiel: Debugging eines fehleranfälligen Agenten

```python
# Finde alle Traces für den Workflow
traces = find_traces(workflow='research_and_synthesize')
print(f"Found {len(traces)} traces")

# Analysiere Traces, in denen der Analyst geringes Vertrauen hatte
low_confidence_traces = [
    t for t in traces
    if any(
        c['agent'] == 'analyst' and c['output'].get('confidence', 1.0) < 0.7
        for c in t.get('agent_calls', [])
    )
]
print(f"{len(low_confidence_traces)} traces had low analyst confidence")

# Replay der ersten Trace mit geringem Vertrauen
trace_id = low_confidence_traces[0]['trace_id']
call_id = [c['call_id'] for c in low_confidence_traces[0]['agent_calls'] if c['agent'] == 'analyst'][0]

result = replay_from_call(trace_id, call_id, modifications={'temperature': 0})
print(f"With temperature=0, analyst is deterministic: {result['deterministic']}")

# Grundursache: Nicht-Null-Temperatur im Analyst-Prompt
# Fix: temperature=0 für Agent-Analyst setzen
```

---
