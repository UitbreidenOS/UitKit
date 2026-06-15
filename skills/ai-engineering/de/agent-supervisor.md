---
name: agent-supervisor
description: "Erstellen Sie Orchestrator-Agenten, die Multi-Agent-Workflows verwalten, SLAs durchsetzen, Eskalationen handhaben und die gesamte Aufgabenerledigung aufrechterhalten"
updated: 2026-06-15
---

# Agent Supervisor Fähigkeit

## Wann aktivieren

- Erstellen eines Orchestrator-Agenten, der mehrere Untersuchungsagenten erzeugt und verwaltet
- Implementieren von Timeout/Retry/Eskalationslogik für Multi-Agent-Workflows
- Durchsetzen von Ressourcenlimits (Tokens, Latenz, Kosten) über ein Agent-Team hinweg
- Umgang mit Task-Dekomposition und Arbeitsvergabe zwischen Agenten
- Implementieren von Quality Gates und Validierung zwischen Agent-Handoffs

## Wann NICHT verwenden

- Single-Agent-Workflows (keine Orchestration erforderlich)
- Ereignisgesteuerte Systeme ohne zentralisierte Koordination
- Systeme, bei denen Agenten vollständig autonom sind (kein Supervisor)

## Anleitung

### Supervisor-Verantwortungen

Der Supervisor-Agent ist Eigentümer von:

1. **Task-Planung:** Benutzeranfrage in Untertasks zerlegen
2. **Agent-Delegierung:** Untertasks bestimmten Agenten zuweisen
3. **Zustandsverwaltung:** Workflow-Zustand und Fortschritt beibehalten
4. **Quality Gates:** Ausgaben der Agenten validieren, bevor fortgefahren wird
5. **Fehlerbehandlung:** Fehlerhafte Agenten erneut versuchen, ungelöste Probleme eskalieren
6. **Ressourcendurchsetzung:** Budgets verfolgen und durchsetzen (Tokens, Latenz, Kosten)
7. **Ergebnissammlung:** Ausgaben von Agenten sammeln und Endergebnis erzeugen

### System-Prompt-Template

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

### Task-Dekomposition

```python
def decompose_task(user_request: str) -> list:
    """
    Verwenden Sie den Supervisor-Agenten, um eine Task in Untertasks zu zerlegen.
    Rückgabe einer Liste von Untertasks mit Agent-Zuweisungen.
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
    
    # Antwort analysieren, um Untertasks zu extrahieren
    # Antwort sollte JSON wie folgt sein:
    # [
    #   {"subtask_id": "st_1", "description": "...", "agent": "researcher", "input": {...}},
    #   {"subtask_id": "st_2", "description": "...", "agent": "analyst", "input": {...}}
    # ]
    
    import json
    subtasks = json.loads(response.content[0].text)
    return subtasks
```

### Agent-Delegierung

```python
def delegate_to_agent(subtask: dict, agent_name: str) -> dict:
    """
    Untertask zu einem spezifischen Agenten delegieren.
    Rückgabe der Ausgabe des Agenten.
    """
    # In Claude Code, einen Untersuchungsagenten erzeugen
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

### Quality Gate Validierung

```python
def validate_agent_output(output: dict, expected_schema: dict) -> bool:
    """
    Validieren Sie, dass die Ausgabe des Agenten dem erwarteten Schema entspricht.
    Rückgabe True, wenn gültig, False andernfalls.
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
    Checkpoint zur Validierung der Ausgabe des Agenten, bevor fortgefahren wird.
    """
    if validate_agent_output(agent_output, expected_schema):
        print(f"✓ Subtask {subtask_id} passed quality gate")
        return True
    else:
        print(f"✗ Subtask {subtask_id} failed validation")
        return False
```

### Retry mit exponentiellem Backoff

```python
import asyncio

async def delegate_with_retry(subtask, agent_name, max_retries=3):
    """
    Mit automatischem Retry bei Fehler delegieren.
    Verwendet exponentielles Backoff: 1s, 2s, 4s
    """
    for attempt in range(max_retries):
        try:
            result = delegate_to_agent(subtask, agent_name)
            
            if result['status'] == 'success':
                return result
            else:
                # Agent hat einen Fehler zurückgegeben
                print(f"Agent {agent_name} failed: {result.get('error')}")
                
                if attempt < max_retries - 1:
                    wait_time = 2 ** attempt  # exponentielles Backoff
                    print(f"Retrying in {wait_time}s...")
                    await asyncio.sleep(wait_time)
        
        except Exception as e:
            print(f"Exception on attempt {attempt + 1}: {e}")
            if attempt == max_retries - 1:
                raise
    
    # Alle Retries erschöpft
    raise RuntimeError(f"Agent {agent_name} failed after {max_retries} attempts")
```

### Ressourcendurchsetzung

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

### Orchestrierungs-Schleife

```python
async def supervise_workflow(user_request: str):
    """
    Hauptorchestrier ungsmodi für Supervisor-Agenten.
    """
    budget = ResourceBudget()
    
    # Schritt 1: Task zerlegen
    subtasks = decompose_task(user_request)
    print(f"Decomposed into {len(subtasks)} subtasks")
    
    results = {}
    
    # Schritt 2: Untertasks ausführen
    for subtask in subtasks:
        try:
            # Mit Retry delegieren
            result = await delegate_with_retry(
                subtask,
                agent_name=subtask['agent'],
                max_retries=3
            )
            
            # Ausgabe validieren
            if not quality_gate_checkpoint(result['output'], subtask.get('expected_schema'), subtask['subtask_id']):
                # Validierung ist fehlgeschlagen; Agent erneut versuchen
                print(f"Retrying {subtask['subtask_id']} due to validation failure")
                result = await delegate_with_retry(subtask, subtask['agent'], max_retries=2)
            
            # Ressourcen verfolgen
            budget.record_agent_call(result)
            budget.check_budget()
            
            results[subtask['subtask_id']] = result
            
        except Exception as e:
            # Zum Menschen eskalieren
            print(f"Escalating {subtask['subtask_id']}: {e}")
            results[subtask['subtask_id']] = {
                'status': 'escalated',
                'error': str(e)
            }
    
    # Schritt 3: Endergebnis zusammenstellen
    final_result = assemble_results(results)
    
    print(f"Workflow completed. Budget report: {budget.get_budget_report()}")
    return final_result
```

### Beispiel: Supervisor verwaltet Recherche-Workflow

```python
# Der Supervisor zerlegt die Anfrage
user_request = "Write a report on Quantum Computing in 2026"

# Generierte Untertasks:
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

# Der Supervisor delegiert und validiert
# Wenn eine Untertask > 3 Mal fehlschlägt, eskaliert
# Wenn eine Untertask das Budget überschreitet, stoppt den Workflow
# Rückgabe des Enderberichts
```

---
