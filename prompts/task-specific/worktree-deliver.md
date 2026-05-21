# Worktree Deliver

## Purpose
Commits work done in a worktree, creates a PR, and cleans up.

## When to use
- When work in a worktree is complete and ready to ship
- As the closing step of any session that started with the `worktree-init` prompt
- When you want a consistent, automated PR creation process from a worktree

## The Prompt

```
Deliver this worktree's work as a PR.

Steps:
1. Read .worktree-task.md to get the task description
2. Run git diff main...HEAD to see all changes
3. Determine the conventional commit type (feat/fix/chore/refactor/docs) from the diff
4. Remove .worktree-task.md (it's a work artifact, not code)
5. Stage all changes: git add -A
6. Commit with message: "{type}: {task description}" — derive from the task in .worktree-task.md
7. Push the branch
8. Create a PR with:
   - Title: same as commit message
   - Body: one paragraph describing what changed and why
9. Print the PR URL

Stop and confirm before step 5 (staging) if there are any untracked files that look like they shouldn't be committed.
```

## Variables

None — all context comes from `.worktree-task.md` and the git diff. This prompt is designed to be self-contained within a worktree created by the `worktree-init` prompt.

## Example

**Scenario:** You've just finished implementing rate limiting in a worktree and want to ship it.

**Usage:** Paste the prompt as-is from inside the worktree directory.

**Expected output:**

```
Reading .worktree-task.md...
Task: Add rate limiting middleware to the Express API
Branch: add-rate-limiting-middleware-express-api

Running git diff main...HEAD...
Changed files:
  src/middleware/rateLimiter.ts  (new)
  src/app.ts                    (modified — middleware registered)
  tests/middleware/rateLimiter.test.ts (new)

Commit type: feat

No suspicious untracked files found. Proceeding.

Removed .worktree-task.md
Staged all changes
Committed: feat: add rate limiting middleware to the Express API

Pushing branch...
Branch pushed to origin.

Creating PR...
PR created: https://github.com/org/repo/pull/48

Title: feat: add rate limiting middleware to the Express API
```

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.youtube.com/@UITBREIDEN)
