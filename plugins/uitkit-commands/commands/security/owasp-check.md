---
description: Run a systematic OWASP Top 10 review against the codebase or a specific component
argument-hint: "[component or file]"
---
Perform a structured OWASP Top 10 (2021) review of `$ARGUMENTS` (default: entire codebase). For each category, determine applicability, locate relevant code, and report findings with severity and fix guidance.

Work through each category in order:

**A01 — Broken Access Control**
- Are authorization checks consistently applied across all routes and code paths to the same resource?
- Are IDOR vulnerabilities present (object lookups without ownership verification)?
- Can users access other users' data by manipulating IDs or parameters?

**A02 — Cryptographic Failures**
- Is sensitive data (PII, payment info, credentials) transmitted over unencrypted channels?
- Are weak algorithms in use (MD5, SHA1 for passwords, DES/RC4 for encryption)?
- Are secrets stored in code, config files, or environment-exposed locations?
- Are TLS certificate validations disabled anywhere?

**A03 — Injection**
- SQL, NoSQL, OS command, LDAP, XPath injection vectors — are queries parameterized?
- Is user input ever interpolated into query strings or shell commands?

**A04 — Insecure Design**
- Are there missing rate limits on auth endpoints (brute-force, credential stuffing)?
- Is there a lack of input validation at the domain model layer?
- Are security requirements documented and tested, or entirely absent?

**A05 — Security Misconfiguration**
- Are default credentials, ports, or admin interfaces left enabled?
- Are verbose error messages or stack traces exposed to clients?
- Are unnecessary features, endpoints, or services enabled?
- Are HTTP security headers set (CSP, HSTS, X-Frame-Options, X-Content-Type-Options)?

**A06 — Vulnerable and Outdated Components**
- Are dependencies pinned to versions with known CVEs?
- Are there unpatched OS or runtime components in Dockerfile or deployment configs?

**A07 — Identification and Authentication Failures**
- Are passwords stored with a strong adaptive hash (bcrypt, argon2, scrypt)?
- Are session tokens sufficiently random and invalidated on logout?
- Is MFA available for privileged accounts?
- Are account enumeration vectors present (different responses for valid vs invalid usernames)?

**A08 — Software and Data Integrity Failures**
- Are CI/CD pipelines protected against malicious commits or dependency substitution?
- Are deserialization operations performed on untrusted data without type validation?

**A09 — Security Logging and Monitoring Failures**
- Are authentication failures, access control violations, and input validation errors logged?
- Are logs stored where an attacker who compromises the app cannot erase them?
- Do log entries include enough context (user, IP, timestamp, action) to investigate incidents?

**A10 — Server-Side Request Forgery (SSRF)**
- Does the application fetch URLs or make outbound requests based on user-supplied input?
- Is the destination validated against an allowlist of domains/IPs?
- Can internal metadata endpoints (169.254.169.254, localhost) be reached via SSRF?

**Output format**:
```
## OWASP Top 10 Review

### [A0X] Category Name — PASS / FINDING / NOT APPLICABLE
Finding: [file:line] description
Severity: Critical / High / Medium / Low
Fix: specific remediation
```

Summarize with a risk table at the end: category, status, finding count, highest severity.
