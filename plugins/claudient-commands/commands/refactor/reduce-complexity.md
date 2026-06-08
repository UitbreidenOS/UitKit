---
description: Lower cyclomatic complexity and nesting depth in a function or file
argument-hint: "[file] [function name or line number, optional]"
---
Reduce the complexity of the code in $ARGUMENTS.

1. Read the target. If a specific function or line is given, focus there. Otherwise, identify the highest-complexity regions: deeply nested conditionals, long functions with many branches, guard chains that obscure the happy path.

2. Measure complexity signals:
   - Nesting depth > 3 levels
   - Function length > 40 lines with multiple responsibilities
   - Cyclomatic complexity > 10 (count: `if`, `else if`, `for`, `while`, `case`, `catch`, `&&`, `||` branches)
   - Boolean expressions with > 3 operands
   - Long if-else chains that could be table-driven or polymorphic

3. Apply targeted reductions:

   Early returns / guard clauses:
   - Invert conditions to fail fast at the top of the function, eliminating the need for deep else branches

   Extract sub-functions:
   - Pull complex conditions into named predicate functions (`isEligible()`, `hasPermission()`)
   - Pull loop bodies into named functions if the body is > 5 lines

   Replace conditionals with data:
   - If a chain of `if/else` or `switch` maps input values to output values, replace with a lookup table / map

   Flatten nested loops:
   - Use `.flatMap()`, generators, or helper functions to avoid triple-nested loops
   - If the language supports it, consider structured concurrency or pipeline patterns

   Simplify boolean logic:
   - Apply De Morgan's laws to eliminate negated compound expressions
   - Extract named booleans for complex conditions (`const isExpired = date < now && !renewed`)

4. Do not reduce complexity by hiding it (e.g., moving a complex branch into a lambda that is immediately invoked). The goal is genuine simplification, not relocation.

5. Preserve all behavior exactly. Run a mental diff: every input that produced output X must still produce output X.

6. Output: original complexity estimate, new estimate, and a summary of each transformation applied.
