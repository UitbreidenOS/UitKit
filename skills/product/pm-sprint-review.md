---
name: pm-sprint-review
description: "Sprint review: velocity, shipped vs planned, blockers, learnings, next sprint priorities"
updated: 2026-06-13
---

# PM Sprint Review Skill

## When to activate
- Running end-of-sprint review and retrospective
- Preparing the sprint review deck or async writeup for stakeholders
- Calculating velocity and comparing shipped vs. planned scope
- Extracting blockers and root causes from a sprint that went sideways
- Setting priorities for the next sprint based on what you learned
- Writing the sprint summary for leadership or investor updates

## When NOT to use
- Backlog grooming — use `/user-story-writer` for story creation
- Quarterly roadmap planning — use `/product-roadmap`
- Post-launch user research — use `/product-analytics` or `/ux-researcher`
- Bug triage — this is a rhythm tool, not a debugging framework

## Instructions

### Core sprint review prompt

```
Run a sprint review for [TEAM NAME] — Sprint [N], [DATES].

Sprint goal: [what was the stated goal for this sprint]
Sprint duration: [1 / 2 weeks]
Team: [N engineers, N designers, N QA]
Velocity context: average velocity last 3 sprints: [N story points]

Sprint data (paste your ticket list or summary):
Planned tickets: [list with story points and status: done / partial / not started / blocked]
Unplanned work added mid-sprint: [list]
Total planned points: [X] | Total shipped: [X] | Velocity this sprint: [X]

Produce:

## 1. Sprint goal outcome
Did we hit the sprint goal? [Yes / Partial / No]
One-sentence verdict: what was accomplished in plain English.

## 2. Shipped vs. planned (table)
| Feature / Story | Points | Status | Notes |
|---|---|---|---|
| [ticket] | [X] | Done / Partial / Slipped | [any note] |

## 3. What slipped and why
For each unfinished item: why? (underestimated / blocked / scope crept / deprioritised mid-sprint)
Root cause pattern: is there a single theme? (e.g., "3 of 4 slips were blocked by external API changes")

## 4. Unplanned work analysis
How much unplanned work was added? Was it justified?
Rule: unplanned work > 20% of sprint capacity indicates a planning or communication problem.

## 5. Velocity trend
3-sprint velocity trend: [Sprint N-2: X] [Sprint N-1: X] [Sprint N: X]
Is velocity improving, stable, or declining? What's driving it?

## 6. Retrospective highlights
What went well (top 2): specific, not generic
What didn't (top 2 with root cause): honest, with owner
One action for next sprint: a single, concrete process change

## 7. Next sprint priorities
Based on what slipped and what's still in the queue — recommended top 5 items for next sprint.
```

### Velocity analysis

```
Analyse velocity for [TEAM] over the last [N] sprints.

Sprint data:
Sprint 1: planned [X] pts, delivered [X] pts, sprint goal: [met/missed]
Sprint 2: planned [X] pts, delivered [X] pts, sprint goal: [met/missed]
Sprint 3: planned [X] pts, delivered [X] pts, sprint goal: [met/missed]
[...]

Diagnose:
1. Average velocity: [X pts]
2. Predictability: what is the standard deviation? High deviation = planning problem
3. Pattern: is the team consistently over-committing? Under-delivering on specific types of work?
4. Sprint goal hit rate: [X / N sprints] — if below 70%, planning process needs fixing
5. Recommended capacity for next sprint based on trailing 3-sprint average (not the optimistic best)

Rule: use 80% of trailing average velocity as realistic next sprint capacity. Leave 20% for unplanned work, bugs, and meetings.

Recommendation: should we adjust our sprint length, team size, or planning process?
```

### Retrospective facilitation

```
Facilitate a sprint retrospective for Sprint [N].

Format: [synchronous / async]
Team: [N people, roles]
Sprint outcome: [goal met / partial / missed]
Known hot topics: [any tensions or recurring issues to address]

Retrospective structure:

1. WHAT WENT WELL (10 min)
Prompt: "What would you do the same next sprint without hesitation?"
Good signal: specificity. If people say "communication was good" ask "give me one example where it was specifically good."
Capture: top 2-3 themes with examples.

2. WHAT DIDN'T (10 min)
Prompt: "What slowed us down, frustrated you, or you'd change if you could redo the sprint?"
Rules:
- No blaming individuals — blame processes and systems
- "The process of doing X was slow" not "Jane was slow at X"
- Every issue gets a severity: would-be-nice-to-fix vs. this-is-causing-real-damage

3. ROOT CAUSE DRILL (10 min)
For the top 2 "what didn't" items: apply 5 whys
Example:
Issue: "3 tickets slipped because we were blocked on backend API"
Why? → API wasn't ready when frontend needed it
Why? → API scope wasn't agreed before sprint started
Why? → Discovery was happening in parallel with implementation
Why? → We don't have a "definition of ready" for frontend-dependent work
Root cause: we start frontend work before backend contract is finalised
Fix: add "API contract approved" as part of definition of ready for all frontend tickets

4. ACTION ITEMS (10 min)
Rule: maximum 2 action items per retro. More than 2 and none get done.
Format: [WHAT] will be done by [WHO] before [DATE]
Example: "Jordan will draft a definition of ready checklist and share in Slack by next Monday"

Generate the retro structure and facilitate each section with the data I provide.
```

### Stakeholder sprint summary

```
Write the sprint summary email/doc for [AUDIENCE].

Audience: [leadership / investors / other teams / full company]
Sprint: [N] | Dates: [start-end]
Sprint goal: [state it]

Tone rules:
- Leadership / investors: 3 paragraphs max, lead with outcome, data-backed, no jargon
- Full company: celebrate wins with names, explain slips without blame, set expectations
- Other teams: what shipped that affects them, what's coming next, any asks

Template for leadership summary:

Sprint [N] shipped [X story points] of [Y planned], [met / partially met / missed] the sprint goal of "[goal]".

Key deliverables shipped: [2-4 bullets — specific feature names, not generic descriptions]
[Feature]: [what it does, which customers asked for it or it unblocks]
[Feature]: [...]

What slipped: [1-2 sentences — what and why, no spin]

Next sprint priority: [the most important thing shipping in Sprint N+1 and why it matters]

Generate the summary for my audience with my sprint data.
```

### Sprint planning prompt (input for next sprint)

```
Plan Sprint [N+1] based on this sprint's review.

Capacity:
- Team: [N engineers, N designers]
- Sprint days: [10 / 5 working days]
- Holidays or PTO: [list any absences]
- Expected capacity: [N% of normal — e.g., 80% due to 2 PTO days]

Backlog items to consider:
[Paste top 10-15 candidate items with story point estimates]

Constraints:
- Slipped from Sprint N (must carry forward): [list]
- Committed deliverables (external dependencies, customer promises): [list]
- Nice-to-have (can drop if capacity tight): [list]

Sprint goal candidates:
Option A: [goal] — rationale
Option B: [goal] — rationale
Option C: [goal] — rationale

Using trailing 3-sprint velocity of [X pts] and 80% capacity rule, recommend:
1. The sprint goal (which option, and why)
2. Exactly which items to commit to in this sprint
3. What to leave in the backlog
4. Risk: any items in this plan that are likely to slip, and why
```

## Example

**User:** Sprint 23, 2-week sprint. Goal: "Launch CSV export so enterprise users can download their data." Team of 4 engineers, 1 designer. Planned 42 pts. Delivered: CSV export (done, 13 pts), bulk selection UI (done, 8 pts), API rate limiting (partial — 5/8 pts shipped), 3 bug fixes (done, 7 pts), new onboarding flow (not started, 14 pts, reason: design not finalised). Sprint 22 velocity: 38. Sprint 21: 40.

**Output:**

```markdown
# Sprint 23 Review — Week Ending June 6

## Sprint Goal Outcome
PARTIAL — We shipped the headline feature (CSV export) but the onboarding flow didn't start due to design not being finalised before sprint kickoff. The core goal for enterprise customers was achieved.

## Shipped vs. Planned
| Item | Points | Status | Notes |
|---|---|---|---|
| CSV export | 13 | Done | Sprint goal met |
| Bulk selection UI | 8 | Done | Enables CSV export UX |
| API rate limiting | 8 | Partial (5 shipped) | Edge case handling still open |
| Bug fixes (3) | 7 | Done | |
| New onboarding flow | 14 | Not started | Design not finalised at sprint start |
| **Total** | **50** | **33 shipped** | **66% completion rate** |

## What Slipped and Why
Onboarding flow (14 pts): design wasn't finalised before sprint planning. This is not a sprint execution problem — it's a process problem. The team committed to work that wasn't ready.
Root cause: we don't have a "definition of ready" — tickets entered sprint planning without design sign-off.

API rate limiting (3 pts remaining): underestimated edge cases. Not a systemic issue.

## Unplanned Work
None added mid-sprint. Good discipline this sprint.

## Velocity Trend
Sprint 21: 40 pts | Sprint 22: 38 pts | Sprint 23: 33 pts
Velocity declining. The 14 pts of unstarted work masks a real capacity issue —
the team is not getting below-the-line design readiness before committing.

## Retrospective Highlights
Went well:
1. CSV export shipped on time, no rework — good upfront scoping by the engineering lead.
2. Bug fix batch was effective — 3 bugs closed in one focused session.

Didn't go well:
1. Onboarding flow committed without design readiness. Wasted the sprint planning discussion.
   Action: Sarah to draft a "definition of ready" checklist and add to our sprint template by next Monday.

2. API rate limiting was underestimated. We scope backend complexity incorrectly.
   Action: Backend estimates to include +2 pts buffer for edge cases going forward.

## Next Sprint Priorities
1. Onboarding flow (14 pts) — only commit once design is signed off (definition of ready)
2. API rate limiting remaining edge cases (3 pts) — carry forward, small
3. [Next items from backlog based on roadmap priorities]

Recommended Sprint 24 capacity: 37 pts (80% of 3-sprint average of 39 pts)
```

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
