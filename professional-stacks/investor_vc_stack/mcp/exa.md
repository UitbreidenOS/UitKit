# Exa MCP Server

Real-time signals and semantic search for portfolio monitoring and market intelligence.

---

## What Exa Provides

**Real-Time News & Signals:**
- Breaking news about companies and sectors
- Product launches and updates
- Executive changes and hiring announcements
- Funding announcements and M&A activity
- Regulatory and market trend signals

**Semantic Search:**
- Search by meaning, not just keywords
- Find signals you didn't explicitly search for
- Detect emerging trends and weak signals
- Monitor competitor activity

**Perfect For:**
- Portfolio company monitoring (monthly signals check)
- Market trend detection
- Competitive intelligence
- Due diligence fact-checking

**Limitations:**
- Requires real-time internet connection
- Quality varies by region and language
- May return news with variable recency

---

## Getting Your API Key

1. Go to [exa.ai](https://exa.ai/)
2. Sign up (free tier available)
3. Navigate to **API Keys** in settings
4. Create new API key
5. Copy and paste into settings.json

---

## Integration with VC Stack

**Used By:**
- `/portfolio-check` — Monthly monitoring of portfolio company signals
- `/dd-report` — Recent news validation, market trend research
- `/market-analyzer` — Real-time competitive and sector trends

**Example Query:**
```
Exa search: "XYZ Fintech Series C funding"
Returns: Recent articles about Series C announcement, lead investor details, 
use of funds, market context, investor quotes
```

---

## Using Exa for Portfolio Monitoring

**Key Signals to Track:**

1. **Funding Announcements**
   - Query: "[Company name] funding" OR "[Company name] raised"
   - Frequency: Weekly

2. **Executive Changes**
   - Query: "[Company name] hires" OR "[Company name] appoints"
   - Frequency: Weekly

3. **Product Launches**
   - Query: "[Company name] launches" OR "[Company name] new feature"
   - Frequency: Bi-weekly

4. **Competitive Activity**
   - Query: "[Market segment] funding" to see investor activity
   - Frequency: Monthly

5. **Market Trends**
   - Query: "[Industry] market" OR "[Industry] regulation"
   - Frequency: Monthly

---

## Tips for Best Results

1. **Use Boolean operators** — Combine terms for precision
   - Good: `"Company name" AND (funding OR raises)`
   - Avoid: `company funding raises` (too broad)

2. **Set recency filters** — Recent signals matter most
   - Use: "news from the past 30 days"
   - Avoid: Month-old news for active monitoring

3. **Cross-check sources** — Exa returns articles; verify source quality
   - Prioritize: Company blog, TechCrunch, Reuters
   - Check: Smaller blogs for confirmation

4. **Semantic search for trends** — Don't just keyword-match
   - Query: "payments infrastructure" instead of "payments"
   - Captures adjacent companies and trends

5. **Schedule weekly portfolio checks** — Set recurring reminder to run `/portfolio-check`

---

## Example Portfolio Monitoring Report

```
PORTFOLIO MONITORING — PAST 30 DAYS

[Company A - XYZ Fintech]
- Signal: Series C announcement ($20M raised)
- Impact: High (positive, signals momentum)
- Action: Schedule founder call to discuss expansion

[Company B - ABC SaaS]
- Signal: CTO departure to competitor
- Impact: High (negative, operational risk)
- Action: Risk assessment call with CEO

[Company C - DEF Climate]
- Signal: No signals this month
- Impact: Low
- Action: Continue monitoring
```

---

## Troubleshooting

**Search returning too many results?**
- Tighten query with more specific terms
- Add industry context or date filters

**Missing recent news about a company?**
- Try alternate company names or public name
- Search for founder name instead of company name

**Signal seems stale?**
- Exa has 2–3 day lag from publication
- Check company blog or LinkedIn directly for breaking news

**API quota exceeded?**
- Free tier has limited queries
- Consider upgrading to paid plan for weekly monitoring
