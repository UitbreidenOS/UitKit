---
name: "lean-claude"
description: "Activate token-efficient mode: caveman output, right model selection, MCP discipline, compaction strategy, cavecrew agents — all in one"
---

# Lean Claude Skill

## When to activate
- Starting any session where cost or speed matters
- Long sessions where context is getting bloated
- Running multiple parallel agents or batch workloads
- Working on a tight token budget
- Before a complex multi-step task that will consume a lot of context

## When NOT to use
- Writing external-facing documentation — brevity can hurt clarity
- Security decisions, irreversible actions, or multi-step sequences where misreading a fragment causes damage
- Onboarding a new team member to a codebase

## Instructions

Paste this activation prompt at the start of any session to enable all lean optimisations at once:

```
Activate lean mode for this session:

OUTPUT: caveman full — drop articles, use fragments, short synonyms.
Auto-revert to full prose for: security warnings, irreversible actions,
multi-step sequences where fragment ambiguity is risky.

MODEL: use Haiku 4.5 for any task where output is constrained and verifiable
(linting, formatting, simple renames, single-function edits, classification).
Stay on Sonnet 4.6 for multi-file reasoning. Only escalate to Opus for deep
architectural decisions or complex security analysis.

CONTEXT: do not read full files when a line range will do. Prefer targeted
reads over whole-file reads. Tell me before reading any file >500 lines.

AGENTS: for repetitive or isolated tasks, spawn a Haiku subagent rather than
doing the work in the main session. Each subagent gets a fresh context window.
```

---

### 1. Model selection — the biggest lever

| Task | Model | Savings |
|------|-------|---------|
| Linting, formatting, simple renames | Haiku 4.5 | ~60% vs Sonnet |
| Single-function edits, boilerplate generation | Haiku 4.5 | ~60% |
| Multi-file changes, debugging, code review | Sonnet 4.6 | baseline |
| Architecture decisions, security analysis | Opus 4.7 | — (pay for it) |
| Classification, routing, extraction at scale | Haiku 4.5 | ~60% |

**Rule:** Default to Sonnet 4.6. Drop to Haiku when the output is constrained and verifiable. Only escalate to Opus when you genuinely need deep reasoning.

---

### 2. Caveman output compression

Instructs Claude to respond in terse fragment-style prose. Benchmarked at ~65% output token reduction with 100% technical accuracy maintained.

**Compression levels:**

| Level | Rule | Example |
|-------|------|---------|
| `lite` | Drop filler, keep full sentences | "The function handles edge cases." |
| `full` (default) | Drop articles, fragments OK | "func handles edge cases" |
| `ultra` | Abbreviate, strip conjunctions, arrows | "fn→edge cases handled" |

**Activate:** add `caveman full` to your session prompt (already included in the activation prompt above).

**Compress your memory files** — files Claude re-reads every session become input tokens:
```
/caveman-compress .claude/memory/project-context.md
```
~46% input token savings per session on compressed files. Full implementation: [github.com/JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman)

---

### 3. MCP discipline — 30k tokens before you type a word

Each enabled MCP server loads all its tool definitions into context at session start. 10 MCP servers ≈ 80 tools ≈ **30,000 tokens consumed before you type a word**.

**Audit your active MCPs:**
```bash
# Check what's enabled
cat ~/.claude/settings.json | grep -A2 mcpServers
cat .claude/settings.json | grep -A2 mcpServers 2>/dev/null
```

**Disable any server you won't use in this session.** Disabling 5 unused MCP servers saves ~15,000 tokens — more than most CLAUDE.md files consume.

---

### 4. Context management

**CLAUDE.md:**
- Keep project CLAUDE.md under 300 lines
- Remove rules that no longer apply
- Never duplicate user-level rules in project CLAUDE.md

**File reads:**
- Ask for specific line ranges: "read auth.py lines 45–90" not "read auth.py"
- Avoid reading the same large file twice
- Use subagents for tasks that require reading many files not needed by the main session

**Compaction — trigger it early, not at 95%:**
```
/compact
```
Compact before switching to a new major task, after a long debugging session, or before starting work that requires reading many large files. Don't wait for automatic compaction.

---

### 5. Cavecrew — cheap agents for cheap tasks

Spawn Haiku-based subagents for bounded tasks instead of burning Sonnet context:

| Role | Model | Use for |
|------|-------|---------|
| Investigator | Haiku 4.5 | Locate files, grep codebase, read-only tasks |
| Builder | Sonnet 4.6 | Surgical 1–3 file changes |
| Reviewer | Haiku 4.5 | Review a diff or file for issues |
| Orchestrator | Opus 4.7 | Complex multi-step coordination only |

**~60% token savings** vs using Sonnet for every subagent. Use Haiku for anything where the task is constrained and the output is verifiable.

---

### 6. Prompt efficiency

| Instead of | Use |
|-----------|-----|
| "Fix the authentication" | "Fix JWT expiry check in auth/middleware.py:45 — not rejecting expired tokens" |
| Five separate "add a test for X" | "Add tests for all five functions in utils.py" |
| "Explain this codebase" | "Explain how auth flows from login to session creation, max 3 paragraphs" |
| Long back-and-forth | Batch related tasks into one prompt |

Vague prompts → exploration → more tool calls → more context consumed.
Specific prompts → focused responses → fewer tokens.

---

### 7. Session cost tracking

Use the `cost-tracker` hook to see token usage per tool call:
```bash
npx claudient add hooks
# Then add hooks/lifecycle/cost-tracker.sh to .claude/settings.json
```

Gives you a running log of input/output tokens + estimated cost per session. Use it to identify which tasks consume the most — then optimise those first.

---

## Quick reference card

| Situation | Action |
|-----------|--------|
| Starting any session | Paste the activation prompt above |
| Simple edit, lint, format | Switch to Haiku 4.5 |
| Memory files are large | Run caveman-compress on them |
| Context getting slow | `/compact` now, don't wait |
| Unused MCPs enabled | Disable them in settings.json |
| Repetitive task across files | Haiku subagent, not main session |
| Vague request, long response | Rewrite as specific, scoped prompt |
| Architecture / security decision | Escalate to Opus — worth the cost |

---
