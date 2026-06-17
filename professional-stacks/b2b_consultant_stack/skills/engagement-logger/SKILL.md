---
name: engagement-logger
description: Auto-logs consulting engagement activity, recommendations delivered, client feedback, and outcomes to session-log.md. Triggered after each deliverable or client interaction. Maintains structured record of all advisory work for follow-up, billing verification, and case study documentation.
allowed-tools: Read, Write
effort: low
---

# Engagement Logger

## When to activate
After completing and delivering any major deliverable (strategy doc, roadmap, term sheet, recommendation). Also trigger after client check-in calls, approvals, or significant feedback. Use to maintain continuous, audit-able record of engagement progress.

## When NOT to use
Skip logging for internal work (research, document drafts not yet delivered to client). Skip if client requests confidentiality on specific recommendations.

## Instructions

### Step 1: Gather Engagement Context

Collect before logging:
- **Date & Time:** When was deliverable delivered?
- **Deliverable:** What was presented / delivered?
- **Attendees:** Who from client attended? Any external participants?
- **Feedback:** What was client's reaction? Any concerns or requested changes?
- **Approvals:** Did client approve? Any conditions?
- **Next Step:** What happens next? When is follow-up scheduled?

### Step 2: Structure Log Entry

Log entries follow this format:

```
## [Date] — [Client Name] [Phase/Engagement]

**Deliverable:** [What was delivered]
**Attendees:** [Names, titles; your team]
**Client Feedback:**
- [Key feedback point 1]
- [Key feedback point 2]
- [Concerns or requests for revision]

**Approvals:**
- [ ] CEO sign-off
- [ ] CFO sign-off
- [ ] Board approval (if required)

**Outcome:** [Accepted / Accepted with revisions / Requires rework / Rejected]
**Revisions Requested:** [If any]

**Next Steps:** [What happens next; timeline]
**Follow-Up Due:** [Date of next milestone]
```

### Step 3: Log Entry Categories

Different log categories for different engagement types:

**Strategic Advisory Log:**
- Client diagnostic complete → log findings, pain points identified
- Opportunity identification delivered → log top 3 opportunities, client reaction
- 90-day roadmap approved → log phases, success metrics, sponsor commitment
- Executive briefing → log attendance, key Q&A, decisions made

**Deal Structuring Log:**
- Commercial terms draft → log pricing model, payment schedule, client feedback
- Term sheet approved → log final terms, sign-off, implementation timeline
- Final signature → log effective date, first payment processed

**M&A / Transaction Log:**
- Valuation model delivered → log valuation, multiples used, client questions
- LOI signed → log terms, exclusivity period, next steps (due diligence)
- Final agreement signed → log close date, earnout provisions, integration plan

### Step 4: Update Session-Log

Add entry to `session-log.md` in "Active Engagements" section. When engagement closes, move to "Completed Engagements" section with final outcome.

### Step 5: Track Metrics

Log engagement progress metrics:
- Deliverables completed vs. planned
- Client approval timeline (on time / delayed)
- Revisions requested (count and nature)
- Financial impact realized (if available at check-in)
- Client satisfaction (from feedback)

---

## Output Format (Session-Log Entry)

```markdown
## [Date] — [Client Name]

**Engagement:** [Strategic Advisory / Deal Structuring / M&A / Transformation]  
**Phase:** [Diagnostic / Strategy / Execution / Closed]  
**Deliverable:** [Name of document/recommendation]

### Delivery Details

**Date Delivered:** [Date and time]  
**Delivered By:** [Your name]  
**Attendees:**
- Client: [Names, titles]
- Your team: [Names, roles]

### Client Feedback

**Overall Reception:** [Positive / Mixed / Concerns raised]

**Specific Feedback:**
- [Feedback point 1: what client said]
- [Feedback point 2]
- [Any concerns or requests for revision]

**Questions Raised:**
- Q1: [Client question and your response]
- Q2: [...]

### Approvals & Sign-Off

| Stakeholder | Approval | Notes |
|---|---|---|
| [CEO] | ✓ Approved | No major concerns; ready to proceed |
| [CFO] | ✓ Approved | Requested cost clarification (provided) |
| [Board] | ✓ Approved | Voted unanimously to move forward |

### Outcome & Next Steps

**Status:** [Accepted / Accepted with revisions / On hold / Rejected]

**Revisions:** [If accepted with revisions, list changes requested]
- [ ] Revise section X
- [ ] Add analysis on Y
- [ ] Clarify timeline for Z

**Revised Delivery Date:** [Date if revisions needed]

**Next Step:** [What happens next: Phase 2 kickoff / commercial negotiation / implementation start / etc.]  
**Timeline:** [When does next step happen]  
**Owner:** [Who is responsible for next step]

---

## Example 1: Strategy Roadmap Delivery

**Date:** 2026-06-10 — Acme SaaS

**Engagement:** Strategic Advisory — Sales Efficiency + GTM  
**Phase:** Strategy Design → Execution  
**Deliverable:** 90-Day Strategic Roadmap

### Delivery Details

**Date Delivered:** June 10, 2026, 2:00 PM ET  
**Delivered By:** [Your name]  
**Attendees:**
- Client: CEO (John), CFO (Sarah), SVP Sales (Mike)
- Consultant: [Your name], [Associate]

### Client Feedback

**Overall Reception:** Positive — CEO called it "exactly what we needed"

**Specific Feedback:**
- CEO appreciated the phased approach; confident in Phase 1 timeline
- CFO requested clarification on Phase 2 resource costs (provided on call)
- SVP Sales concerned about sales team capacity; requested contingency plan (added to document)

**Questions Raised:**
- Q1: "Can we compress Phase 1 from 4 weeks to 3?" 
  - Response: Possible, but risks inadequate stakeholder alignment. Recommend staying at 4 weeks for buy-in.
  - Decision: Stay at 4 weeks; CEO agreed.

- Q2: "What if market shifts during Phase 2?"
  - Response: Built quarterly pivot points into roadmap; can adjust opportunities if signals change.
  - Decision: Accepted; CEO to monitor competitive landscape

### Approvals & Sign-Off

| Stakeholder | Approval | Notes |
|---|---|---|
| CEO | ✓ Approved | "Let's move forward next Monday" |
| CFO | ✓ Approved | After resource cost clarification |
| Board | ✓ Approved (async) | Voted via email; unanimous +1 |

### Outcome & Next Steps

**Status:** Accepted (no revisions needed)

**Next Step:** Phase 1 Kickoff — Governance + Deep Dive  
**Kickoff Date:** Monday, June 14, 2026, 10:00 AM ET  
**Owner:** [Consultant] + CEO

**Phase 1 Milestones:**
- Week 1 (Jun 14–20): Steering committee established; deep dive research begins
- Week 2 (Jun 21–27): Deep dive findings documented
- Week 3 (Jun 28–Jul 4): Baseline metrics locked; resource plan finalized
- Week 4 (Jul 5–11): Change management plan approved; Phase 2 preparation

**Client Commitment:**
- Weekly steering committee meetings (Tuesdays, 10 AM)
- Sales team interviews (5–10 reps per week during Phase 1)
- Executive availability for ad-hoc questions

---

## Example 2: Quarterly Check-In

**Date:** 2026-09-15 — Acme SaaS

**Engagement:** Strategic Advisory — Follow-up (6-month mark)  
**Phase:** Implementation Tracking  
**Deliverable:** 6-Month Impact Assessment

### Delivery Details

**Date Delivered:** September 15, 2026 (quarterly business review)  
**Delivered By:** [Your name]  
**Attendees:**
- Client: CEO, CFO, SVP Sales, VP Product
- Consultant: [Your name]

### Client Feedback

**Overall Reception:** Very positive — CEO shared assessment with board; credited consultant recommendations for results

**Specific Feedback:**
- Sales efficiency opportunity exceeded targets: 28% reduction in sales cycle (vs. 25% target)
- SMB segment showing strong early traction: $500K MRR (vs. $300K forecast)
- Pricing optimization delayed; customer success team recommends 60-day extension
- CEO asked if consultant could help with new market expansion opportunity identified mid-year

**Questions Raised:**
- Q1: "Why did SMB outperform budget?"
  - Response: Product fit better than expected; early customers high-NPS (72); viral coefficient positive
  - Decision: Increase investment; hire 2 more SMB-focused AEs
  
- Q2: "Can the pricing model wait until Q4?"
  - Response: Yes; defer to Q4 to avoid customer churn during peak contract renewal season
  - Decision: Accepted; move to Q4 roadmap

### Approvals & Sign-Off

| Stakeholder | Approval | Notes |
|---|---|---|
| CEO | ✓ Approved extension | Wants consultant to continue through year-end |
| CFO | ✓ Approved budget | Additional budget approved for SMB investment |
| Board | ✓ Approved (via CEO) | Highlighted impact in board meeting |

### Outcome & Next Steps

**Status:** Engagement extended 6 additional months

**Financial Impact Summary (6 months):**
| Opportunity | Target | Actual | Status |
|---|---|---|---|
| Sales Efficiency | +$3M ARR | +$3.2M | ✓ Exceeded |
| SMB Segment | +$1M ARR | +$0.5M | On track to $2M by year-end |
| Pricing Model | +$1M | $0 (deferred) | Planned Q4 |
| **Total Impact** | **+$5M** | **+$3.7M** | **74% of annual target** |

**Next Step:** Extended Advisory — New Market Expansion Opportunity  
**Scope:** Identify adjacent vertical expansion opportunity; design 90-day plan  
**Start Date:** October 1, 2026  
**Duration:** 60 days (Q4)  
**Fee:** $75K (50% of original engagement; leveraging existing client knowledge)

**New Engagement Deliverables:**
- Market validation study (3 weeks)
- Go-to-market strategy (2 weeks)
- 90-day execution roadmap (1 week)
- Final executive briefing + sign-off

---

## Auto-Log Template (Copy-Paste for Each Deliverable)

```markdown
## [Date] — [Client Name]

**Engagement:** [Type]  
**Phase:** [Phase]  
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

**Questions Raised:**
- Q1: [Question and response]

### Approvals & Sign-Off

| Stakeholder | Approval | Notes |
|---|---|---|
| [Name] | ✓ / ✗ | [Notes] |

### Outcome & Next Steps

**Status:** [Accepted / Revisions / On hold]

**Next Step:** [What's next]  
**Timeline:** [When]  
**Owner:** [Who]
```

---

## Engagement Logger Tips

1. **Log within 24 hours** of client delivery; memory is freshest
2. **Be specific:** Quote client feedback directly when possible
3. **Track approvals obsessively:** Approval delays often predict execution delays
4. **Log contingencies:** If you offered a Plan B, document it here
5. **Update session-log.md regularly:** Use this for billing verification and case studies
6. **Use for follow-ups:** At 3-month mark, reference original roadmap; track actual vs. plan

