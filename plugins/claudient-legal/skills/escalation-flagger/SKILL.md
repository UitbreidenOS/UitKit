---
name: "Escalation Flagger"
description: "- After contract review identifies issues that may exceed the reviewer's authority - Any contract clause triggers an automatic escalation condition (see Step 1 below) - Uncertainty about whether a ter"
---

# Escalation Flagger

## When to activate

- After contract review identifies issues that may exceed the reviewer's authority
- Any contract clause triggers an automatic escalation condition (see Step 1 below)
- Uncertainty about whether a term requires senior sign-off before proceeding

## When NOT to use

- As a substitute for reading the contract — this skill flags issues in a reviewed contract, not a substitute for reading one
- For legal advice — this skill routes issues to the right authority level; it does not provide legal counsel on the merits of a term

## Instructions

Apply the escalation decision tree in order. Stop at the first trigger that fires — earlier steps override later ones.

---

**Step 1 — Automatic triggers (always escalate regardless of deal size or role)**

The following terms require escalation to GC or senior partner regardless of contract value or reviewer seniority:

- Unlimited liability clause (any form)
- IP assignment to the counterparty, including work-for-hire clauses covering core product IP
- Perpetual exclusive license to the organization's technology or data
- Any term on the organization's documented "never accept" list (from the playbook profile)
- Confirmed sanctions hit on the counterparty

If any automatic trigger fires → set `Required escalation: YES` and `Escalate to: GC / Senior Partner`.

---

**Step 2 — Dollar authority check**

Does the contract value exceed the reviewer's authority limit?

Default thresholds (override with organization profile if available):

```
Paralegal:  <$50K, standard terms only
Counsel:    <$500K, standard terms + documented fallbacks
GC:         unlimited, all terms including non-standard
```

If contract value exceeds the reviewer's authority → escalate to the next authority level.

---

**Step 3 — Non-standard terms**

Is any negotiated term outside the documented fallback positions in the organization playbook?

If yes → escalate to the authority level defined for non-standard terms in the playbook. Document which term and how it deviates.

---

**Step 4 — Playbook silence**

Does a material term appear that the playbook does not address at all?

If yes → surface as YELLOW. Do not proceed. Ask the team to define a position for that term type before this contract moves forward. Unaddressed material terms are not safe to approve by default.

---

**Output format:**

```
ESCALATION ASSESSMENT — [Contract Name]
Counterparty: [name]
Contract value: $[X]
Reviewer: [role]

Automatic triggers:   [none / list each trigger found]
Dollar authority:     $[contract value] vs $[reviewer limit] → [within limit / EXCEEDS]
Non-standard terms:   [none / list each deviation from playbook]
Playbook gaps:        [none / list each unaddressed material term]

Required escalation:  [YES / NO]
Escalate to:          [role and name from org profile]
Channel:              [Slack / email]

---
Draft escalation message:

Hi [name],

I'm reviewing [contract name] with [counterparty]. I need your approval before proceeding on:

1. [Term 1] — [what it says] — [why it requires your approval]
2. [Term 2] — [what it says] — [why it requires your approval]

Contract value: $[X]. Counterparty: [name]. Deadline: [if known, else "not specified"].

Can you review and advise?
```

**Cost-benefit rule:** The cost of an unnecessary escalation (roughly 30 seconds of a senior reviewer's attention) is always less than the cost of proceeding with unapproved non-standard terms. When in doubt, flag.

**Note:** This skill drafts the escalation message. It does not send it — the reviewer reads the draft, confirms accuracy, and sends.

## Example

**Input:** "A vendor contract has a mutual NDA section, limitation of liability capped at 1× fees (our standard acceptable position), but includes a clause assigning all IP developed during the engagement to the vendor. Flag appropriately."

**Expected output:**

```
ESCALATION ASSESSMENT — Vendor Services Agreement (Acme Corp)
Counterparty: Acme Corp
Contract value: $120,000
Reviewer: Counsel

Automatic triggers:   IP ASSIGNMENT — Section 8.3 assigns all work product and IP developed during engagement to Vendor. This is an automatic escalation trigger regardless of deal size.
Dollar authority:     $120,000 vs $500,000 (Counsel limit) → within limit
Non-standard terms:   IP assignment is on the never-accept list
Playbook gaps:        none

Required escalation:  YES
Escalate to:          General Counsel
Channel:              Slack (#legal-escalations)

---
Draft escalation message:

Hi [GC name],

I'm reviewing the Vendor Services Agreement with Acme Corp ($120K engagement). I need your approval before proceeding on:

1. Section 8.3 — IP Assignment — assigns all work product and IP developed during the engagement to Acme Corp. This triggers an automatic escalation under our playbook (never-accept list item).

Contract value: $120,000. Counterparty: Acme Corp. Deadline: not specified.

Can you review and advise?
```

---
