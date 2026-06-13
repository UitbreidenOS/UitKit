# Slack MCP Configuration

## Purpose

Connect Claude Code to Slack for real-time community monitoring, member data access, and automated notifications. Enables sentiment tracking, engagement alerts, and milestone celebrations.

## Setup

### 1. Create Slack App

1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Click "Create New App" → "From scratch"
3. Name: `Claudient Community Manager`
4. Workspace: select your community workspace
5. Click "Create App"

### 2. Configure Bot Token Scopes

Under "OAuth & Permissions":

**Required scopes:**
- `channels:read` — List channels
- `channels:history` — Read message history
- `groups:read` — Read private channels
- `users:read` — Get member info
- `chat:write` — Post messages
- `reactions:read` — Monitor reactions
- `files:read` — Access shared files

**Install App to Workspace** → Copy "Bot User OAuth Token"

### 3. Add to settings.json

```json
{
  "mcpServers": {
    "slack": {
      "command": "npx",
      "args": ["@slack/web-api"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-token-here"
      }
    }
  }
}
```

## Available Tools

- `slack_list_channels` — Get all channels
- `slack_get_channel_history` — Pull messages from channel (default: past 7 days)
- `slack_get_user_info` — Member profile and activity
- `slack_get_reactions` — Emoji reactions on posts (sentiment proxy)
- `slack_post_message` — Send message to channel or user
- `slack_get_file_info` — Access shared documents

## Usage Examples

```
# Get sentiment on recent posts in #general
slack_get_channel_history(channel_id="C123", days=7)

# Fetch member info for onboarding
slack_get_user_info(user_id="U456")

# Post milestone celebration
slack_post_message(channel_id="C_announcements", text="🎉 Jane Smith hit 50 posts! Welcome to the Power User club.")

# Monitor reactions for sentiment shift
slack_get_reactions(channel_id="C123", limit=100)
```

## Limitations

- Rate limited: 1 request/second average
- History retrieval: limited to past 90 days (standard Slack)
- Cannot delete messages (safety feature)
- Cannot moderate other workspaces without separate tokens

## Security

- Store `SLACK_BOT_TOKEN` in environment variables, never hardcode
- Use separate app token for staging/testing
- Regularly audit bot activity in Slack logs
- Remove bot permissions if no longer used

---
