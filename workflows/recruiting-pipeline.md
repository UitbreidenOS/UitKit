# Recruiting Pipeline Workflow

End-to-end hiring process — from opening a req to Day 1 onboarding — with Claude Code accelerating every stage without replacing the human judgment that makes great hiring decisions.

---

## Overview

This workflow covers the full recruiting lifecycle:

1. Req definition and role setup
2. Sourcing and pipeline building
3. Screening and qualification
4. Interview process and debrief
5. Offer management and closing
6. Pre-start and onboarding handoff

**Time savings with Claude Code:** 60-70% reduction in documentation and research time. Judgment and candidate relationship work remains yours.

**Who runs this:** Recruiter or HR generalist, in partnership with the hiring manager

---

## Phase 1 — Req definition and role setup

**Do this before opening the role or sourcing a single candidate.**

The most common reason a hire takes too long: the recruiter and hiring manager disagree on what they're hiring for — and discover this in week 4.

**Step 1.1 — Hiring manager intake**

Run a structured intake conversation with the hiring manager using these questions before any other work:

- What problem will this person solve? (Not "what will they do" — what problem will go away when they start?)
- What does success look like in 90 days? In 12 months?
- What's the biggest mistake you've made hiring for this type of role before?
- What's non-negotiable? (Must-have — if the candidate doesn't have this, they're an automatic no)
- What are you willing to train or coach? (Nice-to-have)
- What's your gut feeling about the hire timeline? (Often longer than it should be — calibrate together)

**Step 1.2 — Write the job description**

```
/job-description

Write a job description for [Role] at [Company].

What problem this person solves: [from intake]
Key responsibilities (top 5): [from intake]
Must-have qualifications: [from intake — be specific]
Nice-to-have: [from intake]
Salary range: [from comp benchmarking — see Phase 1.3]
Location: [city / remote / hybrid policy]
Company description: [1-2 sentences — mission, stage, team size]
Tone: [formal / conversational / technical]

Do not write: "We are looking for a passionate, dynamic team player who thrives in a fast-paced environment." That describes nobody and attracts everyone.

Write a JD that tells a qualified candidate exactly what they'd do and what they need to have. If they're not the right fit, they should self-select out.
```

**Step 1.3 — Set the compensation band before sourcing**

```
/comp-benchmarker

Build the compensation band for [Role] at [Company].

Level: [Senior IC / Manager / Director]
Location: [City, Country or remote]
Company stage: [Seed / Series A-B / Series C+ / established SMB]
Industry: [SaaS / Fintech / etc.]
Target market position: [lead / match / below market + equity]

Produce: full salary band with equity guidelines and benefits context.
This band is confirmed before we start sourcing — not negotiated per candidate.
```

**Output of Phase 1:**
- Signed-off JD
- Confirmed comp band
- Shared definition of "ideal candidate" with hiring manager
- Scorecard drafted (see Phase 3.1)

---

## Phase 2 — Sourcing and pipeline building

**Target: 80-150 profiles identified → 25-40 outreach messages → 5-10 responses**

**Step 2.1 — Build sourcing strategy**

```
/candidate-sourcer

Build a sourcing strategy for [Role] in [Location].

Must-have qualifications: [from req definition]
Target companies (likely sources of strong candidates):
- Direct competitors: [list]
- Adjacent companies with transferable skills: [list]
- Industries that produce the background we need: [list]

Produce:
1. LinkedIn Boolean search string
2. Google X-Ray search variant (no Recruiter needed)
3. 3 sourcing channels beyond LinkedIn to explore
4. Estimated response rates and pipeline math for this role type
```

**Step 2.2 — Write outreach templates**

```
/candidate-sourcer

Write outreach messages for [Role] sourcing.

Role: [Title]
What makes this role compelling (specific — not "exciting opportunity"):
- [Specific thing 1 — e.g., "owns the product analytics function from day 1"]
- [Specific thing 2]
- [Specific thing 3]

Target candidate profile: [describe the background you're targeting]
Channel: [LinkedIn InMail / email / mutual intro]

Write:
1. Initial InMail / email (under 150 words)
2. Follow-up message (7 days after no response — send once only)
3. Personalisation formula — what to change per candidate to make the first line specific
```

**Step 2.3 — Build the pipeline tracker**

Set up your pipeline tracker (Notion, Airtable, or Google Sheets) with these columns:

| Candidate | Company | Role | Source | Stage | Last Contact | Next Action | Notes |
|---|---|---|---|---|---|---|---|

Stages:
1. Identified
2. Outreach sent
3. Responded
4. Phone screen scheduled / completed
5. Advanced to panel
6. Panel in progress
7. Offer stage
8. Hired / Declined / Paused / Rejected

**Update this every working day. A pipeline tracker that's 3 days out of date is useless.**

**Step 2.4 — Weekly sourcing cadence**

- Tuesday and Thursday: send new outreach messages (batch of 10-15 each session)
- Monday: review pipeline, follow up on week-old messages that haven't responded (once)
- Friday: review conversion rates — if response rate < 10%, the message or targeting needs to change

---

## Phase 3 — Screening and qualification

**Step 3.1 — Build the scorecard before any interviews begin**

```
/interview-scorecard

Build the interview scorecard for [Role].

Level: [IC / Manager / Director]
Top responsibilities: [from JD]
Must-have competencies: [3-5 — the non-negotiable traits for success in this role]
Deal-breakers: [what automatically disqualifies]

Build: 4-5 competencies, 2-3 STAR-format questions each, scoring rubric (1-4),
panel design (who evaluates which competency), and debrief template.
```

**Do this before you screen the first candidate — not partway through the process.**

**Step 3.2 — Recruiter phone screen**

Recruiter screen purpose: filter for deal-breakers, set expectations on comp and timeline, assess communication.

Standard screen questions (15-20 minutes):
- "What are you looking for in your next role — and why now?"
- "What's your current total comp, and what are you targeting?"
- "Walk me through your experience with [must-have skill]."
- "What's your notice period?"
- "Any other processes you're in that I should know about?"

Screen decision: Advance / Not a fit / Hold

Document the decision in the ATS within 2 hours of the call. If you can't document it, you can't justify it later.

**Step 3.3 — Hiring manager screen**

This is not a repeat of the recruiter screen. Brief the hiring manager on:
- What the recruiter assessed (comp, availability, deal-breakers cleared)
- What they're assessing (top 2 competencies from the scorecard)
- The decision protocol: Advance / No hire — not "let me think about it"

---

## Phase 4 — Interview process and debrief

**Step 4.1 — Panel design**

Assign competencies to interviewers before scheduling. No two interviewers should evaluate the same competency — it's a waste of time and creates redundant data.

| Interviewer | Competency 1 | Competency 2 |
|---|---|---|
| [Name] | [Competency A] | [Competency B] |
| [Name] | [Competency C] | [Competency D] |
| [Name] | [Competency E] | — |

**Step 4.2 — Candidate-specific prep**

Before each panel interview, provide the interviewer with:
- The candidate's background (one paragraph — what's relevant and what's a gap)
- Their assigned competency and 2-3 recommended questions
- What strong vs. weak answers look like
- What to flag for the debrief

```
/interview-scorecard

Prepare interviewer brief for [Interviewer Name] ahead of the panel with [Candidate Name].

Candidate background: [paste LinkedIn summary or key points]
Assigned competency: [competency name]
Generate: tailored interview questions for this specific candidate's background,
evidence to look for in answers, and debrief flag guidance.
```

**Step 4.3 — Debrief structure**

Run debrief within 24-48 hours of the final interview. Do not let debrief slide to "whenever everyone has time."

Debrief rules:
1. Every interviewer submits their scorecard before the debrief meeting
2. In the meeting: share scores first, before open discussion
3. Flag where interviewers disagree by more than 1 point — resolve with evidence, not seniority
4. The hiring manager makes the final call and documents the reason

```
/interview-scorecard

Facilitate the debrief for [Candidate Name] for [Role].

Interviewer assessments:
- [Interviewer 1]: [competency A: X/4], [competency B: X/4], overall: [X/4], recommendation: [Hire/No Hire]
- [Interviewer 2]: [competency C: X/4], [competency D: X/4], overall: [X/4], recommendation: [Hire/No Hire]
- [Interviewer 3]: [competency E: X/4], overall: [X/4], recommendation: [Hire/No Hire]

Produce: aggregate score table, disagreement flags, overall recommendation vs. hiring bar,
and if hire: onboarding gaps to address in 30-60-90 plan.
```

**Output of Phase 4:**
- Hire / No Hire decision documented with rationale
- If no hire: feedback categorised for recruiter (was this a sourcing, screening, or assessment failure?)

---

## Phase 5 — Offer management and closing

**Step 5.1 — Prepare the offer**

```
/comp-benchmarker

Build the compensation offer for [Candidate Name] for [Role].

Our band: $[X] - $[Y] base
Candidate's current comp: $[X] base, $[X] variable, $[X] equity (unvested)
Where in the band I'm targeting: [explain rationale]
Competing offer (if known): $[X] at [Company]
My equity budget for this hire: $[X] or [X shares]

Produce: full offer package summary, verbal offer script,
and counter-offer handling for price, equity, and competing offer scenarios.
```

**Step 5.2 — Verbal offer call**

Never send an offer letter before a verbal conversation. The written offer should be a confirmation, not a surprise.

Verbal offer call structure (15-20 minutes):
- "I have good news — the team really enjoyed getting to know you, and we want to move forward with an offer."
- Walk through each component: base, variable, equity, benefits, start date
- Ask: "How does that land for you overall?"
- Listen. Do not fill the silence with concessions.
- If they're positive: "I'll send the written offer today. It expires in [5 business days]."
- If they need time: "Totally understand. When should I follow up?"

**Step 5.3 — Offer letter**

```
/comp-benchmarker

Generate the offer letter for [Candidate Full Name].

Role: [Title]
Start date: [date]
Base: $[X]
Bonus: [X%], target $[X], paid [annually]
Equity: [N shares / RSUs], 4-year vest, 1-year cliff
Benefits: [describe]
Location: [city or remote]
Reports to: [Manager]
Offer expiry: [date — 5-7 business days from now]
```

**Step 5.4 — Counter-offer handling**

If the candidate comes back with a counter:

- First: understand what specifically they're asking to change (comp only? comp + equity? start date?)
- Check your band: are you at band maximum already? If yes, explain why you can't go higher (integrity of the band matters for internal equity)
- Consider non-cash levers: accelerated start date for equity, signing bonus (one-time, doesn't compound), title adjustment if warranted
- If you can't match: be honest — "This is the best we can do at this level. I want to be straightforward about that so you can make the best decision for you."

**Never close a candidate with a promise you can't keep after their first week.**

---

## Phase 6 — Pre-start and onboarding handoff

**Step 6.1 — Pre-start engagement**

Between offer accepted and Day 1:
- Send a welcome email from the hiring manager within 24 hours of offer acceptance
- Share: who to contact with questions, what to expect on Day 1, any paperwork to complete in advance
- Do not go dark — candidates who haven't started yet get competing offers

**Step 6.2 — Build the onboarding plan**

```
/team-onboarding

Build a 30-60-90 day onboarding plan for [New Hire Name] starting as [Role] on [date].

Manager: [name]
Team: [describe]
Key stakeholders to meet in first 30 days: [list]
Primary goals by end of Day 90: [what does success look like?]
Systems to provision: [list tools and access they need]
Role-specific context: [any nuances, current projects, challenges they inherit]

Produce: structured weekly milestones, stakeholder intro schedule, success criteria for each phase,
and a Day 1 checklist.
```

**Share this plan with the new hire before they start — not on Day 1.**

**Step 6.3 — Post-hire retrospective**

After every hire (within 2 weeks of start), run a brief hiring retrospective with the hiring manager:

- What went well in this hiring process?
- Where did we lose good candidates or waste time?
- Did our scorecard predict the right things?
- What would we change next time we hire this role type?

Document findings. Iterate. The only way to get faster and better at hiring is to learn from each hire.

---

## Pipeline health metrics

Track these weekly for each open role:

| Metric | Target | Flag if |
|---|---|---|
| Profiles identified per week | 30-50 | < 15 |
| Outreach sent per week | 15-25 | < 10 |
| Response rate | > 15% | < 8% |
| Screen-to-advance rate | > 40% | < 25% or > 70% (bar too low) |
| Interview-to-offer ratio | < 5:1 | > 8:1 |
| Offer accept rate | > 80% | < 65% |
| Time to fill | < 45 days | > 75 days |

If response rate is low: problem is the message or the targeting — try a different outreach angle or tighter search criteria.

If screen-to-advance rate is very high: you may be passing candidates who aren't actually qualified — tighten the screen or the req definition.

If offer accept rate is low: compensation isn't competitive, process is too slow, or the candidate experience is poor — diagnose which.

---
