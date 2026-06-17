# Google Analytics

Real-time campaign performance tracking. Monitor traffic, engagement, conversions, and audience behavior for all brand campaigns.

## Setup

Get your Google Analytics credentials:
1. Create a service account in Google Cloud Console
2. Download the JSON credentials file
3. Add project ID and credentials path to settings.json

```json
{
  "mcpServers": {
    "google-analytics": {
      "command": "node",
      "args": ["path/to/google-analytics-mcp.js"],
      "env": {
        "GA_PROJECT_ID": "your-project-id",
        "GA_CREDENTIALS": "path/to/credentials.json"
      }
    }
  }
}
```

## Tool Call

```
mcp__google_analytics__query({
  "propertyId": "YOUR_PROPERTY_ID",
  "startDate": "2026-06-13",
  "endDate": "2026-06-20",
  "metrics": ["activeUsers", "screenPageViews", "engagementRate"],
  "dimensions": ["pagePath", "deviceCategory"]
})
```

## Brand Manager Use Cases

1. **Campaign performance** — Track blog visits, email CTR, social traffic for each campaign
2. **Content performance** — Which blog posts drive the most traffic? Which social posts get clicks?
3. **Audience behavior** — How long do visitors stay? What pages do they visit after landing?
4. **Conversion tracking** — Email signups, demo requests, whitepaper downloads per campaign
5. **Trend monitoring** — Week-over-week or month-over-month traffic and engagement changes
6. **A/B test results** — Compare performance of 2 email subject lines, 2 blog headlines, etc.

## Key Metrics

| Metric | What It Shows | Target |
|---|---|---|
| activeUsers | Unique visitors in date range | 100+ per day on active campaign |
| screenPageViews | Total page views (same user, multiple views) | 2K+ on campaign launch week |
| engagementRate | % of visitors who engage (click, time on page) | 3–5% on blog, 8–10% on landing page |
| scrolledUsers | % who scroll down (engagement signal) | 50%+ on blog posts |
| eventCount | Events fired (email clicks, form submits) | 5–10% of page views |
| conversionRate | % who complete target action (signup) | 1–3% on blog, 5–10% on landing page |

## Query Example

```javascript
// Get blog post performance for campaign week
{
  "propertyId": "123456",
  "startDate": "2026-06-13",
  "endDate": "2026-06-20",
  "metrics": ["screenPageViews", "activeUsers", "engagementRate", "eventCount"],
  "dimensions": ["pagePath"],
  "filters": [
    { "field": "pagePath", "operator": "CONTAINS", "value": "/blog/" }
  ]
}

// Returns:
// /blog/ship-faster-security/ | 2,150 views | 1,240 users | 7.2% engagement | 145 email signups
// /blog/scale-without-rip/ | 890 views | 520 users | 5.1% engagement | 42 email signups
```

## Campaign Performance Dashboard

Create a simple tracking sheet in your session-log.md or Google Sheets:

```
| Campaign | Start | End | Blog Visits | Social Clicks | Email Opens | Email CTR | Leads | ROI |
|---|---|---|---|---|---|---|---|---|
| Ship Securely | 06-13 | 06-20 | 2,500 | 450 | 1,200 | 12% | 35 | 3.2x |
| Grow Without Rip | 07-01 | 07-08 | 1,800 | 320 | 890 | 8% | 22 | 2.1x |
```

## Real-Time Monitoring

Check campaign performance daily during launch week:
- Day 1: Initial spike in traffic (email list + social)
- Day 3–4: Organic search traffic starting to arrive
- Day 5–7: Performance plateau; identify top performers and amplify

---
