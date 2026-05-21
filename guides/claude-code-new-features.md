# Claude Code New Features Guide (2026)

The definitive guide to Claude Code's latest capabilities — based on the official changelog and What's New docs. Covers Agent View, /goal, /ultrareview, Auto Mode, Opus 4.7, Computer Use, Ultraplan, and the redesigned desktop.

---

## Quick Reference — All New Commands

| Command | What it does | Since |
|---|---|---|
| `claude agents` | Dashboard for all parallel sessions | v2.1.139 |
| `/goal [condition]` | Claude works autonomously until condition is met | v2.1.139 |
| `/ultrareview` | Fleet of cloud agents reviews your code | v2.1.111 |
| `claude ultrareview [target]` | Non-interactive cloud review for CI | v2.1.120 |
| `/effort` | Interactive slider to set intelligence level | v2.1.111 |
| `/loop [interval]` | Run a command on a recurring schedule | v2.1.95 |
| `/goal` | Autonomous task completion | v2.1.139 |
| `/autofix-pr` | Auto-fix PRs from your terminal | v2.1.100 |
| `/team-onboarding` | Package your setup as a replayable guide | v2.1.100 |
| `claude project purge` | Delete all local state for a project | v2.1.126 |
| `--plugin-url <url>` | Load plugin from a URL for current session | v2.1.129 |
| `--plugin-dir <path.zip>` | Load plugin from a .zip archive | v2.1.128 |

---

## Agent View — All Sessions in One Dashboard

`claude agents` (launched May 11, 2026 — Research Preview) gives you one screen for every Claude Code session: what's running, what's blocked waiting for your input, what's done.

```bash
# Open Agent View
claude agents

# Agent View with specific settings
claude agents --model claude-opus-4-7 --effort xhigh

# List sessions as JSON (for scripting, status bars, tmux)
claude agents --json

# Scope to a specific directory
claude agents --cwd /path/to/project
```

**What you see:**
- Every running session with its current task and status
- Sessions blocked on your input (flagged prominently)
- Completed sessions with how long they ran
- Real-time costs per session

**Reply without losing context:**
You can respond to any waiting session directly from Agent View without switching terminal windows.

**Tab title shows waiting count:**
The terminal tab title updates to show how many sessions are waiting for your input — glanceable without opening Agent View.

**Best practice — parallel worktree sessions:**
```bash
# Create isolated worktrees for each task
git worktree add ../myapp-auth feature/auth
git worktree add ../myapp-payments fix/payment-timeout
git worktree add ../myapp-docs docs/api-reference

# Start Claude in each (background mode)
cd ../myapp-auth     && claude --bg "implement OAuth with Better Auth"
cd ../myapp-payments && claude --bg "fix the Stripe webhook signature verification"
cd ../myapp-docs     && claude --bg "write API documentation for all routes"

# Monitor all three from one screen
claude agents
```

---

## /goal — Autonomous Task Completion

Set a measurable completion condition. Claude iterates — writing code, running tests, fixing errors — until the condition holds.

```bash
# In interactive mode
/goal all tests pass for the auth module

# With a specific measurable condition
/goal the /api/users endpoint returns 201 with valid input and 422 with invalid email

# With a time budget
/goal migrate the database schema and verify all existing tests still pass

# Runs in non-interactive mode too (-p flag)
claude -p "..." --goal "all TypeScript errors resolved"
```

**How /goal works:**
1. Claude understands the current state
2. Writes or fixes code toward the goal
3. Runs tests or verification commands
4. Reads the results, fixes errors
5. Repeats until the goal condition holds or a dead end is reached
6. Stops and reports outcome

**Good goals (specific, testable):**
```
/goal npm test passes with zero failures
/goal the Lighthouse score for the homepage is above 90
/goal the Docker container builds and all health checks pass
/goal all TypeScript errors in src/ are resolved
/goal the migration runs cleanly on the staging database
```

**Avoid vague goals:**
```
/goal make the app better           ← not testable
/goal fix all the bugs              ← too open-ended
/goal improve code quality          ← no clear signal
```

**Note:** /goal evaluator waits for all running shells and subagents to finish before checking the condition.

---

## /ultrareview — Cloud Fleet Code Review

A fleet of specialized agents runs in the cloud to review your code. Findings land directly in your CLI or Desktop.

```bash
# Review current branch (interactive)
/ultrareview

# Review a specific PR
/ultrareview PR#123

# Non-interactive (for CI/CD scripts)
claude ultrareview                    # review current branch
claude ultrareview --pr 123          # review specific PR
claude ultrareview --focus security  # focus on security only
```

**What the fleet checks:**
- Security vulnerabilities (injection, auth bypass, exposed secrets)
- Logic errors and edge cases missed in tests
- Performance bottlenecks (N+1 queries, memory leaks)
- Breaking API changes
- Test coverage gaps

**vs. /code-review (local):**
- `/code-review` — single agent, current session context, faster
- `/ultrareview` — multiple specialized agents in parallel, broader coverage, best for pre-merge

---

## Auto Mode — Intelligent Permission Handling

Auto mode classifies your permission prompts automatically:
- **Safe operations** (read-only, sandboxed) → run without interrupting you
- **Risky operations** (destructive, network, credential access) → blocked or escalated

```bash
# Enable auto mode
claude --auto-mode

# Auto mode is now available without the flag for Max subscribers
# On Opus 4.7 with Max subscription: enabled by default

# Hard deny rules (unconditionally blocked regardless of allow exceptions)
# In .claude/settings.json:
{
  "autoMode": {
    "hard_deny": [
      "Bash(rm -rf *)",
      "Bash(git push --force)"
    ]
  }
}
```

**Auto mode spinner turns red** when a permission check stalls — visual signal that something needs your attention.

---

## Claude Opus 4.7 + Effort Levels

Opus 4.7 is now the default model for Max and Team Premium. It introduces the `xhigh` effort level — the recommended setting for complex coding tasks.

```bash
# Set effort level interactively
/effort

# Use the effort slider (arrow keys, Enter to confirm)
# Levels: low → medium → high → xhigh

# Set via command line
claude --effort xhigh "debug this race condition"
claude --effort low   "rename this variable"

# Check effort level in hooks via $CLAUDE_EFFORT
# Or effort.level in hook JSON input

# Fast mode now defaults to Opus 4.7
# Override back to 4.6: CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE=1
```

**When to use each effort level:**

| Level | Use for | Token spend |
|---|---|---|
| `low` | Variable renaming, formatting, simple completions | Minimal |
| `medium` | Standard feature work, debugging common errors | Moderate |
| `high` | Refactors, architecture reviews, writing tests | Higher |
| `xhigh` | Security audits, race conditions, complex multi-file changes | Highest |

**Compress earlier context:**
The Rewind menu now includes "Summarize up to here" — compresses earlier turns while keeping recent context. Reduces cost without losing key decisions.

---

## Computer Use — CLI Control of GUI Apps

Claude can open native apps, click through UI, and verify changes that only a GUI can confirm.

```bash
# Enable computer use (research preview)
claude --computer-use

# Claude can now:
# - Open apps on your desktop
# - Click buttons and fill forms
# - Take screenshots and verify UI state
# - Run end-to-end flows that require a real browser or app
```

**Best use cases:**
- Verifying that a UI change looks correct
- Automating flows that don't have a CLI (legacy apps, complex web UIs)
- Closing the loop after code changes: "does this actually work in the browser?"

**Also available in the Desktop app** — computer use works in both CLI and the redesigned desktop.

---

## Ultraplan — Cloud Planning + Remote Execution

Draft a plan in the cloud, review and comment in a web editor, then run it remotely or pull it back local.

```bash
# Start Ultraplan (early preview)
/ultraplan

# Claude drafts a structured plan
# → You get a URL to review and annotate in a web editor
# → Comment on steps, approve/reject parts
# → Run remotely in a cloud environment
# → Or pull back to local and run there

# The first run auto-creates a cloud environment for you
```

**Ideal for:**
- Long multi-day tasks that benefit from a structured written plan before execution
- Sharing a plan with teammates for review before running
- Tasks that need to run in a clean cloud environment (not your local machine)

---

## Routines — Scheduled Cloud Agents

On Claude Code Web, Routines fire templated cloud agents from a schedule, a GitHub event, or an API call.

```
Example Routines:
- "Every Monday: review open PRs and summarize what needs attention"
- "On push to main: run /ultrareview on the diff"
- "Daily at 9am: check for dependency security advisories"
- "On GitHub issue opened: triage and label it"
```

Configure in the Claude Code Web interface → Routines.

---

## Monitor Tool — Live Log Streaming

The Monitor tool streams background events into the conversation — Claude can tail logs and react in real time.

```bash
# Claude can use Monitor tool automatically when watching processes
# Or you can invoke it explicitly:
/monitor <process or log source>

# Example: Claude watches a deploy and reacts to errors
"Deploy this to staging and monitor the logs — fix any errors that appear"
```

---

## Redesigned Desktop Experience

The Claude Code Desktop (Web) received a major redesign with:

**Parallel layout:**
- Multiple agents visible simultaneously from one window
- Side chats without losing main thread
- Drag-and-drop panel arrangement
- Sessions sidebar for navigating between projects

**Built-in tools:**
- HTML and PDF previewers (view generated output inline)
- In-app file editor (edit files without switching to your IDE)
- Rebuilt diff viewer (review changes without another tool)
- Custom themes (create from `/theme` or via plugin)

**Auto-archive:**
Sessions automatically archive when their associated PR is merged — keeps your workspace clean.

**Session recap:**
When you return to a session that's been running in the background, Claude provides a recap of what happened while you were away.

---

## Plugins: .zip and URL Loading

```bash
# Load a plugin from a .zip file (for current session)
claude --plugin-dir ./my-plugin.zip

# Load from a URL
claude --plugin-url https://example.com/my-plugin.zip

# Browse and install from marketplace
/plugin

# Show plugin details (components, token cost)
claude plugin details <name>

# List plugin components before installing
# /plugin now shows skills, hooks, agents, MCP servers in the browse pane
```

---

## Windows: No Git Bash Required

Claude Code now works natively on Windows with PowerShell — Git for Windows is no longer a prerequisite.

```powershell
# Install Claude Code on Windows (no Git Bash needed)
winget install Anthropic.ClaudeCode

# Or via npm
npm install -g @anthropic-ai/claude-code

# PowerShell is now the primary shell on Windows
# Bash tool falls back to PowerShell automatically
```

---

## Other Notable Additions

**`/loop` self-pacing:**
```bash
/loop 5m /check-deploy    # run every 5 minutes
/loop /monitor-tests      # self-pace (Claude decides interval)
```

**`/team-onboarding`:**
Packages your Claude Code setup (hooks, skills, CLAUDE.md) into a replayable guide for new team members.

**`/autofix-pr`:**
Enables automatic PR fix suggestions from your terminal — Claude monitors CI results and proposes fixes.

**Voice input fixes:**
Voice push-to-talk now works in Agent View's reply pane. Improved reliability on macOS.

**Mobile push notifications:**
When a long task finishes or Claude needs your input, get a push notification on your phone (via Remote Control).
```bash
# Requires Claude Code Remote Control setup
# Configure in Desktop Settings → Notifications → Mobile
```

---

## Additional CLI Commands

**`claude agents --json`** (v2.1.145+)
Machine-readable session listing — prints all live sessions as a JSON array and exits:
```bash
claude agents --json | jq '.[] | select(.status == "running")'
```
Fields: `pid`, `cwd`, `kind`, `startedAt`, `sessionId`, `name`, `status`. Combine with `--cwd` to filter by directory.

**`claude respawn`**
Restart a session with the conversation history intact:
```bash
claude respawn <session-id>      # restart one session
claude respawn --all             # restart all running sessions
```

**`claude daemon status`**
Show the supervisor process state and worker count. Useful for diagnosing why sessions aren't starting.

**`/scroll-speed`**
Tune mouse wheel scroll speed in the CLI. `/scroll-speed 3` (default), `/scroll-speed 1` (slow), `/scroll-speed 10` (fast).

**`/code-review` (renamed from `/simplify`)**
As of v2.1.146, `/simplify` was renamed to `/code-review`. Old name still works as alias. Now accepts an optional effort level:
```
/code-review
/code-review xhigh
```
Reviews current diffs for compile errors, logic errors, security vulnerabilities — not style or formatting.

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
