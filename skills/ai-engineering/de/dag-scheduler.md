---
name: dag-scheduler
description: "Erstellen, validieren und führen Sie gerichtete azyklische Graphen (DAG)-Topologien für Multi-Agent-Workflows mit automatischer Parallelisierung und Zyklenerkennung aus"
updated: 2026-06-15
---

# DAG Scheduler Fähigkeit

## Wann aktivieren

- Entwerfen oder Implementieren eines Multi-Agent-Workflows mit komplexen Abhängigkeiten (nicht rein sequenziell)
- Konvertieren eines bestehenden sequenziellen Workflows in einen DAG, um Parallelisierung zu ermöglichen
- Debuggen von Agenten-Koordinationsproblemen (Deadlocks, zirkuläre Abhängigkeiten, Ausführungsreihenfolge)
- Erstellen von zuverlässigen Workflows, die sich von Teilausfällen ohne Neustart erholen
- Optimieren der Multi-Agent-Latenz durch Identifikation parallelisierbarer Teilaufgaben

## Wann NICHT verwenden

- Rein sequenzielle Workflows (verwenden Sie stattdessen das Saga-Muster)
- Single-Agent-Aufgaben oder Werkzeugschleifen
- Workflows mit zirkulären Abhängigkeiten (DAGs müssen azyklisch sein)
- Echtzeit-Streaming-Workflows (verwenden Sie stattdessen ereignisgesteuerte Architektur)

## Anleitung

### DAG-Definition

Definieren Sie Aufgaben als flache Liste mit expliziten Abhängigkeiten:

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

Regeln:
- Jede Aufgabe hat eine explizite `task_id`
- Die Abhängigkeitsliste enthält nur `task_id`-Werte (keine Agentennamen)
- Wurzelaufgaben haben `dependencies: []`
- Alle in Abhängigkeiten referenzierten Task-IDs müssen in der Aufgabenliste vorhanden sein

### Zyklenerkennung

Führen Sie immer die Zyklenerkennung vor der DAG-Ausführung aus:

```python
def has_cycle(dag_tasks):
    """Gibt True zurück, wenn der DAG einen Zyklus hat, False andernfalls."""
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

Wenn `has_cycle()` True zurückgibt, nicht ausführen. Den Zykluspfad protokollieren und an den Operator eskalieren.

### Topologische Sortierung und Parallelisierung

Konvertieren Sie den DAG in Ausführungsspuren (Sätze von Aufgaben, die parallel ausgeführt werden können):

```python
def get_execution_lanes(dag_tasks):
    """
    Gibt eine Liste von Aufgabenlisten zurück.
    Jede innere Liste enthält Aufgaben ohne Abhängigkeiten zwischen Aufgaben (können parallel ausgeführt werden).
    """
    from collections import defaultdict, deque
    
    in_degree = {t['task_id']: 0 for t in dag_tasks}
    graph = defaultdict(list)
    task_map = {t['task_id']: t for t in dag_tasks}
    
    # Graphen und In-Grade-Berechnung erstellen
    for task in dag_tasks:
        for dep in task['dependencies']:
            graph[dep].append(task['task_id'])
            in_degree[task['task_id']] += 1
    
    # Kahns Algorithmus: nach In-Grade-Ebene verarbeiten
    lanes = []
    queue = deque([t for t in dag_tasks if in_degree[t['task_id']] == 0])
    
    while queue:
        lane = []
        next_queue = deque()
        
        # Alle Aufgaben mit In-Grade 0 können in der gleichen Spur ausgeführt werden
        while queue:
            task_id = queue.popleft()
            lane.append(task_map[task_id])
            
            # In-Grade für abhängige Aufgaben verringern
            for dependent in graph[task_id]:
                in_degree[dependent] -= 1
                if in_degree[dependent] == 0:
                    next_queue.append(dependent)
        
        lanes.append(lane)
        queue = next_queue
    
    return lanes
```

Jede Spur repräsentiert einen Satz von Aufgaben, die abgeschlossen sein müssen, bevor die nächste Spur beginnt.

### Zustandspersistenz

Speichern Sie den Ausführungszustand nach dem Abschluss jeder Spur:

```python
def save_dag_state(dag_state_file, dag_id, execution_id, lane_index, results):
    """
    Ergebnisse der abgeschlossenen Spur an die DAG-Zustandsdatei anhängen.
    Verwenden Sie zur Wiederaufnahme, falls der Orchestrator abstürzt.
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

Verwenden Sie `.claude/dag-state.json` (JSONL-Format nur anhängen). Lesen Sie beim Neustart die letzte Zeile, um die letzte abgeschlossene Spur zu finden und von dort aus fortzufahren.

### Fehlerbehandlung

Wenn eine Aufgabe in einer Spur fehlschlägt:

1. **In Dead-Letter-Queue protokollieren:** Die fehlgeschlagene Aufgabe, ihre Eingabe und den Fehler aufzeichnen
2. **DAG stoppen:** Nicht zur nächsten Spur fortfahren
3. **Wiederherstellungsmaßnahme bestimmen:**
   - Wiederholen bei vorübergehendem Fehler (Timeout, Ratenlimit)
   - Eskalieren bei permanentem Fehler (Validierungsfehler, fehlende Eingabe)
   - Rollback, wenn es sich um eine Saga handelt (Kompensationen in umgekehrter Reihenfolge ausführen)

### Ausführungsschleife

```python
async def execute_dag(dag_spec, execution_id):
    """DAG bis zum Abschluss oder Fehler ausführen."""
    
    # Validieren
    if has_cycle(dag_spec['tasks']):
        raise ValueError("DAG contains cycles")
    
    # Ausführungsspuren berechnen
    lanes = get_execution_lanes(dag_spec['tasks'])
    
    # Zustand initialisieren
    dag_state = init_dag_state(dag_spec['dag_id'], execution_id)
    
    # Spur für Spur ausführen
    for lane_index, lane_tasks in enumerate(lanes):
        try:
            # Alle Aufgaben in der Spur gleichzeitig ausführen
            results = await asyncio.gather(*[
                run_agent_task(task, dag_state)
                for task in lane_tasks
            ])
            
            # Zustand speichern
            save_dag_state('.claude/dag-state.json', dag_spec['dag_id'], execution_id, lane_index, results)
            dag_state.update(results)
            
        except Exception as e:
            # Aufgabe fehlgeschlagen
            log_dead_letter(dag_spec, execution_id, lane_index, e)
            raise
    
    return dag_state
```

## Beispiel

**Bestellerfüllungs-DAG:**

```
Eingabe:
{
  "dag_id": "order_fulfillment",
  "tasks": [
    {"task_id": "validate_order", "agent": "order_agent", "action": "validate", "dependencies": []},
    {"task_id": "check_inventory", "agent": "inventory_agent", "action": "check", "dependencies": ["validate_order"]},
    {"task_id": "verify_payment", "agent": "payment_agent", "action": "verify", "dependencies": ["validate_order"]},
    {"task_id": "reserve_items", "agent": "inventory_agent", "action": "reserve", "dependencies": ["check_inventory"]},
    {"task_id": "charge_card", "agent": "payment_agent", "action": "charge", "dependencies": ["verify_payment", "reserve_items"]},
    {"task_id": "send_email", "agent": "notification_agent", "action": "send_confirmation", "dependencies": ["charge_card"]}
  ]
}

Ausführungsspuren (Parallelisierung):
Lane 1: [validate_order]
Lane 2: [check_inventory, verify_payment]  ← Können parallel ausgeführt werden
Lane 3: [reserve_items]
Lane 4: [charge_card]
Lane 5: [send_email]

Latenz:
Sequenziell: 6 Schritte × 5s = 30s
DAG:        5 Spuren × 5s = 25s (25% schneller durch Parallelisierung)
```

---
