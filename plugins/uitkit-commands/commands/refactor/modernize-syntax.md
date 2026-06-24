---
description: Update code to current language idioms without changing behavior
argument-hint: "[file or directory]"
---
Modernize the syntax and idioms in $ARGUMENTS to current language standards.

1. Read the file(s) and identify the language and its current stable version in use (check package.json, go.mod, Cargo.toml, pyproject.toml, or similar).

2. Apply only changes that are:
   - Supported by the language version already in use (do not upgrade the language version)
   - Pure syntax rewrites — same semantics, newer form
   - Consistent with the patterns already present in the file

3. Common modernization targets by language:

   JavaScript / TypeScript:
   - `var` → `const`/`let` with correct mutability
   - `.then()/.catch()` chains → `async/await`
   - `arguments` → rest parameters
   - Manual object spread → `{ ...obj }`
   - `Array.prototype.forEach` for side effects is fine; `.map`/`.filter`/`.reduce` where a value is needed
   - Named exports over default exports where the codebase already uses them

   Python:
   - Old-style `%` and `.format()` strings → f-strings (Python 3.6+)
   - `open()` without context manager → `with open()`
   - Manual list building loops → list/dict/set comprehensions where readable
   - `Union[X, Y]` → `X | Y` (Python 3.10+), `Optional[X]` → `X | None`
   - `typing.List/Dict/Tuple` → built-in `list/dict/tuple` (Python 3.9+)

   Go:
   - `errors.New(fmt.Sprintf(...))` → `fmt.Errorf(...)`
   - Manual slice loops where `range` is cleaner
   - Named return values only where they aid clarity, not as a default

   Rust:
   - `unwrap()` in non-test code → proper error propagation with `?`
   - `match` over `if let` chains when matching multiple arms
   - Redundant `.clone()` calls where a borrow suffices

4. Do not modernize:
   - Code that has a comment explaining why the older form is intentional
   - Patterns that require a language version bump
   - Style preferences (e.g., tabs vs. spaces) — that belongs to the formatter

5. Apply all changes. Output: list of patterns replaced and line counts.
