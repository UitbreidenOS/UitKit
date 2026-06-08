---
description: Extract a highlighted block or described logic into a named function with correct signature and call-site updates
argument-hint: "[file] [line-range or description]"
---
You are performing a surgical extract-function refactor on $ARGUMENTS.

Steps:
1. Read the target file. Identify the code block to extract — either the line range given or the logic matching the description.
2. Determine the minimal set of inputs the extracted function needs (parameters) and what it must return (return values or mutations).
3. Choose a name that is precise and verb-first (e.g., `computeRetryDelay`, `parseHeaderToken`, `buildQueryString`). Do not use vague names like `helper` or `util`.
4. Write the extracted function with:
   - The correct signature matching the host language's conventions (type annotations if the language supports them)
   - A single-sentence docstring/comment only if the purpose is non-obvious
   - No side effects beyond what the original code had
5. Replace the original block with a call to the new function, passing the identified arguments and capturing return values.
6. Verify:
   - The call site compiles/parses cleanly (check for unused variables left behind, missing returns, broken control flow)
   - No variable from the outer scope is now referenced inside the function that was not explicitly passed
   - If the language is typed, the types are consistent end-to-end
7. If the extracted logic appears more than once elsewhere in the file, replace those occurrences too and note how many call sites were updated.
8. Output the diff. Do not rewrite unrelated code.

Constraints:
- Preserve existing behavior exactly — this is a refactor, not a rewrite.
- Do not change the extracted block's logic, only its location and invocation.
- If extraction is not safe (e.g., the block mutates several outer variables in entangled ways), explain why and suggest a safer boundary instead.
