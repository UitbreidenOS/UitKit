# Managed Agents

## Wanneer activeren
Bouwen van applicaties waarbij agents autonoom in cloud moeten draaien, of wanneer gebruiker Claude Managed Agents noemt, long-running agent taken, of agent-powered producten bouwen via Anthropic API.

## Wanneer NIET gebruiken
- Claude Code subagents draaiend in terminal sessie — die gebruiken `Task` tool, niet deze API
- Korte synchrone requests compleet in minder dan 10 seconden — gebruik standaard Messages API
- Workflows vereisend Zero Data Retention (ZDR) of HIPAA BAA — Managed Agents zijn niet eligible

## Instructies

### Core Concepts
- **Agent:** een geconfigureerde entiteit met model, system prompt, en allowed tool set
- **Environment:** compute sandbox waar agent draait (cloud-hosted door Anthropic, of self-hosted)
- **Session:** één execution run — heeft start, einde, en event stream
- **Events:** Server-Sent Events (SSE) stream rapporterend wat agent doet in real time

**Key onderscheid van Claude Code subagents:** Managed Agents draaien onafhankelijk van jouw terminal in Anthropic cloud. Gebruik voor async, long-running, of API-driven agent producten — niet voor Claude Code slash commands.

### Beta Header
Alle Managed Agents API calls vereisen:
```
anthropic-beta: managed-agents-2026-04-01
```

### Tool Type
Om agent toegang te geven tot alle built-in tools (Bash, file operations, web search, web fetch, MCP):
```python
tools=[{"type": "agent_toolset_20260401"}]
```

### Python Pattern
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

### Event Types
| Event | Meaning |
|---|---|
| `agent.message` | Agent producing output text |
| `agent.tool_use` | Agent calling a tool — `data.name` is the tool name |
| `agent.tool_result` | Result returned from a tool call |
| `session.status_idle` | Agent has finished and is waiting |
| `session.status_error` | Session ended with an error |

### Async Session (Fire and Poll)
Voor workloads waarbij je geen connection open wilt houden:
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
| Create session | 300 RPM |
| Read session / stream | 600 RPM |

### Testing with the `ant` CLI
```bash
# Install
npm install -g @anthropic-ai/ant

# Test an agent interactively
ant run --agent-id <id> --environment cloud

# Run with a specific input
ant run --agent-id <id> --input "Summarize today's AI news"
```

### Agent Lifecycle Management
- Agents zijn persistent configurations — create eenmaal, reuse over vele sessions
- Environments zijn per-run compute sandboxes — create nieuwe per session voor isolation
- Sessions zijn ephemeral — sla output op voordat session expire
- Sla `agent_id` op in jouw applicatie config; sla session output op in jouw database

### When to Use Cloud vs Self-Hosted Environment
- **Cloud (`type: "cloud"`):** snelste start, geen infrastructure, geschikt voor meeste use cases
- **Self-hosted:** wanneer agent toegang nodig heeft tot interne network resources, private data stores, of custom tool servers niet bereikbaar vanuit Anthropic cloud

## Voorbeeld

Een product dat users research taken asynchroon kunnen submitten via web form:

1. User submitteert: "Find the top 5 competitors to our product and summarize their pricing"
2. App creëert session met `type: "cloud"` environment — sla `session_id` op in job queue
3. App retourneert direct: "Your research report will be ready in ~10 minutes"
4. Background worker pollt session status elke 30 seconden
5. Wanneer `session.status == "idle"`, worker haalt `session.output` op en stuurt user email
6. User ontvangt structured 5-competitor analyse met pricing tables

De gehele agent run — web searches, data extraction, synthesis — gebeurt in Anthropic cloud zonder infrastructure management.

---
