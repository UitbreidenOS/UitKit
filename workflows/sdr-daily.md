# SDR Daily Workflow

A repeatable daily workflow for an AI-augmented SDR using Claude Code — covering territory review, outreach, reply handling, calls, and pipeline management.

---

## Overview

**Time investment:** ~1.5-2 hours of structured Claude Code sessions per day (replaces 5-6 hours of manual work).

**What this workflow covers:**
- Morning: territory brief + lead scoring + outreach batch
- Midday: inbox triage + reply handling
- Pre-call: call prep
- Post-call: transcript analysis + CRM update
- Weekly: territory review + pipeline report + ICP refresh

**Prerequisite:** `/hubspot` MCP configured, at least `/sdr-research-brief`, `/sdr-reply-classifier`, and `/sdr-call-prep` installed.

---

## Daily schedule

### 8:00-8:30am — Morning territory brief

**Goal:** Know exactly what to focus on today before opening email.

```
Step 1: Pull yesterday's activity summary from HubSpot
What happened yesterday?
- Replies received: [N]
- Meetings booked: [N]
- Calls made: [N]
- New accounts added to sequence: [N]

Step 2: Run territory brief
/sdr-territory-mapper

Today's focus:
- New trigger signals on any accounts in my territory in last 24 hours
- Sequences on Day 3 (value email due) — [list accounts]
- Sequences on Day 7 (angle change due) — [list accounts]
- Sequences on Day 14 (breakup email due) — [list accounts]
- A-tier accounts not yet contacted — top 5 for today

Output: Today's priority list (max 10 accounts to touch today)
```

**Decision rule:**
- 3-5 new outreach: research + draft with `/sdr-research-brief` + `/sdr-agent`
- 3-5 follow-ups: run the scheduled sequence step (no new research needed)
- 2-3 calls: run `/sdr-call-prep` for each before dialling

---

### 8:30-9:30am — Outreach batch

**Goal:** Launch today's personalised outreach with zero generic emails.

```
For each new account (max 5 per day — quality over quantity):

STEP 1: RESEARCH (5-10 minutes for all 5 accounts)
/sdr-research-brief

Accounts to research:
1. [Company 1] — target contact: [Name, Title]
2. [Company 2] — target contact: [Name, Title]
[...]

My product: [one line]
My ICP: [definition]
Give me: trigger, ICP score, stakeholder, opening hook

STEP 2: DRAFT (10-15 minutes for all 5)
/sdr-agent

Using the research above, draft outreach for each account.
Show me all 5 drafts for review before scheduling.
Each email must:
- Reference the specific trigger from the research
- State value in 1 sentence
- Have a specific, low-friction CTA

STEP 3: REVIEW AND APPROVE (5-10 minutes)
Review each draft:
- Is the trigger reference specific enough?
- Does the subject line stand out?
- Is the CTA clear?

Edit as needed, then approve.

STEP 4: SCHEDULE
For approved drafts:
- Email: schedule via [your email tool] or paste and send manually
- LinkedIn: queue the connection message
- Log each in HubSpot: contact updated, sequence started, note added
```

**Quality check before sending:**
- Does the first sentence reference something specific? (Not "I noticed you're the VP of Sales")
- Is the email under 7 sentences?
- Is there ONE clear ask?
- Would I reply to this if I received it?

---

### 10:00-10:15am — Inbox triage (first pass)

**Goal:** Know what came in, respond to hot leads fast. Sub-5-minute reply = 3x booking rate.

```
/sdr-reply-classifier

Morning inbox — replies received since last check:

[Paste all replies — name, email, reply body]

For each:
1. Classify intent
2. Draft response if needed
3. Update CRM
4. Flag hot replies (interested / referral) to Slack

Show me: hot replies first, then the full triage table.
```

**Act immediately on:**
- `interested` — book the meeting while they're warm. Don't "send an email later."
- `referral` — ask for the intro immediately
- `question` — answer the question + soft CTA within 15 minutes

**Batch for later:**
- `not_now` — schedule follow-up, update CRM
- `objection` — draft response, review at lunch
- `ooo` — schedule follow-up for return date

---

### 10:15am-12:00pm — Calling block

**Goal:** 15-20 outbound dials. No multitasking. Phone-only mode.

**Before the block:**
```
/sdr-call-prep

Prep me for today's call list:
1. [Name] at [Company] — cold call, goal: book discovery
2. [Name] at [Company] — follow-up on reply "send me more info"
3. [Name] at [Company] — re-engage, closed-lost 6 months ago, new exec hire

For each: opening, talk track, top 2 objections, voicemail backup.
```

**During calls:**
- Follow the talk track — don't freestyle until you've done 200+ calls
- If they raise an objection: use the `/sdr-objection-handler` scripts you prepped
- If they're interested: IMMEDIATELY book the meeting on the call. Not "I'll send a calendar invite." Book it now.
- If no answer: leave the 27-second voicemail. No exceptions.

**After each call (2 minutes):**
```
/sdr-call-analysis

Quick CRM note for: [Name] at [Company]
Call duration: [X minutes]
Outcome: [one word — booked/voicemail/objection/positive/no-answer]
Key quote: "[most important thing they said]"
Next step: [exactly what happens next]
```

---

### 12:30-12:45pm — Midday inbox sweep

```
/sdr-reply-classifier

Replies since morning triage:
[paste any new replies]

Same as morning — classify, draft, Slack hot leads.
```

---

### 2:00-3:00pm — Sequence follow-ups

**Goal:** Send all scheduled follow-up steps for accounts already in sequence.

```
Day 3 (value email) — accounts in sequence for 3 days:
/email-automation

Write Day 3 follow-up for [N] accounts.
Day 0 email subject was: [original subject]
Add new value: [case study / data point / relevant insight — specific to their industry]
Keep it to 4-5 sentences.
```

```
Day 7 (angle change) — accounts in sequence for 7 days:
Try a completely different angle than Day 0 and Day 3.
Reference something different: a different pain point, a different social proof, a different channel.
```

```
Day 14 (breakup) — accounts in sequence for 14 days:
/email-automation

Write graceful breakup emails for [N] accounts.
Rules: 3 sentences max. No guilt. Leave the door open. Never say "I've tried to reach you X times."
```

---

### 3:00-4:00pm — New lead scoring (if applicable)

**Goal:** Process any new inbound leads or Apollo exports before end of day.

```
/sdr-lead-scorer

New leads from [source — webinar / inbound form / Apollo export / event]:
[paste lead list]

Score against ICP. Give me:
- A-tier: call tomorrow morning
- B-tier: add to sequence this week
- C-tier: nurture
- D-tier: archive
```

---

### 4:30-5:00pm — End-of-day CRM cleanup + next-day prep

```
Step 1: CRM audit
Did I log every call? Every email sent? Every reply received?
Run: /crm-hygiene check — any contacts I touched today without a CRM update?

Step 2: Tomorrow's priority list
Based on today's activity:
- Who replied positively and needs a follow-up tomorrow?
- Which sequences are on Day 3/7/14 tomorrow?
- What are my top 3 new accounts to research tomorrow morning?

Step 3: Set HubSpot tasks
For each item above: create a HubSpot task with due date = tomorrow.
```

---

## Weekly rhythm

### Monday — Territory week plan (30 minutes)
```
/sdr-territory-mapper

Weekly planning:
- How many meetings do I need this week to stay on track for monthly quota?
- What's my whitespace count?
- Which accounts have new trigger signals from the weekend?
- Priority 10 accounts to research and launch this week
```

### Wednesday — Mid-week pipeline check
```
Check: am I on track for weekly meeting quota?
If behind: identify which accounts in sequence are most likely to convert
If ahead: look at expanding territory or helping teammates
```

### Friday — Weekly wrap + coaching review (30 minutes)
```
/sdr-call-analysis

Batch review — analyse my 5 best and 5 worst calls from this week.
What objection am I missing consistently?
What email subject lines had the highest reply rates?
What trigger type is converting best?

Output: 1 thing to do better next week (specific, actionable)
```

---

## Monthly rhythm

### First Monday of month — ICP refresh
```
/sdr-lead-scorer

Rescore my entire territory against updated ICP criteria.
Any accounts that were C-tier 90 days ago that now have trigger signals?
Any accounts that were A-tier but have gone cold?
```

### Third week of month — CRM hygiene
```
/crm-hygiene

Monthly cleanup:
- Contacts not touched in 90 days → tag for re-engagement or archive
- Duplicate contacts → merge
- Missing job title or company fields → enrich
- Opted-out contacts → confirm removed from all sequences
```

---

## When things go wrong

### "My reply rate is below 3%"
```
/sdr-agent

Diagnose my outreach performance.
Here are 10 emails I sent this month that got no reply:
[paste emails]

What's wrong? Is it:
- Subject line (no curiosity, too salesy)
- First sentence (not specific enough, starts with "I")
- Value prop (features not outcomes)
- CTA (too demanding, no clear ask)
- Trigger (too generic, not timely)

Give me a rewrite of the worst-performing email and explain every change.
```

### "My call-to-meeting rate is below 5%"
```
/sdr-objection-handler

Red-team my pitch. My current opening:
[paste your current cold call opener]

What are the 5 hardest objections a sceptical VP would raise?
Show me: what I'm currently saying (weak) vs. what I should say (strong).
```

### "My CRM is a mess"
```
/crm-hygiene

Full CRM health check on my territory:
- Stale contacts (no activity 90+ days)
- Contacts without company or title
- Duplicate records
- Contacts in sequence but opted out
- Missing next-step tasks

Fix the top 20 issues now.
```

---

## Key benchmarks by tenure

| Metric | Week 1-4 | Month 2-3 | Month 4+ (ramped) |
|---|---|---|---|
| Daily dials | 20 | 35 | 50 |
| New outreach/week | 30 | 75 | 150 |
| Reply rate | 3-5% | 5-7% | 7-10% |
| Meetings/week | 2-3 | 5-7 | 8-12 |
| Time per account (research + draft) | 15 min | 8 min | <5 min |

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
