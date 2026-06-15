---
name: agent-supervisor
description: "Construire des agents orchestrateurs qui gèrent les workflows multi-agents, appliquent les SLA, gèrent les escalades et maintiennent la complétion globale des tâches"
updated: 2026-06-15
---

# Compétence Agent Supervisor

## Quand l'activer

- Construire un agent orchestrateur qui crée et gère plusieurs sous-agents
- Implémenter la logique de timeout/retry/escalation pour les workflows multi-agents
- Appliquer les limites de ressources (tokens, latence, coût) à travers une équipe d'agents
- Gérer la décomposition des tâches et l'allocation du travail entre les agents
- Implémenter les gates de qualité et la validation entre les transferts d'agents

## Quand NE PAS l'utiliser

- Workflows mono-agents (pas d'orchestration nécessaire)
- Systèmes pilotés par les événements sans coordination centralisée
- Systèmes où les agents sont entièrement autonomes (pas de superviseur)

## Instructions

### Responsabilités du superviseur

L'agent superviseur est propriétaire de :

1. **Planification des tâches :** Décomposer la demande utilisateur en sous-tâches
2. **Délégation d'agents :** Assigner les sous-tâches à des agents spécifiques
3. **Gestion d'état :** Maintenir l'état du workflow et la progression
4. **Gates de qualité :** Valider les sorties des agents avant de procéder
5. **Gestion des erreurs :** Réessayer les agents défaillants, escalader les problèmes insolubles
6. **Application des ressources :** Suivre et appliquer les budgets (tokens, latence, coût)
7. **Assemblage des résultats :** Collecter les sorties des agents et produire le résultat final

### Modèle de prompt système

```
You are a supervisor agent. Your job is to manage a team of specialized agents
and ensure they complete a complex task.

Your team consists of:
- researcher: Gathers information from sources
- analyst: Synthesizes findings
- writer: Generates final report

Your workflow:
1. Break the user's request into subtasks
2. Delegate subtasks to agents in sequence
3. Validate each agent's output
4. If output is invalid, retry the agent or escalate
5. Combine outputs into final result

Rules:
- You do NOT do domain work yourself (research, analysis, writing)
- You ONLY delegate and coordinate
- You must provide agents with exactly what they need (no more, no less)
- You must validate agent outputs before proceeding
- You must track latency and tokens (budget: 5000 tokens, 30 minutes)
- If an agent fails 3 times, escalate to human

Task: {{user_request}}

Begin by decomposing the task into subtasks.
```

### Décomposition des tâches

```python
def decompose_task(user_request: str) -> list:
    """
    Utiliser l'agent superviseur pour casser une tâche en sous-tâches.
    Retourne une liste de sous-tâches avec assignations d'agents.
    """
    import anthropic
    
    client = anthropic.Anthropic()
    
    response = client.messages.create(
        model="claude-opus-4-20250514",
        max_tokens=2048,
        system=SUPERVISOR_SYSTEM_PROMPT,
        messages=[{
            "role": "user",
            "content": f"Decompose this task:\n\n{user_request}"
        }]
    )
    
    # Analyser la réponse pour extraire les sous-tâches
    # La réponse doit être du JSON comme :
    # [
    #   {"subtask_id": "st_1", "description": "...", "agent": "researcher", "input": {...}},
    #   {"subtask_id": "st_2", "description": "...", "agent": "analyst", "input": {...}}
    # ]
    
    import json
    subtasks = json.loads(response.content[0].text)
    return subtasks
```

### Délégation d'agents

```python
def delegate_to_agent(subtask: dict, agent_name: str) -> dict:
    """
    Déléguer une sous-tâche à un agent spécifique.
    Retourne la sortie de l'agent.
    """
    # En Claude Code, créer un sous-agent
    subagent_result = spawn_agent(
        agent=agent_name,
        input=subtask['input'],
        timeout_ms=subtask.get('timeout_ms', 300000)
    )
    
    return {
        'subtask_id': subtask['subtask_id'],
        'agent': agent_name,
        'status': subagent_result['status'],
        'output': subagent_result['output'],
        'tokens_used': subagent_result['tokens_used'],
        'latency_ms': subagent_result['latency_ms']
    }
```

### Validation de gate de qualité

```python
def validate_agent_output(output: dict, expected_schema: dict) -> bool:
    """
    Valider que la sortie de l'agent correspond au schéma attendu.
    Retourne True si valide, False sinon.
    """
    import jsonschema
    
    try:
        jsonschema.validate(
            instance=output,
            schema=expected_schema
        )
        return True
    except jsonschema.ValidationError as e:
        print(f"Validation error: {e.message}")
        return False

def quality_gate_checkpoint(agent_output, expected_schema, subtask_id):
    """
    Checkpoint pour valider la sortie de l'agent avant de procéder.
    """
    if validate_agent_output(agent_output, expected_schema):
        print(f"✓ Subtask {subtask_id} passed quality gate")
        return True
    else:
        print(f"✗ Subtask {subtask_id} failed validation")
        return False
```

### Retry avec backoff exponentiel

```python
import asyncio

async def delegate_with_retry(subtask, agent_name, max_retries=3):
    """
    Déléguer avec retry automatique en cas de défaillance.
    Utilise le backoff exponentiel : 1s, 2s, 4s
    """
    for attempt in range(max_retries):
        try:
            result = delegate_to_agent(subtask, agent_name)
            
            if result['status'] == 'success':
                return result
            else:
                # L'agent a retourné une erreur
                print(f"Agent {agent_name} failed: {result.get('error')}")
                
                if attempt < max_retries - 1:
                    wait_time = 2 ** attempt  # backoff exponentiel
                    print(f"Retrying in {wait_time}s...")
                    await asyncio.sleep(wait_time)
        
        except Exception as e:
            print(f"Exception on attempt {attempt + 1}: {e}")
            if attempt == max_retries - 1:
                raise
    
    # Tous les retries épuisés
    raise RuntimeError(f"Agent {agent_name} failed after {max_retries} attempts")
```

### Application des ressources

```python
class ResourceBudget:
    def __init__(self, max_tokens=5000, max_latency_ms=300000, max_cost_cents=150):
        self.max_tokens = max_tokens
        self.max_latency_ms = max_latency_ms
        self.max_cost_cents = max_cost_cents
        
        self.tokens_used = 0
        self.latency_ms = 0
        self.cost_cents = 0
    
    def record_agent_call(self, agent_result):
        self.tokens_used += agent_result['tokens_used']['input'] + agent_result['tokens_used']['output']
        self.latency_ms += agent_result['latency_ms']
        self.cost_cents += agent_result.get('cost_cents', 0)
    
    def check_budget(self):
        if self.tokens_used > self.max_tokens:
            raise RuntimeError(f"Token budget exceeded: {self.tokens_used} / {self.max_tokens}")
        if self.latency_ms > self.max_latency_ms:
            raise RuntimeError(f"Latency budget exceeded: {self.latency_ms}ms / {self.max_latency_ms}ms")
        if self.cost_cents > self.max_cost_cents:
            raise RuntimeError(f"Cost budget exceeded: ${self.cost_cents / 100} / ${self.max_cost_cents / 100}")
    
    def get_budget_report(self):
        return {
            'tokens': f"{self.tokens_used} / {self.max_tokens}",
            'latency_ms': f"{self.latency_ms} / {self.max_latency_ms}",
            'cost_cents': f"{self.cost_cents} / {self.max_cost_cents}"
        }
```

### Boucle d'orchestration

```python
async def supervise_workflow(user_request: str):
    """
    Boucle d'orchestration principale pour l'agent superviseur.
    """
    budget = ResourceBudget()
    
    # Étape 1 : Décomposer la tâche
    subtasks = decompose_task(user_request)
    print(f"Decomposed into {len(subtasks)} subtasks")
    
    results = {}
    
    # Étape 2 : Exécuter les sous-tâches
    for subtask in subtasks:
        try:
            # Déléguer avec retry
            result = await delegate_with_retry(
                subtask,
                agent_name=subtask['agent'],
                max_retries=3
            )
            
            # Valider la sortie
            if not quality_gate_checkpoint(result['output'], subtask.get('expected_schema'), subtask['subtask_id']):
                # La validation a échoué ; retry l'agent
                print(f"Retrying {subtask['subtask_id']} due to validation failure")
                result = await delegate_with_retry(subtask, subtask['agent'], max_retries=2)
            
            # Suivre les ressources
            budget.record_agent_call(result)
            budget.check_budget()
            
            results[subtask['subtask_id']] = result
            
        except Exception as e:
            # Escalader vers un humain
            print(f"Escalating {subtask['subtask_id']}: {e}")
            results[subtask['subtask_id']] = {
                'status': 'escalated',
                'error': str(e)
            }
    
    # Étape 3 : Assembler le résultat final
    final_result = assemble_results(results)
    
    print(f"Workflow completed. Budget report: {budget.get_budget_report()}")
    return final_result
```

### Exemple : Superviseur gérant un workflow de recherche

```python
# Le superviseur décompose la demande
user_request = "Write a report on Quantum Computing in 2026"

# Sous-tâches générées :
subtasks = [
    {
        "subtask_id": "st_1",
        "description": "Research quantum computing developments",
        "agent": "researcher",
        "input": {"topic": "Quantum Computing", "max_sources": 15},
        "timeout_ms": 120000,
        "expected_schema": {
            "type": "object",
            "properties": {
                "sources": {"type": "array"},
                "summary": {"type": "string"}
            },
            "required": ["sources", "summary"]
        }
    },
    {
        "subtask_id": "st_2",
        "description": "Analyze research findings",
        "agent": "analyst",
        "input": {"sources": "{{st_1.output.sources}}"},
        "timeout_ms": 120000
    },
    {
        "subtask_id": "st_3",
        "description": "Write report",
        "agent": "writer",
        "input": {"sources": "{{st_1.output.sources}}", "analysis": "{{st_2.output}}"},
        "timeout_ms": 60000
    }
]

# Le superviseur délègue et valide
# Si une sous-tâche échoue > 3 fois, escalade
# Si une sous-tâche dépasse le budget, arrête le workflow
# Retourne le rapport final
```

---
