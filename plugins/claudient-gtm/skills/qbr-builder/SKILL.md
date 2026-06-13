---
name: "qbr-builder"
description: "Quarterly Business Review builder: customer health recap, ROI delivered, goals for next quarter, renewal and expansion discussion framework"
---

# QBR Builder Skill

## When to activate
- You have a QBR scheduled in the next 2 weeks and need to build the deck and talking points
- You need to quantify ROI delivered to a customer before a renewal conversation
- Preparing for an executive-level review with a customer's C-suite
- Building a QBR template your whole CS team can use consistently
- Recovering a relationship before a QBR — you know the customer is unhappy and need a strategy

## When NOT to use
- Onboarding calls or monthly check-ins — those have different structures, use `/customer-success`
- Sales presentations to prospects — different tool, different goal
- Internal business reviews (not customer-facing) — use a different workflow
- QBRs where you have no usage data or outcomes to present — gather data first

## Instructions

### Full QBR builder prompt

```
Build a complete QBR for my customer.

Customer: [Company name]
Tier: [Strategic / Enterprise / Growth / Standard]
ARR: $[X]
Renewal date: [date — how many months away?]
CSM: [name]
Customer contacts attending: [exec sponsor title, champion title, others]
My contacts attending: [CSM, AE, VP CS if strategic]
Duration: [30 / 45 / 60 / 90 minutes]
Primary goal for this QBR: [retain / expand / case study / relationship reset]

Their business context:
- What industry are they in? [X]
- What were their stated success criteria at the start of the contract? [X, Y, Z]
- Have there been any changes in their business? [leadership change / merger / headcount / budget]
- What is their primary use case for our product? [X]

Our product context:
- Usage data: [logins, active users, core feature usage — describe what you have]
- Product changes this quarter relevant to them: [features shipped, bugs fixed]
- Open support tickets or unresolved issues: [describe]
- Did they participate in any beta features or requests? [yes/no]

Commercial context:
- Current MRR/ARR: $[X]
- Expansion opportunity: [additional seats / add-ons / higher tier] — $[X] potential
- Competitive threat: [are you aware of any competitive evaluation?]
- Renewal health: [green / yellow / red — and why]

Produce:

## QBR AGENDA (for 60-minute session)

[5 min] Opening and relationship check
[15 min] Their business — what's changed since last quarter
[20 min] Value delivered — what they achieved with our product
[10 min] Roadmap — what's coming that matters to them
[10 min] Next quarter goals and success criteria

## TALKING POINTS FOR EACH SECTION

For each agenda section:
- 2-3 questions to ask (listen before you talk)
- Key data points to share
- What to watch for (signals: positive = expansion; negative = churn risk)
- How to handle if they're unhappy

## ROI SLIDE (the most important slide in any QBR)
- Outcome 1: [specific result tied to their stated success criteria]
- Outcome 2: [specific result]
- Outcome 3: [specific result]
- If hard ROI unavailable: use leading indicators (time saved, errors reduced, adoption rate)
- Never say "we helped you" — say "you achieved X, and here's how our product enabled it"

## RENEWAL AND EXPANSION DISCUSSION
- When to raise: not until you've delivered the value section
- How to frame: "Based on what you've achieved, here's what we'd recommend for next quarter..."
- Expansion narrative: [specific to their situation and usage signals]
- Objection handling: [likely objections given their current health]

## PRE-QBR CHECKLIST
□ Sent agenda 5 days in advance
□ Confirmed exec sponsor attendance
□ Pulled all usage data from product analytics
□ Reviewed all support tickets from last 90 days
□ Prepared ROI quantification
□ Briefed AE or VP on commercial situation
□ Know the one thing that could go wrong and have a plan
```

### ROI quantification framework

```
Quantify the ROI this customer has received from our product this quarter.

Customer: [Company]
Product: [describe what it does]
Their use case: [specific workflow they use it for]
Contract value: $[X] ARR

ROI framework — use whichever dimensions apply:

TIME SAVINGS
- Process before our product: [describe manual steps]
- Time saved per task: [X hours]
- Frequency: [X times per week/month]
- Team size doing this task: [N people]
- Annual hours saved: [X hours/week × N people × 52 weeks]
- Value at $[X]/hour fully-loaded cost: $[X] annual value
- ROI multiple: $[X value] / $[X ARR] = [X:1] ROI

ERROR REDUCTION / QUALITY
- Error rate before: [X%] errors per [task]
- Error rate now: [X%]
- Cost per error (rework, customer impact, reputation): $[X]
- Annual savings from error reduction: $[X]

REVENUE IMPACT
- Did our product help them close more deals, retain customers, or grow revenue?
- Revenue influenced or protected: $[X]
- Attribution: [how do you know our product drove this?]

HEADCOUNT AVOIDED
- Would they have needed to hire [N] additional people without our product?
- Salary + benefits per hire: $[X]
- Headcount cost avoided: $[X]

SPEED TO MARKET
- How much faster do they ship / complete work?
- Before: [X days] → After: [X days]
- Competitive value of moving faster: [qualitative or quantitative]

TOTAL VALUE DELIVERED THIS QUARTER: $[X]
CONTRACT COST THIS QUARTER: $[X ARR / 4] = $[X]
ROI MULTIPLE: [X:1]

If you don't have hard data: use customer's own words from support tickets, NPS surveys, or prior conversations. "You told us in your last check-in that [X]" is better than no evidence.

Present this as THEIR achievement, not yours.
```

### Executive alignment conversation

```
Prepare me for the executive portion of a QBR.

Customer exec: [title, what you know about their priorities]
Risk level: [strategic account at risk / healthy and expanding / unknown]
My ask from this conversation: [renewal signature / expansion discussion / case study / reference]

Executive conversation framework:

DO NOT start with product. Start with their business.

Opening questions (choose 2):
- "What are your top 3 priorities for [company] over the next 12 months?"
- "What does success look like for your team by end of year?"
- "What's the biggest obstacle between where you are now and where you want to be?"
- "What would make you confident you're investing in the right tools for next year?"

Bridge from their priorities to your product:
"Based on what you've described — [their priority] — here's how [your product] is directly supporting that..."
Then deliver your ROI statement in one sentence.

Handling exec disengagement:
- If they check their phone: ask a direct question immediately — "Is there something specific you'd like us to address in today's session?"
- If they're not the real decision-maker: "Who else should be part of this conversation for next quarter's planning?"

Handling exec dissatisfaction:
- Do not get defensive. Acknowledge and ask.
- "Thank you for being direct — that's what I need to hear. Can you help me understand what the most important thing is we need to fix?"
- Then listen fully before responding.
- Follow up the same day with a written summary of what you heard and a concrete action plan.

Expansion bridge (use only if relationship is strong and value is established):
"Given what you've achieved this quarter and what you've told me about [their priority], I'd like to show you what's possible if we extend our work together into [new use case / additional seats / next tier]."

NEVER: pitch expansion before you've established value. Sequence matters.

Produce talking points tailored to my specific exec and situation.
```

### QBR recovery plan (at-risk customer)

```
My QBR customer is unhappy. Help me prepare a recovery QBR.

Customer: [Company]
Health: RED
Primary complaint: [what they've said or signaled]
Root cause (your assessment): [product gap / onboarding failure / support failure / wrong champion / mis-sold]
Renewal: [X months away]
Their alternative: [churning / moving to competitor / reducing scope]

Recovery QBR framework:

BEFORE THE CALL
- Do not wait for the QBR to acknowledge the issue. Send an email 3 days before:
  "I want to make this QBR the most productive conversation we've had. I know [specific issue] hasn't been where it needs to be, and I want to dedicate real time to addressing it directly."
- Bring your VP of CS or an executive — signals you take it seriously
- Prepare a written action plan in advance — do not improvise

OPENING (first 5 minutes)
- Do not open with your agenda. Open with acknowledgement:
  "Before we go through the agenda, I want to address [issue] directly. We haven't lived up to what we committed to in [area], and I want to spend time on how we fix that."
- Pause. Let them respond. Listen fully.

THE RECOVERY OFFER
- What specifically will change? [list 3 concrete actions with owners and dates]
- What can you offer as a gesture? [dedicated support / product fix ETA / discount / service credit]
- What does success look like in 60 days? [define it together]
- "If we deliver on these three things by [date], would you be willing to commit to renewing?"

WHAT NOT TO DO
- Do not blame your product team, support team, or colleagues on the call
- Do not promise features you cannot ship
- Do not make the call about saving the contract — make it about making them successful
- Do not minimise their complaint with data that contradicts their experience

POST-CALL WITHIN 24 HOURS
- Written summary of commitments made
- Named owner for each action
- Next check-in date within 2 weeks (not next quarter)

Produce the specific recovery QBR plan for my customer.
```

## Example

**User:** I have a QBR with Acme Corp next Tuesday. They're $180K ARR, renewing in 3 months. Their CFO and Head of Ops will be there. They had some complaints about slow support response in Q2 but usage is up 40% YoY. How do I structure this?

**Claude's QBR plan:**

**Strategic priority: Protect $180K renewal, set up expansion conversation.**

**Agenda for Acme Corp QBR — 60 minutes:**

- [0:00] Open: "Before we get into our agenda — I want to check in directly. We had some rougher moments on support response in Q2. I want to understand if that's resolved or if it's still a concern." [Listen — this surfaces the risk before it blindsides you]

- [0:10] Their business: "Heading into Q4 and renewal planning — what are your top priorities as an operations leader heading into next year?" Ask the CFO: "Where are you seeing the most pressure on costs or efficiency right now?" [Let them talk. This reveals expansion signals.]

- [0:20] Value delivered: "Here's what your team accomplished this quarter..." Lead with 40% usage growth as a signal of adoption health. Convert that to ROI: at 40% more usage, what work are they doing that they weren't before? Quantify in hours or errors reduced.

- [0:35] Support acknowledgement: "I want to be direct about Q2 support. Response times averaged 36 hours against our 12-hour SLA. That's not acceptable. Here's what we changed: [specific fix]. Here's our current average: [current data]. I'll send you a monthly SLA report."

- [0:45] Roadmap: Show 2 features specifically relevant to Ops — no product dump.

- [0:55] Next steps: "Based on your priorities for next year — [what they said] — I'd like to propose we discuss [expansion use case] as part of your renewal. Can we schedule 30 minutes with [your AE] before the end of month?"

**Key risk:** If the CFO raises support quality as a renewal condition, have a service credit ready to offer — not volunteered, but ready if they push.

---
