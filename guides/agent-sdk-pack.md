# Agent SDK Pack — Complete Developer Guide

The Claude Agent SDK (`claude-agent-sdk` / `@anthropic-ai/claude-agent-sdk`) is a dedicated runtime library for building autonomous agents that run the full Claude Code agent loop programmatically — outside of the interactive terminal. It is not a thin wrapper around the Messages API. It ships the loop, the built-in tools, the hook system, session persistence, permission model, and MCP integration as a first-class library you can embed in any application.

This guide is for senior engineers building production agents. It assumes you are already comfortable with the Anthropic API and Python or TypeScript.

---

## When to Use the Agent SDK vs. the Alternatives

Three tiers exist. Choose deliberately.

| Dimension | Interactive Claude Code CLI | Agent SDK | Raw Messages API |
|---|---|---|---|
| Primary use | Human developer sessions | Autonomous code in your app | One-shot API calls |
| Loop management | Handled by CLI | Handled by SDK | You write it |
| Built-in tools | Yes (Read, Write, Bash, etc.) | Yes — same set | No — you define all tools |
| CLAUDE.md / skills | Yes | Yes (configurable) | No |
| Hook system | Yes | Yes | No |
| Resumable sessions | Yes (JSONL) | Yes (JSONL) | No |
| MCP integration | Via settings.json | Via HTTP | No |
| Permissions | Interactive prompts | allow/deny/ask config | N/A |
| Prompt caching | Automatic | Must be wired explicitly | Must be wired explicitly |
| Credit pool | Interactive limits | Separate agent pool (June 2026) | API token budget |
| Latency | 2–5 s startup | ~100–300 ms first call | ~100 ms |
| Best for | Human dev work | Products, pipelines, automation | Simple retrieval, completion |

**Use the Agent SDK when:**
- You are embedding an agent in a product (not a dev terminal)
- You need the full built-in tool set without reimplementing it
- You want hooks, sessions, permissions, and MCP wired in from day one
- You are building a CI/CD step, a background worker, or a user-triggered automation

**Use the raw Messages API when:**
- You need a single completion with no tool loop
- You are building a chatbot that calls no tools or calls tools you control entirely
- Latency and token cost must be minimized to the absolute floor

**Stay in the interactive CLI when:**
- A human is driving the session
- You need live context from your local machine (git state, local services)
- You want interactive permission prompts and the ability to interrupt

---

## Installation

**Python**

```bash
pip install claude-agent-sdk
```

Requires Python 3.10+. The SDK installs `anthropic` as a dependency — you do not need to install it separately.

**TypeScript / Node.js**

```bash
npm install @anthropic-ai/claude-agent-sdk
```

Requires Node 18+. ESM and CJS both supported.

**Environment**

```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

All SDK calls authenticate via this variable unless you pass `api_key` explicitly to the client constructor.

---

## Minimal Examples

### Python

```python
from claude_agent_sdk import Agent, AgentConfig

agent = Agent(
    config=AgentConfig(
        model="claude-opus-4-7",
        system="You are a senior Python engineer. Fix bugs in the code you are given.",
        max_turns=20,
    )
)

async def main():
    async for event in agent.run("Fix the type errors in src/auth.py"):
        if event.type == "text":
            print(event.content, end="", flush=True)
        elif event.type == "tool_use":
            print(f"\n[{event.tool_name}] {event.tool_input}")
        elif event.type == "stop":
            print(f"\n[done — stop reason: {event.stop_reason}]")

import asyncio
asyncio.run(main())
```

### TypeScript

```typescript
import { Agent, AgentConfig } from "@anthropic-ai/claude-agent-sdk";

const agent = new Agent({
  config: {
    model: "claude-opus-4-7",
    system: "You are a senior Python engineer. Fix bugs in the code you are given.",
    maxTurns: 20,
  },
});

for await (const event of agent.run("Fix the type errors in src/auth.py")) {
  if (event.type === "text") {
    process.stdout.write(event.content);
  } else if (event.type === "tool_use") {
    console.log(`\n[${event.toolName}] ${JSON.stringify(event.toolInput)}`);
  } else if (event.type === "stop") {
    console.log(`\n[done — stop reason: ${event.stopReason}]`);
  }
}
```

Both examples produce the same behavior: the agent is given a task, runs the loop autonomously (reading files, editing code, running Bash commands), and streams events back to your code. You never touch the HTTP calls, tool dispatch, or continuation logic.

---

## The Agent Loop

Understanding the loop is prerequisite to using hooks, custom tools, and sessions correctly.

```
User message
    |
    v
[Model call] → text output and/or tool_use blocks
    |
    |--- if text only → emit text events → check stop condition → done or continue
    |
    |--- if tool_use:
    |       For each tool_use block (parallel by default):
    |           1. Check permissions (allow/deny/ask)
    |           2. Execute tool
    |           3. Emit tool_result
    |       Append tool_results to message history
    |       Loop back to [Model call]
    |
    v
Stop when:
    - Model returns end_turn with no tool_use
    - max_turns reached
    - A hook returns HookAction.STOP
    - Permission denied on a required tool
```

Each iteration is a full API call. The SDK manages the message history automatically — you never manually append assistant and tool_result turns.

**Parallelism:** When the model returns multiple `tool_use` blocks in one response, the SDK dispatches them concurrently by default. If you have side-effecting tools that must run sequentially, set `parallel_tool_execution=False` (Python) / `parallelToolExecution: false` (TS) in your config.

**Context window management:** The SDK tracks token usage across turns. When you approach the context limit, it summarizes earlier turns using a compact strategy (same as the Claude Code CLI's `/compact` command). You can disable this with `auto_compact=False` or inject your own summarization hook.

---

## Built-In Tools

The SDK ships the same built-in tools as the Claude Code CLI. You do not define these — they are available to the model automatically unless you explicitly exclude them.

| Tool | What it does |
|---|---|
| `Read` | Read file contents |
| `Write` | Write/overwrite a file |
| `Edit` | Precise string-replacement edits |
| `Glob` | Pattern-based file discovery |
| `Grep` | Content search across files |
| `Bash` | Execute shell commands |
| `WebSearch` | Web search |
| `WebFetch` | Fetch and parse a URL |
| `AskUserQuestion` | Pause loop, prompt human for input |
| `Agent` | Spawn a subagent |

To restrict which tools are available:

```python
# Python — allow only file tools, no Bash, no web
config = AgentConfig(
    model="claude-opus-4-7",
    tools=["Read", "Write", "Edit", "Glob", "Grep"],
)
```

```typescript
// TypeScript
const config: AgentConfig = {
  model: "claude-opus-4-7",
  tools: ["Read", "Write", "Edit", "Glob", "Grep"],
};
```

Passing an explicit `tools` list replaces the default full set. To add custom tools on top of the defaults, use the `extra_tools` parameter.

---

## Custom Tools

Define custom tools with a schema and an async handler. The SDK injects them into the model's tool list and dispatches calls to your handler automatically.

### Python

```python
from claude_agent_sdk import Agent, AgentConfig, tool
from pydantic import BaseModel

class SearchCodebaseInput(BaseModel):
    query: str
    file_pattern: str = "**/*.py"

@tool(
    name="search_codebase",
    description="Search the internal code index for semantic matches. "
                "Faster than Grep for conceptual queries.",
    input_model=SearchCodebaseInput,
)
async def search_codebase(input: SearchCodebaseInput) -> str:
    # Your implementation — call an embedding index, vector DB, etc.
    results = await my_vector_index.search(input.query, pattern=input.file_pattern)
    return "\n".join(f"{r.path}:{r.line} — {r.snippet}" for r in results)

agent = Agent(
    config=AgentConfig(model="claude-opus-4-7"),
    extra_tools=[search_codebase],
)
```

### TypeScript

```typescript
import { Agent, tool } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";

const searchCodebase = tool({
  name: "search_codebase",
  description:
    "Search the internal code index for semantic matches. Faster than Grep for conceptual queries.",
  inputSchema: z.object({
    query: z.string(),
    filePattern: z.string().default("**/*.ts"),
  }),
  handler: async ({ query, filePattern }) => {
    const results = await myVectorIndex.search(query, { pattern: filePattern });
    return results.map((r) => `${r.path}:${r.line} — ${r.snippet}`).join("\n");
  },
});

const agent = new Agent({
  config: { model: "claude-opus-4-7" },
  extraTools: [searchCodebase],
});
```

Custom tools appear in the model's tool list alongside built-in tools. The model decides when to call them based on your description — write descriptions that make the trade-off between your tool and a built-in alternative explicit.

---

## Subagents

The built-in `Agent` tool lets the primary agent spawn subagents. Each subagent gets its own isolated loop, tool set, and message history. Results flow back to the parent as a tool result.

**From the model's perspective**, calling the `Agent` tool is identical to calling any other tool. The SDK intercepts it, creates a child `Agent` instance, runs it to completion, and returns the result.

**From your code's perspective**, you configure subagent behavior via `SubagentConfig`:

```python
from claude_agent_sdk import Agent, AgentConfig, SubagentConfig

agent = Agent(
    config=AgentConfig(
        model="claude-opus-4-7",
        system="You are a senior engineer. Orchestrate subagents to complete complex refactors.",
        subagent_config=SubagentConfig(
            model="claude-sonnet-4-6",  # cheaper model for subagents
            max_turns=10,
            tools=["Read", "Write", "Edit", "Bash"],  # restrict subagent tools
        ),
    )
)
```

Use a cheaper model for subagents doing mechanical work (file reads, edits, searches). Reserve Opus for the orchestrating agent that does reasoning and planning.

Subagent spawning depth is configurable (`max_subagent_depth`, default 3). Deep nesting is rarely useful and expensive — keep orchestration shallow.

---

## Hooks

Hooks are functions that fire at lifecycle events in the agent loop. They are the primary mechanism for observability, safety enforcement, cost control, and custom routing.

### Hook Types

| Hook | When it fires | Can block/modify? |
|---|---|---|
| `SessionStart` | Before the first model call | No |
| `UserPromptSubmit` | When a user message enters the loop | Yes — can rewrite the message |
| `PreToolUse` | Before each tool execution | Yes — can block or modify input |
| `PostToolUse` | After each tool execution | Yes — can modify the result |
| `Stop` | When the agent loop ends | No |
| `SessionEnd` | After cleanup | No |

### Python

```python
from claude_agent_sdk import Agent, AgentConfig, HookAction
from claude_agent_sdk.hooks import PreToolUseHook, PostToolUseHook, StopHook

class AuditHook(PreToolUseHook):
    async def run(self, tool_name: str, tool_input: dict) -> HookAction:
        # Log every tool call to your audit system
        await audit_log.record(tool=tool_name, input=tool_input)

        # Block writes to protected paths
        if tool_name in ("Write", "Edit") and is_protected(tool_input.get("path", "")):
            return HookAction.deny(reason=f"Write to protected path blocked: {tool_input['path']}")

        return HookAction.allow()

class CostGuardHook(StopHook):
    async def run(self, session_stats: dict) -> None:
        if session_stats["total_tokens"] > 500_000:
            await alert_slack(f"Agent session exceeded 500k tokens: {session_stats}")

agent = Agent(
    config=AgentConfig(model="claude-opus-4-7"),
    hooks=[AuditHook(), CostGuardHook()],
)
```

### TypeScript

```typescript
import {
  Agent,
  HookAction,
  type PreToolUseHook,
  type StopHook,
} from "@anthropic-ai/claude-agent-sdk";

const auditHook: PreToolUseHook = {
  async run(toolName, toolInput) {
    await auditLog.record({ tool: toolName, input: toolInput });

    if (
      ["Write", "Edit"].includes(toolName) &&
      isProtected(toolInput.path ?? "")
    ) {
      return HookAction.deny(`Write to protected path blocked: ${toolInput.path}`);
    }

    return HookAction.allow();
  },
};

const agent = new Agent({
  config: { model: "claude-opus-4-7" },
  hooks: [auditHook],
});
```

### PostToolUse — Modifying Results

```python
class RedactSecrets(PostToolUseHook):
    async def run(self, tool_name: str, tool_input: dict, tool_result: str) -> str:
        if tool_name == "Read":
            return redact_env_vars(tool_result)
        return tool_result
```

`PostToolUse` hooks receive the raw tool output and can return a modified version. The modified result is what the model sees in its context — not the raw output. Use this for redaction, truncation, or result normalization.

---

## Sessions and Resumability

Sessions serialize the agent's state to JSONL so execution can resume after interruption. This is essential for long-running agents (CI pipelines, overnight runs) and for debugging.

### Saving a Session

```python
from claude_agent_sdk import Agent, AgentConfig, Session

agent = Agent(config=AgentConfig(model="claude-opus-4-7"))

session = Session(path="/tmp/refactor-session.jsonl")

async for event in agent.run("Refactor the authentication module", session=session):
    print(event)
    # Session state is written to disk after each turn automatically
```

If the process crashes mid-run, `/tmp/refactor-session.jsonl` contains every completed turn.

### Resuming a Session

```python
session = Session(path="/tmp/refactor-session.jsonl", resume=True)

# The agent reconstructs message history from the JSONL
# and continues from where it stopped
async for event in agent.run("Continue the refactor", session=session):
    print(event)
```

When `resume=True`, the SDK replays the JSONL into the message history before calling the model. The model sees the full prior context and continues naturally.

### Session Introspection

```python
session = Session(path="/tmp/refactor-session.jsonl")
print(session.turns)         # number of completed turns
print(session.total_tokens)  # cumulative token usage
print(session.last_stop_reason)  # why the last session ended
```

Sessions are append-only JSONL — safe to tail with `tail -f` for live monitoring.

---

## Permissions and Safety

The permission system controls which tool calls the agent can make without human approval. Configure it at the `AgentConfig` level.

### Permission Modes

```python
from claude_agent_sdk import AgentConfig, PermissionMode

config = AgentConfig(
    model="claude-opus-4-7",
    permissions={
        # Always allow — no prompt, no log check
        "allow": [
            "Read(**)",
            "Grep(**)",
            "Glob(**)",
            "Bash(git status)",
            "Bash(git log *)",
            "Bash(git diff *)",
        ],
        # Always deny — blocked outright, returned as error
        "deny": [
            "Bash(rm -rf *)",
            "Write(/etc/*)",
            "Write(/usr/*)",
        ],
        # Ask human — AskUserQuestion fires automatically
        "ask": [
            "Bash(*)",
            "Write(*)",
        ],
    },
    permission_mode=PermissionMode.STRICT,  # deny anything not in allow/ask/deny
)
```

`PermissionMode.STRICT` rejects any tool call not explicitly listed. `PermissionMode.PERMISSIVE` (default) allows unlisted calls through. Use `STRICT` in production agents that operate on sensitive infrastructure.

Permission patterns support globs. `Bash(git *)` matches any Bash call whose command starts with `git`. `Write(/home/deploy/*)` matches any Write to that directory tree.

### Handling Ask Responses

When a tool matches the `ask` list, the SDK fires `AskUserQuestion` automatically. In a headless application you will want to handle this:

```python
from claude_agent_sdk.hooks import PreToolUseHook, HookAction

class AutoApproveReadonly(PreToolUseHook):
    async def run(self, tool_name: str, tool_input: dict) -> HookAction:
        # Auto-approve safe operations in headless mode
        if tool_name in ("Read", "Glob", "Grep"):
            return HookAction.allow()
        # For Bash, inspect before allowing
        if tool_name == "Bash":
            cmd = tool_input.get("command", "")
            if any(cmd.startswith(safe) for safe in ["git ", "pytest ", "python -m "]):
                return HookAction.allow()
        # Default: deny and log for manual review
        await review_queue.push(tool_name=tool_name, input=tool_input)
        return HookAction.deny("Queued for manual review")
```

---

## MCP Integration

The SDK connects to MCP servers over HTTP. Configuration mirrors the Claude Code CLI's `settings.json` format.

```python
from claude_agent_sdk import Agent, AgentConfig, MCPServer

agent = Agent(
    config=AgentConfig(
        model="claude-opus-4-7",
        mcp_servers=[
            MCPServer(
                name="github",
                url="https://mcp.example.com/github",
                api_key_env="GITHUB_MCP_KEY",
            ),
            MCPServer(
                name="postgres",
                url="http://localhost:5432/mcp",
                transport="http",
            ),
        ],
    )
)
```

MCP tools appear in the model's tool list with the server name as a prefix (e.g., `github__create_pr`, `postgres__query`). The model calls them like any built-in tool. The SDK handles HTTP dispatch, authentication, and result formatting.

**Authentication options:**
- `api_key_env` — read the key from an environment variable (recommended)
- `api_key` — pass the key directly (avoid in production — use env vars)
- `headers` — arbitrary HTTP headers for custom auth schemes

**MCP + permissions:** MCP tool calls go through the same permission system. Add MCP tool names to your allow/deny/ask lists using their prefixed names:

```python
"allow": ["github__list_prs", "github__get_pr"],
"ask": ["github__create_pr", "github__merge_pr"],
"deny": ["github__delete_repo"],
```

---

## Prompt Caching

Applications built with the Agent SDK must use prompt caching. Without it, long system prompts and CLAUDE.md content are re-tokenized on every API call in the loop — at scale this is a significant and avoidable cost.

The SDK does not enable caching automatically. Wire it explicitly via `cache_config`:

```python
from claude_agent_sdk import AgentConfig, CacheConfig

config = AgentConfig(
    model="claude-opus-4-7",
    system=long_system_prompt,  # e.g., your CLAUDE.md content + instructions
    cache_config=CacheConfig(
        # Cache breakpoints are inserted automatically at:
        # 1. The end of the system prompt
        # 2. The end of tools definitions
        # 3. The last user message (for multi-turn caching)
        auto_breakpoints=True,
        min_cache_tokens=1024,  # only cache blocks above this threshold
    ),
)
```

With `auto_breakpoints=True`, the SDK inserts `cache_control: {"type": "ephemeral"}` markers at the optimal positions (system prompt tail, tool list tail, and rolling conversation tail).

**Cache hit rates in practice:**
- System prompt: near 100% after the first call in a session
- Tool definitions: near 100% — they do not change between turns
- Conversation history: hits from turn 2 onward for static prefix content

For a 50-turn agent session with a 4,000-token system prompt, caching typically reduces input token costs by 40–60%. At Opus pricing, this is significant.

**Manual breakpoints** (when you need precise control):

```python
from claude_agent_sdk import CacheBreakpoint

config = AgentConfig(
    model="claude-opus-4-7",
    system=[
        {"type": "text", "text": stable_instructions},
        CacheBreakpoint(),                           # cache everything above here
        {"type": "text", "text": dynamic_context},  # not cached — changes per run
    ],
)
```

---

## Cloud Provider Deployment

The SDK reads provider environment variables to route API calls to Bedrock, Vertex, or Foundry. No code changes required — only environment configuration.

### AWS Bedrock

```bash
export CLAUDE_CODE_USE_BEDROCK=1
export AWS_REGION=us-east-1
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
# Or use an IAM role — the SDK uses boto3 credential chain
```

The SDK automatically uses the Bedrock endpoint when `CLAUDE_CODE_USE_BEDROCK=1` is set. Model IDs are mapped automatically — you still pass `model="claude-opus-4-7"` in your code.

### Google Vertex AI

```bash
export CLAUDE_CODE_USE_VERTEX=1
export CLOUD_ML_REGION=us-east5
export ANTHROPIC_VERTEX_PROJECT_ID=your-gcp-project-id
# gcloud auth application-default login
```

### AWS Bedrock with explicit cross-account role

```python
import boto3
from claude_agent_sdk import Agent, AgentConfig

session = boto3.Session(
    aws_access_key_id="...",
    aws_secret_access_key="...",
    aws_session_token="...",
    region_name="us-east-1",
)

agent = Agent(
    config=AgentConfig(model="claude-opus-4-7"),
    bedrock_session=session,  # override the default credential chain
)
```

### Anthropic Foundry

```bash
export ANTHROPIC_FOUNDRY_URL=https://your-foundry-endpoint.example.com
export ANTHROPIC_API_KEY=sk-ant-...
```

Foundry endpoints behave identically to the standard API — same SDK, same model names, same event format. Switch between Foundry and standard by toggling the environment variable.

---

## Cost Model — June 2026 Update

As of June 15, 2026, Agent SDK sessions draw from a **separate monthly credit pool** that is independent of your interactive Claude Code terminal limits and your Claude.ai chat limits.

Practical implications:
- Running a long autonomous agent overnight does not consume your interactive quota
- The agent pool has its own monthly limit — monitor it separately in the Anthropic console
- Subagents spawned by the SDK also draw from the agent pool, not the interactive pool
- Managed Agents (`client.beta.sessions.create`) and Agent SDK sessions share the same pool

Pool usage is visible at console.anthropic.com → Usage → Agent SDK.

If you exceed the agent pool, calls return a `429` with `error_code: "agent_credit_exceeded"`. Handle this in production:

```python
from claude_agent_sdk.exceptions import AgentCreditExceeded

try:
    async for event in agent.run(task):
        process(event)
except AgentCreditExceeded:
    await alert_oncall("Agent SDK credit pool exhausted — check Anthropic console")
    raise
```

---

## End-to-End Example: Autonomous Code-Fixing Agent

A realistic production agent that monitors a CI failure queue, pulls failing test output, identifies the root cause, applies a fix, and opens a pull request.

```python
# fix_agent.py
import asyncio
import os
from dataclasses import dataclass

from claude_agent_sdk import Agent, AgentConfig, CacheConfig, MCPServer, Session
from claude_agent_sdk import HookAction, PermissionMode
from claude_agent_sdk.hooks import PreToolUseHook, PostToolUseHook, StopHook

# --- System prompt (long, stable — prime caching candidate) ---
SYSTEM = """
You are an autonomous code-fixing agent. Your job:
1. Read the failing test output provided to you.
2. Locate the source of the failure — read the relevant files.
3. Apply the minimal correct fix — do not refactor unrelated code.
4. Run the tests to verify the fix.
5. Open a pull request via the github MCP tool with a clear description.

Rules:
- Never modify test files unless the test itself is wrong and you can prove it.
- Never modify lock files, generated files, or vendor directories.
- If you cannot find a clear fix in 10 tool calls, stop and write a detailed diagnosis instead.
- Your PR title must start with "fix: ".
""".strip()


# --- Hooks ---

class SafetyHook(PreToolUseHook):
    BLOCKED_PATTERNS = [
        "rm -rf",
        "git push --force",
        "DROP TABLE",
        "truncate",
    ]

    async def run(self, tool_name: str, tool_input: dict) -> HookAction:
        if tool_name == "Bash":
            cmd = tool_input.get("command", "")
            for pattern in self.BLOCKED_PATTERNS:
                if pattern in cmd:
                    return HookAction.deny(f"Blocked dangerous command pattern: {pattern!r}")
        if tool_name in ("Write", "Edit"):
            path = tool_input.get("path", "")
            for protected in ("vendor/", "node_modules/", ".git/", "package-lock.json"):
                if protected in path:
                    return HookAction.deny(f"Blocked write to protected path: {path}")
        return HookAction.allow()


class AuditHook(PostToolUseHook):
    def __init__(self, run_id: str):
        self.run_id = run_id
        self.calls: list[dict] = []

    async def run(self, tool_name: str, tool_input: dict, tool_result: str) -> str:
        self.calls.append({"tool": tool_name, "input": tool_input})
        return tool_result  # pass through unmodified


class BudgetHook(StopHook):
    async def run(self, session_stats: dict) -> None:
        tokens = session_stats.get("total_tokens", 0)
        cost_usd = tokens / 1_000_000 * 15  # rough Opus input cost
        if cost_usd > 5.0:
            import logging
            logging.warning(f"Fix agent session cost ~${cost_usd:.2f} ({tokens:,} tokens)")


# --- Agent factory ---

def build_fix_agent(run_id: str) -> Agent:
    audit = AuditHook(run_id=run_id)

    return Agent(
        config=AgentConfig(
            model="claude-opus-4-7",
            system=SYSTEM,
            max_turns=30,
            cache_config=CacheConfig(auto_breakpoints=True, min_cache_tokens=1024),
            permission_mode=PermissionMode.STRICT,
            permissions={
                "allow": [
                    "Read(**)",
                    "Glob(**)",
                    "Grep(**)",
                    "Bash(git status)",
                    "Bash(git diff *)",
                    "Bash(git log *)",
                    "Bash(git checkout -b *)",
                    "Bash(git add *)",
                    "Bash(git commit *)",
                    "Bash(pytest *)",
                    "Bash(python -m pytest *)",
                    "Bash(npm test *)",
                ],
                "ask": [
                    "Write(*)",
                    "Edit(*)",
                    "Bash(git push *)",
                ],
                "deny": [
                    "Bash(rm -rf *)",
                    "Bash(git push --force*)",
                    "Bash(git reset --hard *)",
                ],
            },
            mcp_servers=[
                MCPServer(
                    name="github",
                    url=os.environ["GITHUB_MCP_URL"],
                    api_key_env="GITHUB_MCP_KEY",
                )
            ],
            subagent_config={
                "model": "claude-sonnet-4-6",
                "max_turns": 10,
                "tools": ["Read", "Grep", "Glob", "Bash"],
            },
        ),
        hooks=[SafetyHook(), audit, BudgetHook()],
    )


# --- Task runner ---

@dataclass
class CIFailure:
    repo: str
    branch: str
    run_id: str
    test_output: str


async def fix_ci_failure(failure: CIFailure) -> bool:
    session_path = f"/tmp/fix-sessions/{failure.run_id}.jsonl"
    os.makedirs("/tmp/fix-sessions", exist_ok=True)

    agent = build_fix_agent(run_id=failure.run_id)
    session = Session(path=session_path)

    task = f"""
Repository: {failure.repo}
Branch: {failure.branch}

Failing test output:
---
{failure.test_output}
---

Fix the failure and open a pull request targeting main.
"""

    success = False
    async for event in agent.run(task, session=session):
        if event.type == "text":
            print(event.content, end="", flush=True)
        elif event.type == "tool_use":
            print(f"\n  [{event.tool_name}]", flush=True)
        elif event.type == "stop":
            success = event.stop_reason == "end_turn"
            print(f"\n[stop: {event.stop_reason}]")

    return success


# --- Entry point ---

async def main():
    # In production, pull from a queue (SQS, Redis, etc.)
    failure = CIFailure(
        repo="my-org/my-repo",
        branch="feature/user-auth",
        run_id="ci-run-20260602-001",
        test_output=open("/tmp/test-output.txt").read(),
    )

    fixed = await fix_ci_failure(failure)
    exit(0 if fixed else 1)


if __name__ == "__main__":
    asyncio.run(main())
```

This agent:
- Uses `STRICT` permissions so no unlisted tool call goes through silently
- Puts dangerous operations (writes, pushes) in `ask` so they require hook approval
- Caches the system prompt across all turns (significant cost saving over 30 turns)
- Persists session state to JSONL so a crash mid-run can be resumed
- Uses Sonnet for subagents to reduce cost on mechanical subtasks
- Connects to GitHub via MCP for PR creation without shell-level git credentials
- Audits every tool call for compliance review

---

## Deployment Checklist

Before shipping an Agent SDK application to production:

- [ ] `CacheConfig(auto_breakpoints=True)` is set — do not pay for repeated system prompt tokenization
- [ ] `PermissionMode.STRICT` is set — do not allow arbitrary tool calls through in production
- [ ] `PreToolUseHook` blocks dangerous Bash patterns — `rm -rf`, force pushes, database drops
- [ ] Sessions write to durable storage (not `/tmp`) — use S3, GCS, or a mounted volume
- [ ] `AgentCreditExceeded` is caught and alerted — the agent pool is separate and can exhaust
- [ ] `max_turns` is set conservatively — an uncapped agent loop is an unbounded cost
- [ ] Cloud provider env vars are set via secrets manager — not hardcoded
- [ ] MCP `api_key_env` references env variables — not inline strings
- [ ] Subagents use a cheaper model — reserve Opus for orchestration, Sonnet for execution
- [ ] `StopHook` logs token usage per session — necessary for cost attribution

---


📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
