# MCP: ntfy Notifications

Send push notifications from within Claude Code agent flows. Instead of just notifying when Claude needs input, trigger notifications at specific milestones in your automation.

## Why you need this

The ntfy hook fires when Claude is idle. This MCP server lets Claude trigger notifications programmatically:
- "Notify me when the database migration is complete"
- "Send a Slack-style alert if tests fail"
- "Ping my phone when the build finishes"

## Configuration

```json
{
  "mcpServers": {
    "ntfy": {
      "command": "npx",
      "args": ["-y", "ntfy-mcp-server"],
      "env": {
        "NTFY_TOPIC": "your-claude-topic",
        "NTFY_SERVER": "https://ntfy.sh"
      }
    }
  }
}
```

## How to use

```
# Milestone notification
"Run the database migration, then notify me on ntfy when it completes"

# Error alerts
"Run all tests. If any fail, send a high-priority ntfy alert with the test name"

# Long-running task progress
"Process these 500 files and send me an ntfy update every 100 files"
```

## In agent flows

```python
# Claude can call ntfy as a tool within an agentic workflow
# Example: Claude autonomously notifies on completion

await run_migration()
await ntfy.send(
    topic="your-claude-topic",
    message="Migration complete: 847 rows updated",
    priority="high",
    tags=["white_check_mark"]
)
```

## Notification priorities

| Priority | Use case |
|---|---|
| `min` | Background info |
| `low` | Non-urgent updates |
| `default` | Normal progress updates |
| `high` | Task complete, needs review |
| `urgent` | Error, requires immediate attention |

## Combine with the ntfy-push hook

- **ntfy-push hook** — Claude notifies you when it's waiting for permission
- **ntfy MCP** — Claude notifies you when a task step completes

Together: complete awareness of long-running agentic workflows.

## Self-hosted ntfy

```json
{
  "env": {
    "NTFY_SERVER": "https://your-server.com",
    "NTFY_TOPIC": "private-topic",
    "NTFY_TOKEN": "your-access-token"
  }
}
```
