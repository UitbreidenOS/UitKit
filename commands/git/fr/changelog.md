---
description: Générer une entrée de changelog pour les commits depuis le dernier tag ou une référence donnée
argument-hint: "[from-ref]"
---
Déterminez la plage :
- Si $ARGUMENTS est fourni, utilisez `git log $ARGUMENTS...HEAD`
- Sinon, exécutez `git describe --tags --abbrev=0` pour trouver le dernier tag, puis utilisez `git log <last-tag>...HEAD`
- Si aucun tag n'existe, utilisez l'historique complet : `git log HEAD`

Exécutez également `git log <range> --oneline` et `git diff <range> --stat` pour la structure.

Produisez une entrée de changelog au format Keep a Changelog (https://keepachangelog.com) :

```markdown
## [Unreleased] — <today's date YYYY-MM-DD>

### Added
- <new features and capabilities>

### Changed
- <modifications to existing behavior>

### Deprecated
- <features flagged for future removal>

### Removed
- <deleted features or APIs>

### Fixed
- <bug fixes>

### Security
- <vulnerability patches>
```

Règles :
- Omettez les sections qui n'ont aucune entrée
- Chaque entrée est une ligne, écrite pour un utilisateur final ou un consommateur d'API — pas pour le développement interne
- Regroupez les commits connexes en une seule entrée ; ne listez pas chaque commit individuellement
- Référencez les PR ou les problèmes entre parenthèses quand les messages de commit les mentionnent : `(#123)`
- Les entrées commencent par une lettre majuscule, pas de point final
- Ignorez les commits de chore/style/refactor sauf s'ils affectent le comportement public

Sortez uniquement le bloc markdown.
