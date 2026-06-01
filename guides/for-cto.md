# Claude for CTOs and Tech Leads

Everything a CTO, VP Engineering, or Tech Lead needs to run AI-augmented engineering leadership — architecture decisions, engineering strategy, technical hiring, team topology, tech debt prioritisation, and board reporting.

---

## Who this is for

You are a CTO, VP Engineering, Principal Engineer, or Tech Lead whose job is to own the technical direction of a company or engineering organisation. You bridge business strategy and engineering execution. You make build vs. buy decisions, set team topology, conduct incident reviews, evaluate architecture trade-offs, and report to the board — often in the same week.

**Before Claude Code:** ADR: 90 minutes. Engineering strategy doc: a week of evenings. Interview kit for a new senior hire: 3 hours. Board report on technical health: half a day.

**After:** ADR in 20 minutes. Engineering strategy outline in 45 minutes. Interview kit in 30 minutes. Board tech report in 25 minutes.

---

## 30-second install

```bash
# Install the full CTO / tech lead stack
npx claudient add skills productivity/adr-writer
npx claudient add skills productivity/tech-debt-tracker
npx claudient add skills devops-infra/platform-engineering
npx claudient add skills productivity/vertical-slice-planner
npx claudient add skills productivity/spec-driven-workflow
npx claudient add skills productivity/engineering-strategy
npx claudient add skills productivity/tech-interview-kit
npx claudient add agents advisors/cto-advisor
npx claudient add agents advisors/vpe-advisor
npx claudient add agents core/architect
```

---

## Your Claude Code CTO stack

### Skills (slash commands)

| Skill | What it does | When to use |
|---|---|---|
| `/engineering-strategy` | Engineering strategy document: tech vision, build vs buy, team topology, 12-month roadmap | Annual/semi-annual planning, board prep, new CTO role |
| `/adr-writer` | Architecture Decision Record — documents the decision, context, trade-offs, consequences | After every significant architectural decision |
| `/tech-interview-kit` | Coding challenges, system design prompts, evaluation rubrics, debrief templates | Before any technical hiring round |
| `/tech-debt-tracker` | Debt inventory, prioritisation framework, investment proposal for leadership | Quarterly tech debt reviews |
| `/vertical-slice-planner` | Slice epics into deliverable verticals with clear acceptance criteria | Sprint and release planning |
| `/spec-driven-workflow` | Technical specification writing — problem statement, requirements, design options | Before building complex features |
| `/platform-engineering` | Platform strategy, developer experience, CI/CD, internal tooling | Platform/infra team work |

### Agents

| Agent | Model | When to spawn |
|---|---|---|
| `cto-advisor` | Opus | High-stakes strategic decisions — org design, build vs. buy, technology bets |
| `vpe-advisor` | Sonnet | Execution and team health — velocity, hiring, operational excellence |
| `architect` | Opus | Complex system design — distributed systems, data architecture, scalability |

---

## Daily workflow

### Morning engineering health check (15 minutes)

```
Quick engineering org health check for [DATE]:

Metrics from yesterday:
- Deployments to production: [X] (target: [N per day])
- Failed deployments / rollbacks: [X]
- Open incidents: [X] / P1 incidents in last 7 days: [X]
- P1 response time (last incident): [X minutes] (target: < 30 min)
- Pull requests merged: [X] / open > 5 days: [X] (long-lived PRs = merge risk)
- On-call escalations: [X]

Team pulse:
- Any engineer blocked for > 1 day? [yes/no + who]
- Any team below 70% sprint commitment tracking? [yes/no]
- Any upcoming critical deadlines in next 14 days? [list]

Flag: what requires my attention today (ranked by urgency × impact)?
```

---

### Architecture and design work

**For any significant technical decision:**

```
/adr-writer

Decision: [what are we deciding?]
Context: [why is this decision needed now? What's the business or technical driver?]
Options considered:
1. [Option A name]: [brief description]
2. [Option B name]: [brief description]
3. [Option C name or "do nothing"]

Constraints: [budget, timeline, existing stack dependencies, team expertise]
Criteria for evaluation: [what matters most — performance / maintainability / cost / speed to ship]

Write a full ADR with: status, context, decision, consequences, and trade-offs.
```

**For complex new features:**

```
/spec-driven-workflow

Feature: [name]
Business goal: [what outcome this serves]
Problem statement: [what user or system problem we're solving]
Constraints: [technical, timeline, team capacity]

Produce: technical specification with problem statement, requirements (functional + non-functional), design options with trade-off analysis, recommended approach, and open questions that need resolution before work starts.
```

---

### Team 1:1s and coaching

Use the `vpe-advisor` agent to prepare for difficult engineering management conversations:

```
@vpe-advisor

I have a 1:1 tomorrow with [role, seniority level].
Context: [what's going on — performance, career development, team friction, scope question]

Help me:
- Frame the conversation productively (not as a complaint or performance warning)
- Ask questions that give me real information
- Prepare a response if they raise [specific concern]
- Set a concrete outcome for the conversation
```

---

### Board and leadership reporting

```
/engineering-strategy

Write the engineering section of the board deck for [QUARTER/MONTH].

Audience: board and C-suite (non-technical, focused on risk and ROI)
Key metrics to report:
- Deployment frequency: [current vs. last quarter vs. target]
- Reliability (uptime): [current vs. target]
- Security: [any incidents, vulnerabilities remediated]
- Engineering velocity: [high-level: are we accelerating or decelerating?]
- Headcount: [current / planned hires / attrition]
- Tech debt investment: [% of sprint capacity dedicated this quarter]

Highlights: [major things we shipped]
Risks: [what could derail engineering in the next 90 days]
Asks: [what you need from the board — budget, decisions, support]

Format: 3-5 slides worth of content (exec summary + details). Plain language, no jargon.
```

---

### Tech debt prioritisation

```
/tech-debt-tracker

Current tech debt inventory:
[List or describe your known debt items — or paste from a doc/Jira]

For each item: name, what it slows down, estimated cost to fix, risk if unaddressed

Prioritisation framework:
Score each item:
- Business impact if NOT fixed: 1-5 (5 = existential risk)
- Developer velocity tax: 1-5 (5 = team spends > 20% time working around it)
- Effort to fix: 1-5 (1 = quick fix, 5 = multi-sprint effort)

Priority score = (business impact + velocity tax) / effort

Produce:
- Ranked list with scores
- Top 3 items to address next quarter with business case for each
- Proposed capacity allocation (% of sprint capacity for tech debt)
- Exec-friendly summary: "Here is what our technical debt is costing us and what fixing it unlocks"
```

---

## Weekly rhythm

### Monday — Engineering strategy alignment

```
/engineering-strategy

Weekly alignment check:
- Are we executing against the 12-month strategy? What's drifting?
- Which OKRs are at risk this quarter?
- Is team topology working? Any coordination breakdowns I need to address?
- Key decisions I need to make this week: [list]

Give me a 5-bullet weekly focus memo I can share with my team leads.
```

### Wednesday — Technical hiring review

Use `/tech-interview-kit` when a hire is in process:

```
/tech-interview-kit

I have a [LEVEL] [ROLE] interview loop running.
Interviewers: [list + which stage each owns]

Help me:
- Review the interview stages for any gaps (are we testing the right things for this level?)
- Prepare debrief template for Friday
- Calibrate what "bar" looks like for this specific role vs. general rubric

[If take-home was submitted: paste the submission and ask for a review framework]
```

### Friday — Build vs. Buy review and stakeholder comms

```
@cto-advisor

Build vs. buy decision I'm wrestling with: [describe the capability, options, timeline, cost]

My constraints:
- Engineering bandwidth: [current utilisation — are we at capacity?]
- Budget: [available for tooling/services]
- Timeline: [when we need this capability]
- Our team's expertise in this domain: [strong / weak / none]
- Strategic importance: [is this a differentiator or commodity?]

Give me a recommendation with your strongest 3 reasons, and what would change your mind.
```

---

## 30-day ramp plan (new CTO)

### Week 1 — Listen and diagnose

- Install all CTO skills and configure your tooling
- Run `/engineering-strategy` in audit mode: "Describe the current state of engineering here. What's working? What's broken? What are the key risks?"
- Identify the top 3 technical pain points from the team (ask, don't assume)
- Map current team topology — who owns what, where handoffs are slow
- Read the last 12 months of ADRs (if they exist) to understand prior decisions

### Week 2 — Document decisions already made

- Write ADRs for any undocumented architectural decisions you discover
- Run `/tech-debt-tracker` — get a baseline inventory, even if incomplete
- Review the hiring pipeline — any open roles and what level bar has been set?
- Check DORA metrics baseline (deployment frequency, MTTR, change failure rate)

### Week 3 — First strategic communication

- Draft your first engineering strategy document using `/engineering-strategy`
- Validate it with your 2-3 most senior engineers before publishing
- Present to the CEO or leadership: here is what I see, here is my plan for 12 months
- Run your first technical interview with the new kit from `/tech-interview-kit`

### Week 4 — Process and rhythm

- Establish the engineering health check as a daily 15-minute ritual
- Launch a tech debt prioritisation session with team leads
- Set your DORA metric targets and publish to the team
- Deliver first board engineering report

---

## Tool integrations

### GitHub (code and PRs)

```bash
# Claude Code has native GitHub integration via gh CLI
# Access PR reviews, code health, deployment status directly

gh pr list --state open
gh run list --limit 10  # CI/CD pipeline status
```

### Linear / Jira (engineering planning)

```json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "@linear/mcp-server"],
      "env": {
        "LINEAR_API_KEY": "your-api-key"
      }
    }
  }
}
```

Use for: sprint planning with `/vertical-slice-planner`, tech debt tracking, roadmap visibility.

### Datadog / Honeycomb (observability)

Export incident data and DORA metrics → paste into engineering health check prompt for trend analysis.

### Notion / Confluence (documentation)

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notion/mcp-server"],
      "env": {
        "NOTION_TOKEN": "your-token"
      }
    }
  }
}
```

Use for: engineering strategy docs, ADRs, team topology, tech debt backlog.

---

## Metrics to track

| Metric | Target (growth stage) | Red flag |
|---|---|---|
| Deployment frequency | Daily or multiple times/week | < 1/week |
| Lead time for changes | < 1 day | > 1 week |
| Change failure rate | < 10% | > 20% |
| MTTR (mean time to restore) | < 1 hour | > 4 hours |
| Engineering availability (team) | > 85% | < 70% |
| Tech debt % of sprint capacity | 15-20% | > 30% or < 10% |
| Time-to-hire (eng roles) | < 45 days | > 90 days |
| Offer acceptance rate | > 80% | < 60% |
| New engineer time-to-first-PR | < 3 days | > 1 week |

---

## Common mistakes and how Claude Code helps avoid them

**Mistake 1: Architectural decisions made verbally, never written down**
`/adr-writer` takes 20 minutes per decision. Without ADRs, tribal knowledge becomes technical debt.

**Mistake 2: Hiring without a calibrated rubric**
`/tech-interview-kit` forces calibration before the first candidate. Interviewers who can't agree on what "good" looks like will hire inconsistently.

**Mistake 3: Tech debt addressed reactively (only when it breaks something)**
`/tech-debt-tracker` turns debt into a business case. Leadership funds what has a defined cost and ROI.

**Mistake 4: Engineering strategy that exists as a slide deck and nothing else**
`/engineering-strategy` produces a living document with metrics. Revisit it quarterly.

**Mistake 5: Board engineering reports that feel like a foreign language**
Use `/engineering-strategy` to write for non-technical audiences. DORA metrics need a sentence of translation before they mean anything to a board.

---

## Resources

- [Architecture Decision Records guide](./adr-writing.md)
- [Engineering strategy skill](../skills/productivity/engineering-strategy.md)
- [Tech interview kit](../skills/productivity/tech-interview-kit.md)
- [Tech debt tracker](../skills/productivity/tech-debt-tracker.md)
- [CTO weekly workflow](../workflows/cto-weekly.md)
- [Getting started with Claude Code](./getting-started.md)

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
