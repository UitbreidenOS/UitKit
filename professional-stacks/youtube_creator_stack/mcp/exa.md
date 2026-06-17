# Exa Semantic Search MCP Setup

## Overview

Exa provides real-time semantic search for trend detection and competitor research. Used by trend-scout and topic-analyzer skills to identify emerging topics and validate audience demand.

## Prerequisites

1. **Exa Account** — Free tier available ([exa.ai](https://exa.ai))
2. **API Key** — From Exa dashboard

## Setup Steps

### 1. Create Exa Account

1. Go to [exa.ai](https://exa.ai)
2. Sign up (free tier available)
3. Verify email
4. Go to Dashboard → API Keys
5. Copy API key

### 2. Add to settings.json

```json
{
  "mcpServers": {
    "exa": {
      "command": "npx",
      "args": ["-y", "exa-mcp-server"],
      "env": {
        "EXA_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

## Available Tools

### trend-scout

Search for trending topics in creator's niche:

```
exa.search(query, timeRange="pastDay")
```

**Parameters:**
- `query` — Topic/keyword to search (e.g., "AI video editing")
- `timeRange` — "pastDay", "pastWeek", "pastMonth", "pastYear"
- `limit` — Number of results (default 10, max 100)

**Returns:**
- Topic title
- Search volume % change
- Number of mentions (last 30 days)
- Key articles/content mentioning topic
- Growth trajectory

### topic-analyzer

Analyze search volume and competition:

```
exa.search(query, timeRange="pastMonth")
exa.getSimilar(url)  # Find similar content
```

### competitor-analyzer

Identify trending creators and content:

```
exa.search("YouTube creator [niche]", timeRange="pastMonth", limit=20)
exa.getSimilar("competitor_youtube_url")
```

## Example Queries

### Trend Detection
```
exa.search("AI video editing 2026", timeRange="pastDay")
exa.search("AI tools for content creators", timeRange="pastWeek")
exa.search("YouTube automation trending", timeRange="pastMonth")
```

### Audience Demand
```
exa.search("how to use ChatGPT for video editing", timeRange="pastMonth")
exa.search("best AI video editors comparison", timeRange="pastMonth")
```

### Competitor Research
```
exa.search("YouTube creator AI tools", timeRange="pastMonth", limit=50)
exa.search("video editing tutorial trending", timeRange="pastWeek")
```

## Rate Limits

- **Free tier:** 100 searches per month
- **Pro tier:** 10,000 searches per month ($20/month)
- **Enterprise:** Unlimited

**Estimate:** Free tier sufficient for 1 trend-scout run per day + daily topic analysis

## Data Interpretation

### Search Volume Growth

- **+50% or more:** Strong emerging trend (GO score boost)
- **+25–50%:** Moderate growth (stable trend)
- **0–25%:** Flat or minimal growth (CAUTION)
- **Negative:** Declining trend (NO-GO flag)

### Competition Level

Infer from number of mentions and quality of existing content:

- **<10 articles:** Uncrowded (high viability)
- **10–50 articles:** Moderate competition
- **>50 articles:** Saturated (lower viability)

## Troubleshooting

### Invalid API Key
- Verify key is copied correctly (no extra spaces)
- Ensure key is from Exa (not another service)
- Check API key hasn't expired in dashboard

### Rate Limit Exceeded
- Free tier: 100 searches/month (upgrade to Pro for more)
- Pro tier: 10,000/month (efficient query planning needed)
- Consider batching queries: search once, reuse results

### No Results Found
- Query may be too specific (try broader terms)
- Topic may not have minimum search volume
- Time range too narrow (try "pastMonth" instead of "pastDay")

## Best Practices

1. **Batch searches:** Combine related queries (e.g., all AI editing variants in one search)
2. **Reuse results:** Store trend data across sessions to avoid duplicate searches
3. **Time-based queries:** Run /trend-scout early morning (captures overnight trends)
4. **Seasonal awareness:** Adjust expectations for seasonal niches (back-to-school, holidays, etc.)
5. **Competitor benchmarking:** Search competitor names to track their growth vs. your niche

## Recommended Workflow

### Daily
- Run /trend-scout (1 search per niche)
- Surface top 3–5 emerging topics

### Weekly
- Run /analyze-topic on 2–3 GO-scored topics (3 searches)
- Validate audience demand

### Monthly
- Run /competitor-analyzer (5–10 searches)
- Update competitive landscape analysis

## Cost Optimization

- **Free tier:** $0 (100 searches/month)
- **Pro tier:** $20/month (10,000 searches)
- **Estimated monthly cost:** $0–$20 depending on search frequency

### Free Tier Allocation
```
- Daily trend scout: 1 search × 30 days = 30
- Weekly topic validation: 2 searches × 4 weeks = 8
- Monthly competitor analysis: 5 searches × 1 month = 5
- Buffer for ad-hoc searches: ~57 remaining

Total: ~100 searches/month (fits free tier)
```

## References

- [Exa API Documentation](https://docs.exa.ai)
- [Search Query Guide](https://docs.exa.ai/reference/search)
- [Pricing](https://exa.ai/pricing)
- [Rate Limits](https://docs.exa.ai/guides/rate-limits)
