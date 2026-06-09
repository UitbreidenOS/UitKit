---
description: Genereer een Conventional Commits-compatibel commit-bericht op basis van gestaged wijzigingen
argument-hint: "[scope]"
---
Voer `git diff --cached` uit om het volledige gestaged diff te krijgen. Als niets gestaged is, voer in plaats daarvan `git diff HEAD` uit en merk op dat wijzigingen niet gestaged zijn.

Analyseer het diff en maak een enkel commit-bericht volgens Conventional Commits 1.0.0:

Format:
```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

Rules:
- Type must be one of: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
- Subject: imperative mood, lowercase, no period, ≤72 chars
- Body: wrap at 72 chars, explain *why* not *what*, include breaking change rationale if applicable
- Footer: reference issues as `Fixes #N` or `Closes #N`; mark breaking changes as `BREAKING CHANGE: <description>`
- Scope: use $ARGUMENTS if provided, otherwise infer from the changed file paths or module names

Voer alleen het uiteindelijke commit-bericht uit — geen inleiding, geen code fences, geen uitleg.

Als het diff meerdere niet-gerelateerde problemen omvat (bijv. feature + niet-gerelateerde refactor), markeer dit expliciet vóór het bericht en stel voor de commit op te splitsen.
