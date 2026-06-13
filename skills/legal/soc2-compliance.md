---
name: soc2-compliance
description: "SOC 2 compliance: Trust Service Criteria mapping, control matrix, gap analysis, evidence collection, Type I vs Type II readiness, and audit preparation for SaaS companies"
updated: 2026-06-13
---

# SOC 2 Compliance Skill

## When to activate
- Preparing for a SOC 2 Type I or Type II audit
- Mapping controls to Trust Service Criteria (Security, Availability, Confidentiality, etc.)
- Running a gap analysis before engaging an auditor
- Building an evidence collection process for the observation period
- Deciding which Trust Service Criteria to include in your scope
- Responding to enterprise customers asking "do you have SOC 2?"

## When NOT to use
- GDPR or privacy compliance — use the gdpr-expert skill
- ISO 27001 certification — different standard, different audit process
- HIPAA compliance — requires a specialist
- After your audit is complete and you just need to maintain controls — that's ongoing GRC work

## Instructions

### SOC 2 readiness assessment

```
Assess our SOC 2 readiness for [Type I / Type II].

Company: [SaaS / cloud infrastructure / managed service]
Target audit date: [X months away]
Trust Service Criteria selected: [Security (required) + which optional: Availability / Confidentiality / Processing Integrity / Privacy]
Current security maturity: [none / basic / intermediate / advanced]

Type I vs Type II — choose based on:
Type I: Design of controls at a point in time
  - Best for: first SOC 2, rapid enterprise sales need, 1-2 month audit phase
  - Cost: $20K-$50K auditor fees
  - Does NOT prove controls operate effectively over time

Type II: Design + operating effectiveness over observation window (min 6 months)
  - Best for: enterprise customers demanding Type II, mature programs
  - Cost: $30K-$100K+ auditor fees
  - Evidence must cover the full observation period

Readiness gap analysis by domain:

SECURITY (CC1-CC9 — required):

CC6 — Logical and Physical Access (most failed criterion):
□ Multi-factor authentication on all production systems
□ Formal access provisioning and de-provisioning process (joiner/mover/leaver)
□ Quarterly access reviews documented with evidence
□ No shared credentials in production
□ Privileged access management (PAM) or documented privilege justification

CC7 — System Operations:
□ Vulnerability scanning in place (at least quarterly)
□ Patch management process with documented SLA (critical: X days, high: Y days)
□ Intrusion detection / anomaly alerting configured
□ Incident response plan documented and tested

CC8 — Change Management:
□ All production changes go through a documented approval process
□ Code review required before deployment
□ Separation of duties: developer cannot deploy to production without approval
□ Emergency change process documented

CC9 — Risk and Vendor Management:
□ Risk assessment conducted and documented (at least annually)
□ Vendor inventory with security classification
□ Critical vendors have their own SOC 2 or equivalent

AVAILABILITY (A1 — if in scope):
□ Uptime monitoring with alerting
□ Disaster recovery plan documented and tested (RTO/RPO defined)
□ Backup procedures with tested restoration
□ Capacity planning process

Rate each control: ✅ In place / 🟡 Partial / 🔴 Gap

Output: gap register with priority ranking and estimated effort to remediate.
```

### Control matrix

```
Build a SOC 2 control matrix for [company].

Trust Service Criteria in scope: [list]
Current controls: [describe what you have in place]

Control matrix format (one row per control):

| Control ID | TSC Mapping | Control Description | Control Type | Owner | Evidence | Status |
|---|---|---|---|---|---|---|
| CC6.1-01 | CC6.1 | MFA is required for all users accessing production systems | Preventive / Technical | CISO | Authentication logs, MFA policy doc | Implemented |
| CC6.2-01 | CC6.2 | Access provisioning follows the documented IAM process | Preventive / Administrative | IT | IAM tickets, onboarding checklist | Implemented |
| CC7.2-01 | CC7.2 | Vulnerability scans run weekly; critical findings patched within 30 days | Detective / Technical | Engineering | Scan reports, patch tickets | Partial |

Control types:
- Preventive: prevents the risk from occurring (MFA, access controls)
- Detective: detects when a risk has occurred (logging, monitoring, reviews)
- Corrective: corrects after detection (incident response, patch management)

Control frequency (matters for Type II evidence):
- Continuous: automated controls running at all times (WAF, encryption)
- Daily: log reviews, automated monitoring checks
- Weekly: vulnerability scans, backup verification
- Monthly: access reviews (if monthly), patch reports
- Quarterly: access reviews (if quarterly), risk review
- Annual: risk assessment, DR test, security training

For Type II: every control needs at least one sample of evidence per period.
For quarterly controls over 6 months: need evidence from 2 quarters.
For annual controls: one instance covers a 12-month period.

Generate the full control matrix for my criteria and controls.
```

### Evidence collection guide

```
Plan evidence collection for [SOC 2 Type II observation period].

Observation period: [start date] to [end date] (typically 6-12 months)
Trust Service Criteria: [list]
Auditor: [if known]

Evidence collection by control frequency:

CONTINUOUS CONTROLS (collect periodic samples):
□ Encryption at rest: screenshot of storage configuration, KMS/certificate settings
□ Firewall / WAF rules: export of current ruleset (start of period + any changes)
□ Intrusion detection: active status screenshot, alert configuration

DAILY / EVENT-DRIVEN (collect samples covering full period):
□ Failed login alerts: export logs showing alerts firing and being reviewed
□ Privilege escalation events: export showing approvals or denials
□ System changes: change management tickets for major infrastructure changes

WEEKLY (one sample per month minimum):
□ Vulnerability scan results: one report per week/month (cover full period)
□ Backup verification: backup run logs and one tested restoration

MONTHLY / QUARTERLY (one sample per occurrence):
□ Access reviews: exported list reviewed + approvals/revocations documented
□ Security patches: patch management report showing critical patches applied
□ Vendor reviews: any vendor security reviews completed

ANNUAL (once per audit period):
□ Risk assessment: completed risk register with sign-off
□ Disaster recovery test: DR test report with results
□ Security awareness training: completion records for all staff
□ Business continuity plan review: documented review and sign-off

Evidence naming convention (makes auditor's job easier):
[Control-ID]_[Frequency]_[YYYY-MM]_[description]
Example: CC6.2-01_quarterly_2026-Q1_access-review-export.csv

Evidence storage: create a shared folder per criterion → sub-folder per control → chronological evidence files.

Generate the evidence collection calendar for my observation period.
```

### Auditor readiness checklist

```
Prepare for the SOC 2 audit fieldwork.

Audit type: [Type I / Type II]
Auditor: [firm name if known]
Fieldwork date: [date range]

Pre-audit preparation (4-6 weeks before):

DOCUMENTATION:
□ System description written and reviewed (the narrative document auditors base everything on)
□ Control matrix finalized with owner sign-off
□ Policy library complete: information security policy, access control policy, change management policy, incident response policy, vendor management policy, backup and recovery policy
□ Org chart showing security-relevant roles

EVIDENCE:
□ All evidence labelled and organized by control
□ Evidence gaps identified and explained (or remediated)
□ No "draft" policies — all must be approved and in effect

PERSONNEL:
□ Control owners briefed on their controls and evidence
□ They know: what the control does, how often it runs, where the evidence is
□ Point of contact for auditor questions assigned per domain

SYSTEMS ACCESS:
□ Auditor given read-only access to: SIEM, ticketing system, HR system (for access reviews), cloud console (read-only)
□ Screen share setup for walkthroughs if remote audit

COMMON AUDITOR QUESTIONS (prepare answers):
- "Walk me through what happens when a new employee joins" (joiner process + evidence)
- "What happens when an employee leaves?" (leaver process, access revocation SLA)
- "Show me how a production change gets approved" (change management evidence)
- "How would you know if your data was breached?" (monitoring + incident response)
- "Who has access to production data?" (access list + last review date)

Produce audit readiness checklist for my company size and criteria.
```

## Example

**User:** An enterprise prospect is asking us for SOC 2 Type II. We've never done it. We're a 15-person SaaS company. Where do we start?

**Claude's practical roadmap:**

For a 15-person SaaS company, a Type II typically takes 12-18 months total. Here's the realistic path:

**Month 1-2 — Gap assessment:**
Run the control checklist above. The #1 gap for startups is almost always: no formal access review process, no documented change management, and MFA not enforced on everything. Get these three right first.

**Month 2-4 — Remediation:**
Priority fixes (80% of what auditors check):
- Enforce MFA everywhere in production (1 week)
- Document your joiner/mover/leaver process and run it for real (2 weeks)
- Start quarterly access reviews and document them with screenshots (ongoing)
- Write 5 core policies: security, access control, incident response, change management, vendor management (2 weeks — templates exist)
- Set up vulnerability scanning (Snyk, Wiz, or even free tools)

**Month 4-6 — Start observation period:**
Engage your auditor NOW, not after. Tell them you're starting the observation period. They set the start date. Your evidence collection begins day 1.

**Month 4-10 — Operate controls with evidence:**
Every control runs, every piece of evidence is captured and filed. This is the unglamorous part — quarterly access review? Screenshot it. Vulnerability scan? Download the report. Weekly backup test? Log it.

**Month 10-12 — Audit fieldwork:**
Auditor reviews your evidence, interviews control owners, issues the report.

**Realistic cost at 15 people:**
- Auditor fees: $30-60K for a small firm (Prescient Assurance, A-LIGN, etc. specialize in startup-scale SOC 2)
- Compliance tooling: $0 (manual) to $15K/year (Vanta, Drata, Secureframe — automate evidence collection)
- Internal time: 1 engineer part-time for 3 months

**Shortcut:** Use Vanta or Drata. For $8-15K/year, they automate 80% of evidence collection by connecting directly to AWS, GitHub, Google Workspace, etc. Worth it for a first SOC 2 to avoid manual evidence overhead.

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
