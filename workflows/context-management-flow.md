# Context Management Decision Flow

A structured decision process for choosing the right action at each turn boundary to preserve context quality and session cost. The wrong choice degrades output quality; the right choice keeps the session efficient.

---

## When to use

Apply this framework when you notice any of the following signals:
- Responses getting slower or more repetitive
- Claude losing track of earlier decisions
- Token count approaching a threshold where compaction or a new session becomes worthwhile
- Finishing a major task and starting something unrelated

---

## The 5 Options

### 1. Continue

**Default action.** Take no special action — just send the next message.

**Use when:**
- Claude is on the right track and making progress
- Context is fresh (rough guideline: under 200k tokens)
- No failed implementation attempts have accumulated in the context
- The next task is directly related to the current work

**Cost implication:** Each turn consumes tokens proportional to the full context window. Continue is cheap per turn when the context is small; expensive when it is large.

---

### 2. Rewind (`Esc+Esc` or `/rewind`)

Undo the last turn or several turns. Drops the assistant's response(s) but keeps the prior context state — file reads, earlier reasoning, and context loaded before the bad turn remain.

**Use when:**
- Claude went down a wrong path in the last turn
- You want to keep the useful codebase exploration that happened earlier in the session but discard a failed implementation attempt
- The mistake is recent and shallow — rewinding one or two turns is sufficient to recover

**What it is not:** a way to undo file system changes. Rewind removes assistant turns from context but does not undo writes Claude made to disk. Revert those separately if needed.

**Best for:** recovering from a bad approach without losing the useful exploration context that preceded it.

---

### 3. Directed Compact (`/compact <hint>`)

Compress the current context into a summary, then continue. The `<hint>` tells the compaction step what matters — without it, compaction may lose critical context.

**Use when:**
- Context is getting long (rough guideline: 300k+ tokens on a 1M-token model) but you are mid-task and want to continue in the same session
- You have accumulated a lot of intermediate reasoning, file reads, and debugging output that is no longer needed
- The core task state is still active and you do not want to brief a fresh session

**Hint examples:**
```
/compact keep auth refactor context, drop the test debugging
/compact preserve the data model decisions and API contract, drop the installation steps
/compact focus on the migration plan, nothing else matters now
```

**Without a hint:** compaction uses heuristics that may discard decisions that are still load-bearing. Always pass a hint for complex sessions.

**Empirical threshold:** context quality on the 1M model begins to degrade noticeably around 300–400k tokens for tasks requiring precise recall of earlier decisions. Below that, continue unless cost is a concern.

---

### 4. Fresh Session

Start a new `claude` invocation. No context carried over.

**Use when:**
- The current task is complete and you are starting something unrelated
- The session has accumulated too many dead-ends and failed attempts — the noise outweighs the useful context
- You want a clean slate with only CLAUDE.md and explicitly referenced files as context
- Context is very large and you can reconstruct the necessary state faster by briefing a new session than by compacting

**Do not use:** to continue work mid-task unless the current session is irreparably corrupted. The cost of re-establishing context is non-trivial for complex tasks.

---

### 5. Subagent

Spawn an Agent tool call for a bounded subtask. The subagent runs with its own context window; intermediate reasoning does not appear in the parent session.

**Use when:**
- You need the result of a specific operation (e.g., "read these 10 files and return a summary") but do not need the intermediate steps in your main context
- The task has a clear, bounded input and a well-defined output
- You want to keep your main session's context clean and focused

**What it is not:** a replacement for a full session when the subtask requires ongoing back-and-forth.

---

## Decision table

| Signal | Recommended action |
|---|---|
| Last turn went wrong, rest of session is good | Rewind |
| Context > 300k tokens, mid-task | `/compact <hint>` |
| Context > 300k tokens, task complete | Fresh session |
| Starting an unrelated task | Fresh session |
| Need isolated subtask result | Subagent |
| None of the above | Continue |

---

## Cost implications

- **Continue** — cheapest per-turn when context is small; most expensive when context is large (every turn re-sends the full window)
- **Compact** — one expensive compaction turn, then cheaper turns on the compressed context; worthwhile when you have 5+ turns remaining
- **Rewind** — free; just drops context from memory
- **Fresh session** — zero carry-over cost; you pay only for what you explicitly load
- **Subagent** — isolated cost; parent session is not billed for the subagent's context

---

## When NOT to compact

- Mid-debugging session where the error trace and earlier hypothesis are both still relevant — compaction may summarise these into ambiguity
- When you are about to finish the task anyway (1–2 turns left) — not worth the compaction overhead
- When the hint would need to be so detailed that writing it takes longer than briefing a fresh session

---
