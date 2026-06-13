# Legal Data Connectors for Claude

## Overview

LLM training data has a hard cutoff — every statute amended last quarter, every circuit split decided last month, every regulatory guidance letter published last week is invisible to a model's weights. Legal work is jurisdiction-specific, matter-specific, and current-state dependent in ways that make offline knowledge nearly useless for anything beyond general reasoning. Data connectors solve this by attaching Claude to the authoritative live sources: Westlaw for controlling law, iManage for client matter documents, CourtListener for public dockets, and compliance databases for sanctions and beneficial ownership. The result is a system where Claude drafts, analyzes, and reasons against real data rather than memorized approximations — which is the only acceptable standard for legal work.

---

## Connector Categories

| Category | Examples | What Claude can do |
|---|---|---|
| Legal research DBs | Westlaw, LexisNexis, Bloomberg Law | Cite statutes, pull case law, summarize holdings |
| Document management | iManage, NetDocuments | Search matters, draft from precedents |
| Contract intelligence | Kira, Luminance, Ironclad | Extract clauses, flag deviations, redline |
| Public legal data | CourtListener (Free Law Project), PACER | Case search, docket tracking |
| Compliance data | Refinitiv/LSEG, FactSet | Regulatory lookups, sanctions screening |
| eDiscovery | Relativity | Privilege review, issue tagging |

---

## Thomson Reuters / Westlaw MCP

### What it provides

The Thomson Reuters MCP server exposes the full Westlaw content set: US federal and state statutes, regulations (CFR, Federal Register), case law with KeyCite citator signals, Restatements, and Practical Law practice guides. Coverage extends to select international jurisdictions and cross-border regulatory content.

- Statutes: USCA, state annotated codes, full historical versions
- Regulations: CFR current and historical, Federal Register notices, agency guidance
- Case law: federal courts (all circuits), state supreme and appellate courts, KeyCite validation
- Secondary: Practical Law checklists, standard documents, legal updates

### Prerequisites

1. Active Westlaw subscription with API access tier (contact your TR account manager — API access is not included in standard seat licenses)
2. API key from [developer.thomsonreuters.com](https://developer.thomsonreuters.com)
3. Your organization's Westlaw client ID

### Configuration

Install the server:

```bash
npm install -g @thomsonreuters/westlaw-mcp
```

Add to `~/.claude.json` or project `.claude/mcp.json`:

```json
{
  "mcpServers": {
    "westlaw": {
      "command": "npx",
      "args": ["-y", "@thomsonreuters/westlaw-mcp"],
      "env": {
        "TR_API_KEY": "your-tr-api-key-here",
        "TR_CLIENT_ID": "your-westlaw-client-id",
        "TR_JURISDICTION": "US",
        "TR_CONTENT_TYPES": "cases,statutes,regulations,practicallaw"
      }
    }
  }
}
```

For project-scoped configuration where different matters require different jurisdiction defaults:

```json
{
  "mcpServers": {
    "westlaw": {
      "command": "npx",
      "args": ["-y", "@thomsonreuters/westlaw-mcp", "--jurisdiction=DE", "--content=cases,statutes"],
      "env": {
        "TR_API_KEY": "your-tr-api-key-here",
        "TR_CLIENT_ID": "your-westlaw-client-id"
      }
    }
  }
}
```

### Example prompts

```
Find Delaware case law on fiduciary duty standards for directors in the
context of a merger transaction. Focus on post-Corwin decisions from
the Court of Chancery. Summarize the business judgment rule vs. entire
fairness framework and what triggers each.
```

```
Pull GDPR Article 17 (right to erasure) full text and summarize the
six grounds for erasure, the three-month obligation timeline for
controllers, and any current EU court interpretations that narrow or
expand the scope of "public interest" exceptions.
```

```
Retrieve New York CPLR §7501 through §7514 (arbitration provisions),
cite the most recent Court of Appeals decisions applying them, and
flag any 2024-2025 amendments.
```

```
Get the current CFPB regulation on UDAAP enforcement guidance from
the CFR and summarize the agency's position as reflected in the
three most recent consent orders.
```

### Cost note

API calls draw from your Thomson Reuters API quota, not from Claude API credits. TR charges per content item retrieved, not per query. High-volume use cases (bulk matter research) should use batch retrieval patterns rather than individual queries per document. Check your TR contract for per-unit pricing and monthly caps.

---

## LexisNexis MCP

### What it provides

LexisNexis exposes case law, statutes, Shepard's citator signals, Practical Guidance documents, legal news (Law360 integration), and the Lexis+ AI content layer. Shepard's is the critical differentiator — it provides direct and indirect citation history, negative treatment flags (overruled, distinguished, questioned), and subsequent history for every case.

- Case law: federal, all 50 states, plus select international
- Statutes: USCA, state codes, annotated with case citations
- Shepard's: full citator history with treatment codes
- Practical Guidance: jurisdiction-specific checklists and template documents
- News: Law360, legal wire services, regulatory announcements

### Prerequisites

Active Lexis+ subscription with API tier. Obtain credentials from [developer.lexisnexis.com](https://developer.lexisnexis.com). API access requires a separate contract addendum from the standard research subscription.

### Configuration

```bash
npm install -g @lexisnexis/lexis-mcp
```

```json
{
  "mcpServers": {
    "lexisnexis": {
      "command": "npx",
      "args": ["-y", "@lexisnexis/lexis-mcp"],
      "env": {
        "LEXIS_CLIENT_ID": "your-lexis-client-id",
        "LEXIS_CLIENT_SECRET": "your-lexis-client-secret",
        "LEXIS_SCOPE": "research shepards practicalguidance",
        "LEXIS_REGION": "us"
      }
    }
  }
}
```

The server handles OAuth2 token refresh automatically using `LEXIS_CLIENT_ID` and `LEXIS_CLIENT_SECRET`. Tokens expire every hour; the MCP server manages renewal without requiring intervention.

### Example: drafting an opinion memo

```
Using LexisNexis, research the enforceability of non-compete agreements
in California. Pull the controlling statute (Cal. Bus. & Prof. Code §16600),
the Edwards v. Arthur Andersen holding, and any Court of Appeal decisions
from 2020 onward that address the "narrow restraint" exception. Then draft
a two-page opinion memo advising a SaaS company on whether its standard
employee NCA is enforceable as applied to a software engineer in San Jose.
Cite every case with Shepard's signal.
```

Claude will call LexisNexis to retrieve the statute text, pull the cases, check Shepard's signals on each citation, and draft the memo with inline citations. The memo will note any cases with negative Shepard's treatment.

---

## Free Law Project / CourtListener MCP

### What it provides

CourtListener is a free, open-source legal research platform maintained by the Free Law Project. It indexes over 8 million US court opinions from federal and state courts, PACER docket data, oral argument recordings, and judge profiles including recusal history and financial disclosures.

Because it operates on public domain court opinions, there are no per-query charges and no subscription requirement. This makes it suitable for high-volume workflows: bulk docket monitoring, litigation tracking across multiple matters, and judge research.

Coverage:
- US Supreme Court (full historical)
- All 13 US Circuit Courts of Appeals
- All US District Courts (PACER integration where available)
- State supreme and appellate courts (varies by state)
- PACER dockets with real-time updates
- Bankruptcy courts

GitHub: [github.com/freelawproject/courtlistener](https://github.com/freelawproject/courtlistener)

### Configuration

#### Option A: Remote endpoint (Free Law Project hosted)

```json
{
  "mcpServers": {
    "courtlistener": {
      "type": "remote",
      "url": "https://mcp.courtlistener.com/sse",
      "env": {
        "COURTLISTENER_API_TOKEN": "your-token-from-courtlistener.com"
      }
    }
  }
}
```

Get a free API token at [courtlistener.com/sign-in/](https://www.courtlistener.com/sign-in/).

#### Option B: Local npm install

```bash
npm install -g @freelawproject/courtlistener-mcp
```

```json
{
  "mcpServers": {
    "courtlistener": {
      "command": "npx",
      "args": ["-y", "@freelawproject/courtlistener-mcp"],
      "env": {
        "COURTLISTENER_API_TOKEN": "your-token-from-courtlistener.com",
        "CL_BASE_URL": "https://www.courtlistener.com/api/rest/v4"
      }
    }
  }
}
```

### Best use cases

- Researching a judge's prior rulings before filing — pull all opinions by judge name, filter by case type
- Tracking active dockets for a client or counterparty — monitor PACER entries as they file
- Finding all circuit decisions on a narrow legal issue without a paid subscription
- Pulling opinion text for training, analysis, or internal precedent databases
- Bankruptcy monitoring — track debtor filings by industry or geography

### Example prompts

```
Search CourtListener for all Second Circuit opinions from 2022 to present
that cite Ashcroft v. Iqbal and address the pleading standard for fraud
claims under Rule 9(b). Return citations, holdings, and any circuit splits
with other circuits.
```

```
Pull the PACER docket for [case number] in the Southern District of New York
and summarize all entries from the past 30 days. Flag any discovery motions,
scheduling order modifications, or summary judgment filings.
```

---

## iManage / NetDocuments (DMS Connectors)

### How document management systems connect via MCP

Law firms and legal departments store their work product in document management systems (DMS) — not on local filesystems. iManage Work and NetDocuments are the two dominant platforms. MCP connectors for these systems give Claude direct access to matter documents: precedents, prior drafts, executed contracts, correspondence, and work product.

The key architectural difference from public legal databases: DMS connectors operate inside your network perimeter and authenticate against your firm's identity provider. Documents retrieved through these connectors are covered by attorney-client privilege and work product protection — see the Security and Privilege section for handling requirements.

### iManage Work MCP

iManage Work MCP exposes the iManage Work REST API through an MCP interface. It supports document search by matter, client, document type, author, date range, and full-text content. It can retrieve document content, check documents in and out, and post new document versions.

#### Prerequisites

- iManage Work 10.x or later with REST API enabled
- OAuth2 application registered in your iManage Control Center
- Client ID and secret from your iManage administrator
- Workspace and library IDs for your deployment

#### Configuration

```bash
npm install -g @imanage/work-mcp
```

```json
{
  "mcpServers": {
    "imanage": {
      "command": "npx",
      "args": ["-y", "@imanage/work-mcp"],
      "env": {
        "IMANAGE_HOST": "https://work.yourfirm.com",
        "IMANAGE_CLIENT_ID": "your-oauth2-client-id",
        "IMANAGE_CLIENT_SECRET": "your-oauth2-client-secret",
        "IMANAGE_LIBRARY": "ACTIVE",
        "IMANAGE_CUSTOMER_ID": "your-customer-id",
        "IMANAGE_SCOPE": "user openid read write"
      }
    }
  }
}
```

The MCP server handles the OAuth2 authorization code flow on first launch, opening a browser window for user authentication. Subsequent calls use the refreshed access token stored in the server's local credential cache.

#### Available operations

- `search_documents` — full-text and metadata search across matters
- `get_document` — retrieve document content by document ID
- `search_matters` — find matters by client name, matter number, or practice group
- `checkout_document` — check out a document for editing (locks it in iManage)
- `checkin_document` — check in a new version after editing
- `list_matter_documents` — list all documents in a specific matter workspace
- `get_document_versions` — retrieve version history for a document

#### Example prompts

```
Search iManage for all NDAs executed with Acme Corp over the past two years.
Return document title, date, author, and matter number. Then retrieve the
most recent executed NDA and summarize the key terms: term, governing law,
scope of confidential information, and carve-outs.
```

```
Find all M&A engagement letters in the Davis matter workspace from 2023
onward. List them by date and pull the fee structure from each. I need
to compare how our engagement terms have evolved across these transactions.
```

```
Retrieve the latest draft of the merger agreement in matter 2024-0892.
Check it out under my name, then identify all representations and
warranties that reference material adverse effect and summarize the
current MAC definition language.
```

### NetDocuments MCP

NetDocuments uses a similar pattern to iManage. The key structural differences: NetDocuments organizes content in cabinets and folders rather than workspaces and matter-centric libraries, and its API uses a different authentication model (OAuth2 with NetDocuments-specific scopes).

#### Configuration

```bash
npm install -g @netdocuments/nd-mcp
```

```json
{
  "mcpServers": {
    "netdocuments": {
      "command": "npx",
      "args": ["-y", "@netdocuments/nd-mcp"],
      "env": {
        "ND_BASE_URL": "https://api.netdocuments.com/v2",
        "ND_CLIENT_ID": "your-nd-client-id",
        "ND_CLIENT_SECRET": "your-nd-client-secret",
        "ND_REPOSITORY_ID": "your-repository-id",
        "ND_REDIRECT_URI": "http://localhost:4321/callback"
      }
    }
  }
}
```

NetDocuments uses cabinet IDs to scope searches. Set `ND_DEFAULT_CABINET` in the environment if your firm uses a consistent cabinet structure, or pass the cabinet ID per query.

#### Available operations

- `search` — full-text search across all accessible cabinets
- `get_document` — retrieve document content by ndID
- `list_folder` — list documents in a folder or cabinet path
- `search_by_attribute` — filter by custom metadata (client, matter, doctype)
- `get_document_history` — version and checkout history

---

## Ironclad Contract Intelligence

### What it provides

Ironclad is a contract lifecycle management (CLM) platform. Its MCP server exposes contract repository search, structured clause extraction, workflow status queries, and workflow trigger endpoints. It is the integration point when contract operations (approval routing, counterparty negotiation workflows, signature collection) need to be orchestrated alongside Claude's drafting and analysis capabilities.

Ironclad's data model centers on records — each contract is a record with structured attributes (parties, effective date, expiry, jurisdiction, governing law) plus the full contract text and extracted clause data.

### Prerequisites

- Ironclad account with API access (available on Growth and Enterprise plans)
- API token from Ironclad Settings → API & Integrations
- Your Ironclad subdomain (e.g., `yourcompany.ironcladapp.com`)

### Configuration

```bash
npm install -g @ironcladapp/ironclad-mcp
```

```json
{
  "mcpServers": {
    "ironclad": {
      "command": "npx",
      "args": ["-y", "@ironcladapp/ironclad-mcp"],
      "env": {
        "IRONCLAD_API_TOKEN": "your-ironclad-api-token",
        "IRONCLAD_SUBDOMAIN": "yourcompany",
        "IRONCLAD_API_VERSION": "v1"
      }
    }
  }
}
```

### Available operations

- `search_contracts` — search by party name, type, status, date range, or full text
- `get_contract` — retrieve full contract record including structured attributes and raw text
- `get_clause` — extract a specific clause type from a contract (e.g., limitation of liability, indemnification)
- `list_workflows` — list active workflows by type and status
- `trigger_workflow` — initiate a contract workflow (send for approval, send for signature)
- `compare_clause` — compare a clause against a playbook standard

### Example prompts

```
Search Ironclad for all SaaS subscription agreements with renewal clauses
expiring in Q3 2026. Return party name, contract value, auto-renewal notice
deadline, and current status. Flag any where the notice deadline is within
45 days.
```

```
Retrieve the limitation of liability clause from contract ID IC-2024-4421
and compare it against our standard playbook cap of 12 months fees. Flag
any deviation and draft proposed redline language to bring it back to
standard.
```

```
Find all vendor agreements where we accepted unlimited liability for data
breaches. List them by value, jurisdiction, and expiry date so I can
prioritize renegotiation.
```

```
Trigger the standard renewal workflow for contract IC-2024-0234 and
notify the assigned account manager that auto-renewal notice deadline
is in 30 days.
```

---

## Kira / Luminance (AI Contract Review)

### These are AI-native tools — how they complement Claude

Kira Systems (now part of Litera) and Luminance are machine learning platforms purpose-built for contract review. They are trained on millions of legal contracts and produce structured extracted data — clause locations, clause text, party names, dates, defined terms — as structured output.

The integration pattern is not native MCP as of May 2026. Neither Kira nor Luminance ships an MCP server. Instead, both platforms expose REST APIs that return structured JSON, and the integration with Claude is via an intermediary pattern:

1. **Kira or Luminance** extracts structured clause data from uploaded contracts (batch or single document)
2. A lightweight **bridge script** calls the Kira/Luminance API and formats the output as a tool response
3. **Claude** receives the structured extraction and performs the higher-order analysis: drafts the memo, compares against playbook, identifies risk, writes the executive summary

### Kira API bridge (custom MCP server pattern)

```bash
# Scaffold a custom MCP server to bridge Kira's REST API
npx @modelcontextprotocol/create-server kira-bridge
```

The bridge exposes two tools:

```json
{
  "tools": [
    {
      "name": "kira_extract",
      "description": "Submit a document to Kira for clause extraction and return structured results",
      "inputSchema": {
        "type": "object",
        "properties": {
          "document_url": { "type": "string" },
          "provision_types": {
            "type": "array",
            "items": { "type": "string" },
            "description": "e.g. ['limitation_of_liability', 'indemnification', 'governing_law']"
          }
        }
      }
    },
    {
      "name": "kira_batch_status",
      "description": "Check status of a Kira batch extraction job",
      "inputSchema": {
        "type": "object",
        "properties": {
          "job_id": { "type": "string" }
        }
      }
    }
  ]
}
```

Configure in `.claude/mcp.json`:

```json
{
  "mcpServers": {
    "kira": {
      "command": "node",
      "args": ["/path/to/kira-bridge/build/index.js"],
      "env": {
        "KIRA_API_KEY": "your-kira-api-key",
        "KIRA_BASE_URL": "https://api.kirasystems.com/v2",
        "KIRA_PROJECT_ID": "your-project-id"
      }
    }
  }
}
```

### Luminance pattern

Luminance's REST API follows the same pattern. The extraction response from Luminance includes both the clause text and Luminance's own risk classification, which Claude can use as a starting signal before applying its own analysis.

### When to use this pattern vs. native DMS

Use Kira/Luminance as the extraction layer when:
- You are reviewing large contract portfolios (50+ documents) where structured extraction is faster than Claude processing raw PDFs
- Your workflow requires auditable extraction records (Kira/Luminance logs every extraction)
- You need Kira/Luminance's pre-trained provision models for a specific contract type (e.g., real estate leases, IP assignments)

Use Claude directly on raw documents when:
- You have 1-10 contracts and the overhead of the extraction pipeline is not justified
- The contract type is unusual and the pre-trained models are unlikely to perform well
- You are doing free-form analysis that does not map to defined provision types

---

## FactSet / Bloomberg Law (Finance-Legal Crossover)

### What these provide

Financial-legal crossover use cases — KYC, sanctions screening, beneficial ownership lookup, SEC filing analysis, and regulatory change tracking — require data sources that sit at the intersection of legal and financial intelligence. FactSet and Bloomberg Law are the primary platforms here.

**FactSet MCP** exposes:
- Company data: legal entity identifiers, corporate structure, beneficial ownership chains
- Regulatory filings: SEC EDGAR (10-K, 10-Q, 8-K, proxy statements, S-1s)
- Sanctions and watchlists: OFAC SDN, EU consolidated list, UN sanctions
- ESG and regulatory ratings: third-party compliance scores
- Ownership data: institutional holdings, insider transactions

**Bloomberg Law** exposes:
- Legal news and docket monitoring
- Regulatory tracking (agency rulemaking, comment periods)
- Transactional precedents (deal terms database)
- Practical guidance and Bloomberg Law Analysis pieces

### FactSet MCP configuration

```bash
npm install -g @factset/factset-mcp
```

```json
{
  "mcpServers": {
    "factset": {
      "command": "npx",
      "args": ["-y", "@factset/factset-mcp"],
      "env": {
        "FACTSET_USERNAME": "your-factset-username",
        "FACTSET_API_KEY": "your-factset-api-key",
        "FACTSET_SCOPE": "company ownership sanctions filings",
        "FACTSET_ENVIRONMENT": "production"
      }
    }
  }
}
```

FactSet uses username + API key authentication. Generate an API key at [developer.factset.com](https://developer.factset.com). Note that FactSet's API products are licensed separately — confirm that your FactSet contract includes the data sets you intend to query (Ownership, EDGAR filings, and Watchlist screening are separate modules).

### Bloomberg Law MCP configuration

Bloomberg Law MCP is available to Bloomberg Terminal subscribers with the Law product enabled. Configure via the Bloomberg MCP gateway:

```json
{
  "mcpServers": {
    "bloomberg-law": {
      "command": "npx",
      "args": ["-y", "@bloomberg/blaw-mcp"],
      "env": {
        "BLAW_API_KEY": "your-bloomberg-law-api-key",
        "BLAW_CLIENT_ID": "your-client-id",
        "BLAW_BASE_URL": "https://api.blaw.com/v1"
      }
    }
  }
}
```

### Use cases

```
Look up the ultimate beneficial ownership structure for Meridian Holdings Ltd
(LEI: 254900...). Trace all entities with more than 10% ownership, identify
any individuals on OFAC SDN or EU consolidated watchlists, and flag any
jurisdictions with elevated FATF risk ratings.
```

```
Retrieve all 8-K filings for Acme Corp from the past 12 months from SEC EDGAR.
Summarize each material event disclosed, flag any litigation disclosures or
government investigation notices, and identify any changes to the company's
stated risk factors that relate to regulatory compliance.
```

```
Screen the attached list of 45 vendor names against OFAC SDN, EU consolidated
sanctions, and UK OFSI lists. Return matches with match confidence score,
matched list entry, and the basis for designation.
```

```
Track all CFPB rulemaking activity from January 2025 to present. List each
proposed rule, its comment period status, and summarize the primary industry
objections filed during public comment periods.
```

---

## Building a Legal Research Pipeline

### End-to-end example: arbitration clause risk memo

A partner asks: "Draft a risk memo on our arbitration clause under New York law for the Johnson matter."

This requires three data sources working together: current NY arbitration case law, the controlling statute text, and the client's actual arbitration clause from the DMS.

#### Step 1: CourtListener MCP — fetch NY arbitration cases

Claude calls `search_opinions` on CourtListener:
- Court: `ny` (New York Court of Appeals) and `ca2` (Second Circuit)
- Query: `arbitration clause enforcement CPLR 7501`
- Date range: 2020-01-01 to present
- Returns: 12 opinions with full text

#### Step 2: Westlaw MCP — pull NY CPLR §7501 and related regulations

Claude calls `get_statute` on the Westlaw MCP:
- Citation: `N.Y. C.P.L.R. §7501`
- Includes: annotated version with case citations
- Also retrieves: §7503 (application to compel arbitration), §7511 (vacating award)

#### Step 3: iManage MCP — retrieve client's current arbitration clause

Claude calls `search_documents` on iManage:
- Matter: Johnson (retrieved by matter number from the user's context)
- Document type: Agreement
- Full-text filter: `arbitration`
- Returns: the current executed services agreement containing the arbitration clause

#### Step 4: Claude drafts the memo

With all three sources retrieved, Claude drafts the memo — citing CourtListener and Westlaw sources inline, quoting the client's actual clause, and flagging the specific risk (e.g., the clause lacks a seat designation, which NY courts have treated as a defect in enforceability under current Court of Appeals precedent).

### CLAUDE.md configuration to wire all three MCPs

Add this to `.claude/CLAUDE.md` for a matter-specific project:

```markdown
# Matter: Johnson — Arbitration Research Project

## MCP configuration

This project connects to three data sources:
- **westlaw**: current NY statutes and case law
- **courtlistener**: public federal and NY state court opinions
- **imanage**: Johnson matter documents (matter ID: 2024-JOH-0112)

## Research workflow

When asked to research a legal issue for this matter:
1. Always pull the controlling statute from westlaw first
2. Retrieve relevant case law from both westlaw (for KeyCite signals) and courtlistener (for full opinion text)
3. Check iManage for any existing research memos or prior analysis before starting new research
4. Draft memos in IRAC structure: Issue, Rule, Application, Conclusion
5. Include citation signals (KeyCite/Shepard's) next to every case citation

## Privilege note

All documents retrieved from iManage are privileged. Do not include document content in any output that will be shared outside the firm.
```

### MCP configuration for the matter project

Create `.claude/mcp.json` in the matter project directory:

```json
{
  "mcpServers": {
    "westlaw": {
      "command": "npx",
      "args": ["-y", "@thomsonreuters/westlaw-mcp"],
      "env": {
        "TR_API_KEY": "${TR_API_KEY}",
        "TR_CLIENT_ID": "${TR_CLIENT_ID}",
        "TR_JURISDICTION": "NY",
        "TR_CONTENT_TYPES": "cases,statutes"
      }
    },
    "courtlistener": {
      "command": "npx",
      "args": ["-y", "@freelawproject/courtlistener-mcp"],
      "env": {
        "COURTLISTENER_API_TOKEN": "${COURTLISTENER_API_TOKEN}"
      }
    },
    "imanage": {
      "command": "npx",
      "args": ["-y", "@imanage/work-mcp"],
      "env": {
        "IMANAGE_HOST": "${IMANAGE_HOST}",
        "IMANAGE_CLIENT_ID": "${IMANAGE_CLIENT_ID}",
        "IMANAGE_CLIENT_SECRET": "${IMANAGE_CLIENT_SECRET}",
        "IMANAGE_LIBRARY": "ACTIVE",
        "IMANAGE_DEFAULT_MATTER": "2024-JOH-0112"
      }
    }
  }
}
```

Use environment variable references (`${VAR_NAME}`) rather than hardcoded secrets in committed config files. Inject values from a secrets manager or a `.env` file that is gitignored.

---

## Security and Privilege

### Attorney-client privilege

The most significant security constraint in legal MCP deployments is attorney-client privilege. Documents stored in iManage and NetDocuments are privileged work product. Routing them through a third-party cloud MCP server — even a vendor-supplied one — raises inadvertent disclosure risk: the transit could be argued as a waiver depending on jurisdiction and the server's terms of service.

**Rule:** For any MCP server that handles privileged matter documents, deploy self-hosted or on-premises. Do not use vendor-hosted cloud MCP endpoints for DMS connectors unless your firm's ethics counsel has reviewed the specific vendor terms and confirmed no privilege risk.

For iManage and NetDocuments connectors:

```bash
# Self-hosted deployment — run on firm infrastructure, not vendor cloud
docker run -d \
  --name imanage-mcp \
  --network internal \
  -e IMANAGE_HOST=https://work.yourfirm.com \
  -e IMANAGE_CLIENT_ID=$IMANAGE_CLIENT_ID \
  -e IMANAGE_CLIENT_SECRET=$IMANAGE_CLIENT_SECRET \
  -p 127.0.0.1:3100:3100 \
  firmregistry.yourfirm.com/imanage-mcp:latest
```

Point the Claude config to the internal host:

```json
{
  "mcpServers": {
    "imanage": {
      "type": "remote",
      "url": "http://127.0.0.1:3100/sse"
    }
  }
}
```

### Audit logging

Every MCP tool call should be logged with: timestamp, tool name, parameters (sanitized of PII where appropriate), response status, and the Claude session ID. Use a Stop hook to capture and archive the full conversation transcript after each session.

Add to `.claude/settings.json`:

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "/usr/local/bin/legal-audit-log.sh"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "mcp__",
        "hooks": [
          {
            "type": "command",
            "command": "/usr/local/bin/mcp-call-log.sh"
          }
        ]
      }
    ]
  }
}
```

`mcp-call-log.sh` receives the tool call details via stdin as JSON. Write the log entry to your firm's SIEM or append to a matter-specific audit file:

```bash
#!/bin/bash
# mcp-call-log.sh
# Logs every MCP call to a matter-specific audit file
# Receives tool call JSON on stdin

INPUT=$(cat)
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // "unknown"')
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // "unknown"')
MATTER_ID=$(echo "$INPUT" | jq -r '.tool_input.matter_id // "none"')

LOG_DIR="/var/log/claude-legal-audit"
LOG_FILE="$LOG_DIR/mcp-calls-$(date +%Y-%m-%d).jsonl"

mkdir -p "$LOG_DIR"
echo "{\"timestamp\":\"$TIMESTAMP\",\"session\":\"$SESSION_ID\",\"tool\":\"$TOOL_NAME\",\"matter\":\"$MATTER_ID\"}" >> "$LOG_FILE"
```

### Data residency

Before deploying any MCP server, confirm:

1. **Cloud provider region** — If your client data agreement specifies US-only data residency (common in government, healthcare, and financial services matters), verify that any SaaS MCP server or cloud-hosted DMS connector is running in a compliant region. Check vendor data processing agreements and sub-processor lists.

2. **Westlaw / LexisNexis API routing** — TR and LexisNexis route API calls through US-based infrastructure by default, but confirm if your matters involve non-US clients subject to GDPR, SCCs, or local data localization requirements. Sending EU client matter data through US API endpoints may require a legal basis under GDPR Chapter V.

3. **Log storage** — Audit logs written by the Stop and PreToolUse hooks must be stored in a location consistent with your firm's data retention policy. Do not write them to a personal laptop or a shared drive that lacks appropriate access controls.

4. **MCP server credentials** — API keys for Westlaw, LexisNexis, FactSet, and iManage are firm credentials, not personal credentials. Treat them as secrets: store in a firm-managed secrets manager (HashiCorp Vault, AWS Secrets Manager), rotate on a schedule, and revoke immediately upon attorney departure.

5. **Cross-matter contamination** — When running Claude across multiple matters in the same session, verify that iManage or NetDocuments search results do not surface documents from matters the user is not cleared to access. Configure MCP server scope at the matter level, not at the user level, where the DMS supports it.

---
