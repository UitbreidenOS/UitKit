---
name: sales-enablement-creator
description: Creates sales playbooks, battlecards, objection handlers, and competitive guides based on deal data and market research. Generates ready-to-use collateral for reps to increase close rates and deal velocity.
allowed-tools: Read, Write, WebFetch
effort: medium
---

## When to activate

On-demand when launching new sales campaign, onboarding new reps, or when specific competitive threats emerge. Use to create standardized sales collateral and improve rep productivity.

## When NOT to use

Not for deal-specific strategy — use deal-analyzer instead. Not for territory planning — use territory-planner. Focus is on scalable, reusable enablement content.

## Enablement Assets to Create

### 1. Sales Playbook (Segmented)

One playbook per ICP segment (Enterprise, Mid-Market, SMB). Each includes:
- Ideal customer profile and buying signals
- Typical deal stages and timeline
- Key personas involved in buying decision
- Proven discovery questions
- Common objections and handling strategies
- Proof points and case studies
- Recommended next steps at each stage

### 2. Battlecard (Per Competitor)

One battlecard per primary competitor. Each includes:
- Competitor overview (what they do, strengths, weaknesses)
- Win/loss comparison (us vs. them)
- Proof points favoring our solution
- Objection handlers ("Why them vs. us?")
- Deal risk signals (losing to this competitor = what?)

### 3. Objection Handler Guide

Master list of most common objections with handling strategies:
- Price objection
- Timeline objection
- Competitive threat objection
- Authority objection
- Implementation risk objection
- [Custom objections based on recent deals]

### 4. Discovery Question Framework

Structured set of discovery questions to uncover:
- Business context (strategy, goals)
- Pain points (specific to our sweet spot)
- Buying triggers (urgency, timeline)
- Decision criteria and stakeholders
- Budget and approval process

---

## Playbook Template

Save as `enablement/playbook-[segment].md`

```markdown
# Sales Playbook — [Segment] (Enterprise / Mid-Market / SMB)

**Created:** [date]
**Target ICP:** [Company size, industry, revenue model, growth stage]
**Sales Cycle Length:** [X–Y weeks typical]
**Average Deal Size:** $[X]K–$[X]M
**Win Rate vs. Competitors:** [X]%

---

## Ideal Customer Profile

### Company Profile

- **Size:** [X–X employees]
- **Revenue:** $[X]M–$[X]M
- **Growth Rate:** [X–X]% YoY
- **Primary Industry:** [Industry focus]

### Buying Triggers (Look for these signals)

- [Trigger 1: e.g., "Recently hired VP Sales"]
- [Trigger 2: e.g., "Announced Series B funding"]
- [Trigger 3: e.g., "Launched new product line"]

### Key Personas

| Title | Motivation | Concerns | Discovery Focus |
|---|---|---|---|
| [e.g., VP Sales] | [Career success, quota] | [Resource constraints] | [Pain points in sales process] |
| [e.g., CFO] | [Cost control, ROI] | [Implementation risk] | [Budget impact, payback period] |
| [e.g., CRO] | [Revenue growth, market share] | [Competitive threat] | [Why now, competitive positioning] |

---

## Sales Cycle & Stages

### Timeline Overview

| Stage | Duration | Key Activities | Success Metric |
|---|---|---|---|
| Prospect | [X] days | Discovery meeting, pain validation | [Y] warm leads per week |
| Qualification | [X] days | Stakeholder interviews, budget confirmation | [Z] qualified opportunities per week |
| Solution Design | [X] days | Proposal, technical proof, stakeholder alignment | [Proposal accepted] |
| Negotiation | [X] days | Pricing, contract review, final approvals | [Deal signed] |

### Stage-Specific Talking Points

**Prospect Stage:**
- [Opening message/hook for cold outreach]
- [Value prop for initial meeting]
- [Questions to ask in discovery]

**Qualification Stage:**
- [Key pain points to confirm]
- [Budget conversation starter]
- [Timeline exploration questions]

**Solution Design Stage:**
- [How to present our solution]
- [How to position against alternatives]
- [Success criteria discussion]

**Negotiation Stage:**
- [Pricing psychology (anchoring, bundling)]
- [Contract discussion strategy]
- [Closing techniques]

---

## Discovery Questions (By Category)

### Business Context (5–7 minutes)

1. "Walk me through your [current process / sales strategy / operations]. What does that look like today?"
2. "What's your biggest priority for the next [6/12] months?"
3. "How are you measuring success in [relevant function]?"

### Pain Points (10–15 minutes)

1. "What's working well with [current approach]?"
2. "Where do you see the biggest opportunity for improvement?"
3. "What's costing you the most time / money / effort right now?"
4. "How are your [target users] currently solving for [pain]?"

### Budget & Timeline (5–7 minutes)

1. "When are you looking to have something in place?"
2. "Is there budget allocated for this type of solution?"
3. "Who else needs to be involved in this decision?"

### Buying Criteria (5 minutes)

1. "What would a successful implementation look like to you?"
2. "What would you absolutely need to see before moving forward?"

---

## Common Objections & Handlers

### "We're not ready yet / Too busy"

**Root Cause:** Lack of urgency or resource constraints  
**Handler:**
- Acknowledge: "I hear you. Most [segment] teams are stretched."
- Pivot to future: "What would need to happen for this to move up your priority list?"
- Create urgency: "We're seeing [peer companies] implement in [X months]. What's your timeline?"

### "Your price is too high"

**Root Cause:** Unclear ROI or budget constraint  
**Handler:**
- Explore budget: "What was budgeted for this initiative?"
- Reframe value: "Let's look at the cost of NOT solving [pain]. That typically costs [Company] $[X]M annually."
- Offer flexibility: "Would a phased approach or [lower-tier offering] work better for your budget?"

### "We'll stick with our current solution"

**Root Cause:** Switching cost, uncertainty, or lack of proof  
**Handler:**
- Validate concern: "I understand — switching has a cost. Let me ask: is [current solution] meeting all your needs?"
- Uncover gaps: "What are you missing? What would an ideal solution look like?"
- Provide proof: "Many [segment] customers came from [competitor]. Here's how they justified the switch..."

### "[Competitor] is less expensive"

**Root Cause:** Price-based buying criteria or not understanding differentiation  
**Handler:**
- Isolate comparison: "Are price and features the only factors, or are there other criteria?"
- Reframe: "Yes, they're cheaper. But let's compare: [feature A], [feature B], [support quality]. Here's how we differ..."
- Economic case: "Our customers report [X]% time savings, which ROI-adjusts the price difference to [Y]."

---

## Proof Points by Stage

**Early Stage (Qualification):**
- [Stat: e.g., "80% of customers report 30% faster sales cycles"]
- [Quote: e.g., "We couldn't have scaled without it"]
- [Case study: e.g., "See how XYZ Company did it"]

**Mid Stage (Solution Design):**
- [Demo: specific feature handling their pain]
- [Reference call: peer company in similar situation]
- [Custom ROI calculator: showing payback period]

**Late Stage (Negotiation):**
- [Customer success story: measurable outcome]
- [Implementation timeline: fastest path to value]
- [Ongoing support proof: uptime, SLA, customer satisfaction]

---

## Red Flags (Deal Risk Indicators)

- **Missing Economic Buyer:** Talking to users/IT but not budget owner
- **No Urgency Signal:** Timeline is "TBD" or "next year"
- **Unresolved Competitor:** They're actively evaluating competitors, and we haven't differentiated
- **Technical Skepticism:** CTO/IT worried about integration risk; not yet convinced of value
- **Budget Uncertainty:** "We might have budget" = no budget allocated yet
- **Consensus Gap:** Stakeholders disagreeing on need or solution fit

**Response if Red Flag:**
- Escalate to Sales Manager
- Run deal-analyzer for deeper assessment
- Adjust timeline expectations or hold deal in lower stage

---

## Key Metrics to Track

- **Use This Playbook:** % of reps using questions / objection handlers
- **Conversion by Segment:** Win rate using playbook vs. historical average
- **Cycle Time Impact:** Average days per stage for reps following playbook
- **Rep Productivity:** Deals closed per rep monthly (compare before/after enablement)

---
