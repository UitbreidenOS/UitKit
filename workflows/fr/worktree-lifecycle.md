# Cycle de vie du Worktree

Flux de travail complet à quatre commandes pour gérer le travail parallèle Claude Code en utilisant des worktrees git. Chaque worktree est un répertoire de travail isolé sur sa propre branche — les sessions Claude multiples peuvent s'exécuter simultanément sans se marcher sur les pieds.

---

## Quand l'utiliser

- Exécuter des sessions Claude Code multiples en parallèle sur le même repo
- Isoler le travail expérimental d'une branche principale stable
- Examiner le travail d'une autre branche sans perturber votre session active
- Tout flux de travail où vous voulez une isolation propre de branche sans les frais d'index multiples

---

## Commandes

### Init — créer un worktree à partir d'une description de tâche

**Entrée :** description de tâche (texte libre)

**Étapes :**
1. Dérivez un nom de branche en kebab-case à partir de la description de tâche (supprimez les articles, joignez les mots significatifs avec `-`, max 5 mots)
2. Exécutez :
   ```bash
   git worktree add -b {branch} .worktrees/{branch} main
   ```
3. Créez `.worktree-task.md` dans le nouveau worktree :
   ```markdown
   # Tâche
   {description de tâche originale}

   ## Branche
   {branch}

   ## Créé
   {horodatage ISO}
   ```
4. Affichez la commande de lancement :
   ```bash
   cd .worktrees/{branch} && claude
   ```

**Exemple :**
```
Init : "ajouter la gestion des webhooks Stripe pour les événements d'abonnement"
Branche : add-stripe-webhook-subscription
Worktree : .worktrees/add-stripe-webhook-subscription
```

---

### Check — statut de tous les worktrees actifs

**Étapes :**
1. Exécutez `git worktree list --porcelain` et analysez la sortie
2. Pour chaque worktree (excluant main) :
   - Nom de branche et hash de commit HEAD + message
   - Si `.worktree-task.md` existe (indique une tâche gérée active)
   - `git diff --stat {main}...{branch}` — fichiers modifiés depuis la création de la branche
3. Affichez un tableau compact :

```
Branche                              Dernier commit         Fichier tâche  Fichiers modifiés
add-stripe-webhook-subscription      abc1234 add webhook    oui            3 fichiers (+180/-0)
refactor-auth-middleware             def5678 wip            oui            7 fichiers (+92/-61)
hotfix-null-pointer                  ghi9012 fix null       non            1 fichier  (+3/-1)
```

---

### Deliver — commit, push et créer PR à partir d'un worktree

**Pré-condition :** `.worktree-task.md` doit exister dans le répertoire actuel (confirme que vous êtes dans un worktree géré, pas main).

**Étapes :**
1. Lisez la description de tâche de `.worktree-task.md`
2. Supprimez `.worktree-task.md` — c'est un artefact de travail, pas du code de projet, et ne devrait pas apparaître dans la différence de PR
3. Placez en staging tous les changements : `git add -A`
4. Déterminez le type de commit conventionnel à partir de la différence :
   - Nouveaux fichiers uniquement → `feat:`
   - Suppressions et modifications → `fix:` ou `refactor:`
   - Config/outillage uniquement → `chore:`
5. Dérivez le message de commit à partir de la description de tâche (impératif, ≤72 caractères)
6. Commit : `git commit -m "{type}: {message}"`
7. Push : `git push -u origin {branch}`
8. Créez PR :
   ```bash
   gh pr create --title "{type}: {message}" --body "{task description}"
   ```
9. Affichez l'URL de PR

---

### Cleanup — supprimer les worktrees fusionnés

**Étapes :**
1. Listez tous les worktrees gérés : `git worktree list`
2. Pour chaque branche, vérifiez si elle est fusionnée à main : `git branch --merged main`
3. Signalez ce qui serait supprimé (affichez toujours ceci avant d'agir)

**Drapeaux :**
- `--dry-run` — listez les worktrees et branches fusionnés, ne prenez pas d'action
- `--force-all` — demandez la confirmation, puis supprimez tous les worktrees fusionnés :
  ```bash
  git worktree remove .worktrees/{branch}
  git branch -d {branch}
  ```

**Sortie de dry-run :**
```
Serait supprimé :
  .worktrees/add-stripe-webhook-subscription  (fusionné à main à abc1234)
  .worktrees/hotfix-null-pointer              (fusionné à main à def5678)

Exécutez avec --force-all pour supprimer.
```

---

## Conventions de répertoire

```
.worktrees/           # tous les worktrees gérés vivent ici
  {branch-name}/      # un répertoire par worktree
    .worktree-task.md # créé par Init, supprimé par Deliver
```

Ajoutez `.worktrees/` à `.gitignore` — ces répertoires sont l'état du système de fichiers local, pas le contenu suivi.

---

## Notes

- `.worktree-task.md` est le seul signal qu'un worktree est géré par ce flux de travail. Les worktrees créés manuellement (sans Init) afficheront "aucun fichier de tâche" dans la sortie Check et seront ignorés par Cleanup sauf si `--force-all` est passé.
- Ne jamais exécuter `git worktree remove` sur un worktree avec des changements non committés sauf si vous avez l'intention de les rejeter. Check affiche toujours la statut diff avant toute action destructive.
- Les worktrees partagent le même répertoire `.git` que le repo principal. Les opérations comme `git fetch` et `git log` dans n'importe quel worktree voient toutes les branches.

---
