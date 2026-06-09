---
description: Rédiger des notes de version à partir des commits entre deux références ou depuis le dernier tag
argument-hint: "[from-ref] [to-ref]"
---
Analyser $ARGUMENTS comme jusqu'à deux références git séparées par un espace : `from-ref` et `to-ref`. Si deux références sont données, les utiliser directement. Si une seule référence est donnée, la traiter comme `from-ref` et utiliser `HEAD` comme `to-ref`. Si aucun argument n'est donné, détecter le tag précédent avec `git describe --tags --abbrev=0` comme `from-ref` et `HEAD` comme `to-ref`.

Exécuter :
```
git log <from-ref>..<to-ref> --pretty=format:"%H %s" --no-merges
```

Collecter également les références PR/issue en analysant les sujets pour `#\d+` et les lignes de pied de page (`Closes`, `Fixes`, `Refs`).

Classer chaque commit selon son préfixe Conventional Commits :
- `feat` → Features
- `fix` → Bug Fixes
- `perf` → Performance
- `refactor` → Internal Changes (omettre des notes de version externes sauf si significatif)
- `docs` → Documentation
- `build` / `ci` → Infrastructure (omettre des notes de version externes)
- `BREAKING CHANGE` footer ou suffixe `!` → Breaking Changes (toujours en premier, toujours en évidence)
- Non classifiés → Other Changes

Rédiger les notes de version dans cette structure :

```markdown
## [version] — YYYY-MM-DD

### Breaking Changes
- ...

### Features
- ...

### Bug Fixes
- ...

### Performance
- ...

### Documentation
- ...
```

Règles :
- Réécrire les sujets de commit en langage accessible aux utilisateurs : impératif, temps présent, pas de jargon interne
- Grouper les commits connexes en une seule puce lorsqu'ils traitent de la même fonctionnalité ou correction
- Ajouter les références `(#N)` PR/issue à la fin de chaque puce si disponibles
- Omettre les commits `build`, `ci` et purs `chore` sauf s'ils affectent l'interface publique
- Si `to-ref` est HEAD et pas encore tagué, utiliser `[Unreleased]` comme version placeholder

Produire uniquement le brouillon. Ne pas écrire dans aucun fichier ni créer de tag.
