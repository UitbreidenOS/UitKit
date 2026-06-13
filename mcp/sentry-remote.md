# MCP: Sentry Remote

Connect Claude Code directly to Sentry for error tracking, issue triage, and release health monitoring — no npm install required, runs as a remote MCP over HTTP.

## Why you need this

Debugging production errors means switching to the Sentry dashboard, copying stack traces, pasting into Claude, and losing context. The Sentry Remote MCP eliminates that round-trip — Claude reads your real issues, full stack traces, and release data in-context and helps you act on them immediately.

## Installation

No installation required. Sentry Remote MCP connects via SSE transport. There is no npm package to install or maintain.

## Configuration

```json
{
  "mcpServers": {
    "sentry": {
      "transport": "sse",
      "url": "https://mcp.sentry.io/sse",
      "headers": {
        "Authorization": "Bearer YOUR_SENTRY_AUTH_TOKEN"
      }
    }
  }
}
```

Replace `YOUR_SENTRY_AUTH_TOKEN` with your token (see Authentication below).

## Key tools

| Tool | What it does |
|---|---|
| `list_issues` | Query open issues with filters (project, priority, env, date range) |
| `get_issue` | Fetch full issue detail including stack trace and metadata |
| `resolve_issue` | Mark an issue as resolved |
| `list_events` | List all events associated with an issue |
| `get_event` | Retrieve a specific event payload |
| `list_releases` | List releases for a project |
| `get_release` | Release detail including error rate, adoption, and regressions |
| `list_projects` | List all projects in your organization |
| `create_comment` | Add a comment to an issue |
| `assign_issue` | Assign an issue to a team member |

## Usage examples

```
List all unresolved P0 issues from the last 24 hours

Show the full stack trace for issue PROJ-1234

Resolve all issues tagged as duplicate in the auth project

What's the error rate trend for the v2.1.0 release?

Find all TypeErrors in production this week and group by file

Which issues have the highest user impact in production right now?
```

## Authentication

1. Log in to Sentry and go to **User Settings → API Tokens**
2. Create a new token with the following scopes:
   - `project:read`
   - `issue:read`
   - `issue:write` (required for resolve and comment actions)
3. Copy the token value — it is shown only once
4. Paste it into the `Authorization` header in the config block above

Organization-level tokens (for multi-project orgs) work the same way — create them under **Organization Settings → API Tokens**.

## Tips

- Remote MCPs use `transport: "sse"` and a URL — no `command` or `args` fields. If you see startup errors, verify the config is not using the npx-style format.
- Sentry Remote MCP launched February 2026 as part of Sentry's official MCP program.
- Always filter by `environment` (production vs staging) when querying issues — mixing environments in triage wastes time.
- `search_errors` supports Sentry's query syntax: `is:unresolved level:error user.email:*` — the same syntax used in the Sentry UI.
- `get_release` is the fastest way to check if a new deployment introduced a regression before your monitoring alert fires.
- Pipe `get_issue` output into a code fix request — Claude has the full context needed to write a targeted patch.

---
