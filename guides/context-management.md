# Context Management Guide

How to manage Claude Code's context window effectively — keep sessions focused, prevent context bloat, and maintain quality across long work sessions.

## Understanding the context window

Claude Code has a finite context window. As you work, the conversation grows:
- Every tool call and its result is added to context
- Every file read is added to context
- Every code edit is tracked in context
- Long conversations eventually hit limits and are auto-summarised

**Signs you're hitting context limits:**
- Claude starts forgetting earlier decisions
- Responses become less specific to your project
- Auto-compaction kicks in (summarises older context)
- Claude asks for information it already has

## Keep sessions focused

**One session = one task.** Don't use the same Claude Code session for multiple unrelated tasks.

```bash
# Wrong: one session for everything
claude
# (builds feature, then fixes unrelated bug, then writes docs, then reviews PR)

# Right: separate sessions per task
claude "implement user authentication"  # Session 1
claude "fix the payment timeout bug"    # Session 2
claude "write API documentation"        # Session 3
```

**Why:** Context from task 1 pollutes task 3. Claude Code works better when context is relevant.

## Pre-load context efficiently

Instead of having Claude discover your codebase through reads:

```bash
# Add a CLAUDE.md file to your project
# Claude reads this at session start — it becomes your persistent context
cat CLAUDE.md
```

A good `CLAUDE.md` contains:
- Project description (2-3 sentences)
- Key directories and what they contain
- Important conventions (naming, patterns, decisions)
- Things NOT to modify without asking
- Common commands (how to run tests, build, etc.)

This replaces dozens of exploratory file reads with one structured context load.

## Use the `/compact` command

When a session is getting long:
```
/compact
```

This summarises the earlier conversation into a shorter representation, freeing up context window space without losing the key decisions and context.

**Use compact when:**
- You've completed a major sub-task within a longer session
- The context feels bloated with exploration that's no longer relevant
- You're about to start a new phase of work in the same session

## Strategic file reading

Claude reads files into context — be selective:

```
# Too broad:
"Read all the files in the auth module"

# Better:
"Read src/auth/jwt.ts and src/middleware/auth.ts — I want to understand the JWT implementation"
```

Ask Claude to summarise files rather than read them when you need understanding:
```
"Without reading the file, based on its name and the imports you can see, what does src/services/email.ts likely do?"
```

## Worktrees for long-term isolation

For tasks that span days, use git worktrees:
```bash
git worktree add ../project-feature feature/my-feature
cd ../project-feature
claude "work on the user authentication feature"
```

Each worktree = its own Claude Code session with its own clean context.

## The `/lean-claude` skill

Load `/lean-claude` at the start of any session to activate token-efficient mode:
- Shorter, more precise responses
- Less repeated information
- Direct answers without preamble

```bash
npx claudient add skills productivity
# Then in Claude Code:
/lean-claude
```

## Recovering from a stale session

If Claude is losing track of earlier context:

1. **Restart with a summary prompt:**
   ```
   "Let me catch you up on what we've been doing. [Summary of key decisions, current state, what's next]"
   ```

2. **Use `/compact`** to condense and refocus

3. **Start fresh with context pre-loaded:**
   ```bash
   # End the session, start a new one
   claude "I'm continuing work on [feature]. Here's the context: [brief summary]. The current state is [describe]. The next step is [specific task]."
   ```

## Multi-file context strategies

When working across many files:

```
# Instead of: "read all 15 files in this module"
# Do: "I'm going to work on the payments module. The key files are payments.service.ts (handles charge logic), payments.controller.ts (routes), and payments.dto.ts (types). Read only those three first."
```

Then read additional files only as needed, not speculatively.

## Token cost awareness

Longer context = higher cost per request. Strategies to reduce cost:
- Use `/lean-claude` for token-efficient mode
- Break large tasks into multiple focused sessions
- Avoid re-reading files that haven't changed
- Use `CLAUDE.md` to front-load stable context cheaply

## The 5-Option Decision Framework

At every turn boundary, you have 5 options:

| Option | When to use | Cost |
|--------|------------|------|
| **Continue** | On track, <200k tokens, no dead ends | Free |
| **Rewind** (Esc+Esc) | Wrong path — keep file reads, drop failed attempts | Free |
| **Directed compact** `/compact <hint>` | Mid-task, >200k tokens, want to preserve specific thread | ~50% token reduction |
| **Fresh session** | Task complete, starting unrelated work, too many dead ends | Free |
| **Subagent** | Bounded sub-task where intermediate output isn't needed in parent | Separate context |

**Rewind vs Compact:** Rewind drops assistant turns but keeps the full context state — use when Claude went down a wrong path but you want to keep what it read. Compact compresses everything — use when context is long but the thread is still valid.

**Context rot:** Quality degrades ~300-400k tokens on 1M model. Don't wait until 900k to compact.

## Context Quality Benchmarks

### Intelligence degradation thresholds

Context quality measurably degrades as the window fills. Use these as action triggers, not hard limits:

| Context used | Quality | Action |
|-------------|---------|--------|
| <30% | Full | Continue |
| 30–40% | Good | Monitor; consider /compact before next complex task |
| 40–60% | Degraded | Use directed `/compact <hint>` to preserve thread |
| >60% | Significantly degraded | Compact or fresh session |
| >300K tokens (1M model) | Unreliable | Compact or fresh session — empirical threshold |

Expert teams maintain <30% context utilization for complex tasks. Beginners: stay under 40%.

### Rewind beats correction

When Claude goes down a wrong path, `/rewind` (Esc+Esc) is better than leaving the correction in context:

```
Wrong: Let Claude make an error → correct it → continue
  Result: both the error and the correction stay in context; context becomes noisy

Right: Let Claude make an error → /rewind to pre-error state → rephrase approach
  Result: clean context; Claude reasons from a better starting point
```

Previous attempts should inform your *re-prompting strategy*, not clutter the current context.

### Subagent context isolation

For tool-heavy reconnaissance (reading 30 files, running 10 greps), offload to a subagent:

```
Main context doing reconnaissance:
  Claude reads 50 files... [50 file reads in main context]
  Context is now 40% full with intermediate data

Subagent isolation:
  Spawn subagent → reads 50 files → returns "Found 12 instances in auth.ts, db.ts, utils.ts; recommend X"
  Main context receives conclusions only; stays clean
```

Use subagents when the intermediate output (file reads, search results) won't be needed again after the task completes.

---
