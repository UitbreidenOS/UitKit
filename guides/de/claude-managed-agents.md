# Claude verwaltete Agenten

Managed Agents ist Anthropics in der Cloud gehostete Agent-Laufzeit, zugänglich über die Anthropic API. Sie definieren einen Agenten — sein Modell, Systemeingabe und Tools — und Anthropic kümmert sich um die Infrastruktur: Compute-Sandboxes, Ausführungsschleifen, Netzwerk und Session-Lebenszyklus. Sie interagieren damit über das Standard-Anthropic SDK oder die `ant` CLI.

Dies unterscheidet sich von Claude Code Subagenten. Subagenten werden in Ihrer lokalen Claude Code-Session ausgeführt. Managed Agents werden in Anthropics Cloud ausgeführt, unabhängig von Ihrem Terminal, und können programmgesteuert aus Ihrem eigenen Produkt ausgelöst werden.

---

## Vier Kernkonzepte

**Agent** — Das Modell, die Systemeingabe und die Tool-Konfiguration. Definiert, was der Agent ist und was er kann. Einmal erstellt, mehrfach in Sessions wiederverwendet.

**Umgebung** — Die Compute-Sandbox, in der der Agent ausgeführt wird. Kann cloud-gehostet (von Anthropic verwaltet) oder selbst gehostet sein. Umgebungen bleiben über Sessions hinweg erhalten, wenn sie entsprechend konfiguriert sind — sie können Zustand, Dateien und installierte Pakete enthalten.

**Session** — Eine einzelne Ausführungslauf: ein Agent in einer Umgebung, ausgelöst durch eine initiale Nachricht. Sessions erzeugen einen Strom von Events. Eine Session endet, wenn der Agent stoppt oder einen Fehler wirft.

**Events** — Server-gesendete Events (SSE), die während einer Session ausgegeben werden. Event-Typen umfassen `agent.message` (Textausgabe), `agent.tool_use` (Tool-Aufrufe), `agent.tool_result` (Tool-Ausgaben) und `agent.done` (Session-Ende). Ihre Anwendung verbraucht diesen Stream.

---

## Anforderungen und Verfügbarkeit

**Beta-Header:** Die API ist in Beta. Alle Anfragen benötigen den Header `anthropic-beta: managed-agents-2026-04-01`. Python- und TypeScript-SDKs setzen dies automatisch, wenn Sie den `client.beta.agents` Namespace verwenden.

**Tool-Typ:** Um einem Agenten den vollständigen integrierten Tool-Satz (Bash, Dateivorgänge, Websuche, Web-Fetch, MCP-Server) zu geben, schließen Sie diese Tool-Konfiguration ein:

```json
{ "type": "agent_toolset_20260401" }
```

**Nicht berechtigt für:** Zero Data Retention oder HIPAA BAA. Verwenden Sie Managed Agents nicht für Gesundheitsdaten oder Workloads, die ZDR erfordern.

**Rate Limits:** 300 RPM für Erstellvorgänge, 600 RPM für Lesevorgänge.

**SDK-Unterstützung:** Python, TypeScript, Java, Go, C#, Ruby, PHP.

---

## Umgebungstypen

```python
# Cloud-verwaltet — Anthropic stellt das Compute zur Verfügung
# networking.type: "unrestricted" (vollständiges Internet) oder "none" (isoliert)
config = {"type": "cloud", "networking": {"type": "unrestricted"}}

# Selbst gehostet — Sie stellen die Sandbox zur Verfügung
config = {"type": "self_hosted", "url": "https://your-sandbox.example.com"}
```

Verwenden Sie `unrestricted` Netzwerk, wenn der Agent URLs abrufen, externe APIs aufrufen oder Repos klonen muss. Verwenden Sie `none` für isolierte Code-Ausführung oder Analysaufgaben, bei denen Netzwerkzugriff ein Nachteil wäre.

---

## Python SDK

### Installation

```bash
pip install anthropic
```

### Vollständiges Beispiel

```python
import anthropic

client = anthropic.Anthropic()

# 1. Erstellen Sie den Agenten (tun Sie dies einmal — wiederverwenden Sie die ID)
agent = client.beta.agents.create(
    name="code-reviewer",
    model="claude-opus-4-7",
    tools=[{"type": "agent_toolset_20260401"}],
    system="You are a senior engineer. Review code for correctness, performance, and security. Be specific — cite line numbers and explain your reasoning."
)

# 2. Erstellen Sie die Umgebung
environment = client.beta.environments.create(
    name="review-env",
    config={"type": "cloud", "networking": {"type": "none"}}
)

# 3. Starten Sie eine Session
session = client.beta.sessions.create(
    agent=agent.id,
    environment_id=environment.id,
    initial_message="Clone https://github.com/my-org/my-repo and review the auth module for security issues."
)

# 4. Stream-Events
with client.beta.sessions.events.stream(session.id) as stream:
    for event in stream:
        if event.type == "agent.message":
            print(event.content, end="", flush=True)
        elif event.type == "agent.tool_use":
            print(f"\n[tool: {event.name}]")
        elif event.type == "agent.done":
            print(f"\n[session complete — status: {event.status}]")
```

### Wiederverwenden von Agenten und Umgebungen

Agenten- und Umgebungserstellung sind absichtlich von der Session-Erstellung getrennt. Erstellen Sie den Agenten einmal, speichern Sie seine ID und verwenden Sie ihn wieder:

```python
# Speichern Sie agent.id und environment.id in Ihrer Datenbank oder Konfiguration
AGENT_ID = "agt_01abc..."
ENV_ID = "env_01xyz..."

# Triggern Sie eine neue Session für jede Aufgabe
session = client.beta.sessions.create(
    agent=AGENT_ID,
    environment_id=ENV_ID,
    initial_message=user_request
)
```

### Polling statt Streaming

```python
import time

session = client.beta.sessions.create(
    agent=AGENT_ID,
    environment_id=ENV_ID,
    initial_message="Summarize the README."
)

# Umfragen Sie bis fertig
while True:
    status = client.beta.sessions.retrieve(session.id)
    if status.status in ("completed", "failed", "cancelled"):
        break
    time.sleep(2)

# Gesamtausgabe abrufen
events = client.beta.sessions.events.list(session.id)
for event in events.data:
    if event.type == "agent.message":
        print(event.content)
```

---

## TypeScript SDK

```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const agent = await client.beta.agents.create({
  name: "code-reviewer",
  model: "claude-opus-4-7",
  tools: [{ type: "agent_toolset_20260401" }],
  system: "You are a senior engineer. Review code for correctness, performance, and security.",
});

const environment = await client.beta.environments.create({
  name: "review-env",
  config: { type: "cloud", networking: { type: "none" } },
});

const session = await client.beta.sessions.create({
  agent: agent.id,
  environment_id: environment.id,
  initial_message: "Review the auth module for security issues.",
});

const stream = client.beta.sessions.events.stream(session.id);

for await (const event of stream) {
  if (event.type === "agent.message") {
    process.stdout.write(event.content);
  } else if (event.type === "agent.done") {
    console.log(`\nDone — status: ${event.status}`);
  }
}
```

---

## Die `ant` CLI

Anthropic stellt eine separate CLI (`ant`) zur Verfügung, um mit Managed Agents vom Terminal aus zu arbeiten. Sie unterscheidet sich von der `claude` CLI.

**Installation:**

```bash
# macOS über Homebrew
brew install anthropic/tap/ant

# curl Installer
curl -fsSL https://anthropic.com/install-ant.sh | sh

# Go
go install github.com/anthropics/ant@latest
```

**Grundbefehle:**

```bash
# Erstellen Sie einen Agenten aus einer Konfigurationsdatei
ant agents create --config agent.yaml

# Starten Sie eine Session interaktiv
ant sessions start --agent agt_01abc --env env_01xyz

# Tails einer laufenden Session's Event-Stream
ant sessions tail <session-id>

# Laufende Sessions auflisten
ant sessions list
```

**Onboarding:** Führen Sie aus Claude Code aus `/claude-api managed-agents-onboard` aus, um die Kontoverknüpfung, die Erstellung des ersten Agenten und die Umgebungseinrichtung interaktiv durchzugehen.

---

## Managed Agents vs. Claude Code Subagenten

| Dimension | Managed Agents | Claude Code Subagenten |
|---|---|---|
| Wo sie laufen | Anthropics Cloud (oder Ihre Sandbox) | Ihre lokale Claude Code-Session |
| Terminal erforderlich | Nein — läuft unabhängig | Ja — lebt in Ihrer Session |
| Anwendungsfall | Async, API-gesteuert, Produkt-eingebettet | Interaktiv, lokale Dev-Workflows |
| Triggering | Via API oder `ant` CLI | Via `/agent` oder Orchestrierung in CLAUDE.md |
| Zustandspersistenz | Umgebung persistiert über Sessions | Session-scoped nur |
| Netzwerk | Konfigurierbar (unbeschränkt oder keine) | Erbt lokales Netzwerk |
| ZDR / HIPAA | Nicht berechtigt | Hängt von Ihrem Account-Tier ab |

**Verwenden Sie Managed Agents wenn:**
- Sie einen Agenten benötigen, der ohne offenes Terminal läuft
- Sie ein Produkt bauen, bei dem Benutzer Agenten programmgesteuert triggern
- Sie parallele, isolierte Agent-Läufe möchten (eine Umgebung pro Kunde)
- Die Aufgabe ist langwierig und Sie möchten Cloud-Hosting

**Verwenden Sie Claude Code Subagenten wenn:**
- Sie in einem lokalen Entwicklungs-Workflow sind
- Der Agent lokale Dateien lesen, lokale Services ausführen oder Tools Ihrer Maschine nutzen muss
- Sie enge interaktive Kontrolle mit der Fähigkeit zum Unterbrechen und Umleiten möchten

---

## Praktische Muster

### Fan-out: Agenten parallel ausführen

```python
import asyncio
import anthropic

client = anthropic.Anthropic()

async def run_agent_session(agent_id: str, env_id: str, task: str) -> str:
    session = client.beta.sessions.create(
        agent=agent_id,
        environment_id=env_id,
        initial_message=task
    )
    output = []
    with client.beta.sessions.events.stream(session.id) as stream:
        for event in stream:
            if event.type == "agent.message":
                output.append(event.content)
    return "".join(output)

# Mehrere Aufgaben parallel über separate Umgebungen ausführen
tasks = [
    "Review module A for security issues",
    "Review module B for performance issues",
    "Review module C for correctness",
]

results = asyncio.run(asyncio.gather(*[
    run_agent_session(AGENT_ID, env_id, task)
    for env_id, task in zip(env_ids, tasks)
]))
```

### Webhook-getriggerte Agenten

```python
from flask import Flask, request
import anthropic

app = Flask(__name__)
client = anthropic.Anthropic()

@app.route("/trigger", methods=["POST"])
def trigger_agent():
    data = request.json
    session = client.beta.sessions.create(
        agent=AGENT_ID,
        environment_id=ENV_ID,
        initial_message=data["task"]
    )
    # Geben Sie Session-ID zurück — Client polldet oder abonniert via SSE
    return {"session_id": session.id}
```

---
