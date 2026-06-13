# Claude Managed Agents

Managed Agents is Anthropic's cloud-hosted agent runtime, accessible through the Anthropic API. You define an agent — its model, system prompt, and tools — and Anthropic handles the infrastructure: compute sandboxes, execution loops, networking, and session lifecycle. You interact with it via the standard Anthropic SDK or the `ant` CLI.

This is distinct from Claude Code subagents. Subagents run inside your local Claude Code session. Managed Agents run in Anthropic's cloud, independently of your terminal, and can be triggered programmatically from your own product.

---

## Four Core Concepts

**Agent** — The model, system prompt, and tool configuration. Defines what the agent is and what it can do. Created once, reused across many sessions.

**Environment** — The compute sandbox where the agent executes. Can be cloud-hosted (Anthropic-managed) or self-hosted. Environments persist between sessions if configured to do so — they can hold state, files, and installed packages.

**Session** — A single execution run: one agent in one environment, triggered by one initial message. Sessions produce a stream of events. A session ends when the agent stops or errors.

**Events** — Server-sent events (SSE) emitted throughout a session. Event types include `agent.message` (text output), `agent.tool_use` (tool invocations), `agent.tool_result` (tool outputs), and `agent.done` (session end). Your application consumes this stream.

---

## Requirements and Availability

**Beta header:** The API is in beta. All requests require the header `anthropic-beta: managed-agents-2026-04-01`. Python and TypeScript SDKs set this automatically when you use the `client.beta.agents` namespace.

**Tool type:** To give an agent the full built-in toolset (Bash, file operations, web search, web fetch, MCP servers), include this tool config:

```json
{ "type": "agent_toolset_20260401" }
```

**Not eligible for:** Zero Data Retention or HIPAA BAA. Do not use Managed Agents for healthcare data or workloads requiring ZDR.

**Rate limits:** 300 RPM for create operations, 600 RPM for read operations.

**SDK support:** Python, TypeScript, Java, Go, C#, Ruby, PHP.

---

## Environment Types

```python
# Cloud-managed — Anthropic provides compute
# networking.type: "unrestricted" (full internet) or "none" (isolated)
config = {"type": "cloud", "networking": {"type": "unrestricted"}}

# Self-hosted — you provide the sandbox
config = {"type": "self_hosted", "url": "https://your-sandbox.example.com"}
```

Use `unrestricted` networking when the agent needs to fetch URLs, call external APIs, or clone repos. Use `none` for isolated code execution or analysis tasks where network access would be a liability.

---

## Python SDK

### Installation

```bash
pip install anthropic
```

### Full example

```python
import anthropic

client = anthropic.Anthropic()

# 1. Create the agent (do this once — reuse the ID)
agent = client.beta.agents.create(
    name="code-reviewer",
    model="claude-opus-4-7",
    tools=[{"type": "agent_toolset_20260401"}],
    system="You are a senior engineer. Review code for correctness, performance, and security. Be specific — cite line numbers and explain your reasoning."
)

# 2. Create the environment
environment = client.beta.environments.create(
    name="review-env",
    config={"type": "cloud", "networking": {"type": "none"}}
)

# 3. Start a session
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

### Reusing agents and environments

Agent and environment creation are separate from session creation by design. Create the agent once, store its ID, and reuse it:

```python
# Store agent.id and environment.id in your database or config
AGENT_ID = "agt_01abc..."
ENV_ID = "env_01xyz..."

# Trigger a new session for each task
session = client.beta.sessions.create(
    agent=AGENT_ID,
    environment_id=ENV_ID,
    initial_message=user_request
)
```

### Polling instead of streaming

```python
import time

session = client.beta.sessions.create(
    agent=AGENT_ID,
    environment_id=ENV_ID,
    initial_message="Summarize the README."
)

# Poll until done
while True:
    status = client.beta.sessions.retrieve(session.id)
    if status.status in ("completed", "failed", "cancelled"):
        break
    time.sleep(2)

# Retrieve full output
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

## The `ant` CLI

Anthropic ships a separate CLI (`ant`) for working with Managed Agents from the terminal. It is distinct from the `claude` CLI.

**Installation:**

```bash
# macOS via Homebrew
brew install anthropic/tap/ant

# curl installer
curl -fsSL https://anthropic.com/install-ant.sh | sh

# Go
go install github.com/anthropics/ant@latest
```

**Basic commands:**

```bash
# Create an agent from a config file
ant agents create --config agent.yaml

# Start a session interactively
ant sessions start --agent agt_01abc --env env_01xyz

# Tail a running session's event stream
ant sessions tail <session-id>

# List running sessions
ant sessions list
```

**Onboarding:** From inside Claude Code, run `/claude-api managed-agents-onboard` to walk through account linking, first agent creation, and environment setup interactively.

---

## Managed Agents vs. Claude Code Subagents

| Dimension | Managed Agents | Claude Code Subagents |
|---|---|---|
| Where they run | Anthropic's cloud (or your sandbox) | Your local Claude Code session |
| Terminal required | No — runs independently | Yes — lives inside your session |
| Use case | Async, API-driven, product-embedded | Interactive, local dev workflows |
| Triggering | Via API or `ant` CLI | Via `/agent` or orchestration in CLAUDE.md |
| State persistence | Environment persists across sessions | Session-scoped only |
| Networking | Configurable (unrestricted or none) | Inherits local network |
| ZDR / HIPAA | Not eligible | Subject to your account tier |

**Use Managed Agents when:**
- You need an agent to run without your terminal staying open
- You are building a product where users trigger agents programmatically
- You want parallel, isolated agent runs (one environment per customer)
- The task is long-running and you want cloud-hosted execution

**Use Claude Code subagents when:**
- You are in a local development workflow
- The agent needs to read local files, run local services, or use your machine's tools
- You want tight interactive control with the ability to interrupt and redirect

---

## Practical Patterns

### Fan-out: run agents in parallel

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

# Run multiple tasks in parallel across separate environments
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

### Webhook-triggered agents

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
    # Return session ID — client polls or subscribes via SSE
    return {"session_id": session.id}
```

---

## New Capabilities (2026)

### Dreaming

Scheduled background process that reviews past agent sessions, extracts behavioral patterns, and writes curated memories to improve future agent performance. Enabled per-agent in settings.

Dreaming is not real-time — it runs on Anthropic's schedule, typically after a session ends and periodically during quiet periods. The result is that agents improve over time without explicit re-prompting: failure modes get added to memory, successful strategies are reinforced, and edge cases encountered in production feed back into the agent's behavior.

Enable in the Managed Agents dashboard under the agent's settings → Dreaming → On.

---

### Outcomes

User-defined success rubrics for measuring whether an agent completed its task correctly. You define what "good" looks like; a separate grader model evaluates the agent's output against your rubric. Reported 10.1% quality improvement in production workloads.

Configure via the Managed Agents dashboard or API:

```json
{
  "outcomes": [
    {
      "name": "task-completed",
      "description": "The agent successfully completed the requested task with no errors",
      "weight": 1.0
    }
  ]
}
```

Multiple outcomes can be defined with different weights. The grader produces a per-outcome score and a weighted aggregate. Outcome scores are available in the session object after completion:

```python
session = client.beta.sessions.retrieve(session_id)
print(session.outcome_scores)  # {"task-completed": 0.92, ...}
```

---

### Memory System (April 23, 2026)

Persistent learning across sessions — agents remember facts, decisions, and context from previous runs. Stored in Anthropic-managed memory; accessible to the agent on each new session automatically.

Currently in public beta. Enable in your agent config:

```python
agent = client.beta.agents.create(
    name="my-agent",
    model="claude-opus-4-7",
    tools=[{"type": "agent_toolset_20260401"}],
    system="...",
    memory={"enabled": True}
)
```

Memory is scoped to the agent — each agent has its own memory store. Memories are written by the agent during sessions and read at session start. You can inspect and delete memories via the Managed Agents dashboard or API.

---

### MCP Tunnels (Research Preview)

Connect private, non-public services to Managed Agents without exposing them to the internet. The tunnel creates a secure channel from Anthropic's cloud to your private service.

Use case: agents that need to read from your internal database, call your internal API, or access services that cannot be publicly routable.

```bash
# Install the tunnel CLI
npm install -g @anthropic-ai/mcp-tunnel

# Start a tunnel to a local service
mcp-tunnel --target http://localhost:8080 --agent agt_01abc
```

The tunnel URL is injected into the agent's environment automatically. The agent calls your service through the tunnel; no public port needed on your infrastructure.

---

### Self-Hosted Sandboxes (Public Beta)

Run the agent execution environment on your own infrastructure instead of Anthropic's cloud. Full control over networking, filesystem, and runtime.

Requirements:
- A compatible Docker-based sandbox runtime
- An endpoint reachable from Anthropic's cloud (or via MCP Tunnel)
- Registration in the Managed Agents dashboard

```python
environment = client.beta.environments.create(
    name="self-hosted-env",
    config={
        "type": "self_hosted",
        "url": "https://your-sandbox.example.com"
    }
)
```

Beta documentation: platform.claude.com → Managed Agents → Self-Hosted Sandboxes.

---

### Billing Update — June 15, 2026

Managed Agent sessions now draw from the **Agent SDK credit pool**, which is separate from your interactive usage limits. Running agents via `client.beta.sessions.create` no longer affects your Claude chat or Claude Code terminal session limits.

See `guides/billing-and-pricing.md` for the full breakdown of pools, credit limits, and rollover behavior.

---
