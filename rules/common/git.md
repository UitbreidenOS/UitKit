# Git Rules

Copy the relevant sections into your project's `CLAUDE.md`.

---

## Commit messages

- Format: `type: short description` (imperative mood, ≤ 72 chars)
- Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `perf`
- Examples: `feat: add webhook signature verification`, `fix: handle null user in auth middleware`
- No generic messages: "update", "changes", "fix bug", "wip" are not acceptable
- Body (optional): explain WHY, not what. The diff shows what.

## Branches

- Feature branches: `feat/short-description`
- Bug fixes: `fix/short-description`
- Never commit directly to `main` or `master`
- Delete branches after merge

## What never to commit

- `.env` files or any file containing secrets
- `node_modules/`, `__pycache__/`, build artifacts
- Personal editor settings (`.idea/`, `.vscode/settings.json`)
- Files > 10MB (use git-lfs or external storage)
- Generated files that can be reproduced from source

## Before pushing

- Run tests locally — never push red
- Review your own diff before every push: `git diff origin/main...HEAD`
- Squash WIP commits before pushing to a shared branch
- Never force-push to `main` or any shared branch

## Dangerous commands — always confirm before running

- `git reset --hard` — destroys uncommitted changes permanently
- `git clean -f` — deletes untracked files permanently
- `git push --force` — rewrites remote history
- `git stash drop` — permanently discards stashed changes

---
