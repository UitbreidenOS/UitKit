---
name: dsar-response
description: "GDPR/CCPA data subject access request workflow: classify request, verify identity, walk systems, apply exemptions, draft acknowledgment and substantive response"
updated: 2026-06-13
---

# DSAR Response Skill

## When to activate
- A customer or employee submits a data access, deletion, portability, or correction request
- You need to confirm receipt within the regulatory deadline
- Identifying which systems hold the requestor's personal data
- Applying GDPR or CCPA exemptions before responding
- Drafting the substantive response letter

## When NOT to use
- Mass data breach notifications — different legal framework (Art. 33/34 GDPR)
- Regulator investigations — involve your DPO and legal counsel
- Requests that are clearly vague harassment with no legitimate purpose — still needs proper handling

## ⚠️ Important

Deadlines are strict: **GDPR: 1 month (extendable to 3 months for complex requests). CCPA: 45 days.** Missing the deadline is itself a compliance violation. Claude helps structure the process — your DPO or legal counsel should review before sending any response.

## Instructions

### Step 1 — Classify the request

```
A data subject sent this message: "[paste the request]"

Classify:
1. What type of request is this?
   - Access (Article 15 GDPR / CCPA right to know)
   - Erasure/deletion ("right to be forgotten" — Art. 17 GDPR / CCPA right to delete)
   - Portability (Art. 20 GDPR — structured, machine-readable format)
   - Rectification/correction (Art. 16 GDPR)
   - Restriction of processing (Art. 18 GDPR)
   - Objection to processing (Art. 21 GDPR)
   - Multiple rights combined

2. Which regulation applies?
   - GDPR (EU/UK resident or EU operations)
   - CCPA (California resident)
   - Both / Other

3. What is the deadline?
   - GDPR: [today's date + 30 days] = [date]
   - CCPA: [today's date + 45 days] = [date]
```

### Step 2 — Verify identity

```
Before processing, I need to verify this person's identity.

Requestor claims to be: [name, email, customer/employee]
Information they provided: [what they gave us]

What verification steps should I take?
- What's the minimum verification needed?
- What can I ask for without over-collecting data (re-identification risk)?
- When is additional verification justified vs. burdensome?

Draft the identity verification request I should send.
```

### Step 3 — Systems audit

```
I need to identify all personal data we hold for this person.

Their details: [name, email, customer ID, employee ID if known]

Walk me through all the systems we might have their data in:
[describe your tech stack and data systems]

For each system, what data might we hold?
Format: System | Data types held | How to extract | Retention period
```

### Step 4 — Apply exemptions (if applicable)

```
I'm reviewing this erasure/deletion request. Check whether any exemptions apply:

Request details: [describe]
Our legitimate grounds for holding the data: [describe]

GDPR Article 17(3) exemptions to check:
- Legal claim: do we need this data for an ongoing legal dispute or contract?
- Legal obligation: are we required by law to retain this data (e.g. tax records 7 years)?
- Public interest: does this serve scientific/historical research?
- Freedom of expression: journalism, public interest
- Public health: vital interests

If an exemption applies, note which one and draft the explanation for the response.
```

### Step 5 — Draft the acknowledgment

```
Draft the acknowledgment email/letter to send now (within 72 hours of receipt).

Include:
- Confirmation we received their request on [date]
- Reference number for tracking
- Type of request acknowledged
- Deadline for our response ([date])
- Name/contact of our DPO or privacy team
- Brief note on identity verification if needed

Regulations: [GDPR / CCPA]
Our company name: [name]
DPO/privacy contact: [name or team email]
```

### Step 6 — Draft the substantive response

```
I've completed the data inventory. Here's what I found:

Systems searched: [list]
Data found: [describe categories — name, email, purchase history, etc.]
Exemptions applied: [none / yes: describe]
Data being withheld: [none / describe reason]

Draft the full response letter for a [GDPR access / CCPA deletion] request.

Include:
- Summary of data held (or confirmation of deletion)
- Format of data provided (if access request)
- Any exemptions applied with Article reference
- Right to complain to supervisory authority
- Signature block

[VERIFY] with DPO before sending.
```

## Example

**A customer emails:** "I want to know what data you have about me and I want you to delete it."

**Claude's workflow output:**

**Classification:** Combined access + erasure request under GDPR (EU customer identified by email domain).

**Deadline:** 30 days from today = [date].

**Identity verification:** Email matches account on file — low-risk, no additional verification needed for a known customer.

**Systems to check:** CRM (HubSpot), payment processor (Stripe), email platform (Mailchimp), analytics (Mixpanel), support tickets (Intercom), backup/archive systems.

**Acknowledgment draft** (send today): Confirms receipt, reference number, 30-day response deadline, DPO contact.

**Erasure analysis:** Sales/marketing data can be deleted immediately. Payment records held 7 years under UK tax law (legal obligation exemption, Art. 17(3)(b)). Confirm exemption applies before deletion.

**Response draft:** Confirms data categories found, confirms deletion of marketing data, explains 7-year retention of payment records with legal basis, includes right to complain to ICO.

---
