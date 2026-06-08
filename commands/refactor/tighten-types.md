---
description: Strengthen weak or missing type annotations throughout a file
argument-hint: "[file]"
---
Tighten the types in $ARGUMENTS.

1. Read the file. Identify every location where types are weaker than they should be:
   - `any` in TypeScript — replace with the narrowest correct type, union, or generic
   - Untyped function parameters or return values
   - Overly broad types (`object`, `Record<string, any>`, `dict`, `interface{}`) where a concrete shape is known
   - Optional (`T | undefined`, `T | None`) used where the value is always present
   - Non-optional used where the value can legitimately be absent — add the optional and handle it at call sites
   - Enums or union types that could replace bare `string` or `number` literals
   - `as` casts / type assertions that could be replaced with proper type narrowing or guards

2. For each weak type found:
   - Infer the correct type from usage, surrounding context, and any existing documentation
   - Apply the tighter type at the declaration site
   - Fix any downstream type errors the tightening exposes — do not leave broken call sites
   - If tightening requires a new type alias or interface, define it near the top of the file (or in an existing types file if the project has one)

3. Do not change runtime behavior. Type changes only.

4. Do not add types just to add types — if a local variable's type is obvious from a literal assignment and the language infers it correctly, leave inference alone.

5. If a function's return type is currently inferred and inference is correct and stable, leave it. Only annotate where the inferred type is overly broad or likely to drift.

6. After all changes, verify the file would pass the project's type checker (`tsc --noEmit`, `mypy`, `cargo check`, etc.) conceptually. If you cannot verify, flag any change that might introduce a type error.

7. Output: list of every type tightened, original type, new type, and location.
