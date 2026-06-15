---
name: dag-scheduler
description: "Construir, validar y ejecutar topologías de gráficos acíclicos dirigidos (DAG) para flujos de trabajo multiagente con paralelización automática y detección de ciclos"
updated: 2026-06-15
---

# Habilidad DAG Scheduler

## Cuándo activar

- Diseñar e implementar un flujo de trabajo multiagente con dependencias complejas (no puramente secuencial)
- Convertir un flujo de trabajo secuencial existente en un DAG para habilitar la paralelización
- Depurar problemas de coordinación de agentes (bloqueos, dependencias circulares, orden de ejecución)
- Crear flujos de trabajo resilientes que se recuperen de fallas parciales sin reinicio
- Optimizar la latencia multiagente identificando subtareas paralelizables

## Cuándo NO usar

- Flujos de trabajo puramente secuenciales (usar patrón de saga en su lugar)
- Tareas monoagente o bucles de herramientas
- Flujos de trabajo con dependencias circulares (los DAG deben ser acíclicos)
- Flujos de trabajo de transmisión en tiempo real (usar arquitectura dirigida por eventos)

## Instrucciones

### Definición DAG

Definir tareas como una lista plana con dependencias explícitas:

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

Reglas:
- Cada tarea tiene un `task_id` explícito
- La lista de dependencias contiene solo valores `task_id` (no nombres de agentes)
- Las tareas raíz tienen `dependencies: []`
- Todos los IDs de tarea referenciados en dependencias deben existir en la lista de tareas

### Detección de ciclos

Ejecute siempre la detección de ciclos antes de ejecutar un DAG:

```python
def has_cycle(dag_tasks):
    """Retorna True si el DAG tiene un ciclo, False en caso contrario."""
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

Si `has_cycle()` retorna True, no ejecute. Registre la ruta del ciclo y escale al operador.

### Ordenamiento topológico y paralelización

Convertir el DAG en carriles de ejecución (conjuntos de tareas que pueden ejecutarse en paralelo):

```python
def get_execution_lanes(dag_tasks):
    """
    Retorna una lista de listas de tareas.
    Cada lista interna contiene tareas sin dependencias entre tareas (pueden ejecutarse en paralelo).
    """
    from collections import defaultdict, deque
    
    in_degree = {t['task_id']: 0 for t in dag_tasks}
    graph = defaultdict(list)
    task_map = {t['task_id']: t for t in dag_tasks}
    
    # Construir gráfico y calcular grados de entrada
    for task in dag_tasks:
        for dep in task['dependencies']:
            graph[dep].append(task['task_id'])
            in_degree[task['task_id']] += 1
    
    # Algoritmo de Kahn: procesar por nivel de grado de entrada
    lanes = []
    queue = deque([t for t in dag_tasks if in_degree[t['task_id']] == 0])
    
    while queue:
        lane = []
        next_queue = deque()
        
        # Todas las tareas con grado de entrada 0 pueden ejecutarse en el mismo carril
        while queue:
            task_id = queue.popleft()
            lane.append(task_map[task_id])
            
            # Decrementar grado de entrada para tareas dependientes
            for dependent in graph[task_id]:
                in_degree[dependent] -= 1
                if in_degree[dependent] == 0:
                    next_queue.append(dependent)
        
        lanes.append(lane)
        queue = next_queue
    
    return lanes
```

Cada carril representa un conjunto de tareas que deben completarse antes de que comience el siguiente carril.

### Persistencia de estado

Persistir el estado de ejecución después de que se completa cada carril:

```python
def save_dag_state(dag_state_file, dag_id, execution_id, lane_index, results):
    """
    Añadir resultados del carril completado al archivo de estado DAG.
    Usar para reanudar si el orquestador se bloquea.
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

Usar `.claude/dag-state.json` (formato JSONL de solo apéndice). Al reiniciar, lea la última línea para encontrar el último carril completado y reanude desde allí.

### Manejo de fallos

Si una tarea en un carril falla:

1. **Registrar en cola de letras muertas:** Registrar la tarea fallida, su entrada y el error
2. **Detener el DAG:** No proceda al siguiente carril
3. **Determinar acción de recuperación:**
   - Reintentar si error transitorio (timeout, límite de velocidad)
   - Escalar si error permanente (falla de validación, entrada faltante)
   - Reversión si es una saga (ejecutar compensaciones en orden inverso)

### Bucle de ejecución

```python
async def execute_dag(dag_spec, execution_id):
    """Ejecutar un DAG hasta completación o fallo."""
    
    # Validar
    if has_cycle(dag_spec['tasks']):
        raise ValueError("DAG contains cycles")
    
    # Calcular carriles de ejecución
    lanes = get_execution_lanes(dag_spec['tasks'])
    
    # Inicializar estado
    dag_state = init_dag_state(dag_spec['dag_id'], execution_id)
    
    # Ejecutar carril por carril
    for lane_index, lane_tasks in enumerate(lanes):
        try:
            # Ejecutar todas las tareas en el carril concurrentemente
            results = await asyncio.gather(*[
                run_agent_task(task, dag_state)
                for task in lane_tasks
            ])
            
            # Guardar estado
            save_dag_state('.claude/dag-state.json', dag_spec['dag_id'], execution_id, lane_index, results)
            dag_state.update(results)
            
        except Exception as e:
            # Tarea falló
            log_dead_letter(dag_spec, execution_id, lane_index, e)
            raise
    
    return dag_state
```

## Ejemplo

**DAG de cumplimiento de pedidos:**

```
Entrada:
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

Carriles de ejecución (paralelización):
Lane 1: [validate_order]
Lane 2: [check_inventory, verify_payment]  ← Pueden ejecutarse en paralelo
Lane 3: [reserve_items]
Lane 4: [charge_card]
Lane 5: [send_email]

Latencia:
Secuencial: 6 pasos × 5s = 30s
DAG:       5 carriles × 5s = 25s (25% más rápido por paralelización)
```

---
