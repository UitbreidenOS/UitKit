# Flux de travail de débogage multi-agent

Permet la visibilité, la reproductibilité et le débogage des workflows multi-agents par la corrélation de traces, les points d'arrêt interactifs et la relecture d'exécution.

---

## Quand utiliser

- Débogage du comportement non-déterministe multi-agent (les agents prennent des décisions différentes sur la même entrée)
- Investigation des blocages ou suspensions inattendues dans la coordination d'agents
- Vérification que les transferts d'agents fonctionnent correctement (traçage des mutations d'état entre agents)
- Analyse post-incident des workflows échoués (relecture complète de la piste d'audit)
- Test de nouvelles topologies d'agents avant déploiement en production

Ne pas utiliser pour le débogage simple d'un seul agent (attacher un débogueur directement) ou pour le profilage de performance sans défaillances spécifiques.

---

## Corrélation de traces

Chaque appel d'agent se voit assigner un ID de trace unique, propagé à tous les appels suivants. Les traces sont persistées dans `.claude/agent-traces.jsonl` :

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

**Règles de structure de trace :**
- Chaque appel d'agent a un `call_id` unique
- Les IDs d'appel parent forment un arbre (les appels racine ont `null` parent)
- Les horodatages sont ISO 8601 avec précision à la milliseconde
- Les appels d'outils incluent arguments et résultats
- Le statut est : `running`, `completed`, `failed`, `timeout`, `cancelled`

---

## Points d'arrêt

Mettez en pause l'exécution à des conditions spécifiques pour inspecter l'état :

### Points d'arrêt basés sur les points de contrôle

Définissez les points d'arrêt dans la configuration de l'orchestrateur :

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

### Interface de point d'arrêt interactif

Quand un point d'arrêt se déclenche :

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

## Mécanisme de relecture

Relisez une exécution de workflow à partir de n'importe quel point pour reproduire le comportement :

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

**Cas d'utilisation de relecture :**
- Vérifier que le comportement de l'agent est déterministe (même entrée → même sortie)
- Tester les changements d'hypothèse (modifier le prompt d'agent, relire les mêmes entrées)
- Isoler les points de défaillance (relire à partir de l'agent défaillant, inspecter pourquoi il a échoué)

---

## Visionneuse de trace et outil de diff

Outil pour visualiser et comparer les traces :

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

Format de sortie pour `claude-trace view` :

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

## Capture de trace de lettre morte

Quand un appel d'agent échoue, enregistrez la trace complète automatiquement :

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

Utilisez cette trace pour :
1. Comprendre pourquoi l'agent a échoué
2. Relire l'appel avec prompt modifié
3. Ajouter un cas de test à la suite de régression

---

## Exemple : Débogage d'un agent instable

**Scénario :** L'agent analyste renvoie parfois une confiance élevée, parfois basse, sur les mêmes sources.

**Étapes :**

1. **Capturez des traces de plusieurs exécutions :**
   ```bash
   for i in {1..5}; do
     claude-trace search --workflow research_and_synthesize | tail -1
   done
   ```

2. **Comparez les sorties :**
   ```bash
   claude-trace diff tr_run1 tr_run2 | grep confidence
   # run1: confidence = 0.85
   # run2: confidence = 0.62
   ```

3. **Inspectez le comportement du modèle (non-déterministe) :**
   L'analyste utilise un paramètre de modèle non-déterministe. Vérifiez le prompt système pour `temperature > 0`.

4. **Relire pour isoler :**
   ```bash
   claude-trace replay tr_run1 --from call_2 --with-changes temperature=0
   ```

5. **Confirmez la correction :**
   Avec `temperature=0`, la sortie est déterministe. Mettez à jour la configuration de l'agent.

---
