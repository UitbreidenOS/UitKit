---
description: Produire un plan de rebase sûr et étape par étape pour la branche actuelle vers une cible
argument-hint: "[target-branch]"
---
Branche cible : $ARGUMENTS (par défaut `main` si non fournie).

Rassembler le contexte :
1. `git log <target>...HEAD --oneline` — commits à rebaser
2. `git diff <target>...HEAD --stat` — fichiers touchés
3. `git log <target> -5 --oneline` — historique récent de la cible
4. `git status` — état de l'arbre de travail

Analyser et produire un plan de rebase couvrant :

**Vérifications préalables**
- Lister tout changement non engagé qui doit être stocké ou engagé d'abord
- Identifier les commits qui peuvent entrer en conflit en fonction des chemins de fichiers qui se chevauchent
- Signaler les commits de fusion — le rebase interactif aura besoin de `--rebase-merges` s'il y en a

**Commande recommandée**
Fournir l'invocation exacte de `git rebase` (interactive ou non, avec les drapeaux) appropriée pour cette situation.

**Plan de commit** (pour rebase interactif)
Lister les commits dans l'ordre de rebase avec l'action recommandée pour chacun :
- `pick` — conserver tel quel
- `squash` / `fixup` — combiner avec le prédécesseur (expliquer pourquoi)
- `reword` — améliorer le message (fournir le nouveau message)
- `drop` — supprimer (expliquer pourquoi)
- `edit` — pause pour amender (expliquer ce qui doit être changé)

**Prédiction de conflits**
Pour chaque fichier qui apparaît à la fois dans la branche et dans l'historique récent de la cible, noter le conflit probable et suggérer la stratégie de résolution.

**Récupération**
Fournir la commande exacte pour abandonner et restaurer l'état d'origine en cas de problème.

Soyez précis. Ne vous dites pas. Si le rebase est simple, dites-le brièvement.
