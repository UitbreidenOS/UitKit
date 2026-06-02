---
name: tech-interview-kit
description: "Kit d'entretien technique : conception d'exercices de codage, questions de conception système, grille d'évaluation, modèle de débriefing"
---

# Compétence Kit d'Entretien Technique

## Quand activer
- Conception d'un exercice de codage pour un poste d'ingénieur logiciel
- Rédaction de questions d'entretien de conception système pour des recrutements senior/staff
- Construction d'une grille de notation pour que les intervieweurs évaluent de façon cohérente
- Création d'un modèle de débriefing à utiliser après le panel d'entretien
- Calibrage de ce à quoi ressemble le « niveau requis » pour un niveau donné (junior, intermédiaire, senior, staff)
- Révision d'un processus d'entretien existant qui ne filtre pas bien

## Quand NE PAS utiliser
- Entretiens comportementaux ou culturels — ils nécessitent l'intervention des RH et ne sont pas purement techniques
- Évaluation de la soumission d'un candidat spécifique — utilisez la grille de cette compétence, mais l'évaluation elle-même relève du jugement humain
- Postes non techniques — mauvais outil
- Présélection massive de centaines de candidats — utilisez une plateforme (HackerRank, Codility) pour les tests à domicile à grande échelle

## Instructions

### Générateur d'exercice de codage

```
Design a coding challenge for a [LEVEL] [ROLE] position.

Role: [e.g., Backend Engineer, Frontend Engineer, Full-stack, Data Engineer, ML Engineer]
Level: [Junior (0-2 yrs) / Mid (2-5 yrs) / Senior (5-8 yrs) / Staff (8+ yrs)]
Format: [live coding (45 min) / take-home (2-3 hours) / pair programming (60 min)]
Tech stack: [languages and frameworks acceptable for the role]
What we care most about: [e.g., correctness, test coverage, code clarity, performance, system design thinking]

Design a challenge that:
1. Is realistic — mirrors actual work we do, not LeetCode tree traversals
2. Has clear success criteria — interviewers shouldn't debate whether it passed
3. Scales in difficulty — has extension tasks for candidates who finish early
4. Can be explained in < 5 minutes — ambiguity is an obstacle, not a feature
5. Is completable in the format window — scope tightly

Output:

## Challenge Brief
Title: [something descriptive, not "coding test"]
Time allocation: [X minutes]
Acceptable languages: [list]
Setup: [what the candidate needs before starting]
What you're testing: [explicit list — not hidden]

## Problem Statement
[Clear problem description — what it does, what it must handle, explicit constraints]

## Input / Output specification
[Sample inputs and expected outputs — at least 3 examples]

## Acceptance criteria (must pass to pass the challenge)
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

## Extension tasks (for candidates who finish early)
Level 1 extension: [easier — add edge case handling]
Level 2 extension: [harder — optimise or add a feature]
Level 3 extension: [stretch — system-level thinking]

## Interviewer notes
What good solutions look like:
What average solutions look like:
Common mistakes to watch for:
What NOT to fail a candidate on (irrelevant to the role):
```

### Question d'entretien de conception système

```
Write a system design interview prompt for a [LEVEL] engineering role.

Level: [Senior / Staff / Principal]
Focus area: [distributed systems / data pipelines / API design / real-time systems / storage / etc.]
Interview duration: [45 / 60 minutes]
What signals we're looking for: [scalability thinking / trade-off analysis / clarity of communication / breadth vs. depth]

Design a system design prompt that:
1. Is open-ended enough to reveal how the candidate structures ambiguous problems
2. Has a realistic scale requirement they must design for
3. Allows 20 minutes of clarifying questions + 30 minutes of design
4. Has natural layers — a naive design, then optimisations, then edge cases

Output:

## Prompt (read to candidate)
[2-3 sentence problem statement — deliberate in what's vague and what's specific]

## Constraints to reveal on request
- Scale: [X users / Y requests per second / Z data per day]
- Latency requirement: [< X ms p99]
- Availability requirement: [X 9s]
- Consistency model: [eventual / strong]

## Interviewer guide: what to probe
After candidate's initial design:
- "What happens when [component] fails?"
- "How does this scale to 10x the current load?"
- "What are the trade-offs between approach A and approach B?"
- "What would you monitor in production?"
- "If you had to cut scope, what goes first?"

## Strong signal behaviours (hire)
- Clarifies requirements before designing
- States assumptions explicitly
- Identifies the hard part and focuses there
- Discusses trade-offs without prompting
- Knows when to stop and move on

## Weak signal behaviours (no hire)
- Jumps to a specific technology without understanding the problem
- Can't explain why they made a design choice
- Doesn't consider failure modes
- Gets stuck on irrelevant implementation details

## Example strong answer outline
[What a good answer covers, in order — not a model answer, but a framework for evaluating]
```

### Grille d'évaluation des entretiens

```
Build a scoring rubric for evaluating [ROLE] candidates at [LEVEL].

Interview format: [describe — coding challenge + system design + behavioural, or subset]
What matters most for success in this role: [top 3 attributes]

Produce a rubric with:

## Dimensions and weights
(weights must total 100)

Technical competence: [X]%
- Correctness: does the solution solve the problem?
- Code quality: is it readable, well-structured, appropriately commented?
- Testing: does the candidate test their code? How?
- Performance awareness: do they think about complexity and efficiency?

Problem-solving approach: [X]%
- Requirement clarification: do they ask the right questions before coding?
- Decomposition: do they break the problem down logically?
- Trade-off analysis: can they articulate why they chose one approach over another?
- Adaptability: how do they handle hints, pivots, or new constraints?

Communication: [X]%
- Clarity: can they explain their thinking as they work?
- Collaboration: do they treat the interviewer as a collaborator or an obstacle?
- Receives feedback: how do they respond to suggestions?

Domain knowledge: [X]%
[Adjust per role — e.g., CS fundamentals for backend, browser APIs for frontend, SQL for data]

## Scoring scale (each dimension)
5 - Exceptional: exceeds expectations for this level clearly and consistently
4 - Strong: meets expectations, demonstrates independent thinking
3 - Meets bar: passes at this level, some gaps but manageable
2 - Below bar: significant gaps, would need 6+ months to reach level
1 - No hire: fundamental gaps that experience won't easily fix

## Calibration guide
| Score | Decision |
|---|---|
| 4.0-5.0 weighted | Strong hire |
| 3.5-3.9 | Hire |
| 3.0-3.4 | Borderline — discuss in debrief |
| < 3.0 | No hire |

## Knockout criteria (auto no-hire regardless of other scores)
- [e.g., Cannot write working code in any language]
- [e.g., Plagiarises take-home submission]
- [e.g., Communication problems that can't be coached]
```

### Modèle de débriefing post-entretien

```
Write a debrief template for the [ROLE] interview panel.

Panel members: [list interviewer roles — e.g., Hiring Manager, Senior Eng, Staff Eng, EM]
Interview stages covered: [e.g., coding, system design, technical depth, team interview]

Debrief format (60 minutes max, must result in a hire/no-hire decision):

## Pre-debrief rule
Every interviewer submits their score BEFORE the debrief meeting.
Reason: anchoring bias — the first person to speak shapes everyone else's opinion.

## Agenda
0:00 — Ground rules (2 min)
  - Scores are in, no changing scores based on others before discussion
  - Focus on evidence, not impressions
  - No "culture fit" as a standalone reason — be specific

0:02 — Round-robin scores (10 min)
  Each interviewer: their score per dimension, top 3 observations, any concerns
  No discussion yet — just data collection

0:12 — Areas of alignment (5 min)
  Where did panellists agree? What does consensus tell us?

0:17 — Areas of disagreement (15 min)
  Where did scores diverge by > 1 point? 
  Each interviewer explains their evidence.
  Goal: resolve through evidence, not seniority

0:32 — Concerns and blockers (10 min)
  Any single-panel-member concern that's a blocker?
  Hard no-hires must be supported by specific evidence.

0:42 — Decision (5 min)
  Use the weighted rubric.
  If borderline (3.0-3.4): hiring manager makes the call after hearing concerns.
  Decision: Strong Hire / Hire / No Hire + specific feedback reason

0:47 — Candidate feedback preparation (10 min)
  For no-hire: prepare 1-2 specific, constructive pieces of feedback to share
  For hire: confirm offer level and any conditions

0:57 — Next steps
  Hiring manager: timeline to offer or rejection call

## Debrief ground rules (post in calendar invite)
1. Don't discuss the candidate with other interviewers before submitting your score
2. "I didn't like them" is not evidence — describe specific behaviours
3. Disagree with the hiring manager if you have evidence — that's why there's a panel
4. If you couldn't evaluate a dimension fairly (poor question, interview went off-track) — say so
```

### Guide de calibrage des niveaux

```
Define what "good" looks like at each engineering level for [TECH STACK / DOMAIN].

Use this to calibrate interviewers and set the bar before the hiring process starts.

## Junior Engineer (0-2 years)
Expects:
- Can write correct code with guidance
- Understands basic data structures and algorithms
- Asks for help when stuck — doesn't spin for hours silently
- Receptive to code review feedback
Does NOT expect:
- Architectural thinking
- Production system experience
- Leading complex projects

## Mid-level Engineer (2-5 years)
Expects:
- Solves well-defined problems independently
- Writes production-quality code with minimal supervision
- Identifies edge cases without being prompted
- Can scope and estimate tasks reliably
Does NOT expect:
- Cross-team influence
- System design at scale
- Mentoring others yet

## Senior Engineer (5-8 years)
Expects:
- Designs systems with appropriate trade-offs
- Anticipates failure modes and builds for them
- Improves team practices, not just their own code
- Can lead a multi-sprint project from scoping to delivery
Does NOT expect:
- Org-level influence
- Management responsibility (unless EM track)
- Setting multi-year technical direction

## Staff Engineer (8+ years)
Expects:
- Sets technical direction across multiple teams
- Makes build/buy/partner decisions with business context
- Communicates trade-offs clearly to non-technical stakeholders
- Identifies the highest-leverage technical investment for the company
Does NOT expect:
- Deep IC-level coding on every PR
- Hands-on management

Output: calibration document for [ROLE] specific to our stack and business domain.
```

## Exemple

**Utilisateur :** Conçois un exercice de codage à domicile pour un ingénieur backend senior. Nous utilisons Python et PostgreSQL. Nous accordons de l'importance à la conception d'API, aux décisions de schéma de base de données et à la couverture de tests.

**Résultat :**

```
## Challenge Brief
Title: Order Management Service — REST API Design
Time allocation: 2-3 hours (hard cap — scope designed for that window)
Acceptable languages: Python (preferred), TypeScript
Setup: Docker Compose file provided — Postgres 15 available on port 5432

What you're testing:
- REST API design judgment (naming, HTTP verbs, status codes)
- Database schema design (normalisation, indexing, constraint decisions)
- Test coverage strategy (what to test, not 100% coverage for its own sake)
- Production-readiness thinking (validation, error handling, edge cases)

## Problem Statement
Build a minimal order management API for an e-commerce platform.

The system must allow:
1. Create a product (name, price, inventory quantity)
2. Create a customer order (customer ID, list of products with quantities)
3. Get an order by ID (with calculated total)
4. List orders for a customer
5. Cancel an order (if not yet fulfilled)

Business rules:
- An order cannot be placed if any product is out of stock
- Cancelling an order must restore inventory
- Products can have their price updated — orders must reflect the price at time of order, not current price

## Acceptance Criteria
- [ ] All 5 endpoints work as specified
- [ ] Business rules enforced (stock check, historical pricing, cancel logic)
- [ ] At least 8 meaningful tests (not just "does the endpoint return 200")
- [ ] Schema migration file or SQL DDL included
- [ ] README explains setup in under 3 steps

## Extension Tasks
Level 1: Add pagination to the list orders endpoint
Level 2: Add a "fulfil order" endpoint that locks inventory (discuss race conditions)
Level 3: Sketch (in writing, no code required) how you'd add real-time inventory webhooks

## Interviewer Notes
Strong solutions: define historical price in the schema (snapshot at order time), use transactions for stock changes, test the race condition case even without solving it fully.
Average solutions: correct functionality, minimal tests, price stored as product reference (fails historical pricing requirement — good discussion point).
Don't fail: specific ORM choice, exact folder structure, documentation style.
```

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous construisons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
