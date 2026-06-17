# MCP Server Connections

Product Operations Stack works with these optional MCP servers for enhanced capabilities.

## Recommended MCP Servers

### 1. **Firecrawl** (Web Scraping for Competitive Research)

Deep-crawl company websites and research reports for competitive analysis, customer feedback signals, and market research.

**Setup:**
1. Get API key at [firecrawl.dev](https://www.firecrawl.dev/)
2. Add to `.claude/settings.json`:

```json
{
  "mcpServers": {
    "firecrawl": {
      "command": "npx",
      "args": ["@firecrawl/mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

**Use cases:**
- Scrape competitor websites for feature analysis
- Extract customer testimonials from review sites
- Pull pricing intelligence
- Gather market research data

---

### 2. **Exa** (Real-Time Web Search for Customer Signals)

Real-time web search for customer feedback, product mentions, news, and market trends.

**Setup:**
1. Get API key at [exa.ai](https://exa.ai/)
2. Add to `.claude/settings.json`:

```json
{
  "mcpServers": {
    "exa": {
      "command": "npx",
      "args": ["@exa/mcp"],
      "env": {
        "EXA_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

**Use cases:**
- Find recent mentions of your product on social media
- Research competitor product launches and features
- Identify industry trends and customer pain points
- Monitor customer sentiment across web

---

### 3. **Open Interpreter** (For Complex Analysis)

Execute Python code for advanced metrics analysis, statistical calculations, and data visualization.

**Setup:**
1. Install: `pip install open-interpreter`
2. Add to `.claude/settings.json`:

```json
{
  "mcpServers": {
    "open_interpreter": {
      "command": "python",
      "args": ["-m", "open_interpreter"]
    }
  }
}
```

**Use cases:**
- Run statistical analysis on customer retention data
- Build cohort analysis for segment breakdown
- Generate correlation analysis between features and adoption
- Create data visualizations from metrics CSV exports

---

## Optional Integrations (Not MCP)

### **Intercom or Zendesk** (Customer Feedback)
While not MCP servers, you can export feedback data from these tools and pass to Claude for analysis via `/synthesize-feedback` command.

### **Amplitude or Mixpanel** (Metrics Export)
Export cohort retention, activation, and adoption data; pass to Claude for analysis via `/analyze-metrics` command.

### **Google Analytics / Segment** (Product Metrics)
Export session data, event streams, or user journey data for detailed analysis.

---

## How to Use MCP Servers in Product Operations Stack

Once configured, MCP servers are automatically available to Claude when running product operations skills:

- **roadmap-prioritizer:** Uses WebSearch (via Exa) to validate market context and competitive positioning
- **metrics-analyzer:** Uses Open Interpreter for statistical analysis of retention and adoption trends
- **customer-feedback-synthesizer:** Uses Firecrawl to scrape review sites and extract customer themes
- **stakeholder-mapper:** Uses WebSearch to find recent company news and leadership changes relevant to stakeholder analysis

MCP servers are optional—all skills work without them, but you'll have more powerful analysis with real-time data.

---
