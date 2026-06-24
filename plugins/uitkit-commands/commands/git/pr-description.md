---
description: Draft a pull request title and description from branch commits and diff
argument-hint: "[base-branch]"
---
Determine the base branch: use $ARGUMENTS if provided, otherwise default to `main`.

Run these commands to gather context:
1. `git log <base-branch>...HEAD --oneline` — list commits on this branch
2. `git diff <base-branch>...HEAD --stat` — file-level change summary
3. `git diff <base-branch>...HEAD` — full diff for semantic analysis

From this context, produce a pull request description in Markdown:

```
## Summary
<2-4 bullet points covering what changed and why — not a list of files>

## Changes
<Grouped by concern, not by file. Use sub-bullets for detail.>

## Testing
<Specific test steps a reviewer should run to validate correctness.
If tests are automated, name the test files or commands.>

## Notes for reviewers
<Flag non-obvious decisions, trade-offs, areas of uncertainty, or TODOs left for follow-up.
Omit this section if there is nothing noteworthy.>
```

At the top, before the body, output a single line:
`Title: <imperative, ≤70 chars, no period>`

Do not include boilerplate headings the repo does not need. Do not summarize every file changed — synthesize intent.
