# Worktree Lifecycle

Complete four-command workflow for managing parallel Claude Code work using git worktrees. Each worktree is an isolated working directory on its own branch — multiple Claude sessions can run simultaneously without stepping on each other.

---

## When to use

- Running multiple Claude Code sessions in parallel on the same repo
- Isolating experimental work from a stable main branch
- Reviewing another branch's work without disturbing your active session
- Any workflow where you want clean branch isolation without the overhead of multiple repo clones

---

## Commands

### Init — create a worktree from a task description

**Input:** task description (free text)

**Steps:**
1. Derive a kebab-case branch name from the task description (strip articles, join significant words with `-`, max 5 words)
2. Run:
   ```bash
   git worktree add -b {branch} .worktrees/{branch} main
   ```
3. Create `.worktree-task.md` in the new worktree:
   ```markdown
   # Task
   {original task description}

   ## Branch
   {branch}

   ## Created
   {ISO timestamp}
   ```
4. Output the launch command:
   ```bash
   cd .worktrees/{branch} && claude
   ```

**Example:**
```
Init: "add Stripe webhook handling for subscription events"
Branch: add-stripe-webhook-subscription
Worktree: .worktrees/add-stripe-webhook-subscription
```

---

### Check — status of all active worktrees

**Steps:**
1. Run `git worktree list --porcelain` and parse output
2. For each worktree (excluding main):
   - Branch name and HEAD commit hash + message
   - Whether `.worktree-task.md` exists (indicates an active managed task)
   - `git diff --stat {main}...{branch}` — files changed since branch creation
3. Output a compact table:

```
Branch                              Last commit            Task file  Files changed
add-stripe-webhook-subscription     abc1234 add webhook    yes        3 files (+180/-0)
refactor-auth-middleware            def5678 wip            yes        7 files (+92/-61)
hotfix-null-pointer                 ghi9012 fix null       no         1 file  (+3/-1)
```

---

### Deliver — commit, push, and create PR from a worktree

**Pre-condition:** `.worktree-task.md` must exist in the current directory (confirms you are in a managed worktree, not main).

**Steps:**
1. Read task description from `.worktree-task.md`
2. Remove `.worktree-task.md` — it is a work artifact, not project code, and should not appear in the PR diff
3. Stage all changes: `git add -A`
4. Determine conventional commit type from the diff:
   - New files only → `feat:`
   - Deletions and modifications → `fix:` or `refactor:`
   - Config/tooling only → `chore:`
5. Derive commit message from the task description (imperative, ≤72 chars)
6. Commit: `git commit -m "{type}: {message}"`
7. Push: `git push -u origin {branch}`
8. Create PR:
   ```bash
   gh pr create --title "{type}: {message}" --body "{task description}"
   ```
9. Output the PR URL

---

### Cleanup — remove merged worktrees

**Steps:**
1. List all managed worktrees: `git worktree list`
2. For each branch, check if it is merged to main: `git branch --merged main`
3. Report what would be removed (always show this before acting)

**Flags:**
- `--dry-run` — list merged worktrees and branches, take no action
- `--force-all` — prompt for confirmation, then remove all merged worktrees:
  ```bash
  git worktree remove .worktrees/{branch}
  git branch -d {branch}
  ```

**Dry-run output:**
```
Would remove:
  .worktrees/add-stripe-webhook-subscription  (merged to main at abc1234)
  .worktrees/hotfix-null-pointer              (merged to main at def5678)

Run with --force-all to remove.
```

---

## Directory conventions

```
.worktrees/           # all managed worktrees live here
  {branch-name}/      # one directory per worktree
    .worktree-task.md # created by Init, removed by Deliver
```

Add `.worktrees/` to `.gitignore` — these directories are local filesystem state, not tracked content.

---

## Notes

- `.worktree-task.md` is the only signal that a worktree is managed by this workflow. Worktrees created manually (without Init) will show "no task file" in Check output and will be skipped by Cleanup unless `--force-all` is passed.
- Never run `git worktree remove` on a worktree with uncommitted changes unless you intend to discard them. Check always shows the diff stat before any destructive action.
- Worktrees share the same `.git` directory as the main repo. Operations like `git fetch` and `git log` in any worktree see all branches.

---
