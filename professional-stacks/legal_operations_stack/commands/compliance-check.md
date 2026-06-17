# Command: /compliance-check

Validate document against legal and regulatory frameworks (GDPR, SOC 2, ISO 27001, or custom).

---

## Syntax

```
/compliance-check [document-url-or-file-path] [framework: GDPR|SOC2|ISO27001|CUSTOM]
```

---

## What It Does

1. Reads the document
2. Validates against the specified regulatory framework
3. Returns checklist with pass/fail per requirement
4. Surfaces non-compliance items with remediation steps
5. Returns overall compliance status: COMPLIANT / CONDITIONAL / NON-COMPLIANT
6. Logs action to session-log.md

---

## Output Format

```
## Compliance Check: [Document Name]

**Framework:** [GDPR / SOC 2 / ISO 27001 / CUSTOM]
**Overall Status:** [COMPLIANT / CONDITIONAL / NON-COMPLIANT]
**Date Checked:** [YYYY-MM-DD HH:MM]

### Compliance Checklist

#### PASS
- [Requirement] — Evidence: [where found in document]
- [Requirement] — Evidence: [where found in document]

#### CONDITIONAL (Requires Remediation)
- [Requirement] — Current State: [gap description] — Remediation: [action needed]
- [Requirement] — Current State: [gap description] — Remediation: [action needed]

#### FAIL
- [Requirement] — Current State: [gap description] — Remediation: [action needed]
- [Requirement] — Current State: [gap description] — Remediation: [action needed]

### Summary
- Total Requirements: [X]
- Passing: [X]
- Conditional: [X]
- Failing: [X]

### Recommended Actions
1. [Action 1]
2. [Action 2]
3. [Action 3]
```

---

## Supported Frameworks

### GDPR
- Lawful basis for processing
- Data subject rights (access, erasure, portability)
- Sub-processor requirements
- Data retention limits
- Privacy notice requirements

### SOC 2 Type II
- Confidentiality controls
- Availability commitments
- Processing integrity
- Security controls attestation
- Incident notification obligations

### ISO 27001
- Information security requirements
- Access controls
- Encryption standards
- Audit and monitoring rights
- Asset management obligations

### CUSTOM
Define your organization's specific compliance requirements in the session before running this check.

---

## Example

```
/compliance-check https://contracts.example.com/vendor-agreement.pdf GDPR
```

---

## Related Commands

- `/contract-review` — Analyze contract for risks and obligations
- `/deadline-tracker` — Surface all contract renewals and key dates
