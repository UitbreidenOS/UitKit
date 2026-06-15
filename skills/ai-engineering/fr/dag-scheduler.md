---
name: dag-scheduler
description: "Construire, valider et exécuter des topologies de graphes acycliques orientés (DAG) pour les workflows multi-agents avec parallélisation automatique et détection de cycles"
updated: 2026-06-15
---

# Compétence DAG Scheduler

## Quand l'activer

- Concevoir ou implémenter un workflow multi-agents avec des dépendances complexes (pas purement séquentiel)
- Convertir un workflow séquentiel existant en DAG pour activer la parallélisation
- Déboguer les problèmes de coordination d'agents (blocages, dépendances circulaires, ordre d'exécution)
- Créer des workflows résilients qui se rétablissent à partir de défaillances partielles sans redémarrage
- Optimiser la latence multi-agents en identifiant les sous-tâches parallélisables

## Quand NE PAS l'utiliser

- Workflows purement séquentiels (utiliser le pattern saga à la place)
- Tâches mono-agent ou boucles d'outils
- Workflows avec dépendances circulaires (les DAGs doivent être acycliques)
- Workflows de streaming en temps réel (utiliser une architecture pilotée par les événements)

## Instructions

### Définition DAG

Définir les tâches comme une liste plate avec dépendances explicites :

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

Règles :
- Chaque tâche a un `task_id` explicite
- La liste des dépendances contient uniquement les valeurs `task_id` (pas les noms d'agents)
- Les tâches racine ont `dependencies: []`
- Tous les IDs de tâches référencés dans les dépendances doivent exister dans la liste des tâches

### Détection de cycles

Toujours exécuter la détection de cycles avant d'exécuter un DAG :

```python
def has_cycle(dag_tasks):
    """Retourne True si le DAG a un cycle, False sinon."""
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

Si `has_cycle()` retourne True, ne pas exécuter. Enregistrer le chemin du cycle et escalader vers l'opérateur.

### Tri topologique et parallélisation

Convertir le DAG en lanes d'exécution (ensemble de tâches qui peuvent s'exécuter en parallèle) :

```python
def get_execution_lanes(dag_tasks):
    """
    Retourne une liste de listes de tâches.
    Chaque liste interne contient des tâches sans dépendances inter-tâches (peuvent s'exécuter en parallèle).
    """
    from collections import defaultdict, deque
    
    in_degree = {t['task_id']: 0 for t in dag_tasks}
    graph = defaultdict(list)
    task_map = {t['task_id']: t for t in dag_tasks}
    
    # Construire le graphe et calculer les degrés entrants
    for task in dag_tasks:
        for dep in task['dependencies']:
            graph[dep].append(task['task_id'])
            in_degree[task['task_id']] += 1
    
    # Algorithme de Kahn : traiter par niveau de degré entrant
    lanes = []
    queue = deque([t for t in dag_tasks if in_degree[t['task_id']] == 0])
    
    while queue:
        lane = []
        next_queue = deque()
        
        # Toutes les tâches avec degré entrant 0 peuvent s'exécuter dans la même lane
        while queue:
            task_id = queue.popleft()
            lane.append(task_map[task_id])
            
            # Décrémenter le degré entrant pour les tâches dépendantes
            for dependent in graph[task_id]:
                in_degree[dependent] -= 1
                if in_degree[dependent] == 0:
                    next_queue.append(dependent)
        
        lanes.append(lane)
        queue = next_queue
    
    return lanes
```

Chaque lane représente un ensemble de tâches qui doivent se terminer avant que la lane suivante ne commence.

### Persistance d'état

Après que chaque lane se complète, persister l'état d'exécution :

```python
def save_dag_state(dag_state_file, dag_id, execution_id, lane_index, results):
    """
    Ajouter les résultats de la lane complétée au fichier d'état DAG.
    Utiliser pour la reprise si l'orchestrateur plante.
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

Utiliser `.claude/dag-state.json` (format JSONL en ajout seul). Au redémarrage, lire la dernière ligne pour trouver la dernière lane complétée et reprendre à partir de là.

### Gestion des défaillances

Si une tâche dans une lane échoue :

1. **Enregistrer dans la dead letter queue :** Enregistrer la tâche échouée, son entrée et l'erreur
2. **Arrêter le DAG :** Ne pas procéder à la lane suivante
3. **Déterminer l'action de récupération :**
   - Réessayer si erreur transitoire (timeout, limite de débit)
   - Escalader si erreur permanente (défaillance de validation, entrée manquante)
   - Rollback si c'est une saga (exécuter les compensations en ordre inverse)

### Boucle d'exécution

```python
async def execute_dag(dag_spec, execution_id):
    """Exécuter un DAG jusqu'à la complétion ou défaillance."""
    
    # Valider
    if has_cycle(dag_spec['tasks']):
        raise ValueError("DAG contains cycles")
    
    # Calculer les lanes d'exécution
    lanes = get_execution_lanes(dag_spec['tasks'])
    
    # Initialiser l'état
    dag_state = init_dag_state(dag_spec['dag_id'], execution_id)
    
    # Exécuter lane par lane
    for lane_index, lane_tasks in enumerate(lanes):
        try:
            # Exécuter toutes les tâches dans la lane concurremment
            results = await asyncio.gather(*[
                run_agent_task(task, dag_state)
                for task in lane_tasks
            ])
            
            # Sauvegarder l'état
            save_dag_state('.claude/dag-state.json', dag_spec['dag_id'], execution_id, lane_index, results)
            dag_state.update(results)
            
        except Exception as e:
            # La tâche a échoué
            log_dead_letter(dag_spec, execution_id, lane_index, e)
            raise
    
    return dag_state
```

## Exemple

**DAG de traitement de commande :**

```
Entrée :
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

Lanes d'exécution (parallélisation) :
Lane 1: [validate_order]
Lane 2: [check_inventory, verify_payment]  ← Peuvent s'exécuter en parallèle
Lane 3: [reserve_items]
Lane 4: [charge_card]
Lane 5: [send_email]

Latence :
Séquentiel : 6 étapes × 5s = 30s
DAG :       5 lanes × 5s = 25s (25% plus rapide grâce à la parallélisation)
```

---
