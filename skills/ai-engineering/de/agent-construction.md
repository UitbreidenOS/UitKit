> 🇩🇪 Dies ist die deutsche Übersetzung. [Englische Version](../agent-construction.md).

# Agent Construction Skill

## Wann aktivieren
- Ein Multi-Agent-System mit Claude entwerfen (Orchestrator + Subagenten)
- Einen Claude-gestützten Agenten bauen, der Tools über mehrere Turns verwendet
- Speicher für einen langlebigen Agenten entwerfen (In-Kontext vs. extern)
- Agentenfehler, Wiederholungen und Abbruchbedingungen behandeln
- Agenten-Handoffs zwischen spezialisierten Subagenten implementieren

## Wann NICHT verwenden
- Einzelne Claude API-Aufrufe — der Claude API Skill reicht aus
- Einfache Chatbots ohne Tool Use oder autonome Entscheidungsfindung
- LangChain/LlamaIndex-Abstraktionen — die Abstraktionsebene direkt ansprechen

## Anweisungen

### Agenten-Architekturmuster

**Einzelner Agent mit Tools** — eine Claude-Instanz, mehrere Tools, Schleife bis Aufgabe erledigt:
```
User → Agent → [Tool A] → [Tool B] → Agent → User
```

**Orchestrator + Subagenten** — ein Elternteil spawnt spezialisierte Kinder:
```
User → Orchestrator → [ResearchAgent] → [WriterAgent] → Orchestrator → User
```

**Pipeline** — Agenten geben Ergebnisse der Reihe nach weiter:
```
User → Agent1(classify) → Agent2(extract) → Agent3(generate) → User
```

Die einfachste Architektur wählen, die das Problem löst. Einzelner Agent mit Tools löst die meisten Fälle.

### Tool-Design
```python
# Tool-Definitionen für Multi-Turn-Agenten-Schleife
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

Tool-Design-Regeln:
- Die Beschreibung muss Claude mitteilen, WANN es verwendet werden soll, nicht nur was es tut
- `input_schema` minimal halten — nur erforderliche Felder, kein optionaler Lärm
- Strukturierte Daten zurückgeben (JSON), keine Prosa, damit Claude sie zuverlässig verwenden kann
- Ein Tool pro Aktion — Lesen+Schreiben nicht in ein Tool bündeln

### Agenten-Schleife
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
        
        # Antwort des Assistenten anhängen
        messages.append({"role": "assistant", "content": response.content})
        
        if response.stop_reason == "end_turn":
            # Finale Textantwort extrahieren
            return next(b.text for b in response.content if hasattr(b, "text"))
        
        if response.stop_reason == "tool_use":
            # Alle Tool-Aufrufe in dieser Antwort ausführen
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
            # Unerwarteter Stopp-Grund
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

### System-Prompt für Agenten
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

### Speichermuster

**In-Kontext-Speicher** (Nachrichten-Array) — für einzelne Sitzung, kleinen State:
```python
# Zusammenfassen wenn Kontext zu groß wird
if count_tokens(messages) > 150_000:
    summary = summarize_messages(messages[:-5])  # letzte 5 Turns behalten
    messages = [
        {"role": "user", "content": f"[Previous context summary]\n{summary}"},
        {"role": "assistant", "content": "Understood. Continuing from where we left off."},
        *messages[-5:]
    ]
```

**Externer Speicher** (für Multi-Session-Agenten):
```python
# Einfacher dateibasierter Speicher
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

### Orchestrator-Muster
```python
def orchestrate(task: str) -> str:
    # Schritt 1: Planungs-Agent zerlegt die Aufgabe
    plan = run_subagent(
        model="claude-sonnet-4-6",
        system="You are a planner. Decompose tasks into numbered steps.",
        task=f"Decompose this task into steps: {task}",
        tools=[]  # Keine Tools für die Planung benötigt
    )

    # Schritt 2: Jeden Schritt mit spezialisierten Agenten ausführen
    results = []
    for step in parse_steps(plan):
        agent_type = classify_step(step)  # "research" | "code" | "write"
        result = run_subagent(
            model=agent_model(agent_type),
            system=agent_system_prompt(agent_type),
            task=step,
            tools=agent_tools(agent_type),
            context="\n".join(results)  # Kontext aus vorherigen Schritten mitgeben
        )
        results.append(f"Step result: {result}")

    # Schritt 3: Synthese-Agent kombiniert Ergebnisse
    return run_subagent(
        model="claude-sonnet-4-6",
        system="You are a synthesizer. Combine step results into a final answer.",
        task=f"Original task: {task}\n\nStep results:\n" + "\n".join(results),
        tools=[]
    )
```

### Fehlerbehandlung und Abbruchbedingungen
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

### Handoff-Muster
```python
# Eltern-Agent übergibt Kontext explizit — Subagenten haben keinen Session-Speicher
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

## Beispiel

**Benutzer:** Einen Recherche-Agenten bauen, der ein Thema annimmt, das Web nach 3 Quellen durchsucht, jede URL liest und eine 500-Wörter-Zusammenfassung mit Zitaten in eine Datei schreibt.

**Erwartete Ausgabe:**
- `tools`-Liste: `search_web`, `fetch_url`, `write_file`
- System-Prompt: weist Agenten an, zu suchen → 3 URLs abrufen → synthetisieren → Datei schreiben, bevor fertig erklärt wird
- `run_agent(task)`-Schleife mit `max_iterations=15`
- Fehlerbehandlung: wenn `fetch_url` scheitert, nächstes Suchergebnis versuchen
- Finale Ausgabe: Pfad zur geschriebenen Zusammenfassungsdatei

---
