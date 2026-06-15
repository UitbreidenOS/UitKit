# Multi-Agent-Debug-Workflow

Ermöglicht Sichtbarkeit, Reproduzierbarkeit und Debugging von Multi-Agent-Workflows durch Spurenkorrelation, interaktive Breakpoints und Ausführungswiederholung.

---

## Wann verwenden

- Debugging von nicht-deterministischem Multi-Agent-Verhalten (Agenten treffen unterschiedliche Entscheidungen bei gleicher Eingabe)
- Untersuchung von Deadlocks oder unerwarteten Hängen in der Agent-Koordination
- Verifizierung, dass Agent-Übergaben korrekt funktionieren (Verfolgung von Zustandsmutationen zwischen Agenten)
- Post-Incident-Analyse von fehlgeschlagenen Workflows (vollständige Audit-Trail-Wiederholung)
- Test neuer Agent-Topologien vor Produktionsbereitstellung

Nicht verwenden für einfaches Single-Agent-Debugging (Debugger direkt anhängen) oder Performance-Profiling ohne spezifische Fehler.

---

## Spurenkorrelation

Jedem Agent-Aufruf wird eine eindeutige Trace-ID zugewiesen, die an alle nachfolgenden Aufrufe propagiert wird. Spuren werden in `.claude/agent-traces.jsonl` persistiert:

```json
{
  "trace_id": "tr_abc123xyz",
  "session_id": "sess_def456",
  "workflow": "research_and_synthesize",
  "started_at": "2026-06-15T14:00:00Z",
  "root_input": {
    "topic": "Quantum Computing",
    "max_sources": 10
  },
  "agent_calls": [
    {
      "call_id": "call_1",
      "agent": "researcher",
      "parent_call_id": null,
      "model": "claude-opus-4-20250514",
      "started_at": "2026-06-15T14:00:01Z",
      "completed_at": "2026-06-15T14:15:30Z",
      "duration_ms": 929000,
      "input_tokens": 2400,
      "output_tokens": 1850,
      "input": {
        "task": "Research Quantum Computing",
        "constraints": "max 10 sources"
      },
      "output": {
        "sources": [
          {"title": "...", "url": "...", "credibility": "high"}
        ],
        "summary": "..."
      },
      "tool_calls": [
        {
          "tool": "web_search",
          "args": {"query": "quantum computing 2026"},
          "result": {...}
        }
      ],
      "status": "completed"
    },
    {
      "call_id": "call_2",
      "agent": "analyst",
      "parent_call_id": "call_1",
      "model": "claude-opus-4-20250514",
      "started_at": "2026-06-15T14:15:45Z",
      "completed_at": "2026-06-15T14:22:15Z",
      "duration_ms": 390000,
      "input_tokens": 3100,
      "output_tokens": 1200,
      "input": {
        "sources": "...",
        "analysis_style": "academic"
      },
      "output": {
        "themes": ["Hardware", "Software", "Applications"],
        "analysis": "..."
      },
      "status": "completed"
    }
  ],
  "result": {
    "status": "success",
    "final_output": {...}
  }
}
```

**Spurenstruktur-Regeln:**
- Jeder Agent-Aufruf hat eine eindeutige `call_id`
- Übergeordnete Aufrufs-IDs bilden einen Baum (Root-Aufrufe haben `null` Parent)
- Zeitstempel sind ISO 8601 mit Millisekunden-Genauigkeit
- Tool-Aufrufe umfassen sowohl Argumente als auch Ergebnisse
- Status ist: `running`, `completed`, `failed`, `timeout`, `cancelled`

---

## Haltepunkte

Halten Sie die Ausführung bei spezifischen Bedingungen an, um den Zustand zu inspizieren:

### Checkpoint-basierte Haltepunkte

Definieren Sie Haltepunkte in der Orchestrator-Konfiguration:

```json
{
  "breakpoints": [
    {
      "breakpoint_id": "bp_1",
      "condition": "agent == 'analyst'",
      "action": "pause",
      "inspect_keys": ["sources", "analysis", "confidence"],
      "auto_continue_after_ms": null
    },
    {
      "breakpoint_id": "bp_2",
      "condition": "output.length < 100",
      "action": "pause",
      "reason": "Output too short",
      "auto_continue": false
    },
    {
      "breakpoint_id": "bp_3",
      "condition": "latency_ms > 30000",
      "action": "log_warning",
      "reason": "Agent took longer than 30s"
    }
  ]
}
```

### Interaktive Haltepunkt-Schnittstelle

Wenn ein Haltepunkt ausgelöst wird:

```
BREAKPOINT HIT: bp_2
Condition: output.length < 100
Agent: analyst
Call ID: call_2

Current state:
  output = "Short analysis"
  output.length = 16
  confidence = 0.65

Commands:
  continue        Continue execution
  inspect <key>   Show variable value
  eval <expr>     Evaluate expression
  step_next       Execute next agent call
  abort           Cancel workflow
  retry           Re-run current agent with modified input

> inspect sources
[{"title": "...", "url": "...", ...}, ...]

> eval output.length > 100
false

> continue
```

---

## Wiederholungsmechanismus

Wiederholen Sie eine Workflow-Ausführung von beliebiger Stelle, um Verhalten zu reproduzieren:

```python
def replay_workflow(trace_file: str, replay_from_call_id: str):
    """
    Given a trace file and a call ID, re-execute the workflow
    from that point using the exact same inputs.
    """
    trace = load_trace(trace_file)
    
    # Find the call to replay from
    call_to_replay = trace['agent_calls'][
        next(i for i, c in enumerate(trace['agent_calls'])
             if c['call_id'] == replay_from_call_id)
    ]
    
    # Reconstruct input by walking the call tree backward
    ancestor_outputs = {}
    for ancestor in walk_ancestors(call_to_replay):
        ancestor_outputs[ancestor['call_id']] = ancestor['output']
    
    # Extract input to the failing call
    agent_input = call_to_replay['input']
    
    # Re-run with same model, same input
    new_result = run_agent(
        agent=call_to_replay['agent'],
        input=agent_input,
        model=call_to_replay['model']
    )
    
    # Compare outputs
    diff = compare_outputs(
        original=call_to_replay['output'],
        new=new_result
    )
    
    return {
        'original': call_to_replay['output'],
        'new': new_result,
        'diff': diff,
        'deterministic': len(diff) == 0
    }
```

**Wiederholungs-Anwendungsfälle:**
- Verifizieren, dass Agent-Verhalten deterministisch ist (gleiche Eingabe → gleiche Ausgabe)
- Test von Hypothesenänderungen (Agent-Prompt ändern, gleiche Eingaben erneut ausführen)
- Isolieren von Fehlerstellen (von fehlgeschlagenem Agent erneut ausführen, inspizieren warum)

---

## Spurenviewer und Diff-Tool

Tool zum Anzeigen und Vergleichen von Spuren:

```bash
# View full trace
claude-trace view tr_abc123xyz

# Show only agent calls
claude-trace show --filter agent=researcher tr_abc123xyz

# Compare two traces side-by-side
claude-trace diff tr_abc123xyz tr_def456

# Export trace to CSV (for Excel analysis)
claude-trace export --format csv tr_abc123xyz > trace.csv

# Find all traces for a workflow
claude-trace search --workflow research_and_synthesize
```

Ausgabeformat für `claude-trace view`:

```
Trace ID: tr_abc123xyz
Workflow: research_and_synthesize
Duration: 20m 15s (1215s total)
Result: success

Call Tree:
├─ call_1 researcher (15m 29s, 2400→1850 tokens)
│  ├─ tool: web_search (3 calls, 500ms avg)
│  └─ status: completed ✓
├─ call_2 analyst (6m 30s, 3100→1200 tokens)
│  └─ status: completed ✓
└─ call_3 writer (0m 16s, 1800→890 tokens)
   └─ status: completed ✓

Metrics:
  Total tokens: 24,200 (input: 14,440, output: 9,760)
  Total latency: 20m 15s
  Agent breakdown: researcher 76%, analyst 19%, writer 5%
```

---

## Deadletter-Spurenerfassung

Wenn ein Agent-Aufruf fehlschlägt, speichern Sie die vollständige Spur automatisch:

```json
{
  "dead_letter_id": "dl_xyz789",
  "trace_id": "tr_abc123xyz",
  "failed_call": {
    "call_id": "call_2",
    "agent": "analyst",
    "error": "Output validation failed: confidence < 0.5",
    "error_type": "validation_error"
  },
  "full_trace": {...},
  "timestamp": "2026-06-15T14:20:00Z",
  "path": ".claude/dead-letters/dl_xyz789.json"
}
```

Verwenden Sie diese Spur für:
1. Verstehen, warum der Agent fehlgeschlagen ist
2. Aufruf mit modifiziertem Prompt erneut ausführen
3. Testfall zur Regressionssuite hinzufügen

---

## Beispiel: Debugging eines instabilen Agenten

**Szenario:** Analyst-Agent gibt manchmal hohe Konfidenz, manchmal niedrige Konfidenz bei gleichen Quellen zurück.

**Schritte:**

1. **Erfassen Sie Spuren mehrerer Läufe:**
   ```bash
   for i in {1..5}; do
     claude-trace search --workflow research_and_synthesize | tail -1
   done
   ```

2. **Vergleichen Sie Ausgaben:**
   ```bash
   claude-trace diff tr_run1 tr_run2 | grep confidence
   # run1: confidence = 0.85
   # run2: confidence = 0.62
   ```

3. **Inspizieren Sie Modellverhalten (nicht-deterministisch):**
   Der Analyst verwendet einen nicht-deterministischen Modellparameter. Überprüfen Sie System-Prompt auf `temperature > 0`.

4. **Erneut ausführen zum Isolieren:**
   ```bash
   claude-trace replay tr_run1 --from call_2 --with-changes temperature=0
   ```

5. **Bestätigen Sie Behebung:**
   Mit `temperature=0` ist die Ausgabe deterministisch. Agent-Konfiguration aktualisieren.

---
