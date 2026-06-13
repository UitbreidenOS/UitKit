---
name: reply-classification
updated: 2026-06-13
---

# Reply Classification

## When to activate

You receive a prospect reply to an outbound email, message, or call attempt. You need to classify the reply, draft an immediate response, and route it to the correct action within your sales workflow. This applies to SDR workflows, founder outreach, and any B2B engagement where response type determines follow-up cadence and tactic.

## When NOT to use

- Do not use this for inbound leads with pre-established interest — they skip to sales call routing.
- Do not use for warm intros where the introducer has already pre-qualified — route directly to WARM or HOT.
- Do not use for automated replies, out-of-office messages, or bounce-backs — flag these as system noise.
- Do not use for replies longer than 10 minutes old without re-reading the current context — prospect intent can shift.

## Instructions

### Six-Category Classification System

#### Category 1: HOT
**Definition:** Explicit interest + ask for meeting, call, pricing, or demo. No ambiguity.

**Indicators:**
- "When can we hop on a call?"
- "Send me a demo link."
- "What's your pricing?"
- "I'm interested; let's set something up."
- "Can we talk Monday?"

**Response SLA:** < 1 hour (ideally within 15 minutes).

**CRM Tags:** `hot`, `demo_requested`, `meeting_booked` (or `calendar_pending`).

**Action Template:**
```
[Opening] Thank you — excited to chat.

[Next Step] I've blocked [specific time, e.g., "Tuesday 2 PM ET"] — does that work?
Alternatively, [give 2-3 other options, all within 48 hours].

[Credibility] While we wait, [insert 1 relevant case study or metric].

[Signature] Looking forward.
```

**Example Response to HOT:**
```
Prospect: "This looks interesting. Can we schedule a call this week?"

Your response:
Hi [Name],

Excellent. I've got Tuesday 10 AM and Thursday 2 PM ET — both work for me. Which suits you?

In the meantime, I attached a brief case study of [similar company in their industry] 
who saw a 40% improvement in [their core metric] in the first 90 days.

Looking forward.

[Link to calendar with 3 slots + attach one-pager]
```

---

#### Category 2: WARM
**Definition:** Interested but has a constraint — timing, budget cycle, competing priority, or scope question.

**Indicators:**
- "This could work for us next quarter."
- "We're exploring this, but our budget freezes until Q3."
- "Interesting, but we're prioritising X right now."
- "I like it — need to check with my team first."
- "This looks good. Can you follow up in a month?"

**Response SLA:** Same day (within 4-6 hours).

**CRM Tags:** `warm`, `follow_up_scheduled`, `constraint_identified` (tag the specific constraint: `budget_cycle`, `timing`, `alignment_needed`, `stakeholder_involved`).

**Action Template:**
```
[Acknowledge] I hear you — [repeats back the constraint honestly].

[Reframe] That timing actually works in our favor because [explain why the constraint is solvable or temporary].

[Specific Commitment] Let's lock in [specific date — e.g., "August 15th"] so this stays on your radar.
I'll send you [specific value: 1 relevant guide, benchmark, or checklist] in the meantime.

[Tactical] Question: When you revisit this in [their timeframe], what will be the top priority to validate?
[This answer helps you pre-position your message.]

[CRM Task] I've noted this in our system — you'll hear from me on [date].
```

**Example Response to WARM:**
```
Prospect: "This is interesting, but we're locked in on other priorities until Q3. 
Maybe circle back then?"

Your response:
Hi [Name],

Got it — Q3 is perfect. Q2 is actually when most teams start evaluating tools for 
Q3/Q4 implementation, so we're in a good spot to prepare.

Let's lock in August 15th for a conversation. In the meantime, I'll send you our 
"[Industry]-Ready Checklist" — 3 questions to validate whether [your solution] 
is the right fit for your stack.

Quick question: When you revisit this in August, will you be evaluating 
[core use case] or [alternative use case]? Helps me tailor what we discuss.

I've set a reminder for August 10th. Talk soon.

[Checklist PDF]
```

---

#### Category 3: NEUTRAL
**Definition:** Polite but non-committal. No constraint, no objection — just lukewarm interest.

**Indicators:**
- "Interesting, I'll keep it in mind."
- "Thanks for reaching out — looks useful."
- "Not a priority right now, but thanks."
- "I'll take a look."
- [No response after 3 days of initial outreach — treat as NEUTRAL on second touch.]

**Response SLA:** 24–48 hours.

**CRM Tags:** `neutral`, `one_follow_up_sent`, `interest_level_low`, `deprioritise_after_followup`.

**Action Strategy:**
- Send exactly ONE follow-up with a highly specific question designed to uncover hidden objection or hidden need.
- If the question gets a dismissal or silence, deprioritise immediately.
- Do not loop NEUTRAL prospects more than once — it wastes pipeline velocity.

**Action Template:**
```
[Personalization] I noticed you [specific action — e.g., "visited our pricing page" / "opened my last email"].

[Specific Question] Quick question: When you think about [their core problem], 
is [specific friction point] something your team wrestles with today?

[Low-Pressure Close] If it's not top of mind, no worries — I'm here if that changes.
Reply with a single word if you'd like to stay connected.
```

**Example Response to NEUTRAL:**
```
Prospect (initial reply): "Thanks for reaching out. Looks interesting — I'll take a look."

Your follow-up (1 day later):
Hi [Name],

Quick question: I noticed you work in [department]. When your team manages [core process], 
how are you currently handling [specific bottleneck you know they face]?

Curious if that's a friction point for you. If not, totally understand — I'll check back 
in 6 months if things change.

[Single question only — no pitch]
```

---

#### Category 4: OBJECTION
**Definition:** Specific, stated pushback — price too high, competitor preference, timing misaligned, or stated need gap.

**Indicators:**
- "We already use [competitor]."
- "Your pricing is too high for our budget."
- "We're not ready for this yet."
- "Why would we need this when we have [internal solution]?"
- "I don't think this solves [specific problem we have]."

**Response SLA:** Same day (within 2 hours is ideal — shows you take objections seriously).

**CRM Tags:** `objection`, `objection_type:[price|timing|competitor|feature_gap|internal_solution]`.

**Core Principle:** NEVER argue or defend. Acknowledge, reframe with social proof or logic, redirect with a question that moves toward insight.

**Action Template:**
```
[Acknowledgment — mirror back their exact concern]
"I hear you — [repeat objection in their words]. That makes sense."

[Reframe — offer a new lens or data point, NOT a counter-argument]
"Here's what I've found: [similar companies / data point / customer insight that addresses their concern]."

[Question — redirect toward a new angle or depth]
"Question: [ask something that reveals whether the objection is real or a delay tactic]?"

[Next Step — conditional, based on what they need to move forward]
"If we could [address their objection], would that change things?"
```

**Objection-Specific Prompts:**

**Price Objection:**
```
I get that — budget is tight. Here's what I've seen with [similar-size company]:
they started with [1 specific use case] for [X cost] instead of full rollout.
Saw [specific ROI] in 60 days, then expanded.

Would a phased approach make sense for you?
```

**Competitor Objection:**
```
[Competitor] is solid — we see them in [X% of similar companies].
Here's where we differ: [one specific, provable difference — not features, but outcomes].

Have you [specific thing competitor doesn't address]?
```

**Timing Objection:**
```
Timing is important. Most teams who delay 6+ months end up needing this sooner than expected.
Question: What would need to happen in the next 30 days for this to jump up your list?
```

**Feature Gap Objection:**
```
That's a good point — [acknowledge gap]. Here's what we're hearing from similar teams:
[explain how outcome is achieved despite the gap, OR explain roadmap].

Is that specific gap a blocker, or is there a workaround that fits your workflow?
```

**Example Response to OBJECTION:**
```
Prospect: "Your pricing is way higher than [competitor]. We can't justify that spend right now."

Your response:
Hi [Name],

I hear you — pricing is a real constraint. I'll be direct: we're not the cheapest. 
Here's why teams choose us anyway: [median customer] recouped their annual cost 
in implementation savings within 90 days.

I know [competitor] costs less upfront. They're good. Different trade-off though — 
they require 2-3x more manual setup and ongoing tuning.

Quick question: How much time does your team currently spend on [manual process 
that our product automates]? If we could recover even a slice of that time, 
would the ROI math work?

Happy to explore options if you want to dig in.
```

---

#### Category 5: REJECTION
**Definition:** Hard no, explicit disinterest, or stated irrelevance to their business.

**Indicators:**
- "Not interested."
- "We don't need this."
- "Please remove me from your list."
- "Wrong timing — never for us."
- "This doesn't apply to our business."

**Response SLA:** Within 1 hour (respect their time and boundary).

**CRM Tags:** `rejected`, `retirement_date:[6 months from today]`, `do_not_contact_until:[date]`.

**Core Principle:** Thank, respect the boundary, do NOT try to convince. Set an auto-retirement date in CRM (6 months). Archive the thread.

**Action Template:**
```
[Respect] No problem at all — I appreciate you letting me know.

[Closing] If anything changes in the future, you know where to find me.

[Sign-off] Best of luck with [their core business].
```

**Example Response to REJECTION:**
```
Prospect: "Not interested. Please stop reaching out."

Your response:
Hi [Name],

Completely understood. I'll retire you from my list — no more emails from me.

If your situation changes down the road, feel free to reach out anytime.

Best of luck with [their stated focus area].
```

**CRM Action:** Set task: `Reactivate [Name] on [date 6 months from now]` with note: "Check if company has grown or priorities shifted."

---

#### Category 6: NOT ICP
**Definition:** Wrong person, wrong company stage, wrong industry, or explicit "not relevant to us."

**Indicators:**
- "I'm not the right person — talk to [Name in different department]."
- "We're a [stage] company — this is for [other stage]."
- "Our industry doesn't really [use this type of solution]."
- "We outsource this function — talk to our [vendor/partner]."

**Response SLA:** Within 4 hours (use their referral momentum).

**CRM Tags:** `not_icp`, `referred_to:[new contact name + title]`, `referral_source:[original prospect name]`.

**Core Principle:** Treat the referral as a gift. Ask permission, get the right email, personalize the outreach with the referral context.

**Action Template:**
```
[Gratitude] Thanks so much for pointing me to [right person].

[Permission] Can I mention that you suggested them, or would you prefer I don't?

[Connection Request] Would it be weird if I reached out to them directly, or would you rather introduce?

[Fallback] If direct is better, mind forwarding me their email?
```

**Example Response to NOT ICP:**
```
Prospect: "I handle budget, but this is really an operations question. Talk to Sarah Chen — she's our VP Ops."

Your response:
Hi [Name],

Thanks so much for that — Sarah's exactly who I need to talk to.

Can I mention you suggested her, or would you prefer I don't reference our conversation?

If you're open to it, I could draft a message and you could forward it — 
or I can reach out cold mentioning your name. Either way works for me.

Appreciate the direction.
```

**Immediate CRM Action:**
```
1. Create new prospect record: Sarah Chen, VP Ops, [Company], with note "Referred by [original prospect]"
2. Tag original prospect: `referral_sent_to:[new prospect], date:[today]`
3. Personalize first outreach: "Hi Sarah, [Original Prospect] suggested I connect with you about..."
```

---

### Classification Prompt (To Use with Claude)

```
You are a B2B sales response classifier. A prospect has replied to an outbound message. 
Classify their reply into exactly one of these six categories, draft a response, and 
identify CRM actions.

Prospect Reply:
---
[INSERT PROSPECT REPLY HERE]
---

Classification Task:
1. Determine the single best category: HOT, WARM, NEUTRAL, OBJECTION, REJECTION, NOT ICP
2. List 2–3 specific indicators that support this classification
3. Identify the response SLA (time to reply)
4. Draft a response using the approved template for that category
5. Specify CRM tags and any scheduled follow-up tasks

Output format:
**Classification:** [CATEGORY]
**Indicators:** [list 2-3 specific phrases/signals from their reply]
**SLA:** [time window]
**CRM Tags:** [tags to apply]
**Response Draft:**
[Your full drafted response, ready to send — no edits needed]
**CRM Actions:**
- [Action 1]
- [Action 2]

Remember: Never argue with objections. Always ask a clarifying question for NEUTRAL replies. 
Always request referral info for NOT ICP. Always respect REJECTION boundaries.
```

---

### Decision Tree (Quick Reference)

```
Prospect replied. Ask in order:

1. Do they ask for a meeting, call, demo, or pricing?
   → YES: HOT (< 1 hour response)
   → NO: Next question

2. Do they express interest but mention a timing, budget, or priority constraint?
   → YES: WARM (same-day response, lock specific date)
   → NO: Next question

3. Is their reply polite but uncommitted, with no stated constraint or objection?
   → YES: NEUTRAL (one follow-up with specific question only)
   → NO: Next question

4. Do they state a specific objection (price, competitor, need, timing)?
   → YES: OBJECTION (acknowledge, reframe, redirect with question)
   → NO: Next question

5. Do they explicitly say "no," "not interested," or "remove me"?
   → YES: REJECTION (thank, respect boundary, retire 6 months)
   → NO: Final question

6. Are they the wrong contact, wrong company stage, or explicitly out of scope?
   → YES: NOT ICP (ask for referral, thank, escalate via referrer)
   → NO: Re-read the original reply — you may have misclassified.
```

---

### SLA and CRM Workflow Summary

| Category | Response SLA | CRM Tag | Next CRM Action | Follow-up Trigger |
|----------|--------------|---------|-----------------|------------------|
| **HOT** | < 1 hour | `hot` | Create calendar link + send confirmation | Calendar confirmation or cancellation |
| **WARM** | Same day (4–6 hrs) | `warm` + constraint type | Set task: follow-up on specific date | Target follow-up date or silence after 3 days |
| **NEUTRAL** | 24–48 hours | `neutral`, `one_follow_up_sent` | ONE follow-up only; if no response, deprioritise | 7 days silence = close loop, mark `deprioritised` |
| **OBJECTION** | Same day (< 2 hrs) | `objection` + type | Set task: follow-up after response | Prospect replies again or 5 days silence = NEUTRAL |
| **REJECTION** | Within 1 hour | `rejected`, `retire_date:[6mo]` | Set reminder to reactivate in 6 months | Reactivation date only |
| **NOT ICP** | Within 4 hours | `not_icp`, `referred_to:[name]` | Reach out to referred contact; tag source | Referral outreach sent |

---

### Pitfall Alerts

**Misclassifying WARM as HOT:**
Prospect says: "Looks good — let's talk next quarter."
Wrong: Treat as HOT because they said "let's talk."
Right: This is WARM. They have a timing constraint. Lock the specific date (Q3), send value content in interim.

**Arguing with OBJECTION:**
Wrong: "Actually, our pricing is fair because..."
Right: "I hear you — price is a constraint. Here's what other teams have found..."

**Looping NEUTRAL endlessly:**
Wrong: Send 3–4 follow-ups to a "I'll keep it in mind" prospect.
Right: One follow-up with a probing question. Silence after that = close, move on.

**Forgetting to ask for referral in NOT ICP:**
Wrong: "Thanks for the context — best of luck."
Right: "Can you introduce me to [person they named]? How should I reach out?"

**Respecting REJECTION but checking 2 weeks later:**
Wrong: You set a 6-month retirement, but after 2 weeks you message: "Just checking in..."
Right: Truly retire them. Set calendar reminder for 6 months. Do not revisit.

---

## Example

### Scenario 1: HOT Classification

**Prospect Reply:**
```
Hey [Your Name],

This is exactly what we need. Our team has been looking for a solution like this 
for months. When can we schedule a demo? We're free Thursday or Friday this week.

Thanks,
[Prospect Name]
```

**Classification Output:**

**Classification:** HOT

**Indicators:**
- "exactly what we need" (explicit validation)
- "looking for a solution like this for months" (stated pain + validation)
- "When can we schedule a demo?" (explicit ask for meeting)

**SLA:** < 1 hour (aim for 15 minutes)

**CRM Tags:** `hot`, `demo_requested`, `meeting_pending`

**Response Draft:**
```
Hi [Prospect Name],

Excellent — I'm excited about this fit too.

I've blocked Thursday 2 PM ET and Friday 10 AM ET. Which works better for you?

I'll send over a brief overview of your use case before our call. Also attaching 
a case study from [similar company in their industry] — they implemented in Q1 
and cut their [core metric they care about] by 30% in the first quarter.

Looking forward to connecting.

[Link to 15-min calendar picker with both time slots]
[One-page product overview + 1 relevant case study PDF]
```

**CRM Actions:**
- Create calendar block for Thursday 2 PM and Friday 10 AM
- Tag prospect: `hot`, `demo_requested`
- If confirmed: create task "Send pre-call brief + case study" with 2-hour deadline
- Escalate to sales manager for visibility (if this is your process)

---

### Scenario 2: WARM Classification

**Prospect Reply:**
```
Thanks for reaching out. This is definitely on our roadmap, but we won't have 
budget approved until Q3. The timing isn't great right now, but I like what you're doing.

Let me know how to stay in the loop for later.

[Prospect Name]
```

**Classification Output:**

**Classification:** WARM

**Indicators:**
- "definitely on our roadmap" (validated need)
- "won't have budget approved until Q3" (specific constraint + future intent)
- "I like what you're doing" (genuine interest, not polite dismissal)

**SLA:** Same day (within 6 hours)

**CRM Tags:** `warm`, `follow_up_scheduled`, `constraint_identified:budget_cycle`, `budget_approval_Q3`

**Response Draft:**
```
Hi [Prospect Name],

Perfect — Q3 is actually ideal timing. Most teams evaluate vendors in Q2 for Q3 
implementation, so you're ahead of the curve.

I've locked August 15th on my calendar to reconnect. In the meantime, I'll send 
you our "Vendor Evaluation Checklist" — three questions to validate fit before 
your budget review kicks off.

Quick question: When you revisit this in Q3, will you be looking to solve 
[core use case] or [alternative use case]? Helps me make sure we're positioned 
on what matters most to you.

Looking forward to connecting in Q3.

[Checklist PDF]
```

**CRM Actions:**
- Create task: "Follow up with [Prospect Name] on August 15th"
- Tag: `warm`, `follow_up_scheduled`, `budget_cycle_Q3`
- Set reminder: "Send value content (checklist, guide, benchmark) within 24 hours"
- Note in thread: "Constraint: Budget not approved until Q3. No objection to product."

---

### Scenario 3: OBJECTION Classification

**Prospect Reply:**
```
Appreciate you reaching out. We already have [competitor name] in place, 
and switching costs would be too high right now. It's a good product, 
but I don't see a reason to move.

[Prospect Name]
```

**Classification Output:**

**Classification:** OBJECTION

**Indicators:**
- "already have [competitor] in place" (stated competitive alternative)
- "switching costs would be too high" (specific, quantified concern)
- "don't see a reason to move" (need validation, not rejection)

**SLA:** Same day (< 2 hours)

**CRM Tags:** `objection`, `objection_type:competitor`, `incumbent:[competitor name]`

**Response Draft:**
```
Hi [Prospect Name],

[Competitor] is solid — we see them in about 40% of the companies we talk to. 
No argument there.

Here's where we differ: We're built for [specific outcome competitor doesn't prioritize], 
which usually means [concrete benefit]. Most teams we've worked with had [competitor] 
running in parallel at first, then gradually moved workflows over.

Question: Does your team currently handle [specific process that's painful with competitor]? 
If it's not a pain point, then yeah, stick with what you have. But if it is, 
we've got a 30-day trial that's zero-risk.

Worth a quick conversation? Or should I check back in 6 months?
```

**CRM Actions:**
- Tag: `objection`, `objection_type:competitor`, `incumbent:[competitor name]`
- Set task: "Follow up if they don't respond in 5 days" (they may be reconsidering)
- Note: "Switching cost concern is real — lead with migration support in next message if they engage"

---

### Scenario 4: NEUTRAL Classification

**Prospect Reply:**
```
Thanks for reaching out. Looks interesting. I'll take a look and get back to you 
if I think it's a fit.

[Prospect Name]
```

**Classification Output:**

**Classification:** NEUTRAL

**Indicators:**
- "Looks interesting" (polite, non-committal)
- "I'll take a look" (no timeline, no urgency)
- No stated constraint, no objection, no ask

**SLA:** 24–48 hours

**CRM Tags:** `neutral`, `one_follow_up_scheduled`

**Response Draft (send 1 day later):**
```
Hi [Prospect Name],

Quick question: When your team handles [their core process], is [specific friction 
point relevant to your solution] something that slows you down?

Curious if it's on your radar. If not, no worries — I'll check back in 6 months 
if things change.

One word back and I'll stay connected.
```

**CRM Actions:**
- Tag: `neutral`
- Set one follow-up only (scheduled 1 day from now)
- If no response 7 days after follow-up: tag `deprioritised`, close loop
- Do NOT loop more than once

---

This skill system ensures every reply is handled with precision, every prospect knows what to expect, and no energy is wasted on replies that won't convert. Use the decision tree above as your quick reference in real-time outreach.
