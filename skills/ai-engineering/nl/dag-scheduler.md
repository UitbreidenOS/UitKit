---
name: dag-scheduler
description: "Bouw, valideer en voer gerichtde acyclische grafiek (DAG) topologieën uit voor multi-agent workflows met automatische parallellisering en cyclus detectie"
updated: 2026-06-15
---

# DAG Scheduler Vaardigheid

## Wanneer activeren

- Multi-agent workflow ontwerpen/implementeren met complexe afhankelijkheden (niet puur sequentieel)
- Sequentiële workflow converteren naar DAG voor parallellisering
- Agent coördinatieproblemet debuggen (deadlocks, circulaire afhankelijkheden)
- Veerkrachtige workflows bouwen die zich herstellen van gedeeltelijke fouten
- Multi-agent latentie optimaliseren door paralleliseerbare subtaken te identificeren

## Wanneer NIET gebruiken

- Puur sequentiële workflows (gebruik sagapatroon)
- Single-agent taken of gereedschapslussen
- Workflows met circulaire afhankelijkheden (DAG's moeten acyclisch zijn)
- Real-time streaming workflows (gebruik event-driven architectuur)

## Instructies

### DAG Definitie

Definieer taken als vlakke lijst met expliciete afhankelijkheden:

```json
{
  "dag_id": "my_workflow",
  "tasks": [
    {
      "task_id": "task_1",
      "agent": "agent_name",
      "action": "action_name",
      "dependencies": [],
      "timeout_ms": 30000,
      "retries": 2
    },
    {
      "task_id": "task_2",
      "agent": "agent_name",
      "action": "action_name",
      "dependencies": ["task_1"],
      "timeout_ms": 30000,
      "retries": 2
    }
  ]
}
```

Regels:
- Elke taak heeft expliciete `task_id`
- Afhankelijkheden lijst bevat alleen `task_id` waarden (geen agent namen)
- Worteltaken hebben `dependencies: []`
- Alle task_id's in afhankelijkheden moeten bestaan

### Cyclus Detectie

Voer altijd cyclus detectie uit voordat u een DAG uitvoert:

```python
def has_cycle(dag_tasks):
    """Retourneert True als DAG een cyclus heeft, anders False."""
    visited = set()
    rec_stack = set()
    task_map = {t['task_id']: t for t in dag_tasks}
    
    def dfs(node):
        visited.add(node)
        rec_stack.add(node)
        for dep in task_map[node]['dependencies']:
            if dep not in visited:
                if dfs(dep):
                    return True
            elif dep in rec_stack:
                return True
        rec_stack.remove(node)
        return False
    
    for task in dag_tasks:
        if task['task_id'] not in visited:
            if dfs(task['task_id']):
                return True
    return False
```

Als `has_cycle()` True retourneert, voer niet uit. Log cycluspad en escaleer naar operator.

### Topologische Sortering en Parallellisering

Converteer DAG naar execution lanes (sets van taken die parallel kunnen draaien):

```python
def get_execution_lanes(dag_tasks):
    """
    Retourneert lijst van taaklijsten.
    Elke binnenlijst bevat taken zonder inter-task afhankelijkheden.
    """
    from collections import defaultdict, deque
    
    in_degree = {t['task_id']: 0 for t in dag_tasks}
    graph = defaultdict(list)
    task_map = {t['task_id']: t for t in dag_tasks}
    
    # Bouw grafiek en bereken in-graden
    for task in dag_tasks:
        for dep in task['dependencies']:
            graph[dep].append(task['task_id'])
            in_degree[task['task_id']] += 1
    
    # Kahn's algoritme: verwerk per in-graad niveau
    lanes = []
    queue = deque([t for t in dag_tasks if in_degree[t['task_id']] == 0])
    
    while queue:
        lane = []
        next_queue = deque()
        
        while queue:
            task_id = queue.popleft()
            lane.append(task_map[task_id])
            
            for dependent in graph[task_id]:
                in_degree[dependent] -= 1
                if in_degree[dependent] == 0:
                    next_queue.append(dependent)
        
        lanes.append(lane)
        queue = next_queue
    
    return lanes
```

Elke lane vertegenwoordigt taken die moeten voltooien voordat de volgende lane begint.

### Statuspersistentie

Persisteer uitvoeringsstatus na elke lane:

```python
def save_dag_state(dag_state_file, dag_id, execution_id, lane_index, results):
    """
    Voeg voltooide lane resultaten toe aan DAG statusbestand.
    Gebruik voor hervatting als orchestrator crasht.
    """
    import json
    from datetime import datetime
    
    state = {
        "dag_id": dag_id,
        "execution_id": execution_id,
        "completed_lane": lane_index,
        "results": results,
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }
    
    with open(dag_state_file, 'a') as f:
        f.write(json.dumps(state) + '\n')
```

Gebruik `.claude/dag-state.json` (JSONL alleen toevoegen). Lees bij herstart de laatste regel om de laatste voltooide lane te vinden.

### Foutafhandeling

Als taak in lane mislukt:

1. **Log naar dead letter queue:** Registreer mislukte taak, input en fout
2. **Stop DAG:** Ga niet naar volgende lane
3. **Bepaal herstelactie:**
   - Retry bij voorbijgaande fout (timeout, rate limit)
   - Escaleer bij permanente fout (validatiefout, ontbrekende input)
   - Rollback bij saga (voer compensaties in omgekeerde volgorde uit)

### Uitvoeringslus

```python
async def execute_dag(dag_spec, execution_id):
    """Voer DAG tot voltooiing of fout uit."""
    
    if has_cycle(dag_spec['tasks']):
        raise ValueError("DAG contains cycles")
    
    lanes = get_execution_lanes(dag_spec['tasks'])
    dag_state = init_dag_state(dag_spec['dag_id'], execution_id)
    
    for lane_index, lane_tasks in enumerate(lanes):
        try:
            results = await asyncio.gather(*[
                run_agent_task(task, dag_state)
                for task in lane_tasks
            ])
            
            save_dag_state('.claude/dag-state.json', dag_spec['dag_id'], execution_id, lane_index, results)
            dag_state.update(results)
            
        except Exception as e:
            log_dead_letter(dag_spec, execution_id, lane_index, e)
            raise
    
    return dag_state
```

---
