# MCP: Slack

Read Slack channels, search messages, post updates, and manage notifications — bring your team's context into Claude Code without switching tabs or losing flow.

## Why you need this

Team knowledge lives in Slack: design decisions, incident timelines, product feedback, and async discussions that never make it into docs. Without MCP, Claude can't see any of it. With Slack MCP:
- Channel history and search give Claude the full team context behind any feature or bug
- Posting deployment notices, PR summaries, or status updates happens inside the coding session
- Catching up on missed discussions (standups, feedback threads, incident channels) is a single prompt
- Automated status posts from Claude can replace manual Slack updates during long tasks

## Installation

```bash
npm install -g @modelcontextprotocol/server-slack
```

## Configuration

Add to `~/.claude.json` or project `.claude/mcp.json`:

```json
{
  "mcpServers": {
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-bot-token-here",
        "SLACK_TEAM_ID": "T0XXXXXXXXX"
      }
    }
  }
}
```

## Key tools / What it does

- `list_channels` — list public channels in the workspace (name, ID, member count, topic)
- `get_channel_history` — fetch recent messages from a channel with a configurable message limit
- `search_messages` — full-text search across all channels the bot has access to, with optional date filters
- `post_message` — post a message to a channel (supports Slack markdown formatting)
- `reply_to_thread` — reply to an existing message thread using the parent message's timestamp
- `get_thread_replies` — fetch all replies in a thread by channel and parent timestamp
- `list_users` — list workspace members with display names and user IDs
- `get_user_profile` — retrieve a user's full profile (title, timezone, email if permitted)
- `upload_file` — upload a file or snippet to a channel
- `add_reaction` — add an emoji reaction to a message

## Usage examples

```
Search Slack for all mentions of the auth bug this week across
all channels I'm in. Summarize what the team found and whether
there's an agreed fix or it's still open.
```

```
Post a deployment notification to #deployments:
Version 2.4.1 is live on production. Changes: [list changes here].
Rollback instructions: [link].
```

```
Get the last 30 messages from #product-feedback and identify
the top 3 feature requests by mention frequency. List any
requests that appeared more than once.
```

```
Reply to the thread in #engineering where Sarah asked about
the database migration — tell her the migration ran successfully,
took 4 minutes, and zero rows were affected unexpectedly.
```

```
Summarize today's #engineering channel. I've been heads-down
for 6 hours — what decisions were made and what do I need to know?
```

## Authentication

1. Go to **api.slack.com/apps** and click **Create New App** → **From scratch**
2. Name the app and select your workspace
3. Under **OAuth & Permissions → Bot Token Scopes**, add these scopes:
   - `channels:read` — list public channels
   - `channels:history` — read public channel messages
   - `groups:read` / `groups:history` — same for private channels (if needed)
   - `search:read` — search messages workspace-wide
   - `chat:write` — post messages
   - `users:read` — list and look up users
   - `files:write` — upload files (if needed)
   - `reactions:write` — add reactions (if needed)
4. Click **Install to Workspace** and approve the permissions
5. Copy the **Bot User OAuth Token** (starts with `xoxb-`) and set it as `SLACK_BOT_TOKEN`
6. Find your **Team ID** under **Settings → Basic Information** and set it as `SLACK_TEAM_ID`
7. Invite the bot to each channel it needs to read with `/invite @your-bot-name`

## Tips

**Bot must be invited to channels:** The bot can only read and post to channels it's been added to. For private channels, this requires an explicit `/invite @botname` from a channel member — admin access doesn't grant it automatically.

**`search:read` is a separate scope:** Channel history and search are different permissions. `channels:history` only reads a specific channel you specify. `search:read` enables workspace-wide message search. You need both for full functionality.

**Rate limits vary by endpoint:** Most endpoints fall under Slack's Tier 3 (50+ requests/minute). Search is Tier 2 (20 requests/minute). For high-volume operations, add brief delays between calls to avoid 429 errors.

**Direct message posting requires extra scope:** Posting to a user's DM requires the `im:write` scope in addition to `chat:write`. Add it to the bot's scopes and reinstall if you need this capability.

**Slack markdown in messages:** `post_message` supports Slack's mrkdwn format: `*bold*`, `_italic_`, `` `code` ``, `>blockquote`, and `<URL|link text>`. Use this when formatting deployment notices or structured summaries.

**Thread timestamps are precise:** `reply_to_thread` requires the exact `ts` (timestamp) value of the parent message, which looks like `1716300000.000100`. Get it from `get_channel_history` output before replying.

---
