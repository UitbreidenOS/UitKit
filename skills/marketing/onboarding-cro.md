---
name: onboarding-cro
description: "User onboarding optimisation: activation flows, aha-moment identification, empty states, email sequences, in-app checklists — reduce time-to-value and improve trial conversion"
updated: 2026-06-13
---

# Onboarding CRO Skill

## When to activate
- Improving trial-to-paid conversion by fixing the onboarding flow
- Identifying and accelerating the "aha moment" for new users
- Designing empty states, checklists, and in-app nudges
- Writing onboarding email sequences (activation drip)
- Auditing a signup-to-activation funnel for drop-off

## When NOT to use
- General funnel analytics setup — use the analytics-tracking skill
- A/B test framework design — use the experiment-designer skill
- Marketing landing pages — use the copywriting skill
- Paid acquisition — use the paid-ads skill

## Instructions

### Identify the aha moment

```
Help me identify the aha moment for [product].

Product: [describe what it does]
Core value proposition: [what problem does it solve?]
User type: [who are your best customers?]
Current activation event tracked: [the event you call "activated" — or none]

Framework for finding the aha moment:

1. Correlation method (if you have data):
   Look at users who converted to paid vs. those who churned.
   What action did converters take that churners didn't?
   Run in Mixpanel/Amplitude: "Users who did X within 7 days have Y% higher retention"

2. Interview method (qualitative):
   Ask 5-10 power users: "Tell me about the moment you knew this product was worth paying for."
   Look for a specific action, not a feeling.

3. Product logic method (if no data):
   Map the user journey: signup → [step 1] → [step 2] → ... → value
   The aha moment = the first step where the user experiences YOUR core value, not just setup.

Common aha moment patterns:
- Slack: sent first message in a channel (team present)
- Dropbox: saved first file from multiple devices (sync working)
- Loom: received a reply on a recorded video (value loop complete)

For my product, the aha moment is likely: [identify the specific action]

Define the activation event: [user completes X within Y days of signup]
```

### Onboarding flow design

```
Design an onboarding flow for [product].

User type: [solo / team / enterprise]
Time to aha moment currently: [unknown / X days / X minutes]
Goal: reach aha moment in < [X] minutes for [X]% of users
Signup method: [email / Google OAuth / invite-only]
Current onboarding: [none / email only / in-app checklist / guided tour]

Onboarding flow blueprint:

Step 1 — Frictionless signup:
□ Social login preferred (removes email/password friction)
□ Collect only what's needed for personalisation (not company size for a solo tool)
□ Clear progress indicator if multi-step

Step 2 — Personalisation question (1-2 questions max):
"What will you primarily use [product] for?" → routes to relevant empty state
Why: makes the product feel relevant before they've done anything

Step 3 — First action prompt (empty state):
□ Show ONE thing to do, not five
□ Use action verbs: "Create your first X" not "Welcome to [product]"
□ Pre-fill with an example so they see what good looks like
□ Offer a "quick demo" or sample project for hesitant users

Step 4 — Aha moment delivery:
□ The screen/moment where the core value is experienced
□ Celebrate it with a micro-win animation or confirmation
□ Surface next action immediately (don't let momentum die)

Step 5 — Habit formation:
□ Invite a team member (if team product)
□ Connect integration (Slack, GitHub, etc. — the "sticky" hook)
□ Set a recurring reminder or workflow

Anti-patterns to avoid:
- Feature tours (users skip them — get them to do, not watch)
- Asking for credit card before value is experienced
- Long setup wizards before any value is delivered

Design the flow for my product with specific copy for each step.
```

### Onboarding email sequence

```
Write an onboarding email sequence for [product].

Trial length: [X days / no expiry]
Activation definition: [user completes X]
Activated users' conversion rate: [X%]
Non-activated users' conversion rate: [X%]
From name: [founder / product team / support]

Email sequence:

Email 1 — Welcome (send: immediately after signup):
Subject: [Get to the aha moment fast — not "Welcome to [Product]"]
Goal: drive first login and first action
Content: 1 sentence about what they can do today + one CTA button
Length: < 100 words

Email 2 — Activation nudge (send: Day 2, if not activated):
Subject: [Did you try X yet?]
Goal: remove the blocker stopping first action
Content: name the #1 thing most users get stuck on + how to solve it
CTA: direct link to the step they haven't completed

Email 3 — Social proof (send: Day 3, if not activated):
Subject: [How [company] saved [X] using [product]]
Goal: reinvigorate intent with a relevant case study
Content: 3-sentence story of a similar user's result
CTA: "See how they did it" → link back to product

Email 4 — Feature highlight (send: Day 5, if activated):
Subject: [You've done X. Here's what to try next.]
Goal: deepen engagement toward aha moment or upgrade intent
Content: the one feature that converts free users to paid
CTA: try the feature with a deep link

Email 5 — Trial expiry warning (send: Day [trial_length - 3]):
Subject: [3 days left — here's what you'll lose]
Goal: convert or extend
Content: specifically name what they'll lose access to
CTA: upgrade now + "Need more time?" extension option

Email 6 — Last day (send: Day [trial_length]):
Subject: [Last chance — your [product] trial ends tonight]
Goal: final conversion push
Content: hardest offer (discount if budget allows), or extend 7 days
CTA: upgrade + "not now" option that asks for feedback

Write each email for my product. Include subject, preview text, and body.
```

### In-app checklist design

```
Design an onboarding checklist for [product].

Goal of checklist: reach aha moment / get to first value / complete setup
User persona: [describe]
Items to complete: [list the steps you want users to take]
Reward mechanism: [progress bar / celebration / unlock a feature]

Checklist design principles:
1. Maximum 5 items — more than 5 feels like homework
2. First item: completable in < 2 minutes (builds momentum)
3. Show checkmarks as items are done (completion psychology)
4. The "unlock" happens at item 3-4, not the last item (keep them engaged)
5. Collapse once completed, don't disappear (reference value)

Checklist for my product:
□ [Item 1] — [X mins] — completes when: [event fired]
□ [Item 2] — [X mins] — completes when: [event fired]
□ [Item 3] — [X mins] — unlock: [feature or content reward]
□ [Item 4] — [X mins] — completes when: [event fired]
□ [Item 5] — [X mins] — completion: [celebration + next step prompt]

Progress messaging at 0%, 40%, 80%, 100%:
[Write 4 messages that motivate completion]

Copy for each checklist item (task title + 1-line description).
```

## Example

**User:** Our project management SaaS for engineering teams has 18% trial-to-paid conversion. The aha moment is when a team completes their first sprint. Only 31% of trials ever get there. Fix the onboarding.

**Claude's diagnosis:**

31% reaching the aha moment is the real problem — not the 18% conversion. Fix activation first; conversion follows.

**Root cause:** "Complete a sprint" requires too many prerequisites — team invites, project setup, tickets created, sprint started, sprint completed. That's 5 steps, probably spread over days. Most solo trial starters never invite their team.

**3 changes with highest expected impact:**

1. **Change the activation event temporarily:** Define "aha moment" as "first sprint started with 3+ tickets" instead of "sprint completed." That's achievable in 30 minutes, not 2 weeks. Measure trial conversion from this earlier point.

2. **Add a team invite gate early:** On day 1, after first project created, prompt: "Engineering teams move 3x faster together — invite your team now." Make it easy (link share, not just email). Non-inviters are 4x less likely to convert.

3. **Pre-built sprint template:** Instead of empty project → create tickets → start sprint, offer: "Start with our 2-week sprint template" → 5 sample tickets pre-filled for a typical engineering team. Users can edit, not build from scratch. Reduces time-to-first-sprint-started from ~3 days to ~15 minutes.

Expected outcome: raising activation from 31% to 50% → estimated trial-to-paid improvement from 18% to ~28%.

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
