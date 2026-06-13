# Contract Review Workflow

A repeatable workflow for reviewing, triaging, and processing incoming contracts — from receipt to signed or redlined, with full audit trail. Covers NDAs, vendor agreements, customer contracts, and employment offers.

This workflow is designed for an in-house legal team (one person to small team). Adapt thresholds and escalation rules for your organisation's risk appetite and deal volume.

---

## Overview

```
Receipt → Triage → Risk classification → Review → Redline / negotiate → Escalate if needed → Sign-off → File
```

Total elapsed time per contract type:
- NDA (standard): 10-15 minutes
- NDA (non-standard): 30-45 minutes
- Vendor MSA (low complexity): 45-60 minutes
- Vendor MSA (high complexity): 2-4 hours + external counsel
- Customer contract (standard template): 20-30 minutes
- Customer contract (negotiated): 1-2 hours + commercial review

---

## Step 1 — Receipt and intake

**Goal:** Every contract is logged, assigned, and has a deadline before any work begins.

**Intake checklist:**

```markdown
New Contract Intake — [CONTRACT NAME]

Received from: [name, company, email]
Received date: [date]
Contract type: [NDA / MSA / SOW / employment / lease / other]
Direction: [we are the customer / we are the vendor / mutual]
Commercial context: [deal size, relationship importance, what business decision depends on this]
Signing deadline: [date stated or implied]
Assigned to: [legal team member]
Review deadline: [signing deadline minus 2 days for internal review]
```

**Triage rule of thumb:**
- Signing deadline today → drop everything else
- Signing deadline within 3 days → review today
- No deadline stated → assume 5 business days; confirm with requester
- External counsel needed → flag and initiate immediately; do not wait for full internal review

---

## Step 2 — Fast triage (5 minutes)

**Goal:** Determine how much attention this contract needs before doing a full review.

```
/nda-review

Fast triage for: [CONTRACT TYPE]
[Paste contract text]

Give me in 60 seconds:
1. Contract type: [standard template / custom / unusual]
2. Overall complexity: [low / medium / high]
3. Any immediate red flags visible without a full read: [yes / no — describe]
4. Recommended review depth: [5 min skim / 30 min review / full review + counsel]
5. Does this need external counsel? [yes / no / maybe — reason]
```

**Decision gates:**
- Simple NDA, recognisably standard (CDA, MNDA)? → 10-minute review using Step 3A
- Complex agreement with custom commercial terms? → Full review using Step 3B
- Regulated agreement (financial services, healthcare, regulated data)? → External counsel immediately

---

## Step 3A — NDA review (fast track)

**Goal:** Triage the NDA in under 15 minutes. Most NDAs either pass or have one fixable issue.

```
/nda-review

Review this NDA fully.

[Paste NDA text]

Our role: [disclosing / receiving / mutual]
Context: [why we're signing — sales conversation / vendor assessment / partnership / M&A]

Produce:
1. NDA type: mutual / one-way (which direction)
2. Term: [duration of confidentiality obligation]
3. Scope: is the definition of Confidential Information too broad? Too narrow?
4. Standard exclusions present: public information, prior knowledge, independent development, compelled disclosure — yes/no for each
5. Red flags: any unusual provisions, overly broad restrictions, perpetual obligations, non-standard remedies
6. Non-compete or non-solicitation buried in the NDA: yes/no
7. Governing law: where? Is it acceptable?
8. Recommendation: sign as-is / request one change / redline / reject / send to counsel
```

**Standard NDA issues to watch:**
- Definition of Confidential Information includes "all information shared" without carve-outs
- No standard exclusions (public domain, prior knowledge, independent development)
- Perpetual confidentiality obligation (market standard is 3-5 years)
- Restricts us from hiring their employees without reciprocity
- Jurisdiction in a state/country where disputes would be impractical for us
- One-way NDA where mutual would be more appropriate

---

## Step 3B — Full contract review

**Goal:** Systematic coverage of all material provisions with RED/YELLOW/GREEN classification.

```
/contract-review

Full contract review for: [CONTRACT TYPE]
[Paste full contract text]

Our role: [customer / vendor / licensor / licensee]
Our concerns: [IP protection / data security / payment terms / liability / termination]
Our company: [size, stage, industry — for context on market standards]
Deal value: $[X] over [term]

Produce a structured review:

RED (blocking — must fix before signing):
For each: [clause name] | [section] | [exact clause language] | [issue] | [impact] | [suggested fix]

YELLOW (negotiate — push back but not a dealbreaker):
For each: [same format]

GREEN (acceptable — standard market terms):
[Brief summary — "payment terms, IP ownership, and governing law are all market standard"]

MISSING CLAUSES:
[List clauses that should be present but are absent]

OVERALL RISK: [HIGH / MEDIUM / LOW]
RECOMMENDATION: [sign / redline and return / reject / send to counsel]
```

**Universal checklist — check every contract for these:**

```typescript
const UNIVERSAL_CONTRACT_CHECKS = [
  // LIABILITY
  'Is liability capped? At what amount? Is the cap adequate for the deal size?',
  'Are consequential damages excluded? Any carve-outs (IP breach, data breach, fraud)?',
  'Is indemnification mutual? Capped? Any uncapped indemnification obligations?',

  // IP
  'Who owns IP created under this agreement? Work for hire?',
  'Are input materials (our data, tools, content) protected?',
  'Any IP license granted? Scope — exclusive/non-exclusive, perpetual, irrevocable?',

  // TERMINATION
  'Can either party terminate for convenience? Notice period?',
  'What happens to our data on termination? Export window? Deletion timeline?',
  'Any termination fees or lock-in beyond notice period?',

  // DATA AND PRIVACY
  'Is personal data involved? Is there a DPA or data processing annex?',
  'Sub-processor restrictions: can they use our data with third parties?',
  'Data breach notification: do they commit to notifying us? Timeframe?',

  // PAYMENT
  'Payment terms: net-30, net-60, or other?',
  'Late payment penalties: interest rate, suspension of service?',
  'Price change provisions: unilateral right to increase pricing?',
  'Auto-renewal: notice period to cancel? Sufficient lead time?',

  // GOVERNING LAW AND DISPUTE RESOLUTION
  'Governing law jurisdiction: is it acceptable? Is it the same for both parties?',
  'Dispute resolution: litigation, arbitration, or mediation first?',
  'Any class action waiver or limitation on remedies?',
]
```

---

## Step 4 — Produce redlines

**Goal:** A clearly marked redlined version the counterparty can review and respond to.

```
/contract-review

Produce a redline for this contract based on these required changes:

RED issues to fix:
[List each RED issue with the proposed replacement language]

YELLOW issues — proposed positions:
[For each YELLOW: our preferred position, acceptable fallback, walk-away point]

Additional missing clauses to add:
[List each missing clause with proposed draft language]

Format output as:
For each change:
- Section reference
- Original language: [exact quote]
- Redlined to: [replacement language]
- Rationale (1 sentence): [why we need this]

This rationale is for internal use — do not include in the document sent to the counterparty.
```

**Negotiation posture by issue type:**

| Issue type | Our ask | Acceptable fallback | Walk away |
|---|---|---|---|
| Uncapped indemnification | Cap at 12 months of fees | Cap at deal value | No cap — must fix |
| Governing law (wrong jurisdiction) | Our jurisdiction | Mutual jurisdiction (e.g. England) | Counterparty's jurisdiction if unfavourable |
| IP ownership over our inputs | Explicit exclusion of our data | "Except materials we provide" | Transfer of our IP — must fix |
| Data deletion on termination | 30-day window + certification | 60-day window | No deletion right — requires DPA add |
| Auto-renewal notice period | 60 days | 30 days | < 14 days (insufficient notice) |

---

## Step 5 — Escalation and external counsel

**Escalate to external counsel when:**
- Any contract valued at > $[your threshold, e.g. $250K] annual
- Any agreement involving regulated activities (financial services, healthcare, data as a service)
- Litigation risk present (indemnification claims, IP dispute)
- Unfamiliar jurisdiction (outside your team's expertise)
- Settlement, M&A, or financing documents
- Any provision you are uncertain about after using Claude — always escalate uncertainty

**Brief for external counsel:**

```
External counsel brief for: [CONTRACT NAME]

Business context:
- What we are trying to do: [deal description]
- Why this is important: [commercial importance]
- Signing deadline: [date]
- Our preferred outcome: [sign / negotiate specific points / walk away]

What we've done:
- RED issues identified: [list]
- YELLOW issues identified: [list]
- Our proposed positions: [list]

What we need from counsel:
- [Specific legal questions — e.g. "Is this indemnification clause enforceable in California?"]
- [Risk assessment: "How much exposure does the uncapped indemnification create?"]
- [Redline review: "Are our proposed redlines market standard and reasonable?"]

Budget: [X hours at $Y/hour]
Deadline: [when we need the advice]
```

---

## Step 6 — Sign-off and execution

**Pre-signature checklist:**

```
Before any contract is signed:
- [ ] All RED issues resolved (either fixed or signed off by authorised person with documented reason)
- [ ] YELLOW issues: either negotiated to acceptable position, or business sponsor accepted the risk in writing
- [ ] Governing law confirmed acceptable
- [ ] Signatories confirmed: do we and the counterparty have the right people signing?
  - Check signatory authority limits (who can bind the company at what dollar amount)
  - Board approval required? (check your authorisation matrix)
- [ ] Execution method: DocuSign / wet ink / notarised — confirmed correct for this jurisdiction and contract type
- [ ] Final version confirmed — no version control confusion
- [ ] Date of signing confirmed — any deferred effective date?
```

**Signature authority matrix (template — adapt to your business):**

| Contract value | Who can sign |
|---|---|
| < $10,000 | Department head |
| $10,000 - $50,000 | VP / Director |
| $50,000 - $250,000 | CFO or CEO |
| > $250,000 | CEO + board approval |
| Any IP assignment or exclusivity | CEO + legal review |
| Employment agreements | HR Director + CEO |

---

## Step 7 — File and track

**Goal:** Every signed contract is filed, searchable, and has renewal/termination dates tracked.

```
Contract filing record:

Contract name: [company — contract type — date]
Counterparty: [company name, registered address, contact]
Type: [NDA / MSA / SOW / employment / other]
Effective date: [date]
Term: [X years / until terminated]
Auto-renewal: [yes / no — if yes, notice period and next renewal date]
Termination date / notice by: [date]
Value: $[X] [one-time / annual / monthly]
Governing law: [jurisdiction]
Key obligations on us: [2-3 bullets]
Key rights for us: [2-3 bullets]
Filed in: [contract management system / Notion / Google Drive — exact path]
Reviewed by: [legal team member]
```

**Renewal tracking:**
- Set a calendar reminder 90 days before any auto-renewal notice deadline
- Set a calendar reminder 30 days before contract expiry for renegotiation
- Any contract with a renewal in the next 6 months: review current terms and commercial need before renewal date

---

## Contract type quick-reference

### NDAs
- Fast track: Step 3A
- Target review time: 10-15 minutes
- Most common issue: perpetual confidentiality + no standard exclusions
- When to use external counsel: if includes non-compete, non-solicitation, or IP provisions unusual for an NDA

### Vendor MSAs (SaaS, services, professional services)
- Full review: Steps 3B + 4
- Target review time: 45-90 minutes
- Most common issues: data processing (no DPA), auto-renewal, uncapped indemnification
- External counsel: contracts > $[threshold] or regulated service

### Customer contracts (we are the vendor/provider)
- Variant review: compare to our standard template
- Target review time: 20-30 minutes for close to template; longer for redlined versions
- Most common issues: customers adding onerous SLAs, IP ownership over our platform, data portability demands
- External counsel: enterprise contracts > $[threshold] or public sector

### Employment contracts
- Review against local employment law requirements
- Most common issues: non-compete enforceability varies by state/country, IP assignment scope, notice periods
- External counsel: always for senior hires; at least spot-check junior hires in new jurisdictions

---

## Master contract review checklist

```markdown
# Contract Review: [CONTRACT NAME — DATE]

**Received:** [date]
**Deadline:** [date]
**Assigned:** [legal team member]
**Status:** [ ] Received | [ ] Triaged | [ ] Reviewed | [ ] Redlined | [ ] Negotiated | [ ] Signed | [ ] Filed

## Triage
- [ ] Contract type identified
- [ ] Signing deadline confirmed
- [ ] External counsel needed: yes / no / TBD
- [ ] Business sponsor identified and briefed

## Review
- [ ] Full /contract-review run
- [ ] RED issues: [number] identified
- [ ] YELLOW issues: [number] identified
- [ ] Missing clauses: [list]

## Redline
- [ ] RED issues: all proposed fixes drafted
- [ ] YELLOW issues: positions documented (ask / fallback / walk-away)
- [ ] Redlined version sent to counterparty
- [ ] Counterparty response received and reviewed

## Sign-off
- [ ] All RED issues resolved or accepted risk documented
- [ ] Signatory authority confirmed
- [ ] Final version confirmed — no further changes
- [ ] Signed by authorised person on our side
- [ ] Countersigned received and confirmed authentic

## Filing
- [ ] Signed copy filed in [location]
- [ ] Contract record created in tracker
- [ ] Renewal/termination calendar reminders set
- [ ] Business team notified of key obligations
```

---
