---
name: git-worktree
description: "Git worktrees: work on multiple branches simultaneously without stashing — set up worktrees, manage parallel development, and use worktrees with Claude Code for isolated task execution"
---

# Compétence Git Worktree

## Quand l'activer
- Travailler sur deux fonctionnalités simultanément sans changer de branches
- Examiner une PR tout en gardant votre travail actuel intact
- Exécuter un test long sur une branche tout en écrivant du code sur une autre
- Utiliser Claude Code pour travailler sur une tâche dans un environnement isolé
- Corriger la production au dépôt tout en étant à mi-chemin d'une fonctionnalité sur votre branche principale

## Quand NE PAS l'utiliser
- Changement de branche simple sans travail en cours — utilisez simplement `git checkout`
- Isolement de contexte unique — un nouveau clone est plus simple pour cela
- Partage de worktrees entre machines — les worktrees sont locaux uniquement

## Instructions

### Configuration de base du worktree

```
Set up a git worktree for [task].

Task: [describe — feature branch / PR review / hotfix / isolated Claude task]
Base: [main / develop / current branch]

Core commands:

# Create a new worktree at a new path
git worktree add ../my-project-feature feature/my-feature

# Create a worktree for an existing branch
git worktree add ../my-project-hotfix hotfix/critical-fix

# Create a worktree for a specific commit
git worktree add ../my-project-review origin/pr-branch

# List all active worktrees
git worktree list

# Remove a worktree (after merging/closing)
git worktree remove ../my-project-feature

# Prune stale worktree references
git worktree prune

Worktree folder structure:
my-project/           ← main worktree (your primary branch)
my-project-feature/   ← worktree for feature/my-feature
my-project-hotfix/    ← worktree for hotfix
my-project-review/    ← worktree for PR review

Each worktree:
- Has its own working directory and index
- Shares the same .git repository (no duplicate history)
- Cannot check out the same branch as another worktree
- Can have its own node_modules, build artifacts, .env
```

### Workflow de développement parallèle

```
Set up parallel development for [scenario].

Scenario: [feature + hotfix / two features / feature + PR review]

Standard parallel workflow:

# You're on feature/auth, need to hotfix production
cd my-project
git worktree add ../my-project-hotfix hotfix/payment-fix -b hotfix/payment-fix
cd ../my-project-hotfix

# Fix the bug
# Test
# Commit and push
git add .
git commit -m "fix: payment gateway timeout handling"
git push origin hotfix/payment-fix

# Go back to your feature without any stashing
cd ../my-project
# Everything exactly as you left it

# Clean up after hotfix is merged
git worktree remove ../my-project-hotfix
git branch -d hotfix/payment-fix

Reviewing a PR without losing your work:
# Check out the PR branch in a worktree
git fetch origin pull/123/head:pr-123
git worktree add ../my-project-pr123 pr-123

cd ../my-project-pr123
npm install  # install dependencies for this branch
npm run test # run tests

# Leave notes, then go back
cd ../my-project
git worktree remove ../my-project-pr123

Common worktree script (add to ~/.aliases or ~/scripts):
worktree() {
  local branch=$1
  local dir="${PWD}-${branch//\//-}"
  git worktree add "$dir" "$branch"
  echo "Worktree created at: $dir"
  cd "$dir"
}
```

### Intégration Claude Code

```
Use git worktrees with Claude Code for isolated task execution.

Use case: let Claude work on a task without affecting your current work.

Pattern — isolated Claude worktree:

# Create a worktree for Claude's task
git worktree add ../my-project-claude-task feature/claude-task -b feature/claude-task

# Open Claude Code in the worktree directory
cd ../my-project-claude-task
claude "implement the user authentication feature"

# Claude works in isolation:
# - Can read/write files in this directory
# - Changes don't affect your main working directory
# - You can keep coding in my-project while Claude works

# Review Claude's changes as a PR
git push origin feature/claude-task
gh pr create --title "feat: user authentication" --base main

# Or merge directly if you trust the result
cd ../my-project
git merge feature/claude-task
git worktree remove ../my-project-claude-task

Benefits of this pattern:
- Claude never touches your in-progress work
- Easy to review Claude's changes in isolation
- Can run multiple Claude tasks in parallel (one per worktree)
- Rollback is trivial: just delete the worktree and branch

Script for one-command Claude worktree:
claude-task() {
  local task_name=$1
  local branch="feature/claude-${task_name}"
  local dir="${PWD}-claude-${task_name}"
  git worktree add "$dir" -b "$branch"
  cd "$dir"
  echo "Claude worktree ready at: $dir"
  echo "Run: claude \"your task here\""
}
```

### Gestion du worktree

```
Manage multiple active worktrees.

List with status:
git worktree list
# Output:
# /path/to/main          abc1234 [main]
# /path/to/feature       def5678 [feature/auth]
# /path/to/hotfix        ghi9012 [hotfix/payment]

Maintenance commands:
# Remove a worktree (must not be current directory)
git worktree remove /path/to/worktree

# Force remove if worktree has uncommitted changes
git worktree remove --force /path/to/worktree

# Prune references to deleted worktrees
git worktree prune

# Move a worktree to a different location
git worktree move /old/path /new/path

Worktree .env management:
# Each worktree can have its own .env
# Useful for different database names per worktree:
cp .env.example /path/to/worktree/.env
# Edit the new .env to use a separate test database

Node.js with worktrees:
# Each worktree needs its own node_modules
# Add to .gitignore (already there): node_modules/
# After creating a worktree:
cd /path/to/worktree && npm install

# Or use shared node_modules with symlinks (faster):
ln -s /path/to/main/node_modules /path/to/worktree/node_modules
```

## Exemple

**Utilisateur:** Je suis au milieu d'une refactorisation complexe et je viens d'être appelé au sujet d'un bug de production. Je ne peux pas cacher mes changements car il y a trop de choses en vol. Comment gérer cela avec les worktrees?

**Workflow de Claude:**

```bash
# Step 1: Create a hotfix worktree (30 seconds)
# You stay exactly where you are — no stash needed
git worktree add ../myapp-hotfix hotfix/prod-bug -b hotfix/prod-bug

# Step 2: Switch to the hotfix (new terminal or cd)
cd ../myapp-hotfix
npm install  # if package.json changed since main

# Step 3: Fix the bug
# ... make your fix ...
git add src/payments/handler.ts
git commit -m "fix: handle null response from payment gateway"
git push origin hotfix/prod-bug

# Step 4: Deploy (CI/CD picks up the push)
# Your production fix is in flight

# Step 5: Go back to your refactor — exactly as you left it
cd ../myapp
# Nothing has changed — your in-progress work is intact

# Step 6: After the hotfix is merged, cherry-pick if needed
git fetch origin
git cherry-pick hotfix/prod-bug  # bring the fix into your feature branch
git worktree remove ../myapp-hotfix
git branch -d hotfix/prod-bug

# Total context switch cost: ~2 minutes, zero lost work
```

L'approche worktree est strictement meilleure que le stashing pour les situations complexes — les conflits de stash pop sont un risque réel; les worktrees n'en ont aucun.

---
