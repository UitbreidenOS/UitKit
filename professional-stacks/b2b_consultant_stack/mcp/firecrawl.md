# MCP: Firecrawl (Website Scraping)

Configuration and setup for Firecrawl API in B2B Consultant Stack.

---

## What Is Firecrawl?

Firecrawl is an MCP server that scrapes JavaScript-rendered web pages and returns clean markdown content. Useful for:
- Extracting company information from their website (product pages, pricing, team, newsroom)
- Scraping competitor websites (pricing comparison, feature list, positioning)
- Collecting public market research (analyst reports, industry benchmarks)
- Downloading investor presentations (if publicly available)

**Website:** https://www.firecrawl.dev/

---

## Setup

### Step 1: Get Firecrawl API Key

1. Sign up at https://www.firecrawl.dev/
2. Generate API key from dashboard
3. Add to environment: `export FIRECRAWL_API_KEY="your_key_here"`

### Step 2: Configure in settings.json

```json
{
  "mcp": {
    "firecrawl": {
      "enabled": true,
      "apiKey": "${FIRECRAWL_API_KEY}",
      "maxPages": 10,
      "timeout": 30000,
      "waitForNavigation": true
    }
  }
}
```

---

## Use Cases in Consultant Stack

### 1. Client Website Analysis

**Scenario:** You're analyzing a B2B SaaS company; need to extract their product, pricing, team from website.

```bash
/scrape-website "https://www.acme-saas.com" --sections pricing, team, product
```

**Output:**
```markdown
# Acme SaaS

## Pricing
- Starter: $99/mo (up to 5 users)
- Pro: $299/mo (up to 25 users)
- Enterprise: Custom pricing

## Team
- CEO: John Smith (formerly VP at [Company])
- CFO: Sarah Jones (MBA from Stanford)
- CTO: Mike Wong (10 years B2B SaaS)

## Product
- AI-powered prospecting platform
- Integrates with Salesforce, Hubspot, Outreach
- 3,000+ customers, 500+ G2 reviews (4.8 stars)
```

Use this for `client-analyzer` skill → understand their market positioning and team.

---

### 2. Competitor Analysis

**Scenario:** Mapping competitor landscape for opportunity-identifier.

```bash
/scrape-website "https://www.competitor1.com/pricing" --sections pricing-details
/scrape-website "https://www.competitor2.com/pricing" --sections pricing-details
/scrape-website "https://www.competitor3.com/pricing" --sections pricing-details
```

**Output:** Competitive pricing matrix
| Competitor | Plan | Price | Features |
|---|---|---|---|
| Competitor 1 | Pro | $499/mo | AI prospecting, CRM integration, reporting |
| Competitor 2 | Growth | $599/mo | AI prospecting, CRM integration, AI workflows |
| Competitor 3 | Enterprise | Custom | Custom features, dedicated support |

Use for `opportunity-identifier` → pricing optimization opportunity identified.

---

### 3. Customer Research (Case Studies)

**Scenario:** Extracting customer case studies or testimonials from company website.

```bash
/scrape-website "https://www.acme-saas.com/customers" --sections case-studies
```

**Output:** List of customer logos, case study links, use cases, reported ROI.

Use for `strategy-designer` → identify customer segments and success stories to emulate.

---

### 4. Market Research (Industry Reports)

**Scenario:** Some analyst firms publish sample reports or summaries on their website.

```bash
/scrape-website "https://www.gartner.com/en/research/methodologies/magic-quadrant" --sections excerpt
```

**Output:** Summary of market trends, leader positioning, evaluation criteria.

Use for `opportunity-identifier` → validate market opportunity and competitive positioning.

---

## Workflow: Complete Competitor Analysis

**Example: Building competitive landscape for GTM opportunity**

1. **Identify competitors**
   ```
   Manual step: List top 5 competitors
   ```

2. **Scrape pricing pages**
   ```bash
   for competitor in $competitors; do
     /scrape-website "$competitor/pricing"
   done
   ```

3. **Scrape product pages**
   ```bash
   /scrape-website "https://competitor.com/product" --sections features, integrations
   ```

4. **Scrape customers & case studies**
   ```bash
   /scrape-website "https://competitor.com/customers" --sections testimonials, logos
   ```

5. **Consolidate findings**
   ```
   Create competitive positioning matrix:
   - Features: Which competitor has which capabilities?
   - Pricing: Price point by tier/segment
   - Customers: Customer types, company sizes, industries
   - Positioning: How does each competitor position?
   ```

6. **Identify opportunity**
   ```
   Market gap: If competitors target Enterprise, opportunity is SMB
   Feature gap: If all competitors lack [feature], opportunity to differentiate
   Pricing gap: If all competitors premium-priced, opportunity for affordable tier
   ```

---

## Best Practices

1. **Respect robots.txt** — Check before scraping; some sites block crawlers
2. **Use sparingly** — Don't scrape competitor site every day; quarterly update is sufficient
3. **Cache results** — Store scraped content locally; don't re-scrape same pages repeatedly
4. **Attribute sources** — Always cite "per [competitor] website as of [date]"
5. **Validate changes** — If competitor revises pricing, verify before using in analysis
6. **Watch for legal issues** — For copyrighted content (whitepapers, reports), respect copyright

---

## Limitations

- **JavaScript-rendered pages:** Works well; waits for page load
- **Large websites:** Firecrawl has page limits (default 10 pages); set higher if needed
- **Login-required pages:** Cannot scrape behind authentication
- **PDFs:** Can scrape linked PDFs but results vary; use dedicated PDF tool if available
- **Video/images:** Extracts alt text and captions; doesn't summarize video content

---

## Troubleshooting

**Issue: Scrape returns empty or partial content**
- Cause: Page uses heavy JavaScript or requires login
- Solution: Check if content is behind authentication; use manual visit instead

**Issue: Timeout or rate limit**
- Cause: Site blocks/throttles scrapers or page is very large
- Solution: Reduce maxPages; use longer timeout; scrape specific section only

**Issue: Blocked by WAF or bot detection**
- Cause: Site uses anti-bot protection
- Solution: Manual visit, or reach out to company for content directly

---

## Example Output: Full Competitor Analysis

```markdown
# Competitive Landscape — Sales Engagement Platform

## Competitor Matrix

| Vendor | Pricing | Positioning | Target Market | Key Features |
|---|---|---|---|---|
| Competitor A | $399–$2,999/mo | "Enterprise AI prospecting" | Enterprise (500+ employees) | Advanced AI, custom workflows, dedicated support |
| Competitor B | $199–$999/mo | "SMB-friendly prospecting" | SMB to mid-market | Affordable, easy integration, reporting |
| Competitor C | $499–Custom | "Enterprise + managed services" | Enterprise + CFOs | Full suite, account management, ROI focus |

## Market Gaps (Opportunities)

1. **No vertical specialization:** All competitors target broad B2B; opportunity for vertical (e.g., SaaS only)
2. **No outcome-based pricing:** All competitors use seat or usage-based; opportunity for success-based pricing
3. **Limited free tier:** Competitors all paid; opportunity for freemium with upsell
4. **No community:** Competitors lack vibrant user community; opportunity for community + ecosystem

## Recommended GTM Strategy

Focus on SMB segment with:
- Freemium product (lower friction than competitors)
- Vertical specialization (SaaS company persona)
- Community-driven growth (vs. competitor sales-driven model)
- Outcome-based pricing: "Pay only if your reps hit quota increase"

**Expected impact:** +$2M ARR in year 1 from SMB segment (vs. competitors' Enterprise-only focus)
```

---

## Configuration Template

```json
{
  "mcp": {
    "firecrawl": {
      "enabled": true,
      "apiKey": "${FIRECRAWL_API_KEY}",
      "crawlOptions": {
        "maxPages": 10,
        "timeout": 30000,
        "pageLoadWaitTime": 3000,
        "waitForNavigation": true,
        "includeHtml": false,
        "includePaths": null,
        "excludePaths": null,
        "excludePatterns": null,
        "respectRobotsTxt": true,
        "respectCrawlDelay": true
      },
      "cache": {
        "enabled": true,
        "ttlHours": 720
      }
    }
  }
}
```

---

## Related Tools

- **Perplexity API:** Real-time search + synthesis (better for recent news, financials)
- **File MCP:** Store scraped content + research artifacts
- **WebFetch:** Quick single-page scrape without full Firecrawl setup

