# Exa MCP

Exa is a semantic web search engine that finds recent market signals and competitive moves. Where Google finds pages that contain your query, Exa finds pages that mean what you're looking for — competitor funding, executive hires, feature launches, acquisitions.

## Why This Stack Uses It

Product decisions must account for competitive moves happening right now. Exa finds press releases, news coverage, and announcements faster than traditional search, giving you real-time intelligence for feature prioritization and positioning decisions.

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
| `competitive-mapper` | `mcp__exa__search` | "[Company] funding," "[Company] announces," "[Product] launch" |
| `prd-outliner` | `mcp__exa__search` | "[Market] benchmark," "[Trend] adoption," industry signals |

## Search Patterns That Work

```
"[Competitor name] funding [round]" — recent capital raises
"[Competitor name] launches [feature]" — new product releases
"[Company name] hires [role]" — executive changes
"[Competitor] acquires [target]" — M&A signals
```

## Rate Limits & Cost

- Free tier: 1,000 searches/month
- For quarterly competitive intelligence (20–30 searches per quarter): Free tier is sufficient

---
