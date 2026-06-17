# MCP Connections for AI Product Manager Stack

This document describes Model Context Protocol (MCP) integrations available for AI product manager workflows.

---

## Purpose

MCP connections enable Claude to integrate with external tools and services for:
- Real-time market research and competitive intelligence
- User research synthesis at scale (process interviews, surveys)
- Roadmap automation and capacity modeling
- Analytics and metric tracking
- Document processing (strategy decks, competitive reports)

---

## Available Connections

### 1. Web Search & Research

**Connection:** `mcp://research`

**Capabilities:**
- Real-time search for competitive announcements, trends, market data
- Competitor tracking (news, social media, product announcements)
- Market intelligence gathering (TAM estimates, analyst reports)

**Use cases:**
- Market Research skill: TAM validation, trend identification
- Competitive Analysis skill: Monitor competitor moves, win/loss patterns
- Feature Prioritization: Validate customer demand signals

**Configuration:**
```json
{
  "mcp": {
    "research": {
      "type": "web-search",
      "enabled": true,
      "sources": [
        "news.ycombinator.com",
        "twitter.com",
        "product-hunt.com",
        "industry-reports"
      ]
    }
  }
}
```

**Example query in skill:**
```
/ai-pm-market-research --search "AI Ops market TAM 2026" --confidence 80
→ Claude fetches latest market data via web search
→ Synthesizes into TAM report
```

---

### 2. Document Processing

**Connection:** `mcp://documents`

**Capabilities:**
- Parse interview transcripts, survey responses, support data
- Extract themes, personas, jobs-to-be-done from raw text
- Process competitive research reports, market analyses
- Generate summaries and synthesis

**Use cases:**
- User Research Synthesis skill: Analyze interview transcripts automatically
- Competitive Analysis skill: Process competitive reports
- Market Research skill: Parse analyst reports

**Configuration:**
```json
{
  "mcp": {
    "documents": {
      "type": "document-processor",
      "enabled": true,
      "supported_formats": ["txt", "pdf", "docx", "markdown"],
      "max_file_size_mb": 50
    }
  }
}
```

**Example workflow:**
```
1. Upload interview transcripts (7 PDFs, 120 pages total)
2. /ai-pm-user-research-synthesis --input interviews/
3. Claude processes via MCP:
   → Extracts themes, pain points, JTBD
   → Generates personas automatically
   → Creates use case map
4. Returns structured research report
```

---

### 3. Analytics & Metrics

**Connection:** `mcp://analytics`

**Capabilities:**
- Fetch product usage metrics (DAU, feature adoption, churn)
- Calculate NPS, satisfaction trends
- Analyze sales funnel (conversion rates, sales cycle)
- Track roadmap delivery vs. plan

**Use cases:**
- Feature Prioritization: Quantify reach with real usage data
- Market Research: Validate market signals with customer data
- Roadmap Planning: Track progress against committed features

**Configuration:**
```json
{
  "mcp": {
    "analytics": {
      "type": "analytics-engine",
      "enabled": true,
      "data_sources": {
        "product": "amplitude",
        "sales": "salesforce",
        "support": "zendesk",
        "nps": "delighted"
      },
      "api_keys": {
        "amplitude_key": "${AMPLITUDE_API_KEY}",
        "salesforce_token": "${SALESFORCE_TOKEN}"
      }
    }
  }
}
```

**Example query:**
```
/ai-pm-feature-prioritization --metric-source analytics
→ Claude fetches real feature adoption rates
→ Updates RICE reach estimates with actual data
→ Returns refined priority ranking
```

---

### 4. Competitor Tracking

**Connection:** `mcp://competitor-intel`

**Capabilities:**
- Monitor competitor product releases, announcements
- Track pricing changes, feature launches
- Analyze competitive positioning
- Win/loss data aggregation

**Use cases:**
- Competitive Analysis skill: Automated competitor monitoring
- Roadmap Planning: Flag competitive threats
- Feature Prioritization: Adjust priorities based on competitive moves

**Configuration:**
```json
{
  "mcp": {
    "competitor-intel": {
      "type": "competitor-tracker",
      "enabled": true,
      "competitors": [
        "datadog",
        "new-relic",
        "openai-api",
        "anthropic-api"
      ],
      "monitoring_channels": [
        "product-announcements",
        "pricing-pages",
        "release-notes",
        "social-media"
      ],
      "update_frequency": "daily"
    }
  }
}
```

---

### 5. Customer Research Tools

**Connection:** `mcp://research-platform`

**Capabilities:**
- Integrate with research tools (Intercom, UserTesting, Typeform)
- Fetch survey responses, interview feedback
- Automated theme detection in customer feedback
- Sentiment analysis

**Use cases:**
- User Research Synthesis: Auto-process survey and interview data
- Feature Prioritization: Validate demand with customer research
- Market Research: Customer validation signals

**Configuration:**
```json
{
  "mcp": {
    "research-platform": {
      "type": "customer-research",
      "enabled": true,
      "integrations": {
        "intercom": {
          "api_key": "${INTERCOM_API_KEY}",
          "workspace": "company-ai-pm"
        },
        "typeform": {
          "api_key": "${TYPEFORM_API_KEY}",
          "forms": ["nps-survey", "feature-request"]
        },
        "user-testing": {
          "api_key": "${USERTESTING_API_KEY}"
        }
      }
    }
  }
}
```

---

## Enabling MCP Connections

### Step 1: Add to settings.json

Edit `~/.claude/projects/<project>/settings.json`:

```json
{
  "mcp": {
    "research": {
      "enabled": true,
      "type": "web-search"
    },
    "documents": {
      "enabled": true,
      "type": "document-processor"
    },
    "analytics": {
      "enabled": true,
      "type": "analytics-engine",
      "api_keys": {
        "amplitude_key": "YOUR_KEY_HERE"
      }
    }
  }
}
```

### Step 2: Set Environment Variables

```bash
export AMPLITUDE_API_KEY="xxx"
export SALESFORCE_TOKEN="yyy"
export INTERCOM_API_KEY="zzz"
```

### Step 3: Test Connection

In Claude Code session:

```
/test-mcp research
→ Verifies web search connection works

/test-mcp analytics
→ Verifies analytics data can be fetched
```

---

## Using MCP in Skills

### Example: Market Research Skill with MCP

```markdown
# Market Research (with MCP)

## Instruction: Use MCP to gather real-time market data

1. **Data gathering (via MCP research):**
   - /mcp research "TAM for AI Ops 2026"
   - Returns: Latest analyst reports, market data, competitor pricing

2. **Data analysis:**
   - Cross-reference with historical trends
   - Validate assumptions with primary research

3. **Report generation:**
   - TAM estimate triangulation
   - SAM/SOM calculation
   - Deliverable: Market Research report
```

### Example: User Research Synthesis with MCP

```markdown
# User Research Synthesis (with MCP)

## Instruction: Process research data via MCP

1. **Data ingestion (via MCP documents):**
   - Upload interview transcripts (7 PDFs)
   - /mcp documents process-interviews interviews/
   - Returns: Extracted themes, quotes, sentiment

2. **Theme analysis:**
   - Frequency count (5 mentions = high pain)
   - Sentiment scoring (positive/neutral/negative)

3. **Synthesis (via MCP research-platform):**
   - Cross-reference with survey data (Typeform)
   - Aggregate with usage data (Intercom)

4. **Output:**
   - Personas
   - Jobs-to-be-done
   - Design requirements
```

---

## Data Privacy & Security

### Sensitive Data Handling

**Do NOT include in MCP requests:**
- Customer names, email addresses, company IDs
- Specific financial data (revenue, pricing, contracts)
- Proprietary product details not yet public
- Personal information from interviews

**Safe to include:**
- Aggregated themes (e.g., "5 customers mentioned latency as pain")
- Anonymized quotes
- Market-level data (TAM, segment sizing)
- Public competitive information

### Configuration for Data Protection

```json
{
  "mcp": {
    "data-policy": {
      "encryption": "enabled",
      "pii-redaction": "automatic",
      "customer-data": "anonymized",
      "audit-logging": "enabled"
    }
  }
}
```

---

## Troubleshooting MCP Connections

### Connection Test

```bash
# Test all connections
./mcp-test.sh

# Test specific connection
./mcp-test.sh --service research
./mcp-test.sh --service analytics
```

### Common Issues

**Issue:** `MCP connection refused`
- **Cause:** Service not running or API key invalid
- **Solution:** Verify API keys in settings.json; check service status

**Issue:** `Document processing timeout`
- **Cause:** Large file (>50MB) or complex format
- **Solution:** Split document; ensure it's PDF or TXT format

**Issue:** `Analytics data stale`
- **Cause:** Cache not refreshed
- **Solution:** `/mcp analytics refresh --force`

---

## MCP Best Practices

### 1. Leverage Caching
```json
{
  "mcp": {
    "research": {
      "cache": true,
      "cache_ttl_hours": 24
    }
  }
}
```

### 2. Batch Requests
```
// Bad: Multiple individual requests
/mcp research "competitor A"
/mcp research "competitor B"
/mcp research "competitor C"

// Good: Single batch request
/mcp research batch --competitors "A,B,C"
```

### 3. Error Handling
```
// Always provide fallback
If /mcp research fails → Use last-known data
If /mcp analytics fails → Estimate from historical trends
```

---

## Example: Full Workflow with MCP

**Scenario:** Quarterly feature prioritization with all MCP sources

```
PM triggers: /ai-pm-quarterly-prioritization

1. Market data (MCP research)
   → Fetch latest TAM, market trends
   → Competitive announcements

2. Customer data (MCP research-platform)
   → Survey responses (Typeform)
   → Support tickets (Zendesk)
   → Interview themes (manual input)

3. Product data (MCP analytics)
   → Feature adoption rates
   → User segments
   → Churn by segment

4. Synthesis
   → Calculate RICE scores with real data
   → Identify top 5 features
   → Generate prioritization report

Output:
- Quarterly Prioritization report
- RICE-ranked backlog
- Risk assessment
- Capacity model
```

---

## Future MCP Connections

**Planned:**
- Slack integration (share reports, collect feedback)
- Jira integration (track feature delivery)
- Linear integration (roadmap sync)
- Figma integration (design handoff)

**Request new connections:** Submit issue to Claudient repository

---

**Last updated:** June 15, 2026  
**MCP version:** 1.0+  
**Status:** Production-ready
