# Legal Operations Stack

> Intelligent contract management, compliance automation, and legal workflow optimization with audit trails on every document action.

---

## Quick Start

1. **Copy this folder** into your Claude Code workspace or project root.
2. **Add MCP servers** — Configure document extraction tools in `settings.json` for contract parsing and compliance analysis.
3. **Add hooks** — Copy each `.sh` script from `hooks/` into `.claude/hooks/`, make them executable, and add settings.json entries.
4. **Run `/contract-review [contract-url-or-file]`** — Analyze contract for risks, obligations, and compliance gaps.
5. **Run `/compliance-check [document-type]`** — Validate document against regulatory requirements.
6. **Run `/deadline-tracker`** — Surface upcoming contract renewals, notice periods, and key dates.

---

## What's Inside

| File/Folder | Type | Purpose |
|---|---|---|
| `CLAUDE.md` | Config | Workspace rules, compliance frameworks, legal workflows, and approval gates. Start here. |
| `session-log.md` | Log | Auto-updated: contracts reviewed, risks flagged, compliance checks, deadlines tracked. |
| `skills/` | Directory | 6 reusable legal operations skills — reviewing, analyzing, drafting, validating. |
| `commands/` | Directory | 3 slash commands for core legal operations workflow. |
| `hooks/` | Directory | 3 hooks enforcing document audit trails, version control, and compliance validation. |
| `mcp/` | Directory | Document extraction and compliance API configurations. |

---

## Skills (6)

| Skill | Trigger | Tools | Purpose |
|---|---|---|---|
| `contract-reviewer` | /contract-review | Read, WebFetch | Identify obligations, risks, renewal dates, indemnification, liability caps |
| `compliance-analyzer` | /compliance-check | Read | Validate against GDPR, SOC 2, ISO 27001, or custom regulatory framework |
| `risk-extractor` | On contract upload | Read | Flag payment terms, IP ownership, termination clauses, renewal conditions |
| `deadline-tracker` | /deadline-tracker | Read, Write | Surface contract renewals, notice periods, key milestones; alert 60/30/14 days prior |
| `document-draftor` | /draft-agreement | Read, Write | Generate agreement from template with variable substitution and compliance checks |
| `version-controller` | Post-edit | Read, Write, Bash | Track all document versions with change logs and approval status |

---

## Commands (3)

| Command | What It Does |
|---|---|
| `/contract-review` | Analyze contract for risks, obligations, dates, and compliance gaps |
| `/compliance-check` | Validate document against legal/regulatory frameworks (GDPR, SOC 2, ISO 27001, etc.) |
| `/deadline-tracker` | Surface contract renewals and key dates; send alerts 60/30/14 days prior |

---

## Hooks (3)

| Hook | Event | What It Enforces |
|---|---|---|
| `document-audit-trail` | PostToolUse | Immutable log of all document reads, edits, and approvals |
| `version-control` | PostToolUse | Prevents overwrites; maintains changelog on every document update |
| `compliance-gate` | PreToolUse | Blocks release of agreements until compliance validation passes |

---

## MCP Setup

### Document Extraction (for contract parsing)

Configure your document extraction service in `settings.json`:

```json
{
  "mcpServers": {
    "document-extractor": {
      "command": "npx",
      "args": ["-y", "your-document-mcp"],
      "env": { "API_KEY": "your-key-here" }
    }
  }
}
```

---

## How It Works

### 1. Contract Intake
Upload or reference a contract. Claude automatically extracts key terms, dates, and obligations.

### 2. Risk Assessment
Contract is analyzed for payment terms, IP ownership, liability caps, indemnification, and renewal conditions. Risks are scored and flagged.

### 3. Compliance Validation
Document is validated against your regulatory framework (GDPR, SOC 2, ISO 27001, or custom rules). Non-compliance items are surfaced with remediation steps.

### 4. Deadline Tracking
All contract renewal dates, notice periods, and key milestones are logged. Alerts fire 60/30/14 days before critical dates.

### 5. Workflow Logging
Every action—review, edit, approval, send—is logged to `session-log.md` with timestamp and approver. Full audit trail maintained.

---

## Success Metrics

- **Contract review turnaround:** <24 hours from intake to risk summary
- **Compliance validation accuracy:** 100% — zero missed regulatory gaps
- **Deadline miss rate:** 0 — all renewal dates tracked and alerted
- **Risk identification rate:** >95% of contracts flagged for key risks
- **Audit trail completeness:** 100% — every action logged

---

## Key Constraints

- **All contract edits require version control.** No overwrites without a changelog.
- **No final agreement sent without compliance sign-off.** Non-negotiable.
- **Deadline alerts** fire at 60, 30, and 14 days before key dates.
- **Regulatory frameworks** must be clearly defined. Compliance checks fail if framework is undefined.

---

**6 skills · 3 commands · 3 hooks · Full audit trail**

---

Built by [tushar2704](https://uitbreiden.com/) · [Claudient](https://github.com/Claudients/Claudient) · [Claude Code](https://claude.com/claude-code)
