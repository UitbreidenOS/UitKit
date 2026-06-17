# Firecrawl MCP

Firecrawl gives Claude the ability to scrape JavaScript-rendered web pages — company sites, product pages, pricing pages, and app subdomains that standard WebFetch cannot read.

## Why This Stack Uses It

SDR prospecting depends on current company data: team pages (who was just hired), product pages (what they just launched), and pricing pages (what tier they're on). These pages are almost always JS-rendered. Without Firecrawl, the lead-scorer and email-personalizer work with incomplete data.

## Setup

```json
{
  "mcpServers": {
    "firecrawl": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "YOUR_KEY_HERE"
      }
    }
  }
}
```

**Get your key:** [firecrawl.dev](https://www.firecrawl.dev/) → Sign up → API Keys → Create key

## Tool Calls in This Stack

| Skill | Tool Call | What It Scrapes |
|---|---|---|
| `lead-scorer` | `mcp__firecrawl__scrape` | Company homepage, About page, Team page |
| `email-personalizer` | `mcp__firecrawl__scrape` | Product/features page, Blog (recent posts) |

## Rate Limits & Cost

- Free tier: 500 scrapes/month
- Starter ($16/mo): 3,000 scrapes/month
- For active SDR prospecting (10 accounts/day): Starter tier is sufficient

---
