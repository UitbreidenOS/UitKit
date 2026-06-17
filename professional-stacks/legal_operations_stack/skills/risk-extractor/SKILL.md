# Skill: Risk Extractor

Identify and flag high-risk clauses and terms in contracts. Surface liability, IP, indemnification, renewal, and termination risks.

---

## When to activate

On contract upload or when deeper risk analysis is needed beyond standard contract review.

---

## When NOT to use

- Do not use for legal strategy or litigation analysis.
- Do not make final risk determinations — surface risks and let human assess business impact.

---

## Instructions

1. **Extract payment terms:**
   - Payment schedule and amounts
   - Payment terms (net 30/60/90)
   - Late payment penalties or interest
   - Currency and payment method
   - Flag: Early termination payment penalties

2. **Extract liability and indemnification:**
   - Liability caps (if any) — flag if unlimited
   - Indemnification scope (who indemnifies whom for what)
   - Consequential damages exclusions
   - Flag: Asymmetric indemnification (one party broadly liable)

3. **Extract IP and data ownership:**
   - IP ownership of created work
   - License grants (scope and duration)
   - Data ownership and handling
   - Flag: Vendor claims ownership of client data or improvements

4. **Extract termination and renewal:**
   - Renewal conditions and dates
   - Notice period for non-renewal
   - Termination for cause conditions
   - Termination for convenience (if allowed)
   - Survival clauses (post-termination obligations)
   - Flag: Auto-renewal with silent renewal
   - Flag: Unilateral termination rights

5. **Extract compliance and audit:**
   - Regulatory compliance obligations
   - Audit rights and inspection clauses
   - Security and data handling requirements
   - Insurance requirements
   - Flag: Audit rights limited to vendor's discretion

6. **Score each risk:**

| Risk Category | HIGH | MEDIUM | LOW |
|---|---|---|---|
| **Liability** | Unlimited | Capped above value | Capped, reasonable |
| **Indemnification** | Broad, asymmetric | Balanced, scope limits | Mutual, defined |
| **IP Ownership** | Vendor owns client IP | Unclear ownership | Client retains IP |
| **Renewal** | Auto-renewal, silent | Long notice period | Clear opt-out process |
| **Termination** | Only vendor can terminate | Unequal notice periods | Mutual termination rights |
| **Compliance** | No audit rights | Limited audit | Full audit rights |

7. **Return risk matrix:**
   - HIGH risks with business impact and remediation
   - MEDIUM risks with context
   - LOW risks noted but not blocking

8. **Log to session-log.md** with risk summary.

---

## Example

Input: 3-year SaaS agreement

Output:
```
## Risk Extraction: SaaS Agreement

### HIGH Risks (Requires Modification)
1. **Unlimited Liability** — Section 8.2 removes all liability caps for vendor breaches
   - Impact: Exposure unlimited to vendor negligence
   - Remediation: Cap at 12 months of annual fees

2. **Auto-Renewal with 90-Day Notice** — Section 9.1 auto-renews unless notice sent 90 days prior
   - Impact: Risk of unwanted renewal if internal notice process fails
   - Remediation: Request 60-day notice period or explicit renewal approval

3. **Vendor IP Ownership** — Section 6.1 grants vendor rights to client-created improvements
   - Impact: Loss of IP rights to customizations
   - Remediation: Limit to vendor's technology only; client retains custom development IP

### MEDIUM Risks (Request Modification)
1. **Unilateral Termination for Convenience** — Section 10.2 allows vendor to terminate with 90 days notice
   - Impact: Business continuity risk if vendor exits
   - Remediation: Request mutual termination rights or 180-day notice for client

2. **Broad Indemnification** — Section 7.1 requires client to indemnify vendor for all IP claims
   - Impact: Client liable for vendor product IP infringement
   - Remediation: Limit to client-provided materials; exclude vendor product indemnification

### LOW Risks (Noted for Context)
1. **Quarterly Reporting Requirement** — Section 11.3 requires monthly usage reports
   - Impact: Minor administrative burden
   - Remediation: Acceptable; proceed with standard terms

### Risk Summary
- Total identified: 6
- HIGH: 3 (recommend modifications before signature)
- MEDIUM: 2 (request amendments; document any accepted risks)
- LOW: 1 (no action required)
```

---

## Related Skills

- `contract-reviewer` — Full contract analysis and term extraction
- `compliance-analyzer` — Regulatory compliance validation
- `deadline-tracker` — Track renewal and termination dates
