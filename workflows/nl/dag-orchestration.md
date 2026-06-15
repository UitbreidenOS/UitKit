# DAG-orkestratie workflow

Coördineert gedistribueerde agenten met behulp van een gerichte acyclische graaftopologie (DAG) — taken worden in afhankelijkheidsorde uitgevoerd met automatische parallelisering, cyclus detectie en dead-letter handling.

---

## Wanneer gebruiken

- Multi-agent workflows waarbij taken complexe afhankelijkheidskettingen hebben (niet puur sequentieel)
- Workflows met gedeeltelijke afhankelijkheden (taak D hangt af van A en C, maar niet van B)
- Bewerkingen die parallelle uitvoering van onafhankelijke subtaken voor efficiëntie vereisen
- Workflows langer dan 3 stappen waarbij afhankelijkheidsduidelijkheid fouten vermindert
- Systemen die observabiliteit in taakstatus en kritieke paden nodig hebben

Niet gebruiken voor puur sequentiële pijplijnen (gebruik sagapatroon), single-agent workflows, of workflows met circulaire afhankelijkheden (DAGs moeten acyclisch zijn).

---

## Architectuur

### DAG-structuur

Een DAG is als volgt gedefinieerd:
```json
{
  "dag_id": "ecommerce_fulfillment",
  "description": "Order processing with parallel inventory and payment checks",
  "tasks": [
    {
      "task_id": "validate_order",
      "agent": "order-validator",
      "action": "validate",
      "dependencies": [],
      "timeout_ms": 5000,
      "retries": 2
    },
    {
      "task_id": "check_inventory",
      "agent": "inventory-agent",
      "action": "check_stock",
      "dependencies": ["validate_order"],
      "timeout_ms": 10000,
      "retries": 1
    },
    {
      "task_id": "verify_payment",
      "agent": "payment-agent",
      "action": "verify_funds",
      "dependencies": ["validate_order"],
      "timeout_ms": 8000,
      "retries": 3
    },
    {
      "task_id": "reserve_items",
      "agent": "inventory-agent",
      "action": "reserve",
      "dependencies": ["check_inventory"],
      "timeout_ms": 5000,
      "retries": 1
    },
    {
      "task_id": "charge_payment",
      "agent": "payment-agent",
      "action": "charge",
      "dependencies": ["verify_payment", "reserve_items"],
      "timeout_ms": 10000,
      "retries": 2
    }
  ]
}
```

Regels:
- Elke taak moet haar afhankelijkheden opsommen (lege lijst = hoofdtaak)
- Geen circulaire afhankelijkheden toegestaan (afgedwongen door cyclus detectie)
- Elke taak is een discrete eenheid die eigendom is van één agent
- Afhankelijkheden zijn taak-ID's, niet agent-ID's

### Topologische sortering

Voer taken uit in afhankelijkheidsvolgorde. Pseudocode:

```python
def topological_sort(dag_tasks):
    """
    Returns a list of task lists, where each inner list contains
    tasks that can execute in parallel (no inter-task dependencies).
    """
    in_degree = {task['task_id']: 0 for task in dag_tasks}
    task_map = {task['task_id']: task for task in dag_tasks}
    
    # Count incoming edges (dependencies)
    for task in dag_tasks:
        for dep in task['dependencies']:
            in_degree[task['task_id']] += 1
    
    # Kahn's algorithm for topological sort
    ready_queue = [t for t in dag_tasks if in_degree[t['task_id']] == 0]
    execution_lanes = []
    
    while ready_queue:
        # All tasks with zero in-degree can run in parallel (one lane)
        execution_lanes.append(ready_queue[:])
        next_queue = []
        
        for task in ready_queue:
            # Decrease in-degree for dependent tasks
            for other in dag_tasks:
                if task['task_id'] in other['dependencies']:
                    in_degree[other['task_id']] -= 1
                    if in_degree[other['task_id']] == 0:
                        next_queue.append(other)
        
        ready_queue = next_queue
    
    # If any task still has in_degree > 0, cycle detected
    if any(in_degree[t] > 0 for t in in_degree):
        raise ValueError("DAG contains cycles")
    
    return execution_lanes
```

### Cyclus detectie

Detecteer cycli voor uitvoering:

```python
def detect_cycles(dag_tasks):
    """
    Uses DFS to detect cycles. Raises ValueError if found.
    """
    task_map = {t['task_id']: t for t in dag_tasks}
    visited = {}  # white, gray, black
    
    def dfs(task_id):
        if task_id in visited:
            if visited[task_id] == 'gray':
                raise ValueError(f"Cycle detected involving {task_id}")
            return
        
        visited[task_id] = 'gray'
        for dep in task_map[task_id]['dependencies']:
            dfs(dep)
        visited[task_id] = 'black'
    
    for task in dag_tasks:
        if task['task_id'] not in visited:
            dfs(task['task_id'])
```

### Toestand persistentie

De DAG-uitvoeringsstatus wordt in `.claude/dag-state.json` gepersisteerd:

```json
{
  "dag_id": "ecommerce_fulfillment",
  "execution_id": "exec_abc123",
  "status": "running",
  "started_at": "2026-06-15T14:00:00Z",
  "tasks": {
    "validate_order": {
      "status": "completed",
      "output": {"order_id": "o_789", "user_id": "u_456"},
      "started_at": "2026-06-15T14:00:01Z",
      "completed_at": "2026-06-15T14:00:02Z",
      "agent_model": "claude-opus-4-20250514",
      "input_tokens": 150,
      "output_tokens": 87
    },
    "check_inventory": {
      "status": "running",
      "started_at": "2026-06-15T14:00:02Z"
    },
    "verify_payment": {
      "status": "running",
      "started_at": "2026-06-15T14:00:02Z"
    }
  },
  "lanes": [
    ["validate_order"],
    ["check_inventory", "verify_payment"],
    ["reserve_items"],
    ["charge_payment"]
  ]
}
```

Werk de status bij na elke voltooide taak. Gebruik voor:
- Hervatting als orchestrator crasht (herstart van laatst voltooide taak)
- Voortgangsquery's (wat loopt er? wat is klaar?)
- Debugging (volledige trace van invoer/uitvoer)

### Parallelle rijuitvoering

Elke "rij" in het uitvoeringsplan bevat onafhankelijke taken. Voer ze gelijktijdig uit:

```python
async def execute_lane(lane_tasks, dag_state, context):
    """
    Execute all tasks in a lane in parallel (no inter-lane dependencies).
    Fail the entire DAG if any task in the lane fails.
    """
    lane_results = {}
    tasks_to_run = [
        run_agent_task(task, dag_state, context)
        for task in lane_tasks
    ]
    
    try:
        results = await asyncio.gather(*tasks_to_run)
        for task, result in zip(lane_tasks, results):
            lane_results[task['task_id']] = result
            dag_state['tasks'][task['task_id']] = {
                'status': 'completed',
                'output': result['output'],
                'completed_at': now_iso()
            }
        return lane_results
    except Exception as e:
        # One task failed; abort the DAG
        dag_state['status'] = 'failed'
        raise
```

---

## Dead-letter handling

Wanneer een taak mislukt nadat pogingen uitgeput zijn:

1. Loggen naar dead-letter wachtrij (`.claude/dag-dead-letters.jsonl`):
```json
{
  "dag_id": "ecommerce_fulfillment",
  "execution_id": "exec_abc123",
  "failed_task_id": "charge_payment",
  "task": {...},
  "error": "Payment gateway timeout after 2 retries",
  "attempts": [
    {"attempt": 1, "error": "timeout", "duration_ms": 10045},
    {"attempt": 2, "error": "timeout", "duration_ms": 10032}
  ],
  "context": {"order_id": "o_789", "amount": 199.99},
  "timestamp": "2026-06-15T14:02:15Z"
}
```

2. Stop de DAG (voer afhankelijke taken niet uit).
3. Waarschuw dienst of open ticket met dead-letter payload.
4. Markeer DAG-status als `failed_with_dead_letter`.

---

## Voorbeeld

**E-commerce ordervervullings-DAG:**

```
        validate_order
             / \
            /   \
    check_inventory  verify_payment
            |               |
      reserve_items  payment charged
            \               /
             \             /
              charge_payment
                    |
              send_confirmation
```

Uitvoeringsplan (rijen):
1. Rij 1: `validate_order`
2. Rij 2: `check_inventory`, `verify_payment` (parallel)
3. Rij 3: `reserve_items`, `charge_payment` (gedeeltelijk afhankelijk)
4. Rij 4: `send_confirmation`

**Mislukkingsscenario:** `verify_payment` mislukt op rij 2. Acties:
- Zet `reserve_items`, `charge_payment`, `send_confirmation` af
- Initieer compensatie (geef voorraadreservering vrij als deze is gedaan)
- Log dead-letter met volledige context
- Waarschuw dienst

---
