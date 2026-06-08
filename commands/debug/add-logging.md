---
description: Add structured logging to a file or function with appropriate log levels and context
argument-hint: "[file or function path]"
---
Add production-quality structured logging to the target code.

Target: $ARGUMENTS

Read the target file or function. Then:

1. **Audit existing logging** — identify what is already logged, what log library or framework is in use (stdlib logging, structlog, Winston, pino, slog, zerolog, etc.), and the project's log level conventions. Do not introduce a second logging dependency.

2. **Identify log points** — determine where logging is missing or insufficient:
   - Entry and exit of non-trivial functions (with relevant arguments and return values, redacted if they may contain PII or secrets)
   - Branching decisions that affect behavior (log which branch was taken and why)
   - External calls (HTTP, DB, queue, cache) — log intent before the call and outcome after, always including duration
   - Error and exception paths — log full context, not just the message
   - State transitions in long-lived objects or state machines

3. **Choose correct log levels** — apply these rules strictly:
   - DEBUG: internal state, loop iterations, resolved config values
   - INFO: meaningful milestones a human operator would want to see in production
   - WARN: recoverable anomalies, deprecated paths, degraded behavior
   - ERROR: failures that require attention; always include the exception object/stack

4. **Add structured fields** — log key=value pairs or JSON fields, not interpolated strings. Include: request/trace/correlation IDs if available in scope, relevant entity IDs, timing, environment context.

5. **Apply the changes** — write the updated file. Do not change logic, formatting outside the added lines, or variable names. Add imports only if required and not already present.

6. **Show a summary** — list each log statement added with its level and a one-line rationale.

Do not log secrets, tokens, passwords, full request bodies, or PII. If such values are in scope, log their presence or a hash, never their content.
