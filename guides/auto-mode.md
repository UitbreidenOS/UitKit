# Auto Mode and Autonomous Operation

Auto mode lets Claude operate with minimal interruptions — it auto-approves safe, non-destructive operations and only pauses for human input on actions that are irreversible or carry real risk. Use it for long-running tasks where constant approval prompts break your flow.

---

## How to Enable

**Slash command (toggles for current session):**
```
/auto
```

**Settings file:**
```json
{
  "autoMode": true
}
```

**CLI flag:**
```bash
claude --auto "Refactor all API handlers to use the new error middleware"
```

**Combined with effort for overnight autonomous work:**
```bash
claude --auto --effort xhigh "Implement the full feature spec in tasks.jsonl"
```

---

## What Changes in Auto Mode

In a standard session, Claude prompts for confirmation before most tool calls. In auto mode, confirmation is tiered:

### Permission Tiers

**Always auto-approve (no prompt)**
- `Read` — reading any file
- `Grep` / `Glob` — searching the codebase
- `Bash` (read-only) — `ls`, `cat`, `find`, `git log`, `git diff`, `git status`, `npm list`, running test commands that don't mutate state
- `WebFetch` (GET requests)

**Ask once per session (prompt first time, remember answer)**
- `git add`, `git commit`, `git checkout`
- `npm install`, `npm ci`
- Writing new files
- Creating directories

**Always ask (prompt every time)**
- File deletion (`rm`, `unlink`)
- `git push --force`
- Database writes (INSERT, UPDATE, DELETE via MCP or CLI)
- External API calls that mutate state (POST, PUT, PATCH, DELETE)
- Any `Bash` command containing `sudo`
- Commands that modify system configuration

---

## Safety Mechanisms

### `--max-cost` flag
Stop the session if spending exceeds a dollar threshold:
```bash
claude --auto --max-cost 5.00 "Refactor the entire auth module"
```
Session terminates cleanly when cost hits the limit. Claude writes a progress summary before stopping.

### `.claude/stop` sentinel file
Create this file at any point to terminate an autonomous session:
```bash
touch .claude/stop
```
Claude checks for this file between turns. When it exists, the session ends gracefully. Remove the file before starting the next session.

### Keepalive hook
For sessions running overnight or across network interruptions, configure a keepalive that restarts Claude if it stops unexpectedly:

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "incomplete",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/keepalive.sh"
          }
        ]
      }
    ]
  }
}
```

```bash
# .claude/hooks/keepalive.sh
# Only restart if there are remaining tasks and no stop sentinel
if [ ! -f ".claude/stop" ] && [ -s ".claude/tasks.jsonl" ]; then
  claude --auto --effort high "Continue working through tasks.jsonl"
fi
```

### `maxTurns`
Hard cap on the number of turns per session:
```json
{
  "autoMode": true,
  "maxTurns": 100
}
```

---

## Auto Mode vs `--dangerously-skip-permissions`

These are not the same thing:

| | Auto Mode | `--dangerously-skip-permissions` |
|---|---|---|
| **Destructive ops** | Still prompts | Bypassed entirely — no prompts at all |
| **File deletion** | Always asks | Auto-approved |
| **Force push** | Always asks | Auto-approved |
| **Use for** | Long tasks with a human nearby | Fully trusted sandboxes, CI environments |
| **Risk level** | Low — destructive gate remains | High — no safety net |

Never use `--dangerously-skip-permissions` in interactive development. It is designed for sandboxed CI pipelines where Claude has been scoped to a throwaway environment.

---

## Best Practices for Autonomous Operation

**Define a task queue before starting.** Claude works through defined tasks more reliably than an open-ended prompt. Use `.claude/tasks.jsonl`:

```jsonl
{"id": "1", "task": "Add input validation to all POST endpoints in src/routes/", "status": "pending"}
{"id": "2", "task": "Write tests for each validation rule added in task 1", "status": "pending"}
{"id": "3", "task": "Update API docs to reflect new validation errors", "status": "pending"}
```

```bash
claude --auto "Work through tasks in .claude/tasks.jsonl. Mark each task done as you complete it."
```

**Set max iterations explicitly.** Open-ended autonomous sessions drift. A `maxTurns` of 50–150 is appropriate for most multi-hour tasks.

**Test with `--dry-run` first.** Run the same prompt with `--dry-run` to see the planned tool calls before allowing execution:
```bash
claude --auto --dry-run "Delete all TODO comments from the codebase"
```

**Scope the working directory.** Auto mode respects project boundaries. Run Claude from the project root or a subdirectory to limit what it can reach.

**Review the session transcript afterward.** Auto-mode sessions produce a full transcript. Read it — Claude's decisions in a long autonomous session are worth auditing, especially the "ask once per session" choices it made.

---

## Example: Overnight Autonomous Refactor

```bash
# Create task queue
cat > .claude/tasks.jsonl << 'EOF'
{"id": "1", "task": "Find all usages of the deprecated fetchUser() function across src/", "status": "pending"}
{"id": "2", "task": "Replace each fetchUser() call with the new getUser() API, preserving error handling", "status": "pending"}
{"id": "3", "task": "Run the test suite and fix any failures caused by the migration", "status": "pending"}
{"id": "4", "task": "Delete the deprecated fetchUser() function and its tests", "status": "pending"}
{"id": "5", "task": "Update CHANGELOG.md with a summary of the deprecation removal", "status": "pending"}
EOF

# Start autonomous session with cost cap
claude --auto --effort high --max-cost 8.00 \
  "Work through .claude/tasks.jsonl in order. Mark each task completed in the file when done. Stop if you encounter an ambiguity that requires a product decision."
```

---
