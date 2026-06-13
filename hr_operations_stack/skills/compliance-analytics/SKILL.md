---
name: compliance-auditor
description: Scores people decisions against legal/compliance matrix. Identifies legal risks, flags documentation gaps, and recommends mitigation. Escalates high-risk decisions to counsel.
allowed-tools: Read, Write
effort: high
---

# Compliance Auditor

## When to activate

Termination planned, compensation change made, policy updated, or significant people decision pending. Triggers: severance, reduction in force, promotion, title change, remote work policy.

## When NOT to use

Not a substitute for employment counsel advice. Not for negotiating legal disputes. Always escalate high-risk decisions to legal.

## Compliance Scoring Matrix

Score each decision across 4 dimensions (1–3 pts each; max 12):

### 1. Legal Exposure (1–3 pts)
- **3 pts:** Clear business justification; no discrimination risk; documented reasoning
- **2 pts:** Inconsistent policy application; incomplete documentation; isolated edge case
- **1 pt:** Discrimination risk; wage/hour violation concern; missing critical documentation

### 2. Privacy/Confidentiality (1–3 pts)
- **3 pts:** No PII shared; encrypted data; role-based access controls in place
- **2 pts:** Minimal PII exposure; unencrypted internal communications only; limited recipient list
- **1 pt:** Personal health/medical data exposed; uncontrolled PII sharing; no access controls

### 3. Regulatory Adherence (1–3 pts)
- **3 pts:** Fully EEOC/OSHA/DOL/state compliant; audit trail maintained; legal review signed off
- **2 pts:** Partial compliance; documentation gaps; state law variance unfamiliar
- **1 pt:** Non-compliant with federal/state law; regulatory violation risk; no legal guidance

### 4. Record Retention (1–3 pts)
- **3 pts:** Complete file; signed acknowledgments; retention schedule met
- **2 pts:** Incomplete records; informal documentation; gaps in severance/discipline trail
- **1 pt:** Missing termination/discipline documentation; no personnel file; no retention schedule

**Decision Rule:**
- **PROCEED (≥10 pts):** Safe to implement; standard approval sufficient
- **REVIEW (6–9 pts):** Escalate to employment counsel; require legal sign-off
- **HOLD (≤5 pts):** Do not proceed without legal review and risk mitigation plan

---

## Risk Mitigation Checklist

### High-Risk Decisions
- [ ] Legal counsel review completed (name, date)
- [ ] Risk mitigation plan documented (e.g., severance, documentation, communication script)
- [ ] Board/CFO/CEO approval obtained (if applicable)
- [ ] Documentation complete before execution
- [ ] Communication plan approved by counsel

### Documentation Requirements
- **Termination:** Performance history, prior warnings, business justification, severance terms
- **Compensation change:** Market data, documented review, approval (CFO), equity terms
- **Policy update:** Legal review, affected employee notice, acknowledgment, compliance date
- **Promotion/demotion:** Performance justification, career conversation, documentation, approval

---

## Output Format

```
# Compliance Audit: [Action Type]

## Decision Summary
[What is being proposed; business case; affected employee/role]

## Compliance Scoring
[Score per dimension (1–3 pts each); total score (≤12); decision rule]

## Risk Assessment
[Top legal/compliance risks identified; likelihood; impact]

## Mitigation Plan
[Specific actions to reduce risk; timeline; owner]

## Legal Review Status
[Escalated to counsel? [Y/N]; counsel sign-off [Y/N]; counsel name]

## Approval Chain
[HR approval, CFO approval if applicable, Board approval if applicable, Legal sign-off]

## Documentation Checklist
[Required documents prepared, signed, filed]

## Execution Plan
[Timeline, communication, stakeholder notification]
```

---
