# MCP Connections

This workspace uses 2 MCP servers. Add these to your `~/.claude/settings.json` (global) or `.claude/settings.json` (project-level).

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
- **Purpose:** Scrapes JS-heavy company websites — pricing pages, team pages, app subdomains that WebFetch can't render
- **Get API key:** firecrawl.dev → sign up → API Keys
- **Used by:** lead-scorer (company website scraping), email-personalizer (latest product info)
- **Tool calls:** `mcp__firecrawl__scrape`

### Exa
- **Purpose:** Semantic/neural search — finds funding rounds, executive hires, product launches, and press mentions better than keyword search
- **Get API key:** exa.ai → sign up → API Keys  
- **Used by:** lead-scorer (trigger signals), campaign-tracker (competitive signals)
- **Tool calls:** `mcp__exa__search`

## Without MCP

If you don't have MCP servers configured, the skills degrade gracefully:
- **lead-scorer:** Uses WebSearch + WebFetch only — may miss JS-rendered team/product pages
- **email-personalizer:** Uses WebSearch only — trigger signals may be less precise
- **campaign-tracker:** Reads session-log.md only — no external competitive benchmarks

MCP significantly improves trigger signal quality. Recommended for active prospecting sessions.

---
