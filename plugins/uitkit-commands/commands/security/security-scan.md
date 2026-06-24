---
description: Run a full static security scan on a file or directory and report exploitable vulnerabilities
argument-hint: "[path]"
---
Perform a thorough static security analysis of `$ARGUMENTS`. If no path is given, scan the entire working tree.

Steps:

1. **Enumerate attack surface**: List all entry points — HTTP handlers, CLI args, file reads, IPC, env vars, deserialization.

2. **Scan for vulnerability classes** — for each finding report: file, line, severity (CRITICAL / HIGH / MEDIUM / LOW), CWE ID, and one-line description:
   - Injection: SQL, NoSQL, LDAP, command, template, header
   - Broken authentication: hard-coded creds, weak token generation, missing expiry
   - Sensitive data exposure: secrets in source, unencrypted storage, verbose error messages
   - Insecure deserialization: pickle, YAML load, eval-based parsers
   - Broken access control: missing authz checks, IDOR patterns, path traversal
   - Security misconfiguration: debug flags, permissive CORS, directory listing
   - XSS / CSRF: reflected, stored, DOM-based; missing CSRF tokens
   - Vulnerable components: imports known to be CVE-affected (flag for dep-audit)
   - SSRF: user-controlled URLs fetched server-side
   - XXE: XML parsers with external entities enabled

3. **Triage and rank**: Sort all findings by severity then exploitability. Flag anything exploitable without authentication as CRITICAL regardless of CVSS base.

4. **For each CRITICAL and HIGH finding**, provide:
   - Minimal proof-of-concept exploit scenario (no working exploit code — describe the vector)
   - Recommended fix with corrected code snippet

5. **Output format**:
   ```
   ## Security Scan: <path>

   ### Summary
   CRITICAL: N | HIGH: N | MEDIUM: N | LOW: N

   ### Findings
   [severity] [CWE-XXX] file:line — description
   Fix: ...

   ### Deferred (MEDIUM/LOW)
   Bullet list only — no fix detail
   ```

Do not include findings you are uncertain about. Prefer precision over recall — one confirmed critical beats ten speculative lows.
