# Token Optimization Guide

How to reduce Claude Code costs and improve response speed without sacrificing output quality.

---

## The Core Principle

Every token in Claude Code's context costs money and slows responses. The goal is to keep the context window lean — only what Claude needs to do the current task well.

There are four levers:
1. **Model selection** — matching the right model to the task
2. **Context management** — controlling what's in the window
3. **MCP discipline** — limiting tool overhead
4. **Compaction strategy** — when and how to compress history

---

## 1. Model Selection

Claude Code supports multiple models. Choosing the wrong one for a task is the single most expensive mistake.

| Model | Best for | Relative cost |
|---|---|---|
| Claude Haiku 4.5 | Simple edits, single-file tasks, repetitive operations, summarization | Lowest |
| Claude Sonnet 4.6 | Most development work — multi-file changes, debugging, code review | Mid |
| Claude Opus 4.7 | Complex architecture decisions, security analysis, multi-agent orchestration | Highest |

**Rules of thumb:**
- Default to Sonnet 4.6 for general development
- Drop to Haiku 4.5 for: linting fixes, formatting, simple renames, single-function edits, generating boilerplate from a template
- Escalate to Opus 4.7 only when: the problem requires deep reasoning across many files, security decisions are involved, or you're orchestrating multiple sub-agents

**Haiku saves ~60% vs Sonnet on eligible tasks.** The key is identifying which tasks are eligible — anything where the output is highly constrained and verifiable qualifies.

---

## 2. Context Window Management

Claude Code's context window is large (up to 1M tokens on Opus 4.7 and Sonnet 4.6), but the **usable** window is smaller once you account for overhead.

### What consumes context

| Source | Approximate cost |
|---|---|
| MCP tools (10 enabled) | ~30k tokens |
| CLAUDE.md (project + user) | 1k–10k tokens |
| Conversation history | Grows with every turn |
| File contents read into context | Varies — often the largest factor |
| System prompt | ~5k–10k tokens |

### Keeping context lean

**CLAUDE.md:**
- Keep project CLAUDE.md under 500 lines
- Remove rules that no longer apply to the current project state
- Don't duplicate content from user-level CLAUDE.md into project-level

**File reads:**
- Ask Claude to read specific line ranges rather than full files when possible
- Avoid reading the same large file multiple times in a session
- Use subagents for isolated tasks — they get a fresh context window

**Conversation history:**
- Long sessions accumulate dead context (files that were read but are no longer relevant, failed attempts, abandoned approaches)
- Trigger compaction proactively rather than waiting for the automatic threshold

---

## 3. MCP Discipline

Each enabled MCP server loads its tool definitions into context at session start. With 10 MCP servers and ~8 tools each, you're consuming ~80 tool slots — roughly 30k tokens before you've typed a word.

**Audit your active MCPs:**
- Only enable MCPs that you use in the current project
- Disable domain-specific MCPs (e.g., database, cloud) when not working in that domain
- Check `.claude/settings.json` and `~/.claude/settings.json` for enabled servers

**Target:** Keep enabled MCPs to what you'll actually use in the session. The 30k token savings from disabling 5 unused MCP servers is meaningful over many sessions.

---

## 4. Compaction Strategy

Claude Code compacts conversation history automatically when context approaches its limit. The default threshold is late — triggering at ~95% capacity. By that point, you've already been working with a bloated window for a long time.

### Trigger compaction earlier

Set a lower compaction threshold in your project settings or use the `/compact` command manually before starting a new major task.

**When to compact manually:**
- Before switching from one major task to another in the same session
- After a long debugging session where many failed attempts are in history
- Before starting a task that will require reading many large files

### What compaction does

Compaction summarizes the conversation history and replaces it with a compressed representation. You lose the exact turn-by-turn history but retain the decisions, code written, and key context. Claude continues the session with this summary as its working memory.

**Pre-compact hook:** Use a `PreCompact` hook to save any session-critical state to a file before compaction fires. This lets you reconstruct important context if needed after compaction.

---

## 5. Prompt Efficiency

How you write requests affects token consumption both in your message and in Claude's response.

**Be specific about scope:**

Instead of: "Fix the authentication"
Use: "Fix the JWT expiry check in `auth/middleware.py:45` — it's not rejecting tokens with `exp` in the past"

A specific prompt produces a focused response. A vague prompt produces exploration, which means more tool calls, more file reads, more context consumed.

**Limit response length when appropriate:**

For tasks where you need a code change but not an explanation, say so: "Make the change, no explanation needed." This cuts response tokens significantly on simple tasks.

**Batch related requests:**

Instead of five separate "add a test for X" requests, say "add tests for all five functions in `utils.py`." One planning pass, one response, far fewer context round-trips.

---

## 6. Subagent Context Isolation

Subagents get a fresh context window. This is one of the most underused optimization techniques.

**Use subagents when:**
- A task is self-contained (clear inputs, clear outputs)
- The task requires reading many files that aren't relevant to the rest of the session
- You're doing something repetitive across multiple files (e.g., reviewing 10 files for security issues)

Each subagent run costs tokens for its own context but keeps the parent session's window clean. For long sessions, this compounds into significant savings.

---

## 7. Cost Tracking

Use a `PostToolUse` hook to log tool usage and estimate costs per session. This gives you data to make informed decisions about where to optimize.

A basic cost-tracking hook logs:
- Which model was used
- Approximate input/output token counts per turn
- Total session cost estimate

See `hooks/lifecycle/cost-tracker.sh` for a ready-to-use implementation.

---

## Quick Reference

| Situation | Action |
|---|---|
| Simple single-file edit | Switch to Haiku 4.5 |
| Long session getting slow | Manually compact (`/compact`) |
| Starting a new major task | Compact first, then begin |
| Working in a domain you won't touch | Disable domain MCPs |
| Task is self-contained | Use a subagent |
| Vague request producing long responses | Rewrite as a specific, scoped prompt |
| CLAUDE.md over 500 lines | Audit and trim dead rules |
