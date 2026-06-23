# Discord MCP Server

Connects Claude Code to Discord for community management, message monitoring, and bot automation.

---

## Installation

```json
{
  "mcpServers": {
    "discord": {
      "command": "npx",
      "args": ["-y", "discord-mcp-server"],
      "env": {
        "DISCORD_BOT_TOKEN": "your-bot-token"
      }
    }
  }
}
```

## Tools Provided

| Tool | Description |
|---|---|
| `list_channels` | List channels in a guild |
| `read_messages` | Read recent messages from a channel |
| `send_message` | Send a message to a channel |
| `manage_roles` | View and manage server roles |

## Usage

```
> "Check the #general channel for any bug reports in the last hour"
> "Send the release notes to the #announcements channel"
> "List all members with the 'Moderator' role"
> "Summarize today's discussion in #dev-chat"
```

## Security Notes

- Never share bot tokens publicly
- Use bot permissions scope (not user tokens)
- Limit bot access to required channels only

---

Built with [Claudient](https://github.com/UitbreidenOS/Claudient) · [Claude Code](https://claude.com/claude-code)
