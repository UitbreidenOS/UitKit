# Legal & Compliance Workspace — Project Structure

> For in-house counsel or compliance officers managing contract review, regulatory tracking, GDPR/privacy compliance, vendor due diligence, and policy drafting across Clio, Ironclad, Westlaw, DocuSign, and Microsoft 365.

## Stack

- **Clio** or **Ironclad** — Matter management, contract lifecycle, redline tracking, signature routing
- **Westlaw** or **LexisNexis** — Primary legal research, case law retrieval, regulatory guidance
- **DocuSign** — eSignature routing, envelope tracking, executed agreement storage
- **Microsoft 365** — Word (redlines), Outlook (external counsel), Teams (legal channel), SharePoint (doc management)
- **Notion** — Policy documentation, compliance calendars, internal legal wiki
- **Slack** — Internal legal request intake, deal team collaboration, compliance alerts
- **Claude Code** — Contract review, NDA redlining, GDPR gap analysis, vendor diligence, policy drafting, legal research memos

## Directory tree

```
legal-compliance-workspace/
├── .claude/
│   ├── CLAUDE.md                              # Workspace instructions (paste the template below)
│   ├── settings.json                          # MCP servers, hooks, permissions
│   └── commands/
│       ├── contract-review.md                 # /contract-review [type] — redline, risk flags, missing clauses
│       ├── nda-review.md                      # /nda-review — mutual vs. one-way NDA analysis and redlines
│       ├── gdpr-check.md                      # /gdpr-check — GDPR/CCPA gap analysis on a document or process
│       ├── vendor-diligence.md                # /vendor-diligence — vendor contract + security questionnaire review
│       ├── policy-draft.md                    # /policy-draft — draft or update a named company policy
│       ├── legal-research.md                  # /legal-research — produce a legal memo from Westlaw sources
│       └── compliance-audit.md                # /compliance-audit — run a structured audit checklist (SOC2, ISO, GDPR)
├── contracts/
│   ├── templates/
│   │   ├── nda/
│   │   │   ├── mutual-nda-template.docx       # Standard mutual NDA — company-paper, preferred terms
│   │   │   ├── one-way-nda-template.docx      # One-way NDA for vendors disclosing to company
│   │   │   └── nda-fallback-positions.md      # Redline fallback positions: what to concede and what to hold
│   │   ├── msa/
│   │   │   ├── msa-customer-paper.docx        # Master Services Agreement — company as customer
│   │   │   ├── msa-vendor-paper.docx          # MSA — company as vendor/supplier
│   │   │   └── msa-redline-guide.md           # Clause-by-clause redline strategy and fallback positions
│   │   ├── sow/
│   │   │   ├── sow-template.docx              # Statement of Work — services, deliverables, milestones, fees
│   │   │   └── sow-fixed-fee-template.docx    # Fixed-fee SOW variant
│   │   ├── employment/
│   │   │   ├── offer-letter-template.docx     # Standard offer letter — at-will, equity, benefits
│   │   │   ├── contractor-agreement.docx      # Independent contractor agreement — IP assignment, CIIA
│   │   │   └── severance-template.docx        # Severance and release agreement
│   │   └── vendor/
│   │       ├── vendor-dpa-template.docx       # Data Processing Agreement — GDPR Article 28 compliant
│   │       ├── vendor-msa-template.docx       # Vendor MSA with indemnity, liability cap, termination
│   │       └── vendor-security-addendum.docx  # Security and privacy addendum for data-sharing vendors
│   └── executed/
│       ├── ndas/
│       │   └── .gitkeep                       # Executed NDAs by counterparty name + date
│       ├── msas/
│       │   └── .gitkeep                       # Executed MSAs — customer and vendor
│       └── dpas/
│           └── .gitkeep                       # Executed DPAs — one per data-processing vendor
├── active-matters/
│   ├── _template/
│   │   ├── matter-summary.md                  # Matter name, type, open date, lead counsel, status
│   │   ├── timeline.md                        # Chronological event log — dates, actions, parties
│   │   ├── docs/
│   │   │   └── .gitkeep                       # Matter documents — pleadings, correspondence, evidence
│   │   └── research/
│   │       └── .gitkeep                       # Research memos specific to this matter
│   ├── employment-dispute-2026/
│   │   ├── matter-summary.md
│   │   ├── timeline.md
│   │   ├── docs/
│   │   │   ├── demand-letter-2026-03-15.pdf
│   │   │   ├── company-response-2026-03-28.pdf
│   │   │   └── mediation-brief-2026-05-01.docx
│   │   └── research/
│   │       ├── wrongful-termination-memo.md
│   │       └── at-will-exceptions-analysis.md
│   └── ip-ownership-review/
│       ├── matter-summary.md
│       ├── timeline.md
│       ├── docs/
│       │   └── contractor-ciia-review.docx
│       └── research/
│           └── work-for-hire-doctrine.md
├── compliance/
│   ├── regulatory-calendar.md                 # All regulatory deadlines — GDPR, CCPA, SOC2, ISO — with owners
│   ├── gdpr/
│   │   ├── ropa.md                            # Record of Processing Activities — Article 30 register
│   │   ├── data-subjects-register.md          # Active DSARs and response log (30-day deadlines tracked)
│   │   ├── dpia-log.md                        # Data Protection Impact Assessments — one row per project
│   │   ├── breach-register.md                 # Incident log — date, scope, DPA notification status
│   │   ├── transfer-mechanisms.md             # SCCs, adequacy decisions, BCRs in use per transfer route
│   │   └── consent-records/
│   │       └── .gitkeep                       # Consent capture records by product feature
│   ├── soc2/
│   │   ├── evidence-tracker.md                # SOC2 Type II evidence map — control, owner, evidence, status
│   │   ├── controls-matrix.md                 # Full CC/A/P/C/PI control set with implementation notes
│   │   ├── audit-log.md                       # Auditor interactions, samples requested, responses sent
│   │   └── evidence/
│   │       ├── access-reviews/
│   │       │   └── .gitkeep                   # Quarterly access review exports
│   │       └── vendor-reviews/
│   │           └── .gitkeep                   # Annual vendor security review reports
│   └── iso27001/
│       ├── isms-scope.md                      # ISMS scope statement and applicability
│       ├── risk-register.md                   # Information security risk register — risk, rating, treatment
│       └── statement-of-applicability.md      # SOA — control, in-scope, implementation status
├── policies/
│   ├── data-classification-policy.md          # Data classification tiers — public, internal, confidential, restricted
│   ├── privacy-policy.md                      # External-facing privacy policy — GDPR/CCPA compliant
│   ├── acceptable-use-policy.md               # AUP — employee use of company systems and data
│   ├── information-security-policy.md         # ISP — controls, incident response, access management
│   ├── ai-use-policy.md                       # Approved AI tools, prohibited uses, data handling rules
│   ├── ethics-code.md                         # Code of conduct — conflicts of interest, gifts, whistleblower
│   ├── records-retention-policy.md            # Retention schedule by record type — legal holds procedure
│   └── changelog.md                           # Policy revision history — version, date, author, summary of changes
├── research/
│   ├── _template-memo.md                      # Standard legal memo format — issue, rule, analysis, conclusion
│   ├── regulatory-guidance/
│   │   ├── gdpr-enforcement-tracker.md        # DPA enforcement actions and fines — running log
│   │   ├── ccpa-amendments-summary.md         # CPRA and subsequent CCPA amendments and effective dates
│   │   └── ai-regulation-watch.md             # EU AI Act, US EO on AI, NIST AI RMF — status tracker
│   └── memos/
│       ├── 2026-05-open-source-license-risk.md
│       └── 2026-04-employee-monitoring-limits.md
└── ip/
    ├── trademark/
    │   ├── trademark-register.md              # All marks — word, logo, classes, jurisdiction, renewal dates
    │   └── filings/
    │       └── .gitkeep                       # USPTO/EUIPO filing receipts and office actions
    ├── patents/
    │   ├── patent-register.md                 # Patent portfolio — application #, status, jurisdiction, expiry
    │   └── .gitkeep
    └── oss-license-log.md                     # Open-source component inventory — license type, obligations, risk rating
```

## Key files explained

| Path | Purpose |
|---|---|
| `.claude/commands/contract-review.md` | Slash command that takes a contract type (NDA, MSA, SOW, DPA, employment) and contract text, then returns risk-flagged redlines, missing standard clauses, and a risk summary organized by severity |
| `.claude/commands/gdpr-check.md` | Slash command that runs a structured GDPR/CCPA gap analysis on a document, process description, or product feature — outputs gaps mapped to specific articles with recommended remediation |
| `.claude/commands/vendor-diligence.md` | Slash command for vendor contract review — checks DPA adequacy, liability caps, indemnity, data deletion, audit rights, and subprocessor disclosure against internal standards |
| `.claude/commands/compliance-audit.md` | Slash command that runs a structured checklist audit (SOC2 CC, GDPR Chapter IV, ISO 27001 Annex A) and outputs a gap report with control owners and evidence requirements |
| `compliance/gdpr/ropa.md` | Article 30 Record of Processing Activities — required under GDPR — tracks each processing activity, purpose, legal basis, data categories, recipients, and retention period |
| `compliance/soc2/evidence-tracker.md` | Maps each SOC2 control to the evidence artifact, owner, collection frequency, and audit status — the master tracker used during Type II audit fieldwork |
| `contracts/templates/vendor/vendor-dpa-template.docx` | Company-paper DPA for use with all data-processing vendors — GDPR Article 28 compliant, includes SCCs as an annex for cross-border transfers |
| `policies/changelog.md` | Revision history for all policies in policies/ — required for ISO 27001 document control and SOC2 policy review evidence |

## Quick scaffold

```bash
# Create workspace root
mkdir -p legal-compliance-workspace

# Create .claude structure
mkdir -p legal-compliance-workspace/.claude/commands

# Create contracts directory tree
mkdir -p legal-compliance-workspace/contracts/templates/nda
mkdir -p legal-compliance-workspace/contracts/templates/msa
mkdir -p legal-compliance-workspace/contracts/templates/sow
mkdir -p legal-compliance-workspace/contracts/templates/employment
mkdir -p legal-compliance-workspace/contracts/templates/vendor
mkdir -p legal-compliance-workspace/contracts/executed/ndas
mkdir -p legal-compliance-workspace/contracts/executed/msas
mkdir -p legal-compliance-workspace/contracts/executed/dpas

# Create active-matters template
mkdir -p legal-compliance-workspace/active-matters/_template/docs
mkdir -p legal-compliance-workspace/active-matters/_template/research

# Create compliance directories
mkdir -p legal-compliance-workspace/compliance/gdpr/consent-records
mkdir -p legal-compliance-workspace/compliance/soc2/evidence/access-reviews
mkdir -p legal-compliance-workspace/compliance/soc2/evidence/vendor-reviews
mkdir -p legal-compliance-workspace/compliance/iso27001

# Create policies, research, and IP directories
mkdir -p legal-compliance-workspace/policies
mkdir -p legal-compliance-workspace/research/regulatory-guidance
mkdir -p legal-compliance-workspace/research/memos
mkdir -p legal-compliance-workspace/ip/trademark/filings
mkdir -p legal-compliance-workspace/ip/patents

# Seed .gitkeep placeholders
touch legal-compliance-workspace/contracts/executed/ndas/.gitkeep
touch legal-compliance-workspace/contracts/executed/msas/.gitkeep
touch legal-compliance-workspace/contracts/executed/dpas/.gitkeep
touch legal-compliance-workspace/active-matters/_template/docs/.gitkeep
touch legal-compliance-workspace/active-matters/_template/research/.gitkeep
touch legal-compliance-workspace/compliance/gdpr/consent-records/.gitkeep
touch legal-compliance-workspace/compliance/soc2/evidence/access-reviews/.gitkeep
touch legal-compliance-workspace/compliance/soc2/evidence/vendor-reviews/.gitkeep
touch legal-compliance-workspace/ip/trademark/filings/.gitkeep
touch legal-compliance-workspace/ip/patents/.gitkeep

# Install legal skills
npx claudient add skill legal/contract-review
npx claudient add skill legal/nda-review
npx claudient add skill legal/gdpr-expert
npx claudient add skill legal/compliance-tracker
npx claudient add skill legal/vendor-contract-review
npx claudient add skill legal/brief-section-drafter
npx claudient add skill legal/soc2-compliance
npx claudient add skill legal/legal-research

# Copy command stubs into .claude/commands/
npx claudient add skill legal/contract-review --output legal-compliance-workspace/.claude/commands/contract-review.md
npx claudient add skill legal/nda-review --output legal-compliance-workspace/.claude/commands/nda-review.md
npx claudient add skill legal/gdpr-expert --output legal-compliance-workspace/.claude/commands/gdpr-check.md
npx claudient add skill legal/vendor-contract-review --output legal-compliance-workspace/.claude/commands/vendor-diligence.md
npx claudient add skill legal/soc2-compliance --output legal-compliance-workspace/.claude/commands/compliance-audit.md
npx claudient add skill legal/legal-research --output legal-compliance-workspace/.claude/commands/legal-research.md
```

## CLAUDE.md template

```markdown
# Legal & Compliance Workspace — Claude Code Instructions

## What this is

This workspace is the working directory for in-house counsel and compliance officers.
Contracts are organized by type in contracts/, active legal matters in active-matters/,
regulatory compliance records in compliance/, company policies in policies/, and legal
research memos in research/. All contract review, GDPR analysis, vendor diligence, and
policy drafting happens through Claude Code skills.

## Stack

- Clio / Ironclad — Matter management and contract lifecycle (sync exports to active-matters/)
- Westlaw / LexisNexis — Primary legal research; cite sources in research/memos/ using full citation
- DocuSign — eSignature routing; log envelope IDs in the relevant contract folder
- Microsoft 365 Word — Redlines and tracked changes; save final versions as .docx in contracts/
- Notion — Policy wiki; keep policies/ in sync with Notion as the authoritative source
- Slack — Internal legal request intake via #legal-requests channel

## Common tasks and exact commands

### Review an inbound contract
```
/contract-review [type: NDA | MSA | SOW | DPA | employment | vendor]

Contract text:
[paste full contract or key sections]

Context:
- Counterparty: [name and role — customer, vendor, partner, employee]
- Our paper or their paper: [specify]
- Deal size / risk level: [approximate ARR or contract value]
- Any known issues flagged by business: [optional]
```

### Redline an NDA
```
/nda-review

NDA text:
[paste full NDA]

Type: [mutual | one-way (we disclose) | one-way (they disclose)]
Counterparty: [name]
Purpose of disclosure: [what is being shared and why]
Any non-standard requests from counterparty: [optional]
```

### Run a GDPR/CCPA gap analysis
```
/gdpr-check

Subject: [document | process | product feature | vendor]

Content:
[paste document text, process description, or feature spec]

Jurisdiction focus: [GDPR | CCPA | both]
Data types involved: [personal data categories — e.g., health, financial, behavioral]
```

### Review a vendor contract and DPA
```
/vendor-diligence

Vendor: [name and service description]
Contract type: [MSA | SaaS subscription | DPA | security addendum]

Contract text:
[paste contract or key sections]

Vendor processes personal data: [yes | no]
Data categories: [list if yes]
Sub-processors disclosed: [yes | no | unknown]
```

### Draft or update a company policy
```
/policy-draft

Policy: [data classification | acceptable use | privacy | AI use | records retention | ethics]
Action: [draft from scratch | update existing | add section]

Context:
[paste existing policy if updating, or describe what the policy must address]

Trigger: [what regulatory requirement or incident prompted this update]
```

### Write a legal research memo
```
/legal-research

Issue: [precise legal question]
Jurisdiction: [US federal | California | EU | specific state or country]
Context: [the factual scenario — 2-3 sentences]
Urgency: [standard | expedited]
Output format: [IRAC memo | summary bullet points | regulation comparison table]
```

### Run a structured compliance audit
```
/compliance-audit

Framework: [SOC2 Type II | GDPR Chapter IV | ISO 27001 Annex A | CCPA]
Scope: [full | specific controls — list control IDs]
Evidence available: [describe what records, exports, and logs are on hand]
Audit date or period: [date or date range]
```

## Conventions to follow

- Every active matter must have matter-summary.md and timeline.md before adding any docs
- All redlines are saved as YYYY-MM-DD-counterparty-[type]-redline.docx in the contracts folder
- GDPR's ropa.md is the Article 30 register — update it whenever a new processing activity is approved
- DSARs logged in gdpr/data-subjects-register.md have a hard 30-day response deadline — flag at intake
- SOC2 evidence-tracker.md is updated at the start of each audit fieldwork cycle — never overwrite history
- Policy changelog.md is updated every time any policy in policies/ is revised — version + date required
- Legal research memos in research/memos/ follow IRAC format and include full Westlaw/LexisNexis citations
- Executed contracts go into contracts/executed/ — never leave them in active-matters/ permanently
- IP trademark-register.md renewal dates are reviewed quarterly — flag renewals due within 90 days
- OSS license obligations in ip/oss-license-log.md are reviewed before any new open-source component ships
```

## MCP servers

```json
{
  "mcpServers": {
    "westlaw": {
      "command": "npx",
      "args": ["-y", "@thomsonreuters/westlaw-mcp-server"],
      "env": {
        "WESTLAW_API_KEY": "your-westlaw-api-key",
        "WESTLAW_CLIENT_ID": "your-client-id",
        "WESTLAW_BASE_URL": "https://api.westlaw.com/v1"
      }
    },
    "slack": {
      "command": "npx",
      "args": ["-y", "@slack/mcp-server"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-slack-bot-token",
        "SLACK_TEAM_ID": "T0XXXXXXXXX"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic-ai/mcp-server-filesystem",
        "/Users/your-username/legal-compliance-workspace"
      ]
    }
  }
}
```

## Recommended hooks

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_FILE_PATH\" | grep -q \"ropa.md\"; then echo \"[hook] ROPA updated — verify the new processing activity has a legal basis entry and a retention period before closing\"; fi'"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_FILE_PATH\" | grep -q \"policies/\"; then echo \"[hook] Policy file written — update policies/changelog.md with version, date, and summary of changes\"; fi'"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_FILE_PATH\" | grep -q \"breach-register.md\"; then echo \"[hook] CAUTION — writing to breach register. Confirm whether 72-hour DPA notification window applies before saving.\"; fi'"
          }
        ]
      }
    ]
  }
}
```

## Skills to install

```bash
# Core legal skills
npx claudient add skill legal/contract-review
npx claudient add skill legal/nda-review
npx claudient add skill legal/gdpr-expert
npx claudient add skill legal/compliance-tracker
npx claudient add skill legal/vendor-contract-review
npx claudient add skill legal/brief-section-drafter
npx claudient add skill legal/soc2-compliance
npx claudient add skill legal/legal-research

# Install all legal skills at once
npx claudient add skills legal
```

## Related

- [Legal & Compliance guide](../guides/for-legal-compliance.md)
- [Contract review workflow](../workflows/contract-review-cycle.md)
- [GDPR compliance workflow](../workflows/gdpr-compliance.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
