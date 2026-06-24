---
description: Add explanatory comments to complex or non-obvious code sections
argument-hint: "[file or function]"
---
Add explanatory comments to the code at: $ARGUMENTS

Rules:
- Comment the WHY, not the WHAT. Never restate what the code already says.
- A good comment explains: a hidden constraint, a non-obvious algorithm choice, a quirk
  of an external API, a performance tradeoff, or an invariant that must hold.
- Bad comment: `// increment i` — the code already says that.
- Good comment: `// skip index 0 — the API returns a sentinel value there, not real data`.

Process:
1. Read the target file or function fully before writing anything.
2. Identify every block that would cause a competent reader to pause and ask "why?".
3. For each such block, write a single-line comment (or two lines max) above it.
4. If a function or method has a non-obvious contract (preconditions, side effects, ordering
   requirement), add a short header comment stating only what isn't obvious from the signature.
5. Remove any existing comments that merely describe what the code does — they add noise.
6. Do not add a comment to every function. Only where genuine ambiguity exists.

Comment style:
- Match the existing comment style in the file (language, formatting, capitalization).
- For JavaScript/TypeScript: `//` for inline, `/** */` only for public API JSDoc.
- For Python: `#` inline; docstrings only for public functions/classes, one line if possible.
- No block comments explaining entire sections unless the section is a non-trivial algorithm.

After editing:
- Report each location you added or removed a comment with file:line and a one-sentence
  reason for the change.
- Do not reformat surrounding code. Surgical edits only.
- If $ARGUMENTS points to a whole directory, process each file but skip generated files,
  vendored code, and test fixtures.
