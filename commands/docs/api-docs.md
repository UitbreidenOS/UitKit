---
description: Generate reference API documentation for public-facing modules or endpoints
argument-hint: "[file-or-directory]"
---
Generate complete API reference documentation for: $ARGUMENTS

If no argument is given, scan the repo for public API surfaces — exported modules, REST/GraphQL endpoints, CLI interfaces — and document all of them.

Process:
1. Identify the API surface:
   - For libraries: exported functions, classes, types (read source + any index/barrel files).
   - For HTTP APIs: route definitions (Express, FastAPI, Django, Rails, etc.).
   - For CLIs: argument parsers (argparse, click, cobra, yargs, etc.).
2. For each public symbol/endpoint, extract: name, signature/route+method, parameters with types, return type, description from existing docstrings/comments (if any), error conditions.
3. Note any authentication, rate limiting, or versioning schemes present in the code.

Output format — Markdown reference document:

## API Reference

For each module / namespace / route group:

### `<SymbolName>` / `<METHOD /path>`

**Description:** What it does (inferred from implementation if no docstring exists).

**Parameters / Request:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| ...  | ...  | ...      | ...         |

**Returns / Response:** type and shape, or HTTP status codes with body shape.

**Errors:** List known error conditions and their codes/types.

**Example:**
```<lang>
// minimal working example
```

Rules:
- Document only what is actually in the code — do not invent parameters.
- If a parameter's type is ambiguous, state the inferred type and flag it with `<!-- verify -->`.
- For HTTP APIs, show curl examples.
- For library functions, show the host language.
- Group by logical namespace / resource / module — alphabetical within each group.
- If the target is a directory, recurse into all source files.

Write the output to `docs/api-reference.md` (create `docs/` if absent), or to $ARGUMENTS if it ends in `.md`. Confirm the path written.
