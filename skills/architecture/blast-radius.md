# Blast Radius (Impact Analyzer)

## When to activate
Activate before making a breaking change, changing a shared type, or when invoked via `/blast-radius`.

## When NOT to use
Do not use for adding new isolated files or fixing local function bugs.

## Instructions
1. The user provides a target file or function (e.g., `UserService.ts`).
2. Use `Bash` with tools like `grep`, `find`, or AST-analyzers (if available) to trace all incoming imports. Find every file that imports the target.
3. Recursively find files that import *those* files (up to 2 levels deep).
4. Generate a Markdown or Mermaid.js visual graph showing the exact dependency chain.
5. Highlight the files that will require immediate refactoring if the target changes.

## Example
User: `/blast-radius I want to change the User interface.`
Claude: [Traces imports]. Here is the Blast Radius: Changing `User` will impact 4 controllers, 12 components, and the auth middleware. Here is the Mermaid graph mapping the impact.