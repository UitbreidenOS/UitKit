# MCP: Sequential Thinking

Structured step-by-step reasoning server that forces Claude to think through complex problems methodically before answering, significantly reducing errors on multi-step tasks.

## Why you need this

Claude's default behavior on hard problems is to answer immediately, which can produce confident-sounding but incomplete reasoning. Sequential Thinking changes the mechanics:
- Each reasoning step is explicit, numbered, and builds on the previous one
- The model can revise earlier steps if it discovers a contradiction — reasoning is not locked in
- Complex architecture decisions, debugging chains, and migration plans benefit from the constraint
- The structured output is auditable — you can see exactly where the reasoning went and challenge any step

## Installation

```bash
npm install -g @modelcontextprotocol/server-sequential-thinking
```

## Configuration

Add to `~/.claude.json` or project `.claude/mcp.json`:

```json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}
```

No environment variables or API keys required.

## Key tools / What it does

**`sequentialThinking`** — the single tool this server exposes. It drives a structured chain-of-thought process.

Parameters:
- `thought` — the content of the current reasoning step
- `nextThoughtNeeded` — boolean; `true` if more steps are needed, `false` when the conclusion is reached
- `thoughtNumber` — the current step index (1-based)
- `totalThoughts` — estimated total steps (can be revised mid-process)
- `isRevision` — optional boolean; marks a step as a correction to an earlier one
- `revisesThought` — optional; the step number being revised

The server manages the chain and returns the accumulated reasoning at each step. Claude uses it internally to work through problems before surfacing an answer.

## Usage examples

```
Use sequential thinking to plan the migration of our auth system
from JWT to session-based tokens. Consider rollback strategy,
session storage options, and backward compatibility.
```

```
Think step by step: should this service be a separate microservice
or a module inside the monolith? Consider team size, deployment
frequency, data coupling, and failure isolation.
```

```
Sequential thinking: what are all the edge cases we need to handle
for the payment webhook processing flow? Include retry logic,
idempotency, partial failures, and clock skew.
```

```
Work through the debugging steps for this intermittent test failure
that only appears in CI. Start from what we know and reason through
what could differ between local and CI environments.
```

```
Use sequential thinking to review this database schema change
and identify every downstream system that will need updating.
```

## Authentication

No authentication required. Sequential Thinking is a local process — it runs entirely on your machine and makes no external API calls. The only network activity in your session is Claude's normal API calls.

## Tips

**Best use cases:** Architecture decisions, complex debugging, migration planning, risk analysis, and any task where "what am I missing?" is a real concern. The structured output makes it easy to spot gaps.

**Pairs with explicit prompting:** Combine with phrases like "think step by step before answering" or "consider all edge cases" for maximum effect. The server enforces structure; your prompt guides what to reason about.

**Latency trade-off:** Sequential thinking adds 2–5 seconds per reasoning chain depending on complexity. Reserve it for problems where correctness matters more than speed — don't use it for simple lookups or single-step tasks.

**Revision steps are valuable:** When Claude marks a step as a revision, pay attention. It means the reasoning discovered an error or contradiction mid-chain. These are often the most important insights.

**Readable output:** Ask Claude to present the final reasoning chain as a numbered list after the tool finishes. The raw tool output is structured JSON — the reformatted version is easier to review and share.

**Not a substitute for domain knowledge:** Sequential Thinking improves the structure and completeness of reasoning. It doesn't add information Claude doesn't have. If the problem requires current external data, pair it with web search or retrieval tools.

---
