---
description: Genereer een Conventional Commits-compatibel commit-bericht op basis van gestaged wijzigingen
argument-hint: "[scope]"
---
Voer `git diff --cached` uit om het volledige gestaged diff te krijgen. Als niets gestaged is, voer in plaats daarvan `git diff HEAD` uit en merk op dat wijzigingen niet gestaged zijn.

Analyseer het diff en maak een enkel commit-bericht volgens Conventional Commits 1.0.0:

Format:
```
<type>(<scope>): <subject>

[optioneel body]

[optioneel footer(s)]
```

Regels:
- Type moet een van de volgende zijn: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
- Subject: imperatieve vorm, kleine letters, geen punt, ≤72 tekens
- Body: terugloop bij 72 tekens, leg uit *waarom* niet *wat*, inclusief rationale voor breaking changes indien van toepassing
- Footer: referentieer problemen als `Fixes #N` of `Closes #N`; markeer breaking changes als `BREAKING CHANGE: <description>`
- Scope: gebruik $ARGUMENTS als deze is opgegeven, anders afleiden uit de gewijzigde bestandspaden of modulenamen

Voer alleen het uiteindelijke commit-bericht uit — geen inleiding, geen code blokken, geen uitleg.

Als het diff meerdere niet-gerelateerde zaken omvat (bijvoorbeeld feature + niet-gerelateerde refactor), markeer dit expliciet vóór het bericht en stel voor om de commit op te splitsen.
