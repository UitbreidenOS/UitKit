# PM Sprint Workflow

A repeatable sprint cadence for a product manager using Claude Code — from sprint planning through retrospective, with prompts for every ritual and the daily in-between work.

---

## Overview

**Time investment:** 2-3 hours of Claude Code sessions per sprint (replaces 6-10 hours of manual document writing, meeting prep, and status reporting).

**What this workflow covers:**
- Pre-sprint: backlog grooming and story readiness
- Sprint planning: goal setting, capacity, commitment
- Daily: standup prep, blocker resolution, stakeholder comms
- End of sprint: review, retrospective, next sprint setup

**Prerequisite:** `/pm-sprint-review`, `/user-story-writer`, and `/product-manager-toolkit` installed. Optional: Linear or Jira MCP connected.

---

## Pre-sprint (2-3 days before sprint starts)

### Backlog grooming session (60-90 minutes)

**Goal:** Sprint planning only pulls from stories that are ready. "Ready" means: well-written user story, AC defined, sized, design approved (if needed).

```
Step 1: Story readiness audit
/user-story-writer

Review these backlog items for sprint readiness.
For each: is it ready to go into sprint planning, or does it need more work?

[Paste top 10-15 candidate stories from Linear/Jira]

Rate each:
- Ready: has user story, AC, size estimate, no open questions
- Needs AC: story format is there but acceptance criteria are missing
- Needs splitting: story is too large (> 5 points)
- Needs discovery: problem not validated, skip for now

Produce: Ready list and a fix list for each not-ready story.
```

```
Step 2: Fix the not-ready stories (for each "needs AC" or "needs splitting" item)
/user-story-writer

Write full acceptance criteria for: [paste story]
Include: happy path, 3+ error / edge cases, definition of done.

--- OR ---

This story is too large ([X] pts). Split it using [workflow step / business rule / happy path first] approach.
Target: stories of ≤ 3 story points each.
```

```
Step 3: Prioritise the ready list
/product-manager-toolkit

Prioritise these ready stories for the upcoming sprint:

Stories available: [list with estimated points]
Sprint capacity: [N story points (80% of trailing average velocity)]
Must-haves (committed externally or carry-over from last sprint): [list]
Nice-to-have: [list]

Constraints:
- Sprint goal candidate: [describe what you want this sprint to accomplish]
- Any external deadlines: [customer promises, launch dates]

Recommended sprint commitment and rationale — including what stays in the backlog and why.
```

### Design review coordination

```
/product-manager-toolkit

I need design sign-off on [N] stories before sprint planning on [DATE].

Stories needing design:
1. [Story] — what I need from design: [mockups / decision on edge case X / accessibility review]
2. [Story] — what I need: [...]

Generate a design review brief I can share with the design team:
- What each story needs from them
- Timeline (need by [DATE])
- Questions I need answered before sprint planning
```

---

## Sprint planning (half day)

### Sprint goal setting

```
/product-manager-toolkit (or directly in Claude)

Help me set the sprint goal for Sprint [N].

Context:
- What's the product-level priority this quarter: [theme]
- What's the most important thing we can ship in 2 weeks?
- Stakeholder input: [CEO said X / sales needs Y by Z date / customer promised W]

Sprint goal candidates:
Option A: "[Goal]" — delivers [value] — requires [N pts of the [M] available]
Option B: "[Goal]" — delivers [value] — requires [N pts]
Option C: "[Goal]" — delivers [value] — requires [N pts]

Recommend the strongest sprint goal:
- Most user-valuable outcome achievable in the capacity
- Not too vague ("improve UX") or too task-focused ("ship 8 tickets")
- Should be something the team can answer yes/no: "did we achieve this?"

Produce: recommended sprint goal statement + rationale + what we sacrifice to achieve it.
```

### Sprint planning meeting agenda

```
/product-manager-toolkit

Generate the sprint planning agenda for Sprint [N].

Duration: [2 hours for 2-week sprint / 1 hour for 1-week sprint]
Team: [N engineers, N designers, PM, tech lead]

Agenda:
1. Sprint goal review (5 min — PM presents, team asks questions)
   - What are we trying to achieve?
   - How does this connect to the quarterly product objective?

2. Capacity check (5 min — tech lead leads)
   - Who is full capacity? Who has PTO, interviews, on-call?
   - Agreed sprint capacity: [N story points]

3. Story walkthrough (60 min)
   - For each story: PM reads the user story, AC, and definition of done
   - Engineering asks questions — AC updated if needed
   - Team estimates (Planning Poker) if not already estimated
   - Story accepted into sprint or sent back to backlog

4. Risk identification (15 min)
   - Which stories are we least certain about?
   - Any external dependencies we're assuming will be ready?
   - What would cause us to miss the sprint goal?

5. Sprint commitment (5 min)
   - Confirm final list — total points vs. capacity
   - Everyone verbally commits: "I'm confident we can deliver this sprint goal"

Post-planning: PM to publish sprint board in Linear/Jira within 2 hours.
```

---

## Daily sprint rhythm

### Standup prep (5 minutes before standup)

```
/pm-sprint-review

Quick standup briefing — Sprint [N], Day [X]:

Status from Linear/Jira (paste or describe):
- Done since yesterday: [tickets moved to Done]
- In progress: [active tickets and who's on them]
- Blocked: [any tickets with blockers]

Sprint goal check: [are we on track / slipping / at risk?]
Burn-down: [points remaining] of [points committed]. [X] days left.

If behind:
- Which stories are most critical to the sprint goal?
- What can we cut without losing the sprint goal?
- Any blockers I need to remove today?

Produce: 90-second standup summary I can read or post in Slack.
```

### Mid-sprint scope check (Day 5-6 of a 2-week sprint)

```
/pm-sprint-review

Mid-sprint health check — Sprint [N]:

Burn rate so far: [X pts done] / [Y pts committed] in [N] of [M] days
On track? [Yes / Slipping / At risk]

Stories at risk of not finishing: [list any that seem blocked or undersized]
Unplanned work added: [any work added since planning — estimate its points impact]

Options if we're behind:
1. Cut scope: which stories can we defer without breaking the sprint goal?
2. Negotiate extension: is any story 80% done that just needs one more day?
3. Ask for help: can any engineer be unblocked by PM action today?

Recommend: what should I do in the next 24 hours to protect the sprint goal?
```

### Blocker resolution

```
/product-manager-toolkit

I need to resolve this blocker today: [describe the blocker]

Type of blocker:
- External dependency: [API not ready / design decision pending / legal review]
- Ambiguity: [AC unclear, team has two interpretations]
- Technical: [eng discovered something unexpected — scope creep risk]
- Process: [approval loop, unclear ownership]

What I need from Claude:
- What are my options to unblock this?
- What's the fastest resolution path?
- If I can't resolve today, what's the fallback (cut the story / defer / descope)?
- Who do I need to involve and what's the specific ask?

Give me a concrete plan to resolve or mitigate this by end of day.
```

### Stakeholder update (as needed, mid-sprint)

```
/product-manager-toolkit

Write a mid-sprint stakeholder update for [CEO / Sales / Customer Success / Enterprise Customer].

Sprint progress: [X pts done] of [Y] — [on track / slipping]
Key items completed so far: [list 1-2 shipped items]
Key items still in progress: [list]
Any change to expected delivery: [yes/no — if yes, explain]

Audience: [name/role] — they care most about: [delivery date / specific feature / unblocking their team]
Format: [Slack message / email / 2-paragraph update]

Write the update in their language, not PM jargon.
```

---

## End of sprint

### Sprint review (the full ritual)

```
/pm-sprint-review

Run the full Sprint [N] review.

Sprint dates: [start] to [end]
Sprint goal: [state it]
Team: [N engineers, N designers]

Data:
- Planned: [paste ticket list with points and status]
- Unplanned work added: [list]
- Velocity this sprint: [X pts]
- Last 3 sprint velocities: [sprint N-2: X] [sprint N-1: X] [sprint N: X]
- Sprint goal achieved: [yes / partial / no]

Produce:
1. Sprint goal verdict
2. Shipped vs. planned table
3. What slipped and root cause
4. Velocity trend analysis
5. Retrospective highlights (from what I observed — I'll add team input in the retro)
6. Stakeholder-ready sprint summary (3 paragraphs — what shipped, what didn't, what's next)
7. Next sprint priority recommendations based on what slipped
```

### Retrospective (1 hour with the team)

```
/pm-sprint-review

Facilitate the Sprint [N] retrospective.

Format: [synchronous in Zoom / async in Notion / Miro board]
Team size: [N people]
Sprint outcome: [goal met / partial / missed]
Known tensions to address: [anything from the sprint that needs air time]

Structure:
1. What went well — prompt and expected themes
2. What didn't — prompt and framework for honest diagnosis
3. Root cause drill on top 2 issues (5 whys)
4. Action items — maximum 2, with owner and due date

Produce: facilitator guide with exact prompts and timing.
```

### Post-sprint stakeholder summary

```
/product-manager-toolkit

Write the sprint review summary for [audience].

Audience: [exec team / investors / other departments / full company]

Sprint [N] summary data:
- Goal: [state it]
- Outcome: [met / partial / missed]
- Shipped: [list with brief impact notes]
- Slipped: [list with honest reason]
- Next sprint focus: [top 1-2 items]

Length: [one Slack post / one-page doc / 3-bullet email]
Tone: [transparent / celebratory / sober and matter-of-fact]

Never: bury slips, use jargon, pad with filler, omit the sprint goal outcome.
```

---

## Sprint retrospective action tracking

At the end of every retrospective, document exactly two action items. Track these.

```
/product-manager-toolkit

Track retrospective actions across the last [N] sprints:

Sprint [N-3] retro action: [what] — Owner: [who] — Completed: [yes/no]
Sprint [N-2] retro action: [what] — Owner: [who] — Completed: [yes/no]
Sprint [N-1] retro action: [what] — Owner: [who] — Completed: [yes/no]
Sprint [N] retro actions: [new actions from this sprint]

Analyse:
- Are we completing retro actions? (target: 100% before next retro)
- Is any recurring problem showing up in multiple retros?
- What does the pattern of retro issues tell us about our process?

Recommend: should we change the retro format or ownership of actions?
```

---

## When things go wrong

### "The sprint goal is at risk by Day 7"

```
/pm-sprint-review

Emergency sprint scope review — Day [X] of Sprint [N]:

Sprint goal: [state it]
Points committed: [X] | Points done: [Y] | Points remaining: [Z]
Days remaining: [N]

If we continue at current pace, we will deliver: [estimated final points]
That means: [list stories that will NOT be finished]

Option A — Protect the sprint goal:
Cut these stories from the sprint: [list candidates that don't affect the goal]
Impact: [what we lose / who we need to notify]

Option B — Negotiate the sprint goal:
Descope the goal to: [revised version]
This still delivers: [value]
This sacrifices: [what's removed]

Option C — Escalate for resource:
What would we need (help from another engineer, design decision today, unblock X) to stay on track?

Recommend: which option and why. Give me the exact message to send to the team and stakeholders.
```

### "Engineering pushed back on our estimates"

```
/user-story-writer

Engineering says this story is [X pts] but I estimated [Y pts]. Resolve the disagreement.

Story: [paste the story]
PM estimate: [Y pts] — rationale: [why I thought this]
Engineering estimate: [X pts] — their concern: [what they said]

Common reasons engineering estimates higher:
- Hidden technical complexity not visible from the AC
- Existing tech debt that must be addressed first
- Missing edge cases in the AC that will surface during implementation
- Integration complexity underestimated

Review the story:
1. Are there gaps in the AC that explain the engineering concern?
2. Should we split the story to remove complexity?
3. Is there a scope change that would bring the estimate down without losing core value?

Produce: revised story or splitting recommendation that resolves the gap.
```

---

## Benchmarks

| Metric | Target | Warning sign |
|---|---|---|
| Sprint goal hit rate | >70% | <50%: planning or scope problem |
| Story readiness at planning | >90% of committed stories | <70%: backlog grooming insufficient |
| Unplanned work | <20% of capacity | >30%: reactive team |
| Retro action completion | 100% before next retro | <50%: actions not real commitments |
| Stakeholder update frequency | After every sprint | No update = stakeholders fill the vacuum with assumptions |
| PM time in reviews/ceremonies | <25% of work week | Higher: PM is admin, not PM |

---
