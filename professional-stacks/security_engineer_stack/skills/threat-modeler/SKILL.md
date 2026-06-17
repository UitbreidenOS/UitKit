# Threat Modeler

## When to activate

- Conducting security design review on a new system or feature before implementation
- Analyzing a deployed system for previously unmapped threat vectors
- Responding to a suspected attack or security incident to understand root causes and gaps
- Preparing for a formal threat modeling session with stakeholders (architecture, infra, product)
- Validating that threat mitigations implemented in code/config actually address identified risks

## When NOT to use

- Vulnerability scanning or penetration testing — use vulnerability assessment tools instead
- Post-incident root cause analysis without architectural context — pair with incident forensics
- Compliance checklist verification (SOC 2, PCI-DSS) — use compliance frameworks directly
- General security advice for code review — use code-review skill with security focus
- One-off security questions about a single component — ask specifically rather than full threat modeling

## Instructions

### Phase 1: Define System Scope and Boundaries

1. **Identify the system boundary.** What components are in scope? What are the external actors and trust boundaries?
   - Draw or describe data flows: where does data enter, transform, and exit?
   - Identify authentication/authorization boundaries
   - Mark external systems and third-party services

2. **List system assets.** What are you protecting?
   - User data (PII, credentials, secrets)
   - Application logic and proprietary algorithms
   - Availability/uptime
   - Integrity of stored or transmitted data
   - Audit logs and forensic capability

3. **Document entry/exit points.** How can attackers interact with this system?
   - API endpoints (REST, GraphQL, gRPC)
   - Network listeners (ports, protocols)
   - File upload mechanisms
   - Admin consoles or dashboards
   - Third-party integrations (webhooks, OAuth, SSO)

### Phase 2: Apply STRIDE Framework

For each entry point and trust boundary, systematically walk through STRIDE:

#### **S — Spoofing (Identity Forgery)**
- Can an attacker impersonate a legitimate user or service?
- Weak authentication (hardcoded creds, shared secrets, no MFA)?
- Unverified API calls between internal services?
- DNS or network interception?
- Unsigned JWTs or predictable session tokens?

#### **T — Tampering (Modification)**
- Can data be modified in transit or at rest?
- Unencrypted or plaintext transmission (HTTP, unencrypted database connections)?
- Missing integrity checks (no HMAC, signatures, checksums)?
- Unsafe deserialization (pickle, Java serialization, YAML)?
- Writable config files or environment variables?

#### **R — Repudiation (Denial of Actions)**
- Can an attacker deny performing an action?
- Missing audit logs for sensitive operations?
- Logs that can be modified or deleted?
- Lack of digital signatures or timestamps?
- No nonrepudiation for financial or legal transactions?

#### **I — Information Disclosure**
- Can sensitive data be exposed?
- Secrets in logs, error messages, or debug output?
- Information leakage in API responses (user enumeration, data exposure)?
- Readable backup files or cache?
- Metadata exposure (timing attacks, HTTP headers)?
- Unencrypted storage of credentials or PII?

#### **D — Denial of Service (DoS)**
- Can an attacker make the system unavailable?
- No rate limiting on endpoints?
- Resource exhaustion via large uploads, queries, or concurrent connections?
- Crash triggers from malformed input?
- External dependencies without timeout or circuit breaker?
- DDoS vulnerability without mitigation?

#### **E — Elevation of Privilege (AuthZ Bypass)**
- Can an attacker gain unauthorized access or permissions?
- Missing or weak authorization checks (relying on client-side filtering)?
- Privilege escalation via direct object references (IDOR)?
- Missing permission validation in API calls?
- Session fixation or hijacking?
- Unsafe use of admin accounts or service principals?

### Phase 3: Document Threats and Ranking

For each identified threat, record:

1. **Threat ID**: Unique identifier (e.g., TM-001, TM-API-003)
2. **STRIDE Category**: Which one(s) apply
3. **Description**: What is the attack? How would it happen?
4. **Affected Component(s)**: Which system parts are vulnerable
5. **Likelihood**: H/M/L — based on required attacker skill, ease of exploitation, attack surface
6. **Impact**: H/M/L — data loss, availability, confidentiality, compliance violation
7. **Risk Level**: H/M/L — combination of likelihood and impact
8. **Current Mitigations**: What controls exist today?
9. **Recommended Mitigation**: How to reduce likelihood or impact
10. **Effort to Mitigate**: Low/Medium/High

### Phase 4: Build Attack Tree (Optional)

For high-risk threats:

- Identify the attacker's goal (e.g., "Steal user credentials")
- Work backwards: what must be true for this to succeed?
- Branch into sub-goals and technical conditions
- Identify which branch is most likely or easiest to exploit
- Map mitigations to branches to show coverage

Example structure:
```
Goal: Steal database credentials
├─ Compromise developer machine
│  ├─ Social engineering email
│  ├─ Malware download
│  └─ Physical theft of laptop
└─ Extract from code/config
   ├─ Git history (.git folder)
   ├─ Environment files (dotenv, k8s secrets)
   └─ Hardcoded in comments or strings
```

### Phase 5: Prioritize and Plan

1. **Sort threats by Risk Level** (H → M → L)
2. **Group by component** to identify systemic issues
3. **Identify quick wins** (mitigations that are easy and high-impact)
4. **Schedule remediation** — high-risk items into sprint planning
5. **Track ownership** — assign each mitigation to a team (backend, infra, security)
6. **Follow up** — re-threat-model after significant changes

## Example

**System:** Multi-tenant SaaS expense management application

**Scope:** Web API (Node.js), React frontend, PostgreSQL database, AWS S3 for receipts, Stripe for billing

**Selected Threat from STRIDE walkthrough:**

| Field | Value |
|---|---|
| **Threat ID** | TM-API-005 |
| **Category** | Elevation of Privilege (E) + Information Disclosure (I) |
| **Description** | Attacker can view another tenant's expenses via direct object reference (IDOR). API endpoint `/api/expenses/{expenseId}` returns expense details without verifying the requesting user owns the expense. Attacker increments `expenseId` parameter to enumerate and read all expenses in the system. |
| **Affected Components** | Node.js API, PostgreSQL (expense table), React frontend |
| **Likelihood** | **High** — endpoint is publicly documented, parameter enumeration is trivial, no API key rotation/limit required |
| **Impact** | **High** — exposure of all user PII, financial data (amounts, vendor info, personal card details), business intelligence |
| **Risk Level** | **High** |
| **Current Mitigations** | Database encryption at rest; HTTPS for transit |
| **Recommended Mitigation** | Add authorization check in API handler: fetch expense, verify `expense.tenantId === req.user.tenantId` before returning. Add integration tests to verify IDOR is blocked. Implement per-tenant row-level security (RLS) in PostgreSQL as defense-in-depth. |
| **Effort to Mitigate** | **Low** — ~2 hour code change + 1 hour testing |

---

**Attack Tree for High-Risk Threat (TM-API-008):**

*Goal: Bypass MFA and steal user accounts*
```
├─ Guess or leak session token
│  ├─ Weak token generation (predictable)
│  │  └─ Token not cryptographically random
│  ├─ Token leaked in logs/error messages
│  │  └─ Verbose error handling
│  └─ Token stored insecurely (localStorage, unencrypted)
│
└─ Exploit MFA implementation gaps
   ├─ No MFA enforcement for high-privilege actions
   ├─ Time-based OTP (TOTP) brute-force (no rate limit)
   └─ SMS-based OTP interception
      └─ SIM swap attack (out-of-scope for app, but operational risk)
```

**Mitigation coverage:**
- Cryptographically random session tokens → eliminates "predictable" branch
- Structured logging + secret redaction → eliminates "leaked in logs" branch
- HTTPOnly + Secure cookies → reduces localStorage exposure
- Rate limiting on OTP validation → 5 attempts per 15 min per account
- Audit logs for MFA changes → post-incident forensics
