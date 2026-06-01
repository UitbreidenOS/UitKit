# Founder Weekly Workflow

A repeatable weekly cadence for a startup CEO using Claude Code — covering company pulse, investor comms, team alignment, OKR tracking, and the Friday wrap that sets up the following week.

---

## Overview

**Time investment:** 2-3 hours of structured Claude Code sessions per week (replaces 8-12 hours of scattered, low-leverage work).

**What this workflow covers:**
- Monday: company pulse, CEO priority-setting, leadership agenda
- Tuesday-Thursday: deal flow, hiring, investor conversations (context-driven)
- Friday: weekly review, investor update draft, all-hands prep, next-week priorities

**Prerequisite:** `/founder-weekly-review` and `/investor-update` installed. Optional but recommended: `/board-deck-builder`, `/financial-plan`, `/ceo-advisor`.

---

## Monday — Company pulse and week plan (60-90 minutes)

### 8:30-9:00am — Weekly company review

**Goal:** Know the state of the business before your first meeting. No surprises from your own company.

```
/founder-weekly-review

Week of [DATE] — Monday morning company pulse.

Data from last week (pull from Slack / your metrics dashboard):
- MRR / ARR: [$X] vs. [$X last week]
- New revenue: [new logos, expansion, churn]
- Pipeline: [deals closed, deals lost, new pipe created]
- Product shipped: [what went live last week]
- Team news: [hires, departures, performance flags, any PTO patterns]
- Cash: [$X] | Burn: [$X this month pace] | Runway: [X months]
- Any customer escalations or support spikes?

Produce: traffic-light company health, OKR check, last week wins + lowlights, CEO priority for this week, the one decision I need to make.
```

**Decision from this session:**
- What does the CEO focus on today?
- Is there a fire that requires immediate attention?
- Who do I need to have a 1:1 with this week?

---

### 9:00-9:30am — Leadership team agenda prep

**Goal:** Every leadership team meeting should have a clear agenda. Never use the recurring meeting for status updates.

```
/ceo-advisor (or prompt Claude directly)

Set the leadership team agenda for [DATE].

Meeting duration: [45 / 60 minutes]
Attendees: [CEO, CTO, CRO, CPO, etc.]
Standing sections:
- Company metric update: 5 min (CEO shares MRR and runway — everyone already knows, confirmation only)
- Cross-functional blockers: 10 min (what needs a decision today?)
- Strategic topic: 25 min (one topic, discussed deeply)
- Decisions made: 5 min (explicit — list what was decided, who owns it)

This week's strategic topic candidates (pick one):
- [Topic 1]
- [Topic 2]
- [Topic 3]

Which topic most needs CEO + leadership attention this week?
Produce the agenda with the right topic and pre-reading links.
```

---

## Tuesday/Wednesday — Deal flow, hiring, and investor work

These days are execution-heavy. Use Claude Code in short sessions between calls.

### Investor pipeline management

```
/commercial-forecaster (or /ceo-advisor)

My Series A investor pipeline:

| Investor | Fund | Stage | Last contact | Next step | Close probability |
|---|---|---|---|---|---|
| [Name] | [Fund] | First meeting | [Date] | Send data room | 30% |
| [Name] | [Fund] | Second meeting | [Date] | Partner meeting | 60% |
| ... | | | | | |

Total in process: [N investors]
Meetings this week: [N]
Target: [$X] committed by [DATE]

Analyse: which investors are most likely to move fast? Who should I prioritise this week?
What additional materials or follow-ups would accelerate each?
```

### Key hire prep

```
/ceo-advisor

I'm interviewing [NAME] for [ROLE] on [DATE].

Their background: [paste LinkedIn or describe]
Stage fit concern: [e.g., they've only been at $100M+ companies]
What we need: [skills, mindset, stage-appropriate traits]

Help me:
1. The 5 most important questions to ask in this 45-minute slot
2. What "good" vs. "great" vs. "no hire" looks like for each question
3. The one thing I should ask at the end to understand their real motivation
4. Red flags to probe for this specific profile
```

### Customer call prep

```
/ceo-advisor

Prepping for a CEO-to-CEO call with [NAME] at [COMPANY] on [DATE].

Context: [why this meeting is happening — renewal, expansion, escalation, reference, upsell]
What I know about them: [paste any notes or brief]
What I want to achieve: [specific outcome from this call]

Give me:
- The 2-3 things I absolutely need to learn from this call
- The one ask I should make (specific)
- Any landmines to avoid
- How to close the call with a clear next step
```

---

## Thursday — Product and team rhythm

### Sprint review or engineering pulse

```
/ceo-advisor

Engineering pulse for week of [DATE]:

What shipped: [list features, fixes, infra work]
What slipped from plan: [what was planned but not shipped]
Blocking issues: [anything that needs CEO involvement]
Technical debt signal: [any flags from the team about shortcuts taken]

For my CEO lens:
- Is the team shipping at a pace consistent with our roadmap?
- Any signs of under-resourcing or over-scope?
- Do I need to have a conversation with the CTO about capacity?
```

### 1:1 prep

Run before each leadership 1:1. Keep these focused — status updates should be async.

```
Prep me for my 1:1 with [NAME / ROLE] on [DATE].

Their context: [what they're working on, any flags from last week]
Last 1:1 key point: [what was the main topic or action from last time]
What they're likely to raise: [any tension, ask, or update I'm expecting]

Give me:
- 3 questions to ask that get below surface-level answers
- 1 thing I want to give them clarity on (a decision, a priority, a piece of feedback)
- How to open if they seem off or disengaged
```

---

## Friday — Weekly wrap (60-90 minutes)

### 4:00-4:30pm — Company review

```
/founder-weekly-review

End-of-week review — [DATE]:

This week's data:
- MRR end of week: [$X] (vs. [$X] Monday)
- New deals closed: [N, $X ACV average]
- Pipeline moved forward: [Y]
- Product shipped: [Z]
- Hires made: [any]
- Fires resolved (or ongoing): [any]

Produce:
- Full company health traffic light
- OKR progress update (where did each KR move this week?)
- Top 3 wins with attribution
- Top 2-3 lowlights with root cause
- Team pulse (based on what I observed this week)
- My recommended CEO focus for next week
- The one decision to make before Friday ends
```

### 4:30-4:45pm — Investor update draft (monthly: first Friday of month)

```
/investor-update

Monthly investor update — [MONTH]:

MRR: [$X] vs. [$X last month] — [+X%]
Burn: [$X] | Cash: [$X] | Runway: [X months]
Wins this month: [list]
Lowlights this month: [list — including anything difficult]
Ask: [specific asks this month]

Draft the email. Tone: direct, no spin, no filler.
I'll review and send by Monday.
```

### 4:45-5:00pm — Next week setup

```
Based on my weekly review:

1. Top 3 CEO priorities for next week (specific, not vague)
2. Meetings I need to book before Monday (list)
3. Decisions I'm carrying into next week that are unresolved (list — no more than 2)
4. One thing I should delegate that I'm currently doing myself

Create a brief task list I can act on Monday morning.
```

---

## Monthly rhythm

### First Monday of month — Operating model refresh

```
/financial-plan

Monthly operating model refresh:

Last month actuals:
- Revenue: [$X]
- COGS: [$X]
- OpEx: [$X by category]
- Burn: [$X]
- Cash: [$X]

Update the model with actuals. What's the forecast for the next 3 months at current trajectory?
What changes if we hit ARR plan vs. miss by 20%?
Runway in both scenarios?
```

### First Friday of month — Investor update

Use the investor update template from Friday workflow above. Send by the following Monday. Consistency matters more than length.

### Quarterly — Board deck

```
/board-deck-builder

Q[X] board deck — [DATES]:

Key metrics: [fill in]
Special topics: [any pivot, org change, or strategic decision needing board input]
Decisions needed: [anything requiring board approval]
Bad news to disclose: [be proactive — they should never be surprised]

Build the deck structure. I'll fill narrative over the next week.
```

---

## When things go wrong

### "We're not going to hit the quarter"

```
/ceo-advisor

I'm looking at a $[X] miss on our Q[X] ARR target of $[Y]. We're at [Z]% through the quarter.

How do I:
1. Diagnose whether this is a pipeline problem, conversion problem, or churn problem
2. Identify the 2-3 high-leverage actions that could still move the number
3. Communicate this to my board proactively (not in the board meeting)
4. Update internal team expectations without causing panic
5. Determine whether to revise the target or maintain and miss

Give me a structured plan, not reassurance.
```

### "A key person is leaving"

```
/ceo-advisor

[NAME], our [ROLE], has given [X weeks] notice.

What I need to think through:
1. Transition plan — what knowledge transfer needs to happen in [X weeks]?
2. Customer impact — who owns their relationships? Any at-risk accounts?
3. Team communication — how and when to tell the team
4. Investor communication — does this need to go in my next investor update?
5. Recruiting — what's the fast path to a replacement? Interim vs. permanent?
6. Is there something I should learn from this departure about the team, culture, or compensation?

Structure this for me.
```

### "A customer wants to churn"

```
/ceo-advisor

[CUSTOMER NAME], a [$X MRR / $Y ACV] customer, has signalled they want to cancel.

Context: [how long they've been a customer, what they use, why they're leaving]
Key stakeholder: [name and title of person driving the cancellation]

Help me:
1. Understand whether this is recoverable or not (signals to read)
2. What the CEO-level retention call should cover (and avoid)
3. Whether to offer a concession and what kind
4. If we do lose them — what's the learnable root cause?
5. How to log this in CRM and communicate to team
```

---

## Benchmarks by stage

| Activity | Seed | Series A | Series B |
|---|---|---|---|
| Investor update frequency | Monthly | Monthly | Monthly |
| Board prep time | 4 hours | 6 hours | 8 hours |
| Customer calls per week (CEO) | 5+ | 3-5 | 2-3 |
| 1:1s per week | All directs | All VPs | Exec team only |
| OKR review cadence | Monthly | Weekly | Weekly |
| Time on fundraise (in-market) | 60-70% | 50-60% | 40-50% |
| Time on product/customers | 60% (not in market) | 40% | 30% |

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
