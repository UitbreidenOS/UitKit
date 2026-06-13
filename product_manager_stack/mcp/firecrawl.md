# Firecrawl MCP

Firecrawl gives Claude the ability to scrape JavaScript-rendered web pages — competitor sites, pricing pages, product feature comparisons, and blog posts that standard WebFetch cannot read.

## Why This Stack Uses It

Product prioritization depends on knowing what competitors do. Most competitor feature pages are JavaScript-rendered. Without Firecrawl, you're missing detailed feature research, pricing tiers, and product roadmap signals.

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
| `competitive-mapper` | `mcp__firecrawl__scrape` | Competitor pricing page, features page, product blog |
| `prd-outliner` | `mcp__firecrawl__scrape` | Market research sites, industry analysis, case studies |

## Rate Limits & Cost

- Free tier: 500 scrapes/month
- Starter ($16/mo): 3,000 scrapes/month
- For quarterly competitive analysis (5–10 competitors, 3–5 pages each): Free tier is sufficient

---
