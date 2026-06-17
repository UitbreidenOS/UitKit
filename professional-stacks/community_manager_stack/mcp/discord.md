# Discord

Community chat platform and channel automation. Use for member communication, content sharing, announcements, and event coordination.

## When to Use vs Alternatives

| Use Discord | Use Email | Use Slack |
|---|---|---|
| Real-time community chat | Formal announcements | Enterprise/private teams |
| Threaded discussions | Newsletter digests | Synchronous work |
| Channel organization | 1:1 outreach | Internal comms |
| Bulk member DMs | Member list | Integrations over open API |
| Event reminders | Confirmation/receipts | N/A |

## Tool Calls

### Send Channel Announcement

```
mcp__discord__send_message({
  "channel_id": "[channel_id]",
  "content": "[Announcement text]",
  "embed": {
    "title": "[Event/Announcement Title]",
    "description": "[Details]",
    "color": 0x7289DA
  }
})
```

### Send DM to Member

```
mcp__discord__send_dm({
  "user_id": "[member_discord_id]",
  "content": "[Welcome message or re-engagement sequence]"
})
```

### Get Channel Messages

```
mcp__discord__get_messages({
  "channel_id": "[channel_id]",
  "limit": 50
})
```

### Create Reaction Poll

```
mcp__discord__create_poll({
  "channel_id": "[channel_id]",
  "question": "[Poll question]",
  "options": ["Option 1", "Option 2", "Option 3"],
  "duration_hours": 24
})
```

## Community Manager Use Cases

1. **Channel Announcements** — Share content, event invitations, community updates.
2. **Member DMs** — Send welcome sequences, re-engagement messages, event reminders.
3. **Content Sharing** — Curated external content, discussion starters, resources.
4. **Event Management** — Create event threads, track RSVPs, send reminders.
5. **Moderation Alerts** — Flag moderated posts, response templates, escalations.
6. **Member Recognition** — Celebrate wins, highlight contributors, announce promotions.

## Discord Server Structure (Recommended)

**Core Channels:**
- #introductions — New members introduce themselves
- #general — Off-topic, watercooler, community chat
- #announcements — Community updates, events, major news

**Interest Channels:**
- #engineering — Technical discussions, architecture
- #product-feedback — Feature requests, product discussion
- #career-advice — Leadership, hiring, growth
- #hiring — Job postings, recruiting strategies
- #business — Business strategy, metrics, growth

**Event Channels:**
- #events — Event announcements, RSVPs
- #ama — Ask Me Anything host channel
- #meetups — In-person event coordination

**Async Channels:**
- #wins — Member achievements and celebrations
- #resources — Curated content, guides, templates
- #help-wanted — Q&A support, expertise exchange

**Admin Channels (Private):**
- #moderation — Moderation alerts, decisions
- #community-team — Internal coordination
- #metrics — Health metrics, reports

## Setup Instructions

1. Create a Discord server at [discord.com](https://discord.com)
2. Create a Discord application at [discord.com/developers/applications](https://discord.com/developers/applications)
3. Generate a bot token in "Bot" section
4. Enable these intents: Message Content, Guild Members, Direct Messages
5. Add to `settings.json`:

```json
{
  "mcpServers": {
    "discord": {
      "command": "npx",
      "args": ["@discord/mcp"],
      "env": {
        "DISCORD_BOT_TOKEN": "your-bot-token-here",
        "DISCORD_GUILD_ID": "your-server-id-here"
      }
    }
  }
}
```

6. Get your guild ID from URL: `https://discord.com/channels/[GUILD_ID]/[CHANNEL_ID]`

7. Invite the bot to your server with OAuth2 (Scopes: bot, Permissions: Send Messages, Read Messages, Manage Messages)

## Rate Limits & Best Practices

- Discord rate limit: 50 messages/second per guild
- Batch member DMs with 1–2 second delays between messages
- Use embeds for rich formatting (announcements, events)
- Pin important announcements to channel (max 50 pins per channel)
- Use threads for topical discussions to keep channels organized
- Archive old channels monthly to reduce clutter

## Tips for Community Managers

- **Welcome sequences:** Send initial DM on join, follow-up at Day 1, Day 3, Day 7
- **Event reminders:** Send in #events, then DM RSVPs 1 week before, 3 days before, day-of
- **Content curation:** Post to relevant channel with discussion prompt (see content-curator skill)
- **Member recognition:** Use #wins channel to celebrate contributions weekly
- **Sentiment monitoring:** React with emoji to posts (helps gauge sentiment, engagement)
- **Moderation:** Use threads to discuss violations without derailing main channel

## Channel Naming Convention

- Use hyphens: `#career-advice` not `#CareerAdvice`
- Prefix admin channels: `#admin-moderation`, `#admin-metrics`
- Prefix event channels: `#event-ama`, `#event-hackathon`
- Prefix interest channels: `#interest-rust`, `#interest-devops`

## Member Engagement with Discord

**On new member:**
1. Send welcome DM with channel recommendations
2. Auto-post introduction thread in #introductions
3. Tag relevant members for peer connections

**On curated content:**
1. Post to relevant channel (e.g., content about scaling → #engineering)
2. Include discussion prompt: "What's your experience with [topic]?"
3. React to drive engagement

**On event:**
1. Announce in #events with RSVP reaction
2. Send DM reminders 1 week, 3 days, day-of
3. Create thread for event-day live discussion
4. Post recording/summary after event

**On moderation:**
1. Flag in private #moderation channel
2. Draft response, get human approval
3. Send response in public channel or DM
4. Log decision to session-log.md

---
