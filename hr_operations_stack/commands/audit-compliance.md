---
description: Scores people decisions against legal/compliance matrix. Identifies risks, recommends mitigation, and escalates to legal counsel if score <9. Returns audit document and decision recommendation.
---

# /audit-compliance [action-type]

## What This Does
Runs compliance-auditor skill to evaluate people decisions for legal and compliance risk. Scores against 4 dimensions (legal exposure, privacy, regulatory adherence, record retention), flags risks, and determines whether to PROCEED, REVIEW with counsel, or HOLD pending legal approval.

## Steps Claude Follows
1. Ask for: action type (hire, promotion, compensation change, termination, policy update), affected employee/role, proposed action details
2. Run compliance-auditor skill — score across 4 dimensions (1–3 pts each; max 12)
3. Assess legal exposure risk (discrimination, wage/hour, documentation gaps)
4. Check privacy/confidentiality (PII protection, access controls)
5. Verify regulatory adherence (EEOC, OSHA, DOL, state law)
6. Confirm record retention (documentation complete, audit trail clear)
7. Apply decision rule: PROCEED (≥10 pts), REVIEW (6–9 pts), HOLD (≤5 pts)
8. If REVIEW or HOLD, escalate to employment counsel (name required, legal review deadline)
9. If HOLD, build risk mitigation plan (requires legal sign-off before execution)
10. Save audit to compliance-audits/[action]-[date]-audit.md
11. Display summary: total score, decision (PROCEED/REVIEW/HOLD), required next steps

## Risk Factors to Check

### Legal Exposure
- Discrimination risk? (protected class, inconsistent application, documentation gaps)
- Wage/hour compliance? (proper classification, overtime calculation, minimum wage)
- Documented justification? (business case clear, not retaliatory)

### Privacy & Confidentiality
- PII protection? (encrypted, role-based access, consent tracking)
- Medical/health data? (separate secure storage, limited access)
- Data retention schedule? (destruction plan, GDPR/CCPA compliance)

### Regulatory Adherence
- EEOC compliance? (no discrimination, consistent process)
- OSHA/safety? (reasonable accommodations, ADA compliance)
- DOL/wage laws? (classification, overtime, minimum wage)
- State-specific? (notice requirements, contract enforceability, non-compete validity)

### Record Retention
- Personnel file complete? (offer letter, performance reviews, discipline records, signed forms)
- Termination/severance documented? (cause, justification, legal review, severance agreement)
- Performance trail clear? (prior feedback, improvement opportunities, documentation)

---

## Output Format

### Compliance Audit Report
```
# Compliance Audit: [Action Type]

## Decision Summary
- **Action:** [Termination, Compensation Change, Promotion, Policy Update, Hire]
- **Affected Employee/Role:** [Name, Title, or Job Title if new hire]
- **Proposed Action:** [Specific action being audited]
- **Business Rationale:** [Why this action is being taken]
- **Urgency:** [Timeline for decision]

## Compliance Scoring
**Total Score: [X] / 12 pts** → **Decision: [PROCEED / REVIEW / HOLD]**

### Dimension 1: Legal Exposure ([X] pts)
- Discrimination risk: [Low / Medium / High]
- Wage/hour compliance: [Compliant / At risk / Non-compliant]
- Documentation: [Complete / Incomplete / Missing]
- Assessment: [3 pts = clear justification, no risk | 2 pts = inconsistent, gaps | 1 pt = risk identified]

### Dimension 2: Privacy & Confidentiality ([X] pts)
- PII exposure: [Protected / Limited / Exposed]
- Data storage: [Encrypted / Unencrypted / Mixed]
- Access controls: [Role-based / Limited / Open]
- Assessment: [3 pts = full protection | 2 pts = partial protection | 1 pt = exposed data]

### Dimension 3: Regulatory Adherence ([X] pts)
- EEOC: [Compliant / Partial / Non-compliant]
- OSHA/ADA: [Compliant / Partial / Non-compliant]
- DOL/Wage: [Compliant / Partial / Non-compliant]
- State law: [Compliant / Partial / Non-compliant]
- Assessment: [3 pts = fully compliant | 2 pts = partial compliance | 1 pt = non-compliant]

### Dimension 4: Record Retention ([X] pts)
- Personnel file: [Complete / Incomplete / Missing]
- Discipline trail: [Documented / Partial / Missing]
- Severance docs: [Signed / Draft / Missing]
- Assessment: [3 pts = complete file, signed docs | 2 pts = incomplete records | 1 pt = missing critical docs]

## Decision Rule
- **PROCEED (≥10 pts):** Safe to implement; standard HR approval sufficient; no legal review required
- **REVIEW (6–9 pts):** Escalate to employment counsel; require legal sign-off before action
- **HOLD (≤5 pts):** Do not proceed without legal review and risk mitigation plan; board/CEO approval if applicable

## Risk Assessment
[If REVIEW or HOLD: identify top 3 legal/compliance risks; likelihood; impact if action taken]

## Mitigation Plan (if REVIEW or HOLD)
- **Risk 1:** [Risk description] → **Mitigation:** [Specific action to reduce risk]
- **Risk 2:** [Risk description] → **Mitigation:** [Specific action to reduce risk]
- **Risk 3:** [Risk description] → **Mitigation:** [Specific action to reduce risk]

## Legal Review Status
- **Escalated to Counsel:** [Yes / No]
- **Counsel Name:** [If escalated]
- **Review Deadline:** [Target approval date]
- **Sign-off Received:** [Yes / No / Pending]

## Approval Chain (if HOLD)
- [ ] HR Leadership approval
- [ ] Legal Counsel sign-off
- [ ] CFO approval (if compensation/severance)
- [ ] CEO/Board approval (if mass layoff/restructuring)

## Documentation Checklist (if PROCEED)
- [ ] Business justification documented
- [ ] Prior feedback/documentation complete
- [ ] Decision log entry created
- [ ] Employee notification prepared
- [ ] Records filed appropriately

## Execution Plan
- **Timing:** [When action will be taken]
- **Communication:** [Who will inform employee; script if applicable]
- **Follow-up:** [Legal holds, payroll processing, benefits continuation, etc.]
- **Documentation:** [Where records will be retained; retention schedule]

## Approval Sign-off
- **Audited by:** [Claude + HR lead names]
- **Legal Review:** [Counsel name / Not required]
- **Final Approval:** [HR Director, CFO, or CEO signature]
- **Date Approved:** [Approval date]
```

### Decision Logic Examples
```
TERMINATION FOR CAUSE (Performance):
- Legal exposure: 3 pts (documented performance history, clear cause, no discrimination risk)
- Privacy: 3 pts (personnel file secure, limited access)
- Regulatory: 3 pts (EEOC compliant, clear documentation)
- Record retention: 2 pts (performance file complete, but severance agreement draft only)
- **Total: 11 pts → PROCEED** (Draft severance agreement; execute before termination meeting)

COMPENSATION CUT (Restructuring):
- Legal exposure: 2 pts (wage reduction may trigger disputes; inconsistent across roles)
- Privacy: 3 pts (payroll data encrypted)
- Regulatory: 2 pts (state law on compensation changes unclear; needs verification)
- Record retention: 3 pts (documentation complete)
- **Total: 10 pts → PROCEED** (But verify state law; recommend counsel review before implementation)

TERMINATION WITHOUT CAUSE (RIF):
- Legal exposure: 2 pts (need to verify WARN Act compliance, no age bias in selections)
- Privacy: 2 pts (mass notifications; limited PII protection)
- Regulatory: 2 pts (DOL WARN Act notice required; state unemployment coordination needed)
- Record retention: 2 pts (severance packages drafted, but legal review pending)
- **Total: 8 pts → REVIEW** (Escalate to counsel: WARN Act timeline, age bias audit, severance approval)

TERMINATION WITH POTENTIAL DISPUTE:
- Legal exposure: 1 pt (discrimination risk, retaliation risk, documentation gaps)
- Privacy: 1 pt (sensitive data, limited security)
- Regulatory: 1 pt (state law unfamiliar; possible wage dispute)
- Record retention: 1 pt (incomplete prior feedback; informal documentation)
- **Total: 4 pts → HOLD** (Do not proceed without legal review and full risk mitigation plan)
```

---
