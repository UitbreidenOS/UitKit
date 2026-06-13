# Claude beheerde agenten

Managed Agents is Anthropics in de cloud gehoste agent runtime, toegankelijk via de Anthropic API. U definiëert een agent — zijn model, systeemvraag en gereedschappen — en Anthropic beheert de infrastructuur: compute sandboxes, uitvoeringsluizen, networking en session levenscyclus. U interageert ermee via de standaard Anthropic SDK of de `ant` CLI.

Dit verschilt van Claude Code subagenten. Subagenten worden in uw lokale Claude Code-sessie uitgevoerd. Managed Agents draaien in Anthropics cloud, onafhankelijk van uw terminal, en kunnen programmatisch worden geactiveerd vanuit uw eigen product.

---

## Vier kernconcepten

**Agent** — Het model, de systeemvraag en de gereedschapsconfiguratie. Bepaalt wat de agent is en wat het kan doen. Eenmaal gemaakt, hergebruikt in veel sessies.

**Omgeving** — De compute-sandbox waarin de agent wordt uitgevoerd. Kan in de cloud worden gehost (beheerd door Anthropic) of zelf worden gehost. Omgevingen blijven behouden tussen sessies als ze zo zijn geconfigureerd — ze kunnen toestand, bestanden en geïnstalleerde pakketten bevatten.

**Sessie** — Een enkele uitvoeringsbalk: één agent in één omgeving, geactiveerd door één initiële bericht. Sessions produceren een stream van events. Een sessie eindigt wanneer de agent stopt of een fout genereert.

**Events** — Door server verzonden events (SSE) uitgegeven gedurende een sessie. Event-typen omvatten `agent.message` (tekstuitvoer), `agent.tool_use` (gereedschapsinvocaties), `agent.tool_result` (gereedschapsuitvoer) en `agent.done` (sessioneinde). Uw toepassing verbruikt deze stream.

---

## Vereisten en beschikbaarheid

**Beta-header:** De API is in beta. Alle aanvragen vereisen de header `anthropic-beta: managed-agents-2026-04-01`. Python- en TypeScript-SDK's stellen dit automatisch in wanneer u de `client.beta.agents` naamruimte gebruikt.

**Gereedschapstype:** Om een agent de volledige ingebouwde gereedschapsset (Bash, bestandsbewerkingen, webzoeken, webhalen, MCP-servers) te geven, voegt u deze gereedschapsconfiguratie in:

```json
{ "type": "agent_toolset_20260401" }
```

**Niet geschikt voor:** Zero Data Retention of HIPAA BAA. Gebruik geen Managed Agents voor gezondheidszorggegevens of workloads waarvoor ZDR vereist is.

**Frequentiebeperkingen:** 300 RPM voor maakbewerkingen, 600 RPM voor leesbewerkingen.

**SDK-ondersteuning:** Python, TypeScript, Java, Go, C#, Ruby, PHP.

---

## Omgevingstypen

```python
# Door cloud beheerd — Anthropic verstrekt compute
# networking.type: "unrestricted" (volledig internet) of "none" (geïsoleerd)
config = {"type": "cloud", "networking": {"type": "unrestricted"}}

# Zelf gehost — u verstrekt de sandbox
config = {"type": "self_hosted", "url": "https://your-sandbox.example.com"}
```

Gebruik `unrestricted` netwerk wanneer de agent URL's moet ophalen, externe API's bellen of repo's klonen. Gebruik `none` voor geïsoleerde code-uitvoering of analysestaken waarbij netwerktoegang een nadeel zou zijn.

---

## Python SDK

### Installatie

```bash
pip install anthropic
```

### Volledig voorbeeld

```python
import anthropic

client = anthropic.Anthropic()

# 1. Maak de agent (doen dit eenmaal — hergebruik de ID)
agent = client.beta.agents.create(
    name="code-reviewer",
    model="claude-opus-4-7",
    tools=[{"type": "agent_toolset_20260401"}],
    system="You are a senior engineer. Review code for correctness, performance, and security. Be specific — cite line numbers and explain your reasoning."
)

# 2. Maak de omgeving
environment = client.beta.environments.create(
    name="review-env",
    config={"type": "cloud", "networking": {"type": "none"}}
)

# 3. Start een sessie
session = client.beta.sessions.create(
    agent=agent.id,
    environment_id=environment.id,
    initial_message="Clone https://github.com/my-org/my-repo and review the auth module for security issues."
)

# 4. Stream events
with client.beta.sessions.events.stream(session.id) as stream:
    for event in stream:
        if event.type == "agent.message":
            print(event.content, end="", flush=True)
        elif event.type == "agent.tool_use":
            print(f"\n[tool: {event.name}]")
        elif event.type == "agent.done":
            print(f"\n[session complete — status: {event.status}]")
```

### Agenten en omgevingen hergebruiken

Agenten- en omgevingscreatie zijn opzettelijk gescheiden van sessiecreatie. Maak de agent eenmaal, bewaar zijn ID en hergebruik het:

```python
# Bewaar agent.id en environment.id in uw database of configuratie
AGENT_ID = "agt_01abc..."
ENV_ID = "env_01xyz..."

# Trigger een nieuwe sessie voor elke taak
session = client.beta.sessions.create(
    agent=AGENT_ID,
    environment_id=ENV_ID,
    initial_message=user_request
)
```

### Polling in plaats van streaming

```python
import time

session = client.beta.sessions.create(
    agent=AGENT_ID,
    environment_id=ENV_ID,
    initial_message="Summarize the README."
)

# Poll totdat klaar
while True:
    status = client.beta.sessions.retrieve(session.id)
    if status.status in ("completed", "failed", "cancelled"):
        break
    time.sleep(2)

# Volledige uitvoer ophalen
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

## De `ant` CLI

Anthropic verzendt een aparte CLI (`ant`) om met Managed Agents vanuit de terminal te werken. Het verschilt van de `claude` CLI.

**Installatie:**

```bash
# macOS via Homebrew
brew install anthropic/tap/ant

# curl installer
curl -fsSL https://anthropic.com/install-ant.sh | sh

# Go
go install github.com/anthropics/ant@latest
```

**Basiscommando's:**

```bash
# Maak een agent aan uit een configuratiebestand
ant agents create --config agent.yaml

# Start een sessie interactief
ant sessions start --agent agt_01abc --env env_01xyz

# Staart een lopende sessie's event-stream
ant sessions tail <session-id>

# Zet lopende sessies op
ant sessions list
```

**Onboarding:** Voer uit Claude Code `/claude-api managed-agents-onboard` uit om interactief accountkoppeling, creatie van de eerste agent en omgevingsinstellingen door te lopen.

---

## Beheerde agenten vs Claude Code subagenten

| Dimensie | Beheerde agenten | Claude Code subagenten |
|---|---|---|
| Waar ze draaien | Anthropics cloud (of uw sandbox) | Uw lokale Claude Code-sessie |
| Terminal vereist | Nee — draait onafhankelijk | Ja — leeft in uw sessie |
| Use case | Async, API-gestuurde, product-ingebedde | Interactief, lokale dev workflows |
| Activering | Via API of `ant` CLI | Via `/agent` of orchestratie in CLAUDE.md |
| Statuspersistentie | Omgeving blijft behouden over sessies | Alleen session-scoped |
| Netwerk | Configureerbaar (onbeperkt of geen) | Neemt lokaal netwerk over |
| ZDR / HIPAA | Niet in aanmerking komend | Onderworpen aan uw accountniveau |

**Gebruik Managed Agents wanneer:**
- U hebt een agent nodig die zonder uw terminal open draait
- U een product bouwt waar gebruikers agenten programmatisch activeren
- U parallelle, geïsoleerde agent-runs wilt (één omgeving per klant)
- De taak is langlopend en u wilt cloud-hosting

**Gebruik Claude Code subagenten wanneer:**
- U in een lokale development workflow bent
- De agent lokale bestanden moet lezen, lokale services moet uitvoeren of tools van uw machine moet gebruiken
- U strakke interactieve controle wilt met de mogelijkheid om te onderbreken en om te leiden

---

## Praktische patronen

### Fan-out: voer agenten parallel uit

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

# Voer meerdere taken parallel uit over afzonderlijke omgevingen
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

### Webhook-getriggerde agenten

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
    # Retourneer session-ID — client pollt of abonneert via SSE
    return {"session_id": session.id}
```

---
