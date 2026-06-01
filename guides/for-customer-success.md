# Claude for Customer Success Managers

Everything a Customer Success Manager needs to run AI-augmented health monitoring, QBRs, churn prevention, and expansion conversations — without spending hours on prep and reporting.

---

## Who this is for

You are a CSM responsible for a portfolio of accounts — retaining them, expanding them, and making them successful. You're measured on Net Revenue Retention and renewal rates. You spend too much time on QBR prep, health score reviews, and writing follow-up emails, and not enough time actually building customer relationships.

**Before Claude Code:** 4-6 hours to prep a QBR. 2 hours a week manually reviewing account health. 30 minutes writing a follow-up email after every call. No consistent expansion playbook.

**After:** QBR fully prepped in 45 minutes. Health review done in 15 minutes with structured recommendations. Follow-up emails in 5 minutes. Expansion opportunities identified proactively, not reactively.

---

## 30-second install

```bash
# Install the full CS stack
npx claudient add skill gtm/customer-success
npx claudient add skill gtm/qbr-builder
npx claudient add skill gtm/health-score-analyzer
npx claudient add skill gtm/expansion-playbook
npx claudient add skill marketing/churn-prevention
npx claudient add skill small-business/customer-feedback-synthesizer
npx claudient add skill gtm/revenue-operations
npx claudient add agent advisors/cco-advisor
```

---

## Your Claude Code CS stack

### Skills (slash commands)

| Skill | What it does | When to use |
|---|---|---|
| `/health-score-analyzer` | Score accounts on usage, relationship, and commercial signals; churn risk rating | Monday portfolio review |
| `/qbr-builder` | Full QBR prep: agenda, talking points, ROI quantification, expansion discussion | 2 weeks before any QBR |
| `/expansion-playbook` | Identify expansion signals, build upsell narrative, handle pricing conversations | When an account is ready to grow |
| `/customer-success` | Health score model design, churn signals, onboarding plans | Building CS processes |
| `/churn-prevention` | At-risk customer analysis and save playbooks | RED accounts needing intervention |
| `/customer-feedback-synthesizer` | Synthesise feedback from surveys, calls, and tickets into themes | Quarterly voice of customer |
| `/revenue-operations` | NRR calculation, renewal pipeline, CS metrics and forecasting | CS operations and reporting |

### Agents

| Agent | Model | When to spawn |
|---|---|---|
| `cco-advisor` | Opus | Strategic CS decisions: coverage models, tier strategy, org design |

---

## Daily workflow

### Morning (20-30 minutes)

**1. Portfolio health review — run every Monday**
```
/health-score-analyzer

Run my portfolio health review for the week of [DATE].

My accounts:
| Account | ARR | Renewal | Last Login | Active Seats | Last Touch | Issues |
|---|---|---|---|---|---|---|
| [Company A] | $48K | 3 months | 5 days ago | 12/15 | 7 days ago | None |
| [Company B] | $120K | 6 weeks | 22 days ago | 4/20 | 14 days ago | Support ticket open |
| [Company C] | $24K | 8 months | 2 days ago | 8/8 | 3 days ago | Asked about export |

Give me:
1. Health score and risk tier for each account
2. This week's intervention priority list
3. Any accounts showing churn signals I should escalate
4. Renewals in the next 90 days and their readiness status
```

**2. Daily at-risk check — takes 5 minutes**
```
/health-score-analyzer

Quick check: have any new risk signals emerged in the last 24-48 hours for my portfolio?

Recent signals:
- [Company X] hasn't logged in for [X days]
- [Company Y] opened a support ticket about [topic]
- [Company Z] — champion [name] just changed jobs on LinkedIn

Assess risk and give me the action for each.
```

---

### QBR preparation (2 weeks before)

**3. Full QBR builder**
```
/qbr-builder

Build my QBR for [Customer Name].

Customer: [Company]
ARR: $[X]
Renewal: [date]
Attendees: [their title, their title] + [my title, AE name]
Duration: [60 minutes]
Goal: [retain and set up expansion / relationship recovery]

Their context:
- Success criteria from kickoff: [X, Y, Z]
- Primary use case: [describe]
- Business changes this quarter: [any changes in their team, budget, strategy]
- Usage data: [summarise — logins, active seats, core features used]
- Open issues: [any unresolved support tickets or complaints]

Commercial:
- Health: [GREEN / YELLOW / RED]
- Expansion opportunity: [seats / tier / add-on] — $[X] potential
- Competitive threat: [yes/no — describe if yes]

Build: full agenda, talking points per section, ROI slide content,
expansion conversation framework, and 3 objection responses.
```

---

### Expansion conversations

**4. Expansion signal identification and narrative**
```
/expansion-playbook

Identify expansion opportunity for [Company].

Current contract: $[X] ARR, [N] seats, [plan/tier]
Usage signals:
- Seat utilisation: [X of N seats active]
- New use case observed: [describe]
- Growth signals: [their headcount up X%, new team mentioned, etc.]

Expansion opportunity: [additional seats / tier upgrade / add-on]
Potential additional ARR: $[X]
Health: [GREEN — required]

Build:
1. Which signals indicate readiness (and which are too weak to act on yet)
2. The expansion narrative for my next call
3. Pricing conversation framework and 3 objection scripts
4. Whether to handle this in CS or loop in AE
```

---

### Customer escalations

**5. Churn prevention — RED accounts**
```
/churn-prevention

This customer is at serious churn risk. Build me a save plan.

Customer: [Company]
ARR: $[X]
Renewal: [X weeks/months away]
Risk signals: [describe all of them — usage, relationship, commercial]
Root cause hypothesis: [what do you think is really wrong?]
What's been tried: [previous outreach attempts and outcomes]

Produce:
- Recovery QBR structure (who to bring, how to open it)
- Specific offers to make or actions to take
- Escalation path if standard save doesn't work
- Go/no-go on save: is this account saveable, or is churn probable regardless?
```

---

### Customer feedback synthesis (quarterly)

**6. Voice of customer**
```
/customer-feedback-synthesizer

Synthesise customer feedback from last quarter.

Sources:
- NPS surveys: [paste results or summarise themes]
- Support ticket categories: [describe most common ticket types and volume]
- QBR notes: [paste key themes from customer conversations]
- Churn reasons: [why did churned customers leave?]

Output needed:
- Top 3 pain points customers are experiencing
- Top 3 things customers say they love
- Product gaps most frequently mentioned
- Actionable recommendations for: product team, CS team, leadership
- NPS trend and what's driving promoters vs. detractors
```

---

## 30-day ramp plan (new CSMs)

### Week 1 — Know your portfolio
- Install all CS skills
- Run `/health-score-analyzer` on every account — establish your baseline portfolio health map
- Read every open support ticket across your portfolio — know what's burning before you meet customers
- Schedule intro calls with every account in your first 30 days (even healthy ones)

### Week 2 — First customer calls
- Use `/qbr-builder` to prep even for informal check-in calls — questions are the same
- After every call: write up follow-up email and CRM note with Claude in under 10 minutes
- Use `/expansion-playbook` to map which accounts have expansion potential — even if you won't act on it yet
- Identify your top 3 highest-risk accounts by end of week 2

### Week 3 — Health score and process
- Use `/health-score-analyzer` to score every account formally — document in CRM
- Establish your weekly health review rhythm
- Review the health score model with your CS manager — align on the tiers and scoring weights
- Run your first at-risk account through `/churn-prevention` — even if it's just an exercise

### Week 4 — QBR and expansion
- Run your first QBR using `/qbr-builder` — have a senior CSM shadow or review your prep
- Identify 2-3 accounts ready for an expansion conversation — present the plan to your manager first
- Review your CRM hygiene: are all accounts updated with health scores, last touch dates, renewal dates?
- Report to your manager: portfolio health, ARR at risk, top opportunities

---

## Tool integrations

### HubSpot CRM (recommended)

```json
// Add to ~/.claude/settings.json
{
  "mcpServers": {
    "hubspot": {
      "command": "npx",
      "args": ["-y", "@hubspot/mcp-server"],
      "env": {
        "HUBSPOT_ACCESS_TOKEN": "your-token-here"
      }
    }
  }
}
```

With HubSpot connected, Claude can:
- Read account health fields, last touch dates, and renewal dates directly
- Update account health scores after your portfolio review
- Create follow-up tasks from QBR action items
- Pull renewal pipeline reports

### Gainsight / ChurnZero / Totango

If your team uses a dedicated CS platform, export account health data as CSV → paste into `/health-score-analyzer` for analysis and recommendations. Claude works with the output of any CS platform.

### Gong / Chorus (call recording)

Get call transcript → ask Claude to extract:
- Key themes from the customer call
- Action items with owners
- Health signals (positive and negative mentions)
- CRM note and follow-up email draft

```
Here's the transcript from my call with [Customer] today:
[paste transcript]

Extract:
1. CRM update note (2-3 sentences: what was discussed, health signals, next steps)
2. Follow-up email to send today
3. Action items: owner + due date for each
4. Any churn signals or expansion signals I should flag
```

### Notion / Confluence (QBR templates)

Generate QBR deck outline with `/qbr-builder` → build slides in Google Slides or Notion → use Claude to refine the narrative during prep.

---

## Metrics to track

| Metric | Definition | Green | Yellow | Red |
|---|---|---|---|---|
| Net Revenue Retention | (MRR + expansion - churn) / beginning MRR | > 110% | 95-110% | < 95% |
| Gross Revenue Retention | Renewal rate excl. expansion | > 90% | 80-90% | < 80% |
| Average health score | Portfolio-wide average health rating | > 70/100 | 55-70 | < 55 |
| At-risk ARR | % of portfolio in RED health | < 10% | 10-20% | > 20% |
| QBR completion rate | % of eligible accounts with completed QBR in quarter | 100% | 75-99% | < 75% |
| Days since last touch | Portfolio average | < 30 days | 30-60 days | > 60 days |
| Expansion ARR sourced by CS | Upsell and expansion sourced without AE involvement | Track and grow each quarter |

---

## Common CS mistakes (and how Claude Code helps avoid them)

**Mistake 1: No proactive health monitoring**
`/health-score-analyzer` every Monday forces a structured portfolio review. You find problems before customers tell you — not after they've made the decision to leave.

**Mistake 2: QBRs that are product demos**
`/qbr-builder` opens every QBR with their business priorities, not a product walkthrough. Customers don't renew because of a good demo — they renew because you helped them achieve something.

**Mistake 3: Expansion conversations that start with pricing**
`/expansion-playbook` builds the value narrative before any commercial discussion. Pitching price before establishing need is the fastest way to get a no.

**Mistake 4: Reactive churn management**
The health score and signal detection in `/health-score-analyzer` identify at-risk accounts 60-90 days before renewal — when you still have time to intervene. Waiting for the customer to tell you they're leaving is too late.

**Mistake 5: Not quantifying ROI**
Every QBR needs a ROI slide. `/qbr-builder` forces you to quantify what the customer achieved — not in product features, but in business outcomes. "You saved 12 hours per week per team member" is a renewal argument. "We shipped 4 new features" is not.

---

## Resources

- [Getting started with Claude Code](./getting-started.md)
- [QBR builder skill](../skills/gtm/qbr-builder.md)
- [Health score analyzer skill](../skills/gtm/health-score-analyzer.md)
- [Expansion playbook skill](../skills/gtm/expansion-playbook.md)
- [CS QBR prep workflow](../workflows/cs-qbr-prep.md)
- [Churn prevention skill](../skills/marketing/churn-prevention.md)

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
