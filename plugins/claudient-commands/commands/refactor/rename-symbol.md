---
description: Rename a symbol consistently across all files in scope
argument-hint: "[old-name] [new-name] [file or directory]"
---
Rename the symbol specified in $ARGUMENTS — format: `<old-name> <new-name> <path>`.

1. Parse the arguments: old name, new name, and the file or directory to operate on.

2. Before renaming, validate:
   - The new name follows the naming convention used for that symbol type in this codebase (camelCase, snake_case, PascalCase, SCREAMING_SNAKE, etc.)
   - The new name does not already exist in the same scope
   - The new name is not a reserved keyword or a name used by an imported dependency

3. Find every reference to the old name within the specified scope:
   - Declaration (function def, class, variable, type alias, constant, enum member)
   - All call sites and usage points
   - Import/export statements (named imports, re-exports)
   - String literals that are known to refer to the symbol (e.g., event names, dynamic `require()`, `keyof` string access) — flag but do not auto-rename these, as they may be API contracts
   - JSDoc / docstring references
   - Comments that name the symbol — update if the rename makes the comment incorrect

4. Apply the rename at every identified location. Do not rename:
   - Partial matches (e.g., renaming `user` must not touch `username` or `currentUser`)
   - Unrelated symbols that happen to share the name in a different scope
   - External files outside the specified path unless the symbol is exported and those files are within the repo

5. After renaming, check that all import paths and module re-exports are internally consistent.

6. Output: total reference count updated, list of files modified, and any locations flagged for manual review (string literals, dynamic access).
