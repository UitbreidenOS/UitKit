---
description: Generiere eine Conventional Commits-konforme Commit-Nachricht aus gestaged Änderungen
argument-hint: "[scope]"
---
Führe `git diff --cached` aus, um die vollständige gestaged Diff zu erhalten. Falls nichts gestaged ist, führe stattdessen `git diff HEAD` aus und notiere, dass die Änderungen nicht gestaged sind.

Analysiere die Diff und erstelle eine einzelne Commit-Nachricht nach Conventional Commits 1.0.0:

Format:
```
<type>(<scope>): <subject>

[optionaler Body]

[optionale Footer]
```

Regeln:
- Type muss einer der folgenden Werte sein: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
- Subject: Imperativmodus, Kleinbuchstaben, kein Punkt, ≤72 Zeichen
- Body: Umbrechen bei 72 Zeichen, erkläre das *Warum* nicht das *Was*, beziehe die Rationale für breaking changes ein, falls zutreffend
- Footer: Referenziere Issues als `Fixes #N` oder `Closes #N`; kennzeichne breaking changes als `BREAKING CHANGE: <description>`
- Scope: verwende $ARGUMENTS, wenn bereitgestellt, ansonsten leite es aus den geänderten Dateipfaden oder Modulnamen ab

Gebe nur die endgültige Commit-Nachricht aus — kein Vorspann, keine Code-Blöcke, keine Erklärung.

Falls die Diff mehrere unabhängige Anliegen umfasst (z. B. Feature + unabhängiger Refactor), kennzeichne dies explizit vor der Nachricht und empfehle, den Commit aufzuteilen.
