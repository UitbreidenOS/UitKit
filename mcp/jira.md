# Jira MCP Server

Connects Claude Code to Jira for issue management, sprint tracking, and project administration.

---

## Installation

```json
{
  "mcpServers": {
    "jira": {
      "command": "npx",
      "args": ["-y", "jira-mcp-server"],
      "env": {
        "JIRA_URL": "https://yourteam.atlassian.net",
        "JIRA_EMAIL": "you@company.com",
        "JIRA_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

## Tools Provided

| Tool | Description |
|---|---|
| `search_issues` | Search issues with JQL queries |
| `get_issue` | Get full details of a specific issue |
| `create_issue` | Create new issues with fields and attachments |
| `update_issue` | Update issue fields, transitions, comments |
| `list_sprints` | List active and upcoming sprints |

## Usage

```
> "Find all open bugs assigned to me in the current sprint"
> "Create a new bug: Login fails on Safari with SSO"
> "What's the status of PROJ-1234?"
> "Show me the sprint burndown for Sprint 42"
> "Move all 'Ready for QA' issues to 'Done'"
```

## Security Notes

- Generate API tokens at id.atlassian.com (never use passwords)
- Scope token permissions to required projects only
- Jira rate limits: 100 requests per 5 minutes

---

Built with [Claudient](https://github.com/UitbreidenOS/Claudient) · [Claude Code](https://claude.com/claude-code)
