---
description: Add or improve docstrings/JSDoc/type annotations on all public symbols in a file
argument-hint: "<file>"
---
Add or improve documentation comments for every public symbol in: $ARGUMENTS

Rules for what counts as a public symbol:
- Python: all functions/classes/methods not prefixed with `_`, plus module-level constants in `__all__` if defined.
- TypeScript/JavaScript: all exported functions, classes, interfaces, type aliases, and constants.
- Go: all exported identifiers (capitalized).
- Rust: all `pub` items.
- Other languages: apply the language's conventional public/private distinction.

For each public symbol that is undocumented or has a weak/placeholder doc:

1. Read the full implementation — not just the signature.
2. Write a docstring that covers:
   - **What** the function does (one sentence, imperative: "Parses...", "Returns...", "Validates...").
   - **Parameters**: name, type (if not in signature), meaning, constraints, default if relevant.
   - **Return value**: what it is and under what conditions (including `null`/`None`/`undefined`/`error` returns).
   - **Raises/throws**: every exception or error type the caller must handle.
   - **Side effects**: I/O, mutations, network calls — if any.
   - **Example**: one minimal usage example if the function is non-trivial.
3. Use the idiomatic format for the file's language:
   - Python: Google-style docstrings (Args / Returns / Raises sections).
   - TypeScript/JavaScript: JSDoc (`@param`, `@returns`, `@throws`).
   - Go: godoc (sentence starting with the symbol name).
   - Rust: `///` doc comments with `# Examples` section for non-trivial items.
4. Do NOT change any logic, signatures, or formatting outside the doc comments.
5. Do NOT add docs to private/internal symbols unless they already have a comment you need to improve.
6. If a docstring already exists and is accurate, leave it unchanged. If it is inaccurate or incomplete, replace only the deficient parts.

After editing, print a compact summary:
- How many symbols were documented (new).
- How many were improved.
- List any symbols you skipped and why.
