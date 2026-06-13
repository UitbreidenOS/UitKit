---
name: commit-writer
description: "Write conventional commit messages from staged diff — type, scope, subject, body, breaking changes"
---

> 🇫🇷 Version française. [English version](../commit-writer.md).

# Compétence : Rédaction de Messages de Commit

## Quand activer
- Vous avez des modifications indexées et avez besoin d'un message de commit bien structuré
- Rédaction de messages de commit dans une équipe utilisant les Conventional Commits
- Génération de messages de commit qui alimenteront des changelogs automatisés
- Vous souhaitez que Claude analyse le diff et propose le bon type de commit

## Quand NE PAS utiliser
- Commits en cours de travail / brouillons — utilisez `git commit -m "wip"` et faites un squash ensuite
- Commits de merge — laissez git les générer
- Commits de revert — `git revert` génère le message automatiquement

## Instructions

### Format des Conventional Commits
```
<type>(<scope>): <subject>

[body]

[footer]
```

**Types :**

| Type | Quand l'utiliser |
|------|-----------------|
| `feat` | Nouvelle fonctionnalité ou capacité visible par les utilisateurs |
| `fix` | Correction de bug |
| `docs` | Documentation uniquement — aucun changement de code |
| `style` | Formatage, espaces — aucun changement de logique |
| `refactor` | Restructuration du code sans changement de comportement |
| `perf` | Amélioration des performances |
| `test` | Ajout ou correction de tests |
| `chore` | Build, outillage, mises à jour de dépendances |
| `ci` | Modifications de configuration CI/CD |
| `revert` | Annule un commit précédent |

**Règles :**
- Sujet : mode impératif, minuscules, sans point final, max 72 caractères — "add user auth" et non "Added user auth"
- Scope : optionnel, entre parenthèses — le module, le paquet, ou la zone de fichier affectée
- Corps : expliquez le *pourquoi*, pas le *quoi* (le diff montre le quoi)
- Changements majeurs : ajoutez `BREAKING CHANGE:` dans le footer, ou `!` après le type (`feat!:`)

### Flux de travail

Exécutez ceci avant d'invoquer la compétence :
```bash
git diff --staged   # voir ce que vous allez committer
```

Puis demandez à Claude :
```
Write a conventional commit message for these staged changes:

[paste git diff --staged output, or describe what changed]
```

Claude va :
1. Identifier le type de changement principal
2. Inférer le scope à partir des fichiers modifiés
3. Rédiger une ligne de sujet (impératif, ≤72 chars)
4. Ajouter un corps si le changement nécessite une explication
5. Signaler les changements majeurs s'il y en a

### Commits multi-changements
Si le diff contient plusieurs changements logiques, Claude va soit :
- Rédiger un commit qui couvre le changement principal (en mentionnant les autres dans le corps)
- Suggérer de diviser en commits séparés avec `git add -p`

### Format de sortie
Claude produit le message de commit prêt à copier-coller :
```bash
git commit -m "feat(auth): add JWT refresh token rotation

Implement sliding session windows by rotating refresh tokens on each use.
Previous tokens are invalidated immediately after rotation.

Closes #234"
```

## Exemple

**Le diff indexé inclut :**
- `src/auth/tokens.py` — nouvelle fonction `rotate_refresh_token()`
- `tests/test_tokens.py` — tests pour la nouvelle fonction
- `CHANGELOG.md` — mis à jour

**Résultat attendu :**
```
feat(auth): add refresh token rotation

Rotate refresh tokens on each use to implement sliding session windows.
Previous tokens are invalidated immediately, reducing the window for
token theft after a session is compromised.

Closes #234
```

---
