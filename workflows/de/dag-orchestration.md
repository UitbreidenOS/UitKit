# DAG-Orchestrierungs-Workflow

Koordiniert verteilte Agenten unter Verwendung einer gerichteten azyklischen Graphen-Topologie (DAG) — Aufgaben werden in Abhängigkeitsreihenfolge mit automatischer Parallelisierung, Zykluserkennung und Deadletter-Behandlung ausgeführt.

---

## Wann verwenden

- Multi-Agent-Workflows, bei denen Aufgaben komplexe Abhängigkeitsketten haben (nicht rein sequenziell)
- Workflows mit partiellen Abhängigkeiten (Aufgabe D hängt von A und C ab, nicht aber von B)
- Operationen, die parallele Ausführung unabhängiger Unteraufgaben für Effizienz erfordern
- Workflows länger als 3 Schritte, bei denen Abhängigkeitsklarheit Fehler reduziert
- Systeme, die Observabilität in Aufgabenstatus und kritischen Pfaden benötigen

Nicht verwenden für rein sequenzielle Pipelines (verwenden Sie das Saga-Pattern), Single-Agent-Workflows oder Workflows mit zirkulären Abhängigkeiten (DAGs müssen azyklisch sein).

---

## Architektur

### DAG-Struktur

Ein DAG ist wie folgt definiert:
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

Regeln:
- Jede Aufgabe muss ihre Abhängigkeiten auflisten (leere Liste = Wurzelaufgabe)
- Keine zirkulären Abhängigkeiten zulässig (erzwungen durch Zykluserkennung)
- Jede Aufgabe ist eine diskrete Einheit im Besitz eines Agenten
- Abhängigkeiten sind Aufgaben-IDs, nicht Agent-IDs

### Topologische Sortierung

Führen Sie Aufgaben in Abhängigkeitsreihenfolge aus. Pseudocode:

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

### Zykluserkennung

Erkennen Sie Zyklen vor der Ausführung:

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

### Zustandspersistenz

Der DAG-Ausführungsstatus wird in `.claude/dag-state.json` persistiert:

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

Aktualisieren Sie den Zustand nach jeder abgeschlossenen Aufgabe. Verwenden Sie für:
- Wiederaufnahme, wenn der Orchestrator ausfällt (Neustart ab letzter abgeschlossener Aufgabe)
- Fortschrittsabfragen (Was läuft? Was ist erledigt?)
- Debugging (vollständige Spur von Eingaben/Ausgaben)

### Parallele Spurausführung

Jede "Spur" im Ausführungsplan enthält unabhängige Aufgaben. Führen Sie sie gleichzeitig aus:

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

## Deadletter-Behandlung

Wenn eine Aufgabe nach Erschöpfung der Wiederholungsversuche fehlschlägt:

1. In die Deadletter-Warteschlange protokollieren (`.claude/dag-dead-letters.jsonl`):
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

2. Beenden Sie den DAG (führen Sie keine abhängigen Aufgaben aus).
3. Benachrichtigen Sie den Bereitschaftsdienst oder öffnen Sie ein Ticket mit der Deadletter-Nutzlast.
4. Markieren Sie den DAG-Status als `failed_with_dead_letter`.

---

## Beispiel

**DAG zur Erfüllung von E-Commerce-Bestellungen:**

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

Ausführungsplan (Spuren):
1. Spur 1: `validate_order`
2. Spur 2: `check_inventory`, `verify_payment` (parallel)
3. Spur 3: `reserve_items`, `charge_payment` (teilweise abhängig)
4. Spur 4: `send_confirmation`

**Fehlerhafte Szenario:** `verify_payment` schlägt an Spur 2 fehl. Aktionen:
- Brechen Sie `reserve_items`, `charge_payment`, `send_confirmation` ab
- Starten Sie Kompensation (geben Sie Bestandsreservierung frei, falls durchgeführt)
- Protokollieren Sie Deadletter mit vollem Kontext
- Benachrichtigen Sie den Bereitschaftsdienst

---
