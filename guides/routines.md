# Claude Code Routines

Routines are scheduled, recurring Claude Code sessions — they run a predefined prompt on a cron-like schedule without you being present. Set one up and Claude will triage your PRs every morning, audit dependencies every Monday, or generate a standup briefing before your 9am.

---

## What Routines Are

A routine is a Claude Code session that:
- Starts at a scheduled time (not triggered by you)
- Runs a specific prompt you define
- Operates in a working directory you specify
- Uses whatever tools and skills are configured for that project
- Logs output you can review afterward

Routines are not daemons. Each invocation is a fresh session — no memory of the previous run unless you explicitly write state to a file and read it in the prompt.

---

## Where to Configure

**Web interface:** claude.ai/code → Routines tab → New Routine

**Settings file** (`settings.json` or `~/.claude/settings.json`):

```json
{
  "routines": [
    {
      "name": "daily-pr-triage",
      "schedule": "0 8 * * 1-5",
      "prompt": "Review all open PRs in this repo. For each PR: check if CI is passing, identify any review comments that need a response, flag PRs older than 3 days with no activity. Write a summary to .claude/pr-triage.md",
      "workingDirectory": "/home/user/projects/my-app",
      "model": "claude-sonnet-4-5"
    }
  ]
}
```

---

## Routine Definition Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | yes | Unique identifier, shown in logs |
| `schedule` | string | yes | Cron expression or natural language |
| `prompt` | string | yes | The full prompt Claude receives when the session starts |
| `workingDirectory` | string | yes | Absolute path; Claude's cwd for the session |
| `model` | string | no | Defaults to your configured default model |
| `maxTurns` | integer | no | Hard stop after N turns (prevents runaway sessions) |
| `enabled` | boolean | no | `false` to pause a routine without deleting it |

### Schedule Formats

```
# Cron expression
"schedule": "0 8 * * 1-5"        # 8am Monday–Friday
"schedule": "0 9 * * 1"          # 9am every Monday
"schedule": "0 23 * * *"         # 11pm every night
"schedule": "0 */4 * * *"        # Every 4 hours

# Natural language (converted to cron internally)
"schedule": "every weekday at 8am"
"schedule": "every Monday at 9am"
"schedule": "daily at 11pm"
"schedule": "every 4 hours"
```

---

## Common Routine Patterns

### Daily PR Triage

```json
{
  "name": "pr-triage",
  "schedule": "0 8 * * 1-5",
  "prompt": "Check all open PRs using gh pr list. For each: note CI status, days open, and whether there are unresolved review comments. Output a markdown table to .claude/daily-triage.md. Flag anything blocked or stale.",
  "workingDirectory": "/home/user/projects/my-app",
  "model": "claude-haiku-4-5"
}
```

### Weekly Dependency Audit

```json
{
  "name": "dep-audit",
  "schedule": "0 9 * * 1",
  "prompt": "Run npm audit and npm outdated. Summarize critical vulnerabilities and packages more than 2 major versions behind. Write findings to .claude/dep-audit.md with a recommended action for each item.",
  "workingDirectory": "/home/user/projects/my-app",
  "model": "claude-haiku-4-5"
}
```

### Nightly Test Run and Summary

```json
{
  "name": "nightly-tests",
  "schedule": "0 23 * * *",
  "prompt": "Run the full test suite with npm test. Capture output. If any tests fail, analyze the failure, check git log for today's commits that touched those files, and write a failure report to .claude/test-failures.md including the most likely cause per failure.",
  "workingDirectory": "/home/user/projects/my-app",
  "model": "claude-sonnet-4-5",
  "maxTurns": 20
}
```

### Daily Standup Briefing

```json
{
  "name": "standup-prep",
  "schedule": "30 8 * * 1-5",
  "prompt": "Prepare my standup briefing for today. Read: (1) git log --since=yesterday to see what I committed, (2) .claude/pr-triage.md for PR status, (3) any TODO comments I left in code yesterday. Write a 3-section standup doc to .claude/standup-today.md: What I did, What I'm doing today, Blockers.",
  "workingDirectory": "/home/user/projects/my-app",
  "model": "claude-haiku-4-5"
}
```

---

## Routines vs Hooks vs `/loop`

| | Routines | Hooks | `/loop` |
|---|---|---|---|
| **Trigger** | Schedule (cron) | Event in active session | Continuous / interval in current session |
| **Session** | New session each run | Fires within existing session | Current session |
| **You present?** | No | Yes (or running unattended) | Yes (or running unattended) |
| **Use for** | Recurring background tasks | Reactive automation | Ongoing monitoring within a session |

**Key distinction:** Routines and hooks are not alternatives — they compose. A routine starts a new session on a schedule, and any hooks configured for that project fire during that session as normal.

---

## Combining Routines with Hooks

When a routine runs, the full Claude Code session lifecycle applies. Hooks configured in `settings.json` fire at their normal event points:

```
Routine fires at 8am
  → New Claude Code session starts
  → Claude reads prompt and begins work
  → PostToolCall hook fires after each tool use (e.g., runs linter)
  → Stop hook fires when Claude finishes (e.g., sends Slack notification)
```

Example: routine runs tests nightly, `Stop` hook sends results to Slack:

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/notify-slack.sh"
          }
        ]
      }
    ]
  }
}
```

---

## Debugging Failed Routines

1. **Check the Routines log** — claude.ai/code → Routines tab → click the routine → view run history. Each run shows start time, end time, turn count, and exit status.

2. **Inspect session output** — the full transcript is available in the run detail view. Look for tool errors, permission denials, or Claude stopping early.

3. **Test the prompt manually** — copy the routine prompt and run it interactively in the same working directory. This isolates whether the issue is the prompt logic or the scheduling.

4. **Check `maxTurns`** — if a routine stops mid-task, it may have hit the turn limit. Increase `maxTurns` or make the prompt more focused.

5. **Check working directory** — a routine that can't find files often has a wrong `workingDirectory`. Use absolute paths.

---

## Programmatic Routine Management

Claude Code now exposes three tools for managing routines from within a session — no need to edit settings.json manually:

**CronCreate** — create a new routine from inside a Claude Code session:
```
CronCreate(
  prompt: "Check all open PRs and write summary to .claude/pr-triage.md",
  schedule: "0 8 * * 1-5",
  name: "daily-pr-triage"           // optional
)
```
Returns the created routine's ID. The routine is immediately active.

**CronList** — list all routines configured for the current project:
```
CronList()
```
Returns array of routines with id, name, schedule, last run time, next run time, and enabled status.

**CronDelete** — remove a routine by ID:
```
CronDelete(id: "routine-abc123")
```

**When this matters:**
- Ask Claude to set up a routine mid-session: "Create a routine that runs my test suite every night at 11pm"
- Claude can create routines as part of project setup workflows
- Combine with `skill/productivity/autofix-pr.md` skill: Claude sets up the routine itself after you install the skill

**Example — Claude sets up its own monitoring:**
```
User: "Set up a routine to audit our npm dependencies every Monday morning"
Claude: [calls CronCreate with appropriate prompt and schedule "0 9 * * 1"]
Claude: "Done — routine 'dep-audit' will run every Monday at 9am. Use CronList to verify."
```

**Session crons vs. persistent routines:** CronCreate creates persistent routines that survive session end. For within-session scheduling (fire once after a delay), use ScheduleWakeup instead.

---

## Inspecting Active Routines from Hooks

The Stop hook payload now includes a `session_crons` field listing all routines that were active during the session. This lets your Stop hook log which routines are scheduled, or alert if a critical routine was deleted.

Example Stop hook that logs active routines:
```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/log-session-crons.sh"
          }
        ]
      }
    ]
  }
}
```

```bash
#!/usr/bin/env bash
# log-session-crons.sh
INPUT=$(cat)
SESSION_CRONS=$(echo "$INPUT" | python3 -c "
import json, sys
data = json.load(sys.stdin)
crons = data.get('session_crons', [])
for c in crons:
    print(f\"  {c.get('name','unnamed')} → {c.get('schedule','?')}\")
")
if [ -n "$SESSION_CRONS" ]; then
  echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] Active routines this session:" >> .claude/session.log
  echo "$SESSION_CRONS" >> .claude/session.log
fi
```

---
