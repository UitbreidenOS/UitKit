---
name: response-classifier
description: Classifies an inbound prospect reply by intent: interested / objection / not-now / OOO / referral / unsubscribe / spam. Returns intent label, confidence score (0–100), recommended next action, and a draft response if appropriate. Always surfaces the draft for human approval before sending.
allowed-tools: Read
effort: low
---

# Response Classifier

## When to activate
When a prospect replies to any outreach — cold email, follow-up, or LinkedIn message. Use this before deciding on next action to ensure the response is handled correctly and logged accurately.

## When NOT to use
Do not use for internal emails or replies from colleagues. Do not auto-send the draft response — always return for human approval first.

## Instructions

1. Read the original outreach and the prospect's reply.
2. Classify the intent using these categories:
   - **interested:** Positive signal — wants to learn more, asking questions, suggesting a time
   - **soft_yes:** Positive but vague — "sounds interesting," "let's connect soon"
   - **objection:** Specific pushback — price, timing, competitor, no budget, no need
   - **not_now:** Timing objection — "reach me in Q3," "we just signed a contract"
   - **ooo:** Out of office auto-reply
   - **referral:** Redirecting to another person
   - **unsubscribe:** Explicit opt-out request
   - **spam:** Auto-spam filter or unrelated bounce
3. Assign a confidence score (0–100).
4. Recommend the next action based on intent.
5. Draft a response if intent is: interested, soft_yes, objection, not_now, referral.
6. For unsubscribe: flag for CRM opt-out — do not draft a response.

## Output Format

```
REPLY CLASSIFICATION
Prospect: [Name, Company]
Intent: [category]
Confidence: [0–100]

Recommended Action: [book meeting / send case study / acknowledge timing / update referral / mark opt-out / no action]

Draft Response: [PENDING HUMAN APPROVAL]
[draft if applicable]

CRM Update: [what to log]
```

## Example

**Reply:** "Hey — this is actually pretty timely. We just started evaluating tools in this space. Can you send me a quick overview and we can find 20 minutes?"

```
REPLY CLASSIFICATION
Prospect: Alex Kim, CTO, Stackline
Intent: interested
Confidence: 95

Recommended Action: Book meeting — prospect is actively evaluating, high urgency.

Draft Response: [PENDING HUMAN APPROVAL]
Alex — glad the timing works. I'll send a one-pager and a calendar link.

[Overview link]
[Calendly or equivalent]

Looking forward to it.

CRM Update: Mark status → REPLIED (interested). Update lifecycle → SQL. Log: "Actively evaluating tools, requested overview + meeting."
```

---
