> 🇫🇷 This is the French translation. [English version](../code-review.md).

# Workflow de Révision de Code

Comment exécuter une révision de code structurée et automatisée avec Claude Code avant ou en parallèle de la révision humaine.

---

## Quand utiliser ce workflow
- Auto-réviser vos propres changements avant de pousser
- Pré-screening d'une PR avant de demander une révision humaine
- Réviser du code généré par l'IA avant de l'accepter
- Révision d'intégration : comprendre ce qui a changé dans une PR inconnue

---

## Étape 1 — Préparer le contexte

Donnez à Claude tout ce dont il a besoin pour réviser de manière significative.

**Prompt Claude :**
```
I need you to review the following changes.

Project context:
- Stack: [language, framework, key libraries]
- Testing approach: [unit/integration, mocking policy]
- Key conventions: [paste relevant CLAUDE.md sections]

Changed files:
[paste git diff output OR list files and ask Claude to read them]

This PR: [one sentence on what it's supposed to do]
```

---

## Étape 2 — Révision de correction

**Prompt Claude :**
```
Review these changes for correctness only.

Check:
1. Does the code do what the PR description says it does?
2. Are there edge cases not handled? (null inputs, empty collections, concurrent access, large inputs)
3. Are there off-by-one errors, wrong comparisons, or logic inversions?
4. Are error paths handled — can this panic, throw, or silently fail?
5. Are there race conditions if this code runs concurrently?

Format: [FILE:LINE] — [issue description] — [suggested fix]
Only report real issues. Do not nitpick style.
```

---

## Étape 3 — Révision de sécurité

**Prompt Claude :**
```
Review these changes for security issues.

Check:
1. Is any user input used in SQL, shell commands, file paths, or HTML without sanitization?
2. Are there missing authentication or authorization checks?
3. Are secrets, tokens, or credentials exposed in logs, errors, or responses?
4. Are there insecure direct object references (IDOR)?
5. Are there missing rate limits on sensitive endpoints?

Severity: CRITICAL / HIGH / MEDIUM / LOW
Format: [SEVERITY] [FILE:LINE] — [vulnerability] — [fix]
```

---

## Étape 4 — Vérification de la couverture de test

**Prompt Claude :**
```
Review the test coverage for these changes.

Check:
1. Is every new function or method covered by at least one test?
2. Is the happy path tested?
3. Is at least one error/edge case tested?
4. Do the tests actually assert meaningful behavior, or just that the function runs?
5. Are there behaviors changed by this PR that existing tests don't cover?

List: [what is tested] and [what is missing]
```

---

## Étape 5 — Révision de maintenabilité

**Prompt Claude :**
```
Review these changes for maintainability.

Check:
1. Will a developer unfamiliar with this code understand it in 6 months?
2. Are function names and variable names clear and accurate?
3. Is there duplicated logic that should be extracted?
4. Are there magic numbers or strings that should be named constants?
5. Does this introduce unnecessary coupling between modules?

Only flag real maintainability issues — not style preferences.
```

---

## Étape 6 — Consolider les résultats

**Prompt Claude :**
```
Consolidate all findings from the review into a final report.

Format:
## CRITICAL (must fix before merge)
[list]

## HIGH (strongly recommended)
[list]

## SUGGESTED (worth doing)
[list]

## NITPICK (optional)
[list]

## VERDICT
[ ] Approved — no blockers
[ ] Approved with suggestions — merge after addressing CRITICAL
[ ] Changes requested — must address before merge
```

---

## Utiliser l'agent Réviseur de Code

Pour les PRs plus grandes, déléguer à l'agent Réviseur de Code plutôt que de l'exécuter en ligne :

```
Spawn a Code Reviewer agent (Sonnet 4.6) to review [list of files].
Give it the project context from CLAUDE.md and the PR description.
Have it return a structured CRITICAL/SUGGESTED/NITPICK report.
```

Voir `agents/core/code-reviewer.md` pour la définition complète de l'agent.

---
