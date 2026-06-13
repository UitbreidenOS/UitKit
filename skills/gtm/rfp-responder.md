---
name: rfp-responder
description: "RFP and security questionnaire response: analyse, score, and respond to enterprise RFPs, security questionnaires (SIG, CAIQ), and vendor assessments — efficiently and accurately"
updated: 2026-06-13
---

# RFP Responder Skill

## When to activate
- Responding to an enterprise RFP (Request for Proposal) or ITT (Invitation to Tender)
- Completing a security questionnaire (SIG Lite, SIG Core, CAIQ, custom)
- Responding to a vendor assessment or due diligence questionnaire
- Building a response library for frequently-asked RFP questions
- Scoring an incoming RFP to decide whether to bid

## When NOT to use
- Contract negotiation after winning an RFP — use the deal-desk skill
- Legal compliance review of the RFP terms — use the vendor-contract-review skill
- Marketing positioning — use the copywriting skill
- First sales call or demo — use the sdr-agent skill

## Instructions

### RFP bid/no-bid scoring

```
Score this RFP to decide whether to bid.

RFP details:
- Issuer: [company name, size, industry]
- Estimated contract value: $[X]
- Submission deadline: [date] (time available: [X weeks])
- Contract length: [X months/years]
- Geographic restrictions: [jurisdiction or location requirements]
- Incumbent: [known / unknown / we are the incumbent]

Score on 5 criteria (1-5 each):

1. STRATEGIC FIT:
   - Is this customer in our ICP?
   - Would winning this deal advance our market position?
   - Is there a strong reference-customer opportunity?
   Score: [1-5]

2. WIN PROBABILITY:
   - Do we have an existing relationship or champion?
   - Is this a competitive replacement or greenfield?
   - Did we help shape the requirements (wired RFP)?
   Score: [1-5]

3. COMMERCIAL ATTRACTIVENESS:
   - Is the contract value worth the bid effort?
   - Are the payment terms acceptable?
   - Is the budget confirmed or exploratory?
   Score: [1-5]

4. DELIVERY FIT:
   - Can we fulfil the technical requirements as stated?
   - Are there onerous custom requirements?
   - Is the timeline achievable?
   Score: [1-5]

5. BID FEASIBILITY:
   - Do we have the capacity to respond by the deadline?
   - Who would own this response internally?
   - Do we have the collateral ready (case studies, security questionnaire, certifications)?
   Score: [1-5]

Total score = sum of 5 criteria (max 25)
- 20-25: BID — strong fit, invest fully
- 15-19: BID SELECTIVELY — bid only if champion exists or you have spare capacity
- 10-14: EVALUATE — consider a light bid or no-bid with relationship-building alternative
- < 10: NO BID — not worth the investment

Output: score + rationale + bid/no-bid recommendation.
HUMAN DECISION required — this is a recommendation, not an auto-decision.
```

### RFP response structure

```
Build a response for [RFP].

RFP requirements: [paste or describe the key sections]
Evaluation criteria: [if disclosed — weightings or priorities]
Submission format: [document / portal / email / in-person presentation]
Deadline: [date]
Differentiators we want to highlight: [list 3-5]

RFP response structure (adapt to the specific format required):

EXECUTIVE SUMMARY (1-2 pages):
- Problem statement: demonstrate you understand what they're trying to solve (not just what they asked for)
- Proposed solution: how you solve it at a high level
- Why choose us: 3 key differentiators specific to this customer's stated priorities
- Proof: one relevant case study with quantified outcome

COMPANY OVERVIEW (1 page):
- Founded, headquarters, team size
- Revenue or funding (if shareable)
- Customer count and notable logos in their industry
- Certifications (SOC 2, ISO 27001, GDPR, etc.)

SOLUTION DESCRIPTION (bulk of the response):
- Map each of their requirements to a specific capability
- Format: [Their requirement] → [Our capability] → [Evidence]
- Never skip a requirement: "not applicable" is better than silence
- Use their vocabulary, not yours

IMPLEMENTATION / ONBOARDING (if applicable):
- Timeline: phased rollout with milestone dates
- Team: who will be assigned, their experience
- Training: what you provide to end users and administrators
- Support: SLA, channels, response times

PRICING (follow their format):
- Line-item pricing for each component they asked for
- If custom: provide a range or indicate that pricing follows a discovery call
- Total cost of ownership view if it helps (avoid sticker shock)

REFERENCES AND CASE STUDIES:
- 2-3 references in a similar industry or use case
- Include: company name (if permitted), challenge, solution, quantified outcome
- "References available on request" is weak — provide specifics

APPENDICES (as required):
- Security questionnaire responses
- Certifications and accreditation documents
- Standard contract / MSA

Write the response framework for my specific RFP.
```

### Security questionnaire response

```
Complete this security questionnaire.

Questionnaire type: [SIG Lite / SIG Core / CAIQ / custom]
Issuer: [company name]
Deadline: [date]
Our certifications: [SOC 2 Type II / ISO 27001 / HIPAA / PCI-DSS / none]

Standard response principles:

1. Answer from certifications first:
   - For SOC 2 controls: "This control is covered by our SOC 2 Type II report (available under NDA). Control reference: CC6.1."
   - For ISO 27001: "This is addressed in our ISMS under control A.9.2 (User access management). ISO 27001 certificate available on request."
   - Don't re-describe what the certification already proves — reference it

2. For questions not covered by certification:
   - Answer specifically and truthfully
   - Include evidence type: "Documented in our Access Control Policy (v2.1)"
   - Offer to provide documentation under NDA if they need the policy itself

3. For gaps (where you don't have a control):
   - "In progress: we are implementing [X] as part of our Q[N] security roadmap. Target completion: [date]."
   - OR offer a compensating control: "While we do not have [X], we mitigate this risk through [compensating control]."
   - Never leave a gap blank — it looks evasive; honest gaps with mitigations are better

Common questions and recommended responses:

Q: Do you have SOC 2 Type II?
A (if yes): "Yes. Our SOC 2 Type II report (Security + Availability TSC) is available under NDA. Last audit period: [dates]. Auditor: [firm]."

Q: How do you handle data breaches?
A: "We maintain a documented Incident Response Plan. Under GDPR, we notify supervisory authorities within 72 hours and affected customers within [X] hours of confirming a breach. Our last incident response test was [date]."

Q: Do you encrypt data at rest and in transit?
A: "All data at rest is encrypted using AES-256 (AWS KMS). All data in transit uses TLS 1.2+. Encryption is enforced across all production environments."

Q: How often do you conduct penetration testing?
A: "Annual penetration tests are conducted by [third-party firm]. Last test: [date]. Findings are remediated per our vulnerability management SLA (critical: 30 days, high: 60 days)."

Q: Where is customer data stored?
A: "All customer data is stored in [AWS us-east-1 / EU-West-1 / etc.]. We do not transfer data outside [jurisdiction] except as required by [specific exception — e.g., support tooling with data processing agreements in place]."

Build the complete questionnaire response for my certification level and the specific questions asked.
```

### Response library

```
Build a reusable RFP response library for [company].

Company: [name]
Products: [describe]
Certifications: [list]
Top customer segments: [industries / company sizes]
Frequently asked RFP sections: [list the categories that come up most often]

Library structure:

COMPANY BOILERPLATE (update quarterly):
- Company overview: [250 words, updated with latest employee count and ARR]
- Executive team bios: [CEO, CTO, VP Sales — 3-4 sentences each]
- Investment and funding: [Series X, backed by X — or "privately held" if not disclosable]
- Customer references: [5-7 references pre-approved to share, with industry and outcome]

CAPABILITY DESCRIPTIONS (by product area):
[Product/feature]: [250-word description ready to paste]

SECURITY (standard block):
[Prepared answer for each of the 20 most common security questions]
Update whenever certification status changes.

CASE STUDIES (2-3 per vertical):
[Industry]: [Company type] + [Problem] + [Solution] + [Outcome with a number]

CERTIFICATIONS AND COMPLIANCE:
[SOC 2: dates, auditor, coverage]
[ISO 27001: certificate number, expiry, scope]
[GDPR: DPA template available, DPO contact]
[HIPAA: BAA available on request]

PRICING LANGUAGE:
[Standard response: "Pricing is customised based on volume and configuration. Our team will provide a detailed quote within 3 business days of receiving your requirements."]
[Or: standard pricing table if your pricing is published]

Maintenance cadence:
- Quarterly: update company stats, customer count, certifications
- After each RFP: add new case study or approved reference if a new win
- After each security questionnaire: update security block with any new controls

Generate the response library structure for my company.
```

## Example

**User:** We received a 200-question SIG Core from a financial services enterprise. We have SOC 2 Type II but no ISO 27001. Deadline is 10 days. How do we respond efficiently?

**Claude's strategy:**

200 questions in 10 days = don't answer every question from scratch. Triage first.

**Step 1 — Categorise (Day 1, 2 hours):**
Group all 200 questions into:
- Covered by SOC 2: mark with "SOC 2 ref: [control]" — respond by citing the report
- Policy-documented: mark with "Policy: [name]" — quick specific answer
- Not applicable: mark as N/A with justification (e.g., physical controls if cloud-only)
- Gaps: honest answer + compensating control or in-progress note

Expect breakdown for a SOC 2 Type II holder: ~70 questions covered by SOC 2, ~60 by policy, ~40 N/A, ~30 genuine gaps.

**Step 2 — Batch by owner (Day 1-2):**
Engineering owns: encryption, access controls, vulnerability management, logging
Legal owns: data processing, privacy, regulatory compliance
Finance/ops owns: business continuity, insurance, third-party contracts

**Step 3 — Write the SOC 2 block once, reference everywhere (Day 2):**
"This control is addressed in our SOC 2 Type II audit (available under NDA). Control reference: [CC#]. Audit period: [dates]. Auditor: [firm]."
Copy this template across all SOC 2-covered questions — 10 minutes per control, not 10 questions × 30 minutes each.

**Step 4 — Gaps (Day 5-7):**
For each genuine gap: 2-3 sentences — what we don't have, what we do instead, when we plan to address it.

**Step 5 — Review and submit (Day 8-10):**
Have legal review the data/privacy section. CEO spot-check the 10 most sensitive questions. Submit with a cover note offering a virtual security meeting with your CTO.

---
