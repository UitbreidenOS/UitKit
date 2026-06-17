# MCP Connections

This workspace uses 2 MCP servers for competitive research and market signal detection. Add these to your `~/.claude/settings.json` (global) or `.claude/settings.json` (project-level).

## Quick Setup (both servers)

```json
{
  "mcpServers": {
    "firecrawl": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": { "FIRECRAWL_API_KEY": "YOUR_KEY_HERE" }
    },
    "exa": {
      "command": "npx",
      "args": ["-y", "exa-mcp-server"],
      "env": { "EXA_API_KEY": "YOUR_KEY_HERE" }
    }
  }
}
```

## Server Details

### Firecrawl
- **Purpose:** Scrapes JavaScript-rendered competitor websites — pricing pages, feature comparisons, product pages, and blog content
- **Get API key:** firecrawl.dev → sign up → API Keys
- **Used by:** competitive-mapper (competitor feature research), prd-outliner (context research)
- **Tool calls:** `mcp__firecrawl__scrape`

### Exa
- **Purpose:** Semantic search for market signals — funding announcements, executive changes, product launches, and industry trends
- **Get API key:** exa.ai → sign up → API Keys
- **Used by:** competitive-mapper (competitor news and updates), prd-outliner (market validation)
- **Tool calls:** `mcp__exa__search`

## Without MCP

If you don't have MCP servers, the skills degrade gracefully:
- **competitive-mapper:** Uses WebSearch + WebFetch only — may miss JS-rendered features pages or recent market signals
- **prd-outliner:** Uses WebSearch only — market research less precise

MCP significantly improves competitive intelligence quality. Recommended for major feature decisions.

---
