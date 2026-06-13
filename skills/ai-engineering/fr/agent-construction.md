> 🇫🇷 This is the French translation. [English version](../agent-construction.md).

# Compétence Construction d'Agents

## Quand activer
- Concevoir un système multi-agents avec Claude (orchestrateur + sous-agents)
- Construire un agent alimenté par Claude qui utilise des outils sur plusieurs tours
- Concevoir la mémoire pour un agent long-running (en contexte vs. externe)
- Gérer les erreurs, les réessais et les conditions d'arrêt des agents
- Implémenter les transferts d'agent entre sous-agents spécialisés

## Quand NE PAS utiliser
- Appels API Claude à tour unique — la compétence API Claude est suffisante
- Chatbots simples sans utilisation d'outils ou prise de décision autonome
- Abstractions LangChain/LlamaIndex — adresser la couche d'abstraction directement

## Instructions

### Patterns d'architecture d'agent

**Agent unique avec outils** — une instance Claude, plusieurs outils, boucle jusqu'à l'achèvement de la tâche :
```
User → Agent → [Tool A] → [Tool B] → Agent → User
```

**Orchestrateur + sous-agents** — un parent crée des enfants spécialisés :
```
User → Orchestrator → [ResearchAgent] → [WriterAgent] → Orchestrator → User
```

**Pipeline** — les agents transmettent les résultats en séquence :
```
User → Agent1(classify) → Agent2(extract) → Agent3(generate) → User
```

Choisir l'architecture la plus simple qui résout le problème. Un agent unique avec des outils gère la plupart des cas.

### Conception des outils
```python
# Définitions d'outils pour la boucle d'agent multi-tours
tools = [
    {
        "name": "search_web",
        "description": "Search the web for current information. Use when you need facts not in your training data.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Search query"}
            },
            "required": ["query"]
        }
    },
    {
        "name": "read_file",
        "description": "Read contents of a file by path.",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {"type": "string", "description": "Absolute file path"}
            },
            "required": ["path"]
        }
    },
    {
        "name": "write_file",
        "description": "Write content to a file. Creates the file if it doesn't exist.",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {"type": "string"},
                "content": {"type": "string"}
            },
            "required": ["path", "content"]
        }
    }
]
```

Règles de conception des outils :
- La description doit dire à Claude QUAND l'utiliser, pas seulement ce qu'il fait
- Garder `input_schema` minimal — uniquement les champs requis, pas de bruit optionnel
- Retourner des données structurées (JSON), pas de prose, pour que Claude puisse les utiliser de façon fiable
- Un outil par action — ne pas regrouper lecture+écriture dans un seul outil

### Boucle d'agent
```python
import anthropic
import json

client = anthropic.Anthropic()

def run_agent(task: str, max_iterations: int = 20) -> str:
    messages = [{"role": "user", "content": task}]
    
    for iteration in range(max_iterations):
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=4096,
            system=AGENT_SYSTEM_PROMPT,
            tools=tools,
            messages=messages,
        )
        
        # Ajouter la réponse de l'assistant
        messages.append({"role": "assistant", "content": response.content})
        
        if response.stop_reason == "end_turn":
            # Extraire la réponse textuelle finale
            return next(b.text for b in response.content if hasattr(b, "text"))
        
        if response.stop_reason == "tool_use":
            # Exécuter tous les appels d'outils dans cette réponse
            tool_results = []
            for block in response.content:
                if block.type == "tool_use":
                    result = execute_tool(block.name, block.input)
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": json.dumps(result) if not isinstance(result, str) else result
                    })
            
            messages.append({"role": "user", "content": tool_results})
        else:
            # Raison d'arrêt inattendue
            break
    
    raise RuntimeError(f"Agent exceeded {max_iterations} iterations without completing")


def execute_tool(name: str, inputs: dict) -> any:
    match name:
        case "search_web":
            return search(inputs["query"])
        case "read_file":
            return Path(inputs["path"]).read_text()
        case "write_file":
            Path(inputs["path"]).write_text(inputs["content"])
            return {"success": True, "path": inputs["path"]}
        case _:
            return {"error": f"Unknown tool: {name}"}
```

### System prompt pour les agents
```
AGENT_SYSTEM_PROMPT = """You are an autonomous agent completing tasks step by step.

Approach:
1. Analyze the task before acting
2. Use the minimum tools necessary
3. Check your work before declaring done
4. If a tool returns an error, diagnose and retry once — if it fails again, report the error

Stopping conditions — declare "DONE: <result>" when:
- The task is fully complete
- You've hit an unrecoverable error after retrying
- You've been asked to do something harmful or impossible

Never loop more than 3 times on the same tool call with the same inputs.
"""
```

### Patterns de mémoire

**Mémoire en contexte** (tableau de messages) — pour une seule session, petit état :
```python
# Résumer quand le contexte devient trop grand
if count_tokens(messages) > 150_000:
    summary = summarize_messages(messages[:-5])  # garder les 5 derniers tours
    messages = [
        {"role": "user", "content": f"[Previous context summary]\n{summary}"},
        {"role": "assistant", "content": "Understood. Continuing from where we left off."},
        *messages[-5:]
    ]
```

**Mémoire externe** (pour les agents multi-sessions) :
```python
# Mémoire simple basée sur des fichiers
class AgentMemory:
    def __init__(self, path: str):
        self.path = Path(path)
        self.data = json.loads(self.path.read_text()) if self.path.exists() else {}

    def remember(self, key: str, value: any):
        self.data[key] = {"value": value, "timestamp": datetime.utcnow().isoformat()}
        self.path.write_text(json.dumps(self.data, indent=2))

    def recall(self, key: str) -> any:
        entry = self.data.get(key)
        return entry["value"] if entry else None

    def as_context(self) -> str:
        if not self.data:
            return ""
        lines = [f"- {k}: {v['value']}" for k, v in self.data.items()]
        return "Known context:\n" + "\n".join(lines)
```

### Pattern d'orchestration
```python
def orchestrate(task: str) -> str:
    # Étape 1 : L'agent de planification décompose la tâche
    plan = run_subagent(
        model="claude-sonnet-4-6",
        system="You are a planner. Decompose tasks into numbered steps.",
        task=f"Decompose this task into steps: {task}",
        tools=[]  # Pas d'outils nécessaires pour la planification
    )

    # Étape 2 : Exécuter chaque étape avec des agents spécialisés
    results = []
    for step in parse_steps(plan):
        agent_type = classify_step(step)  # "research" | "code" | "write"
        result = run_subagent(
            model=agent_model(agent_type),
            system=agent_system_prompt(agent_type),
            task=step,
            tools=agent_tools(agent_type),
            context="\n".join(results)  # Donner le contexte des étapes précédentes
        )
        results.append(f"Step result: {result}")

    # Étape 3 : L'agent de synthèse combine les résultats
    return run_subagent(
        model="claude-sonnet-4-6",
        system="You are a synthesizer. Combine step results into a final answer.",
        task=f"Original task: {task}\n\nStep results:\n" + "\n".join(results),
        tools=[]
    )
```

### Gestion des erreurs et conditions d'arrêt
```python
class AgentError(Exception):
    pass

class MaxIterationsError(AgentError):
    pass

class ToolFailureError(AgentError):
    pass

def execute_tool_safe(name: str, inputs: dict, consecutive_failures: dict) -> dict:
    try:
        result = execute_tool(name, inputs)
        consecutive_failures[name] = 0
        return {"success": True, "result": result}
    except Exception as e:
        consecutive_failures[name] = consecutive_failures.get(name, 0) + 1
        if consecutive_failures[name] >= 3:
            raise ToolFailureError(f"Tool {name} failed 3 consecutive times: {e}")
        return {"success": False, "error": str(e), "retry": True}
```

### Pattern de transfert
```python
# L'agent parent passe le contexte explicitement — les sous-agents n'ont pas de mémoire de session
def handoff_to_specialist(context: dict, task: str, specialist: str) -> str:
    handoff_prompt = f"""
Context from orchestrator:
{json.dumps(context, indent=2)}

Your task:
{task}
"""
    return run_subagent(
        system=SPECIALIST_PROMPTS[specialist],
        task=handoff_prompt,
        tools=SPECIALIST_TOOLS[specialist]
    )
```

## Exemple

**Utilisateur :** Construire un agent de recherche qui prend un sujet, recherche sur le web 3 sources, lit chaque URL et rédige un résumé de 500 mots avec citations dans un fichier.

**Sortie attendue :**
- Liste `tools` : `search_web`, `fetch_url`, `write_file`
- System prompt : demande à l'agent de chercher → récupérer 3 URLs → synthétiser → écrire le fichier avant de déclarer terminé
- Boucle `run_agent(task)` avec `max_iterations=15`
- Gestion des erreurs : si `fetch_url` échoue, essayer le prochain résultat de recherche
- Sortie finale : chemin vers le fichier de résumé écrit

---
