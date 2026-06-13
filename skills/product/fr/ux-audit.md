---
name: ux-audit
description: "Audit UX basé sur les heuristiques : identifier les problèmes d'utilisabilité, prioriser par impact, recommander des corrections"
---

# Compétence Audit UX

## Quand activer
- Vous évaluez un produit ou une fonctionnalité existant(e) pour détecter des problèmes d'utilisabilité sans conduire de sessions utilisateurs
- Pré-lancement : vous souhaitez une revue experte avant d'investir dans des tests utilisateurs
- Post-lancement : une fonctionnalité sous-performe et vous devez en diagnostiquer la cause sans attendre un cycle de recherche
- Vous avez hérité d'un produit et avez besoin d'une évaluation de référence systématique
- Vous souhaitez produire une liste de corrections priorisées pour un sprint de conception ou d'ingénierie

## Quand NE PAS utiliser
- Vous avez besoin de données utilisateurs réelles — un audit UX est une évaluation experte, pas de la recherche utilisateur ; pour des résultats validés par des utilisateurs, utilisez `/usability-report`
- Vous évaluez un prototype entièrement nouveau sans interface à examiner — rédigez d'abord la spécification
- Vous devez évaluer la qualité du design visuel (marque, esthétique) — l'évaluation heuristique couvre l'utilisabilité fonctionnelle, pas le design de marque
- Vous souhaitez vérifier l'accessibilité spécifiquement — réalisez un audit d'accessibilité WCAG 2.2 dédié (les heuristiques de `/ux-audit` se chevauchent mais ne remplacent pas un audit a11y complet)

## Instructions

### Audit UX heuristique complet (10 Heuristiques de Nielsen)

```
Conduct a UX audit of [product / feature / screen].

## What to audit
Product: [name]
Scope: [specific screens, flows, or the full product — be precise]
Platform: [web / mobile iOS / mobile Android / desktop app / all]
User type being evaluated for: [which persona this audit focuses on]

## Screenshots / recordings / access
[Describe what you can share — screenshots, Figma link, staging URL, video walkthrough, or text description of the interface]

## Audit framework: Nielsen's 10 Usability Heuristics

For each heuristic, score the product: Pass / At Risk / Fail
Then list specific issues found under each.

---

### H1 — Visibility of System Status
The product should always keep users informed about what's going on through appropriate feedback within a reasonable time.

Evaluation criteria:
- Do loading states exist and communicate progress?
- Are success/error states clearly shown after user actions?
- Does the user always know where they are in a multi-step process?
- Are background operations (sync, autosave) surfaced appropriately?

Score: [ Pass / At Risk / Fail ]
Issues found:
- [Issue 1 — specific, observable, with location reference]
- [Issue 2]
Recommendation: [specific fix]

---

### H2 — Match Between System and Real World
The product should speak the user's language — words, phrases, and concepts familiar to them, not system-oriented jargon.

Evaluation criteria:
- Is terminology consistent with how users describe the domain (check sales calls, support tickets, user interviews for actual language users use)?
- Are icons universally understood without a label?
- Do metaphors map to the real-world object or concept they represent?

Score: [ Pass / At Risk / Fail ]
Issues:
- [Issue with exact label or terminology that is wrong]
Recommendation: [specific wording or icon change]

---

### H3 — User Control and Freedom
Users should be able to undo/redo actions and easily exit unwanted states.

Evaluation criteria:
- Is there an undo for destructive actions (delete, archive, overwrite)?
- Can users exit modals and flows without being forced to complete them?
- Are breadcrumbs or back navigation available in multi-step flows?
- Are confirmation dialogs used for irreversible actions?

Score: [ Pass / At Risk / Fail ]
Issues:
- [Issue]
Recommendation: [specific fix]

---

### H4 — Consistency and Standards
Users should not have to wonder whether different words, situations, or actions mean the same thing.

Evaluation criteria:
- Are similar actions labelled and styled consistently throughout the product?
- Does the product follow platform conventions (OS, browser, device)?
- Are CTA labels consistent (e.g. "Save" vs "Update" vs "Confirm" — pick one)?
- Is component use consistent (e.g. dropdown vs radio vs toggle for similar choices)?

Score: [ Pass / At Risk / Fail ]
Issues:
- [List inconsistencies with exact screen locations]
Recommendation: [specific fix or component audit needed]

---

### H5 — Error Prevention
Better than good error messages is a careful design that prevents problems from occurring in the first place.

Evaluation criteria:
- Are dangerous actions protected by confirmation steps or clear warnings?
- Does form validation happen inline (before submit) or only after?
- Are irreversible actions clearly labelled as such before the user commits?
- Are error-prone inputs constrained (e.g. date pickers instead of free text)?

Score: [ Pass / At Risk / Fail ]
Issues:
- [Issue]
Recommendation: [specific fix]

---

### H6 — Recognition Over Recall
Minimise the user's memory load — options, actions, and objects should be visible or easily retrievable.

Evaluation criteria:
- Are the available actions on each screen visible without digging into menus?
- Are recently accessed items, previous search terms, or saved states surfaced?
- Does the interface show context for decision-making (e.g. showing current plan limits when upgrading)?
- Are form fields pre-filled where possible with known user data?

Score: [ Pass / At Risk / Fail ]
Issues:
- [Issue]
Recommendation: [specific fix]

---

### H7 — Flexibility and Efficiency of Use
Accelerators — unseen by novice users — should speed up interaction for expert users.

Evaluation criteria:
- Are keyboard shortcuts available for power users?
- Can bulk actions be performed?
- Are repeat tasks automatable or templatable?
- Is there a search-first navigation path for users who know what they want?

Score: [ Pass / At Risk / Fail ]
Issues:
- [Issue — note: this heuristic is often a nice-to-have; flag severity accordingly]
Recommendation: [specific fix]

---

### H8 — Aesthetic and Minimalist Design
Dialogues should not contain irrelevant or rarely needed information.

Evaluation criteria:
- Is every element on screen necessary for the task at hand?
- Is the primary action clearly more prominent than secondary actions?
- Is there visual noise (decorative elements, redundant text, over-crowded layouts) that competes for attention?

Score: [ Pass / At Risk / Fail ]
Issues:
- [Issue with specific screen location]
Recommendation: [specific de-cluttering or hierarchy fix]

---

### H9 — Help Users Recognise, Diagnose, and Recover from Errors
Error messages should be expressed in plain language, precisely indicate the problem, and constructively suggest a solution.

Evaluation criteria:
- Are error messages written in plain language (not error codes)?
- Do they explain what went wrong AND what to do about it?
- Are error messages visible and proximate to the point of failure (not generic toast at top of page)?
- Are errors caused by system issues distinguished from user errors?

Score: [ Pass / At Risk / Fail ]
Issues:
- [Issue — paste the actual error message if it's bad]
Recommendation: [rewritten error message]

---

### H10 — Help and Documentation
Even though it is better if the system can be used without documentation, help should be available.

Evaluation criteria:
- Is there contextual help available (tooltips, inline hints, empty states with guidance)?
- Is the help documentation searchable?
- Are onboarding flows present for new users?
- Is there a quick-reference path for "how do I do X" questions?

Score: [ Pass / At Risk / Fail ]
Issues:
- [Issue]
Recommendation: [specific fix]

---

## Audit Summary

### Heuristic scorecard
| Heuristic | Score | Issues found |
|---|---|---|
| H1 — System Status | Pass/At Risk/Fail | N issues |
| H2 — Real World Match | Pass/At Risk/Fail | N issues |
| H3 — User Control | Pass/At Risk/Fail | N issues |
| H4 — Consistency | Pass/At Risk/Fail | N issues |
| H5 — Error Prevention | Pass/At Risk/Fail | N issues |
| H6 — Recognition | Pass/At Risk/Fail | N issues |
| H7 — Flexibility | Pass/At Risk/Fail | N issues |
| H8 — Minimalism | Pass/At Risk/Fail | N issues |
| H9 — Error Recovery | Pass/At Risk/Fail | N issues |
| H10 — Help | Pass/At Risk/Fail | N issues |

### Prioritised fix list
| Priority | Issue | Heuristic | Severity | Effort | Recommendation |
|---|---|---|---|---|---|
| P1 | [issue title] | H[N] | Critical | Low | [fix] |
| P2 | [issue title] | H[N] | High | Medium | [fix] |
| P3 | [issue title] | H[N] | Medium | High | [fix] |

Overall UX quality score: [Poor / Needs Work / Acceptable / Good / Excellent]
Rationale: [2-3 sentence summary of the product's main UX strengths and weaknesses]
```

### Audit rapide (flux unique, 5 minutes)

```
Quick UX scan of [specific screen or flow].

I'll paste a description / screenshot. Identify the top 5 usability issues using Nielsen's heuristics.

For each issue:
- Which heuristic it violates
- Severity: Critical / High / Medium / Low
- One-sentence fix

Do not exceed 5 issues — prioritise ruthlessly. This is a quick scan, not a full audit.

Screen / flow description:
[describe the UI or paste screenshot]
```

### Vérification rapide d'accessibilité (analyse WCAG rapide, en complément des heuristiques)

```
Alongside the heuristic audit, run a quick accessibility scan of [product / feature].

Focus areas:
1. Colour contrast: do text/background combinations meet WCAG 2.2 AA (4.5:1 for body, 3:1 for large text)?
2. Target size: are interactive elements at least 24×24px (WCAG 2.2 criterion 2.5.8)?
3. Keyboard navigation: can all interactions be completed without a mouse?
4. Focus indicators: are focused elements visibly highlighted?
5. Form labels: are all form inputs labelled (not just placeholder text)?
6. Error identification: are errors identified in text, not just colour?
7. Alt text: do images have meaningful alt attributes?
8. Heading hierarchy: is heading structure logical (H1 → H2 → H3, no skips)?

For each criterion: Pass / Fail / Cannot assess without code review
If Fail: specific location of the issue and the fix.

Note: this is a fast expert scan, not a full WCAG conformance audit. Use automated tools (Axe, WAVE) and assistive technology testing for full compliance assessment.
```

## Exemple

**Utilisateur :** Auditez le flux d'onboarding d'un outil d'analyse SaaS B2B. Le flux est : formulaire d'inscription → vérification par e-mail → écran de bienvenue avec "inviter votre équipe" → tableau de bord avec état vide → assistant de première connexion de données. Les utilisateurs abandonnent au niveau du tableau de bord avec état vide.

**Résultat (extrait) :**

```markdown
## Audit UX : Flux d'Onboarding — Outil d'Analyse

### H1 — Visibilité de l'état du système : À RISQUE

Problème 1 : Vérification par e-mail — aucune indication d'état après la soumission du formulaire
Le formulaire d'inscription se soumet et l'utilisateur voit un message générique "vérifiez votre e-mail" sans indication
si l'e-mail a été envoyé, à quelle adresse, ou quoi faire s'il n'arrive pas.
Sévérité : Élevée | Emplacement : Écran de confirmation post-inscription
Correction : Afficher l'adresse e-mail exacte à laquelle la vérification a été envoyée. Ajouter "Renvoyer l'e-mail" avec un minuteur de 30 secondes.
Afficher le conseil "Vérifiez votre dossier spam" après 60 secondes sur la page.

---

### H6 — Reconnaissance plutôt que mémorisation : ÉCHEC (cause principale de l'abandon à l'état vide)

Problème : Le tableau de bord à état vide ne fournit aucun indice de reconnaissance pour l'action suivante
Après avoir terminé l'onboarding, les utilisateurs arrivent sur un tableau de bord affichant des graphiques vides sans données.
L'appel à l'action est un petit lien gris en haut à droite : "Connecter une source de données."
Les utilisateurs qui abandonnent ici ne sont pas confus quant au produit — ils ne voient pas d'étape suivante claire.

Preuve : L'écran "inviter votre équipe" (étape 2) est la dernière étape très visible. Après cela,
le produit devient silencieux. Le point d'entrée "connecter les données" n'est pas assez proéminent pour un utilisateur
qui vient de terminer un onboarding et s'attend à être guidé.

Sévérité : Critique | Emplacement : Tableau de bord à état vide
Correction 1 : Ajouter une liste de configuration "Commencer ici" persistante visible jusqu'à la première connexion de données.
Correction 2 : Remplacer les espaces réservés de graphiques vides par des données exemples et un CTA "Remplacer par vos données".
Correction 3 : Déplacer "Connecter une source de données" vers un CTA héros pleine largeur dans l'état vide, pas un lien en haut à droite.

Effort : Moyen

---

### Liste de corrections prioritaires
| P | Problème | Sévérité | Effort |
|---|---|---|---|
| 1 | État vide sans guidage | Critique | Moyen |
| 2 | Vérification e-mail sans adresse affichée | Élevée | Faible |
| 3 | Étape "Inviter l'équipe" avant la valeur produit | Élevée | Faible |
```

---
