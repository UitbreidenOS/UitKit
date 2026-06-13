# Email Campaign Workflow

A repeatable end-to-end workflow for planning, writing, testing, sending, and analysing email campaigns — from brief to post-send analysis.

---

## Overview

**Time investment:** ~45-90 minutes per campaign (replaces 3-5 hours of fragmented work).

**What this workflow covers:**
- Campaign brief and planning
- A/B test design
- Email copywriting and review
- Pre-send checklist
- Post-send analysis
- Learning capture for future tests

**Prerequisites:** At minimum `/email-campaign`, `/email-ab-tester`, and `/email-deliverability` installed.

---

## Phase 1: Campaign brief (10 minutes)

### Step 1: Define the campaign

Before writing a single word, answer these questions. This brief prevents campaigns that sound good but do nothing.

```
/email-campaign

Campaign brief:

1. Campaign name (internal reference): [name]
2. Send date and time: [date, time, time zone]
3. Audience segment: [segment name, size, last send date to this segment]
4. Campaign objective: [one of: drive revenue / re-engage inactive / announce product / nurture / educate]
5. Primary CTA: [exactly one — "buy now" / "book a call" / "read the article" — one CTA only]
6. Offer or content hook: [what's in this email that's worth opening?]
7. Success metric: [how will you measure whether this campaign worked?]
   - Revenue campaigns: revenue attributed within 7 days
   - Re-engagement: click rate from inactive segment
   - Nurture: click rate + downstream conversion in 14 days

What I am NOT sending to this segment in the next 7 days: [check your calendar — over-mailing kills engagement]

Output: validated campaign brief. Flag any gaps or conflicts with current campaign calendar.
```

---

## Phase 2: A/B test design (10 minutes)

Every campaign sent to > 1,000 subscribers should have a test unless it's a time-critical one-off.

```
/email-ab-tester

Campaign: [from the brief above]
My A/B test backlog — next hypothesis to test: [pull from your testing backlog]

Design the test:
- Variable to test (one only): [subject line / CTA / email length / send time / offer framing]
- Variant A (control): [current best practice or what you'd default to]
- Variant B (challenger): [the hypothesis you're testing]
- Sample size available: [segment size × 0.8, hold back 20% for winner send]
- Minimum detectable effect: [10-15% relative improvement typically]

Output:
- Isolated variable confirmation (what's identical between variants)
- Sample size calculation (is this test powered?)
- Decision rule (what constitutes a winner — significance level, decision timeline)
- What you'll learn if A wins vs. if B wins
```

**Split setup:**
- Test group: 40% of segment → Variant A (20%) + Variant B (20%)
- Winner group: 60% of segment → receives winning variant 4 hours after test period closes

---

## Phase 3: Copywriting (20-30 minutes)

### Step 1: Write the email

```
/email-campaign

Write email copy for: [campaign name]

Variant: [A or B — write one at a time]
Subject line: [from A/B test design]
Preview text: [50 chars max — extends the subject line, doesn't repeat it]
Segment: [describe who receives this]
Brand voice: [formal / conversational / direct / playful]
Offer: [specific — "$30 off", "new product: [name]", "your Q3 report is ready"]
Body length: [short: < 150 words / medium: 200-350 words / long: 350-500 words — match to campaign type]
CTA button text: [be specific: "Shop the sale" not "Click here"]
CTA URL placeholder: [destination page]

Structure:
- Hook: [opening line that earns the read — reference the offer or problem]
- Body: [deliver the value in 2-3 short paragraphs or bullets]
- CTA: [one clear action]
- Footer: unsubscribe, physical address, preference centre link

Produce complete email HTML with inline styles (no external CSS — it gets stripped).
Also produce plain-text version (required for deliverability).
```

### Step 2: Write the B variant subject line / element

```
/email-campaign

Write Variant B for: [campaign name]

The only thing changing: [subject line / first paragraph / CTA text — the A/B variable]
Variant A [element]: [paste]
Variant B [element]: [write the challenger]

Context: [what the hypothesis is — why we think B might win]
```

### Step 3: Editing pass

Paste both drafts and ask for an edit pass:

```
Edit these two email variants for:
1. Clarity — does every sentence earn its place? Remove anything that doesn't move the reader toward the CTA.
2. Spam triggers — any words or patterns likely to flag spam filters?
3. Mobile readability — does this read well in 375px width? Are paragraphs < 3 sentences?
4. CTA prominence — is the CTA above the fold on mobile? Is it clear what happens when you click?
5. Preheader / preview text — does it extend the subject line rather than repeat it?

Return: cleaned versions of both variants with a brief note on what changed.
```

---

## Phase 4: Pre-send checklist (10 minutes)

Run this on every campaign before scheduling. Non-negotiable.

```
/email-deliverability

Pre-send checklist for: [campaign name]

Email details:
- From name: [should be recognisable to subscribers — "Sarah from Brand" or "Brand"]
- From address: [must match authenticated sending domain]
- Reply-to address: [monitored inbox — not no-reply if you want replies]
- Subject line: [paste]
- Preview text: [paste]
- Email body: [paste or describe key elements]
- Unsubscribe link: [present? location?]
- Physical address in footer: [present?]
- List-Unsubscribe header: [confirm your ESP adds this automatically]
- UTM parameters on all links: [yes/no]

Segment health:
- Last send to this segment: [date]
- Open rate last campaign to this segment: [X%]
- Frequency this week to this segment (including this campaign): [X]

Run a deliverability check and content scan.
Flag: any issues that could affect inbox placement.
```

**Technical checklist (do manually):**
- [ ] Test send to your own inbox, a Gmail, and an Outlook address
- [ ] Check mobile preview (Gmail app on iOS)
- [ ] Verify all links open the correct destination
- [ ] Confirm tracking pixels are firing (check GA4 or your analytics tool)
- [ ] Confirm the send is to the correct segment (not your full list)
- [ ] Confirm send time is correct time zone

---

## Phase 5: Send and monitor

### First 4 hours (A/B test window)

```
Monitor the test:
- Do not check results until [test end time]
- Resist the urge to declare a winner at 20% open rate — let it run

Set a calendar reminder for: [test end time = 4 hours after send in most ESPs]
```

### Winner send decision

```
/email-ab-tester

Test results for: [campaign name]

Variant A ([description]): [X%] metric — [N sends]
Variant B ([description]): [X%] metric — [N sends]

Interpret: is this statistically significant? Which variant wins?
Decision: send winner to remaining 60% of segment.

If inconclusive: [what you'll do — send A (control) by default, and note this test needs a larger sample next time]
```

---

## Phase 6: Post-send analysis (15 minutes, 48-72 hours after send)

### Step 1: Performance check

```
/email-ab-tester

Post-send analysis for: [campaign name]

Final metrics (pull from ESP — wait 48-72 hours for attribution to stabilise):
- Sent: [X]
- Delivered: [X] / Delivery rate: [X%]
- Unique opens: [X] / Open rate: [X%]
- Unique clicks: [X] / Click rate: [X%]
- Click-to-open rate: [X%]
- Revenue attributed (72h): [$X]
- Revenue per email: [$X]
- Unsubscribes: [X] / Unsubscribe rate: [X%]
- Spam complaints: [X] / Complaint rate: [X%]
- Hard bounces: [X]

Benchmark comparison:
- Open rate vs. 30-day average for this segment: [+X% / -X%]
- Click rate vs. 30-day average: [+X% / -X%]
- Revenue vs. target: [$X target vs. $X actual]

A/B test result:
- Winner: Variant [A/B]
- Was the test significant? [yes/no]
- Relative improvement: [X%]

Analyse: what does this tell us about this segment and this message type?
```

### Step 2: Learning capture

Never let a campaign result go undocumented. Lessons compound.

```
/email-ab-tester

Capture learnings from: [campaign name]

Test: [what was tested]
Result: [Variant A/B won / inconclusive]
Significance: [yes/no + p-value or confidence level]
Relative improvement: [X%]

What this tells us:
- About this segment: [1-2 insights]
- About subject line patterns: [what worked or didn't]
- About offer framing: [what worked or didn't]
- About send time: [any signal?]

Principle to add to our email playbook: [1-sentence generalisation that applies beyond this single campaign]

Does this change our default approach for future campaigns of this type? [yes/no + what changes]

Add to A/B testing backlog: [what to test next, based on this result]
```

---

## Monthly rhythm

### Start of month — Campaign calendar

```
/email-campaign

Plan this month's email calendar.

Business context for [MONTH]:
- Major campaigns: [product launches, promotions, seasonal events]
- Content commitments: [newsletter, educational emails, case studies]
- Segments to prioritise: [who hasn't been emailed recently]
- Segments to rest: [who has been over-emailed]
- A/B tests scheduled: [which hypothesis from the backlog to run this month]

Constraints:
- Email frequency cap: [max X emails per subscriber per week]
- Blackout dates: [days to avoid — e.g., major holidays]

Produce: monthly email calendar with dates, segments, objectives, and A/B tests marked.
```

### Monthly deliverability audit

```
/email-deliverability

Monthly deliverability audit for [MONTH]:

Metrics this month:
- Average bounce rate: [X%] (alert > 2%)
- Average spam complaint rate: [X%] (alert > 0.1%)
- Inbox placement rate (if tracked): [X%]
- Domain reputation in Google Postmaster Tools: [High / Medium / Low]
- List growth vs. churn: [net subscribers added]

List health:
- Inactive > 90 days: [X subscribers] — action?
- Inactive > 180 days: [X subscribers] — sunset campaign?
- New imports this month: [source, volume, verification status]

Authentication check:
- SPF: [valid]
- DKIM: [valid]
- DMARC: [policy level — none/quarantine/reject]

Produce: any immediate actions needed + list hygiene recommendations.
```

---

## When things go wrong

### "This campaign is landing in the Promotions tab"

```
/email-deliverability

My campaign is being tabbed to Promotions in Gmail.

Subject line: [paste]
From address: [paste]
Email summary: [describe — is it promotional? image-heavy? many links?]

What causes Gmail to tab to Promotions:
- Promotional language in subject + body
- High image-to-text ratio
- Too many links / tracking pixels
- Batch-and-blast sending pattern (no personalisation signals)
- From a sending domain with low engagement history

What I should do (in order of impact):
1. Improve list engagement (engaged subscribers reclassify messages)
2. Ask subscribers to move you to Primary with a re-engagement campaign
3. Reduce promotional language — test more editorial/personal tone
4. Reduce image-to-text ratio
5. Personalise — segment + personalisation tokens

Note: the Promotions tab is NOT the spam folder. Open rates from Promotions are lower but
still measurable. Don't compromise editorial quality just to avoid the Promotions tab.
```

### "Open rates fell 30% this month"

```
/email-deliverability

Deliverability investigation:

Open rate trend:
- 3 months ago: [X%]
- 2 months ago: [X%]
- Last month: [X%]
- This month: [X%]

What changed in the same period?
- New sending domain or IP? [yes/no]
- ESP migration? [yes/no]
- List imports? [yes/no — if yes, source and verification status]
- Send frequency change? [yes/no]
- Content type change? [yes/no]
- iOS / Apple Mail Privacy Protection impact? [is your audience iOS-heavy?]

Diagnose:
1. Check Google Postmaster Tools — is domain reputation dropping?
2. Check bounce and complaint rate — did these spike before the open rate dropped?
3. Check list composition — did inactive subscribers accumulate without suppression?
4. Check Apple Mail Privacy Protection impact — open rate ≠ engagement for iOS users

Produce: ranked list of likely causes and how to test each hypothesis.
```

### "An automation flow is underperforming"

```
/email-sequence

Audit underperforming flow: [flow name]

Current stats:
- Email 1: [subject] — open [X%] / click [X%] / unsub [X%]
- Email 2: [subject] — open [X%] / click [X%]
- Email 3: [subject] — open [X%] / click [X%]
- Conversion from flow entry to goal: [X%]

Target conversion: [what you expected]
Segment entering this flow: [who and what triggered enrollment]

Diagnose:
1. Where is the biggest drop-off? (between which emails?)
2. What's the open rate on Email 1? (if < 30%, subject line is the problem)
3. What's the CTOR on each email? (if open is OK but click is low, body/CTA is the problem)
4. Is the flow goal clearly achievable from the email content?

Recommend: one change per email, starting with the weakest link.
Write the rewrite for the lowest-performing email.
```

---

## Key benchmarks

| Metric | Healthy | Needs work | Alert |
|---|---|---|---|
| Open rate | > 25% | 15-25% | < 15% |
| Click rate | > 2% | 1-2% | < 1% |
| CTOR (click-to-open) | > 10% | 6-10% | < 6% |
| Unsubscribe rate/campaign | < 0.2% | 0.2-0.5% | > 0.5% |
| Spam complaint rate | < 0.05% | 0.05-0.1% | > 0.1% |
| Hard bounce rate | < 0.5% | 0.5-1% | > 1% |
| Welcome series open rate | > 50% | 35-50% | < 35% |
| A/B test win rate | 30-50% | — | < 20% (hypotheses too conservative) |

---
