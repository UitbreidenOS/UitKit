# MCP: Connections & Data Sources

Configuration and setup for MCP servers used in B2B Consultant Stack engagements.

---

## Recommended MCP Servers

### 1. Perplexity API (Real-Time Web Search)

**Purpose:** Real-time market research, competitive intelligence, industry trends, financial data

**Use in Stack:**
- `client-analyzer`: Real-time company financial data, exec team research, competitor tracking
- `opportunity-identifier`: Market validation, adjacent market research, pricing benchmarks
- Risk assessment: Market condition monitoring during engagement execution

**Setup:**

Add to `settings.json`:

```json
{
  "mcp": {
    "perplexity": {
      "enabled": true,
      "apiKey": "YOUR_PERPLEXITY_API_KEY",
      "model": "sonar",
      "maxTokens": 2000,
      "temperature": 0.7
    }
  }
}
```

Get API key from: https://www.perplexity.ai/api/

**Example Query:**
```
/query-perplexity "Acme SaaS Series B funding 2024 2025"
→ Returns: Perplexity's latest research on Acme SaaS, founders, investors, news
```

---

### 2. File MCP (Document Management)

**Purpose:** Create, version, and manage deliverable documents (strategies, roadmaps, term sheets, risk registers)

**Use in Stack:**
- Store all engagement deliverables with version control
- Auto-archive previous versions of key documents
- Enable client download and sharing of final documents

**Setup:**

Add to `settings.json`:

```json
{
  "mcp": {
    "file": {
      "enabled": true,
      "allowedPaths": [
        "/Users/tushar/Desktop/Claudient/b2b_consultant_stack",
        "/Users/tushar/Desktop/Claudient/b2b_consultant_stack/deliverables"
      ]
    }
  }
}
```

**Example Usage:**
```bash
# Create a new strategy document
/create-document acme-saas-strategy --type markdown

# Add to deliverables folder
/save-deliverable acme-saas-strategy-v1.0.md --path deliverables/

# Create version
/archive-version acme-saas-strategy-v1.0.md
```

---

## Optional MCP Servers

### 3. Google Sheets (Data & Metrics Tracking)

**Purpose:** Track engagement metrics, financial impact, team capacity, and deal pipeline

**Use Cases:**
- Engagement tracking: client list, stage, duration, fees, impact
- Financial dashboard: revenue, cost savings, margin improvements
- Team capacity: hours allocated, utilization, project pipeline
- Deal pipeline: prospects, engagement stage, probability, pipeline value

**Setup:**

Configure Google Sheets API in settings.json:

```json
{
  "mcp": {
    "google-sheets": {
      "enabled": true,
      "serviceAccount": "YOUR_SERVICE_ACCOUNT_JSON",
      "sheetId": "YOUR_SHEET_ID"
    }
  }
}
```

**Example Spreadsheet:**
- **Sheet 1: Engagements** — Client, stage, start date, end date, fee, expected impact
- **Sheet 2: Metrics** — Opportunity, target, actual, timeline, status
- **Sheet 3: Team** — Resource, allocation %, projects, utilization

---

### 4. Email MCP (Client Communication)

**Purpose:** Send updates, share deliverables, schedule follow-ups

**Setup:** Configure email account in settings.json

**Use Cases:**
- Share strategy doc with client stakeholders
- Send approval request for term sheet
- Notify sponsor of milestone completion
- Schedule quarterly check-in reminder

---

### 5. Slack MCP (Team Notifications)

**Purpose:** Send internal team updates, milestone celebrations, risk alerts

**Use Cases:**
- Celebrate when major opportunity is approved
- Alert team when client feedback requires pivot
- Notify when payment milestone is received
- Team standup: weekly engagement status

---

## Data Sources for Research

### Financial & Firmographic Data

| Source | Type | Quality | Cost |
|---|---|---|---|
| Crunchbase | Funding, exec team, financials | Good | Paid |
| PitchBook | Funding, valuations, M&A data | Very Good | Paid |
| LinkedIn | Exec team, org structure, recent hires | Good | Free |
| ZoomInfo | Technographics, decision-makers | Very Good | Paid |
| SEC Filings (EDGAR) | Public company financials | Excellent | Free |
| Company blog / press | Company announcements, milestones | Good | Free |

### Competitive Intelligence

| Source | Type | Quality | Cost |
|---|---|---|---|
| G2 / Capterra | Product reviews, customer sentiment | Good | Free |
| Industry reports | Market size, growth, trends | Good | Paid |
| LinkedIn Sales Navigator | Competitor analysis, market trends | Good | Paid |
| Job postings | Hiring, expansion signals | Good | Free |
| Press releases | Company announcements | Good | Free |

### Pricing & Commercial Benchmarks

| Source | Type | Quality | Cost |
|---|---|---|---|
| PricingPages (Openview) | SaaS pricing models | Excellent | Free |
| SaaSHub | Pricing comparison | Good | Free |
| Industry analyst reports | Benchmarking | Very Good | Paid |
| Customer interviews | Real willingness-to-pay | Very Good | Time |

---

## Workflow: Using Perplexity for Client Analysis

**Example: Researching Acme SaaS for `/analyze-client` command**

1. **Basic Company Info**
   ```
   /query-perplexity "Acme SaaS company overview founders funding 2024"
   ```
   → Returns: Founding story, current ARR, funding rounds, investor list, recent news

2. **Financial Position**
   ```
   /query-perplexity "Acme SaaS revenue growth ARR Series B funding amount"
   ```
   → Returns: Estimated or disclosed ARR, growth rate, funding details, valuation

3. **Executive Team**
   ```
   /query-perplexity "Acme SaaS CEO CFO CTO executive team backgrounds"
   ```
   → Returns: Names, backgrounds, previous roles, LinkedIn profiles

4. **Competitive Landscape**
   ```
   /query-perplexity "Acme SaaS competitors market position pricing alternatives 2025"
   ```
   → Returns: Top competitors, positioning, relative strengths, market share

5. **Recent Developments**
   ```
   /query-perplexity "Acme SaaS news hires partnerships product launches 2025"
   ```
   → Returns: Recent announcements, hires, partnerships, product milestones, market signals

---

## Workflow: Using File MCP for Deliverables

**Example: Creating and managing strategy documents**

1. **Create Initial Strategy**
   ```bash
   /create-document "acme-saas-90-day-strategy" --type markdown --template strategy-roadmap
   ```
   → Generates blank strategy document with sections

2. **Write and Save**
   ```bash
   /write-to-document "acme-saas-90-day-strategy" --content [your strategy text]
   /save-deliverable "acme-saas-90-day-strategy" --path "deliverables/acme-saas/"
   ```

3. **Archive Previous Version**
   ```bash
   /archive-version "acme-saas-90-day-strategy-v1.0.md" --timestamp 2026-06-10
   ```
   → Renames to `acme-saas-90-day-strategy-v1.0-2026-06-10.md` and moves to `versions/`

4. **Update for Client Feedback**
   ```bash
   /create-new-version "acme-saas-90-day-strategy" --version "1.1" --changes "Phase 1 compressed to 3 weeks"
   ```

5. **Share with Client**
   ```bash
   /share-document "acme-saas-90-day-strategy-v1.1.md" --recipients [client-email] --access read
   ```

---

## Best Practices

1. **Always cite sources** in your analysis: "Per Crunchbase, Acme raised $10M in Series B"
2. **Validate data points** across 2–3 sources when possible (especially financials)
3. **Update quarterly** — market conditions change; refresh research every 90 days
4. **Track what changed** — if you revise opportunity assessment, note what new data triggered it
5. **Maintain confidentiality** — don't share client-provided data with external tools unless secure
6. **Backup critical docs** — store deliverables locally + cloud backup (Google Drive, Dropbox)

---

## Compliance & Security

**Data Handling:**
- Client financial data: Encrypt at rest; limit access
- Competitive intelligence: Attribute sources; don't use proprietary data
- Public data: Cite sources and links
- Personal data (exec names, emails): Follow GDPR / CCPA if applicable

**API Keys:**
- Store in environment variables or `.env.local` (never hardcode)
- Rotate keys periodically
- Use least-privilege scopes (read-only where possible)

