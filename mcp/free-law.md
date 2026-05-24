# MCP: Free Law Project (CourtListener)

The Free Law Project's CourtListener MCP provides free, open-access US court opinions, docket data, and judge profiles. No subscription required. Coverage spans federal district, circuit, and Supreme Court opinions sourced from PACER and direct court feeds, as well as many state courts. The database currently holds over 8.4 million opinions and is updated continuously as new decisions are published.

## Why you need this

- 8.4 million+ court opinions, freely accessible with no per-document charge
- Federal district, circuit, and Supreme Court opinions going back decades
- PACER docket data — full filing histories for active and closed federal cases
- Judge profiles including appointment history and recusal records
- Oral argument audio and transcripts for cases where available
- Real-time feeds for new filings and decisions

## Installation

```bash
npm install -g @freelawproject/courtlistener-mcp
```

Or use the remote SSE endpoint directly in your config — no local install needed (see configuration below).

## Configuration

**Local (npx):**

```json
{
  "mcpServers": {
    "courtlistener": {
      "command": "npx",
      "args": ["-y", "@freelawproject/courtlistener-mcp@latest"],
      "env": {
        "COURTLISTENER_API_KEY": "your-api-key"
      }
    }
  }
}
```

API key: free registration at `courtlistener.com/sign-in/`. Anonymous access works but is rate-limited. A free account raises the limit substantially and is sufficient for most research workflows.

## What it exposes

| Tool | What it does |
|---|---|
| `search_opinions` | Full-text search across all court opinions with filters |
| `get_opinion` | Retrieve full opinion text by ID or citation |
| `search_dockets` | Search PACER dockets by case name, number, or court |
| `get_docket` | Full docket with all filing entries and document links |
| `get_judge` | Judge profile, appointment history, and recusal record |
| `search_oral_arguments` | Search oral argument audio and transcripts |
| `get_court_info` | Court metadata and jurisdiction details |
| `cite_count` | How many times a case has been cited in subsequent opinions |

## Example prompts

```
"Find all Second Circuit opinions on fair use in software copyright from 2018–2026"

"Get the docket for Oracle v. Google in the Federal Circuit"

"Who are the current district court judges in SDNY and when were they appointed?"

"How many times has Campbell v. Acuff-Rose been cited in circuit court opinions?"

"Find recent EDVA opinions on preliminary injunctions in trade secret cases"
```

## Combine with Westlaw

For serious legal research, run both servers together: CourtListener for free broad search and citation counting, Westlaw MCP for full-text retrieval, shepardization, statutes, and Practical Law documents. Combined config:

```json
{
  "mcpServers": {
    "courtlistener": {
      "command": "npx",
      "args": ["-y", "@freelawproject/courtlistener-mcp@latest"],
      "env": {
        "COURTLISTENER_API_KEY": "your-api-key"
      }
    },
    "thomson-reuters": {
      "command": "npx",
      "args": ["-y", "@thomsonreuters/westlaw-mcp@latest"],
      "env": {
        "TR_API_KEY": "your-tr-api-key",
        "TR_JURISDICTION": "US",
        "TR_DEFAULT_CONTENT_TYPES": "cases,statutes,regulations,practicallaw"
      }
    }
  }
}
```

Workflow: use `search_opinions` on CourtListener to identify relevant cases across a broad date range at no cost, then use `get_case` and `shepardize` on Westlaw to retrieve full text and verify current validity for the cases that matter.

## Privacy

All data served by CourtListener is public record. There are no privilege concerns for research queries. PACER docket data is public, but full document downloads for items not yet in CourtListener's cache incur standard PACER per-page fees (currently $0.10/page, capped at $3.00 per document). Opinions that CourtListener has already retrieved and indexed are served free of charge from its own storage.
