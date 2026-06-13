---
name: "exec-briefing"
description: "Executive briefing document: meeting context, attendee backgrounds, agenda, talking points, desired outcomes, and pre-read materials — so the exec walks in prepared"
---

# Executive Briefing Skill

## When to activate
- The executive has a high-stakes meeting in the next 24-48 hours and needs to be prepared
- A board meeting, investor meeting, customer EBC (executive briefing center), or partner summit is approaching
- The exec is meeting someone important for the first time and needs context on who they are
- A policy or analyst briefing requires background research before the exec can be credible
- Any meeting where "winging it" would be a mistake

## When NOT to use
- Routine internal meetings with people the exec knows well — overkill
- Briefings requiring classified or proprietary information you don't have access to — you can only work with what you provide
- Real-time meeting prep in the room — this is a preparation document, not a live assistant

## Instructions

### Full executive briefing prompt

```
Generate an executive briefing document for an upcoming meeting.

EXECUTIVE: [name, title]
MEETING: [name or purpose of meeting]
DATE/TIME: [date, time, timezone]
DURATION: [X minutes]
FORMAT: [in-person / video / phone]
LOCATION: [if in-person: venue, room; if virtual: platform]

ATTENDEES (provide for each):
- [Name], [Title], [Company/Organization]
  Background: [relevant facts — prior roles, known views, relationship to exec, any history]
  Why they're in this meeting: [their stake in the outcome]

MEETING PURPOSE:
- The stated agenda: [what's on the calendar invite]
- The real purpose: [what actually needs to happen or be decided]
- Who called this meeting and why: [context]

CONTEXT AND HISTORY:
[Any relevant history between parties — prior deals, disputes, relationships, obligations]

MATERIALS AVAILABLE:
[List any documents the exec should have read — you can summarize them below or they've already read them]

DESIRED OUTCOMES (prioritized):
1. [Primary outcome — what does success look like?]
2. [Secondary outcome]
3. [Fallback — acceptable if primary isn't achievable]

WHAT WE'RE ASKING FOR (if applicable):
[Specific ask, commitment, or decision needed from attendees]

WHAT THEY WANT FROM US (if known):
[What the other party is hoping to get from this meeting]

Generate the briefing document with:
1. Meeting overview (1 paragraph)
2. Attendee profiles (1 short paragraph per person)
3. Context and history
4. Suggested agenda (with timing)
5. Talking points (3-5 per key topic)
6. Key questions to ask
7. What NOT to say or commit to
8. Desired outcomes
9. Next steps to propose at the end
```

---

### Attendee background research prompt

```
Build attendee profiles for an executive meeting.

ATTENDEES:
[For each person: name, title, company, LinkedIn URL if available, any other sources]

For each attendee, research and compile:

PROFESSIONAL BACKGROUND:
- Current role and how long in it
- Prior companies and roles (especially any that connect to our executive's world)
- Educational background (relevant, not exhaustive)
- Any public writing, speaking, or positions taken that are relevant

RELATIONSHIP TO US:
- Prior interactions with our exec or company (if any)
- How they came to be in this meeting
- Their stake in the outcome

KNOWN VIEWS AND PRIORITIES:
[Based on public statements, articles, or any intel — what do they care about?]

POTENTIAL SENSITIVITIES:
[Anything our exec should be careful about — competitor relationships, past conflicts, cultural considerations]

CONVERSATION STARTER:
[One natural, genuine opening line the exec can use that shows they did their homework]
```

---

### Board meeting briefing

```
Generate a board meeting briefing for the executive.

COMPANY: [name]
BOARD MEETING DATE: [date]
EXEC ROLE: [CEO / CFO / presenting manager]

BOARD MEMBERS:
[List all board members with firm/fund, how long on the board, and any known areas of focus]

MEETING AGENDA:
[Paste agenda]

KEY TOPICS REQUIRING PREP:
[For each agenda item requiring the exec to present or answer questions:]

Topic: [name]
Exec's talking points: [key messages they want to land]
Data to have ready: [specific numbers or slides to reference]
Hard questions likely: [what the board will push on]
Answers to hard questions: [draft responses]
Red lines: [what NOT to commit to in the room]

BOARD DYNAMICS:
[Any tensions, alignments, or dynamics the exec should be aware of going in]

Generate a pre-board briefing document the exec can review the night before.
```

---

### Investor meeting briefing

```
Generate a briefing for an investor meeting.

MEETING TYPE: [first meeting / follow-up / LP update / co-investor intro / potential new lead]
INVESTOR: [name, title, firm]

FIRM PROFILE:
- Fund size and stage focus: [X]
- Portfolio companies: [relevant ones to know — especially competitive or adjacent]
- Known thesis or focus areas: [what they typically invest in]
- Recent announcements: [any portfolio exits, new fund, new partners]

CONTACT PROFILE:
- [Name]: [background, prior portfolio, anything they've said publicly about our space]
- Referral source: [who introduced you and why]

OUR COMPANY CONTEXT:
- Current stage: [seed / Series A / growth]
- Recent news to lead with: [any milestone, customer, product launch]
- Metrics to have ready: [ARR, growth, NRR, burn, runway]
- What we're raising: $[X] at $[X]M pre-money
- Why now: [your timing narrative]

WHAT WE WANT FROM THIS MEETING:
[Next meeting / term sheet / intro to their portfolio company / just building relationship]

WHAT THEY MAY ASK:
[Likely investor questions and suggested responses]

Generate the investor meeting briefing.
```

---

### Government / policy meeting briefing

```
Generate a briefing for a government or policy meeting.

MEETING: [type — congressional briefing / regulatory agency meeting / policy roundtable]
DATE: [date]
GOVERNMENT REPRESENTATIVES ATTENDING:
[Name, title, office/agency, committee assignments if relevant]

OUR POSITION:
- What we're advocating for: [policy position]
- Our business rationale: [why this matters to us]
- The stakeholders we represent (if applicable): [customers, industry, communities]
- Our ask: [specific legislative or regulatory action]

BACKGROUND RESEARCH:
- The issue: [brief overview of the policy context]
- Current status: [where is this in the legislative/regulatory process]
- Key opposition arguments: [who disagrees and why]
- Our rebuttal to key opposition: [our counter-arguments]

PROTOCOL AND TONE:
[Any protocol notes — titles, decorum, gift rules, photography restrictions]

Generate the briefing with policy context, attendee profiles, talking points, and Q&A prep.
```

---

### Talking points framework

```
Write talking points for [executive] on [topic] for a meeting with [audience].

CONTEXT:
- Why this topic is on the agenda: [background]
- What the audience already knows: [their familiarity level]
- What we want to communicate: [our key messages]
- What we want to avoid: [sensitive topics, premature commitments]

TALKING POINTS FORMAT:
Generate 5 talking points. For each:
- Headline: [the point in one sentence]
- Supporting evidence or example: [specific fact, customer story, or data point]
- Transition: [how to move to the next point or respond to a follow-up question]

Tone: [formal / conversational / technical / board-appropriate]
Language: Use plain language. No buzzwords. The exec should be able to say these naturally.
```

---

### What NOT to commit to — red lines list

```
Generate a red lines list for [executive] going into [meeting].

Meeting context: [what's being discussed]

Based on the meeting agenda and our current situation, identify:

THINGS NOT TO COMMIT TO WITHOUT BOARD APPROVAL:
[Decisions that require board sign-off — typically: M&A, equity, major partnerships, pricing changes]

THINGS NOT TO DISCUSS (legally sensitive):
[Anything in active litigation, regulatory review, or that could create liability]

THINGS TO DEFLECT (not ready to disclose):
[Upcoming announcements, products in development, undisclosed negotiations]

HOW TO DEFLECT GRACEFULLY:
For each red line: write a professional deflection that doesn't damage the relationship.
"That's something we're actively working through — I'd love to follow up once we have a clearer picture."
```

---

### Briefing document format

```markdown
# Executive Briefing
**Meeting:** [Meeting name]
**Date:** [Date and time]
**Prepared for:** [Executive name]
**Prepared by:** [Your name]

---

## Meeting at a Glance

[One paragraph: who, what, why, what success looks like]

---

## Attendees

### [Name], [Title], [Company]
[2-3 sentences: background, relationship, why they're here, one thing to know about them]

### [Name]
[Same format]

---

## Context and History

[Relevant background — prior interactions, relationship history, what brought us to this meeting]

---

## Suggested Agenda

| Time | Topic | Owner | Goal |
|---|---|---|---|
| 0:00 | Introductions | [Host] | Warm the room |
| 0:05 | [Topic 1] | [Name] | [Objective] |
| 0:20 | [Topic 2] | [Name] | [Objective] |
| 0:40 | Q&A | All | Address questions |
| 0:50 | Next steps | [Host] | Confirm actions |

---

## Talking Points

### On [Topic 1]
- [Point 1]
- [Point 2]
- [Point 3]

### On [Topic 2]
- [Point 1]
- [Point 2]

---

## Questions to Ask

1. [Question that advances your objective]
2. [Question that surfaces the other party's real priorities]
3. [Question that tests commitment or seriousness]

---

## What NOT to Commit To

- [Item 1] — requires board approval
- [Item 2] — legally sensitive / in active review
- [Item 3] — premature to discuss

---

## Desired Outcomes

1. [Primary outcome]
2. [Secondary outcome]
3. [Acceptable fallback]

---

## Proposed Next Steps

At the end of the meeting, propose:
- [Specific follow-up action] by [date]
- [Who does what]
- [When to meet again, if applicable]

---

## Appendix: Background Reading

[Links or summaries of relevant documents, articles, or prior meeting notes]
```

## Example

**User:** Our CEO is meeting the incoming VP of Procurement at a Fortune 500 company that's been a customer for 2 years. The VP just started 6 weeks ago. Goal: retain the relationship and explore expanding the contract from $200K to $500K annually. 45-minute meeting.

**Expected output:** Full briefing — attendee profile researching the new VP (LinkedIn, prior company background, what she focused on in her last role), talking points for why this is the right time to expand (usage data, new use cases unlocked in the last 6 months, ROI evidence), key question to ask ("What would make this partnership a clear success in your first 90 days?"), what NOT to commit to (pricing changes without finance sign-off, custom development), and proposed next steps (product demo with her team in 2 weeks, executive sponsor intro call).

---
