# Security Scanner

## When to activate

Use this skill when you need to identify and remediate security vulnerabilities in a codebase:

- Scanning dependencies for known vulnerabilities (npm audit, pip audit, cargo audit)
- Detecting hardcoded secrets or credentials in source code
- Analyzing code for common security flaws (SQL injection, XSS, CSRF, authentication gaps)
- Reviewing API security configuration (CORS, rate limiting, input validation)
- Checking infrastructure-as-code for misconfigurations (Terraform, CloudFormation, Kubernetes manifests)
- Validating cryptographic implementations and key management
- Before shipping to production or after security incidents
- During code review when security concerns arise
- When onboarding new dependencies or integrating external services

## When NOT to use

Do not use this skill for:

- General code review (use `/code-review` instead)
- Performance or efficiency analysis (use `/simplify` instead)
- Static type checking or linting issues (use dedicated linters instead)
- Penetration testing or runtime exploitation (requires controlled test environment and explicit authorization)
- Compliance audits or formal security certifications (requires domain expertise and governance framework)
- Security training or educational explanations without actionable remediation
- Third-party code you do not have permission to modify

## Instructions

### 1. Identify the Security Scope

Determine what you need to scan:

- **Dependency vulnerabilities**: Package managers and transitive dependencies
- **Secrets and credentials**: Hardcoded API keys, passwords, tokens, database URLs
- **Code patterns**: Input validation, authentication/authorization, cryptography, error handling
- **Configuration**: Environment variables, API endpoints, access controls, CORS policies
- **Infrastructure**: Cloud provider settings, container security, network policies

### 2. Run Automated Security Checks

Use language-specific tools to detect known vulnerabilities:

- **Node.js**: `npm audit`, `npm audit fix`, `npm audit --production`, Snyk (`npm install -g snyk`)
- **Python**: `pip install safety && safety check`, `pip install pip-audit && pip-audit`, Bandit (`bandit -r .`)
- **Go**: `go list -json ./... | nancy sleuth`, `gosec ./...`
- **Rust**: `cargo audit`, `cargo-deny`
- **General**: `git secret` (detect secrets), `TruffleHog` (find exposed credentials), `OWASP Dependency-Check`

### 3. Manual Code Pattern Analysis

Review for security anti-patterns in high-risk areas:

- **Authentication**: Missing or weak password validation, no rate limiting on login endpoints, hardcoded credentials
- **Input validation**: Unsanitized query parameters, unescaped SQL, insufficient regex bounds, file upload without extension/size checks
- **Authorization**: Missing permission checks, privilege escalation vectors, insecure direct object references (IDOR)
- **Cryptography**: MD5 or SHA-1 for passwords (use bcrypt/argon2), hardcoded secrets, weak random number generation, unencrypted sensitive data at rest
- **API security**: Missing or inadequate CORS configuration, no rate limiting, verbose error messages leaking internal state
- **Error handling**: Stack traces in production, logging sensitive data, swallowing exceptions silently

### 4. Generate and Review a Report

Create a summary of findings:

- Critical vulnerabilities (fix immediately before deploying)
- High-risk issues (fix before next release)
- Medium-risk improvements (include in roadmap)
- Low-risk recommendations (document for future refactoring)

For each issue, provide:
- Severity level and CVSS score (if applicable)
- Affected component, file, or dependency
- Why it is a vulnerability
- Specific remediation steps or code patch
- References to security standards (OWASP Top 10, CWE, etc.)

### 5. Remediate and Verify

Apply fixes and confirm resolution:

- Update vulnerable dependencies to patched versions
- Remove or securely manage hardcoded secrets
- Apply code fixes and re-run scans to confirm resolution
- Document security improvements in commit messages
- Optionally, set up automated scanning in CI/CD (GitHub Actions, GitLab CI, etc.)

## Example

Scenario: Scanning a Node.js Express API for security issues before a production deployment.

**Step 1: Run dependency scan**

```bash
npm audit
```

Output detects a high-severity vulnerability in `lodash` (prototype pollution).

```
high | Prototype pollution in lodash
Details: Lodash versions < 4.17.21 are vulnerable to prototype pollution attacks
Fix: npm install lodash@4.17.21 --save
```

**Step 2: Update vulnerable dependency**

```bash
npm install lodash@4.17.21 --save
npm audit
# Confirms vulnerability is resolved
```

**Step 3: Scan for hardcoded secrets**

```bash
npm install -g trufflehog
trufflehog filesystem . --json
```

Detects a hardcoded API key in `config.js`:

```javascript
const API_KEY = "sk-proj-abc123xyz..."; // Exposed in version control
```

**Step 4: Remediate secret**

Move the key to environment variables:

```javascript
const API_KEY = process.env.OPENAI_API_KEY;
```

Create `.env` file (add to `.gitignore`):

```
OPENAI_API_KEY=sk-proj-abc123xyz...
```

**Step 5: Code pattern review**

Inspect authentication routes for weaknesses:

```javascript
// BEFORE: Vulnerable
app.post('/login', (req, res) => {
  const user = db.users.find(u => u.email === req.body.email);
  if (user && user.password === req.body.password) { // Plain-text comparison
    res.json({ token: generateJWT(user) });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// AFTER: Secure
const bcrypt = require('bcrypt');
app.post('/login', rateLimit({ windowMs: 15 * 60 * 1000, max: 5 }), async (req, res) => {
  const user = await db.users.findOne({ email: req.body.email });
  if (user && await bcrypt.compare(req.body.password, user.passwordHash)) {
    res.json({ token: generateJWT(user) });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});
```

**Step 6: Generate summary**

Create a security report documenting:

- 1 critical vulnerability fixed (lodash prototype pollution)
- 1 high-risk issue fixed (hardcoded secret)
- 1 medium-risk improvement applied (bcrypt password hashing + rate limiting)
- Status: Ready for production deployment
