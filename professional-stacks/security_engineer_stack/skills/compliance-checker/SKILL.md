# Compliance Checker

## When to activate

Use this skill when you need to:
- Map existing security controls to regulatory frameworks (GDPR, SOC 2 Type II, PCI-DSS, HIPAA)
- Audit your current security posture against compliance requirements
- Identify compliance gaps in your infrastructure or processes
- Generate a remediation roadmap with implementation priorities
- Prepare evidence for a compliance assessment or audit
- Evaluate whether a new tool, process, or change maintains compliance

Trigger scenarios:
- Expanding into a regulated market (healthcare, finance, EU)
- Preparing for an external audit or certification
- After a security incident, to verify compliance didn't break
- Before deploying a new feature that touches sensitive data

## When NOT to use

- **Legal interpretation required**: If you need to understand ambiguous regulatory language or interpret case law, consult legal counsel — this skill maps known controls to known requirements, not edge cases
- **One-off compliance question**: If you just need "does GDPR require encryption?", ask directly instead of invoking the full skill
- **Post-breach investigation**: This skill maps controls to requirements; forensics and root-cause analysis are separate concerns
- **Real-time threat response**: During an active incident, focus on containment — compliance mapping comes after stabilization
- **Vendor procurement decisions**: Use this skill to define vendor compliance requirements, not to evaluate salespeople

## Instructions

### Step 1: Define Scope and Applicability

Before mapping controls, clarify:

1. **Regulatory jurisdiction**: Which frameworks apply?
   - GDPR: EU/UK data processing
   - HIPAA: US healthcare data (stricter than general data protection)
   - PCI-DSS: Payment card data handling (any industry)
   - SOC 2 Type II: Service organizations (auditor-driven)
   - Others: Industry-specific (FedRAMP, FISMA, CCPA, etc.)

2. **Data types and locations**: What data does your system touch?
   - Personal data (GDPR, CCPA)
   - Health data (HIPAA)
   - Payment card data (PCI-DSS)
   - Regulated industry data (finance, government, etc.)

3. **Scope boundaries**: Which systems, teams, and processes are in scope?
   - Cloud infrastructure vs. on-premises
   - Third-party vendors and processors
   - Development, staging, and production

### Step 2: Inventory Existing Security Controls

Document what you already have:

| Control | Current Implementation | Evidence Location | Owner |
|---|---|---|---|
| Encryption at rest | (e.g., AES-256 in RDS) | AWS console, IaC repo | Platform team |
| Access control | (e.g., IAM roles, MFA) | Okta config | Security team |
| Audit logging | (e.g., CloudTrail) | AWS account | Ops team |
| ... | ... | ... | ... |

Use `/security-audit` or manual review to populate this table.

### Step 3: Map Controls to Requirements

For each framework, cross-reference your controls against published requirements.

**GDPR (Article-based)**:
- Article 5: Data subject rights and processor transparency
- Article 32: Technical and organizational measures (encryption, access, testing, monitoring)
- Article 33-35: Breach notification and DPIA

**HIPAA (Rule-based)**:
- Administrative Safeguards: Workforce security, information access management
- Physical Safeguards: Facility access, workstation use and security
- Technical Safeguards: Access controls, encryption, audit controls, integrity controls

**PCI-DSS (Requirement-based)**:
- 1-6: Infrastructure security
- 7-8: Access control and user identification
- 9-12: Monitoring, testing, and policies

**SOC 2 Type II (Trust Service Criteria)**:
- CC (Common Criteria): Security, availability, processing integrity, confidentiality, privacy
- Each criterion has multiple sub-controls; attestation requires time-series evidence

### Step 4: Identify Gaps

For each requirement, assess coverage:

| Requirement | Required | Current | Gap | Severity | Evidence Gap |
|---|---|---|---|---|---|
| GDPR Art. 32: Encryption | Required for PII | AES-256 at rest; no TLS for internal comms | TLS between services | Medium | No inventory of internal TLS |
| PCI-DSS 6.2: Security patches | Monthly minimum | Ad hoc patching every 2-3 months | Automated patching SLA | High | No patch management policy |
| HIPAA Technical Safeguards: Audit logs | All system activity | CloudTrail + RDS logs only; no app logs | App audit trail (who, what, when) | Medium | No centralized log collection |
| SOC 2 CC7.3: Prevent unauthorized data access | Required | IAM roles and MFA | Attribute-based access control (ABAC) | Low | Meets current requirement |

Severity tiers:
- **Critical**: Failure exposes regulated data or violates legal requirement
- **High**: Creates material risk or audit finding; likely to fail certification
- **Medium**: Best practice gap or incomplete implementation; audit question likely
- **Low**: Recommended for mature programs; typically doesn't block certification

### Step 5: Generate Remediation Roadmap

Prioritize by:
1. **Severity**: Critical first, then High, Medium, Low
2. **Implementation cost**: Quick wins first; defer expensive rewrites
3. **Dependencies**: Some controls require others to be in place first
4. **Timeline**: Audit dates, certification deadlines, regulatory deadlines

**Roadmap template**:

| # | Control | Gap | Owner | Timeline | Effort | Blockers | Evidence Required |
|---|---|---|---|---|---|---|---|
| 1 | Encrypt internal traffic (TLS) | TLS between services | Platform | Q3 2026 | 2 weeks | Cert management infra | TLS cert audit, network capture |
| 2 | Centralized audit logging | App audit trail | Eng + Ops | Q3 2026 | 3 weeks | Blocked by #1 | Log ingestion setup, 6-month sample |
| 3 | Automated patch management | Patch SLA enforcement | Ops | Q4 2026 | 4 weeks | Blocked by #2 | Patch policy document, 12-month history |

### Step 6: Build Evidence Inventory for Audit

Create a control-evidence mapping:

| Control | Document Type | Owner | Refresh Cadence | Location |
|---|---|---|---|---|
| IAM access control | Policy doc + audit report | Security | Quarterly | Security drive > IAM Policy.pdf + access-audit-Q2-2026.csv |
| Encryption at rest | Architecture doc + test report | Platform | Annually | Security drive > Encryption Standards.md |
| Incident response | Playbook + post-mortems | Security | Ad hoc updates | GitHub > security/incident-response.md |

Auditors ask for:
- **Policies**: Formal written requirements
- **Evidence**: Logs, screenshots, reports proving compliance
- **Timelines**: Dates showing sustained compliance (not one-off checks)

---

## Example

### Scenario: A US health tech startup preparing for SOC 2 Type II and HIPAA certification

**Step 1: Scope**
- Frameworks: HIPAA (health data) + SOC 2 Type II (service organization)
- Data: Patient records, genomic data, audit logs
- Scope: AWS cloud, three regions, third-party data processor

**Step 2: Inventory**
- Encryption: RDS encryption at rest (AES-256), but no TLS in transit
- Access: IAM roles + Okta SSO, but no MFA enforcement
- Logging: CloudTrail + RDS logs, but no application audit trail
- Backup: Daily snapshots, no tested restore procedure

**Step 3: Map to Requirements**

HIPAA Technical Safeguards § 164.312(a)(2):
- (i) Encryption and decryption → **Partial**: At rest ✓, in transit ✗
- (ii) Access controls → **Partial**: IAM ✓, MFA ✗, role audits ✗

SOC 2 CC6.1 (Logical access controls):
- "System is protected against unauthorized logical access" → **Partial**: MFA missing, no attribute-based access

**Step 4: Gaps**

| Requirement | Current | Gap | Severity |
|---|---|---|---|
| HIPAA § 164.312(a)(2)(i): Encryption in transit | TLS optional | Enforce TLS for all data flows | Critical |
| HIPAA § 164.312(a)(2)(ii): MFA | Optional | Enforce MFA for healthcare staff | High |
| HIPAA § 164.312(b): Audit controls | CloudTrail + DB logs | Application audit trail (who accessed which records, when) | High |
| SOC 2 CC6.2: User access provisioning | Ad hoc Okta grants | Formal approval workflow + quarterly access reviews | Medium |

**Step 5: Remediation Roadmap**

| Priority | Control | Effort | Timeline | Evidence |
|---|---|---|---|---|
| 1 | TLS everywhere | 2 weeks | Q3 immediate | TLS audit, network scan |
| 2 | Enforce MFA | 1 week | Q3 immediate | Okta config, user enrollment report |
| 3 | Application audit trail | 4 weeks | Q3 | Centralized logging setup, 6-month sample logs |
| 4 | Access review workflow | 3 weeks | Q4 | Approval forms, quarterly review records |

**Step 6: Evidence Collected for Auditors**

- **HIPAA Compliance Checklist**: Filled in, signed by Security Officer
- **Encryption Audit Report**: Network capture showing TLS on all data flows
- **IAM Access Report**: Q2 2026 access review with manager sign-offs
- **Audit Log Sample**: 6 months of application + system logs proving "who did what when"
- **Policies**: Written HIPAA Security Rule implementation policy, MFA policy, incident response plan

---

## Related Skills

- `/security-audit` — Inventory and assess current security controls
- `/threat-modeling` — Identify new threats; cross-reference against compliance gaps
- `/incident-response` — When gaps are exploited; collect evidence for post-incident compliance
