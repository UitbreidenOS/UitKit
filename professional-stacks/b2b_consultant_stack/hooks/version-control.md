# Hook: Version Control

Archives previous versions of strategy documents and commercial term sheets with timestamps, enabling A/B comparison and change tracking across engagement revisions.

---

## What It Does

When a strategy document or term sheet is updated:
1. Copies previous version to `versions/` archive with timestamp
2. Creates a changelog entry showing what changed between versions
3. Maintains full history for audit trail and client reference
4. Enables side-by-side comparison of strategic pivots or commercial adjustments

---

## When It Fires

Suggested triggers:
- When strategy roadmap is revised after client feedback
- When commercial term sheet is renegotiated
- When quarterly update to roadmap is prepared (Q1 → Q2 → Q3 → Q4)
- When risk register is updated materially

---

## Setup Instructions

### File Structure

```
b2b_consultant_stack/
├── strategies/
│   ├── acme-saas-strategy-v1.0.md (current)
│   └── versions/
│       ├── acme-saas-strategy-v0.9-2026-06-08.md
│       └── acme-saas-strategy-v0.8-2026-05-20.md
├── term-sheets/
│   ├── acme-saas-terms-v1.0.md (current)
│   └── versions/
│       ├── acme-saas-terms-v0.9-2026-06-05.md
└── ...
```

---

### Workflow: Creating a New Version

**When you revise a strategy document:**

1. Make edits to the current strategy file
2. Hook detects material changes (>20 lines added/removed)
3. Hook prompts: "Archive previous version?"
4. You confirm
5. Hook:
   - Copies current version to `versions/` with timestamp
   - Increments version number (v1.0 → v1.1)
   - Creates changelog entry showing what changed
   - Updates `session-log.md` with revision note

**Example:**

Current file: `acme-saas-strategy-v1.0.md`

After revisions, hook:
1. Renames `v1.0` to `v1.0-2026-06-08.md` and moves to `versions/`
2. Updates active file to `acme-saas-strategy-v1.1.md`
3. Creates changelog:

```markdown
## Version 1.1 Changes (2026-06-15)

**What Changed:**
- Phase 1 timeline reduced from 4 weeks to 3 weeks (per CEO request)
- Resource requirements updated: +1 contractor added to Phase 2
- Success metrics adjusted: sales cycle target refined to 22 days (vs. 25 days)
- Risk register: added contingency for product engineering capacity

**Reason for Update:**
Client feedback from June 10 review; CEO wants to move faster on sales playbook

**Owner:** [Your name]
**Approved By:** CEO, CFO
**Date:** June 15, 2026
```

4. Logs to `session-log.md`:
```markdown
## 2026-06-15 — Acme SaaS

**Event:** Strategy Revision  
**Document:** 90-Day Strategic Roadmap (v1.0 → v1.1)  
**Changes:** Phase 1 timeline reduced; resource plan updated; success metrics refined  
**Reason:** Client feedback from 6/10 review; CEO acceleration request  
**Approvals:** CEO, CFO  
```

---

## Changelog Template

```markdown
# Version History — [Document Name]

## Version 1.1 (2026-06-15)

**What Changed:**
- [Change 1 with before/after if numerical]
- [Change 2]
- [Change 3]

**Reason for Update:**
[Why this change was necessary; client request, market shift, execution learnings, etc.]

**Owner:** [Your name]
**Approved By:** [CEO / CFO / Other]
**Date:** [Date]

---

## Version 1.0 (2026-06-10) — Original

[Keep baseline for reference]
```

---

## Use Cases

### Use Case 1: Client Requests Timeline Acceleration

**Scenario:** Client wants to move Phase 1 from 4 weeks to 3 weeks after initial review.

1. You update roadmap to reflect 3-week Phase 1
2. Hook archives v1.0 as `acme-saas-strategy-v1.0-2026-06-10.md`
3. Creates changelog showing Phase 1 reduction and resource adjustments
4. Updates active file to `acme-saas-strategy-v1.1.md`
5. Client can reference original v1.0 if they want to see what changed

**Benefit:** Complete audit trail of why timeline changed and when.

---

### Use Case 2: Quarterly Roadmap Update

**Scenario:** At month 3, Phase 1–2 are complete; now scoping Phase 2 expansion based on learnings.

1. You create Q2 roadmap revision incorporating:
   - Actual Phase 1 results vs. forecast
   - Pivots based on early wins or misses
   - New opportunities identified mid-way
2. Hook archives v1.0 as baseline
3. Creates changelog highlighting variances vs. original plan
4. New v2.0 shows updated forecasts and risk adjustments

**Benefit:** Track how strategy evolved based on execution learnings.

---

### Use Case 3: Commercial Term Renegotiation

**Scenario:** Client wants to extend engagement beyond original 90 days; negotiating success bonus structure.

1. You update term sheet with new bonus terms (was 10%, now 15%)
2. Hook archives original v1.0 terms
3. Creates changelog showing payment terms shift
4. New v1.1 reflects final negotiated agreement

**Benefit:** Both parties have clear before/after record of commercial terms.

---

## Comparison Workflow

To compare two versions:

```bash
/compare-versions acme-saas-strategy v1.0 v1.1
```

Output shows:
- Side-by-side markdown diff
- Executive summary of key changes
- Sections that changed (highlighted)
- Unchanged sections collapsed for brevity

---

## Archive Management

**How long to keep versions?**
- Current major version: Always keep (needed for active execution)
- Previous 1–2 versions: Keep for quick reference and comparison
- Older versions: Archive to `_archive/` folder if engagement is completed or dormant

**Cleanup:** At engagement close, move all versions to engagement folder, not root.

---

## Tips

1. **Version naming convention:** `[client]-[document-type]-v[major].[minor]-[date].md`
   - Example: `acme-saas-strategy-v1.0-2026-06-10.md`

2. **Changelog discipline:** Update changelog immediately after edits, before archiving previous version

3. **Approval tracking:** Always note who approved each version update (CEO, CFO, etc.)

4. **Client communication:** Share version history if client asks "what changed from the first plan?"

5. **Archive regularly:** At end of each quarter or phase, review and archive old versions

---

## Future Automation

Eventually, this could integrate with:
- **Git:** Automatic version control via commits with version tags
- **Google Docs:** Track changes and revision history in Docs (simpler for client collaboration)
- **Notion:** Version database with inline change notes
- **Slack:** Auto-notify stakeholders when major document version is published

For now, manual version naming and archiving is most reliable.

