# Worktree Init

## Purpose
Creates a new git worktree for a parallel task, with branch naming and task tracking file.

## When to use
- When starting a task that should be isolated from the current branch
- When you want to run two Claude sessions in parallel on different features
- Before beginning any work that might conflict with in-progress changes on another branch
- When you want a clean working tree without stashing

## The Prompt

```
Create a new worktree for this task: $TASK_DESCRIPTION

Steps:
1. Generate a kebab-case branch name from the task description (max 40 chars, no special characters)
2. Run: git worktree add -b {branch-name} .worktrees/{branch-name} main
3. Create .worktrees/{branch-name}/.worktree-task.md with:
   - Task: $TASK_DESCRIPTION
   - Branch: {branch-name}
   - Created: {today's date}
   - Status: in-progress
4. Print the launch command: cd .worktrees/{branch-name} && claude

Confirm when the worktree is ready.
```

## Variables

- `$TASK_DESCRIPTION` — a plain-English description of the work to be done in this worktree. Used to generate the branch name and populate the task tracking file. Example: "Add export to CSV feature to the reports page".

## Example

**Scenario:** You want to start work on a new feature while another branch is mid-review.

**Fill in the prompt:**

```
Create a new worktree for this task: Add rate limiting middleware to the Express API

Steps:
1. Generate a kebab-case branch name from the task description (max 40 chars, no special characters)
2. Run: git worktree add -b {branch-name} .worktrees/{branch-name} main
3. Create .worktrees/{branch-name}/.worktree-task.md with:
   - Task: Add rate limiting middleware to the Express API
   - Branch: {branch-name}
   - Created: {today's date}
   - Status: in-progress
4. Print the launch command: cd .worktrees/{branch-name} && claude

Confirm when the worktree is ready.
```

**Expected output:**

```
Branch name: add-rate-limiting-middleware-express-api

Running: git worktree add -b add-rate-limiting-middleware-express-api .worktrees/add-rate-limiting-middleware-express-api main
Preparing worktree (new branch 'add-rate-limiting-middleware-express-api')
HEAD is now at a3f91cc feat: add user authentication

Created .worktrees/add-rate-limiting-middleware-express-api/.worktree-task.md

Worktree is ready. Launch with:
cd .worktrees/add-rate-limiting-middleware-express-api && claude
```

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.youtube.com/@UITBREIDEN)
