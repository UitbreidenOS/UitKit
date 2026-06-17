# Airtable

Member database and engagement automation platform. Use for member tracking, segmentation, engagement orchestration, and event management.

## When to Use vs Alternatives

| Use Airtable | Use CSV/Google Sheets | Use Manual |
|---|---|---|
| Member profiles + fields | Static member list | One-off member lookup |
| Engagement tracking | Backup/archive | Quick filtering |
| Event RSVPs and tracking | Simple export | Exploratory analysis |
| Automation triggers | No-code workflow needs | Ad-hoc reporting |
| Segment querying | Data analysis | N/A |

## Tool Calls

### Member Segmentation Query

```
mcp__airtable__query({
  "table": "Members",
  "fields": ["email", "name", "join_date", "posts", "last_activity", "sentiment_avg"],
  "filters": [
    { "field": "last_activity", "operator": ">", "value": "14 days ago" }
  ]
})
```

### Event RSVP Tracking

```
mcp__airtable__create({
  "table": "Events",
  "record": {
    "event_name": "[Event Name]",
    "date": "[YYYY-MM-DD]",
    "time": "[HH:MM]",
    "rsvp_count": 0,
    "target_audience": "[Segment]",
    "description": "[Brief]"
  }
})
```

### Update Member Engagement

```
mcp__airtable__update({
  "table": "Members",
  "record_id": "[member_id]",
  "fields": {
    "last_activity": "[today's date]",
    "posts": "[increment]",
    "segment": "[new segment]"
  }
})
```

## Community Manager Use Cases

1. **Member Profiles** — Track: email, name, title, company, interests, join date, posts, comments, last activity, segment, sentiment average, churn risk.
2. **Event Management** — Track: event name, date, time, format, speaker, target segment, RSVP count, attendance, NPS score.
3. **Engagement Log** — Track: member, action (onboard/re-engage/invite), date, status, outcome.
4. **Content Curation** — Track: content title, source, engagement score, published date, replies, reactions.
5. **Moderation Log** — Track: post ID, author, violation type, decision, response sent, escalation status.

## Airtable Database Schema (Recommended)

**Table: Members**
- email (Text)
- name (Text)
- title (Text)
- company (Text)
- interests (Multiple select)
- join_date (Date)
- last_activity (Date)
- posts (Number)
- comments (Number)
- segment (Single select: Advocate / Core / Contributor / Lurker / Inactive)
- sentiment_avg (Number: -1.0 to 1.0)
- churn_risk (Checkbox)
- notes (Long text)

**Table: Events**
- event_name (Text)
- date (Date)
- time (Time)
- format (Single select: AMA / Webinar / Meetup / Hackathon / Workshop / Panel)
- speaker (Lookup to Members)
- target_segment (Single select)
- rsvp_count (Number)
- attendance (Number)
- nps_score (Number)
- description (Long text)

**Table: Content**
- title (Text)
- source (Text)
- engagement_score (Number: 0–100)
- published_date (Date)
- replies (Number)
- reactions (Number)
- status (Single select: Draft / Published / Archived)

## Setup Instructions

1. Create a free Airtable account at [airtable.com](https://airtable.com)
2. Create a base for your community
3. Generate an API token at [airtable.com/api/oauth2/oauth2Applications](https://airtable.com/api/oauth2/oauth2Applications)
4. Add to `settings.json`:

```json
{
  "mcpServers": {
    "airtable": {
      "command": "npx",
      "args": ["@airtable/mcp"],
      "env": {
        "AIRTABLE_API_KEY": "your-api-token-here",
        "AIRTABLE_BASE_ID": "your-base-id-here"
      }
    }
  }
}
```

5. Get your base ID from the URL: `https://airtable.com/[BASE_ID]`

## Rate Limits & Best Practices

- Free tier: 5 API requests/second
- Cache results locally — save to accounts/{member-slug}-profile.md to avoid repeated queries
- Batch updates when possible (multiple fields in one update call)
- Use filters to query only relevant records (e.g., members inactive 14+ days)

## Tips

- **For segmentation:** Query by last_activity and posts to identify Advocates vs Lurkers
- **For events:** Pre-populate RSVP table with target segment members
- **For trends:** Export segment counts by week to CSV for trend analysis
- **For escalation:** Filter churn_risk=true to identify members needing immediate outreach

---
