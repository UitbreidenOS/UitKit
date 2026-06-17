# Security Reviewer

## When to activate

- User requests a security review of pending code changes (PR, branch, or uncommitted work)
- Code involves authentication, authorization, cryptographic operations, or access control
- Changes affect API endpoints, input validation, or data handling pipelines
- New dependencies or third-party integrations are introduced
- Infrastructure-as-code (Terraform, Docker, K8s manifests, etc.) requires security audit
- User suspects a vulnerability (injection, XSS, CSRF, lateral movement, credential exposure)
- Post-breach or incident review needed — analyzing code for contributing factors
- Onboarding security-critical legacy code requiring baseline assessment

## When NOT to use

- General code quality / style review — use `/code-review` instead
- Fuzzing, dynamic testing, or runtime vulnerability scanning — requires test harness
- Penetration testing or external threat modeling — beyond scope of static analysis
- Dependency vulnerability scanning alone — use `npm audit`, `cargo audit`, etc. first
- Compliance audits (SOC 2, HIPAA, PCI-DSS) — requires compliance specialist knowledge
- User has not yet staged or identified code to review — ask for specific files/branches first

## Instructions

### 1. Scope Definition

Before beginning, clarify:
- **What code/files are in scope?** (use `git diff`, `git status`, or read specific files)
- **What is the threat model?** (e.g., "malicious external user", "insider threat", "supply chain compromise")
- **What is the data sensitivity?** (public, internal, PII, financial, health data, secrets)
- **What is the deployment context?** (cloud SaaS, on-prem, embedded, browser-based)

### 2. Authentication & Identity Review

Check for:
- **Credential storage**: Are secrets in environment variables, not hardcoded? Is `.env` in `.gitignore`?
- **Session management**: Are session tokens cryptographically random? Is there a secure cookie policy (HttpOnly, Secure, SameSite)?
- **Password strength**: If custom auth, are passwords hashed with a strong algorithm (Argon2, bcrypt, scrypt — NOT MD5, SHA1)?
- **Multi-factor authentication**: Is MFA enforced for sensitive operations? Are backup codes handled securely?
- **Token expiration**: Do tokens have reasonable TTLs? Is token refresh implemented securely?
- **Token leakage**: Are tokens logged, exposed in URLs, or sent over non-HTTPS?

### 3. Authorization & Access Control Review

Check for:
- **Privilege escalation**: Can a user escalate from regular user to admin? Check role/permission checks before sensitive operations.
- **Broken access control**: Are object IDs validated to ensure the user owns/can access them? (e.g., `/api/user/123` should check if requester is user 123 or admin)
- **Attribute-based access control (ABAC)**: Are permission checks applied consistently across all endpoints, or are some missing?
- **Least privilege**: Do service accounts/API keys have only the minimal permissions needed?
- **Cross-tenant isolation**: In multi-tenant systems, is data properly isolated? Can tenant A read tenant B's data?
- **Implicit trust**: Is there dead code that skips auth/authz checks?

### 4. Cryptography & Data Protection Review

Check for:
- **Weak algorithms**: Is the code using deprecated crypto (DES, RC4, MD5 for security)? Replace with AES-256, SHA-256, Ed25519.
- **Key management**: Where are keys generated, stored, rotated? Is `crypto/random` used for keys (never `Math.random()`)?
- **Hardcoded keys**: Are encryption keys or API tokens hardcoded in source? Move to secrets manager.
- **Transport security**: Is HTTPS/TLS enforced? Are certificate pins validated in mobile apps?
- **Data at rest**: Is sensitive data encrypted when persisted? Are encryption keys separate from encrypted data?
- **IV/nonce reuse**: For symmetric encryption, is a unique IV/nonce used per message (not reused)?
- **Hashing for security**: Are passwords/tokens hashed with a salt? (Argon2, bcrypt — NOT unsalted SHA).

### 5. Input Validation & Injection Prevention

Check for:
- **SQL injection**: Are queries using parameterized statements/prepared statements? Never concatenate user input into SQL.
- **Command injection**: If spawning shell commands, use language-level APIs (`subprocess.run()` with list args, not string). Never pass user input to `shell=True` / `sh -c`.
- **Template injection**: If using templating engines, are variables auto-escaped? Check for `safe`, `raw`, `| safe` flags that disable escaping.
- **XML/XXE injection**: When parsing XML, are external entity handlers disabled?
- **Path traversal**: Are file paths validated? Can `../` be used to escape intended directory?
- **Cross-site scripting (XSS)**: If rendering user input in HTML, is it escaped? Use templating engines with auto-escape, not string concatenation.
- **Regular expression denial of service (ReDoS)**: Are regexes tested for catastrophic backtracking?
- **Type confusion**: Are numeric IDs type-checked before use (string vs. integer)?

### 6. Error Handling & Information Disclosure

Check for:
- **Stack traces in responses**: Are error details leaked to users? Return generic messages; log details server-side.
- **Debug mode in production**: Is debug mode disabled in production code?
- **Verbose error messages**: Do error messages reveal system architecture, file paths, or usernames?
- **Exception handling gaps**: Are all possible exceptions caught? Are security-critical functions missing try-catch?
- **Timing attacks**: Does auth logic run in constant time? (Use `crypto.timingSafeEqual()` for secret comparison)

### 7. Dependencies & Supply Chain

Check for:
- **Known vulnerabilities**: Are dependencies up-to-date? Run `npm audit`, `pip-audit`, `cargo audit`.
- **Typosquatting**: Are package names spelled correctly? (e.g., `colorsjs` vs. `colors`)
- **Abandoned packages**: Are dependencies still maintained? Check GitHub repo activity.
- **Excessive permissions**: Do packages request permissions beyond their purpose?
- **Transitive dependencies**: Are indirect dependencies vetted?

### 8. Logging & Monitoring

Check for:
- **Sensitive data in logs**: Are passwords, tokens, PII, or keys logged?
- **Audit trails**: Are authentication/authorization decisions logged for forensics?
- **Immutable logs**: Are logs tamper-proof and stored separately from application?
- **Log retention**: Are logs retained long enough for incident investigation?
- **Alerting**: Are security events (failed logins, privilege escalation, data access) triggering alerts?

### 9. Secrets Management

Check for:
- **No hardcoded secrets**: Credentials must never be in source code, comments, or config files.
- **Environment variable validation**: Does the code check that required secrets are set before use?
- **Secrets rotation**: Is there a process for rotating API keys, database passwords, encryption keys?
- **Secret versioning**: If using a secrets manager, are old versions kept for rollback?
- **Audit of secret access**: Is there logging of who/what accessed secrets?

### 10. Architecture & Design Patterns

Check for:
- **Defense in depth**: Are there multiple layers of security, not a single point of failure?
- **Security by default**: Are insecure configurations opt-in (explicit), not opt-out?
- **Secure defaults**: Is HTTPS enforced by default? Are cookies Secure+HttpOnly by default?
- **Principle of least privilege**: Do all components, users, and services have minimal required permissions?
- **Zero trust**: Are internal services still authenticated/authorized to each other?
- **Separation of concerns**: Are security-critical operations isolated from untrusted input?

### 11. Documentation & Clarity

Check for:
- **Security assumptions documented**: Are threats, trust boundaries, and assumptions written down?
- **Code comments**: Is the "why" behind security checks explained, not just the "what"?
- **Deployment security**: Are security-critical config steps documented for ops teams?

## Example

### Scenario: Reviewing an e-commerce API with user accounts and payment processing

**Code under review**: A new endpoint `/api/orders/{orderId}` that returns order details.

**Security issues found**:

1. **Broken Access Control** (Critical)
   - Code: `GET /api/orders/123` returns order details without checking if requester owns order 123
   - Fix: Add authorization check: `if order.user_id != current_user.id: raise Forbidden`

2. **Information Disclosure** (High)
   - Code: Error response includes full stack trace showing database schema
   - Fix: Return generic "Order not found" error; log details server-side only

3. **Missing input validation** (Medium)
   - Code: `orderId` parameter not type-checked; could be a string used in SQL query
   - Fix: Validate `orderId` is integer; use parameterized queries

4. **Missing rate limiting** (Medium)
   - Code: No rate limit on `/api/orders/{orderId}` — attacker could enumerate all orders
   - Fix: Implement rate limiting (e.g., 100 requests/hour per user)

5. **Credential exposure** (Critical)
   - Code: Database connection string hardcoded: `connection_string = "postgresql://user:password@host"`
   - Fix: Move to environment variable; use secrets manager for production

6. **Weak cryptography** (High)
   - Code: Session token generated with `random.randint(0, 999999)` — easily guessable
   - Fix: Use `secrets.token_urlsafe(32)` or platform auth library

**Remediation plan**:
- Add authorization checks to all user-data endpoints
- Move secrets to `.env` + environment variables
- Replace weak random with cryptographic RNG
- Implement generic error responses
- Add rate limiting middleware
- Run `npm audit` to check dependencies

---

**Next steps**: User applies fixes, re-stages code, and requests another review to confirm remediations.
