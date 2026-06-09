---
description: Generiere eine Conventional Commits-konforme Commit-Nachricht aus Staged Changes
argument-hint: "[scope]"
---
Führe `git diff --cached` aus, um den vollständigen Staged Diff zu erhalten. Falls nichts Staged ist, führe stattdessen `git diff HEAD` aus und vermerke, dass die Änderungen unstaged sind.

Analysiere den Diff und produziere eine einzelne Commit-Nachricht nach Conventional Commits 1.0.0:

Format:
```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

Regeln:
- Type muss einer der folgenden sein: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
- Subject: Imperativ-Modus, Kleinbuchstaben, kein Punkt, ≤72 Zeichen
- Body: Umbruch bei 72 Zeichen, erkläre *warum* nicht *was*, einschließlich Begründung bei Breaking Changes
- Footer: Referenziere Probleme als `Fixes #N` oder `Closes #N`; markiere Breaking Changes als `BREAKING CHANGE: <description>`
- Scope: verwende $ARGUMENTS falls bereitgestellt, ansonsten leite es von den geänderten Dateipfaden oder Modulnamen ab

Gib nur die finale Commit-Nachricht aus — kein Vorwort, keine Code-Zäune, keine Erklärung.

Falls der Diff mehrere unabhängige Belange umfasst (z. B. Feature + unabhängiger Refactor), kennzeichne dies explizit vor der Nachricht und schlage vor, den Commit aufzuteilen.
