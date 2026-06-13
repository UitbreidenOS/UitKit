---
name: nda-review
description: "NDA triage and review: classify type, flag playbook deviations (GREEN/YELLOW/RED), identify scope issues, missing exclusions, hidden obligations — attorney review gate"
updated: 2026-06-13
---

# NDA Review Skill

## When to activate
- Reviewing a non-disclosure agreement before signing
- Triaging a batch of NDAs to identify which need lawyer attention
- Understanding what a specific NDA clause means in plain English
- Checking whether an NDA has standard exclusions and protections
- Comparing NDA terms against your company's standard playbook positions

## When NOT to use
- Signing on behalf of your organisation — that requires authorised signatory
- Interpreting NDA terms in an active dispute — consult your lawyer
- Multi-jurisdictional NDAs with complex cross-border obligations — needs specialist

## ⚠️ Important

Claude can identify issues and explain clauses. It cannot give legal advice, interpret jurisdiction-specific law, or guarantee it has caught every issue. **Have a lawyer review any NDA before signing if the relationship is material.**

## Instructions

### First — classify the NDA

```
Review this NDA and tell me:
1. Is this mutual (both parties protected) or one-way (only one party)?
2. Who is the disclosing party and who is the receiving party?
3. What is the term (duration)?
4. What jurisdiction governs it?

NDA text: [paste]
```

### Full playbook review

```
Review this NDA against our standard positions:

Our standard positions:
- Prefer mutual NDAs; one-way acceptable if we're the receiving party
- Maximum NDA term: 3 years
- Definition of Confidential Information: must be marked or confirmed in writing within 30 days
- Standard exclusions required: public domain, prior knowledge, independent development, compelled disclosure
- Governing law: [your jurisdiction preferred]
- No non-solicitation or non-compete hidden in the NDA

NDA text: [paste]

Flag each issue as GREEN (acceptable), YELLOW (negotiate), or RED (blocking).
```

### Standard exclusions check

Every NDA should have these 4 exclusions. Claude checks for them:

```
Check whether this NDA contains all 4 standard exclusions:
1. Information already in the public domain (not through breach)
2. Information the receiving party already knew before disclosure
3. Information independently developed by the receiving party
4. Information required to be disclosed by law or court order (compelled disclosure)

NDA text: [paste]

If any are missing, flag as YELLOW and draft the missing language.
```

### Hidden obligations scan

```
Scan this NDA for any obligations beyond standard confidentiality:
- Non-solicitation clauses (hiring restrictions)
- Non-compete provisions
- IP assignment language
- Exclusivity obligations
- Standstill provisions (limits on M&A activity)

NDA text: [paste]

Flag anything beyond standard confidentiality as RED — these do not belong in an NDA.
```

### Plain language explanation

```
Explain this NDA clause in plain English:
"[paste clause]"

Tell me: what does this actually mean for my business? What's the practical implication?
```

### Redline suggestions

```
This NDA has the following issues I want to push back on:
[list the issues from the review above]

Draft redline language for each issue — what I want it to say instead.
Format as: Original text → Proposed revision → Reason
```

## Example

**A one-way NDA where you are the receiving party:**

```
RED — Overly broad definition of Confidential Information
Section 1: "All information disclosed by Disclosing Party, in any form whatsoever"
Issue: No marking requirement and no carve-out for verbal disclosures. 
       You could inadvertently be bound by anything said in any meeting.
Fix: Add "...provided that verbal disclosures are confirmed in writing within 
     30 days of disclosure as being confidential."

YELLOW — 5-year term exceeds standard
Section 8: "This Agreement shall remain in effect for five (5) years"
Issue: 5 years is longer than the 3-year standard. Manageable but worth pushing back.
Fix: Propose 2-3 years for most commercial NDAs.

RED — Missing "independent development" exclusion
Section 2 has only 3 of the 4 standard exclusions — independent development is absent.
Fix: Add: "(d) information independently developed by Receiving Party without 
     use of or reference to Disclosing Party's Confidential Information."

GREEN — Governing law (California): acceptable if you operate there.
GREEN — Mutual exceptions for compelled disclosure: present and standard.

RECOMMENDATION: Do not sign as-is. RED items must be fixed before execution.
Attorney review: Recommended if this NDA accompanies a material commercial relationship.
```

---
