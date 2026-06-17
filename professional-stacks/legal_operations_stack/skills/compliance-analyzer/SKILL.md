# Skill: Compliance Analyzer

Validate a document against legal and regulatory frameworks (GDPR, SOC 2, ISO 27001, or custom).

---

## When to activate

When user runs `/compliance-check` or requests regulatory validation on a contract or agreement.

---

## When NOT to use

- Do not use for compliance advice beyond document validation.
- Do not use to generate compliance strategy or audit plans.
- Do not make final compliance determinations — surface gaps and let human decide remediation priority.

---

## Instructions

1. **Confirm the regulatory framework:**
   - GDPR (EU data protection)
   - SOC 2 Type II (SaaS/service provider security)
   - ISO 27001 (information security management)
   - CUSTOM (user-defined requirements)

2. **For GDPR, validate:**
   - Is lawful basis for processing stated? (contract, consent, legitimate interest, etc.)
   - Are data subject rights (access, erasure, portability) preserved?
   - Are sub-processors and data processing agreements required?
   - Is data retention limit defined?
   - Is privacy notice required?

3. **For SOC 2 Type II, validate:**
   - Does contract reference Security, Availability, or Confidentiality controls?
   - Are processing integrity obligations defined?
   - Does it require security controls attestation (SOC 2 report)?
   - Does it specify incident notification timeframe?
   - Are audit and monitoring rights reserved?

4. **For ISO 27001, validate:**
   - Are information security requirements clearly defined?
   - Are access controls specified?
   - Are encryption standards mandated?
   - Are audit rights and monitoring requirements included?
   - Are asset management obligations stated?

5. **For CUSTOM, validate against user-provided checklist:**
   - Check each requirement in sequence.
   - Note where evidence appears in document.
   - Flag gaps and required remediation.

6. **Return checklist:**
   - PASS: Requirement met with evidence
   - CONDITIONAL: Requirement partially met or requires clarification
   - FAIL: Requirement not met or contradicted

7. **Score overall compliance:**
   - COMPLIANT: 100% of requirements pass
   - CONDITIONAL: Some requirements need clarification or modification
   - NON-COMPLIANT: Multiple requirements fail; escalate

8. **Log to session-log.md** with compliance status and remediation items.

---

## Example

Input: Vendor agreement, GDPR framework

Output:
```
## Compliance Check: Vendor Agreement

**Framework:** GDPR
**Overall Status:** CONDITIONAL
**Date Checked:** 2026-06-13

### Compliance Checklist

#### PASS
- Lawful basis stated (contract for services) — Evidence: Section 2.1
- Sub-processor clause included — Evidence: Section 5.3
- Data retention limit (30 days post-termination) — Evidence: Section 4.2

#### CONDITIONAL (Requires Remediation)
- Data subject rights (access, erasure, portability) — Current State: Access/erasure defined, portability missing — Remediation: Add portability language to Section 3

#### FAIL
- Privacy notice provision — Current State: Not mentioned — Remediation: Add privacy notice requirement referencing vendor's published policy

### Summary
- Total Requirements: 6
- Passing: 3
- Conditional: 2
- Failing: 1

### Recommended Actions
1. Request vendor add data portability language to Section 3
2. Request vendor reference privacy notice in contract
3. Run full SOC 2 compliance check after amendments
```

---

## Related Skills

- `contract-reviewer` — Extract and analyze key contract terms
- `risk-extractor` — Identify specific risk categories
- `document-draftor` — Generate compliant agreements
