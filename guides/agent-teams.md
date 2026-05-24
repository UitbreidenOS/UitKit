# Agent Teams — Multi-Session Coordination

Agent teams let you run multiple Claude Code instances working together as a coordinated team. One session acts as the lead — coordinating work, assigning tasks, and synthesizing results. Teammates work independently, each in their own context window, and can communicate directly with each other.

Unlike subagents (which run inside a single session and only report back to the caller), agent team teammates are fully independent Claude Code sessions that share a task list and message each other directly.

**This feature is experimental** and disabled by default.

---

## When to Use Agent Teams

| Use case | Why teams work |
|----------|---------------|
| Research and review | Multiple teammates investigate different aspects simultaneously, then share and challenge findings |
| New modules/features | Each teammate owns a separate piece without stepping on each other |
| Debugging with competing hypotheses | Teammates test different theories in parallel and converge faster |
| Cross-layer coordination | Frontend, backend, and test changes each owned by a different teammate |

When NOT to use teams (use a single session or subagents instead):

- **Sequential tasks** where each step depends on the previous
- **Same-file edits** — teammates will overwrite each other
- **Work with many inter-task dependencies** — coordination overhead dominates
- **Simple tasks** where the overhead of spawning a team exceeds the benefit

---

## Agent Teams vs Subagents

| | Subagents | Agent Teams |
|---|---|---|
| Context | Own context; results return to caller | Own context; fully independent |
| Communication | Report back to main agent only | Teammates message each other directly |
| Coordination | Main agent manages all work | Shared task list with self-coordination |
| Best for | Focused tasks where only the result matters | Complex work requiring discussion and collaboration |
| Token cost | Lower (results summarized back) | Higher (each teammate is a separate Claude instance) |

Rule of thumb: use subagents when workers just need to report back. Use teams when workers need to share findings, challenge each other, and coordinate on their own.

---

## Enabling Agent Teams

Add the experimental flag to your settings:

```json
// ~/.claude/settings.json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

Or set it in your shell:

```bash
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
```

Requires Claude Code v2.1.32 or later. Check with `claude --version`.

---

## Starting a Team

After enabling, tell Claude to create a team in natural language:

```
I'm designing a CLI tool for tracking TODO comments. Create an agent team:
one teammate on UX, one on technical architecture, one playing devil's advocate.
```

Claude creates the team, spawns teammates, coordinates work, and synthesizes findings. You don't need to write config files — describe the team structure in your prompt.

---

## Display Modes

Two display modes control how teammates appear in your terminal.

### In-process (default)

All teammates run in your main terminal.

| Key | Action |
|-----|--------|
| `Shift+Down` | Cycle through teammates |
| Type | Message a teammate directly |
| `Enter` | View a teammate's session |
| `Escape` | Interrupt the teammate's current turn |
| `Ctrl+T` | Toggle the shared task list |

Works in any terminal. No extra setup required.

### Split panes

Each teammate gets its own terminal pane. You can see everyone's output at once and click into a pane to interact directly.

Requires **tmux** or **iTerm2**:
- tmux: install via your package manager (`brew install tmux`, `apt install tmux`)
- iTerm2: install the `it2` CLI and enable Python API in iTerm2 preferences

### Configuration

```json
{
  "teammateMode": "in-process"
}
```

Valid values: `"in-process"`, `"tmux"`, `"auto"` (detects available terminal multiplexer).

Override per-session:

```bash
claude --teammate-mode in-process
```

---

## Task List and Assignment

The shared task list coordinates work across all teammates. Tasks have three states:

| State | Meaning |
|-------|---------|
| **pending** | Not yet claimed by any teammate |
| **in progress** | Claimed and actively being worked on |
| **completed** | Done |

Tasks can depend on other tasks. A pending task with unresolved dependencies cannot be claimed until those dependencies complete.

### Assignment modes

- **Lead assigns** — tell the lead which task to give to which teammate
- **Self-claim** — after finishing a task, a teammate picks up the next unassigned, unblocked task automatically

Task claiming uses file locking to prevent race conditions when multiple teammates try to claim simultaneously.

---

## Specifying Teammates and Models

Claude decides team size from the task, or you can be explicit:

```
Create a team with 4 teammates to refactor these modules in parallel.
Use Sonnet for each teammate.
```

Teammates do not inherit the lead's `/model` selection by default. To change this, set **Default teammate model** in `/config` and pick **Default (leader's model)**.

---

## Plan Approval Gates

For risky tasks, require teammates to plan before implementing:

```
Spawn an architect teammate to refactor the auth module.
Require plan approval before they make any changes.
```

When a teammate finishes planning, it sends a plan approval request to the lead. The lead reviews and either:

- **Approves** — teammate begins implementation
- **Rejects with feedback** — teammate revises the plan and resubmits

You can influence the lead's judgment:

```
Only approve plans that include test coverage.
Reject plans that modify the database schema.
```

---

## Talking to Teammates Directly

Each teammate is a full, independent Claude Code session. You can message any teammate at any time.

- **In-process mode:** `Shift+Down` to cycle to the teammate, then type your message
- **Split-pane mode:** click into the teammate's pane and type directly

---

## Using Subagent Definitions as Teammates

Reference an existing subagent type when spawning a teammate:

```
Spawn a teammate using the security-reviewer agent type to audit the auth module.
```

The teammate uses that definition's `tools` allowlist and `model`. The definition's body is appended to the teammate's system prompt as additional instructions.

**What carries over:** `tools`, `model`, system prompt body.

**What does NOT carry over:** `skills` and `mcpServers`. Teammates load skills and MCP servers from project/user settings like any regular session.

---

## Architecture and Storage

| Component | Role |
|-----------|------|
| Team lead | Main session that creates the team, spawns teammates, coordinates |
| Teammates | Separate Claude Code instances that work on assigned tasks |
| Task list | Shared work items that teammates claim and complete |
| Mailbox | Messaging system for communication between agents |

### Storage locations

| Path | Contents |
|------|----------|
| `~/.claude/teams/{team-name}/config.json` | Team configuration (auto-generated, do not edit by hand) |
| `~/.claude/tasks/{team-name}/` | Shared task list data |

There is no project-level team config. A file like `.claude/teams/teams.json` in your project directory is not recognized.

---

## Permissions

All teammates start with the lead's permission settings. If the lead runs with `--dangerously-skip-permissions`, all teammates do too.

You can change individual teammate modes after spawning, but not at spawn time.

---

## Context and Communication

### What teammates receive

Teammates load the same project context as a regular session: `CLAUDE.md`, MCP servers, skills. They also receive the spawn prompt from the lead. The lead's conversation history does NOT carry over.

### How communication works

- Messages deliver automatically (no polling needed)
- Idle notifications are sent to the lead when a teammate stops
- Shared task list is visible to all agents
- Message any teammate by name (names assigned by the lead at spawn)

---

## Hook Events for Agent Teams

Three hook events provide quality gates for team coordination.

### TeammateIdle

Fires when a teammate is about to go idle. Exit code `2` sends feedback and keeps the teammate working.

### TaskCreated

Fires when a task is being created. Exit code `2` prevents creation with feedback.

### TaskCompleted

Fires when a task is being marked complete. Exit code `2` prevents completion with feedback.

```json
{
  "hooks": {
    "TaskCompleted": [{
      "hooks": [{
        "type": "command",
        "command": "bash ~/.claude/hooks/verify-task-tests.sh"
      }]
    }]
  }
}
```

Use `TaskCompleted` hooks to enforce standards — for example, verifying that a teammate wrote tests before marking a task done.

---

## Shutdown and Cleanup

### Shutting down a teammate

```
Ask the researcher teammate to shut down.
```

The teammate can approve (exits gracefully) or reject with an explanation of why it should keep running.

### Cleaning up the team

```
Clean up the team.
```

Always use the lead to clean up. Teammates should not run cleanup themselves. Shut down all teammates before running cleanup.

---

## Best Practices

1. **Team size: 3-5 teammates.** More means more coordination overhead with diminishing returns.
2. **Tasks per teammate: 5-6.** Keeps everyone productive without excessive context switching.
3. **Give context.** Teammates do not inherit the lead's conversation. Include task-specific details in spawn prompts.
4. **Avoid file conflicts.** Assign each teammate different files. Two teammates editing the same file causes overwrites.
5. **Start with research.** If new to teams, start with non-coding tasks (review, research, investigation) before parallel implementation.
6. **Monitor and steer.** Check in on progress. Letting a team run unattended too long increases risk of wasted effort.
7. **Wait for teammates.** Tell the lead "wait for your teammates to complete their tasks before proceeding" if it starts implementing instead of delegating.

---

## Use Case Examples

### Parallel Code Review

```
Create an agent team to review PR #142. Spawn three reviewers:
- One focused on security implications
- One checking performance impact
- One validating test coverage
Have them each review and report findings.
```

### Competing Hypotheses

```
Users report the app exits after one message. Spawn 5 teammates to
investigate different hypotheses. Have them talk to each other to
disprove each other's theories. Update findings doc with consensus.
```

### Cross-Layer Feature

```
Build the notifications feature. Spawn teammates:
- Backend: API endpoints and database schema
- Frontend: React components and state management
- Tests: integration and unit tests for both layers
Each teammate owns their layer. Coordinate via the shared task list.
```

---

## Limitations

- No session resumption with `/resume` or `/rewind` for in-process teammates
- Task status can lag — teammates sometimes fail to mark tasks complete
- Shutdown can be slow (teammates finish their current request first)
- One team at a time per lead
- No nested teams (teammates cannot spawn their own teams)
- Lead is fixed for the team's lifetime
- Permissions are set at spawn (change individually after, not at spawn time)
- Split panes require tmux or iTerm2 (not VS Code terminal, Windows Terminal, or Ghostty)

---

## Token Cost

Agent teams use significantly more tokens than a single session. Each teammate has its own context window, and token usage scales linearly with active teammates.

For research, review, and new features the extra tokens are usually worthwhile. For routine tasks, a single session is more cost-effective.

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
