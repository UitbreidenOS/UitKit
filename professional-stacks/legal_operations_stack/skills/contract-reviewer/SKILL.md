# Skill: Contract Reviewer

Analyze a contract to extract key terms, identify risks, flag obligations, and surface renewal dates.

---

## When to activate

When user runs `/contract-review` or uploads a new contract for intake.

---

## When NOT to use

- Do not use for legal strategy advice or litigation support.
- Do not use for tax, employment law, or M&A-specific analysis.
- Do not make final recommendations on whether to sign — surface risks and let human decide.

---

## Instructions

1. **Fetch or read the contract document** — Extract all text into structured format.

2. **Identify parties, effective dates, and renewal terms:**
   - Effective Date (YYYY-MM-DD)
   - Renewal Date (YYYY-MM-DD)
   - Notice Period (X days before renewal)
   - Auto-renewal flag (yes/no)
   - Termination conditions

3. **Extract key financial terms:**
   - Total value / payment schedule
   - Payment terms (net 30/60/90)
   - Penalty clauses
   - Liability caps (if any)
   - Indemnification scope

4. **Extract operational obligations:**
   - Service levels (if applicable)
   - Reporting requirements
   - Data handling/privacy requirements
   - Insurance requirements
   - Audit rights

5. **Identify high-risk clauses:**
   - Unlimited liability
   - Auto-renewal without notice
   - Broad indemnification
   - IP ownership restrictions
   - Non-compete or exclusivity
   - Unilateral termination rights

6. **Score risks:**
   - HIGH: Unlimited liability, IP loss, non-compliance, broad indemnification
   - MEDIUM: Unequal termination, extended notice, unusual payment terms
   - LOW: Non-standard language, minor ambiguities

7. **Return structured risk summary** with remediation steps.

8. **Log to session-log.md** with action timestamp.

---

## Example

Input: SaaS agreement PDF

Output:
```
## Contract Review: Example SaaS Agreement

**Parties:** Your Company, SaaS Vendor Inc.
**Effective Date:** 2024-06-01
**Renewal Date:** 2026-06-01
**Notice Period:** 60 days before renewal
**Auto-Renewal:** Yes

### Key Obligations
- Maintain 99.5% uptime SLA
- Quarterly compliance reports
- Annual security audit (SOC 2)
- Data retention: 30 days post-termination

### Identified Risks

#### HIGH
- Unlimited vendor indemnification scope — Impact: Unlimited liability exposure — Remediation: Cap at annual contract value

#### MEDIUM
- 60-day notice period for renewal opt-out — Impact: Requires advance planning — Remediation: Add calendar alert at day 120

#### LOW
- Non-standard payment schedule (quarterly) — Impact: Minor accounting variance — Remediation: Proceed with standard terms

### Next Steps
1. Request indemnification cap amendment
2. Add renewal reminder to deadline tracker (due 2025-04-01)
3. Schedule SOC 2 audit for Q1 2026
```

---

## Related Skills

- `risk-extractor` — Deep dive on specific risk categories
- `compliance-analyzer` — Validate against regulatory frameworks
- `deadline-tracker` — Track renewal dates and milestones
