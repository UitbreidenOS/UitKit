---
description: Audit input validation and sanitization across all trust boundaries
argument-hint: "[file, route, or module]"
---
Audit input validation and sanitization in `$ARGUMENTS` (default: all request handlers and data entry points) for injection vulnerabilities, type confusion, and missing boundary enforcement.

**1. Locate all trust boundaries**

Find every place external data enters the application:
- HTTP request handlers (body, query params, path params, headers, cookies)
- File uploads and multipart form data
- WebSocket message handlers
- Background job payloads (queues, cron inputs)
- External API responses treated as trusted
- Environment variables used in code logic

**2. SQL injection**

- Find all database queries. Are they parameterized/prepared statements, or string-concatenated?
- Check ORM usage — are there raw query escape hatches (`.raw()`, `query()`, `execute()`) with unsanitized input?
- Look for second-order injection: user input stored in DB then later used in a raw query.

**3. Command injection**

- Find all uses of `exec`, `spawn`, `system`, `popen`, `subprocess`, `child_process`, `os.system` and equivalents.
- Is user-supplied input interpolated into shell commands? Even with escaping, prefer argument arrays over shell strings.

**4. Template injection (SSTI)**

- Identify server-side template engines in use (Jinja2, Twig, Handlebars, Pebble, Velocity).
- Is user-controlled data rendered inside template expressions (`{{ }}`, `<%= %>`)?

**5. Path traversal**

- Find all file read/write operations using user-supplied filenames or paths.
- Is the resolved path validated against an allowed base directory (e.g., `os.path.abspath` + prefix check)?

**6. Type and schema validation**

- Is every incoming object validated against a strict schema before use?
- Are numeric inputs bounds-checked? Are enums validated against an allowlist?
- Is there prototype pollution risk (Node.js `Object.assign`, `merge` with untrusted input)?

**7. Output**

For each finding:
```
[SEVERITY] [file:line] — vulnerability type
Input source: where the untrusted data originates
Sink: where it's used unsafely
PoC: minimal payload or request that demonstrates the issue
Fix: specific remediation (parameterize, allowlist, validate schema, etc.)
```

Do not attempt to exploit findings — describe the attack vector and fix only.
