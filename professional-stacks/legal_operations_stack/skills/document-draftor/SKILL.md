# Skill: Document Draftor

Generate legal agreements from templates with variable substitution and compliance validation.

---

## When to activate

When user runs `/draft-agreement` or requests a new agreement be created from a template.

---

## When NOT to use

- Do not use for novel legal structures or complex custom agreements.
- Do not draft agreements without explicit user request or regulatory validation.
- Do not bypass compliance checks — all drafts must pass compliance validation before release.

---

## Instructions

1. **Request agreement details:**
   - Agreement type (NDA, SLA, MSA, License, etc.)
   - Parties (names, addresses, legal entities)
   - Effective date
   - Key terms (duration, fees, renewal, termination)
   - Any special clauses or requirements

2. **Select or request template:**
   - Use organization's standard template for agreement type
   - If no template, request user provide one or confirm framework
   - Document template source

3. **Variable substitution:**
   - Replace all placeholders with actual values
   - Format all dates as ISO 8601 (YYYY-MM-DD)
   - Ensure consistency across all references (e.g., party names)
   - Use proper legal formatting (section numbering, table of contents)

4. **Add required compliance clauses:**
   - If data processing: GDPR Data Processing Agreement language
   - If security-critical: SOC 2 Type II compliance clauses
   - If information security: ISO 27001 controls reference
   - Unsubscribe/opt-out language (if applicable)

5. **Validate compliance:**
   - Run compliance check on draft before presenting
   - Flag any regulatory gaps or required amendments
   - Return compliance status: COMPLIANT / CONDITIONAL / NON-COMPLIANT

6. **Format final draft:**
   - Professional legal document formatting
   - Clear section numbering and cross-references
   - Signature blocks for all parties
   - Appendices for exhibits or schedules

7. **Present for human review:**
   - Show draft with compliance status
   - Highlight key terms and dates
   - List any amendments or custom clauses
   - Request human approval before release

8. **Log to session-log.md** with draft version and status.

---

## Example

Input: Request NDA from template

```
/draft-agreement
Type: NDA
Party A: Example Corp (San Francisco, CA)
Party B: Vendor LLC (Austin, TX)
Effective: 2026-06-13
Duration: 2 years
Auto-Renewal: No
```

Output:
```
## Document Draft: Mutual NDA

**Parties:** Example Corp and Vendor LLC
**Effective Date:** 2026-06-13
**Term:** 2 years
**Auto-Renewal:** No
**Compliance Status:** COMPLIANT

---

# MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement ("Agreement") is entered into as of June 13, 2026 ("Effective Date"), by and between Example Corp, a corporation organized in California ("Party A"), and Vendor LLC, a corporation organized in Texas ("Party B").

## 1. CONFIDENTIAL INFORMATION

1.1 "Confidential Information" means all non-public information disclosed by either party that is marked as confidential or reasonably understood to be confidential.

1.2 Exclusions:
- Information publicly available through no breach of this Agreement
- Information independently developed without reference to Confidential Information
- Information rightfully received from third parties without confidentiality obligations

## 2. OBLIGATIONS

2.1 Receiving party shall:
- Protect Confidential Information with reasonable care
- Limit access to employees with a need to know
- Not disclose to third parties without prior written consent

2.2 Permitted Disclosures:
- As required by law, with prior notice and opportunity to seek protective order
- To legal counsel, with appropriate confidentiality obligations

## 3. TERM AND TERMINATION

3.1 This Agreement is effective as of the Effective Date.

3.2 Confidential Information obligations:
- Survive termination of this Agreement
- Continue for 2 years after disclosure, or 3 years from Effective Date, whichever is longer

3.3 Either party may terminate this Agreement with 30 days written notice.

## 4. NO OBLIGATION

Neither party is obligated to disclose any Confidential Information or proceed with any transaction contemplated by this Agreement.

## 5. RETURN OR DESTRUCTION

Upon termination or request, Receiving Party shall:
- Return or certify destruction of all Confidential Information
- Retain one copy for legal/archival purposes if required by law

---

### Signatures

**EXAMPLE CORP**

By: _________________________ Date: _________________
Name: _______________________
Title: ________________________

**VENDOR LLC**

By: _________________________ Date: _________________
Name: _______________________
Title: ________________________

---

**Compliance Summary:** COMPLIANT
- GDPR: Not applicable (no data processing)
- Confidentiality: Fully addressed
- Termination: Clear renewal and exit provisions
- Data handling: Included return/destruction clause

**Ready for human review and signature.**
```

---

## Related Skills

- `compliance-analyzer` — Validate draft against regulatory frameworks
- `contract-reviewer` — Extract and analyze key terms
- `version-controller` — Track drafts and amendments
