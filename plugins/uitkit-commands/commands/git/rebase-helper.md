---
description: Produce a safe, step-by-step rebase plan for the current branch onto a target
argument-hint: "[target-branch]"
---
Target branch: $ARGUMENTS (default to `main` if not provided).

Gather context:
1. `git log <target>...HEAD --oneline` — commits to be rebased
2. `git diff <target>...HEAD --stat` — files touched
3. `git log <target> -5 --oneline` — recent target history
4. `git status` — working tree state

Analyze and produce a rebase plan covering:

**Pre-flight checks**
- List any uncommitted changes that must be stashed or committed first
- Identify commits that may conflict based on overlapping file paths
- Flag merge commits — interactive rebase will need `--rebase-merges` if present

**Recommended command**
Provide the exact `git rebase` invocation (interactive or not, with flags) appropriate for this situation.

**Commit plan** (for interactive rebase)
List the commits in rebase order with the recommended action for each:
- `pick` — keep as-is
- `squash` / `fixup` — combine with predecessor (explain why)
- `reword` — improve the message (provide the new message)
- `drop` — remove (explain why)
- `edit` — pause to amend (explain what to change)

**Conflict prediction**
For each file that appears in both the branch and recent target history, note the likely conflict and suggest the resolution strategy.

**Recovery**
Provide the exact command to abort and restore the original state if something goes wrong.

Be precise. Do not hedge. If the rebase is straightforward, say so briefly.
