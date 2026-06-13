---
name: batch
description: "Parallel agent orchestration: decompose large tasks into independent units, spawn background agents in worktrees, each opens a PR"
---

> 🇫🇷 Version française. [English version](../batch.md).

# Compétence : Batch (Traitement par lots)

## Quand activer
- Appliquer le même changement sur 10+ fichiers (renommage, refactoring, migration)
- Exécuter un audit de grande base de code (scan de sécurité, vérification des dépendances, couverture de tests)
- Générer du boilerplate pour de nombreux modules en parallèle
- Toute tâche où le travail peut être divisé en unités indépendantes et non chevauchantes

## Quand NE PAS utiliser
- Tâches avec des dépendances séquentielles (l'étape B nécessite la sortie de l'étape A)
- Modifications d'un seul fichier ou d'un petit nombre de fichiers liés
- Tâches nécessitant un contexte partagé entre toutes les unités (utilisez un seul agent à la place)
- Quand vous devez examiner et approuver chaque changement avant que le suivant commence

## Instructions

### Le pattern batch

Le Claude Code standard fonctionne séquentiellement : une tâche → un agent → une session. Le mode batch divise une grande tâche en N unités indépendantes et les traite en parallèle — chaque unité s'exécute comme un agent de fond séparé dans un worktree git isolé, effectue ses modifications et ouvre une PR.

```
Grande tâche
    │
    ├── Unité 1 → worktree-1 → branch-1 → PR #1
    ├── Unité 2 → worktree-2 → branch-2 → PR #2
    ├── Unité 3 → worktree-3 → branch-3 → PR #3
    └── Unité N → worktree-N → branch-N → PR #N
```

### Prompt d'activation

```
/batch

Task: [describe the full task]
Files/scope: [list files or glob patterns, or describe the scope]
```

Claude va :
1. **Phase de recherche** — lire la base de code pour comprendre les patterns et le périmètre
2. **Décomposition** — diviser la tâche en 5–30 unités indépendantes
3. **Révision du plan** — présenter la décomposition et attendre votre approbation
4. **Exécution** — démarrer un agent de fond par unité dans un worktree isolé
5. **PRs** — chaque agent valide ses modifications et ouvre une PR contre main

### Règles de décomposition suivies par Claude
- Chaque unité doit être **indépendante** — pas d'état partagé, pas de dépendances inter-unités
- Chaque unité doit être **réalisable en une session d'agent** (~15–30 min de travail)
- Chaque unité doit avoir un **critère de succès clair** (les tests passent, le lint passe)
- Les unités sont dimensionnées pour être **révisables en une PR** (préférer les petites PRs aux grandes)

### Bonnes tâches pour le batch

```bash
# Renommer une fonction utilisée dans toute la base de code
/batch
Task: Rename `getUserById` to `findUserById` everywhere it's used.
Scope: src/**/*.ts, tests/**/*.ts

# Ajouter des annotations de type à tous les modules Python
/batch
Task: Add full type annotations (PEP 484) to all functions in the services layer.
Scope: src/services/*.py

# Migrer les appels API vers le nouveau SDK
/batch
Task: Migrate all uses of the old `stripe.charges.create()` to `stripe.paymentIntents.create()`.
Scope: src/billing/**

# Audit de sécurité
/batch
Task: Audit every endpoint handler for missing authentication middleware.
Scope: routes/**/*.ts
Report findings per file — do not make changes.
```

### Surveiller la progression

Pendant que les agents s'exécutent en arrière-plan, surveillez avec :
```bash
# Vérifier l'état du worktree
git worktree list

# Vérifier les PRs ouvertes
gh pr list --label batch

# Voir quels agents sont encore en cours d'exécution
claude agents
```

### Fusionner les résultats

Une fois les PRs ouvertes :
1. Réviser chaque PR indépendamment — elles sont petites par conception
2. Fusionner dans n'importe quel ordre (elles sont indépendantes)
3. Nettoyer les worktrees après que toutes les PRs sont fusionnées :
```bash
git worktree prune
```

### Quand une unité échoue

Si la PR d'un agent échoue aux tests :
- Les autres agents continuent — les échecs ne se propagent pas
- Réviser la PR défaillante, corriger manuellement ou relancer cette unité
- Utiliser `git worktree remove worktree-N` pour nettoyer et redémarrer

## Exemple

**Tâche :** Ajouter des commentaires JSDoc à toutes les fonctions exportées dans une bibliothèque TypeScript de 40 fichiers.

**Décomposition de Claude :**
```
Unit 1: src/auth/*.ts (6 files, ~15 functions)
Unit 2: src/billing/*.ts (5 files, ~12 functions)
Unit 3: src/api/users/*.ts (4 files, ~18 functions)
...
Unit 8: src/utils/*.ts (3 files, ~8 functions)
```

**Après approbation :** 8 agents de fond démarrent en parallèle. Chacun ouvre une PR intitulée `docs(jsdoc): add JSDoc to [module name]`. Temps total : ~20 minutes au lieu de ~2,5 heures en séquentiel.

---
