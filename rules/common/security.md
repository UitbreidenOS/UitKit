# Security Rules

Copy the relevant sections into your project's `CLAUDE.md`.

---

## Secrets

- Never put secrets in source code — not in comments, not in test files, not in example configs
- Never log secrets — check that logger calls don't include `password`, `token`, `key`, `secret`, or `credential` fields
- Use environment variables for all secrets; read them at startup, validate they exist
- Rotate secrets that have been accidentally committed — treat any committed secret as compromised

## Input validation

- Validate all input at system boundaries: API params, query strings, request bodies, file uploads, environment variables
- Validate type, format, length, and range — not just presence
- Use an allowlist (valid values) not a denylist (blocked values) where possible
- Never use user input directly in SQL queries, shell commands, file paths, or HTML without sanitization

## Authentication and authorization

- Check authentication on every request that requires it — never rely on frontend routing
- Check authorization (user can do THIS action) separately from authentication (user is logged in)
- Authorization checks must reference the authenticated user from the request context — never from a query parameter
- Token expiry must be enforced server-side — never trust client-provided token timestamps

## Databases

- Use parameterized queries or ORM — never string-concatenate SQL
- Database users must have minimum required permissions — app user should not have DDL access
- Never expose internal database errors to clients — log server-side, return generic error to client

## Dependencies

- Pin dependency versions — never use `*` or `latest` in production
- Run `npm audit` / `pip-audit` / `govulncheck` before every release
- Remove unused dependencies — every dependency is a potential attack surface
- Review the source of new dependencies before adding them

---
