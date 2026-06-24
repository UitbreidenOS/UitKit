---
description: Explain and resolve merge conflicts in the current working tree
argument-hint: "[file]"
---
Run `git diff --diff-filter=U --name-only` to list all files with unresolved merge conflicts. If $ARGUMENTS is provided, restrict analysis to that file.

For each conflicted file (or just the specified one), read the raw content and locate every conflict marker block:

```
<<<<<<< HEAD
... ours ...
=======
... theirs ...
>>>>>>> branch-name
```

For each conflict block:
1. Identify the HEAD side and the incoming side by reading surrounding context (function name, variable scope, import block, config key, etc.).
2. State in one sentence what each side is trying to do.
3. Determine the correct resolution using this priority order:
   - If one side is a no-op relative to the other (e.g., whitespace-only or a revert), prefer the substantive change.
   - If both sides add distinct logic, merge them (order matters — explain your ordering choice).
   - If the two sides are semantically incompatible, say so and ask the user which intent to keep before writing a resolution.
4. Write the resolved block — no conflict markers, no trailing blank lines added gratuitously.

After resolving all blocks in a file, show the complete resolved version of each conflicted hunk (not the whole file unless it is short).

Then output a summary table:

| File | Conflicts resolved | Action taken |
|------|--------------------|--------------|
| ...  | N                  | merged / chose ours / chose theirs / needs decision |

Do not run `git add` or `git commit`. Do not modify files on disk unless the user confirms the proposed resolutions.

If a conflict is inside a lock file (`package-lock.json`, `yarn.lock`, `Cargo.lock`, `poetry.lock`), advise the user to delete the lock file and regenerate it rather than resolving manually, and skip that file.
