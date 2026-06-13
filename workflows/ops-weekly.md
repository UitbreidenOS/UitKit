# Operations Manager Weekly Workflow

A repeatable weekly workflow for an AI-augmented operations manager — covering OKR tracking, process work, vendor management, cross-functional coordination, and weekly reporting.

---

## Overview

**Time investment:** ~2-3 hours of structured Claude Code sessions per week (replaces 8-10 hours of manual work).

**What this workflow covers:**
- Monday: OKR pulse + week planning
- Tuesday-Thursday: process work, vendor management, cross-functional coordination
- Friday: weekly ops report + decisions log

**Prerequisites:** At minimum `/weekly-pulse`, `/process-mapper`, and `/meeting-to-action` installed.

---

## Monday — OKR pulse and week planning (45 minutes)

### 8:30-9:00am — OKR status check

**Goal:** Know exactly which OKRs are healthy, drifting, or at risk before the week starts.

```
/weekly-pulse

Week: [W of Q — e.g., W7 of Q2]
Date: [Monday date]

OKR status (update all key results):

Objective 1: [name]
  KR1.1: [metric] — Target: [X] — Current: [Y] — Trend: [up/flat/down]
  KR1.2: [metric] — Target: [X] — Current: [Y] — Trend: [up/flat/down]

Objective 2: [name]
  KR2.1: [metric] — Target: [X] — Current: [Y]
  KR2.2: [metric] — Target: [X] — Current: [Y]

[Add more OKRs as needed]

Status flags:
- GREEN: on track, no intervention needed
- AMBER: drifting, needs attention this week
- RED: at risk, requires immediate intervention or escalation

What I need:
1. Which OKRs are amber or red?
2. For each amber/red: what's the one operational lever I can pull this week?
3. Any leading indicators suggesting a green OKR might turn amber?
4. This week's priority score: [top 3 actions that will move the needle most]
```

---

### 9:00-9:30am — Week planning session

```
Week planning for [DATE RANGE]:

Carry-forward from last week:
- Unfinished actions: [list any incomplete items]
- Decisions pending: [list decisions that need to happen this week]
- Escalations due: [any issues that need CEO/board input?]

This week's fixed commitments:
- Meetings: [list with purpose]
- Deadlines: [hard deadlines this week]
- Reviews: [vendor calls, budget reviews, etc.]

Available capacity: approximately [X hours] of focused work time

Given my OKR status, what are my top 3 priorities this week?
What can I delegate, defer, or delete?
Output: My weekly plan on one page.
```

---

## Tuesday — Process work

### 9:00-11:00am — Deep process documentation or improvement

Pick one process per week to map, document, or improve. Rotate through your highest-risk or most-complained-about processes.

**Step 1: Map the process**

```
/process-mapper

Process: [name]
Trigger: [what starts it]
End state: [what done looks like]
Participants: [roles]
Tools: [systems]
Known pain: [what's broken]

Produce: step-by-step map, RACI, bottleneck analysis, improvement recommendations.
```

**Step 2: Convert to SOP**

```
/sop-writer

Process name: [name]
Owner: [role]
Version: [1.0 or update version]
Review date: [6 months from today]

Based on this process map: [paste output from step 1]

Write: complete SOP with purpose, scope, RACI, step-by-step instructions, decision rules, escalation path, success metrics.
```

**Step 3: Assign and track improvements**

```
/meeting-to-action

Process improvement decisions from today's session:

Process: [name]
Improvements identified: [list from process-mapper output]

Convert each improvement into an action item:
- Owner: [role responsible for implementing]
- Due date: [realistic timeline]
- Success metric: [how we know it's done]
- Dependencies: [what needs to happen first]

Format as Jira/Linear tasks.
```

---

## Wednesday — Vendor and partner management

### 10:00-12:00pm — Vendor review or evaluation

**For ongoing vendor management (monthly check-in):**

```
/vendor-evaluator

Quarterly vendor review — [VENDOR NAME]

Contract details:
- Annual spend: [$X]
- Renewal date: [date]
- Current contract term: [remaining months]

Review dimensions:
1. ROI achieved: [are we getting value? quantify if possible]
2. Usage rate: [% of licences/features actually being used]
3. Support quality: [NPS or incidents — any pattern of poor support?]
4. Product development: [have they shipped meaningful improvements?]
5. Market alternatives: [any better options emerged?]
6. Renewal pricing: [their ask vs. market rate]

Recommendation: Stay and renew / Renegotiate / Replace
If renegotiating: top 3 leverage points
If replacing: switching cost estimate and shortlist of alternatives
```

**For new vendor evaluations:**

```
/vendor-evaluator

New vendor evaluation: [category — e.g., project management tool, HRIS, analytics platform]

Context:
- Current solution (if any): [what we're replacing]
- Budget: [$X/year]
- Must-have requirements: [list]
- Nice-to-haves: [list]
- Timeline to decide: [date]
- Who uses this: [roles and team sizes]

Vendors to evaluate: [shortlist]

Step 1: Build scoring rubric and RFP questions
Step 2: [After demos] Build comparison matrix
Step 3: Write recommendation memo for CEO/CFO
```

---

## Thursday — Cross-functional coordination

### 9:00-10:00am — Stakeholder alignment

**For any cross-functional initiative:**

```
@chief-of-staff

Initiative: [name and brief description]

Current status: [where we are]
Stakeholders:
- [Team 1 / Person 1]: [what they own, current status]
- [Team 2 / Person 2]: [what they own, current status]

Blockers:
- [Blocker 1]: [who needs to resolve it, by when]
- [Blocker 2]: [same]

This week's coordination needs:
- What decisions need to be made before end of week?
- Who needs to talk to whom?
- What's the critical path?

Produce:
1. Stakeholder update I can send via email/Slack today
2. Decision log: decisions pending + decision owner + deadline
3. Risk flag: anything that could derail this initiative in the next 14 days
```

### 10:00-11:00am — Meeting preparation

**For any significant meeting today or tomorrow:**

```
Prep for: [meeting name and date]
Attendees: [list with roles]
Purpose: [decision / status / escalation / brainstorm]
Background: [what context they need]
My goal: [what I want to achieve by end of meeting]
Key questions to answer: [list]
Potential objections or conflicts: [anticipate resistance]

Produce:
- 5-minute pre-read I can send to attendees
- Meeting agenda with time allocations
- The 1 decision that must be made in this meeting (if applicable)
- What I'll say if the meeting goes off-track
```

### 11:00am-12:00pm — Meeting debrief

**After every significant meeting:**

```
/meeting-to-action

[Paste meeting notes or transcript]

Meeting: [name]
Date: [date]
Type: [decision / status / escalation / brainstorm]
Attendees: [list]

Extract:
- Decisions made (each with owner)
- Action items (owner, due date, deliverable)
- Open questions
- Commitments made to other parties
- Parking lot items

Format: Slack summary + task list for Jira/Linear.
```

---

## Friday — Weekly ops report and close-out (60 minutes)

### 3:00-4:00pm — Weekly report

```
/weekly-pulse

Weekly ops report for week ending [DATE]:

OKR update (delta from Monday check):
[For each OKR: current value, change this week, any status change green/amber/red]

Wins this week:
[List 3-5 things that went right]

Misses or risks:
[List any slipped deadlines, failed decisions, emerging risks — with root cause for each]

Process work completed:
[SOPs written or updated, process improvements shipped, RACI clarifications done]

Vendor work:
[Evaluations progressed, contracts reviewed, renewals actioned]

Cross-functional updates:
[Key initiatives and their current status]

Decisions made this week:
[List significant decisions with context — this is your decisions log]

Next week priorities (top 3):
[What most needs to happen next week to keep OKRs on track]

Decisions needed from CEO/leadership before next Monday:
[List any blockers requiring executive input]

Format: 3-bullet executive summary (for CEO check-in) + detailed section (for your ops team).
```

### 4:00-4:30pm — Next week prep

```
Based on this week's report:

1. Pre-populate Monday's OKR check-in with known data points
2. Create Jira/Linear tasks for next week's action items
3. Send the weekly summary to stakeholders who need it
4. Flag any items that need CEO/CFO/CTO eyes before Monday

Review:
- Did every meeting produce a /meeting-to-action output this week?
- Are all vendor evaluation deadlines tracked?
- Are all open process improvement action items assigned with due dates?
```

---

## Monthly rhythm

### First Monday of month — OKR mid-point review

```
/weekly-pulse

Month [N] of Q[N] OKR review:

For each key result:
- Starting value: [X]
- Target for end of quarter: [X]
- Current value: [X]
- % of the way through the quarter: [X%]
- % of the way to target: [X%]
- On track if you extrapolate the trend? [yes/no]

For any KR tracking behind the linear trajectory:
- What happened? (root cause — not excuses, just analysis)
- What's the intervention? (specific actions to change the trajectory)
- Who owns the intervention? (one person, not "the team")
- New target if original target is genuinely unachievable: [adjusted target with rationale]
```

### Third week of month — Process review

Pick 3 live SOPs and verify:
- Are they still accurate? (processes change, SOPs often don't)
- Are they being followed? (ask the people who own them)
- Any improvements identified in the last 30 days that aren't incorporated?

Run `/sop-writer` to update any stale documents.

---

## When things go wrong

### "We have a cross-functional crisis"

```
@chief-of-staff

Crisis situation: [describe what's broken]
Teams involved: [list]
Timeline pressure: [when does this need to be resolved?]
What's been tried: [any previous attempts to resolve it]
Escalation level: [can this be resolved at team level, or does it need executive involvement?]

Give me: immediate actions in the next 24 hours, stakeholder communication draft, escalation recommendation.
```

### "We have vendor lock-in and need to exit"

```
/vendor-evaluator

Vendor exit planning for: [vendor name]
Annual spend: [$X]
Contract expiry: [date]
Lock-in risks: [data portability, integrations, user habits, training]

Assess:
1. What is the true cost of switching? (data migration, retraining, integration rebuild, downtime)
2. What leverage do we have at renewal? (alternative vendors, competitive pricing)
3. Recommended approach: negotiate exit / migrate before renewal / renegotiate terms
4. 90-day exit plan if we decide to migrate
```

### "An OKR is going to miss badly"

```
@coo-advisor

I have an OKR that is [X% off track] with [N weeks] remaining in the quarter.

OKR: [name and description]
Current value: [X]
Target: [Y]
Root cause of the gap: [honest assessment]
What we've tried: [list interventions already attempted]

Options:
1. Push hard — what would it take to close the gap?
2. Adjust the target — how do I frame this with the CEO without destroying credibility?
3. Abandon this OKR — is there a case for deprioritising?

Give me the recommendation and the talking points for the CEO conversation.
```

---

## Key benchmarks

| Metric | Target | Investigate if... |
|---|---|---|
| OKRs completed per quarter | ≥ 70% | < 50% |
| Meeting action item close rate | ≥ 85% on time | < 70% |
| Vendor decision cycle time | < 30 days | > 60 days |
| Process SOPs up-to-date | ≥ 80% of critical processes | < 60% |
| Weekly report time | ≤ 30 minutes | > 90 minutes |
| Cross-team blocker resolution | ≤ 3 business days | > 7 days |
| Weekly pulse run without gaps | Every Monday | Missing > 1/month |

---
