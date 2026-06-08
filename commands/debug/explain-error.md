---
description: Explain an error message or exception with root cause analysis and fix guidance
argument-hint: "[error message or paste]"
---
You are given an error or exception. Analyze it thoroughly and produce a structured explanation.

Error or exception to analyze:
$ARGUMENTS

Follow this process:

1. **Identify the error type** — classify it (runtime, compile, network, permission, logic, OOM, etc.) and name the exact error class or code if present.

2. **Root cause analysis** — explain what actually went wrong at a mechanical level. Do not stop at the surface message; trace to the underlying cause. If the error involves a stack trace, follow each frame and identify the originating call.

3. **Context clues** — extract any file paths, line numbers, module names, version strings, or environment hints embedded in the error. Explain what each tells us.

4. **Common triggers** — list the 3–5 most likely scenarios that produce this exact error, ranked by frequency. For each, state how to confirm or rule it out.

5. **Fix strategy** — for each likely cause, give the concrete fix. Be specific: include config keys, code patterns, commands, or file changes as appropriate. Prefer the minimal correct fix over broad rewrites.

6. **Prevention** — if this error class is systematically avoidable (e.g., with a linter rule, a type annotation, a retry policy, a null check), say so briefly.

Constraints:
- Do not pad with generic advice that applies to every error.
- If the error text is ambiguous or incomplete, state what additional context would change your analysis and how.
- When the fix involves code changes, show a before/after diff or a concrete snippet, not a description of a snippet.
- Keep the response dense. Senior engineers read fast.
