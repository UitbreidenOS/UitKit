# Hooks Cookbook

Real, ready-to-use hook patterns for automating quality, safety, and observability in Claude Code.

---

## Hook Fundamentals

Hooks are shell scripts or commands that Claude Code executes automatically in response to events. They run outside Claude's context — they are real shell processes, not Claude instructions.

**Hook events:**
| Event | When it fires |
|---|---|
| `SessionStart` | When a Claude Code session begins |
| `PreToolUse` | Before any tool call executes |
| `PostToolUse` | After any tool call completes |
| `PreCompact` | Before context compaction fires |
| `PostCompact` | After context compaction completes |
| `Stop` | When Claude finishes responding |
| `Notification` | When Claude sends a desktop notification |

**Hook configuration location:** `.claude/settings.json` (project) or `~/.claude/settings.json` (user-level)

**Basic hook structure:**
```json
{
  "hooks": {
    "EventName": [
      {
        "matcher": "ToolName",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/your-script.sh",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

**Matcher:** Filters which tool calls trigger the hook. Empty string `""` matches all. `"Bash"` matches only Bash tool calls. `"Write|Edit"` matches Write or Edit.

---

## Recipe 1 — Prettier Auto-Format on File Write

Automatically formats files after Claude writes or edits them. No more "please run prettier" prompts.

**settings.json:**
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write ${tool_input.file_path}",
            "async": true
          }
        ]
      }
    ]
  }
}
```

**Notes:**
- `async: true` runs formatting in the background — Claude doesn't wait for it
- Only runs on Write and Edit tool calls
- `${tool_input.file_path}` is the path of the file that was written

---

## Recipe 2 — Block Dangerous Shell Commands

Prevent Claude from running destructive commands even if it decides to try.

**.claude/hooks/block-dangerous.sh:**
```bash
#!/usr/bin/env bash
# Reads the tool input from stdin as JSON
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('command',''))")

# Block patterns
BLOCKED_PATTERNS=("rm -rf" "sudo " "| bash" "| sh" "curl.*| " "wget.*| " "git push --force" "git reset --hard" "DROP TABLE" "truncate ")

for pattern in "${BLOCKED_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -qi "$pattern"; then
    echo "BLOCKED: command matches dangerous pattern '$pattern'" >&2
    exit 2  # Exit code 2 = block the tool call
  fi
done

exit 0  # Allow
```

**settings.json:**
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/block-dangerous.sh",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

**Exit codes:** `0` = allow, `1` = warn (Claude sees the output but continues), `2` = block (tool call is cancelled).

---

## Recipe 3 — Audit Log Every Tool Call

Log every tool call with timestamp, tool name, and input summary. Essential for debugging and security auditing.

**.claude/hooks/audit-log.sh:**
```bash
#!/usr/bin/env bash
INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('tool_name','unknown'))" 2>/dev/null)
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
LOG_FILE="${CLAUDE_PROJECT_DIR}/.claude/logs/audit.log"

mkdir -p "$(dirname "$LOG_FILE")"
echo "${TIMESTAMP} | ${TOOL_NAME} | $(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); inp=d.get('tool_input',{}); print(str(inp)[:200])" 2>/dev/null)" >> "$LOG_FILE"
```

**settings.json:**
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/audit-log.sh",
            "async": true
          }
        ]
      }
    ]
  }
}
```

Add `.claude/logs/` to `.gitignore`.

---

## Recipe 4 — Pre-Compact Session Saver

Before compaction fires, save the current session state so context survives.

**.claude/hooks/pre-compact-save.sh:**
```bash
#!/usr/bin/env bash
MEMORY_FILE="${CLAUDE_PROJECT_DIR}/.claude/memory/session-state.md"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

mkdir -p "$(dirname "$MEMORY_FILE")"

cat >> "$MEMORY_FILE" << EOF

---
## Session snapshot: ${TIMESTAMP}
[Claude will append a summary here during PreCompact]
EOF
```

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
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/pre-compact-save.sh"
          }
        ]
      }
    ]
  }
}
```

Pair this with a CLAUDE.md instruction: "When PreCompact fires, summarize: current task, files changed, open decisions, next steps — append to `.claude/memory/session-state.md`."

---

## Recipe 5 — Cost Tracker

Estimate token costs per session and log them.

**.claude/hooks/cost-tracker.sh:**
```bash
#!/usr/bin/env bash
INPUT=$(cat)
COST_FILE="${CLAUDE_PROJECT_DIR}/.claude/logs/costs.log"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

mkdir -p "$(dirname "$COST_FILE")"

# Extract usage data if available
USAGE=$(echo "$INPUT" | python3 -c "
import sys, json
d = json.load(sys.stdin)
usage = d.get('usage', {})
inp = usage.get('input_tokens', 0)
out = usage.get('output_tokens', 0)
print(f'input={inp} output={out}')
" 2>/dev/null || echo "usage=unavailable")

echo "${TIMESTAMP} | ${USAGE}" >> "$COST_FILE"
```

**settings.json:**
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/cost-tracker.sh",
            "async": true
          }
        ]
      }
    ]
  }
}
```

---

## Recipe 6 — TypeScript Type Check on Edit

Run `tsc --noEmit` after Claude edits TypeScript files. Catch type errors before they compound.

**settings.json:**
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'echo \"${tool_input.file_path}\" | grep -q \"\\.tsx\\?$\" && npx tsc --noEmit 2>&1 | head -20 || true'",
            "async": false,
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

Set `async: false` so Claude sees the type errors and can fix them immediately.

---

## Recipe 7 — Git Push Reminder

Remind Claude to confirm before any git push operation.

**.claude/hooks/git-push-confirm.sh:**
```bash
#!/usr/bin/env bash
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('command',''))" 2>/dev/null)

if echo "$COMMAND" | grep -q "git push"; then
  echo "⚠️  About to push to remote. Confirm this is intentional." >&2
  exit 1  # Warn — Claude sees this and should ask user before proceeding
fi

exit 0
```

**settings.json:**
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/git-push-confirm.sh"
          }
        ]
      }
    ]
  }
}
```

---

## Recipe 8 — Session Start Context Loader

At session start, automatically remind Claude to read key context files.

**.claude/hooks/session-start.sh:**
```bash
#!/usr/bin/env bash
# Output text that gets prepended to Claude's context at session start
MEMORY_FILE="${CLAUDE_PROJECT_DIR}/.claude/memory/session-state.md"

if [ -f "$MEMORY_FILE" ]; then
  echo "Previous session state found at .claude/memory/session-state.md — read it before starting work."
fi

if [ -f "${CLAUDE_PROJECT_DIR}/CONTEXT.md" ]; then
  echo "Domain glossary available at CONTEXT.md — read it for project terminology."
fi
```

**settings.json:**
```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/session-start.sh"
          }
        ]
      }
    ]
  }
}
```

---

## Combining Hooks

Hooks compose — you can have multiple hooks on the same event, each with different matchers.

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          { "type": "command", "command": "npx prettier --write ${tool_input.file_path}", "async": true }
        ]
      },
      {
        "matcher": "Write|Edit",
        "hooks": [
          { "type": "command", "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/tsc-check.sh", "async": false }
        ]
      },
      {
        "matcher": "",
        "hooks": [
          { "type": "command", "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/audit-log.sh", "async": true }
        ]
      }
    ]
  }
}
```

This runs: prettier (async) + TypeScript check (sync, Claude waits) + audit log (async) on every file write.

---

## Troubleshooting Hooks

**Hook not firing:**
- Check the event name is exact: `PreToolUse`, `PostToolUse`, `SessionStart`, `PreCompact`
- Check the script is executable: `chmod +x .claude/hooks/your-script.sh`
- Check the path uses `${CLAUDE_PROJECT_DIR}` correctly

**Hook blocking everything:**
- If your hook exits with `2` on every call, all tool calls are blocked
- Add logging to the hook to see what input it's receiving
- Test the hook manually: `echo '{"tool_name":"Bash","tool_input":{"command":"ls"}}' | bash .claude/hooks/your-script.sh`

**Hook running but output not visible:**
- Stdout from async hooks is discarded. Use stderr (`>&2`) for messages you want to see.
- For sync hooks, stdout is shown to Claude; stderr is shown to the user.

---

## Advanced Hook Capabilities

### continueOnBlock

By default, when a PostToolUse hook exits with code `2` to block a tool call, Claude's turn ends. With `continueOnBlock: true`, the block reason is fed back to Claude as a message and the turn continues — Claude can read the reason and try a different approach without requiring user intervention.

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Bash",
      "hooks": [{"type": "command", "command": "bash /hooks/validate-command.sh"}],
      "continueOnBlock": true
    }]
  }
}
```

Primary use case: lint and format hooks that block on violations and allow Claude to auto-fix the file and retry, rather than stopping and waiting for a human prompt.

---

### terminalSequence output

Hooks can emit OSC escape sequences in their JSON stdout to trigger desktop notifications, set the window title, or ring the terminal bell — without requiring a controlling terminal.

```python
import json, sys

result = {
    "terminalSequence": "\033]0;Claude — Task Complete\007",  # sets window title
}
print(json.dumps(result))
```

Useful for surfacing completion status or errors in the window title bar when running long background tasks.

---

### exec form (args array)

Instead of a shell string `command`, pass an `args` array to spawn the hook process directly without invoking a shell. This eliminates quoting and escaping issues when interpolated values like `${tool_name}` or `${tool_input}` contain spaces, quotes, or special characters.

```json
{
  "type": "command",
  "command": {
    "args": ["/usr/local/bin/my-hook", "--tool", "${tool_name}", "--input", "${tool_input}"]
  }
}
```

Use the args form for any hook that receives structured data from tool inputs. Use the string form only when you genuinely need shell features (pipes, conditionals, globs).

---

### type: "mcp_tool"

Hooks can call a tool on an already-connected MCP server directly, without spawning a subprocess. This is lower overhead than a shell script and keeps the hook inside the MCP connection's auth context.

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write",
      "hooks": [{
        "type": "mcp_tool",
        "server": "my-mcp-server",
        "tool": "log_file_write",
        "input": {"path": "${tool_input.file_path}"}
      }]
    }]
  }
}
```

The MCP server named in `server` must already be connected in the session. The `tool` field is the exact tool name exposed by that server. Use this pattern for audit logging, notifications, or state synchronization via MCP without adding a subprocess layer.

---

### PreCompact — blocking compaction

PreCompact hooks can actively block compaction by exiting with code `2` or returning `{"decision": "block"}` in stdout. Use this to run a save or backup operation and only allow compaction to proceed once the state is safely persisted.

**.claude/hooks/pre-compact-backup.sh:**
```bash
#!/bin/bash
# Save transcript first, then allow compaction
cp .claude/session.jsonl .claude/backups/session-$(date +%s).jsonl
# Exit 0 to allow compaction, exit 2 to block it
exit 0
```

If the backup fails and you want to prevent compaction, exit `2`. Claude will surface the block reason and the session continues without compacting.

---

### Agent-scoped hooks

Hooks can be scoped to a specific agent by adding a `hooks:` field to the agent's frontmatter. These hooks only fire when that agent is the active agent — they do not affect the root session or other agents.

```yaml
---
name: my-agent
description: "..."
hooks:
  Stop:
    - type: command
      command: echo "Agent finished" >> .claude/agent.log
---
```

Use agent-scoped hooks for agent-specific observability (logging when an agent completes), resource cleanup (deleting temp files the agent created), or cost tracking scoped to a single agent's activity.

---

### effort.level in hook environment

The active effort level is available as the `$CLAUDE_EFFORT` environment variable inside hook scripts. Values: `low`, `normal`, `high`, `xhigh`.

```bash
#!/bin/bash
if [ "$CLAUDE_EFFORT" = "xhigh" ]; then
  echo "Running extended validation..."
  run-full-test-suite
fi
```

Use this to conditionally run expensive validation only when Claude is operating in extended-effort mode, or to skip optional checks at low effort to reduce latency.

---

### Conditional `if:` Hooks

Execute a hook only when a condition is true. The `if:` field takes a shell expression that is evaluated before the hook runs. If it exits non-zero, the hook is skipped entirely.

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write",
      "if": "echo \"$TOOL_INPUT\" | grep -q '\\.(ts|tsx)$'",
      "hooks": [{"type": "command", "command": "npx tsc --noEmit"}]
    }]
  }
}
```

The `if:` expression has access to the same environment variables as the hook itself — `$TOOL_INPUT`, `$TOOL_NAME`, `$CLAUDE_PROJECT_DIR`, `$CLAUDE_EFFORT`, etc.

**Common `if:` patterns:**

Run only on TypeScript files:
```bash
"if": "echo \"$TOOL_INPUT\" | grep -q '\\.tsx\\?$'"
```

Run only when on the main branch:
```bash
"if": "[ \"$(git branch --show-current)\" = \"main\" ]"
```

Run only when a specific config file exists:
```bash
"if": "[ -f .env.production ]"
```

Run only at xhigh effort:
```bash
"if": "[ \"$CLAUDE_EFFORT\" = \"xhigh\" ]"
```

Conditional hooks compose cleanly with the existing matcher system — the matcher filters by tool name, the `if:` filters by runtime conditions. Use both together to create precise, low-overhead hook triggers.

---

### `background_tasks` and `session_crons` in Stop/SubagentStop Hooks

The `Stop` and `SubagentStop` hook payloads now include two additional fields that report what is still running when the session ends:

```json
{
  "event": "Stop",
  "background_tasks": [
    {"id": "task-123", "status": "running", "started_at": "2026-05-23T10:00:00Z"}
  ],
  "session_crons": [
    {"id": "cron-456", "schedule": "0 * * * *", "last_run": "2026-05-23T09:00:00Z"}
  ]
}
```

**`background_tasks`** — tasks started via `claude --bg` or spawned by the agent during the session that are still running at stop time.

**`session_crons`** — recurring jobs registered with `/loop` or the Cron API that are scheduled and still active.

**Use cases:**

Wait for background tasks before archiving:
```bash
#!/bin/bash
INPUT=$(cat)
RUNNING=$(echo "$INPUT" | python3 -c "
import sys, json
d = json.load(sys.stdin)
tasks = d.get('background_tasks', [])
print(len([t for t in tasks if t['status'] == 'running']))
" 2>/dev/null || echo "0")

if [ "$RUNNING" -gt 0 ]; then
  echo "Session stopped with $RUNNING background task(s) still running." >&2
fi
```

Alert when a cron will be orphaned by session end:
```bash
#!/bin/bash
INPUT=$(cat)
CRON_COUNT=$(echo "$INPUT" | python3 -c "
import sys, json
d = json.load(sys.stdin)
print(len(d.get('session_crons', [])))
" 2>/dev/null || echo "0")

if [ "$CRON_COUNT" -gt 0 ]; then
  echo "Warning: $CRON_COUNT session cron(s) will stop when this session ends." >&2
fi
```

Register this script as a `Stop` hook with `matcher: ""` to run it on every session end.

---

## PostToolUse Output Replacement

PostToolUse hooks can replace what Claude sees from ANY tool's output — not just MCP tools. This is one of the most impactful hook features for managing context budget, since tool results consume ~60% of context tokens in typical agentic sessions.

**How it works:**
The hook receives the tool output in stdin. It can return a modified version via `hookSpecificOutput.updatedToolOutput`. Claude sees the replaced output instead of the original. The tool has already executed — files written, commands run, network requests sent — so this only changes what enters Claude's context, not what happened.

**Configuration:**
```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Bash",
      "hooks": [{
        "type": "command",
        "command": "python3 ~/.claude/hooks/compress-output.py"
      }]
    }]
  }
}
```

**Script example — compress verbose bash output:**
```python
#!/usr/bin/env python3
"""Compress Bash tool output that exceeds a threshold."""
import json, sys

THRESHOLD = 10_000  # characters

data = json.load(sys.stdin)
output = data.get("tool_output", "")

if len(output) > THRESHOLD:
    # Keep first 2000 and last 2000 chars, summarize middle
    compressed = (
        output[:2000]
        + f"\n\n... [{len(output) - 4000} characters truncated] ...\n\n"
        + output[-2000:]
    )
    result = {
        "hookSpecificOutput": {
            "updatedToolOutput": compressed
        }
    }
    print(json.dumps(result))
else:
    # Output unchanged — print nothing (no replacement)
    pass
```

**Use cases:**
- **Redact secrets:** scan output for API keys/tokens and replace with `[REDACTED]` before Claude sees them
- **Normalize diffs:** strip noise from git diff output (timestamps, index lines)
- **Compress verbose output:** truncate npm install logs, large query results, build output
- **Context budget recovery:** tool results consume ~60% of tokens; replacing 50K chars with 500 chars reclaims massive context

**Important:** the original output is captured in telemetry/analytics before the hook runs. The replacement only affects what Claude sees in its context window.

**Available since:** v2.1.121+

---

## Agent Team Hook Events

Three hook events specifically for Agent Teams. These fire during team coordination and let you enforce quality gates on task management.

### TeammateIdle

Fires when a teammate is about to go idle (stop working). Use to keep teammates productive.

- **Exit 0:** allow the teammate to go idle
- **Exit 2:** send feedback to the teammate and keep them working

```json
{
  "hooks": {
    "TeammateIdle": [{
      "hooks": [{
        "type": "command",
        "command": "bash ~/.claude/hooks/check-remaining-tasks.sh"
      }]
    }]
  }
}
```

```bash
#!/bin/bash
# check-remaining-tasks.sh — keep teammate working if tasks remain
PENDING=$(cat ~/.claude/tasks/*/tasks.json 2>/dev/null | python3 -c "
import json,sys
tasks = json.load(sys.stdin)
pending = [t for t in tasks if t.get('status') == 'pending']
print(len(pending))
" 2>/dev/null || echo "0")

if [ "$PENDING" -gt 0 ]; then
  echo "There are $PENDING pending tasks. Pick up the next one."
  exit 2  # keep working
fi
exit 0  # allow idle
```

### TaskCreated

Fires when a task is being added to the shared task list. Use to enforce task quality standards.

- **Exit 0:** allow task creation
- **Exit 2:** prevent creation and send feedback

```json
{
  "hooks": {
    "TaskCreated": [{
      "hooks": [{
        "type": "command",
        "command": "python3 ~/.claude/hooks/validate-task.py"
      }]
    }]
  }
}
```

Use case: reject tasks that are too vague (no acceptance criteria), too large (needs splitting), or duplicate existing tasks.

### TaskCompleted

Fires when a task is being marked as complete. Use as a quality gate.

- **Exit 0:** allow completion
- **Exit 2:** prevent completion and send feedback (teammate must address the issue)

```json
{
  "hooks": {
    "TaskCompleted": [{
      "hooks": [{
        "type": "command",
        "command": "bash ~/.claude/hooks/verify-tests-pass.sh"
      }]
    }]
  }
}
```

```bash
#!/bin/bash
# verify-tests-pass.sh — block task completion if tests fail
if ! npm test --silent 2>/dev/null; then
  echo "Tests are failing. Fix test failures before marking this task complete."
  exit 2  # block completion
fi
exit 0  # allow completion
```

**Note:** These hooks only fire when Agent Teams is enabled (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`). They have no effect in regular single-session mode.

---

## Work With Us

Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products with developer communities and deliver B2B AI solutions. If you need custom hook systems, automated quality gates, or production-grade Claude Code automation for your team — we build this for clients.

**[uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)**
