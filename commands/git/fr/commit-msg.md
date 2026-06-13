---
description: Générer un message de commit conforme à Conventional Commits à partir des changements indexés
argument-hint: "[scope]"
---
Exécutez `git diff --cached` pour obtenir le diff complet indexé. Si rien n'est indexé, exécutez `git diff HEAD` à la place et notez que les changements ne sont pas indexés.

Analysez le diff et produisez un seul message de commit en suivant Conventional Commits 1.0.0 :

Format :
```
<type>(<scope>): <subject>

[corps optionnel]

[pied(s) optionnel(s)]
```

Règles :
- Type doit être parmi : feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
- Subject : mode impératif, minuscules, pas de point, ≤72 caractères
- Corps : retour à la ligne à 72 caractères, expliquez le *pourquoi* pas le *quoi*, incluez la rationale des changements non-rétrocompatibles si applicable
- Pied : référencez les issues comme `Fixes #N` ou `Closes #N` ; marquez les changements non-rétrocompatibles comme `BREAKING CHANGE: <description>`
- Scope : utilisez $ARGUMENTS s'il est fourni, sinon déduisez à partir des chemins de fichier modifiés ou des noms de module

Produisez uniquement le message de commit final — pas de préambule, pas de délimiteurs de code, pas d'explication.

Si le diff couvre plusieurs préoccupations non liées (par exemple, une fonctionnalité + refactorisation non liée), signalez-le explicitement avant le message et suggérez de fractionner le commit.
