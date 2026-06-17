---
name: objection-handler
description: Generates a tailored objection response for the four most common SDR objections: price, timing, competitor lock-in, and no-perceived-need. Uses prospect context from the research brief. Under 80 words. Returns draft for human approval before sending.
allowed-tools: Read, Write
effort: medium
---

# Objection Handler

## When to activate
When response-classifier returns intent: objection. Pass the classified reply and the original research brief to generate a context-aware response.

## When NOT to use
Do not use for unsubscribe or hard-no replies — those should be logged and the sequence stopped. Do not use generic templates — every response must reference something specific to this prospect.

## Instructions

1. Read the classified objection reply and the account research brief.
2. Identify the objection category:
   - **Price:** "Too expensive," "not in budget," "cost is a concern"
   - **Timing:** "Bad time," "ask me in Q3," "just signed with someone else"
   - **Competitor:** "We use [X]," "locked into a contract," "happy with our current tool"
   - **No need:** "We handle this in-house," "not a priority," "already solved"
3. Apply the handling framework for the identified category:
   - **Price:** Reframe ROI — connect to a specific metric for their company stage/role. Offer a pilot or phased start.
   - **Timing:** Acknowledge and plant a seed — agree with the timing, ask for the right time, offer something useful now (resource).
   - **Competitor:** Validate their choice — ask what's working and where the gaps are. Don't knock the competitor.
   - **No need:** Curiosity question — ask how they're currently solving it and what the measurement looks like.
4. Write the response: acknowledge the objection first, then pivot. Under 80 words.
5. Return as PENDING APPROVAL.

## Output Format

```
OBJECTION RESPONSE — [Prospect Name]
Objection type: [price / timing / competitor / no-need]
Status: PENDING APPROVAL

---
[Response body — under 80 words]
---

Banned word check: PASS/FAIL
```

## Example

**Objection:** "We're locked into a Salesloft contract for another 8 months."

```
OBJECTION RESPONSE — Alex Kim, CTO, Stackline
Objection type: competitor
Status: PENDING APPROVAL

---
Totally fair — no point switching mid-contract.

One question before I close the loop: when you think about developer onboarding specifically (not the full sequence tool), is that working well in your current setup, or is it still a manual lift?

Happy to revisit in Q1 if there's a fit — or not if there isn't.
---

Banned word check: PASS
```

---
