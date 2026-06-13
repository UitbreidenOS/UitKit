# Exa MCP

Exa is a neural/semantic web search engine that finds recent signals better than keyword search. Where Google finds pages that contain your query, Exa finds pages that mean what you're looking for — funding announcements, executive hire press releases, product launch coverage.

## Why This Stack Uses It

Trigger-based outreach lives or dies on signal freshness. Exa finds funding rounds announced in trade press (not just Crunchbase), executive hire announcements in local business journals, and product launch coverage across niche SaaS review sites — signals that keyword search misses.

## Setup

```json
{
  "mcpServers": {
    "exa": {
      "command": "npx",
      "args": ["-y", "exa-mcp-server"],
      "env": {
        "EXA_API_KEY": "YOUR_KEY_HERE"
      }
    }
  }
}
```

**Get your key:** [exa.ai](https://exa.ai/) → Sign up → API Keys → Create key

## Tool Calls in This Stack

| Skill | Tool Call | What It Searches |
|---|---|---|
| `lead-scorer` | `mcp__exa__search` | "[Company] funding", "[Company] new hire", "[Company] product launch" |
| `campaign-tracker` | `mcp__exa__search` | "[Competitor] pricing change", "[Industry] benchmark" |

## Search Patterns That Work

```
"[Company name] Series [A/B/C]" — funding signals
"[Company name] hires [VP/CTO/CMO]" — executive hire signals
"[Company name] launches" — product launch signals
"[Company name] expands" — growth/expansion signals
```

## Rate Limits & Cost

- Free tier: 1,000 searches/month
- For active prospecting (15 accounts/day, 3 searches each): ~1,350/month → Basic plan recommended

---
