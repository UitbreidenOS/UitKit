> 🇫🇷 This is the French translation. [English version](../git.md).

# Règles Git

Copiez les sections pertinentes dans le `CLAUDE.md` de votre projet.

---

## Messages de commit

- Format : `type: courte description` (mode impératif, ≤ 72 caractères)
- Types : `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `perf`
- Exemples : `feat: add webhook signature verification`, `fix: handle null user in auth middleware`
- Pas de messages génériques : "update", "changes", "fix bug", "wip" ne sont pas acceptables
- Corps (optionnel) : expliquer le POURQUOI, pas le quoi. Le diff montre le quoi.

## Branches

- Branches de fonctionnalités : `feat/short-description`
- Corrections de bugs : `fix/short-description`
- Ne jamais committer directement sur `main` ou `master`
- Supprimer les branches après fusion

## Ce qu'il ne faut jamais committer

- Fichiers `.env` ou tout fichier contenant des secrets
- `node_modules/`, `__pycache__/`, artefacts de build
- Paramètres d'éditeur personnels (`.idea/`, `.vscode/settings.json`)
- Fichiers > 10 Mo (utiliser git-lfs ou un stockage externe)
- Fichiers générés qui peuvent être reproduits depuis la source

## Avant de pousser

- Exécuter les tests localement — ne jamais pousser en rouge
- Relire votre propre diff avant chaque push : `git diff origin/main...HEAD`
- Squasher les commits WIP avant de pousser sur une branche partagée
- Ne jamais force-pousser sur `main` ou toute branche partagée

## Commandes dangereuses — toujours confirmer avant d'exécuter

- `git reset --hard` — détruit les modifications non committées de façon permanente
- `git clean -f` — supprime les fichiers non suivis de façon permanente
- `git push --force` — réécrit l'historique distant
- `git stash drop` — supprime définitivement les modifications mises en attente

---
