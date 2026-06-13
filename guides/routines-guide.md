# Claude Code Routines (2026) — Cloud Agents on Schedule, GitHub Events, and API

Routines are persistent, scheduled Claude Code sessions that run unattended in the cloud. Unlike background sessions that execute within your interactive terminal, routines are true asynchronous agents — they start, execute, and complete independently, then surface results via log files, Slack notifications, or GitHub comments. This guide covers the architecture, trigger patterns, the four production-ready Claudient templates, cost models, and how to build and deploy your own morning routine.

---

## Routines vs. Background Sessions — Fundamental Differences

The distinction is crucial because they solve different problems.

### Background Sessions

Background sessions (started with `claude --background "run tests"`) execute on your local machine. The session:
- Runs in a tmux session attached to your terminal
- Has access to local environment variables, SSH keys, and file permissions
- Operates under your user context and git credentials
- Can be interrupted or resumed from the terminal
- Produces output visible in your terminal session

**Use background sessions for:**
- Long-running work you're monitoring (deploy, integration test suite)
- Tasks needing live local context (current git branch, uncommitted state)
- Development or debugging tasks requiring human intervention

### Routines

Routines run in a managed cloud environment. The session:
- Starts at a scheduled time (cron) or triggered by GitHub webhook/API call
- Runs in an isolated, ephemeral container with no local file system
- Operates with explicit credentials you configure (GitHub token, API keys)
- Cannot be interrupted mid-execution (though you can disable before it starts)
- Writes all results to files, databases, or external services (Slack, GitHub)
- Logs the full transcript for review in the Claude Code web UI

**Use routines for:**
- Scheduled background work (nightly tests, daily PR triage)
- Event-driven automation (PR opened → immediate review, deployment → monitoring)
- Cross-team visibility (results posted to Slack, GitHub PR comments)
- No human present to monitor or intervene

---

## Architecture: How Routines Execute

When a routine fires, the following sequence occurs:

```
[Scheduled time reaches] 
  ↓
[Cloud scheduler invokes the routine]
  ↓
[Fresh Claude Code session container spins up]
  ↓
[Claude receives the prompt + pre-loaded working directory]
  ↓
[Session executes loop: read prompt → plan → call tools → process output]
  ↓
[All tool calls are pre-authorized (no permission prompts)]
  ↓
[Session writes output to disk, files, or external services]
  ↓
[Session terminates; logs archived for 30 days]
  ↓
[User can review transcript in web UI or via API]
```

Key insight: **Routines are stateless by design.** Each run is a fresh container. If you need state between runs (e.g., "which PRs did we already review?"), you must read that state from a file, GitHub PR status, or database at the start of your prompt.

---

## Trigger Types

### 1. Cron Schedule (Time-Based)

The most common trigger. Executes at a fixed time or interval.

```json
{
  "name": "daily-standup",
  "schedule": "0 8 * * 1-5",
  "prompt": "...",
  "workingDirectory": "/path/to/repo"
}
```

**Cron format:** `minute hour day-of-month month day-of-week`

Common patterns:
- `0 8 * * 1-5` — 8am Monday–Friday (weekdays)
- `0 9 * * 1` — 9am every Monday
- `0 0 * * *` — midnight every night
- `0 */4 * * *` — every 4 hours
- `30 8,17 * * *` — 8:30am and 5:30pm daily

Natural language is also supported:
```json
"schedule": "every weekday at 8am"
"schedule": "every Monday at 9am"
"schedule": "daily at 11pm"
"schedule": "every 3 hours"
```

### 2. GitHub Webhook (Event-Based)

Routines can be triggered by GitHub events: PR opened, PR commented, issue created, push to branch, etc.

```json
{
  "name": "pr-review-on-open",
  "trigger": "github_event",
  "github": {
    "event": "pull_request.opened",
    "owner": "my-org",
    "repo": "my-app"
  },
  "prompt": "Review the PR described in $GITHUB_EVENT_PATH. Check CI status, code quality, and leave a summary comment.",
  "workingDirectory": "/path/to/repo"
}
```

**Supported events:**
- `pull_request.opened` — when a PR is created
- `pull_request.synchronize` — when commits are pushed to the PR
- `issues.opened` — when an issue is created
- `push` — when code is pushed to a branch
- `discussion.created` — when a discussion starts

GitHub event details are available as environment variables in the prompt:
- `$GITHUB_EVENT` — the full JSON event payload
- `$GITHUB_REPOSITORY` — owner/repo
- `$GITHUB_ACTOR` — who triggered the event
- `$GITHUB_EVENT_NUMBER` — PR/issue number

You can reference them in the prompt:
```json
{
  "prompt": "Review PR #$GITHUB_EVENT_NUMBER. The event payload is available at $GITHUB_EVENT_PATH."
}
```

### 3. API Trigger (Manual / External)

Invoke a routine on-demand via REST API. Useful for dashboards, Slack commands, or external systems.

```bash
curl -X POST https://claude.ai/api/routines/{routine-id}/trigger \
  -H "Authorization: Bearer $CLAUDE_API_KEY"
```

Returns immediately with a run ID; the routine executes asynchronously.

---

## Configuration Format

### Full Routine Definition

```json
{
  "name": "morning-standup",
  "description": "Prepare standup briefing",
  "schedule": "0 8 * * 1-5",
  "prompt": "...",
  "workingDirectory": "/path/to/repo",
  "model": "claude-sonnet-4-5",
  "maxTurns": 10,
  "timeout": 300,
  "enabled": true,
  "outputTarget": {
    "type": "slack",
    "webhook": "$SLACK_WEBHOOK_MORNING"
  },
  "permissions": {
    "allowTools": ["Bash", "Read", "Write"],
    "denyTools": ["DeleteFile"]
  }
}
```

### Field Reference

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | yes | Unique identifier for the routine |
| `description` | string | no | Human-readable purpose (shown in logs) |
| `schedule` | string | yes* | Cron expression or natural language |
| `trigger` | string | no | `"schedule"` (default), `"github_event"`, or `"api"` |
| `prompt` | string | yes | Full prompt Claude receives when invoked |
| `workingDirectory` | string | yes | Absolute path; routine's cwd |
| `model` | string | no | Model to use; defaults to your setting |
| `maxTurns` | integer | no | Hard stop after N turns (prevents runaway) |
| `timeout` | integer | no | Kill session after N seconds (default: 3600 = 1 hour) |
| `enabled` | boolean | no | `false` to pause without deleting |
| `outputTarget` | object | no | Where to send results (Slack, GitHub, file) |
| `permissions` | object | no | Tool whitelist/blacklist for this routine |
| `environment` | object | no | Environment variables to inject |
| `github` | object | no* | GitHub event config (required if `trigger: "github_event"`) |

### Output Targets

#### Slack

```json
{
  "outputTarget": {
    "type": "slack",
    "webhook": "$SLACK_WEBHOOK_STANDUP",
    "channel": "#engineering",
    "format": "markdown"
  }
}
```

The routine's final message is posted to Slack. Use `$SLACK_WEBHOOK_*` to reference environment variables (secret).

#### GitHub (Comment on PR)

```json
{
  "outputTarget": {
    "type": "github",
    "owner": "my-org",
    "repo": "my-app",
    "pullRequest": "$GITHUB_EVENT_NUMBER",
    "format": "markdown"
  }
}
```

Only works for event-triggered routines (knows the PR number from the event).

#### File

```json
{
  "outputTarget": {
    "type": "file",
    "path": ".claude/routine-output.md"
  }
}
```

The routine writes output to a file in the working directory.

---

## The Four Claudient Templates

Claudient ships four production-ready routine templates covering 80% of use cases. Each is battle-tested by teams running large codebases.

### Template 1: Daily Standup

**Purpose:** Generate a standup briefing before your team's daily sync.

**Triggers on:** Weekdays at 8:30am

**What it does:**
1. Reads git log from the past 24 hours
2. Fetches open PRs and their status
3. Checks for TODO/FIXME comments in your code
4. Identifies blockers from Slack/GitHub
5. Outputs a structured briefing

**Template:**

```json
{
  "name": "morning-standup",
  "schedule": "30 8 * * 1-5",
  "model": "claude-haiku-4-5",
  "workingDirectory": "/path/to/repo",
  "prompt": "Generate a standup briefing for our 9am sync. Follow this format:\n\n## What I Did Yesterday\n- Use `git log --since='24 hours ago' --oneline` to list my commits\n- Group by feature area\n- Include PR numbers and review status\n\n## What I'm Doing Today\n- Read .claude/my-tasks.md for my planned work (create if missing)\n- Cross-check with open PRs assigned to me\n\n## Blockers\n- Check for any BLOCKED or TODO comments I left\n- Look for PRs waiting on review from others\n- Note any failing CI on my branches\n\nWrite output to .claude/standup.md in clean markdown. Include timestamps.",
  "outputTarget": {
    "type": "slack",
    "webhook": "$SLACK_WEBHOOK_STANDUP"
  }
}
```

**Customize for your team:**
- Change time to match your sync time
- Add team-specific blockers (e.g., check Jira sprint board)
- Include customer-facing metrics (e.g., production error rate)

---

### Template 2: PR Triage

**Purpose:** Automatically monitor PRs and flag review needs.

**Triggers on:** Weekday mornings at 8am

**What it does:**
1. Lists all open PRs
2. Checks CI/CD status for each
3. Identifies old PRs with no activity
4. Flags PRs with unresolved comments
5. Outputs triage report

**Template:**

```json
{
  "name": "pr-triage",
  "schedule": "0 8 * * 1-5",
  "model": "claude-haiku-4-5",
  "workingDirectory": "/path/to/repo",
  "prompt": "Triage all open PRs in this repository.\n\nFor each PR:\n1. Run: gh pr list --state open --json number,title,author,updatedAt,statusCheckRollup\n2. Check: gh pr checks {pr_number} to see CI status\n3. Check: gh pr review {pr_number} to see review comments\n4. Assess:\n   - Is CI passing? (red flag if not)\n   - How many days old? (flag if > 3 days with no updates)\n   - Are there unresolved comments? (blocker)\n   - Who is it waiting on? (author or reviewer?)\n\n5. Output a markdown table:\n   | PR # | Title | Status | Days Open | Blocker? | Action |\n   |---|---|---|---|---|---|\n\nWrite to .claude/pr-triage.md. Highlight blockers at the top.",
  "outputTarget": {
    "type": "slack",
    "webhook": "$SLACK_WEBHOOK_TRIAGE",
    "channel": "#engineering-prs"
  }
}
```

**Customize:**
- Filter by labels or assignees (e.g., only your team's PRs)
- Integrate with Jira (fetch linked issue priority)
- Add deploy readiness checks (is this PR ready to ship?)

---

### Template 3: Dependency Audit

**Purpose:** Weekly scan for security vulnerabilities and outdated packages.

**Triggers on:** Mondays at 9am

**What it does:**
1. Runs `npm audit` or `pip check`
2. Identifies critical vulnerabilities
3. Checks for major version outdating
4. Prioritizes by risk
5. Outputs patch recommendations

**Template:**

```json
{
  "name": "weekly-dependency-audit",
  "schedule": "0 9 * * 1",
  "model": "claude-sonnet-4-5",
  "workingDirectory": "/path/to/repo",
  "prompt": "Audit all dependencies for vulnerabilities and outdating.\n\n1. Run: npm audit --json (or npm audit for npm, pip check for Python, etc.)\n2. Parse output for:\n   - Critical / high / moderate / low severity vulnerabilities\n   - Which packages are affected\n   - Available fixes (patch, minor, major)\n3. Run: npm outdated to check version lag\n4. For packages 2+ major versions behind:\n   - Note the current version\n   - Note the latest version\n   - Estimate update risk (breaking changes?)\n   - Check the CHANGELOG\n5. Output priorities:\n   a. URGENT: Critical CVEs with no safe patch\n   b. HIGH: High-severity vulns; patch available\n   c. MEDIUM: Outdated packages; consider next sprint\n   d. LOW: Technical debt; nice-to-have\n\nWrite .claude/dep-audit.md with:\n- Summary counts by severity\n- Recommended patch commands for each\n- Risk assessment for major updates\n- Next action for each item.",
  "outputTarget": {
    "type": "slack",
    "webhook": "$SLACK_WEBHOOK_SECURITY"
  }
}
```

**Customize:**
- Integrate with Snyk/Dependabot for priority scoring
- Auto-create issues for high-severity vulns
- Include license compliance checks

---

### Template 4: Incident Watch

**Purpose:** Monitor production systems and alert on anomalies.

**Triggers on:** Every 10 minutes during business hours; daily at 6am on weekends

**What it does:**
1. Polls production metrics (error rate, latency, uptime)
2. Compares to baseline
3. Analyzes recent logs for errors
4. Checks deployment status
5. Alerts if anomalies detected

**Template:**

```json
{
  "name": "incident-watch",
  "schedule": "*/10 9-18 * * 1-5",
  "model": "claude-sonnet-4-5",
  "workingDirectory": "/path/to/repo",
  "maxTurns": 8,
  "prompt": "Monitor production health. Execute:\n\n1. Fetch metrics:\n   - bash .claude/hooks/fetch-metrics.sh (your custom metrics fetch)\n   - Outputs: error_rate.json, latency.json, uptime.json\n2. Load baseline:\n   - Read .claude/baseline-metrics.json (set weekly by another routine)\n3. Compare:\n   - Error rate: flag if > 2x baseline or > 0.5%\n   - Latency p95: flag if > 2x baseline\n   - Uptime: flag if any service < 99.5%\n4. If anomaly detected:\n   - Fetch recent logs: bash .claude/hooks/fetch-logs.sh\n   - Parse logs for errors\n   - Correlate with recent deployments (git log --since=1h)\n   - Identify likely causes\n5. Output to .claude/incident-watch.log:\n   - Timestamp\n   - Metrics (current vs baseline)\n   - Anomalies detected (if any)\n   - Suspected root cause\n   - Recommended action\n\nIf critical alert:\n- Post to #incidents Slack channel\n- Create GitHub issue with findings",
  "outputTarget": {
    "type": "slack",
    "webhook": "$SLACK_WEBHOOK_INCIDENTS",
    "channel": "#incidents"
  }
}
```

**Customize:**
- Integrate with Datadog, Prometheus, CloudWatch
- Auto-trigger incident bridge
- Include customer impact analysis
- Create PagerDuty alerts

---

## Adapting the Templates

All four templates are meant to be starting points, not gospel. Here's how to adapt them:

### Add Custom Steps

In the `prompt`, add steps after the standard ones:

```json
{
  "prompt": "[Standard template steps...]\n\n6. Custom step - check our domain's DNS:\n   - bash .claude/hooks/check-dns.sh\n   - Alert if TTL is wrong or records missing"
}
```

### Change Frequency

Modify the `schedule`:
- Daily → `"0 8 * * *"`
- Every 2 hours → `"0 */2 * * *"`
- Weekdays only → add `1-5` to day-of-week

### Filter by Team or Repo

Add filtering logic to the prompt:

```json
{
  "prompt": "...gh pr list --search 'team:my-team' --state open..."
}
```

### Integrate External Data

Use `curl` or custom scripts to fetch data:

```json
{
  "prompt": "...fetch metrics from Datadog:\ncurl -H 'DD-API-KEY: $DD_API_KEY' https://api.datadoghq.com/api/v1/query?query=..."
}
```

### Add Persistence

Read state from files to track changes across runs:

```json
{
  "prompt": "Read .claude/last-check.json to see what we checked last time. Compare. Write updated state to .claude/last-check.json."
}
```

---

## Output and Slack Notifications

Routines can output to three channels:

### 1. Log Files (Default)

The routine writes to the working directory:

```json
{
  "prompt": "...Write final output to .claude/standup.md"
}
```

Later, you can read the file:
```bash
cat /path/to/repo/.claude/standup.md
```

All routine transcripts are also archived in the Claude Code web UI for 30 days.

### 2. Slack Notifications

Configure `outputTarget` with a Slack webhook:

```json
{
  "outputTarget": {
    "type": "slack",
    "webhook": "$SLACK_WEBHOOK_STANDUP",
    "channel": "#engineering-standups",
    "format": "markdown"
  }
}
```

The routine's final message is automatically posted. Use `$SLACK_WEBHOOK_*` to reference an environment variable containing the webhook URL.

**Pro tip:** Use different webhooks for different severity levels.

```json
{
  "outputTarget": [
    {
      "type": "slack",
      "webhook": "$SLACK_WEBHOOK_STANDUP",
      "condition": "contains('BLOCKER')"
    },
    {
      "type": "slack",
      "webhook": "$SLACK_WEBHOOK_INCIDENTS",
      "condition": "contains('CRITICAL')"
    }
  ]
}
```

### 3. GitHub Comments

For event-triggered routines, post results as PR comments:

```json
{
  "trigger": "github_event",
  "github": {
    "event": "pull_request.opened"
  },
  "outputTarget": {
    "type": "github",
    "owner": "my-org",
    "repo": "my-app",
    "pullRequest": "$GITHUB_EVENT_NUMBER"
  },
  "prompt": "Review PR #$GITHUB_EVENT_NUMBER and leave a comment with your findings."
}
```

Claude's final message is posted as a PR comment automatically.

### Formatting Output for Notifications

Keep output clean for Slack/GitHub. Use markdown formatting:

```markdown
## Standup — Tuesday, June 10

### Yesterday
- Merged PR #1234: Add auth middleware
- Reviewed 3 PRs

### Today
- Deploy to staging
- Fix failing test in auth module

### Blockers
None — green across the board.
```

Avoid huge walls of text; Slack will truncate. Use collapsible sections:

```markdown
## Summary
2 PRs ready to merge, 1 blocked on review

<details>
<summary>Full PR List</summary>

| PR # | Title | Status |
|---|---|---|
| 1234 | Auth | Approved |
| 1235 | Logging | Changes requested |

</details>
```

---

## Cost Model for Routines

Routines are priced on a per-run basis. The Claude Code pricing model is:

### Per-Routine Cost

Each routine run incurs:
1. **Model cost** — standard Claude pricing (Haiku, Sonnet, Opus)
2. **Turn overhead** — minimal; each tool call is one turn
3. **Execution time** — no hourly charge; you pay for the session

**Typical routine costs:**

| Routine | Model | Typical Cost | Monthly Cost (5x/week) |
|---|---|---|---|
| Daily Standup | Haiku | $0.02–0.05 | $0.50–1.25 |
| PR Triage | Haiku | $0.05–0.10 | $1.25–2.50 |
| Dependency Audit | Sonnet | $0.15–0.30 | $0.75–1.50 |
| Incident Watch | Sonnet | $0.10–0.20 per run | $10–20 (runs 6x/hour) |

**Cost optimization:**
- Use **Haiku** for simple, deterministic tasks (standup, triage)
- Use **Sonnet** for complex analysis (audit, incident investigation)
- Use **Opus** only for creative/novel problem-solving
- Set `maxTurns` to prevent runaway sessions
- Set `timeout` to kill long-running jobs

### Budget Alerts

Monitor routine spending in the Claude Code web UI. Set budget alerts:

```json
{
  "alerts": {
    "monthlyBudgetUSD": 50,
    "notifyAt": [0.75, 0.90, 1.0]
  }
}
```

---

## Step-by-Step: Build a Custom Morning Routine

You'll now build a realistic morning routine that combines the templates: standup + PR triage + a custom check.

### Step 1: Define the Routine

Create a file `.claude/routines/morning-briefing.json`:

```json
{
  "name": "morning-briefing",
  "schedule": "0 8 * * 1-5",
  "model": "claude-haiku-4-5",
  "workingDirectory": "/Users/you/projects/my-app",
  "timeout": 600,
  "maxTurns": 15,
  "prompt": "[see Step 2 below]",
  "outputTarget": {
    "type": "slack",
    "webhook": "$SLACK_WEBHOOK_MORNING",
    "channel": "#my-standup"
  }
}
```

### Step 2: Write the Prompt

The prompt is the core. It orchestrates all checks:

```
## Morning Briefing — Automated Standup Prep

Execute the following checks in order. Output a clean markdown report.

### 1. YESTERDAY'S WORK
- Run: git log --since='24 hours ago' --oneline
- List all commits I made (assume git user is set to my email)
- Note any PRs that were merged

### 2. TODAY'S PRs
- Run: gh pr list --state open --author @me --json number,title,reviews,statusCheckRollup
- For each PR:
  - Is CI passing? (green = ✓, red = 🔴)
  - How many approvals?
  - Any review comments I need to address?
- Highlight PRs waiting on my action

### 3. REVIEW QUEUE
- Run: gh pr list --state open --review-requested @me --json number,title,author
- List PRs I've been asked to review
- Prioritize by: age (oldest first), then by team (my team first)

### 4. DEPENDENCY STATUS
- Check: cat .claude/dep-audit.md (from weekly audit routine)
- Summarize: are there any HIGH/CRITICAL items?
- If yes, note which ones need attention this week

### 5. CUSTOM: CUSTOMER HEALTH
- Fetch: curl https://api.example.com/health (with auth header $API_KEY)
- Parse JSON response for error rate, active issues
- Flag if error rate > 1% or critical issue exists

### 6. OUTPUT REPORT

Write a markdown report to .claude/standup-today.md with:

---
# Morning Briefing — {TODAY'S DATE}

## What I Did Yesterday
{List from git log}

## Today's PRs
{Table of my open PRs with status}

## I'm Reviewing
{List of PRs waiting on my review, sorted by priority}

## Action Items
- [ ] Address review comments on PR #{highest-priority}
- [ ] Review {count} PRs waiting on me (estimated 15 min)
- {If CRITICAL dep issue} [ ] Patch critical dependency
- {If customer issue} [ ] Investigate {issue}

## Metrics
- Customer error rate: {%}
- PRs awaiting my review: {count}
- Days since last merged PR: {days}

---

Keep the report concise (under 20 lines). Use emoji for status (✓ green, 🔴 red, ⚠️ yellow).
```

### Step 3: Add to settings.json

In your project's `.claude/settings.json`:

```json
{
  "routines": [
    {
      "name": "morning-briefing",
      "schedule": "0 8 * * 1-5",
      "model": "claude-haiku-4-5",
      "workingDirectory": "/Users/you/projects/my-app",
      "timeout": 600,
      "maxTurns": 15,
      "prompt": "[your full prompt from Step 2]",
      "outputTarget": {
        "type": "slack",
        "webhook": "$SLACK_WEBHOOK_MORNING",
        "channel": "#my-standup"
      }
    }
  ]
}
```

### Step 4: Set Environment Variables

Add your secrets to `.claude/settings.local.json` (gitignored):

```json
{
  "environment": {
    "SLACK_WEBHOOK_MORNING": "https://hooks.slack.com/services/...",
    "API_KEY": "your-api-key"
  }
}
```

Or set them globally in `~/.claude/settings.json` if you use the same secrets across projects.

### Step 5: Test the Routine

Before scheduling, test it manually:

```bash
cd /Users/you/projects/my-app
claude "Execute the following prompt and write output to .claude/standup-test.md: [your prompt]"
```

Run it interactively, see any errors, refine the prompt.

### Step 6: Enable the Routine

Once tested, the routine is live. Check the Claude Code web UI → Routines tab:

- **Routine name:** morning-briefing
- **Next run:** tomorrow at 8am
- **Last run:** (none yet)
- **Status:** enabled

### Step 7: Monitor First Run

At 8am tomorrow, the routine fires. In the web UI, click on the run:

- **Status:** completed / failed / timeout
- **Duration:** how long it took
- **Turns:** how many tool calls
- **Output:** the full transcript
- **Slack message:** (if posted successfully)

If it fails, check:
- `workingDirectory` exists and has the right files
- `$SLACK_WEBHOOK_MORNING` is a valid URL
- The prompt didn't exceed `maxTurns` or `timeout`
- git user is correctly configured in the container

### Step 8: Iterate

Refine based on your first run. Common tweaks:

- **Output is too verbose:** truncate in the prompt ("Keep report under 20 lines")
- **Missing git info:** add `git config --global user.email your@email.com` to the setup
- **PR status inaccurate:** use `gh pr view {pr} --json statusCheckRollup` to get fresh status
- **Slack formatting bad:** use markdown code blocks for tables

---

## Advanced: Composing Routines with Hooks

Routines and hooks (Stop, PostToolCall, etc.) compose. A routine fires, hooks execute within that session.

Example: routine runs tests, then a Stop hook sends results to Slack:

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/notify-slack-routine-complete.sh"
          }
        ]
      }
    ]
  }
}
```

The `.claude/hooks/notify-slack-routine-complete.sh` script reads `$CLAUDE_SESSION_OUTPUT` and posts results.

**Use cases:**
- Routine writes results to file, Stop hook posts to Slack
- Routine runs tests, Stop hook creates issue if tests fail
- Routine audits, Stop hook sends digest email

---

## Troubleshooting Routines

### Routine doesn't run at scheduled time

**Check:**
1. Is the routine `enabled: true` in settings.json?
2. Is your `schedule` valid? (test with `cronex "0 8 * * 1-5"`)
3. Is the working directory accessible to the cloud runtime?
4. Check logs in the web UI for errors

**Solution:**
- Verify schedule manually: `claude cron validate "0 8 * * 1-5"`
- Test the prompt in an interactive session first
- Check if there's a permissions issue (tool not allowed)

### Routine runs but produces no output

**Check:**
1. Did the prompt ask for output? (e.g., "Write to .claude/standup.md")
2. Is `outputTarget` configured?
3. Did Slack webhook fail? (check Slack workspace settings)

**Solution:**
- Verify the prompt includes `Write output to [file]`
- Test Slack webhook manually: `curl -X POST $SLACK_WEBHOOK_MORNING ...`
- Check routine logs for errors

### Routine exceeds timeout or maxTurns

**Check:**
1. How complex is your prompt? (complex prompts need Sonnet, not Haiku)
2. Are you making unnecessary tool calls? (e.g., calling `gh` 50 times instead of once)
3. Is the working directory huge? (big repos slow things down)

**Solution:**
- Increase `timeout` (default 3600s = 1 hour)
- Increase `maxTurns` (default 10)
- Simplify the prompt (be specific, not exploratory)
- Use a faster model (Haiku for quick checks)

### Slack notification doesn't arrive

**Check:**
1. Is `$SLACK_WEBHOOK_MORNING` set in environment?
2. Is the webhook URL valid? (check Slack workspace)
3. Did Claude include output to post?

**Solution:**
```bash
# Test webhook manually
curl -X POST $SLACK_WEBHOOK_MORNING \
  -H 'Content-Type: application/json' \
  -d '{"text":"Test"}'
```

If curl succeeds but routine still fails, check if the routine's output was empty.

---

## API Reference

### CronCreate — Create a Routine Programmatically

From within a Claude Code session, create a routine:

```python
from claude_sdk import CronCreate

routine_id = CronCreate(
  name="daily-audit",
  prompt="Run npm audit. Write results to .claude/audit.md",
  schedule="0 9 * * 1",
  workingDirectory="/path/to/repo",
  model="claude-haiku-4-5"
)
```

Returns the routine ID. The routine is immediately active.

### CronList — List All Routines

```python
from claude_sdk import CronList

routines = CronList()
for r in routines:
  print(f"{r['name']} — next run: {r['nextRun']}")
```

Returns array of routine objects with: id, name, schedule, enabled, lastRun, nextRun.

### CronDelete — Delete a Routine

```python
from claude_sdk import CronDelete

CronDelete(id="routine-abc123")
```

---

## Best Practices

1. **Use Haiku for deterministic tasks** (standup, triage, basic checks)
2. **Use Sonnet for analysis** (dependency audit, incident investigation)
3. **Keep prompts focused** — one routine, one job
4. **Build state persistence** — read `.claude/state.json`, update it, write back
5. **Set maxTurns and timeout** — prevent runaway sessions costing you money
6. **Test manually first** — don't schedule untested prompts
7. **Monitor the first 3 runs** — catch edge cases early
8. **Use environment variables** — keep secrets out of settings.json
9. **Output to files and Slack** — dual channels for visibility and debugging
10. **Iterate based on runs** — each run teaches you something

---

## Comparison: Routines vs. CI/CD Pipelines

When to use routines vs. traditional CI/CD:

| Dimension | Claude Routine | GitHub Actions / CI |
|---|---|---|
| **Trigger** | Schedule / webhook | Push / PR / manual |
| **What it does** | AI analysis, decision-making | Tests, builds, deploys |
| **Output** | Markdown reports, Slack | Test results, artifacts |
| **Cost** | Per run (Haiku = $0.01–0.05) | Fixed min (GitHub free) |
| **Best for** | Monitoring, analysis, triage | Build/test automation |
| **Examples** | Standup, incident watch | Deploy, test, lint |

**They work together:**
- CI/CD runs tests and builds on every push
- Routine monitors the build results and alerts you
- Routine posts standup, CI/CD builds the service

---


📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
