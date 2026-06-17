# Discourse MCP Configuration

## Purpose

Connect Claude Code to Discourse community platform for member segmentation, topic analysis, moderation, and engagement tracking. Enables `/analyze-community` and sentiment analysis skills.

## Setup

### 1. Generate API Key

In Discourse Admin:
1. Go to **Admin** → **API** → **Keys**
2. Click "New API Key"
3. Description: `Claudient Community Manager`
4. Scope: Select:
   - `read`
   - `write`
   - `manage_users`
5. Copy API key and username

### 2. Add to settings.json

```json
{
  "mcpServers": {
    "discourse": {
      "command": "npx",
      "args": ["@discourse-mcp/cli"],
      "env": {
        "DISCOURSE_API_KEY": "your-api-key-here",
        "DISCOURSE_API_USERNAME": "discourse-bot",
        "DISCOURSE_URL": "https://community.yourdomain.com"
      }
    }
  }
}
```

### 3. (Optional) Set Bot Badges

In Discourse Admin:
1. Create badge: "Community Manager Bot"
2. Assign to bot user
3. Display next to messages for visibility

## Available Tools

- `discourse_list_users` — Get all members with activity data
- `discourse_get_user` — Fetch detailed profile (tenure, post count, groups)
- `discourse_list_topics` — Get topics in category or all
- `discourse_get_topic_posts` — Get all posts + replies in topic
- `discourse_get_categories` — List community categories
- `discourse_search` — Search posts by text, topic, or member
- `discourse_create_post` — Reply to topic
- `discourse_list_flags` — Get moderation reports
- `discourse_update_user_trust_level` — Promote/demote user (moderator, regular, etc.)

## Usage Examples

```
# Analyze community composition
discourse_list_users(limit=5000, include_suspended=false)

# Deep dive on member tenure and activity
discourse_get_user(username="jane_smith")

# Find crisis signals (misinformation, harassment)
discourse_search(query="misinformation OR fraud", days=7)

# Get all posts in a category for engagement analysis
discourse_list_topics(category="announcements", limit=100)

# Moderation review
discourse_list_flags(status="pending", limit=20)

# Welcome new member
discourse_create_post(topic_id=123, raw="Welcome! Let me help you get started...")
```

## Moderation Workflow

1. **Monitor flags:** `discourse_list_flags(status="pending")`
2. **Review context:** `discourse_get_topic_posts(topic_id=X)`
3. **Make decision:** Hide, delete, or approve (via Discourse UI)
4. **Document:** Log to moderation-log.csv

## Limitations

- API throttled: 30 requests/second
- Cannot delete topics (only posts)
- User data export limited to 5,000 rows per query
- Bulk operations require pagination

## Security

- Never expose API key in logs
- Use read-only API key if possible
- Audit API usage monthly
- Rotate keys quarterly

---
