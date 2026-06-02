# Law Firm / Legal Practice Operations — Project Structure

> For attorneys and legal staff at a small to mid-size law firm managing matter intake, legal research, document drafting, billing, client communication, deadline tracking, and compliance — with attorney-client privilege enforced at every layer.

## Stack

- **Clio** — Matter management, contact database, time tracking, billing, trust accounting, client portal
- **Westlaw** or **LexisNexis** — Primary legal research, case law retrieval, statutory interpretation, KeyCite/Shepard's cite-checking
- **Microsoft 365** — Word (document drafting, redlining), Outlook (client/opposing counsel communications), Teams (internal collaboration)
- **NetDocuments** or **iManage** — Document management system (DMS); all matter files and privileged documents live here exclusively
- **DocuSign** — eSignature routing for executed agreements, engagement letters, settlement documents
- **QuickBooks** — Firm accounting, operating account reconciliation, accounts payable, payroll
- **Claude Code** — Document drafting, research memo templates, checklist generation, billing SOP documentation, non-privileged workflow automation

## Directory tree

```
legal-firm-workspace/
├── .claude/
│   ├── CLAUDE.md                                  # Privilege notices, stack, commands, conventions
│   ├── settings.json                              # MCP servers, hooks, tool permissions
│   └── commands/
│       ├── matter-intake.md                       # /matter-intake — generate new matter intake checklist and conflicts search prompt
│       ├── research-memo.md                       # /research-memo — scaffold a legal research memo with IRAC structure
│       ├── draft-contract.md                      # /draft-contract [type] — first-pass contract draft from matter type + key terms
│       ├── redline-review.md                      # /redline-review — flag missing clauses, one-sided terms, risk provisions
│       ├── billing-entry.md                       # /billing-entry — convert notes to ABA task-code-compliant time entries
│       ├── deadline-check.md                      # /deadline-check — surface statute of limitations and docket deadlines from matter notes
│       ├── cite-check.md                          # /cite-check — flag cases needing KeyCite or Shepard's verification
│       └── client-update.md                       # /client-update — draft a client status update letter (no privileged facts in prompt)
├── templates/
│   ├── contracts/
│   │   ├── nda-mutual.docx                        # Mutual NDA — bilateral confidentiality, standard 2-year term
│   │   ├── nda-one-way.docx                       # One-way NDA — disclosing party favored
│   │   ├── services-agreement.docx                # Master services agreement with SOW exhibit
│   │   ├── independent-contractor.docx            # IC agreement with IP assignment and non-solicitation
│   │   ├── asset-purchase.docx                    # Asset purchase agreement with schedules placeholder
│   │   └── settlement-agreement.docx              # Settlement and release — general and ADEA-compliant versions
│   ├── litigation-docs/
│   │   ├── complaint-template.docx                # Federal civil complaint — caption, jurisdiction, counts, prayer
│   │   ├── answer-template.docx                   # Answer with affirmative defenses
│   │   ├── motion-to-dismiss.docx                 # 12(b)(6) motion shell — argument sections labeled
│   │   ├── summary-judgment-motion.docx           # MSJ with statement of undisputed facts format
│   │   ├── discovery-requests/
│   │   │   ├── interrogatories-plaintiff.docx     # Standard plaintiff interrogatories, 25 RFAs
│   │   │   ├── interrogatories-defendant.docx     # Standard defendant interrogatories
│   │   │   ├── rfp-plaintiff.docx                 # Requests for production — plaintiff set
│   │   │   └── rfp-defendant.docx                 # Requests for production — defendant set
│   │   └── deposition-notice.docx                 # Notice of deposition with duces tecum exhibit
│   ├── corporate/
│   │   ├── articles-of-incorporation.docx         # Delaware C-corp articles shell
│   │   ├── bylaws-corporation.docx                # Corporate bylaws — standard provisions
│   │   ├── llc-operating-agreement.docx           # Single-member and multi-member LLC OA variants
│   │   ├── board-consent.docx                     # Written consent in lieu of meeting — board action
│   │   ├── shareholder-consent.docx               # Written consent — stockholder action
│   │   └── stock-purchase-agreement.docx          # Series seed / angel round SPA with representations
│   ├── employment/
│   │   ├── offer-letter-exempt.docx               # FLSA-exempt offer letter with at-will clause
│   │   ├── offer-letter-nonexempt.docx            # Non-exempt offer letter with overtime notice
│   │   ├── separation-agreement.docx              # Severance and release — 21-day consideration period
│   │   ├── noncompete-agreement.docx              # State-law-specific noncompete (flag jurisdiction)
│   │   └── employee-handbook-shell.docx           # Policy sections: PTO, harassment, code of conduct
│   └── real-estate/
│       ├── purchase-agreement-residential.docx    # Residential PSA with contingency paragraphs
│       ├── purchase-agreement-commercial.docx     # Commercial PSA with due diligence period
│       ├── lease-commercial.docx                  # NNN commercial lease — landlord-favored
│       ├── lease-residential.docx                 # Residential lease — jurisdiction-agnostic shell
│       └── closing-checklist.docx                 # Real estate closing checklist with title/escrow steps
├── research/
│   ├── memo-template.md                           # IRAC memo format: Issue, Rule, Analysis, Conclusion
│   ├── case-law-notes/
│   │   ├── _index.md                              # Running index of cited cases by topic
│   │   ├── contracts/                             # Contract law case summaries and holdings
│   │   ├── employment/                            # Employment law case notes
│   │   ├── corporate/                             # Corporate governance case law
│   │   └── litigation/                            # Procedural and evidence case notes
│   └── regulatory-summaries/
│       ├── state-noncompete-map.md                # State-by-state enforceability chart (last updated date required)
│       ├── data-privacy-overview.md               # CCPA, state law landscape — no client specifics
│       └── bar-admission-rules.md                 # Pro hac vice requirements by jurisdiction
├── checklists/
│   ├── matter-opening.md                          # New matter: conflicts check, engagement letter, retainer, Clio setup
│   ├── conflicts-check.md                         # Step-by-step conflicts search across Clio + lateral hire disclosures
│   ├── due-diligence.md                           # M&A / transaction due diligence — organizational, IP, litigation, contracts
│   ├── closing.md                                 # Transaction closing checklist — pre-closing, closing day, post-closing
│   ├── litigation-hold.md                         # Litigation hold notice steps and document preservation requirements
│   └── matter-closing.md                          # File closing: final billing, executed docs to DMS, file retention notice
├── billing/
│   ├── time-entry-sops.md                         # ABA task codes, UTBMS codes, narrative guidelines, minimum increments
│   ├── invoice-review-checklist.md                # Pre-bill review: write-offs, rate verification, narrative quality, trust
│   ├── rate-schedule.md                           # Timekeeper rates by role (partner, associate, paralegal, clerk)
│   └── trust-accounting-quick-ref.md              # IOLTA deposit/disbursement rules, three-way reconciliation reminder
├── compliance/
│   ├── bar-requirements.md                        # CLE credits, annual registration deadlines by jurisdiction
│   ├── trust-accounting-sop.md                    # Full IOLTA SOP: deposit rules, disbursement, reconciliation, audit trail
│   ├── malpractice-checklist.md                   # Engagement scope, diarizing deadlines, conflicts, file retention
│   ├── conflicts-policy.md                        # Firm conflicts policy: lateral, prospective client, imputed disqualification
│   └── data-security-policy.md                    # Password policy, DMS access controls, breach response steps
└── marketing/
    ├── bio-templates.md                           # Attorney bio format: education, bar admissions, practice areas, publications
    ├── practice-area-descriptions.md              # Web-ready practice area blurbs — review for advertising rule compliance
    └── client-alert-template.md                  # Legislative/regulatory update alert format for client distribution
```

## Key files explained

| Path | Purpose |
|---|---|
| `.claude/CLAUDE.md` | Privilege notice, stack overview, command index, confidentiality rules — read before every session |
| `.claude/commands/matter-intake.md` | Generates the full new-matter checklist: conflicts search steps, engagement letter trigger, Clio matter setup, retainer collection |
| `.claude/commands/billing-entry.md` | Converts raw time notes to ABA task-code-compliant narratives; enforces firm minimum increment and narrative quality rules |
| `checklists/matter-opening.md` | Authoritative step-by-step matter opening procedure — conflicts, engagement letter, retainer, DMS folder creation |
| `checklists/conflicts-check.md` | Structured conflicts search protocol covering Clio database, adverse parties, lateral hire screens |
| `billing/time-entry-sops.md` | UTBMS/ABA task codes, minimum billing increment, narrative dos and don'ts — the billing style guide |
| `compliance/trust-accounting-sop.md` | Full IOLTA SOP: what goes in trust, disbursement controls, three-way reconciliation, state bar audit readiness |
| `research/memo-template.md` | IRAC-structured legal research memo shell — enforces cite-checking reminder before finalizing |
| `templates/litigation-docs/complaint-template.docx` | Federal civil complaint shell with caption, jurisdictional allegations, causes of action, and prayer for relief |
| `compliance/malpractice-checklist.md` | Pre-matter and ongoing malpractice risk controls: scope documentation, deadline diarizing, conflicts refresh, file retention |

## Quick scaffold

```bash
# Create the workspace root
mkdir -p legal-firm-workspace && cd legal-firm-workspace

# .claude directory and commands
mkdir -p .claude/commands

# Templates by matter type
mkdir -p templates/contracts
mkdir -p templates/litigation-docs/discovery-requests
mkdir -p templates/corporate
mkdir -p templates/employment
mkdir -p templates/real-estate

# Research
mkdir -p research/case-law-notes/contracts
mkdir -p research/case-law-notes/employment
mkdir -p research/case-law-notes/corporate
mkdir -p research/case-law-notes/litigation
mkdir -p research/regulatory-summaries

# Checklists
mkdir -p checklists

# Billing
mkdir -p billing

# Compliance
mkdir -p compliance

# Marketing
mkdir -p marketing

# Scaffold key markdown files
touch checklists/matter-opening.md
touch checklists/conflicts-check.md
touch checklists/due-diligence.md
touch checklists/closing.md
touch checklists/litigation-hold.md
touch checklists/matter-closing.md

touch billing/time-entry-sops.md
touch billing/invoice-review-checklist.md
touch billing/rate-schedule.md
touch billing/trust-accounting-quick-ref.md

touch compliance/bar-requirements.md
touch compliance/trust-accounting-sop.md
touch compliance/malpractice-checklist.md
touch compliance/conflicts-policy.md
touch compliance/data-security-policy.md

touch research/memo-template.md
touch research/case-law-notes/_index.md
touch research/regulatory-summaries/state-noncompete-map.md
touch research/regulatory-summaries/data-privacy-overview.md
touch research/regulatory-summaries/bar-admission-rules.md

touch marketing/bio-templates.md
touch marketing/practice-area-descriptions.md
touch marketing/client-alert-template.md

# .claude commands
touch .claude/commands/matter-intake.md
touch .claude/commands/research-memo.md
touch .claude/commands/draft-contract.md
touch .claude/commands/redline-review.md
touch .claude/commands/billing-entry.md
touch .claude/commands/deadline-check.md
touch .claude/commands/cite-check.md
touch .claude/commands/client-update.md

# Install relevant Claudient skills
npx claudient add skill productivity/doc-site-builder
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/vendor-evaluator

echo "Scaffold complete. Populate CLAUDE.md before first use."
```

## CLAUDE.md template

```markdown
# Law Firm / Legal Practice Operations — Workspace

## ATTORNEY-CLIENT PRIVILEGE AND CONFIDENTIALITY NOTICE

**This workspace contains NO client matter details, case facts, or privileged communications.**

All matter files, client documents, correspondence, research memos tied to active matters,
and any content protected by attorney-client privilege or work product doctrine are stored
exclusively in the firm's Document Management System (DMS):
- NetDocuments: https://vault.netdocuments.com
- iManage: https://app.imanage.com

Do NOT paste client names, matter numbers tied to real cases, opposing party names, case
facts, settlement figures, or any privileged content into Claude Code prompts. This workspace
is for templates, SOPs, checklists, and non-matter-specific content only.

When in doubt: if it would appear in a privilege log, it does not belong here.

---

## What This Workspace Is

A non-privileged operations workspace for the firm. Attorneys and staff use this to:
- Draft and maintain document templates (contracts, litigation shells, corporate forms)
- Run billing and time-entry workflows using ABA task codes
- Manage compliance deadlines (CLE, IOLTA reconciliation, malpractice checklist)
- Produce research memo scaffolds (IRAC structure, cite-check reminders)
- Maintain firm marketing content (bios, practice area descriptions)

All commands operate on templates and SOPs — never on live client data.

---

## Stack

- **Clio** — Matter management, time tracking, billing, trust accounting, client portal
- **Westlaw / LexisNexis** — Legal research; all cited cases must be KeyCited or Shepardized before use
- **Microsoft 365** — Word (drafting/redlines), Outlook (client comms), Teams (internal)
- **NetDocuments / iManage** — DMS; all privileged matter files stored here
- **DocuSign** — Executed agreement routing and storage
- **QuickBooks** — Firm operating account, payroll, AP

---

## Slash Commands

| Command | What it does |
|---|---|
| `/matter-intake` | Generates new matter checklist: conflicts, engagement letter, retainer, Clio setup |
| `/research-memo` | Scaffolds IRAC memo with cite-check reminder and source placeholder |
| `/draft-contract [type]` | First-pass contract draft from type (NDA, MSA, OA, PSA) + key terms |
| `/redline-review` | Reviews pasted contract language for missing clauses and one-sided terms |
| `/billing-entry` | Converts raw time notes to ABA/UTBMS-compliant narrative entries |
| `/deadline-check` | Surfaces statute of limitations, response deadlines, and docket dates from notes |
| `/cite-check` | Flags cases in a memo that require KeyCite or Shepard's verification |
| `/client-update` | Drafts a client status update letter — no privileged matter facts in the prompt |

---

## Cite-Checking Requirement

Any legal research memo or brief section produced by Claude Code is a FIRST DRAFT only.
Every case citation must be verified in Westlaw KeyCite or LexisNexis Shepard's before
the document leaves the firm. Claude Code does not have live access to case law databases
and cannot confirm whether a case has been overruled, distinguished, or limited.

Add this footer to every research output: "DRAFT — ALL CITATIONS REQUIRE KEYCITE/SHEPARD'S VERIFICATION BEFORE USE"

---

## Billing Conventions

- Minimum billing increment: 0.1 hours (6 minutes)
- Use UTBMS task codes: L100–L500 for litigation; A100–A300 for corporate/transactional
- Time entry narratives must describe the work performed, not just the task category
- Trust account entries require matter number and client authorization reference
- Pre-bill review: run `/billing-entry` output through invoice-review-checklist.md before sending

---

## Conflicts Check Protocol

Before opening any new matter, run a conflicts check against:
1. Clio contacts database (client name, opposing party, related entities)
2. Lateral hire disclosure list (maintained by office manager)
3. Prospective client intake log

Document the conflicts check result in Clio before the engagement letter is sent.
See checklists/conflicts-check.md for the full procedure.

---

## File Retention and Matter Closing

Closed matter files are retained per the firm's retention schedule (see compliance/malpractice-checklist.md).
Physical and electronic files move to the DMS archive folder on matter close.
Do not store closed matter documents in this workspace.
```

## MCP servers

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-filesystem", "/Users/shared/legal-firm-workspace"],
      "comment": "Scoped to workspace root only — no access to DMS mount points or client file shares"
    },
    "microsoft-365": {
      "command": "npx",
      "args": ["-y", "@microsoft/mcp-server-msgraph"],
      "env": {
        "TENANT_ID": "${M365_TENANT_ID}",
        "CLIENT_ID": "${M365_CLIENT_ID}",
        "CLIENT_SECRET": "${M365_CLIENT_SECRET}"
      },
      "comment": "Access to Teams channels, Outlook drafts, SharePoint template library — scoped to firm tenant"
    },
    "clio": {
      "command": "npx",
      "args": ["-y", "@clio/mcp-server"],
      "env": {
        "CLIO_CLIENT_ID": "${CLIO_CLIENT_ID}",
        "CLIO_CLIENT_SECRET": "${CLIO_CLIENT_SECRET}",
        "CLIO_REGION": "us"
      },
      "comment": "Read-only access to matter list, contact database, and time entry codes — no write access to trust accounts"
    },
    "docusign": {
      "command": "npx",
      "args": ["-y", "@docusign/mcp-server"],
      "env": {
        "DOCUSIGN_ACCOUNT_ID": "${DOCUSIGN_ACCOUNT_ID}",
        "DOCUSIGN_INTEGRATION_KEY": "${DOCUSIGN_INTEGRATION_KEY}",
        "DOCUSIGN_BASE_URL": "https://na3.docusign.net/restapi"
      },
      "comment": "Envelope status lookup and template retrieval only — no send capability from Claude Code"
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
            "command": "grep -i 'privilege\\|confidential\\|attorney.client\\|work product' \"$CLAUDE_TOOL_OUTPUT_PATH\" && echo '[WARN] Possible privileged content detected in written file — review before saving' || true",
            "comment": "Scan any file written by Claude Code for privilege keywords and surface a warning"
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
            "command": "echo '[CHECK] Writing to: '\"$CLAUDE_TOOL_INPUT_PATH\"' — confirm this is a template or SOP file, not a matter document'",
            "comment": "Log every file write with a reminder to confirm it is non-privileged content"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "echo '[REMINDER] End of session — any drafted research memos require cite verification in Westlaw KeyCite or LexisNexis Shepards before use'",
            "comment": "Surfaces the cite-check reminder at the end of every Claude Code session"
          }
        ]
      }
    ]
  }
}
```

## Skills to install

```bash
# Document and process workflows
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/doc-site-builder
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/vendor-evaluator

# Research and analysis
npx claudient add skill productivity/exec-briefing

# Client and business development
npx claudient add skill productivity/comp-benchmarker
npx claudient add skill productivity/investor-update

# Billing and time management
npx claudient add skill productivity/engineering-strategy
```

## Related

- [Legal & Compliance Workspace guide](../structures/legal-compliance-workspace.md)
- [Operations Manager Workspace](../structures/operations-manager-workspace.md)
- [Finance Analyst Workspace](../structures/finance-analyst-workspace.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
