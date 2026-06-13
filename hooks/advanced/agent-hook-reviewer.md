# Hook: Agent Reviewer — Spawn a Code-Review Subagent on Session Stop

Demonstrates the `"type": "agent"` hook, which spawns a full subagent when an event fires. The subagent runs asynchronously with its own tool access, reads the session's changes, and produces a structured review — without blocking the main session or requiring manual invocation.

## What it does

When the main Claude Code session ends (`Stop` event), the harness spawns a subagent configured by the hook's `agent` block. The subagent:

1. Receives the session's `stop_reason`, `session_id`, and `project_dir` in its system context.
2. Reads the git diff of changes made during the session (`git diff HEAD~1` or `git diff --staged`).
3. Evaluates the diff for correctness bugs, security issues, and style violations.
4. Writes a structured review to `.claude/reviews/<session_id>-review.md`.
5. If it finds blocking issues (severity `error`), it also appends a summary to `.claude/reviews/open-issues.log` for the developer to address next session.

The spawned agent has a scoped tool set — only `Bash` (read-only git commands), `Read`, and `Write` to the `.claude/reviews/` directory. It does not have permission to edit project files, make commits, or call external APIs.

Example review output at `.claude/reviews/abc123-review.md`:

```markdown
# Code Review — Session abc123 (2026-06-03T11:00:00Z)

## Summary
3 files changed, 120 insertions, 14 deletions

## Findings

### ERROR — src/auth/token.py:47
Hardcoded fallback secret `"dev-secret-do-not-use"` reachable in production if
`SECRET_KEY` env var is unset. Must be replaced with a hard failure.

### WARNING — src/api/users.py:112
N+1 query in `list_users()` — `get_user_permissions()` called inside loop.
Consider a bulk fetch before the loop.

### INFO — tests/test_auth.py
Good: new token expiry tests cover both the happy path and the expired-token branch.
```

## When it fires

`Stop` — fires when the main session ends, either because the user typed `/exit`, the task completed, or the session timed out. The subagent runs after the session has already stopped; it does not delay the user's ability to close the terminal.

Other useful pairings for the `agent` hook type:

| Event | Subagent purpose |
|---|---|
| `Stop` | Post-session code review, cost summary, changelog entry |
| `SubagentStop` | Validate subagent output before it is surfaced to the main agent |
| `PostToolUse` (Write) | Trigger a documentation-update agent when source files change |

## settings.json entry

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "agent",
            "agent": {
              "prompt": "You are a code reviewer. A Claude Code session has just ended. Your job is to review the changes made during this session and write a structured report.\n\nSteps:\n1. Run `git diff HEAD~1 --stat` to see which files changed.\n2. Run `git diff HEAD~1` to read the full diff.\n3. Analyse the diff for: correctness bugs, security issues (hardcoded secrets, injection vectors, missing auth checks), performance problems (N+1 queries, unbounded loops), and missing test coverage.\n4. Write your findings to `.claude/reviews/${CLAUDE_SESSION_ID}-review.md` using this format:\n   - A Summary section (files changed, lines added/removed)\n   - A Findings section with severity labels: ERROR / WARNING / INFO\n   - Each finding: severity, file:line, one-sentence description, one-sentence recommendation\n5. If any ERROR-severity findings exist, append a one-line summary to `.claude/reviews/open-issues.log`.\n6. If there are no changes (clean working tree), write a one-line note and exit.\n\nBe concise. Findings should be actionable. Do not restate the diff — diagnose and recommend.",
              "model": "claude-sonnet-4-5",
              "tools": ["Bash", "Read", "Write"],
              "tool_permissions": {
                "Bash": {
                  "allow": ["git diff*", "git log*", "git show*", "git status*"],
                  "deny": ["git commit*", "git push*", "git reset*", "rm *", "curl *"]
                },
                "Write": {
                  "allow": [".claude/reviews/*"]
                }
              },
              "max_turns": 10,
              "timeout": 120
            }
          }
        ]
      }
    ]
  }
}
```

## The spawned agent's tools and output

**Tools available to the subagent:**

| Tool | Scope |
|---|---|
| `Bash` | Read-only git commands only (`git diff`, `git log`, `git show`, `git status`). Write commands are blocked by the `tool_permissions` deny list. |
| `Read` | Unrestricted — can read any file in the project to understand context around a diff hunk. |
| `Write` | Restricted to `.claude/reviews/` — cannot modify project files. |

**Output artefacts:**

- `.claude/reviews/<session_id>-review.md` — the full structured review for this session.
- `.claude/reviews/open-issues.log` — append-only log of ERROR-severity findings across sessions. Check this file at the start of a new session to pick up unresolved issues.

**Subagent lifecycle:**

The subagent is spawned asynchronously after `Stop`. It runs in a separate process; the terminal is free immediately. The harness writes the subagent's exit status to `.claude/reviews/<session_id>-agent.log`. If the subagent exceeds `timeout` (120 seconds), the harness kills it and writes a partial review with a timeout notice.

## Notes

- Set `"model": "claude-sonnet-4-5"` for the reviewer. Haiku produces shallow findings on complex diffs; Opus is unnecessary for structured pattern matching. Sonnet hits the right quality/cost balance.
- `max_turns: 10` is sufficient for most diffs. If your sessions routinely change more than 20 files, raise to 20 and increase `timeout` proportionally.
- Add `.claude/reviews/` to `.gitignore` unless you want reviews committed alongside code. Reviews contain session metadata that is not useful in version history.
- The `tool_permissions` allow/deny lists use glob patterns. Tighten or relax as needed — for example, add `"git stash*"` to the allow list if your workflow uses stashes.
- To surface reviews in the next session automatically, add a `Start` lifecycle hook that reads `open-issues.log` and prepends the unresolved findings to Claude's initial context.

---


📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
