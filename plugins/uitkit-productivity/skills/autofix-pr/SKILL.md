---
name: "autofix-pr"
description: "User wants Claude to automatically apply code review suggestions without manual intervention; user mentions `/autofix-pr`; user wants hands-off PR ..."
---

# /autofix-pr — Automatic PR Fix Application

## When to activate
User wants Claude to automatically apply code review suggestions without manual intervention; user mentions `/autofix-pr`; user wants hands-off PR refinement after pushing code and receiving reviewer comments.

## When NOT to use
User wants to review every change before it is applied; repos without GitHub integration; PRs with complex architectural review comments that require judgment calls; situations where any auto-commit to the branch would violate team policy.

## Instructions

**What it does:**
`/autofix-pr` enables automatic application of non-destructive PR review suggestions. Claude reads the open review comments on the current PR and applies fixes that meet the auto-apply criteria without waiting for manual confirmation.

**What Claude auto-applies:**
- Formatting fixes (indentation, trailing whitespace, blank lines)
- Typo corrections in code and comments
- Simple variable renames where the reviewer stated the new name explicitly
- Obvious refactors with a clear, unambiguous description ("extract this into a helper function named X")
- Lint rule fixes (unused imports, missing semicolons, const vs let)

**What Claude does NOT auto-apply:**
- Architectural changes (moving files, restructuring modules)
- Logic rewrites or algorithm changes
- Anything requiring judgment about trade-offs
- Suggestions phrased as questions ("maybe consider…?")
- Ambiguous suggestions where multiple valid interpretations exist

**Handling ambiguous comments:**
Claude shows you the comment, explains why it is ambiguous, and asks before applying. You answer, Claude applies, moves to the next.

**Requirements:**
- Repo must be connected to Claude Code (same session that opened the PR, or a session in the same local repo)
- GitHub integration must be active
- The PR must be open and have reviewer comments

**Visibility:**
Each auto-applied fix appears as a commit in the PR timeline with a note indicating it was auto-applied. Reviewers see exactly what changed and why.

**Toggle:**
- `/autofix-pr` — enable for this session
- `/autofix-pr off` — disable

## Example

PR has 12 review comments. 9 are: "use `const` instead of `let`", "add missing semicolon on line 47", "variable name should be `userId` not `user_id`", "remove unused import". Claude auto-applies all 9, commits them as a single tidy-up commit, and surfaces the remaining 3 architectural comments for manual review: "The following 3 comments require your input before I can apply them."

---
