# Command: /contract-review

Analyze a contract for risks, obligations, renewal dates, and compliance gaps.

---

## Syntax

```
/contract-review [contract-url-or-file-path]
```

---

## What It Does

1. Fetches or reads the contract document
2. Extracts key terms, dates, obligations, and parties
3. Identifies risks (payment terms, IP ownership, termination, renewal)
4. Surfaces renewal dates and notice periods
5. Returns structured risk summary with remediation steps
6. Logs action to session-log.md

---

## Output Format

```
## Contract Review: [Contract Name]

**Parties:** [Party A, Party B]
**Effective Date:** [YYYY-MM-DD]
**Renewal Date:** [YYYY-MM-DD]
**Notice Period:** [X days before renewal]

### Key Obligations
- [Obligation 1]
- [Obligation 2]
- [Obligation 3]

### Identified Risks

#### HIGH
- [Risk 1] — Impact: [business impact] — Remediation: [action]
- [Risk 2] — Impact: [business impact] — Remediation: [action]

#### MEDIUM
- [Risk 1] — Impact: [business impact] — Remediation: [action]

#### LOW
- [Risk 1] — Impact: [business impact] — Remediation: [action]

### Compliance Gaps
- [Gap 1] — Framework: [GDPR/SOC 2/ISO 27001] — Remediation: [action]

### Next Steps
1. [Step 1]
2. [Step 2]
3. [Step 3]
```

---

## Example

```
/contract-review https://contracts.example.com/saas-agreement-2024.pdf
```

---

## Related Commands

- `/compliance-check` — Validate document against regulatory framework
- `/deadline-tracker` — Surface all contract renewals and key dates
