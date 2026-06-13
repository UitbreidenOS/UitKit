---
name: jira-expert
description: "Jira project management: board setup, issue hierarchy, workflow design, JQL queries, sprint planning, reporting, and Jira best practices for engineering teams"
updated: 2026-06-13
---

# Jira Expert Skill

## When to activate
- Setting up a new Jira project or restructuring an existing one
- Writing JQL queries to find specific issues
- Designing a workflow that fits your development process
- Configuring sprints, epics, and story hierarchy
- Building Jira reports and dashboards
- Debugging why Jira boards or automations aren't working as expected

## When NOT to use
- Product roadmap planning — that's a product-roadmap skill conversation
- Sprint retrospectives — use an actual team facilitation process
- Migrating away from Jira — evaluate tools first, then migrate

## Instructions

### Project setup

```
Set up a Jira project for [team/product].

Team: [X engineers, Scrum / Kanban / mixed]
Methodology: [Scrum (time-boxed sprints) / Kanban (continuous flow) / Scrumban]
Project type: [Software / Business / Service management]
Integration needs: [GitHub / GitLab / Confluence / Slack]

Recommended configuration:

Project type: [Software] — gives you sprints, backlog, and velocity reporting

Issue hierarchy:
Epic → Story → Sub-task (standard)
or
Initiative → Epic → Story → Sub-task (for larger programmes)

Workflow design:
Simple (recommended for most teams):
  To Do → In Progress → In Review → Done

With more granularity:
  Backlog → Selected for Dev → In Progress → In Review → In QA → Done

Statuses to avoid:
- "Waiting" without clarity on who is waiting for what
- Too many statuses — every status is a handoff that needs a ritual

Story points vs. time estimates:
- Use story points for relative complexity estimation (Fibonacci: 1,2,3,5,8,13)
- Never use hours — false precision that takes discussion time

Components: use to group by technical area (Frontend, Backend, Infrastructure, Mobile)
Labels: use for cross-cutting concerns (performance, security, debt)

Configure this project and set up the initial board.
```

### JQL queries

```
Write JQL queries for [use case].

I need to find: [describe what you're looking for]
Project: [project key — e.g. ENG, BACKEND]

Common JQL patterns:

All open issues assigned to me:
  assignee = currentUser() AND resolution = Unresolved

Issues added to current sprint after it started (scope creep):
  sprint = "Sprint 23" AND created > startOfSprint()

All high-priority bugs open for more than 7 days:
  issuetype = Bug AND priority in (High, Critical) AND created <= -7d AND resolution = Unresolved

Issues in review with no comments in 2+ days (stale PRs):
  status = "In Review" AND updated <= -2d AND issuetype = Story

All issues in an epic:
  "Epic Link" = ENG-123
  or (Next-gen): parentEpic = ENG-123

Velocity blockers (in-progress for more than the sprint average):
  status = "In Progress" AND updated <= -5d AND sprint in openSprints()

Issues done this week (for standup / release notes):
  status = Done AND resolved >= startOfWeek()

All issues with no assignee in the backlog:
  assignee is EMPTY AND status = "To Do" AND sprint is EMPTY

Write a JQL query for my specific use case. Include a description of what it returns.
```

### Sprint planning

```
Help me run sprint planning for [team].

Team: [X engineers]
Sprint length: [1 week / 2 weeks]
Team velocity: [X story points average over last 3 sprints]
Sprint goal for this sprint: [what we want to accomplish]
Backlog state: [groomed / needs grooming]

Sprint planning checklist:

Pre-planning (day before):
□ Backlog groomed: top 20 items estimated and understood
□ Sprint goal drafted (1 sentence — what success looks like)
□ Capacity confirmed: who's out? (PTO, on-call, interviews)
□ Adjusted capacity: [team velocity × availability %]

During planning (2-hour session for 2-week sprint):

Part 1 — Goal alignment (15 min):
- PO presents sprint goal
- Team confirms it's achievable and valuable
- Any blockers to starting the sprint?

Part 2 — Backlog refinement (45 min, if not already done):
- Walk through top backlog items
- Team asks clarifying questions → add acceptance criteria
- Re-estimate if understanding changed

Part 3 — Commitment (45 min):
- Team pulls stories from top of backlog until velocity is reached
- Engineers break down stories into sub-tasks (helps reveal hidden complexity)
- Call out dependencies between items
- Last 10 min: read back the sprint — does everyone agree?

Part 4 — Sprint started (15 min):
- Start the sprint in Jira
- Move everyone's first task to "In Progress"

JQL for capacity check:
  sprint = "Sprint [X]" AND assignee = [engineer] ORDER BY priority

Output: sprint planning agenda template + JQL queries for the session.
```

### Jira reporting and dashboards

```
Build a Jira dashboard for [audience].

Audience: [engineering team / product manager / executive]
Metrics needed: [velocity / bug rate / sprint health / OKR progress]

Dashboard gadgets for engineering teams:
- Sprint Health: issues done vs. committed (burndown)
- Velocity Chart: last 6-8 sprints — trend up/down/flat?
- Created vs. Resolved: are we resolving bugs faster than they're created?
- Cycle Time: average time from "In Progress" to "Done" by issue type

Dashboard for product managers:
- Epics progress: % complete for each epic in flight
- Release burndown: story points remaining toward release target
- Issues without estimates: flag planning gaps
- Done this sprint: what shipped (use in weekly review)

Executive dashboard:
- OKR health: [custom — link epics to OKRs via labels or custom field]
- Team velocity trend: [are we getting faster or slower?]
- Bug count by severity: [how many critical/high bugs open?]
- Release cadence: [dates of last 5 releases]

JQL for common dashboard gadgets:
Bug rate (bugs created last 30 days):
  issuetype = Bug AND created >= -30d

Cycle time (resolved this sprint):
  status = Done AND sprint in closedSprints() ORDER BY resolved DESC

Unestimated backlog:
  story_points is EMPTY AND status = "To Do" AND sprint is EMPTY

Build the dashboard gadget configuration for my audience.
```

### Automation recipes

```
Set up Jira automation for [workflow].

Use case: [describe what you want to automate]

Common Jira automation recipes:

Auto-assign on status change:
  Trigger: Issue transitioned to "In Review"
  Condition: Assignee is [engineer]
  Action: Assign to [reviewer] + Add comment "Ready for review"

Auto-close stale bugs:
  Trigger: Scheduled (weekly)
  Condition: status = "To Do" AND updated <= -90d AND priority = Low
  Action: Transition to "Won't Fix" + Comment "Auto-closed after 90 days inactivity"

Notify Slack on critical bug:
  Trigger: Issue created
  Condition: issuetype = Bug AND priority = Critical
  Action: Send Slack message to #engineering-alerts with issue link

Sync GitHub PRs to Jira:
  Trigger: GitHub PR opened (via GitHub integration)
  Action: Transition linked issue to "In Review"

Auto-transition on PR merge:
  Trigger: GitHub PR merged
  Action: Transition linked Jira issue to "Done"

Sprint velocity warning:
  Trigger: Scheduled (daily, during sprint)
  Condition: Sprint % complete > 70% AND points done / points committed < 0.5
  Action: Notify PO via comment on sprint board

Write the automation rules for my specific use case.
```

## Example

**User:** Our Jira board is a mess — 200+ issues in the backlog, half without estimates, no clear sprint goals, and velocity has dropped from 45 to 28 over 3 months. Where do I start?

**Claude's recovery plan:**

Velocity drop from 45→28 over 3 months = 38% decline. That's not a Jira problem — Jira is surfacing a team problem. Don't reconfigure Jira without understanding the real cause.

**Step 1 — Diagnose before fixing (this week):**

JQL: what was done in each of the last 3 sprints?
```
sprint in closedSprints() AND status = Done ORDER BY resolved DESC
```
Are the same types of issues appearing repeatedly? If yes: recurring bugs or unresolved tech debt eating velocity.

JQL: how many bugs were created in the last 90 days?
```
issuetype = Bug AND created >= -90d
```
If bug volume is rising, velocity drop is caused by unplanned work, not planning dysfunction.

**Step 2 — Backlog surgery (1 team session, 90 min):**
- Sort by "Last Updated" ascending
- Any issue untouched > 3 months with no sprint assigned → archive (won't fix or won't do)
- Don't estimate them — just remove the noise
- Target: backlog under 80 items before next sprint

**Step 3 — Restore sprint hygiene:**
- Sprint goal: one sentence, agreed before sprint starts
- No adding items mid-sprint without removing something of equal size
- Retrospective: run a "what slowed us down this sprint?" at the end of each sprint for 4 sprints

**Step 4 — Track cycle time, not just velocity:**
Add a "Cycle Time" gadget to your board. If cycle time is increasing (stories take longer to complete), the problem is WIP limit — too many things in progress at once.

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
