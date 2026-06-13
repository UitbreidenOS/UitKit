---
name: diligence-review
description: "M&A due diligence: tabular review of contracts, IP, employment, litigation, and corporate documents — flag risks, identify missing items, and produce diligence summaries"
updated: 2026-06-13
---

# Diligence Review Skill

## When to activate
- Conducting legal due diligence for an M&A transaction or investment
- Reviewing a data room and producing a diligence summary
- Flagging key risks in target company contracts, IP, or employment matters
- Creating a diligence checklist for a specific deal type
- Summarising findings from a large document set into a tabular format

## When NOT to use
- Financial due diligence — that's accounting and finance, not legal
- Post-signing integration planning — different workstream
- Regulatory filings related to the deal — needs specialist counsel
- Replacing attorney judgment on deal-breaker risks — always escalate to lead counsel

## Instructions

### Diligence checklist by deal type

```
Generate a due diligence checklist for [deal type].

Deal type: [M&A acquisition / minority investment / Series A / asset purchase / merger]
Target company: [describe — stage, industry, geography]
Buyer/Investor: [describe — strategic acquirer / PE / VC / individual]
Key risk areas identified: [IP / employment / contracts / litigation / regulatory]
Timeline: [X weeks to close]

Diligence checklist by workstream:

CORPORATE AND GOVERNANCE:
□ Certificate of incorporation and all amendments
□ Bylaws and operating agreement (current version)
□ Cap table (fully diluted, all instruments)
□ Board and shareholder meeting minutes (last 3 years)
□ All equity and option grants, with vesting schedules
□ Stockholder agreements, voting agreements, ROFRs
□ Jurisdictions of operation (states/countries)
□ Foreign qualification certificates where applicable

COMMERCIAL CONTRACTS:
□ Top 10 customer contracts by revenue (full text)
□ All contracts > $[X] annually
□ Any contract with change-of-control clause
□ Exclusivity, non-compete, or MFN provisions in any agreement
□ Government or regulated industry contracts
□ Distribution, reseller, or channel partner agreements

INTELLECTUAL PROPERTY:
□ Patent portfolio (filed, pending, granted) with ownership chain
□ Trademark registrations (all jurisdictions)
□ Copyright registrations
□ All IP assignment agreements from founders and employees
□ Open source software inventory and licence audit
□ Third-party IP licences (in-bound and out-bound)

EMPLOYMENT AND HR:
□ All offer letters and employment agreements for key personnel
□ Non-compete and non-solicitation agreements
□ Employee invention assignment agreements (PIIAs)
□ Equity grants and option plan documents
□ Severance agreements and change-of-control provisions
□ Independent contractor agreements (risk: misclassification)
□ EEO filings and HR complaints (last 3 years)

LITIGATION AND DISPUTES:
□ All pending litigation, arbitration, or government investigations
□ Demand letters received (last 3 years)
□ Settlement agreements (last 5 years)
□ Insurance policies (D&O, E&O, general liability)

REGULATORY AND COMPLIANCE:
□ Applicable licences and permits
□ Privacy policy and data processing practices
□ GDPR/CCPA compliance documentation
□ Industry-specific compliance (financial, health, regulated data)

Generate the checklist for my deal type with priority flags (P1/P2/P3).
```

### Tabular contract review

```
Review these contracts and produce a tabular diligence summary.

Contracts to review: [list or describe]
Deal context: [acquisition / investment / partnership]
Key issues to flag: [change of control / assignment / exclusivity / IP ownership / termination rights]

Tabular summary format:

| Contract | Counterparty | Value | Term | Auto-Renew | Change of Control | Assignment | Key Risk | Priority |
|---|---|---|---|---|---|---|---|---|
| MSA with [X] | [Company] | $[X]/yr | [dates] | Yes/No | Consent required / Terminates / Silent | Restricted / Permitted | [describe] | P1/P2/P3 |

For each contract, identify:

CHANGE OF CONTROL:
- Does it trigger on acquisition?
- Consent required from counterparty?
- Terminates automatically?
- Silent (may require analysis)?

ASSIGNMENT:
- Can the acquirer step into the target's position?
- Is consent required?
- Are there anti-assignment clauses?

TERMINATION RIGHTS:
- Can counterparty terminate for convenience?
- Notice period required?
- Change of control = termination right?

KEY RISK FLAGS:
🔴 Deal-breaker: must be resolved before close
🟡 Negotiate: should be addressed, deal can proceed with plan to resolve
🟢 Note: low risk, flag for awareness only

Produce the tabular summary with risk ratings.
```

### IP diligence summary

```
Conduct IP due diligence for [target company].

Target: [name, industry, stage]
Product: [describe — software / hardware / content / brand]
Key IP assets: [describe what generates value]

IP diligence framework:

1. OWNERSHIP CHAIN:
   - Who created the core IP?
   - Are all founders' IP contributions assigned to the company? (check PIIAs)
   - Any IP created before the company was formed? (pre-incorporation assignment?)
   - IP created by contractors? (must have written assignment — work-for-hire is insufficient for software)
   - Open source contributions by employees that were made personal capacity?

2. PATENT ANALYSIS:
   - Filed vs. granted vs. pending
   - Coverage map: what does each patent protect?
   - Freedom to operate: do they use any third-party IP not licensed?
   - Prior art risk on key patents

3. TRADEMARK:
   - Core brand name registered? In all jurisdictions of operation?
   - Any third-party trademark conflicts?
   - Domain name ownership matches trademark?

4. OPEN SOURCE:
   - Inventory of OSS used in the product
   - Licence analysis: GPL/AGPL present? (may require open-sourcing acquirer's code)
   - SBOM (Software Bill of Materials) available?
   - Any OSS contributed back that created reciprocal obligations?

5. TRADE SECRETS:
   - What information is treated as trade secret?
   - Access controls and confidentiality measures in place?
   - NDAs with employees, contractors, and partners?

6. THIRD-PARTY LICENCES:
   - Any IP licensed from third parties the product depends on?
   - Assignment permitted? Transfer fees?
   - Change of control provisions?

Output: IP risk matrix with ownership confirmation status and flagged gaps.
```

### Diligence findings memo

```
Draft a diligence findings memo for [deal].

Deal: [describe]
Diligence period: [X weeks]
Documents reviewed: [X contracts / [Y] categories]
Audience: [deal team / board / investors / GC]

Findings memo structure:

EXECUTIVE SUMMARY:
[2-3 sentences: overall risk assessment + top 3 findings]
Overall risk rating: [Low / Medium / High / Deal-breaker risk identified]

DEAL-BREAKER RISKS (P1):
[Any finding that, if unresolved, should prevent closing]
1. [Finding name]
   - Issue: [describe precisely]
   - Document: [contract name, section]
   - Impact: [what happens at close]
   - Required resolution: [what must be done before close]

SIGNIFICANT RISKS (P2):
[Risks to be addressed in representations, warranties, or indemnities]
1. [Finding name]
   - Issue: [describe]
   - Recommended treatment: [RWI coverage / indemnity / price adjustment / rep & warranty]

NOTED ITEMS (P3):
[Observations for post-close integration planning]
[Low-risk items to monitor]

MISSING DOCUMENTS:
[Items requested but not produced — reason unknown]
□ [Item] — requested [date], not received
□ [Item] — [status]

NEXT STEPS:
□ [Action] — owner: [name] — due: [date]

Attorney review required. This memo is privileged and confidential.
Draft the findings memo for my deal context.
```

## Example

**User:** We're acquiring a SaaS company. Their top customer contract (40% of ARR) has a change-of-control clause requiring consent. How should I present this in the diligence summary?

**Claude's tabular entry + memo section:**

**Tabular entry:**
| Contract | Counterparty | Value | Change of Control | Risk | Priority |
|---|---|---|---|---|---|
| Enterprise MSA | [Customer A] | ~$[X] (40% ARR) | Consent required — §12.3 | Customer may withhold consent or negotiate concessions; loss could materially impair target valuation | 🔴 P1 |

**Memo section:**

**P1 FINDING: Change-of-Control Consent — Primary Customer Agreement (§12.3)**

*Issue:* The MSA with [Customer A], representing approximately 40% of the target's ARR, requires prior written consent of the counterparty upon a change of control of the target (§12.3). The agreement defines "change of control" to include any transaction in which more than 50% of the voting securities of the target are acquired — which the proposed acquisition triggers.

*Impact:* If [Customer A] withholds consent, the contract may terminate, and the acquirer would lose approximately $[X] in contracted ARR immediately post-close. This would represent a material reduction in the acquisition value.

*Required resolution before close:*
- Obtain written consent from [Customer A] prior to or simultaneous with closing
- If consent is conditioned on renegotiated terms, assess impact on economics
- Consider escrow or price adjustment mechanism tied to consent

*Recommended treatment:* This is a closing condition. Do not close without confirmed consent or a signed waiver.

*Attorney review required. All figures marked [VERIFY] with financial diligence.*

---
