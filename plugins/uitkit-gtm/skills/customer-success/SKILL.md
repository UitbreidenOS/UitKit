---
name: "customer-success"
description: "Customer success management: health scoring, churn prediction signals, expansion playbooks, QBR structure, onboarding plans, and customer lifecycle management for SaaS"
---

# Customer Success Skill

## When to activate
- Building a customer health score model
- Identifying at-risk customers before they churn
- Designing expansion and upsell playbooks
- Running a quarterly business review (QBR) with a customer
- Creating a customer onboarding plan
- Segmenting the customer base for CS coverage models

## When NOT to use
- Sales prospecting — use the sdr-agent or lead-enrichment skills
- Product analytics for internal decisions — use the product-analytics skill
- Marketing campaigns to existing customers — use the email-sequence skill
- Technical support or bug triage — different function

## Instructions

### Customer health score

```
Build a customer health score model for [product].

Product: [describe — SaaS / platform / managed service]
Customer type: [SMB / mid-market / enterprise]
Key success metric: [what indicates a customer is getting value]
Data available: [product usage / support tickets / NPS / payment history / engagement]

Health score framework (weighted composite):

USAGE SIGNALS (40% weight):
- Login frequency: [daily/weekly/monthly] vs. expected for plan
- Core feature adoption: % of purchased features actually used
- Power users: number of users with > X sessions/week
- Breadth: % of licensed seats actively used
- Trend: is usage growing, flat, or declining MoM?

RELATIONSHIP SIGNALS (25% weight):
- NPS score: last survey response and trend
- Support ticket volume: rising tickets = friction; zero tickets = disengagement risk
- Executive sponsor engagement: last contact with decision-maker
- Champions: identified internal advocates for your product?

COMMERCIAL SIGNALS (20% weight):
- Days overdue on invoices: >30 days is a churn signal
- Renewal date: <90 days to renewal = high priority
- Contract growth: expanding (healthy) vs. contracting (churn risk)
- Discount level: heavily discounted accounts = lower switching cost

OUTCOMES SIGNALS (15% weight):
- Customer's stated success criteria: are they being met?
- Business outcomes achieved: ROI documented?
- Case study / reference willing: strong signal of success

Scoring:
Each signal scored 1-10 → weighted average → health tier:

🟢 Healthy (score 7-10): monitor quarterly, look for expansion opportunities
🟡 At-risk (score 4-6): monthly check-ins, identify and resolve blockers
🔴 Critical (score 1-3): weekly engagement, executive escalation if needed

Build the health score model for my product with specific metric definitions.
```

### Churn prediction signals

```
Identify at-risk customers before they churn.

Product type: [SaaS]
Contract type: [monthly / annual / multi-year]
Historical churn rate: [X%]
Available data: [describe what you track]

Early warning signals by timeframe:

90+ DAYS BEFORE CHURN (strategic signals):
- Executive sponsor left the company (deal with successor immediately)
- Company went through acquisition or restructuring
- Budget freeze or headcount reduction announced (LinkedIn/news)
- Champion promoting your product has gone quiet or left

60-90 DAYS BEFORE CHURN (engagement signals):
- Login frequency dropped > 30% vs. 3-month average
- Core feature usage declining for 2+ consecutive months
- Opened support tickets about data export or API access (migration prep)
- NPS score dropped ≥ 2 categories (Promoter → Passive / Passive → Detractor)
- Support ticket asking about contract terms, renewal date, or cancellation process

30-60 DAYS BEFORE CHURN (commercial signals):
- Invoice overdue > 15 days without prior communication
- Customer asked for pricing comparison or RFP
- CS team has no touchpoint with primary contact in > 45 days
- Feature requests submitted but no response given

<30 DAYS BEFORE CHURN (last-chance signals):
- User count dropped significantly (offboarding users)
- Integration removed or API keys deactivated
- Customer not attending QBR or skipping scheduled calls
- Direct communication about dissatisfaction or competitive evaluation

Response playbook by risk level:
🔴 90+ day signal: CSM immediate outreach, executive sponsor introduction
🟡 60-90 day signal: health review call, identify success blockers, escalate to CS lead
🟠 30-60 day signal: executive alignment call, save offer if commercial, rapid response to complaints
🔴 <30 day signal: save call with decision-maker, understand root cause, last-chance offer

Build the churn signal detection playbook for my product and contract terms.
```

### QBR structure

```
Design a Quarterly Business Review for [customer].

Customer: [company name, tier, contract value]
Duration: [30 min / 60 min / 90 min]
Attendees: [customer exec sponsor + users / CS + AE / executive alignment]
Goal: [retention / expansion / case study / relationship building]

QBR agenda:

[10 min] OPENING: Relationship and agenda
- Thank them for the time
- Confirm agenda and desired outcomes for this session
- "What would make this the most valuable 60 minutes for your team?"

[15 min] THEIR BUSINESS: What's changed since last quarter?
- Ask before you tell: "What are your top 3 priorities for next quarter?"
- What challenges are you running into?
- Any changes in team, budget, or strategic direction?
[This section often reveals expansion opportunities or churn risks]

[20 min] VALUE DELIVERED: What they got from your product
- Usage metrics vs. last quarter (show growth or stability)
- Success against their stated goals from last QBR
- Specific outcomes: [X hours saved / $Y revenue influenced / Z% efficiency gain]
- Map your product's impact to their business priorities

[10 min] ROADMAP PREVIEW: What's coming that's relevant to them
- 1-3 upcoming features that directly address their use cases
- Get feedback: "Would this solve the problem you mentioned?"
- Avoid: "Here's everything we're building" — curate to their context

[15 min] OPEN ISSUES AND NEXT STEPS:
- Any open support tickets or unresolved pain points
- Expansion discussion if appropriate (don't force if trust isn't there)
- Confirm success criteria for next quarter
- Action items with owners and dates

[10 min] CLOSE:
- "What's the one thing we should do differently next quarter?"
- Renewal timeline and next touchpoints
- Ask for referral / case study / reference if relationship is strong

QBR rules:
- Send agenda 5 days in advance
- Spend > 50% of time listening, < 50% presenting
- Never start with a product demo — start with their business
- Always end with documented next steps

Generate the QBR deck outline and talking points for my specific customer.
```

### Customer onboarding plan

```
Build an onboarding plan for [new customer].

Customer: [size, technical sophistication, use case]
Contract: [$X ARR, [X] seats, [Y] key use cases purchased]
Success owner: [CSM name]
Timeline: [30/60/90 day onboarding]
Aha moment: [the specific outcome that shows them value quickly]

30-60-90 Day Onboarding Plan:

DAYS 1-7 — Setup and orientation:
□ Kickoff call: introductions, confirm success criteria, establish communication cadence
□ Technical setup: account provisioning, integrations, user invites
□ Admin training: the buyer / admin user can configure the tool independently
□ Quick win: identify the single most impactful use case — get it working this week

DAYS 8-30 — First value delivered:
□ Champion training: 1-2 internal power users trained and active
□ First core workflow running end-to-end
□ Check-in call (week 2): any blockers? What's working?
□ Activation milestone confirmed: [specific aha moment achieved]
□ Introduction to additional team members who should be using the product

DAYS 31-60 — Deepening adoption:
□ Expand to additional use cases or departments
□ Train remaining users on core workflows
□ Document early wins and ROI signals (prepare for internal stakeholder proof)
□ Mid-onboarding review: health score check, any churn signals identified

DAYS 61-90 — Business outcome focus:
□ Outcomes review: against the success criteria set in kickoff
□ ROI documentation: can the customer articulate value to their leadership?
□ Internal champion identified and nurtured
□ Path to expansion discussed (if usage supports it)
□ Case study / reference request if relationship is strong

Escalation triggers during onboarding (flag immediately):
- Tech setup not complete by Day 7
- No logins from non-admin users by Day 14
- CSM cannot reach primary contact for > 5 days
- Customer expresses dissatisfaction or unmet expectation in first 30 days

Generate the onboarding plan for my specific customer and product.
```

## Example

**User:** We have 50 customers paying $2K-$10K/month. No formal CS process. 3 churned last quarter with no warning. How do I build a basic health score with what I have?

**Claude's quick-start model:**

With no formal CS data yet, build from what you have — product logs + CRM + support tickets. This takes 1 week to set up.

**3-signal health score (start here, build up later):**

| Signal | Data source | Green | Yellow | Red | Weight |
|---|---|---|---|---|---|
| Monthly active users | Product DB | >60% seats active | 30-60% | <30% | 40% |
| Support tickets | Helpdesk | 0-2/month | 3-5/month | >5 or 0 for 60+ days | 30% |
| Days since last CS contact | CRM | <30 days | 31-60 days | >60 days | 30% |

**Score = weighted average of signal scores (1-10 per signal)**

**In your CRM right now:** create a health field on each account (Green/Yellow/Red). Manually review and set every account this week. Review monthly.

**The 3 churns had no warning because:** you had no score and no contact cadence. Fix contact cadence first — a 30-minute monthly call with each customer is worth more than a perfect health score model you build in 3 months.

**Immediate actions:**
1. Call every customer you haven't talked to in >60 days this week (probably 15-20 of 50)
2. Ask them: "What would make you renew without hesitation?" — you'll learn more from 10 calls than 3 months of analytics
3. Set a rule: no account goes > 45 days without a touchpoint

---
