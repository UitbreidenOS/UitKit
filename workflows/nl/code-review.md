> 🇳🇱 Dit is de Nederlandse vertaling. [Engelse versie](../code-review.md).

# Code Review Workflow

Hoe je een gestructureerde, geautomatiseerde code-review uitvoert met Claude Code voor of naast menselijke review.

---

## Wanneer deze workflow te gebruiken
- Je eigen wijzigingen zelfreviewen voor pushen
- Een PR pre-screenen voor het aanvragen van menselijke review
- AI-gegenereerde code beoordelen voor acceptatie
- Onboarding-review: begrijpen wat er is gewijzigd in een onbekende PR

---

## Stap 1 — Bereid context voor

Geef Claude alles wat het nodig heeft om zinvol te beoordelen.

**Vraag Claude:**
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

## Stap 2 — Correctheidsreview

**Vraag Claude:**
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

## Stap 3 — Beveiligingsreview

**Vraag Claude:**
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

## Stap 4 — Testdekking controleren

**Vraag Claude:**
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

## Stap 5 — Onderhoudbaarheidsreview

**Vraag Claude:**
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

## Stap 6 — Consolideer bevindingen

**Vraag Claude:**
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

## De Code Reviewer agent gebruiken

Voor grotere PR's, delegeer naar de Code Reviewer agent in plaats van inline te draaien:

```
Spawn a Code Reviewer agent (Sonnet 4.6) to review [list of files].
Give it the project context from CLAUDE.md and the PR description.
Have it return a structured CRITICAL/SUGGESTED/NITPICK report.
```

Zie `agents/core/code-reviewer.md` voor de volledige agentdefinitie.

---
