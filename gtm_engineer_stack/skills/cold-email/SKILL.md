---
name: cold-email-sequencer
description: Writes a 5-touch cold email sequence for a qualified prospect. Each touch references a specific trigger, follows subject line and word count rules, ends with a low-friction question CTA. Always returns draft for human review — never sends.
allowed-tools: Read, Write
effort: medium
---

# Cold Email Sequencer

## When to activate

After ICP qualifier passes and account brief exists. The prospect has been validated against your ideal customer profile, and you have specific trigger research (funding round, product launch, hiring spree, regulatory change, personnel move, technology stack change). Activation requires a documented account brief with company context, decision-maker details, and the specific trigger angle.

## When NOT to use

Not for inbound follow-up — use this only for outbound cold sequences. Not for nurture sequences targeting warm leads already in your database. Not for multi-threaded outreach (this handles single decision-maker sequences). Not without an account brief containing company research, role/title confirmation, and trigger validation. Not for list-and-blast — this is account-specific and high-touch by design.

## Sequence Structure

**Touch 1 (within 24h of research):** Trigger angle — lead with the research hook, acknowledge the trigger event, ask a trigger-specific discovery question.

**Touch 2 (Day 3):** Value prop — shift to your specific value, reference their situation, no hard sell, offer insight or resource.

**Touch 3 (Day 7):** Social proof — include a relevant case study, customer quote, or result (similar company, same trigger), ask permission to brief.

**Touch 4 (Day 14):** Angle shift — introduce a different value dimension or use case, reference prior touches lightly, breakup language optional.

**Touch 5 (Day 21):** Breakup — final attempt, lowest friction ask, clear intent to remove from sequence, offer alternative (content, intro, etc.).

## Subject Line Rules

Max 8 words. Reference the specific trigger (not generic "quick question"). No question marks. No ALL CAPS. No "Quick question," "Checking in," or "Following up" phrases. Avoid exclamation marks. Lead with the insight or trigger, not the company name.

**Good examples:**
- Your Series A likely needs sales ops (8 words, trigger-specific)
- Freshworks integration with [Company]: faster onboarding (8 words, technical trigger)
- [Industry] teams scaling remote hiring (6 words, trend-specific)

**Bad examples:**
- Quick question about sales? (question mark, generic)
- ACME FUNDING ROUND (all caps, no context)
- Following up on my last email (generic filler, 6 words but no hook)

## Email Body Rules

Max 120 words total. First sentence must not start with "I" or "My name is" — start with a fact, trigger, or question about *them*. Trigger must appear in sentence 1–2 (not buried). Include exactly one value prop sentence describing what you do or offer. CTA is always a question, never "let me know" or "reach out." Keep sentence length 10–15 words for readability.

**Structure:**
1. Trigger/research sentence (fact-driven, about them)
2. Additional context or relevance (optional, if trigger needs framing)
3. Value prop sentence (one sentence only)
4. Proof point or resource (optional, max one)
5. Question CTA (specific day/time, low-friction)

## CTA Rules

Always a question — yes/no or soft commitment. Offer a specific day or time range (not "sometime next week"). Low-friction examples: "Worth a 20-min call Thursday?", "Can I grab 15 minutes Tuesday?", "Would a brief walkthrough help?", "Interested in a quick overview?". High-friction to avoid: "Let me know if you're interested," "Are you open to a partnership?", "Can we set up a meeting?" (too vague/formal).

## Output Format

Return all 5 touches in order. For each touch, display:

```
**Touch [N] (Day [X])**

Subject: [subject line]

Body:
[email body text]
```

Include touch number, day offset, subject line, and body. Separate touches with a blank line for readability. Include a final note recommending review before sending and any personalization gaps to address.

## Example

**Touch 1 (Day 0)**

Subject: Replicating Figma's onboarding for your API docs

Body:
Saw your Series A close on June 1st — congrats. One pattern we've noticed with post-Series A teams is that documentation becomes a bottleneck faster than engineering. Figma solved this by automating reference doc updates whenever their API changed. Notion did the same. Does your API team face that friction right now, or is your docs system keeping pace?

**Touch 2 (Day 3)**

Subject: API docs that scale with your product

Body:
Your Series A signals you're likely shipping faster. Most engineering teams automate CI/CD but keep docs manual — creating a support bottleneck. We work with teams like Airtable and Twilio to keep API docs in sync with releases using a single source of truth. Cuts doc debt by 60% in the first quarter. Thought it might be relevant.

**Touch 3 (Day 7)**

Subject: How Twilio solved their API doc scaling

Body:
Twilio faced the same issue post-Series B: shipping new endpoints faster than docs could keep up, leading to inbound support spike. They automated doc generation from their SDK. Result: 40% fewer "where's the docs?" support tickets within 90 days. Case study attached. Worth 15 minutes to see how it works for companies like yours?

**Touch 4 (Day 14)**

Subject: Fixing hidden API adoption leaks

Body:
Here's something we rarely see pitched: poor API documentation is invisible to product teams until it tanks adoption metrics. We've seen it delay NDR by 15-20% post-launch. Our customers catch it in their first month of using us. Could run a quick audit of your current docs setup if you're curious.

**Touch 5 (Day 21)**

Subject: One more thought on API scalability

Body:
Last one — I've noticed great teams either nail docs automation early or it becomes painful debt after Series B. I've pulled together a short guide on scaling documentation for high-velocity teams that might be useful even if now isn't the right time. Curious if it's worth a read?

---

**Note:** All examples are fictional. Before sending, personalize with specific details from your account brief (actual funding date, known decision-maker, verified pain point). Review subject lines for tone fit with your brand voice. Ensure your value prop directly addresses the trigger, not a generic pitch. Remove this sequence from rotation if the prospect responds — shift to an inbound sequence instead.

---
