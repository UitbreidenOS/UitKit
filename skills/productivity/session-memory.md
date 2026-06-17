---
name: session-memory
description: "Claude Code session checkpoints and state restoration. Serialize working directory, uncommitted git status, recently modified files, and active task description into checkpoint.json to resume context later"
updated: 2026-06-17
---

# Session Memory — Context Checkpoint & Restore

## When to activate
- Pausing a development session or ending work for the day.
- Switching to a different git branch or task context.
- Exporting active context to hand off to another developer, peer agent, or a fresh Claude Code terminal.
- Recovering context after a terminal crash, rate-limit timeout, or model context window flush.

## When NOT to use
- Simple, quick edits that do not require multiple steps or git changes.
- Automated scripts or deployment pipelines that run without interactive sessions.

## Instructions

The Session Memory system serializes the state of the workspace (including git status, file changes, and task objectives) to `.claude/checkpoint.json` and loads it to recreate the exact developer state.

```
       [Active Session] ──► npx claudient checkpoint "building DB models"
                                    │
                                    ▼
                        Writes .claude/checkpoint.json
                                    │
                                (Exit/Pause)
                                    │
       [Fresh Session] ◄──  npx claudient restore
```

### 1. Saving Session State (`checkpoint`)
To save the active state, run the checkpoint command with a clear description of the tasks in progress:

```bash
npx claudient checkpoint "Fixing middleware routing issues and adding auth tests"
```

This captures:
*   **Timestamp & Directory:** Current time and absolute workspace path.
*   **Git Status:** Uncommitted files, staged files, untracked components.
*   **Recent Modifies:** Any file edited within the last 30 minutes.
*   **Task Summary:** The prompt text detailing where you left off.

### 2. Restoring Session State (`restore`)
In a new or crashed terminal session, run:

```bash
npx claudient restore
```

This reads the checkpoint file and prints a summary layout. Claude Code automatically parses this output and generates a continuation prompt:

> `"Resume execution from the checkpoint. Work context: Fixing middleware routing issues and adding auth tests. Recently edited files: src/middleware/auth.ts, tests/auth.test.ts."`

---

## Example

**Checkpointing a session during database schema refactoring:**

```bash
# 1. Save checkpoint
npx claudient checkpoint "Migrating user table schema to add phone field"
```

**Output:**
```
💾 Checkpoint saved successfully!
- File: .claude/checkpoint.json
- Changed files: 2
- Recent modifications: 3
- Task Summary: "Migrating user table schema to add phone field"
```

**Restoring context in a fresh terminal session:**
```bash
# 2. Restore checkpoint
npx claudient restore
```

**Output:**
```
🔄 CLAUDIENT CHECKPOINT RESTORE REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Saved At:        2026-06-17T17:10:00.000Z
Working Dir:     /Users/tushar/Desktop/Claudient
Active Task:     Migrating user table schema to add phone field
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Uncommitted Git Changes:
  - M src/models/user.py
  - ?? migrations/002_add_phone.py

Prompt to resume task:
> "Resume execution from the checkpoint. Work context: Migrating user table schema to add phone field. Recently edited files include: src/models/user.py, migrations/002_add_phone.py."
```
Using the printed restore prompt, Claude Code immediately targets the modified files and resumes the migration task without re-scanning the entire repository structure.
