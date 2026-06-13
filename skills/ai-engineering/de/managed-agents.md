# Managed Agents

## Wann aktivieren
Beim Aufbau von Anwendungen, bei denen Agents autonom in der Cloud ausgeführt werden müssen, oder wenn der Nutzer Claude Managed Agents, langwierige Agent-Aufgaben oder den Aufbau von Agent-gestützten Produkten über die Anthropic-API erwähnt.

## Wann NICHT verwenden
- Claude-Code-Subagents, die in einer Terminal-Sitzung ausgeführt werden — diese verwenden das `Task`-Tool, nicht diese API
- Kurze synchrone Anfragen, die in weniger als 10 Sekunden abgeschlossen werden — verwenden Sie stattdessen die Standard-Messages-API
- Workflows, die Zero Data Retention (ZDR) oder HIPAA BAA erfordern — Managed Agents sind nicht berechtigt

## Anweisungen

### Kernkonzepte
- **Agent:** eine konfigurierte Entität mit einem Modell, einem Systemprompt und einem zulässigen Tool-Satz
- **Umgebung:** ein Compute-Sandbox, in dem der Agent ausgeführt wird (Cloud-gehostet von Anthropic oder selbstgehostet)
- **Sitzung:** eine Ausführungsausführung — hat einen Start, ein Ende und einen Event-Stream
- **Events:** Server-Sent Events (SSE) Stream, der meldet, was der Agent in Echtzeit tut

**Wichtiger Unterschied zu Claude-Code-Subagents:** Managed Agents werden unabhängig von Ihrem Terminal in Anthropic's Cloud ausgeführt. Verwenden Sie sie für async, langwierige oder API-gesteuerte Agent-Produkte — nicht für Claude-Code-Schrägstrich-Befehle.

### Beta-Header
Alle Managed-Agents-API-Aufrufe erfordern:
```
anthropic-beta: managed-agents-2026-04-01
```

### Tool-Typ
Um einem Agent Zugriff auf alle eingebauten Tools (Bash, Dateivorgänge, Web-Suche, Web-Abruf, MCP) zu geben:
```python
tools=[{"type": "agent_toolset_20260401"}]
```

### Python-Pattern
```python
import anthropic

client = anthropic.Anthropic()

# 1. Create the agent (do once; reuse agent_id)
agent = client.beta.agents.create(
    model="claude-opus-4-5",
    name="research-agent",
    system="You are a research agent. When given a topic, search the web, gather facts, and produce a structured summary.",
    tools=[{"type": "agent_toolset_20260401"}],
)

# 2. Create an environment (cloud sandbox)
env = client.beta.environments.create(type="cloud")

# 3. Create a session and stream events
with client.beta.sessions.stream(
    agent_id=agent.id,
    environment_id=env.id,
    input="Research the latest developments in quantum computing and summarize in 3 bullet points.",
) as stream:
    for event in stream:
        if event.type == "agent.message":
            print(event.data.text, end="", flush=True)
        elif event.type == "agent.tool_use":
            print(f"\n[Tool: {event.data.name}]")
        elif event.type == "session.status_idle":
            print("\n[Session complete]")
            break
```

### Event-Typen
| Event | Meaning |
|---|---|
| `agent.message` | Agent produziert Ausgabetext |
| `agent.tool_use` | Agent ruft ein Tool auf — `data.name` ist der Tool-Name |
| `agent.tool_result` | Ergebnis, das von einem Tool-Aufruf zurückkommt |
| `session.status_idle` | Agent hat fertig und wartet |
| `session.status_error` | Sitzung endete mit einem Fehler |

### Async Session (Fire and Poll)
Für Workloads, bei denen Sie keine offene Verbindung halten möchten:
```python
# Start session without streaming
session = client.beta.sessions.create(
    agent_id=agent.id,
    environment_id=env.id,
    input="Analyze these 50 documents and extract action items.",
)
session_id = session.id

# Poll status later
import time
while True:
    session = client.beta.sessions.retrieve(session_id)
    if session.status in ("idle", "error"):
        break
    time.sleep(10)

# Retrieve output
output = client.beta.sessions.retrieve(session_id)
print(output.output)
```

### Rate Limits
| Operation | Limit |
|---|---|
| Sitzung erstellen | 300 RPM |
| Sitzung lesen / streamen | 600 RPM |

### Testen mit der `ant`-CLI
```bash
# Install
npm install -g @anthropic-ai/ant

# Test an agent interactively
ant run --agent-id <id> --environment cloud

# Run with a specific input
ant run --agent-id <id> --input "Summarize today's AI news"
```

### Agent-Lebenszyklusverwaltung
- Agents sind persistente Konfigurationen — einmal erstellen, über viele Sitzungen hinweg wiederverwenden
- Umgebungen sind Pro-Run-Compute-Sandboxes — erstellen Sie für jede Sitzung eine neue zur Isolation
- Sitzungen sind kurzlebig — speichern Sie die Ausgabe, bevor die Sitzung abläuft
- Speichern Sie `agent_id` in Ihrer Anwendungskonfiguration; speichern Sie die Sitzungsausgabe in Ihrer Datenbank

### Wann sollte Cloud vs Self-Hosted-Umgebung verwendet werden
- **Cloud (`type: "cloud"`):** schnellster Start, keine Infrastruktur, geeignet für die meisten Use Cases
- **Self-hosted:** wenn der Agent Zugriff auf interne Netzwerk-Ressourcen, private Datenspeicher oder benutzerdefinierte Tool-Server benötigt, die von Anthropic's Cloud nicht erreichbar sind

## Beispiel

Ein Produkt, das Nutzern ermöglicht, Forschungsaufgaben asynchron über ein Web-Formular einzureichen:

1. Nutzer reicht ein: "Find the top 5 competitors to our product and summarize their pricing"
2. App erstellt eine Sitzung mit `type: "cloud"`-Umgebung — speichert `session_id` in der Job-Queue
3. App gibt sofort zurück: "Your research report will be ready in ~10 minutes"
4. Background-Worker fragt Sitzungsstatus alle 30 Sekunden ab
5. Wenn `session.status == "idle"`, ruft Worker `session.output` ab und sendet dem Nutzer eine E-Mail
6. Nutzer erhält eine strukturierte 5-Konkurrenten-Analyse mit Preis-Tabellen

Die gesamte Agent-Ausführung — Web-Suchen, Datenextraktion, Synthese — findet in Anthropic's Cloud ohne Infrastruktur-Management statt.

---
