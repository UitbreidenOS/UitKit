---
name: incident-classifier
description: Classifies security incident by severity, scope (affected users/systems), timeline (how long was it happening?), and activates response plan.
allowed-tools: Read, Write
effort: medium
---

# Incident Classifier

## When to activate

- Security alert or breach report arrives (internal detection, third-party notification, or external report).
- Multiple incidents reported simultaneously; need rapid triage and prioritization.
- Incident severity and scope must be determined before response plan is activated.
- Incident profile required for executive communication, incident tracking, or post-incident review.

## When NOT to use

Do not use for routine vulnerability scanning or CVE triage — use `cve-analyzer` instead. Do not use for code or architecture review — use `security-reviewer`. Do not use for compliance gap analysis — use `compliance-checker`. Do not use for detailed forensic investigation — use forensics playbook after initial classification. Do not use for speculative "what-if" scenarios — only real, reported incidents.

## Instructions

Follow this process to classify an incident and activate the appropriate response plan.

### 1. Gather Incident Data

Collect the following information from the reporter or detection system:

- **Initial report:** What alert fired? What triggered the discovery? (e.g., "Unusual database access pattern flagged by SIEM," "Customer reported unauthorized account access," "Compliance team detected unencrypted PII in logs")
- **Affected assets:** Which systems, databases, APIs, or services are involved?
- **Timeline indicators:** When was the anomaly first detected? When might it have started?
- **Scope signals:** How many users/records/systems appear affected?
- **Detection vector:** How was it found? (automated alert, manual review, customer complaint, security research)

### 2. Classify Severity

Use the **Incident Severity Matrix** (below) to assign CRITICAL, HIGH, MEDIUM, or LOW. Consider:

1. **Impact:** What is the worst-case outcome? Data breach, availability loss, integrity compromise?
2. **Scope:** Is it affecting 1 user or 100,000? 1 database or the whole platform?
3. **Attack vector:** Does attacker access require: network proximity, authentication, physical access, or none?
4. **Recoverability:** How quickly can we restore/remediate?

| **Severity** | **Impact** | **Scope** | **Response Deadline** | **Examples** |
|---|---|---|---|---|
| **CRITICAL** | Complete system compromise, confirmed data breach, or RCE in production | 1000+ users OR entire system down OR 100+ GB data exposed | 24–48 hours | Ransomware detected, root user credential leaked, SQL injection RCE confirmed, auth bypass allowing arbitrary account access |
| **HIGH** | Significant data exposure, service disruption, or privilege escalation | 100–999 users OR critical service degraded OR 10–100 GB data exposed | 1 week | Attacker accessed customer database for 3 days, XSS vulnerability allows session hijacking, unpatched RCE CVE deployed but not exploited |
| **MEDIUM** | Partial data access, information disclosure, or temporary service impact | 10–99 users OR non-critical service affected OR 1–10 GB data exposed | 1 month | Weak password policy allowed brute force entry, missing rate limiting on API, employee credentials in code repo |
| **LOW** | Minimal security impact, no data exposed, requires specific conditions to exploit | <10 users OR isolated to test/staging OR <1 GB data OR no real-world impact | 3 months | Outdated dependency in development tool, missing security header, unexecuted code path with injection risk |

### 3. Assess Scope

Document the scope in detail:

- **Affected users:** Named list if <50, percentage if >50.
- **Affected systems:** List specific services, databases, APIs.
- **Data types exposed:** (if breach) PII (names, emails, phone), credentials, financial data, health records, IP addresses, etc.
- **Duration:** When did the incident begin (best estimate), when was it detected, how long was the window?
- **Containment status:** Is it ongoing, isolated, or already stopped?

### 4. Reconstruct Timeline

Build a timeline from available signals. Document:

- **T0 (Possible Start):** When might the incident have begun? (e.g., "Attacker likely gained access on 2026-06-10 based on earliest suspicious log entry")
- **T1 (Detection):** When was the anomaly detected? (e.g., "2026-06-13 14:22 UTC, SIEM alert on unusual database queries")
- **T2 (Confirmation):** When was the incident confirmed as real? (e.g., "2026-06-13 15:00 UTC, manual review confirmed unauthorized access")
- **T3 (Containment):** When was the attack stopped or isolated? (e.g., "2026-06-13 15:45 UTC, attacker account disabled, suspicious API key revoked")
- **Total Duration:** How long was the incident active? (e.g., "3 days exposure, 2+ hours from detection to containment")

### 5. Output Incident Profile

Generate a structured incident profile (see format below).

### 6. Activate Response Plan

Based on severity:

- **CRITICAL:** Activate **immediate response** — notify CISO/CTO immediately, stand up war room, begin forensic investigation, prepare customer notification, activate legal/PR.
- **HIGH:** Activate **urgent response** — notify security leadership, begin investigation, plan customer communication for end of business day.
- **MEDIUM:** Activate **standard response** — log finding, assign investigation owner, schedule remediation by deadline.
- **LOW:** Log finding, add to backlog for remediation within 3-month window.

## Output Format

```
# Incident Classification Report

**Incident ID:** [INC-YYYYMMDD-001]
**Date Classified:** [YYYY-MM-DD HH:MM UTC]
**Reporter:** [Name, Title, Department]

---

## Summary

[1–2 sentence description of what happened]

---

## Classification

**Severity:** [CRITICAL / HIGH / MEDIUM / LOW]
**Rationale:** [Why this severity? Which matrix criteria apply?]

---

## Scope

- **Affected Users:** [Count or list; e.g., "47 customer accounts"]
- **Affected Systems:** [List; e.g., "Production PostgreSQL (users table), API Gateway auth service"]
- **Data Types Exposed:** [E.g., "Hashed passwords, email addresses, partial credit card numbers"]
- **Duration:** [T0 → T3; e.g., "Active for ~48 hours (2026-06-11 18:00 → 2026-06-13 14:00 UTC)"]
- **Containment Status:** [Ongoing / Contained / Isolated / Stopped]

---

## Timeline

| Time (UTC) | Event | Signal |
|---|---|---|
| 2026-06-11 18:00 | Attacker gains initial access | (Estimated; confirmed by log analysis) |
| 2026-06-13 14:22 | Anomaly detected | SIEM alert: 10K+ queries on customers table in 2 minutes |
| 2026-06-13 15:00 | Incident confirmed | Manual review; attacker accessed via compromised API key |
| 2026-06-13 15:45 | Containment | API key revoked; attacker account disabled; logs preserved |

---

## Response Plan Activated

**Activation Level:** [IMMEDIATE / URGENT / STANDARD / BACKLOG]

**Next Steps:**
1. [Action 1; owner; deadline]
2. [Action 2; owner; deadline]
3. [Action 3; owner; deadline]

**Escalation Path:**
- [Title]: [Name] — [Slack/Email]
- [Title]: [Name] — [Slack/Email]

---

**Investigation Owner:** [Name, Team]
**Incident Commander (if CRITICAL):** [Name, Team]
**Status:** CLASSIFIED → INVESTIGATION
```

## Example

**Incident:** Customer reports unauthorized access to their account. Support team escalates to security.

```
# Incident Classification Report

**Incident ID:** INC-20260613-001
**Date Classified:** 2026-06-13 15:30 UTC
**Reporter:** Sarah Chen, Support Lead

---

## Summary

Customer account accessed by unauthorized third party. Attacker used stolen credential to login and export customer data from that single account. Incident detected via customer report and email alert. Contained within 30 minutes of customer report.

---

## Classification

**Severity:** HIGH
**Rationale:** Single customer account (not 1000+) = not CRITICAL, but unauthorized account access + data export + no detection until customer reported = HIGH. Impact is data exposure for one customer, exploitability is easy (stolen password), deadline is 1 week for remediation.

---

## Scope

- **Affected Users:** 1 (customer account owner, email: customer@example.com)
- **Affected Systems:** Web application authentication, customer data export API
- **Data Types Exposed:** Customer's full order history, payment method (last 4 digits), shipping addresses (estimated 15 orders over 2 years)
- **Duration:** ~45 minutes (unauthorized access 2026-06-13 14:15 → containment 2026-06-13 15:00 UTC)
- **Containment Status:** Contained (customer password reset, attacker session terminated, data export logged)

---

## Timeline

| Time (UTC) | Event | Signal |
|---|---|---|
| ~2026-06-13 14:15 | Attacker logs in from IP 123.45.67.89 (country: RU) | Login from unusual location; email alert sent but not reviewed in time |
| 2026-06-13 14:35 | Attacker exports order data via API | Order history CSV exported; API log shows single query for all orders |
| 2026-06-13 14:50 | Customer discovers unauthorized login in account settings | Customer sees "Last login: 14:15 from Russia" |
| 2026-06-13 14:55 | Customer reports to support | Support escalates to security |
| 2026-06-13 15:00 | Incident confirmed, attacker session terminated | Password reset by customer; account locked for 30 min |

---

## Response Plan Activated

**Activation Level:** URGENT

**Next Steps:**
1. Notify customer: Confirm incident scope, advise to monitor credit cards; offer credit monitoring service — Marcus (Support) by EOD today
2. Forensic analysis: Was customer password weak/reused? Was credential from prior breach? — Alice (Security) by tomorrow
3. API audit: How did exfiltration happen? Can we detect bulk exports? — Platform team by Friday
4. Remediation: Add geofencing to login alerts; enable MFA by default; add rate limiting to export API — DevOps by 2026-06-20

**Escalation Path:**
- VP Security: Alice Park (alice@company.com)
- CTO: James Kumar (james@company.com)

---

**Investigation Owner:** Alice Park, Security Team
**Status:** CLASSIFIED → INVESTIGATION
```

---
