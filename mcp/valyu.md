# MCP: Valyu — Premium Data Access

Access paywalled and premium data sources from Claude Code: SEC filings, PubMed research, clinical trial data, academic papers, and financial databases — without manual downloading.

## Why you need this

Many valuable data sources are behind paywalls or require complex API integrations. Valyu provides a unified MCP interface to:
- SEC EDGAR filings (10-K, 10-Q, 8-K, proxy statements)
- PubMed biomedical literature
- ClinicalTrials.gov data
- Academic papers and preprints
- Financial data and earnings transcripts

## Configuration

```json
{
  "mcpServers": {
    "valyu": {
      "command": "npx",
      "args": ["-y", "valyu-mcp"],
      "env": {
        "VALYU_API_KEY": "your-valyu-api-key"
      }
    }
  }
}
```

Get an API key: [valyu.network](https://valyu.network)

## Use cases by domain

**Finance / Investment research:**
```
"Pull Apple's latest 10-K and extract the risk factors section"
"Get the last 4 quarters of earnings call transcripts for [company]"
"Find all 8-K filings for [company] in the last 6 months"
```

**Life sciences / Research:**
```
"Search PubMed for recent meta-analyses on [treatment]"
"Find all clinical trials currently recruiting for [condition] in Phase 3"
"Get the full text of this paper: [DOI]"
```

**Academic research:**
```
"Find the 10 most-cited papers on [topic] from the last 2 years"
"Get the abstract and methodology of papers related to [research question]"
```

**Competitive intelligence:**
```
"Pull [competitor]'s latest annual report and extract their revenue by segment"
"Find any patent filings by [company] in the last 12 months"
```

## Combine with the research-dossier skill

The `/research-dossier` skill structures the research framework. Valyu MCP provides the raw data to populate it. Together: comprehensive, data-backed research in minutes instead of hours.

## vs. web search

- **Web search** — finds public web pages, often summarised or outdated
- **Valyu** — retrieves primary source documents (the actual filings, papers, trials) in full text

Valyu is for research that requires primary sources, not Google results.
