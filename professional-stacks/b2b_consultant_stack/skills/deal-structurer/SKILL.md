---
name: deal-structurer
description: Creates commercial term sheet for B2B consulting engagement, M&A transaction, partnership, or investment. Covers pricing model, payment schedule, SLAs, warranties, termination, and contingencies. Output: 2–3 page term sheet with executive summary, key terms, risk allocation, and legal handoff instructions.
allowed-tools: Read, Write
effort: medium
---

# Deal Structurer

## When to activate
When engagement scope and commercial terms need to be defined. Use for:
1. Consulting engagement: pricing model, payment schedule, deliverables
2. M&A transaction: purchase price, earnouts, working capital adjustments
3. Partnership: revenue share, exclusivity, IP ownership
4. Investment round: valuation, share issuance, investor rights

This skill focuses on **consulting engagement term sheets** by default; modify instructions for M&A/partnership/investment.

## When NOT to use
Skip if terms are already agreed to or if commercial negotiation is not needed. Skip if legal terms require specialist counsel (use this to structure the business logic; attorney finalizes legal language).

## Instructions

### Step 1: Confirm Engagement Scope

Define what you're pricing:

**Consulting Engagement Scope:**
- Deliverables: [Strategy doc, roadmap, term sheet, implementation plan, etc.]
- Duration: [30 / 60 / 90 days]
- Resources: [Your FTE %, client team involvement required, external support]
- Success definition: [Outcomes to be achieved or milestones met]

### Step 2: Select Pricing Model

Choose one of 4 models (or hybrid):

**A. Fixed Fee (Most Common for Consulting)**
- Best for: Well-defined scope, clear deliverables, low execution risk
- Price: $X per month or $Y total for 90-day engagement
- Payment: Upfront, milestone, or 50-50 split
- Example: $150K total for 90-day strategy engagement

**B. Value-Based (Outcome-Linked)**
- Best for: Quantifiable outcomes (revenue, cost savings), high-impact work
- Price: Base fee ($X) + success bonus (X% of incremental value)
- Cap/Floor: Agree on upside cap to avoid disputes
- Example: $100K base + 10% of incremental revenue, capped at $500K total

**C. Time & Materials (Least Preferred)**
- Best for: Undefined scope, ongoing advisory, retainer arrangements
- Price: $X per hour or $Y per month for X hours
- Scope: Track hours; pause when hours depleted
- Example: $250/hour, 600-hour engagement = $150K total

**D. Hybrid (Fixed + Variable)**
- Best for: Mixed risk, partially defined scope
- Price: Base fee ($X) + hourly overage ($Y/hour)
- Example: $100K fixed for 90 days, then $250/hour for additional work

### Step 3: Build Payment Schedule

Align cash flow with value delivery:

**Standard Model (90-day engagement):**
- **Upfront (Due on signature):** 25% = $X (covers setup, research)
- **Milestone (Due at 30, 60, 90 days):** 50% = $X (tied to phase completion)
- **Performance (Due 30 days post-engagement):** 25% = $X (tied to success metrics)

**Alternative (Lower Risk for Client):**
- **Monthly:** 33% due on day 1 of each month (3-month engagement)
- **Milestone only:** 50% at week 6, 50% at completion

**Performance Bonus Structure (Value-Based):**
- Base fee: $100K (paid 25/50/25 per above)
- Success bonus: 10% of incremental revenue achieved in months 7–12
- Cap: $500K total (avoid open-ended exposure)
- Measurement: Based on client's audited financial results or third-party verification

### Step 4: Define SLAs & Deliverables

**Consulting SLAs:**
- **Response time:** 24–48 hours for questions / requests
- **Deliverables timing:**
  - Strategy doc: Due week 6
  - Roadmap: Due week 8
  - Executive briefing: Monthly (1st Tuesday)
  - Ad-hoc support: 5 hours/month included
- **Travel:** If required, client covers expenses (flights, hotels)

**Deliverable Checklist (90-day strategy engagement):**
- [ ] Client profile & diagnostic report (week 2)
- [ ] Opportunity identification document (week 4)
- [ ] 90-day strategic roadmap (week 8)
- [ ] Risk assessment & mitigation plan (week 10)
- [ ] Final presentation to board / leadership (week 12)

### Step 5: Risk Allocation & Warranties

Agree on who bears risk:

**Your Warranties (What you promise):**
- Confidentiality: All client data kept strictly confidential
- Independence: No conflicts of interest; not advising competitors
- Expertise: Team has relevant B2B consulting experience
- Effort: Use best efforts to achieve recommended milestones

**Client Obligations (What they must do):**
- Access: Provide timely access to team, data, financial information
- Decisions: Make decisions promptly; don't delay approval gates
- Resources: Assign dedicated project manager or sponsor
- External delays: If client delays decision, timeline extends proportionally

**Shared Risks (How you'll handle):**
- Market changes: If market shifts unfavorably, roadmap adjusted but engagement continues
- Execution: You recommend; client executes. Your liability limited to fee paid.
- Staffing: If your key person becomes unavailable, provide backup within 1 week

### Step 6: Termination & Dispute Resolution

**Termination for Convenience:**
- Either party may terminate with 15 days written notice
- If client terminates: You retain all fees paid + reasonable wind-down costs (up to $X)
- If you terminate: Rare, but requires 30 days notice; client keeps all deliverables

**Termination for Cause:**
- If client materially breaches (e.g., doesn't pay), you can terminate immediately
- If you materially breach, client can terminate with 5 days cure notice

**Dispute Resolution:**
- Escalate to [CEO + CFO] within 5 business days of issue
- Mediation before litigation (saves costs, preserves relationship)
- Governing law: [Client's headquarters state]

### Step 7: IP Ownership

**Work Product Ownership:**
- All deliverables (strategies, roadmaps, analysis) = Client's property
- You retain methodology, templates, tools used in engagement
- Client may not resell deliverables to third parties without permission

---

## Output Format

```markdown
# Consulting Services Agreement — Term Sheet

**Service Provider:** [Your Name / Firm]  
**Client:** [Client Company Name]  
**Engagement Title:** Strategic Advisory / Deal Structuring / [Other]  
**Effective Date:** [Start date]  
**Term:** [Duration, e.g., 90 days]

---

## 1. Executive Summary

[1 paragraph: what you're advising on, what client will get, how success is measured]

**Engagement at a Glance:**
- **Scope:** [Strategic Advisory / M&A / Partnership]
- **Duration:** [30 / 60 / 90 days]
- **Investment:** $X total
- **Deliverables:** [Strategy doc, roadmap, term sheet, etc.]
- **Success Metrics:** [Revenue, cost, efficiency targets]

---

## 2. Engagement Scope & Deliverables

### Primary Deliverables

| # | Deliverable | Description | Due Date | Approval Required |
|---|---|---|---|---|
| 1 | Client Profile & Diagnostic | Firmographics, org structure, pain points, competitive landscape | Week 2 | CEO |
| 2 | Opportunity Identification | 5–7 ranked opportunities by impact vs. effort | Week 4 | CFO / CEO |
| 3 | 90-Day Roadmap | Phased plan with milestones, resources, metrics | Week 8 | Board / CEO |
| 4 | Risk Assessment | Key risks, mitigation strategies, contingency plans | Week 10 | CFO |
| 5 | Final Executive Briefing | Board-level presentation; Q&A | Week 12 | Board |

### Scope Exclusions

The following are explicitly out of scope (additional scope = additional fees):
- Implementation execution (only planning and design)
- 24/7 support (business hours only)
- Travel beyond [X days] per quarter
- Systems integration or custom development work

---

## 3. Pricing & Payment Terms

### Total Investment

| Component | Amount | Notes |
|---|---|---|
| Base Consulting Fee | $X | 90-day strategic advisory |
| Expenses (Reimbursable) | Est. $X | Travel, meals, third-party research |
| **Total Estimated Fee** | **$X** | Expenses estimated; actual billed at cost |

### Pricing Model: [Fixed Fee / Value-Based / Hybrid]

[Select one and detail]:

**Fixed Fee Structure:**
- Total engagement fee: $X for 90 days
- Payment schedule (below)
- No additional charges unless scope changes (approved in writing)

**Value-Based Structure (if applicable):**
- Base fee: $X (payment schedule below)
- Success bonus: 10% of incremental revenue, months 7–12
- Cap: $X maximum total fee
- Measurement: Based on client's audited financial results

### Payment Schedule

| Payment | Amount | Due Date | Trigger |
|---|---|---|---|
| Upfront | 25% = $X | Upon contract signature | Engagement kickoff |
| Month 1 Milestone | 25% = $X | End of week 4 | Client diagnostic + opportunity ID delivered and approved |
| Month 2 Milestone | 25% = $X | End of week 8 | Strategic roadmap delivered and approved |
| Performance | 25% = $X | Week 14 (14 days post-engagement close) | Final briefing completed; success metrics on track |

**Payment Method:** Wire transfer to [account details]. Invoices sent upon each milestone completion.

**Late Payment:** Interest of 1.5% per month accrues on unpaid amounts after due date.

---

## 4. Terms of Service

### SLAs (Service Level Agreements)

- **Response Time:** 24–48 hours for client requests / questions
- **Availability:** Business hours (M–F, 9am–6pm [your timezone])
- **Executive Briefings:** Monthly (1st Tuesday, 1 hour)
- **Ad-hoc Advisory:** 5 hours/month included in base fee; additional hours billed at $X/hour
- **Travel:** If required, covered by client (flights, hotels, meals)

### Key Responsibilities

**Service Provider Commits To:**
- Dedicate [X FTE / X hours/week] to engagement
- Provide senior-level expertise; no junior staff without approval
- Maintain strict confidentiality of client data
- No conflicts of interest; not advising direct competitors
- Use best efforts to meet milestones (not guaranteed outcomes)

**Client Commits To:**
- Provide timely access to team, data, financial information
- Assign dedicated sponsor / project manager on their side
- Make decisions promptly; not delay approval gates
- Notify service provider within 5 days of any concerns or blockers

---

## 5. Success Metrics & KPIs

**Engagement is considered successful when:**

| Metric | Target | Measurement |
|---|---|---|
| Strategy acceptance | ≥80% leadership alignment | Post-engagement survey |
| Roadmap clarity | All stakeholders understand phases 1–3 | Q&A session + written feedback |
| Opportunity validation | ≥3 of 5 opportunities validated with market research | External validation or pilot results |
| Recommendation implementation | ≥60% of recommendations implemented in 6 months | Follow-up check-in at month 6 |
| Financial impact | Revenue / cost savings = $X within 10–15% of plan | Tracked through month 6–12 |

**If success metrics are not met:**
- Service provider offers 20 hours of follow-up advisory at no charge (valued at $X)
- Not a refund guarantee, but additional support to course-correct

---

## 6. Confidentiality & IP Ownership

### Confidentiality
- All client information (financial, strategic, operational) treated as strictly confidential
- Service provider will not disclose without written permission
- Exception: Service provider may reference engagement as case study (anonymized) with approval

### IP Ownership
- All deliverables created during engagement = Client's exclusive property
- Client may use for internal purposes; may not resell to third parties without permission
- Service provider retains methodology, templates, tools, and frameworks developed independently

---

## 7. Termination & Dispute Resolution

### Termination

**For Convenience:**
- Either party may terminate with 15 days written notice
- If client terminates early: Client pays all fees earned to date + wind-down costs (est. $X)
- If service provider terminates: Client retains all deliverables; service provider refunds unearned fees

**For Cause (Material Breach):**
- If client fails to pay within 15 days of invoice, service provider may terminate immediately
- If service provider materially breaches, client must give 5-day cure notice before terminating

**Upon Termination:**
- Client receives all work-in-progress deliverables within 5 business days
- Service provider removes all confidential client data from systems
- Any fees in dispute are escalated per dispute resolution process (below)

### Dispute Resolution

**Escalation Process:**
1. Raise issue to immediate project stakeholder (within 5 days of dispute)
2. Escalate to [CEO / CFO] if unresolved (within 10 days)
3. Mediation with neutral third party if still unresolved (within 30 days)
4. Litigation as last resort (each party bears own legal costs)

**Governing Law:** [Client's home state or neutral jurisdiction]

---

## 8. Warranty & Liability

### Your Warranties

- You have right to provide these services and are not in breach of other agreements
- Work is original or properly licensed
- You will maintain professional liability insurance (minimum $X)
- Services rendered in professional and workmanlike manner

### Liability Limits

- Your total liability capped at fees paid under this agreement
- No liability for indirect, incidental, or consequential damages
- You are not liable for client's execution or market outcomes, only quality of recommendations

### Client Acknowledgment

- You are providing advisory services, not guaranteeing outcomes
- Client is responsible for final decisions and implementation
- Market conditions, internal execution, and client decisions impact results

---

## 9. Expenses & Travel

**Reimbursable Expenses:**
- Flights (coach class) and ground transportation
- Hotel (standard room rate, not suites)
- Meals (up to $75/day)
- Third-party research, data, or tools necessary for engagement

**Non-Reimbursable:**
- Home office expenses
- Parking or vehicle maintenance
- Entertainment or alcohol beyond meal-related

**Expense Reporting:** Monthly invoices with receipt documentation.

---

## 10. Signature Block

**By signing below, both parties agree to the terms above.**

**Service Provider:**

Signature: ________________________  
Name: ________________________  
Title: ________________________  
Date: ________________________  

**Client:**

Signature: ________________________  
Name: ________________________  
Title: ________________________  
Date: ________________________  

---

## Appendix A: Team & Biographies

[Include brief bios of key people who will work on the engagement]

## Appendix B: Similar Engagements (Case Studies)

[2–3 examples of similar work; client names anonymized if needed]

## Appendix C: Proposed Timeline

[Detailed calendar of weeks 1–12 with milestone gates]
```

## Example

**Client:** Acme SaaS, $20M ARR  
**Engagement:** 90-day Strategic Advisory  
**Total Fee:** $150K  
**Payment:** 25% upfront ($37.5K), 25% + 25% at milestones (weeks 4, 8), 25% on completion  
**Success Metrics:** 5+ opportunities identified and validated; roadmap adopted by board; ≥3 recommendations implemented in 6 months  
**Bonus:** 10% of incremental revenue achieved in months 7–12, capped at $50K

