---
description: Inline a function, variable, or constant that adds indirection without value
argument-hint: "[symbol-name] [file]"
---
Inline the symbol specified in $ARGUMENTS — format: `<symbol-name> <file>`.

1. Read the file. Locate the declaration of the named symbol and every call site or usage.

2. Determine whether inlining is appropriate. Inlining is appropriate when:
   - The symbol is called in only one or two places
   - The symbol's body is simpler or clearer than its name implies (the name adds no information)
   - The symbol is a single-expression wrapper with no reuse value
   - A variable or constant is assigned once and used once, and the intermediate name does not aid readability

   Do NOT inline when:
   - The symbol is used in 3+ places (inlining would reintroduce duplication)
   - The name is genuinely informative and its removal would obscure intent
   - The symbol has side effects that execute at declaration time (inlining could change execution order)
   - The symbol is exported or part of a public API

3. For each call site:
   - Substitute the body of the symbol directly, with any parameter bindings substituted correctly
   - If the body references variables from its original scope that are not available at the call site, stop and report — the inline is not safe
   - Ensure operator precedence is correct after substitution (add parentheses if needed)

4. After all sites are inlined, delete the original declaration.

5. Remove any imports that existed solely to support the now-deleted symbol.

6. Verify the result is syntactically and semantically correct:
   - No dangling references
   - No changed evaluation order for expressions with side effects
   - Types still check out if the language is typed

7. Output: symbol name, number of sites inlined, original declaration location, and confirmation it was deleted.
