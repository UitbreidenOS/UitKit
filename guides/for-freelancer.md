# Claude for Freelancers and Consultants

Everything a freelancer or independent consultant needs to run AI-augmented client acquisition, project management, billing, and business development in Claude Code.

---

## Who this is for

You are a freelancer or independent consultant — designer, developer, writer, strategist, marketer, or specialist — running your own client-services business. Your income depends on winning projects, delivering them well, getting paid, and filling the pipeline continuously. You spend 30% of your time on business operations that don't generate revenue. Claude Code cuts that overhead so you can spend more time on billable work and business development.

**Before Claude Code:** 2 hours to write a winning proposal. 45 minutes to draft a scope of work. 30 minutes per client status report. Hours chasing unpaid invoices each month.

**After:** Proposal in 20 minutes. Scope of work in 15 minutes. Status report in 8 minutes. Invoice follow-up drafted in 60 seconds.

---

## 30-second install

```bash
# Install all freelancer skills
npx claudient add skill small-business/freelancer-proposal
npx claudient add skill small-business/scope-of-work
npx claudient add skill small-business/client-status-report
npx claudient add skill small-business/invoice-chaser
npx claudient add skill small-business/cold-outreach
npx claudient add skill small-business/cash-flow-forecast
npx claudient add skill small-business/agency-operations

# Install the CEO advisor agent
npx claudient add agent advisors/ceo-advisor
```

---

## Your Claude Code freelancer stack

### Skills (slash commands)

| Skill | What it does | When to use |
|---|---|---|
| `/freelancer-proposal` | Win more projects — proposal writing with clear value props, pricing rationale, and call to action | Any new project opportunity |
| `/scope-of-work` | Define deliverables, exclusions, timeline, payment, and change order policy | Before starting every project |
| `/client-status-report` | Weekly/monthly client updates — progress, blockers, decisions needed | Active project management |
| `/invoice-chaser` | Professional payment follow-up for late invoices — escalating sequence | Any overdue invoice |
| `/cold-outreach` | Outbound prospecting to new clients — personalized, not spammy | Business development |
| `/cash-flow-forecast` | 90-day cash forecast — when money comes in, when bills go out | Monthly financial planning |
| `/agency-operations` | SOPs, onboarding, team processes if you're scaling | Growing beyond solo |

### Agent

| Agent | Model | When to spawn |
|---|---|---|
| `ceo-advisor` | Sonnet | Pricing decisions, difficult client situations, business strategy |

---

## Daily workflow

### Morning (15 minutes)

**1. New opportunity — scope and respond**
```
/freelancer-proposal

New project inquiry received. Here's what they told me:
[Paste client message or brief]

My services: [what you do]
My rate: $[X]/hour or $[X] for this type of project
Key questions I have: [what you need to know before proposing]

Draft a response that:
1. Acknowledges their inquiry
2. Asks 2-3 clarifying questions (not 10 — respect their time)
3. Gives a rough ballpark if I have enough to do so
4. Proposes a 20-minute call to discuss

Tone: confident, expert, warm.
```

**2. Active project — status report for client**
```
/client-status-report

Weekly status update for [client name] — [project name].

Week of: [dates]
Completed: [list what you did]
In progress: [current work]
Blocked on: [what you need from them — be specific]
Next week: [what you'll do]
```

---

### When winning a new project

**3. Winning proposal**
```
/freelancer-proposal

Write a proposal for this project opportunity.

Client: [company name, contact name]
What they need: [project description]
Budget (if disclosed): $[X]
Timeline they mentioned: [X weeks/months]
How I'll approach it: [your methodology]
Why I'm the right choice: [relevant experience, past results]

My proposed price: $[X]
```

**4. Scope of work — protect yourself**
```
/scope-of-work

Write a scope of work for the project we just agreed on.

Client: [name]
Project: [description]
Deliverables: [specific list]
Exclusions: [what I'm not doing]
Timeline: [dates]
Payment: $[X], [X]% upfront, [X]% on delivery
Revisions: [X rounds included]
Change order rate: $[X]/hour
```

---

### When you haven't been paid

**5. Invoice follow-up**
```
/invoice-chaser

Invoice #[X] for $[X] is [X] days overdue.

Client: [name]
Invoice date: [date]
Due date: [date]
Payment terms: [Net 15 / Net 30]
Contact: [name, email]
Prior follow-ups: [none / emailed on [date] / called on [date]]

Draft a follow-up that escalates appropriately for [X] days overdue.
Keep the door open for payment while being clear about the seriousness.
```

---

### Business development (weekly)

**6. Outbound prospecting**
```
/cold-outreach

Research and draft outreach to a potential client.

Target: [company name or type of business]
Contact: [name, title if known]
Why they might need me: [your assessment]
My relevant experience: [what I've done that's relevant]
What I'm offering: [what you'd do for them]

Write a personalized outreach email. Not a sales pitch — more like a professional introduction with a specific observation about their business.
```

---

### Monthly financial review

**7. Cash flow forecast**
```
/cash-flow-forecast

90-day cash flow forecast for my freelance business.

Current cash: $[X]
Contracts signed with upcoming payments:
- [Client A]: $[X] due [date]
- [Client B]: $[X] due [date]

Outstanding invoices (not yet paid):
- Invoice #[X] — [client] — $[X] — [X] days overdue

Monthly expenses:
- [Software/tools]: $[X]/month
- [Accounting/admin]: $[X]/month
- [Other]: $[X]/month

Upcoming expenses (one-time):
- [Item]: $[X] in [month]

Pipeline (not yet signed):
- [Prospect A]: $[X] — probability [high/medium/low]
- [Prospect B]: $[X] — probability [medium]

Show me: month-by-month cash flow, when I might have a shortfall, what's driving it.
```

---

## 30-day ramp plan (new freelancers or new market)

### Week 1 — Business infrastructure
- Install all freelancer skills: `npx claudient add skill small-business/[name]`
- Write your standard proposal template using `/freelancer-proposal` — personalize for your services
- Write your master scope of work template using `/scope-of-work` — use it for every future project
- Define your pricing: hourly rate, project rates, retainer rates — document them

### Week 2 — Active client management
- Use `/client-status-report` on all active projects — set a weekly Friday cadence
- Use `/invoice-chaser` on any overdue invoice — don't let it slide past 7 days
- Run `/cash-flow-forecast` to understand your 90-day position

### Week 3 — Business development
- Identify 10 potential clients using your existing network
- Use `/cold-outreach` to draft personalized messages for each — spend 5 minutes personalizing per message
- Track responses — what hook works best for your market?

### Week 4 — Systematize
- Use `/agency-operations` to document your onboarding process (what new clients receive in week 1)
- Write a client FAQ using Claude — reduces time spent answering the same questions
- Review your rates: are you tracking time accurately? Are you underpriced?

---

## Pricing and business strategy

Use the CEO advisor agent for difficult business decisions:

**Raising rates:**
```
/ceo-advisor

I want to raise my rates from $[X]/hour to $[X]/hour. My current clients pay $[X]. I've been freelancing for [X] years. My pipeline is full.

Help me think through:
- How to communicate the rate increase to existing clients
- Whether to grandfather existing contracts or apply immediately
- How to position my new rate to new clients
- Whether to switch to project pricing instead of hourly
```

**Firing a bad client:**
```
/ceo-advisor

I have a client who [describe the problem: pays late, constant scope creep, disrespectful, unprofitable]. They represent [X]% of my monthly revenue.

Help me think through:
- Whether to fire them or try to fix the relationship
- If I should fire them, how to do it professionally
- How to replace the revenue
```

**Evaluating a retainer offer:**
```
/ceo-advisor

A client wants to put me on a monthly retainer for $[X]/month for [X] hours. My current day rate is $[X].

Is this a good deal? What should the retainer terms look like? What are the risks?
```

---

## Tool integrations

### Invoicing (Wave, FreshBooks, Bonsai)
Claude drafts your professional proposal and scope of work → you paste into your invoicing tool to create the project and generate invoices. For invoice follow-up, use `/invoice-chaser` to draft emails → send from your invoicing tool or directly.

### Time tracking (Toggl, Harvest, Clockify)
Track time in your tool → export weekly totals → paste into `/client-status-report` to contextualize your deliverables with time spent (useful for hourly billing transparency).

### Contract signing (DocuSign, PandaDoc, HelloSign)
Claude generates the SOW text → paste into your e-signature tool → send for signature. For recurring clients, save your Claude-generated templates in PandaDoc or Bonsai.

### CRM / pipeline (HubSpot free, Notion, Airtable)
Use a simple Kanban for your pipeline: Prospect → Proposal Sent → Negotiating → Active → Invoiced → Paid. Claude helps with each stage — `/cold-outreach` for Prospect, `/freelancer-proposal` for Proposal Sent, `/scope-of-work` for Active.

---

## Metrics to track

| Metric | Target | Track monthly |
|---|---|---|
| Win rate on proposals | >35% | Proposals sent / projects won |
| Average project value | [your target] | Growing or stagnant? |
| Days to payment | <15 days | Flag clients paying slow |
| Utilization rate | 70-80% of work hours billable | Above 80% = raise rates or hire |
| Revenue per client | Track top 3 clients | Don't let any one client >40% of revenue |
| Business development hours | 5-10% of your time | If zero, you'll have a feast/famine cycle |
| Net income margin | >50% (service business) | Your cut after tools, taxes, admin |

---

## Common mistakes (and how Claude Code prevents them)

**Mistake 1: Vague scope = scope creep**
`/scope-of-work` forces you to enumerate every deliverable and list every exclusion. No vague scope allowed.

**Mistake 2: No change order process**
`/scope-of-work` includes the change order clause. Every additional request triggers it — no more free work.

**Mistake 3: Not following up on late invoices**
`/invoice-chaser` makes follow-up take 60 seconds. No more "I'll do it when I have a moment."

**Mistake 4: Proposals that describe process instead of outcomes**
`/freelancer-proposal` leads with client outcomes first. Your process is secondary to their results.

**Mistake 5: Cash flow surprises**
`/cash-flow-forecast` every month. Know your 90-day position before it becomes a crisis.

---

## Resources

- [Getting started with Claude Code](getting-started.md)
- [Scope of work skill](../skills/small-business/scope-of-work.md)
- [Client status report skill](../skills/small-business/client-status-report.md)
- [Invoice chaser skill](../skills/small-business/invoice-chaser.md)
- [Freelancer weekly workflow](../workflows/freelancer-weekly.md)

---
