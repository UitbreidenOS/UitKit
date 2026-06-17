# MCP Connections

This workspace uses 3 MCP servers. Add these to your ~/.claude/settings.json (global) or .claude/settings.json (project).

## Quick Setup (all 3 servers)
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
    },
    "hubspot": {
      "command": "npx",
      "args": ["-y", "@hubspot/mcp-server"],
      "env": { "HUBSPOT_ACCESS_TOKEN": "YOUR_TOKEN_HERE" }
    }
  }
}
```

## Server Details

### Firecrawl
- **Purpose:** Full-page web rendering for JS-heavy sites — pricing pages, feature pages, app subdomains that WebFetch can't read
- **Get API key:** firecrawl.dev → sign up → API Keys
- **Used by:** account-researcher, battlecard-builder
- **Tool calls:** mcp__firecrawl__scrape

### Exa
- **Purpose:** Semantic/neural search for trigger signals — finds funding, hires, launches, expansions better than keyword search
- **Get API key:** exa.ai → sign up → API Keys
- **Used by:** account-researcher, battlecard-builder
- **Tool calls:** mcp__exa__search

### HubSpot (optional)
- **Purpose:** CRM read/write — check opt-outs before contacting, log activity after calls, update deal stages
- **Get token:** HubSpot → Settings → Integrations → Private Apps → Create → copy Access Token
- **Used by:** post-call-processor, icp-filter
- **Tool calls:** mcp__hubspot__get_contact, mcp__hubspot__create_note, mcp__hubspot__update_deal

## Without MCP
If you don't have MCP servers, the skills degrade gracefully:
- account-researcher: uses WebSearch + WebFetch only (misses JS-rendered pages)
- battlecard-builder: uses WebSearch only (weaker signal quality)
- post-call-processor: manual CRM updates only

---
