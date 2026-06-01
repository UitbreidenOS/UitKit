# Claude for Operations Managers and COOs

Everything an Operations Manager or COO needs to run AI-augmented operations — process documentation, vendor management, OKR tracking, team coordination, and weekly reporting — in Claude Code.

---

## Who this is for

You are an Operations Manager, VP of Operations, or COO whose job is to make the company run. You own process, tooling, cross-functional coordination, and operational metrics. You spend too much time in meetings that produce no decisions, on documents that go stale the moment you publish them, and on vendor reviews that never have a clear recommendation.

**Before Claude Code:** 4 hours to write an SOP from scratch. Half a day building a vendor comparison. A full afternoon turning meeting notes into action items. Weekly reporting takes Monday morning.

**After:** SOPs drafted in 30 minutes. Vendor matrices built from notes in 20 minutes. Meeting notes turned into Jira tickets in 5 minutes. Weekly pulse ready before coffee cools.

---

## 30-second install

```bash
# Install the full operations stack
npx claudient add skills small-business/sop-writer
npx claudient add skills small-business/weekly-pulse
npx claudient add skills small-business/meeting-to-action
npx claudient add skills gtm/revenue-operations
npx claudient add skills productivity/scrum-master
npx claudient add skills productivity/process-mapper
npx claudient add skills productivity/vendor-evaluator
npx claudient add agents advisors/coo-advisor
npx claudient add agents advisors/chief-of-staff
```

---

## Your Claude Code operations stack

### Skills (slash commands)

| Skill | What it does | When to use |
|---|---|---|
| `/sop-writer` | Draft, format, and version SOPs with RACI and decision tables | Any time a process needs to be documented |
| `/process-mapper` | Map existing processes: flowchart, RACI, bottleneck analysis, improvement recommendations | Process audits, automation prep, cross-team handoffs |
| `/vendor-evaluator` | RFP templates, scoring rubric, comparison matrix, recommendation memo | Any vendor decision > $10k/year |
| `/weekly-pulse` | Weekly OKR check-in, metrics dashboard, blockers summary | Every Monday morning |
| `/meeting-to-action` | Turn meeting notes or transcripts into structured action items with owners | After every significant meeting |
| `/revenue-operations` | RevOps reporting, pipeline health, forecast accuracy | GTM/RevOps work |
| `/scrum-master` | Sprint ceremonies, retrospectives, velocity coaching | Team operating rhythm |

### Agents

| Agent | Model | When to spawn |
|---|---|---|
| `coo-advisor` | Sonnet | Strategic operational decisions, org design questions |
| `chief-of-staff` | Sonnet | Cross-functional coordination, stakeholder communication, prioritisation |

---

## Daily workflow

### Morning OKR pulse (15 minutes)

**Start every day knowing where you stand on your key metrics.**

```
/weekly-pulse

Today's date: [date]
Week: [W of Q]

OKR status:
Objective 1: [name] → Key Result: [metric, current value vs. target]
Objective 2: [name] → Key Result: [metric, current value vs. target]

Yesterday's notable events: [key decisions made, blockers surfaced, milestones hit or missed]

What I need from this check-in:
- Red flags requiring my attention today
- Any OKR that is drifting (amber) and needs intervention this week
- One operational lever I can pull today to move the needle
```

---

### Process documentation (30-60 minutes per process)

```
/process-mapper

Process: [name — e.g., Customer Onboarding, Vendor Procurement]
Trigger: [what starts this process]
End state: [what done looks like]
Participants: [roles involved]
Tools: [systems used]
Current pain: [what you already know is broken]

Produce: step-by-step map, RACI matrix, bottleneck analysis, top 3 improvement recommendations.
```

Then use `/sop-writer` to turn the map into a formatted SOP with version history:

```
/sop-writer

Process name: [name]
Version: 1.0
Owner: [role]
Last updated: [date]
Review frequency: [quarterly]

Based on this process map: [paste the process-mapper output]

Write a full SOP in our standard format including:
- Purpose and scope
- Roles and responsibilities (RACI)
- Step-by-step instructions
- Decision rules (when to escalate)
- Metrics and success criteria
- Change log
```

---

### Vendor management

**Before any significant vendor decision:**

```
/vendor-evaluator

I need to evaluate vendors for: [category]
Budget: [$X]
Timeline: [when we need to decide]
Vendors I'm considering: [names]
Must-haves: [list]
Nice-to-haves: [list]

Produce: scoring rubric, RFP questions, comparison matrix template.
```

**After collecting proposals:**

```
/vendor-evaluator

Build a comparison matrix from these proposals.

Vendor A notes: [paste your notes]
Vendor B notes: [paste your notes]
Vendor C notes: [paste your notes]

Scoring criteria we agreed on: [from the rubric]

Produce: weighted comparison table, 3-year TCO estimate, risk register, recommendation memo for the leadership team.
```

---

### Meeting management

**After every significant meeting:**

```
/meeting-to-action

[Paste meeting notes or transcript]

Meeting type: [decision / brainstorm / status / escalation]
Attendees: [list with roles]
Date: [date]
Context: [what this meeting was trying to accomplish]

Extract:
- Decisions made (list each with who owns it)
- Action items (owner, due date, deliverable — one line each)
- Open questions needing follow-up
- Commitments made that others are depending on
- Parking lot items (raised but not resolved)

Format output as a Slack-ready summary and a separate Jira/Linear task list.
```

---

### Cross-functional coordination

Use the `chief-of-staff` agent for complex coordination:

```
@chief-of-staff

I need to coordinate [initiative] across [teams].

Stakeholders:
- [Team/Person 1]: [what they own, what they need from others]
- [Team/Person 2]: [what they own, what they need from others]

Current blockers: [list]
Timeline: [key milestones]

Help me: [draft the coordination plan / write the stakeholder update / identify the critical path]
```

---

## Weekly rhythm

### Monday — OKR pulse and week planning

```
/weekly-pulse

Week: [W of Q]
OKR status for each key result: [current value / target / trend]
Top 3 priorities this week: [list]
Dependencies on other teams this week: [list]
Meetings this week that need prep: [list]

Output: one-page weekly brief I can share with my CEO at the Monday check-in.
```

### Wednesday — Mid-week check

```
Quick mid-week check:
- Which priorities are on track?
- What's at risk of slipping this week?
- What decisions are pending that are blocking progress?
- Do I need to escalate anything?

Give me a 5-bullet Slack message to send to my direct reports.
```

### Friday — Weekly ops report

```
/weekly-pulse

Weekly ops report for: [week ending date]

Metrics update:
[Paste data from your dashboards — or describe metrics and their values]

This week's wins: [list]
This week's misses: [list + root cause for each]
Next week's priorities: [top 3]
Decisions needed from leadership before Monday: [list]

Format: executive summary (3 bullet points) + detailed section for operations team.
```

---

## 30-day ramp plan

### Week 1 — Audit and baseline

- Install all operations skills and configure your primary tools (Jira/Linear MCP if using)
- Run `/process-mapper` on your top 3 most painful processes
- Document which processes have no SOP (these are your risk areas)
- Set up your OKR tracking template in `/weekly-pulse`
- Identify your top 2 vendor decisions in the next 90 days

### Week 2 — Documentation sprint

- Use `/sop-writer` to draft SOPs for the top 3 processes mapped last week
- Run `/meeting-to-action` on your 5 most recent meeting notes (retroactively)
- Start using `/meeting-to-action` on every meeting from this point forward
- Set up weekly pulse as a Monday morning ritual

### Week 3 — Vendor and cross-functional work

- Launch your first vendor evaluation with `/vendor-evaluator`
- Use `chief-of-staff` agent to draft your first cross-functional coordination plan
- Run a retrospective on one team using `/scrum-master`
- Identify your top OKR at risk and design an intervention

### Week 4 — Reporting and optimisation

- Produce your first full weekly ops report with `/weekly-pulse`
- Review your process maps — which bottlenecks can you eliminate?
- Deliver the vendor recommendation memo from Week 3
- Track time saved this month vs. before Claude Code (target: 8-12 hours/week)

---

## Tool integrations

### Jira / Linear (project tracking)

```json
// Add to ~/.claude/settings.json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "@linear/mcp-server"],
      "env": {
        "LINEAR_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

With this connected, `/meeting-to-action` can create tasks directly in your project board.

### Notion (documentation)

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notion/mcp-server"],
      "env": {
        "NOTION_TOKEN": "your-integration-token"
      }
    }
  }
}
```

Use for: SOPs, process maps, vendor comparison matrices, weekly reports.

### Slack (async communication)

Format all `/weekly-pulse` and `/meeting-to-action` outputs for Slack by appending:
"Format this as a Slack message — no markdown headers, use bullets and bold for emphasis."

### Google Sheets / Airtable (metrics tracking)

Export OKR data as CSV → paste into `/weekly-pulse` for analysis and trend reporting.

---

## Metrics to track

Use Claude Code to analyse these monthly:

| Metric | Target | Red flag |
|---|---|---|
| OKR completion rate (quarterly) | > 70% | < 50% |
| Process documentation coverage | > 80% of critical processes | < 60% |
| Meeting action item completion rate | > 85% within due date | < 70% |
| Vendor decision cycle time | < 30 days for major decisions | > 60 days |
| Weekly report time (mins) | < 30 minutes | > 90 minutes |
| Cross-team blocker resolution time | < 3 business days | > 7 days |

---

## Common mistakes and how Claude Code helps avoid them

**Mistake 1: SOPs that get ignored**
Claude Code produces SOPs with clear owners, decision rules, and review dates. Without those, SOPs become shelf documents.

**Mistake 2: Vendor decisions based on demos, not data**
`/vendor-evaluator` forces a scoring rubric before the demo, so you're not comparing apples to apples to a sales pitch.

**Mistake 3: Meetings that produce conversation, not decisions**
`/meeting-to-action` is non-negotiable after any decision meeting. Run it within 30 minutes or the context decays.

**Mistake 4: OKRs tracked quarterly instead of weekly**
`/weekly-pulse` runs Monday morning. OKRs that drift weekly die by quarter-end.

**Mistake 5: Undocumented processes = key-person dependencies**
When the person who "just knows how it works" leaves, you have no process. `/process-mapper` is how you eliminate single points of failure.

---

## Resources

- [Process documentation guide](./sop-writing-guide.md)
- [Vendor evaluation playbook](../skills/productivity/vendor-evaluator.md)
- [Weekly OKR workflow](../workflows/ops-weekly.md)
- [COO advisor agent](../agents/advisors/coo-advisor.md)
- [Getting started with Claude Code](./getting-started.md)

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
