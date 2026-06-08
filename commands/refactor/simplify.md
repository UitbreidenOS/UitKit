---
description: Simplify overly complex expressions, conditions, and control flow without changing behavior
argument-hint: "[file or file:line-range]"
---
You are performing a simplification pass on $ARGUMENTS. The goal is to reduce cognitive load without altering behavior.

Work through the following categories in order. For each change, apply it directly — do not list suggestions.

**Expression simplification**
- Collapse double negations (`!!x` → `Boolean(x)` or just `x` where truthy check suffices; `!(a !== b)` → `a === b`)
- Reduce ternaries nested more than one level deep into early returns or named variables
- Replace manual array/object construction with idiomatic equivalents (spreads, comprehensions, destructuring)
- Collapse chained `.filter().map()` where a single `.reduce()` or `.flatMap()` is cleaner — only if it genuinely reduces lines and is still readable

**Conditional simplification**
- Convert `if (x) return true; else return false;` → `return x;` (and typed variants)
- Merge guard clauses: multiple `if (!a || !b || !c) throw` patterns into a single guard
- Replace switch/if-else ladders over an enum/string with a lookup table where the branches are simple value returns
- Remove redundant `else` after `return`, `throw`, `continue`, or `break`

**Control flow simplification**
- Flatten unnecessary nesting: if the outer `if` body contains only one `if`, invert the condition and early-return
- Remove no-op branches (`if (x) { /* nothing */ }`)
- Replace counted `for` loops that build an array with idiomatic map/fill/from where idiomatic in the language

**Variable simplification**
- Inline single-use variables that add no clarity (`const x = a + b; return x;` → `return a + b;`)
- Remove intermediate variables that only alias another variable with no transformation

Apply all safe changes. Do not change logic. Do not rename symbols unless a name is actively misleading. Do not reformat code unrelated to the simplifications.

Output a unified diff of all changes made.
