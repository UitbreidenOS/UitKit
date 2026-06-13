---
name: client-status-report
description: "Wekelijks klantstatusrapport: voortgang vs. plan, voltooid werk, blokkades, benodigde beslissingen, vooruitblik op volgende week — bouwt vertrouwen op en elimineert check-in gesprekken"
---

# Klantstatusrapport Vaardigheid

## Wanneer activeren
- Je een klant een wekelijkse of tweewekelijkse statusupdate verschuldigd bent en dit professioneel en consistent wilt maken
- Een project complex is en je een schriftelijk overzicht wilt van wat elke week is opgeleverd
- Een klant stil wordt en je opnieuw wilt betrekken met inhoud, niet een opvolg-ping
- Je proactief blokkades wilt signaleren voordat ze klachten worden
- Einde van een factureringsperiode — wat hebben ze gekregen voor hun geld?

## Wanneer NIET gebruiken
- Eenvoudige eenmalige projecten met een enkele oplevering — gebruik daarvoor de factuurnotities
- Real-time projectbeheer-updates (gebruik Asana, Linear of Notion daarvoor)
- Klantgericht projectbeheer waarbij ze live toegang tot taakstatus nodig hebben — gebruik een gedeeld projectbord

## Instructies

### Prompt voor wekelijks statusrapport

```
Write a weekly client status report for my consulting/freelance engagement.

PROJECT: [project name]
CLIENT: [company name — first name or company, your preference]
REPORTING PERIOD: Week of [date range]
BILLING PERIOD: [if relevant — e.g., "Billed this week: X hours / $X"]

STATUS OVERALL: [Green / Yellow / Red]
- Green: on track, no blockers
- Yellow: minor issues, manageable, client should be aware
- Red: requires client decision or action to stay on track

WORK COMPLETED THIS WEEK:
[List what you actually delivered — be specific, not vague]
1. [Task or deliverable — e.g., "Completed homepage redesign mockups (3 variants) — shared via Figma link"]
2. [Task — e.g., "Led client discovery session with 2 stakeholders — notes attached"]
3. [Task — e.g., "Drafted and delivered Week 2 content calendar (12 posts, awaiting approval)"]

WORK IN PROGRESS:
[What you're currently working on that carries into next week]
1. [WIP item — what it is, current status, when it will be done]
2. [WIP item]

BLOCKERS / WAITING ON CLIENT:
[What you need from them to keep the project moving — be explicit]
1. [Blocker — e.g., "Waiting on brand guidelines PDF — needed to finalize visual direction by Wednesday"]
2. [Blocker — e.g., "Need sign-off on content calendar before scheduling begins"]
3. [None — if nothing is blocked]

DECISIONS NEEDED:
[Decisions the client needs to make — not requests, decisions]
1. [Decision — e.g., "Choose between Homepage Variant A or B by EOD Wednesday (Variant A was preferred in feedback)"]
2. [None — if no decisions needed]

NEXT WEEK PLAN:
[What you'll work on next week]
1. [Next week task]
2. [Next week task]
3. [Next week task]

NOTES OR CONTEXT:
[Anything the client should know — timeline changes, risks, positive developments]

Write a professional, client-facing status report. Tone: competent and collaborative, not defensive or corporate. Under 400 words. Lead with the status color and the headline for the week.
```

---

### Escalatierapport (gele of rode status)

Wanneer er iets mis is gegaan of risico loopt:

```
Write a client status report for a project that is at risk (Yellow / Red status).

PROJECT: [name]
CLIENT: [name]
SITUATION: [brief description of what's wrong]

The issue:
- What happened: [specific, factual description]
- When it was discovered: [date]
- Impact on timeline: [X days / X weeks delayed / on track if action taken by X date]
- Impact on budget: [none / X additional hours / X additional cost]

Root cause (if known):
[Why did this happen? Be honest — blame-shifting destroys client trust faster than the problem does]

What you're doing about it:
1. [Action 1 — already taken]
2. [Action 2 — in progress]
3. [Action 3 — planned]

What you need from the client:
[Specific decision or input needed, with a deadline]

Options for the client:
Option A: [approach] — timeline: [X], cost: [X], tradeoff: [X]
Option B: [approach] — timeline: [X], cost: [X], tradeoff: [X]

Write the escalation version of the status report. Take ownership, show a plan, ask for what you need. Do not over-apologize. Do not make the client feel panicked.
```

---

### Projectafsluitingsrapport

```
Write a project completion summary report for the client.

PROJECT: [name]
CLIENT: [name]
PROJECT DURATION: [start date] to [end date]
TOTAL BILLED: $[X] ([X] hours / flat fee)

WHAT WAS DELIVERED:
[Complete list of deliverables — numbered, specific]
1. [Deliverable — link or description]
2. [Deliverable]
...

WHAT WAS ACHIEVED (outcomes where possible):
[If you know any results — traffic, conversions, launch metrics, client feedback — include them]
- [Outcome or result]

WHAT'S OUTSTANDING (if anything):
[Any open items, ongoing responsibilities, or things requiring client follow-through]

HANDOVER NOTES:
[Logins, file locations, documentation, ongoing maintenance notes]

WHAT'S NEXT:
[Your recommendation for next steps — even if you're not the one to execute them. Shows strategic thinking.]

TESTIMONIAL / REFERENCE REQUEST (optional section):
[Soft ask for a testimonial or reference — professional, not pushy]

Write the project completion report. Professional, confident, value-focused. Under 500 words.
```

---

### Rapport voor retainerklanten (doorlopende opdracht)

Voor klanten met een maandelijks retainercontract:

```
Write a monthly retainer status report.

CLIENT: [name]
RETAINER: $[X]/month for [description of scope]
REPORTING MONTH: [month year]

HOURS USED THIS MONTH: [X] hours of [X] contracted
HOURS ROLLED OVER (if applicable): [X] hours / [none]

WORK COMPLETED THIS MONTH:
[Full list with time estimates if helpful]

HIGHLIGHTS (most impactful work this month):
[1-3 things where your work clearly created value]

ONGOING PRIORITIES (what we're working on):
[Items that continue into next month]

UPCOMING NEXT MONTH:
[What you'll focus on next month — shows proactive planning]

RETAINER HEALTH:
- Utilization: [X]% of retainer hours used
- Scope drift check: [are we still doing what the retainer was set up for, or has scope shifted?]
- Recommended adjustments: [increase hours / add a scope item / no changes]

Write the monthly retainer report. Position yourself as a strategic partner, not an hourly worker. Make it easy for them to renew.
```

---

### Rapportsjablonen per projecttype

**Software- / Ontwikkelingsproject:**
```
STATUS: [Green/Yellow/Red]
Sprint [N] — Week [N] of [total]

Completed:
- [Feature or task] — [deployed to staging / in review / shipped to production]

Testing status:
- [X] of [Y] acceptance criteria passing
- Open issues: [list or "none"]

Blockers:
- [Waiting on API credentials] / [None]

Next sprint: [what you're building next]

Demo: [link to staging environment]
```

**Ontwerpproject:**
```
STATUS: [Green/Yellow/Red]
Project: [name] — Week [N] of [total]

Delivered for review:
- [Figma link: Homepage — 3 variants]
- [Asset exported and shared via [location]]

Awaiting client input on:
- [Which homepage variant to proceed with]
- [Brand color preference between options A/C]

Working on:
- [About page layout — 60% complete]

Next week: [what's next]
```

**Content- / Schrijfproject:**
```
STATUS: [Green/Yellow/Red]
Content retainer — [Month]

Published this week:
- [Title] — [URL] — [published date]
- [Title] — [URL]

In draft / review:
- [Title] — [status: drafting / client review / revisions in progress]

In planning:
- [Topic] — scheduled for [date]

Calendar for next 2 weeks: [Google Doc link or inline table]
```

---

### E-mailomhulsel voor het rapport

```
Write a brief email to send the weekly status report.

CLIENT FIRST NAME: [name]
REPORT PERIOD: [date range]
OVERALL STATUS: [Green / Yellow / Red]
KEY HEADLINE: [the most important thing this week — one sentence]
NEXT ACTION FROM CLIENT (if any): [what you need from them]

Write an email under 4 sentences:
1. Greeting + status color in natural language
2. One-sentence headline
3. Report is attached/below
4. Any specific ask or note

Not formal. Not a form letter. Should sound like a professional colleague who respects their time.
```

## Voorbeeld

**Gebruiker:** Ik ben een freelance contentstrateg. Klant: een SaaS-startup genaamd Alora (contactpersoon is Priya, Head of Marketing). Week 3 van een 12-weekse contentstrategiesopdracht. Deze week voltooid: het zoekwoordenonderzoekswerkboek afgerond (gedeeld in Notion), de merkstembrandworkshop gehad (3 mensen aanwezig), redactionele kalender voor Q3 opgesteld. Geblokkeerd door: hun productroadmap nog niet ontvangen om content af te stemmen op lanceringen. Nodig van hen: goedkeuring van de redactionele kalender zodat ik volgende week kan beginnen met het schrijven van briefs.

**Verwachte uitvoer:** Een professioneel statusrapport-e-mail met de kop "Week 3 — Groen", drie voltooide items specifiek opgesomd (zoekwoordenwerkboek, merkstembrandworkshop, concept redactionele kalender Q3), één expliciete blokkade (productroadmap), één benodigde beslissing (kalendergoedkeuring voor woensdag), en vooruitblik op volgende week (briefschrijven voor de eerste 4 contentstukken, mits goedkeuring ontvangen). E-mailomhulsel: "Week 3 is klaar — alles groen..." in minder dan 4 zinnen, met het rapport bijgevoegd of inline.

---
