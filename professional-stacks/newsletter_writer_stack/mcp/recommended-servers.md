# Recommended MCP Servers

This document lists MCP servers that enhance the Newsletter Writer Stack's capabilities. Configure any or all in your `settings.json`.

---

## Primary Servers

### 1. Exa (Real-Time Web Search & Research)

**Use for:** Finding trending topics, expert commentary, recent news, and competitive angles.

**Setup:**

```json
{
  "mcpServers": {
    "exa": {
      "command": "npx",
      "args": ["@exa/mcp"],
      "env": {
        "EXA_API_KEY": "your-exa-api-key"
      }
    }
  }
}
```

**Get API key:** [exa.ai](https://exa.ai/)

**Why use it:** Returns semantically relevant, current web content. Better than generic search for finding expert voices and trending insights.

---

### 2. Firecrawl (Deep Web Scraping)

**Use for:** Extracting full content from articles, reports, and expert blogs for detailed research.

**Setup:**

```json
{
  "mcpServers": {
    "firecrawl": {
      "command": "npx",
      "args": ["@firecrawl/mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "your-firecrawl-api-key"
      }
    }
  }
}
```

**Get API key:** [firecrawl.dev](https://firecrawl.dev/)

**Why use it:** Converts web pages to clean markdown. Useful for extracting quotes, data, and full context from articles without manual copy-paste.

---

## Optional Servers

### 3. GitHub (API Access)

**Use for:** If you host newsletter issues or archives on GitHub.

**Setup:**

```json
{
  "mcpServers": {
    "github": {
      "command": "gh",
      "args": ["api"]
    }
  }
}
```

**Why use it:** Allows direct commits of newsletter content to your repo. Enables version control and historical tracking.

---

### 4. Semantic Scholar (Academic Research)

**Use for:** Finding peer-reviewed studies and academic sources for deep-dive topics.

**Setup:** (Check availability and configuration at [semanticscholar.org](https://semanticscholar.org/))

**Why use it:** Adds credibility to claims. Essential if your audience expects academic rigor or you cover research-heavy topics.

---

## Quick Start

**Minimal setup (Exa only):**

If you're just getting started, add Exa. It covers most research needs for trend monitoring and expert sourcing.

```json
{
  "mcpServers": {
    "exa": {
      "command": "npx",
      "args": ["@exa/mcp"],
      "env": {
        "EXA_API_KEY": "your-key"
      }
    }
  }
}
```

**Full setup (Exa + Firecrawl):**

Add both for comprehensive research depth. Exa finds the sources, Firecrawl extracts the content.

```json
{
  "mcpServers": {
    "exa": { ... },
    "firecrawl": { ... }
  }
}
```

---

## Usage Examples

### /research-topic with Exa

```
/research-topic AI regulation trends Q2 2026

(Uses Exa to search for recent articles, expert commentary, news)
```

### Research + Extract with Firecrawl

```
/research-topic agentic AI workflows

(Exa finds McKinsey report, HubSpot case study, expert interviews)
(You then use Firecrawl to extract full content and quotes from each)
```

---

## Cost Considerations

| Server | Cost | Notes |
|---|---|---|
| **Exa** | Pay-as-you-go (~$0.10/search) | Essential for research. Budget: $20–50/month for 1–2 newsletters/week |
| **Firecrawl** | Pay-as-you-go (~$0.05/page) | Optional but useful. Budget: $5–20/month depending on depth |
| **GitHub** | Free (if personal account) | Only needed if using GitHub for storage |
| **Semantic Scholar** | Free | Limited API access; good for supplementary research |

---

## Troubleshooting

### "MCP server not found"

Ensure the `command` and `args` match the server's documentation. Test with:

```bash
npx @exa/mcp --help
npx @firecrawl/mcp --help
```

### "API key rejected"

Verify the key is current and has not been revoked. Check the server's dashboard for active keys.

### "Search returns too much / too little"

Refine your search query:
- **Too much:** Add specific filters (topic, date range, author)
- **Too little:** Broaden the query or use different keywords

---
