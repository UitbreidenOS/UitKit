---
name: crm-hygiene
description: Trigger this skill when:
updated: 2026-06-13
---

# CRM Hygiene

## When to activate

Trigger this skill when:
- An SDR completes any outbound/inbound touch (call, email, LinkedIn message, voicemail)
- Before an AE joins a meeting with a prospect
- During pipeline review to ensure data integrity before deal progression
- When CRM records show incomplete or stale activity logs (>2 hours since last touch)
- When scheduling a handoff between SDR and sales team
- When a deal moves between pipeline stages (requires field completion gate)

## When NOT to use

Do not invoke this skill for:
- Post-sale customer support activities (use customer success CRM templates instead)
- Internal-only team meetings or admin activities
- Retrospective cleanup of old records (>90 days) without explicit audit trigger
- Non-contact-facing activities (e.g., research, team admin)
- Accounts marked DEAD that have no new signal in 6+ months (archive instead)

---

## Instructions

### I. Post-Call Note Template

Every call — inbound or outbound, successful or failed — must be logged within 2 hours with these fields completed:

#### Required Fields

**What Happened**  
Disposition in exactly one sentence. Use standardized codes:
- `Connected` — live person answered, conversation took place
- `Left VM` — voicemail deposited, specify greeting heard (generic/personalized)
- `No Answer` — rang through, no response
- `Bad Number` — number invalid, disconnected, or wrong person reached
- `Gatekeeper` — screened by assistant/front desk, no handoff to target

*Example:* "Connected with Jennifer Martinez, CMO, for 12 min. She answered directly to question about X initiative."

**Key Pain Mentioned**  
Capture exact prospect language in quotes. Not paraphrasing — direct quotes are gold for objection handling and personalization in future outreach.

*Example:* "She said: 'We're stuck with [Legacy System] and can't justify the cost of switching. Our CFO won't approve new tool spend until next fiscal.'"

**Qualification Status**  
Map to MEDDPICC elements confirmed so far:
- **Metrics**: Revenue impact number mentioned? Budget allocated?
- **Economic Buyer**: Did you reach/identify them? Role confirmed?
- **Decision Criteria**: What are they evaluating on? Speed, cost, integration?
- **Decision Process**: Timeline confirmed? Approval layers identified?
- **Pain**: Acknowledged and quantified?
- **Identified Champion**: Is there an internal advocate?
- **Implications**: Did they articulate business consequence?
- **Commitment**: What's the next step they committed to?

Mark each as `Confirmed`, `Partial`, or `Missing`. This determines readiness for AE handoff.

*Example:*
```
Metrics: Confirmed (£2M annual budget mentioned)
Economic Buyer: Missing (spoke to user, not CFO/VP Finance)
Decision Criteria: Partial (speed mentioned, cost tolerance unclear)
Pain: Confirmed (exact quote captured)
Champion: Missing
```

**Next Step**  
Specific, dated action with owner. Not vague. Include:
- What: exact next action (call, email with resource, meeting)
- Owner: SDR name or AE name if handing off
- Date: calendar date, not "next week"
- Contingency: what happens if they don't respond in 5 days?

*Example:* "SDR (Sarah) to send 3-min product overview video by 2026-06-05. If no response by 2026-06-10, escalate to AE follow-up."

**Objections Raised**  
Log every objection verbatim. Add your response if given. Do not assume these are deal-killers — they're data for AE prep.

*Example:*
```
Objection: "We have an incumbent and are locked in until Q3 2027."
Response Given: "Understood. When Q3 approaches, would it make sense to evaluate options 90 days out?"
Follow-up Flag: Yes — cycle back 2026-04-01 as contract renewal nears.
```

---

### II. Activity Logging Standards

**Timing**: Log every activity within 2 hours of completion. No batching end-of-day.

**Coverage**: Log every touch, including:
- Phone calls (inbound/outbound)
- Voicemails deposited
- Emails sent (include subject line snippet)
- LinkedIn messages, connection requests, profile views on active accounts
- Demos, webinar attendance, content downloads
- Task completions (follow-up scheduled, resource sent)

**Disposition Codes (Standardized)**

| Activity Type | Code | Definition |
|---|---|---|
| Call | Connected | Live conversation with target |
| Call | Left VM | Voicemail deposited; log greeting style |
| Call | No Answer | Rang, no pickup, no VM; try again |
| Call | Bad Number | Invalid, wrong person, or gatekeeper refusal |
| Email | Sent | Timestamp when deployed; record subject |
| Email | Opened | Track via pixel or reply assumption |
| Email | Replied | Note reply sentiment (positive/neutral/negative) |
| Email | Bounced | Undeliverable; flag for re-sourcing |
| LinkedIn | Message Sent | Note personalization level |
| LinkedIn | Profile View | Log only if account is ACTIVE tier (see tagging) |
| Other | Task Completed | Resource sent, call scheduled, follow-up logged |

---

### III. Pipeline Tagging Taxonomy

**Every lead record must have all four tag layers.** Use these exact tags; don't invent variants.

#### Lead Source Tag (One Required)
- `INBOUND` — inbound inquiry, form submission, referral, event attendee
- `POSTBOUND` — post-event nurture, webinar attendee, blog downloader
- `BRIDGEBOUND` — warm intro, mutual connection referral
- `OUTBOUND` — cold outreach, LinkedIn message, email list purchase

#### Signal Tag (What Triggered Outreach)
Capture the specific reason for engagement:
- `Hiring_Spree` — LinkedIn shows new headcount (hiring page, job posts)
- `Funding_Event` — Series A/B close, press mention, Crunchbase signal
- `Leadership_Change` — new CMO, CFO, VP Engineering hired (LinkedIn)
- `Integration_Partnership` — announced partnership with tool ecosystem
- `Compliance_Change` — new regulation affecting their industry (SOC 2, HIPAA, GDPR)
- `Earnings_Call` — public company earnings transcript mentions pain point
- `RFP_Issued` — prospect issued RFP (sometimes visible in procurement forums)
- `Contract_Renewal` — estimated renewal date for incumbent approach (research-based)
- `Dormant_Account` — previous contact inactive 12+ months, new signal arrived
- `Generic_Outreach` — no specific trigger; general prospecting

#### Sequence Stage (One Required)
- `ACTIVE` — in active cadence, touch expected in next 7 days
- `PAUSED` — on pause (waiting for response, out of office, bad timing); resume date set
- `COMPLETED` — cadence finished; no more touches unless new signal
- `CONVERTED` — moved to opportunity, now owned by AE
- `DEAD` — unqualified, unresponsive, or explicitly disqualified; no further contact

#### Tier Tag (One Required)
- `T1` — economic buyer confirmed, MEDDPICC 80%+ complete, deal imminent (AE ownership)
- `T2` — influencer or user identified, pain confirmed, 60%+ complete, needs more qualification
- `T3` — early-stage lead, pain surface-level, 30%+ complete, high-volume prospecting pool

---

### IV. Pre-Meeting Handoff Brief (SDR → AE)

Create this document in Slack, Notion, or CRM when transferring a meeting to AE. Estimated read time: 2 minutes. Use this exact structure:

#### 1. Account Background (2 Sentences Max)
- Company size, industry, revenue ballpark
- What they do; why we think they're a fit

*Example:* "Revolve is a £180M mid-market SaaS vendor in vertical HR. They just raised Series C and are scaling from 3 to 8 solutions in product portfolio."

#### 2. Contact Profile (Role, Tenure, Pain)
- Title and exact role (use LinkedIn title if available)
- Tenure at company (influence level)
- Their specific pain point and quote

*Example:* "Jennifer Martinez, CMO, 2.4 years tenure. In charge of marketing tech stack and personalization. Pain: 'We're stuck with legacy MarTech and losing feature parity vs. competitors. Each new tool we buy needs 4 weeks integration work.'"

#### 3. MEDDPICC Score and Gaps
- Overall score (0–100%); break down by element
- Critical gaps that AE must address in this meeting

*Example:*
```
Overall Qualification: 68%
- Metrics: 75% (budget mentioned)
- Economic Buyer: 40% (spoke to CMO, not CFO)
- Decision Criteria: 80% (speed + integration depth)
- Pain: 85% (quote captured)
- Champion: 0% (need to identify)

Critical Gap: Must determine economic buyer and CFO involvement by end of meeting.
```

#### 4. Sequence Messaging (What Was Said)
- Personalization hooks used (company research, announcement, referral name)
- Objections raised (don't repeat them; flag them)
- Tone of conversation (receptive, skeptical, distracted)

*Example:* "Used their Series C announcement to open. She was receptive to speed/integration angle but skeptical on cost. Mention ROI in first 90 days; she'll ask for it."

#### 5. Why They Agreed to a Meeting
- What specifically resonated; what moved them from 'no' to 'yes'
- What they want to learn in this call

*Example:* "She agreed when I said 'We'd walk through a 60-day implementation plan tailored to your stack.' She wants to see if we can match their speed requirements without 4-week integrations."

---

### V. Deduplication Rules

**Before logging any new contact in CRM, check:**

1. **Email match**: Search by work email domain + first/last name. If found, merge records; don't create duplicate.
2. **LinkedIn URL match**: If two records have same LinkedIn profile URL, they're the same person.
3. **Phone number match**: Exact phone match OR same company + same name = same person. Merge.
4. **Account-level dedup**: If contact already logged under correct company account, use existing record instead of orphaning.

**Merge protocol:**
- Preserve all activity history from both records
- Keep original contact date
- Combine notes (prepend with timestamp)
- Archive the duplicate record with merge note

---

### VI. Data Quality Gates (Before Meeting is Logged)

**A meeting cannot be logged as "scheduled" until all gates pass:**

1. **Contact field completion**:
   - First name: required
   - Last name: required
   - Work email: required
   - LinkedIn profile URL: required
   - Job title: required

2. **Account field completion**:
   - Company name: required (exact legal entity, not nickname)
   - Industry: required
   - Company size (employee count): required
   - Annual revenue or funding stage: required

3. **Qualification gate**:
   - Lead tier assigned (T1, T2, T3)
   - At least one MEDDPICC element confirmed
   - Pain statement captured (one sentence minimum)

4. **Activity trail gate**:
   - At least one logged activity (call, email, LinkedIn message) in the past 30 days
   - Next step documented
   - No orphaned contacts (must be linked to correct company account)

**Consequence**: If gates fail, meeting is marked "pending approval" in CRM. AE cannot move deal forward until SDR remediates data.

---

### VII. CRM Field Completion Checklist

**Minimum required fields per stage:**

**Lead Stage (prospect identified, not qualified)**
- Contact: first name, last name, email, phone, title, company, LinkedIn URL
- Account: company name, industry, size, revenue, location
- Activity: call disposition or email sent (past 30 days)
- Tagging: lead source, signal trigger, sequence stage (ACTIVE/PAUSED)

**Qualified Lead (MEDDPICC 50%+, pain confirmed)**
- All fields above, plus:
- MEDDPICC breakdown (one sentence per element)
- Pain statement (exact quote, if possible)
- Next step (dated, with owner)
- Contact objections (if any)
- Tier tag assigned (T1/T2/T3)

**Meeting Scheduled (confirmed with prospect)**
- All fields above, plus:
- Meeting date/time/attendees (confirmed)
- Meeting agenda (one-line summary)
- Pre-meeting brief (5-point handoff document)
- AE assignment confirmed
- Follow-up task created for day after meeting

**Opportunity (AE ownership, deal in cycle)**
- All fields above, plus:
- Deal value (ARR/one-time fee)
- Close date (realistic)
- Primary decision-maker confirmed
- Economic buyer confirmed
- Approval chain identified (CEO, CFO, VP, etc.)

---

## Example

**Scenario**: Sarah (SDR) completes a cold call to Marcus Chen, VP of Product at a mid-market fintech startup. He picks up, hears the pitch, but says they're locked into their current vendor. Sarah documents the call and hands off insights to her AE, James.

**Post-Call Note (Sarah logs within 45 min)**

```
Activity Type: Phone Call
Contact: Marcus Chen
Company: PaymentFlow (£80M revenue, fintech)
Date: 2026-06-02, 10:15 AM
Duration: 7 min

WHAT HAPPENED
Connected with Marcus Chen, VP of Product, for 7 minutes. He answered directly and engaged through entire pitch.

KEY PAIN MENTIONED
"Our current provider is solid but keeps adding bloat. Every update has features we don't need. We spend 20% of engineering time integrating their junk."

QUALIFICATION STATUS
Metrics: Partial (revenue mentioned, budget not)
Economic Buyer: Missing (spoke to user, need CFO)
Decision Criteria: Confirmed (vendor bloat, integration lift)
Pain: Confirmed (exact quote captured)
Champion: Partial (Marcus is advocate internally, not yet confirmed)
Timeline: Missing
Implications: Partial (time cost mentioned, business impact unclear)
Commitment: None yet (listening posture only)

NEXT STEP
Sarah to send 4-min demo video (integration examples) by 2026-06-04.
If viewed, schedule 30-min technical deep-dive with Marcus + 1 engineer by 2026-06-08.
If no response by 2026-06-08, pause sequence and revisit Q4 2026 (contract renewal cycle).

OBJECTIONS RAISED
Objection: "We're locked into our incumbent until end of 2027."
Response Given: "Understood. We typically build a business case to pitch at renewal. Would it make sense to chat again around April 2027, 9 months out?"
His Response: "Maybe. Send me something first."
Follow-up Flag: YES — add to contract-renewal sequence, cycle 2027-04-01.

TAGS ASSIGNED
Lead Source: OUTBOUND
Signal Trigger: Earnings_Call (recent fintech funding round announcement)
Sequence Stage: ACTIVE (demo video pending)
Tier: T2 (influencer, pain confirmed, budget/timeline missing)

HANDOFF TO AE (Not needed yet; will create before meeting scheduled.)
```

---

**Pre-Meeting Handoff Brief (Created 3 days later when Marcus agrees to meeting)**

```
TO: James (AE) | FROM: Sarah (SDR) | DATE: 2026-06-05
MEETING: Marcus Chen, PaymentFlow | SCHEDULED: 2026-06-09, 2:00 PM

1. ACCOUNT BACKGROUND
PaymentFlow is an £80M mid-market fintech platform serving SMBs. They recently closed funding and are scaling engineering to support faster feature velocity. Integration overhead is a growing friction point.

2. CONTACT PROFILE
Marcus Chen, VP of Product, 2.3 years tenure. Direct influence over vendor stack. Pain (verbatim): "Every update has features we don't need. We spend 20% of engineering time integrating their junk."

3. MEDDPICC SCORE
Overall: 58%
- Metrics: Partial (revenue known, budget not; estimate needed)
- Economic Buyer: Missing (only spoke to user; CFO not yet contacted)
- Decision Criteria: Confirmed (simplicity + low integration lift)
- Pain: Confirmed (vendor bloat, time sink)
- Champion: Partial (Marcus will advocate, but need peer confirmation)
- Implications: Missing (business impact of bloat not quantified)
- Commitment: None yet

Critical Gap: Must identify economic buyer (CFO?) and quantify cost of integration overhead in £/hours.

4. SEQUENCE MESSAGING
Opening hook: Referenced their fintech funding round and scaling engineering narrative (from Crunchbase).
He engaged strongly on "integration burden" angle.
Hesitation: Incumbent lock-in until end 2027. Positioned renewal conversation as 9-month window.

5. WHY THEY AGREED
Resonance point: "We'll walk through how other fintech platforms reduced integration overhead by 60%."
He wants to see: Proof from similar companies; low-touch integration examples.

---

NEXT STEPS FOR JAMES:
- Lead with competitor comparison (similar fintech use case).
- Ask about integration team size; quantify current cost.
- Identify economic buyer question: "Who signs off on vendor changes here?"
- Set expectation: Loop in Marcus's CEO/CFO if deal moves forward.
```

---

**CRM Fields Completed (Screenshot-equivalent output)**

```
CONTACT RECORD: Marcus Chen
First Name: Marcus
Last Name: Chen
Email: marcus.chen@paymentflow.io
Phone: +44 20 XXXX XXXX
Title: VP of Product
LinkedIn URL: linkedin.com/in/marcuschen-fintech
Company: PaymentFlow

ACCOUNT RECORD: PaymentFlow
Legal Name: PaymentFlow Ltd.
Industry: Financial Services / Fintech
Employee Count: 240
Annual Revenue: £80M (estimated from Crunchbase)
Funding Stage: Series B/C (recent round)
Headquarters: London, UK
Website: paymentflow.com

ACTIVITY LOG: Last 30 Days
- 2026-06-02, 10:15 AM | Phone Call | Connected (7 min) | Sarah
- 2026-06-04, 2:30 PM | Email Sent | Demo video link | Sarah
- 2026-06-05, 11:00 AM | Email Opened | Marcus opened demo video
- 2026-06-05, 1:45 PM | Email Replied | "Interesting. Let's talk." | Marcus
- 2026-06-09, 2:00 PM | Meeting Scheduled | James (AE) + Marcus + 1 engineer

TAGGING
Lead Source: OUTBOUND
Signal Trigger: Earnings_Call / Fintech Expansion
Sequence Stage: CONVERTED (now in AE pipeline)
Tier: T2

QUALIFICATION
Pain (Exact Quote): "Every update has features we don't need. We spend 20% of engineering time integrating their junk."
MEDDPICC Overall: 58% (economic buyer missing, implications missing)
Next Step: Meeting 2026-06-09; AE to identify CFO/economic buyer
```

---

## Benchmarks & Standards

- **Log rate target**: 95%+ of activities logged within 2 hours. Audit weekly.
- **Handoff quality**: AE should never ask "Who is this?" or "What did they say?" — all context in brief.
- **Dedup rate**: <2% duplicate records per 100 new leads. Merge monthly.
- **Data gate pass rate**: 90%+ of meetings scheduled meet all field completion gates before logged as "confirmed."
- **MEDDPICC average on T1 handoff**: 80%+ across six elements (excluding timeline/implications if not yet discussed).
- **Activity logging SLA**: 95% within 2 hours; 99% within 4 hours. Zero logs older than end-of-business-day.
