---
description: Generate a Conventional Commits-compliant commit message from staged changes
argument-hint: "[scope]"
---
Run `git diff --cached` to get the full staged diff. If nothing is staged, run `git diff HEAD` instead and note that changes are unstaged.

Analyze the diff and produce a single commit message following Conventional Commits 1.0.0:

Format:
```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

Rules:
- Type must be one of: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
- Subject: imperative mood, lowercase, no period, ≤72 chars
- Body: wrap at 72 chars, explain *why* not *what*, include breaking change rationale if applicable
- Footer: reference issues as `Fixes #N` or `Closes #N`; mark breaking changes as `BREAKING CHANGE: <description>`
- Scope: use $ARGUMENTS if provided, otherwise infer from the changed file paths or module names

Output only the final commit message — no preamble, no code fences, no explanation.

If the diff spans multiple unrelated concerns (e.g., feature + unrelated refactor), flag this explicitly before the message and suggest splitting the commit.
