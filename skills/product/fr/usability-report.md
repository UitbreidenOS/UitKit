---
name: usability-report
description: "Rapport de test d'utilisabilité : résumés de sessions, niveaux de sévérité, constats, recommandations priorisées"
---

# Compétence Rapport d'Utilisabilité

## Quand activer
- Vous avez terminé une série de tests d'utilisabilité (modérés ou non modérés) et devez rédiger un compte-rendu des résultats
- Vous disposez de notes de sessions brutes, d'enregistrements ou de journaux d'observation à transformer en rapport structuré
- Les parties prenantes ont besoin d'une liste priorisée de problèmes avant une revue de conception ou une session de planification de sprint
- Vous souhaitez noter et classer les problèmes d'utilisabilité par sévérité avant de décider quoi corriger
- Vous devez produire un livrable partageable sur lequel des non-chercheurs (PM, ingénieurs, dirigeants) peuvent agir

## Quand NE PAS utiliser
- Vous n'avez pas encore conduit de sessions — utilisez la compétence `/ux-researcher` pour planifier le test d'abord
- Vous souhaitez synthétiser des entretiens qualitatifs (pas des tâches d'utilisabilité) — c'est de la synthèse de recherche, pas un rapport d'utilisabilité
- Vous avez besoin d'un audit UX basé sur des heuristiques sans sessions — utilisez `/ux-audit`
- Vous voulez construire des personas à partir des données — utilisez `/persona-builder` après la rédaction du rapport

## Instructions

### Générateur de rapport d'utilisabilité complet

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

### Triage rapide de sévérité (collez des notes brutes, obtenez une liste priorisée)

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

### Calcul et interprétation du score SUS

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

### Plan de présentation aux parties prenantes

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

## Exemple

**Utilisateur :** Nous avons conduit 6 sessions modérées à distance pour tester notre nouveau flux de paiement. La tâche 1 (appliquer un code de réduction) a obtenu 3/6 complétions. La tâche 2 (changer l'adresse de livraison à la caisse) a obtenu 5/6. Principales observations : les utilisateurs cherchent le champ de réduction en bas du panier, mais il se trouve en haut. Deux utilisateurs ont fermé l'onglet en pensant avoir causé une erreur lors du rechargement de la page après saisie du code.

**Résultat :**

```markdown
# Rapport d'Utilisabilité : Flux de Paiement — Juin 2026

## Résumé Exécutif
Nous avons testé le flux de paiement repensé avec 6 participants. Le flux de saisie du code de réduction présente un problème critique de découvrabilité entraînant 50 % d'échec à la tâche, et un rechargement de page après saisie du code provoque des abandons. Le changement d'adresse de livraison est globalement réussi (83 % de complétion) avec une légère friction.

**Les 3 actions prioritaires :**
1. [CRITIQUE] Déplacer le champ de code de réduction en bas du récapitulatif de commande — les utilisateurs parcourent de haut en bas
   et cherchent le champ adjacent au total, pas en haut.
2. [CRITIQUE] Remplacer le rechargement complet de la page après saisie du code de réduction par une mise à jour du prix en ligne (sans rechargement).
3. [MOYEN] Ajouter une confirmation en ligne quand la réduction est appliquée ("15 € économisés" en vert, adjacent au total).

Impression générale : À améliorer avant le lancement.

---

## Résultats Quantitatifs

| Tâche | Taux de complétion | Temps moyen | Taux d'erreur |
|---|---|---|---|
| Appliquer un code de réduction | 3/6 (50 %) | 94 s | 1,8 erreurs/utilisateur |
| Changer l'adresse de livraison | 5/6 (83 %) | 41 s | 0,4 erreurs/utilisateur |

---

## Constat 1 : La position du champ de réduction cause un échec systématique à la tâche
**Sévérité : Critique** | **Fréquence : 6/6 participants ont d'abord cherché au mauvais endroit**

Ce que nous avons observé : Les 6 participants ont fait défiler jusqu'en bas du panier pour trouver le champ de réduction.
Le champ est positionné en haut du panier, au-dessus de la liste des articles — le dernier endroit où les utilisateurs regardent.
3 sur 6 ont abandonné avant de le trouver.

"J'ai juste supposé qu'il n'y avait pas de champ de réduction. J'ai cherché partout en bas." — P4

Pourquoi c'est important : 50 % d'échec à la tâche sur un flux de remboursement de coupon principal = paniers abandonnés,
augmentation des contacts de support et revenus de bons qui ne se convertissent jamais.

Recommandation : Déplacer le champ de saisie du code de réduction en bas du récapitulatif de commande,
immédiatement au-dessus du total de la commande. C'est la position attendue par les utilisateurs (cohérente avec
Amazon, Shopify et la plupart des principaux flux de paiement e-commerce).

Effort : Faible (repositionnement CSS + modification mineure du template)

---

## Constat 2 : Le rechargement de page lors de la saisie du code crée un état d'erreur perçu
**Sévérité : Critique** | **Fréquence : 2/6 participants ont abandonné ; 4/6 ont montré une confusion visible**

Ce que nous avons observé : Après avoir saisi un code de réduction valide, la page effectue un rechargement complet.
Deux participants ont pensé avoir quitté la caisse ou qu'une erreur s'était produite.
Un participant a fermé l'onglet.

"J'ai cru avoir tout perdu. Ce chargement — je ne savais pas si ça avait fonctionné." — P2

Recommandation : Remplacer le rechargement de page complet par une mise à jour du prix AJAX en place.
Afficher une confirmation en ligne : "Code SUMMER20 appliqué — vous avez économisé 15 €" en texte vert.

Effort : Moyen (pattern de mise à jour asynchrone côté client)
```

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous construisons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
