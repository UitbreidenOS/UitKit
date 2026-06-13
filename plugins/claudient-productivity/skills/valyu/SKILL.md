---
name: "valyu"
description: "Access paywalled research data via Valyu MCP: SEC EDGAR filings, PubMed papers, clinical trials, patents, financial reports."
---

# Valyu Research API

## When to activate

- User needs SEC EDGAR filings (10-K, 10-Q, 8-K, DEF 14A) for a public company
- Accessing PubMed or biomedical literature behind journal paywalls
- Querying ClinicalTrials.gov for trial data, enrollment status, or results
- Patent database searches (USPTO, EPO, WIPO)
- Financial data requiring official filings rather than scraped web data
- Academic papers where free preprints are unavailable and the full text is needed
- Any research task where authoritative primary sources matter more than aggregated web content

## When NOT to use

- General web search (use WebSearch instead — Valyu adds cost without benefit for public web content)
- News articles, blog posts, or opinion content
- Code documentation or Stack Overflow-style technical answers
- Data that is freely and reliably available via standard search (Wikipedia, official product docs)
- Real-time prices, live market data, or streaming financial feeds — Valyu has filing data, not tickers

## Instructions

### MCP setup

Add Valyu to your Claude Code MCP configuration:

```json
{
  "mcpServers": {
    "valyu": {
      "command": "npx",
      "args": ["-y", "@valyu/mcp-server"],
      "env": {
        "VALYU_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

Get an API key at valyu.network. Store the key in your shell environment or `.env` — never in `settings.json` or committed files:

```bash
export VALYU_API_KEY="vk_..."
```

Then reference it in MCP config as `"${VALYU_API_KEY}"` or use the env block as shown.

### Available data sources

| Source | What it contains | Best query type |
|---|---|---|
| SEC EDGAR | 10-K, 10-Q, 8-K, DEF 14A, S-1, and all other SEC forms | CIK number or company ticker + form type |
| PubMed | 35M+ biomedical abstracts and full texts | PMID, DOI, or keyword + date range |
| ClinicalTrials.gov | Trial metadata, status, results, protocols | NCT number or condition + intervention |
| USPTO Patents | US patent full text, citations, assignments | Patent number or keyword + classification code |
| EPO / WIPO | European and international patents | Application number or keyword |
| Financial reports | Earnings releases, investor presentations | Company name + fiscal period |

### Query patterns by source

**SEC EDGAR — 10-K filings:**
```
Use Valyu to retrieve the 10-K filing for [COMPANY] (ticker: [TICKER]) for fiscal year [YEAR].
Extract: revenue, gross margin, R&D expense, operating income, net income, share count.
Return as a table with year-over-year change.
```

**SEC EDGAR — trend analysis across years:**
```
Use Valyu to pull the 10-K filings for [COMPANY] for fiscal years [YEAR-2], [YEAR-1], and [YEAR].
For each year extract: total revenue, R&D spend as % of revenue, free cash flow.
Build a trend table and note year-over-year changes.
```

**PubMed — literature search:**
```
Use Valyu to search PubMed for papers on [TOPIC].
Filter: published [DATE RANGE], English only, human subjects.
Return: title, authors, journal, year, abstract, DOI for the top 10 by citation count.
```

**ClinicalTrials.gov — trial lookup:**
```
Use Valyu to query ClinicalTrials.gov for trials studying [INTERVENTION] in [CONDITION].
Filter: Phase 2 or 3, completed or active recruiting, results available.
Return: NCT number, title, sponsor, enrollment, primary endpoint, results summary if available.
```

**Patent search:**
```
Use Valyu to search USPTO patents for [TECHNOLOGY AREA].
Filter: granted patents, [DATE RANGE], assigned to [COMPANY] if specific.
Return: patent number, title, abstract, filing date, grant date, key claims summary.
```

### Citation formatting

When producing research outputs, format Valyu-sourced citations as:

**SEC filing:**
```
[Company Name]. Form 10-K. United States Securities and Exchange Commission. Filed [date]. 
Accession number: [accession]. Retrieved via Valyu.
```

**PubMed paper:**
```
[Authors]. "[Title]." [Journal] [Vol]([Issue]) ([Year]): [Pages]. PMID: [PMID]. DOI: [DOI].
```

**Clinical trial:**
```
[Trial Title]. ClinicalTrials.gov identifier: [NCT number]. [Sponsor]. [Status as of retrieved date].
```

**Patent:**
```
[Assignee]. "[Patent Title]." [Patent Number]. [Grant date]. [Classification].
```

### Combining Valyu with web search

For comprehensive research, combine Valyu (primary sources) with WebSearch (context, analysis, news):

```
Research workflow for [COMPANY] competitive analysis:

Step 1 — Valyu: Pull last 3 years of 10-K filings. Extract revenue, margins, R&D spend.
Step 2 — Valyu: Pull any 8-K filings from the last 12 months for material events.
Step 3 — WebSearch: Find analyst coverage, recent news, and public commentary.
Step 4 — Synthesize: Primary financial data from Valyu + qualitative context from web.
Note clearly which claims come from official filings vs. secondary sources.
```

### Cost awareness

Valyu charges per query. Guidelines for keeping costs down:
- Use specific identifiers (CIK, PMID, NCT number, patent number) when you have them — keyword searches consume more quota
- Request only the years or date ranges you need — do not pull all filings if you need only the last 3
- Cache results for the session: if you pulled a 10-K, keep it in context rather than re-fetching

## Example

**Task:** Pull the last 3 years of 10-K filings for a public company and extract revenue growth and R&D spend trends.

**Prompt:**
```
Use Valyu to retrieve the 10-K annual filings for Cloudflare (ticker: NET) for fiscal years
2022, 2023, and 2024.

From each filing, extract:
- Total revenue
- Revenue year-over-year growth %
- R&D expense
- R&D as % of revenue
- Operating loss / income
- Free cash flow (operating cash flow minus capex)

Present as a table with all three years side by side.
Then write 3 sentences interpreting the trend.
Cite each filing with the SEC accession number.
```

**Expected output structure:**
| Metric | FY2022 | FY2023 | FY2024 |
|---|---|---|---|
| Revenue | $975M | $1.30B | $1.63B |
| YoY growth | 49% | 33% | 26% |
| R&D expense | $423M | $522M | $609M |
| R&D % revenue | 43% | 40% | 37% |

With citation: "Cloudflare Inc. Form 10-K. SEC. Filed 2025-02-21. Accession: 0001477932-25-003456."

---
