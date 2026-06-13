# CTO / Tech Lead-Wochen-Workflow

Ein wiederholbarer wöchentlicher Workflow für einen KI-gestützten CTO oder Tech Lead — umfasst Engineering-Gesundheitsüberwachung, Architekturentscheidungen, Teammanagement, strategische Planung und Stakeholder-Berichterstattung.

---

## Übersicht

**Zeitaufwand:** ~3–4 Stunden strukturierter Claude Code-Sitzungen pro Woche (ersetzt 10–15 Stunden unstrukturiertes Kontextwechseln).

**Was dieser Workflow abdeckt:**
- Täglich: Engineering-Gesundheitscheck (15 Minuten)
- Montag: Engineering-Strategie-Ausrichtung + Wochenplanung
- Dienstag–Mittwoch: Architektur- und Designarbeit
- Donnerstag: Teammanagement und Einstellung
- Freitag: Vorstands-/Führungsberichterstattung + Vorfallsüberprüfung

**Voraussetzungen:** Mindestens `/adr-writer`, `/engineering-strategy` und `/tech-interview-kit` installiert.

---

## Täglich — Engineering-Gesundheitscheck (15 Minuten)

### Morgendlicher Engineering-Puls

Dies vor dem Öffnen von E-Mails oder Slack ausführen. Es zwingt dazu, das System zu betrachten, nicht nur auf das Lauteste zu reagieren.

```
Engineering health check — [DATE]:

DORA metrics (pull from your observability/CI dashboard):
- Deployments to production today/yesterday: [X]
- Failed deployments / rollbacks: [X] — failure rate: [X%]
- Lead time last merged PR: [X hours]
- Any open P1/P2 incidents: [X]
- MTTR last resolved incident: [X hours]

Team pulse:
- Engineers blocked for > 1 day: [list or none]
- PRs open > 5 days: [list — long-lived PRs increase merge risk]
- On-call escalations overnight: [X]
- Sprint commitment tracking: [% delivered so far this sprint]

Upcoming deadlines:
- Hard technical deadlines in next 14 days: [list]
- External dependencies arriving (vendor APIs, design, data): [list]

Flag: what requires my attention today — ranked by urgency × impact?
```

---

## Montag — Engineering-Strategie-Ausrichtung

### 8:30–9:30 Uhr — Strategiecheck und Wochenplanung

```
/engineering-strategy

Weekly strategy alignment for week of [DATE]:

Engineering strategy status:
- Top 3 strategic priorities for the quarter: [list]
- Current status of each: [on track / drifting / blocked]
- Any architectural decision that's been pending > 2 weeks: [list — these age poorly]

Team health:
- Any team below 70% sprint velocity this week? [yes/no + team]
- Any team with cross-team dependency blocking them? [yes/no]
- Any open role affecting team capacity significantly? [yes/no]

Upcoming this week:
- Architecture reviews: [list]
- Interview loops: [list roles + stages]
- Stakeholder presentations: [list]
- Tech debt items scheduled: [list]

Produce: weekly engineering focus plan (what I personally need to drive vs. delegate).
What's the ONE engineering decision I need to make this week that will unblock the most work?
```

---

## Dienstag — Architektur und Design

### 9:00–12:00 Uhr — Architekturentscheidungsarbeit

**Für bedeutende technische Entscheidungen (1–2 Stunden einplanen):**

```
/adr-writer

Decision needed: [name the decision clearly]
Why now: [what's forcing this decision — product requirement, scaling problem, incident, tech debt]
Options under consideration:
1. [Option A]: [brief description]
2. [Option B]: [brief description]
3. [Option C or "status quo"]: [brief description]

Constraints:
- Timeline: [when does this need to be decided?]
- Team expertise: [what does our team know well vs. would need to learn?]
- Budget: [cost difference between options if relevant]
- Existing dependencies: [what would need to change if we choose each option?]

Evaluation criteria (rank by importance):
- [e.g., performance / scalability / maintainability / developer experience / cost]

Write a full ADR with: context, decision, status, consequences (positive and negative), and open questions.
```

**Nach dem Entwurf des ADR:**
- Vor der Markierung als „Akzeptiert" mit 2–3 leitenden Engineers zur Überprüfung teilen
- Verwandte ADRs verknüpfen (welche Entscheidungen hängen davon ab oder werden davon beeinflusst?)
- Im ADR-Register speichern

**Für komplexes technisches Feature-Design:**

```
/spec-driven-workflow

Feature requiring technical design: [name]
Business goal: [what outcome this serves]
Problem statement: [what system or user problem we're solving]
Team that will build this: [team name, size, relevant skills]
Timeline: [when it needs to ship]
Constraints: [technical, performance, security, regulatory]

Produce:
- Problem statement
- Functional requirements (must-have)
- Non-functional requirements (performance, security, scalability)
- Design options with trade-offs
- Recommended approach with rationale
- Open questions to resolve before starting
- Estimated complexity (t-shirt size or story points)
```

---

## Mittwoch — Technische Schulden und Plattformarbeit

### 9:00–11:00 Uhr — Tech-Debt-Überprüfung (monatlich, an einem Mittwoch geplant)

Monatlich ausführen. Den dritten Mittwoch jedes Monats wählen.

```
/tech-debt-tracker

Tech debt review — [MONTH]:

Known debt items (from your backlog or describe new ones):
[List: item name, what it slows down, estimated cost to fix, risk if unaddressed]

Current sprint capacity allocation to tech debt: [X%]
Last quarter's debt investment: [X sprint weeks]

Score each item:
- Business impact if NOT fixed: 1-5
- Velocity tax (how much dev time is wasted): 1-5
- Effort to fix: 1-5 (1 = quick, 5 = multi-sprint)

Priority = (business impact + velocity tax) / effort

Produce:
1. Ranked debt backlog with scores
2. Top 3 items for next quarter with business case
3. Recommended sprint capacity % for debt (current: [X%] — should be [Y%])
4. Exec summary: "What our tech debt is costing us" in plain language
```

### Plattform-Engineering-Überprüfung (zweiwöchentlich)

```
/platform-engineering

Platform health check:

Developer experience metrics:
- Local setup time for new engineer: [X hours/days]
- Build time (CI pipeline): [X minutes]
- Deploy frequency enabled: [X per day — is the platform a bottleneck?]
- Flaky test rate: [X%] (target: < 1%)

Platform team work this sprint:
- What shipped: [list]
- What's in progress: [list]
- What's blocking other teams: [list if any]

Identify: top 3 platform improvements that would have the biggest impact on engineering velocity.
```

---

## Donnerstag — Teammanagement und Einstellung

### 10:00–11:00 Uhr — 1:1-Vorbereitung (vor jedem 1:1 verwenden)

```
@vpe-advisor

Preparing for 1:1 with: [name]
Role: [title and level]
Team: [team they're on]

Context for this 1:1:
- Topic I need to raise: [specific issue, career conversation, feedback, context-share]
- Their current engagement signal: [high / normal / I'm concerned]
- Any recent wins to acknowledge: [specific]
- Any recent concerns to address: [specific]

Help me:
- Frame the conversation so it's a real dialogue, not a monologue
- Draft the 2-3 questions that will tell me most about how they're doing
- Anticipate what they might raise and how to respond productively
- Set one concrete outcome for this 1:1 (not just "catch up")
```

### 11:00–12:00 Uhr — Interview-Arbeit

**Einen Interview-Prozess entwerfen oder überprüfen:**

```
/tech-interview-kit

Role: [title and level]
Our tech stack: [primary languages + frameworks]
What we care most about: [correctness / system design / code quality / communication / all]
Interview format: [stages and what each covers]

Tasks:
1. Design coding challenge for the [take-home / live coding] stage
2. Design system design prompt for [staff/senior] roles
3. Review the rubric for this level — is it calibrated correctly?
4. Build the debrief template for the Friday panel call

[If reviewing a take-home submission: paste it and ask for a structured review framework]
```

**Kalibrierung nach dem Interview:**

```
/tech-interview-kit

Debrief prep for [CANDIDATE NAME], [ROLE]:

Panellists:
- [Name, role]: conducted [stage name]
- [Name, role]: conducted [stage name]

Scores submitted (confirm everyone has submitted before meeting):
[List scores per panellist and per dimension]

Run the debrief:
1. Present scores — where do panellists agree? Where do they diverge?
2. Resolve divergence with evidence (not impressions)
3. Apply weighted rubric
4. Decision: Strong Hire / Hire / No Hire
5. Feedback to candidate if no hire
```

---

## Freitag — Berichterstattung und Vorfallsüberprüfung

### 13:00–14:00 Uhr — Vorstands- und Führungsberichterstattung (zweiwöchentlich oder nach Bedarf)

```
/engineering-strategy

Board engineering report for [PERIOD]:

Metrics to report:
- Deployment frequency: [current vs. target vs. last quarter]
- Reliability (uptime): [current SLA vs. target vs. last quarter]
- Security: [incidents, CVEs remediated, audit status]
- Engineering velocity signal: [are we faster or slower than last quarter?]
- Headcount: [current / planned hires / attrition this quarter]
- Tech debt investment: [% of capacity invested in debt reduction]

Highlights — what we shipped:
[List 3-5 major deliverables]

Risks — what could derail us:
[List 2-3 risks with mitigation plan]

Asks from the board:
[Budget approvals, hiring decisions, strategic input needed]

Format: board-suitable slide content. Plain language, no engineering jargon. 4-5 slides worth.
```

### 14:00–15:00 Uhr — Vorfallsüberprüfung (nach jedem P1)

Innerhalb von 48 Stunden nach dem Abschluss eines P1-Vorfalls ausführen.

```
Blameless post-mortem for incident: [name/date]

What happened (timeline):
[Paste from your incident management tool or notes]

Impact:
- Duration: [X minutes/hours]
- Customers affected: [X or description]
- Revenue impact if known: [$X or estimate]

5 Whys analysis:
Why 1: [what failed on the surface]
Why 2: [why did that happen]
Why 3: [why did that happen]
Why 4: [why did that happen]
Why 5: [root cause — systemic, not human error]

Contributing factors: [list what made this worse]
What went well (detection, response): [list]
Action items:
- [Fix 1]: owner, due date, type (prevention / detection / response)
- [Fix 2]: same

Distribute to: engineering team, leadership [yes/no], customers [yes/no with draft]
```

---

## Quartalsrhythmus

### Quartalsbeginn — Strategieauffrischung

```
/engineering-strategy

Quarterly strategy review — Q[N]:

Last quarter assessment:
- DORA metrics improvement: [before vs. after]
- Strategic priorities achieved: [X of N]
- Major architectural decisions made: [list]
- Team topology changes: [any restructuring?]
- Hiring: [X hires / X open roles remaining]

New quarter priorities:
- Business priorities from CEO/board: [list]
- Engineering platform needs: [what infrastructure work can't wait?]
- Tech debt obligations: [what must be addressed to keep velocity?]
- Hiring plan: [X hires, which roles, target dates]

Produce:
- Updated engineering strategy (12-month view)
- Q[N] specific roadmap (quarterly view)
- Updated build vs. buy decisions if anything has changed
- Team topology review — is the current structure still optimal?
```

### Quartalsende — Leistung und Retrospektive

```
Engineering retrospective — Q[N]:

DORA metrics end-of-quarter:
[Compare start vs. end of quarter for all 4 DORA metrics]

What did we learn this quarter?
- Best architectural decision: [and why]
- Worst architectural decision: [and what we'd do differently]
- Process change that helped most: [specific]
- Process that still needs fixing: [specific]
- Engineering health trend: [improving / steady / declining]

For the team to discuss:
What should we start, stop, and continue next quarter?
```

---

## Wenn etwas schiefläuft

### „Wir haben einen schwerwiegenden Vorfall"

```
@cto-advisor + @architect

Active incident: [brief description]
Systems affected: [list]
User impact: [describe]
Time started: [when]
Current status: [what's being tried]
Engineers on it: [who]

I need:
1. Immediate: what to try in the next 30 minutes (ordered by likelihood to resolve)
2. Communication: what to tell the business while we're resolving
3. Escalation: do we need additional people? Vendor support?
```

### „Wir müssen eine größere Technologieinvestition entscheiden"

```
@cto-advisor

Technology investment decision: [describe]
Options:
- Option A: [description, cost estimate]
- Option B: [description, cost estimate]
- Option C (buy/partner): [if applicable]

Business context:
- This supports our [product priority]
- Timeline pressure: [when we need it]
- Team capability to execute: [strong / needs hiring / unknown]
- Strategic importance: [is this core to our competitive advantage?]

Walk me through the decision using the build vs. buy framework.
Give me your recommendation + the 3 factors that matter most.
```

### „Die Engineering-Velocity ist seit 2 Sprints rückläufig"

```
@vpe-advisor

Velocity diagnosis for [TEAM]:

Metric trend:
- Sprint 1: [story points committed vs. delivered]
- Sprint 2: [story points committed vs. delivered]
- Sprint 3 (current): [tracking to?]

Team context:
- Team size: [X engineers]
- Recent changes: [new hire / departure / scope change / tech debt sprint]
- Known issues: [what team has mentioned]
- My hypothesis: [what I think is causing it]

Diagnose: which type of velocity problem is this?
a) Commitment problem (planning is broken)
b) Estimation problem (stories are sized wrong)
c) Interruption problem (too much unplanned work)
d) Cycle time problem (stories sit "in progress" too long)

For the most likely cause: what's the one change with the fastest impact?
```

---

## Schlüssel-Benchmarks (Engineering-Organisation in der Wachstumsphase)

| Metrik | Zielwert | Untersuchen wenn... |
|---|---|---|
| Deployment-Häufigkeit | Täglich oder mehrfach/Woche | < 1/Woche |
| Lead-Time für Änderungen | < 24 Stunden | > 1 Woche |
| Change-Failure-Rate | < 10% | > 20% |
| MTTR | < 1 Stunde | > 4 Stunden |
| Sprint-Commitment-Rate | ≥ 80% | < 65% |
| Tech-Debt-Anteil an der Kapazität | 15–20% | < 10% oder > 30% |
| ADR-Abdeckung | Für alle wichtigen Entscheidungen geschrieben | Mündliche Entscheidungen ohne Dokumentation |
| Interview-Debrief-Rate | 100% der Loops haben ein Debrief | Panel entscheidet per E-Mail |
| Time-to-Hire (Engineering-Stellen) | < 45 Tage | > 90 Tage |

---
