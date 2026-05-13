> 🇩🇪 Dies ist die deutsche Übersetzung. [Englische Version](../code-review.md).

# Code-Review-Workflow

So führt man ein strukturiertes, automatisiertes Code-Review mit Claude Code durch — vor oder parallel zum menschlichen Review.

---

## Wann diesen Workflow verwenden
- Eigene Änderungen vor dem Pushen selbst überprüfen
- Einen PR vor dem Anfordern eines menschlichen Reviews vorscreenen
- KI-generierten Code vor der Annahme überprüfen
- Onboarding-Review: verstehen, was sich in einem unbekannten PR geändert hat

---

## Schritt 1 — Kontext vorbereiten

Claude alles geben, was für eine sinnvolle Überprüfung benötigt wird.

**Claude fragen:**
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

## Schritt 2 — Korrektheitsprüfung

**Claude fragen:**
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

## Schritt 3 — Sicherheitsprüfung

**Claude fragen:**
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

## Schritt 4 — Testabdeckungs-Prüfung

**Claude fragen:**
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

## Schritt 5 — Wartbarkeitsprüfung

**Claude fragen:**
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

## Schritt 6 — Befunde konsolidieren

**Claude fragen:**
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

## Den Code Reviewer-Agenten verwenden

Für größere PRs den Code Reviewer-Agenten delegieren, anstatt inline zu prüfen:

```
Spawn a Code Reviewer agent (Sonnet 4.6) to review [list of files].
Give it the project context from CLAUDE.md and the PR description.
Have it return a structured CRITICAL/SUGGESTED/NITPICK report.
```

Die vollständige Agentendefinition in `agents/core/code-reviewer.md` finden.

---

> **Mit uns arbeiten:** Claudient wird von [Uitbreiden](https://uitbreiden.com/) unterstützt — wir bauen KI-Produkte und B2B-Lösungen mit Entwickler-Communities. [uitbreiden.com](https://uitbreiden.com/)
