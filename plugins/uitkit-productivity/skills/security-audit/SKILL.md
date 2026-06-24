---
name: "security-audit"
description: "Security audit for code: OWASP Top 10, injection, auth flaws, secrets, dependency vulnerabilities — with severity and fix for each finding"
---

# Security Audit Skill

## When to activate
- Pre-launch security review of a new feature or endpoint
- Auditing a codebase before open-sourcing it
- Code review feedback requests security analysis
- After adding authentication, authorization, or payment handling
- Before a penetration test — find the obvious issues first

## When NOT to use
- Dependency scanning — use `npm audit`, `pip-audit`, or Snyk instead (Claude can't read CVE databases)
- Live penetration testing against production systems
- Compliance certification (SOC2, PCI-DSS) — these require human auditors and tooling
- Binary/compiled code — Claude needs source

## Instructions

### Invoking the audit

```
/security-audit

Scope: {file, directory, or describe the area}
Focus: {all / auth / input validation / secrets / API endpoints}
```

Or targeted:
```
/security-audit

Review the user authentication flow in src/auth/.
Pay special attention to: session management, password reset, and JWT validation.
```

### OWASP Top 10 checklist Claude works through

**A01 — Broken Access Control**
- [ ] Authorization checked on every route/endpoint (not just authentication)
- [ ] Horizontal privilege escalation: can user A access user B's data?
- [ ] IDOR (Insecure Direct Object Reference): are IDs validated against the authenticated user?
- [ ] Admin-only endpoints protected against regular users

**A02 — Cryptographic Failures**
- [ ] Passwords hashed with bcrypt/argon2/scrypt (not MD5, SHA1, or raw SHA256)
- [ ] Sensitive data encrypted at rest (PII, payment info, tokens)
- [ ] HTTPS enforced, no sensitive data in URLs or logs
- [ ] Secrets not hardcoded or committed to git

**A03 — Injection**
- [ ] SQL queries use parameterised queries / ORM (no string concatenation)
- [ ] NoSQL queries sanitised
- [ ] Command injection: `subprocess`, `exec`, `eval` with user input
- [ ] LDAP, XPath, XML injection if applicable

**A04 — Insecure Design**
- [ ] Rate limiting on auth endpoints (login, password reset, OTP)
- [ ] Account lockout after N failed attempts
- [ ] Sensitive operations require re-authentication (password change, payment)

**A05 — Security Misconfiguration**
- [ ] Debug mode disabled in production
- [ ] Error messages don't leak stack traces or internal details to users
- [ ] Default credentials changed, example accounts removed
- [ ] CORS configured restrictively (not `*`)
- [ ] Security headers present (HSTS, CSP, X-Frame-Options)

**A06 — Vulnerable Components**
- [ ] No known-vulnerable dependencies (run `npm audit` / `pip-audit` separately)
- [ ] Dependencies pinned to specific versions
- [ ] No abandoned packages with open security issues

**A07 — Auth & Session Failures**
- [ ] JWT validated properly (algorithm, expiry, signature)
- [ ] Session tokens are cryptographically random, sufficient entropy
- [ ] Sessions invalidated on logout (not just client-side)
- [ ] "Remember me" tokens stored securely, rotated on use
- [ ] Password reset tokens single-use and short-lived

**A08 — Software & Data Integrity Failures**
- [ ] Deserialization of user input checked for dangerous types
- [ ] File uploads: type validated server-side, stored outside web root
- [ ] CI/CD pipeline integrity (no untrusted code in build chain)

**A09 — Logging & Monitoring Failures**
- [ ] Auth failures logged with IP, timestamp, user identifier
- [ ] Sensitive values (passwords, tokens) not logged
- [ ] Logs tamper-resistant (append-only, shipped to external system)

**A10 — SSRF (Server-Side Request Forgery)**
- [ ] User-supplied URLs validated against an allowlist
- [ ] Internal metadata endpoints blocked (169.254.169.254, etc.)
- [ ] Outbound requests use a proxy with egress filtering

### Output format

Claude reports each finding with:

```
[SEVERITY] {title}
Location: {file:line or area}
Issue: {what the vulnerability is}
Risk: {what an attacker could do}
Fix:
  {code change or configuration step}
```

**Severity levels:**
- 🔴 **CRITICAL** — exploitable right now, data breach or account takeover possible
- 🟠 **HIGH** — exploitable with some conditions, significant impact
- 🟡 **MEDIUM** — exploitable in specific scenarios, moderate impact
- 🟢 **LOW** — defence-in-depth issue, low probability or impact
- ℹ️ **INFO** — best practice not followed, no direct exploitability

### Common findings and fixes

**SQL injection:**
```python
# Vulnerable
cursor.execute(f"SELECT * FROM users WHERE email = '{email}'")

# Fixed
cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
```

**Hardcoded secret:**
```python
# Vulnerable
API_KEY = "sk-prod-abc123..."

# Fixed
API_KEY = os.environ["API_KEY"]  # never in source
```

**Missing authorization:**
```python
# Vulnerable — only checks authentication
@app.get("/orders/{order_id}")
async def get_order(order_id: int, user = Depends(get_current_user)):
    return db.query(Order).get(order_id)

# Fixed — checks the order belongs to this user
@app.get("/orders/{order_id}")
async def get_order(order_id: int, user = Depends(get_current_user)):
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == user.id   # ← authorization check
    ).first()
    if not order:
        raise HTTPException(status_code=404)
    return order
```

**Weak JWT validation:**
```python
# Vulnerable — accepts any algorithm (algorithm confusion attack)
payload = jwt.decode(token, key, algorithms=["none"])

# Fixed
payload = jwt.decode(token, key, algorithms=["HS256"])  # explicit allowlist
```

**CORS too permissive:**
```python
# Vulnerable
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True)

# Fixed — credentials require explicit origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://app.yourdomain.com"],
    allow_credentials=True,
)
```

## Example

**Scope:** `src/auth/` in a FastAPI application

**Expected findings:**
```
🔴 CRITICAL — No rate limiting on /auth/login
Location: src/auth/routes.py:24
Issue: The login endpoint accepts unlimited requests with no throttling.
Risk: Brute-force or credential stuffing attacks can enumerate valid accounts.
Fix: Add slowapi rate limiter: @limiter.limit("5/minute") on the login route.

🟠 HIGH — Password reset token not invalidated after use
Location: src/auth/password_reset.py:67
Issue: reset_password() updates the password but doesn't delete the reset token.
Risk: If a token is intercepted, it can be reused to reset the password again.
Fix: Delete or mark the token as used immediately after password update.

🟡 MEDIUM — JWT algorithm not explicitly specified
Location: src/auth/jwt.py:12
Issue: jwt.decode() uses default algorithm detection.
Risk: Algorithm confusion attack if the server accepts 'none' algorithm.
Fix: Pass algorithms=["HS256"] explicitly to jwt.decode().

ℹ️ INFO — Failed login attempts not logged
Location: src/auth/routes.py:38
Issue: Authentication failures are silently ignored.
Fix: Log failed attempts with timestamp, IP, and username for monitoring.
```

---
