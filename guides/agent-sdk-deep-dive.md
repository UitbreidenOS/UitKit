# Claude Agent SDK Deep Dive — Mid-2026

A comprehensive guide to building production agents with the Claude Agent SDK: Python and TypeScript SDKs, agent loop internals, custom tools, subagents, hooks, sessions, MCP over HTTP, prompt caching patterns, cloud provider integrations, the June 15, 2026 billing model, and a complete autonomous bug-triage agent example.

## What is the Claude Agent SDK?

The Claude Agent SDK is the programmable version of Claude Code's agent loop. It exposes the same tool-use runtime, context management, session persistence, and Multi-Model Context Protocol (MCP) integration that powers Claude Code, available in Python and TypeScript. You run agents locally, in containers, or on cloud platforms, with billing on a separate credit pool effective June 15, 2026.

**Minimum prerequisites**: Python 3.10+ or Node.js 18+, an Anthropic API key.

## Installation and First Steps

### Python Installation

Install via pip:

```bash
pip install claude-agent-sdk-python
```

Verify:

```bash
python -c "import anthropic_agent_sdk; print(anthropic_agent_sdk.__version__)"
```

Check Python version:

```bash
python --version
```

Must be 3.10 or later.

### TypeScript Installation

Install via npm:

```bash
npm install @anthropic-ai/claude-agent-sdk
```

The TypeScript SDK bundles a native Claude Code binary for your platform. You do not need to install Claude Code separately.

Verify:

```bash
npm list @anthropic-ai/claude-agent-sdk
```

### Minimal Python Example

Create `agent_example.py`:

```python
import anthropic_agent_sdk
import os

api_key = os.environ["ANTHROPIC_API_KEY"]
client = anthropic_agent_sdk.AgentClient(api_key=api_key)

response = client.query(
    system="You are a helpful assistant.",
    messages=[
        {
            "role": "user",
            "content": "What is 2 + 2?"
        }
    ]
)

print(response.text)
```

Run:

```bash
export ANTHROPIC_API_KEY="sk-..."
python agent_example.py
```

### Minimal TypeScript Example

Create `agent_example.ts`:

```typescript
import { AgentClient } from "@anthropic-ai/claude-agent-sdk";

const client = new AgentClient({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function main() {
  const response = await client.query({
    system: "You are a helpful assistant.",
    messages: [
      {
        role: "user",
        content: "What is 2 + 2?",
      },
    ],
  });

  console.log(response.text);
}

main().catch(console.error);
```

Run:

```bash
export ANTHROPIC_API_KEY="sk-..."
npx ts-node agent_example.ts
```

## Agent Loop Internals

### Agentic Loop Architecture

The agent loop is a state machine that alternates between Claude API calls and tool execution:

1. **Initial message dispatch**: Client sends user message(s) and system prompt to Claude API.
2. **Response handling**: Claude returns either final text (`stop_reason: "end_turn"`) or tool calls.
3. **Tool execution**: If tool calls are present, the SDK executes them locally (or forwards to MCP servers).
4. **Tool result collection**: SDK gathers all tool results into a single assistant message.
5. **Loop continuation**: Tool results are sent back to Claude in the next request.
6. **Termination**: Loop exits when Claude responds with `stop_reason: "end_turn"` or `max_tokens` is hit.

### Understanding response.stop_reason

`stop_reason` determines agent state:

- `"end_turn"`: Agent is done. User message(s) fully addressed.
- `"tool_use"`: Tool calls pending. SDK will handle them; client receives results in next turn.
- `"max_tokens"`: Token budget exhausted mid-response. Agent stopped forcibly; continue with truncated state.

### Accessing Tool Call Details

After a query, inspect tool calls and results:

**Python:**

```python
response = client.query(system="...", messages=[...])

# Check if tool calls occurred
if response.stop_reason == "tool_use":
    for tool_call in response.tool_calls:
        print(f"Tool: {tool_call.name}, Input: {tool_call.input}")
        print(f"Result: {tool_call.result}")
```

**TypeScript:**

```typescript
const response = await client.query({
  system: "...",
  messages: [...],
});

if (response.stopReason === "tool_use") {
  for (const toolCall of response.toolCalls) {
    console.log(`Tool: ${toolCall.name}, Input:`, toolCall.input);
    console.log(`Result:`, toolCall.result);
  }
}
```

### Built-in Tools

The SDK includes five tools automatically:

1. **bash_execute** — Run shell commands, capture stdout/stderr.
2. **file_read** — Read file contents (respects sandbox restrictions).
3. **file_write** — Write or append to files (safe overwrite confirmation).
4. **file_edit** — Precise line-range edits with before/after context.
5. **web_search** — Query the web (no authentication required).

All tools are available in queries. You do not explicitly enable them.

## Custom Tools

Define domain-specific tools to extend agent capabilities.

### Python: Defining Custom Tools

```python
import anthropic_agent_sdk
from anthropic_agent_sdk import Tool

# Define a tool
calculate_tool = Tool(
    name="calculate",
    description="Perform arithmetic calculations.",
    input_schema={
        "type": "object",
        "properties": {
            "expression": {
                "type": "string",
                "description": "A Python expression like '2 * 3 + 1'."
            }
        },
        "required": ["expression"]
    }
)

# Register tool handler
def handle_calculate(expression: str) -> str:
    try:
        result = eval(expression)
        return f"Result: {result}"
    except Exception as e:
        return f"Error: {str(e)}"

client = anthropic_agent_sdk.AgentClient(
    api_key=os.environ["ANTHROPIC_API_KEY"],
    tools={
        "calculate": calculate_tool
    },
    tool_handlers={
        "calculate": handle_calculate
    }
)

response = client.query(
    system="You are a math assistant. Use the calculate tool for arithmetic.",
    messages=[
        {
            "role": "user",
            "content": "Calculate 5 * 7 + 3"
        }
    ]
)

print(response.text)
```

### TypeScript: Defining Custom Tools

```typescript
import { AgentClient, Tool } from "@anthropic-ai/claude-agent-sdk";

const calculateTool: Tool = {
  name: "calculate",
  description: "Perform arithmetic calculations.",
  inputSchema: {
    type: "object",
    properties: {
      expression: {
        type: "string",
        description: "A Python expression like '2 * 3 + 1'.",
      },
    },
    required: ["expression"],
  },
};

const handleCalculate = (expression: string): string => {
  try {
    // Note: eval is unsafe in production; use a safer alternative.
    const result = eval(expression);
    return `Result: ${result}`;
  } catch (e) {
    return `Error: ${String(e)}`;
  }
};

const client = new AgentClient({
  apiKey: process.env.ANTHROPIC_API_KEY,
  tools: {
    calculate: calculateTool,
  },
  toolHandlers: {
    calculate: handleCalculate,
  },
});

async function main() {
  const response = await client.query({
    system: "You are a math assistant. Use the calculate tool for arithmetic.",
    messages: [
      {
        role: "user",
        content: "Calculate 5 * 7 + 3",
      },
    ],
  });

  console.log(response.text);
}

main().catch(console.error);
```

### Tool Input Validation

Always use JSON Schema for input validation. The SDK validates inputs before calling your handler:

```python
# Python example: schema with constraints
email_tool = Tool(
    name="send_email",
    description="Send an email message.",
    input_schema={
        "type": "object",
        "properties": {
            "to": {
                "type": "string",
                "description": "Email address.",
                "pattern": r"^[\w\.-]+@[\w\.-]+\.\w+$"
            },
            "subject": {
                "type": "string",
                "description": "Email subject.",
                "maxLength": 100
            },
            "body": {
                "type": "string",
                "description": "Email body.",
                "maxLength": 5000
            }
        },
        "required": ["to", "subject", "body"]
    }
)
```

## Subagents

Subagents are delegated child agents with isolated context. Each subagent has:

- Its own session (separate conversation history).
- Its own tool set (you configure which tools it can access).
- Its own system prompt (can differ from parent).
- Automatic resumability via session IDs.

### Python: Spawning a Subagent

```python
import anthropic_agent_sdk

client = anthropic_agent_sdk.AgentClient(api_key=os.environ["ANTHROPIC_API_KEY"])

# Spawn a subagent for code review
code_review_response = client.spawn_subagent(
    name="code-reviewer",
    model="claude-opus-4-1-20250805",
    system="""You are an expert code reviewer. You identify bugs, 
suggest refactoring, and ensure best practices. Be concise and direct.""",
    messages=[
        {
            "role": "user",
            "content": """Review this Python function:

def add(a, b):
    return a + b

Focus on type safety and edge cases."""
        }
    ],
    tools=["bash_execute", "file_read"]  # Subagent-specific tools
)

print(f"Subagent response: {code_review_response.text}")
print(f"Subagent consumed {code_review_response.total_cost_usd} USD")
```

### TypeScript: Spawning a Subagent

```typescript
import { AgentClient } from "@anthropic-ai/claude-agent-sdk";

const client = new AgentClient({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const codeReviewResponse = await client.spawnSubagent({
  name: "code-reviewer",
  model: "claude-opus-4-1-20250805",
  system: `You are an expert code reviewer. You identify bugs, 
suggest refactoring, and ensure best practices. Be concise and direct.`,
  messages: [
    {
      role: "user",
      content: `Review this Python function:

def add(a, b):
    return a + b

Focus on type safety and edge cases.`,
    },
  ],
  tools: ["bash_execute", "file_read"],
});

console.log(`Subagent response: ${codeReviewResponse.text}`);
console.log(
  `Subagent consumed ${codeReviewResponse.totalCostUsd} USD`
);
```

### Subagent Isolation

Subagents do not automatically inherit parent tools or context. You must explicitly pass:

- `system`: The subagent's system prompt.
- `messages`: The initial conversation for the subagent.
- `tools`: A subset of available tools the subagent can use.

Subagents cannot spawn further subagents (no nesting).

## All Hook Types

Hooks are registered functions that run at specific points in the agent lifecycle. The SDK supports six hook types:

### 1. on_message_sent

Fires when a message is dispatched to Claude API.

**Python:**

```python
def my_on_message_sent(message):
    print(f"Sending message: {message.content[:100]}...")

client = anthropic_agent_sdk.AgentClient(
    api_key=os.environ["ANTHROPIC_API_KEY"],
    hooks={
        "on_message_sent": my_on_message_sent
    }
)
```

**TypeScript:**

```typescript
const client = new AgentClient({
  apiKey: process.env.ANTHROPIC_API_KEY,
  hooks: {
    onMessageSent: (message) => {
      console.log(`Sending message: ${message.content.slice(0, 100)}...`);
    },
  },
});
```

### 2. on_response_received

Fires when Claude API returns a response.

**Python:**

```python
def my_on_response_received(response):
    print(f"Stop reason: {response.stop_reason}")
    print(f"Cost: ${response.total_cost_usd}")

client = anthropic_agent_sdk.AgentClient(
    api_key=os.environ["ANTHROPIC_API_KEY"],
    hooks={
        "on_response_received": my_on_response_received
    }
)
```

### 3. on_tool_call

Fires before a tool is executed.

**Python:**

```python
def my_on_tool_call(tool_name, tool_input):
    print(f"Executing tool: {tool_name}")
    print(f"Input: {tool_input}")

client = anthropic_agent_sdk.AgentClient(
    api_key=os.environ["ANTHROPIC_API_KEY"],
    hooks={
        "on_tool_call": my_on_tool_call
    }
)
```

### 4. on_tool_result

Fires after a tool completes (success or error).

**Python:**

```python
def my_on_tool_result(tool_name, result, error=None):
    if error:
        print(f"Tool {tool_name} failed: {error}")
    else:
        print(f"Tool {tool_name} succeeded: {result[:100]}...")

client = anthropic_agent_sdk.AgentClient(
    api_key=os.environ["ANTHROPIC_API_KEY"],
    hooks={
        "on_tool_result": my_on_tool_result
    }
)
```

### 5. on_session_created

Fires when a new session is created.

**Python:**

```python
def my_on_session_created(session_id):
    print(f"New session: {session_id}")

client = anthropic_agent_sdk.AgentClient(
    api_key=os.environ["ANTHROPIC_API_KEY"],
    hooks={
        "on_session_created": my_on_session_created
    }
)
```

### 6. on_session_saved

Fires when a session is persisted.

**Python:**

```python
def my_on_session_saved(session_id, path):
    print(f"Session {session_id} saved to {path}")

client = anthropic_agent_sdk.AgentClient(
    api_key=os.environ["ANTHROPIC_API_KEY"],
    hooks={
        "on_session_saved": my_on_session_saved
    }
)
```

### Complete Hook Example

**Python:**

```python
import anthropic_agent_sdk
import os
from datetime import datetime

def log_message_sent(message):
    timestamp = datetime.now().isoformat()
    print(f"[{timestamp}] MESSAGE SENT: {message.content[:80]}...")

def log_response_received(response):
    print(f"[RESPONSE] Stop reason: {response.stop_reason}, Cost: ${response.total_cost_usd:.4f}")

def log_tool_call(tool_name, tool_input):
    print(f"[TOOL] {tool_name} called with input: {tool_input}")

def log_tool_result(tool_name, result, error=None):
    if error:
        print(f"[TOOL] {tool_name} ERROR: {error}")
    else:
        print(f"[TOOL] {tool_name} SUCCESS: {result[:60]}...")

client = anthropic_agent_sdk.AgentClient(
    api_key=os.environ["ANTHROPIC_API_KEY"],
    hooks={
        "on_message_sent": log_message_sent,
        "on_response_received": log_response_received,
        "on_tool_call": log_tool_call,
        "on_tool_result": log_tool_result
    }
)

response = client.query(
    system="You are a helpful assistant.",
    messages=[{"role": "user", "content": "What files are in /tmp?"}]
)

print(f"\nFinal response: {response.text}")
```

## Sessions and Resumability

Sessions persist agent state across invocations. The SDK writes session state to JSONL files (one JSON object per line) and supports resumption via `--resume` flag (CLI) or `session_id` parameter (SDK).

### Session Storage Format (JSONL)

Each session is stored as a newline-delimited JSON file, typically at `~/.claude-agent-sdk/sessions/{session_id}.jsonl`:

```json
{"type": "system_prompt", "content": "You are a helpful assistant."}
{"type": "message", "role": "user", "content": "Fix the bug in main.py"}
{"type": "message", "role": "assistant", "content": "I'll analyze the code..."}
{"type": "tool_call", "name": "file_read", "input": {"path": "/path/to/main.py"}, "result": "def main():\n    print(\"hello\")"}
{"type": "message", "role": "assistant", "content": "The bug is on line 2..."}
```

Each line is a complete JSON object. No line references are stored; the entire log is parsed sequentially on resume.

### Python: Creating and Resuming Sessions

Create a new session:

```python
import anthropic_agent_sdk
import os

client = anthropic_agent_sdk.AgentClient(api_key=os.environ["ANTHROPIC_API_KEY"])

# First invocation: new session
response = client.query(
    system="You are a code debugging assistant.",
    messages=[
        {"role": "user", "content": "I have a bug in my Python script."}
    ],
    session_id="debug-session-001"  # Optional; auto-generated if omitted
)

print(f"Response: {response.text}")
print(f"Session ID: {response.session_id}")
```

Resume an existing session:

```python
# Second invocation: resume session
response = client.query(
    messages=[
        {"role": "user", "content": "Can you also refactor the code for readability?"}
    ],
    session_id="debug-session-001"  # Resume previous session
)

print(f"Response: {response.text}")
```

### TypeScript: Creating and Resuming Sessions

```typescript
import { AgentClient } from "@anthropic-ai/claude-agent-sdk";

const client = new AgentClient({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// First invocation
const response1 = await client.query({
  system: "You are a code debugging assistant.",
  messages: [
    { role: "user", content: "I have a bug in my Python script." },
  ],
  sessionId: "debug-session-001",
});

console.log(`Response: ${response1.text}`);
console.log(`Session ID: ${response1.sessionId}`);

// Resume session
const response2 = await client.query({
  messages: [
    { role: "user", content: "Can you also refactor the code for readability?" },
  ],
  sessionId: "debug-session-001",
});

console.log(`Response: ${response2.text}`);
```

### CLI: Resume Flag

When using the CLI (headless Claude Code):

```bash
# First invocation
claude --session debug-session-001 "Fix the bug in main.py"

# Resume session
claude --resume debug-session-001 "Also add error handling."
```

### Session Cleanup

Sessions are stored indefinitely. To clean up:

```bash
# List all sessions
ls -la ~/.claude-agent-sdk/sessions/

# Delete a specific session
rm ~/.claude-agent-sdk/sessions/debug-session-001.jsonl
```

## Model Context Protocol (MCP) over HTTP

MCP servers can be local (stdio, SSE) or remote (HTTP). The SDK supports HTTP via URI.

### HTTP MCP Server Configuration

**Python:**

```python
import anthropic_agent_sdk
import os

client = anthropic_agent_sdk.AgentClient(
    api_key=os.environ["ANTHROPIC_API_KEY"],
    mcp_servers=[
        {
            "type": "http",
            "url": "https://mcp-server.example.com/claude",
            "name": "external-tools",
            "auth": {
                "type": "bearer",
                "token": os.environ.get("MCP_AUTH_TOKEN")
            }
        }
    ]
)

response = client.query(
    system="You have access to external tools via MCP.",
    messages=[
        {"role": "user", "content": "Use the mcp tool 'fetch_weather' for NYC."}
    ]
)

print(response.text)
```

**TypeScript:**

```typescript
import { AgentClient } from "@anthropic-ai/claude-agent-sdk";

const client = new AgentClient({
  apiKey: process.env.ANTHROPIC_API_KEY,
  mcpServers: [
    {
      type: "http",
      url: "https://mcp-server.example.com/claude",
      name: "external-tools",
      auth: {
        type: "bearer",
        token: process.env.MCP_AUTH_TOKEN,
      },
    },
  ],
});

const response = await client.query({
  system: "You have access to external tools via MCP.",
  messages: [
    {
      role: "user",
      content: "Use the mcp tool 'fetch_weather' for NYC.",
    },
  ],
});

console.log(response.text);
```

### Local MCP Server (stdio)

For local MCP servers using stdio transport:

**Python:**

```python
client = anthropic_agent_sdk.AgentClient(
    api_key=os.environ["ANTHROPIC_API_KEY"],
    mcp_servers=[
        {
            "type": "stdio",
            "command": "python",
            "args": ["/path/to/mcp_server.py"],
            "name": "local-tools"
        }
    ]
)
```

**TypeScript:**

```typescript
const client = new AgentClient({
  apiKey: process.env.ANTHROPIC_API_KEY,
  mcpServers: [
    {
      type: "stdio",
      command: "python",
      args: ["/path/to/mcp_server.py"],
      name: "local-tools",
    },
  ],
});
```

## Prompt Caching: The Essential Pattern

Prompt caching is **mandatory** for cost efficiency. The SDK automatically caches the system prompt and tool schemas after the first call. Subsequent calls with the same prefix pay ~10% of the input token cost.

### Automatic Caching: System Prompt and Tools

No configuration needed. The SDK caches automatically:

```python
import anthropic_agent_sdk
import os

client = anthropic_agent_sdk.AgentClient(api_key=os.environ["ANTHROPIC_API_KEY"])

# First call: system prompt and tools are cached
response1 = client.query(
    system="""You are an expert code reviewer. 
    You identify bugs, performance issues, and suggest refactoring.
    Always be thorough and mention line numbers.""",
    messages=[
        {"role": "user", "content": "Review app.py"}
    ]
)

print(f"Call 1 cost: ${response1.total_cost_usd:.4f}")

# Second call: same system prompt, same tools
# System prompt and tools are CACHE_HIT (90% savings on prefix)
response2 = client.query(
    system="""You are an expert code reviewer. 
    You identify bugs, performance issues, and suggest refactoring.
    Always be thorough and mention line numbers.""",
    messages=[
        {"role": "user", "content": "Review utils.py"}
    ]
)

print(f"Call 2 cost: ${response2.total_cost_usd:.4f}")  # ~10% of call 1
```

### Manual Cache Control: Pinning Large Contexts

For large system prompts (e.g., codebases, documentation), explicitly mark sections to cache:

**Python:**

```python
import anthropic_agent_sdk
import os

large_codebase_context = """
# Our Codebase Reference

[10,000+ tokens of project structure, APIs, conventions...]
"""

client = anthropic_agent_sdk.AgentClient(api_key=os.environ["ANTHROPIC_API_KEY"])

response = client.query(
    system=f"""You are an expert in our codebase.

{large_codebase_context}

Answer questions about architecture and implementation.""",
    messages=[
        {"role": "user", "content": "How does the auth module work?"}
    ],
    cache_control={
        "type": "ephemeral",  # 5-minute TTL (default)
        "min_input_tokens": 1024  # Only cache if prefix >= 1024 tokens
    }
)

print(f"Response: {response.text}")
print(f"Cache metrics: {response.cache_creation_input_tokens}, {response.cache_read_input_tokens}")
```

### Extended Cache TTL: 1-Hour Persistence

For sessions with gaps between invocations, request 1-hour TTL:

```bash
export ENABLE_PROMPT_CACHING_1H=1
python agent_script.py
```

This environment variable signals Anthropic to cache with 1-hour TTL instead of 5 minutes. Useful for multi-day sessions.

### Avoiding Cache Invalidation

**Common mistake**: Adding or removing tools mid-conversation invalidates the entire cache.

**Safe approach**: Use `defer_loading` to stub unused tools:

```python
# Instead of removing tools dynamically, send lightweight stubs
tools_stubs = [
    {
        "name": "rarely_used_tool",
        "description": "A tool you might not need.",
        "defer_loading": True
    }
]

response = client.query(
    system="You have access to tools.",
    messages=[...],
    tools=tools_stubs
)
```

Claude will "discover" deferred tools on demand without invalidating the cache.

## Cloud Provider Integrations

The SDK supports multiple cloud providers. Configure via environment variables or client initialization.

### AWS Bedrock

Enable Bedrock as the backend:

```bash
export CLAUDE_CODE_USE_BEDROCK=1
export AWS_REGION=us-east-1
export AWS_PROFILE=default

python agent_script.py
```

**Python:**

```python
import anthropic_agent_sdk
import os

client = anthropic_agent_sdk.AgentClient(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),  # Not needed for Bedrock
    bedrock_enabled=True,
    aws_region="us-east-1"
)

response = client.query(
    system="You are a helpful assistant.",
    messages=[{"role": "user", "content": "Hello!"}]
)
```

### Google Vertex AI

Enable Vertex AI as the backend:

```bash
export CLAUDE_CODE_USE_VERTEX=1
export GOOGLE_CLOUD_PROJECT=my-project
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json

python agent_script.py
```

**Python:**

```python
import anthropic_agent_sdk
import os

client = anthropic_agent_sdk.AgentClient(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),  # Not needed for Vertex
    vertex_enabled=True,
    gcp_project="my-project"
)

response = client.query(
    system="You are a helpful assistant.",
    messages=[{"role": "user", "content": "Hello!"}]
)
```

### Azure OpenAI (via proxy)

Route Agent SDK calls through Azure OpenAI's proxy:

```bash
export ANTHROPIC_API_BASE=https://<resource>.openai.azure.com
export ANTHROPIC_API_KEY=<azure-api-key>

python agent_script.py
```

## June 15, 2026: Billing Model Change

Effective June 15, 2026, Anthropic separates Claude Agent SDK usage from subscription billing.

### Interactive Pool (Unchanged)

These still draw from your subscription limits:

- Claude.ai web/desktop/mobile chat
- Claude Code running interactively in the terminal
- Claude Cowork

### Agent SDK Credit Pool (New)

These draw from a **separate monthly credit**:

- Claude Agent SDK programmatic calls (`client.query()`, `client.spawn_subagent()`)
- Headless Claude Code (`claude` CLI in automation/CI)
- Claude Code GitHub Actions integration
- Third-party agents built on Agent SDK

The monthly credit is:

- **Pro**: ~$20 USD
- **Max 5x**: ~$100 USD
- **Max 20x**: ~$200 USD

Credit is **not rolled over**. Unused balance expires monthly. Costs are billed at full API token rates.

### Tracking Agent SDK Costs

Every `query()` response includes cost breakdown:

**Python:**

```python
response = client.query(
    system="You are a helpful assistant.",
    messages=[{"role": "user", "content": "Hello!"}]
)

print(f"Total cost: ${response.total_cost_usd:.4f}")
print(f"Input tokens: {response.usage.input_tokens}")
print(f"Output tokens: {response.usage.output_tokens}")
print(f"Cache creation tokens: {response.usage.cache_creation_input_tokens}")
print(f"Cache read tokens: {response.usage.cache_read_input_tokens}")
```

**TypeScript:**

```typescript
const response = await client.query({
  system: "You are a helpful assistant.",
  messages: [{ role: "user", content: "Hello!" }],
});

console.log(`Total cost: $${response.totalCostUsd.toFixed(4)}`);
console.log(`Input tokens: ${response.usage.inputTokens}`);
console.log(`Output tokens: ${response.usage.outputTokens}`);
console.log(
  `Cache creation tokens: ${response.usage.cacheCreationInputTokens}`
);
console.log(`Cache read tokens: ${response.usage.cacheReadInputTokens}`);
```

## Complete Example: Autonomous Bug-Triage Agent

A production-ready agent that ingests a GitHub issue, analyzes code, and auto-generates triage output (severity, component, suggested fix).

### Project Structure

```
bug-triage-agent/
├── agent.py
├── tools.py
├── requirements.txt
└── README.md
```

### requirements.txt

```
claude-agent-sdk-python==1.2.0
requests==2.31.0
python-dotenv==1.0.0
```

### tools.py

Custom tools for bug triage:

```python
import json
import requests
from anthropic_agent_sdk import Tool

# Tool 1: Fetch GitHub issue details
def fetch_github_issue(owner: str, repo: str, issue_number: int) -> str:
    """Fetch issue from GitHub API."""
    url = f"https://api.github.com/repos/{owner}/{repo}/issues/{issue_number}"
    resp = requests.get(url, timeout=10)
    if resp.status_code == 200:
        issue = resp.json()
        return json.dumps({
            "title": issue["title"],
            "body": issue["body"],
            "labels": [l["name"] for l in issue["labels"]],
            "state": issue["state"]
        }, indent=2)
    return f"Error fetching issue: HTTP {resp.status_code}"

# Tool 2: Parse stack traces
def parse_stacktrace(stacktrace: str) -> str:
    """Extract file paths and line numbers from a stack trace."""
    lines = stacktrace.split("\n")
    files = []
    for line in lines:
        if "File" in line and ".py" in line:
            # Extract file path from typical Python traceback line
            parts = line.split('"')
            if len(parts) >= 2:
                files.append(parts[1])
    return json.dumps({"files": list(set(files))})

# Tool 3: Suggest severity
def suggest_severity(description: str) -> str:
    """Classify bug severity based on keywords."""
    description_lower = description.lower()
    if any(kw in description_lower for kw in ["crash", "data loss", "security"]):
        return json.dumps({"severity": "critical"})
    elif any(kw in description_lower for kw in ["error", "broken", "fail"]):
        return json.dumps({"severity": "high"})
    elif any(kw in description_lower for kw in ["typo", "minor", "cosmetic"]):
        return json.dumps({"severity": "low"})
    else:
        return json.dumps({"severity": "medium"})

# Define tools for Agent SDK
github_issue_tool = Tool(
    name="fetch_github_issue",
    description="Fetch a GitHub issue by owner, repo, and issue number.",
    input_schema={
        "type": "object",
        "properties": {
            "owner": {"type": "string", "description": "GitHub org or username"},
            "repo": {"type": "string", "description": "Repository name"},
            "issue_number": {"type": "integer", "description": "Issue number"}
        },
        "required": ["owner", "repo", "issue_number"]
    }
)

stacktrace_tool = Tool(
    name="parse_stacktrace",
    description="Extract file paths and line numbers from a stack trace.",
    input_schema={
        "type": "object",
        "properties": {
            "stacktrace": {"type": "string", "description": "Full stack trace"}
        },
        "required": ["stacktrace"]
    }
)

severity_tool = Tool(
    name="suggest_severity",
    description="Classify bug severity (critical, high, medium, low).",
    input_schema={
        "type": "object",
        "properties": {
            "description": {"type": "string", "description": "Bug description"}
        },
        "required": ["description"]
    }
)

tool_handlers = {
    "fetch_github_issue": lambda owner, repo, issue_number: fetch_github_issue(owner, repo, issue_number),
    "parse_stacktrace": lambda stacktrace: parse_stacktrace(stacktrace),
    "suggest_severity": lambda description: suggest_severity(description)
}

tools_list = {
    "fetch_github_issue": github_issue_tool,
    "parse_stacktrace": stacktrace_tool,
    "suggest_severity": severity_tool
}
```

### agent.py

The main agent:

```python
import os
import json
from dotenv import load_dotenv
import anthropic_agent_sdk
from tools import tools_list, tool_handlers

load_dotenv()

def triage_github_issue(owner: str, repo: str, issue_number: int):
    """
    Autonomous bug-triage agent.
    Fetches GitHub issue, analyzes it, and generates triage output.
    """
    
    client = anthropic_agent_sdk.AgentClient(
        api_key=os.environ["ANTHROPIC_API_KEY"],
        tools=tools_list,
        tool_handlers=tool_handlers,
        hooks={
            "on_tool_call": lambda name, inp: print(f"[TOOL] {name}: {inp}"),
            "on_response_received": lambda resp: print(f"[RESPONSE] Stop: {resp.stop_reason}, Cost: ${resp.total_cost_usd:.4f}")
        }
    )
    
    system_prompt = """You are an expert bug-triage agent for a software project.

Your job:
1. Fetch the GitHub issue details
2. Analyze the bug description and any stack traces
3. Extract affected files
4. Determine severity (critical, high, medium, low)
5. Suggest a root cause and fix strategy
6. Output a structured triage report

Format your final output as JSON with keys: 
- issue_id
- title
- severity
- affected_components (list of file paths)
- root_cause (1-2 sentences)
- suggested_fix (2-3 action items)
- estimated_effort (small/medium/large)
"""

    user_message = f"""Please triage GitHub issue {owner}/{repo}#{issue_number}.

Use the fetch_github_issue tool to get details, parse any stack traces, 
and suggest severity. Then provide a structured triage output."""

    response = client.query(
        system=system_prompt,
        messages=[
            {"role": "user", "content": user_message}
        ],
        session_id=f"triage-{owner}-{repo}-{issue_number}"
    )
    
    print("\n=== TRIAGE REPORT ===\n")
    print(response.text)
    print(f"\n=== METRICS ===")
    print(f"Total cost: ${response.total_cost_usd:.4f}")
    print(f"Input tokens: {response.usage.input_tokens}")
    print(f"Output tokens: {response.usage.output_tokens}")
    
    return response

if __name__ == "__main__":
    # Example: Triage an issue
    triage_github_issue(
        owner="anthropics",
        repo="anthropic-sdk-python",
        issue_number=42
    )
```

### Usage

```bash
export ANTHROPIC_API_KEY="sk-..."
python agent.py
```

### Output Example

```
=== TRIAGE REPORT ===

Based on my analysis of the GitHub issue, here is the triage report:

{
  "issue_id": "anthropics/anthropic-sdk-python#42",
  "title": "Agent SDK crash on empty tool input",
  "severity": "high",
  "affected_components": [
    "anthropic_agent_sdk/agent.py",
    "anthropic_agent_sdk/tools.py"
  ],
  "root_cause": "The tool handler does not validate empty input dictionaries, causing a KeyError when accessing required fields. This occurs when Claude generates a tool call with missing properties.",
  "suggested_fix": [
    "Add input validation in tool_handlers to check for required keys before processing",
    "Return a user-friendly error message instead of crashing",
    "Add integration tests with edge-case tool inputs"
  ],
  "estimated_effort": "medium"
}

=== METRICS ===
Total cost: $0.0342
Input tokens: 3421
Output tokens: 487
```

## Advanced Patterns

### Multi-Turn Conversations with State

Maintain state across turns by resuming sessions:

```python
import anthropic_agent_sdk
import os

client = anthropic_agent_sdk.AgentClient(api_key=os.environ["ANTHROPIC_API_KEY"])
session_id = "conversation-001"

# Turn 1
response1 = client.query(
    system="You are a helpful assistant.",
    messages=[
        {"role": "user", "content": "What is the capital of France?"}
    ],
    session_id=session_id
)

print(f"Turn 1: {response1.text}")

# Turn 2: Resume session (history is automatically loaded)
response2 = client.query(
    messages=[
        {"role": "user", "content": "Now tell me about its culture."}
    ],
    session_id=session_id
)

print(f"Turn 2: {response2.text}")
```

### Streaming Responses

Get real-time output during long operations:

**Python:**

```python
import anthropic_agent_sdk
import os

client = anthropic_agent_sdk.AgentClient(api_key=os.environ["ANTHROPIC_API_KEY"])

# Use stream() for incremental output
for event in client.stream(
    system="You are a helpful assistant.",
    messages=[
        {"role": "user", "content": "Write a long essay on AI."}
    ]
):
    if event.type == "text_delta":
        print(event.delta, end="", flush=True)
    elif event.type == "tool_call":
        print(f"\n[TOOL] {event.name}: {event.input}\n")

print()
```

### Cost Budgeting

Track cumulative costs and halt when budget is exceeded:

```python
import anthropic_agent_sdk
import os

client = anthropic_agent_sdk.AgentClient(api_key=os.environ["ANTHROPIC_API_KEY"])

budget_usd = 1.00
cumulative_cost = 0.0

messages = [
    {"role": "user", "content": "Analyze this large codebase..."}
]

while cumulative_cost < budget_usd:
    response = client.query(
        system="You are a code analyzer.",
        messages=messages
    )
    
    cumulative_cost += response.total_cost_usd
    print(f"Cost: ${response.total_cost_usd:.4f}, Cumulative: ${cumulative_cost:.4f}")
    
    if cumulative_cost >= budget_usd:
        print("Budget exceeded. Stopping.")
        break
    
    # Add response to history for next turn
    messages.append({"role": "assistant", "content": response.text})
    messages.append({"role": "user", "content": "Continue your analysis..."})
```

## Troubleshooting

### Issue: API Key Not Found

```bash
export ANTHROPIC_API_KEY="sk-your-key-here"
python agent.py
```

### Issue: MCP Server Connection Timeout

Increase timeout in client initialization:

```python
client = anthropic_agent_sdk.AgentClient(
    api_key=os.environ["ANTHROPIC_API_KEY"],
    mcp_server_timeout=30  # seconds
)
```

### Issue: Cache Not Being Used

Verify cache by inspecting response metadata:

```python
response = client.query(...)
if response.cache_read_input_tokens > 0:
    print(f"Cache HIT: {response.cache_read_input_tokens} tokens read from cache")
else:
    print("Cache MISS")
```

### Issue: Tool Handler Errors

Wrap handlers in try-except and return structured error:

```python
def safe_tool_handler(input_data):
    try:
        return process_input(input_data)
    except Exception as e:
        return json.dumps({"error": str(e)})
```

## Best Practices

1. **Always use prompt caching** — Set up large contexts with `cache_control` to minimize costs.
2. **Validate tool inputs** — Use JSON Schema constraints; let the SDK validate before calling your handler.
3. **Log hooks extensively** — Use `on_message_sent`, `on_response_received`, `on_tool_call`, `on_tool_result` to debug agent behavior.
4. **Session resumability** — Always specify `session_id` for reproducible, resumable workflows.
5. **Cost tracking** — Check `response.total_cost_usd` and `response.cache_read_input_tokens` to verify caching is active.
6. **Subagent isolation** — Pass only necessary tools to subagents; do not expose sensitive tools.
7. **Defer tool loading** — Use `defer_loading: true` for rarely-used tools to avoid cache invalidation.
8. **Test with Claude Haiku** — Use `claude-haiku-4-5-20251001` for quick iteration; upgrade to Sonnet/Opus only for complex tasks.

---

## References

- [Agent SDK overview — Claude Code Docs](https://code.claude.com/docs/en/agent-sdk/overview)
- [Agent SDK overview — Claude API Docs](https://platform.claude.com/docs/en/agent-sdk/overview)
- [Agent SDK reference — TypeScript](https://platform.claude.com/docs/en/agent-sdk/typescript)
- [Quickstart — Claude API Docs](https://platform.claude.com/docs/en/agent-sdk/quickstart)
- [Prompt caching — Claude API Docs](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)
- [Tool use with prompt caching — Claude API Docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-use-with-prompt-caching)
- [Lessons from building Claude Code: Prompt caching is everything — Claude Blog](https://claude.com/blog/lessons-from-building-claude-code-prompt-caching-is-everything)
- [Use the Claude Agent SDK with your Claude plan — Claude Help Center](https://support.claude.com/en/articles/15036540-use-the-claude-agent-sdk-with-your-claude-plan)
- [GitHub — anthropics/claude-agent-sdk-typescript](https://github.com/anthropics/claude-agent-sdk-typescript)

---


📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
