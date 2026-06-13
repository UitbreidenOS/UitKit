# Security Review Workflow

Structured process for conducting a security review of a codebase, API, or system before launch or after significant changes.

## When to use

Run this workflow:
- Before launching a new product or major feature
- When a new engineer joins and inherits a codebase
- After a security incident to find related vulnerabilities
- Quarterly for security-critical code paths (payments, auth, PII handling)
- When changing authentication, authorisation, or data access patterns

## Phase 1: Threat Modelling (30-60 minutes)

Before looking at code, define what you're protecting:

**Assets to protect:**
- User PII (name, email, address, payment info)
- Authentication credentials (passwords, tokens, API keys)
- Business data (proprietary, customer data)
- System access (admin capabilities, infrastructure)

**Threat actors:**
- External attackers (unauthenticated users, automated bots)
- Authenticated users trying to access other users' data
- Malicious insiders with legitimate access
- Supply chain (compromised dependencies)

**Attack surfaces:**
- API endpoints (public and authenticated)
- File upload and processing
- Authentication and session management
- Third-party integrations (OAuth, webhooks)
- Admin interfaces

**Prioritise based on impact × likelihood.**

## Phase 2: Automated Scanning (30 minutes)

Run these tools first — they find the obvious issues quickly:

```bash
# 1. Dependency vulnerabilities
npm audit --audit-level=high        # Node.js
pip-audit                           # Python
cargo audit                         # Rust

# 2. Secret detection in code
gitleaks detect --source . --verbose

# 3. Static analysis (if available for your language)
# Node.js:
npx eslint --ext .ts,.tsx . --rulesdir security-rules/
# Python:
bandit -r src/ -ll

# 4. OWASP dependency check
docker run --rm owasp/dependency-check \
  --scan /path/to/project \
  --format HTML --out /output

# 5. Container scanning (if Docker):
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image my-image:latest
```

## Phase 3: Manual Code Review

Focus on the highest-risk areas:

**Authentication and session management:**
- [ ] Login endpoint has rate limiting
- [ ] Passwords hashed with bcrypt/argon2 (not MD5/SHA1)
- [ ] Session tokens are cryptographically random (not sequential IDs)
- [ ] Session invalidated on logout (server-side)
- [ ] JWT: signature verified, expiry checked, algorithm pinned
- [ ] Password reset tokens expire (< 1 hour) and are single-use

**Authorisation:**
- [ ] Every API endpoint checks authentication
- [ ] Resource access checks ownership (not just "is logged in")
- [ ] Admin functions require explicit admin role check
- [ ] Horizontal privilege escalation tested: can user A access user B's resources?

**Input validation:**
- [ ] All user input validated before use
- [ ] SQL queries parameterised (no string interpolation)
- [ ] File uploads: type validation, size limits, content scanning
- [ ] Path traversal protection on file operations
- [ ] HTML output escaped (no raw user content rendered as HTML)

**Sensitive data:**
- [ ] PII not logged (search logs for email, phone, SSN patterns)
- [ ] Secrets not in environment variables readable client-side
- [ ] No secrets in code, comments, or test fixtures
- [ ] HTTPS enforced (no HTTP fallback)
- [ ] Sensitive data encrypted at rest (not just hashed)

**Third-party integrations:**
- [ ] Webhooks verified with signature (Stripe webhook secret, etc.)
- [ ] OAuth state parameter validated (CSRF prevention)
- [ ] Redirect URLs validated against allowlist
- [ ] API keys rotated from any that are expiring or were exposed

## Phase 4: Penetration Testing (light)

Test the application directly for common vulnerabilities:

```bash
# SQL injection quick test (send these in form fields and URL params):
' OR '1'='1
1; DROP TABLE users; --

# XSS quick test:
<script>alert('xss')</script>
"><script>alert('xss')</script>

# Path traversal:
../../../etc/passwd
%2e%2e%2f%2e%2e%2fetc%2fpasswd

# Authentication bypass:
# Try accessing authenticated endpoints without a token
# Try expired tokens
# Try tokens from a different user
```

Use OWASP ZAP or Burp Suite Community Edition for automated scanning of your running application.

## Phase 5: Report and Remediate

**Finding severity:**
- **Critical**: exploitable with no authentication, data exfiltration risk → fix before launch
- **High**: requires authentication but leads to significant data breach → fix within 48h
- **Medium**: limited impact or hard to exploit → fix within sprint
- **Low**: defence in depth, minor issues → fix in next maintenance window

**Report format:**
```markdown
## Security Review — [Date]
Reviewer: [name]
Scope: [what was reviewed]

### Critical Findings
1. [Finding]: [description, location, proof of concept, fix]

### High Findings
...

### Medium Findings
...

### Remediation Plan
| Finding | Owner | Target date | Status |
|---|---|---|---|
```

## Related content

- `/skills/productivity/ship-gate` — pre-deploy security checklist
- `/prompts/system-prompts/security-auditor` — Claude security review prompt
- `/rules/common/api-design` — secure API design rules
- `/agents/roles/red-team` — authorized adversary simulation

---
