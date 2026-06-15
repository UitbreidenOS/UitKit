# Flux de travail d'orchestration DAG

Coordonne les agents distribués en utilisant une topologie de graphe acyclique orienté (DAG) — les tâches s'exécutent dans l'ordre des dépendances avec parallélisation automatique, détection de cycles et gestion des lettres mortes.

---

## Quand utiliser

- Workflows multi-agents où les tâches ont des chaînes de dépendances complexes (pas purement séquentielles)
- Workflows avec dépendances partielles (la tâche D dépend de A et C, mais pas de B)
- Opérations nécessitant l'exécution parallèle de sous-tâches indépendantes pour l'efficacité
- Workflows de plus de 3 étapes où la clarté des dépendances réduit les bogues
- Systèmes nécessitant une observabilité dans l'état des tâches et les chemins critiques

Ne pas utiliser pour les pipelines purement séquentiels (utilisez le pattern saga), les workflows d'un seul agent, ou les workflows avec dépendances circulaires (les DAGs doivent être acycliques).

---

## Architecture

### Structure du DAG

Un DAG est défini comme :
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

Règles :
- Chaque tâche doit lister ses dépendances (liste vide = tâche racine)
- Aucune dépendance circulaire autorisée (appliquée par la détection de cycles)
- Chaque tâche est une unité discrète possédée par un agent
- Les dépendances sont des IDs de tâches, pas des IDs d'agents

### Tri topologique

Exécutez les tâches dans l'ordre des dépendances. Pseudocode :

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

### Détection de cycles

Détectez les cycles avant l'exécution :

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

### Persistance de l'état

L'état d'exécution du DAG est persisté dans `.claude/dag-state.json` :

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

Mettez à jour l'état après chaque tâche terminée. Utilisez pour :
- Reprise si l'orchestrateur échoue (redémarrage à partir de la dernière tâche complétée)
- Requêtes de progression (qu'est-ce qui s'exécute ? qu'est-ce qui est terminé ?)
- Débogage (trace complète des entrées/sorties)

### Exécution des voies parallèles

Chaque « voie » dans le plan d'exécution contient des tâches indépendantes. Exécutez-les simultanément :

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

## Gestion des lettres mortes

Quand une tâche échoue après épuisement des tentatives :

1. Enregistrez dans la file d'attente des lettres mortes (`.claude/dag-dead-letters.jsonl`) :
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

2. Arrêtez le DAG (ne pas exécuter les tâches dépendantes).
3. Signalez en appel ou ouvrez un ticket avec la charge utile de la lettre morte.
4. Marquez l'état du DAG comme `failed_with_dead_letter`.

---

## Exemple

**DAG d'exécution de commandes de commerce électronique :**

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

Plan d'exécution (voies) :
1. Voie 1 : `validate_order`
2. Voie 2 : `check_inventory`, `verify_payment` (parallèles)
3. Voie 3 : `reserve_items`, `charge_payment` (partiellement dépendantes)
4. Voie 4 : `send_confirmation`

**Scénario d'échec :** `verify_payment` échoue à la voie 2. Actions :
- Annulez `reserve_items`, `charge_payment`, `send_confirmation`
- Lancez la compensation (libérez la réservation d'inventaire si elle a été effectuée)
- Enregistrez la lettre morte avec contexte complet
- Notifiez en appel

---
