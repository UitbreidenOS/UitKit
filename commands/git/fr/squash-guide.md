---
description: Planifier et générer un script de rebase interactif avec squash pour la branche actuelle
argument-hint: "[base-branch]"
---
Déterminer la branche de base : utiliser $ARGUMENTS s'il est fourni, sinon détecter la fusion de base avec `git merge-base HEAD origin/main` (ou `origin/master` si main est absent).

Exécuter `git log --oneline <base>..HEAD` pour lister tous les commits de la branche actuelle.

Analyser la liste des commits et produire un plan de squash en suivant ces règles :

**Grouper les commits qui doivent être combinés :**
- Les commits `fixup!` ou `squash!` appartiennent au commit auquel ils font référence
- Les commits avec des messages comme « wip », « fix typo », « address review », « lint », « fmt », « cleanup » doivent être fusionnés dans le commit substantiel le plus proche avant celui-ci
- Les commits qui ne touchent qu'une seule unité logique de changement (par exemple, tous touchant le même module ou fonctionnalité) peuvent être squashés si leurs messages sont redondants

**Laisser comme commits séparés :**
- Les fonctionnalités distinctes, les corrections de bugs ou les refactorisations qui méritent chacune leur propre entrée dans l'historique
- Les commits avec des types différents (feat vs. fix vs. docs) qui apparaîtront dans un changelog
- Les commits de fusion — les signaler et avertir que le squashing à travers eux nécessite de la prudence

Afficher la liste des tâches `git rebase -i` proposée en utilisant le format exact du script de rebase :

```
pick <sha> <subject>
squash <sha> <subject>
fixup <sha> <subject>
reword <sha> <subject>
```

Pour chaque entrée `squash` ou `reword`, fournir le message de commit combiné suggéré sous le bloc de script.

Ensuite, afficher la commande unique pour lancer le rebase :
```
git rebase -i <base-sha>
```

Ne pas exécuter le rebase. Avertir si la branche a déjà été poussée vers un dépôt distant partagé — le squashing nécessitera un force push.
