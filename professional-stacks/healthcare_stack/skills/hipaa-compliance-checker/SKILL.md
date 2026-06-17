---
name: hipaa-compliance-checker
description: Evaluates systems, workflows, and data handling practices against HIPAA Privacy and Security Rules. Outputs a compliance gap analysis with risk-rated findings, remediation steps, and required documentation checklist.
allowed-tools: Read, Write
effort: high
---

# HIPAA Compliance Checker

## When to activate
When designing any system that handles PHI, before onboarding a new vendor (BAA review), during annual compliance assessments, or when an incident occurs. Use for software systems, data pipelines, telehealth platforms, and analytics environments.

## When NOT to use
Skip for systems that only handle de-identified data (verified via Safe Harbor or Expert Determination method), publicly available health statistics, or when a full compliance audit was completed within the last 90 days on the same system.

## Instructions

1. **Scope determination:**
   - What PHI is collected, stored, transmitted, or displayed?
   - Which systems, databases, and applications touch PHI?
   - Who has access (roles, not individuals)?
   - Are all Business Associate Agreements (BAAs) in place?

2. **Privacy Rule assessment:**
   - Minimum necessary: Is PHI access limited to what's needed?
   - Patient rights: Access, amendment, accounting of disclosures
   - Notice of Privacy Practices (NPP) current and distributed?
   - Authorization requirements: Treatment, payment, operations vs. other uses

3. **Security Rule assessment:**
   - **Administrative:** Risk analysis, workforce training, incident response plan
   - **Physical:** Facility access, workstation security, device disposal
   - **Technical:** Access controls, audit logs, encryption (at rest + in transit), integrity controls

4. **Risk rating for each finding:**
   - CRITICAL: Active breach risk, immediate remediation required
   - HIGH: Significant gap, remediate within 30 days
   - MEDIUM: Moderate gap, remediate within 90 days
   - LOW: Minor improvement, address in next review cycle

## Output Format

```
HIPAA COMPLIANCE ASSESSMENT: [System/Workflow name]
DATE: [date] | ASSESSOR: [name]
SCOPE: [PHI types, systems, user roles]

BAAs: [All in place / Missing: list]

FINDINGS:
| # | Category | Finding | Risk | Remediation | Due Date |
|---|----------|---------|------|-------------|----------|

SUMMARY:
  Critical: [X] | High: [X] | Medium: [X] | Low: [X]
  Overall risk: [Critical/High/Medium/Low]

REQUIRED DOCUMENTATION:
  - [ ] Risk analysis (annual)
  - [ ] Policies and procedures (updated)
  - [ ] Workforce training records
  - [ ] Incident response plan (tested)
  - [ ] BAAs (executed, current)
  - [ ] Audit log review (quarterly)
```

## Example

```
HIPAA COMPLIANCE ASSESSMENT: Patient Portal v3.0
DATE: 2026-06-13 | ASSESSOR: Compliance Team
SCOPE: Demographics, lab results, medications, visit notes | PostgreSQL + React frontend | Patient + clinician roles

BAAs: Missing — cloud hosting provider (AWS) BAA not executed

FINDINGS:
| # | Category     | Finding                              | Risk     | Remediation                          | Due Date |
|---|--------------|--------------------------------------|----------|--------------------------------------|----------|
| 1 | Technical    | No encryption at rest on PostgreSQL  | CRITICAL | Enable AES-256 encryption            | 2026-06-28 |
| 2 | Admin        | BAA missing for AWS hosting          | HIGH     | Execute BAA with AWS                 | 2026-07-13 |
| 3 | Technical    | Audit logs retained only 30 days     | MEDIUM   | Extend to 6 years per state law      | 2026-09-13 |
| 4 | Privacy      | NPP not updated since 2023           | LOW      | Review and update NPP                | 2026-12-13 |

SUMMARY:
  Critical: 1 | High: 1 | Medium: 1 | Low: 1
  Overall risk: Critical — unencrypted PHI at rest

REQUIRED DOCUMENTATION:
  - [x] Risk analysis (annual) — completed 2026-03
  - [ ] Policies and procedures — needs update for v3.0
  - [ ] Workforce training records — 3 staff overdue
  - [ ] Incident response plan — last test: 2025-08 (overdue)
  - [ ] BAAs — AWS BAA pending
  - [ ] Audit log review — Q2 review not started
```
