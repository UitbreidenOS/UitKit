---
name: tech-debt-tracker
description: "Technical debt management: catalogue, categorise, and prioritise tech debt — build a debt register, quantify impact, present to leadership, and create a paydown strategy"
---

# Tech Debt Tracker Vaardigheid

## Wanneer activeren
- Een technisch schuldenregister voor het eerst maken
- Bepaal prioriteiten voor welke schuld eerst moet worden afgelost
- Zet een zaak op voor investering in technische schulden voor het management
- Schuld categoriseren die tijdens een sprint of code-review is ontdekt
- Plan een refactoring-sprint of schuldenaflossingskwartaal
- Documenteer het "waarom" achter technische beslissingen zodat toekomstige ingenieurs het begrijpen

## Wanneer NIET gebruiken
- Actieve bugfixing — dat is de debug-vaardigheid
- Performance-profiling — gebruik de performance-profiler-vaardigheid
- Onmiddellijke beveiligingsproblemen — los deze nu op, voeg niet toe aan register
- Architectuurontwerp-besluiten — gebruik in plaats daarvan een ADR (Architecture Decision Record)

## Instructies

### Technisch schuldenregister

```
Create a tech debt register for [codebase/system].

System: [describe]
Team: [X engineers]
Current pain points: [list what's slowing the team down]
Sources of debt: [past deadline pressure / changing requirements / outdated tech / missing tests]

Debt register format:

| ID | Name | Category | Location | Impact | Effort | Priority | Notes |
|---|---|---|---|---|---|---|---|
| TD-001 | [name] | [type] | [file/service] | [H/M/L] | [S/M/L/XL] | [score] | [context] |

Debt categories:
- CODE: duplication, complexity, bad naming, anti-patterns
- ARCHITECTURE: wrong abstractions, coupling, missing separation of concerns
- TEST: missing tests, brittle tests, test coverage gaps
- DEPENDENCY: outdated packages, deprecated libraries, security-vulnerable deps
- DOCUMENTATION: missing, outdated, or misleading docs
- DATA: schema inconsistency, missing indexes, migration backlog
- INFRASTRUCTURE: manual processes that should be automated, legacy config
- SECURITY: known vulnerabilities, insufficient access controls

For each debt item:
Name: [short, descriptive — "Authentication module uses MD5 hashing"]
Category: [from list above]
Location: [file path / service name / database table]
Description: [what the problem is — 1-3 sentences]
Root cause: [why this debt exists — deadline / changing requirements / originally reasonable decision]
Impact: [what it costs the team — slower development / higher bug rate / security risk / etc.]
Effort to fix: S (< 1 day) / M (1-3 days) / L (1-2 weeks) / XL (> 2 weeks)
Risk if not fixed: [what happens if we leave this — scale it, maintain it, never fix it]

Generate the debt register template and populate with items from my codebase description.
```

### Schuldenpriorisering

```
Prioritise our tech debt backlog.

Debt items: [paste register or list]
Team velocity: [X story points / sprint]
Current business pressure: [shipping features / reliability focus / growth / stability]

Prioritisation framework:

Score each item on 3 axes (1-10 each):

1. PAIN (how much it slows the team right now):
   10 = blocks daily work, causes regular bugs
   5 = noticed weekly, slows specific workflows
   1 = theoretical problem, not practically felt yet

2. RISK (what happens if we leave it):
   10 = security vulnerability or will cause outage
   5 = will become worse at scale, increasing future cost
   1 = cosmetic, manageable indefinitely

3. LEVERAGE (how much fixing it helps):
   10 = enables future features, reduces maintenance by 50%+
   5 = localised improvement, contained benefit
   1 = cosmetic or negligible improvement

Priority score = (Pain + Risk + Leverage) / 3

Effort multiplier:
S: score × 1.5 (quick win — high priority)
M: score × 1.0 (standard)
L: score × 0.7 (higher bar to justify)
XL: score × 0.4 (needs strong justification)

Quadrant view:
High pain + low effort = DO FIRST (quick wins)
High pain + high effort = PLAN (invest time, high ROI)
Low pain + low effort = BATCH (do in spare cycles)
Low pain + high effort = DEFER (unless risk is high)

Produce: prioritised debt backlog with top 5 items to address this quarter.
```

### Presentatie voor het management

```
Write a leadership presentation for [debt investment request].

Audience: [CTO / VP Engineering / CEO / Board]
Ask: [X engineer-weeks to address Y debt items]
Business context: [what business goal is debt blocking or slowing]
Current cost of debt: [describe in business terms — not just "code is messy"]

Framing for leadership:

WRONG framing: "We need to refactor the authentication module because the code is messy."
RIGHT framing: "Authentication bugs account for 23% of our P1 incidents this year. Fixing the root cause will reduce incident response time by 40% and let us ship the SSO feature 3 weeks earlier."

One-page structure:

SITUATION:
"Our [system/codebase] has accumulated [X years of] technical debt that is now measurably slowing our delivery velocity and increasing our incident rate."

IMPACT (quantify):
- Development velocity: "Features that take 2 days in a greenfield system take 5 days in our codebase due to [specific debt]."
- Incident rate: "X% of our incidents trace back to [specific module/pattern]."
- Engineer retention: "Our last exit interview cited codebase complexity as a reason for leaving." (if applicable)
- Customer impact: "[X] bugs this quarter were caused by [specific debt item]."

PROPOSED INVESTMENT:
"We propose allocating [X] engineer-weeks over [Y] months to address the highest-impact debt items."
[Table: debt item / engineer-weeks / expected outcome]

EXPECTED RETURN:
- [X%] reduction in bug rate in affected areas
- [X] weeks faster delivery on [upcoming feature]
- Enables [initiative] that was previously blocked

WHAT WE'RE NOT ASKING FOR:
"We are not asking to rewrite everything. This is a targeted, scoped paydown of the debt causing the most measurable pain."

Write the leadership brief for my specific ask.
```

### Schulden aflossings-sprint

```
Plan a tech debt paydown sprint for [team].

Team: [X engineers]
Sprint length: [2 weeks]
Debt items to tackle: [list from prioritised register]
Constraint: [some feature work must continue / full debt sprint / mixed]

Sprint planning for debt:

Allocation (recommended):
- 70% debt / 30% features: full debt focus sprint
- 50/50: balanced sprint
- 20% debt / 80% features: ongoing hygiene (sustainable velocity approach)

Note: the best approach is rarely a big-bang "debt sprint." Sustainable: reserve 20% of every sprint permanently for debt. This prevents accumulation faster than periodic sprints.

For each debt item selected:
Task: [specific change]
Owner: [engineer]
Definition of done: [how do we know it's fixed?]
Test coverage required: [yes — debt fixes without tests create new debt]
Review requirement: [which engineer reviews this change?]

Risk management:
- All debt changes in feature branches
- No debt work in the same PR as feature work (keeps history clean)
- Run full test suite before merging any debt change
- Have a rollback plan for database or infrastructure changes

Retrospective question for after the sprint:
"Did we actually feel faster in the following sprint? Which debt items had the most noticeable impact?"

Sprint plan for my team and selected debt items.
```

## Voorbeeld

**Gebruiker:** Onze Node.js monoliet heeft 4 jaar schuld. Ingenieurs klagen er constant over maar we hebben het nooit systematisch aangepakt. Waar moet ik beginnen?

**Claudes 30-daags plan:**

Begin niet met code. Begin met catalogisering.

**Week 1 — Registreer bouwen:**
Voer een "schuldenonderzoek" uit — vraag elke ingenieur om 20 minuten de 3 dingen op te schrijven die hen het meest vertragen. Gebruik een eenvoudig Google-formulier:
- Wat is het probleem?
- Waar is het? (bestand/module)
- Hoe vaak kom je het tegen?
- Ongeveer reparatietijd?

Aggregeer antwoorden → je krijgt 15-30 items. Veel zullen cluster rond 3-5 basiscauses.

**Week 2 — Categoriseer en score:**
Neem de geclusterde items en score elk item:
- Pijn: hoe vaak treffen ingenieurs dit?
- Risico: wat is het ergste scenario als we het negeren?
- Hefboomwerking: lost dit andere dingen op?

U zult waarschijnlijk vinden: 2-3 items scoren > 8 op alle drie dimensies. Dit zijn je P1's.

**Veelvoorkomende P1-patronen in 4-jarige Node.js monolithen:**
- Callback-hell async code (zou async/await moeten zijn) → veroorzaakt bugs, verwarrt nieuwe ingenieurs
- Geen typeveiligheid (plain JS → TypeScript migratie nodig) → verborgen bugs in productie
- Geen integratietests → elke implementatie voelt riskant
- Circulaire afhankelijkheden tussen modules → kan een service niet extraheren of schalen
- Een enkel 3.000-regelsbestand dat iedereen aanraakt → merge conflicten bij elke sprint

**Maand 2 en verder — duurzame aflossing:**
Voeg bij elke sprint een schuldenkaartje toe ter waarde van ongeveer 20% van de capaciteit. Doe geen grote schuldensprints — ze zijn demoraliserend en zelden voltooid. Duurzame schuldreductie componeert: 20% schuldcapaciteit gedurende 6 maanden = 60% van een sprint pure schuld, maar verspreid over 6 maanden duurzaam werk.

Maandelijks aan het management rapporteren: "We hebben X schulditems gesloten, hier is het meetbare resultaat."

---
