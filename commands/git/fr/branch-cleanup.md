---
description: Identifier et lister les branches locales et distantes obsolètes qu'il est sûr de supprimer
argument-hint: "[remote]"
---
Déterminez la télécommande par défaut. Utilisez $ARGUMENTS s'il est fourni, sinon détectez via `git remote show` ou utilisez `origin` comme valeur par défaut.

Exécutez les commandes suivantes et capturez leur résultat :
- `git branch -vv` — branches locales avec informations de suivi de branche amont
- `git branch -r` — branches distantes
- `git log --oneline -1 HEAD` — confirmer l'état de HEAD
- `git for-each-ref --format='%(refname:short) %(upstream:track) %(committerdate:relative) %(subject)' refs/heads` — métadonnées de branche

Classifiez chaque branche locale dans l'une de ces catégories :

**Sûr de supprimer :**
- Branche de suivi où l'amont est `[gone]` (branche distante supprimée)
- Entièrement fusionnée dans la branche par défaut (`git branch --merged <default>`)
- Dernier commit antérieur à 90 jours sans association PR ouverte

**Possiblement obsolète — À examiner d'abord :**
- Dernier commit entre 30–90 jours auparavant
- Non fusionnée, aucun suivi amont défini
- Le nom correspond à un motif suggérant une branche de courte durée (`fix/`, `hotfix/`, `wip/`, `tmp/`, `test-`)

**Conserver :**
- Branche HEAD actuelle
- `main`, `master`, `develop`, `staging`, `release/*` par défaut
- Toute branche avec des commits non accessibles depuis la branche par défaut et dernier commit dans les 30 jours

Écrivez trois sections avec le nom de la branche, la date du dernier commit et la raison de la classification.

Ensuite, imprimez les commandes exactes pour supprimer les branches sûres :
```
# Local
git branch -d <branch> ...

# Remote (if applicable)
git push <remote> --delete <branch> ...
```

Utilisez `-d` (suppression sûre), pas `-D`, sauf si la branche est déjà confirmée fusionnée. N'exécutez aucune commande de suppression — imprimez-les uniquement pour que l'utilisateur les examine et les exécute.
