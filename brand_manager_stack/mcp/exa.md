# Exa

Real-time web search with advanced filtering by date, domain, and content type. Use for brand monitoring, competitor news, customer sentiment, and industry trends.

## When to Use vs WebSearch

| Use Exa | Use WebSearch |
|---|---|
| Recent competitor announcements (last 7 days) | General factual lookups |
| Brand mentions across blogs and news | One-off searches |
| Trending topics in your space | Historical research |
| Customer reviews and sentiment | Broad market research |

## Tool Call

```
mcp__exa__search({
  "query": "CompanyName funding announcement",
  "type": "news",
  "numResults": 10,
  "startDate": "2026-06-01",
  "endDate": "2026-06-12"
})
```

## Brand Manager Use Cases

1. **Competitive intelligence** — "CompanyA raised Series B," "CompetitorB new pricing"
2. **Brand monitoring** — "[Your brand] mentions" across web, blogs, news
3. **Customer sentiment** — "[Your brand] review," "customer feedback on [your brand]"
4. **Hiring signals** — "CompetitorA hiring engineering leads" = growth signal = outreach trigger
5. **Industry trends** — "Security-first architecture adoption," "API-first development"
6. **Press monitoring** — new analyst reports, industry news, regulatory changes

## Filters

**By type:**
- news: News articles, press releases
- tweet: Twitter posts
- research: Whitepapers, studies
- pdf: Downloadable PDFs

**By date range:**
- `startDate`: "2026-06-01"
- `endDate`: "2026-06-12"

**By domain:**
- `includeDomains`: ["techcrunch.com", "forbes.com"]
- `excludeDomains`: ["twitter.com"] (if you want news only)

## Example Queries

**Competitor news:**
```
mcp__exa__search({
  "query": "CompetitorA Series C funding announcement",
  "type": "news",
  "startDate": "2026-06-01",
  "numResults": 5
})
```

**Brand sentiment:**
```
mcp__exa__search({
  "query": "AcmePlatform customer experience review",
  "type": "tweet",
  "startDate": "2026-06-01",
  "numResults": 10
})
```

**Industry trends:**
```
mcp__exa__search({
  "query": "security-first architecture adoption 2026",
  "type": "research",
  "numResults": 5
})
```

## Rate Limits

Free tier: 1,000 searches/month  
Pro: 10,000/month  
Enterprise: custom

---
