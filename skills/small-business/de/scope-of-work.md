---
name: scope-of-work
description: "Leistungsbeschreibungsdokument: Liefergegenstände, Zeitplan, Verantwortlichkeiten, Ausschlüsse, Zahlungsbedingungen und Änderungsauftrag-Richtlinie — Schutz vor Scope-Creep und falschen Erwartungen"
---

# Skill: Leistungsbeschreibung (Scope of Work)

## Wann aktivieren
- Beginn jedes neuen Kundenprojekts, bei dem Unklarheiten später Probleme verursachen könnten
- Ein Kunde möchte vorankommen, hat aber nicht definiert, wie „fertig" aussieht
- Sie hatten bereits ein Scope-Creep-Problem und benötigen einen schriftlichen Vertrag zum Thema Leistungsumfang
- Ein Projekt ist komplex genug, dass Liefergegenstände aufgelistet (nicht nur beschrieben) werden müssen
- Vor dem Ausstellen einer Rechnung — die Leistungsbeschreibung definiert, wofür die Rechnung gilt
- Jedes Projekt über 2.000 $ oder mit einer Laufzeit von mehr als 2 Wochen

## Wann NICHT verwenden
- Sehr einfache Einmalaufgaben mit einem klaren einzelnen Liefergegenstand und keinerlei Unklarheiten — stattdessen eine Rechnung mit kurzer Beschreibung verwenden
- Rechtliche Dienstleistungsverträge, die die spezifischen Vertragsklauseln Ihrer Rechtsordnung erfordern — lassen Sie diese von Ihrem Anwalt prüfen oder erstellen
- Staatliche oder Unternehmenseinkäufe, bei denen der Auftraggeber die Vorlage für die Leistungsbeschreibung vorgibt — passen Sie deren Format an

## Wichtig

Dieser Skill erstellt professionelle Leistungsbeschreibungsdokumente für Freiberufler und Berater. Das Ergebnis ist ein professionelles Dokument, aber kein Rechtsrat. Bei hochpreisigen Projekten (> 10.000 $) lassen Sie die Leistungsbeschreibung von einem Vertragsanwalt in Ihrer Rechtsordnung prüfen. Fügen Sie immer Klauseln zu anwendbarem Recht und Streitbeilegung ein.

## Anweisungen

### Vollständige Leistungsbeschreibung — Prompt

```
Write a professional Scope of Work document.

PROJECT DETAILS:
- Project name: [name]
- Client: [company name]
- Freelancer/consultant: [your name or company]
- Project start date: [date]
- Project end date / delivery date: [date or range]
- Contract value: $[X] (total or monthly retainer: $[X]/month)

WHAT I AM PROVIDING (be specific — vague deliverables cause disputes):
[List each deliverable:]
1. [Deliverable 1 — be explicit: e.g., "5 blog posts of 1,200-1,500 words each, optimized for provided keywords, delivered as Google Docs with revisions incorporated within 48 hours"]
2. [Deliverable 2]
3. [Deliverable 3]

WHAT IS NOT INCLUDED (exclusions prevent scope creep):
[List explicit exclusions:]
- [Exclusion 1 — e.g., "Paid media management, ad spend, or campaign execution"]
- [Exclusion 2]
- [Exclusion 3]

CLIENT RESPONSIBILITIES (what you need from them):
[List what the client must provide:]
- [Requirement 1 — e.g., "Brand guidelines and logo assets within 3 business days of project start"]
- [Requirement 2 — e.g., "One designated point of contact who can approve deliverables"]
- [Requirement 3 — e.g., "Feedback on drafts within 5 business days"]

TIMELINE:
Phase 1 — [name]: [date range] — [deliverables in this phase]
Phase 2 — [name]: [date range] — [deliverables]
Phase 3 — [name]: [date range] — [deliverables]
Final delivery: [date]

REVISIONS POLICY:
Number of revision rounds included: [X]
What constitutes a revision vs. a new request: [describe]
Revision turnaround time: [X business days]

PAYMENT TERMS:
- Total: $[X]
- Structure: [50% upfront + 50% on delivery / monthly on the 1st / milestone-based]
- Invoicing: [when/how you'll invoice]
- Payment due: [Net 15 / Net 30 / on receipt]
- Late payment: [[X]% monthly fee on overdue balances]

CHANGE ORDER POLICY:
Any work outside this SOW requires a written change order before work begins.
Change orders will be quoted at $[X]/hour or $[X] per [unit].
Timeline extensions may apply.

INTELLECTUAL PROPERTY:
[Choose: Upon receipt of full payment, all work product becomes client property / You retain rights to work until final payment / Portfolio usage rights retained by freelancer]

CONFIDENTIALITY:
Both parties agree to keep the terms and details of this project confidential.
[Add NDA clause if needed]

Generate a professional SOW document. Use clear section headers. Write in plain English — not legalese, but firm and specific. End with a signature block for both parties.
```

---

### Projektphasen / Meilensteinstruktur

Verwenden Sie dies für komplexe Projekte, um den Zeitplan zu strukturieren:

```
Help me define project phases and milestones for this project.

PROJECT: [description]
TOTAL DURATION: [X weeks/months]
TOTAL VALUE: $[X]

What I need to deliver (rough list): [your notes]

Organize into phases:
- Each phase should have: name, duration, key deliverables, milestone payment (if applicable)
- Phases should be sequential where dependencies exist
- Each phase should end with a clear client approval checkpoint

Client approval requirement: [yes/no — do they need to approve each phase before next begins?]
Kill clause: if client cancels after Phase [X], what do they owe?

Generate the milestone schedule and payment structure.
```

---

### Vorlagen für Überarbeitungsrichtlinien

Wählen Sie die passende Überarbeitungsrichtlinie für Ihre Arbeitsart:

**Für kreative Arbeiten (Design, Texterstellung, Branding):**
```
REVISIONS
This project includes [two] rounds of revisions.

A revision is defined as adjustments to work already submitted — modifying copy direction, refining design elements, or changing the scope within the original brief.

A revision is NOT:
- A change to the original brief or project objectives
- Requesting new features, sections, or deliverables
- Returning to a previously rejected direction

Additional revisions are available at $[X]/hour, billed in 30-minute increments.
Revision requests must be submitted within [5] business days of delivery.
After [5] business days, work is considered approved.
```

**Für Software-/technische Arbeiten:**
```
ACCEPTANCE CRITERIA AND REVISIONS
Deliverables will be tested against the acceptance criteria specified in Appendix A.

Bug fixes: defects that prevent the deliverable from functioning as specified are covered at no charge for [30] days post-delivery.

Change requests: modifications to specifications, new features, or enhancements are out of scope and require a change order.
```

**Für Beratung/Advisory:**
```
REVISION POLICY
Consulting deliverables (recommendations, reports, strategy documents) include one round of revisions to address factual corrections and clarification requests.

Revisions that change the scope of analysis or require additional research are out of scope.
Additional sessions may be purchased at $[X]/hour.
```

---

### Vorlage für Änderungsaufträge

```
Generate a change order for additional work requested by my client.

ORIGINAL SOW DATE: [date]
CHANGE ORDER #: [number]
DATE REQUESTED: [date]

REQUESTED CHANGE:
[Describe what the client is asking for that is outside the original scope]

HOW THIS DIFFERS FROM ORIGINAL SCOPE:
[Explicitly connect to the exclusions or scope boundaries in the original SOW]

ADDITIONAL WORK REQUIRED:
- [Task 1]: [X hours estimated at $Y/hour]
- [Task 2]: [X hours estimated at $Y/hour]

ADDITIONAL COST: $[X]
TIMELINE IMPACT: [none / [X] days added to delivery date]

This change order becomes effective when signed by both parties. The original SOW terms apply to all work covered by this change order.

Generate the change order document with signature lines.
```

---

### Checkliste für Warnsignale in Leistungsbeschreibungen

Prüfen Sie jede Leistungsbeschreibung, bevor Sie unterzeichnen — Ihre eigene oder die eines Kunden:

```
Review this Scope of Work for red flags before I sign it.

[Paste the SOW]

Check for:
[ ] Vague deliverables ("website" vs. specific page count, functionality, integrations)
[ ] Unlimited revisions clause — unlimited = unlimited liability
[ ] No payment schedule — payment only "on completion" creates leverage against you
[ ] No kill fee — what happens if they cancel halfway through?
[ ] Client owns IP before payment — you deliver everything, then they don't pay
[ ] No late payment clause — what's the consequence of them paying 90 days late?
[ ] No exclusions — what's explicitly NOT included?
[ ] No client responsibilities — what if they don't provide assets on time?
[ ] Governing law not specified — whose courts handle disputes?
[ ] Personal liability — are you signing as an individual or as a business entity?

Flag each red flag, explain the risk, and suggest replacement language.
```

---

### Ausgabeformat — vollständiges Leistungsbeschreibungsdokument

```markdown
# SCOPE OF WORK

**Project:** [Name]
**Client:** [Company Name]
**Contractor:** [Your Name / Company]
**Effective Date:** [Date]

---

## 1. Project Overview

[2-3 sentences describing what this project is and its business objective]

---

## 2. Scope of Services

The Contractor will deliver the following:

### 2.1 [Deliverable Category]
- [Specific deliverable with quantity, format, and quality standard]
- [Specific deliverable]

### 2.2 [Deliverable Category]
- [Specific deliverable]

---

## 3. Out of Scope

The following are expressly excluded from this engagement:
- [Exclusion 1]
- [Exclusion 2]
- [Exclusion 3]

Any work not listed in Section 2 requires a written Change Order (see Section 8).

---

## 4. Client Responsibilities

The Client agrees to provide:
- [Requirement 1] by [date or within X days of project start]
- [Requirement 2]
- [Requirement 3]

Delays in Client deliverables may extend the project timeline without penalty to the Contractor.

---

## 5. Timeline and Milestones

| Phase | Deliverables | Start Date | End Date |
|---|---|---|---|
| Phase 1 | [list] | [date] | [date] |
| Phase 2 | [list] | [date] | [date] |
| Final | [delivery] | [date] | [date] |

---

## 6. Revisions

[Revision policy appropriate to the work type]

---

## 7. Fees and Payment

**Total project fee:** $[X]

Payment schedule:
- [X]% ($[X]) due upon contract signing
- [X]% ($[X]) due upon [milestone]
- [X]% ($[X]) due upon final delivery

Invoices are due [Net 15 / Net 30] from receipt.
Overdue balances accrue a [1.5]% monthly late fee.

---

## 8. Change Order Policy

Work not covered by Section 2 requires a written Change Order signed by both parties before work begins. Changes are quoted at $[X]/hour unless otherwise agreed.

---

## 9. Intellectual Property

Upon receipt of full payment, all work product created under this agreement transfers to the Client. The Contractor retains the right to display the work in their portfolio.

---

## 10. Confidentiality

Both parties agree to treat all non-public information exchanged under this agreement as confidential.

---

## 11. Governing Law

This agreement is governed by the laws of [State/Country].

---

## Signatures

**Client:** _________________________ Date: _______
Name: [name], Title: [title], [Company]

**Contractor:** _________________________ Date: _______
Name: [your name], [your company]
```

## Beispiel

**Benutzer:** Ich bin freiberufliche UX-Designerin. Ein Kunde möchte einen vollständigen Neugestaltung seines SaaS-Onboarding-Flows. Drei Wochen Projekt. Ich werde Discovery, Wireframes und hochauflösende Figma-Mockups liefern. Texterstellung oder Entwickler-Übergabespezifikationen wurden nicht erwähnt. 6.500 $ insgesamt, 50 % im Voraus.

**Erwartete Ausgabe:** Vollständige Leistungsbeschreibung mit Abschnitt 2, der auflistet: Discovery-Workshop (1 Sitzung, 90 Min.), User-Flow-Mapping (3 Flows), Wireframes (8 Screens), hochauflösende Figma-Mockups (8 Screens, Desktop + Mobil). Ausschlüsse in Abschnitt 3: Texterstellung und UX-Copy, Entwickler-Übergabedokumentation, Usability-Tests, Implementierung. Kundenverantwortlichkeiten in Abschnitt 4: Zugang zu 3 aktuellen Nutzern für einen 30-minütigen Discovery-Call, bestehende Markenrichtlinien innerhalb von 2 Werktagen. Überarbeitungsrichtlinie: 2 Runden bei Wireframes, 2 Runden bei hochauflösenden Designs. Zahlung: 3.250 $ bei Unterzeichnung, 3.250 $ bei endgültiger Figma-Lieferung. Änderungsauftrag-Rate: 150 $/Stunde.

---

> **Arbeiten Sie mit uns:** Claudient wird von [Uitbreiden](https://uitbreiden.com/) unterstützt — wir entwickeln KI-Produkte und B2B-Lösungen mit Entwickler-Communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
