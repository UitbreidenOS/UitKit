# MCP Connections

Configure these MCP servers in your Claude Code settings.json for full VC stack functionality.

## Overview

| Server | Purpose | Why It Matters | Status |
|---|---|---|---|
| **Crunchbase** | Company intelligence, funding history, team | Core deal sourcing and DD | Required |
| **PitchBook** | VC-specific data, comps, valuations | Pricing and market benchmarking | Required |
| **Exa** | Real-time signals, semantic search | Portfolio monitoring, market trends | Optional but recommended |

---

## Crunchbase Setup

### What You Get

- Company profiles (founding date, team, location, stage)
- Funding history (rounds, investors, valuations)
- Executive and key hires
- News and updates
- Competitive intelligence

### Setup

1. Get API key at [crunchbase.com](https://crunchbase.com/)
2. Add to `settings.json`:

```json
{
  "mcpServers": {
    "crunchbase": {
      "command": "npx",
      "args": ["-y", "crunchbase-mcp"],
      "env": {
        "CRUNCHBASE_API_KEY": "your-key-here"
      }
    }
  }
}
```

3. Test: `/score-opportunity "OpenAI" "Series D" "AI"`

---

## PitchBook Setup

### What You Get

- VC deals and transaction data
- Comps for fundraising (Series A pricing, equity targets)
- Investor profiles and activity
- Exit data and valuations
- Deal flow intelligence

### Setup

1. Get API key at [pitchbook.com](https://pitchbook.com/)
2. Add to `settings.json`:

```json
{
  "mcpServers": {
    "pitchbook": {
      "command": "npx",
      "args": ["-y", "pitchbook-mcp"],
      "env": {
        "PITCHBOOK_API_KEY": "your-key-here"
      }
    }
  }
}
```

3. Test: `/dd-report "Series B Fintech" "Series B"`

---

## Exa Setup (Optional)

### What You Get

- Real-time news and article search
- Semantic search for industry signals
- Portfolio company monitoring
- Competitive intelligence
- Trend detection

### Setup

1. Get API key at [exa.ai](https://exa.ai/)
2. Add to `settings.json`:

```json
{
  "mcpServers": {
    "exa": {
      "command": "npx",
      "args": ["-y", "exa-mcp-server"],
      "env": {
        "EXA_API_KEY": "your-key-here"
      }
    }
  }
}
```

3. Test: `/portfolio-check`

---

## Combined settings.json Example

```json
{
  "mcpServers": {
    "crunchbase": {
      "command": "npx",
      "args": ["-y", "crunchbase-mcp"],
      "env": {
        "CRUNCHBASE_API_KEY": "your-key-here"
      }
    },
    "pitchbook": {
      "command": "npx",
      "args": ["-y", "pitchbook-mcp"],
      "env": {
        "PITCHBOOK_API_KEY": "your-key-here"
      }
    },
    "exa": {
      "command": "npx",
      "args": ["-y", "exa-mcp-server"],
      "env": {
        "EXA_API_KEY": "your-key-here"
      }
    }
  }
}
```

---

## Troubleshooting

**MCP server not connecting?**
- Verify API keys are correct and have active quota
- Check that you've run `npm install` for each server package
- Restart Claude Code and try again

**Crunchbase returning empty results?**
- Company may not be in Crunchbase database (less common for later-stage startups)
- Try company name + industry for better search

**PitchBook data incomplete?**
- PitchBook has less coverage for early-stage (seed) companies
- Use Crunchbase for seed-stage research

**Exa search timing out?**
- Reduce search scope or use specific company names instead of broad queries
