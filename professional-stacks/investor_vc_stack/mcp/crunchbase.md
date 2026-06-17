# Crunchbase MCP Server

Core company intelligence for deal sourcing and due diligence.

---

## What Crunchbase Provides

**Company Data:**
- Founding date, headquarters, stage, industry classification
- Full team (founders, executives, key employees)
- Funding history (all rounds, amounts, investors, valuations)
- News and press releases
- Board members and advisors

**Perfect For:**
- Initial company research before scoring
- Founding team background verification
- Funding trajectory and investor patterns
- Market positioning and sector trends

**Limitations:**
- Less complete for private companies <$1M raised
- News feed may be delayed vs. real-time
- Requires Crunchbase Pro+ for API access

---

## Getting Your API Key

1. Go to [crunchbase.com](https://crunchbase.com/)
2. Sign up or log in (Pro plan required for API)
3. Navigate to **API Keys** in account settings
4. Generate new API key
5. Copy and paste into settings.json

---

## Integration with VC Stack

**Used By:**
- `/score-opportunity` — Founding team background, funding history
- `/company-batch` — Quick team and funding validation
- `/dd-report` — Financial history, investor list, company overview

**Example Query:**
```
Crunchbase search: "XYZ Fintech"
Returns: Founding date (2020), founders (Jane Smith ex-Stripe, Alex Johnson ex-Wise), 
3 funding rounds totaling $15M, customers, team size (20)
```

---

## Tips for Best Results

1. **Search by company legal name** — Use registered company name for best match
2. **Include stage/industry** — Helps narrow results if name is generic
3. **Cross-check funding dates** — Verify announced rounds match Crunchbase records
4. **Note data gaps** — If company not in Crunchbase, use LinkedIn and company website as backup
5. **Track investor patterns** — Look for repeat investors across rounds; signals confidence

---

## Troubleshooting

**No results for company name?**
- Try alternate names or spelling variants
- Company may be pre-Crunchbase (very early stage)
- Fall back to LinkedIn + company website research

**Outdated information?**
- Crunchbase is crowd-sourced; flag corrections directly
- Use recent news sources to verify current team

**API quota exceeded?**
- Check Crunchbase account for rate limits
- Batch queries where possible
