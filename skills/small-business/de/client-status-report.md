---
name: client-status-report
description: "Wöchentlicher Kunden-Statusbericht: Fortschritt vs. Plan, erledigte Arbeiten, Hindernisse, benötigte Entscheidungen, Vorschau auf die nächste Woche — schafft Vertrauen und eliminiert Check-in-Anrufe"
---

# Client Status Report Skill

## Wann aktivieren
- Du schuldest einem Kunden ein wöchentliches oder zweiwöchentliches Statusupdate und möchtest es professionell und konsistent gestalten
- Ein Projekt ist komplex und du möchtest einen Nachweis darüber, was jede Woche geliefert wurde
- Ein Kunde ist still geworden und du möchtest ihn mit Substanz erneut ansprechen, nicht mit einem Nachfass-Ping
- Du möchtest Hindernisse proaktiv aufzeigen, bevor sie zu Beschwerden werden
- Ende eines Abrechnungszeitraums — was haben sie für ihr Geld bekommen?

## Wann NICHT verwenden
- Einfache einmalige Projekte mit einer einzigen Lieferung — verwende stattdessen die Rechnungsnotizen
- Echtzeit-Projektmanagement-Updates (verwende dafür Asana, Linear oder Notion)
- Kundenseitiges Projektmanagement, bei dem sie Live-Zugang zum Aufgabenstatus benötigen — verwende ein gemeinsames Projektboard

## Anweisungen

### Wöchentlicher Statusbericht-Prompt

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

### Eskalationsbericht (Gelber oder Roter Status)

Wenn etwas schiefgelaufen ist oder gefährdet ist:

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

### Projektabschlussbericht

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

### Retainer-Kundenbericht (laufendes Engagement)

Für Kunden auf einem monatlichen Retainer:

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

### Berichtsvorlagen nach Projekttyp

**Software- / Entwicklungsprojekt:**
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

**Designprojekt:**
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

**Content- / Schreibprojekt:**
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

### E-Mail-Wrapper für den Bericht

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

## Beispiel

**Nutzer:** I'm a freelance content strategist. Client: a SaaS startup called Alora (contact is Priya, Head of Marketing). Week 3 of a 12-week content strategy engagement. Completed this week: finished the keyword research workbook (shared in Notion), had the brand voice workshop (3 people attended), drafted editorial calendar for Q3. Blocked on: haven't received their product roadmap to align content with launches. Need from them: approval on the editorial calendar so I can start brief writing next week.

**Erwartete Ausgabe:** Ein professioneller Statusbericht-E-Mail mit der Überschrift „Woche 3 — Grün", drei spezifisch aufgeführten erledigten Punkten (Keyword-Recherche-Workbook, Brand-Voice-Workshop, Q3-Redaktionskalender-Entwurf), einem expliziten Hindernis (Produkt-Roadmap), einer benötigten Entscheidung (Kalender-Genehmigung bis Mittwoch) und einer Vorschau auf die nächste Woche (Brief-Schreiben für die ersten 4 Content-Stücke, unter der Voraussetzung, dass die Genehmigung eingetroffen ist). E-Mail-Wrapper: „Woche 3 ist erledigt — Grün auf der ganzen Linie..." in unter 4 Sätzen, mit dem Bericht im Anhang oder inline.

---

> **Arbeite mit uns:** Claudient wird unterstützt von [Uitbreiden](https://uitbreiden.com/) — wir entwickeln KI-Produkte und B2B-Lösungen mit Entwickler-Communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
