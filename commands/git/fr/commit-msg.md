---
description: Générer un message de commit conforme aux Conventional Commits à partir des modifications en staging
argument-hint: "[scope]"
---
Exécutez `git diff --cached` pour obtenir la diff complète en staging. Si rien n'est en staging, exécutez `git diff HEAD` à la place et notez que les modifications ne sont pas en staging.

Analysez la diff et produisez un message de commit unique suivant Conventional Commits 1.0.0 :

Format :
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

Sortez uniquement le message de commit final — sans préambule, sans blocs de code, sans explication.

Si la diff s'étend sur plusieurs préoccupations non liées (par exemple, fonctionnalité + refactorisation non liée), signalez cela explicitement avant le message et suggérez de scinder le commit.
