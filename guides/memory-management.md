# Memory Management Guide

How to persist context across sessions, survive compaction, and keep Claude's working memory sharp.

---

## The Memory Problem

Claude Code has no persistent memory between sessions by default. Every new session starts fresh. Within a session, context grows until compaction fires — at which point the conversation history is compressed and some detail is lost.

The result without a memory strategy: Claude re-asks questions you've already answered, forgets project conventions you've explained, and loses track of decisions made earlier in long sessions.

Memory management is the practice of explicitly controlling what Claude knows, when it knows it, and how that knowledge survives across session boundaries.

---

## The Four Memory Layers

| Layer | Where | Persists across sessions | Persists across compaction |
|---|---|---|---|
| **CLAUDE.md** | Project root | Yes | Yes |
| **Session files** | `.claude/memory/` or `.tmp/` | Yes (if you save) | Yes (if saved before compact) |
| **Context window** | In-session only | No | No (compressed) |
| **Subagent context** | Per-subagent | No | No |

---

## 1. CLAUDE.md as Permanent Memory

`CLAUDE.md` is read at the start of every session. It is the most reliable memory layer — anything here is always available.

**What belongs in CLAUDE.md:**
- Project architecture overview (one paragraph, not exhaustive)
- Conventions that Claude would get wrong without guidance (naming, patterns, stack choices)
- Decisions that have already been made and should not be relitigated
- Things Claude should never do in this project

**What does NOT belong in CLAUDE.md:**
- In-progress work or task state (changes too fast, becomes stale)
- Long explanations of how technologies work (Claude knows this already)
- Everything — CLAUDE.md over 500 lines starts costing more than it saves

**Example CLAUDE.md memory section:**
```markdown
## Decisions (do not re-discuss)
- Auth: JWT with 15-minute access tokens, 7-day refresh tokens. Not sessions.
- ORM: raw SQL with pg. No Prisma, no Drizzle — decided March 2026.
- Error format: `{ error: string, code: string }` — never change shape.

## Conventions
- All API routes return 204 (not 200) for successful mutations with no body.
- Database column names are snake_case; JS/TS properties are camelCase.
- No barrel files (index.ts re-exports). Import directly from the source file.
```

---

## 2. Session Files for Working Memory

For in-progress context that doesn't belong in CLAUDE.md permanently, use session files.

**Pattern:**
```
.claude/
└── memory/
    ├── current-task.md       ← what you're working on right now
    ├── decisions.md          ← decisions made this week (rotate out to CLAUDE.md or delete)
    └── context-dump.md       ← background Claude needed for a long task
```

At the start of a session, tell Claude: "Read `.claude/memory/current-task.md` first."

At the end of a session or before compaction: update the file with what was accomplished and what's next.

**Compressing session files:** Use the caveman-compress pattern (see [token-optimization.md](token-optimization.md)) — rewriting session memory files to compressed prose saves ~46% on input tokens read every session.

---

## 3. Pre-Compact Hook for Survival

When compaction fires automatically, any working context in the session that hasn't been saved to a file is gone. A `PreCompact` hook runs before compaction — use it to save critical state.

```json
{
  "hooks": {
    "PreCompact": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/pre-compact-save.sh"
          }
        ]
      }
    ]
  }
}
```

**What `pre-compact-save.sh` should do:**
1. Ask Claude to summarize: current task state, open decisions, files modified, next steps
2. Write that summary to `.claude/memory/session-state.md` with a timestamp
3. This file survives compaction and can be read at the start of the next session

See `hooks/lifecycle/pre-compact-save.sh` for a ready implementation.

---

## 4. Subagent Memory Isolation

Subagents get a clean context window. This is a feature for performance, but it means a subagent has no memory of the parent session by default.

**Passing memory to subagents:**
- Include the relevant CLAUDE.md sections in the subagent prompt explicitly
- Pass the specific file paths and decisions the subagent needs — don't rely on it inheriting session state
- Keep subagent prompts self-contained: "Here is the context: [...]. Your task: [...]."

**Returning memory from subagents:**
- Have the subagent write its findings to a file
- Read that file back in the parent session
- Don't rely on the subagent's return message alone — files persist, messages don't

---

## 5. CONTEXT.md for Domain Language

Beyond project conventions, complex projects benefit from a `CONTEXT.md` — a glossary of domain-specific terms that shapes how Claude reasons about your codebase.

**Structure:**
```markdown
# Project Context

One or two sentence description of what this project does.

## Language
**Order**: A customer's intent to purchase one or more Products.
**Cart**: Temporary pre-order state. Distinct from Order — do not conflate.
**Fulfillment**: The downstream process of physically sending an Order. Outside this repo's scope.

## Relationships
- An Order contains one or more OrderLines
- A Cart belongs to exactly one User
- A Fulfillment belongs to exactly one Order

## Decisions
- "Basket" was used in early code — resolved: always use "Cart"
```

`CONTEXT.md` is not CLAUDE.md — it's domain knowledge, not behavioral rules. Put it at the project root and reference it in CLAUDE.md: "Read CONTEXT.md for domain terminology."

---

## 6. Memory Compaction Strategy

**Proactive compaction beats reactive compaction.**

Automatic compaction fires when the context window fills (~95% capacity). By that point:
- Response quality has already degraded
- Compaction may cut context you still need
- You lose control over what gets preserved

**When to compact manually (`/compact`):**
- Before starting a new major task in the same session
- After finishing a long debugging session (clear the dead context)
- When you notice Claude starting to repeat questions or lose track of decisions
- Before spawning a subagent for a related but distinct task

**What `/compact` preserves:** The summary Claude generates during compaction. Make it good — before compacting, tell Claude what matters: "When you compact, make sure to preserve: the auth decision, the three files we changed, and the bug we found in the parser."

---

## Self-Updating CLAUDE.md

**Pattern: self-updating CLAUDE.md on corrections**
After every correction you make to Claude's behavior, end your message with:
```
Update your CLAUDE.md so you don't make that mistake again.
```
Over time, this builds a CLAUDE.md that reflects your exact preferences and the codebase's specific quirks. The error rate measurably drops as the file grows.

**Pattern: notes directory**
Have Claude maintain a `notes/` directory — one file per major task or feature, updated after every PR. Point CLAUDE.md at it:
```
Read notes/ for context on recent work in this repo.
```
This gives Claude a lightweight persistent memory without requiring a memory MCP server.

---

## Quick Reference

| Situation | Action |
|---|---|
| Decisions that should never change | Put in CLAUDE.md |
| Current task state | `.claude/memory/current-task.md` |
| Domain terminology | `CONTEXT.md` at project root |
| Survive compaction | `PreCompact` hook → session-state.md |
| Starting a new major task | `/compact` first |
| Passing context to a subagent | Include it explicitly in the prompt |
| Session memory files are bloated | Compress with caveman-compress pattern |
| Claude re-asks things it should know | Add the answer to CLAUDE.md |

---

## Work With Us

Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products with developer communities and deliver B2B AI solutions. If you're building long-running AI workflows, autonomous agents, or need help designing memory architectures for production Claude Code deployments — we can help.

**[uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)**
