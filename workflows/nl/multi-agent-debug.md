# Multi-agent debug workflow

Maakt zichtbaarheid, reproduceerbaarheid en debugging van multi-agent workflows mogelijk door trace correlatie, interactieve breakpoints en execution replay.

---

## Wanneer gebruiken

- Debugging van niet-deterministisch multi-agent gedrag (agenten nemen andere beslissingen op dezelfde invoer)
- Onderzoek van deadlocks of onverwachte hangs in agent coördinatie
- Verificatie dat agent handoffs correct werken (tracing van state mutaties tussen agenten)
- Post-incident analyse van mislukte workflows (volledige audit trail replay)
- Testen van nieuwe agent topologieën voor productie deployment

Niet gebruiken voor simpel single-agent debugging (debugger direct hechten) of performance profiling zonder specifieke fouten.

---

## Trace correlatie

Elke agent call krijgt een unieke trace ID toegewezen, geproageerd naar alle volgende calls. Traces worden gepersisteerd in `.claude/agent-traces.jsonl`:

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

**Trace structuur regels:**
- Elke agent call heeft unieke `call_id`
- Parent call IDs vormen boom (root calls hebben `null` parent)
- Timestamps zijn ISO 8601 met milliseconde precisie
- Tool calls bevatten zowel argumenten als resultaten
- Status is: `running`, `completed`, `failed`, `timeout`, `cancelled`

---

## Breakpoints

Pauzeer executie bij specifieke condities om staat te inspecteren:

### Checkpoint-gebaseerde breakpoints

Definieer breakpoints in orchestrator configuratie:

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

### Interactieve breakpoint interface

Wanneer een breakpoint wordt geraakt:

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

## Replay mechanisme

Replay workflow executie van enig punt om gedrag te reproduceren:

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

**Replay use cases:**
- Verifeer agent gedrag is deterministisch (dezelfde invoer → dezelfde uitvoer)
- Test hypothese wijzigingen (agent prompt wijzigen, dezelfde inputs opnieuw uitvoeren)
- Isoleer faalstellen (replay van mislukte agent, inspecteren waarom het mislukte)

---

## Trace viewer en diff tool

Tool voor weergeven en vergelijken van traces:

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

Uitvoerformat voor `claude-trace view`:

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

## Dead-letter trace capture

Wanneer agent call mislukt, sla volledige trace automatisch op:

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

Gebruik deze trace voor:
1. Begrijp waarom agent mislukte
2. Replay call met aangepaste prompt
3. Voeg test case toe aan regression suite

---

## Voorbeeld: Debugging instabiele agent

**Scenario:** Analyst agent geeft soms hoog vertrouwen, soms laag, op dezelfde bronnen.

**Stappen:**

1. **Capture traces van meerdere runs:**
   ```bash
   for i in {1..5}; do
     claude-trace search --workflow research_and_synthesize | tail -1
   done
   ```

2. **Vergelijk outputs:**
   ```bash
   claude-trace diff tr_run1 tr_run2 | grep confidence
   # run1: confidence = 0.85
   # run2: confidence = 0.62
   ```

3. **Inspeceer model gedrag (niet-deterministisch):**
   De analyst gebruikt niet-deterministische model parameter. Controleer system prompt voor `temperature > 0`.

4. **Replay om te isoleren:**
   ```bash
   claude-trace replay tr_run1 --from call_2 --with-changes temperature=0
   ```

5. **Bevestig fix:**
   Met `temperature=0` is output deterministisch. Update agent configuratie.

---
