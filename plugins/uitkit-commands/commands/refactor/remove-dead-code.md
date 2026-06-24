---
description: Identify and delete unreachable, unused, or obsolete code
argument-hint: "[file or directory]"
---
Perform a dead-code removal pass on $ARGUMENTS.

1. Read every file in scope. Build a mental map of:
   - Exported vs. internal symbols
   - Functions, variables, types, constants, imports that are declared but never referenced
   - Branches that can never be reached (e.g., code after unconditional return, conditions that are always true/false due to constant values)
   - Feature flags or env-var guards that are permanently on or off given the current codebase state
   - Commented-out code blocks — remove them unless they contain a dated rationale comment

2. For each dead symbol or block found:
   - Confirm it is not referenced via dynamic dispatch, reflection, string-based lookup, or an external caller outside the scanned scope. If uncertain, say so and skip.
   - Delete the declaration and all its local scaffolding (associated type aliases, helper variables used only by it, re-exports that only expose it).

3. After each deletion, remove any imports or requires that are now unused.

4. Do not reformat, rename, or restructure anything else. Dead-code removal only.

5. Output a list of every removed item: symbol name, file, line range, and reason (unused / unreachable / superseded).

6. If a symbol appears dead but has a comment suggesting future use or is part of a public API contract (e.g., exported from a library's index file), flag it instead of deleting it.

Constraints:
- Do not remove code just because it looks redundant — it must be provably unreferenced or unreachable.
- Do not touch test files unless the argument explicitly includes them.
- If removal would change observable behavior (e.g., a side-effectful import), flag it and do not delete.
