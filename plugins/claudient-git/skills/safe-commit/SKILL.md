---
name: "safe-commit"
description: "Claude Code safe commit (lint-on-commit enforcer): workflow guidelines, best practices, instructions, and integration examples"
---

# Safe Commit (Lint-On-Commit Enforcer)

## When to activate
Activate whenever the user asks you to "commit the changes", "wrap this up", or explicitly invokes `/safe-commit`.

## When NOT to use
Do not use if the user explicitly asks for a `--no-verify` or dirty commit.

## Instructions
1. **Never commit blindly.** You must act as a strict local CI pipeline before touching Git.
2. **Discover Checks:** Inspect the project root (`package.json`, `Makefile`, `Cargo.toml`, etc.) to find the standard commands for compiling, linting, and testing.
3. **Execute Checks:** Use the `Bash` tool to sequentially run:
   - The type-checker/compiler (e.g., `npx tsc --noEmit`)
   - The linter (e.g., `npm run lint`)
   - The test suite (e.g., `npm test` or `pytest`)
4. **Fix Mode:** If *any* of those commands return a non-zero exit code (an error), you are FORBIDDEN from committing. You must immediately notify the user, output the error, and drop into "Fix Mode" to repair the broken code.
5. **The Commit:** Only when all checks are green (exit code 0), use the `Bash` tool to execute `git add` and `git commit` with a well-formatted conventional commit message.

## Example
User: `/safe-commit`
Claude: Running local CI checks...
`npx tsc` passed.
`npm run lint` FAILED. 
I cannot commit. There is an unused variable `userData` in `auth.ts`. I will fix this now and re-run the checks before committing.