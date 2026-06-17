# Audit Report Writer

## When to activate

You have completed a security audit (manual, automated, or hybrid) and collected all findings into a structured format. You need to produce a polished, executive-ready security audit report that:

- Summarizes findings with severity levels (Critical, High, Medium, Low, Info)
- Specifies remediation steps, owner, and deadline for each finding
- Includes a verification plan to track fix completion
- Is suitable for leadership, stakeholders, and engineering teams

Activation triggers:
- Audit findings have been documented and deduplicated
- Context is ready: scope, methodology, date range, audit team
- Audience is known: executives, engineers, or both
- Timeline for remediation is defined

## When NOT to use

- **Audit is incomplete**: findings are still being collected or deduplicated
- **Data is missing**: severity, remediation path, or owner assignment is undefined
- **Raw notes only**: you have unstructured field notes, not audit data
- **Internal-only format needed**: you need a technical handoff document, not a formal report
- **Compliance artifact only**: you need a bare-minimum compliance checkbox, not actionable guidance (consider a compliance template instead)

## Instructions

### Report Structure

Every audit report must include:

1. **Executive Summary** (1/2 page)
   - Audit scope, dates, methodology
   - High-level risk posture (e.g., "5 critical, 12 high, 8 medium findings")
   - Key business impacts if left unaddressed
   - Overall recommendation (e.g., "Immediate remediation required for Critical findings")

2. **Findings Table** (ordered by severity)
   - **ID**: Unique identifier (e.g., AUD-001, AUD-002)
   - **Title**: Brief, actionable title
   - **Severity**: Critical, High, Medium, Low, Info
   - **Finding**: Technical description of the vulnerability or gap
   - **Impact**: Business or technical consequence
   - **Remediation**: Specific steps to fix (not vague advice)
   - **Owner**: Named team or individual responsible
   - **Deadline**: Target resolution date
   - **Verification**: How to confirm fix is complete (test case, audit step, etc.)

3. **Detailed Findings** (one per section)
   - Expand on each finding with context, evidence, and examples
   - Reference affected systems, users, or data
   - Include reproduction steps if applicable
   - Link to external resources (CVE, OWASP, compliance framework)

4. **Remediation Roadmap** (timeline view)
   - Critical findings: due within 7 days
   - High findings: due within 30 days
   - Medium findings: due within 90 days
   - Low/Info: backlog or next quarter
   - Optionally group by team or system

5. **Verification Plan**
   - How each finding will be validated post-remediation
   - Who performs verification (independent of implementer when possible)
   - Timeline for verification
   - Success criteria

6. **Appendix** (if applicable)
   - Audit tools and configuration used
   - Methodology (OWASP Top 10, CIS, internal checklist, etc.)
   - Assumptions and limitations
   - Disclaimer on scope and liability

### Severity Classification Guide

- **Critical**: Exploit causes immediate system compromise, data breach, or business shutdown. Patch or mitigate immediately.
- **High**: Exploit likely causes significant data loss, service interruption, or compliance violation. Remediate within 30 days.
- **Medium**: Exploit requires multi-step attack or privileged access; causes moderate data exposure or service degradation. Remediate within 90 days.
- **Low**: Exploit unlikely or requires attacker proximity; minimal business impact. Remediate opportunistically or next quarter.
- **Info**: Observation with no direct security impact but aids reconnaissance or future attacks. Document for situational awareness.

### Remediation Requirements

Each remediation must specify:

1. **What to do**: Exact action (patch version X, add WAF rule Y, rotate credential Z)
2. **Why**: Business/technical justification
3. **Who**: Assigned owner with escalation contact
4. **When**: Deadline (day-of-week and date)
5. **How to verify**: Automated test, manual check, or audit re-scan
6. **Rollback plan**: If remediation fails, fallback procedure
7. **Dependencies**: Other fixes or approvals required first

### Tone & Language

- Write for a mixed audience: technical implementers and non-technical stakeholders
- Use clear, jargon-light language; define acronyms on first use
- Be direct about risk; avoid euphemism ("data leakage" not "exposure concern")
- Focus on remediation, not blame
- Use active voice and imperative mood for instructions

### Format & Delivery

- **File format**: PDF or Markdown (with HTML export option)
- **Page limit**: 5–15 pages depending on finding count (aim for brevity without losing detail)
- **Metadata**: Include date, auditor name/team, version, and confidentiality marking
- **Distribution**: Track who receives the report; mark "Confidential" or "Internal Only"
- **Retention**: Archive for compliance records (typically 3+ years)

## Example

### Executive Summary

**Audit Report: API Gateway Security Review**  
**Date**: 2024-10-15  
**Auditor**: Security Engineering Team  
**Scope**: REST API Gateway, authentication layer, rate limiting  

This audit identified 2 critical, 3 high, and 5 medium-severity security gaps in the API Gateway. The critical findings expose unauthenticated access to user profiles and allow privilege escalation to admin role. Immediate remediation of critical findings is required before further production usage.

---

### Findings Table

| ID | Title | Severity | Owner | Deadline | Verification |
|---|---|---|---|---|---|
| AUD-001 | Missing authentication on `/user/{id}` endpoint | Critical | Backend Team | 2024-10-22 | Integration test with invalid token rejected |
| AUD-002 | JWT secret hardcoded in codebase | Critical | DevOps | 2024-10-22 | Grep codebase, secret moved to Vault |
| AUD-003 | No rate limiting on login endpoint | High | Backend Team | 2024-11-15 | 50 requests/min limit verified via load test |
| AUD-004 | SQL injection in search filter | High | Database Team | 2024-11-15 | OWASP SQLi test cases pass |
| AUD-005 | Missing HTTPS enforcement | Medium | Infra Team | 2025-01-15 | Browser test: redirect from HTTP to HTTPS |

---

### Detailed Finding: AUD-001

**Title**: Missing authentication on `/user/{id}` endpoint  
**Severity**: Critical  
**Finding**: The GET `/user/{id}` endpoint accepts requests without Bearer token validation. An unauthenticated attacker can enumerate all user profiles and retrieve sensitive PII (email, phone, address).

**Evidence**:
- Test request: `curl https://api.example.com/user/1234` returns 200 with user profile
- Affected endpoint: `/api/v1/user/{id}`
- Scope: ~50k active user profiles exposed

**Remediation**:
1. Add JWT validation middleware to endpoint
2. Extract `user_id` from token; reject if `user_id != requested_id` (prevent cross-user access)
3. Return 401 Unauthorized if no token or token invalid
4. Add integration test: verify unauthenticated request returns 401

**Owner**: Backend Team (assigned to alice@example.com)  
**Deadline**: 2024-10-22 (7 days)  
**Verification**: Run `/tests/integration/test_auth.py::test_user_endpoint_requires_auth` and confirm pass  
**Rollback**: Revert commit; monitor error logs for 401 spikes indicating client-side failures

---

### Remediation Roadmap

**Week 1 (Critical)**:
- AUD-001: Secure `/user/{id}` endpoint
- AUD-002: Move JWT secret to Vault

**Month 1 (High)**:
- AUD-003: Add rate limiting to login
- AUD-004: Parameterize SQL queries
- AUD-005: Force HTTPS

**Ongoing (Medium & Low)**:
- Backlog remaining findings
- Schedule for next sprint

---

### Verification Plan

| Finding | Test Type | Owner | Date | Success Criteria |
|---|---|---|---|---|
| AUD-001 | Unit + Integration | QA | 2024-10-23 | No 200 responses without Bearer token |
| AUD-002 | Code scan + secret scan | SecOps | 2024-10-23 | Vault audit shows secret rotation; no plaintext in repo |
| AUD-003 | Load test | DevOps | 2024-11-16 | >50 req/min from single IP returns 429 |
| AUD-004 | SQLi payload test | QA | 2024-11-16 | Payloads are escaped/parameterized; no error messages leak schema |
| AUD-005 | HTTP redirect test | QA | 2025-01-16 | HTTP requests redirect to HTTPS; Strict-Transport-Security header present |

---

**Report Version**: 1.0  
**Classification**: Confidential  
**Distribution**: Exec Leadership, Engineering Leads, Security Team
