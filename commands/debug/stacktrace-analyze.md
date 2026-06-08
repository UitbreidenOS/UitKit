---
description: Analyze a stack trace to identify root cause, call chain, and actionable fix
argument-hint: "[paste stack trace]"
---
Analyze the following stack trace and produce a precise, actionable diagnosis.

Stack trace:
$ARGUMENTS

Work through this systematically:

1. **Parse the trace** — identify the language and runtime (Python, JVM, Go, Node, Rust, .NET, etc.). Note the exception/error type and message at the top of the trace.

2. **Walk the call chain** — starting from the originating throw point (deepest relevant frame), trace upward through each frame:
   - Identify which frames are application code vs. framework/library vs. runtime internals
   - Focus analysis on the application frames — these are where the bug lives
   - For each application frame, state what that function is responsible for and why it is in this call chain

3. **Pinpoint the origin** — identify the single frame where control should have diverged from the correct path. This is not always the deepest frame; it is the frame where a wrong assumption, missing check, or invalid state was introduced.

4. **Read the source** — if the file paths in the trace exist in this repository, read the relevant lines. Cross-reference the line numbers in the trace with the actual code. Do not rely on the trace alone.

5. **Diagnose the root cause** — state exactly what condition triggered this trace. Be specific about variable values, object states, or timing that led here if they are inferable.

6. **Rule out red herrings** — if any frames are noise (async wrappers, middleware, retry loops), say so explicitly so the reader does not chase them.

7. **Fix** — provide the concrete code change that eliminates this failure path. Show the exact location (file, function, line range) and the before/after change. If the fix requires understanding external state, say what to check and how.

8. **Regression guard** — suggest the minimal test that would have caught this before it reached production.
