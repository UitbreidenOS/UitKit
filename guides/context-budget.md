# Context Budget Management

How to track, plan, and optimize token usage within a Claude Code session — for senior developers running large sessions, agent pipelines, and autonomous work loops.

---

## Why context budget matters

Claude Code sessions operate within a finite context window. As a session grows, every tool call, file read, bash output, and assistant turn accumulates. When the window fills:

- Claude's response quality degrades noticeably before the hard limit (empirically, around 300–400k tokens on the 1M model)
- You're forced into `/compact` (lossy summarisation) or a fresh session
- Costs scale with context size — a bloated window costs more per turn

The failure mode isn't hitting the hard limit — it's burning most of your budget on noise before your task is half done. Long log outputs left untrimmed, entire files read when only 30 lines were needed, repeated re-reads of the same file, agent sub-calls that carry full parent context: these are the patterns that collapse a budget.

This guide covers what costs budget, how to measure it, and how to stay in control across the full session lifecycle.

---

## What consumes context

| Source | Typical cost | Notes |
|---|---|---|
| System prompt / CLAUDE.md | 500–5,000 tokens | Loaded at every session start |
| Each tool call + result | 200–2,000 tokens | Depends entirely on output verbosity |
| File reads | ~1 token per 4 chars | A 1,000-line file is roughly 10K tokens |
| Bash stdout | Unbounded | Long log output is the most common budget killer |
| MCP tool definitions (10 servers) | ~25,000–35,000 tokens | Loaded at session start, before you type anything |
| Agent sub-calls | Full sub-context | Each spawned agent initialises its own context window |
| Images / screenshots | 1,500–3,000 tokens | Per image, regardless of content complexity |
| Conversation history | Grows every turn | Both user and assistant turns accumulate |

The two sources most developers underestimate are **Bash stdout** and **MCP tool definitions**. A single `npm install` with verbose logging can add 3–5K tokens. Ten enabled MCP servers with eight tools each is ~30K tokens of overhead loaded before the first user message.

---

## The `/compact` command

`/compact` summarises the conversation history into a compressed representation and replaces it in context. This is lossy — the summary retains decisions and outcomes but discards exact detail.

**What survives compaction:**
- High-level decisions and rationale
- The current file state (what was written)
- Key facts explicitly discussed

**What does not survive:**
- Exact error messages and stack traces
- Specific code snippets that were read but not written
- Step-by-step debugging chains
- File contents that were read but not modified

**When to compact:**
- At 50–60% context usage, not at 90%. Compaction at 50% produces a higher-quality summary because more signal is still in the window relative to noise.
- After completing a major sub-task before starting the next
- Before a task that will require reading many large files
- After a long debugging session where failed attempts are polluting context

**Directed compaction** preserves the most important thread:

```
/compact focus on the auth refactor — drop the test debugging context
```

Without a hint, the summariser makes its own choices about what matters. A specific hint anchors the summary.

**Do not wait for the automatic threshold.** The default auto-compact fires at ~95% capacity. By then, quality has already degraded significantly and the summary has less signal to work from.

---

## Context budget strategies

### a. Read only what you need

Use the `limit` and `offset` parameters on the Read tool. A 2,000-line file read in full is ~20K tokens. If you need lines 400–450, that's ~500 tokens.

```
# Full file: ~20K tokens
Read /path/to/service.ts

# Targeted read: ~500 tokens
Read /path/to/service.ts, offset: 400, limit: 50
```

Use Grep instead of reading files when you're searching for a pattern. Grep returns matching lines and a small amount of context — not the full file. For a 5,000-line codebase, this is the difference between 50K tokens and 500.

Never read entire log files. Pipe to `head` and search for the relevant section first.

### b. Trim Bash output

Uncontrolled Bash output is the most common source of runaway context consumption. Apply these systematically:

```bash
# Limit output volume
npm install 2>/dev/null | tail -5
docker logs mycontainer --tail 100
git log --oneline -20

# Suppress progress noise
curl -s https://api.example.com/endpoint
rsync -a --quiet src/ dst/

# Redirect stderr when it's not relevant
make build 2>/dev/null

# Summarise before returning
./run-tests.sh | grep -E "PASS|FAIL|ERROR" | tail -30
```

For any command that produces multi-screen output, add `| head -N` or `| tail -N` as a default discipline. The exact N is less important than the habit.

### c. Use PostToolUse output compression

As of Claude Code v2.1.121+, a `PostToolUse` hook can replace the tool's output before Claude processes it. This lets you compress, redact, or summarise verbose tool results automatically — without changing the tool call itself.

**settings.json:**
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/compress-output.sh"
          }
        ]
      }
    ]
  }
}
```

**`.claude/hooks/compress-output.sh`:**
```bash
#!/usr/bin/env bash
# Reads tool output from stdin (JSON), compresses if over threshold, writes to stdout.
# Claude receives the hook's stdout as the tool result.

set -euo pipefail

input=$(cat)
output=$(echo "$input" | jq -r '.output // ""')
line_count=$(echo "$output" | wc -l | tr -d ' ')

if [ "$line_count" -gt 150 ]; then
  # Truncate and annotate — Claude sees a trimmed version
  trimmed=$(echo "$output" | head -100)
  tail_section=$(echo "$output" | tail -20)
  echo "$input" | jq --arg trimmed "$trimmed" --arg tail "$tail_section" \
    '.output = "[Output truncated from '"$line_count"' lines]\n\nFirst 100 lines:\n" + $trimmed + "\n\n[...]\n\nLast 20 lines:\n" + $tail'
else
  echo "$input"
fi
```

This fires on every Bash call. If the output is under 150 lines, it passes through unchanged. Over 150 lines, it replaces the result with a trimmed version annotated with the line count. Claude's context receives the compressed result — the full output never enters the window.

The same pattern works for redacting secrets: strip lines matching `API_KEY|SECRET|TOKEN|PASSWORD` before Claude processes them.

### d. Scope CLAUDE.md aggressively

Project-level `CLAUDE.md` loads at every session start. Every token in it is a fixed cost that compounds across every session you run.

**Target:** Keep your project `CLAUDE.md` under 2,000 tokens (~300–400 lines of plain prose). The user-level `~/.claude/CLAUDE.md` adds on top — treat the combined total as your baseline overhead.

**What to keep in CLAUDE.md:**
- Project description (3–5 sentences)
- Key directories and their purpose
- Non-obvious conventions Claude must follow
- Commands for build, test, lint
- Things not to modify without asking

**What to move out:**
- Reference documentation (API shapes, schema descriptions) — read these on demand, only when relevant
- Long examples — reference them by file path and read on demand
- Historical decisions — keep a separate `decisions.md` and load it only when working in that domain

A `CLAUDE.md` that grew organically over months often contains rules for problems that no longer exist. Audit it and cut dead rules. Each removed rule saves tokens every session forever.

### e. Summarise before spawning agents

When you spawn a subagent, it gets its own context window. The way you pass information to it determines whether you're passing signal or noise.

**Do not forward raw tool history.** If you've just done 20 file reads and 10 bash calls in the parent context, passing that conversation verbatim to a subagent wastes budget and degrades the subagent's focus.

Instead, summarise findings into a structured briefing before spawning:

```
# Poor approach:
Spawn agent with: full parent conversation history

# Better approach:
Before spawning, construct a briefing:
  "The auth module is in src/auth/. The issue is in jwt.ts line 84 —
  the expiry check compares against Date.now() but tokens use seconds, not
  milliseconds. The fix is to multiply exp by 1000 before comparing.
  Relevant files: jwt.ts, middleware/auth.ts, tests/auth.test.ts.
  Task: fix the comparison and update the test."

Spawn agent with: the briefing only
```

The subagent receives exactly what it needs. The parent context gains back the subagent's conclusions without having the subagent's full tool history re-injected.

### f. LLMS.txt awareness

When pulling in external documentation — a library's API reference, a framework's configuration guide — check whether the project publishes an `llms.txt` file.

`llms.txt` is a compressed documentation format specifically designed for LLM consumption. It's typically 5–10x smaller than the equivalent docs site content. Fetching `https://docs.example.com/llms.txt` rather than scraping multiple pages can save 50–200K tokens on documentation-heavy tasks.

Check for it before reading raw docs:
```bash
curl -s https://docs.anthropic.com/llms.txt | head -50
```

If it exists, use it as your primary source. If it doesn't exist, fetch only the specific page you need rather than following links.

### g. Use batch operations

In agent pipelines and SDK workflows, accumulate results in batch calls rather than individual interactive turns. `agent_sdk.batch()` executes multiple sub-tasks and returns their results without each sub-task filling the parent's interactive context with intermediate tool history.

This is the programmatic equivalent of the subagent summarisation strategy above — structure work so intermediate steps don't persist in the main context.

---

## The `/usage` command

`/usage` shows a per-category token breakdown for the current session. Available in Claude Code (check `claude --version` for availability in your build).

**Categories shown:**
- System prompt (CLAUDE.md + built-in system context)
- MCP tool definitions
- Conversation history (user + assistant turns)
- Tool results (file reads, bash outputs, MCP responses)
- Agent sub-calls

**How to use it effectively:**

Run `/usage` at session start, immediately after Claude loads. This gives you a baseline — the fixed overhead of your CLAUDE.md, MCP tools, and system prompt before you've done any work. This number is your floor; every session will cost at least this much.

If the session-start baseline is over 30–40K tokens, you have a configuration problem:
- Too many MCP servers enabled
- CLAUDE.md is too large
- Both

Run `/usage` again after a major task phase (e.g., after completing file exploration, before starting implementation). This shows you how much budget each phase consumed, which informs decisions about whether to compact before continuing.

---

## Context budget in autonomous / agent loops

Autonomous loops (`/loop`, scheduled agents, CI pipelines) accumulate context differently from interactive sessions. Each iteration of a loop adds to the same context unless you actively manage it.

**Key patterns:**

**Summarise between iterations.** At the end of each loop iteration, write a structured summary to a file. The next iteration reads the summary file instead of carrying the full previous iteration's tool history.

```bash
# End of each loop iteration — write state to disk
cat > /tmp/loop-state.json <<EOF
{
  "iteration": 3,
  "completed": ["auth module", "user service"],
  "current": "payment service",
  "blockers": [],
  "next": "review payment integration tests"
}
EOF
```

**Use ScheduleWakeup to reset context.** The `ScheduleWakeup` tool ends the current context window and resumes at the next scheduled tick in a fresh window. For long autonomous tasks, this is preferable to accumulating context across dozens of iterations. The tradeoff is a cache miss (>5 minute delay) — acceptable when iteration work takes more than a few minutes.

**Write session summaries in the Stop hook.** When Claude finishes a turn in an autonomous session, the Stop hook fires. Use it to write a session summary to disk before context accumulates further.

**`.claude/hooks/stop-summary.sh`:**
```bash
#!/usr/bin/env bash
# Fires on Stop event. Appends a session summary to a persistent log.

set -euo pipefail

timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
last_commit=$(git log -1 --oneline 2>/dev/null || echo "no commits")

cat >> "${CLAUDE_PROJECT_DIR}/.claude/session-log.md" <<EOF

## Session ended: ${timestamp}
Branch: ${branch}
Last commit: ${last_commit}

EOF
```

**Inject compact context at SessionStart.** Rather than re-establishing context through repeated file reads at the start of each autonomous session, use a `SessionStart` hook to inject the summary written by the previous session's Stop hook. This gives the new context window structured orientation immediately.

**`.claude/hooks/session-start.sh`:**
```bash
#!/usr/bin/env bash
# Fires at SessionStart. Outputs a compact briefing Claude reads at session open.

set -euo pipefail

summary_file="${CLAUDE_PROJECT_DIR}/.claude/session-log.md"

if [ -f "$summary_file" ]; then
  echo "=== SESSION CONTEXT (from previous session) ==="
  tail -50 "$summary_file"
  echo "=== END SESSION CONTEXT ==="
fi
```

---

## Pre-compact hook pattern

When `/compact` fires, Claude generates a summary of the conversation. The `PreCompact` hook fires before that summary is generated — giving you a window to inject structured state that enriches the summary.

Without a PreCompact hook, the summary is generated purely from the conversation. With a PreCompact hook that injects current branch, open tasks, recent commits, and key decisions, the compaction summary carries significantly more operational context into the next window.

**settings.json:**
```json
{
  "hooks": {
    "PreCompact": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/pre-compact.sh",
            "timeout": 15
          }
        ]
      }
    ]
  }
}
```

**`.claude/hooks/pre-compact.sh`:**
```bash
#!/usr/bin/env bash
# Fires before /compact. Outputs structured state that enriches the compaction summary.

set -euo pipefail

branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
recent_commits=$(git log -5 --oneline 2>/dev/null || echo "unavailable")
staged=$(git diff --cached --stat 2>/dev/null || echo "none")
unstaged=$(git diff --stat 2>/dev/null || echo "none")

cat <<EOF
=== PRE-COMPACT STATE INJECTION ===
Timestamp: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
Branch: ${branch}

Recent commits:
${recent_commits}

Staged changes:
${staged}

Unstaged changes:
${unstaged}
=== END STATE INJECTION ===
EOF
```

The injected output appears in context immediately before the compaction summary is generated. Claude incorporates this state when writing the summary. The resulting summary — which becomes the new context window's opening — will contain branch, recent commit history, and change status without you needing to re-establish these facts manually after compaction.

Extend this pattern to include open tasks (from a task file), architectural decisions made during the session (from a decisions log), or any other structured state that would otherwise be lost.

---

## Quick reference — context hygiene checklist

- [ ] Project CLAUDE.md is under 2,000 tokens; user CLAUDE.md is lean
- [ ] Only MCP servers needed for this session are enabled
- [ ] Bash commands pipe to `| head -N` or `| tail -N` where output is unbounded
- [ ] PostToolUse compression hook installed for verbose tools (Bash, log-producing MCPs)
- [ ] Large file reads use `limit` and `offset` — no full reads of files over 200 lines unless the full content is needed
- [ ] `/compact` triggered at 50–60% context usage, not at 90%+
- [ ] Subagents receive a structured briefing, not raw parent conversation history
- [ ] External documentation loaded via `llms.txt` when available
- [ ] Autonomous loop iterations write state to disk; next iteration reads from disk
- [ ] PreCompact hook installed to enrich compaction summaries
- [ ] Stop hook writes session summary for the next session's context loader
- [ ] `/usage` checked at session start to confirm baseline overhead is acceptable

---
