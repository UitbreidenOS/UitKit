---
name: tech-debt-tracker
description: "Technical debt management: catalogue, categorise, and prioritise tech debt — build a debt register, quantify impact, present to leadership, and create a paydown strategy"
---

# Compétence Tech Debt Tracker

## Quand l'activer
- Créer un registre de dette technique pour la première fois
- Prioriser quelle dette payer en premier
- Justifier l'investissement dans la dette technique auprès du leadership
- Catégoriser la dette découverte lors d'un sprint ou d'une revue de codebase
- Planifier un sprint de refactorisation ou un trimestre de paydown de dette
- Documenter le « pourquoi » derrière les décisions techniques pour que les futurs ingénieurs comprennent

## Quand NE PAS l'utiliser
- Correction active de bugs — c'est la compétence debug
- Profilage de performance — utilisez la compétence performance-profiler
- Vulnérabilités de sécurité immédiate — corrigez-les maintenant, n'ajoutez pas au registre
- Décisions de conception architecturale — utilisez un ADR (Architecture Decision Record) à la place

## Instructions

### Registre de dette technique

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

### Priorisation de la dette

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

### Présentation au leadership

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

### Sprint de paydown de dette

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

## Exemple

**Utilisateur:** Notre monolithe Node.js a 4 ans de dette. Les ingénieurs s'en plaignent constamment mais nous ne l'avons jamais abordée systématiquement. Par où commencer?

**Plan de 30 jours de Claude:**

Ne commencez pas par le code. Commencez par le catalogage.

**Semaine 1 — Créer le registre:**
Lancez une « enquête de dette » — demandez à chaque ingénieur de passer 20 minutes à noter les 3 choses qui les ralentissent le plus. Utilisez un simple formulaire Google:
- Quel est le problème?
- Où est-il? (fichier/module)
- À quelle fréquence le rencontrez-vous?
- Temps approximatif de correction?

Agréger les réponses → vous obtiendrez 15-30 éléments. Beaucoup se regrouperont autour de 3-5 causes profondes.

**Semaine 2 — Catégoriser et évaluer:**
Prenez les éléments regroupés et évaluez chacun:
- Douleur: à quelle fréquence les ingénieurs le rencontrent-ils?
- Risque: quel est le pire cas si nous l'ignorons?
- Effet de levier: corriger ceci déverrouille-t-il d'autres choses?

Vous trouverez probablement: 2-3 éléments marquent > 8 sur les trois dimensions. Ce sont vos P1s.

**Motifs P1 courants dans les monolithes Node.js de 4 ans:**
- Code async en callback-hell (devrait être async/await) → cause des bugs, confond les nouveaux ingénieurs
- Aucune sécurité de type (JS simple → migration TypeScript nécessaire) → bugs cachés en prod
- Aucun test d'intégration → chaque déploiement se sent risqué
- Dépendances circulaires entre modules → ne peut pas extraire ou mettre à l'échelle un service
- Un fichier unique de 3 000 lignes que tout le monde touche → conflits de fusion à chaque sprint

**Mois 2 et après — paydown durable:**
Ajoutez un ticket de dette à chaque sprint valant environ 20% de la capacité. Ne faites pas de grands spints de dette — ils sont démoralisants et rarement complets. La réduction de dette en régime permanent composé: 20% de capacité de dette pendant 6 mois = 60% d'un sprint de pure dette, mais étalé sur 6 mois de travail durable.

Signalez au leadership mensuellement: « Nous avons fermé X éléments de dette, voici le résultat mesurable. »

---
