---
description: Identifier et lister les branches locales et distantes obsolètes pouvant être supprimées sans risque
argument-hint: "[remote]"
---
Déterminer le dépôt distant par défaut. Utiliser $ARGUMENTS s'il est fourni, sinon détecter via `git remote show` ou revenir à `origin`.

Exécuter les commandes suivantes et capturer leur sortie :
- `git branch -vv` — branches locales avec informations de suivi en amont
- `git branch -r` — branches distantes
- `git log --oneline -1 HEAD` — confirmer l'état HEAD
- `git for-each-ref --format='%(refname:short) %(upstream:track) %(committerdate:relative) %(subject)' refs/heads` — métadonnées des branches

Classer chaque branche locale dans l'une de ces catégories :

**Sûre de supprimer :**
- Branche de suivi où l'amont est `[gone]` (branche distante supprimée)
- Entièrement fusionnée dans la branche par défaut (`git branch --merged <default>`)
- Dernier commit antérieur à 90 jours sans association de PR ouverte

**Potentiellement obsolète — à vérifier d'abord :**
- Dernier commit entre 30 et 90 jours
- Non fusionnée, aucun suivi en amont défini
- Le nom correspond à un motif suggérant une branche éphémère (`fix/`, `hotfix/`, `wip/`, `tmp/`, `test-`)

**À conserver :**
- Branche HEAD actuelle
- `main`, `master`, `develop`, `staging`, `release/*` par défaut
- Toute branche avec des commits non accessibles depuis la branche par défaut et dernier commit datant de moins de 30 jours

Afficher trois sections avec le nom de la branche, la date du dernier commit et la raison de la classification.

Ensuite, imprimer les commandes exactes pour supprimer les branches sûres :
```
# Local
git branch -d <branch> ...

# Remote (if applicable)
git push <remote> --delete <branch> ...
```

Utiliser `-d` (suppression sûre), non `-D`, sauf si la branche est déjà confirmée fusionnée. Ne pas exécuter de commandes de suppression — seulement les afficher pour que l'utilisateur les examine et les exécute.
