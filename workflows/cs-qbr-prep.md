# CS QBR Prep Workflow

End-to-end preparation process for a Quarterly Business Review — from data gathering to post-call follow-up — using Claude Code to cut prep time from 4-6 hours to under 60 minutes.

---

## Overview

This workflow covers the complete QBR lifecycle:

1. Data gathering (14 days before)
2. Health assessment and risk identification (10 days before)
3. ROI quantification (7 days before)
4. Deck and talking points (5 days before)
5. Pre-call prep (1 day before)
6. Post-call follow-up (same day)

**Total prep time with Claude Code:** 60-90 minutes across the two weeks before the QBR

**Who runs this:** CSM, with coordination from AE and CS leadership for strategic accounts

---

## Phase 1 — Data gathering (14 days before)

**Goal:** Collect all inputs before you open Claude. You cannot synthesise what you haven't gathered.

**Checklist of data to pull:**

**From product analytics:**
- Monthly active users (last 3 months, trend)
- Login frequency and recency
- Core feature usage by feature (which features, how often)
- Seat utilisation (active seats / licensed seats)
- Any new features adopted this quarter

**From your CRM:**
- All support tickets last 90 days — types, resolution times, open issues
- All CSM touchpoints last 90 days — call notes, email threads
- NPS score (most recent) and trend
- Stakeholder map — who's engaged, who hasn't been contacted, any changes in personnel

**From commercial:**
- Current ARR and renewal date
- Contract terms — what's included, what they've purchased vs. used
- Invoice status — current or overdue
- Any expansion conversations that occurred this quarter

**From the customer:**
- Their stated success criteria at contract start (from kickoff notes)
- Any public news about their business — headcount, product launches, funding, leadership changes

**Step 1.1 — Organise your data**

Create a simple document with sections for each category above. Paste what you have. Leave gaps visible — they're signals you need to fill before the QBR.

If you have gaps in product data: request it from your analytics or data team 10+ days before the QBR. Scrambling for usage data 2 days before is preventable.

---

## Phase 2 — Health assessment and risk identification (10 days before)

**Step 2.1 — Run health analysis**

```
/health-score-analyzer

Analyse the health of [Customer Name] ahead of their QBR on [date].

[Paste all data gathered in Phase 1]

Produce:
1. Overall health score and risk tier
2. Top 3 risk signals (ranked by severity)
3. Top 3 positive signals (what's genuinely working)
4. Churn probability: low / medium / high
5. Expansion readiness: ready / not yet / blocked by [issue]
6. What needs to be addressed in the QBR vs. resolved before it
```

**Step 2.2 — Determine QBR posture**

Based on the health assessment, choose one of three QBR modes:

**GREEN account — Partnership QBR**
Goal: celebrate wins, deepen relationship, set up expansion conversation
Tone: collaborative, forward-looking
Expansion: raise it in the session — "Given what you've achieved, here's what's possible next"

**YELLOW account — Course correction QBR**
Goal: identify and resolve the blockers preventing full value
Tone: honest, problem-solving
Expansion: do not raise unless health is clearly improving — focus on winning trust

**RED account — Recovery QBR**
Goal: acknowledge the problem, present a concrete fix, rebuild confidence
Tone: direct, accountable — do not lead with good news if the relationship is damaged
Expansion: off the table entirely — focus on saving the account
Special preparation needed: loop in VP CS or exec; prepare service credit or remediation offer if needed

---

## Phase 3 — ROI quantification (7 days before)

**This is the most important slide in any QBR. It requires specific numbers, not vague statements.**

**Step 3.1 — Build the ROI case**

```
/qbr-builder

Quantify the ROI [Customer Name] has received from our product this quarter.

Customer use case: [specific workflow they use our product for]
Contract value: $[X] ARR

Available data:
- Usage: [describe what you have — feature usage counts, user sessions, etc.]
- Success criteria from kickoff: [paste what was agreed at contract start]
- Any outcomes they've mentioned on calls: [paste relevant call notes]
- Industry benchmarks for this use case (if known): [X hours saved / X% efficiency gain]

ROI dimensions to quantify:
1. Time savings: [how much time does this use case save per user per week?]
2. Error reduction: [if applicable]
3. Revenue impact: [if their use of our product influences their revenue]
4. Headcount avoided: [if applicable]

Produce: ROI statement suitable for a QBR slide — specific numbers, their language, not product feature language.
```

**Rules for the ROI slide:**
- Use their numbers, not yours. Their % improvement matters more than your feature list.
- If you can't quantify, use their words. Quotes from call notes or support tickets are valid.
- Never say "we helped you do X." Say "you achieved X." They are the protagonist.
- One slide, three points maximum. Don't bury the ROI in a wall of data.

**Step 3.2 — Prepare usage data for the deck**

Pull a clean data summary for the QBR deck:

| Metric | Last Quarter | This Quarter | Trend |
|---|---|---|---|
| Active users | [N] | [N] | [up/flat/down X%] |
| Core feature usage | [N times] | [N times] | [trend] |
| Seat utilisation | [X%] | [X%] | [trend] |

---

## Phase 4 — Deck and talking points (5 days before)

**Step 4.1 — Build the QBR structure**

```
/qbr-builder

Build the complete QBR structure for [Customer Name].

QBR date: [date]
Duration: [60 minutes]
Attendees (customer): [exec title, champion title, others]
Attendees (us): [CSM, AE if applicable]
QBR mode: [GREEN partnership / YELLOW course correction / RED recovery]
Primary goal: [retain / expand / relationship reset]

Context:
- Health score: [X/100]
- ROI delivered (from Phase 3): [paste ROI summary]
- Open issues to address: [list]
- Expansion opportunity (if GREEN): $[X], based on [signal]
- Competitive threat (if any): [describe]

Produce:
1. Full 60-minute agenda with time blocks
2. Talking points for each section — what to say and what to listen for
3. Questions to ask in each section (listen > talk)
4. How to handle if they raise [most likely objection or concern]
5. Expansion discussion framework (if GREEN account)
6. Renewal discussion timing and approach
```

**Step 4.2 — Send the agenda (5 days before)**

Send the agenda to the customer at least 5 days before — not the night before.

Email template:
```
Subject: [Company] + [Your Company] — QBR Agenda, [Date]

Hi [Name],

Looking forward to our QBR on [date]. Sharing the agenda in advance so we can make the most of our time together.

[TIME] — [Topic 1]
[TIME] — [Topic 2]
[TIME] — [Topic 3]
[TIME] — [Topic 4: Next quarter goals and action items]

Before we meet, one question for you:
What would make this the most valuable [60] minutes for your team this quarter?

Feel free to add anything you'd like us to cover. See you on [date].

[CSM Name]
```

---

## Phase 5 — Pre-call prep (1 day before)

**Step 5.1 — Briefing the internal team**

If the AE or VP is joining, brief them before the call:

```
/qbr-builder

Write an internal briefing for the [AE / VP CS] joining the QBR with [Customer Name] tomorrow.

Key points they need to know:
- Account health and the reason for the current rating
- Commercial situation: ARR, renewal date, churn risk if any
- The primary goal of this QBR
- One thing they should NOT bring up
- One thing they should reinforce if it comes up naturally
- Expansion opportunity (if applicable) — what it is and whether to raise it in this session

Keep it to half a page — they need context, not a full history.
```

**Step 5.2 — Anticipate the hard question**

Every QBR has one uncomfortable topic. Identify it and have your answer ready.

Ask yourself: "What is the one thing I hope they don't bring up?" — that's exactly what you should prepare for.

Prepare your response with `/qbr-builder` and practice saying it out loud before the call.

**Step 5.3 — Final check**

- Deck is ready and tested (screen share works, links are live)
- All data is pulled and formatted
- Product demo (if included) is scripted and tested on the customer's environment if possible
- You know the customer's renewal date down to the week — not approximately
- You know who the economic buyer is and whether they'll be in the room

---

## Phase 6 — During the QBR

**Golden ratio: 40% you talking, 60% them talking.**

If you're talking more than 40% of the time, you're presenting — not running a QBR.

**Critical rules:**
- Open with a question, not your agenda
- When they give you a priority or concern, write it down visibly — it signals you heard it
- Do not react defensively to criticism — acknowledge, ask, understand
- Do not skip the action items section — always close with documented next steps, owners, and dates

**If the conversation goes off-track:**
"That's really important — I want to make sure we address it properly. Can we park it and come back to it in the last 10 minutes? I want to give it the time it deserves."

---

## Phase 7 — Post-call follow-up (same day, within 2 hours)

**Step 7.1 — Follow-up email**

```
/qbr-builder

Write the post-QBR follow-up email for [Customer Name].

The call was: [45/60/90 minutes] with [attendees]
What we covered:
- Key topics discussed: [list]
- Value delivered recap: [1-2 sentences]
- Issues raised by them: [describe]
- How I responded or what we committed to: [describe]
- Expansion discussion: [did it happen? What was the outcome?]
- Renewal: [what was discussed? Timeline?]

Action items agreed:
- [Action]: Owner [who], due [date]
- [Action]: Owner [who], due [date]

Next touchpoint: [date and format]

Write: professional, warm follow-up email that recaps the session, documents all commitments,
and confirms next steps. Send same day.
```

**Step 7.2 — CRM update**

Update the account in CRM within 24 hours of the QBR:
- Health score (revised if needed based on the call)
- Last QBR date
- Next renewal date confirmed
- Expansion opportunity noted (amount, timeline, status)
- Action items as tasks with due dates
- Key quotes or signals from the customer

**Step 7.3 — Internal debrief**

If an exec or AE joined, send them a 3-line internal summary:
- What went well
- What concerns came up
- What the agreed next step is

---

## QBR quality benchmarks

| Measure | Green | Yellow | Red |
|---|---|---|---|
| QBR completion rate (% of eligible accounts) | 100% | 75-99% | < 75% |
| Renewal discussion completed in QBR | Yes | - | No (will scramble at renewal) |
| Action items documented | All | Most | None ("great call!") |
| Follow-up sent same day | Yes | Next day | Later or never |
| Customer confirms date before expiry | 5+ days before | 1-4 days | Day-of scramble |
| Expansion opportunities identified | ≥ 1 per GREEN account | - | None explored |

---
