---
name: scrum-master
description: "Scrum facilitation: sprint ceremonies, retrospective formats, removing blockers, velocity coaching, scaling scrum across multiple teams — practical Scrum Master patterns"
updated: 2026-06-13
---

# Scrum Master Skill

## When to activate
- Facilitating sprint ceremonies (planning, standup, review, retro)
- Running retrospectives that surface real issues (not just "what went well")
- Helping a team that's struggling with velocity, scope, or commitment
- Scaling from one team to multiple teams (Scrum of Scrums, SAFe basics)
- Coaching a new team on Scrum practices
- Writing agendas for sprint ceremonies

## When NOT to use
- Jira configuration — use the jira-expert skill
- Product roadmap decisions — that's the PM's domain
- Engineering technical decisions — not a Scrum Master concern
- Replacing a real Scrum Master for teams in conflict — human facilitation needed

## Instructions

### Sprint retrospective

```
Design a retrospective for [team context].

Team size: [X people]
Sprint length: [2 weeks]
Team health: [healthy / some tension / struggling]
Last retro: [what format / what came out of it]
This sprint's standout event: [incident / delivery pressure / team change / none]

Choose a retrospective format based on context:

1. Start / Stop / Continue (default, all-team contexts):
   - Start: what should we begin doing?
   - Stop: what should we stop doing?
   - Continue: what's working that we should protect?
   Duration: 60 min for a 2-week sprint

2. 4Ls (after a tough sprint):
   - Liked: what did you enjoy?
   - Learned: what did you discover?
   - Lacked: what was missing?
   - Longed For: what do you wish had been different?

3. Sailboat (for teams feeling directionless):
   - Wind (propelling us): what's helping us move forward?
   - Anchors (slowing us): what's holding us back?
   - Rocks (risks ahead): what could sink us?
   - Sun (destination): what are we sailing toward?

4. Timeline (after incidents or major delivery):
   - Map the sprint on a timeline
   - Mark high points and low points as a team
   - Discuss what caused each peak and valley
   - Identify patterns

Facilitation guide for [chosen format]:
1. Set the stage (5 min): psychological safety framing
2. Gather data (15 min): silent stickies on the board
3. Insights (20 min): group stickies into themes, discuss
4. Decide what to do (15 min): vote on top 2-3 action items
5. Close (5 min): confirm owners and due dates for each action

Rule: no retro ends without a named owner and due date for each action item. "The team will..." = nobody will.

Generate the full agenda for my specific context.
```

### Standup facilitation

```
Improve our daily standup.

Current standup: [describe — how long, format, problems]
Team size: [X people]
Remote / in-person / hybrid: [specify]
Common problems: [runs too long / people not present / no blockers shared / status report instead of sync]

Standup formats:

Classic 3 questions (per person):
1. What did I do yesterday?
2. What am I doing today?
3. Any blockers?
Problem: becomes a status report — people talk AT the Scrum Master, not to each other.

Walking the board (better for in-progress focus):
- Look at each "In Progress" item, not each person
- "Who's working on this? Any blockers?"
- Focuses on finishing, not starting
- Better for Kanban-adjacent teams

Two-question model (leaner):
1. What am I working on?
2. Do I need help?
No "yesterday" = cuts standup to < 10 minutes with < 10 people

Remote standup tips:
- Use a shared board (Jira, Linear) on screen — prevents abstract status reports
- Start on time, end on time — latecomers join without recap
- Blockers go in Slack async; standup is for coordination, not solving

Common standup anti-patterns to fix:
- "No blockers" every day → blockers exist; people aren't comfortable sharing
  Fix: ask "what would make you go faster?" instead
- One person talks for 5+ minutes → use a timer (2 min/person)
- No one moves their tickets afterward → blockers or tickets are wrong

Redesign my standup for my team's context.
```

### Velocity coaching

```
Help improve team velocity.

Current velocity: [X story points / sprint average last 3 sprints]
Sprint length: [2 weeks]
Team size: [X engineers]
Known issues: [scope creep / unrealistic estimates / interruptions / tech debt / unclear stories]

Velocity diagnosis framework:

Step 1 — Distinguish types of velocity problems:
a) Commitment problem: team commits to X, delivers Y < X → planning is broken
b) Estimation problem: team delivers X but stories keep being re-estimated higher mid-sprint
c) Interruption problem: unplanned work (bugs, incidents, slack requests) eating capacity
d) Delivery problem: stories sit "In Progress" for most of the sprint

Step 2 — Measure the real issue:
- Interruption rate: track unplanned work added mid-sprint for 3 sprints. If > 20% of committed work, that's the problem — not estimation.
- Cycle time: if stories take > 5 days on average, WIP limit is too high
- Commitment rate: committed / delivered over last 3 sprints

Step 3 — Interventions by problem type:
a) Commitment: run sprint planning with the team, not for them. Stop committing to unrefined stories.
b) Estimation: run a pointing calibration session (compare past estimates to actual)
c) Interruptions: budget for interruptions (reserve 20% of velocity for unplanned work)
d) Cycle time: enforce WIP limit of 2 stories per engineer maximum

Step 4 — Don't optimise velocity directly:
Velocity is a planning tool, not a performance metric. A team that does 40 points of meaningful work is better than one doing 60 points of low-value work.

Diagnose my team's velocity issue and recommend the single highest-leverage change.
```

### Scrum ceremonies calendar

```
Design the sprint ceremonies calendar for [team].

Team: [X people — engineers, PM, designer, QA]
Sprint length: [2 weeks]
Time zone: [all same / distributed]
Working hours overlap: [X hours/day of overlap]

Two-week sprint ceremony schedule:

Monday, Sprint Start:
- 10:00 — Sprint Planning (2 hours)
  Who: Full team
  Goal: Sprint backlog agreed, sprint goal set

Daily Monday–Friday:
- 09:30 — Daily Standup (15 min max)
  Who: Full team
  Format: Walk the board

Friday of Week 1:
- 15:00 — Backlog Refinement (1 hour)
  Who: PM + 2-3 engineers (rotating)
  Goal: Top 10 backlog items estimated and clarified

Thursday of Week 2 (day before sprint ends):
- 14:00 — Sprint Review (1 hour)
  Who: Full team + stakeholders
  Goal: Demo completed work, gather feedback
- 15:30 — Retrospective (1 hour)
  Who: Team only (no stakeholders)
  Goal: 2-3 actionable improvements for next sprint

Friday of Week 2 (Sprint End):
- Team completes remaining work
- PM closes sprint in Jira, prepares velocity chart

Design the calendar for my team size, time zone, and working style.
```

## Example

**User:** Our retrospectives always end with the same 3 action items ("write better tickets", "communicate more", "reduce scope creep") and nothing ever changes. How do I fix this?

**Claude's diagnosis:**

These 3 action items are process platitudes — they name symptoms without addressing causes, and they have no owner. That's why nothing changes. The retro is doing the right ceremony, but the wrong thing.

**Root cause of "write better tickets":**
This means: tickets that go into the sprint are underspecified, causing rework or wrong implementation.
Real question to ask: "Which ticket in the last 3 sprints caused the most rework? Why was it unclear? Who wrote it? What was missing?"
Specific action: "Before next sprint planning, PM reviews all tickets with the engineer who'll own them — takes 30 min every Thursday."

**Root cause of "communicate more":**
This is usually a symptom of unclear ownership, not a communication failure.
Real question: "In the last sprint, when did you not know what to do next and had to ask someone? Why weren't you told earlier?"
Specific action: "Add a 'dependencies' field to every story > 3 points — who else needs to be involved?"

**Root cause of "reduce scope creep":**
This means: items are added mid-sprint without removing others.
Real question: "Who approved the mid-sprint additions in the last 3 sprints? Was it urgent or avoidable?"
Specific action: "New item added mid-sprint requires explicit PM + tech lead sign-off AND removal of equivalent points."

**Retro format change:**
Stop using Start/Stop/Continue. Switch to a Timeline retro — go back through the last sprint day by day. This forces specific examples rather than generic complaints, and specific examples have specific causes.

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
