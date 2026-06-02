---
name: usability-report
description: "Usability-Testbericht: Sitzungszusammenfassungen, Schweregradbewertungen, Befunde, priorisierte Empfehlungen"
---

# Usability-Bericht Skill

## Wann aktivieren
- Du hast eine Runde Usability-Tests (moderiert oder unmoderiert) abgeschlossen und musst die Ergebnisse aufschreiben
- Du hast rohe Sitzungsnotizen, Aufzeichnungen oder Beobachterprotokolle, die in einen strukturierten Bericht umgewandelt werden sollen
- Stakeholder benötigen eine priorisierte Liste von Problemen vor einem Design-Review oder einer Sprint-Planungssitzung
- Du möchtest Usability-Probleme nach Schweregrad bewerten und einordnen, bevor du entscheidest, was behoben werden soll
- Du musst ein teilbares Artefakt erstellen, auf das Nicht-Forscher (PMs, Ingenieure, Führungskräfte) reagieren können

## Wann NICHT verwenden
- Du hast noch keine Sitzungen durchgeführt — verwende den `/ux-researcher`-Skill, um den Test zunächst zu planen
- Du möchtest qualitative Interviews (keine Usability-Aufgaben) synthetisieren — das ist Forschungssynthese, kein Usability-Bericht
- Du benötigst ein UX-Audit gegen Heuristiken ohne Sitzungen — verwende `/ux-audit`
- Du möchtest Personas aus den Daten erstellen — verwende `/persona-builder` nach dem Bericht

## Anweisungen

### Vollständiger Usability-Bericht-Generator

```
Write a usability test report for [product/feature].

## Context
Product: [name and short description]
Feature tested: [the specific flow or interaction being evaluated]
Test format: [moderated remote / moderated in-person / unmoderated (e.g. Maze, UserTesting.com)]
Participants: [N] — [brief screener criteria, e.g. "mid-market operations managers, existing customers"]
Sessions conducted: [date range]
Research questions:
1. [Primary question — e.g. "Can users create a new invoice without assistance?"]
2. [Secondary question — e.g. "Do users understand the difference between Draft and Pending states?"]

## Raw findings (paste your session notes here)
[Paste observer notes, video timestamps, think-aloud quotes, task completion records]

## Produce this report:

### Executive Summary (half page)
- What we tested and why
- The 3 most critical findings in plain language
- Recommended next steps (top 3 actions the team should take)
- Overall usability impression: [Needs work / Acceptable / Strong]

### Methodology
- Test objectives
- Participant profile and recruitment criteria
- Task list (verbatim task prompts used)
- Metrics collected: task completion rate, time on task, error rate, SUS score (if collected), qualitative observations

### Quantitative Results
| Task | Completion Rate | Avg Time (s) | Error Rate | SUS Contribution |
|---|---|---|---|---|
| Task 1: [name] | X/N (X%) | Xs | X errors/user | - |
| Task 2: [name] | X/N (X%) | Xs | X errors/user | - |

SUS Score: [X]/100
- 85+: Excellent
- 71-84: Good (above average)
- 51-70: OK (below average — needs attention)
- <51: Poor (redesign needed)

### Usability Findings (prioritised)

For each finding:

**Finding [N]: [Short descriptive title]**
Severity: [Critical / High / Medium / Low] — see severity rubric below
Frequency: [X of N participants affected]
Task(s) affected: [Task name(s)]

**What we observed:**
[Specific, observable description of the behaviour — not interpretation yet]
"[Representative participant quote verbatim]"

**Why it matters:**
[The downstream consequence — task failure, abandonment, incorrect action, support call, etc.]

**Recommendation:**
[Specific, actionable design or content change — not "improve the UI"]

Evidence: [Participant IDs + timestamps if from recordings]
Effort estimate: [Low / Medium / High — for engineering prioritisation]

---

### Severity Rubric (Nielsen's scale, adapted)

| Severity | Definition | Recommended action |
|---|---|---|
| Critical | Blocks task completion; participant cannot proceed | Fix before release |
| High | Major friction; most users struggle significantly, some abandon | Fix in next sprint |
| Medium | Noticeable friction; slows users down or causes errors | Schedule within 2-4 sprints |
| Low | Minor annoyance; polish-level issue | Backlog / nice to have |

Severity = Impact × Frequency:
- Impact score: Cosmetic (1) / Minor (2) / Major (3) / Catastrophic (4)
- Frequency score: Rare (1) / Some (2) / Most (3) / All (4)
- Priority score = Impact × Frequency; sort findings descending

### Prioritised Recommendations Table

| Priority | Finding | Severity | Frequency | Effort | Recommended Fix | Owner |
|---|---|---|---|---|---|---|
| P1 | [Finding title] | Critical | X/N | Low | [Short recommendation] | Design |
| P2 | [Finding title] | High | X/N | Medium | [Short recommendation] | Design+Eng |
| P3 | [Finding title] | Medium | X/N | High | [Short recommendation] | PM |

### What We Still Don't Know
- [Gap 1 — a question this round of testing couldn't answer]
- [Gap 2 — a hypothesis still unvalidated]

Recommended next research: [the one follow-up study that would resolve the biggest remaining uncertainty]

### Appendix
- Participant demographics table
- Full session notes / raw observations
- Task completion data by participant
- Recording links (if applicable)
```

### Schnelle Schweregradtriage (rohe Notizen einfügen, priorisierte Liste erhalten)

```
I have raw observer notes from [N] usability sessions. Triage these findings by severity.

Product: [name]
Task that was tested: [task description]

Raw notes:
[paste session notes — one observation per line or paragraph is fine]

For each distinct finding, give me:
- Finding title (short)
- Severity: Critical / High / Medium / Low
- Frequency: X/N participants
- One-line recommendation

Sort by severity descending. Flag the top 3 for immediate action.
```

### SUS-Bewertung und -Interpretation

```
Calculate and interpret a SUS (System Usability Scale) score from raw responses.

SUS has 10 items, each rated 1-5 by participants.
Odd-numbered items (1, 3, 5, 7, 9): score = response - 1
Even-numbered items (2, 4, 6, 8, 10): score = 5 - response

SUS score = (sum of all adjusted scores) × 2.5

Participant responses (paste as CSV or table):
[P1: 4, 2, 4, 1, 4, 1, 5, 1, 5, 2]
[P2: ...]

Calculate:
1. Per-participant SUS score
2. Mean SUS score across all participants
3. Percentile and adjective rating:
   - 90-100: Best imaginable
   - 85-89: Excellent
   - 71-84: Good
   - 51-70: OK (below average)
   - 25-50: Poor
   - <25: Worst imaginable
4. Benchmarked against industry average (68 = industry mean for software)
5. Trend analysis if you have SUS scores from a previous round

Include: interpretation paragraph for stakeholders who don't know what SUS is.
```

### Gliederung der Stakeholder-Präsentationsfolie

```
Convert this usability report into a 10-slide stakeholder presentation.

Audience: [PMs and engineering leads / executives / design team / all]
Time: [20-minute presentation]
Goal: [get approval to prioritise fixes / educate team / plan next sprint]

Deck structure:
Slide 1: What we tested + why it mattered now
Slide 2: Who we tested (participant profile — not names, not demographics fluff)
Slide 3: Overall result — one headline number (SUS / completion rate / top stat)
Slide 4: Finding 1 — most critical (include a screenshot or quote)
Slide 5: Finding 2 — second most critical
Slide 6: Finding 3 — third most critical
Slide 7: Full prioritised issues table (all findings)
Slide 8: Recommended fixes and effort estimate
Slide 9: What we're doing next (follow-up plan)
Slide 10: Appendix — methodology for the sceptics

For each finding slide:
- One title that's a plain-language statement of the problem (not "Finding 4")
- One participant quote in large font
- What it means for the business (not just the UX)
- The specific recommendation

Write slide titles and speaker notes. Keep each slide to 3-5 bullet points maximum.
```

## Beispiel

**Benutzer:** Wir haben 6 moderierte Remote-Sitzungen durchgeführt, in denen unser neuer Checkout-Flow getestet wurde. Aufgabe 1 (einen Rabattcode anwenden) hatte 3/6 Abschlüsse. Aufgabe 2 (Lieferadresse beim Checkout ändern) hatte 5/6. Wichtigste Beobachtungen: Benutzer suchen das Rabattfeld unten im Warenkorb, es befindet sich aber oben. Zwei Benutzer schlossen den Tab, weil sie dachten, sie hätten etwas kaputt gemacht, als die Seite nach der Code-Eingabe neu geladen wurde.

**Ausgabe:**

```markdown
# Usability Report: Checkout Flow — June 2026

## Executive Summary
We tested the redesigned checkout flow with 6 participants. The discount code entry flow has a critical
discoverability problem that causes 50% task failure, and a page reload after code entry is causing
user abandonment. The shipping address change is largely successful (83% completion) with minor friction.

**Top 3 actions:**
1. [CRITICAL] Move discount code field to the bottom of the order summary — users scan top-to-bottom
   and look for the code field adjacent to the total, not at the top.
2. [CRITICAL] Replace full page reload after discount code entry with in-line price update (no reload).
3. [MEDIUM] Add inline confirmation when discount is applied ("$15 saved" in green, adjacent to total).

Overall impression: Needs work before launch.

---

## Quantitative Results

| Task | Completion Rate | Avg Time | Error Rate |
|---|---|---|---|
| Apply discount code | 3/6 (50%) | 94s | 1.8 errors/user |
| Change shipping address | 5/6 (83%) | 41s | 0.4 errors/user |

---

## Finding 1: Discount field position causes systematic task failure
**Severity: Critical** | **Frequency: 6/6 participants looked in the wrong place first**

What we observed: All 6 participants scrolled to the bottom of the cart looking for the discount field.
The field is positioned at the top of the cart, above the item list — the last place users look.
3 of 6 gave up before finding it.

"I just assumed there wasn't a discount field. I looked everywhere at the bottom." — P4

Why it matters: 50% task failure on a primary discount redemption flow = abandoned carts,
increased support contacts, and coupon revenue that never converts.

Recommendation: Move the discount code entry field to the bottom of the order summary,
immediately above the order total. This is the position users expect (consistent with
Amazon, Shopify, and most major e-commerce checkout flows).

Effort: Low (CSS repositioning + minor template change)

---

## Finding 2: Page reload on code entry causes perceived error state
**Severity: Critical** | **Frequency: 2/6 participants abandoned; 4/6 showed visible confusion**

What we observed: After entering a valid discount code, the page performs a full reload.
Two participants thought they had navigated away from checkout or that an error occurred.
One participant closed the tab.

"I thought I'd lost everything. That spinning — I didn't know if it had worked." — P2

Recommendation: Replace full-page reload with an in-place AJAX price update.
Show inline confirmation: "Code SUMMER20 applied — you saved $15" in green text.

Effort: Medium (front-end async update pattern)
```

---

> **Arbeite mit uns:** Claudient wird von [Uitbreiden](https://uitbreiden.com/) unterstützt — wir entwickeln KI-Produkte und B2B-Lösungen mit Entwickler-Communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
