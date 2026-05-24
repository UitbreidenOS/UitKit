# MCP: Thomson Reuters Westlaw & Practical Law

Thomson Reuters provides an official MCP server giving Claude Code direct access to Westlaw — the leading US legal research database — and Practical Law, which covers practice guides, standard documents, and checklists. Requires an active Westlaw subscription. Once connected, Claude can retrieve current case law, statutes, and regulations rather than relying on training data frozen at its knowledge cutoff.

## Why you need this

Without TR MCP, Claude's legal knowledge is static. With it:
- Search and retrieve current case law by jurisdiction, court, and date range
- Pull statutes and regulations in their current, in-force form
- Access Practical Law practice notes and standard document templates
- Shepardize / KeyCite cases to confirm they are still good law
- Generate citations in Bluebook format
- Answer questions like: "Is this clause still enforceable under NY law as of 2026?"

## Prerequisites

- Active Westlaw subscription (individual, firm, or enterprise)
- TR Developer API key — obtain from `developer.thomsonreuters.com`
- API access may require the legal.ai tier on your TR account; confirm with your account representative before setup

## Configuration

Add to `~/.claude.json` or project `.claude/mcp.json`:

```json
{
  "mcpServers": {
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

Replace `@thomsonreuters/westlaw-mcp@latest` with the exact package name listed on the TR Developer Portal — the name above is illustrative and may differ from the published package.

## What it exposes

| Tool | What it does |
|---|---|
| `search_cases` | Full-text case law search with filters for jurisdiction, court, and date |
| `get_case` | Retrieve full case opinion by citation |
| `shepardize` | Check if a case is still good law via KeyCite |
| `search_statutes` | Search federal and state statutes by topic or citation |
| `get_statute` | Retrieve a statute section with annotations |
| `search_regulations` | Search the CFR and state administrative codes |
| `get_practical_law` | Retrieve Practical Law practice notes and document templates |
| `search_secondary` | Search law reviews, treatises, and practice guides |
| `format_citation` | Generate a Bluebook-formatted citation |

## Example prompts

```
"Find Delaware Court of Chancery cases from 2022–2026 on director fiduciary duty in M&A transactions"

"Is the arbitration clause in this contract enforceable under 9 USC §2 and recent Second Circuit case law?"

"Get the Practical Law standard NDA for M&A with governing law set to New York"

"Shepardize Revlon v. MacAndrews and tell me if it is still good law"

"What are the current GDPR Article 17 obligations under EU regulation and has anything changed in 2025–2026?"
```

## Cost

TR API calls draw from your Westlaw API quota, which is separate from Claude token usage. Monitor consumption at `developer.thomsonreuters.com/usage`. Enterprise contracts typically include a bundled API tier — confirm your quota before running bulk research workflows.

## Combine with iManage

Pairing Thomson Reuters MCP with iManage DMS lets Claude pull precedent cases from Westlaw and retrieve your firm's prior work product on the same matter from iManage, then draft a memo that cites both sources. Combined config:

```json
{
  "mcpServers": {
    "thomson-reuters": {
      "command": "npx",
      "args": ["-y", "@thomsonreuters/westlaw-mcp@latest"],
      "env": {
        "TR_API_KEY": "your-tr-api-key",
        "TR_JURISDICTION": "US",
        "TR_DEFAULT_CONTENT_TYPES": "cases,statutes,regulations,practicallaw"
      }
    },
    "imanage": {
      "command": "npx",
      "args": ["-y", "@imanage/mcp-server@latest"],
      "env": {
        "IMANAGE_SERVER": "https://your-firm.imanage.work",
        "IMANAGE_CLIENT_ID": "your-client-id",
        "IMANAGE_CLIENT_SECRET": "your-client-secret"
      }
    }
  }
}
```

With both servers active, a prompt like "Draft a memo on enforceability of MNDA liquidated damages clauses under NY law, citing relevant cases and any prior firm memos on the topic" will draw from Westlaw for current case law and iManage for internal precedents simultaneously.
