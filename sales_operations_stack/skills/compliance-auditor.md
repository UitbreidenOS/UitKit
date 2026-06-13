---
name: compliance-auditor
description: Deal documentation audit, pipeline hygiene validation, audit-trail verification for compensation changes, and regulatory reporting. Ensures 100% compliance with internal controls.
allowed-tools: Read, Write
effort: medium
---

## When to activate

Weekly for pipeline health, monthly for full compliance audit, or before quarter-end close. Required for Sarbanes-Oxley (SOX) or GAAP revenue recognition compliance.

## When NOT to use

Not for deal coaching (use quota-tracker). Not for legal review (escalate to legal/compliance team).

## Compliance Audit Checklist

**Pipeline hygiene (weekly):**
1. All open deals have: name, account, estimated value, close date, stage, rep owner
2. No duplicate deal records (merge duplicates)
3. Stale deals (unchanged >60 days) marked for re-engagement or closure
4. Deal descriptions updated quarterly at minimum

**Deal documentation (pre-close):**
1. Deal record: Customer PO or signed proposal present and dated
2. Contract status: Sent, Signed, or Executed (no Verbal or Handshake)
3. Customer suitability: No compliance red flags (sanction list check, export control)
4. Approvals: Deal approved by required authority (manager for <$50K, VP for $50K–$250K, SVP for >$250K)

**Commission audit trail (monthly):**
1. All commission payments logged with: rep, deal, amount, date, approver
2. All disputes resolved with documentation: claimed vs. actual, reason, approver signature
3. Any manual adjustments (clawbacks, bonus exceptions) pre-approved and documented

**Revenue recognition (quarterly):**
1. Deals closed (won) have revenue recorded in finance system within 5 days
2. Deal close dates match CRM records (verify no post-close date adjustments)
3. Deal amounts match contract amounts (no unauthorized discounting)

## Output Template

```markdown
# Compliance Audit Report — {Month/Quarter}

**Audit Date:** {Date}  
**Scope:** Full pipeline + deal documentation + compensation

---

## Findings Summary

**Overall Status:** {Green / Yellow / Red}

| Category | Green | Yellow | Red | Status |
|---|---|---|---|---|
| Pipeline Hygiene | {N} | {N} | {N} | {Color} |
| Deal Documentation | {N} | {N} | {N} | {Color} |
| Commission Audit Trail | {N} | {N} | {N} | {Color} |
| Revenue Recognition | {N} | {N} | {N} | {Color} |

---

## Issues Identified

**CRITICAL (Red):**
1. Deal ID {X}: No PO on file (required before revenue recognition) — Escalate to rep + manager by {deadline}
2. Commission change {X}: No documented approval on file — Retrieve approval or claw back payment by {deadline}

**WARN (Yellow):**
1. {N} deals stalled >60 days — Recommend re-engagement or stage downgrade

**INFO (Green):**
1. Pipeline hygiene: 98% compliant (2 minor issues, low impact)

---

## Compliance Certification

I certify that this audit is complete and accurate. All material exceptions have been escalated.  
**Auditor:** {Name} | **Date:** {Date} | **Approval:** {Finance/Compliance Lead}
```
