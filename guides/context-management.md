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

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
