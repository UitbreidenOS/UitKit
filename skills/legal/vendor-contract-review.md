---
name: vendor-contract-review
description: "Vendor contract review: identify risky clauses in SaaS, services, and procurement contracts — liability caps, indemnification, data processing, termination rights, and auto-renewal traps"
updated: 2026-06-13
---

# Vendor Contract Review Skill

## When to activate
- Reviewing a contract before signing with a new vendor or supplier
- Identifying unfavourable clauses in SaaS or software agreements
- Reviewing a services agreement, MSA, or SOW for your company
- Checking a renewal before auto-renewing a large spend
- Flagging data processing and liability risks in vendor contracts

## When NOT to use
- Negotiating your own customer contracts (different risk priorities)
- Employment contracts — different legal framework
- Real estate or physical asset agreements — out of scope
- Contracts requiring regulatory compliance analysis (FDA, banking) — needs qualified legal counsel
- Replacing a lawyer for high-stakes contracts (> $500K or with significant liability exposure)

## Instructions

### Standard vendor contract review

```
Review this vendor contract and flag risky clauses.

Contract type: [SaaS subscription / Professional services / MSA + SOW / Procurement / NDA]
Vendor: [name]
Annual value: $[X]
Duration: [X months / annual]
Renewal: [auto-renew / manual]
Your role: [buyer receiving the service]

Review these clauses in priority order:

1. LIABILITY CAP (highest priority):
   - What is the vendor's maximum liability to you?
   - Red flag: cap equal to or less than 1× monthly fees
   - Standard: 12× monthly fees (1 year of contract value)
   - Best: uncapped for willful misconduct, fraud, death/injury, IP infringement, data breach

2. INDEMNIFICATION:
   - Who indemnifies whom for what?
   - Red flag: you indemnify vendor for your "misuse" (overly broad)
   - Standard: mutual indemnification for IP infringement, negligence
   - Watch: indemnification carve-outs that gut your protection

3. DATA AND PRIVACY:
   - Who owns the data you input or generate?
   - Is there a DPA (Data Processing Agreement) attached or referenced?
   - Red flag: vendor can use your data for product improvement without consent
   - GDPR / CCPA: if you process EU/CA personal data, DPA is legally required
   - Watch: data return/deletion rights on termination

4. TERMINATION RIGHTS:
   - Can you terminate for convenience (without cause)?
   - Notice period required to terminate: [X days]
   - Red flag: no termination for convenience / termination requires 90+ days notice
   - Right to terminate for cause (material breach): how long to cure?

5. AUTO-RENEWAL:
   - Does the contract auto-renew?
   - How far in advance must you give notice to cancel? [X days]
   - Red flag: auto-renew with > 60 days notice window (easy to miss)
   - Best practice: calendar reminder at 90 days before renewal date

6. PRICING AND PRICE INCREASES:
   - Can vendor increase price at renewal?
   - Cap on annual price increases? [X%]
   - Red flag: uncapped price increases at renewal

7. SLA AND SERVICE CREDITS:
   - What uptime is guaranteed? [X%]
   - What are the remedies if SLA is breached?
   - Red flag: SLA credits are your only remedy (caps your recovery)
   - Watch: credits only, no right to terminate for repeated SLA failures

8. INTELLECTUAL PROPERTY:
   - Who owns work product or customisations?
   - Red flag: vendor retains IP for work you paid for
   - Standard: you own custom work; vendor retains their pre-existing IP

Flag each clause as: GREEN (favourable) / YELLOW (negotiate) / RED (reject or escalate to legal)
```

### SaaS-specific clause review

```
Review this SaaS agreement for common software-specific risks.

Vendor SaaS product: [describe]
Users: [X seats / unlimited]
Data stored in the product: [describe sensitivity — PII / financial / proprietary]

SaaS-specific clauses to check:

ACCEPTABLE USE POLICY (AUP):
- What uses are prohibited?
- Red flag: broad "at vendor's discretion" suspension rights
- Watch: vague AUP that could affect your legitimate use case

DATA PORTABILITY AND EXPORT:
- Can you export your data at any time?
- In what format? (machine-readable CSV/JSON is standard)
- What happens to data after termination? 30-day window to export is standard.
- Red flag: no data export / proprietary format / data deleted on termination with no grace period

UPTIME AND MAINTENANCE:
- Scheduled maintenance: does it count against uptime SLA?
- How much notice for planned downtime?
- Emergency maintenance: what's the process?

SUBPROCESSORS AND THIRD-PARTY SERVICES:
- Does vendor use subprocessors who will touch your data?
- Are they listed? Can you object to new ones?
- GDPR requirement: must notify customers of subprocessor changes

SECURITY OBLIGATIONS:
- What security standards does vendor commit to? (SOC 2, ISO 27001)
- Incident notification: how quickly must they notify you of a breach?
- Standard: 72 hours (GDPR requirement); watch for > 72 hours or no commitment

CHANGES TO SERVICE:
- Can vendor change features or remove functionality?
- Notice required for material changes? (30-90 days is standard)
- Red flag: vendor can change service unilaterally without notice

Output: flagged clause list + recommended negotiation asks for each RED/YELLOW clause.
```

### Contract negotiation playbook

```
Build a negotiation strategy for [contract].

Contract value: $[X/year]
Vendor's leverage: [high / medium / low — are there alternatives?]
Your leverage: [high / medium / low — size of your spend relative to vendor]
Must-win clauses: [list the 2-3 most important to fix]
Nice-to-have: [list secondary asks]

Negotiation playbook:

Prioritise: pick your 3 fights, let the rest go.
Vendors expect negotiation — they won't walk from a material deal over reasonable asks.

For each RED clause:

Clause: [name]
Problem: [what the current language says, why it's unfavourable]
Your ask: [the specific language change you want]
Your fallback: [minimum acceptable language if they push back]
Justification: [why this is a reasonable business ask]

Leverage tactics:
- Multi-year commitment: "We'll sign 3 years if you fix the liability cap"
- Volume commitment: "We'll expand to 500 seats if you fix data portability"
- Timeline urgency: "We need this resolved by [date] to proceed"
- Competition: "Your competitor's contract already includes this protection"

Escalation path:
- Level 1: standard redlines from their AE
- Level 2: legal-to-legal negotiation
- Level 3: executive escalation (only for strategic deals)

Generate the negotiation playbook for my specific redlines.
```

### Contract checklist

```
Generate a vendor contract review checklist for [company/team].

Use case: [all new vendors / vendors above $X spend / SaaS tools only]
Risk tolerance: [conservative / moderate / standard startup]

Quick review checklist (for contracts < $50K/year):
□ Liability cap ≥ 12 months of fees?
□ Auto-renewal notice period ≤ 60 days?
□ Data export rights included?
□ Termination for convenience available with ≤ 30 days notice?
□ No unusual IP assignment clauses?
→ If all green: sign. If any red: escalate.

Full review checklist (contracts > $50K/year or involving sensitive data):
□ Liability cap and carve-outs reviewed
□ Indemnification scope understood
□ DPA attached (if processing personal data)
□ SLA reviewed and remedies are adequate
□ Termination rights (for cause and convenience)
□ Auto-renewal terms calendared
□ Pricing escalation clause reviewed
□ Data portability and deletion rights confirmed
□ Security certification requirements met
□ Governing law and jurisdiction is acceptable
→ Internal legal review required for RED items

Generate the specific checklist for my company's contract review process.
```

## Example

**User:** A new SaaS vendor sent us a contract. Annual spend: $84K. Their liability cap is "one month of fees paid." Auto-renews with 90-day notice required. No DPA attached though we'll be storing customer email addresses. What should I push back on?

**Claude's priority redlines:**

Three must-fix issues before signing:

**1. Liability cap (RED — reject as written):**
Current: 1 month of fees = $7,000 max liability (you're paying $84K/year)
Your ask: "Minimum 12 months of fees paid in the prior 12 months ($84,000)"
Fallback: "6 months of fees ($42,000) with uncapped carve-outs for data breach and fraud"
Why they'll agree: This is a reasonable industry standard ask. Any reputable vendor will move from 1 month.

**2. Auto-renewal notice (YELLOW — negotiate):**
Current: 90-day notice window — easy to miss, especially if the person who signed leaves
Your ask: "60 days or less"
Fallback: "90 days is acceptable if contract includes written reminder from vendor at 120 days"
Practical fix: Set a recurring calendar reminder immediately for [renewal date - 100 days] regardless of what's in the contract.

**3. DPA / data privacy (RED — required, not optional):**
Current: No DPA attached, yet you'll process customer email addresses (personal data)
Your ask: "Execute vendor's standard DPA before go-live, as an addendum to this agreement"
Why non-negotiable: If you're subject to GDPR or CCPA, you're legally required to have a DPA with any processor handling personal data. Most vendors have a standard DPA — just ask for it. If they don't have one, that's a red flag about their data practices.

**What to let go:** SLA credits, IP clauses (assuming no custom development), and governing law are lower priority at this spend level.

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
