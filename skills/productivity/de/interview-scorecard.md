---
name: interview-scorecard
description: "Strukturierte Interview-Scorecard: kompetenzbasierte Fragen, Bewertungsrubrik und Debrief-Vorlage für konsistente, vorurteilsresistente Einstellungsentscheidungen"
---

# Skill: Interview-Scorecard

## Wann aktivieren
- Sie haben eine offene Stelle und benötigen einen strukturierten Interviewprozess vor dem ersten Kandidatengespräch
- Sie möchten die subjektive Beurteilung durch Interviewer und Bauchgefühl-Entscheidungen reduzieren
- Sie müssen neue Interviewer schulen, wie sie eine Rolle bewerten, für die sie noch nicht eingestellt haben
- Sie bereiten sich auf ein konkretes Kandidatengespräch vor und möchten gezielte Fragen basierend auf dem Hintergrund des Kandidaten
- Ihr Debrief-Prozess ist inkonsistent — Leute stimmen per Daumen hoch/runter ohne Belege ab
- Sie bauen einen Einstellungsprozess für einen Rollentyp auf, den Sie noch nie besetzt haben (neue Funktion, neue Senioritätsstufe)

## Wann NICHT verwenden
- Sie brauchen nur eine Stellenbeschreibung — dafür `/job-description` verwenden
- Kandidatensuche — dafür `/candidate-sourcer` verwenden
- Vergütungs-Benchmarking — dafür `/comp-benchmarker` verwenden
- Referenzgespräche — anderer Skill
- Wenn Sie den Kandidaten bereits interviewt haben und eine Bewertung aus dem Gedächtnis schreiben, ohne Notizen zu haben (nur aus tatsächlichen Gesprächsnotizen rekonstruieren)

## Anweisungen

### Scorecard-Builder

```
Build a structured interview scorecard for [role].

Role: [Job title]
Level: [IC / Manager / Director / VP / C-suite]
Department: [Engineering / Sales / Marketing / CS / Ops / Finance]
Key responsibilities: [top 3-5 things this person will own]
Must-have competencies: [3-5 non-negotiable skills or traits]
Nice-to-have: [2-3 differentiators that separate good from great]
Deal-breakers: [specific backgrounds, signals, or traits that disqualify]

Build a scorecard with:

## Competencies to evaluate (4-6 per role)
For each competency:
- Name: [e.g., "Analytical thinking" / "Executive communication" / "Ownership mentality"]
- Definition: [exactly what does strong look like for this role at this level?]
- Why it matters: [how does this competency directly impact success in the role?]
- 2-3 interview questions:
  Question 1: [behavioural — "Tell me about a time you..."]
  Question 2: [situational — "How would you approach..."]
  Question 3 (optional): [follow-up probe — "What would you do differently?"]
- Evidence to look for in answers:
  Strong signal: [specific language, examples, or behaviour patterns]
  Weak signal: [vague answers, can't give examples, deflects responsibility]
  Red flag: [specific answer patterns that disqualify]

## Scoring rubric (for each competency)
4 — Exceptional: [specific description — goes beyond role requirements]
3 — Strong: [meets and consistently exceeds expectations]
2 — Developing: [inconsistently meets expectations — coaching needed]
1 — Not a fit: [below bar for this role at this level]

## Overall recommendation
Based on scores:
Average ≥ 3.5 → Strong Hire
Average 3.0-3.4 → Hire with reservations (note them)
Average 2.5-2.9 → No Hire (gaps too significant)
Average < 2.5 → Clear No Hire

## Debrief template
After each interview, each interviewer completes:
- Competency assessed: [which of the 4-6 competencies were you evaluating?]
- Evidence collected: [specific examples the candidate gave — quote them]
- Score per competency: [1-4 for each]
- Overall score: [1-4]
- Overall recommendation: [Strong Hire / Hire / No Hire / Strong No Hire]
- Top reason for recommendation: [1-2 sentences, evidence-based]
- Questions for the panel: [anything you want other interviewers to probe on]

Generate the full scorecard for [role].
```

### Bibliothek kompetenzbasierter Fragen

```
Generate competency-based interview questions for [competency].

Competency: [e.g., "Customer obsession" / "Data-driven decision making" / "Cross-functional influence"]
Role level: [IC / Manager / Senior IC / Director]
Function: [Sales / Engineering / Product / Marketing / Operations]

Question format: always behavioural STAR-format (Situation, Task, Action, Result)

Generate:
- 3 primary questions (open-ended, behavioural, specific to this competency)
- 2 follow-up probes (dig deeper when answers are vague or too high-level)
- 1 situational/hypothetical (for roles where candidates lack direct experience)

For each question, provide:
What you're testing: [the specific sub-skill within this competency]
Strong answer looks like: [concrete, specific, owns the outcome, quantifies if possible]
Weak answer looks like: [vague, says "we" not "I", no clear outcome, blame-shifts]
Red flag in this answer: [avoids the question, makes up a story, contradicts resume]

Common competencies for SaaS/tech roles:
- Problem-solving under ambiguity
- Stakeholder communication and influence
- Data-driven decision making
- Customer empathy and obsession
- Ownership and accountability
- Learning agility and growth mindset
- Collaboration and conflict resolution
- Execution and delivery under pressure
- Strategic thinking and prioritisation
- Building and developing teams (manager-level)

Generate the question library for [competency].
```

### Gestaltung des Interviewpanels

```
Design the interview panel structure for [role].

Role: [title]
Total interview stages: [X] (recommend 3-5 stages — more than 5 loses candidates)
Interview format: [remote / in-person / hybrid]
Decision-maker: [hiring manager]
Time to fill target: [X weeks]

Recommended panel design:

STAGE 1 — Recruiter screen (20-30 min, phone)
Purpose: Qualify basics — compensation, availability, motivation, communication
Who: Recruiter
Evaluates: culture fit baseline, communication, deal-breakers

STAGE 2 — Hiring manager screen (30-45 min, video)
Purpose: Assess technical competency and role fit at a high level
Who: Hiring manager
Evaluates: [top 2 competencies for this role]
Outputs: decision to advance or pass — no ambiguous "maybes" without specifics

STAGE 3 — Technical / skills assessment (varies)
Purpose: Role-specific evaluation — presentation, case study, take-home, live exercise
Who: Hiring manager + 1-2 domain experts
Format: [choose — live case / take-home with debrief / work sample / portfolio review]
Rule: Make it realistic and relevant — no trick questions, nothing that takes > 2 hours

STAGE 4 — Panel interviews (60-90 min total, 2-3 interviews back-to-back)
Purpose: Assess breadth of competencies from multiple perspectives
Who: 2-3 team members from relevant functions
Each interviewer gets assigned 1-2 competencies to evaluate — no overlap
Interviewers do NOT share impressions before debrief

STAGE 5 — Executive / leadership interview (30-45 min, optional for senior roles)
Purpose: Culture, leadership values, strategic fit
Who: Hiring manager's manager or C-suite
Evaluates: Vision alignment, communication at executive level, ambition

DEBRIEF PROCESS:
- Each interviewer submits scorecard within 24 hours of interview
- Debrief meeting: 30-45 min with all panel members
- Structured: each person shares score + evidence before any discussion
- No one changes their score because of group pressure — note disagreements
- Decision: Hire / No Hire / Extend process

Design the interview panel for [role].
```

### Leitfaden zur Debrief-Moderation

```
Facilitate the interview debrief for [candidate] for [role].

Candidate: [Name]
Role: [Title]
Interview panel:
- [Interviewer 1] — evaluated [competency A, B]
- [Interviewer 2] — evaluated [competency C, D]
- [Interviewer 3] — evaluated [competency E, F]

Debrief structure (follow this order — do NOT allow free-form discussion to start):

RULE: Scores and evidence before opinions. No one should influence others before sharing their own assessment.

1. Go around: each interviewer shares score per competency and overall recommendation
   - "My overall is [Strong Hire / Hire / No Hire / Strong No Hire] because [1 specific piece of evidence]"
   - No commentary from others until all scores are on the table

2. Note disagreements
   - If two interviewers differ by more than 1 point on the same competency: discuss
   - "You scored data-driven decision making a 4; I scored it a 2. Let's share what we observed."
   - Goal: reach evidence-based consensus, not averaging or deferring to seniority

3. Aggregate scores
   - Average per competency across all interviewers
   - Overall average
   - Hiring bar: [your threshold — e.g., 3.0+ overall]

4. Explicit decision discussion
   - If strong consensus → move to offer or rejection
   - If split panel → the hiring manager makes the call and documents the reason
   - Never leave debrief with "let me think about it" — commit to a decision

5. If hire: What onboarding needs does this candidate have?
   - Gaps to address in 30-60-90 plan
   - Who should be their early mentor or buddy?

6. If no hire: feedback to recruiter
   - Which competency was the disqualifier?
   - Is this candidate worth keeping in pipeline for a different role?
   - Was there a sourcing/screening issue upstream?

Produce debrief summary and hiring decision.
```

## Beispiel

**Nutzer:** Ich stelle einen Head of Customer Success ein. Er/Sie wird 3 CSMs führen und ein ARR-Portfolio von 4 Mio. $ verantworten. Welche Scorecard sollte ich verwenden?

**Scorecards von Claude:**

**Head of Customer Success — Interview-Scorecard**

**Zu bewertende Kompetenzen:**

**1. Kaufmännisches Verständnis (Net Revenue Retention-Verantwortung)**
Fragen:
- „Erzählen Sie mir von einer Situation, in der Sie eine Verlängerungsstrategie für einen gefährdeten Kunden entwickelt haben. Was war das Ergebnis?"
- „Wie denken Sie über die Balance zwischen Kundengesundheit und Expansionszielen — und wie haben Sie diese Spannung gemanagt?"
Nachfrage-Probe: „Was würden Sie anders machen, wenn Sie diese Verlängerung erneut durchführen müssten?"
Stärke: Spricht konkret über NRR als Kennzahl, zeigt Verständnis für Expansionsökonomie, nicht nur „Kunden glücklich machen"
Warnsignal: Definiert CS-Erfolg rein über Zufriedenheit/NPS ohne Umsatzbeitrag

**2. Führung und Teamentwicklung**
Fragen:
- „Erzählen Sie mir von einem CSM, den Sie entwickelt haben, der unterdurchschnittlich war. Was haben Sie getan und was ist passiert?"
- „Wie strukturieren Sie 1:1s und stellen sicher, dass Ihr Team sich fachlich weiterentwickelt, nicht nur seine Zahlen erreicht?"
Stärke: Konkrete Person, konkrete Coaching-Maßnahme, Vorher-Nachher-Ergebnis. Zeigt, dass sie Coaching von Trennung unterscheiden können.
Warnsignal: „Ich setze klare Erwartungen und halte die Leute zur Rechenschaft" — beschreibt Outputs, nicht das tatsächliche Führungsverhalten.

**3. Management von Vorstandsbeziehungen**
Fragen:
- „Erzählen Sie mir von einem Vorstandsmitglied bei einem Kunden, das mit Ihrem Produkt unzufrieden war. Wie haben Sie das gehandhabt?"
- „Wie gewinnen und halten Sie Executive-Sponsoren in Accounts, wo Ihr Produkt operativ, aber nicht strategisch eingesetzt wird?"
Stärke: Proaktiv angegangen, Beziehung übernommen, intern eskaliert wenn nötig, klares Ergebnis.
Warnsignal: Alle Eskalationen liefen über den Champion statt direkt mit dem Executive.

**4. Datengetriebener CS-Betrieb**
Fragen:
- „Beschreiben Sie das Health-Score-Modell, das Sie aufgebaut oder verbessert haben. Welche Signale haben Sie verwendet und wie haben Sie es validiert?"
- „Wie priorisieren Sie die Zeit Ihres Teams über ein Portfolio von 50+ Accounts?"
Stärke: Kann konkrete Signale benennen, Trade-offs erklären, beschreiben, wie sie die Vorhersagegenauigkeit gemessen haben.
Warnsignal: Health Score ist „Bauchgefühl" + Login-Häufigkeit. Keine Erwähnung von Validierung oder Iteration.

**5. Abteilungsübergreifender Einfluss (Produkt und Engineering)**
Frage: „Erzählen Sie mir von einer Situation, in der Sie intern für einen Kundenbedarf eingetreten sind und entweder Erfolg hatten oder nicht. Was war der Prozess und was würden Sie anders machen?"
Stärke: Hat einen Business Case mit Umsatzdaten aufgebaut, mit Product zusammengearbeitet statt Forderungen zu stellen, ohne Weisungsbefugnis Einfluss genommen.
Warnsignal: Klagt darüber, dass „Product nie auf CS hört." Beschreibt nicht ihre eigene Rolle in der Dynamik.

**Gesamtanforderung: Durchschnitt von 3,0+ zum Einstellen auf dieser Ebene.**

---

> **Mit uns arbeiten:** Claudient wird unterstützt von [Uitbreiden](https://uitbreiden.com/) — wir entwickeln KI-Produkte und B2B-Lösungen mit Entwickler-Communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
