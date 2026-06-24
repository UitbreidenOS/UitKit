---
description: Identify and list stale local and remote branches safe to delete
argument-hint: "[remote]"
---
Determine the default remote. Use $ARGUMENTS if provided, otherwise detect from `git remote show` or fall back to `origin`.

Run the following commands and capture their output:
- `git branch -vv` — local branches with upstream tracking info
- `git branch -r` — remote branches
- `git log --oneline -1 HEAD` — confirm HEAD state
- `git for-each-ref --format='%(refname:short) %(upstream:track) %(committerdate:relative) %(subject)' refs/heads` — branch metadata

Classify each local branch into one of these categories:

**Safe to delete:**
- Tracking branch where upstream is `[gone]` (remote branch deleted)
- Fully merged into the default branch (`git branch --merged <default>`)
- Last commit older than 90 days with no open PR association

**Possibly stale — review first:**
- Last commit between 30–90 days ago
- Not merged, no upstream tracking set
- Name matches a pattern suggesting a short-lived branch (`fix/`, `hotfix/`, `wip/`, `tmp/`, `test-`)

**Keep:**
- Current HEAD branch
- `main`, `master`, `develop`, `staging`, `release/*` by default
- Any branch with commits not reachable from the default branch and last commit within 30 days

Output three sections with branch name, last commit date, and reason for classification.

Then print the exact commands to delete the safe branches:
```
# Local
git branch -d <branch> ...

# Remote (if applicable)
git push <remote> --delete <branch> ...
```

Use `-d` (safe delete), not `-D`, unless the branch is already confirmed merged. Do not run any delete commands — only print them for the user to review and execute.
