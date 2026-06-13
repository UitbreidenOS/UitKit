# Autonomous Task Loop

Long-running Claude Code session that works through a task queue without human intervention — reads tasks, executes, verifies, marks done, and continues until the queue is empty or a termination condition is hit.

---

## When to use

- Processing a large backlog of similar tasks (code review, migration, lint fixes, test generation)
- Overnight or weekend automation runs where no human is available to continue sessions
- CI/CD pipeline steps that require agentic judgment, not just script execution
- Batch operations where the unit of work is well-defined and the error boundary is clear

Do not use for tasks requiring human judgment on each item, destructive operations without dry-run validation, or workflows where a single bad decision cascades across all remaining tasks.

---

## Phases / Steps

### The Loop Pattern

```
read task from queue
  → execute task
    → verify output
      → mark done / mark failed
        → read next task (or terminate)
```

Each iteration writes state before moving on. If the session dies mid-task, the next session picks up from the last committed state rather than re-running completed work.

---

### Task Queue Format

Tasks live in `.claude/tasks.jsonl` — one JSON object per line, appended in order.

```jsonl
{"id": "t_001", "type": "review_pr", "payload": {"pr_number": 1042, "repo": "api-service"}, "status": "pending"}
{"id": "t_002", "type": "review_pr", "payload": {"pr_number": 1043, "repo": "api-service"}, "status": "pending"}
{"id": "t_003", "type": "auto_merge", "payload": {"pr_number": 1038, "repo": "api-service"}, "status": "pending", "requires_approval": true}
```

**Status values:** `pending` → `in_progress` → `done` | `failed` | `skipped`

**Required fields:** `id` (unique), `type` (task handler key), `payload` (task-specific data), `status`

**Optional fields:**
- `requires_approval: true` — human-in-the-loop gate before execution
- `dry_run: true` — execute logic but skip writes/mutations
- `depends_on: ["t_001"]` — do not run until listed tasks are `done`
- `max_retries: 3` — retry on failure before marking `failed`

---

### State Persistence

After each task completes (success or failure), write the updated state to `.claude/loop-state.json`:

```json
{
  "session_id": "loop_20260523_1400",
  "started_at": "2026-05-23T14:00:00Z",
  "last_updated": "2026-05-23T14:47:33Z",
  "iteration": 17,
  "tasks_total": 50,
  "tasks_done": 16,
  "tasks_failed": 1,
  "tasks_remaining": 33,
  "error_count": 1,
  "last_task_id": "t_016",
  "status": "running"
}
```

On session start, the loop agent reads this file to resume from where it left off. If the file does not exist, it is a fresh run.

---

### Keepalive Mechanism

Claude Code sessions end when Claude stops responding. The Stop hook injects a continuation message to restart the loop automatically.

**`.claude/settings.json` entry:**

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/loop-keepalive.sh"
          }
        ]
      }
    ]
  }
}
```

**`.claude/loop-keepalive.sh`:**

```bash
#!/bin/bash
# Only keepalive if loop is active and not terminated
STATE_FILE=".claude/loop-state.json"
STOP_SENTINEL=".claude/stop"

if [ -f "$STOP_SENTINEL" ]; then
  echo "Stop sentinel found. Loop terminated." >&2
  exit 0
fi

if [ ! -f "$STATE_FILE" ]; then
  exit 0
fi

STATUS=$(python3 -c "import json,sys; d=json.load(open('$STATE_FILE')); print(d.get('status',''))")
if [ "$STATUS" = "running" ]; then
  echo "Continue the autonomous loop. Read .claude/loop-state.json for current position and .claude/tasks.jsonl for the task queue. Resume from where you left off."
fi
```

The hook fires when Claude stops. If the loop is still in `running` state, the continuation message causes Claude Code to restart the loop automatically.

---

### Loop Termination Conditions

The loop terminates (sets `status: terminated` in loop-state.json) when any of these are true:

| Condition | Trigger | Action |
|-----------|---------|--------|
| Queue empty | No `pending` tasks remain | Set status `completed` |
| Max iterations | `iteration >= max_iterations` (default 200) | Set status `terminated_max_iter` |
| Error threshold | `error_count >= error_budget` (default 5) | Set status `terminated_error_budget` |
| Stop sentinel | `.claude/stop` file exists | Set status `terminated_sentinel` |
| Manual kill | `SIGINT` / `SIGTERM` | Write state, set status `terminated_signal` |

To stop a running loop: `touch .claude/stop` — the next keepalive check will see the sentinel and halt.

---

### Safety Guardrails

**Human-in-the-loop gates:**

For tasks with `requires_approval: true`, the loop pauses and outputs:

```
[LOOP PAUSED — human approval required]
Task: t_003 (auto_merge pr #1038)
Payload: {"pr_number": 1038, "repo": "api-service"}
Type 'approve t_003' to continue or 'skip t_003' to skip this task.
```

The loop waits for a human response before proceeding. This is appropriate for destructive operations (merges, deletes, deploys) even in an otherwise autonomous session.

**Dry-run mode:**

Pass `--dry-run` to the initial loop prompt, or set `dry_run: true` on individual tasks. In dry-run mode, the loop executes all read and analysis steps but skips writes, API mutations, and side effects. Dry-run is the correct first pass for any new task type.

**Error budget auto-abort:**

```python
if state["error_count"] >= ERROR_BUDGET:
    state["status"] = "terminated_error_budget"
    write_state(state)
    print(f"[LOOP ABORTED] Error budget of {ERROR_BUDGET} exceeded. "
          f"Last failed task: {state['last_task_id']}. Review .claude/loop-state.json.")
    break
```

Default error budget is 5 consecutive or cumulative failures. Set higher for noisy tasks, lower for high-stakes operations.

---

### Loop Prompt

The prompt that starts or resumes an autonomous loop:

```
You are running an autonomous task loop. Your state is in .claude/loop-state.json and your task queue is in .claude/tasks.jsonl.

Loop rules:
1. Read loop-state.json to find your current position.
2. Read the next pending task from tasks.jsonl.
3. Execute the task according to its type and payload.
4. Verify the output meets the task's success criteria.
5. Update the task's status in tasks.jsonl (done/failed/skipped).
6. Update loop-state.json with current progress.
7. If the task has requires_approval: true, pause and wait for human input.
8. Check termination conditions. If none apply, proceed to the next task.

On any unexpected error: mark the task failed, increment error_count in state, and continue unless error_count >= error_budget.

Do not ask for permission between tasks unless requires_approval is set. Work autonomously.
```

---

## Example

**CI/CD use case: auto-review and auto-merge 50 PRs**

**Setup:**

```bash
# Generate task queue from open PRs
gh pr list --repo my-org/api-service --state open --limit 50 --json number \
  | jq -r '.[] | {"id": ("t_" + (.number|tostring)), "type": "review_pr", "payload": {"pr_number": .number, "repo": "api-service"}, "status": "pending"}' \
  > .claude/tasks.jsonl

# Add auto-merge tasks for PRs that pass review (depends_on will be set by the loop)
# The review task itself appends an auto_merge task if review passes
```

**Task handler logic (in loop prompt):**

- `review_pr`: fetch PR diff with `gh pr diff {pr_number}`, run code-review skill, post review comment, append result to state
- `auto_merge`: if review passed and CI is green (`gh pr checks {pr_number}`), merge with `gh pr merge {pr_number} --squash`; if CI pending, mark `skipped` and re-queue

**Parallel processing:**

For independent tasks (all review tasks, no merge dependencies), spawn subagents:

```
For tasks t_001 through t_025: spawn a subagent for each review_pr task.
Each subagent writes its result back to tasks.jsonl atomically (use file locking).
Wait for all subagents to complete before processing auto_merge tasks.
```

**Loop execution (50 PRs):**

```
[14:00:00] Loop started. 50 tasks pending.
[14:00:05] Spawned 25 review subagents (t_001–t_025)
[14:12:30] Reviews complete: 22 passed, 3 failed (changes requested)
[14:12:30] Processing auto_merge tasks for 22 approved PRs
[14:14:15] 19 merged (CI green). 3 skipped (CI pending — re-queued for next run).
[14:14:15] Queue empty. Loop completed. 41 done, 3 skipped, 3 failed (changes requested).
[14:14:15] Status: completed. Written to .claude/loop-state.json.
```

Total time: ~14 minutes for 50 PRs. Equivalent manual time: 3–4 hours.

---
