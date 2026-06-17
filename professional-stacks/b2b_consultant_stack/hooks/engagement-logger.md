# Hook: Engagement Logger

Auto-logs consulting engagement activity to `session-log.md` after major deliverables or client interactions.

---

## What It Does

When triggered, this hook:
1. Prompts you for engagement metadata (client, phase, deliverable, feedback)
2. Generates a structured log entry
3. Appends to `session-log.md` in the "Active Engagements" section
4. Preserves audit trail of all advisory work for billing, follow-up, and case studies

---

## When It Fires

Suggested triggers (manual for now; could be automated):
- After delivering a strategy document
- After a client approval or sign-off
- After a quarterly check-in or results review
- After a milestone completion

---

## Setup Instructions

### Option A: Manual Trigger (Simplest)

When you complete a deliverable and are ready to log it:

```bash
/log-engagement [client-name] [deliverable-type]
```

**Example:**
```
/log-engagement acme-saas strategy-roadmap
```

This will prompt:
- Date and time of delivery
- Attendees from client and your team
- Client feedback summary
- Approvals (CEO, CFO, Board, etc.)
- Next steps and follow-up date

The hook then appends to `session-log.md`:

```markdown
## 2026-06-10 — Acme SaaS

**Engagement:** Strategic Advisory — Sales Efficiency + GTM  
**Phase:** Strategy Design → Execution  
**Deliverable:** 90-Day Strategic Roadmap

### Delivery Details
[Auto-populated from your input]

### Client Feedback
[Client input]

### Approvals & Sign-Off
[Tracking of approvals]

### Outcome & Next Steps
[Next milestone and timeline]
```

---

### Option B: Post-Delivery Prompt

After you write and share a deliverable document:

1. Create the deliverable (e.g., `strategy-roadmap.md`)
2. Share with client
3. Hook detects new deliverable in session folder
4. Prompts: "Log this deliverable to session-log.md?"
5. You confirm and provide feedback summary
6. Entry auto-appended to `session-log.md`

---

## Session-Log Structure

The hook maintains this structure in `session-log.md`:

```markdown
# Session Log — B2B Consultant Stack

## [Active Engagements]

### [Client Name 1]
- [Most recent deliverable and feedback]
- [Current phase and next step]

### [Client Name 2]
- [...]

---

## [Completed Engagements]

### [Client Name 3]
- Engagement closed [Date]
- Final impact: [Revenue, cost, efficiency outcome]
- Case study candidate: Yes / No

---

## [Key Metrics Summary]

| Client | Engagement | Duration | Financial Impact | Status |
|---|---|---|---|---|
| [Name] | [Type] | [Weeks] | [Impact] | [Closed/Active] |
```

---

## Log Entry Template

```markdown
## [Date] — [Client Name]

**Engagement:** [Strategic Advisory / Deal Structuring / M&A / Transformation]  
**Phase:** [Diagnostic / Strategy / Execution / Closed]  
**Deliverable:** [Name]

### Delivery Details

**Date Delivered:** [Date and time]  
**Delivered By:** [Your name]  
**Attendees:**
- Client: [Names, titles]
- Your team: [Names, roles]

### Client Feedback

**Overall Reception:** [Positive / Mixed / Concerns]

**Specific Feedback:**
- [Point 1]
- [Point 2]

### Approvals

| Stakeholder | Status | Notes |
|---|---|---|
| [CEO] | ✓ | Approved; ready to proceed |
| [CFO] | ✓ | Approved after cost clarification |

### Outcome & Next Steps

**Status:** [Accepted / Revisions / On Hold]

**Next Step:** [What's next]  
**Timeline:** [When]  
**Owner:** [Who]
```

---

## Benefits

1. **Audit Trail:** Every deliverable, approval, and piece of feedback is logged with timestamp
2. **Billing Verification:** Reference for milestone-based payments and usage tracking
3. **Client History:** Quick reference for follow-up engagements or extensions
4. **Case Studies:** Documented outcomes for marketing and sales references
5. **Team Continuity:** If team member changes, new person has full engagement history

---

## Example Usage

After delivering the 90-day strategic roadmap to Acme SaaS on June 10:

```bash
/log-engagement acme-saas "90-Day Strategic Roadmap"
```

Hook prompts:
```
Date delivered: 2026-06-10
Time: 14:00
Client attendees: John (CEO), Sarah (CFO), Mike (SVP Sales)
Your attendees: [Your name], [Associate]
Overall reception: Positive
CEO approval: Yes
CFO approval: Yes
Next step: Phase 1 kickoff
Next step date: 2026-06-14
```

Hook appends to `session-log.md`:

```markdown
## 2026-06-10 — Acme SaaS

**Engagement:** Strategic Advisory — Sales Efficiency + GTM  
**Phase:** Strategy Design → Execution  
**Deliverable:** 90-Day Strategic Roadmap

### Delivery Details

**Date Delivered:** June 10, 2026, 2:00 PM ET  
**Delivered By:** [Your name]  
**Attendees:**
- Client: John (CEO), Sarah (CFO), Mike (SVP Sales)
- Your team: [Your name], [Associate]

### Client Feedback

**Overall Reception:** Positive — CEO called it "exactly what we needed"

**Specific Feedback:**
- CEO appreciates phased approach; confident in Phase 1
- CFO requested cost clarification (provided on call)
- All stakeholders aligned on 90-day timeline

### Approvals

| Stakeholder | Status | Notes |
|---|---|---|
| John (CEO) | ✓ | "Let's move forward next Monday" |
| Sarah (CFO) | ✓ | After resource cost clarification |
| Board | ✓ | Voted async; unanimous approval |

### Outcome & Next Steps

**Status:** Accepted (no revisions)

**Next Step:** Phase 1 Kickoff — Governance + Deep Dive  
**Timeline:** Monday, June 14, 2026  
**Owner:** [Your name] + CEO
```

---

## Tips

1. **Log within 24 hours** of client delivery; memory is freshest
2. **Be specific:** Quote client feedback directly when possible
3. **Track approvals obsessively:** Approval delays often predict execution delays
4. **Update quarterly:** At 6-month or 12-month marks, update with impact achieved
5. **Archive at close:** Move completed engagements to "Completed Engagements" section with final outcome

---

## Future Automation

In the future, this hook could auto-trigger on:
- New deliverable file created in engagement folder
- Calendar reminder at scheduled delivery date
- Email notification when deliverable is shared with client
- CRM integration to sync with deal/account records

For now, manual `/log-engagement` command is simplest and most reliable.

