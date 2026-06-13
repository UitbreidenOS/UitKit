# MCP: Linear

Manage Linear issues, projects, and cycles directly from Claude Code — query tickets, update status, create issues, and run triage workflows without switching to the browser.

## Why you need this

Linear is where engineering work is tracked. Without MCP, Claude can write code but has no awareness of what the team is actually working on, what's blocked, or what's in the current sprint. With Linear MCP:
- Issue context flows directly into code sessions — no copy-pasting ticket descriptions
- Creating issues from code (TODOs, bug discoveries, refactor candidates) takes one prompt
- Sprint planning, triage, and status updates happen in the same workflow as development
- Cross-project reporting (velocity, blockers, cycle burndown) is a single query away

## Installation

```bash
npm install -g @linear/mcp-server
```

## Configuration

Add to `~/.claude.json` or project `.claude/mcp.json`:

```json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "@linear/mcp-server"],
      "env": {
        "LINEAR_API_KEY": "your-linear-api-key-here"
      }
    }
  }
}
```

## Key tools / What it does

- `get_issue` — retrieve a single issue by identifier (e.g., ENG-123) or UUID, including description, status, assignee, and comments
- `create_issue` — create a new issue with title, description, team, assignee, priority, labels, and cycle
- `update_issue` — update any field on an existing issue: status, assignee, priority, due date, estimate
- `search_issues` — full-text and filtered search across issues by team, status, assignee, label, or cycle
- `list_teams` — list all teams in the workspace with their IDs and keys
- `list_projects` — list projects with milestone and progress data
- `list_cycles` — list cycles (sprints) for a team with start/end dates and progress
- `get_cycle` — get a specific cycle with all its issues
- `create_comment` — add a comment to any issue
- `list_workflow_states` — list all states for a team (e.g., Todo, In Progress, In Review, Done)

## Usage examples

```
Show me all open bugs assigned to me in the current cycle,
sorted by priority. Include the issue ID and current status.
```

```
Scan the codebase for TODO and FIXME comments, then create a Linear issue
for each one in the ENG team with label "tech-debt" and priority Medium.
```

```
Move issue ENG-123 to "In Review" state and add a comment
with this PR link and a one-sentence summary of the change.
```

```
List all issues in the backlog sorted by priority and estimate,
then suggest a sprint plan that fits within 40 story points.
```

```
Show me everything that's marked as blocked in the current cycle
and list the blocking dependency for each issue.
```

## Authentication

1. Go to **linear.app → Settings → API** (or direct link: `linear.app/settings/api`)
2. Click **Create new API key** under Personal API keys
3. Name it (e.g., `claude-code`) and copy the key — it will only be shown once
4. Set it as `LINEAR_API_KEY` in the config block above

For team deployments where multiple people need access, create an OAuth app under **Settings → API → OAuth applications** instead of using a personal key.

## Tips

**Always call `list_teams` first:** Team IDs (UUIDs, not just the key like `ENG`) are required when creating issues. Run `list_teams` once and note the UUID for each team you work with.

**Issue identifiers vs UUIDs:** Most tools accept both `ENG-123` (human-readable identifier) and the full UUID. Use the identifier in prompts — it's easier to reference and track.

**Workflow states vary by team:** States like "In Review" or "QA" may not exist on every team. Call `list_workflow_states` for the relevant team before attempting to update status, so you know the exact state names and IDs.

**Cycle queries for sprint work:** Use `get_cycle` rather than `search_issues` when you want everything in the current sprint — it returns the complete issue set without needing to filter manually.

**Bulk create with care:** Creating many issues in one session is fast, but Linear sends notifications for each one. Warn the team or use a service account API key for bulk operations.

---
