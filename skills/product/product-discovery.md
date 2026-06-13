---
name: product-discovery
description: "Product discovery: customer interviews, problem validation, opportunity scoring, Jobs-to-be-Done framework, defining what to build next and why"
updated: 2026-06-13
---

# Product Discovery Skill

## When to activate
- Deciding what to build next with limited evidence
- Validating a product idea before investing in development
- Conducting customer interviews and synthesising insights
- Applying Jobs-to-be-Done (JTBD) framework to understand user motivations
- Writing a problem statement or opportunity brief
- Scoring and prioritising a backlog of potential features

## When NOT to use
- After the decision to build is made — that's product spec and delivery
- UX/UI design — use a design tool or design-sprint process
- A/B test design — use the experiment-designer skill
- Market sizing for investors — that's a financial model, not discovery

## Instructions

### Customer interview guide

```
Write a customer interview guide for [problem/product area].

What we're trying to learn: [specific uncertainty or hypothesis to validate]
Interview target: [who to talk to — role, company type, context]
Number of interviews planned: [X]

Interview structure (45-60 minutes):

1. Warm-up (5 min):
   - "Tell me about your role and what a typical [week / project] looks like"
   - "How long have you been doing this?"
   - Goal: build rapport, understand context — do NOT ask about the product yet

2. Current situation (10 min):
   - "Walk me through the last time you had to [do the thing we're solving]"
   - "What does that process look like today?"
   - "Who else is involved?"
   - Rule: ask about past behaviour, not hypothetical future behaviour

3. Pain and friction (15 min):
   - "What's the hardest part of that process?"
   - "How much time does it take? How often?"
   - "What have you tried to fix this? What happened?"
   - "How do you solve it today? What's wrong with that solution?"

4. Motivation and outcome (10 min):
   - "Why does this matter to you / your team / your company?"
   - "What would be different if this was solved completely?"
   - "What's the cost of not solving it?" (time, money, risk, emotion)

5. Wrap-up (5 min):
   - "Is there anything I didn't ask that would help me understand this better?"
   - "Who else should I talk to?"

Rules:
- Never ask "Would you use X?" — people say yes to everything hypothetical
- Never show the product or mockup until after you understand the problem
- Ask "tell me more" and "why" constantly
- Take notes on exact words (vocabulary matters for messaging)

Generate the guide for my specific problem area with tailored questions.
```

### Jobs-to-be-Done analysis

```
Apply the Jobs-to-be-Done framework to understand [product/feature].

Context: [describe the product and the user doing the job]

JTBD framework:

1. Define the job:
   Format: When [situation], I want to [motivation], so I can [outcome].
   
   Example: "When I onboard a new engineer to the codebase, I want to get them productive quickly, so I can maintain team velocity without becoming a bottleneck."
   
   Job for my context: [write the job statement]

2. Decompose the job into steps (job map):
   Step 1 — Define: what does the user do to frame or scope the task?
   Step 2 — Locate: what information or resources do they need to find?
   Step 3 — Prepare: how do they set up to do the job?
   Step 4 — Execute: what is the core job action?
   Step 5 — Monitor: how do they track progress or quality?
   Step 6 — Modify: what do they adjust when things don't go to plan?
   Step 7 — Conclude: how do they wrap up and hand off?

3. Identify outcomes (what the user measures success by):
   - Speed: how fast can they do [step X]?
   - Accuracy: how reliably does [step X] produce the right result?
   - Effort: how much cognitive/physical effort does [step X] require?
   - Risk: how certain are they that [step X] won't fail?

4. Find underserved outcomes (the opportunity):
   Rate each outcome: importance vs. current satisfaction (1-10 scale)
   Opportunity score = importance + (importance - satisfaction)
   Score > 10: strong opportunity to address

Apply for: [specific user and job in my product].
```

### Opportunity scoring

```
Score and prioritise product opportunities.

Opportunities to evaluate: [list — can be features, problems to solve, or segments to serve]
Available data: [customer interviews / support tickets / NPS comments / analytics / none]

Opportunity scoring framework (RICE or weighted criteria):

RICE scoring:
Reach: how many users affected per quarter? [X]
Impact: how much does it improve their outcome? [massive=3 / high=2 / medium=1 / low=0.5]
Confidence: how certain are we about reach and impact? [high=100% / medium=80% / low=50%]
Effort: engineering weeks to build? [X]
RICE = (Reach × Impact × Confidence) / Effort

Alternative: weighted criteria (if you want to include strategic fit):
| Opportunity | User Pain (30%) | Strategic Fit (20%) | Frequency (20%) | Effort (30%) | Total |
|---|---|---|---|---|---|
| [A] | 8 | 7 | 9 | 5 | 7.2 |
| [B] | 6 | 9 | 4 | 8 | 6.8 |

What to include in the scoring:
- User pain severity: how bad is the problem today?
- Frequency: how often does the user hit this?
- Strategic alignment: does this advance our core thesis?
- Feasibility: can we actually build it well?
- Market differentiation: does a competitor already do this well?

Score my [X] opportunities and produce a prioritised list with rationale.
```

### Problem brief

```
Write a problem brief for [opportunity].

Context: [what we know about this problem from research]
Evidence: [interview quotes, support ticket volume, analytics data]
Affected segment: [who experiences this, how many users]

Problem brief structure:

## The Problem
[2-3 sentences describing the specific situation, friction, and impact. No solution yet.]

## Who Experiences It
[User persona + quantification: "X% of our [segment] users face this when..."]

## Evidence
- Interview insight: "[Exact quote from a user]" — [Role, Company]
- Analytics: [relevant data point]
- Support: [volume or pattern from support]

## Current Workarounds
[How users solve this today — and why those solutions are insufficient]

## Why This Matters
[Business case: impact on retention, acquisition, revenue, or strategic position]

## What Success Looks Like
[Measurable outcome — not a feature, but the user's changed behaviour or result]

## What This Is NOT
[Constraints and out-of-scope clarifications — what we won't try to solve]

---
Open questions before we build:
- [Question 1 — what do we still not know?]
- [Question 2]
Discovery owner: [name]
Next step: [X more interviews / prototype test / build?]

Write a problem brief for my opportunity using the evidence I provide.
```

## Example

**User:** We're a project management tool for engineering teams. We keep hearing "our engineers don't update tickets." Should we build better Jira sync, more reminders, or enforce ticket updates? Discovery first.

**Claude's discovery plan:**

Don't build yet. "Engineers don't update tickets" is a symptom with at least 3 different root causes — each requiring a different solution.

**3 hypotheses to test in interviews:**
1. **Friction hypothesis:** Engineers know they should update but the workflow is too slow (→ solve with better UI, keyboard shortcuts, Slack integration)
2. **Trust hypothesis:** Engineers think the ticket data doesn't matter because PMs don't actually read it (→ solve with better visibility tools for PMs, not engineer flows)
3. **Irrelevance hypothesis:** Tickets get out of date because requirements change mid-sprint and nobody updates the source of truth (→ solve with lightweight re-planning flow, not reminders)

**5 interview questions to ask (to engineers, not PMs):**
1. "Walk me through the last ticket you worked on — when did you first look at it, when did you last update it?"
2. "When you finish a task, what's the next thing you do?" (listen for: never mention tickets)
3. "What happens if you don't update your ticket?" (listen for: nothing / PM asks me / sprint review is confusing)
4. "Have you ever updated a ticket and nothing happened as a result?" (validates the trust hypothesis)
5. "What would make you actually want to update tickets?" (open-ended, listen without projecting)

Run 5 interviews. You'll know which hypothesis is true — and probably save 2-3 months building the wrong thing.

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
