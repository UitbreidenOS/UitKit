---
name: "kyc-screener"
description: "KYC/AML screening: document parsing, beneficial ownership extraction, rules-grid evaluation, PEP/sanctions checks, gap flagging and escalation routing"
---

# KYC Screener Skill

## When to activate
- Onboarding a new corporate client and need to complete KYC
- Parsing entity documents (certificates of incorporation, trust deeds, shareholder registers)
- Identifying beneficial owners and checking against PEP/sanctions lists
- Evaluating a client's KYC package against your compliance checklist
- Routing incomplete or high-risk cases for enhanced due diligence

## When NOT to use
- Replacing a licensed compliance officer's sign-off on high-risk clients
- Real-time transaction monitoring (AML) — needs dedicated software
- Formal sanctions compliance for financial institutions — requires specialist legal review

## ⚠️ Important

KYC outputs must always be reviewed and signed off by a qualified compliance officer. Claude helps structure and accelerate the process — it does not substitute for human judgment on financial crime risk. All outputs carry `[VERIFY]`.

## Instructions

### Step 1 — Document intake and parsing

```
Parse this KYC document and extract all structured data:

Document type: [Certificate of Incorporation / Trust Deed / Shareholder Register / 
               Bank Statement / Utility Bill / Passport / Driver's License]

Document: [paste text or describe contents]

Extract:
- Entity name (exact legal name)
- Registration number
- Jurisdiction of incorporation
- Registered address
- Date of incorporation
- Directors / officers (names, roles)
- Shareholders / beneficial owners (name, % ownership)
- Ultimate beneficial owners (UBOs > 25% threshold, or lower per your policy)

Flag any inconsistencies or missing information.
[VERIFY] extracted data against original document.
```

### Step 2 — Build the ownership structure

```
Map the corporate ownership structure from the documents provided:

Entities and ownership:
[paste what you've extracted]

Draw the ownership chain:
- Who ultimately owns this entity?
- Are there any intermediate holding companies?
- Who crosses the UBO threshold (typically 25%)?
- Are there any trusts, nominees, or complex structures?

Flag any structures that:
- Use bearer shares (high risk)
- Have nominee directors (high risk)
- Involve multiple layers of offshore holding companies (elevated risk)
- Cannot identify a natural person as UBO (critical gap)

[VERIFY] ownership chain is complete and traceable to natural persons.
```

### Step 3 — Apply the KYC rules grid

```
Evaluate this KYC package against our requirements:

Client type: [individual / corporate / trust / fund]
Risk tier: [standard / medium / high / PEP]
Our KYC policy requires: [describe your requirements or paste policy]

Documents submitted:
[list each document with date and issuer]

For each required document, mark: ✓ Received | ✗ Missing | ⚠ Needs refresh (expired)

Common corporate KYC checklist:
- Certificate of Incorporation ✓/✗
- Memorandum and Articles of Association ✓/✗
- Register of Directors ✓/✗
- Register of Shareholders / UBO declaration ✓/✗
- Proof of registered address ✓/✗
- Certified passport copies for all UBOs > 25% ✓/✗
- Proof of address for all UBOs (< 3 months old) ✓/✗
- Source of funds / source of wealth declaration ✓/✗
- Latest audited accounts (if available) ✓/✗

Generate a gap report listing all missing items with priority (blocking vs. non-blocking).
[VERIFY] checklist matches your jurisdiction's requirements.
```

### Step 4 — PEP and sanctions check

```
Screen these names/entities against risk databases:

Names to screen: [list all directors, UBOs, and the entity itself]
Jurisdictions: [countries of incorporation and residence]

Check against:
- UN Sanctions List
- OFAC SDN List (US)
- EU Consolidated Sanctions List
- UK HM Treasury Sanctions
- [Your jurisdiction's list]
- PEP (Politically Exposed Person) definition: head of state, senior government official, 
  judicial official, senior executive of state-owned enterprise, senior military official,
  and their immediate family and known associates

For each hit: full name match / partial name match / no match
Flag partial matches for enhanced review.

Note: Real-time screening requires integration with WorldCheck, Refinitiv, Dow Jones,
or similar. Claude identifies the names to screen; screening itself must use verified databases.
[VERIFY] all names against live sanctions databases before onboarding.
```

### Step 5 — Risk assessment and routing

```
Based on the KYC review above, assess the overall risk:

Risk factors present:
[list what you found — jurisdiction risk, PEP, complex structure, etc.]

Apply risk scoring:
LOW RISK: Standard domestic corporate, clean screening, complete documentation
MEDIUM RISK: One or more elevated risk factors — route to compliance manager
HIGH RISK: PEP, high-risk jurisdiction, complex structure, adverse media — Enhanced Due Diligence required
DECLINED: Prohibited by policy (FATF high-risk jurisdiction list, sanctions hit, no identifiable UBO)

Routing decision:
- LOW: Relationship manager can proceed
- MEDIUM: Compliance manager review within [X] business days
- HIGH: Senior compliance officer + MLRO (Money Laundering Reporting Officer) sign-off required
- DECLINED: Document decision, refer to MLRO for Suspicious Activity Report consideration

[VERIFY] routing decision with compliance officer.
```

## Example

**User:** We're onboarding a British Virgin Islands holding company with three layers of ownership before reaching the individual UBOs.

**Claude's analysis:**

**Structure risk:** HIGH — BVI jurisdiction + multiple holding layers + nominee director pattern.

**Documents needed (additional to standard):**
- Register of Members for each intermediate entity
- Notarised UBO declaration for each layer
- Source of wealth for UBOs exceeding 10% threshold (not just 25%)
- Business purpose declaration for BVI holding structure

**PEP/sanctions:** Screen all names against OFAC + EU + UN + UK lists. BVI structure warrants screening against FinCEN beneficial ownership database.

**Routing:** Enhanced Due Diligence required before onboarding. Senior compliance officer and MLRO sign-off needed. [VERIFY] all findings.

---
