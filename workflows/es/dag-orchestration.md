# Flujo de trabajo de orquestación DAG

Coordina agentes distribuidos utilizando una topología de gráfico acíclico dirigido (DAG) — las tareas se ejecutan en orden de dependencias con paralelización automática, detección de ciclos y manejo de cartas muertas.

---

## Cuándo usar

- Flujos de trabajo multi-agentes donde las tareas tienen cadenas de dependencias complejas (no puramente secuenciales)
- Flujos de trabajo con dependencias parciales (la tarea D depende de A y C, pero no de B)
- Operaciones que requieren ejecución paralela de subtareas independientes para eficiencia
- Flujos de trabajo más largos que 3 pasos donde la claridad de dependencias reduce errores
- Sistemas que requieren observabilidad en el estado de tareas y caminos críticos

No usar para canalizaciones puramente secuenciales (use patrón saga), flujos de trabajo de un solo agente, o flujos de trabajo con dependencias circulares (los DAGs deben ser acíclicos).

---

## Arquitectura

### Estructura DAG

Un DAG se define como:
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

Reglas:
- Cada tarea debe listar sus dependencias (lista vacía = tarea raíz)
- No se permiten dependencias circulares (aplicadas por detección de ciclos)
- Cada tarea es una unidad discreta propiedad de un agente
- Las dependencias son IDs de tareas, no IDs de agentes

### Clasificación topológica

Ejecute tareas en orden de dependencias. Pseudocódigo:

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

### Detección de ciclos

Detecte ciclos antes de la ejecución:

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

### Persistencia de estado

El estado de ejecución del DAG se persiste en `.claude/dag-state.json`:

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

Actualice el estado después de cada tarea completada. Úselo para:
- Reanudación si el orquestador falla (reiniciar desde la última tarea completada)
- Consultas de progreso (¿qué se está ejecutando? ¿qué está terminado?)
- Depuración (rastreo completo de entradas/salidas)

### Ejecución de carril paralelo

Cada "carril" en el plan de ejecución contiene tareas independientes. Ejecútelas simultáneamente:

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

## Manejo de cartas muertas

Cuando una tarea falla después de agotar los reintentos:

1. Registre en la cola de cartas muertas (`.claude/dag-dead-letters.jsonl`):
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

2. Detenga el DAG (no ejecute tareas dependientes).
3. Notifique a turnos o abra un ticket con la carga útil de carta muerta.
4. Marque el estado del DAG como `failed_with_dead_letter`.

---

## Ejemplo

**DAG de cumplimiento de pedidos de comercio electrónico:**

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

Plan de ejecución (carriles):
1. Carril 1: `validate_order`
2. Carril 2: `check_inventory`, `verify_payment` (paralelos)
3. Carril 3: `reserve_items`, `charge_payment` (parcialmente dependientes)
4. Carril 4: `send_confirmation`

**Escenario de falla:** `verify_payment` falla en carril 2. Acciones:
- Aborte `reserve_items`, `charge_payment`, `send_confirmation`
- Inicie compensación (libere la reserva de inventario si se realizó)
- Registre carta muerta con contexto completo
- Notifique a turnos

---
