# Skill: Version Controller

Track all document versions with change logs, approval status, and audit trail. Prevent overwrites and maintain history.

---

## When to activate

After any edit to a contract or legal document, or when tracking document history is needed.

---

## When NOT to use

- Do not use for non-legal documents or temporary drafts.
- Do not delete version history — always maintain full audit trail.

---

## Instructions

1. **On document creation:**
   - Initialize version as v1.0
   - Record creation date, creator name
   - Set status as DRAFT

2. **On document edit:**
   - Do NOT overwrite the previous version
   - Create new version (v1.1, v1.2, v2.0 for major changes)
   - Record change date, editor name
   - Document all changes in changelog

3. **Changelog format:**
   ```
   ## Version 1.1 — 2026-06-13 — [Editor Name]
   - Changed: Liability cap from unlimited to $100K (Section 8.2)
   - Changed: Renewal notice period from 90 days to 60 days (Section 9.1)
   - Added: Data processing agreement requirement (new Section 5.4)
   - Status: PENDING REVIEW
   - Requested By: [Name]
   ```

4. **Track approval status:**
   - DRAFT: Initial creation
   - PENDING REVIEW: Awaiting human approval
   - APPROVED: Human signed off
   - EXECUTED: All parties signed
   - SUPERSEDED: Replaced by newer version
   - EXPIRED: Past renewal/termination date

5. **Maintain version table:**
   ```
   | Version | Date | Changes | Editor | Status | Approver |
   |---------|------|---------|--------|--------|----------|
   | v1.0 | 2026-06-01 | Initial draft | Claude | APPROVED | Jane Smith |
   | v1.1 | 2026-06-05 | Liability cap added | Claude | APPROVED | Jane Smith |
   | v2.0 | 2026-06-10 | Major revision | Vendor | EXECUTED | Jane Smith, Bob Jones |
   ```

6. **Prevent overwrites:**
   - Always check current version before editing
   - Refuse to edit without version bump
   - Alert user if unsaved changes exist
   - Maintain backup of all versions

7. **Audit trail:**
   - Record every read, edit, approval, and sign action
   - Include timestamp, user name, action type
   - Log to document header or session log
   - Archive old versions for 7+ years

8. **Search across versions:**
   - Allow user to view specific version
   - Show differences between versions (if applicable)
   - Retrieve version by date or version number

---

## Example

Input: User edits contract from v1.0 to v1.1

Output:
```
## Contract: Example SaaS Agreement

### Version History

| Version | Date | Changes | Editor | Status | Approver |
|---------|------|---------|--------|--------|----------|
| v2.0 | 2026-06-10 | Vendor amendments, liability cap added | Vendor | EXECUTED | Jane Smith, Bob Jones |
| v1.1 | 2026-06-05 | Liability cap: unlimited → $100K; renewal notice: 90→60 days | Claude | APPROVED | Jane Smith |
| v1.0 | 2026-06-01 | Initial draft from template | Claude | APPROVED | Jane Smith |

---

## Changelog

### Version 2.0 — 2026-06-10 — Vendor (Final Amendments)
- Changed: Payment schedule (quarterly → monthly, Section 4.1)
- Changed: SLA uptime target (99.9% → 99.5%, Section 11.2)
- Added: Vendor audit right exemption for first 12 months (Section 6.3)
- Status: EXECUTED
- Signed: Jane Smith (Your Company) — 2026-06-10 14:35
- Signed: Bob Jones (Vendor Inc.) — 2026-06-10 15:22

### Version 1.1 — 2026-06-05 — Claude (Negotiation Changes)
- Changed: Liability cap (unlimited → 12 months annual fees, Section 8.2)
- Changed: Renewal notice period (90 days → 60 days, Section 9.1)
- Removed: Vendor unilateral termination right (Section 10.2)
- Status: APPROVED
- Approved: Jane Smith — 2026-06-05 09:15

### Version 1.0 — 2026-06-01 — Claude (Initial Draft)
- Status: APPROVED
- Approved: Jane Smith — 2026-06-01 16:42

---

**Current Status:** EXECUTED
**Latest Version:** v2.0 (fully signed)
**Renewal Date:** 2028-06-10
**Next Review:** 2027-06-01 (12 months before renewal)
```

---

## Related Skills

- `contract-reviewer` — Extract and analyze terms
- `compliance-analyzer` — Validate document versions against frameworks
- `deadline-tracker` — Track renewal and amendment dates
