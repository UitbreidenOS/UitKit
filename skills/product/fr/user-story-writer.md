---
name: user-story-writer
description: "Convertir des idées de fonctionnalités brutes en user stories bien structurées avec critères d'acceptation et cas limites"
---

# Compétence Rédacteur de User Stories

## Quand activer
- Convertir une demande de fonctionnalité brute ou une idée en user story structurée
- Rédiger des critères d'acceptation pour une story déjà dans le backlog
- Identifier les cas limites et états d'erreur que l'ingénierie doit gérer
- Décomposer un epic en stories de taille sprint
- Affiner une demande vague d'une partie prenante en quelque chose qu'un développeur peut construire
- Rédiger la "définition de terminé" pour une fonctionnalité

## Quand NE PAS utiliser
- Rédaction d'une PRD complète — utilisez `/code-to-prd` pour convertir du code existant, ou rédigez-la depuis zéro
- Décisions de roadmap de haut niveau — utilisez `/product-roadmap`
- Découverte avant que la fonctionnalité soit définie — utilisez d'abord `/product-discovery`
- Contrat d'API ou spécification technique — c'est de l'ingénierie, pas du PM

## Instructions

### Prompt principal de rédaction de story

```
Write a user story for this feature idea: [DESCRIBE THE IDEA IN YOUR OWN WORDS]

Context:
- Product: [what product this is for]
- User type: [who the primary user is — role, context, technical level]
- Why this matters: [business or user outcome this enables]
- Related existing features: [what already exists that this connects to]
- Known constraints: [technical, design, legal, or business constraints to respect]

Produce the full user story:

## Story title
[Action-oriented, specific — not "Implement export" but "Export report data to CSV for analysis in Excel"]

## User story
As a [specific user type — not "user" but "enterprise admin" or "data analyst"],
I want to [specific action with enough detail to build],
So that [outcome — what they can now do that they couldn't before].

## Context and motivation
[2-4 sentences: why does this user have this need? What are they trying to accomplish? What breaks today without this?]

## Acceptance criteria
Format: Given [precondition] / When [action] / Then [result]

Write enough AC to fully specify the happy path AND the main error states.
Minimum 5, maximum 12 criteria. If you need more than 12, the story is too big — split it.

Happy path AC:
- Given [...]  / When [...] / Then [...]
- [...]

Error / edge case AC:
- Given [...]  / When [...] / Then [...]
- [...]

## Edge cases and error states
List explicitly (as bullets) the things that could go wrong:
- What if [state X]? Expected behaviour: [Y]
- What if the data is [empty / malformed / too large]? Expected: [Y]
- What happens if the user is [logged out / lacking permission / on mobile]?

## Out of scope (explicit)
What is NOT included in this story that someone might assume is:
- [Exclusion 1]
- [Exclusion 2]

## Definition of done
The story is done when:
- [ ] All acceptance criteria pass
- [ ] Unit tests cover happy path and top 2 error cases
- [ ] Design reviewed and signed off
- [ ] Works on [mobile / desktop / both] at [screen size]
- [ ] Accessibility: [keyboard navigable / screen reader tested / WCAG level]
- [ ] Product reviewed and signed off before merge

## Story size estimate
Complexity: [XS / S / M / L / XL]
Rough story points: [1 / 2 / 3 / 5 / 8 / 13]
Rationale: [why this size — what makes it complex or simple]
```

### Décomposition d'epic

```
Break this epic into sprint-sized user stories.

Epic: [describe the epic — high-level feature or initiative]
Epic goal: [what outcome does this epic achieve when fully done?]
Team sprint velocity: [X story points per sprint]
Target delivery: [date or sprint target]

Epic breakdown rules:
- Each story should be completable in a single sprint (≤ 5 story points ideally)
- Each story should be independently deliverable (can go to prod without the next one)
- Stories should follow the vertical slice pattern — thin end-to-end slices, not horizontal layers
  (don't make "backend API" and "frontend UI" separate stories — that's a technical split, not a user-value split)
- Order stories by value: which story alone delivers the most user value?

For each story in the epic:
1. Story title and user story format
2. 3-5 acceptance criteria (abbreviated — full AC comes when the story is in sprint planning)
3. Story points estimate
4. Dependencies on other stories (if any)
5. Can this story go to production without the next one? (Yes / No — if No, explain)

Produce the story map: [Epic] → [Stories in priority order]
Identify the MVP slice: the minimum set of stories that makes the epic usable.
```

### Générateur de critères d'acceptation

```
Write acceptance criteria for this story: [PASTE EXISTING STORY]

Rules for good AC:
- Written in Given/When/Then format (Gherkin-compatible if using Cucumber)
- Tests one thing at a time — not "user can do X and Y and Z"
- Specific enough that two engineers would implement the same thing
- Covers: happy path, validation errors, empty states, permission edge cases, loading states
- Avoids implementation details: "the button turns green" is bad; "the user sees a success confirmation" is good

AC quality checklist — every AC should pass:
✅ Can a QA engineer write a test from this AC alone? If no, too vague.
✅ Is the expected outcome observable (visible, measurable, testable)? If no, rewrite.
✅ Does this AC capture a user behaviour, not an implementation choice? If no, rephrase.
✅ Could two engineers interpret this differently? If yes, add specificity.

Generate [N] acceptance criteria for my story, covering:
- Happy path (main success scenario)
- Input validation (bad data, missing required fields)
- Edge cases (empty state, maximum limits, concurrent actions)
- Error handling (what happens when the backend fails)
- Permission / auth states (if relevant)
```

### Techniques de découpage de stories

```
This story is too large (estimated [X] points). Help me split it.

Story to split: [PASTE STORY]
Team constraint: stories should be ≤ [3 / 5] story points

Splitting approaches (pick the right one based on the story):

1. BY WORKFLOW STEP:
   If the story covers multiple steps in a flow, split by step.
   Example: "User can complete onboarding" →
   - Story 1: User can enter name and email (step 1)
   - Story 2: User can verify email address (step 2)
   - Story 3: User can select plan (step 3)

2. BY BUSINESS RULE:
   If the story has multiple rules or conditions, split by rule.
   Example: "Admin can filter users by multiple criteria" →
   - Story 1: Filter by status (active / inactive)
   - Story 2: Filter by role
   - Story 3: Filter by signup date range

3. BY HAPPY PATH FIRST:
   Build the happy path, skip error handling and edge cases.
   Example: "Export to CSV with full validation" →
   - Story 1: Export to CSV (happy path only, no validation)
   - Story 2: Add validation — what if no data? Too many rows? Export in progress?

4. BY DATA VARIATION:
   If the story works differently for different data types, split by type.
   Example: "User can upload a document" →
   - Story 1: Upload PDF
   - Story 2: Upload DOCX and XLSX
   - Story 3: Handle oversized files and format errors

5. BY CRUD OPERATIONS:
   Split Create / Read / Update / Delete into separate stories if large.
   Only do this if each operation has independent user value.

Recommend the best split for my story and produce the sub-stories.
```

### Vérificateur de qualité de story

```
Review this user story for quality. [PASTE STORY]

Run this checklist:

STORY FORMAT:
✅ Is there a clear "As a [user], I want [action], so that [outcome]" format?
✅ Is the user type specific (not just "user" or "admin")?
✅ Is the "so that" an outcome (not a feature)?

ACCEPTANCE CRITERIA:
✅ Are there at least 4 AC?
✅ Does each AC use Given/When/Then or an equivalent structured format?
✅ Are the AC testable and specific enough to write an automated test?
✅ Does at least one AC cover an error or edge case?
✅ Any AC that references UI implementation details that should be removed?

SIZE:
✅ Is the story ≤ 5 story points (2-3 days of work)?
✅ If > 5 points, is there a clear reason why it can't be split?

DEFINITION OF DONE:
✅ Is there an explicit definition of done?
✅ Does it include: tests, design review, accessibility, product sign-off?

INDEPENDENCE:
✅ Can this story be built and deployed without waiting for another story?
✅ If not, is the dependency explicitly called out?

OUT OF SCOPE:
✅ Is there an explicit "out of scope" or "not included" section?

Grade the story: [Ready for sprint / Needs refinement / Needs significant rework]
List the top 3 changes to make it sprint-ready.
```

## Exemple

**Utilisateur :** Nous avons besoin d'un moyen pour les utilisateurs d'exporter leurs données. C'est beaucoup demandé. Nos utilisateurs sont principalement des analystes de données qui veulent exploiter les chiffres dans Excel.

**Résultat :**

```markdown
# Story : Exporter les données du tableau de bord en CSV pour une analyse hors ligne

## User story
En tant qu'**analyste de données** qui utilise le tableau de bord pour suivre les performances des campagnes,
Je veux **exporter les données de la vue actuelle dans un fichier CSV**,
Afin de **pouvoir les charger dans Excel ou Google Sheets pour des analyses personnalisées et des rapports destinés aux parties prenantes**.

## Contexte et motivation
Les analystes de données doivent régulièrement partager des données de performance avec des parties prenantes n'ayant pas accès au tableau de bord, ou effectuer des analyses nécessitant des formules et des calculs personnalisés que le tableau de bord ne prend pas en charge. Aujourd'hui, ils font des captures d'écran de tableaux ou copient manuellement les données dans des feuilles de calcul — c'est source d'erreurs et chronophage pour les grands ensembles de données.

## Critères d'acceptation

**Chemin nominal :**
- Étant donné que je visualise un tableau de données sur le tableau de bord / Quand je clique sur "Exporter en CSV" / Alors un fichier CSV se télécharge sur mon ordinateur en moins de 3 secondes
- Étant donné le CSV exporté / Quand je l'ouvre dans Excel ou Google Sheets / Alors tous les noms de colonnes correspondent aux en-têtes du tableau, et toutes les lignes visibles sont présentes avec des types de données corrects (nombres en tant que nombres, dates en tant que dates, pas en tant que chaînes)
- Étant donné que des filtres sont appliqués au tableau / Quand j'exporte / Alors seules les lignes filtrées (visibles) sont exportées, pas l'ensemble du jeu de données
- Étant donné que le tableau a un tri de colonnes appliqué / Quand j'exporte / Alors le CSV conserve l'ordre de tri affiché dans l'interface

**Validation et cas limites :**
- Étant donné que le tableau est vide (aucune donnée ne correspond aux filtres actuels) / Quand je clique sur Exporter / Alors je vois un message : "Aucune donnée à exporter — essayez d'ajuster vos filtres" et aucun fichier ne se télécharge
- Étant donné que le tableau contient plus de 50 000 lignes / Quand je clique sur Exporter / Alors je vois un avertissement : "Cet export contient 50 000+ lignes et peut prendre jusqu'à 30 secondes. Continuer ?" avec des options Annuler et Exporter
- Étant donné que je clique sur Exporter sur un tableau avec 50 000+ lignes et que je confirme / Quand l'export est en cours de traitement / Alors je vois un indicateur de progression et peux continuer à utiliser le tableau de bord pendant la préparation
- Étant donné que l'export échoue en raison d'une erreur serveur / Alors je vois : "Export échoué — veuillez réessayer ou contacter le support si cela persiste" et peux réessayer sans actualiser la page

**Permissions :**
- Étant donné que je suis sur un plan Gratuit / Quand j'essaie d'exporter / Alors je vois une invite de mise à niveau : "L'export CSV est disponible sur Pro et supérieur" avec un lien pour mettre à niveau

## Hors scope
- Export au format Excel (.xlsx) — CSV uniquement dans cette story
- Exports planifiés ou automatisés — manuel uniquement
- Export de graphiques ou visualisations — tableaux de données uniquement
- Sélection de colonnes spécifiques à exporter — toutes les colonnes visibles sont exportées

## Définition de terminé
- [ ] Les 8 critères d'acceptation sont validés
- [ ] Les tests unitaires couvrent le chemin nominal et le cas limite "état vide"
- [ ] Le test E2E couvre le flux de téléchargement dans Chrome et Firefox
- [ ] Design revu — emplacement du bouton d'export approuvé
- [ ] Fonctionne sur desktop (1280 px+) — mobile non requis pour cette story
- [ ] Produit validé avant la fusion

## Taille de la story : Moyenne — 3 points
Justification : La logique d'export principale est simple ; la gestion des 50 000+ lignes ajoute un pattern asynchrone significatif que les ingénieurs devront concevoir avec soin.
```

---
