---
description: Plan and generate an interactive rebase squash script for the current branch
argument-hint: "[base-branch]"
---
Determine the base branch: use $ARGUMENTS if provided, otherwise detect the merge-base with `git merge-base HEAD origin/main` (or `origin/master` if main is absent).

Run `git log --oneline <base>..HEAD` to list all commits on the current branch.

Analyze the commit list and produce a squash plan following these rules:

**Group commits that should be combined:**
- `fixup!` or `squash!` commits belong with the commit they reference
- Commits with messages like "wip", "fix typo", "address review", "lint", "fmt", "cleanup" should be folded into the nearest preceding substantive commit
- Commits that touch only one logical unit of change (e.g., all touching the same module or feature) can be squashed if their messages are redundant

**Leave as separate commits:**
- Distinct features, bug fixes, or refactors that each deserve their own entry in history
- Commits with different types (feat vs. fix vs. docs) that will appear in a changelog
- Merge commits — flag these and warn that squashing across them requires care

Output the proposed `git rebase -i` todo list using the exact rebase script format:

```
pick <sha> <subject>
squash <sha> <subject>
fixup <sha> <subject>
reword <sha> <subject>
```

For each `squash` or `reword` entry, provide the suggested combined commit message below the script block.

Then print the single command to launch the rebase:
```
git rebase -i <base-sha>
```

Do not run the rebase. Warn if the branch has already been pushed to a shared remote — squashing will require a force push.
