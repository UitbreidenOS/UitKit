> 🇳🇱 Dit is de Nederlandse vertaling. [Engelse versie](../agent-construction.md).

# Agent Construction Skill

## Wanneer te activeren
- Een multi-agent systeem ontwerpen met Claude (orchestrator + subagenten)
- Een Claude-aangedreven agent bouwen die tools gebruikt over meerdere beurten
- Geheugen ontwerpen voor een langlopende agent (in-context vs. extern)
- Agentfouten, herhaalpogingen en stopomstandigheden afhandelen
- Agent-overdrachten implementeren tussen gespecialiseerde subagenten

## Wanneer NIET te gebruiken
- Enkelvoudige Claude API-aanroepen — de Claude API skill is voldoende
- Eenvoudige chatbots zonder toolgebruik of autonome besluitvorming
- LangChain/LlamaIndex-abstracties — adresseer de abstractielaag direct

## Instructies

### Agent-architectuurpatronen

**Enkele agent met tools** — één Claude-instantie, meerdere tools, loopt totdat taak is voltooid:
```
Gebruiker → Agent → [Tool A] → [Tool B] → Agent → Gebruiker
```

**Orchestrator + subagenten** — één ouder verwekt gespecialiseerde kinderen:
```
Gebruiker → Orchestrator → [ResearchAgent] → [WriterAgent] → Orchestrator → Gebruiker
```

**Pipeline** — agenten geven resultaten door in volgorde:
```
Gebruiker → Agent1(classificeer) → Agent2(extraheer) → Agent3(genereer) → Gebruiker
```

Kies de eenvoudigste architectuur die het probleem oplost. Enkele agent met tools handelt de meeste gevallen af.

### Tool-ontwerp
```python
# Tool-definities voor multi-beurt agent-loop
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

Tool-ontwerpregels:
- Beschrijving moet Claude vertellen WANNEER het te gebruiken, niet alleen wat het doet
- Houd `input_schema` minimaal — alleen vereiste velden, geen optionele ruis
- Retourneer gestructureerde data (JSON), geen proza, zodat Claude het betrouwbaar kan gebruiken
- Één tool per actie — bundel lezen+schrijven niet in één tool

### Agent-loop
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
        
        # Voeg het antwoord van de assistent toe
        messages.append({"role": "assistant", "content": response.content})
        
        if response.stop_reason == "end_turn":
            # Extraheer definitief tekstantwoord
            return next(b.text for b in response.content if hasattr(b, "text"))
        
        if response.stop_reason == "tool_use":
            # Voer alle tool-aanroepen in dit antwoord uit
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
            # Onverwachte stopreden
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

### Systeemprompt voor agenten
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

### Geheugenpatronen

**In-context geheugen** (berichtarray) — voor enkele sessie, kleine state:
```python
# Samenvatten wanneer context te groot wordt
if count_tokens(messages) > 150_000:
    summary = summarize_messages(messages[:-5])  # bewaar laatste 5 beurten
    messages = [
        {"role": "user", "content": f"[Previous context summary]\n{summary}"},
        {"role": "assistant", "content": "Understood. Continuing from where we left off."},
        *messages[-5:]
    ]
```

**Extern geheugen** (voor multi-sessie agenten):
```python
# Eenvoudig bestandsgebaseerd geheugen
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

### Orchestratorpatroon
```python
def orchestrate(task: str) -> str:
    # Stap 1: Planning-agent decomponeert de taak
    plan = run_subagent(
        model="claude-sonnet-4-6",
        system="You are a planner. Decompose tasks into numbered steps.",
        task=f"Decompose this task into steps: {task}",
        tools=[]  # Geen tools nodig voor planning
    )

    # Stap 2: Voer elke stap uit met gespecialiseerde agenten
    results = []
    for step in parse_steps(plan):
        agent_type = classify_step(step)  # "research" | "code" | "write"
        result = run_subagent(
            model=agent_model(agent_type),
            system=agent_system_prompt(agent_type),
            task=step,
            tools=agent_tools(agent_type),
            context="\n".join(results)  # Geef context van vorige stappen
        )
        results.append(f"Step result: {result}")

    # Stap 3: Synthese-agent combineert resultaten
    return run_subagent(
        model="claude-sonnet-4-6",
        system="You are a synthesizer. Combine step results into a final answer.",
        task=f"Original task: {task}\n\nStep results:\n" + "\n".join(results),
        tools=[]
    )
```

### Foutafhandeling en stopomstandigheden
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

### Overdrachtspatroon
```python
# Ouderagent geeft context expliciet door — subagenten hebben geen sessieheugen
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

## Voorbeeld

**Gebruiker:** Bouw een onderzoeksagent die een onderwerp neemt, het web doorzoekt op 3 bronnen, elke URL leest en een samenvatting van 500 woorden met citaten naar een bestand schrijft.

**Verwachte output:**
- `tools`-lijst: `search_web`, `fetch_url`, `write_file`
- Systeemprompt: instrueert agent om te zoeken → 3 URL's op te halen → samen te vatten → bestand te schrijven voor klaar te melden
- `run_agent(task)`-loop met `max_iterations=15`
- Foutafhandeling: als `fetch_url` mislukt, probeer volgend zoekresultaat
- Definitieve output: pad naar het geschreven samenvattingsbestand

---
