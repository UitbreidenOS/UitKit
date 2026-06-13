# 30-50% Token Cost Reduction

Practical strategies for cutting Claude Code and Claude API token spend, each with the mechanism, implementation steps, and realistic savings estimate. No speculative advice — every strategy here has a measurable effect.

---

## Baseline: where tokens go

Before optimizing, know what you're paying for. Token spend in a typical Claude Code session breaks down roughly as:

| Source | Approximate share |
|---|---|
| System prompt + CLAUDE.md (every turn) | 10–30% |
| Conversation history (grows per turn) | 20–40% |
| File contents read into context | 20–40% |
| Output tokens | 10–20% |

The highest-leverage strategies target the largest categories first.

---

## Strategy 1: Prompt caching

**Mechanism:** Mark static content (system prompt, CLAUDE.md, large reference documents) as cacheable. Claude stores these for 5 minutes (ephemeral) or 1 hour (extended). Cache hits cost 0.1× the normal input price.

**Savings:** 60–90% on cached tokens for repeated calls. In practice, 20–40% of total session cost.

**Implementation (API):**

```typescript
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-6',
  system: [
    {
      type: 'text',
      text: largeSystemPrompt,
      cache_control: { type: 'ephemeral' }  // 5-minute TTL
    }
  ],
  messages: conversationHistory
})
```

**Cache breakpoint placement:**
- Place breakpoints at the end of content that stays static between turns
- System prompt → cacheable always
- CLAUDE.md content injected as context → cacheable
- File contents that won't change this session → cacheable
- Conversation history → do NOT cache (changes every turn)

**Extended cache (1-hour TTL):** Use `{ type: 'ephemeral', ttl: 3600 }` for documents referenced across multiple sessions (large codebases, long specifications).

**Gotchas:**
- Minimum cacheable block is 1024 tokens (Haiku) or 2048 tokens (Sonnet/Opus)
- Cache is per-model — switching models invalidates the cache
- Content must be byte-identical to hit the cache — even a whitespace change misses

---

## Strategy 2: Haiku for mechanical tasks

**Mechanism:** Haiku costs roughly 60% less than Sonnet per token. Tasks that require mechanical transformation (translation, classification, extraction, formatting) produce equivalent quality on Haiku with no meaningful degradation.

**Savings:** 50–65% on task types below vs. running them on Sonnet.

**Use Haiku for:**
- Translations (language localization — see Claudient's translation pipeline)
- Classifying a task or routing to a specialist
- Extracting structured data from text (JSON from unstructured content)
- Simple reformatting (markdown → HTML, JSON → CSV)
- Watchdog agents (observing, not reasoning)
- Generating test data or fixture files

**Use Sonnet for:**
- Code generation and review
- Architectural reasoning
- Debugging non-trivial bugs
- Any task requiring judgment about trade-offs

**Use Opus for:**
- High-stakes decisions that are costly to undo
- Complex multi-step reasoning across large codebases
- Research requiring deep synthesis

**Implementation in Claude Code:**

Set model per agent in your workflow:
```
Spawn translation agent using claude-haiku-4-5:
  Translate the following file into French...
```

Or configure in `settings.json` for specific slash commands to default to Haiku.

---

## Strategy 3: Batch API

**Mechanism:** The Anthropic Batch API processes requests asynchronously with a 50% discount. Requests complete within 24 hours (usually much faster).

**Savings:** 50% flat discount on batch-eligible work.

**When to use:**
- Bulk translation of many files
- Running the same prompt across many inputs (analyzing 100 PRs, summarizing 50 tickets)
- Non-time-sensitive data extraction
- Generating test fixtures or seed data at scale

**When NOT to use:**
- Interactive sessions (you need a response now)
- Tasks where the output of one request feeds the next
- Single requests — batch overhead is not worth it under ~10 requests

**Implementation:**
```python
batch = anthropic.messages.batches.create(
  requests=[
    {
      "custom_id": f"translate-{filename}",
      "params": {
        "model": "claude-haiku-4-5",
        "max_tokens": 4096,
        "messages": [{"role": "user", "content": file_content}]
      }
    }
    for filename, file_content in files_to_translate.items()
  ]
)
# poll batch.id until complete, then retrieve results
```

---

## Strategy 4: Programmatic tool calling (PTC)

**Mechanism:** When an agent makes multiple sequential tool calls, each round-trip includes the full conversation history. PTC (also called tool streaming or parallel tool calling) batches multiple tool calls in a single turn, reducing the number of history-bearing round-trips.

**Savings:** Up to 37% fewer input tokens for multi-tool workflows.

**When it applies:**
- Agents that read 3+ files before doing anything
- Investigation tasks that query multiple data sources
- Any workflow with a "gather then act" structure

**Implementation:**
```typescript
// Instead of: read file A → get result → read file B → get result → read file C
// Use: request all three reads in one turn
const tools = [readFileTool, readFileTool, readFileTool]
// Claude returns all three in a single response; you process them together
```

In Claude Code, this is handled automatically when you instruct Claude to read multiple files simultaneously rather than one at a time:
```
Read all of the following files before responding: [list files]
```

---

## Strategy 5: Deferred tool loading

**Mechanism:** Instead of loading every tool's full schema at the start of a session, load only the schemas needed for the current task. Tool schemas consume input tokens on every turn.

**Savings:** 85% reduction in tool-schema token overhead for large tool catalogs.

**Applies when:** You have 10+ MCP tools registered or a large custom tool catalog.

**Implementation with ToolSearch:**
```
Do not load all tools at session start.
Load only [specific tools] for this task.
When the task changes, load [different tool set].
```

In MCP config, avoid registering every server globally — use project-level MCP configs so only relevant tools are active per project.

---

## Strategy 6: Output length control

**Mechanism:** Output tokens cost the same as input tokens (or more on some models). Verbose responses waste money and slow down sessions.

**Savings:** 15–30% on output-heavy sessions.

**CLAUDE.md instructions to add:**
```
When responding to me:
- Give me the answer, not the reasoning, unless I ask for reasoning
- No preamble ("Sure, I'll help you with that...")
- No summary at the end repeating what was just done
- Code blocks: no prose before or after unless the prose adds information
- Lists: use when there are 3+ items; prose for 1-2
- One sentence is better than one paragraph when both convey the same information
```

**API-level control:**
```typescript
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 1024,  // set an upper bound appropriate to the task
  system: "Be concise. Answer directly. No preamble.",
  messages: [...]
})
```

---

## Strategy 7: Context pruning

**Mechanism:** Conversation history grows with every turn. After a long session, history can dominate input token count.

**Tactics:**

`/compact` with a hint (Claude Code built-in):
```
/compact Focus on the authentication changes we made — discard everything about the UI discussion
```

Subagent isolation — spawn a subagent for a subtask so it starts with a fresh context window:
```
The parent agent passes only a one-paragraph summary of the session to the subagent,
not the full history. Subagent does its work and returns results to parent.
```

Explicit context drops:
```
Forget the file analysis we did on orders.ts — it's no longer relevant. 
Proceeding focus on the payments module only.
```

---

## Strategy 8: CLAUDE.md size impact

**Mechanism:** CLAUDE.md is loaded at the start of every Claude Code session. Every line you add costs tokens on every session start, for every user.

**Savings:** Varies with file size. A 300-line CLAUDE.md trimmed to 150 lines saves ~150 tokens × sessions per month.

**Target:** Keep CLAUDE.md under 2000 tokens (roughly 150–180 lines of dense prose or 250 lines of mixed content).

**Use the context-auditor prompt** (`prompts/task-specific/context-auditor.md`) to trim your CLAUDE.md without losing unique guidance.

**Rules for CLAUDE.md economy:**
- One instruction per line where possible
- No explanations of why a convention exists (just the convention)
- No instructions Claude follows by default (no "write clean code")
- Use links to external docs rather than embedding them

---

## Cost calculator reference

Approximate costs at May 2026 pricing. Check Anthropic's pricing page for current rates.

| Model | Input ($/MTok) | Output ($/MTok) | Cache hit ($/MTok) |
|---|---|---|---|
| Haiku 4.5 | ~$0.80 | ~$4.00 | ~$0.08 |
| Sonnet 4.6 | ~$3.00 | ~$15.00 | ~$0.30 |
| Opus 4.7 | ~$15.00 | ~$75.00 | ~$1.50 |

**Example session cost calculation:**

10 turns, 5k tokens input per turn (including 2k cached system prompt), 500 tokens output per turn, Sonnet:

- Without caching: 10 × 5000 × $0.000003 + 10 × 500 × $0.000015 = $0.15 + $0.075 = **$0.225**
- With caching (2k tokens cached): 10 × 3000 × $0.000003 + 10 × 2000 × $0.0000003 + 10 × 500 × $0.000015 = $0.09 + $0.006 + $0.075 = **$0.171** — 24% saving

**Combined strategy impact:**

| Strategy | Savings | Complexity |
|---|---|---|
| Prompt caching | 20–40% | Low |
| Haiku for mechanical tasks | 50–65% on eligible tasks | Low |
| Batch API | 50% flat | Medium |
| PTC / parallel tool calls | Up to 37% on tool-heavy sessions | Low |
| Deferred tool loading | Up to 85% on schema overhead | Medium |
| Output length control | 15–30% | Low |
| Context pruning | 10–25% on long sessions | Low |
| CLAUDE.md trimming | 5–15% | One-time |

Applying all low-complexity strategies together typically achieves 30–50% total cost reduction without changing the quality of results.

---
